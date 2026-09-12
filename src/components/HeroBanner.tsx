import React from 'react';
import { Play, Info, Sparkles } from 'lucide-react';
import { Drama } from '../types/index.js';
import { cleanText } from '../utils/text.js';

interface HeroBannerProps {
  featuredDrama: Drama | null;
  onPlay: (drama: Drama) => void;
  onDetail: (drama: Drama) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredDrama,
  onPlay,
  onDetail,
}) => {
  if (!featuredDrama) return null;

  return (
    <div className="relative w-full h-[420px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden mb-8 shadow-2xl border border-neutral-800/80 bg-neutral-900 group">
      {/* Background Image & Gradient Overlays */}
      <img
        src={featuredDrama.cover}
        alt={featuredDrama.title}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
        onError={(e) => {
          // Fallback image on error
          e.currentTarget.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e] via-[#0a0a0e]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0e] via-[#0a0a0e]/80 to-transparent w-full md:w-3/4" />

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-2xl z-10 flex flex-col items-start gap-3">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Episode Baru</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          {cleanText(featuredDrama.title)}
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-neutral-300 line-clamp-3 font-normal leading-relaxed max-w-xl drop-shadow">
          {cleanText(featuredDrama.introduction) ||
            'Di tengah perebutan takhta kerajaan modern, dua pewaris harus memilih antara cinta dan kekuasaan tertinggi. Sebuah intrik politik yang dibalut romansa kelam.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-2">
          <button
            id="hero-play-btn"
            onClick={() => onPlay(featuredDrama)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-950/50 hover:shadow-red-900/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Putar Sekarang</span>
          </button>

          <button
            id="hero-detail-btn"
            onClick={() => onDetail(featuredDrama)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-bold text-sm backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span>Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
};
