import React from 'react';
import type { InvitationData, DresscodeColor } from '../../../../types/invitation';

interface DresscodeSectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

const DEFAULT_BATAK_SWATCHES: DresscodeColor[] = [
  { name: 'Terracotta', hex: '#9E3B2B' },
  { name: 'Ebony Wood', hex: '#241C18' },
  { name: 'Sortali Gold', hex: '#C8A253' },
  { name: 'Warm Ivory', hex: '#F4EFE6' },
  { name: 'Ulos Maroon', hex: '#661D24' },
  { name: 'Forest Sage', hex: '#5B6349' },
];

export const DresscodeSection: React.FC<DresscodeSectionProps> = ({ data }) => {
  const dresscode = data.dresscode;
  if (dresscode && dresscode.enabled === false) return null;

  const colors =
    dresscode?.colors && dresscode.colors.length > 0
      ? dresscode.colors
      : DEFAULT_BATAK_SWATCHES;

  const title = dresscode?.title || 'Panduan Busana (Dress Code)';
  const subtitle =
    dresscode?.subtitle ||
    'Tamu undangan dipersilakan mengenakan busana Formal Nusantara / Batik Tulis / Tenun Songket / Kebaya bernuansa warna berikut:';

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#221A16] text-[#FAF6EE]">
      {/* Divider */}
      <div className="w-full flex items-center justify-center gap-2 mb-2 text-[#EAC16E]">
        <span className="h-px w-10 bg-[#EAC16E]/40" />
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
          Etiket Tamu
        </span>
        <span className="h-px w-10 bg-[#EAC16E]/40" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide text-center mb-2">
        {title}
      </h2>

      <p className="font-sans text-xs text-[#D1C5B3] text-center max-w-[320px] mb-6 leading-relaxed">
        {subtitle}
      </p>

      {/* Circular Fabric Color Swatches in Grid */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-5 w-full max-w-[340px]">
        {colors.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full p-1 bg-[#261E1A] shadow-inner flex items-center justify-center border border-[#EAC16E]/20">
              <div
                className="w-full h-full rounded-full shadow-sm"
                style={{ backgroundColor: item.hex }}
              />
            </div>
            <span className="font-sans text-[11px] text-[#FAF6EE] mt-1.5 font-semibold text-center truncate max-w-[90px]">
              {item.name}
            </span>
            <span className="font-mono text-[9px] text-[#D1C5B3]/70">{item.hex}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
