import React from 'react';

interface IslamicMihrabArchProps {
  imageSrc: string;
  altText?: string;
  className?: string;
}

export const IslamicMihrabArch: React.FC<IslamicMihrabArchProps> = ({
  imageSrc,
  altText = 'Foto Pasangan',
  className = '',
}) => {
  const clipId = 'islamic-mihrab-clip';
  const outerGradId = 'islamic-gold-outer-grad';
  const innerGradId = 'islamic-gold-inner-grad';
  const shineGradId = 'islamic-gold-shine';

  // Pointed Mihrab Arch path definition (viewBox 0 0 240 320)
  // Base: (25, 300) -> Left pillar: (25, 145) -> shoulder: (88, 56) -> lancet peak: (120, 22)
  const archInnerPath =
    'M 26 300 L 26 148 C 26 95, 68 56, 102 46 C 112 42, 117 32, 120 22 C 123 32, 128 42, 138 46 C 172 56, 214 95, 214 148 L 214 300 Z';

  const archMouldingPath =
    'M 20 300 L 20 146 C 20 90, 64 50, 100 39 C 112 34, 116 26, 120 16 C 124 26, 128 34, 140 39 C 176 50, 220 90, 220 146 L 220 300 Z';

  const outerFramePath =
    'M 14 304 L 14 142 C 14 82, 60 42, 98 31 C 111 26, 116 16, 120 8 C 124 16, 129 26, 142 31 C 180 42, 226 82, 226 142 L 226 304 Z';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* SVG Container rendering the 3D Islamic Mihrab Arch */}
      <svg
        viewBox="0 0 240 325"
        className="w-full h-auto max-w-[225px] sm:max-w-[255px] drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip path for the photo with explicit path */}
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={archInnerPath} />
          </clipPath>

          {/* Master 5-Stop Gold Gradient */}
          <linearGradient id={outerGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF8D6" />
            <stop offset="75%" stopColor="#9B7528" />
            <stop offset="100%" stopColor="#E5C158" />
          </linearGradient>

          {/* Vertical Shimmer Gold Gradient */}
          <linearGradient id={innerGradId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#9B7528" />
            <stop offset="35%" stopColor="#F5E296" />
            <stop offset="65%" stopColor="#FFFBEA" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          {/* Pillar Cylinder Gold Gradient */}
          <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6720" />
            <stop offset="30%" stopColor="#F5E296" />
            <stop offset="60%" stopColor="#FFFDF2" />
            <stop offset="85%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#6D4F12" />
          </linearGradient>

          {/* Subtle Photo Overlay Gradient */}
          <linearGradient id={shineGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="75%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(27, 6, 9, 0.45)" />
          </linearGradient>
        </defs>

        {/* 1. Base Dark Ground Fill */}
        <path d={outerFramePath} fill="#24070B" />

        {/* 2. Photo Layer Strictly Clipped to Mihrab Arch */}
        <g clipPath={`url(#${clipId})`} style={{ clipPath: `url(#${clipId})` }}>
          <image
            href={imageSrc}
            x="20"
            y="15"
            width="200"
            height="290"
            preserveAspectRatio="xMidYMid slice"
            style={{ clipPath: `url(#${clipId})` }}
            aria-label={altText}
          >
            <title>{altText}</title>
          </image>

          {/* Soft Bottom Vignette on Photo */}
          <rect
            x="20"
            y="15"
            width="200"
            height="290"
            fill={`url(#${shineGradId})`}
            pointerEvents="none"
          />
        </g>

        {/* 3. Outer Arch Golden Moulding Line */}
        <path
          d={outerFramePath}
          fill="none"
          stroke={`url(#${outerGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Middle Sculpted Gold Arch (Heavy Relief) */}
        <path
          d={archMouldingPath}
          fill="none"
          stroke={`url(#${outerGradId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Inner Precise Bevel Frame */}
        <path
          d={archInnerPath}
          fill="none"
          stroke={`url(#${innerGradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Left Pillar (Tiang Kolom Kiri Arsitektur Islami) */}
        <rect
          x="14"
          y="142"
          width="11"
          height="158"
          fill="url(#pillarGrad)"
          stroke={`url(#${innerGradId})`}
          strokeWidth="0.8"
          rx="1"
        />
        {/* Kepala Tiang Kiri (Capital) */}
        <polygon
          points="11,142 28,142 25,134 14,134"
          fill={`url(#${outerGradId})`}
          stroke="#52390A"
          strokeWidth="0.5"
        />
        {/* Kaki Tiang Kiri (Plinth) */}
        <polygon
          points="12,300 27,300 29,306 10,306"
          fill={`url(#${outerGradId})`}
          stroke="#52390A"
          strokeWidth="0.5"
        />

        {/* 7. Right Pillar (Tiang Kolom Kanan Arsitektur Islami) */}
        <rect
          x="215"
          y="142"
          width="11"
          height="158"
          fill="url(#pillarGrad)"
          stroke={`url(#${innerGradId})`}
          strokeWidth="0.8"
          rx="1"
        />
        {/* Kepala Tiang Kanan (Capital) */}
        <polygon
          points="212,142 229,142 226,134 215,134"
          fill={`url(#${outerGradId})`}
          stroke="#52390A"
          strokeWidth="0.5"
        />
        {/* Kaki Tiang Kanan (Plinth) */}
        <polygon
          points="213,300 228,300 230,306 211,306"
          fill={`url(#${outerGradId})`}
          stroke="#52390A"
          strokeWidth="0.5"
        />

        {/* 8. Top Ornamental Spire / Finial (Lancip Ornamen Puncak Kubah Mihrab) */}
        <g transform="translate(120, 10)">
          {/* Spire Spike */}
          <polygon
            points="0,-8 2.5,0 0,6 -2.5,0"
            fill={`url(#${outerGradId})`}
            stroke="#6D4F12"
            strokeWidth="0.5"
          />
          {/* Golden Orb Beads */}
          <circle cx="0" cy="1" r="2.2" fill="#FFF8D6" stroke="#9B7528" strokeWidth="0.6" />
          <circle cx="0" cy="7" r="1.5" fill="#D4AF37" />
        </g>

        {/* 9. Golden Base Threshold Line */}
        <line
          x1="8"
          y1="305"
          x2="232"
          y2="305"
          stroke={`url(#${outerGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default IslamicMihrabArch;
