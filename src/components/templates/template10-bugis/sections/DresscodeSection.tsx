import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { BugisCornerOrnament } from '../components';

interface DresscodeSectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const DresscodeSection: React.FC<DresscodeSectionProps> = ({ data }) => {
  const dresscode = data.dresscode;

  const defaultColors = [
    { name: 'Royal Emerald', hex: '#0F2E22' },
    { name: 'Prada Gold', hex: '#D4AF37' },
    { name: 'Pearl Ivory', hex: '#F8F5EE' },
    { name: 'Silk Beige', hex: '#E2D9C8' },
    { name: 'Noble Sage', hex: '#6E8B76' },
  ];

  const colors =
    dresscode?.colors && dresscode.colors.length > 0
      ? dresscode.colors
      : defaultColors;

  const title = dresscode?.title || 'Dress Code Nuansa Adat';
  const subtitle =
    dresscode?.subtitle ||
    'Tamu terhormat dipersilakan mengenakan busana bernuansa kerajaan Bugis-Makassar:';

  return (
    <section className="relative w-full px-4 py-8 bg-[#00120A] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Card Dresscode */}
        <div className="relative w-full bg-[#052519]/80 backdrop-blur-md border border-[#F2CA50]/30 rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col items-center">
          <BugisCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#F2CA50]/30" />
          <BugisCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#F2CA50]/30" />

          <div className="w-9 h-9 rounded-full bg-[#F2CA50]/15 text-[#F2CA50] flex items-center justify-center mb-2 border border-[#F2CA50]/30">
            <span className="material-symbols-outlined text-[20px]">styler</span>
          </div>

          <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
            Panduan Busana Tamu
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#C8EAD8] mt-1">
            {title}
          </h3>
          <p className="font-sans text-xs text-[#D7C594] mt-1 max-w-xs leading-relaxed">
            {subtitle}
          </p>

          {/* Color Swatches Grid */}
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            {colors.map((c: any, idx: number) => {
              const hex = c.hex || c.color || '#F2CA50';
              const name = c.name || `Warna ${idx + 1}`;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-white/20 transition-transform hover:scale-110"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="font-sans text-[9.5px] text-[#D0C5AF] font-medium">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

