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
    iconColor = 'text-amber-600';
    borderColor = 'border-amber-500/30';
  }

  // Positioning: top-center on mobile, top-right on desktop
  const positionClasses = isInsideMockup
    ? 'absolute top-3 left-1/2 -translate-x-1/2 z-40 max-w-[90%]'
    : 'fixed top-4 left-1/2 -translate-x-1/2 md:top-5 md:right-6 md:left-auto md:translate-x-0 z-[200] max-w-[92%] md:max-w-md';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${positionClasses} transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-3 pointer-events-auto`}
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-black border ${borderColor} shadow-lg shadow-black/10 text-xs font-semibold tracking-wide`}
      >
        <span className={`material-symbols-outlined text-[17px] shrink-0 ${iconColor}`}>
          {iconName}
        </span>
        <span className="truncate max-w-[260px] sm:max-w-[320px] select-none text-black">
          {message}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup notifikasi"
            className="text-stone-400 hover:text-black ml-0.5 p-0.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
