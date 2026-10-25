import React from 'react';
import type { InvitationData } from '../../types/invitation';

export interface UniversalDresscodeSectionProps {
  data: InvitationData;
  themeStyle?: 'modern' | 'rustic' | 'jawa' | 'islami' | 'luxury' | 'sunda';
  className?: string;
}

export const UniversalDresscodeSection: React.FC<UniversalDresscodeSectionProps> = ({
  data,
  themeStyle = 'modern',
  className = '',
}) => {
  const dresscode = data.dresscode;
  if (!dresscode || dresscode.enabled === false) return null;

  const colors = dresscode.colors || [];
  if (colors.length === 0) return null;

  const title = dresscode.title || 'Panduan Busana (Dresscode)';
  const subtitle =
    dresscode.subtitle ||
    'Kami menyarankan para tamu mengenakan pakaian dengan palet warna berikut:';

  // Styling token sesuai nuansa tema
  const styleConfig = {
    modern: {
      wrapper: 'bg-stone-50/90 text-stone-900 border-y border-stone-200/80',
      badge: 'bg-stone-200/70 text-stone-800 border-stone-300/80',
      title: 'text-stone-900 font-serif',
      subtitle: 'text-stone-600 font-sans',
      swatchBorder: 'border-stone-300/80 shadow-xs',
      label: 'text-stone-800',
    },
    rustic: {
      wrapper: 'bg-[#F9F6F0] text-[#4A3B32] border-y border-[#E8DFD1]',
      badge: 'bg-[#EFE9DF] text-[#6E5D53] border-[#DFD5C6]',
      title: 'text-[#4A3B32] font-serif',
      subtitle: 'text-[#6E5D53] font-sans',
      swatchBorder: 'border-[#C4A482]/60 shadow-xs',
      label: 'text-[#4A3B32]',
    },
    jawa: {
      wrapper: 'bg-[#211611] text-[#F5EFEB] border-y border-[#C5A059]/30',
      badge: 'bg-[#2E2019] text-[#E5C178] border-[#C5A059]/40',
      title: 'text-[#E5C178] font-serif',
      subtitle: 'text-[#D0C2B6] font-sans',
      swatchBorder: 'border-[#C5A059]/50 shadow-xs',
      label: 'text-[#FAF6EE]',
    },
    islami: {
      wrapper: 'bg-[#1C080B] text-[#FAF6EE] border-y border-[#D4AF37]/30',
      badge: 'bg-[#290C10] text-[#EAC16E] border-[#D4AF37]/40',
      title: 'text-[#EAC16E] font-serif',
      subtitle: 'text-[#DFD0BC] font-sans',
      swatchBorder: 'border-[#D4AF37]/50 shadow-xs',
      label: 'text-[#FAF6EE]',
    },
    luxury: {
      wrapper: 'bg-[#0F141C] text-[#F4F4F6] border-y border-[#C5A059]/30',
      badge: 'bg-[#18202C] text-[#DFB76C] border-[#DFB76C]/40',
      title: 'text-[#DFB76C] font-serif tracking-wider',
      subtitle: 'text-stone-400 font-sans',
      swatchBorder: 'border-[#DFB76C]/50 shadow-xs',
      label: 'text-stone-200',
    },
    sunda: {
      wrapper: 'bg-[#FAF7F2] text-[#3E342B] border-y border-[#E0D5C1]',
      badge: 'bg-[#F2ECE1] text-[#7A643E] border-[#DACFBD]',
      title: 'text-[#3E342B] font-serif',
      subtitle: 'text-[#6E6255] font-sans',
      swatchBorder: 'border-[#B89758]/60 shadow-xs',
      label: 'text-[#3E342B]',
    },
  }[themeStyle];

  return (
    <section className={`w-full py-9 px-5 text-center ${styleConfig.wrapper} ${className}`}>
      <div className="max-w-[360px] mx-auto space-y-3">
        {/* Badge Etiket */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${styleConfig.badge}`}
        >
          <span className="material-symbols-outlined text-[15px]">styler</span>
          <span>Etiket Busana Tamu</span>
        </div>

        {/* Judul & Subtitle */}
        <h3 className={`text-xl sm:text-2xl font-bold ${styleConfig.title}`}>
          {title}
        </h3>

        <p className={`text-xs sm:text-sm leading-relaxed ${styleConfig.subtitle}`}>
          {subtitle}
        </p>

        {/* Swatch Lingkaran Warna */}
        <div className="flex items-center justify-center gap-3.5 pt-3 flex-wrap">
          {colors.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-11 h-11 rounded-full p-0.5 border-2 transition-transform hover:scale-105 ${styleConfig.swatchBorder}`}
              >
                <div
                  className="w-full h-full rounded-full shadow-inner"
                  style={{ backgroundColor: item.hex }}
                  title={`${item.name} (${item.hex})`}
                />
              </div>
              <span
                className={`text-[11px] font-semibold text-center truncate max-w-[85px] ${styleConfig.label}`}
              >
                {item.name}
              </span>
              <span className="text-[9px] font-mono opacity-60">
                {item.hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
