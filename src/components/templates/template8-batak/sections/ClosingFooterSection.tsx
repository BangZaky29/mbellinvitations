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
  return (
    <footer className="relative w-full px-4 pt-6 pb-20 flex flex-col items-center bg-[#19120E] text-[#FAF6EE] overflow-hidden">
      {/* Closing Warm Parchment Banner */}
      <div className="w-full max-w-[360px] bg-[#EDE1D0] text-[#362F25] rounded-2xl p-6 text-center shadow-xl relative overflow-hidden flex flex-col items-center border border-[#85291B]/20 mb-8">
        <div className="w-12 h-6 text-[#85291B] mb-2">
          <svg fill="currentColor" viewBox="0 0 48 24">
            <path d="M24,2 L12,12 L24,22 L36,12 Z M24,6 L29,12 L24,18 L19,12 Z" />
          </svg>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#630F05] mb-1">
          Mauliate Godang
        </h3>

        <p className="font-sans text-[11px] uppercase tracking-widest text-[#4D463A] font-semibold mb-3">
          Horas Jala Gabe Ma Hita Saluhutna
        </p>

        <p className="font-sans text-xs text-[#362F25] leading-relaxed mb-4 max-w-[280px]">
          Atas kehadiran, doa restu, dan kasih yang tulus dari segenap keluarga, kerabat, dan sahabat, kami haturkan terima kasih yang sebesar-besarnya.
        </p>

        <div className="h-px w-24 bg-[#85291B]/20 mb-3" />

        <p className="font-sans text-[11px] text-[#4D463A] tracking-wider uppercase font-semibold">
          Kami yang berbahagia,
        </p>

        <p className="font-serif text-lg font-bold text-[#630F05] mt-1 break-words [overflow-wrap:anywhere]">
          {firstPerson.name} &amp; {secondPerson.name}
        </p>

        <p className="font-sans text-xs text-[#4D463A] mt-0.5 break-words [overflow-wrap:anywhere]">
          beserta Keluarga Besar{' '}
          {data.groom?.marga ||
            (data.groom?.parent_father
              ? data.groom.parent_father.split(' ').pop()
              : 'Siregar')}{' '}
          &amp;{' '}
          {data.bride?.marga ||
            (data.bride?.parent_father
              ? data.bride.parent_father.split(' ').pop()
              : 'Simanjuntak')}
        </p>
      </div>

      {/* Mbell.ID Brand Footer */}
      <div className="w-full flex justify-center text-center">
        {renderBrandFooter()}
      </div>
    </footer>
  );
};
