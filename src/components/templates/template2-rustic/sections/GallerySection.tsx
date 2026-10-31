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
    <section id="galeri-section" className="flex flex-col py-space-xl px-4 w-full overflow-hidden">
      <div className="text-center mb-6">
        <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
          Pre-Wedding Memories
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
          Momen Bahagia
        </h3>
        <div className="w-10 h-0.5 bg-[#8C4E2D]/40 mx-auto mt-1" />
      </div>

      {/* Universal Gallery View Engine */}
      <UniversalGalleryView
        photos={photos}
        style={currentStyle}
        onSelectImage={(url) => setSelectedImage(url)}
        themeAccent={{
          primaryColor: '#2C4034',
          goldAccent: '#C19A6B',
          badgeBg: '#2C4034',
          badgeText: '#FAF8F5',
          cardBg: '#FAF8F5',
          borderColor: '#8C4E2D',
        }}
      />
    </section>
  );
};

export default GallerySection;
