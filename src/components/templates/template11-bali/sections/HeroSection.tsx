import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
} from '../components';
import { LiveStreamBanner } from '../../../common/LiveStreamBanner';

interface HeroSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isPreview?: boolean;
  isSectionActive?: (section: string) => boolean;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
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

  const streamingUrl = data.streaming_url || data.livestream_url;
  const isLivestreamActive = isSectionActive
    ? isSectionActive('livestream')
    : effectiveTheme?.show_livestream !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('livestream') ||
      effectiveTheme.active_sections.includes('live_stream'));

  const couplePhoto =
    data.couple_photo ||
    data.cover_image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R';

  // Dynamic Event Resolution for Calendar & Countdown
  const rawEvents = data.events;
  const events = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents && typeof rawEvents === 'object'
      ? Object.values(rawEvents)
      : [];

  const activeTargetIdx =
    data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;
  const targetEvent: any = events[activeTargetIdx] || events[0] || {};

  // Parse event date dynamically
  const parseEventDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const trimmed = String(dateStr).trim();
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(
        Number(isoMatch[1]),
        Number(isoMatch[2]) - 1,
        Number(isoMatch[3])
      );
    }
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (slashMatch) {
      return new Date(
        Number(slashMatch[3]),
        Number(slashMatch[2]) - 1,
        Number(slashMatch[1])
      );
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const parsedDate =
    parseEventDate(targetEvent.date) ||
    parseEventDate(data.wedding_date_iso) ||
    new Date(2026, 10, 28);

  const eventYear = parsedDate.getFullYear();
  const eventMonth = parsedDate.getMonth();
  const eventDay = parsedDate.getDate();

  // Calendar Math (Rule 7)
  const firstDayOfWeek = new Date(eventYear, eventMonth, 1).getDay();
  const totalDaysInMonth = new Date(eventYear, eventMonth + 1, 0).getDate();
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const calendarMonthLabel = `${monthNames[eventMonth]} ${eventYear}`;

  const firstPersonName = data.is_bride_first ? data.bride.name : data.groom.name;
  const secondPersonName = data.is_bride_first ? data.groom.name : data.bride.name;

  return (
    <section className="relative w-full bg-[#FFF9EF] text-[#1D1B16] px-4 pt-6 pb-12 flex flex-col items-center text-center overflow-hidden">
      {/* Background Ambience & Patra Sari Watermark */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9EF] via-[#F9F3EA] to-[#F3EDE4] pointer-events-none z-0" />
      <BaliPatraWatermark opacityClass="opacity-[0.045]" />

      {/* Traditional Balinese Ceremonial Crest */}
      <div className="relative z-10 flex flex-col items-center mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-[1px] bg-[#735C00]/40"></span>
          <span className="material-symbols-outlined text-[#735C00] text-base">spa</span>
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.25em] font-semibold">
            Pawiwahan Ageng
          </span>
          <span className="material-symbols-outlined text-[#735C00] text-base">spa</span>
          <span className="w-8 h-[1px] bg-[#735C00]/40"></span>
        </div>

        {/* Candi Bentar / Temple Crest Icon */}
        <div className="w-16 h-16 rounded-full bg-[#F3EDE4] border border-[#D4AF37]/40 flex items-center justify-center shadow-md mb-3 relative">
          <span className="material-symbols-outlined text-[#735C00] text-[32px]">temple_hindu</span>
          <span className="absolute -bottom-1 -right-1 material-symbols-outlined text-[#411710] text-sm">flare</span>
        </div>

        <p className="font-sans text-[10px] sm:text-[11px] text-[#735C00] uppercase tracking-[0.22em] font-medium mb-1">
          Om Swastyastu — The Pawiwahan of
        </p>

        <h2 className="font-serif text-3xl sm:text-4xl text-[#411710] tracking-tight font-bold mb-2">
          {firstPersonName} <br />
          <span className="font-serif text-[#D4AF37] font-medium italic text-2xl sm:text-3xl">&amp;</span>{' '}
          {secondPersonName}
        </h2>

        <CandiBentarDivider compact className="my-1" />
      </div>

      {/* Centerpiece Arch Portrait with Balinese Prada Border */}
      <div className="relative z-10 w-full max-w-[340px] aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden p-1.5 bg-gradient-to-b from-[#D4AF37] via-[#FED65B]/60 to-[#411710]/40 shadow-2xl mb-5">
        <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#F3EDE4] relative">
          <img
            src={couplePhoto}
            alt="Sang Mempelai Pawiwahan"
            className="w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#411710]/75 via-transparent to-transparent flex items-end justify-center p-4">
            <div className="bg-[#FFF9EF]/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#D4AF37]/50 shadow-md">
              <span className="material-symbols-outlined text-[#735C00] text-sm">schedule</span>
              <span className="font-sans text-[10px] text-[#411710] uppercase font-bold tracking-widest">
                {targetEvent.date || data.wedding_date_display || 'Sabtu, 28 November 2026'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Audio Pill Indicator */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EDE4] border border-[#D4AF37]/30 shadow-sm mb-8">
        <span className="material-symbols-outlined text-[#735C00] text-sm animate-pulse">graphic_eq</span>
        <span className="font-sans text-[10.5px] text-[#1D1B16] font-semibold tracking-wide">
          {effectiveTheme?.music_title || 'Gamelan Semar Pegulingan • Laras Pelog'}
        </span>
      </div>

      {/* CALENDAR & LIVE COUNTDOWN WIDGET CARD */}
      <div className="relative z-10 w-full max-w-[360px] bg-[#FFF9EF]/95 border border-[#D4AF37]/40 rounded-2xl p-5 shadow-lg flex flex-col items-center text-center overflow-hidden">
        {/* Corner Ornaments */}
        <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
        <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
        <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
        <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

        <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-widest font-bold">
          Waktu Asri • Sasih Kalima
        </span>
        <h4 className="font-serif text-xl font-bold text-[#411710] mt-0.5 mb-3">
          {calendarMonthLabel}
        </h4>

        {/* Minimalist Calendar Grid */}
        <div className="w-full grid grid-cols-7 gap-1 text-center font-sans text-[11px] mb-5 pb-4 border-b border-[#D7C2BE]/40">
          <span className="text-[#857370] font-bold py-1">MIN</span>
          <span className="text-[#857370] font-bold py-1">SEN</span>
          <span className="text-[#857370] font-bold py-1">SEL</span>
          <span className="text-[#857370] font-bold py-1">RAB</span>
          <span className="text-[#857370] font-bold py-1">KAM</span>
          <span className="text-[#857370] font-bold py-1">JUM</span>
          <span className="text-[#857370] font-bold py-1">SAB</span>

          {/* Empty offset days */}
          {emptyDays.map((i) => (
            <span key={`emp-${i}`} className="py-1 opacity-20">
              -
            </span>
          ))}

          {/* Real month days */}
          {monthDays.map((dayNum) => {
            const isTargetDay = dayNum === eventDay;
            return (
              <div
                key={`day-${dayNum}`}
                className="py-0.5 flex items-center justify-center"
              >
                {isTargetDay ? (
                  <span className="w-7 h-7 rounded-full bg-[#735C00] text-[#FFF9EF] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {dayNum}
                  </span>
                ) : (
                  <span className="text-[#524341] py-1">{dayNum}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 4-Tile Countdown */}
        <div className="grid grid-cols-4 gap-2 w-full mb-4">
          <div className="bg-[#F3EDE4] border border-[#D4AF37]/20 rounded-xl p-2.5 flex flex-col items-center shadow-xs">
            <span className="font-serif text-2xl text-[#411710] leading-none font-bold">
              {countdown.days}
            </span>
            <span className="font-sans text-[9px] text-[#524341] uppercase tracking-wider mt-1 font-semibold">
              Hari
            </span>
          </div>
          <div className="bg-[#F3EDE4] border border-[#D4AF37]/20 rounded-xl p-2.5 flex flex-col items-center shadow-xs">
            <span className="font-serif text-2xl text-[#411710] leading-none font-bold">
              {String(countdown.hours).padStart(2, '0')}
            </span>
            <span className="font-sans text-[9px] text-[#524341] uppercase tracking-wider mt-1 font-semibold">
              Jam
            </span>
          </div>
          <div className="bg-[#F3EDE4] border border-[#D4AF37]/20 rounded-xl p-2.5 flex flex-col items-center shadow-xs">
            <span className="font-serif text-2xl text-[#411710] leading-none font-bold">
              {String(countdown.minutes).padStart(2, '0')}
            </span>
            <span className="font-sans text-[9px] text-[#524341] uppercase tracking-wider mt-1 font-semibold">
              Menit
            </span>
          </div>
          <div className="bg-[#F3EDE4] border border-[#D4AF37]/20 rounded-xl p-2.5 flex flex-col items-center shadow-xs">
            <span className="font-serif text-2xl text-[#411710] leading-none font-bold">
              {String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="font-sans text-[9px] text-[#524341] uppercase tracking-wider mt-1 font-semibold">
              Detik
            </span>
          </div>
        </div>

        {/* Save to Calendar Button */}
        <button
          type="button"
          onClick={handleSaveToCalendar}
          className="w-full py-2.5 px-4 rounded-xl bg-[#735C00] hover:bg-[#574500] text-[#FFF9EF] font-sans text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">event_available</span>
          <span>Simpan ke Google Calendar</span>
        </button>
      </div>

      {/* Universal LiveStream Banner Integration (Rule 12) */}
      {isLivestreamActive && Boolean(streamingUrl) && (
        <div className="mt-6 w-full flex justify-center relative z-10">
          <LiveStreamBanner url={streamingUrl} variant="bali" />
        </div>
      )}
    </section>
  );
};

