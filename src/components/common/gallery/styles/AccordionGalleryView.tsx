import React, { useState } from 'react';
import type { UniversalGalleryProps } from '../types';

/**
 * AccordionGalleryView
 *
 * Gaya Interactive Louvre Accordion:
 * - Panel foto berdampingan yang fleksibel dan interaktif
 * - Panel aktif membuka lebar penuh (flex-[4]) menampilkan detail foto
 * - Panel lainnya menyempit menjadi bilah vertikal artistik (flex-[1])
 * - Perlindungan Layar HP: jika foto > 4, dibagi menjadi kelompok paginasi per 4 foto
 * - Sentuhan pertama membuka lebar panel; sentuhan pada panel aktif membuka GalleryLightbox
 */
export const AccordionGalleryView: React.FC<UniversalGalleryProps> = ({
  photos = [],
  onSelectImage,
  themeAccent = {},
  className = '',
  captions = [],
}) => {
  const [activeRelativeIndex, setActiveRelativeIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  if (!photos || photos.length === 0) return null;

  const gold = themeAccent.goldAccent || '#D4AF37';
  const border = themeAccent.borderColor || gold;

  // Ukuran chunk paginasi agar tidak terlalu sempit di layar HP 430px
  const CHUNK_SIZE = 4;
  const totalPages = Math.ceil(photos.length / CHUNK_SIZE);
  const currentPhotos = photos.slice(
    currentPage * CHUNK_SIZE,
    (currentPage + 1) * CHUNK_SIZE
  );

  const handlePanelClick = (url: string, indexInChunk: number, globalIndex: number) => {
    if (activeRelativeIndex === indexInChunk) {
      // Klik pada panel yang sudah terbuka -> Buka Lightbox
      onSelectImage(url, globalIndex);
    } else {
      // Buka lebar panel tersebut
      setActiveRelativeIndex(indexInChunk);
    }
  };

  return (
    <div className={`w-full max-w-[400px] mx-auto flex flex-col items-center ${className}`}>
      {/* Container Louvre Accordion */}
      <div className="flex h-72 sm:h-80 gap-1.5 w-full overflow-hidden rounded-2xl p-1 bg-black/5">
        {currentPhotos.map((url, idx) => {
          const globalIndex = currentPage * CHUNK_SIZE + idx;
          const isActive = idx === activeRelativeIndex;
          const caption = captions[globalIndex];

          return (
            <div
              key={url || idx}
              onClick={() => handlePanelClick(url, idx, globalIndex)}
              className={`relative h-full overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ease-out select-none shadow-sm ${
                isActive ? 'flex-[4.2]' : 'flex-[1] opacity-75 hover:opacity-95'
              }`}
              style={{
                border: isActive ? `2px solid ${gold}` : `1px solid ${border}44`,
                boxShadow: isActive ? `0 8px 24px -4px ${gold}44` : 'none',
              }}
            >
              <img
                src={url}
                alt={caption || `Foto ${globalIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />

              {/* Inactive Vertical Spine Overlay */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] flex flex-col items-center justify-end pb-3 text-white">
                  <span
                    className="text-[11px] font-bold font-mono tracking-widest writing-mode-vertical"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    #{String(globalIndex + 1).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Active Full Info Banner */}
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Bar with Zoom Pill */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border"
                      style={{ borderColor: `${gold}66` }}
                    >
                      #{String(globalIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20">
                      <span className="material-symbols-outlined text-[11px] text-amber-400">
                        zoom_in
                      </span>
                      Layar Penuh
                    </span>
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-10 text-white">
                    <p className="text-xs font-semibold drop-shadow-md truncate">
                      {caption || `Potret Momen ${globalIndex + 1}`}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls jika foto > 4 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between w-full mt-3 px-1">
          <button
            type="button"
            onClick={() => {
              setCurrentPage((p) => Math.max(0, p - 1));
              setActiveRelativeIndex(0);
            }}
            disabled={currentPage === 0}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
              currentPage === 0
                ? 'opacity-40 cursor-not-allowed border-stone-400'
                : 'hover:bg-black/5 active:scale-95'
            }`}
            style={{
              borderColor: `${gold}88`,
              backgroundColor: `${gold}15`,
              color: themeAccent.badgeText || gold,
            }}
          >
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentPage(i);
                  setActiveRelativeIndex(0);
                }}
                className="w-2 h-2 rounded-full transition-all cursor-pointer"
                style={{
                  backgroundColor: i === currentPage ? gold : `${gold}40`,
                  transform: i === currentPage ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
              setActiveRelativeIndex(0);
            }}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
              currentPage === totalPages - 1
                ? 'opacity-40 cursor-not-allowed border-stone-400'
                : 'hover:bg-black/5 active:scale-95'
            }`}
            style={{
              borderColor: `${gold}88`,
              backgroundColor: `${gold}15`,
              color: themeAccent.badgeText || gold,
            }}
          >
            <span>Berikutnya</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccordionGalleryView;

