import React from 'react';

export interface CoverSwipeHintProps {
  variant?: 'light' | 'dark' | 'gold' | 'rustic' | 'sunda' | 'jawa' | 'bali' | 'palembang' | 'auto';
  className?: string;
  text?: string;
  isOpen?: boolean;
}

/**
 * Petunjuk Interaktif Gestur Usap / Geser ke Atas untuk membuka cover undangan
 */
export const CoverSwipeHint: React.FC<CoverSwipeHintProps> = ({
  variant = 'auto',
  className = '',
  text = 'Usap ke atas untuk membuka',
  isOpen = false,
}) => {
  if (isOpen) return null;

  let textColor = 'text-white/85';
  let iconColor = 'text-white/95';

  if (variant === 'light' || variant === 'bali') {
    textColor = 'text-black font-semibold';
    iconColor = 'text-black';
  } else if (variant === 'gold' || variant === 'jawa' || variant === 'sunda' || variant === 'palembang') {
    textColor = 'text-[#ffe082]/90';
    iconColor = 'text-[#f3d068]';
  } else if (variant === 'rustic') {
    textColor = 'text-[#5a6e5f]';
    iconColor = 'text-[#8C4E2D]';
  } else if (variant === 'dark') {
    textColor = 'text-stone-300';
    iconColor = 'text-amber-300';
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 mt-3 select-none pointer-events-none transition-all duration-300 ${className}`}
      data-testid="cover-swipe-hint"
    >
      {/* Subtle Drag Handle Pill Indicator */}
      <div className={`w-10 h-1 rounded-full opacity-40 mb-1 ${iconColor.replace('text-', 'bg-')} drop-shadow-xs`} />
      <span className={`material-symbols-outlined text-[20px] leading-none animate-swipe-bounce drop-shadow-sm ${iconColor}`}>
        keyboard_double_arrow_up
      </span>
      <span className={`text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase font-medium drop-shadow-xs ${textColor}`}>
        {text}
      </span>
    </div>
  );
};
