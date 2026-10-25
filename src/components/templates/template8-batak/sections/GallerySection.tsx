import React from 'react';
import type { InvitationData } from '../../../../types/invitation';

interface GallerySectionProps {
  data: InvitationData;
  isPreview?: boolean;
  setSelectedImage: (img: string | null) => void;
  showAllGallery?: boolean;
  setShowAllGallery?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  setSelectedImage,
  showAllGallery = false,
  setShowAllGallery,
}) => {
  const defaultImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSaBmrSBPc6JBKfMGqLIwMcxmJRsHH9qVZk8tBz0UbaTiqr__0cHe8qR7wa7pIidP8_8Og6HU73yBrOcZrSmoR0VOzFQbGjcAul7SLH3jLgnI3x7rrgaoHvaFdDgPWvWh-qvNSEonSJkhF0b6eLzJhN8v8BtpscySxZyQIK0FiwUhAhT03f0hmkC2Qs4L0mvbWQTNDyHGHXOByJ1ZMOP4CT3YnyDEde8G5oelkyODSd9uKn2rKVdGU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ul7JpVEUwTKOddyKJL42jdmBf9BvugyW8n5K0ckhOAkBeS1zwjL_An4ucB0kFz-NVopaFXia3QiNDJ5lSs5FQn4LktVL64uL32UiOg2OLd7w5Ak60GXdZsuVXeJFnOeCugwmZKQ8gWxkDH30MSrIvHTdcFQ5uN-GTc2TPzEJMCGYAyWTwONGyLCMcvJPj7GFogzG5mCxBgV6kC9xdkZoWkPfeUy6Q7Jy8qRq3IsY9iYmbgxUMqUO',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuACluK0g8lfNC6qzb0-HsuAuxxdLkgtUyxM9rcegwbzLZGkFWhJelsj4g97nZIA9LnzZ_hGg7SMoYbbVi2nT4sboQjm3991lgQhb3ImR_s4S3duYz_yro4gyK_PzAHM3wLeBc-UAuu5_3XGTfyeP4Xu7OV6wo9mJBgAkwMHDIlHC1HP1YcnK3OsifSacXbZd_ztpfyVoD7kmw_zzr-QOYSRcl-QZPsj573UyPbM9bYlyYO6iQ8v_i6U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIltz_sSVgMheSBVwKp8eUtJ0_E5tV0ivr7sMS6-0fvaXgi5Enclfx2bItNCS_oNsVT42pirSpMPy4OBG9-GcJ_HUPvXS4FaKr6o8BLhf8rzoYJW0d6u0ngeo3QhVn0WJu68ApTsdiLYOieKGMskaVi8_BTax2UiPqBpgXrbuxAzME-2fcjEWVYHB4N84m31JKYLhy2FlXL1ua40kwaXjGrC8SihSxzSkuIZCSvgyRzlVTrw3N2zPv',
  ];

  const galleryList =
    data.gallery && data.gallery.length > 0 ? data.gallery : defaultImages;

  const displayedList = showAllGallery ? galleryList : galleryList.slice(0, 4);

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1.5 text-[#EAC16E]">
        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
          Kisah &amp; Memori
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide text-center mb-6">
        Our Royal Moments
      </h2>

      {/* Asymmetric 2x2 Bento Photo Mosaic */}
      <div className="w-full max-w-[360px] grid grid-cols-2 gap-2.5">
        {displayedList.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(imgUrl)}
            className={`relative rounded-xl overflow-hidden shadow-md cursor-pointer group border border-[#EAC16E]/20 ${
              idx % 4 < 2 ? 'aspect-[3/4.2]' : 'aspect-square'
            }`}
          >
            <img
              src={imgUrl}
              alt={`Galeri Foto ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Button Expand if > 4 images */}
      {galleryList.length > 4 && setShowAllGallery && (
        <button
          type="button"
          onClick={() => setShowAllGallery(!showAllGallery)}
          className="mt-4 px-4 py-2 rounded-xl bg-[#261E1A] text-[#EAC16E] border border-[#EAC16E]/30 font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#312824] transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">
            {showAllGallery ? 'expand_less' : 'expand_more'}
          </span>
          <span>
            {showAllGallery
              ? 'Tampilkan Lebih Sedikit'
              : `Lihat Semua Foto (${galleryList.length})`}
          </span>
        </button>
      )}
    </section>
  );
};
