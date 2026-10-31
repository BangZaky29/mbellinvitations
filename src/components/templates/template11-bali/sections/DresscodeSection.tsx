import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
} from '../components';

interface DresscodeSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
}

export const DresscodeSection: React.FC<DresscodeSectionProps> = ({
  data,
  theme,
  isSectionActive,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isDresscodeVisible = isSectionActive
    ? isSectionActive('dresscode')
    : effectiveTheme?.show_dresscode !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('dresscode'));

  if (!isDresscodeVisible) return null;

  const defaultSwatches = [
    { name: 'Bata Candi', hex: '#9E3B2B' },
    { name: 'Krem Alami', hex: '#F5EFE6' },
    { name: 'Prada Emas', hex: '#D4AF37' },
    { name: 'Zaitun Tropis', hex: '#3A422E' },
    { name: 'Arang Hitam', hex: '#261C18' },
  ];

  const swatches = data.dresscode?.colors && data.dresscode.colors.length > 0
    ? data.dresscode.colors
    : defaultSwatches;

  const subtitle =
    data.dresscode?.subtitle ||
    'Tamu terhormat dipersilakan mengenakan busana Wastra Adat Madya / Tenun Endek / Songket Bali dengan palet tropis alami:';

  return (
    <section className="relative w-full bg-[#FFF9EF] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.04]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Title & Divider */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Panduan Busana
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            Dress Code Tamu
          </h3>
          <p className="font-sans text-xs text-[#524341] max-w-[320px] mx-auto mt-2 leading-relaxed">
            {subtitle}
          </p>
          <CandiBentarDivider compact className="mt-2" />
        </div>

        {/* 5 Swatches Grid */}
        <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
          {swatches.map((swatch, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className="w-11 h-11 rounded-full shadow-md border-2 border-white/80"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="font-sans text-[10.5px] text-[#524341] font-semibold">
                {swatch.name}
              </span>
            </div>
          ))}
        </div>

        {/* Etiquette Advice Card */}
        <div className="relative w-full bg-[#F3EDE4] border border-[#D4AF37]/35 rounded-xl p-3.5 text-center shadow-xs overflow-hidden">
          <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-5 h-5" color="#D4AF37" />
          <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-5 h-5" color="#D4AF37" />
          <p className="font-sans text-xs text-[#524341] leading-relaxed">
            Mohon berkenan untuk tidak mengenakan busana serba hitam atau putih polos pada sesi ritual inti upacara.
          </p>
        </div>
      </div>
    </section>
  );
};

