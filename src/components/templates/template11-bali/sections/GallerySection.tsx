import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
} from '../components';
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
    <section className="relative w-full shrink-0 bg-[#FFF9EF] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
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

        {/* Universal Reusable Gallery View Engine */}
        <UniversalGalleryView
          photos={photos}
          style={data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid'}
          onSelectImage={(url) => onSelectImage(url)}
          themeAccent={{
            primaryColor: '#735C00',
            goldAccent: '#D4AF37',
            badgeBg: 'rgba(65, 23, 16, 0.85)',
            badgeText: '#D4AF37',
            cardBg: '#F3EDE4',
            borderColor: 'rgba(212, 175, 55, 0.4)',
          }}
        />
      </div>
    </section>
  );
};

