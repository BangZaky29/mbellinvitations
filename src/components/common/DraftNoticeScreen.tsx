import React from 'react';
import { Link } from 'react-router-dom';
import { getInvitationDisplayUrl } from '../../utils/urlHelper';

export interface DraftNoticeScreenProps {
  slug: string;
  groomName?: string;
  brideName?: string;
  coverImage?: string;
}

export const DraftNoticeScreen: React.FC<DraftNoticeScreenProps> = ({
  slug,
  groomName,
  brideName,
  coverImage,
}) => {
  const hasCoupleNames = Boolean(groomName && brideName);
  const coupleTitle = hasCoupleNames
    ? `${groomName} & ${brideName}`
    : 'Mempelai Pengantin';

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FAF8F5] text-stone-800 overflow-hidden font-sans select-none">
      {/* Background Ambient Glow & Blur Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#EAE3D2]/70 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F4EDE0]/80 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-amber-100/40 blur-[100px] pointer-events-none" />

      {/* Subtle Background Photo Overlay if Available */}
      {coverImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-lg pointer-events-none scale-105"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}

      {/* Main Glassmorphic Notice Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200/90 text-center animate-fade-in my-8">
        {/* Brand Header */}
        <div className="mb-6 flex justify-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <img
              src="/mbell-logo-1-noBG.png"
              alt="mbell invitations logo"
              className="h-10 sm:h-11 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Draf Sedang Disiapkan</span>
        </div>

        {/* Central Ring Icon Ornament */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#C5A059]/20 to-[#EAE3D2]/50 border border-[#C5A059]/40 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#9A7B38]">
            lock_clock
          </span>
        </div>

        {/* Couple Title */}
        <div className="space-y-1.5 mb-4">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">
            Undangan Pernikahan
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            {coupleTitle}
          </h1>
        </div>

        {/* Friendly Courteous Message */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto mb-6">
          Calon mempelai saat ini sedang menyempurnakan detail dan tanggal bahagia pernikahan ini. Halaman ini masih dalam tahap penyuntingan draf dan belum diterbitkan live untuk umum.
        </p>

        {/* Helpful Info Box */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 mb-6 text-left text-xs text-stone-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-stone-800">
            <span className="material-symbols-outlined text-[16px] text-amber-700">info</span>
            <span>Untuk Tamu Undangan:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Silakan kembali lagi nanti saat tautan resmi telah dibagikan secara langsung oleh kedua mempelai atau pihak keluarga.
          </p>
        </div>

        {/* Slug Metadata Preview */}
        <div className="mb-6 flex items-center justify-center gap-1.5 font-mono text-[11px] text-stone-500 bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200/70 max-w-xs mx-auto">
          <span className="material-symbols-outlined text-[13px] text-stone-400">link</span>
          <span className="truncate">{getInvitationDisplayUrl(slug)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Owner Dashboard Shortcut */}
          <Link
            to="/dashboard"
            className="w-full py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">edit_note</span>
            <span>Pemilik Undangan? Buka Editor &amp; Terbitkan</span>
          </Link>

          {/* Create Own Invitation Shortcut */}
          <Link
            to="/"
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px] text-[#C5A059]">auto_awesome</span>
            <span>Buat Undangan Pernikahan Anda Sendiri di Mbell</span>
          </Link>
        </div>

        {/* Footer Brand Credit */}
        <div className="mt-8 pt-4 border-t border-stone-100 text-[10px] text-stone-400">
          <span>&copy; {new Date().getFullYear()} mbell invitations • Platform Undangan Digital Elegan</span>
        </div>
      </div>
    </div>
  );
};
