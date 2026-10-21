import React from 'react';
import type { BaseSectionProps } from '../../types';
import { SigerCrownSvg } from '../components/SigerCrownSvg';

export interface SundaClosingFooterProps extends BaseSectionProps {
  coupleOrderTitle: string;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const ClosingFooterSection: React.FC<SundaClosingFooterProps> = ({
  data,
  coupleOrderTitle,
  renderBrandFooter,
}) => {
  return (
    <footer className="w-full px-5 pt-10 pb-4 bg-[#fbf9f6] flex flex-col items-center text-center relative border-t border-[#ede9e1]">
      <div className="w-20 h-8 flex items-center justify-center text-[#8a6822] mb-3">
        <SigerCrownSvg />
      </div>
      <p className="text-xs text-[#4e4639] max-w-sm leading-relaxed mb-6">
        Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
      </p>
      <span className="text-[10px] font-bold text-[#8a6822] tracking-widest uppercase mb-1">
        Kami yang berbahagia:
      </span>
      <h3 className="text-sm font-semibold text-[#1b1c1a] mb-1">
        Keluarga {data.groom.parent_father || 'Mempelai Pria'}
      </h3>
      <h3 className="text-sm font-semibold text-[#1b1c1a] mb-6">
        Keluarga {data.bride.parent_father || 'Mempelai Wanita'}
      </h3>
      <div className="w-12 h-0.5 bg-[#c5a059]/40 my-4 rounded-full" />
      <h2 className="text-2xl text-[#8a6822] font-serif italic mb-2">
        {coupleOrderTitle}
      </h2>
      <p className="text-[10px] text-[#735855] tracking-widest uppercase mt-4">
        © {new Date().getFullYear()} The Royal Sundanese Wedding of {coupleOrderTitle}
      </p>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter()}
    </footer>
  );
};

export default ClosingFooterSection;
