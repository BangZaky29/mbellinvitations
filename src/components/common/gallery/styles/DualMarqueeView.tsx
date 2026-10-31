import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

/**
 * DualMarqueeView
 *
 * Gaya Infinite Dual-Reel Marquee:
 * - 2 baris pita foto horizontal yang mengalir otomatis berlawanan arah secara terus-menerus
 * - Baris 1: Mengalir ke kiri
 * - Baris 2: Mengalir ke kanan
 * - Pause on hover / touch saat disentuh tamu
 * - Gandakan array jika foto sedikit (< 4) agar loop mulus tanpa jeda
 * - Setiap foto dapat diklik untuk membuka GalleryLightbox
 */
export const DualMarqueeView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent = {},
  className = '',
  captions = [],
}) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!photos || photos.length === 0) return null;

  const gold = themeAccent.goldAccent || '#D4AF37';
  const border = themeAccent.borderColor || gold;

  // Bagi foto menjadi 2 baris (ganjil & genap)
  let row1 = photos.filter((_, i) => i % 2 === 0);
  let row2 = photos.filter((_, i) => i % 2 === 1);

  // Jika salah satu baris kosong (misal cuma ada 1 foto)
  if (row2.length === 0) {
    row2 = [...row1];
  }

  // Gandakan array agar loop seamless (minimal 4 item per baris)
  const duplicateToMin = (arr: string[], minCount = 4) => {
    let result = [...arr];
    while (result.length < minCount) {
      result = [...result, ...arr];
    }
    // Duplikasi 1x lagi untuk efek looping CSS 100% ke 0%
    return [...result, ...result];
  };

  const streamRow1 = duplicateToMin(row1, 4);
  const streamRow2 = duplicateToMin(row2, 4);

  return (
    <div
      className={`w-full max-w-[420px] mx-auto flex flex-col gap-2.5 overflow-hidden select-none py-1 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-left 28s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-right 28s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Baris 1: Mengalir ke Kiri */}
      <div className="relative w-full overflow-hidden mask-gradient-x">
        <div
          className={`animate-marquee-left gap-2.5 ${isPaused ? 'marquee-paused' : ''}`}
        >
          {streamRow1.map((url, i) => {
            const originalIndex = photos.indexOf(url);
            const actualIndex = originalIndex >= 0 ? originalIndex : 0;

            return (
              <div
                key={`row1-${i}`}
                onClick={() => onSelectImage(url, actualIndex)}
                className="relative shrink-0 w-36 sm:w-40 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm group hover:scale-[1.03] transition-transform duration-300"
                style={{
                  border: `1.5px solid ${border}66`,
                }}
              >
                <img
                  src={url}
                  alt={captions[actualIndex] || `Foto Galeri ${actualIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px] drop-shadow-md">
                    zoom_in
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Baris 2: Mengalir ke Kanan */}
      <div className="relative w-full overflow-hidden mask-gradient-x">
        <div
          className={`animate-marquee-right gap-2.5 ${isPaused ? 'marquee-paused' : ''}`}
        >
          {streamRow2.map((url, i) => {
            const originalIndex = photos.indexOf(url);
            const actualIndex = originalIndex >= 0 ? originalIndex : 0;

            return (
              <div
                key={`row2-${i}`}
                onClick={() => onSelectImage(url, actualIndex)}
                className="relative shrink-0 w-36 sm:w-40 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm group hover:scale-[1.03] transition-transform duration-300"
                style={{
                  border: `1.5px solid ${border}66`,
                }}
              >
                <img
                  src={url}
                  alt={captions[actualIndex] || `Foto Galeri ${actualIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px] drop-shadow-md">
                    zoom_in
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Touch / Hover hint */}
      <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] opacity-80" style={{ color: `${gold}ee` }}>
        <span
          className="w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: gold }}
        />
        <span>Sentuh untuk menjeda aliran • Ketuk foto untuk memperbesar</span>
      </div>
    </div>
  );
};

export default DualMarqueeView;

