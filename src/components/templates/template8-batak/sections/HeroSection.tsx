import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import { RumahBolonCrest, GorgaFiligree, TornPaperDivider } from '../components';
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

  const couplePhoto =
    data.couple_photo ||
    data.cover_image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSaBmrSBPc6JBKfMGqLIwMcxmJRsHH9qVZk8tBz0UbaTiqr__0cHe8qR7wa7pIidP8_8Og6HU73yBrOcZrSmoR0VOzFQbGjcAul7SLH3jLgnI3x7rrgaoHvaFdDgPWvWh-qvNSEonSJkhF0b6eLzJhN8v8BtpscySxZyQIK0FiwUhAhT03f0hmkC2Qs4L0mvbWQTNDyHGHXOByJ1ZMOP4CT3YnyDEde8G5oelkyODSd9uKn2rKVdGU';

  // Resolve active countdown target event dynamically from data.events
  const rawEvents = data.events;
  const events = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents && typeof rawEvents === 'object'
      ? Object.values(rawEvents)
      : [];

  const activeTargetIdx =
    data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;
  const targetEvent = events[activeTargetIdx] || events[0] || {};

  // Parse event date dynamically
  const parseEventDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const trimmed = String(dateStr).trim();
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    }
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (slashMatch) {
      return new Date(Number(slashMatch[3]), Number(slashMatch[2]) - 1, Number(slashMatch[1]));
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
    return null;
  };

  const targetDate =
    parseEventDate(targetEvent.date) ||
    (data.wedding_date_iso && !isNaN(new Date(data.wedding_date_iso).getTime())
      ? new Date(data.wedding_date_iso)
      : new Date(2026, 10, 14));

  const yearNum = targetDate.getFullYear();
  const monthIndex = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const monthName = monthNames[monthIndex] || 'November';

  // Offset hari pertama bulan (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
  const startDayOffset = new Date(yearNum, monthIndex, 1).getDay();

  // Total hari dalam bulan tersebut
  const totalDaysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();

  // Lokasi / Kota
  const targetLocation =
    targetEvent.venue_city ||
    (targetEvent.venue_address && targetEvent.venue_address.includes('Jakarta')
      ? 'Jakarta Pusat'
      : targetEvent.venue_name || targetEvent.location_name || 'Jakarta Pusat');

  // Judul sesi acara target countdown
  const targetSessionTitle =
    targetEvent.title ||
    targetEvent.name ||
    (activeTargetIdx === 1 ? 'Resepsi Pesta Adat' : 'Pemberkatan Nikah Kudus');

  return (
    <div className="w-full flex flex-col items-center">
      {/* ==========================================
          SUB-SECTION 1: HERO (DEEP ESPRESSO)
          ========================================== */}
      <section className="relative w-full px-4 pt-6 pb-8 flex flex-col items-center text-center bg-[#19120E] text-[#FAF6EE]">
        {/* Traditional Batak Crest & Rumah Bolon Line Art */}
        <div className="w-full flex flex-col items-center mb-2">
          <RumahBolonCrest size="md" className="mb-2" />
          <span className="font-sans text-[11px] text-[#EAC16E] tracking-[0.25em] uppercase font-semibold">
            Horas! The Wedding Celebration Of
          </span>
        </div>

        {/* Title & Names */}
        <div className="my-2 flex flex-col items-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF6EE] tracking-tight">
            {data.groom?.name || 'Johannes'}{' '}
            <span className="font-serif text-[#EAC16E] italic">&amp;</span>{' '}
            {data.bride?.name || 'Melisa'}
          </h1>
          <p className="font-sans text-xs text-[#D0C5B5] tracking-[0.18em] uppercase mt-1">
            {data.hashtag || 'Siregar Silali • Simanjuntak Sitompul'}
          </p>
        </div>

        {/* Ceremonial Batak Blessing Quote (Sinkron dengan toggle Doa & Kutipan Suci) */}
        {isQuoteVisible && (
          <div className="my-3 px-4 py-3 bg-[#312824]/70 backdrop-blur-sm rounded-xl max-w-[340px] shadow-sm border border-[#EAC16E]/20 text-center">
            {data.quote_title && (
              <span className="block font-sans text-[10px] text-[#EAC16E] tracking-[0.2em] uppercase font-bold mb-2">
                {data.quote_title}
              </span>
            )}
            {data.quote_arabic && (
              <p
                dir="rtl"
                className="font-serif text-lg sm:text-xl leading-loose text-[#FAF6EE] my-2 px-1 font-normal"
              >
                {data.quote_arabic}
              </p>
            )}
            <p className="font-serif text-sm sm:text-[15px] italic text-[#EAC16E] leading-snug">
              “{data.quote || 'Dua gabe sada, marsitangiangan di bagas holong ni Kristus'}”
            </p>
            {data.quote_source && (
              <p className="font-sans text-[11px] text-[#D1C5B3] opacity-85 mt-1.5 font-semibold">
                {data.quote_source}
              </p>
            )}
          </div>
        )}

        {/* Tall Arched Centerpiece Portrait */}
        <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-t-[160px] rounded-b-xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.7)] p-1 bg-gradient-to-b from-[#EAC16E] via-[#C8A253]/40 to-transparent my-2">
          <div className="w-full h-full rounded-t-[158px] rounded-b-lg overflow-hidden relative">
            <img
              src={couplePhoto}
              alt="Johannes & Melisa wearing Batak Ulos and Sortali"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#19120E] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-3 inset-x-0 text-center">
              <span className="inline-block px-3 py-1 bg-[#140D09]/85 backdrop-blur-md rounded-full font-sans text-[11px] text-[#EAC16E] uppercase tracking-widest border border-[#EAC16E]/30">
                {data.wedding_date_display || 'Sabtu, 14 November 2026'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wavy Torn Paper Deckle Edge: Transition to Warm Ivory */}
      <TornPaperDivider fillColor="#EDE1D0" />

      {/* ==========================================
          SUB-SECTION 2: WARM PARCHMENT IVORY SECTION
          ========================================== */}
      <section className="relative w-full bg-[#EDE1D0] text-[#362F25] px-4 py-6 flex flex-col items-center text-center">
        {/* Gorga Boras Pati Filigree */}
        <GorgaFiligree className="w-16 h-8 text-[#85291B] opacity-75 mb-3" />

        {/* Badge Acara Patokan Countdown */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85291B]/15 border border-[#85291B]/30 text-[#85291B] font-sans text-[10.5px] font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-[13px]">timer</span>
          <span>Acara Patokan: {targetSessionTitle}</span>
        </div>

        {/* Mini Monthly Calendar */}
        <div className="w-full max-w-[340px] bg-[#D0C5B5]/50 rounded-xl p-4 shadow-[0_4px_16px_rgba(36,28,24,0.08)] mb-5 border border-[#85291B]/15">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-bold tracking-wider text-[#362F25] uppercase">
              {monthName} {yearNum}
            </span>
            <span className="font-sans text-[11px] text-[#4D463A]">
              {targetLocation}
            </span>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center font-sans text-[10px] text-[#4D463A] font-semibold mb-1">
            <span>MIN</span><span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span>
          </div>

          {/* Dynamic Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs text-[#362F25]">
            {/* Blank offsets for days before the 1st of month */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <span key={`blank-${i}`} className="py-1 text-transparent select-none">
                0
              </span>
            ))}

            {/* Days in Month */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const day = i + 1;
              const isEventDay = day === targetDay;

              return (
                <span
                  key={day}
                  className={`py-1 rounded-full flex items-center justify-center font-medium ${isEventDay
                      ? 'bg-[#85291B] text-[#FFDAD4] font-bold shadow-md scale-105 ring-2 ring-[#85291B]/30'
                      : 'text-[#4D463A]/80'
                    }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>

        {/* Countdown Timer Units */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-[340px] mb-4">
          <div className="bg-[#312824] text-[#FAF6EE] rounded-xl p-2.5 flex flex-col items-center shadow-sm border border-[#EAC16E]/20">
            <span className="font-serif text-2xl font-bold text-[#EAC16E]">
              {String(countdown.days).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-wider uppercase text-[#D1C5B3]">HARI</span>
          </div>
          <div className="bg-[#312824] text-[#FAF6EE] rounded-xl p-2.5 flex flex-col items-center shadow-sm border border-[#EAC16E]/20">
            <span className="font-serif text-2xl font-bold text-[#EAC16E]">
              {String(countdown.hours).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-wider uppercase text-[#D1C5B3]">JAM</span>
          </div>
          <div className="bg-[#312824] text-[#FAF6EE] rounded-xl p-2.5 flex flex-col items-center shadow-sm border border-[#EAC16E]/20">
            <span className="font-serif text-2xl font-bold text-[#EAC16E]">
              {String(countdown.minutes).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-wider uppercase text-[#D1C5B3]">MENIT</span>
          </div>
          <div className="bg-[#312824] text-[#FAF6EE] rounded-xl p-2.5 flex flex-col items-center shadow-sm border border-[#EAC16E]/20">
            <span className="font-serif text-2xl font-bold text-[#EAC16E]">
              {String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] tracking-wider uppercase text-[#D1C5B3]">DETIK</span>
          </div>
        </div>

        {/* Google Calendar CTA Button */}
        <button
          type="button"
          onClick={handleSaveToCalendar}
          className="w-full max-w-[340px] py-3 px-4 rounded-xl bg-[#261E1A] text-[#EAC16E] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:bg-[#312824] transition-all active:scale-95 mb-4 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
          <span>Simpan ke Google Calendar</span>
        </button>
        {/* Optional Livestream Banner */}
        {isLivestreamActive && Boolean(streamingUrl) && (
          <div className="mt-8 w-full flex justify-center">
            <LiveStreamBanner url={streamingUrl} variant="batak" />
          </div>
        )}
      </section>

      {/* Wavy Torn Paper Deckle Edge: Transition back to Deep Espresso */}
      <TornPaperDivider invert fillColor="#EDE1D0" />
    </div>
  );
};
