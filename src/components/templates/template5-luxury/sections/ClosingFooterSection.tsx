import React from 'react';
import type { InvitationData } from '../../../../types/invitation';

interface ClosingFooterSectionProps {
  data: InvitationData;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const ClosingFooterSection: React.FC<ClosingFooterSectionProps> = ({
  data,
  renderBrandFooter,
}) => {
  return (
    <footer className="w-full px-margin pb-20 pt-4 flex flex-col items-center">
      {/* Closing Gratitude Note */}
      <div className="text-center mt-6 mb-6 max-w-[320px]">
        <div className="w-8 h-8 rounded-full bg-surface-container-high mx-auto flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-primary text-base">
            favorite
          </span>
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed mb-3">
          Merupakan suatu kehormatan dan kebahagiaan mendalam bagi kami apabila Bapak/Ibu/Saudara(i)
          berkenan hadir dan memberikan doa restu.
        </p>
        <p className="font-label-eyebrow text-secondary uppercase tracking-[0.25em] text-[10px] mb-1">
          With All Our Love,
        </p>
        <h3 className="font-headline-sm text-primary text-lg">
          {(data.groom?.name || '').toUpperCase()} &amp; {(data.bride?.name || '').toUpperCase()}
        </h3>
      </div>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter({ themeId: 'luxury' })}
    </footer>
  );
};
