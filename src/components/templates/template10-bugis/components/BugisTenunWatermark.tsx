import React from 'react';

interface BugisTenunWatermarkProps {
  className?: string;
  color?: string;
  opacityClass?: string;
}

/**
 * BugisTenunWatermark:
 * Pernak-pernik latar belakang tekstur Tenun Sutera Sa'be Bugis Klasik (Corak Lipa' Sabbe, Diamond Grid & Balo Renny).
 * Menghadirkan kesan tenunan benang emas prada yang mewah pada latar Deep Emerald maupun Pearl Ivory.
 */
export const BugisTenunWatermark: React.FC<BugisTenunWatermarkProps> = ({
  className = 'absolute inset-0 pointer-events-none select-none z-0 overflow-hidden',
  color = '#F2CA50',
  opacityClass = 'opacity-[0.045]',
}) => {
  const patternId = React.useId();

  return (
    <div className={className} aria-hidden="true">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            {/* Tenun Sa'be Outer Diamond Grid (Corak Kotak Lipa' Sabbe) */}
            <path
              d="M28,0 L56,28 L28,56 L0,28 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Inner Concentric Diamond */}
            <path
              d="M28,8 L48,28 L28,48 L8,28 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            {/* Center Sacred Diamond (Saloko Pinang Jewel) */}
            <polygon
              points="28,21 35,28 28,35 21,28"
              fill={color}
              fillOpacity="0.6"
            />
            {/* Corner Traditional Bugis Triangle Eaves (Timpa Laja Silhouette corner accents) */}
            <path
              d="M0,0 L10,0 L0,10 Z M56,0 L46,0 L56,10 Z M0,56 L10,56 L0,46 Z M56,56 L46,56 L56,46 Z"
              fill={color}
              fillOpacity="0.4"
            />
            {/* Subtle Star Points */}
            <circle cx="28" cy="0" r="1.2" fill={color} />
            <circle cx="56" cy="28" r="1.2" fill={color} />
            <circle cx="28" cy="56" r="1.2" fill={color} />
            <circle cx="0" cy="28" r="1.2" fill={color} />
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

