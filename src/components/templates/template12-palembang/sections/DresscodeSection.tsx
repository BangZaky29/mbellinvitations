import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { PalembangSongketWatermark } from '../components';

interface DresscodeSectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const DresscodeSection: React.FC<DresscodeSectionProps> = ({ data }) => {
  const dresscode = data.dresscode;
  const isEnabled = dresscode?.enabled !== false;

  const defaultColors = [
    { name: 'Lacquer', hex: '#4A0E12' },
    { name: 'Songket', hex: '#EAC168' },
    { name: 'Cempako', hex: '#FDF9F2' },
    { name: 'Lotus', hex: '#072A1E' },
    { name: 'Krem', hex: '#E6E2DB' },
  ];

  const colors = dresscode?.colors && dresscode.colors.length > 0 ? dresscode.colors : defaultColors;

  if (!isEnabled) return null;

  return (
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 pt-8 pb-6 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px] text-center flex flex-col items-center">
        <span className="font-sans text-[10px] text-[#785A05] tracking-[0.2em] uppercase font-bold">
          Aturan Keharmonisan
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A0E12] mt-1">
          {dresscode?.title || 'Panduan Busana Tamu'}
        </h3>
        <p className="font-sans text-xs text-[#544342] max-w-[320px] mx-auto mt-1.5 leading-relaxed">
          {dresscode?.subtitle ||
            'Bapak/Ibu sanak dulur disarankan mengenakan Batik Palembang, Songket Lepus Halus, atau Busana Formal bernuansa:'}
        </p>

        {/* 5 Circular Fabric Swatches */}
        <div className="flex items-center justify-center gap-3.5 mt-5 flex-wrap">
          {colors.map((color, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full shadow-md ring-2 ring-[#FFFFFF] border border-black/10 transition-transform hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[10px] font-sans text-[#544342] mt-1.5 font-medium">
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

