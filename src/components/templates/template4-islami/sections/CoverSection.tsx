import React from 'react';
import type { CoverSectionProps } from '../../types';

export const CoverSection: React.FC<CoverSectionProps> = ({
  data,
  handleOpenInvitation,
  renderSwipeHint,
  isPreview,
}) => {
  const recipientName = data.guest_name || 'Tamu Undangan';

  return (
    <section
      id="sampul"
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-5 sm:p-7 overflow-hidden"
    >
      {/* Ambient Islamic Backdrop using Cover Photo if present */}
      {(data.cover_image || data.couple_photo) && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={data.cover_image || data.couple_photo}
            alt="Cover Background"
            className="w-full h-full object-cover opacity-20 filter blur-[0.8px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5e2832]/85 via-[#fcf8f8]/85 to-[#fcf8f8]"></div>
        </div>
      )}

      {/* Top Notch-Safe Header */}
      <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
        <div className="px-4 py-1 rounded-full bg-secondary-container/50 text-primary font-label-md text-xs sm:text-sm tracking-widest uppercase shadow-sm mb-1.5 font-medium">
          Walimatul Ursy
        </div>
        <p className="font-headline-sm text-xs sm:text-sm text-primary/80 tracking-widest italic">
          The Wedding of
        </p>
        <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl text-primary font-semibold mt-0.5">
          {data.groom.name} &amp; {data.bride.name}
        </h1>
      </div>

      {/* Middle Tier: Elegant Arch Photo Silhouette */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 w-full max-w-[260px]">
        <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-t-full rounded-b-2xl overflow-hidden bg-gradient-to-b from-secondary-container/40 to-surface-container-low p-2 shadow-lg shadow-primary/10 border border-secondary-container/40">
          <div className="relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-surface-container-high/60 shadow-inner">
            <img
              className="w-full h-full object-cover"
              alt={`${data.groom.name} & ${data.bride.name}`}
              src={
                data.cover_image ||
                data.couple_photo ||
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800'
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Guest Card & CTA Button Anchored Bottom */}
      <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
        <div className="w-full bg-surface-container-low/90 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 shadow-sm border border-secondary-container/30">
          <span className="block font-label-sm text-[11px] sm:text-xs text-on-surface-variant uppercase tracking-wider mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="font-headline-sm text-lg sm:text-xl text-primary font-bold line-clamp-1">
            {recipientName}
          </p>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono">
              <span className="material-symbols-outlined text-[13px]">qr_code</span>
              <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
            </div>
          )}
          <span className="block mt-1 font-body-sm text-[10px] sm:text-xs text-on-surface-variant italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleOpenInvitation}
          className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
          id="btn-buka-undangan"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            mark_email_read
          </span>
          <span>Buka Undangan</span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'gold' })}
      </div>
    </section>
  );
};
