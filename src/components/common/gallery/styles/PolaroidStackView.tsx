import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

export const PolaroidStackView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent,
  className = '',
  captions = [],
}) => {
  const [topIndex, setTopIndex] = useState(0);
  const safePhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];
  const total = safePhotos.length;

  if (total === 0) return null;

  const handleNextCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTopIndex((prev) => (prev + 1) % total);
  };

  const handlePrevCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTopIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const rotations = [-2.5, 2, -1.5, 2.5, -3, 1.5, -2, 2];
  const gold = themeAccent?.goldAccent || '#FFD57A';
  const border = themeAccent?.borderColor || 'rgba(255, 213, 122, 0.4)';

  // Visual stack: top 3 cards shown in stack
  const stackCards = [
    { idx: topIndex, z: 30, scale: 1, y: 0, rot: rotations[topIndex % rotations.length] },
    { idx: (topIndex + 1) % total, z: 20, scale: 0.95, y: 12, rot: rotations[(topIndex + 1) % rotations.length] },
    { idx: (topIndex + 2) % total, z: 10, scale: 0.90, y: 22, rot: rotations[(topIndex + 2) % rotations.length] },
  ].filter((c, pos, arr) => arr.findIndex((x) => x.idx === c.idx) === pos && total > 1 ? true : pos === 0);

  return (
    <div className={`w-full flex flex-col items-center select-none py-2 ${className}`}>
      {/* Top Hint and Counter */}
      <div className="w-full flex items-center justify-between px-3 mb-3">
        <span
          className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full shadow-xs backdrop-blur-md border"
          style={{
            backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
            color: themeAccent?.badgeText || gold,
            borderColor: border,
          }}
        >
          Foto {topIndex + 1} dari {total}
        </span>
        <span className="text-[10px] text-stone-500 font-sans tracking-wider uppercase">
          Sentuh foto untuk geser kartu
        </span>
      </div>

      {/* Polaroid Deck Stack Area */}
      <div className="relative w-full max-w-[310px] h-[390px] flex items-center justify-center my-2">
        {stackCards.reverse().map((card) => {
          const photoUrl = safePhotos[card.idx];
          const isTop = card.idx === topIndex;

          return (
            <div
              key={card.idx}
              onClick={() => {
                if (isTop) {
                  handleNextCard();
                } else {
                  setTopIndex(card.idx);
                }
              }}
              style={{
                zIndex: card.z,
                transform: `translate3d(0, ${card.y}px, 0) rotate(${card.rot}deg) scale(${card.scale})`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
              className="absolute w-[280px] bg-[#FFFDF9] rounded-xl p-3 pb-5 shadow-2xl border border-stone-200/80 cursor-pointer active:scale-95 group"
            >
              {/* Photo Frame Container */}
              <div className="relative w-full aspect-[4/4.5] rounded-lg overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src={photoUrl}
                  alt={captions[card.idx] || `Polaroid ${card.idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Direct Lightbox Button on Top Card */}
                {isTop && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectImage(photoUrl, card.idx);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white shadow-md hover:bg-black/80 transition-all cursor-pointer"
                    title="Perbesar Foto"
                  >
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  </button>
                )}
              </div>

              {/* Bottom Handwritten / Serif Caption Area */}
              <div className="pt-3 px-1 flex items-center justify-between">
                <span className="font-serif italic text-xs text-stone-700 tracking-wide truncate">
                  {captions[card.idx] || `Our Romantic Memories • #${card.idx + 1}`}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {card.idx + 1}/{total}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Buttons (Prev / Shuffle Next) */}
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={handlePrevCard}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border shadow-xs transition-all active:scale-90 cursor-pointer"
          style={{
            backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
            color: gold,
            borderColor: border,
          }}
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={handleNextCard}
          className="px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border shadow-xs transition-all active:scale-90 cursor-pointer"
          style={{
            backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
            color: gold,
            borderColor: border,
          }}
        >
          <span>Kartu Berikutnya</span>
          <span className="material-symbols-outlined text-[14px]">style</span>
        </button>
      </div>
    </div>
  );
};

