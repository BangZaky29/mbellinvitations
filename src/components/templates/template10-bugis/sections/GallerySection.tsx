import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import { UniversalGalleryView } from '../../../common/gallery';

interface GallerySectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isPreview?: boolean;
  setSelectedImage: (img: string | null) => void;
  showAllGallery?: boolean;
  setShowAllGallery?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  theme,
  setSelectedImage,
}) => {
  const effectiveTheme = theme || data.theme_config;
  const defaultPhotos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA5iPu1V7l1Dxz7-YQzWEY6-9AzgdfqQ-xbx3yxPUg9VkdnxL7YYlDXSiBSYTBtLhfTOaK8Ij29KT5CaVj__9aUpgR5qusJTLofCjenrapTOWeKkrp27ueQDzapAnXCJyV3h7knLdr70b29gG2diTQNIh2SkdwtAi_fHob6gfSEhe0RsN9-N3NNaXcfNse-nju4N3nvj8VJhwr-tw2hox1hKkRhGkFrey-8r80rKyJfZbX0bzhB_mQ6',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBx6CY-lmGdNYlDAeONVZWfZfclZxWpNktDwFgD8k3y4_Or5RkKVQUR0MHOqFUMZdJmP3t6wfdNTGUDIVpY2SksTBvJDHg8EHQaRYwkcEqVw6FYb57Ftpq8rw7bJq7CXg-uEnFdnY-xbxByP43GSfRJUNMZ9eTt58V-OP7la75Mmt0vs6eRiEmJheMqp_eJtuYnyFoQsARM-3N--OuRkUmUx46GgE5qYRIw-H55-k7bRXyJs7EVnwJy',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCFbuoVDYzIHpXTJDd73fPHfS-vAhqR5DehL7y0692C3T5hLJ8JLfRhX15KwXA4LI7tx0iUjpBotUU0XRaUamA9RpXkBw41NTYW7ZfpdL0qen1sX-y7QmvJjKIH27OR4Wtd1Cp9ZbKSVLU-4XgDogyQGEaW6Ya35Q_ticPag_mI78CPTDDJGLmLszPPOKhPzjHvwZYq_qLAJMuXzdRrXDNvBGTzPj_EkNzpL_w6B2H307Gi0ysZ10_i',
  ];

  const rawPhotos = (data as any).gallery_photos || data.gallery || [];
  const photos =
    Array.isArray(rawPhotos) && rawPhotos.length > 0
      ? rawPhotos
      : defaultPhotos;

  return (
    <section className="relative w-full shrink-0 px-4 py-8 bg-[#00120A] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center mb-6">
        <div className="w-9 h-9 rounded-full bg-[#052519] text-[#F2CA50] flex items-center justify-center mb-2 border border-[#F2CA50]/30 shadow-md">
          <span className="material-symbols-outlined text-[19px]">photo_library</span>
        </div>
        <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
          Potret Kenangan
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#C8EAD8] font-bold mt-1">
          Potret Keagungan Adat
        </h2>
        <p className="font-sans text-xs text-[#D7C594] mt-1">
          Momen bahagia dalam balutan busana kebesaran adat Bugis-Makassar.
        </p>
      </div>

      <div className="max-w-sm w-full">
        <UniversalGalleryView
          photos={photos}
          style={data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid'}
          onSelectImage={(url) => setSelectedImage(url)}
          themeAccent={{
            primaryColor: '#F2CA50',
            goldAccent: '#F2CA50',
            badgeBg: 'rgba(5, 37, 25, 0.9)',
            badgeText: '#F2CA50',
            cardBg: '#00170E',
            borderColor: 'rgba(242, 202, 80, 0.35)',
          }}
        />
      </div>
    </section>
  );
};

