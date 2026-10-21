import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface LuxuryHeroProps extends BaseSectionProps {
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  firstPerson?: any;
  secondPerson?: any;
}

export const HeroSection: React.FC<LuxuryHeroProps> = ({
  data,
  countdown,
}) => {
  return (
    <section
      className="w-full px-margin pt-14 pb-12 flex flex-col items-center text-center relative z-10"
      id="hero-countdown"
    >
      <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl mb-8 bg-surface-container-low border border-white/5 reveal-scale">
        <img
          alt="Couple Staircase Noir"
          className="w-full h-full object-cover filter contrast-[1.1]"
          src={
            data.gallery[3] ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDKBB8-qibEzbBkPMwrhruecaVqCTj6fThLAIftriWYQb_Jr9oOQNZsti0sdxmAw-dBIGnnZLg_B2gWx5bcAGWOHfjrEjaV8fgvKzWYXLg1qcqawihV2iNK5ocY1uqHGObqQys82uAFSlcqv-dDBDd4O20dQP0ifd3d4FGLQV8K1v7cQU-sERZWui33Jy8nJvP0gYju3iOYDx3c7xRKmm1axbS8vyXNjuGAJakCVZqShadjtVUyKC-8'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-left">
          <span className="font-label-eyebrow text-primary text-[10px] tracking-[0.25em] block mb-1">
            Union &amp; Grace
          </span>
          <p className="font-headline-sm text-on-surface text-base italic leading-snug">
            {data.events[1]?.venue_name || data.events[0]?.venue_name || 'The St. Regis Grand Ballroom'}
          </p>
        </div>
      </div>

      <blockquote className="font-headline-sm italic text-on-surface-variant text-base leading-relaxed max-w-[320px] mb-6">
        “{data.quote}”
      </blockquote>

      {/* Date Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md mb-8 border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
        <span className="font-label-md text-on-surface text-xs tracking-wider uppercase">
          {data.wedding_date_display || '24 . 10 . 2026'} • {data.events?.[0]?.venue_city || data.events?.[0]?.venue_name || 'JAKARTA'}
        </span>
      </div>

      {/* Countdown Timer 4-Grid */}
      <div className="w-full grid grid-cols-4 gap-2 max-w-[360px]" id="countdown-grid">
        <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
          <span className="font-headline-sm text-primary text-xl font-normal" id="cd-days">
            {String(countdown.days).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
            Days
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
          <span className="font-headline-sm text-primary text-xl font-normal" id="cd-hours">
            {String(countdown.hours).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
            Hours
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
          <span className="font-headline-sm text-primary text-xl font-normal" id="cd-mins">
            {String(countdown.minutes).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
            Mins
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
          <span className="font-headline-sm text-primary text-xl font-normal" id="cd-secs">
            {String(countdown.seconds).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
            Secs
          </span>
        </div>
      </div>
    </section>
  );
};
