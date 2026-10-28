import React from 'react';

interface BetawiCornerFloralProps {
  className?: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * BetawiCornerFloral:
 * Ornamen sudut ukiran khas Rumah Kebaya & Langkan Betawi.
 * Mempercantik kartu dan section dengan sentuhan ukiran tradisional kayu prada emas.
 */
export const BetawiCornerFloral: React.FC<BetawiCornerFloralProps> = ({
  className = 'w-10 h-10',
  color = '#FED65B',
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
        {/* Outer Corner Frame (Gigi Balang Angle) */}
        <path
          d="M2,2 L32,2 C24,6 18,12 12,18 C6,24 2,32 2,42 L2,2 Z"
          fill={color}
          fillOpacity="0.15"
        />
        <path
          d="M2,2 L40,2 M2,2 L2,40"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Traditional Betawi Sawtooth Triangular Eaves */}
        <polygon points="4,4 10,4 7,8" fill={color} />
        <polygon points="12,4 18,4 15,8" fill={color} />
        <polygon points="20,4 26,4 23,8" fill={color} />
        <polygon points="4,10 4,16 8,13" fill={color} />
        <polygon points="4,18 4,24 8,21" fill={color} />
        <polygon points="4,26 4,32 8,29" fill={color} />

        {/* Flowing Melati Bud Swirl (Sulur Ukiran Betawi) */}
        <path
          d="M6,6 C16,10 24,18 28,30 C30,36 34,44 42,46"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2.5" fill={color} />
        <circle cx="28" cy="18" r="1.8" fill={color} />
        <circle cx="18" cy="28" r="1.8" fill={color} />

        {/* Small Golden Star Spark */}
        <path
          d="M25,25 L26.5,23.5 L28,25 L26.5,26.5 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};
