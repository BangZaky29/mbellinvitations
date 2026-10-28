import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  KembangKelapaCrest,
  GigiBalangVerticalBorder,
  TornPaperDivider,
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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI';

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
    const idMonths: Record<string, number> = {
      januari: 0, jan: 0, februari: 1, feb: 1, maret: 2, mar: 2,
      april: 3, apr: 3, mei: 4, may: 4, juni: 5, jun: 5,
      juli: 6, jul: 6, agustus: 7, agu: 7, ags: 7, september: 8, sep: 8,
      oktober: 9, okt: 9, november: 10, nov: 10, desember: 11, des: 11,
    };
    const indoMatch = trimmed.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (indoMatch) {
      const monthKey = indoMatch[2].toLowerCase();
      if (monthKey in idMonths) {
        return new Date(
          Number(indoMatch[3]),
          idMonths[monthKey],
          Number(indoMatch[1])
        );
      }
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
    return null;
  };

  const targetDate =
    parseEventDate(targetEvent?.date) ||
    (data.wedding_date_iso &&
    !isNaN(new Date(data.wedding_date_iso).getTime())
      ? new Date(data.wedding_date_iso)
      : new Date(2026, 11, 19));

  const yearNum = targetDate.getFullYear();
  const monthIndex = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const monthName = monthNames[monthIndex] || 'Desember';

  // Offset hari pertama bulan (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
  const startDayOffset = new Date(yearNum, monthIndex, 1).getDay();
  // Total hari dalam bulan tersebut
  const totalDaysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();

  const emptyDays = Array.from({ length: startDayOffset }, (_, i) => i);
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const groomName = data.groom?.name || 'Rizky';
  const brideName = data.bride?.name || 'Fatimah';
  const weddingDateStr =
    data.wedding_date_display || 'Sabtu, 19 Desember 2026';

  return (
    <div className="w-full flex flex-col items-center">
      {/* ========================================================
          SUB-SECTION 1: HERO & CREST (Deep Betawi Maroon)
          ======================================================== */}
      <section className="relative w-full bg-[#410403] text-[#FAF6EE] px-4 pt-8 pb-10 flex flex-col items-center text-center overflow-hidden">
        {/* Left & Right Sawtooth Borders (Gigi Balang Hairline Motifs) */}
        <GigiBalangVerticalBorder />

        {/* Ornamental Kembang Kelapa & Gigi Balang Crest */}
        <div className="flex flex-col items-center gap-1 mb-4 z-10">
          <KembangKelapaCrest className="w-16 h-12 text-[#FED65B]" />
          <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[#FFE088] uppercase">
            ASSALAMUALAIKUM — HAJATAN BESAR PERNIKAHAN
          </span>
        </div>

        {/* Grand Typography Stack */}
        <div className="flex flex-col items-center mb-4 z-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FCF9F3] tracking-tight leading-none mb-1 font-bold">
            {groomName.toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 w-full max-w-[260px] justify-center my-1">
            <div className="h-[1px] flex-1 bg-[#FFE088]/40" />
            <span className="font-serif text-xl sm:text-2xl text-[#FED65B] italic">
              &amp;
            </span>
            <div className="h-[1px] flex-1 bg-[#FFE088]/40" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FCF9F3] tracking-tight leading-none font-bold">
            {brideName.toUpperCase()}
          </h1>
        </div>

        {/* Ambient Audio Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[#FED65B] shadow-md mb-6 z-10 border border-[#FED65B]/20">
          <span className="material-symbols-outlined text-[16px] animate-pulse">
            music_note
          </span>
          <span className="font-sans text-[11px] tracking-wider uppercase font-semibold">
            Gambang Kromong • Lagu Sirih Kuning
          </span>
        </div>

        {/* Arch-framed Centerpiece Photo */}
        <div className="relative w-full max-w-[310px] aspect-[4/5] rounded-t-full p-2 bg-gradient-to-b from-[#FED65B]/70 via-[#FED65B]/20 to-transparent shadow-2xl flex flex-col items-center justify-end z-10">
          <div className="w-full h-full rounded-t-full overflow-hidden relative bg-[#410403]">
            <img
              alt={`${groomName} dan ${brideName} dalam Busana Adat Kerajaan Betawi`}
              className="w-full h-full object-cover"
              src={couplePhoto}
            />
            {/* Jasmine Garland Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#410403] via-transparent to-black/10" />
          </div>
          {/* Date Badge floating on base of photo */}
          <div className="absolute -bottom-4 bg-[#FCF9F3] text-[#410403] px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 z-20 border border-[#FED65B]/40">
            <span className="material-symbols-outlined text-[16px] text-[#5E1914]">
              calendar_today
            </span>
            <span className="font-sans text-[11px] tracking-widest uppercase font-bold text-[#410403]">
              {weddingDateStr}
            </span>
          </div>
        </div>
      </section>

      {/* Torn Paper Transition (Maroon to Ivory) */}
      <TornPaperDivider direction="maroon-to-ivory" fillColor="#FCF9F3" />

      {/* ========================================================
          SUB-SECTION 2: SAVE THE DATE, COUNTDOWN & CALENDAR (Ivory)
          ======================================================== */}
      <section className="relative w-full bg-[#FCF9F3] text-[#1C1C18] px-4 pt-6 pb-8 flex flex-col items-center text-center">
        {/* Calendar & Countdown Card */}
        <div className="w-full max-w-[360px] bg-white p-5 rounded-2xl shadow-sm border border-[#E5E2DC] flex flex-col items-center">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#735c00] uppercase mb-1">
            SAVE THE DATE
          </span>
          <h3 className="font-serif text-2xl text-[#410403] font-bold mb-4">
            {monthName} {yearNum}
          </h3>

          {/* Calendar Month Grid */}
          <div className="w-full max-w-[320px] mb-5">
            <div className="grid grid-cols-7 text-center font-sans text-[11px] text-[#88726F] mb-2 font-bold">
              <span>MIN</span>
              <span>SEN</span>
              <span>SEL</span>
              <span>RAB</span>
              <span>KAM</span>
              <span>JUM</span>
              <span>SAB</span>
            </div>
            <div className="grid grid-cols-7 gap-y-1.5 text-center font-serif text-[13px] text-[#1C1C18] items-center">
              {emptyDays.map((i) => (
                <span key={`empty-${i}`} className="text-[#DCDAD4] select-none">
                  •
                </span>
              ))}
              {monthDays.map((d) => {
                const isTarget = d === targetDay;
                if (isTarget) {
                  return (
                    <div
                      key={`day-${d}`}
                      className="flex items-center justify-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#5E1914] text-[#FED65B] flex flex-col items-center justify-center font-bold shadow-md ring-2 ring-[#FED65B]">
                        <span className="leading-none text-[12px]">{d}</span>
                        <span className="material-symbols-outlined text-[9px] leading-none">
                          spa
                        </span>
                      </div>
                    </div>
                  );
                }
                return (
                  <span
                    key={`day-${d}`}
                    className="py-1 text-[#1C1C18] hover:text-[#5E1914] transition-colors"
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 4-Tile Live Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-[320px] mb-4">
            <div className="bg-[#F0EEE8] flex flex-col items-center py-2.5 rounded-xl shadow-xs border border-[#E5E2DC]/60">
              <span className="font-serif text-xl sm:text-2xl text-[#410403] font-bold">
                {countdown.days}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#554240] font-semibold">
                Hari
              </span>
            </div>
            <div className="bg-[#F0EEE8] flex flex-col items-center py-2.5 rounded-xl shadow-xs border border-[#E5E2DC]/60">
              <span className="font-serif text-xl sm:text-2xl text-[#410403] font-bold">
                {countdown.hours}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#554240] font-semibold">
                Jam
              </span>
            </div>
            <div className="bg-[#F0EEE8] flex flex-col items-center py-2.5 rounded-xl shadow-xs border border-[#E5E2DC]/60">
              <span className="font-serif text-xl sm:text-2xl text-[#410403] font-bold">
                {countdown.minutes}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#554240] font-semibold">
                Menit
              </span>
            </div>
            <div className="bg-[#F0EEE8] flex flex-col items-center py-2.5 rounded-xl shadow-xs border border-[#E5E2DC]/60">
              <span className="font-serif text-xl sm:text-2xl text-[#410403] font-bold">
                {countdown.seconds}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#554240] font-semibold">
                Detik
              </span>
            </div>
          </div>

          {/* Google Calendar CTA Button */}
          <button
            type="button"
            onClick={handleSaveToCalendar}
            className="w-full max-w-[300px] h-12 rounded-full bg-[#5E1914] text-[#FAF6EE] font-sans text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#410403] active:scale-95 transition-all cursor-pointer border border-[#FED65B]/30"
          >
            <span className="material-symbols-outlined text-[18px] text-[#FED65B]">
              event
            </span>
            <span>SIMPAN KE GOOGLE CALENDAR</span>
          </button>

          {/* Universal LiveStreamBanner Component */}
          {isLivestreamActive && Boolean(streamingUrl) && (
            <div className="mt-4 w-full flex justify-center">
              <LiveStreamBanner url={streamingUrl} variant="betawi" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
