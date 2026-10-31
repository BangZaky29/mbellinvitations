import React from 'react';
import type { GallerySectionProps } from '../../types';
import { UniversalGalleryView } from '../../../common/gallery';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
}) => {
  return (
    <section id="gallery" className="py-12 px-6 shrink-0">
      <div className="text-center mb-8 reveal">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Dokumentasi
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Galeri Kenangan
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 font-light">
          Potret momen kebersamaan yang terukir abadi
        </p>
      </div>

      <UniversalGalleryView
        photos={data.gallery || []}
        style={data.gallery_style || data.theme_config?.gallery_style || 'bento-grid'}
        onSelectImage={(url) => setSelectedImage(url)}
        themeAccent={{
          primaryColor: '#8C7A6B',
          goldAccent: '#C5A880',
          badgeBg: 'rgba(30, 28, 26, 0.85)',
          badgeText: '#F7F5F0',
          cardBg: '#FFFFFF',
          borderColor: 'rgba(197, 168, 128, 0.35)',
        }}
      />

      <div className="text-center mt-6">
        <span className="text-[11px] text-charcoal-muted tracking-widest uppercase italic font-editorial">
          &ldquo;Captured in eternal grace &amp; simplicity&rdquo;
        </span>
      </div>
    </section>
  );
};
