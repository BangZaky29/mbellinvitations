import React from 'react';
import type { GallerySectionProps } from '../../types';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
  showAllGallery,
  setShowAllGallery,
}) => {
  return (
    <section id="galeri-section" className="flex flex-col py-space-xl">
      <div className="text-center mb-space-lg">
        <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
          Pre-Wedding Memories
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
          Momen Bahagia
        </h3>
      </div>

      {/* Featured Hero Landscape */}
      {data.gallery[0] && (
        <div
          onClick={() => setSelectedImage(data.gallery[0])}
          className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md mb-3 group bg-[#FAF8F5] border border-[#2C4034]/15 cursor-pointer"
        >
          <img
            src={data.gallery[0]}
            alt="Featured Pre-wedding"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-3 bg-[#2C4034]/80 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-xs font-semibold border border-white/20">
            Rustic Moments
          </div>
        </div>
      )}

      {/* 2-Column Aesthetic Masonry Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left Column (Tall Portrait) */}
        {data.gallery[1] && (
          <div
            onClick={() => setSelectedImage(data.gallery[1])}
            className="h-64 rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F5] border border-[#2C4034]/12 cursor-pointer group"
          >
            <img
              src={data.gallery[1]}
              alt="Gallery 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Right Column (Stacked 2 Portraits) */}
        <div className="flex flex-col gap-3">
          {data.gallery[2] && (
            <div
              onClick={() => setSelectedImage(data.gallery[2])}
              className="h-[122px] rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F5] border border-[#2C4034]/12 cursor-pointer group"
            >
              <img
                src={data.gallery[2]}
                alt="Gallery 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          {data.gallery[3] && (
            <div
              onClick={() => setSelectedImage(data.gallery[3])}
              className="h-[122px] rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F5] border border-[#2C4034]/12 cursor-pointer group"
            >
              <img
                src={data.gallery[3]}
                alt="Gallery 4"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sisa Foto Galeri (Muncul saat tombol Lihat Selengkapnya diklik) */}
      {showAllGallery && data.gallery.length > 4 && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in duration-300">
          {data.gallery.slice(4).map((imgUrl, idx) => (
            <div
              key={idx + 4}
              onClick={() => setSelectedImage(imgUrl)}
              className="h-44 rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F5] border border-[#2C4034]/12 cursor-pointer group"
            >
              <img
                src={imgUrl}
                alt={`Gallery ${idx + 5}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tombol Lihat Selengkapnya jika foto > 4 */}
      {data.gallery.length > 4 && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#2C4034] border border-[#2C4034]/20 hover:bg-[#2C4034] hover:text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span>
              {showAllGallery
                ? 'Tampilkan Lebih Sedikit'
                : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
            </span>
            <span className="material-symbols-outlined text-[18px]">
              {showAllGallery ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}

      {/* Quote Card */}
      <div className="mt-4 bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 text-center shadow-xs border border-[#8C4E2D]/20">
        <p className="font-serif text-sm sm:text-base text-[#2C4034] italic font-normal">
          &ldquo;Two souls with but a single thought, two hearts that beat as one.&rdquo;
        </p>
      </div>
    </section>
  );
};
