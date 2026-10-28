import React from 'react';

interface TornPaperDividerProps {
  direction?: 'maroon-to-ivory' | 'ivory-to-maroon';
  className?: string;
  fillColor?: string;
}

export const TornPaperDivider: React.FC<TornPaperDividerProps> = ({
  direction = 'maroon-to-ivory',
  className = '',
  fillColor,
}) => {
  if (direction === 'maroon-to-ivory') {
    // Top is maroon, bottom is ivory (#FCF9F3 / surface-container-low)
    return (
      <div
        className={`w-full h-6 -mt-1 relative z-20 overflow-hidden leading-none ${className}`}
        style={{ color: fillColor || '#FCF9F3' }}
      >
        <svg
          className="w-full h-full fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 430 24"
        >
          <path d="M0,0 C30,18 70,8 110,20 C150,24 190,4 230,16 C270,22 310,6 350,18 C390,22 410,10 430,16 L430,24 L0,24 Z" />
        </svg>
      </div>
    );
  }

  // Top is ivory, bottom is maroon (#5E1914 / primary-container)
  return (
    <div
      className={`w-full h-6 -mt-1 relative z-20 overflow-hidden leading-none ${className}`}
      style={{ color: fillColor || '#5E1914' }}
    >
      <svg
        className="w-full h-full fill-current"
        preserveAspectRatio="none"
        viewBox="0 0 430 24"
      >
        <path d="M0,0 C50,20 90,4 140,16 C180,24 220,10 260,22 C300,6 340,18 380,8 C400,14 420,10 430,22 L430,24 L0,24 Z" />
      </svg>
    </div>
  );
};
