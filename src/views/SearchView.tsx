import React from 'react';
import { Search, X, Loader2, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { Drama } from '../types/index.js';
import { DramaCard } from '../components/DramaCard.js';
import { cleanText } from '../utils/text.js';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: Drama[];
  isLoading: boolean;
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (drama: Drama, e?: React.MouseEvent) => void;
  recommendedDramas: Drama[];
}

const POPULAR_TAGS = [
  'CEO',
  'Romantis',
  'Pernikahan',
  'Kerajaan',
  'Dendam',
  'Sultan',
  'Aksi',
  'Sekolah',
  'Misteri',
];

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  searchResults,
  isLoading,
  onSelectDrama,
  onPlayDrama,
  bookmarkedIds,
  onToggleBookmark,
  recommendedDramas,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/30 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Pencarian Drama China Sub Indo</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Cari Judul Drama, Genre & Kata Kunci
          </h1>

          {/* Search Input Box */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ketik judul drama... (contoh: Mahkota Cahaya, CEO, Sultan)"
                className="w-full bg-neutral-950/90 border-2 border-neutral-700/80 focus:border-red-600 rounded-xl py-3.5 pl-12 pr-12 text-sm md:text-base text-white placeholder-neutral-500 focus:outline-none shadow-2xl transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
                  title="Hapus pencarian"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Popular Keywords */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-red-500" />
              Pencarian Populer:
            </span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? 'bg-red-600 text-white border-red-500 font-bold'
                    : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border-neutral-700/60'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results or Curated Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {searchQuery ? (
              <>
                <span>Hasil Pencarian: <span className="text-red-500">"{cleanText(searchQuery)}"</span></span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-red-500" />
                <span>Rekomendasi Drama Terpopuler</span>
              </>
            )}
          </h2>
          {searchQuery && searchResults.length > 0 && !isLoading && (
            <span className="text-xs text-neutral-400 font-medium">
              Ditemukan {searchResults.length} drama
            </span>
          )}
        </div>

        {/* Loading Spinner / Skeletons */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-neutral-400">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-sm font-medium">Mencari drama terbaik untuk Anda...</p>
          </div>
        )}

        {/* Search Results Grid */}
        {!isLoading && searchQuery && searchResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map((drama) => (
              <DramaCard
                key={drama.id || drama.slug}
                drama={drama}
                onSelect={() => onSelectDrama(drama)}
                onPlay={() => onPlayDrama(drama)}
                isBookmarked={bookmarkedIds.has(drama.id)}
                onToggleBookmark={(e) => onToggleBookmark(drama, e)}
              />
            ))}
          </div>
        )}

        {/* Empty State when searchQuery yields no results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Drama Tidak Ditemukan</h3>
              <p className="text-xs text-neutral-400">
                Maaf, tidak ada judul drama yang cocok dengan kata kunci "{searchQuery}". Coba gunakan kata kunci lain seperti genre "Romantis" atau nama karakter.
              </p>
            </div>
            <button
              onClick={() => onSearchChange('')}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Default / Recommended Grid when query is empty */}
        {!searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recommendedDramas.slice(0, 15).map((drama) => (
              <DramaCard
                key={drama.id || drama.slug}
                drama={drama}
                onSelect={() => onSelectDrama(drama)}
                onPlay={() => onPlayDrama(drama)}
                isBookmarked={bookmarkedIds.has(drama.id)}
                onToggleBookmark={(e) => onToggleBookmark(drama, e)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
