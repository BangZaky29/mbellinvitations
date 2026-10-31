import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

export const MasonryGalleryView: React.FC<UniversalGalleryProps> = ({
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

  const displayLimit = showAll ? total : Math.min(6, total);
  const displayedPhotos = safePhotos.slice(0, displayLimit);

  const col1 = displayedPhotos.filter((_, idx) => idx % 2 === 0);
  const col2 = displayedPhotos.filter((_, idx) => idx % 2 === 1);

  const border = themeAccent?.borderColor || 'rgba(255, 213, 122, 0.4)';
  const gold = themeAccent?.goldAccent || '#FFD57A';

  const heightsCol1 = ['h-60', 'h-44', 'h-64', 'h-48', 'h-56', 'h-44'];
  const heightsCol2 = ['h-44', 'h-64', 'h-48', 'h-60', 'h-44', 'h-56'];

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      <div className="w-full grid grid-cols-2 gap-3">
        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          {col1.map((imgUrl, i) => {
            const originalIndex = i * 2;
            const hClass = heightsCol1[i % heightsCol1.length];
            return (
              <div
                key={originalIndex}
                onClick={() => onSelectImage(imgUrl, originalIndex)}
                className={`relative rounded-2xl overflow-hidden shadow-md border cursor-pointer group bg-black/10 ${hClass}`}
                style={{ borderColor: border }}
              >
                <img
                  src={imgUrl}
                  alt={captions[originalIndex] || `Galeri ${originalIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/50 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          {col2.map((imgUrl, i) => {
            const originalIndex = i * 2 + 1;
            const hClass = heightsCol2[i % heightsCol2.length];
            return (
              <div
                key={originalIndex}
                onClick={() => onSelectImage(imgUrl, originalIndex)}
                className={`relative rounded-2xl overflow-hidden shadow-md border cursor-pointer group bg-black/10 ${hClass}`}
                style={{ borderColor: border }}
              >
                <img
                  src={imgUrl}
                  alt={captions[originalIndex] || `Galeri ${originalIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/50 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Button Expand if total > 6 */}
      {total > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-xs transition-all active:scale-95 cursor-pointer border backdrop-blur-md"
          style={{
            backgroundColor: themeAccent?.badgeBg || 'rgba(42, 0, 3, 0.85)',
            color: gold,
            borderColor: border,
          }}
        >
          <span>
            {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${total - 6} Foto Lainnya)`}
          </span>
          <span className="material-symbols-outlined text-[16px]">
            {showAll ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      )}
    </div>
  );
};

