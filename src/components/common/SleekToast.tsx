import React, { useEffect } from 'react';

export interface SleekToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'info' | 'error' | 'copy';
  onClose?: () => void;
  isInsideMockup?: boolean;
  duration?: number;
}

export const SleekToast: React.FC<SleekToastProps> = ({
  show,
  message,
  type = 'success',
  onClose,
  isInsideMockup = false,
  duration = 2400,
}) => {
  useEffect(() => {
    if (!show || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show || !message) return null;

  // Icon mapping with high contrast on clean light pill background
  let iconName = 'check_circle';
  let iconColor = 'text-emerald-600';
  let borderColor = 'border-emerald-500/30';

  if (type === 'error') {
    iconName = 'error';
    iconColor = 'text-rose-600';
    borderColor = 'border-rose-500/30';
  } else if (type === 'info') {
    iconName = 'palette';
    iconColor = 'text-sky-600';
    borderColor = 'border-sky-500/30';
  } else if (type === 'copy') {
    iconName = 'content_copy';
    iconColor = 'text-emerald-600';
    borderColor = 'border-emerald-500/30';
  }

  // Bersihkan emoji di awal pesan bila ada agar tidak terjadi duplikasi icon berdampingan
  const cleanMessage = message.replace(/^[\p{Emoji}\u200d\uFE0F\s]+/u, '').trim() || message;

  // Positioning: di bawah header dashboard, top-center di mobile, top-right di desktop
  const positionClasses = isInsideMockup
    ? 'absolute top-3 left-1/2 -translate-x-1/2 z-40 max-w-[92%]'
    : 'fixed top-[70px] sm:top-[74px] left-1/2 -translate-x-1/2 md:top-[76px] md:right-8 md:left-auto md:translate-x-0 z-[200] w-max max-w-[calc(100vw-24px)] md:max-w-md';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${positionClasses} transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-3 pointer-events-auto`}
    >
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-md text-stone-900 border ${borderColor} shadow-lg shadow-black/10 text-xs sm:text-[13px] font-semibold tracking-wide transition-all`}
      >
        <span className={`material-symbols-outlined text-[18px] shrink-0 ${iconColor}`}>
          {iconName}
        </span>
        <span className="select-none text-stone-900 leading-snug break-words max-w-[calc(100vw-110px)] sm:max-w-sm line-clamp-2 sm:line-clamp-none">
          {cleanMessage}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup notifikasi"
            className="text-stone-400 hover:text-stone-900 ml-0.5 p-0.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
