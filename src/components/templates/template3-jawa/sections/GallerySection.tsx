import React from 'react';
import type { GallerySectionProps } from '../../types';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
  showAllGallery,
  setShowAllGallery,
}) => {
  return (
    <section id="galeri" className="relative w-full bg-surface px-margin py-space-xl flex flex-col items-center">
      <div className="text-center mb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
          Rerenggan Potret
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          Galeri Sasana &amp; Bahagia
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
          Gatra katresnan ingkang kerekam ing sajroning wekdal
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full mb-3">
        {(showAllGallery ? data.gallery : data.gallery.slice(0, 4)).map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(imgUrl)}
            className="rounded-xl overflow-hidden aspect-[3/4] bg-surface-container shadow-md group cursor-pointer"
          >
            <img
              src={imgUrl}
              alt={`Galeri ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Tombol Lihat Selengkapnya jika foto > 4 */}
      {data.gallery.length > 4 && (
        <div className="text-center mt-2 mb-4 w-full">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-primary border border-primary/30 font-label-md text-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>
              {showAllGallery
                ? 'Tutup Rerenggan Potret'
                : `Lihat Selengkapnya (${data.gallery.length - 4} Foto)`}
            </span>
            <span className="material-symbols-outlined text-[18px]">
              {showAllGallery ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};
