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
    <div
      className="bg-[#FAF6EE] text-[#1B0609] px-4 pt-4 pb-12 relative w-full overflow-hidden"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
      id="galeri"
    >
      {/* Minang Header */}
      <div className="text-center mb-6">
        <span className="font-script text-2xl text-[#7D5C1E]">Potret Kenangan</span>
        <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#2E0A10]">
          KISAH &amp; MEMORI
        </h3>
        <div className="w-10 h-0.5 bg-[#D4AF37]/60 mx-auto mt-1" />
      </div>

      {/* Universal Gallery View Engine */}
      <UniversalGalleryView
        photos={photos}
        style={currentStyle}
        onSelectImage={(url) => setSelectedImage(url)}
        themeAccent={{
          primaryColor: '#2E0A10',
          goldAccent: '#D4AF37',
          badgeBg: '#2E0A10',
          badgeText: '#FAF6EE',
          cardBg: '#FAF6EE',
          borderColor: '#D4AF37',
        }}
      />
    </div>
  );
};

export default GallerySection;
