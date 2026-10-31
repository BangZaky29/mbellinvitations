import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import { BugisTenunWatermark } from '../components';

interface ClosingFooterSectionProps {
  data?: InvitationData;
  firstPerson: CoupleInfo | { name: string; full_name?: string };
  secondPerson: CoupleInfo | { name: string; full_name?: string };
  renderBrandFooter?: () => React.ReactNode;
}

export const ClosingFooterSection: React.FC<ClosingFooterSectionProps> = ({
  firstPerson,
  secondPerson,
  renderBrandFooter,
}) => {
  const coupleTitle = `${firstPerson.name} & ${secondPerson.name}`;

  return (
    <footer className="relative w-full bg-[#00170E] text-[#C8EAD8] px-5 pt-10 pb-12 flex flex-col items-center text-center overflow-hidden">
      {/* Pernak-pernik Motif Tenun Sa'be */}
      <BugisTenunWatermark opacityClass="opacity-[0.06]" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#052519] shadow-md flex items-center justify-center text-[#F2CA50] mb-3 border border-[#F2CA50]/30">
          <span className="material-symbols-outlined text-[24px]">favorite</span>
        </div>

        <span className="font-serif text-lg sm:text-xl text-[#F2CA50] italic font-normal">
          Kurru Sumanga’ — Tarima Kasi’
        </span>

        <h3 className="font-serif text-xl sm:text-2xl text-[#C8EAD8] font-bold mt-1 tracking-wider uppercase">
          Terima Kasih Atas Doa &amp; Restu Anda
        </h3>

        <p className="font-sans text-xs sm:text-[13px] text-[#D7C594] max-w-xs mx-auto mt-2.5 leading-relaxed">
          Merupakan suatu kehormatan dan kebahagiaan yang mendalam bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta melantunkan doa restu bagi langkah awal kehidupan baru kami.
        </p>

        <div className="flex items-center justify-center gap-2 my-5">
          <span className="w-10 h-[1px] bg-[#F2CA50]/40" />
          <span className="text-[#F2CA50] text-xs">◆</span>
          <span className="w-10 h-[1px] bg-[#F2CA50]/40" />
        </div>

        <div className="flex flex-col items-center">
          <span className="font-sans text-[10px] text-[#D7C594] uppercase tracking-widest font-bold">
            Kami Yang Berbahagia
          </span>
          <span className="font-serif text-2xl text-[#F2CA50] font-bold mt-1">
            {coupleTitle}
          </span>
          <span className="font-sans text-xs text-[#C8EAD8]/80 mt-1">
            Beserta Segenap Keluarga Besar Bugis - Makassar
          </span>
        </div>

        <div className="mt-8 text-[#D7C594]/70 text-[10px] font-sans uppercase tracking-widest flex items-center gap-1.5">
          <span>The Royal Bugis-Makassar Heritage</span>
          <span>•</span>
          <span>2026</span>
        </div>

        {/* Mbell.ID Brand Footer */}
        {renderBrandFooter && (
          <div className="w-full mt-6 pt-4 border-t border-[#F2CA50]/20">
            {renderBrandFooter()}
          </div>
        )}
      </div>
    </footer>
  );
};
