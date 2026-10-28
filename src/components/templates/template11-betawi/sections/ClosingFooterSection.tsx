import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';

interface ClosingFooterSectionProps {
  data: InvitationData;
  firstPerson: CoupleInfo | { name: string; full_name?: string };
  secondPerson: CoupleInfo | { name: string; full_name?: string };
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const ClosingFooterSection: React.FC<ClosingFooterSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
  renderBrandFooter,
}) => {
  const groomFather =
    data.groom?.parent_father || 'H. Ahmad Marzuki';
  const brideFather =
    data.bride?.parent_father || 'H. Syamsuddin';

  return (
    <footer className="relative w-full px-4 pt-4 pb-20 flex flex-col items-center bg-[#410403] text-[#FAF6EE] overflow-hidden">
      {/* Emotional Closing Card */}
      <div className="w-full max-w-[360px] bg-white text-[#1C1C18] rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden flex flex-col items-center border border-[#FED65B]/40 mb-8">
        <svg
          className="w-10 h-6 text-[#735c00] mb-2 fill-current"
          viewBox="0 0 40 24"
        >
          <path d="M20 0 C22 8 28 12 36 12 C28 12 22 16 20 24 C18 16 12 12 4 12 C12 12 18 8 20 0 Z" />
        </svg>

        <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#735c00] uppercase mb-1">
          TERIMA KASIH BANYAK
        </span>

        <p className="font-serif text-xl sm:text-2xl font-bold text-[#410403] italic mb-2">
          “Jaga Sehat Selalu, Abang &amp; Mpok Sekeluarga”
        </p>

        <p className="font-serif text-xs text-[#554240] leading-relaxed mb-4 max-w-[280px]">
          Merupakan sebuah kehormatan dan kebahagiaan bagi kami sekeluarga atas doa, restu, dan kehadiran yang tercurah.
        </p>

        <div className="h-px w-20 bg-[#FED65B] mb-3" />

        <p className="font-sans text-[10.5px] text-[#88726F] tracking-wider uppercase font-semibold">
          Kami yang berbahagia,
        </p>

        <h3 className="font-serif text-lg font-bold text-[#410403] mt-0.5 break-words [overflow-wrap:anywhere]">
          {firstPerson.name} &amp; {secondPerson.name}
        </h3>

        <p className="font-sans text-xs text-[#554240] mt-1 break-words [overflow-wrap:anywhere] leading-snug">
          Beserta Seluruh Keluarga Besar<br />
          <span className="font-semibold">{groomFather} &amp; {brideFather}</span>
        </p>
      </div>

      {/* Mbell.ID Brand Footer */}
      <div className="w-full flex justify-center text-center">
        {renderBrandFooter()}
      </div>
    </footer>
  );
};

export default ClosingFooterSection;
