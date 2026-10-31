import React from 'react';

interface PalembangCornerFiligreeProps {
  className?: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * PalembangCornerFiligree (Layer 3):
 * Ornamen sudut ukiran Kayu Tembesu Lakuer Emas khas Rumah Limas & Pelaminan Palembang.
 * Bermotif sulur daun teratai dan kembang simbar berlapis warna prada emas.
 */
export const PalembangCornerFiligree: React.FC<PalembangCornerFiligreeProps> = ({
  className = 'w-9 h-9',
  color = '#FFD57A',
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
          d="M3,3 L36,3 C28,8 20,16 14,24 C8,32 3,36 3,36 L3,3 Z"
          fill={color}
          fillOpacity="0.08"
        />

        {/* L-Shaped Primary Outer Line */}
        <path
          d="M3,3 L42,3 M3,3 L3,42"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Secondary Inner Fine Line */}
        <path
          d="M7,7 L30,7 M7,7 L7,30"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="2,2"
          strokeLinecap="round"
        />

        {/* Corner Royal Simbar Finial (Palembang Roof Crest) */}
        <path
          d="M3,3 L10,10"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="3" cy="3" r="2.2" fill={color} />

        {/* Palembang Lotus Leaf Spiral Tendrils (Ukiran Daun Teratai) */}
        <path
          d="M10,10 C16,12 24,14 28,24 C24,22 18,20 10,10 Z"
          fill={color}
          fillOpacity="0.35"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M10,10 C12,16 14,24 24,28 C22,24 20,18 10,10 Z"
          fill={color}
          fillOpacity="0.35"
          stroke={color}
          strokeWidth="0.9"
        />

        {/* Curled Lotus Tendril Tip */}
        <path
          d="M28,24 C32,27 35,32 34,36 C32,38 29,36 30,33"
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M24,28 C27,32 32,35 36,34 C38,32 36,29 33,30"
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* Flower Studs */}
        <circle cx="16" cy="16" r="1.8" fill={color} />
        <circle cx="42" cy="3" r="1.3" fill={color} />
        <circle cx="3" cy="42" r="1.3" fill={color} />
      </svg>
    </div>
  );
};

