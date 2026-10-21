import React from 'react';
import type { GallerySectionProps } from '../../types';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
  showAllGallery,
  setShowAllGallery,
}) => {
  return (
    <section id="gallery" className="py-12 px-6">
      <div className="text-center mb-8 reveal">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Dokumentasi
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Galeri Kenangan
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 font-light">
          Potret momen kebersamaan yang terukir abadi
        </p>
      </div>

      {/* 2-Column Editorial Masonry Grid */}
      <div className="grid grid-cols-2 gap-3 reveal-scale delay-100">
        {/* Column 1 */}
        <div className="space-y-3">
          {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
            .filter((_, idx) => idx % 2 === 0)
            .map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className="overflow-hidden rounded-lg border border-border-subtle bg-white shadow-sm cursor-pointer group"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx * 2 + 1}`}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${idx % 2 === 0 ? 'h-64' : 'h-44'
                    }`}
                />
              </div>
            ))}
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
            .filter((_, idx) => idx % 2 === 1)
            .map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className="overflow-hidden rounded-lg border border-border-subtle bg-white shadow-sm cursor-pointer group"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx * 2 + 2}`}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${idx % 2 === 0 ? 'h-44' : 'h-64'
                    }`}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Tombol Lihat Selengkapnya jika foto > 4 */}
      {data.gallery.length > 4 && (
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev: boolean) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle bg-white hover:bg-stone-50 text-xs font-semibold tracking-wider uppercase text-charcoal-dark shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>
              {showAllGallery
                ? 'Tampilkan Lebih Sedikit'
                : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
            </span>
            <i
              className={`fa-solid ${showAllGallery ? 'fa-chevron-up' : 'fa-chevron-down'
                } text-xs text-gold-champagne`}
            ></i>
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <span className="text-[11px] text-charcoal-muted tracking-widest uppercase italic font-editorial">
          &ldquo;Captured in eternal grace &amp; simplicity&rdquo;
        </span>
      </div>
    </section>
  );
};
