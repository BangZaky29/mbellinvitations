import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { DresscodeColor } from '../../../../types/invitation';

const DEFAULT_MINANG_SWATCHES: DresscodeColor[] = [
  { name: 'Burgundy', hex: '#4A121A' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Ivory', hex: '#FAF6EE' },
  { name: 'Dusty Rose', hex: '#B76E79' },
  { name: 'Emerald', hex: '#1E4B38' },
];

export const DresscodeSection: React.FC<BaseSectionProps> = ({ data }) => {
  const dresscode = data.dresscode;
  if (dresscode && dresscode.enabled === false) return null;

  const colors =
    dresscode?.colors && dresscode.colors.length > 0
      ? dresscode.colors
      : DEFAULT_MINANG_SWATCHES;

  const title = dresscode?.title || 'PANDUAN BUSANA (DRESS CODE)';
  const subtitle =
    dresscode?.subtitle ||
    'Batik Songket Tradisional atau Pakaian Formal bernuansa warna kerajaan Minang berikut:';

  return (
    <div
      className="bg-[#FAF6EE] text-[#1B0609] px-5 pt-6 pb-8 relative"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
    >
      <div className="text-center max-w-[340px] mx-auto">
        <span className="font-script text-2xl text-[#7D5C1E]">Palet Busana</span>
        <h3 className="font-cinzel text-lg font-bold tracking-wider text-[#2E0A10]">
          {title}
        </h3>
        <p className="text-xs text-[#4A121A] font-sans mt-1">
          {subtitle}
        </p>

        {/* Color Swatches with Gold Borders */}
        <div className="flex items-center justify-center gap-3.5 mt-4 flex-wrap">
          {colors.map((s, idx) => (
            <div key={`${s.name}-${idx}`} className="flex flex-col items-center gap-1.5">
              <span
                className="w-8 h-8 rounded-full border-2 border-dashed border-[#D4AF37] shadow-sm transform hover:scale-110 transition-transform"
                style={{ backgroundColor: s.hex }}
                title={`${s.name} (${s.hex})`}
              />
              <span className="text-[10px] font-sans font-semibold text-[#2E0A10]">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DresscodeSection;
