import React from 'react';
import type { CoverSectionProps } from '../../types';
import { IslamicMihrabArch } from '../components/IslamicMihrabArch';

export const CoverSection: React.FC<CoverSectionProps> = ({
  data,
  handleOpenInvitation,
  isPreview,
}) => {
  const recipientName = data.guest_name || 'Tamu Undangan';

  return (
    <section
      id="sampul"
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center px-4 py-5 sm:px-6 sm:py-7 overflow-hidden bg-[#24060B] z-20 select-none text-[#FAF6EE]"
      style={{ backgroundColor: '#24060B', color: '#FAF6EE' }}
    >
      {/* Solid Deep Islamic Maroon Background + Vignette Aura & Star Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#24060B]">
        {/* Deep Royal Islamic Maroon Radial Gradient */}
        <div className="absolute inset-0 bg-radial-[circle_at_center_top] from-[#3D141C] via-[#24060B] to-[#150205]"></div>

        {/* Ambient Cover Photo blended very subtly into backdrop */}
        {(data.cover_image || data.couple_photo) && (
          <img
            src={data.cover_image || data.couple_photo}
            alt="Cover Background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 filter blur-[2px] scale-105"
          />
        )}

        {/* Subtle Islamic Geometry / Star Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
      </div>

      {/* Top Header: Walimatul Ursy Pill Badge & The Wedding of */}
      <div className="relative z-10 pt-4 sm:pt-6 shrink-0 flex flex-col items-center">
        <div className="px-4 py-1 rounded-full bg-[#1A0306]/85 border border-[#D4AF37]/60 text-[#F5E296] font-cinzel text-xs tracking-[0.2em] uppercase shadow-md mb-2 font-semibold">
          WALIMATUL URSY
        </div>
        <p className="font-serif italic text-xs sm:text-sm text-[#E5C158] tracking-widest drop-shadow-xs">
          The Wedding of
        </p>
      </div>

      {/* Middle Tier: Authentic 3D Gold Islamic Mihrab Arch Frame + Names & Date */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-1 sm:py-2 w-full max-w-[280px]">
        {/* 3D Islamic Pointed Mihrab Arch Frame */}
        <IslamicMihrabArch
          imageSrc={
            data.couple_photo ||
            data.cover_image ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9L8ISRUM7mLqvnPG1IUud4itXFzYibGb-gsVdr2o8XOghzC2pdxs3o4Y2QQOZT5FDELCcHb1hQXs0m_y-Ug4bTBYR_zj1eXdzZ_EYzKQ5aJLGJsYRXpgssNhtGWT6egpeoVh-gBwyzuhPmyDGWnAET59APKBr1X9uYdaxY7TpdT6rg3zm48_6s4Va2AuaAL7-qkj_lnVIPqmYeb4KJVg6qBDlsZ1TKkNe3MGDcM_G9le8id4Vh3few'
          }
          altText={`${data.groom.name} & ${data.bride.name}`}
        />

        {/* Couple Names directly below Arch Frame */}
        <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF6EE] font-bold tracking-wide drop-shadow-md mt-3 sm:mt-3.5">
          {data.groom.name} &amp; {data.bride.name}
        </h1>

        {/* Wedding Date in Gold */}
        <p className="font-serif text-xs sm:text-sm text-[#D4AF37] tracking-wider mt-1 drop-shadow-xs">
          {data.wedding_date_display || 'Minggu, 15 Oktober 2025'}
        </p>
      </div>

      {/* Bottom Tier: Elegant Ivory Guest Card, Maroon CTA Button & Swipe Up Hint */}
      <div className="relative z-10 w-full max-w-[340px] pb-2 sm:pb-3 flex flex-col items-center space-y-2.5 shrink-0 mt-auto">
        {/* Guest Card */}
        <div className="w-full bg-[#FAF6EE] rounded-2xl p-3 sm:p-3.5 shadow-xl border border-[#D4AF37]/50 text-center">
          <span className="block font-sans text-[10px] sm:text-[11px] text-[#8A6822] uppercase tracking-[0.15em] font-bold mb-0.5">
            KEPADA YTH: BAPAK/IBU/SAUDARA/I:
          </span>
          <p className="font-serif text-base sm:text-lg text-[#2E0A10] font-bold line-clamp-1">
            {recipientName}
          </p>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E0A10]/10 text-[#2E0A10] text-[10px] font-mono font-semibold">
              <span className="material-symbols-outlined text-[12px]">qr_code</span>
              <span>PASS: {data.guest_code || 'ISL-2025'}</span>
            </div>
          )}
          <span className="block mt-1 font-sans text-[9.5px] sm:text-[10px] text-[#7D5C1E] italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleOpenInvitation}
          className="w-full h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#24060B] via-[#380D14] to-[#24060B] hover:brightness-110 text-[#FAF6EE] font-sans text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/50 transition-all active:scale-[0.98] cursor-pointer border border-[#D4AF37]/70"
          id="btn-buka-undangan"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px] text-[#D4AF37]">
            mail
          </span>
          <span className="tracking-widest uppercase">BUKA UNDANGAN</span>
          <span className="material-symbols-outlined text-[17px] text-[#D4AF37]">
            expand_more
          </span>
        </button>

        {/* Interactive Swipe Up Hint */}
        <div className="flex flex-col items-center gap-0.5 text-[#D4AF37] pt-0.5">
          <span className="material-symbols-outlined text-[16px] animate-bounce">
            expand_less
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold text-[#D4AF37]/90">
            USAP KE ATAS UNTUK MEMBUKA
          </span>
        </div>
      </div>
    </section>
  );
};
