import React from 'react';

interface TornPaperDividerProps {
  fillColor?: string;
  invert?: boolean;
  className?: string;
}

export const TornPaperDivider: React.FC<TornPaperDividerProps> = ({
  fillColor = '#EDE1D0',
  invert = false,
  className = '',
}) => {
  return (
    <div
      className={`w-full -mt-1 leading-none relative z-10 pointer-events-none ${
        invert ? 'rotate-180' : ''
      } ${className}`}
      style={{ color: fillColor }}
    >
      <svg
        className="w-full h-7 fill-current block"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
      >
        <path d="M0,0 C150,90 280,10 420,80 C560,110 700,20 840,75 C980,110 1100,30 1200,90 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
};
