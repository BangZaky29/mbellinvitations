import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R';

  return (
    <div className="relative w-full h-full min-h-full bg-[#FFF9EF] text-[#1D1B16] flex flex-col justify-between items-center px-4 py-3 sm:py-5 overflow-hidden select-none">
      {/* Background Ambience & Balinese Patra Sari Watermark */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9EF] via-[#F3EDE4]/80 to-[#FFF9EF] pointer-events-none z-0" />
      <BaliPatraWatermark opacityClass="opacity-[0.055]" />

      {/* Top Header: Traditional Candi Bentar Crest & Sacred Title */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-1 shrink-0">
        <CandiBentarDivider
          compact
          className="my-1"
          subTitle="PAWIWAHAN AGENG • OM SWASTYASTU"
        />
        <p className="font-sans text-[10px] sm:text-[11px] text-[#735C00] tracking-[0.2em] uppercase mt-0.5 font-medium">
          Dharma Yadnya Pawiwahan
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#411710] mt-1 sm:mt-1.5 tracking-tight">
          {firstPerson.name}{' '}
          <span className="text-[#D4AF37] italic font-serif font-normal">&amp;</span>{' '}
          {secondPerson.name}
        </h1>
        <p className="font-sans text-[9.5px] text-[#524341] tracking-[0.16em] uppercase mt-0.5">
          {data.hashtag || '#AryaBulanPawiwahan'}
        </p>
      </div>

      {/* Center Arch Frame: Balinese Royal Couple Portrait */}
      <div className="relative z-10 w-full max-w-[240px] sm:max-w-[270px] aspect-[4/5] my-auto py-1 shrink min-h-0 flex items-center justify-center">
        <div className="relative w-full h-full rounded-t-full rounded-b-2xl overflow-hidden p-1.5 bg-gradient-to-b from-[#D4AF37] via-[#FED65B]/60 to-[#411710]/40 shadow-xl">
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#F3EDE4] relative">
            <img
              src={coverPhoto}
              alt="Mempelai Pawiwahan Bali"
              className="w-full h-full object-cover object-center filter brightness-[0.98]"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#411710]/70 via-transparent to-transparent" />

            {/* Date Pill Badge at Base */}
            <div className="absolute bottom-2.5 inset-x-2 flex justify-center">
              <span className="px-3 py-1 bg-[#FFF9EF]/95 backdrop-blur-md text-[#411710] border border-[#D4AF37]/50 rounded-full text-[9.5px] sm:text-[10px] font-sans tracking-widest uppercase font-semibold shadow-md">
                {weddingDateStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Guest Invitation Card & Unlock Button */}
      <div className="relative z-10 w-full flex flex-col items-center shrink-0 pb-1">
        <div className="relative w-full max-w-[320px] bg-[#FFF9EF]/95 border border-[#D4AF37]/40 rounded-xl p-3 sm:p-3.5 text-center shadow-lg backdrop-blur-md overflow-hidden">
          {/* Corner Carving Ornaments */}
          <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

          <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#735C00] font-medium mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#411710] break-words line-clamp-1">
            {recipientName}
          </h2>
          <p className="font-sans text-[8.5px] sm:text-[9px] text-[#524341] tracking-wider mt-0.5">
            {venueCity ? `${venueCity} • Di Tempat` : 'Di Tempat'}
          </p>
        </div>

        {/* CTA Button: Buka Undangan */}
        <div className="w-full max-w-[280px] mt-3">
          <button
            type="button"
            onClick={handleOpenInvitation}
            className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#411710] via-[#5C2C23] to-[#411710] text-[#FFF9EF] border border-[#D4AF37]/60 shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-sm text-[#FED65B] group-hover:rotate-12 transition-transform">
              drafts
            </span>
            <span className="font-sans text-xs tracking-widest uppercase font-semibold">
              Buka Undangan
            </span>
          </button>
        </div>

        {renderSwipeHint({ variant: 'bali' })}
      </div>
    </div>
  );
};

