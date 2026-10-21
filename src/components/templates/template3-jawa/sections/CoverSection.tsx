import React from 'react';
import type { CoverSectionProps } from '../../types';

export const CoverSection: React.FC<CoverSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
  handleOpenInvitation,
  renderSwipeHint,
  isPreview,
}) => {
  return (
    <section
      id="sampul"
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-5 sm:p-7 overflow-hidden bg-[#14100D]"
    >
      {/* Traditional Javanese Kawung lattice geometric decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#F3D068_1px,transparent_1px)] [background-size:18px_18px]"></div>

      {/* Traditional Royal Backdrop using Cover Photo if present */}
      {(data.cover_image || data.couple_photo) && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={data.cover_image || data.couple_photo}
            alt="Cover Background"
            className="w-full h-full object-cover opacity-25 filter blur-[0.5px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#14100D]/90 via-[#14100D]/80 to-[#14100D]"></div>
        </div>
      )}

      {/* Top Notch-Safe Ornamental Motif & Royal Title */}
      <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-2 opacity-80">
          <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
          <span className="material-symbols-outlined text-[#F3D068] text-sm">spa</span>
          <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
        </div>
        <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#FFE082] font-semibold drop-shadow-sm">
          The Royal Wedding Of
        </span>
      </div>

      {/* Middle Tier: Royal Arched Photo Frame / Gunungan Wayang & Couple Names */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
        {(data.cover_image || data.couple_photo) ? (
          <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-t-full rounded-b-xl overflow-hidden p-1.5 bg-gradient-to-b from-[#F3D068] via-[#D4AF37]/40 to-[#14100D] shadow-2xl shadow-black/90 mb-4 border border-[#F3D068]/60">
            <div className="relative w-full h-full rounded-t-full rounded-b-lg overflow-hidden bg-[#14100D]">
              <img
                src={data.cover_image || data.couple_photo}
                alt={`${firstPerson.name} & ${secondPerson.name}`}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14100D]/70 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        ) : (
          <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center mb-3">
            <div className="absolute inset-0 rounded-full bg-[#F3D068]/15 blur-xl"></div>
            <svg
              className="w-full h-full text-[#F3D068] drop-shadow-[0_4px_16px_rgba(243,208,104,0.35)]"
              fill="none"
              viewBox="0 0 100 135"
            >
              <path
                d="M50 4 C48 18 18 60 18 90 C18 116 34 130 50 130 C66 130 82 116 82 90 C82 60 52 18 50 4 Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2.2"
              ></path>
              <circle cx="50" cy="4" fill="currentColor" r="3"></circle>
              <rect height="18" rx="2" stroke="currentColor" strokeWidth="1.4" width="12" x="44" y="104"></rect>
            </svg>
          </div>
        )}

        <div className="space-y-0.5 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFE082] tracking-wide drop-shadow-md">
            {firstPerson.name}
          </h1>
          <p className="font-serif italic text-base text-[#D4AF37] my-0.5">&amp;</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFE082] tracking-wide drop-shadow-md">
            {secondPerson.name}
          </h2>
        </div>
      </div>

      {/* Bottom Tier: Undangan Kepada Card & CTA Button Anchored Bottom */}
      <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
        <div className="w-full bg-[#1C1612]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#F3D068]/35 text-center">
          <div className="flex items-center justify-between mb-1.5 opacity-80">
            <span className="material-symbols-outlined text-xs text-[#F3D068]">filter_vintage</span>
            <span className="text-[11px] sm:text-xs text-[#FFE082] uppercase tracking-widest font-semibold">
              Serat Katur Dhumateng
            </span>
            <span className="material-symbols-outlined text-xs text-[#F3D068]">filter_vintage</span>
          </div>
          <p className="text-xs text-[#FAF6F0]/90 font-medium">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <div className="my-2 py-2 px-3 bg-[#14100D] rounded-xl border border-[#F3D068]/20">
            <p className="font-serif text-lg sm:text-xl text-[#FFE082] font-bold line-clamp-1">
              {data.guest_name || 'Tamu Undangan Kinasih'}
            </p>
          </div>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1 mb-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A201A] border border-[#F3D068]/40 text-[#FFE082] text-xs font-mono font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
              <span>CHECK-IN PASS: {data.guest_code || 'KRT-2025'}</span>
            </div>
          )}
          <p className="text-[10px] text-[#FAF6F0]/70 mt-1 italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full h-[50px] sm:h-[54px] rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3D068] to-[#C59B27] text-[#14100D] font-bold text-sm tracking-wider shadow-[0_8px_24px_rgba(243,208,104,0.35)] hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ring-2 ring-[#FFE082]/30"
        >
          <span className="material-symbols-outlined text-lg">drafts</span>
          <span>BUKA UNDANGAN</span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'jawa' })}
      </div>
    </section>
  );
};
