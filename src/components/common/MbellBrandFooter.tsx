import React from 'react';

export interface MbellBrandFooterProps {
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  themeId?: string;
  isOpen?: boolean;
}

/**
 * Komponen & Fungsi Universal Branding Footer "Create by [logo: mbell Invitations]"
 * Terintegrasi dinamis pada seluruh template (aktif saat undangan terbuka).
 */
export const MbellBrandFooter: React.FC<MbellBrandFooterProps> = ({
  variant = 'auto',
  className = '',
  themeId = '',
  isOpen = true,
}) => {
  // Hanya tampilkan jika undangan sudah dibuka (atau saat mode preview)
  if (!isOpen) return null;

  const normalizedTheme = (themeId || '').toLowerCase();
  const isDark =
    variant === 'dark' ||
    ['jawa', 'template3', 'luxury', 'template5'].includes(normalizedTheme);

  return (
    <div
      className={`w-full pt-6 pb-6 sm:pb-8 flex flex-col items-center justify-center text-center select-none ${className}`}
      data-testid="mbell-brand-footer"
    >
      {/* Divider & "Create by" Header */}
      <div className="flex items-center justify-center gap-2 mb-2.5">
        <span
          className={`w-7 sm:w-10 h-px ${
            isDark ? 'bg-amber-400/30' : 'bg-stone-300'
          }`}
        />
        <span
          className={`text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.22em] font-medium ${
            isDark ? 'text-amber-100/75' : 'text-stone-500'
          }`}
        >
          Create by
        </span>
        <span
          className={`w-7 sm:w-10 h-px ${
            isDark ? 'bg-amber-400/30' : 'bg-stone-300'
          }`}
        />
      </div>

      {/* mbell Invitations Logo Badge */}
      <a
        href="https://mbellinvitations.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 group hover:scale-105 active:scale-95 ${
          isDark
            ? 'bg-white/95 hover:bg-white border border-amber-500/40 shadow-lg'
            : 'bg-white/85 hover:bg-white border border-stone-200/80 shadow-2xs'
        }`}
        title="mbell Wedding Invitations"
      >
        <img
          src="/mbell-logo-1-noBG.png"
          alt="mbell Invitations"
          className="h-8 sm:h-9 w-auto object-contain transition-opacity duration-300 group-hover:opacity-100 opacity-95 drop-shadow-2xs"
          loading="lazy"
        />
      </a>
      <span
        className={`text-[9px] sm:text-[10px] mt-1.5 tracking-wider ${
          isDark ? 'text-stone-400/80' : 'text-stone-400'
        }`}
      >
        Platform Undangan Digital Eksklusif
      </span>
    </div>
  );
};

/**
 * 🌟 Function Utama Dinamis: renderMbellBrandFooter
 * Bisa dipanggil langsung di template mana saja (baik template saat ini maupun template baru nanti)
 * Contoh: {renderMbellBrandFooter({ themeId: 'rustic', isOpen })}
 */
export function renderMbellBrandFooter(props?: MbellBrandFooterProps): React.ReactNode {
  return <MbellBrandFooter {...props} />;
}

export default MbellBrandFooter;
