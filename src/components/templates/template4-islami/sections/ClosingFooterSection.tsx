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
      {/* Heartfelt Family Closing Statement */}
      <div className="w-full text-center p-6 rounded-t-full rounded-b-2xl bg-surface-container-lowest shadow-md shadow-primary/5 mb-6 border border-secondary-container/20">
        <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mx-auto mb-3">
          <span className="material-symbols-outlined text-[20px]">
            handshake
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga,
          apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa
          restu kepada kedua mempelai.
        </p>
        <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
          Wassalamu’alaikum Warahmatullahi Wabarakatuh
        </h3>
        <p className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-widest mt-2">
          Kami Yang Berbahagia:
        </p>
        <p className="font-headline-sm text-headline-sm text-primary font-semibold mt-1">
          Keluarga Besar {(data.groom?.parent_father || '').replace('Bpk. ', '').replace('Ir. ', '')}{' '}
          <br />&amp; Keluarga Besar {(data.bride?.parent_father || '').replace('Bpk. ', '').replace('Dr. H. ', '')}
        </p>
      </div>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter({ themeId: 'islami' })}
    </footer>
  );
};
