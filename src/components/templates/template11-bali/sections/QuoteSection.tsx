import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
} from '../components';

interface QuoteSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  data,
  theme,
  isSectionActive,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isQuoteVisible = isSectionActive
    ? isSectionActive('quote')
    : effectiveTheme?.show_quote !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('quote'));

  if (!isQuoteVisible) return null;

  const quoteText =
    data.quote ||
    '“Grbhnami te suprajastvaya hastam mayya patya jaradastir yatha”';

  const quoteSource =
    data.quote_source ||
    'Rgveda X.85.36 — “Aku memegang tanganmu demi kebahagiaan dan keturunan yang utama, semoga engkau hidup bersamaku sebagai pasangan hingga masa tua tiba.”';

  const sanskritText =
    data.quote_arabic ||
    'ॐ गृभ्णामि ते सुप्रजास्त्वाय हस्तं मया पत्या जरदष्टिर्यथासः';

  return (
    <section className="relative w-full bg-[#FFF9EF] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.04]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        <CandiBentarDivider compact subTitle="SLOKA SUCI PAWIWAHAN" className="mb-2" />

        {/* Single Quote Card (Rule 13) */}
        <div className="relative w-full bg-[#F9F3EA] border border-[#D4AF37]/45 rounded-2xl p-5 sm:p-6 shadow-md text-center overflow-hidden">
          {/* Corner Filigrees */}
          <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

          {/* Sanskrit Holy Mantra */}
          {sanskritText && (
            <div className="mb-3">
              <span className="font-serif text-lg sm:text-xl text-[#735C00] font-semibold tracking-wider block">
                {sanskritText}
              </span>
            </div>
          )}

          {/* Main Quote / Sloka Transliteration */}
          <blockquote className="font-serif text-sm sm:text-base text-[#411710] italic leading-relaxed mb-3 font-medium">
            {quoteText}
          </blockquote>

          {/* Divider Dot Accent */}
          <div className="w-8 h-[1px] bg-[#D4AF37]/60 mx-auto mb-3" />

          {/* Quote Source & Meaning */}
          <p className="font-sans text-[11px] sm:text-xs text-[#524341] leading-relaxed break-words [overflow-wrap:anywhere]">
            {quoteSource}
          </p>
        </div>
      </div>
    </section>
  );
};

