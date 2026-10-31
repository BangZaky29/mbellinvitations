import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import { PalembangSongketWatermark } from '../components';
import { UniversalGalleryView } from '../../../common/gallery';

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

        {/* Universal Reusable Gallery View Engine */}
        <UniversalGalleryView
          photos={photos}
          style={data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid'}
          onSelectImage={(url) => onSelectImage(url)}
          themeAccent={{
            primaryColor: '#4A0E12',
            goldAccent: '#FFD57A',
            badgeBg: 'rgba(42, 0, 3, 0.85)',
            badgeText: '#FFD57A',
            cardBg: '#F7F3EC',
            borderColor: 'rgba(255, 213, 122, 0.45)',
          }}
        />
      </div>
    </section>
  );
};


