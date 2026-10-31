import React, { useState, useRef, useCallback } from 'react';
import type { UniversalGalleryProps } from '../types';

export const CarouselSliderView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent,
  className = '',
  captions = [],
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const safePhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];
  const total = safePhotos.length;

  // Handle safe index wrap-around
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Touch / Pointer Gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
    touchDeltaX.current = 0;
    setIsSwiping(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSwiping || touchStartX.current === null) return;
    const delta = e.clientX - touchStartX.current;
    touchDeltaX.current = delta;
    setDragOffset(delta);
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent) => {
    if (!isSwiping) return;
    setIsSwiping(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Fallback
    }

    const delta = touchDeltaX.current;
    touchStartX.current = null;
    setDragOffset(0);

    // Threshold swipe 45px
    if (delta > 45) {
      handlePrev();
    } else if (delta < -45) {
      handleNext();
    }
  };

  if (total === 0) return null;

  const currentPhoto = safePhotos[activeIndex];
  const gold = themeAccent?.goldAccent || '#FFD57A';
  const border = themeAccent?.borderColor || 'rgba(255, 213, 122, 0.4)';

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* Top Slide Counter Badge & Navigation Chevrons */}
      <div className="w-full flex items-center justify-between px-2 mb-2.5">
        <span
          className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full shadow-xs backdrop-blur-md border"
          style={{
            backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
            color: themeAccent?.badgeText || gold,
            borderColor: border,
          }}
        >
          Momen {activeIndex + 1} dari {total}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 hover:opacity-90 shadow-sm border cursor-pointer"
            style={{
              backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
              color: gold,
              borderColor: border,
            }}
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 hover:opacity-90 shadow-sm border cursor-pointer"
            style={{
              backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
              color: gold,
              borderColor: border,
            }}
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Main Slide Carousel Track with Peek Previews */}
      <div
        className="w-full relative overflow-hidden rounded-2xl touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="w-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${dragOffset}px)`,
          }}
        >
          {/* Main Focused Card */}
          <div
            onClick={() => {
              if (Math.abs(touchDeltaX.current) < 5) {
                onSelectImage(currentPhoto, activeIndex);
              }
            }}
            className="relative w-full aspect-[4/5] max-h-[460px] rounded-2xl overflow-hidden shadow-xl border bg-black/10 group cursor-pointer"
            style={{ borderColor: border }}
          >
            <img
              src={currentPhoto}
              alt={captions[activeIndex] || `Foto Galeri ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle Gradient Shadow & Tap to Zoom Hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Magnify Hint Button */}
            <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 text-white/90 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            </div>

            {/* Optional Caption */}
            {captions[activeIndex] && (
              <div className="absolute bottom-3 left-3 right-12 text-white text-xs font-medium drop-shadow-md truncate">
                {captions[activeIndex]}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dot Pagination Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {safePhotos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Buka foto nomor ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? 'w-6 opacity-100 shadow-xs' : 'w-1.5 opacity-40 hover:opacity-75'
              }`}
              style={{
                backgroundColor: idx === activeIndex ? gold : themeAccent?.primaryColor || '#785A05',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
