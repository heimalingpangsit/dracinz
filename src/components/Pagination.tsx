import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages = 12,
  onPageChange,
}) => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <button
        id="prev-page-btn"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 font-semibold text-xs cursor-pointer"
          >
            1
          </button>
          {start > 2 && <span className="text-neutral-500 px-1 text-xs">...</span>}
        </>
      )}

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            id={`page-btn-${p}`}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isActive
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {p}
          </button>
        );
      })}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-neutral-500 px-1 text-xs">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 font-semibold text-xs cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        id="next-page-btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 cursor-pointer transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
