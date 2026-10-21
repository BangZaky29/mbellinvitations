import React from 'react';
import type { BaseSectionProps, CoupleInfo } from '../../types';
import { SigerCrownSvg } from '../components/SigerCrownSvg';

export interface SundaCoverProps extends BaseSectionProps {
  firstPerson: CoupleInfo;
  secondPerson: CoupleInfo;
  coupleOrderTitle: string;
  weddingDateStr: string;
  venueCity: string;
  recipientName: string;
  handleOpenInvitation: () => void;
  renderSwipeHint: (options?: any) => React.ReactNode;
}

export const CoverSection: React.FC<SundaCoverProps> = ({
  data,
  firstPerson,
  secondPerson,
  coupleOrderTitle,
  weddingDateStr,
  venueCity,
  recipientName,
  isPreview,
  handleOpenInvitation,
  renderSwipeHint,
}) => {
  return (
    <section
      id="sampul"
      className="w-full h-full min-h-full relative flex flex-col items-center justify-between px-6 pt-8 pb-10 text-center bg-gradient-to-b from-[#fbf9f6] via-[#f7f4ed] to-[#ede7dc] overflow-hidden"
    >
      {/* Ambient Sundanese Backdrop using Cover Photo if present */}
      {(data.cover_image || data.couple_photo) && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={data.cover_image || data.couple_photo}
            alt="Cover Background"
            className="w-full h-full object-cover opacity-20 filter blur-[0.8px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1915]/85 via-[#2c241c]/75 to-[#1a140f]/90"></div>
        </div>
      )}

      {/* Top Notch-Safe Siger Header */}
      <div className="relative z-10 pt-4 shrink-0 flex flex-col items-center">
        <div className="w-24 h-10 mb-2 flex items-center justify-center text-[#e8c676] animate-float-siger drop-shadow-md">
          <SigerCrownSvg />
        </div>

        <span
          className={`text-[10.5px] font-semibold tracking-[0.28em] uppercase mb-1 drop-shadow-sm ${data.cover_image || data.couple_photo ? 'text-[#ebd49d]' : 'text-[#8a6822]'
            }`}
        >
          The Wedding Celebration
        </span>

        <div className="flex items-center gap-2 opacity-80 my-0.5">
          <span className="w-8 h-px bg-[#c5a059]" />
          <span className="text-[10px] tracking-widest uppercase font-serif text-[#c5a059] italic">Parahyangan</span>
          <span className="w-8 h-px bg-[#c5a059]" />
        </div>
      </div>

      {/* Center Framed Arch Couple Image with Gold Rim */}
      <div className="relative z-10 my-3 flex flex-col items-center justify-center">
        <div className="relative w-60 h-76 sm:w-64 sm:h-80 rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl p-2 bg-gradient-to-b from-[#d4af37] via-[#c5a059]/60 to-[#8a6822] ring-1 ring-white/30">
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden relative bg-[#2c241c]">
            <img
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              src={
                data.cover_image ||
                data.couple_photo ||
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
              }
              alt={coupleOrderTitle}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>

        <h1
          className={`text-2xl sm:text-3xl font-serif mt-3 font-medium tracking-wide drop-shadow-sm ${data.cover_image || data.couple_photo ? 'text-white' : 'text-[#1b1c1a]'
            }`}
        >
          {firstPerson.name}{' '}
          <span className="text-[#e8c676] text-2xl font-serif italic font-light">&amp;</span>{' '}
          {secondPerson.name}
        </h1>

        <p
          className={`text-xs tracking-wider uppercase mt-1 ${data.cover_image || data.couple_photo ? 'text-[#e2d5c3]' : 'text-[#5d4201]'
            }`}
        >
          {weddingDateStr} • {venueCity}
        </p>
      </div>

      {/* Bottom Guest Pass & CTA Button */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center space-y-3 shrink-0">
        <div className="w-full p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl text-center flex flex-col items-center border border-[#c5a059]/40">
          <span className="text-[10px] text-[#8a6822] font-semibold uppercase tracking-widest mb-0.5">
            Kahatur Kagem Bapak/Ibu/Saudara/i:
          </span>
          <h3 className="text-base sm:text-lg text-[#1b1c1a] font-serif font-bold tracking-tight line-clamp-1">
            {recipientName}
          </h3>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f7f3ea] text-[#775a19] border border-[#c5a059]/30 text-[11px] font-mono font-medium">
              <span className="material-symbols-outlined text-[14px]">qr_code</span>
              <span>CHECK-IN PASS: {data.guest_code || 'KRT-2026'}</span>
            </div>
          )}
          <p className="text-[10px] text-[#735855] mt-1 italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#b38728] via-[#c5a059] to-[#8a6822] hover:brightness-105 text-white font-serif font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ring-1 ring-white/30"
        >
          <span className="material-symbols-outlined text-[19px]">mail</span>
          <span>Buka Undangan</span>
          <span className="material-symbols-outlined text-[17px] transition-transform duration-300 group-hover:translate-x-1">
            arrow_downward
          </span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'gold' })}
      </div>
    </section>
  );
};

export default CoverSection;
