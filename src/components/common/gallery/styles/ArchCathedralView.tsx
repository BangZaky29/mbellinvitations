import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

/**
 * ArchCathedralView
 *
 * Gaya Royal Arch Window / Kubah Adat & Istana:
 * - Siluet kubah melengkung di bagian atas (rounded-t-full rounded-b-2xl)
 * - Garis ganda aksen emas tipis khas kerajaan Nusantara / arsitektur Islami
 * - Foto #1 tampil sebagai Hero Arch megah di atas
 * - Foto berikutnya disusun dalam grid 2-kolom Arch simetris
 * - Tombol ekspansi interaktif jika foto > 5
 */
export const ArchCathedralView: React.FC<UniversalGalleryProps> = ({
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
  const cardBg = themeAccent.cardBg || 'transparent';

  const heroPhoto = photos[0];
  const gridPhotos = photos.slice(1);
  const displayedGrid = showAll ? gridPhotos : gridPhotos.slice(0, 4);

  return (
    <div className={`w-full max-w-[380px] mx-auto flex flex-col items-center ${className}`}>
      {/* 1. Hero Cathedral Arch (Foto #1) */}
      {heroPhoto && (
        <div
          onClick={() => onSelectImage(heroPhoto, 0)}
          className="group relative w-full aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
          style={{
            backgroundColor: cardBg,
            border: `2px solid ${gold}`,
            boxShadow: `0 8px 24px -6px ${gold}33`,
          }}
        >
          {/* Inner Golden Arch Inset Frame */}
          <div
            className="absolute inset-1.5 rounded-t-full rounded-b-xl border pointer-events-none z-10"
            style={{ borderColor: `${gold}55` }}
          />

          <img
            src={heroPhoto}
            alt={captions[0] || 'Foto Utama Galeri'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Hover Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Hero Bottom Badge */}
          <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/15 text-white">
            <span className="text-[11px] font-medium tracking-wide truncate">
              {captions[0] || 'Momen Utama'}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${gold}33`,
                color: gold,
                border: `1px solid ${gold}66`,
              }}
            >
              #01
            </span>
          </div>
        </div>
      )}

      {/* 2. Grid 2 Kolom Cathedral Arch (Foto #2 dst.) */}
      {gridPhotos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 w-full mt-3">
          {displayedGrid.map((url, idx) => {
            const actualIndex = idx + 1;
            const caption = captions[actualIndex];

            return (
              <div
                key={url || idx}
                onClick={() => onSelectImage(url, actualIndex)}
                className="group relative w-full aspect-[3/4] rounded-t-full rounded-b-xl overflow-hidden shadow-sm cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: cardBg,
                  border: `1.5px solid ${border}88`,
                }}
              >
                {/* Inner Gold Arch Outline */}
                <div
                  className="absolute inset-1 rounded-t-full rounded-b-lg border pointer-events-none z-10"
                  style={{ borderColor: `${gold}44` }}
                />

                <img
                  src={url}
                  alt={caption || `Foto Galeri ${actualIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Index Pill */}
                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white border"
                    style={{ borderColor: `${gold}66` }}
                  >
                    #{String(actualIndex + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Tombol Ekspansi (Jika Foto > 5) */}
      {gridPhotos.length > 4 && (
        <div className="text-center mt-4 w-full">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            style={{
              borderColor: `${gold}88`,
              backgroundColor: `${gold}18`,
              color: themeAccent.badgeText || gold,
            }}
          >
            <span>
              {showAll
                ? 'Tampilkan Lebih Sedikit'
                : `Lihat Foto Lainnya (${gridPhotos.length - 4})`}
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

export default ArchCathedralView;

