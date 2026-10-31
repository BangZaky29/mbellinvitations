import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  KembangKelapaCrest,
  GigiBalangHorizontalBorder,
  BetawiBatikWatermark,
  BetawiCornerFloral,
} from '../components';

interface CoverSectionProps {
  data: InvitationData;
  isPreview?: boolean;
  firstPerson: CoupleInfo | { name: string; full_name?: string };
  secondPerson: CoupleInfo | { name: string; full_name?: string };
  coupleOrderTitle: string;
  weddingDateStr: string;
  venueCity: string;
  recipientName: string;
  handleOpenInvitation: () => void;
  renderSwipeHint: (extraProps?: any) => React.ReactNode;
}

export const CoverSection: React.FC<CoverSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
  weddingDateStr,
  venueCity,
  recipientName,
  handleOpenInvitation,
  renderSwipeHint,
}) => {
  const coverPhoto =
    data.cover_image ||
    data.couple_photo ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI';

  return (
    <div className="relative w-full h-full min-h-full bg-[#410403] text-[#FAF6EE] flex flex-col justify-between items-center px-4 py-3 sm:py-5 overflow-hidden select-none">
      {/* Background Ambience Vignette & Betawi Batik Motif */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#410403] via-[#5E1914]/85 to-[#300202] pointer-events-none z-0" />
      <BetawiBatikWatermark opacityClass="opacity-[0.06]" />

      {/* Top Header: Traditional Betawi Crest & Greeting */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-1 shrink-0">
        <KembangKelapaCrest className="w-14 h-10 mb-1 sm:mb-2 text-[#FED65B]" />
        <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-[#FED65B] tracking-[0.25em] uppercase">
          WALIMATUL ‘URSY • HAJATAN BETAWI
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF6EE] mt-1 sm:mt-1.5 tracking-tight">
          {firstPerson.name}{' '}
          <span className="text-[#FED65B] italic font-serif">&amp;</span>{' '}
          {secondPerson.name}
        </h1>
        <p className="font-sans text-[10px] sm:text-[11px] text-[#FFE088]/90 tracking-[0.18em] uppercase mt-0.5">
          {data.hashtag || 'Palang Pintu & Kembang Kelapa'}
        </p>
        <GigiBalangHorizontalBorder className="w-48 h-[4px] mt-1.5 opacity-60" color="#FED65B" />
      </div>

      {/* Centerpiece Photo with Arched Frame */}
      <div className="relative z-10 my-auto py-1 flex-1 flex flex-col items-center justify-center w-full max-w-[230px] sm:max-w-[260px] min-h-0">
        <div className="w-full h-full max-h-[250px] sm:max-h-[300px] aspect-[3/3.7] rounded-t-[130px] rounded-b-2xl p-1 bg-gradient-to-b from-[#FED65B] via-[#FFE088]/40 to-transparent shadow-[0_16px_36px_rgba(0,0,0,0.85)]">
          <div className="w-full h-full rounded-t-[128px] rounded-b-xl overflow-hidden relative">
            <img
              src={coverPhoto}
              alt={`${firstPerson.name} & ${secondPerson.name}`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#410403]/90 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="inline-block px-3 py-1 bg-[#410403]/85 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] text-[#FED65B] font-medium tracking-widest uppercase border border-[#FED65B]/30">
                {weddingDateStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Recipient Info & Buka Undangan CTA */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center text-center space-y-2 sm:space-y-2.5 pb-1 shrink-0 mt-auto">
        {/* Card Tamu Undangan */}
        <div className="relative w-full bg-[#5E1914]/80 backdrop-blur-md border border-[#FED65B]/30 rounded-xl px-3.5 py-2.5 sm:py-3 shadow-lg flex flex-col items-center overflow-hidden">
          <BetawiCornerFloral position="top-left" className="absolute top-1 left-1 w-5 h-5 opacity-40 text-[#FED65B]" />
          <BetawiCornerFloral position="top-right" className="absolute top-1 right-1 w-5 h-5 opacity-40 text-[#FED65B]" />
          <span className="text-[9.5px] uppercase tracking-widest text-[#FFE088]/80">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#FAF6EE] mt-0.5 line-clamp-1">
            {recipientName}
          </h2>
          <span className="text-[9.5px] text-[#FED65B] italic mt-0.5">
            Di {venueCity || 'Tempat'}
          </span>
        </div>

        {/* Tombol Buka Undangan */}
        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#FED65B] via-[#FFE088] to-[#FED65B] text-[#410403] font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(254,214,91,0.35)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">mail_lock</span>
          <span>Buka Undangan</span>
        </button>

        {/* Petunjuk Geser / Swipe Up Hint */}
        <div className="pt-0.5">
          {renderSwipeHint()}
        </div>
      </div>
    </div>
  );
};
