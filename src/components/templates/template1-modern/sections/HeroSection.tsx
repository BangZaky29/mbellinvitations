import React from 'react';
import type { HeroSectionProps } from '../../types';
import { LiveStreamBanner } from '../../../common/LiveStreamBanner';

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  theme,
  isSectionActive,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  countdown,
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

  const firstPerson = rawFirst || data.groom || { name: 'Mempelai Pria' };
  const secondPerson = rawSecond || data.bride || { name: 'Mempelai Wanita' };
  const { days, hours, minutes, seconds } = countdown;

  return (
    <section id="hero" className="pt-16 pb-12 px-6 flex flex-col items-center text-center">
      <div className="inline-flex items-center space-x-2 mb-3">
        <span className="w-8 h-[1px] bg-gold-champagne"></span>
        <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold-champagne">
          The Royal Nuptials
        </span>
        <span className="w-8 h-[1px] bg-gold-champagne"></span>
      </div>

      <h1 className="font-editorial text-4xl text-charcoal-dark font-normal tracking-wide">
        {firstPerson.name} &amp; {secondPerson.name}
      </h1>
      <p className="text-xs text-charcoal-muted tracking-[0.2em] uppercase mt-1 mb-8">
        {data.wedding_date_display}
      </p>

      {/* Tall Arch-shaped Couple Frame */}
      <div className="relative w-full max-w-[280px] p-2 bg-white rounded-arch shadow-md border border-border-subtle mb-8 reveal-scale">
        <div className="w-full h-[380px] arch-frame overflow-hidden relative">
          <img
            src={data.couple_photo || data.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
            alt={`${firstPerson.name} and ${secondPerson.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
        {/* Corner Fine-line Accent */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border border-gold-champagne/40 bg-alabaster flex items-center justify-center">
          <i className="fa-solid fa-heart text-[10px] text-gold-champagne"></i>
        </div>
      </div>

      {/* Religious / Romantic Quote */}
      {isQuoteVisible && (
        <div className="max-w-[340px] px-2 mb-10 reveal delay-100 text-center">
          {data.quote_title && (
            <span className="block text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium mb-3">
              {data.quote_title}
            </span>
          )}
          {data.quote_arabic && (
            <p
              dir="rtl"
              className="font-serif text-lg sm:text-xl leading-loose text-charcoal-dark my-3 px-2 font-normal"
            >
              {data.quote_arabic}
            </p>
          )}
          <p className="font-editorial italic text-base leading-relaxed text-charcoal-dark/90">
            &ldquo;{data.quote}&rdquo;
          </p>
          {data.quote_source && (
            <span className="block text-[11px] tracking-[0.2em] text-gold-champagne uppercase font-medium mt-3">
              — {data.quote_source}
            </span>
          )}
        </div>
      )}

      {/* 4-Column Minimalist Countdown Timer */}
      <div className="w-full max-w-[350px] bg-white border border-border-subtle rounded-2xl p-5 shadow-sm reveal delay-200">
        <p className="text-[11px] tracking-[0.25em] text-charcoal-muted uppercase mb-4 font-medium">
          Menuju Hari Bahagia
        </p>
        <div className="grid grid-cols-4 divide-x divide-border-subtle">
          {/* Hari */}
          <div className="flex flex-col items-center px-1">
            <span className="font-editorial text-3xl font-semibold text-charcoal-dark tracking-tight">
              {days}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
              Hari
            </span>
          </div>
          {/* Jam */}
          <div className="flex flex-col items-center px-1">
            <span className="font-editorial text-3xl font-semibold text-charcoal-dark tracking-tight">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
              Jam
            </span>
          </div>
          {/* Menit */}
          <div className="flex flex-col items-center px-1">
            <span className="font-editorial text-3xl font-semibold text-charcoal-dark tracking-tight">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
              Menit
            </span>
          </div>
          {/* Detik */}
          <div className="flex flex-col items-center px-1">
            <span className="font-editorial text-3xl font-semibold text-gold-champagne tracking-tight">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
              Detik
            </span>
          </div>
        </div>
      </div>

      {/* Optional Livestream Banner */}
      {isLivestreamActive && Boolean(streamingUrl) && (
        <div className="mt-8 w-full flex justify-center">
          <LiveStreamBanner url={streamingUrl} variant="modern" />
        </div>
      )}
    </section>
  );
};
