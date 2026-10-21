import React from 'react';
import type { HeroSectionProps } from '../../types';

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
  countdown,
}) => {
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
      <div className="w-full bg-[#1C1612]/90 border border-[#F3D068]/30 rounded-2xl p-5 mb-8 shadow-xl text-center reveal delay-100">
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
      </div>

      {/* Optional Livestream Banner */}
      {data.livestream_url && (
        <div className="mt-6 w-full p-4 rounded-2xl bg-[#1C1612] border border-[#F3D068]/30 flex items-center justify-between text-left shadow-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#F3D068] text-2xl animate-pulse">
              videocam
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                Siaran Langsung
              </p>
              <h4 className="font-serif text-sm font-bold text-[#FAF6F0]">
                Pawiwahan Live Streaming
              </h4>
            </div>
          </div>
          <a
            href={data.livestream_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-[#14100D] text-xs font-bold shadow-md hover:brightness-105 active:scale-95"
          >
            Mirsani
          </a>
        </div>
      )}
    </section>
  );
};
