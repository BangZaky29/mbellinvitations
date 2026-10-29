import React from 'react';
import type { HeroSectionProps } from '../../types';
import { LiveStreamBanner } from '../../../common/LiveStreamBanner';
import { openGoogleCalendar } from '../../../../utils/calendarHelper';

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  theme,
  isSectionActive,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  countdown,
}) => {
  const effectiveTheme = theme || data.theme_config;
  const isQuoteVisible = isSectionActive
    ? isSectionActive('quote')
    : effectiveTheme?.show_quote !== false &&
      (!effectiveTheme?.active_sections || effectiveTheme.active_sections.includes('quote'));

  const streamingUrl = data.streaming_url || data.livestream_url;
  const isLivestreamActive = isSectionActive
    ? isSectionActive('livestream')
    : effectiveTheme?.show_livestream !== false &&
      (!effectiveTheme?.active_sections ||
        effectiveTheme.active_sections.includes('livestream') ||
        effectiveTheme.active_sections.includes('live_stream'));

  const firstPerson = rawFirst || data.groom || { name: 'Mempelai Pria' };
  const secondPerson = rawSecond || data.bride || { name: 'Mempelai Wanita' };
  const { days, hours, minutes, seconds } = countdown;

  return (
    <section
      id="pawarta"
      className="relative w-full bg-surface px-margin py-space-xl flex flex-col items-center text-center"
    >
      {/* Decorative Filigree Arch Frame */}
      <div className="w-full relative rounded-2xl bg-surface-container-low p-3 shadow-2xl shadow-surface-container-lowest mb-6 reveal-scale">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-surface-container">
          <img
            src={data.couple_photo || data.cover_image}
            alt={`${firstPerson.name} & ${secondPerson.name}`}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/30"></div>
          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed px-3 py-1 bg-surface-container-low/80 backdrop-blur-sm rounded-full">
              {data.hashtag || 'Kraton Ngayogyakarta Hadiningrat'}
            </span>
          </div>
        </div>
      </div>

      {/* Royal Date & Javanese Calendar */}
      <div className="mb-4">
        <p className="font-serif text-2xl sm:text-3xl font-bold text-[#FFE082] drop-shadow-sm">
          {data.wedding_date_display}
        </p>
        <p className="font-serif text-sm text-[#D4AF37] mt-1 italic">
          Dinten Berkah • Windu Sancaya
        </p>
      </div>

      {/* Philosophical Sacred Quote */}
      {isQuoteVisible && (
        <div className="w-full bg-[#1C1612]/90 border border-[#F3D068]/30 rounded-2xl p-5 mb-8 shadow-xl text-center reveal delay-100">
          {data.quote_title && (
            <span className="block text-[11px] uppercase tracking-widest text-[#FFE082] font-semibold mb-2">
              {data.quote_title}
            </span>
          )}
          {data.quote_arabic && (
            <p
              dir="rtl"
              className="font-serif text-lg sm:text-xl leading-loose text-[#FFE082] my-2 px-1 font-normal"
            >
              {data.quote_arabic}
            </p>
          )}
          <p className="font-serif text-base sm:text-lg text-[#FAF6F0] italic leading-relaxed">
            &ldquo;{data.quote}&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
            <span className="text-xs uppercase tracking-widest text-[#FFE082] font-semibold">
              {data.quote_source}
            </span>
            <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          </div>
        </div>
      )}

      {/* Royal Countdown Timer Cards */}
      <div className="w-full reveal delay-200">
        <span className="text-xs uppercase tracking-[0.2em] text-[#FFE082] font-semibold block mb-3 text-center">
          Menghitung Waktu Berkah
        </span>
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full">
          <div className="bg-gradient-to-b from-[#251D18] to-[#16110D] border border-[#F3D068]/35 rounded-2xl py-3.5 px-1 shadow-xl flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FFE082] tracking-wider drop-shadow-[0_2px_8px_rgba(243,208,104,0.3)]">
              {days}
            </span>
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-widest font-semibold text-[#E0D5C1] mt-1">
              Hari
            </span>
          </div>
          <div className="bg-gradient-to-b from-[#251D18] to-[#16110D] border border-[#F3D068]/35 rounded-2xl py-3.5 px-1 shadow-xl flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FFE082] tracking-wider drop-shadow-[0_2px_8px_rgba(243,208,104,0.3)]">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-widest font-semibold text-[#E0D5C1] mt-1">
              Jam
            </span>
          </div>
          <div className="bg-gradient-to-b from-[#251D18] to-[#16110D] border border-[#F3D068]/35 rounded-2xl py-3.5 px-1 shadow-xl flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FFE082] tracking-wider drop-shadow-[0_2px_8px_rgba(243,208,104,0.3)]">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-widest font-semibold text-[#E0D5C1] mt-1">
              Menit
            </span>
          </div>
          <div className="bg-gradient-to-b from-[#251D18] to-[#16110D] border border-[#F3D068]/35 rounded-2xl py-3.5 px-1 shadow-xl flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FFE082] tracking-wider drop-shadow-[0_2px_8px_rgba(243,208,104,0.3)]">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-widest font-semibold text-[#E0D5C1] mt-1">
              Detik
            </span>
          </div>
        </div>

        {/* CTA Simpan ke Google Calendar */}
        <div className="mt-5 flex justify-center w-full">
          <button
            type="button"
            onClick={() => openGoogleCalendar(data)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#DFBA73] hover:to-[#C5A059] text-[#1A1412] font-serif font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer border border-[#FFE082]/40"
          >
            <span className="material-symbols-outlined text-[18px]">
              event_available
            </span>
            <span>Simpan ke Google Calendar</span>
          </button>
        </div>
      </div>

      {/* Optional Livestream Banner */}
      {isLivestreamActive && Boolean(streamingUrl) && (
        <div className="mt-6 w-full flex justify-center">
          <LiveStreamBanner url={streamingUrl} variant="jawa" />
        </div>
      )}
    </section>
  );
};
