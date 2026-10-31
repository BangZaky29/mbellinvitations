import React from 'react';

interface BugisCornerOrnamentProps {
  className?: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * BugisCornerOrnament:
 * Ornamen sudut ukiran khas Saoraja (Rumah Adat Bangsawan Bugis-Makassar).
 * Disematkan pada sudut kartu-kartu utama untuk menghadirkan nuansa istana kerajaan.
 */
export const BugisCornerOrnament: React.FC<BugisCornerOrnamentProps> = ({
  className = 'w-9 h-9',
  color = '#F2CA50',
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
        {/* L-Shaped Corner Frame with Royal Arch */}
        <path
          d="M2,2 L36,2 C28,6 20,12 14,18 C8,24 2,32 2,42 L2,2 Z"
          fill={color}
          fillOpacity="0.12"
        />
        <path
          d="M2,2 L42,2 M2,2 L2,42"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bugis Gable Eaves Chevron Segments */}
        <path
          d="M4,4 L12,4 L8,8 Z M16,4 L24,4 L20,8 Z M28,4 L36,4 L32,8 Z"
          fill={color}
          fillOpacity="0.8"
        />
        <path
          d="M4,12 L4,20 L8,16 Z M4,24 L4,32 L8,28 Z M4,36 L4,44 L8,40 Z"
          fill={color}
          fillOpacity="0.8"
        />

        {/* Saloko Pinang Floral Curve */}
        <path
          d="M6,6 C16,12 24,20 28,32 C30,38 34,44 40,46"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2.5" fill={color} />
        <circle cx="28" cy="18" r="1.8" fill={color} />
        <circle cx="18" cy="28" r="1.8" fill={color} />

        {/* Diamond Center Pinang Accent */}
        <polygon points="25,25 27.5,22 30,25 27.5,28" fill={color} />
      </svg>
    </div>
  );
};

