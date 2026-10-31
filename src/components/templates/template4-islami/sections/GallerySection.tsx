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
    <section className="px-4 py-space-xl flex flex-col w-full overflow-hidden" id="galeri">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Dokumentasi
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Moment Bahagia
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Universal Gallery View Engine */}
      <UniversalGalleryView
        photos={photos}
        style={currentStyle}
        onSelectImage={(url) => setSelectedImage(url)}
        themeAccent={{
          primaryColor: '#0F4336',
          goldAccent: '#D4AF37',
          badgeBg: '#0F4336',
          badgeText: '#FAF8F5',
          cardBg: '#FAF8F5',
          borderColor: '#D4AF37',
        }}
      />
    </section>
  );
};

export default GallerySection;
