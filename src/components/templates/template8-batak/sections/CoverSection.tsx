import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import { RumahBolonCrest } from '../components/RumahBolonCrest';

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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSaBmrSBPc6JBKfMGqLIwMcxmJRsHH9qVZk8tBz0UbaTiqr__0cHe8qR7wa7pIidP8_8Og6HU73yBrOcZrSmoR0VOzFQbGjcAul7SLH3jLgnI3x7rrgaoHvaFdDgPWvWh-qvNSEonSJkhF0b6eLzJhN8v8BtpscySxZyQIK0FiwUhAhT03f0hmkC2Qs4L0mvbWQTNDyHGHXOByJ1ZMOP4CT3YnyDEde8G5oelkyODSd9uKn2rKVdGU';

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-[#140D09] text-[#FAF6EE] flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">
      {/* Background Ambience Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140D09]/90 via-[#19120E]/70 to-[#140D09] pointer-events-none z-0" />

      {/* Top Header: Traditional Batak Crest & Blessing */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <RumahBolonCrest size="md" className="mb-2" />
        <span className="font-sans text-[11px] font-semibold text-[#EAC16E] tracking-[0.25em] uppercase">
          Horas! The Wedding Celebration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF6EE] mt-2 tracking-tight">
          {firstPerson.name}{' '}
          <span className="text-[#EAC16E] italic font-serif">&amp;</span>{' '}
          {secondPerson.name}
        </h1>
        <p className="font-sans text-[11px] text-[#D0C5B5] tracking-[0.18em] uppercase mt-1">
          {data.hashtag || 'Siregar Silali • Simanjuntak Sitompul'}
        </p>
      </div>

      {/* Centerpiece Photo with Arched Frame */}
      <div className="relative z-10 my-4 w-full max-w-[260px] aspect-[3/3.8] rounded-t-[140px] rounded-b-2xl p-1 bg-gradient-to-b from-[#EAC16E] via-[#C8A253]/40 to-transparent shadow-[0_16px_36px_rgba(0,0,0,0.85)]">
        <div className="w-full h-full rounded-t-[138px] rounded-b-xl overflow-hidden relative">
          <img
            src={coverPhoto}
            alt={`${firstPerson.name} & ${secondPerson.name}`}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140D09]/90 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-2.5 inset-x-0 text-center">
            <span className="inline-block px-3 py-1 bg-[#140D09]/85 backdrop-blur-md rounded-full text-[10px] text-[#EAC16E] font-medium tracking-widest uppercase border border-[#EAC16E]/30">
              {weddingDateStr}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Card: Recipient Info & Buka Undangan CTA */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center text-center space-y-3 pb-2">
        {/* Card Tamu Undangan */}
        <div className="w-full bg-[#261E1A]/90 backdrop-blur-md border border-[#EAC16E]/30 rounded-xl px-4 py-3 shadow-lg flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-[#D0C5B5]/80">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#FAF6EE] mt-0.5 line-clamp-1">
            {recipientName}
          </h2>
          <span className="text-[10px] text-[#EAC16E] italic mt-0.5">
            Di {venueCity || 'Tempat'}
          </span>
        </div>

        {/* Tombol Buka Undangan */}
        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C8A253] via-[#EAC16E] to-[#C8A253] text-[#402D00] font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(200,162,83,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">mail_lock</span>
          <span>Buka Undangan</span>
        </button>

        {/* Petunjuk Geser / Swipe Up Hint */}
        <div className="pt-1">
          {renderSwipeHint()}
        </div>
      </div>
    </div>
  );
};
