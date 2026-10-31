import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
} from '../components';

interface GallerySectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
  onSelectImage: (url: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  theme,
  isSectionActive,
  onSelectImage,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isGalleryVisible = isSectionActive
    ? isSectionActive('gallery')
    : effectiveTheme?.show_gallery !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('gallery'));

  const photos = data.gallery || [];

  if (!isGalleryVisible || photos.length === 0) return null;

  return (
    <section className="relative w-full bg-[#FFF9EF] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.04]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Kisah Kasih • Yadnya Cinta
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            Galeri Kenangan
          </h3>
          <p className="font-sans text-xs text-[#524341] mt-1.5 leading-relaxed">
            Momen-momen indah yang terabadikan dalam kehangatan cinta suci
          </p>
          <CandiBentarDivider compact className="mt-2" />
        </div>

        {/* Bento Grid Photo Layout (from Template11_Bali.html) */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          {/* Photo 1: Wide Panoramic (col-span-2 aspect-[16/10]) */}
          {photos[0] && (
            <div
              onClick={() => onSelectImage(photos[0])}
              className="col-span-2 aspect-[16/10] rounded-xl overflow-hidden shadow-md bg-[#F3EDE4] border border-[#D4AF37]/35 cursor-pointer group relative"
            >
              <img
                src={photos[0]}
                alt="Galeri Pernikahan Bali 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-[#FFF9EF]/80 backdrop-blur-sm text-[#411710] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
              </div>
            </div>
          )}

          {/* Photo 2: Square (aspect-square) */}
          {photos[1] && (
            <div
              onClick={() => onSelectImage(photos[1])}
              className="aspect-square rounded-xl overflow-hidden shadow-sm bg-[#F3EDE4] border border-[#D4AF37]/35 cursor-pointer group relative"
            >
              <img
                src={photos[1]}
                alt="Galeri Pernikahan Bali 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-[#FFF9EF]/80 backdrop-blur-sm text-[#411710] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
              </div>
            </div>
          )}

          {/* Photo 3: Square (aspect-square) */}
          {photos[2] && (
            <div
              onClick={() => onSelectImage(photos[2])}
              className="aspect-square rounded-xl overflow-hidden shadow-sm bg-[#F3EDE4] border border-[#D4AF37]/35 cursor-pointer group relative"
            >
              <img
                src={photos[2]}
                alt="Galeri Pernikahan Bali 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-[#FFF9EF]/80 backdrop-blur-sm text-[#411710] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
              </div>
            </div>
          )}

          {/* Photo 4: Landscape Sanctuary View (col-span-2 aspect-[21/9]) */}
          {photos[3] && (
            <div
              onClick={() => onSelectImage(photos[3])}
              className="col-span-2 aspect-[21/9] rounded-xl overflow-hidden shadow-sm bg-[#F3EDE4] border border-[#D4AF37]/35 cursor-pointer group relative"
            >
              <img
                src={photos[3]}
                alt="Galeri Pernikahan Bali 4"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-[#FFF9EF]/80 backdrop-blur-sm text-[#411710] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
              </div>
            </div>
          )}

          {/* Additional Photos beyond 4 */}
          {photos.slice(4).map((imgUrl, i) => (
            <div
              key={`more-${i}`}
              onClick={() => onSelectImage(imgUrl)}
              className="aspect-square rounded-xl overflow-hidden shadow-sm bg-[#F3EDE4] border border-[#D4AF37]/35 cursor-pointer group relative"
            >
              <img
                src={imgUrl}
                alt={`Galeri Pernikahan Bali ${i + 5}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-[#FFF9EF]/80 backdrop-blur-sm text-[#411710] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
