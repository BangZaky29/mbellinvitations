import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
  PalembangCornerFiligree,
} from '../components';

interface ClosingFooterSectionProps {
  data: InvitationData;
  renderBrandFooter?: (extraProps?: any) => React.ReactNode;
}

export const ClosingFooterSection: React.FC<ClosingFooterSectionProps> = ({
  data,
  renderBrandFooter,
}) => {
  const firstPersonName = data.is_bride_first ? data.bride.name : data.groom.name;
  const secondPersonName = data.is_bride_first ? data.groom.name : data.bride.name;

  return (
    <footer className="relative w-full shrink-0 bg-[#2A0003] text-[#FDF9F2] px-4 pt-10 pb-20 flex flex-col items-center overflow-hidden">
      {/* Background Ambience & Palembang Songket Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.08]" showPucukBorders />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center text-center">
        {/* Closing Blessing Card */}
        <div className="relative w-full bg-[#4A0E12] border border-[#FFD57A]/40 rounded-2xl p-6 text-center shadow-xl flex flex-col items-center overflow-hidden">
          {/* Corner Filigrees */}
          <PalembangCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-6 h-6" color="#FFD57A" />
          <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-6 h-6" color="#FFD57A" />
          <PalembangCornerFiligree position="bottom-left" className="absolute bottom-1.5 left-1.5 w-6 h-6" color="#FFD57A" />
          <PalembangCornerFiligree position="bottom-right" className="absolute bottom-1.5 right-1.5 w-6 h-6" color="#FFD57A" />

          {/* Golden Lotus Star Icon */}
          <svg className="w-10 h-10 text-[#FFD57A] mb-2 opacity-90 drop-shadow" fill="currentColor" viewBox="0 0 40 40">
            <path d="M20 5 L23 15 L33 18 L25 24 L27 34 L20 28 L13 34 L15 24 L7 18 L17 15 Z" />
          </svg>

          <h3 className="font-serif text-2xl font-bold text-[#FDF9F2] mb-1">
            Terima Kasih
          </h3>
          <p className="font-sans text-xs text-[#FFD57A] font-semibold mt-1">
            Payo Sanak Dulur Hadir di Hari Bahagia Kami
          </p>

          <p className="font-sans text-xs text-[#F1EDE6]/80 max-w-[300px] leading-relaxed my-3.5">
            Merupakan suatu kehormatan dan kebahagiaan yang mendalam bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.
          </p>

          <div className="pt-4 border-t border-[#FFD57A]/30 w-full flex flex-col items-center">
            <span className="font-sans text-[10px] text-[#FFD57A] uppercase tracking-widest font-bold">
              Kami Yang Berbahagia
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#FDF9F2] mt-1">
              {firstPersonName} &amp; {secondPersonName}
            </span>
            <span className="font-sans text-[11px] text-[#FFD57A]/80 mt-1">
              Beserta Segenap Keluarga Besar Kemas &amp; Masagus
            </span>
            <RumahLimasDivider compact className="mt-3" />
          </div>
        </div>

        {/* Small Heritage Label */}
        <div className="mt-8 text-center text-[10px] text-[#FFD57A]/70 font-sans tracking-widest uppercase flex items-center justify-center gap-1.5">
          <span>The Royal Palembang Darussalam Heritage</span>
          <span>•</span>
          <span>2026</span>
        </div>

        {/* Universal Mbell Brand Footer */}
        {renderBrandFooter && (
          <div className="w-full mt-4 pt-3 border-t border-[#FFD57A]/20">
            {renderBrandFooter({ themeId: 'palembang', variant: 'dark' })}
          </div>
        )}
      </div>
    </footer>
  );
};

