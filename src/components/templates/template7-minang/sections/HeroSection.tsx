import React from 'react';
import type { BaseSectionProps } from '../../types';
import { MinangDivider } from '../components';

export interface MinangHeroProps extends BaseSectionProps {
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  handleSaveToCalendar: () => void;
}

export const HeroSection: React.FC<MinangHeroProps> = ({
  data,
  countdown,
  handleSaveToCalendar,
}) => {
  // Hitung tanggal target secara dinamis dari wedding_date_iso atau events
  const targetDate = React.useMemo(() => {
    if (data.wedding_date_iso) {
      const parsed = new Date(data.wedding_date_iso);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const events = Array.isArray(data.events) ? data.events : Object.values(data.events || {});
    const activeIdx = data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;
    const targetEvent = events[activeIdx] || events[0];
    if (targetEvent?.date) {
      const isoMatch = targetEvent.date.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
      }
      const slashMatch = targetEvent.date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (slashMatch) {
        return new Date(Number(slashMatch[3]), Number(slashMatch[2]) - 1, Number(slashMatch[1]));
      }
    }
    return new Date(2026, 9, 24);
  }, [data.wedding_date_iso, data.events, data.countdown_target]);

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  // Nama Bulan & Tahun dalam format uppercase Indonesia (contoh: "OKTOBER 2026")
  const monthYearLabel = targetDate
    .toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    .toUpperCase();

  // Hari pertama dalam bulan: 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const startDayOffset = new Date(year, month, 1).getDay();

  // Jumlah total hari dalam bulan
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <section
      className="bg-[#FAF6EE] text-[#1B0609] px-5 pt-8 pb-10 relative"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
    >
      {/* Islamic Blessing & Minang Adat Pantun */}
      <div className="text-center max-w-[340px] mx-auto mb-8">
        <p className="font-serif italic text-[#7D5C1E] text-base font-semibold mb-1">
          Bismillaahirrohmaanirrohiim
        </p>
        <p className="font-cinzel text-[10.5px] tracking-[0.2em] text-[#2E0A10] uppercase mb-3 font-bold">
          Assalamu’alaikum Warahmatullahi Wabarakatuh
        </p>

        <MinangDivider className="my-2.5" color="gold-bronze" />

        <p className="font-serif text-sm leading-relaxed text-[#2E0A10]/90 italic">
          "{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.'}"
        </p>
        <span className="block mt-1 font-sans text-[11px] font-semibold text-[#8A6822] tracking-wider">
          ({data.quote_source || 'QS. Ar-Rum: 21'})
        </span>

        {/* Minangkabau Traditional Pantun Box */}
        <div className="mt-5 p-4 rounded-xl border border-[#D4AF37]/50 bg-[#F3EAD8] text-center shadow-xs">
          <p className="font-serif text-xs text-[#2E0A10] italic leading-relaxed">
            "Anak daro kamek babaju koto gadang,<br />
            Marapulai gagah manyaru basamo sanak.<br />
            Alah tibo masonyo baralek gadang,<br />
            Mahimpun janji manjalin kasiah nan tulus elok."
          </p>
        </div>
      </div>

      {/* Save The Date Calendar Widget */}
      <div className="mt-8 pt-6 border-t border-[#D4AF37]/30">
        <div className="text-center mb-5">
          <span className="font-script text-2xl text-[#7D5C1E]">Menuju Hari Bahagia</span>
          <h3 className="font-cinzel text-lg font-bold tracking-wider text-[#2E0A10]">
            SAVE THE DATE
          </h3>
          <p className="text-xs text-[#4A121A] uppercase tracking-widest font-sans mt-0.5 font-semibold">
            {data.wedding_date_display || 'Sabtu, 24 Oktober 2026'}
          </p>
        </div>

        {/* Mini Calendar Month Grid (Dynamic) */}
        <div className="max-w-[280px] mx-auto p-4 rounded-xl border border-[#D4AF37]/40 bg-white/80 shadow-sm mb-5 text-center">
          <p className="font-cinzel text-xs font-bold tracking-widest text-[#2E0A10] mb-2.5">
            {monthYearLabel}
          </p>
          <div className="grid grid-cols-7 gap-1 text-[10px] font-sans text-center text-[#7D5C1E] font-semibold mb-1.5">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[11px] font-sans text-center text-[#2E0A10]/75">
            {/* Blank offset for days before the 1st of the month */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <span key={`blank-${i}`} className="py-1 text-transparent select-none">
                0
              </span>
            ))}
            {/* Days in Month */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = dayNum === targetDay;

              return isSelected ? (
                <span
                  key={dayNum}
                  className="py-1 font-bold text-white bg-[#D4AF37] rounded-full shadow-md flex items-center justify-center ring-2 ring-[#D4AF37]/40 scale-105"
                >
                  {dayNum}
                </span>
              ) : (
                <span key={dayNum} className="py-1">
                  {dayNum}
                </span>
              );
            })}
          </div>
        </div>

        {/* Live Countdown Cards Widget */}
        <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto text-center mb-5">
          <div className="bg-[#2E0A10] text-[#FAF6EE] p-2.5 rounded-xl border border-[#D4AF37]/50 shadow-md">
            <span className="block font-cinzel text-xl font-bold text-[#F5E296]">
              {countdown.days}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#FAF6EE]/75 font-sans">
              Hari
            </span>
          </div>
          <div className="bg-[#2E0A10] text-[#FAF6EE] p-2.5 rounded-xl border border-[#D4AF37]/50 shadow-md">
            <span className="block font-cinzel text-xl font-bold text-[#F5E296]">
              {countdown.hours}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#FAF6EE]/75 font-sans">
              Jam
            </span>
          </div>
          <div className="bg-[#2E0A10] text-[#FAF6EE] p-2.5 rounded-xl border border-[#D4AF37]/50 shadow-md">
            <span className="block font-cinzel text-xl font-bold text-[#F5E296]">
              {countdown.minutes}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#FAF6EE]/75 font-sans">
              Menit
            </span>
          </div>
          <div className="bg-[#2E0A10] text-[#FAF6EE] p-2.5 rounded-xl border border-[#D4AF37]/50 shadow-md">
            <span className="block font-cinzel text-xl font-bold text-[#F5E296]">
              {countdown.seconds}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#FAF6EE]/75 font-sans">
              Detik
            </span>
          </div>
        </div>

        {/* Add to Google Calendar Action Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleSaveToCalendar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37] bg-white text-[#2E0A10] font-sans text-xs font-semibold tracking-wider hover:bg-[#F3EAD8] transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-[#8A6822]">
              calendar_add_on
            </span>
            <span>Simpan ke Google Calendar</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
