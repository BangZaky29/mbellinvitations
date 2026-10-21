import React from 'react';
import type { CoverSectionProps } from '../../types';

export const CoverSection: React.FC<CoverSectionProps> = ({
  data,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  handleOpenInvitation,
  renderSwipeHint,
  isPreview,
}) => {
  const firstPerson = rawFirst || data.groom || { name: 'Mempelai Pria' };
  const secondPerson = rawSecond || data.bride || { name: 'Mempelai Wanita' };
  return (
    <section
      id="sampul"
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#F9F6F0] via-[#F4EFEB] to-[#ECE3D5]"
    >
      {/* Ambient Rustic Backdrop using Cover Photo if present */}
      {(data.cover_image || data.couple_photo) && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={data.cover_image || data.couple_photo}
            alt="Cover Background"
            className="w-full h-full object-cover opacity-20 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F6F0]/92 via-[#F4EFEB]/85 to-[#ECE3D5]/95 backdrop-blur-[1px]"></div>
        </div>
      )}

      {/* Atmospheric Botanical Vignette Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center z-1">
        <svg className="w-full h-full text-[#3A5240]" fill="none" viewBox="0 0 400 400">
          <path
            d="M200 40 C140 70 80 140 80 220 C80 290 130 350 200 370 C270 350 320 290 320 220 C320 140 260 70 200 40 Z"
            stroke="currentColor"
            strokeDasharray="4 4"
            strokeWidth="1.2"
          ></path>
          <circle cx="200" cy="200" opacity="0.6" r="160" stroke="currentColor" strokeWidth="0.8"></circle>
        </svg>
      </div>

      {/* Top Notch-Safe Header */}
      <div className="relative z-10 pt-3 sm:pt-5 shrink-0 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DE] text-[#8C4E2D] border border-[#DECFBD] mb-2 shadow-2xs">
          <span className="material-symbols-outlined text-[14px]">spa</span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans">
            The Wedding Invitation Of
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1E2E22] font-semibold tracking-wide drop-shadow-xs my-0.5">
          {firstPerson.name}{' '}
          <span className="font-serif italic font-light text-[#A66038] text-2xl sm:text-3xl">&amp;</span>{' '}
          {secondPerson.name}
        </h1>
        <div className="flex items-center gap-2 mt-1 opacity-85">
          <span className="w-8 h-px bg-[#8C4E2D]/30" />
          <span className="text-[11px] font-sans uppercase tracking-widest text-[#526859] font-medium">
            {data.wedding_date_display || (data.wedding_date_iso ? new Date(data.wedding_date_iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '24 Oktober 2026')}
          </span>
          <span className="w-8 h-px bg-[#8C4E2D]/30" />
        </div>
      </div>

      {/* Middle Tier: Wreath & Circle Couple Portrait */}
      <div className="relative z-10 my-auto py-2 flex flex-col justify-center items-center w-full max-w-[280px]">
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
          <svg
            className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] text-[#8C4E2D]/60 animate-spin"
            fill="none"
            style={{ animationDuration: '45s' }}
            viewBox="0 0 200 200"
          >
            <path
              d="M100 14 C125 14 155 28 172 52 C188 74 192 98 186 122 C180 152 158 176 132 186 C108 196 78 190 54 174 C28 156 14 128 14 98 C14 68 32 38 56 24 C74 14 88 14 100 14 Z"
              stroke="currentColor"
              strokeDasharray="6 6"
              strokeWidth="1.5"
            ></path>
            <circle cx="100" cy="14" fill="#8C4E2D" r="3.5"></circle>
            <circle cx="186" cy="100" fill="#2C4034" r="3.5"></circle>
            <circle cx="100" cy="186" fill="#8C4E2D" r="3.5"></circle>
            <circle cx="14" cy="100" fill="#2C4034" r="3.5"></circle>
          </svg>
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1 shadow-2xl bg-white ring-4 ring-white/95 border-2 border-[#CBB59B]/60">
            <img
              src={data.couple_photo || data.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
              alt={`${firstPerson.name} & ${secondPerson.name}`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Tier: Frosted Guest Card & High-Contrast Pine Green CTA Button */}
      <div className="w-full max-w-[340px] pb-4 sm:pb-5 flex flex-col items-center space-y-2.5 shrink-0 mt-auto z-10">
        <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-[0_12px_30px_rgba(30,46,34,0.08)] border border-[#2C4034]/15 flex flex-col items-center">
          <span className="text-[10px] sm:text-[11px] text-[#526859] uppercase tracking-wider font-semibold mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <div className="font-serif text-lg sm:text-xl text-[#1E2E22] font-bold line-clamp-1 my-0.5">
            {data.guest_name || 'Tamu Undangan Kinasih'}
          </div>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F5ECE0] text-[#8C4E2D] text-[11px] font-mono font-bold border border-[#DECFBD] shadow-2xs">
              <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
              <span>CHECK-IN PASS: {data.guest_code || 'RST-2025'}</span>
            </div>
          )}
          <p className="text-[10px] text-[#718576] text-center mt-1.5 italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full h-[50px] rounded-full bg-gradient-to-r from-[#1C2C20] via-[#2C4034] to-[#1C2C20] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(28,44,32,0.35)] ring-2 ring-[#2C4034]/50 border border-white/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer group"
          style={{ color: '#ffffffff' }}
        >
          <span className="material-symbols-outlined text-[20px] text-[#F3D5A3] group-hover:scale-110 transition-transform">
            mail
          </span>
          <span
            className="text-white font-bold text-sm sm:text-base tracking-wider uppercase drop-shadow-xs"
            style={{ color: '#ffffffff' }}
          >
            Buka Undangan
          </span>
          <span
            className="material-symbols-outlined text-[18px] text-white/90 group-hover:translate-y-0.5 transition-transform"
            style={{ color: '#ffffffff' }}
          >
            expand_more
          </span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'rustic' })}
      </div>
    </section>
  );
};
