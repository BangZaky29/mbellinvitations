import { useRef, useState, useCallback, useEffect } from 'react';

interface AudioPlayerResult {
  isPlaying: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  isYouTube: boolean;
}

/**
 * Ekstrak ID Video YouTube dari berbagai format URL (youtube.com, youtu.be, youtube music, shorts)
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i
  );
  return match ? match[1] : null;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

/**
 * Hook Universal untuk mengontrol background music player:
 * Mendukung audio berkas HTML5 (.mp3, .ogg, direct link) MAUPUN tautan YouTube.
 * Audio dikontrol secara terpadu melalui tombol floating music di semua template.
 */
export function useAudioPlayer(musicUrl: string): AudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerIdRef = useRef<string>(`yt-hidden-player-${Math.random().toString(36).substring(2, 9)}`);

  const ytVideoId = extractYouTubeId(musicUrl);
  const isYouTube = Boolean(ytVideoId);

  // 1. Inisialisasi YouTube Player jika URL adalah link YouTube
  useEffect(() => {
    if (!isYouTube || !ytVideoId) return;

    let isMounted = true;

    // Pastikan container div ada di body
    let container = document.getElementById(ytContainerIdRef.current);
    if (!container) {
      container = document.createElement('div');
      container.id = ytContainerIdRef.current;
      container.style.position = 'fixed';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0.01';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-9999';
      container.style.bottom = '0';
      container.style.right = '0';
      document.body.appendChild(container);
    }

    // Pasang observer agar iframe yang dibuat oleh YouTube API langsung memiliki izin compute-pressure
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLIFrameElement) {
            const currentAllow = node.getAttribute('allow') || '';
            if (!currentAllow.includes('compute-pressure')) {
              node.setAttribute(
                'allow',
                (currentAllow ? currentAllow + '; ' : '') + 'autoplay; encrypted-media; compute-pressure *'
              );
            }
          }
        });
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const initYT = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        if (ytPlayerRef.current) {
          ytPlayerRef.current.destroy();
        }

        ytPlayerRef.current = new window.YT.Player(ytContainerIdRef.current, {
          videoId: ytVideoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: ytVideoId, // Diperlukan untuk loop YouTube
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              try {
                const iframe = event.target?.getIframe?.();
                if (iframe && iframe.setAttribute) {
                  const currAllow = iframe.getAttribute('allow') || '';
                  if (!currAllow.includes('compute-pressure')) {
                    iframe.setAttribute(
                      'allow',
                      (currAllow ? currAllow + '; ' : '') + 'autoplay; encrypted-media; compute-pressure *'
                    );
                  }
                }
              } catch (_) {}
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player Audio Notice:', err);
              if (isMounted) setIsPlaying(false);
            },
          },
        });
      } catch (err) {
        console.warn('Init YT Error:', err);
      }
    };

    // Muat script YouTube Iframe API jika belum ada
    if (!window.YT) {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        initYT();
      };
    } else {
      initYT();
    }

    return () => {
      isMounted = false;
      observer.disconnect();
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (_) {}
        ytPlayerRef.current = null;
      }
      const el = document.getElementById(ytContainerIdRef.current);
      if (el) el.remove();
    };
  }, [isYouTube, ytVideoId]);

  // 2. Inisialisasi HTML5 Audio untuk MP3 / non-YouTube
  const getAudio = useCallback(() => {
    if (isYouTube) return null;
    if (!audioRef.current && musicUrl) {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.volume = 0.45;
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [isYouTube, musicUrl]);

  // Bersihkan elemen HTML5 audio saat unmount / URL berubah
  useEffect(() => {
    if (isYouTube && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [isYouTube, musicUrl]);

  // 3. Kontrol Universal Play
  const play = useCallback(() => {
    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch (e) {
          console.warn('YT playVideo error:', e);
        }
      } else {
        // Polling retry guard: jika player YT masih dalam proses inisialisasi API
        let attempts = 0;
        const retryTimer = setInterval(() => {
          attempts += 1;
          if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
            try {
              ytPlayerRef.current.playVideo();
              setIsPlaying(true);
            } catch (_) {}
            clearInterval(retryTimer);
          } else if (attempts > 20) {
            clearInterval(retryTimer);
          }
        }, 150);
      }
    } else {
      const audio = getAudio();
      if (audio) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [isYouTube, getAudio]);

  // 4. Kontrol Universal Pause
  const pause = useCallback(() => {
    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      }
    } else {
      const audio = getAudio();
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    }
  }, [isYouTube, getAudio]);

  // 5. Kontrol Universal Toggle
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return { isPlaying, toggle, play, pause, isYouTube };
}
