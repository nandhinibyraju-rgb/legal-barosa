import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
  Repeat,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Clock,
  Award,
  BookOpen,
  Compass,
  FileText,
  Scale
} from 'lucide-react';
import { subscribeSetting, DEFAULT_HOMEPAGE_SETTINGS } from '../services/firestoreService';
import { useTranslation } from 'react-i18next';

export default function VideoSection({ onOpenConsult }) {
  const { t } = useTranslation();
  const [homepageSettings, setHomepageSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS);

  useEffect(() => {
    const unsub = subscribeSetting('homepage', (data) => {
      setHomepageSettings(data);
    }, DEFAULT_HOMEPAGE_SETTINGS);
    return () => unsub();
  }, []);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(true); // Continuous looping enabled by default
  const [showControls, setShowControls] = useState(true);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Rewind (-10 seconds)
  const handleRewind = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  }, []);

  // Replay (restart from 0:00 and play)
  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => {
      setIsPlaying(true);
      setHasStarted(true);
    }).catch((err) => {
      console.warn('Replay error:', err);
    });
  }, []);

  // Toggle Volume Mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.8);
      video.volume = 0.8;
    }
  }, [isMuted, volume]);

  // Volume Slider Change
  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    if (val === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  }, [isMuted]);

  // Toggle Continuous Looping
  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.loop = next;
      }
      return next;
    });
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, []);

  // Sync fullscreen change events (e.g. Esc key pressed)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle Video Time Updates
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDraggingSeek) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    video.loop = isLooping;
  };

  // Video Ended Handler (fallback continuous looping if browser loop attribute hiccups)
  const handleEnded = () => {
    if (isLooping && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setIsPlaying(false);
    }
  };

  // Calculate seek percentage from mouse or touch event
  const calculateSeekTime = (clientX) => {
    if (!progressBarRef.current || !duration) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return pos * duration;
  };

  // Seek Bar Mouse Down
  const handleSeekMouseDown = (e) => {
    setIsDraggingSeek(true);
    const newTime = calculateSeekTime(e.clientX);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Seek Bar Hover for Tooltip
  const handleSeekMouseMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(ratio * 100);
    setHoverTime(ratio * duration);

    if (isDraggingSeek && videoRef.current) {
      const newTime = ratio * duration;
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeekMouseLeave = () => {
    setHoverTime(null);
  };

  // Window listeners for dragging seek scrubber
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingSeek) {
        setIsDraggingSeek(false);
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (isDraggingSeek && progressBarRef.current && duration) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = ratio * duration;
        setCurrentTime(newTime);
        if (videoRef.current) {
          videoRef.current.currentTime = newTime;
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDraggingSeek, duration]);

  // Autohide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Keyboard accessibility within container
  const handleKeyDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleRewind();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
      }
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      toggleMute();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section 
      id="video-story" 
      className="w-full py-14 sm:py-20 px-3 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 bg-gradient-to-b from-white via-[#F0F7FF]/50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading Badge */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-[#168CFF]/25 text-[#0B2A5B] text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>{t('videoSection.badge', homepageSettings?.videoSectionBadge || 'See LegalBharosa in Action')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-[#0B2A5B] font-heading uppercase">
            {t('videoSection.title', homepageSettings?.videoSectionTitle || 'Real Defense. Genuine Relief.')}
          </h2>
          <p className="mt-2.5 text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto">
            {t('videoSection.subtitle', homepageSettings?.videoSectionSubtitle || 'Understand your rights as a borrower, navigate loan notices and recovery communications responsibly, and connect with qualified legal assistance for structured dispute resolution.')}
          </p>
        </div>

        {/* 2-Column Responsive Layout: Video Player + Supporting Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ========================================================================= */}
          {/* RIGHT/PRIMARY: THE VIDEO PLAYER IN ANIMATED BLUE/CYAN CONTAINER (7 cols)  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* Outer Glow & Animated Border Wrap */}
            <div className="relative group p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl transition-transform duration-300">
              
              {/* 1. Ambient Multi-Layer Cyan/Blue Glow behind player */}
              <div 
                aria-hidden="true"
                className="absolute -inset-2 sm:-inset-4 rounded-3xl bg-gradient-to-r from-[#0B2A5B]/30 via-[#00D2FF]/25 to-[#168CFF]/35 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-cyan-glow"
              />

              {/* 2. Gently Animated Border Beam (Conic Gradient in LegalBharosa Blues & Cyan) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-0"
                style={{
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] aspect-square sm:drop-shadow-[0_0_12px_rgba(0,210,255,0.7)]"
                  style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, #0B2A5B 0deg, #168CFF 90deg, #00D2FF 180deg, #F4B400 240deg, #168CFF 300deg, #0B2A5B 360deg)',
                    animation: 'borderTraceRotate 8s linear infinite',
                  }}
                />
              </div>

              {/* 3. The Video Player Container */}
              <div
                ref={containerRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative z-10 w-full aspect-video rounded-[14px] sm:rounded-[22px] overflow-hidden bg-slate-950 shadow-[0_20px_60px_-15px_rgba(11,42,91,0.45),0_0_30px_rgba(0,210,255,0.2)] border border-white/10 select-none outline-none focus:ring-2 focus:ring-[#00D2FF]/50"
              >
                {/* HTML5 Native Video Tag */}
                <video
                  ref={videoRef}
                  src="/video.mp4"
                  playsInline
                  loop={isLooping}
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer bg-black"
                />

                {/* Subtle top subtle shine glass layer */}
                <div 
                  aria-hidden="true" 
                  className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.08] via-transparent to-black/40" 
                />

                {/* Top Overlay Badge Bar (Visible when controls shown or paused) */}
                <div 
                  className={`absolute top-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between pointer-events-none transition-opacity duration-300 z-20 ${
                    showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/30 text-white text-[11px] sm:text-xs font-medium shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span className="tracking-wide">LegalBharosa Overview</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isLooping && (
                      <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 backdrop-blur-md border border-cyan-400/40 text-[#00D2FF] text-[10px] font-mono tracking-wider">
                        <Repeat className="w-3 h-3 animate-spin-slow" />
                        <span>LOOPING</span>
                      </div>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/15 text-slate-300 text-[10px] font-mono">
                      HD
                    </span>
                  </div>
                </div>

                {/* Big Center Play / Pause Indicator (When paused or initial state) */}
                <AnimatePresence>
                  {(!isPlaying || !hasStarted) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-20 bg-slate-950/30 backdrop-blur-[2px]"
                    >
                      <div className="relative group/btn flex items-center justify-center">
                        {/* Glowing radial pulse */}
                        <div className="absolute inset-0 rounded-full bg-[#00D2FF]/40 blur-xl scale-125 group-hover/btn:scale-150 transition-transform duration-300 animate-pulse" />
                        
                        <button
                          type="button"
                          aria-label="Play Video"
                          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#0B2A5B] via-[#0646A8] to-[#00D2FF] p-[2px] shadow-[0_0_30px_rgba(0,210,255,0.6)] group-hover/btn:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                        >
                          <div className="w-full h-full rounded-full bg-slate-950/85 backdrop-blur-sm flex items-center justify-center text-white pl-1 group-hover/btn:bg-slate-900/60 transition-colors">
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-[#00D2FF] drop-shadow-md" />
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Video Controls Bar */}
                <div
                  className={`absolute bottom-0 inset-x-0 px-3 sm:px-4 pb-3 sm:pb-4 pt-8 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent transition-opacity duration-300 z-20 ${
                    showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {/* 1. Interactive Seek Bar */}
                  <div
                    ref={progressBarRef}
                    onMouseDown={handleSeekMouseDown}
                    onMouseMove={handleSeekMouseMove}
                    onMouseLeave={handleSeekMouseLeave}
                    className="group/seek relative w-full h-2 hover:h-3 bg-white/20 rounded-full cursor-pointer transition-all duration-150 mb-3 flex items-center"
                  >
                    {/* Played Progress Bar with Blue-Cyan Gradient */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#168CFF] to-[#00D2FF] relative shadow-[0_0_10px_rgba(0,210,255,0.8)]"
                      style={{ width: `${progressPercent}%` }}
                    >
                      {/* Scrubber Thumb */}
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#00D2FF] shadow-[0_0_8px_rgba(0,210,255,1)] opacity-0 group-hover/seek:opacity-100 transition-opacity" />
                    </div>

                    {/* Hover Timestamp Tooltip */}
                    {hoverTime !== null && (
                      <div
                        className="absolute -top-7 px-1.5 py-0.5 rounded bg-slate-900/90 border border-cyan-400/40 text-cyan-200 text-[10px] font-mono shadow-md -translate-x-1/2 pointer-events-none"
                        style={{ left: `${hoverPosition}%` }}
                      >
                        {formatTime(hoverTime)}
                      </div>
                    )}
                  </div>

                  {/* 2. Control Buttons & Status Row */}
                  <div className="flex items-center justify-between text-white text-xs gap-2">
                    
                    {/* Left Group: Play/Pause, Rewind, Replay, Time */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Play / Pause Toggle Button */}
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white hover:text-[#00D2FF] transition-all cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Rewind (-10s) Button */}
                      <button
                        type="button"
                        onClick={handleRewind}
                        aria-label="Rewind 10 seconds"
                        title="Rewind 10 seconds (←)"
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-[#00D2FF] transition-all cursor-pointer flex items-center gap-0.5 text-[11px]"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline text-[10px] font-mono">-10s</span>
                      </button>

                      {/* Replay Button (Restart from 0) */}
                      <button
                        type="button"
                        onClick={handleReplay}
                        aria-label="Replay from start"
                        title="Replay from start"
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-[#00D2FF] transition-all cursor-pointer hidden xs:flex items-center gap-1 text-[11px]"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px] font-mono">Replay</span>
                      </button>

                      {/* Time Readout: Current / Duration */}
                      <div className="font-mono text-[11px] sm:text-xs text-slate-300 ml-1 select-none">
                        <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Right Group: Volume/Mute, Continuous Loop Toggle, Fullscreen */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      
                      {/* Volume / Mute Control with Slider */}
                      <div className="flex items-center gap-1.5 group/vol bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-colors">
                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                          title={isMuted || volume === 0 ? 'Unmute (M)' : 'Mute (M)'}
                          className="text-slate-200 hover:text-[#00D2FF] transition-colors cursor-pointer"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-red-400" />
                          ) : volume < 0.5 ? (
                            <Volume1 className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          aria-label="Volume slider"
                          className="w-12 sm:w-16 h-1.5 accent-[#00D2FF] bg-white/20 rounded-full cursor-pointer appearance-none"
                        />
                      </div>

                      {/* Continuous Looping Toggle */}
                      <button
                        type="button"
                        onClick={toggleLoop}
                        aria-label="Toggle continuous loop"
                        title={isLooping ? 'Continuous loop: ON' : 'Continuous loop: OFF'}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono ${
                          isLooping 
                            ? 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/50 shadow-[0_0_8px_rgba(0,210,255,0.4)]' 
                            : 'bg-white/10 text-slate-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <Repeat className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin-slow text-[#00D2FF]' : ''}`} />
                        <span className="hidden md:inline text-[10px]">
                          {isLooping ? 'Looping' : 'Loop'}
                        </span>
                      </button>

                      {/* Fullscreen Toggle */}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-[#00D2FF] transition-all cursor-pointer"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Micro Quick-Action helper beneath player */}
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 px-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#168CFF]" />
                <span>Quick Explainer</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[11px] text-neutral-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>LegalBharosa Case Guidance Overview</span>
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEFT: PRACTICAL GUIDANCE CARDS BESIDE VIDEO (5 cols)                      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#168CFF] uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-[#F4B400]" />
              <span>Practical Legal & Financial Guidance</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#0B2A5B] font-heading leading-tight mb-3">
              Clear, Responsible Support for Debt & Legal Concerns
            </h3>

            <p className="text-neutral-600 text-sm leading-relaxed mb-5">
              Facing debt distress, recovery calls, or legal notices can be confusing. LegalBharosa provides structured information to help you understand your legal position, evaluate realistic options, and connect with qualified advocates when formal representation is required.
            </p>

            {/* 4 Practical Guidance Cards */}
            <div className="space-y-2.5 mb-6">
              {(homepageSettings?.guidanceCards || DEFAULT_HOMEPAGE_SETTINGS.guidanceCards).map((card, idx) => {
                const CardIcon = idx === 0 ? FileText : idx === 1 ? Compass : idx === 2 ? Scale : BookOpen;
                const iconColor = idx % 2 === 0 ? '#168CFF' : '#00D2FF';
                const cardKey = idx === 0 ? 'situation' : idx === 1 ? 'options' : idx === 2 ? 'rights' : 'nextstep';
                const localizedTitle = t(`videoSection.cards.${cardKey}Title`, card.title);
                const localizedDesc = t(`videoSection.cards.${cardKey}Desc`, card.description);

                return (
                  <div key={card.id || idx} className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white border border-neutral-200/80 shadow-2xs hover:border-[#168CFF]/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 border border-[#168CFF]/20">
                      <CardIcon className="w-4 h-4" style={{ color: iconColor }} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#0B2A5B]">{localizedTitle}</h4>
                      <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed mt-0.5">
                        {localizedDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsult?.('General Legal Consultation')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-[#0B2A5B] hover:bg-[#071B38] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{t('videoSection.ctaButton', 'Request Case Review')}</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400]" />
              </button>

              <a
                href="https://wa.me/917386444186?text=Hi%20LegalBharosa%2C%20I%20watched%20your%20overview%20video%20and%20need%20guidance%20with%20my%20loan%20issue."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/60 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>{t('contact.whatsappChat', 'Quick WhatsApp Guidance')}</span>
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="mt-4 pt-3.5 border-t border-neutral-200/60 flex items-center justify-between text-[11px] sm:text-xs text-neutral-500">
              <span className="flex items-center gap-1 font-medium text-neutral-700">
                <span className="text-[#0B2A5B] font-bold">{t('common.feedbackTitle', 'Client Feedback')}</span>
              </span>
              <span>•</span>
              <span className="font-medium text-neutral-700">{t('common.confidentialGuaranteed', '100% Confidential')}</span>
              <span>•</span>
              <span className="font-medium text-neutral-700">{t('common.barCouncilAdvocates', 'Professional Legal Guidance')}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
