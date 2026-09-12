import React from 'react';
import { Genre } from '../types/index.js';
import { cleanText } from '../utils/text.js';

interface GenreSelectorProps {
  genres: Genre[];
  selectedSlug: string;
  onSelectGenre: (slug: string) => void;
  title?: string;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  selectedSlug,
  onSelectGenre,
  title = "Genre Pilihan"
}) => {
  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h2>
      )}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {genres.map((g) => {
          const isSelected = selectedSlug === g.slug || (selectedSlug === '' && g.slug === 'semua');
          return (
            <button
              key={g.slug}
              id={`genre-pill-${g.slug}`}
              onClick={() => onSelectGenre(g.slug)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 scale-[1.02]'
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              {cleanText(g.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
