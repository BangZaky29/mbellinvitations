import React from 'react';
import type { HeroSectionProps } from '../../types';

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  countdown,
}) => {
  const firstPerson = rawFirst || data.groom || { name: 'Mempelai Pria' };
  const secondPerson = rawSecond || data.bride || { name: 'Mempelai Wanita' };
  const { days, hours, minutes, seconds } = countdown;

  return (
    <section id="hero-section" className="flex flex-col items-center pt-space-xl pb-space-lg text-center">
      {/* Wedding Date Badge */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#855233] text-white font-label-md text-xs uppercase tracking-wider mb-space-md shadow-sm">
        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
        <span>{data.wedding_date_display || (data.wedding_date_iso ? new Date(data.wedding_date_iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sabtu, 24 Oktober 2026')}</span>
      </div>

      {/* Arch Framed Couple Photo */}
      <div className="relative w-full max-w-xs h-96 rounded-t-full rounded-b-2xl overflow-hidden shadow-xl mb-space-md bg-[#eae8e4] border-4 border-white reveal-scale">
        <img
          src={data.couple_photo || data.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
          alt={`${firstPerson.name} & ${secondPerson.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C4034]/70 via-transparent to-transparent flex items-end justify-center p-space-md">
          <span className="font-serif text-lg text-white italic drop-shadow-sm">
            {data.hashtag || '#RusticWeddingForever'}
          </span>
        </div>
      </div>

      {/* Romantic Quote Card */}
      <div className="bg-white/95 border border-[#2C4034]/15 rounded-2xl p-5 shadow-sm max-w-sm mb-space-lg reveal delay-100">
        <p className="font-serif text-base sm:text-lg text-[#1B2A20] italic font-normal mb-2 leading-relaxed">
          &ldquo;{data.quote}&rdquo;
        </p>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#855233]">
          — {data.quote_source}
        </span>
      </div>

      {/* Countdown Timer 4 Cards */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-2.5 mb-space-lg px-2 reveal delay-200" id="countdownGrid">
        <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
            {days}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
            Hari
          </span>
        </div>
        <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
            {String(hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
            Jam
          </span>
        </div>
        <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
            {String(minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
            Menit
          </span>
        </div>
        <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
            {String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
            Detik
          </span>
        </div>
      </div>

      {/* Livestream or Calendar Action */}
      {data.livestream_url ? (
        <a
          href={data.livestream_url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-6 rounded-full bg-[#8C4E2D] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-[#733D1F] transition-all active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">videocam</span>
          <span>Saksikan Live Streaming</span>
        </a>
      ) : (
        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-6 rounded-full bg-[#EFE8DE] text-[#2C4034] hover:bg-[#2C4034] hover:text-white border border-[#2C4034]/15 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px] text-[#8C4E2D]">
            event_available
          </span>
          <span>Simpan ke Google Calendar</span>
        </a>
      )}
    </section>
  );
};
