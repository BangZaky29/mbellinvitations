import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  BugisTimpaLajaDivider,
  BugisTenunWatermark,
  BugisCornerOrnament,
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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0';

  return (
    <div className="relative w-full h-full min-h-full bg-[#00170E] text-[#C8EAD8] flex flex-col justify-between items-center px-4 py-3 sm:py-5 overflow-hidden select-none">
      {/* Background Ambience Vignette & Bugis Tenun Sa'be Motif */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00170E] via-[#052519]/90 to-[#00120A] pointer-events-none z-0" />
      <BugisTenunWatermark opacityClass="opacity-[0.06]" />

      {/* Top Header: Traditional Timpa Laja Crest & Royal Title */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-1 shrink-0">
        <BugisTimpaLajaDivider
          compact
          className="my-1"
          subTitle="THE ROYAL BUGIS-MAKASSAR MATRIMONY"
        />
        <p className="font-sans text-[10px] sm:text-[11px] text-[#D7C594] tracking-[0.2em] uppercase mt-0.5">
          Keluarga Besar Daeng &amp; Karaeng
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2CA50] mt-1 sm:mt-1.5 tracking-tight">
          {firstPerson.name}{' '}
          <span className="text-[#C8EAD8] italic font-serif font-normal">&amp;</span>{' '}
          {secondPerson.name}
        </h1>
        <p className="font-sans text-[9.5px] text-[#D0C5AF]/90 tracking-[0.16em] uppercase mt-0.5">
          {data.hashtag || 'Mappacci & Tudang Bottung'}
        </p>
      </div>

      {/* Centerpiece Photo with Royal Arched Frame */}
      <div className="relative z-10 my-auto py-1 flex-1 flex flex-col items-center justify-center w-full max-w-[230px] sm:max-w-[260px] min-h-0">
        <div className="w-full h-full max-h-[250px] sm:max-h-[300px] aspect-[3/3.7] rounded-t-[130px] rounded-b-2xl p-1 bg-gradient-to-b from-[#F2CA50] via-[#D4AF37]/40 to-transparent shadow-[0_16px_36px_rgba(0,18,10,0.95)]">
          <div className="w-full h-full rounded-t-[128px] rounded-b-xl overflow-hidden relative bg-[#052519]">
            <img
              src={coverPhoto}
              alt={`${firstPerson.name} & ${secondPerson.name}`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00120A]/90 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="inline-block px-3 py-1 bg-[#052519]/90 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] text-[#F2CA50] font-semibold tracking-widest uppercase border border-[#F2CA50]/30 shadow-md">
                {weddingDateStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Recipient Info & Buka Undangan CTA */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center text-center space-y-2 sm:space-y-2.5 pb-1 shrink-0 mt-auto">
        {/* Card Tamu Undangan */}
        <div className="relative w-full bg-[#052519]/85 backdrop-blur-md border border-[#F2CA50]/30 rounded-xl px-3.5 py-2.5 sm:py-3 shadow-lg flex flex-col items-center overflow-hidden">
          <BugisCornerOrnament position="top-left" className="absolute top-1 left-1 w-5 h-5 opacity-40 text-[#F2CA50]" />
          <BugisCornerOrnament position="top-right" className="absolute top-1 right-1 w-5 h-5 opacity-40 text-[#F2CA50]" />
          <span className="text-[9.5px] uppercase tracking-widest text-[#D7C594]">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#C8EAD8] mt-0.5 line-clamp-1">
            {recipientName}
          </h2>
          <span className="text-[9.5px] text-[#F2CA50] italic mt-0.5">
            Di {venueCity || 'Tempat'}
          </span>
        </div>

        {/* Tombol Buka Undangan */}
        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#F2CA50] via-[#FFE088] to-[#F2CA50] text-[#00170E] font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(242,202,80,0.35)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
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

