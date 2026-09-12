import React from 'react';
import { Play, Star, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { Drama } from '../types/index.js';
import { cleanText } from '../utils/text.js';

interface DramaCardProps {
  drama: Drama;
  onSelect: (drama: Drama) => void;
  onPlay?: (drama: Drama) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (drama: Drama, e: React.MouseEvent) => void;
  layoutMode?: 'grid' | 'list';
}

export const DramaCard: React.FC<DramaCardProps> = ({
  drama,
  onSelect,
  onPlay,
  isBookmarked = false,
  onToggleBookmark,
  layoutMode = 'grid',
}) => {
  const ratingVal = drama.rating || (8.5 + (parseInt(drama.id.slice(-2) || '5', 10) % 15) / 10);
  const formattedRating = ratingVal.toFixed(1);

  if (layoutMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={{ scale: 1.01 }}
        onClick={() => onSelect(drama)}
        className="group flex gap-4 p-3 bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-red-600/40 rounded-xl transition-all cursor-pointer items-center shadow-sm hover:shadow-md"
      >
        <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
          <img
            src={drama.cover}
            alt={drama.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop';
            }}
          />
          <div className="absolute top-1 right-1 bg-black/80 text-yellow-400 font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-current" />
            {formattedRating}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-red-500 transition-colors truncate">
            {cleanText(drama.title)}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2">
            {cleanText(drama.introduction) || 'Saksikan kisah seru selengkapnya di DracinTeros.'}
          </p>
          <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
            {drama.genres && drama.genres.length > 0 && (
              <span>{drama.genres.slice(0, 2).map(g => cleanText(g)).join(', ')}</span>
            )}
            <span>• {drama.episodesCount || 16} Episode</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleBookmark && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(drama, e);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'text-red-500 bg-red-950/40' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </motion.button>
          )}

          {onPlay && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onPlay(drama);
              }}
              className="p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(drama)}
      className="group relative flex flex-col bg-transparent transition-all duration-300 cursor-pointer"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-md group-hover:border-red-600/60 group-hover:shadow-xl group-hover:shadow-red-950/30 transition-all duration-300">
        <img
          src={drama.cover}
          alt={drama.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop';
          }}
        />

        {/* Dark Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="p-3.5 rounded-full bg-red-600 text-white shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white font-extrabold text-xs flex items-center gap-1 shadow-md">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{formattedRating}</span>
        </div>

        {/* Bookmark Action */}
        {onToggleBookmark && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(drama, e);
            }}
            className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg backdrop-blur-md border border-white/10 transition-colors ${
              isBookmarked
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/90'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        )}
      </div>

      {/* Info Label Below Card */}
      <div className="mt-2.5 px-0.5 flex flex-col gap-0.5">
        <h3 className="text-white font-bold text-sm sm:text-base tracking-tight leading-snug group-hover:text-red-500 transition-colors line-clamp-1">
          {cleanText(drama.title)}
        </h3>
        <p className="text-xs text-neutral-400 font-medium line-clamp-1">
          {drama.genres && drama.genres.length > 0
            ? `${drama.genres.slice(0, 2).map(g => cleanText(g)).join(', ')} • ${drama.year || 2023}`
            : `${drama.episodesCount || 16} Episode`}
        </p>
      </div>
    </motion.div>
  );
};

