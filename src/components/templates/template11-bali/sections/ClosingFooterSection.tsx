import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
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
    <footer className="relative w-full bg-[#FFF9EF] text-[#1D1B16] px-4 pt-8 pb-20 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.045]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Closing Blessing Card */}
        <div className="relative w-full bg-[#F9F3EA] border border-[#D4AF37]/45 rounded-2xl p-6 text-center shadow-md flex flex-col items-center overflow-hidden">
          {/* Corner Filigrees */}
          <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

          <span className="material-symbols-outlined text-[#735C00] text-3xl mb-1">spa</span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mb-2">
            Matur Suksma
          </h3>
          <p className="font-sans text-xs text-[#524341] max-w-[300px] leading-relaxed mb-4">
            Merupakan suatu kehormatan dan kebahagiaan mendalam bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.
          </p>

          <p className="font-serif text-lg text-[#735C00] italic font-semibold mb-4 tracking-wide">
            “Om Shanti Shanti Shanti Om”
          </p>

          <div className="pt-4 border-t border-[#D7C2BE]/40 w-full flex flex-col items-center">
            <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-widest font-bold">
              Keluarga Besar Mempelai
            </span>
            <span className="font-serif text-lg font-bold text-[#411710] mt-1">
              {firstPersonName} &amp; {secondPersonName}
            </span>
            <span className="font-sans text-[11px] text-[#857370] mt-0.5">
              Puri Santrian Sanctuary &amp; Ubud Royal Pavilion
            </span>
            <CandiBentarDivider compact className="mt-3" />
          </div>
        </div>

        {/* Small Heritage Label */}
        <div className="mt-8 text-center text-[10px] text-[#857370]/70 font-sans tracking-widest uppercase flex items-center justify-center gap-1.5">
          <span>The Royal Balinese Wedding Heritage</span>
          <span>•</span>
          <span>2026</span>
        </div>

        {/* Universal Mbell Brand Footer */}
        {renderBrandFooter && (
          <div className="w-full mt-4 pt-3 border-t border-[#D4AF37]/20">
            {renderBrandFooter({ themeId: 'bali' })}
          </div>
        )}
      </div>
    </footer>
  );
};

