import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { BottomNav } from './components/BottomNav.js';
import { HomeView } from './views/HomeView.js';
import { CollectionsView } from './views/CollectionsView.js';
import { DetailView } from './views/DetailView.js';
import { PlayerView } from './views/PlayerView.js';
import { SearchView } from './views/SearchView.js';
import { MyListModal } from './components/MyListModal.js';
import { PWAInstallPrompt } from './components/PWAInstallPrompt.js';
import {
  fetchHome,
  fetchCollections,
  fetchMovies,
  fetchGenreMovies,
  fetchSearchResults,
  fetchMovieDetails,
  fetchEpisodeStream
} from './services/api.js';
import { Drama, Genre, ViewMode, SortOption, MovieDetail, StreamInfo } from './types/index.js';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<ViewMode>('home');
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string>('semua');
  const [selectedSort, setSelectedSort] = useState<SortOption>('populer');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data states
  const [homeDramas, setHomeDramas] = useState<Drama[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [collectionsDramas, setCollectionsDramas] = useState<Drama[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(false);

  // Detail view state
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // Player view state
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>(1);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Drama[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Bookmarks / My List state (Persisted in localStorage)
  const [bookmarkedDramas, setBookmarkedDramas] = useState<Drama[]>(() => {
    try {
      const saved = localStorage.getItem('dracinteros_my_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [myListOpen, setMyListOpen] = useState<boolean>(false);

  const bookmarkedIds = new Set(bookmarkedDramas.map((d) => d.id));

  // Update URL helper function
  const syncUrl = useCallback((
    view: ViewMode,
    params?: {
      q?: string;
      genre?: string;
      sort?: string;
      page?: number;
      slug?: string;
      playUrl?: string;
      ep?: number;
    },
    replace = false
  ) => {
    let targetPath = '/';
    const searchParams = new URLSearchParams();

    if (view === 'search') {
      const q = params?.q?.trim();
      targetPath = q ? `/search/${encodeURIComponent(q)}` : '/search';
    } else if (view === 'collections') {
      const genre = params?.genre && params.genre !== 'semua' ? params.genre : '';
      targetPath = genre ? `/koleksi/${encodeURIComponent(genre)}` : '/koleksi';
      if (params?.sort && params.sort !== 'populer') searchParams.set('sort', params.sort);
      if (params?.page && params.page > 1) searchParams.set('page', params.page.toString());
    } else if (view === 'detail') {
      const rawSlug = params?.slug || '';
      const cleanSlug = rawSlug.replace(/^\/(drama|detail|play)\//, '').replace(/\/\d+$/, '');
      targetPath = cleanSlug ? `/drama/${cleanSlug}` : '/drama';
    } else if (view === 'player') {
      const ep = params?.ep || 1;
      let dramaId = params?.playUrl || params?.slug || '';
      dramaId = dramaId.replace(/^\/(play|watch|drama)\//, '').replace(/\/\d+$/, '');
      targetPath = dramaId ? `/watch/${dramaId}/${ep}` : `/watch/ep/${ep}`;
    }

    const queryString = searchParams.toString();
    const fullUrl = targetPath + (queryString ? `?${queryString}` : '');

    if (window.location.pathname + window.location.search !== fullUrl) {
      if (replace) {
        window.history.replaceState({ view }, '', fullUrl);
      } else {
        window.history.pushState({ view }, '', fullUrl);
      }
    }
  }, []);

  // Parse location and restore view state
  const parseLocation = useCallback(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (path.startsWith('/search') || path.startsWith('/pencarian')) {
      const queryFromPath = path.replace(/^\/(search|pencarian)\/?/, '');
      const query = queryFromPath ? decodeURIComponent(queryFromPath) : (searchParams.get('q') || '');
      setActiveView('search');
      setSearchQuery(query);
    } else if (path.startsWith('/koleksi') || path.startsWith('/collections')) {
      const genreFromPath = path.replace(/^\/(koleksi|collections)\/?/, '');
      const genre = genreFromPath ? decodeURIComponent(genreFromPath) : (searchParams.get('genre') || 'semua');
      const sort = (searchParams.get('sort') as SortOption) || 'populer';
      const page = parseInt(searchParams.get('page') || '1', 10);
      setActiveView('collections');
      setSelectedGenreSlug(genre);
      setSelectedSort(sort);
      setCurrentPage(page);
    } else if (path.startsWith('/drama') || path.startsWith('/detail')) {
      const slug = decodeURIComponent(path.replace(/^\/(drama|detail)\/?/, '')) || searchParams.get('slug') || searchParams.get('url') || '';
      setActiveView('detail');
      if (slug && (!movieDetail || movieDetail.slug !== slug)) {
        setIsLoadingDetail(true);
        fetchMovieDetails(slug)
          .then((details) => setMovieDetail(details))
          .catch((err) => console.error('Failed to load deep linked detail:', err))
          .finally(() => setIsLoadingDetail(false));
      }
    } else if (path.startsWith('/watch') || path.startsWith('/play')) {
      const cleanPath = path.replace(/^\/(watch|play)\/?/, '');
      const parts = cleanPath.split('/').filter(Boolean);
      const dramaId = parts[0] || searchParams.get('url') || '';
      const ep = parts[1] ? parseInt(parts[1], 10) : parseInt(searchParams.get('ep') || '1', 10);

      setActiveView('player');
      setCurrentEpisodeNumber(ep);

      const playUrl = dramaId.startsWith('/') ? dramaId : `/play/${dramaId}/${ep}`;
      if (playUrl) {
        setIsLoadingPlayer(true);
        fetchEpisodeStream(playUrl)
          .then((stream) => setStreamInfo(stream))
          .catch((err) => console.error('Failed to load deep linked stream:', err))
          .finally(() => setIsLoadingPlayer(false));
      }
    } else {
      setActiveView('home');
    }
  }, [movieDetail, streamInfo, currentEpisodeNumber]);

  // Handle Browser Back / Forward buttons
  useEffect(() => {
    parseLocation();
    const handlePopState = () => {
      parseLocation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize Home Data
  useEffect(() => {
    async function loadInitial() {
      try {
        const homeData = await fetchHome();
        setHomeDramas(homeData.dramas || []);
        if (homeData.genres && homeData.genres.length > 0) {
          setGenres(homeData.genres);
        } else {
          const colGenres = await fetchCollections();
          setGenres(colGenres);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    }
    loadInitial();
  }, []);

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dracinteros_my_list', JSON.stringify(bookmarkedDramas));
    } catch (e) {
      console.error('Failed to save my list:', e);
    }
  }, [bookmarkedDramas]);

  // Handle Search Input Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await fetchSearchResults(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL whenever key state variables change
  useEffect(() => {
    if (activeView === 'home') {
      syncUrl('home');
    } else if (activeView === 'search') {
      syncUrl('search', { q: searchQuery }, true);
    } else if (activeView === 'collections') {
      syncUrl('collections', { genre: selectedGenreSlug, sort: selectedSort, page: currentPage });
    } else if (activeView === 'detail' && (movieDetail || selectedDrama)) {
      syncUrl('detail', { slug: movieDetail?.slug || selectedDrama?.slug || selectedDrama?.url });
    } else if (activeView === 'player') {
      syncUrl('player', {
        playUrl: selectedDrama?.url || movieDetail?.slug || '',
        ep: currentEpisodeNumber
      });
    }
  }, [activeView, searchQuery, selectedGenreSlug, selectedSort, currentPage, movieDetail, selectedDrama, currentEpisodeNumber, syncUrl]);

  // Load Collections when page, genre, or sort changes
  useEffect(() => {
    if (activeView !== 'collections') return;

    async function loadCollections() {
      setIsLoadingCollections(true);
      try {
        let list: Drama[] = [];
        if (selectedGenreSlug && selectedGenreSlug !== 'semua') {
          list = await fetchGenreMovies(selectedGenreSlug, currentPage);
        } else {
          list = await fetchMovies(currentPage);
        }

        if (selectedSort === 'a-z') {
          list.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === 'terbaru') {
          list.sort((a, b) => (b.year || 2023) - (a.year || 2023));
        }

        setCollectionsDramas(list);
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setIsLoadingCollections(false);
      }
    }

    loadCollections();
  }, [activeView, selectedGenreSlug, selectedSort, currentPage]);

  // Navigation action handler
  const handleNavigate = (view: ViewMode, genreSlug?: string) => {
    setActiveView(view);
    if (genreSlug) setSelectedGenreSlug(genreSlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'home') {
      syncUrl('home');
    } else if (view === 'search') {
      syncUrl('search', { q: searchQuery });
    } else if (view === 'collections') {
      syncUrl('collections', { genre: genreSlug || selectedGenreSlug, sort: selectedSort, page: currentPage });
    }
  };

  // Toggle Bookmark Handler
  const handleToggleBookmark = (drama: Drama, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedIds.has(drama.id)) {
      setBookmarkedDramas((prev) => prev.filter((d) => d.id !== drama.id));
    } else {
      setBookmarkedDramas((prev) => [...prev, drama]);
    }
  };

  // Select Drama for Detail View
  const handleSelectDrama = async (drama: Drama) => {
    setSelectedDrama(drama);
    setActiveView('detail');
    setIsLoadingDetail(true);
    syncUrl('detail', { slug: drama.slug || drama.url });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const details = await fetchMovieDetails(drama.url || drama.slug);
      setMovieDetail(details);
    } catch (err) {
      console.error('Failed to fetch movie detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Play Drama Episode
  const handlePlayEpisode = async (playUrl: string, epNumber: number) => {
    setCurrentEpisodeNumber(epNumber);
    setActiveView('player');
    setIsLoadingPlayer(true);
    syncUrl('player', { playUrl, ep: epNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const stream = await fetchEpisodeStream(playUrl);
      setStreamInfo(stream);
    } catch (err) {
      console.error('Failed to fetch streaming episode info:', err);
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  // Direct Play from Card or Banner
  const handleDirectPlay = (drama: Drama) => {
    handleSelectDrama(drama).then(() => {
      const playUrl = drama.url
        ? `/play/${drama.slug}-${drama.id}/1`
        : `/play/mahkota-cahaya-untuk-istri-apollo-ns_2064962492755087362/1`;
      handlePlayEpisode(playUrl, 1);
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Sticky Header */}
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          if (activeView !== 'search') {
            setActiveView('search');
          }
        }}
        myListCount={bookmarkedDramas.length}
        onOpenMyList={() => setMyListOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <HomeView
                dramas={homeDramas}
                genres={genres}
                selectedGenreSlug={selectedGenreSlug}
                onSelectGenre={(slug) => {
                  setSelectedGenreSlug(slug);
                  handleNavigate('collections', slug);
                }}
                onSelectDrama={handleSelectDrama}
                onPlayDrama={handleDirectPlay}
                onSeeAllCollections={() => handleNavigate('collections')}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
              />
            </motion.div>
          )}

          {activeView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <SearchView
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchResults={searchResults}
                isLoading={isSearching}
                onSelectDrama={handleSelectDrama}
                onPlayDrama={handleDirectPlay}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                recommendedDramas={homeDramas}
              />
            </motion.div>
          )}

          {activeView === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <CollectionsView
                genres={genres}
                dramas={collectionsDramas.length > 0 ? collectionsDramas : homeDramas}
                selectedGenreSlug={selectedGenreSlug}
                onSelectGenre={(slug) => {
                  setSelectedGenreSlug(slug);
                  setCurrentPage(1);
                }}
                selectedSort={selectedSort}
                onSelectSort={setSelectedSort}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectDrama={handleSelectDrama}
                onPlayDrama={handleDirectPlay}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
              />
            </motion.div>
          )}

          {activeView === 'detail' && movieDetail && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <DetailView
                detail={{
                  ...movieDetail,
                  cover: movieDetail.cover || selectedDrama?.cover || ''
                }}
                isLoading={isLoadingDetail}
                onPlayEpisode={handlePlayEpisode}
                onSelectRecommended={handleSelectDrama}
                isBookmarked={bookmarkedIds.has(movieDetail.id)}
                onToggleBookmark={() => {
                  if (selectedDrama) handleToggleBookmark(selectedDrama);
                }}
                onBack={() => handleNavigate('home')}
              />
            </motion.div>
          )}

          {activeView === 'player' && (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <PlayerView
                streamInfo={streamInfo}
                isLoading={isLoadingPlayer}
                currentEpisodeNumber={currentEpisodeNumber}
                dramaTitle={selectedDrama?.title || movieDetail?.title || 'DracinTeros Streaming'}
                synopsis={movieDetail?.synopsis || selectedDrama?.introduction}
                onSelectEpisode={handlePlayEpisode}
                onBackToDetail={() => setActiveView('detail')}
                recommendations={homeDramas}
                onSelectRecommended={handleSelectDrama}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* My List Saved Bookmarks Modal */}
      <MyListModal
        isOpen={myListOpen}
        onClose={() => setMyListOpen(false)}
        bookmarkedDramas={bookmarkedDramas}
        onSelectDrama={handleSelectDrama}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={() => setBookmarkedDramas([])}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeView={activeView}
        onNavigate={handleNavigate}
        myListCount={bookmarkedDramas.length}
        onOpenMyList={() => setMyListOpen(true)}
      />

      {/* PWA Install Banner */}
      <PWAInstallPrompt />
    </div>
  );
}
