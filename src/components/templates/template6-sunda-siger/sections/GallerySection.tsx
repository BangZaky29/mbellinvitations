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
    <section
      className="w-full px-5 py-12 bg-white flex flex-col items-center text-center border-b border-[#ede9e1]"
      id="galeri"
    >
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase reveal">
        Galeri Memori
      </span>
      <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2 reveal delay-100">
        Kisah Dua Hati
      </h2>
      <p className="text-xs text-[#4e4639] italic mb-6 reveal delay-150">
        “Dua hati, satu janji, selamanya dalam cinta suci.”
      </p>

      {/* 2-Column Responsive Masonry Showcase */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4 reveal-scale delay-200">
        <div className="flex flex-col gap-3">
          {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
            .filter((_, idx) => idx % 2 === 0)
            .map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`rounded-2xl overflow-hidden shadow-md bg-[#f4efe4] cursor-pointer hover:opacity-95 transition-opacity ${
                  idx % 2 === 0 ? 'h-52' : 'h-36'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx * 2 + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-3">
          {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
            .filter((_, idx) => idx % 2 === 1)
            .map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`rounded-2xl overflow-hidden shadow-md bg-[#f4efe4] cursor-pointer hover:opacity-95 transition-opacity ${
                  idx % 2 === 0 ? 'h-36' : 'h-52'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx * 2 + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Tombol Lihat Selengkapnya jika foto > 4 */}
      {data.gallery.length > 4 && (
        <div className="text-center mt-2 mb-2 reveal delay-250">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c5a059]/40 bg-white hover:bg-[#fbf9f6] text-xs font-semibold tracking-wider uppercase text-[#1b1c1a] shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>
              {showAllGallery
                ? 'Tampilkan Lebih Sedikit'
                : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#8a6822]">
              {showAllGallery ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
