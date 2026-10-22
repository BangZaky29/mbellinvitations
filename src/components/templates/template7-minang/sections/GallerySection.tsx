import React from 'react';
import type { GallerySectionProps } from '../../types';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
  showAllGallery,
  setShowAllGallery,
}) => {
  if (!data.gallery || data.gallery.length === 0) return null;

  return (
    <div
      className="bg-[#FAF6EE] text-[#1B0609] px-5 pt-4 pb-12 relative"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
      id="galeri"
    >
      <div className="text-center mb-6">
        <span className="font-script text-2xl text-[#7D5C1E]">Potret Kenangan</span>
        <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#2E0A10]">
          KISAH &amp; MEMORI
        </h3>
        <div className="w-10 h-0.5 bg-[#D4AF37]/60 mx-auto mt-1" />
      </div>

      {/* Bento Grid Gallery Showcase */}
      <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
        {data.gallery.slice(0, 4).map((photoUrl, idx) => {
          // Bento item styling: item 0 is col-span-2 aspect-[4/3], items 1 & 2 are aspect-square, item 3 is col-span-2 aspect-[16/9]
          let gridClass = 'relative rounded-xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-sm group cursor-pointer';
          if (idx === 0) {
            gridClass += ' col-span-2 aspect-[4/3]';
          } else if (idx === 1 || idx === 2) {
            gridClass += ' aspect-square';
          } else if (idx === 3) {
            gridClass += ' col-span-2 aspect-[16/9]';
          }

          return (
            <div
              key={photoUrl || idx}
              className={gridClass}
              onClick={() => setSelectedImage(photoUrl)}
            >
              <img
                src={photoUrl}
                alt={`Foto Galeri ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}

        {/* Additional gallery photos when showAllGallery is true */}
        {showAllGallery &&
          data.gallery.slice(4).map((photoUrl, idx) => (
            <div
              key={photoUrl || idx + 4}
              className="relative rounded-xl overflow-hidden border border-gold/40 shadow-sm aspect-square group cursor-pointer"
              onClick={() => setSelectedImage(photoUrl)}
            >
              <img
                src={photoUrl}
                alt={`Foto Galeri ${idx + 5}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
      </div>

      {/* Button Expand/Collapse Gallery if > 4 photos */}
      {data.gallery.length > 4 && (
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gold bg-cream text-burgundy font-sans text-xs font-semibold tracking-wider hover:bg-gold/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span>
              {showAllGallery
                ? 'Tampilkan Lebih Sedikit'
                : `Lihat Foto Lainnya (${data.gallery.length - 4})`}
            </span>
            <span className="material-symbols-outlined text-[16px]">
              {showAllGallery ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
