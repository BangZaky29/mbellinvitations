import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { CoupleInfo } from '../../../../types/invitation';

export interface RusticFooterProps extends BaseSectionProps {
  firstPerson: CoupleInfo;
  secondPerson: CoupleInfo;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const FooterSection: React.FC<RusticFooterProps> = ({
  data,
  firstPerson,
  secondPerson,
  renderBrandFooter,
}) => {
  return (
    <>
      {/* FOOTER ORNAMENT */}
      <footer className="pt-space-md pb-space-lg flex flex-col items-center text-center">
        <div className="w-16 h-0.5 bg-[#8C4E2D]/40 rounded-full mb-3"></div>
        <span className="material-symbols-outlined text-[#8C4E2D] text-[24px]">
          local_florist
        </span>
        <h5 className="font-serif text-xl sm:text-2xl text-[#2C4034] font-bold mt-2">
          {firstPerson.name} &amp; {secondPerson.name}
        </h5>
        <p className="text-xs text-[#718576] mt-1">
          Created with Love • {new Date(data.wedding_date_iso || Date.now()).getFullYear()}
        </p>
      </footer>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter()}
    </>
  );
};
