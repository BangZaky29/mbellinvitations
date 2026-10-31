import React from 'react';

interface BaliCornerFiligreeProps {
  className?: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * BaliCornerFiligree:
 * Ornamen sudut ukiran Patra Punggel khas pura dan puri agung Bali.
 * Disematkan pada sudut kartu-kartu utama untuk menghadirkan kemewahan tradisi keraton Bali.
 */
export const BaliCornerFiligree: React.FC<BaliCornerFiligreeProps> = ({
  className = 'w-9 h-9',
  color = '#D4AF37',
  position = 'top-left',
}) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scale-x-[-1]';
      case 'bottom-left':
        return 'scale-y-[-1]';
      case 'bottom-right':
        return 'scale-[-1]';
      default:
        return '';
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none z-10 ${getTransform()} ${className}`}
    >
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Soft Background Fill Arch */}
        <path
          d="M2,2 L38,2 C30,6 22,14 14,22 C6,30 2,38 2,38 L2,2 Z"
          fill={color}
          fillOpacity="0.08"
        />

        {/* L-Shaped Frame Lines */}
        <path
          d="M2,2 L44,2 M2,2 L2,44"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Secondary Inner Fine Line */}
        <path
          d="M6,6 L32,6 M6,6 L6,32"
          stroke={color}
          strokeWidth="0.75"
          strokeDasharray="2,2"
          strokeOpacity="0.7"
        />

        {/* Traditional Balinese Curled Tendril (Patra Punggel Scroll) */}
        <path
          d="M6,6 C14,14 20,20 28,18 C34,16 32,8 24,10 C18,12 18,22 26,26 C32,29 36,25 38,18"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Floral Bud Point (Kuncup Sari) */}
        <circle cx="12" cy="12" r="2.2" fill={color} />
        <circle cx="28" cy="18" r="1.5" fill={color} />

        {/* Outer Corner Accent Notch */}
        <path
          d="M0,0 L8,0 L0,8 Z"
          fill={color}
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
};

