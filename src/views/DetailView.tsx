import React from 'react';
import { Play, Plus, Check, Star, Lock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieDetail, Drama } from '../types/index.js';
import { DramaCard } from '../components/DramaCard.js';
import { cleanText } from '../utils/text.js';

interface DetailViewProps {
  detail: MovieDetail;
  isLoading: boolean;
  onPlayEpisode: (playUrl: string, epNum: number) => void;
  onSelectRecommended: (drama: Drama) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  detail,
  isLoading,
  onPlayEpisode,
  onSelectRecommended,
  isBookmarked,
  onToggleBookmark,
  onBack,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-neutral-400">Memuat detail drama...</p>
        </div>
      </div>
    );
  }

  const firstEpisodeUrl = detail.episodes[0]?.url || `/play/${detail.slug}-${detail.id}/1`;

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
        {/* Poster Image */}
        <div className="relative w-full md:w-72 aspect-[2/3] rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border border-neutral-700/60 bg-neutral-800 group">
          <img
            src={detail.cover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop'}
            alt={detail.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop';
            }}
          />
        </div>

        {/* Right Detail Metadata */}
        <div className="flex-1 min-w-0 space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {cleanText(detail.title)}
            </h1>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-300 font-semibold pt-1">
              <span>2023</span>
              <span>•</span>
              <span>{detail.episodes.length || 16} Episode</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                4.8/5
              </span>
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {detail.genres.map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-neutral-800/90 border border-neutral-700 text-neutral-200 text-xs font-bold"
                >
                  {cleanText(g.name)}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="detail-start-play-btn"
              onClick={() => onPlayEpisode(firstEpisodeUrl, 1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Mulai Menonton</span>
            </button>

            <button
              id="detail-toggle-my-list-btn"
              onClick={onToggleBookmark}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-neutral-800 text-red-500 border-red-600/60'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-white border-neutral-700'
              }`}
            >
              {isBookmarked ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{isBookmarked ? 'Tersimpan' : 'Daftar Saya'}</span>
            </button>
          </div>

          {/* Sinopsis */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Sinopsis</h2>
            <p className="text-sm md:text-base text-neutral-300 font-normal leading-relaxed">
              {cleanText(detail.synopsis)}
            </p>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full" />
          <h2 className="text-2xl font-black text-white tracking-tight">Daftar Episode</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {detail.episodes.map((ep) => {
            if (ep.isLocked) {
              return (
                <div
                  key={ep.number}
                  className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 opacity-60 min-h-[160px]"
                >
                  <Lock className="w-6 h-6 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-400">
                    Episode {ep.number} - Segera Tayang
                  </span>
                </div>
              );
            }

            const fallbackStills = [
              "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop"
            ];
            const epThumbnail =
              ep.thumbnail ||
              ep.cover ||
              detail.cover ||
              fallbackStills[(ep.number - 1) % fallbackStills.length];

            return (
              <div
                key={ep.number}
                onClick={() => onPlayEpisode(ep.url, ep.number)}
                className="group relative bg-neutral-900 border border-neutral-800/90 hover:border-red-600/80 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-red-950/30"
              >
                {/* Thumbnail Image Section */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-800">
                  <img
                    src={epThumbnail}
                    alt={`${detail.title} - Episode ${ep.number}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        detail.cover ||
                        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Episode Badge (Top Left) */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-red-500 tracking-wider">
                    EP {ep.number}
                  </div>

                  {/* Duration Badge (Bottom Right) */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300 border border-neutral-700/60">
                    {ep.duration || '45m'}
                  </div>
                </div>

                {/* Card Content Below Thumbnail */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {ep.subtitle || ep.title || `Episode ${ep.number}`}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5 font-normal">
                      Saksikan keseruan episode {ep.number}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 pt-2 border-t border-neutral-800/80">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Episode</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rekomendasi Serupa */}
      {detail.recommendations && detail.recommendations.length > 0 && (
        <section className="space-y-6 pt-4">
          {detail.recommendations.map((rec, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {rec.sectionTitle || 'Rekomendasi Serupa'}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {rec.movies.map((m) => (
                  <DramaCard
                    key={m.id}
                    drama={m}
                    onSelect={onSelectRecommended}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
