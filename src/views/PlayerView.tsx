import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Tv,
  Share2,
  SkipBack,
  SkipForward,
  ListVideo,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
  Settings
} from 'lucide-react';
import { StreamInfo, Drama, Episode } from '../types/index.js';
import { cleanText } from '../utils/text.js';

interface PlayerViewProps {
  streamInfo: StreamInfo | null;
  isLoading: boolean;
  currentEpisodeNumber: number;
  dramaTitle: string;
  synopsis?: string;
  onSelectEpisode: (url: string, epNum: number) => void;
  onBackToDetail: () => void;
  recommendations: Drama[];
  onSelectRecommended: (drama: Drama) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  streamInfo,
  isLoading,
  currentEpisodeNumber,
  dramaTitle,
  synopsis,
  onSelectEpisode,
  onBackToDetail,
  recommendations,
  onSelectRecommended,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<number>(1080);
  const [showSettings, setShowSettings] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lock document body scroll while in TikTok Fullscreen Player Mode
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const episodes = streamInfo?.availableEpisodes || [];
  const sources = streamInfo?.videoSources || [];

  const currentSource =
    sources.find((s) => s.quality === selectedQuality)?.url ||
    sources[0]?.url ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    if (sources.length > 0) {
      setSelectedQuality(sources[0].quality || 1080);
    }
  }, [sources]);

  const currentEpIndex = episodes.findIndex((e) => e.number === currentEpisodeNumber);
  const prevEp =
    currentEpIndex > 0
      ? episodes[currentEpIndex - 1]
      : currentEpisodeNumber > 1
      ? { number: currentEpisodeNumber - 1, url: `/play/${currentEpisodeNumber - 1}` }
      : null;

  const nextEp =
    currentEpIndex !== -1 && currentEpIndex < episodes.length - 1
      ? episodes[currentEpIndex + 1]
      : { number: currentEpisodeNumber + 1, url: `/play/${currentEpisodeNumber + 1}` };

  const handlePrevClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (prevEp) {
      onSelectEpisode(prevEp.url, prevEp.number);
    } else if (currentEpisodeNumber > 1) {
      onSelectEpisode(`/play/${currentEpisodeNumber - 1}`, currentEpisodeNumber - 1);
    }
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (nextEp) {
      onSelectEpisode(nextEp.url, nextEp.number);
    } else {
      onSelectEpisode(`/play/${currentEpisodeNumber + 1}`, currentEpisodeNumber + 1);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // User activity auto controls fade (3 seconds)
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Start 3s countdown on mount and episode change
  useEffect(() => {
    handleUserActivity();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [currentEpisodeNumber]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToDetail();
      } else if (e.key === 'ArrowDown' || e.key === 'n' || e.key === 'N') {
        handleNextClick();
      } else if (e.key === 'ArrowUp' || e.key === 'p' || e.key === 'P') {
        handlePrevClick();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentEpisodeNumber, prevEp, nextEp, isPlaying]);

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const m = Math.floor(timeInSec / 60);
    const s = Math.floor(timeInSec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base font-bold text-neutral-300">Memuat episode {currentEpisodeNumber}...</p>
        <p className="text-xs text-neutral-500 mt-1">{cleanText(dramaTitle)}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      className="fixed inset-0 z-[100] bg-black text-white w-screen h-screen overflow-hidden flex flex-col justify-between select-none font-sans"
    >
      {/* Background Video Canvas */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full flex items-center justify-center bg-black cursor-pointer"
      >
        <video
          ref={videoRef}
          src={currentSource}
          className="w-full h-full object-contain md:object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => handleNextClick()}
          autoPlay
          playsInline
        />

        {/* Giant Pause Overlay Icon */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
            >
              <div className="w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl animate-pulse">
                <Play className="w-10 h-10 fill-current translate-x-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOP HEADER OVERLAY */}
      <div
        className={`relative z-20 p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Left: Logo & Close Button */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onBackToDetail();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition-all cursor-pointer shadow-lg group"
            title="Tutup & Kembali"
          >
            <X className="w-5 h-5 text-red-500 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs font-bold hidden sm:inline">Tutup</span>
          </motion.button>

          <div className="flex items-center gap-2 bg-neutral-950/80 px-3 py-1.5 rounded-2xl border border-neutral-800">
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain rounded-md" />
            <span className="text-xs font-black tracking-wider text-red-500">Dracin<span className="text-white">Teros</span></span>
            <span className="text-neutral-600">|</span>
            <span className="text-xs font-bold text-neutral-300">Ep {currentEpisodeNumber}</span>
          </div>
        </div>

        {/* Top Right: Episode Selector Drawer & Utilities */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowEpisodeDrawer(!showEpisodeDrawer);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-bold text-neutral-200 hover:text-white transition-all cursor-pointer shadow-lg"
          >
            <ListVideo className="w-4 h-4 text-red-500" />
            <span>Pilih Episode ({episodes.length || 20})</span>
          </motion.button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition-colors"
            title="Mute/Unmute"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition-colors hidden sm:block"
            title="Full Screen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SIDEBAR EPISODE DRAWER MODAL */}
      <AnimatePresence>
        {showEpisodeDrawer && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-16 right-4 z-40 w-80 max-w-[90vw] bg-neutral-950/95 border border-neutral-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4 max-h-[75vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-sm font-black text-white">Daftar Episode</h3>
              <button
                onClick={() => setShowEpisodeDrawer(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pr-1 scrollbar-thin">
              {(episodes.length > 0
                ? episodes
                : Array.from({ length: 40 }, (_, i) => ({
                    number: i + 1,
                    url: `/play/${i + 1}`,
                  }))
              ).map((ep) => {
                const isActive = ep.number === currentEpisodeNumber;
                return (
                  <motion.button
                    key={ep.number}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onSelectEpisode(ep.url, ep.number);
                      setShowEpisodeDrawer(false);
                    }}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all border text-center ${
                      isActive
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    Episode {ep.number}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM CONTROLS OVERLAY (TIKTOK / REELS STYLE) */}
      <div
        className={`relative z-20 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-3 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Horizontal Quick Episode Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-2xl mx-auto w-full px-2">
          {(episodes.length > 0
            ? episodes
            : Array.from({ length: 30 }, (_, i) => ({
                number: i + 1,
                url: `/play/${i + 1}`,
              }))
          ).map((ep) => {
            const isActive = ep.number === currentEpisodeNumber;
            return (
              <button
                key={ep.number}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEpisode(ep.url, ep.number);
                }}
                className={`flex-shrink-0 px-3 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-500 shadow-md'
                    : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800/80'
                }`}
              >
                Ep {ep.number}
              </button>
            );
          })}
        </div>

        {/* Video Scrubber Timeline */}
        <div className="relative w-full max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-[10px] font-mono text-neutral-400 min-w-[36px]">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2 transition-all"
          />
          <span className="text-[10px] font-mono text-neutral-400 min-w-[36px] text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* CENTERED TITLE AT THE BOTTOM */}
        <div className="text-center space-y-1 max-w-2xl mx-auto w-full px-4">
          <h2 className="text-sm md:text-lg font-black text-white drop-shadow-md truncate">
            {cleanText(dramaTitle)} - Episode {currentEpisodeNumber}
          </h2>
          {synopsis && (
            <p className="text-[11px] md:text-xs text-neutral-400 truncate max-w-xl mx-auto font-medium">
              {cleanText(synopsis)}
            </p>
          )}
        </div>

        {/* MAIN CONTROLS ROW AT THE BOTTOM (Prev, Play, Next) */}
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto w-full pt-1">
          {/* Tombol Previous Episode */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handlePrevClick}
            disabled={!prevEp && currentEpisodeNumber <= 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all cursor-pointer border shadow-lg ${
              !prevEp && currentEpisodeNumber <= 1
                ? 'opacity-30 cursor-not-allowed bg-neutral-900/50 border-neutral-800 text-neutral-600'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-white border-neutral-700/80 hover:border-red-500/50'
            }`}
          >
            <SkipBack className="w-4 h-4 text-red-500 fill-current" />
            <span>Prev Episode</span>
          </motion.button>

          {/* Tombol Play / Pause Center */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={togglePlay}
            className="p-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-2xl shadow-red-950/80 transition-all cursor-pointer"
            title={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
          </motion.button>

          {/* Tombol Next Episode */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleNextClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-red-500/50 transition-all cursor-pointer shadow-lg"
          >
            <span>Next Episode</span>
            <SkipForward className="w-4 h-4 text-red-500 fill-current" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
