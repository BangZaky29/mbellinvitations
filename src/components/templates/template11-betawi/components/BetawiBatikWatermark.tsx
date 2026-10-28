import React from 'react';

interface BetawiBatikWatermarkProps {
  className?: string;
  color?: string;
  opacityClass?: string;
}

/**
 * BetawiBatikWatermark:
 * Pernak-pernik latar belakang tekstur Batik Betawi Klasik (Motif Pucuk Rebung, Kembang Kelapa & Bunga Melati).
 * Menghasilkan kesan kain batik prada eksklusif pada latar belakang merah marun maupun gading.
 */
export const BetawiBatikWatermark: React.FC<BetawiBatikWatermarkProps> = ({
  className = 'absolute inset-0 pointer-events-none select-none z-0 overflow-hidden',
  color = '#FED65B',
  opacityClass = 'opacity-[0.04]',
}) => {
  const patternId = React.useId();

  return (
    <div className={className} aria-hidden="true">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Center Rosette (Bunga Melati Ronce Betawi) */}
            <circle cx="30" cy="30" r="3" fill={color} />
            <circle cx="30" cy="24" r="2.2" fill={color} />
            <circle cx="30" cy="36" r="2.2" fill={color} />
            <circle cx="24" cy="30" r="2.2" fill={color} />
            <circle cx="36" cy="30" r="2.2" fill={color} />

            {/* Corner Pucuk Rebung (Chevron Segitiga Tumpal Betawi) */}
            <path
              d="M0,0 L12,0 L6,10 Z M60,0 L48,0 L54,10 Z M0,60 L12,60 L6,50 Z M60,60 L48,60 L54,50 Z"
              fill={color}
            />

            {/* Diagonal Geometrics (Tapak Dara & Kisi-kisi Rumah Kebaya) */}
            <path
              d="M30,5 L34,14 L44,14 L36,20 L39,29 L30,23 L21,29 L24,20 L16,14 L26,14 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.75"
            />
            <path
              d="M30,55 L34,46 L44,46 L36,40 L39,31 L30,37 L21,31 L24,40 L16,46 L26,46 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.75"
            />

            {/* Subtle Dotted Diamonds (Kembang Goyang) */}
            <circle cx="10" cy="30" r="1.2" fill={color} />
            <circle cx="50" cy="30" r="1.2" fill={color} />
            <circle cx="30" cy="10" r="1.2" fill={color} />
            <circle cx="30" cy="50" r="1.2" fill={color} />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          className={opacityClass}
        />
      </svg>
    </div>
  );
};
