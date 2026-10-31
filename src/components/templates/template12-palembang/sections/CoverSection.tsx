import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
  PalembangCornerFiligree,
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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp';

  return (
    <div className="relative w-full h-full min-h-full bg-[#4A0E12] text-[#FDF9F2] flex flex-col justify-between items-center px-4 py-3 sm:py-5 overflow-hidden select-none">
      {/* Background Ambience & Palembang Songket Watermark */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A0003] via-[#4A0E12] to-[#2A0003] pointer-events-none z-0" />
      <PalembangSongketWatermark opacityClass="opacity-[0.08]" showPucukBorders />

      {/* Top Header: Traditional Rumah Limas Crest & Royal Palembang Title */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-1 shrink-0">
        <RumahLimasDivider
          compact
          className="my-1"
          subTitle="WALIMATUL ‘URSY • ADAT PALEMBANG"
        />
        <p className="font-sans text-[10px] sm:text-[11px] text-[#FFD57A] tracking-[0.2em] uppercase mt-0.5 font-medium">
          The Royal Wedding of
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF9F2] mt-1 sm:mt-1.5 tracking-tight">
          {firstPerson.name}{' '}
          <span className="text-[#FFD57A] italic font-serif font-normal">&amp;</span>{' '}
          {secondPerson.name}
        </h1>
        <p className="font-sans text-[9.5px] text-[#FFD57A]/80 tracking-[0.16em] uppercase mt-0.5">
          {data.hashtag || '#FarhanNyimasSatuHati'}
        </p>
      </div>

      {/* Center Arch Frame: Palembang Royal Couple Portrait (Aesan Gede) */}
      <div className="relative z-10 w-full max-w-[240px] sm:max-w-[270px] aspect-[4/5] my-auto py-1 shrink min-h-0 flex items-center justify-center">
        <div className="relative w-full h-full rounded-t-full rounded-b-2xl overflow-hidden p-1.5 bg-gradient-to-b from-[#FFD57A] via-[#EAC168]/70 to-[#2A0003]/80 shadow-2xl">
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#2A0003] relative">
            <img
              src={coverPhoto}
              alt="Mempelai Adat Palembang"
              className="w-full h-full object-cover object-center filter brightness-[0.98]"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A0003]/80 via-transparent to-transparent" />

            {/* Date Pill Badge at Base */}
            <div className="absolute bottom-2.5 inset-x-2 flex justify-center">
              <span className="px-3 py-1 bg-[#2A0003]/90 backdrop-blur-md text-[#FFD57A] border border-[#FFD57A]/50 rounded-full text-[9.5px] sm:text-[10px] font-sans tracking-widest uppercase font-semibold shadow-md">
                {weddingDateStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Guest Invitation Card & Unlock Button */}
      <div className="relative z-10 w-full flex flex-col items-center shrink-0 pb-1">
        <div className="relative w-full max-w-[320px] bg-[#2A0003]/85 border border-[#FFD57A]/40 rounded-xl p-3 sm:p-3.5 text-center shadow-lg backdrop-blur-md overflow-hidden">
          {/* Corner Carving Ornaments */}
          <PalembangCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#FFD57A" />
          <PalembangCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#FFD57A" />
          <PalembangCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#FFD57A" />
          <PalembangCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#FFD57A" />

          <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#FFD57A]/90 font-medium mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#FDF9F2] break-words line-clamp-1">
            {recipientName}
          </h2>
          <p className="font-sans text-[8.5px] sm:text-[9px] text-[#F1EDE6]/80 tracking-wider mt-0.5">
            {venueCity ? `${venueCity} • Di Tempat` : 'Di Tempat'}
          </p>
        </div>

        {/* CTA Button: Buka Undangan */}
        <div className="w-full max-w-[280px] mt-3">
          <button
            type="button"
            onClick={handleOpenInvitation}
            className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#785A05] via-[#EAC168] to-[#785A05] text-[#2A0003] border border-[#FFD57A]/60 shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-sm text-[#2A0003] group-hover:rotate-12 transition-transform">
              drafts
            </span>
            <span className="font-sans text-xs tracking-widest uppercase font-bold text-[#2A0003]">
              Buka Undangan
            </span>
          </button>
        </div>

        {renderSwipeHint({ variant: 'palembang' })}
      </div>
    </div>
  );
};

