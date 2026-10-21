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
    <section className="px-margin py-space-xl flex flex-col" id="galeri">
      <div className="text-center mb-8">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Dokumentasi
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Moment Bahagia
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Mosaic Photo Grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Photo 1: Arch Top */}
        {data.gallery[0] && (
          <div
            onClick={() => setSelectedImage(data.gallery[0])}
            className="rounded-t-full rounded-b-xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
          >
            <img
              alt="Foto Galeri 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={data.gallery[0]}
            />
          </div>
        )}

        {/* Photo 2: Stage Decor */}
        {data.gallery[1] && (
          <div
            onClick={() => setSelectedImage(data.gallery[1])}
            className="rounded-2xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
          >
            <img
              alt="Foto Galeri 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={data.gallery[1]}
            />
          </div>
        )}

        {/* Photo 3: Ring Shot */}
        {data.gallery[2] && (
          <div
            onClick={() => setSelectedImage(data.gallery[2])}
            className="rounded-2xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
          >
            <img
              alt="Foto Galeri 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={data.gallery[2]}
            />
          </div>
        )}

        {/* Photo 4: Groom Arch Top */}
        {data.gallery[3] && (
          <div
            onClick={() => setSelectedImage(data.gallery[3])}
            className="rounded-t-full rounded-b-xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
          >
            <img
              alt="Foto Galeri 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={data.gallery[3]}
            />
          </div>
        )}

        {/* Photo 5: Full Width Couple Portrait (spanning 2 cols) */}
        {data.gallery[4] && (
          <div
            onClick={() => setSelectedImage(data.gallery[4])}
            className="col-span-2 rounded-2xl overflow-hidden bg-surface-container aspect-[16/9] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
          >
            <img
              alt="Foto Galeri 5"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={data.gallery[4]}
            />
          </div>
        )}

        {/* Sisa Foto Galeri (Muncul saat tombol Lihat Selengkapnya diklik) */}
        {showAllGallery &&
          data.gallery.length > 5 &&
          data.gallery.slice(5).map((imgUrl, idx) => (
            <div
              key={idx + 5}
              onClick={() => setSelectedImage(imgUrl)}
              className="rounded-2xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all animate-in fade-in duration-300"
            >
              <img
                alt={`Foto Galeri ${idx + 6}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={imgUrl}
              />
            </div>
          ))}
      </div>

      {/* Tombol Lihat Selengkapnya jika foto > 5 */}
      {data.gallery.length > 5 && (
        <div className="text-center mt-5 w-full">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-secondary-dim transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>
              {showAllGallery
                ? 'Tutup Galeri'
                : `Lihat Selengkapnya (${data.gallery.length - 5} Foto Lainnya)`}
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
