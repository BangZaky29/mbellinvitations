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
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-4 sm:p-6 overflow-hidden bg-[#FCF8F8] z-20 select-none"
      style={{ backgroundColor: '#FCF8F8' }}
    >
      {/* 100% Solid Islamic Base Background + Gradient Aura (Non-transparent) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#FCF8F8]">
        {/* Solid Rich Islamic Gradient (Burgundy to Warm Cream) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5E2832] via-[#7B3341] via-35% to-[#FCF8F8]"></div>

        {/* Ambient Cover Photo blended subtly with solid backdrop */}
        {(data.cover_image || data.couple_photo) && (
          <img
            src={data.cover_image || data.couple_photo}
            alt="Cover Background"
            className="absolute inset-0 w-full h-full object-cover opacity-15 filter blur-[1.5px] scale-105"
          />
        )}

        {/* Subtle Islamic Arch / Star Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>
      </div>

      {/* Top Notch-Safe Header with High Contrast Gold & White Typography */}
      <div className="relative z-10 pt-8 sm:pt-10 shrink-0 flex flex-col items-center">
        <div className="px-3.5 py-1 rounded-full bg-[#3D141C]/85 border border-[#D4AF37]/50 text-[#F5E296] font-sans text-xs tracking-widest uppercase shadow-sm mb-1.5 font-semibold">
          Walimatul Ursy
        </div>
        <p className="font-serif text-xs sm:text-sm text-[#F5E296]/95 tracking-widest italic drop-shadow-xs">
          The Wedding of
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-white font-bold mt-0.5 tracking-wide drop-shadow-md">
          {data.groom.name} &amp; {data.bride.name}
        </h1>
      </div>

      {/* Middle Tier: Elegant Moroccan Arch Photo Frame with Solid Border */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-1 sm:py-2 w-full max-w-[240px]">
        <div className="relative w-32 h-44 sm:w-40 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden bg-gradient-to-b from-[#D4AF37] via-[#E2C792] to-white p-1.5 shadow-xl shadow-[#5E2832]/25 border border-[#D4AF37]/70">
          <div className="relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#5E2832]/20 shadow-inner">
            <img
              className="w-full h-full object-cover"
              alt={`${data.groom.name} & ${data.bride.name}`}
              src={
                data.cover_image ||
                data.couple_photo ||
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800'
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5E2832]/45 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Solid Guest Card & High-Contrast CTA Button */}
      <div className="relative z-10 w-full max-w-[340px] pb-3 sm:pb-5 flex flex-col items-center space-y-2.5 shrink-0 mt-auto">
        <div className="w-full bg-white rounded-2xl p-3 sm:p-4 shadow-md border border-[#D4AF37]/40 text-center">
          <span className="block font-sans text-[10px] sm:text-xs text-[#8C5D66] uppercase tracking-wider font-semibold mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="font-serif text-base sm:text-lg text-[#5E2832] font-bold line-clamp-1">
            {recipientName}
          </p>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5E2832]/10 text-[#5E2832] text-[11px] font-mono font-semibold">
              <span className="material-symbols-outlined text-[13px]">qr_code</span>
              <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
            </div>
          )}
          <span className="block mt-1 font-sans text-[9.5px] sm:text-[11px] text-[#8C5D66] italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleOpenInvitation}
          className="w-full h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#5E2832] via-[#742B38] to-[#5E2832] hover:brightness-110 text-white font-sans text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#5E2832]/35 transition-all active:scale-[0.98] cursor-pointer border border-[#D4AF37]/50"
          id="btn-buka-undangan"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-[#F5E296]">
            mark_email_read
          </span>
          <span className="tracking-wide">Buka Undangan</span>
        </button>

        {/* Interaktif Petunjuk Usap ke Atas */}
        {renderSwipeHint({ variant: 'gold' })}
      </div>
    </section>
  );
};
