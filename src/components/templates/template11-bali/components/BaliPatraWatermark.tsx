import React from 'react';

interface BaliPatraWatermarkProps {
  className?: string;
  color?: string;
  opacityClass?: string;
}

/**
 * BaliPatraWatermark:
 * Pernak-pernik latar belakang tekstur ukiran Patra Sari & Tenun Endek Prada Bali.
 * Menghadirkan kesan wastra tenun songket bali berbenang emas prada yang sakral dan mewah.
 */
export const BaliPatraWatermark: React.FC<BaliPatraWatermarkProps> = ({
  className = 'absolute inset-0 pointer-events-none select-none z-0 overflow-hidden',
  color = '#D4AF37',
  opacityClass = 'opacity-[0.045]',
}) => {
  const patternId = React.useId();

  return (
    <div className={className} aria-hidden="true">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer Diamond Motif (Tenun Endek Grid) */}
            <path
              d="M32,0 L64,32 L32,64 L0,32 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Concentric Dashed Inner Diamond */}
            <path
              d="M32,8 L56,32 L32,56 L8,32 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />

            {/* Sacred Lotus / Bunga Jepun Center Core */}
            <circle cx="32" cy="32" r="3.5" fill={color} fillOpacity="0.7" />
            <circle cx="32" cy="32" r="1.5" fill="#FFF9EF" />

            {/* 4 Sacred Petals (Patra Sari) */}
            <path
              d="M32,22 C30,26 30,28 32,32 C34,28 34,26 32,22 Z"
              fill={color}
              fillOpacity="0.5"
            />
            <path
              d="M32,42 C30,38 30,36 32,32 C34,36 34,38 32,42 Z"
              fill={color}
              fillOpacity="0.5"
            />
            <path
              d="M22,32 C26,30 28,30 32,32 C28,34 26,34 22,32 Z"
              fill={color}
              fillOpacity="0.5"
            />
            <path
              d="M42,32 C38,30 36,30 32,32 C36,34 38,34 42,32 Z"
              fill={color}
              fillOpacity="0.5"
            />

            {/* Diagonal Curled Tendrils (Patra Punggel filigree) */}
            <path
              d="M32,16 C36,18 38,20 40,24"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
            />
            <path
              d="M32,16 C28,18 26,20 24,24"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
            />
            <path
              d="M32,48 C36,46 38,44 40,40"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
            />
            <path
              d="M32,48 C28,46 26,44 24,40"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
            />

            {/* Corner Endek Weave Accents */}
            <path
              d="M0,0 L12,0 L0,12 Z M64,0 L52,0 L64,12 Z M0,64 L12,64 L0,52 Z M64,64 L52,64 L64,52 Z"
              fill={color}
              fillOpacity="0.35"
            />

            {/* Interconnecting Pinpoints */}
            <circle cx="32" cy="0" r="1.2" fill={color} />
            <circle cx="64" cy="32" r="1.2" fill={color} />
            <circle cx="32" cy="64" r="1.2" fill={color} />
            <circle cx="0" cy="32" r="1.2" fill={color} />
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

