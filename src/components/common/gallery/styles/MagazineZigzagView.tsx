import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

/**
 * MagazineZigzagView
 *
 * Gaya Editorial Zig-Zag Storyboard:
 * - Tata letak vertikal bergaya majalah mode kontemporer (Vogue editorial)
 * - Selang-seling kiri-kanan (Foto ganjil rata kiri ~80%, Foto genap rata kanan ~80%)
 * - Dihubungkan dengan garis vertikal halus (timeline spine) di bagian tengah
 * - Tipografi nomor urut Serif besar emas (01, 02, 03) overlapping di sudut bingkai
 * - Klik foto membuka GalleryLightbox
 */
export const MagazineZigzagView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent = {},
  className = '',
  captions = [],
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!photos || photos.length === 0) return null;

  const gold = themeAccent.goldAccent || '#D4AF37';
  const border = themeAccent.borderColor || gold;

  const displayedPhotos = showAll ? photos : photos.slice(0, 5);

  return (
    <div className={`relative w-full max-w-[390px] mx-auto flex flex-col py-2 ${className}`}>
      {/* Garis vertikal tengah (Connecting Spine) */}
      <div
        className="absolute top-6 bottom-12 left-1/2 -translate-x-1/2 w-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${gold}44 15%, ${gold}44 85%, transparent 100%)`,
        }}
      />

      <div className="flex flex-col gap-8 w-full relative z-10">
        {displayedPhotos.map((url, idx) => {
          const isLeft = idx % 2 === 0;
          const numberStr = String(idx + 1).padStart(2, '0');
          const caption = captions[idx];

          return (
            <div
              key={url || idx}
              className={`relative flex items-center w-full ${
                isLeft ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Card Bingkai Foto */}
              <div
                onClick={() => onSelectImage(url, idx)}
                className={`group relative w-[82%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  isLeft ? 'mr-auto' : 'ml-auto'
                }`}
                style={{
                  border: `1.5px solid ${border}66`,
                  boxShadow: `0 8px 20px -6px ${gold}33`,
                }}
              >
                <img
                  src={url}
                  alt={caption || `Foto Storyboard ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-75 transition-opacity" />

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/25 shadow-lg">
                    <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                  </span>
                </div>

                {/* Caption Bar jika ada */}
                {caption && (
                  <div className="absolute bottom-2 inset-x-2.5 z-10 text-white">
                    <p className="text-[11px] font-medium truncate drop-shadow-md">
                      {caption}
                    </p>
                  </div>
                )}
              </div>

              {/* Tipografi Nomor Serif Raksasa Overlapping */}
              <span
                className={`absolute -top-4 font-serif font-black text-4xl sm:text-5xl pointer-events-none select-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                  isLeft ? 'right-2' : 'left-2'
                }`}
                style={{
                  color: gold,
                  opacity: 0.85,
                  textShadow: `0 2px 10px ${gold}44`,
                }}
              >
                {numberStr}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tombol Ekspansi jika foto > 5 */}
      {photos.length > 5 && (
        <div className="text-center mt-6 w-full relative z-20">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            style={{
              borderColor: `${gold}88`,
              backgroundColor: `${gold}18`,
              color: themeAccent.badgeText || gold,
            }}
          >
            <span>
              {showAll
                ? 'Tampilkan Lebih Sedikit'
                : `Lihat Foto Lainnya (${photos.length - 5})`}
            </span>
            <span className="material-symbols-outlined text-[16px]">
              {showAll ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MagazineZigzagView;

