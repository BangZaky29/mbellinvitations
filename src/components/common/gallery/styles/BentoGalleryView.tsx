import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

export const BentoGalleryView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent,
  className = '',
  captions = [],
}) => {
  const [showAll, setShowAll] = useState(false);
  const safePhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];
  const total = safePhotos.length;

  if (total === 0) return null;

  const border = themeAccent?.borderColor || 'rgba(255, 213, 122, 0.4)';
  const gold = themeAccent?.goldAccent || '#FFD57A';
  const cardBg = themeAccent?.cardBg || '#F7F3EC';

  // Render bento set 4 photos
  const renderBentoBatch = (batchPhotos: string[], startIndex: number) => {
    const p0 = batchPhotos[0];
    const p1 = batchPhotos[1];
    const p2 = batchPhotos[2];
    const p3 = batchPhotos[3];

    return (
      <div key={startIndex} className="w-full grid grid-cols-2 gap-2.5">
        {/* Card 1: Large Left Card (Aspect 3/4) */}
        {p0 && (
          <div
            onClick={() => onSelectImage(p0, startIndex)}
            className="relative rounded-2xl overflow-hidden shadow-md aspect-[3/4] border cursor-pointer group"
            style={{ backgroundColor: cardBg, borderColor: border }}
          >
            <img
              src={p0}
              alt={captions[startIndex] || `Galeri ${startIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/60 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
            </div>
            {captions[startIndex] && (
              <span
                className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border backdrop-blur-md"
                style={{
                  backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
                  color: gold,
                  borderColor: border,
                }}
              >
                {captions[startIndex]}
              </span>
            )}
          </div>
        )}

        {/* Right Column Stack (2 Squares) */}
        <div className="flex flex-col gap-2.5">
          {p1 && (
            <div
              onClick={() => onSelectImage(p1, startIndex + 1)}
              className="relative rounded-2xl overflow-hidden shadow-md aspect-square border cursor-pointer group"
              style={{ backgroundColor: cardBg, borderColor: border }}
            >
              <img
                src={p1}
                alt={captions[startIndex + 1] || `Galeri ${startIndex + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          )}
          {p2 && (
            <div
              onClick={() => onSelectImage(p2, startIndex + 2)}
              className="relative rounded-2xl overflow-hidden shadow-md aspect-square border cursor-pointer group"
              style={{ backgroundColor: cardBg, borderColor: border }}
            >
              <img
                src={p2}
                alt={captions[startIndex + 2] || `Galeri ${startIndex + 3}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          )}
        </div>

        {/* Card 4: Full Width Span Panoramic (Aspect 16/9) */}
        {p3 && (
          <div
            onClick={() => onSelectImage(p3, startIndex + 3)}
            className="col-span-2 relative rounded-2xl overflow-hidden shadow-md aspect-[16/9] border cursor-pointer group"
            style={{ backgroundColor: cardBg, borderColor: border }}
          >
            <img
              src={p3}
              alt={captions[startIndex + 3] || `Galeri ${startIndex + 4}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {captions[startIndex + 3] ? (
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="font-sans text-[10px] uppercase font-bold" style={{ color: gold }}>
                  Potret Momen
                </span>
                <p className="font-serif text-sm font-semibold leading-tight text-white drop-shadow">
                  {captions[startIndex + 3]}
                </p>
              </div>
            ) : (
              <div className="absolute bottom-2.5 right-3 p-1 rounded-full bg-black/50 text-white">
                <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const initialBatch = safePhotos.slice(0, 4);
  const remainingBatches = [];
  if (showAll && total > 4) {
    for (let i = 4; i < total; i += 4) {
      remainingBatches.push({
        photos: safePhotos.slice(i, i + 4),
        startIndex: i,
      });
    }
  }

  return (
    <div className={`w-full flex flex-col items-center gap-3 select-none ${className}`}>
      {renderBentoBatch(initialBatch, 0)}

      {remainingBatches.map((batch) => renderBentoBatch(batch.photos, batch.startIndex))}

      {/* Expand / Collapse Button if > 4 Photos */}
      {total > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-xs transition-all active:scale-95 cursor-pointer border backdrop-blur-md"
          style={{
            backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
            color: gold,
            borderColor: border,
          }}
        >
          <span>
            {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Selengkapnya (+${total - 4} Foto)`}
          </span>
          <span className="material-symbols-outlined text-[16px]">
            {showAll ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      )}
    </div>
  );
};

