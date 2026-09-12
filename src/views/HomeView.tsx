import React from 'react';
import { HeroBanner } from '../components/HeroBanner.js';
import { GenreSelector } from '../components/GenreSelector.js';
import { DramaCard } from '../components/DramaCard.js';
import { Drama, Genre } from '../types/index.js';
import { ChevronRight, Flame, Sparkles } from 'lucide-react';

interface HomeViewProps {
  dramas: Drama[];
  genres: Genre[];
  selectedGenreSlug: string;
  onSelectGenre: (slug: string) => void;
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama) => void;
  onSeeAllCollections: () => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (drama: Drama, e: React.MouseEvent) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  dramas,
  genres,
  selectedGenreSlug,
  onSelectGenre,
  onSelectDrama,
  onPlayDrama,
  onSeeAllCollections,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const featured = dramas.length > 0 ? dramas[0] : null;
  const popularDramas = dramas.slice(0, 5);
  const newReleases = dramas.slice(5, 10);

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      {featured && (
        <HeroBanner
          featuredDrama={featured}
          onPlay={onPlayDrama}
          onDetail={onSelectDrama}
        />
      )}

      {/* Genre Pilihan Bar */}
      <GenreSelector
        genres={genres}
        selectedSlug={selectedGenreSlug}
        onSelectGenre={(slug) => {
          onSelectGenre(slug);
          onSeeAllCollections();
        }}
      />

      {/* Drama Populer Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Drama Populer
            </h2>
          </div>
          <button
            id="see-all-popular-btn"
            onClick={onSeeAllCollections}
            className="flex items-center gap-1 text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularDramas.map((drama) => (
            <DramaCard
              key={drama.id}
              drama={drama}
              onSelect={onSelectDrama}
              onPlay={onPlayDrama}
              isBookmarked={bookmarkedIds.has(drama.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </section>

      {/* Drama Terbaru Section */}
      {newReleases.length > 0 && (
        <section className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Rilisan Terbaru
              </h2>
            </div>
            <button
              id="see-all-new-btn"
              onClick={onSeeAllCollections}
              className="flex items-center gap-1 text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newReleases.map((drama) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                onSelect={onSelectDrama}
                onPlay={onPlayDrama}
                isBookmarked={bookmarkedIds.has(drama.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
