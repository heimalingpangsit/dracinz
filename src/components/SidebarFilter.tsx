import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Genre, SortOption } from '../types/index.js';
import { cleanText } from '../utils/text.js';

interface SidebarFilterProps {
  genres: Genre[];
  selectedGenreSlug: string;
  onSelectGenre: (slug: string) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  genres,
  selectedGenreSlug,
  onSelectGenre,
  selectedSort,
  onSelectSort,
}) => {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 shadow-xl self-start">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-800">
        <SlidersHorizontal className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-black tracking-tight text-white">
          Filter & Urutkan
        </h2>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
          Urutkan Berdasarkan
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { id: 'populer', label: 'Populer' },
            { id: 'terbaru', label: 'Terbaru' },
            { id: 'a-z', label: 'A-Z' },
          ].map((item) => {
            const isChecked = selectedSort === item.id;
            return (
              <label
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isChecked ? 'border-red-500 bg-red-600' : 'border-neutral-600'
                  }`}
                >
                  {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <input
                  type="radio"
                  name="sort-option"
                  value={item.id}
                  checked={isChecked}
                  onChange={() => onSelectSort(item.id as SortOption)}
                  className="hidden"
                />
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-neutral-800 mb-6" />

      {/* Genre Filter Pills */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
          Genre
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => {
            const isSelected = selectedGenreSlug === g.slug || (selectedGenreSlug === '' && g.slug === 'semua');
            return (
              <button
                key={g.slug}
                id={`sidebar-genre-${g.slug}`}
                onClick={() => onSelectGenre(g.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50 font-bold'
                    : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/50'
                }`}
              >
                {cleanText(g.name)}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
