import React from 'react';
import type { UniversalGalleryProps } from './types';
import { BentoGalleryView } from './styles/BentoGalleryView';
import { CarouselSliderView } from './styles/CarouselSliderView';
import { MasonryGalleryView } from './styles/MasonryGalleryView';
import { PolaroidStackView } from './styles/PolaroidStackView';
import { FilmstripGalleryView } from './styles/FilmstripGalleryView';
import { ArchCathedralView } from './styles/ArchCathedralView';
import { Coverflow3DView } from './styles/Coverflow3DView';
import { FeaturedThumbnailsView } from './styles/FeaturedThumbnailsView';
import { DualMarqueeView } from './styles/DualMarqueeView';
import { AccordionGalleryView } from './styles/AccordionGalleryView';
import { MagazineZigzagView } from './styles/MagazineZigzagView';

/**
 * UniversalGalleryView
 *
 * Engine galeri terpadu untuk seluruh template undangan digital Mbell:
 * - Menyediakan 11 pilihan tata letak galeri trending:
 *   1. `bento-grid`: Susunan asimetris editorial ala majalah mode (Default)
 *   2. `carousel-slider`: Slide tunggal geser kiri-kanan dengan peek preview & counter
 *   3. `masonry-waterfall`: 2-kolom dinamis bertingkat natural ala Pinterest
 *   4. `polaroid-stack`: Tumpukan foto polaroid romantis interaktif
 *   5. `filmstrip-scroll`: Rol film horizontal 35mm sinematik
 *   6. `arch-cathedral`: Bingkai kubah lengkung adat dengan Hero Arch & double-border emas
 *   7. `coverflow-3d`: Panggung perspektif 3D piringan album interaktif
 *   8. `featured-thumbnails`: Layar utama besar dengan dock strip thumbnail mini di bawah
 *   9. `dual-marquee`: 2 pita foto horizontal mengalir otomatis berlawanan arah (pause on touch)
 *   10. `accordion-Variable`: Panel tirai louvre ekspansi sentuh flex-grow modern
 *   11. `magazine-zigzag`: Editorial vertikal selang-seling kiri-kanan dengan nomor Serif besar
 * - Mengikuti 1 pengaturan terpusat dari Dashboard Editor
 * - Adaptif untuk 1 hingga 12 foto
 */
export const UniversalGalleryView: React.FC<UniversalGalleryProps> = (props) => {
  const { style = 'bento-grid', photos = [] } = props;

  if (!photos || photos.length === 0) {
    return null;
  }

  // Normalize case-insensitivity for safety
  const normalizedStyle = style?.toLowerCase();

  switch (style) {
    case 'carousel-slider':
      return <CarouselSliderView {...props} />;
    case 'masonry-waterfall':
      return <MasonryGalleryView {...props} />;
    case 'polaroid-stack':
      return <PolaroidStackView {...props} />;
    case 'filmstrip-scroll':
      return <FilmstripGalleryView {...props} />;
    case 'arch-cathedral':
      return <ArchCathedralView {...props} />;
    case 'coverflow-3d':
      return <Coverflow3DView {...props} />;
    case 'featured-thumbnails':
      return <FeaturedThumbnailsView {...props} />;
    case 'dual-marquee':
      return <DualMarqueeView {...props} />;
    case 'accordion-Variable':
      return <AccordionGalleryView {...props} />;
    case 'magazine-zigzag':
      return <MagazineZigzagView {...props} />;
    default:
      if (normalizedStyle === 'accordion-variable') {
        return <AccordionGalleryView {...props} />;
      }
      return <BentoGalleryView {...props} />;
  }
};

/**
 * Helper function jika template lebih memilih memanggil fungsi langsung:
 * renderUniversalGallery({ photos, style, onSelectImage, themeAccent })
 */
export function renderUniversalGallery(props: UniversalGalleryProps): React.ReactNode {
  return <UniversalGalleryView {...props} />;
}

export default UniversalGalleryView;
