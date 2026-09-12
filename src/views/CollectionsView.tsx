import React, { useState } from 'react';
import { SidebarFilter } from '../components/SidebarFilter.js';
import { DramaCard } from '../components/DramaCard.js';
import { Pagination } from '../components/Pagination.js';
import { Drama, Genre, SortOption } from '../types/index.js';
import { LayoutGrid, List } from 'lucide-react';

interface CollectionsViewProps {
  genres: Genre[];
  dramas: Drama[];
  selectedGenreSlug: string;
  onSelectGenre: (slug: string) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (drama: Drama, e: React.MouseEvent) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  genres,
  dramas,
  selectedGenreSlug,
  onSelectGenre,
  selectedSort,
  onSelectSort,
  currentPage,
  onPageChange,
  onSelectDrama,
  onPlayDrama,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar Filter */}
      <SidebarFilter
        genres={genres}
        selectedGenreSlug={selectedGenreSlug}
        onSelectGenre={onSelectGenre}
        selectedSort={selectedSort}
        onSelectSort={onSelectSort}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Title & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Koleksi Drama
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Jelajahi ribuan judul drama berkualitas tinggi.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-neutral-400 font-medium">Tampilan:</span>
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
              <button
                id="view-grid-btn"
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layoutMode === 'grid' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="view-list-btn"
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layoutMode === 'list' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Daftar"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Drama List / Grid */}
        {dramas.length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
            <p className="text-base font-semibold">Tidak ada drama ditemukan untuk genre ini.</p>
            <button
              onClick={() => onSelectGenre('semua')}
              className="mt-4 px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors"
            >
              Lihat Semua Drama
            </button>
          </div>
        ) : (
          <div
            className={
              layoutMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {dramas.map((drama) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                onSelect={onSelectDrama}
                onPlay={onPlayDrama}
                isBookmarked={bookmarkedIds.has(drama.id)}
                onToggleBookmark={onToggleBookmark}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={12}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
