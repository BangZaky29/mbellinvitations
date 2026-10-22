import React from 'react';

/**
 * 4-Pointed Gold Star Filigree for Arch Corners
 */
export const MinangCornerStar: React.FC<{ className?: string }> = ({
  className = 'w-8 h-8 text-gold opacity-80',
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

/**
 * Elegant Horizontal Divider with Gold Diamond Glyph
 */
export const MinangDivider: React.FC<{ className?: string; color?: string }> = ({
  className = 'my-3',
  color = 'gold',
}) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <div className={`w-8 h-[1px] bg-${color}/50`} />
    <span className={`text-${color} text-xs`}>❖</span>
    <div className={`w-8 h-[1px] bg-${color}/50`} />
  </div>
);

/**
 * Torn Paper Edge Transition between Burgundy & Cream Sections
 */
export const TornPaperDivider: React.FC<{
  invert?: boolean;
  colorClass?: string;
  fillColor?: string;
}> = ({
  invert = false,
  colorClass = 'text-[#FAF6EE]',
  fillColor = '#FAF6EE',
}) => (
  <div
    aria-hidden="true"
    className={`w-full overflow-hidden leading-none z-20 relative pointer-events-none select-none ${
      invert ? '-mt-1 -mb-1 rotate-180' : '-mb-1'
    }`}
  >
    <svg
      className={`w-full h-7 sm:h-8 ${colorClass} block`}
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
    >
      <path
        d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1050,75 C1150,110 1190,40 1200,50 L1200,120 L0,120 Z"
        fill={fillColor}
      />
    </svg>
  </div>
);
