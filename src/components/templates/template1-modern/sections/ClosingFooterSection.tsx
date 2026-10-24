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
    <footer className="text-center pt-8 pb-16 px-6">
      <p className="text-[10px] tracking-[0.3em] uppercase text-gold-champagne font-medium mb-1">
        Terima Kasih
      </p>
      <h3 className="font-editorial text-2xl text-charcoal-dark font-normal">
        {data.groom?.name} &amp; {data.bride?.name}
      </h3>
      <p className="text-[10px] text-charcoal-muted tracking-widest mt-2 font-light">
        {data.hashtag || 'The Wedding'}
      </p>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter()}
    </footer>
  );
};
