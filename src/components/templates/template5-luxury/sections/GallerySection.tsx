import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface LuxuryGalleryProps extends BaseSectionProps {
  selectedImage?: string | null;
  setSelectedImage: (url: string | null) => void;
  showAllGallery: boolean;
  setShowAllGallery: React.Dispatch<React.SetStateAction<boolean>> | ((show: boolean | ((prev: boolean) => boolean)) => void);
}

export const GallerySection: React.FC<LuxuryGalleryProps> = ({
  data,
  setSelectedImage,
  showAllGallery,
  setShowAllGallery,
}) => {
  if (!data.gallery || data.gallery.length === 0) return null;

  return (
    <section className="w-full px-margin py-12 z-10" id="gallery">
      <div className="text-center mb-8">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          Visual Prelude
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          MOMENTS IN MONOCHROME
        </h2>
      </div>

      {/* Masonry Two-Column Showcase */}
      <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto">
        <div className="flex flex-col gap-3">
          {data.gallery[0] && (
            <div
              onClick={() => setSelectedImage(data.gallery[0])}
              className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
            >
              <img
                alt="Gala Editorial Couple"
                className="w-full h-full object-cover filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                src={data.gallery[0]}
              />
            </div>
          )}
          {data.gallery[1] && (
            <div
              onClick={() => setSelectedImage(data.gallery[1])}
              className="w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
            >
              <img
                alt="Romeo Portrait Gala"
                className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                src={data.gallery[1]}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {data.gallery[2] && (
            <div
              onClick={() => setSelectedImage(data.gallery[2])}
              className="w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
            >
              <img
                alt="Juliet Portrait Couture"
                className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                src={data.gallery[2]}
              />
            </div>
          )}
          {data.gallery[3] && (
            <div
              onClick={() => setSelectedImage(data.gallery[3])}
              className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
            >
              <img
                alt="Marble Stairs Promenade"
                className="w-full h-full object-cover filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                src={data.gallery[3]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sisa Foto Galeri (Muncul saat tombol Lihat Selengkapnya diklik) */}
      {showAllGallery && data.gallery.length > 4 && (
        <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto mt-3 animate-in fade-in duration-300">
          {data.gallery.slice(4).map((imgUrl, idx) => (
            <div
              key={idx + 4}
              onClick={() => setSelectedImage(imgUrl)}
              className="w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
            >
              <img
                alt={`Luxury Gallery ${idx + 5}`}
                className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                src={imgUrl}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tombol Lihat Selengkapnya jika foto > 4 */}
      {data.gallery.length > 4 && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setShowAllGallery((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/40 bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>
              {showAllGallery
                ? 'Close Gallery'
                : `View Full Gallery (${data.gallery.length - 4} More)`}
            </span>
            <span className="material-symbols-outlined text-[16px]">
              {showAllGallery ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};
