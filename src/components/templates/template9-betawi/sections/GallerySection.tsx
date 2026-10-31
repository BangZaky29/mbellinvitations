import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import { BetawiBatikWatermark } from '../components';
import { UniversalGalleryView } from '../../../common/gallery';

interface GallerySectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isPreview?: boolean;
  setSelectedImage: (url: string | null) => void;
  showAllGallery?: boolean;
  setShowAllGallery?: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  theme,
  setSelectedImage,
}) => {
  const fallbackPhotos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDvj315uDZXn4l54Z9rsWz5dxN7n1zN6tQMm75ogSwJUInNGK1hhmHf6v0uR63NqNlWYEdx7GfC5FRRfz22O-XrVEB2UiUv6bF3KzWX4qTDz_vB0uBhihZ2WueUDeU6-9cZka5s-Sf1fXL3bTJZ4TA9lPUir3qSMU-cVBi7FpLjbVxc6dWUjwZEs3UibXHSv5LVy-fL3OSpjqL7Tv68q1htN-U8JB0wHQY4Qhi-US6bkcKfe7JNpZF3',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJsZ0fracfQoJP0PD9qX30gLxdwMBTZCCNdrQYozJXO6ZSzs-T02oubQQGtFZMzLl5yr508GBmd-MSK3lNDAmgi-TaYhhfs-CxXU2_VDmJUhI-i2wuo-wzh88Ldo3-GhDESotkfsBISYuwpMjbr6ZG6k8WUvF5mE2BBC65K4EoS2qM--XXXRE0vUWH2_J6kSl9EBEFLi9MM9Wh1jI-pC9SpSgdfxqLNmiW349uwvI-NnuEdif6RAGa',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDybcI1qsh9Kw7UsH7c7zJB8vBKJMy-GiJ_TXaS5QrcNk_zHntg7IHZKwYDa9b1KJQhH0zUVtQnHBfCtIOekzWXOpjO0lOJm4d16vAspthSyYuDrYaqIuokQPOudDKrFlPqg48IFqw4RTBH6zCYVajTyUxGbpjFTJV5n-kstRcEdBKLzT9hSDmX5Pz1AoNrdYJBrF4s6uE6WxagfakxdZImk32GjGnrYcjSenZVmK-YummYZ1L6DZM1',
  ];

  const rawPhotos = data.gallery || (data as any).gallery_photos;
  const photos =
    Array.isArray(rawPhotos) && rawPhotos.length > 0
      ? rawPhotos
      : fallbackPhotos;

  const effectiveTheme = theme || (data as any).theme_config;
  const currentStyle = data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid';

  return (
    <section className="relative w-full bg-[#FCF9F3] text-[#1C1C18] px-4 pt-4 pb-8 flex flex-col items-center overflow-hidden">
      {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark (Ivory Tone) */}
      <BetawiBatikWatermark color="#5E1914" opacityClass="opacity-[0.035]" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-5 z-10">
        <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#735c00] uppercase mb-1">
          POTRET KENANGAN
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410403]">
          Our Special Moments
        </h2>
        <p className="font-serif text-xs text-[#554240] italic mt-1 max-w-[280px]">
          Untaian keindahan kasih dalam balutan tradisi agung Betawi
        </p>
      </div>

      {/* Universal Gallery View Engine */}
      <div className="relative z-10 w-full">
        <UniversalGalleryView
          photos={photos}
          style={currentStyle}
          onSelectImage={(url) => setSelectedImage(url)}
          themeAccent={{
            primaryColor: '#410403',
            goldAccent: '#735C00',
            badgeBg: '#410403',
            badgeText: '#FCF9F3',
            cardBg: '#FCF9F3',
            borderColor: '#735C00',
          }}
        />
      </div>
    </section>
  );
};

export default GallerySection;
