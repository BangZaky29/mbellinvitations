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
    <footer className="relative w-full bg-surface-container-low px-margin pt-6 pb-20 flex flex-col items-center">
      {/* Final Royal Footer Emblem */}
      <div className="flex flex-col items-center text-center opacity-80 mb-6">
        <span className="material-symbols-outlined text-primary text-2xl mb-2">flare</span>
        <p className="font-caption text-caption text-on-surface-variant tracking-wider uppercase">
          Matur Nuwun Sanget
        </p>
        <p className="font-title-md text-title-md text-primary italic">
          {firstPerson.name} &amp; {secondPerson.name}
        </p>
        <p className="font-caption text-caption text-on-surface-variant/50 mt-1">
          {data.hashtag || 'Kraton Ngayogyakarta Hadiningrat'}
        </p>
      </div>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter({ themeId: 'jawa' })}
    </footer>
  );
};
