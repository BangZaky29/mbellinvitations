import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  TornPaperDivider,
  BetawiBatikWatermark,
  BetawiGigiBalangDivider,
} from '../components';

interface DresscodeSectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const DresscodeSection: React.FC<DresscodeSectionProps> = ({ data }) => {
  const customDresscode = data.dresscode;

  const defaultColors = [
    { name: 'Betawi Maroon', hex: '#5E1914' },
    { name: 'Prada Emas', hex: '#FED65B' },
    { name: 'Gading Alabaster', hex: '#FCF9F3' },
    { name: 'Hijau Sirih', hex: '#387D39' },
    { name: 'Arang Hitam', hex: '#222222' },
  ];

  const colors =
    customDresscode?.colors && customDresscode.colors.length > 0
      ? customDresscode.colors
      : defaultColors;

  const title = customDresscode?.title || 'Panduan Busana Tamu';
  const subtitle =
    customDresscode?.subtitle ||
    'Tamu undangan terhormat disarankan mengenakan Batik Betawi, Kebaya Encim, atau Sadariah bernuansa royal palette:';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Torn Paper Transition (Maroon to Ivory) */}
      <TornPaperDivider direction="maroon-to-ivory" fillColor="#FCF9F3" />

      <section className="relative w-full bg-[#FCF9F3] text-[#1C1C18] px-4 pt-4 pb-8 flex flex-col items-center text-center overflow-hidden">
        {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark (Ivory Tone) */}
        <BetawiBatikWatermark color="#5E1914" opacityClass="opacity-[0.035]" />

        {/* Pernak-pernik Gigi Balang Eaves */}
        <div className="relative z-10 w-full max-w-[200px] mb-2">
          <BetawiGigiBalangDivider className="w-full my-1" color="#5E1914" />
        </div>

        <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#735c00] uppercase mb-1">
          ATTIRE GUIDE
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410403] mb-2">
          {title}
        </h2>
        <p className="font-serif text-xs text-[#554240] max-w-[320px] mb-5 leading-relaxed">
          {subtitle}
        </p>

        {/* 5 Color Swatches */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap w-full max-w-[340px]">
          {colors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 min-w-[54px]">
              <div
                className="w-10 h-10 rounded-full shadow-md flex items-center justify-center border border-black/10 transition-transform hover:scale-105"
                style={{ backgroundColor: c.hex }}
              >
                {i === 0 && (
                  <span className="material-symbols-outlined text-[15px] text-[#FED65B]">
                    check
                  </span>
                )}
              </div>
              <span className="font-sans text-[10px] text-[#554240] font-semibold break-words [overflow-wrap:anywhere] max-w-[64px] text-center">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
