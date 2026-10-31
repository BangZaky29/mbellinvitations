import React, { useState, useRef, useEffect } from 'react';
import type { UniversalGalleryProps } from '../types';

/**
 * FeaturedThumbnailsView
 *
 * Gaya Spotlight + Thumbnail Dock:
 * - 1 Layar Foto Utama Besar di atas dengan transisi crossfade halus
 * - Terhubung langsung dengan Thumbnail Strip Bar horizontal di bawahnya
 * - Mengetuk thumbnail kecil berganti foto secara instan & elegan
 * - Tombol zoom / klik foto utama membuka GalleryLightbox
 */
export const FeaturedThumbnailsView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent = {},
  className = '',
  captions = [],
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);

  if (!photos || photos.length === 0) return null;

  const total = photos.length;
  const gold = themeAccent.goldAccent || '#D4AF37';
  const border = themeAccent.borderColor || gold;

  const activePhoto = photos[activeIndex] || photos[0];

  // Auto-scroll thumbnail terpilih agar selalu terlihat di tengah strip dock
  useEffect(() => {
    if (!thumbsContainerRef.current) return;
    const activeThumb = thumbsContainerRef.current.children[activeIndex] as HTMLElement | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div className={`w-full max-w-[390px] mx-auto flex flex-col items-center ${className}`}>
      {/* 1. Main Spotlight Stage */}
      <div
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border cursor-pointer group bg-black/10"
        style={{
          borderColor: `${border}66`,
          boxShadow: `0 10px 30px -8px ${gold}33`,
        }}
        onClick={() => onSelectImage(activePhoto, activeIndex)}
      >
        <img
          key={activePhoto}
          src={activePhoto}
          alt={captions[activeIndex] || `Foto Utama Galeri ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300 ease-out"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        />

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Top Floating Badge & Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border"
            style={{ borderColor: `${gold}55` }}
          >
            {activeIndex + 1} / {total}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-medium group-hover:bg-black/80 transition-colors">
            <span className="material-symbols-outlined text-[13px] text-amber-400">fullscreen</span>
            <span>Perbesar</span>
          </div>
        </div>

        {/* Caption Bar Bawah */}
        {captions[activeIndex] && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 text-white">
            <p className="text-xs font-medium truncate drop-shadow-md">
              {captions[activeIndex]}
            </p>
          </div>
        )}
      </div>

      {/* 2. Horizontal Thumbnail Strip Dock */}
      {total > 1 && (
        <div
          ref={thumbsContainerRef}
          className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-3 px-1 mt-1 scroll-smooth"
        >
          {photos.map((url, idx) => {
            const isCurrent = idx === activeIndex;

            return (
              <button
                key={url || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Pilih foto ${idx + 1}`}
                className={`relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                  isCurrent
                    ? 'scale-105 shadow-md -translate-y-0.5'
                    : 'opacity-65 hover:opacity-100 hover:scale-100'
                }`}
                style={{
                  border: isCurrent ? `2.5px solid ${gold}` : '1.5px solid transparent',
                  boxShadow: isCurrent ? `0 4px 12px ${gold}44` : 'none',
                }}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Active Indicator Overlay */}
                {isCurrent && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: `${gold}15` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Helper text info */}
      <span className="text-[10px] font-medium mt-1 flex items-center gap-1 opacity-80" style={{ color: `${gold}ee` }}>
        <span className="material-symbols-outlined text-[12px]" style={{ color: gold }}>
          touch_app
        </span>
        Ketuk thumbnail untuk mengganti foto • Ketuk foto utama untuk layar penuh
      </span>
    </div>
  );
};

export default FeaturedThumbnailsView;
