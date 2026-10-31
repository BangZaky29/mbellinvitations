import React from 'react';
import type { BaseSectionProps } from '../../types';
import { UniversalGalleryView } from '../../../common/gallery';

export interface LuxuryGalleryProps extends BaseSectionProps {
  selectedImage?: string | null;
  setSelectedImage: (url: string | null) => void;
  showAllGallery?: boolean;
  setShowAllGallery?: React.Dispatch<React.SetStateAction<boolean>> | ((show: boolean | ((prev: boolean) => boolean)) => void);
}

export const GallerySection: React.FC<LuxuryGalleryProps> = ({
  data,
  theme,
  setSelectedImage,
}) => {
  const photos = data.gallery || [];
  if (photos.length === 0) return null;

  const effectiveTheme = theme || (data as any).theme_config;
  const currentStyle = data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid';

  return (
    <section className="w-full px-4 py-12 z-10 overflow-hidden" id="gallery">
      <div className="text-center mb-8">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          Visual Prelude
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          MOMENTS IN MONOCHROME
        </h2>
      </div>

      {/* Universal Gallery View Engine */}
      <UniversalGalleryView
        photos={photos}
        style={currentStyle}
        onSelectImage={(url) => setSelectedImage(url)}
        themeAccent={{
          primaryColor: '#E0A96D',
          goldAccent: '#E0A96D',
          badgeBg: '#1c1b18',
          badgeText: '#E0A96D',
          cardBg: '#1a1916',
          borderColor: '#E0A96D',
        }}
      />
    </section>
  );
};

export default GallerySection;
