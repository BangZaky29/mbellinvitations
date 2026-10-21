import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface LuxuryCoverProps extends BaseSectionProps {
  monogram: string;
  handleOpenInvitation: () => void;
  renderSwipeHint: (extraProps?: any) => React.ReactNode;
  firstPerson?: any;
  secondPerson?: any;
}

export const CoverSection: React.FC<LuxuryCoverProps> = ({
  data,
  monogram,
  handleOpenInvitation,
  renderSwipeHint,
  isPreview,
}) => {
  return (
    <section
      id="cover-gate"
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-5 sm:p-7 overflow-hidden bg-surface"
    >
      <div className="absolute inset-0 z-0">
        <img
          alt="Cover Wedding Portrait"
          className="w-full h-full object-cover object-top filter brightness-[0.72] contrast-[1.08]"
          src={
            data.cover_image ||
            data.couple_photo ||
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-surface/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-surface/40 to-surface"></div>
      </div>

      {/* Top Notch-Safe Header */}
      <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-high/60 backdrop-blur-xl flex items-center justify-center mb-2 shadow-2xl shadow-surface-container-lowest border border-white/10">
          <span className="font-headline-sm text-primary tracking-widest text-base sm:text-lg font-light">
            {monogram}
          </span>
        </div>
        <p className="font-label-eyebrow text-secondary uppercase tracking-[0.3em] text-[10px]">
          The Wedding Of
        </p>
      </div>

      {/* Middle Tier: Couple Typography */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
        <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl text-on-surface tracking-wider font-normal mb-1">
          {data.groom.name.toUpperCase()} &amp; {data.bride.name.toUpperCase()}
        </h1>
        <p className="font-label-md text-primary font-normal tracking-[0.2em] uppercase text-xs sm:text-sm">
          {data.wedding_date_display}
        </p>
      </div>

      {/* Bottom Tier: Translucent Guest Pass Card & CTA Button Anchored Bottom */}
      <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
        <div className="w-full bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 text-center shadow-2xl shadow-surface-container-lowest/80 border border-white/10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary mb-1.5">
            <span className="material-symbols-outlined text-xs">diamond</span>
            <span className="font-label-eyebrow text-[9px] uppercase tracking-widest font-semibold">
              Special Guest
            </span>
          </div>
          <p className="font-label-sm text-secondary uppercase tracking-widest text-[9px] sm:text-[10px] mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <h2 className="font-headline-sm text-on-surface text-base sm:text-lg font-medium line-clamp-1">
            {data.guest_name || 'Tamu Undangan'}
          </h2>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono">
              <span className="material-symbols-outlined text-[13px]">qr_code</span>
              <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
            </div>
          )}
          <p className="font-body-sm text-on-surface-variant max-w-[280px] mx-auto text-[10px] sm:text-[11px] leading-relaxed mt-1 italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        {/* Glowing Shimmer Pill Button */}
        <button
          onClick={handleOpenInvitation}
          className="group relative inline-flex items-center justify-center gap-2.5 w-full h-12 rounded-full bg-primary text-on-primary font-label-md text-xs sm:text-sm uppercase tracking-[0.18em] shadow-[0_0_30px_rgba(226,199,146,0.35)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">mail</span>
          <span>Buka Undangan</span>
          <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
            arrow_downward
          </span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'gold' })}
      </div>
    </section>
  );
};
