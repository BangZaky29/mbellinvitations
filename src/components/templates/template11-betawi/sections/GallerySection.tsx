import React from 'react';
import type { InvitationData } from '../../../../types/invitation';

interface GallerySectionProps {
  data: InvitationData;
  isPreview?: boolean;
  setSelectedImage: (url: string | null) => void;
  showAllGallery?: boolean;
  setShowAllGallery?: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
  showAllGallery = false,
  setShowAllGallery,
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

  const displayPhotos = showAllGallery ? photos : photos.slice(0, 4);

  return (
    <section className="relative w-full bg-[#FCF9F3] text-[#1C1C18] px-4 pt-4 pb-8 flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-5">
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

      {/* Asymmetric 2x2 Bento Grid */}
      <div className="w-full max-w-[360px] grid grid-cols-2 gap-2 rounded-2xl overflow-hidden p-1.5 bg-[#F0EEE8] border border-[#E5E2DC]">
        {displayPhotos.map((photoUrl, idx) => (
          <div
            key={idx}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedImage(photoUrl)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedImage(photoUrl);
              }
            }}
            className="h-44 rounded-xl overflow-hidden shadow-xs cursor-pointer group relative bg-[#410403]/10"
          >
            <img
              alt={`Galeri Prewedding Betawi ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={photoUrl}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl drop-shadow-md">
                zoom_in
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle View All Button if > 4 photos */}
      {photos.length > 4 && setShowAllGallery && (
        <button
          type="button"
          onClick={() => setShowAllGallery(!showAllGallery)}
          className="mt-4 px-5 py-2 rounded-full bg-white text-[#410403] font-sans text-xs font-bold uppercase tracking-wider border border-[#E5E2DC] shadow-xs hover:border-[#FED65B] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {showAllGallery ? 'expand_less' : 'photo_library'}
          </span>
          <span>{showAllGallery ? 'Tutup Galeri' : `Lihat Semua Foto (${photos.length})`}</span>
        </button>
      )}
    </section>
  );
};

export default GallerySection;
