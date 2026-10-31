import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  BugisTimpaLajaDivider,
  BugisTenunWatermark,
  BugisCornerOrnament,
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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0';

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
      : new Date(2026, 11, 12));

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

  // Rule 7: Presisi Kalender Dinamis
  const firstDayOfMonth = new Date(yearNum, monthIndex, 1).getDay(); // 0 = Minggu
  const totalDaysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const groomName = data.groom?.name || 'Andi Fauzan';
  const brideName = data.bride?.name || 'Andi Tenri';

  return (
    <div className="w-full flex flex-col items-center">
      {/* ============================================================== */}
      {/* 1. HERO SAKRALITAS EMERALD (ROYAL BUGIS SOVEREIGNTY)           */}
      {/* ============================================================== */}
      <section className="relative w-full flex flex-col items-center px-4 pt-8 pb-8 bg-[#00170E] text-center overflow-hidden">
        {/* Pernak-pernik Watermark Tenun Sa'be */}
        <BugisTenunWatermark opacityClass="opacity-[0.05]" />

        {/* Timpa Laja Crest & Subtitle */}
        <div className="relative z-10 flex flex-col items-center mb-5">
          <BugisTimpaLajaDivider
            className="mb-1"
            subTitle="THE ROYAL BUGIS-MAKASSAR MATRIMONY"
          />
          <p className="font-sans text-[11px] text-[#D7C594] tracking-[0.2em] uppercase mt-0.5">
            Keluarga Besar Daeng &amp; Karaeng
          </p>
        </div>

        {/* Centerpiece Portrait Arch */}
        <div className="relative z-10 w-full max-w-[300px] aspect-[3/4.2] rounded-t-[140px] rounded-b-xl p-1 bg-gradient-to-b from-[#F2CA50] via-[#D4AF37]/40 to-transparent shadow-[0_16px_36px_-6px_rgba(0,18,10,0.95)] mb-6">
          <div className="w-full h-full rounded-t-[136px] rounded-b-lg overflow-hidden relative bg-[#052519]">
            <img
              alt={`${groomName} & ${brideName} in Royal Bugis Attire`}
              className="w-full h-full object-cover object-top"
              src={couplePhoto}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00120A]/85 via-transparent to-transparent" />
            <div className="absolute bottom-3 inset-x-3 py-2 px-3 bg-[#00120A]/85 backdrop-blur-md rounded-lg flex items-center justify-between border border-[#F2CA50]/20">
              <span className="font-sans text-[10px] text-[#F2CA50] tracking-widest uppercase font-semibold">
                Mappacci &amp; Tudang Bottung
              </span>
              <span className="material-symbols-outlined text-[#F2CA50] text-[18px]">
                verified
              </span>
            </div>
          </div>
          {/* Decorative Corner Ornaments */}
          <BugisCornerOrnament position="top-left" className="absolute -top-1.5 -left-1.5 w-6 h-6 text-[#F2CA50]/70" />
          <BugisCornerOrnament position="top-right" className="absolute -top-1.5 -right-1.5 w-6 h-6 text-[#F2CA50]/70" />
        </div>

        {/* Couple Monogram Stack */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="font-serif text-3xl sm:text-4xl text-[#F2CA50] tracking-tight leading-tight font-bold">
            {groomName}
          </span>
          <div className="flex items-center gap-3 my-1">
            <div className="w-10 h-[1px] bg-[#F2CA50]/40" />
            <span className="font-serif text-xl sm:text-2xl text-[#C8EAD8] italic font-normal">
              &amp;
            </span>
            <div className="w-10 h-[1px] bg-[#F2CA50]/40" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl text-[#F2CA50] tracking-tight leading-tight font-bold mb-3">
            {brideName}
          </span>
        </div>

        {/* Sacred Date & Venue Pill */}
        <div className="relative z-10 mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#052519] border border-[#F2CA50]/30 shadow-md">
          <span className="material-symbols-outlined text-[#F2CA50] text-[16px]">
            calendar_today
          </span>
          <span className="font-sans text-[11px] font-semibold text-[#F2CA50] tracking-wider uppercase">
            {data.wedding_date_display || `${targetDay} ${monthName} ${yearNum}`}
          </span>
        </div>
        <span className="relative z-10 font-sans text-xs text-[#D7C594] mt-2">
          {targetEvent?.venue_name || 'The Phinisi Ballroom'} • {targetEvent?.venue_city || 'Makassar, Sulawesi Selatan'}
        </span>
      </section>

      {/* ============================================================== */}
      {/* 2. SECTION: MINI CALENDAR & REALTIME COUNTDOWN                  */}
      {/* ============================================================== */}
      <section className="relative w-full bg-[#00170E] text-[#C8EAD8] px-4 pt-2 pb-8 flex flex-col items-center overflow-hidden">
        {/* Pernak-pernik Motif Tenun Sa'be */}
        <BugisTenunWatermark opacityClass="opacity-[0.06]" />
        {/* Card Kalender & Save The Date */}
        <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-md text-center relative overflow-hidden border border-[#CBB57B]/30">
          <BugisCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#9B7B1E]/40" />
          <BugisCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#9B7B1E]/40" />

          <span className="font-sans text-[10px] text-[#9B7B1E] tracking-[0.25em] uppercase font-bold block mb-1">
            Save The Sacred Date
          </span>
          <h4 className="font-serif text-xl sm:text-2xl text-[#0A261B] font-bold mb-3">
            {monthName} {yearNum}
          </h4>

          {/* Grid Hari Kalender */}
          <div className="grid grid-cols-7 gap-1 text-center font-sans text-[10px] text-[#5C7267] mb-2 font-bold uppercase">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#1B3A2C]">
            {emptyDays.map((_, i) => (
              <span key={`empty-${i}`} className="py-1 text-transparent">
                •
              </span>
            ))}
            {monthDays.map((d) => {
              const isMatch = d === targetDay;
              return (
                <div
                  key={`day-${d}`}
                  className="relative py-1 flex items-center justify-center"
                >
                  {isMatch ? (
                    <div className="w-7 h-7 bg-[#0F2E22] rounded-full flex items-center justify-center shadow-md ring-2 ring-[#D4AF37]/60">
                      <span className="text-[#F2CA50] text-xs font-bold">{d}</span>
                    </div>
                  ) : (
                    <span className="py-0.5 text-[#2A5944]">{d}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Real-time 4-Tile Countdown */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            <div className="p-2.5 rounded-xl bg-[#0F2E22] text-[#F2CA50] shadow-sm">
              <span className="font-serif text-xl sm:text-2xl block font-bold leading-tight">
                {countdown.days}
              </span>
              <span className="font-sans text-[9px] uppercase text-[#C8EAD8] tracking-widest font-semibold">
                Hari
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0F2E22] text-[#F2CA50] shadow-sm">
              <span className="font-serif text-xl sm:text-2xl block font-bold leading-tight">
                {countdown.hours}
              </span>
              <span className="font-sans text-[9px] uppercase text-[#C8EAD8] tracking-widest font-semibold">
                Jam
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0F2E22] text-[#F2CA50] shadow-sm">
              <span className="font-serif text-xl sm:text-2xl block font-bold leading-tight">
                {countdown.minutes}
              </span>
              <span className="font-sans text-[9px] uppercase text-[#C8EAD8] tracking-widest font-semibold">
                Menit
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0F2E22] text-[#F2CA50] shadow-sm">
              <span className="font-serif text-xl sm:text-2xl block font-bold leading-tight">
                {countdown.seconds}
              </span>
              <span className="font-sans text-[9px] uppercase text-[#C8EAD8] tracking-widest font-semibold">
                Detik
              </span>
            </div>
          </div>

          {/* Universal Google Calendar CTA Button */}
          <button
            type="button"
            onClick={handleSaveToCalendar}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-[#D4AF37] text-[#00170E] font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:bg-[#F2CA50] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              event_available
            </span>
            <span>Simpan ke Google Calendar</span>
          </button>
        </div>

        {/* Rule 12: LiveStreamBanner di bawah countdown & calendar */}
        {isLivestreamActive && Boolean(streamingUrl) && (
          <div className="mt-5 w-full max-w-sm flex justify-center">
            <LiveStreamBanner url={streamingUrl} variant="bugis" />
          </div>
        )}
      </section>
    </div>
  );
};

