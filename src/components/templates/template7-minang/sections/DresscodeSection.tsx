import React from 'react';
import type { BaseSectionProps } from '../../types';

export const DresscodeSection: React.FC<BaseSectionProps> = () => {
  const swatches = [
    { label: 'Burgundy', color: '#4A121A' },
    { label: 'Gold', color: '#D4AF37' },
    { label: 'Ivory', color: '#FAF6EE' },
    { label: 'Dusty Rose', color: '#B76E79' },
    { label: 'Emerald', color: '#1E4B38' },
  ];

  return (
    <div
      className="bg-[#FAF6EE] text-[#1B0609] px-5 pt-6 pb-8 relative"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
    >
      <div className="text-center max-w-[340px] mx-auto">
        <span className="font-script text-2xl text-[#7D5C1E]">Palet Busana</span>
        <h3 className="font-cinzel text-lg font-bold tracking-wider text-[#2E0A10]">
          PANDUAN BUSANA (DRESS CODE)
        </h3>
        <p className="text-xs text-[#4A121A] font-sans mt-1">
          Batik Songket Tradisional atau Pakaian Formal bernuansa warna kerajaan Minang berikut:
        </p>

        {/* Color Swatches with Gold Borders */}
        <div className="flex items-center justify-center gap-3.5 mt-4 flex-wrap">
          {swatches.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <span
                className="w-8 h-8 rounded-full border-2 border-dashed border-[#D4AF37] shadow-sm transform hover:scale-110 transition-transform"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[10px] font-sans font-semibold text-[#2E0A10]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DresscodeSection;
