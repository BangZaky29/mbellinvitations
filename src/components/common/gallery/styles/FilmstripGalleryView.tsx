import React, { useRef, useState } from 'react';
import type { UniversalGalleryProps } from '../types';

export const FilmstripGalleryView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent,
  className = '',
  captions = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const safePhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];
  const total = safePhotos.length;

  if (total === 0) return null;

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  const border = themeAccent?.borderColor || 'rgba(255, 213, 122, 0.4)';
  const gold = themeAccent?.goldAccent || '#FFD57A';

  return (
    <div className={`w-full flex flex-col items-center select-none py-2 ${className}`}>
      {/* Top Reel Label */}
      <div className="w-full flex items-center justify-between px-3 mb-2.5">
        <div className="flex items-center gap-1.5 text-stone-600">
          <span className="material-symbols-outlined text-[16px] animate-spin-slow">movie</span>
          <span className="font-mono text-[10px] tracking-widest uppercase font-bold">
            MBELL.35MM • REEL ({total} FRAMES)
          </span>
        </div>
        <span className="text-[10px] text-stone-400 font-sans">Geser horizontal &rarr;</span>
      </div>

      {/* Filmstrip Frame Container */}
      <div
        className="w-full bg-[#181816] rounded-2xl p-2.5 shadow-xl border border-stone-800 relative overflow-hidden"
        style={{ borderColor: border }}
      >
        {/* Top Perforations */}
        <div className="flex items-center justify-between gap-2 px-1 pb-2 overflow-hidden opacity-40">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-2.5 h-1.5 rounded-xs bg-[#FDF9F2] shrink-0" />
          ))}
        </div>

        {/* Horizontal Scrollable Frame Track */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {safePhotos.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => onSelectImage(imgUrl, idx)}
              className="snap-center shrink-0 w-[240px] sm:w-[260px] aspect-[3/4] rounded-xl overflow-hidden relative shadow-lg bg-black border border-stone-700/80 cursor-pointer group"
            >
              <img
                src={imgUrl}
                alt={captions[idx] || `Film Frame ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />

              {/* Film Metadata Overlay */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-black/60 font-mono text-[9px] text-amber-300 font-bold border border-amber-300/30">
                FRAME #{String(idx + 1).padStart(2, '0')}
              </div>

              <div className="absolute bottom-2.5 right-2.5 p-1 rounded-full bg-black/60 text-white/90 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              </div>

              {captions[idx] && (
                <div className="absolute bottom-2.5 left-2.5 right-10 text-white text-xs font-serif italic truncate">
                  {captions[idx]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Perforations */}
        <div className="flex items-center justify-between gap-2 px-1 pt-2 overflow-hidden opacity-40">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-2.5 h-1.5 rounded-xs bg-[#FDF9F2] shrink-0" />
          ))}
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="w-44 h-1 bg-stone-200 rounded-full mt-3 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${Math.max(15, scrollProgress)}%`,
            backgroundColor: themeAccent?.primaryColor || gold,
          }}
        />
      </div>
    </div>
  );
};
