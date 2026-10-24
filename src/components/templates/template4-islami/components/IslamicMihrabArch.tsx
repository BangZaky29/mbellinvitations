import React from 'react';

interface IslamicMihrabArchProps {
  imageSrc: string;
  altText?: string;
  className?: string;
}

export const IslamicMihrabArch: React.FC<IslamicMihrabArchProps> = ({
  imageSrc,
  altText = 'Couple Photo',
  className = '',
}) => {
  // Unique IDs for SVG gradients and clip paths to prevent conflicts
  const clipId = 'islamic-mihrab-clip';
  const outerGradId = 'islamic-gold-outer-grad';
  const innerGradId = 'islamic-gold-inner-grad';
  const shadowId = 'islamic-arch-shadow';

  // Ogee Mihrab Arch path definition (viewBox 0 0 240 310)
  // Left side: (20, 295) -> (20, 140) -> shoulder curve to (95, 52) -> inflect up to peak (120, 24)
  // Right side: (120, 24) -> (145, 52) -> (220, 140) -> (220, 295) -> close
  const archPath =
    'M 20 295 L 20 140 C 20 90, 60 58, 95 50 C 108 47, 116 36, 120 24 C 124 36, 132 47, 145 50 C 180 58, 220 90, 220 140 L 220 295 Z';

  // Outer framing decorative path with slight offset for architectural relief moulding
  const outerFramePath =
    'M 14 298 L 14 138 C 14 85, 56 52, 93 44 C 107 41, 115 28, 120 16 C 125 28, 133 41, 147 44 C 184 52, 226 85, 226 138 L 226 298 Z';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* SVG Container rendering the 3D Islamic Mihrab Arch */}
      <svg
        viewBox="0 0 240 315"
        className="w-full h-auto max-w-[215px] sm:max-w-[245px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip path for the photo */}
          <clipPath id={clipId}>
            <path d={archPath} />
          </clipPath>

          {/* Outer Multi-Stop Gold Foil Gradient */}
          <linearGradient id={outerGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF0BE" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF3C4" />
            <stop offset="75%" stopColor="#AA8239" />
            <stop offset="100%" stopColor="#E5C158" />
          </linearGradient>

          {/* Inner Sharp Bevel Gold Gradient */}
          <linearGradient id={innerGradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AA8239" />
            <stop offset="30%" stopColor="#F5E296" />
            <stop offset="60%" stopColor="#FFFBEA" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          {/* Subtle Inner Vignette Overlay on the Photo */}
          <linearGradient id="goldVignetteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="65%" stopColor="transparent" />
            <stop offset="100%" stopColor="#1B0609" />
          </linearGradient>

          {/* Arch Drop Shadow Filter */}
          <filter id={shadowId} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 1. Outer Sculpted 3D Relief Gold Moulding */}
        <path
          d={outerFramePath}
          fill="none"
          stroke={`url(#${outerGradId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-95"
        />

        {/* 2. Middle Dark Contour Crevice for Depth */}
        <path
          d={outerFramePath}
          fill="none"
          stroke="#1B0609"
          strokeWidth="2.5"
          className="opacity-75"
        />

        {/* 3. Base Backdrop (prevents transparent leaks) */}
        <path d={archPath} fill="#2E0A10" />

        {/* 4. Inside Image clipped into Mihrab shape */}
        <image
          href={imageSrc}
          clipPath={`url(#${clipId})`}
          x="15"
          y="15"
          width="210"
          height="285"
          preserveAspectRatio="xMidYMin slice"
          aria-label={altText}
        >
          <title>{altText}</title>
        </image>

        {/* 5. Subtle Inner Vignette Overlay on the Photo */}
        <path
          d={archPath}
          fill="url(#goldVignetteGrad)"
          clipPath={`url(#${clipId})`}
          className="opacity-30 pointer-events-none"
        />

        {/* 6. Inner Bevel Gold Border framing the photo closely */}
        <path
          d={archPath}
          fill="none"
          stroke={`url(#${innerGradId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 7. Delicate Golden Base Pillar Line */}
        <line
          x1="16"
          y1="295"
          x2="224"
          y2="295"
          stroke={`url(#${outerGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default IslamicMihrabArch;
