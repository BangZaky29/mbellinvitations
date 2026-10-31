import React from 'react';
import type { GallerySectionProps } from '../../types';
import { UniversalGalleryView } from '../../../common/gallery';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  theme,
  setSelectedImage,
}) => {
  const photos = data.gallery || [];
  if (photos.length === 0) return null;

  const effectiveTheme = theme || (data as any).theme_config;
  const currentStyle = data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid';

  return (
    <section
      className="w-full px-4 py-12 bg-white flex flex-col items-center text-center border-b border-[#ede9e1] overflow-hidden"
      id="galeri"
    >
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase">
        Galeri Memori
      </span>
      <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2">
        Kisah Dua Hati
      </h2>
      <p className="text-xs text-[#4e4639] italic mb-6">
        “Dua hati, satu janji, selamanya dalam cinta suci.”
      </p>

      {/* Universal Gallery View Engine */}
      <UniversalGalleryView
        photos={photos}
        style={currentStyle}
        onSelectImage={(url) => setSelectedImage(url)}
        themeAccent={{
          primaryColor: '#1b1c1a',
          goldAccent: '#8a6822',
          badgeBg: '#8a6822',
          badgeText: '#ffffff',
          cardBg: '#faf7f2',
          borderColor: '#8a6822',
        }}
      />
    </section>
  );
};

export default GallerySection;
