import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
  Settings,
  Tv,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { VideoSource } from '../types/index.js';

interface VideoPlayerProps {
  title: string;
  sources: VideoSource[];
  episodeNumber: number;
  onNextEpisode?: () => void;
  onPreviousEpisode?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  sources,
  episodeNumber,
  onNextEpisode,
  onPreviousEpisode,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<number>(1080);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettings, setShowSettings] = useState(false);

  // Active source selection
  const currentSource =
    sources.find((s) => s.quality === selectedQuality)?.url ||
    sources[0]?.url ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    if (sources.length > 0) {
      setSelectedQuality(sources[0].quality || 1080);
    }
  }, [sources]);

  const togglePlay = () => {
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
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(0, videoRef.current.currentTime + seconds),
      duration
    );
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const m = Math.floor(timeInSec / 60);
    const s = Math.floor(timeInSec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 group"
    >
      <video
        ref={videoRef}
        src={currentSource}
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        autoPlay
        playsInline
      />

      {/* Overlay Title bar top */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-white z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-600 font-bold text-[10px] uppercase">
            EP {episodeNumber}
          </div>
          <span className="font-bold text-sm md:text-base drop-shadow">{title}</span>
        </div>
      </div>

      {/* Center Play/Pause button on pause */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
        >
          <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Video Control Bar Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 z-20">
        {/* Progress Bar */}
        <div className="relative w-full flex items-center group/scrubber">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-neutral-700/80 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2 transition-all"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-white gap-3">
          {/* Left Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onPreviousEpisode && (
              <button
                onClick={onPreviousEpisode}
                className="p-1.5 hover:text-red-500 transition-colors"
                title="Episode Sebelumnya"
              >
                <SkipBack className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-red-500 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {onNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="p-1.5 hover:text-red-500 transition-colors"
                title="Episode Selanjutnya"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 hover:text-red-500 transition-colors hidden sm:block"
              title="Mundur 10 detik"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 hover:text-red-500 transition-colors hidden sm:block"
              title="Maju 10 detik"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="p-1.5 hover:text-red-500 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-600 hidden sm:block"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-xs text-neutral-300 font-mono tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Speed / Quality Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Settings className="w-4 h-4" />
                <span>{selectedQuality}p</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-10 right-0 bg-neutral-900 border border-neutral-800 rounded-xl p-3 shadow-2xl w-40 flex flex-col gap-2 z-30">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Kualitas
                  </div>
                  {sources.map((src) => (
                    <button
                      key={src.quality}
                      onClick={() => {
                        setSelectedQuality(src.quality);
                        setShowSettings(false);
                      }}
                      className={`text-left text-xs px-2 py-1 rounded font-semibold ${
                        selectedQuality === src.quality ? 'bg-red-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {src.quality}p {src.cdn ? `(${src.cdn})` : ''}
                    </button>
                  ))}

                  <div className="h-px bg-neutral-800 my-1" />
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Kecepatan
                  </div>
                  {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => changeSpeed(spd)}
                      className={`text-left text-xs px-2 py-1 rounded font-semibold ${
                        playbackSpeed === spd ? 'bg-red-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {spd}x {spd === 1 ? '(Normal)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-red-500 transition-colors"
              title="Layar Penuh"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
