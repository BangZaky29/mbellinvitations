import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import { LiveStreamBanner } from '../../../common/LiveStreamBanner';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
} from '../components';

interface HeroSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isPreview?: boolean;
  isSectionActive?: (section: string) => boolean;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired?: boolean;
  };
  handleSaveToCalendar: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  theme,
  isSectionActive,
  countdown,
  handleSaveToCalendar,
}) => {
  const effectiveTheme = theme || data.theme_config;
  const isLivestreamActive = isSectionActive
    ? isSectionActive('livestream')
    : effectiveTheme?.show_livestream !== false;

  const livestreamUrl = data.livestream_url || data.streaming_url;
  const heroPhoto =
    data.couple_photo ||
    data.cover_image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp';

  const groomName = data.groom.name;
  const brideName = data.bride.name;

  return (
    <section className="relative w-full shrink-0 bg-[#4A0E12] text-[#FDF9F2] overflow-hidden px-4 pt-10 pb-8 flex flex-col items-center">
      {/* Background Ambience & Palembang Songket Watermark */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A0003] via-[#4A0E12] to-[#2A0003] pointer-events-none z-0" />
      <PalembangSongketWatermark opacityClass="opacity-[0.07]" showPucukBorders />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center text-center">
        {/* Royal Palembang Aesan Gede & Rumah Limas Crest */}
        <RumahLimasDivider
          className="mb-2"
          subTitle="Walimatul ‘Ursy • Adat Palembang Darussalam"
        />

        {/* Couple Names Headline */}
        <div className="text-center my-3">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FDF9F2] tracking-normal font-bold">
            {groomName}
          </h2>
          <div className="flex items-center justify-center gap-3 my-1.5">
            <span className="w-10 h-px bg-[#FFD57A]/40" />
            <span className="font-serif text-xl sm:text-2xl text-[#FFD57A] italic font-normal">&amp;</span>
            <span className="w-10 h-px bg-[#FFD57A]/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FDF9F2] tracking-normal font-bold">
            {brideName}
          </h2>
        </div>

        {/* Music Pill Notification */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A0003]/80 border border-[#FFD57A]/30 text-[#FFD57A] text-[11px] font-sans tracking-wider mb-5 shadow-sm">
          <span className="material-symbols-outlined text-[15px] animate-pulse">music_note</span>
          <span>{effectiveTheme?.music_title || 'Gending Sriwijaya • Iringan Tabuh Agung'}</span>
        </div>

        {/* Centerpiece Arch-Framed Portrait of Couple */}
        <div className="relative w-full max-w-[300px] aspect-[3/4] rounded-t-full overflow-hidden shadow-2xl bg-[#2A0003] border-2 border-[#FFD57A]/40 p-1">
          <div className="relative w-full h-full rounded-t-full overflow-hidden">
            <img
              src={heroPhoto}
              alt={`${groomName} & ${brideName}`}
              className="w-full h-full object-cover object-center"
            />
            {/* Ambient Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A0003] via-transparent to-[#2A0003]/40 pointer-events-none" />

            {/* Arch Inner Filigree Overlay */}
            <div className="absolute inset-0 rounded-t-full pointer-events-none flex flex-col justify-between p-3">
              <div className="w-full flex justify-center">
                <svg className="w-16 h-8 text-[#FFD57A] opacity-75" fill="none" viewBox="0 0 60 30">
                  <path d="M5 25 Q30 5 55 25" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="30" cy="12" fill="currentColor" r="3" />
                </svg>
              </div>
              {/* Jasmine Row at base */}
              <div className="w-full flex items-center justify-center gap-2 pb-2 text-[#FDF9F2]">
                <span className="material-symbols-outlined text-[15px] text-[#FFD57A]">spa</span>
                <span className="font-sans text-[10px] tracking-widest uppercase text-[#FFD57A] font-semibold">
                  Aesan Gede • Songket Lepus
                </span>
                <span className="material-symbols-outlined text-[15px] text-[#FFD57A]">spa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save the Date Pill Badge */}
        <div className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FDF9F2] text-[#2A0003] shadow-lg border border-[#FFD57A]/60">
          <span className="material-symbols-outlined text-[18px] text-[#785A05]">calendar_today</span>
          <span className="font-sans text-xs tracking-widest uppercase font-bold text-[#2A0003]">
            {data.wedding_date_display || 'Sabtu, 14 November 2026'}
          </span>
        </div>

        {/* Universal LiveStreamBanner Integration (Rule 12) */}
        {isLivestreamActive && livestreamUrl && (
          <LiveStreamBanner
            url={livestreamUrl}
            variant="palembang"
            className="mt-6 w-full"
          />
        )}

        {/* Countdown Timer (4 Deep Crimson Tiles) */}
        <div className="w-full mt-6">
          <span className="font-sans text-[10px] text-[#FFD57A] uppercase tracking-[0.2em] block mb-2 font-semibold">
            Hitung Mundur Hari Bahagia
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#2A0003]/85 border border-[#FFD57A]/30 text-[#FDF9F2] rounded-xl p-2.5 shadow-sm">
              <span className="font-serif text-2xl font-bold text-[#FFD57A] block leading-tight">
                {countdown.days}
              </span>
              <span className="font-sans text-[10px] text-[#FFD57A]/80 uppercase tracking-widest">
                Hari
              </span>
            </div>
            <div className="bg-[#2A0003]/85 border border-[#FFD57A]/30 text-[#FDF9F2] rounded-xl p-2.5 shadow-sm">
              <span className="font-serif text-2xl font-bold text-[#FFD57A] block leading-tight">
                {countdown.hours < 10 ? `0${countdown.hours}` : countdown.hours}
              </span>
              <span className="font-sans text-[10px] text-[#FFD57A]/80 uppercase tracking-widest">
                Jam
              </span>
            </div>
            <div className="bg-[#2A0003]/85 border border-[#FFD57A]/30 text-[#FDF9F2] rounded-xl p-2.5 shadow-sm">
              <span className="font-serif text-2xl font-bold text-[#FFD57A] block leading-tight">
                {countdown.minutes < 10 ? `0${countdown.minutes}` : countdown.minutes}
              </span>
              <span className="font-sans text-[10px] text-[#FFD57A]/80 uppercase tracking-widest">
                Menit
              </span>
            </div>
            <div className="bg-[#2A0003]/85 border border-[#FFD57A]/30 text-[#FDF9F2] rounded-xl p-2.5 shadow-sm">
              <span className="font-serif text-2xl font-bold text-[#FFD57A] block leading-tight">
                {countdown.seconds < 10 ? `0${countdown.seconds}` : countdown.seconds}
              </span>
              <span className="font-sans text-[10px] text-[#FFD57A]/80 uppercase tracking-widest">
                Detik
              </span>
            </div>
          </div>

          {/* Save to Google Calendar Button */}
          <button
            type="button"
            onClick={handleSaveToCalendar}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-[#785A05] via-[#EAC168] to-[#785A05] text-[#2A0003] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-[#FFD57A]/50"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            <span className="font-sans text-xs tracking-wider uppercase">
              Simpan ke Google Calendar
            </span>
          </button>
        </div>
      </div>

      {/* Deckled Paper Transition into Section 2 */}
      <div className="w-full overflow-hidden leading-none -mb-8 mt-8 pointer-events-none select-none text-[#FDF9F2]">
        <svg className="w-full h-7 block" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 430 28">
          <path d="M0,0 C35,18 70,8 107,20 C145,26 182,10 215,22 C255,27 290,12 328,21 C365,26 398,14 430,0 L430,28 L0,28 Z" />
        </svg>
      </div>
    </section>
  );
};
