import React from 'react';

interface TornPaperDividerProps {
  direction?: 'emerald-to-ivory' | 'ivory-to-emerald';
  className?: string;
  fillColor?: string;
}

/**
 * TornPaperDivider:
 * Pembatas tepi kertas sobek (Deckle Edge / Torn Paper Separator).
 * Menciptakan transisi anggun antara latar Deep Emerald (#00170E) dan Pearl Ivory (#F8F5EE).
 */
export const TornPaperDivider: React.FC<TornPaperDividerProps> = ({
  direction = 'emerald-to-ivory',
  className = '',
  fillColor,
}) => {
  if (direction === 'emerald-to-ivory') {
    // Bagian atas Deep Emerald, bagian bawah Pearl Ivory (#F8F5EE)
    return (
      <div
        className={`w-full h-7 -mt-1 relative z-20 overflow-hidden leading-none pointer-events-none select-none ${className}`}
        style={{ color: fillColor || '#F8F5EE' }}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full fill-current preserve-3d"
          preserveAspectRatio="none"
          viewBox="0 0 1200 40"
        >
          <path d="M0,0 C150,28 320,10 460,32 C620,12 790,36 940,16 C1060,34 1140,8 1200,28 L1200,40 L0,40 Z" />
        </svg>
      </div>
    );
  }

  // Bagian atas Pearl Ivory, bagian bawah Deep Emerald (#00170E / #00120A)
  return (
    <div
      className={`w-full h-7 -mt-1 relative z-20 overflow-hidden leading-none pointer-events-none select-none rotate-180 ${className}`}
      style={{ color: fillColor || '#F8F5EE' }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full fill-current preserve-3d"
        preserveAspectRatio="none"
        viewBox="0 0 1200 40"
      >
        <path d="M0,0 C180,24 350,6 490,30 C640,14 810,34 960,18 C1080,32 1160,10 1200,26 L1200,40 L0,40 Z" />
      </svg>
    </div>
  );
};

