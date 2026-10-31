import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import { PalembangSongketWatermark } from '../components';

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
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 pt-4 pb-12 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px]">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <span className="font-sans text-[10px] text-[#785A05] tracking-widest uppercase font-bold">
              Dokumentasi
            </span>
            <h4 className="font-serif text-xl sm:text-2xl text-[#4A0E12] font-bold">
              Potret Kebahagiaan
            </h4>
          </div>
          <span className="text-[11px] font-sans text-[#544342] bg-[#F7F3EC] px-2.5 py-1 rounded-full border border-[#FFD57A]/40 font-semibold">
            {photos.length} Momen
          </span>
        </div>

        {/* Bento Grid (2x2 Asymmetric) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Large Left Card */}
          {photos[0] && (
            <div
              onClick={() => onSelectImage(photos[0])}
              className="relative rounded-2xl overflow-hidden shadow-md aspect-[3/4] bg-[#F7F3EC] border border-[#FFD57A]/40 cursor-pointer group"
            >
              <img
                src={photos[0]}
                alt="Foto Prewedding Palembang"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0003]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#2A0003]/80 backdrop-blur text-[#FFD57A] text-[10px] font-sans font-bold border border-[#FFD57A]/40">
                Aesan Gede
              </div>
            </div>
          )}

          {/* Right Column Stack */}
          <div className="flex flex-col gap-2.5">
            {photos[1] && (
              <div
                onClick={() => onSelectImage(photos[1])}
                className="relative rounded-2xl overflow-hidden shadow-md aspect-square bg-[#F7F3EC] border border-[#FFD57A]/40 cursor-pointer group"
              >
                <img
                  src={photos[1]}
                  alt="Foto Prewedding Palembang"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            {photos[2] && (
              <div
                onClick={() => onSelectImage(photos[2])}
                className="relative rounded-2xl overflow-hidden shadow-md aspect-square bg-[#F7F3EC] border border-[#FFD57A]/40 cursor-pointer group"
              >
                <img
                  src={photos[2]}
                  alt="Foto Prewedding Palembang"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>

          {/* Card 4: Full Width Span Ballroom / Pelaminan */}
          {photos[3] && (
            <div
              onClick={() => onSelectImage(photos[3])}
              className="col-span-2 relative rounded-2xl overflow-hidden shadow-md aspect-[16/9] bg-[#F7F3EC] border border-[#FFD57A]/40 cursor-pointer group"
            >
              <img
                src={photos[3]}
                alt="Pelaminan Sriwijaya"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0003]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-[#FDF9F2]">
                <span className="font-sans text-[10px] uppercase text-[#FFD57A] tracking-wider font-bold block">
                  Pelaminan Agung
                </span>
                <p className="font-serif text-sm sm:text-base font-semibold leading-tight">
                  Ukiran Lakuer Palembang
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

