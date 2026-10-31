import React from 'react';

interface PalembangSongketWatermarkProps {
  className?: string;
  color?: string;
  opacityClass?: string;
  showPucukBorders?: boolean;
}

/**
 * PalembangSongketWatermark (Layer 1):
 * Pernak-pernik latar belakang tekstur Songket Lepus Palembang benang emas.
 * Memadukan motif geometris Bunga Intan Melati dan ornamen Pucuk Rebung yang sakral dan mewah.
 */
export const PalembangSongketWatermark: React.FC<PalembangSongketWatermarkProps> = ({
  className = 'absolute inset-0 pointer-events-none select-none z-0 overflow-hidden',
  color = '#FFD57A',
  opacityClass = 'opacity-[0.05]',
  showPucukBorders = false,
}) => {
  const patternId = React.useId();
  const pucukPatternId = React.useId();

  return (
    <div className={className} aria-hidden="true">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Main Grid: Bunga Intan & Songket Lepus Weave */}
          <pattern
            id={patternId}
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer Diamond Weave */}
            <path
              d="M28,0 L56,28 L28,56 L0,28 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Concentric Inner Diamond */}
            <path
              d="M28,8 L48,28 L28,48 L8,28 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />

            {/* Songket Central Bunga Melati / Intan */}
            <circle cx="28" cy="28" r="3" fill={color} fillOpacity="0.6" />
            <circle cx="28" cy="28" r="1.2" fill="#FDF9F2" />

            {/* 4 Petals of Bunga Cempako / Melati */}
            <path
              d="M28,18 C26,22 26,24 28,28 C30,24 30,22 28,18 Z"
              fill={color}
              fillOpacity="0.45"
            />
            <path
              d="M28,38 C26,34 26,32 28,28 C30,32 30,34 28,38 Z"
              fill={color}
              fillOpacity="0.45"
            />
            <path
              d="M18,28 C22,26 24,26 28,28 C24,30 22,30 18,28 Z"
              fill={color}
              fillOpacity="0.45"
            />
            <path
              d="M38,28 C34,26 32,26 28,28 C32,30 34,30 38,28 Z"
              fill={color}
              fillOpacity="0.45"
            />

            {/* 4 Corner Pucuk Rebung Minis */}
            <path
              d="M0,0 L8,0 L0,8 Z M56,0 L48,0 L56,8 Z M0,56 L8,56 L0,48 Z M56,56 L48,56 L56,48 Z"
              fill={color}
              fillOpacity="0.35"
            />

            {/* Connecting Gold Studs */}
            <circle cx="28" cy="0" r="1" fill={color} />
            <circle cx="56" cy="28" r="1" fill={color} />
            <circle cx="28" cy="56" r="1" fill={color} />
            <circle cx="0" cy="28" r="1" fill={color} />
          </pattern>

          {/* Vertical Pucuk Rebung Border Strip Pattern */}
          {showPucukBorders && (
            <pattern
              id={pucukPatternId}
              width="12"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 24 L6 0 L12 24 Z M6 8 L6 20"
                fill="none"
                stroke={color}
                strokeWidth="0.8"
              />
            </pattern>
          )}
        </defs>

        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          className={opacityClass}
        />

        {showPucukBorders && (
          <>
            <rect
              x="2"
              y="0"
              width="12"
              height="100%"
              fill={`url(#${pucukPatternId})`}
              className="opacity-25"
            />
            <rect
              x="calc(100% - 14px)"
              y="0"
              width="12"
              height="100%"
              fill={`url(#${pucukPatternId})`}
              className="opacity-25"
            />
          </>
        )}
      </svg>
    </div>
  );
};

