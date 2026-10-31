import React, { useState, useRef } from 'react';
import type { UniversalGalleryProps } from '../types';

/**
 * Coverflow3DView
 *
 * Gaya 3D Coverflow Stage:
 * - Menggunakan perspektif CSS 3D (perspective: 1000px, transform-style: preserve-3d)
 * - Foto aktif di tengah tegak lurus dengan ring emas dan glow mewah
 * - Foto kiri dan kanan berotasi 3D (rotateY: +-25deg) menghadap ke arah tengah
 * - Mendukung navigasi sentuh usap (swipe), tombol panah, dan klik kartu samping untuk pindah
 * - Klik foto tengah membuka GalleryLightbox
 */
export const Coverflow3DView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent = {},
  className = '',
  captions = [],
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const total = photos.length;
  const gold = themeAccent.goldAccent || '#D4AF37';

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className={`w-full max-w-[400px] mx-auto flex flex-col items-center select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {photos.map((url, idx) => {
          // Hitung jarak offset relatif terhadap foto aktif (-2, -1, 0, +1, +2, dst.)
          const offset = idx - activeIndex;

          // Render hanya kartu dalam jangkauan -2 s.d. +2 untuk performa optimal
          if (Math.abs(offset) > 2) return null;

          const isActive = offset === 0;
          const isLeft = offset < 0;
          const isRight = offset > 0;

          // Hitung transformasi 3D
          let transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
          let zIndex = 20;
          let opacity = 1;

          if (isActive) {
            transform = 'translate3d(0, 0, 40px) scale(1) rotateY(0deg)';
            zIndex = 30;
            opacity = 1;
          } else if (isLeft) {
            const shiftX = offset === -1 ? '-52%' : '-90%';
            transform = `translate3d(${shiftX}, 0, ${offset * 30}px) scale(0.84) rotateY(26deg)`;
            zIndex = 20 + offset;
            opacity = offset === -1 ? 0.72 : 0.4;
          } else if (isRight) {
            const shiftX = offset === 1 ? '52%' : '90%';
            transform = `translate3d(${shiftX}, 0, -${offset * 30}px) scale(0.84) rotateY(-26deg)`;
            zIndex = 20 - offset;
            opacity = offset === 1 ? 0.72 : 0.4;
          }

          return (
            <div
              key={url || idx}
              onClick={() => {
                if (isActive) {
                  onSelectImage(url, idx);
                } else {
                  setActiveIndex(idx);
                }
              }}
              className="absolute w-[210px] sm:w-[230px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 ease-out"
              style={{
                transform,
                zIndex,
                opacity,
                transformStyle: 'preserve-3d',
                border: isActive ? `2px solid ${gold}` : '1px solid rgba(255,255,255,0.2)',
                boxShadow: isActive
                  ? `0 16px 36px -8px rgba(0,0,0,0.45), 0 0 20px -2px ${gold}44`
                  : '0 8px 18px -4px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={url}
                alt={captions[idx] || `Foto Galeri ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
              />

              {/* Glossy Reflection Gradient */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)'
                    : 'rgba(0, 0, 0, 0.35)',
                }}
              />

              {/* Zoom Pill for Active Item */}
              {isActive && (
                <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                  <span className="material-symbols-outlined text-[12px] text-amber-400">zoom_in</span>
                  <span>Perbesar</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Panah Navigasi Kiri */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md cursor-pointer transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        )}

        {/* Panah Navigasi Kanan */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md cursor-pointer transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        )}
      </div>

      {/* Bar Indikator Dots & Counter Bawah */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ke foto ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === activeIndex ? '20px' : '6px',
                backgroundColor: i === activeIndex ? gold : `${gold}40`,
              }}
            />
          ))}
        </div>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${gold}18`,
            color: themeAccent.badgeText || gold,
            border: `1px solid ${gold}44`,
          }}
        >
          {activeIndex + 1} / {total}
        </span>
      </div>
    </div>
  );
};

export default Coverflow3DView;

