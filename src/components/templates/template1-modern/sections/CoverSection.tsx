import React from 'react';
import type { CoverSectionProps } from '../../types';

export const CoverSection: React.FC<CoverSectionProps> = ({
  data,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  handleOpenInvitation,
  renderSwipeHint,
  isPreview,
}) => {
  const firstPerson = rawFirst || data.groom || { name: 'Mempelai Pria' };
  const secondPerson = rawSecond || data.bride || { name: 'Mempelai Wanita' };

  return (
    <section
      id="cover-overlay"
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-5 sm:p-7 overflow-hidden"
    >
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={data.cover_image || data.couple_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'}
          alt="Wedding Couple Cover"
          className="w-full h-full object-cover filter brightness-[0.78]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/85"></div>
      </div>

      {/* Header Monogram with notch-safe padding */}
      <div className="relative z-10 pt-10 sm:pt-12 flex flex-col items-center shrink-0">
        <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/80 font-light mb-1.5">
          The Wedding Celebration
        </span>
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/35 flex items-center justify-center backdrop-blur-md bg-white/10 my-1 shadow-md ring-1 ring-white/15">
          <div className="inline-flex items-center justify-center gap-1.5 leading-none select-none">
            <span className="font-editorial text-xl sm:text-2xl text-white font-normal uppercase leading-none">
              {data.groom?.name ? data.groom.name.charAt(0) : 'D'}
            </span>
            <span className="font-serif text-xs sm:text-sm text-gold-champagne/90 italic leading-none">
              &amp;
            </span>
            <span className="font-editorial text-xl sm:text-2xl text-white font-normal uppercase leading-none">
              {data.bride?.name ? data.bride.name.charAt(0) : 'S'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Typography */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
        <h2 className="font-editorial text-3xl sm:text-4xl text-white font-light tracking-wide leading-tight">
          {firstPerson.name} <br />
          <span className="font-serif italic text-2xl sm:text-3xl font-light text-gold-champagne">&amp;</span> <br />
          {secondPerson.name}
        </h2>
        <div className="mt-3 sm:mt-4 flex items-center space-x-3 text-white/90">
          <span className="h-[1px] w-6 bg-gold-champagne/70"></span>
          <p className="text-xs tracking-[0.25em] uppercase font-light text-alabaster">
            {data.wedding_date_display}
          </p>
          <span className="h-[1px] w-6 bg-gold-champagne/70"></span>
        </div>
      </div>

      {/* Guest Box & Open Button Anchored Bottom */}
      <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
        <div className="w-full backdrop-blur-md bg-white/10 border border-white/25 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg">
          <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/75 font-light mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <h3 className="font-editorial text-xl sm:text-2xl font-medium tracking-wide text-white capitalize">
            {data.guest_name || 'Tamu Undangan'}
          </h3>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1.5 inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] tracking-wider uppercase text-gold-light font-mono">
              <span className="material-symbols-outlined text-[13px]">qr_code</span>
              <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
            </div>
          )}
          <p className="text-[9px] text-white/60 tracking-wider mt-1 italic">
            *Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        {/* Sleek Pill Button */}
        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-3.5 px-6 rounded-full bg-white text-charcoal-dark font-medium text-xs tracking-[0.2em] uppercase hover:bg-gold-light active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 group cursor-pointer"
        >
          <i className="fa-regular fa-envelope-open text-gold-champagne text-sm group-hover:scale-110 transition-transform"></i>
          <span>Buka Undangan</span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'light' })}
      </div>
    </section>
  );
};
