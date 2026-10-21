import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface SundaHeroProps extends BaseSectionProps {
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  handleSaveToCalendar: () => void;
}

export const HeroSection: React.FC<SundaHeroProps> = ({
  data,
  countdown,
  handleSaveToCalendar,
}) => {
  const { days, hours, minutes, seconds } = countdown;

  return (
    <section
      className="w-full px-5 py-12 flex flex-col items-center text-center bg-white relative overflow-hidden border-b border-[#ede9e1]"
      id="doaMempelai"
    >
      {/* Jasmine Garland Motif Accent */}
      <div className="w-48 h-6 text-[#c5a059] opacity-80 mb-2 reveal-scale">
        <svg className="w-full h-full fill-none stroke-current stroke-1" viewBox="0 0 200 24">
          <path d="M10,12 Q50,0 100,12 T190,12" strokeLinecap="round" />
          <circle cx="60" cy="7" fill="#C5A059" r="3" />
          <circle cx="100" cy="12" fill="#C5A059" r="4" />
          <circle cx="140" cy="7" fill="#C5A059" r="3" />
        </svg>
      </div>

      {/* Sundanese Cultural Proverb */}
      <span className="text-xl sm:text-2xl text-[#8a6822] font-serif italic mb-2 reveal delay-100">
        “Runtut Raut Sauyunan”
      </span>

      {/* Quranic / Scripture Verse */}
      <p data-anim="quote" className="text-xs sm:text-sm text-[#4e4639] max-w-sm italic leading-relaxed reveal delay-150">
        “{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}”
      </p>
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-widest mt-2 uppercase reveal delay-200">
        {data.quote_source || '(QS. Ar-Rum: 21)'}
      </span>

      <div className="w-12 h-0.5 bg-[#c5a059]/40 my-6 rounded-full" />

      {/* Countdown Card with Regal Gold Frame */}
      <div className="w-full max-w-sm rounded-3xl p-5 bg-[#fbf9f6] shadow-sm flex flex-col items-center border border-[#c5a059]/30 reveal-scale delay-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#8a6822] text-[20px]">
            hourglass_top
          </span>
          <span className="text-[11px] font-semibold text-[#5d4201] uppercase tracking-widest">
            Menghitung Hari Bahagia
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 w-full text-center">
          <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
            <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
              {days}
            </span>
            <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
              Hari
            </span>
          </div>
          <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
            <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
              {hours}
            </span>
            <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
              Jam
            </span>
          </div>
          <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
            <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
              {minutes}
            </span>
            <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
              Menit
            </span>
          </div>
          <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
            <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
              {seconds}
            </span>
            <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
              Detik
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveToCalendar}
          className="mt-5 w-full py-2.5 rounded-full bg-white hover:bg-[#f3eedf] text-[#5d4201] text-xs font-semibold flex items-center justify-center gap-2 border border-[#c5a059]/40 transition-colors cursor-pointer shadow-2xs"
        >
          <span className="material-symbols-outlined text-[18px] text-[#8a6822]">
            event
          </span>
          <span>Simpan ke Google Calendar</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
