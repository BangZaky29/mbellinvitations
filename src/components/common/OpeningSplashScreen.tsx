import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface OpeningSplashScreenProps {
  onFinish?: () => void;
  videoSrc?: string;
  durationSeconds?: number;
}

export const OpeningSplashScreen: React.FC<OpeningSplashScreenProps> = ({
  onFinish,
  videoSrc = '/opening.mp4',
  durationSeconds = 10,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isRendered, setIsRendered] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [needsInteraction, setNeedsInteraction] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);

  // 1. Selesaikan intro dan memicu animasi fade out yang mulus
  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);

    setTimeout(() => {
      setIsRendered(false);
      onFinish?.();
    }, 900);
  }, [isFadingOut, onFinish]);

  // Fungsi untuk menyalakan suara saat ada interaksi resmi dari pengguna (click / touchend)
  const enableAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      setNeedsInteraction(false);

      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } catch {
      // Abaikan jika tidak diizinkan
    }
  }, []);

  // 2. Smart Autoplay: Coba langsung dengan audio, fallback muted tanpa error console jika diblokir browser
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const startPlayback = async () => {
      try {
        // Percobaan 1: Langsung putar dengan suara (jika pengguna sudah pernah berinteraksi sebelumnya)
        video.muted = false;
        video.volume = 1.0;
        await video.play();
        if (isMounted) {
          setIsMuted(false);
          setNeedsInteraction(false);
        }
      } catch {
        // Percobaan 2: Browser memblokir audio unmuted -> Putar muted agar animasi visual tetap berjalan
        if (!isMounted || !videoRef.current) return;
        videoRef.current.muted = true;
        setIsMuted(true);
        setNeedsInteraction(true);

        try {
          await videoRef.current.play();
        } catch {
          // Abaikan
        }
      }
    };

    startPlayback();

    // Gunakan 'click' dan 'touchend' (event aktivasi resmi HTML Media) agar audio langsung aktif tanpa pause
    const handleGlobalGesture = () => {
      enableAudio();
    };

    window.addEventListener('click', handleGlobalGesture, { once: true });
    window.addEventListener('touchend', handleGlobalGesture, { once: true });

    return () => {
      isMounted = false;
      window.removeEventListener('click', handleGlobalGesture);
      window.removeEventListener('touchend', handleGlobalGesture);
    };
  }, [enableAudio]);

  // 3. Fallback timer maksimal (duration + 0.5 detik)
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, (durationSeconds + 0.5) * 1000);

    return () => clearTimeout(fallbackTimer);
  }, [durationSeconds, handleFinish]);

  // 4. Monitor waktu & progress bar
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const dur = video.duration || durationSeconds;
      const current = video.currentTime;
      const pct = Math.min(100, Math.max(0, (current / dur) * 100));
      setProgress(pct);

      const remaining = Math.max(0, Math.ceil(dur - current));
      setSecondsLeft(remaining);

      if (dur > 0 && current >= dur - 0.25) {
        handleFinish();
      }
    }
  };

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-label="Opening Loading Screen"
      onClick={enableAudio}
      className={`fixed inset-0 z-[99999] w-screen h-screen select-none overflow-hidden bg-[#FAF7F2] transition-all duration-900 ease-in-out cursor-pointer ${
        isFadingOut
          ? 'opacity-0 scale-[1.02] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* 
        Video Responsif:
        - Mobile: object-contain (dikecilkan proporsional di tengah layar agar seluruh bunga & teks utuh terlihat)
        - Desktop (md ke atas): object-cover (penuh 16:9 mengisi seluruh layar monitor)
      */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-0 pointer-events-none">
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          preload="auto"
          onEnded={handleFinish}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-auto max-h-[65vh] sm:max-h-[75vh] object-contain md:w-full md:h-full md:max-h-full md:object-cover pointer-events-none select-none transition-all duration-300"
        />
      </div>

      {/* Indikator Interaktif Jika Browser Memblokir Suara Awal */}
      {needsInteraction && isMuted && (
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-30 animate-pulse">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              enableAudio();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/60 hover:bg-stone-900/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">volume_off</span>
            <span>Ketuk layar untuk suara</span>
          </button>
        </div>
      )}

      {/* Top Bar: Skip Button */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="group flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-stone-900/10 hover:bg-stone-900/20 backdrop-blur-md text-stone-800 text-xs sm:text-sm font-semibold border border-stone-300/40 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
        >
          <span>Lewati</span>
          <span className="text-[11px] opacity-75 font-mono">({secondsLeft}s)</span>
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Bottom Progress Bar & Brand Label */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-44 sm:w-64 flex flex-col items-center gap-2 z-30 pointer-events-none">
        <div className="w-full h-1 bg-stone-300/40 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-rose-400 to-amber-500 rounded-full transition-[width] ease-linear duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-[11px] font-serif tracking-[0.25em] text-stone-600 uppercase font-medium drop-shadow-sm">
          mbell invitations
        </p>
      </div>
    </div>
  );
};