import React from 'react';

interface BugisTimpaLajaDividerProps {
  className?: string;
  color?: string;
  subTitle?: string;
  compact?: boolean;
}

/**
 * BugisTimpaLajaDivider:
 * Ornamen pembatas arsitektur tradisional Bugis:
 * 5-Tier Timpa Laja (bubungan atap bangsawan tertinggi Saoraja) dan lambang mahkota Saloko Pinang Goyang.
 */
export const BugisTimpaLajaDivider: React.FC<BugisTimpaLajaDividerProps> = ({
  className = '',
  color = '#F2CA50',
  subTitle,
  compact = false,
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-3 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center gap-2.5 w-full max-w-[280px] mx-auto">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2CA50]/40 to-[#F2CA50]/80" />
        
        {/* SVG Crest: 5-Tier Timpa Laja Saoraja & Saloko (Simetris Presisi) */}
        <div className={compact ? 'w-10 h-8 shrink-0 flex items-center justify-center' : 'w-14 h-11 shrink-0 flex items-center justify-center'}>
          <svg
            viewBox="0 0 100 80"
            fill="none"
            stroke="currentColor"
            className="w-full h-full drop-shadow-[0_2px_10px_rgba(242,202,80,0.4)]"
          >
            {/* 5-Tier Timpa Laja Gable Silhouette - 100% Simetris Kiri & Kanan */}
            <path
              d="M50 4 L86 26 L76 26 L90 41 L80 41 L94 56 L6 56 L20 41 L10 41 L24 26 L14 26 Z"
              fill="#052519"
              fillOpacity="0.85"
              stroke={color}
              strokeWidth="1.5"
            />
            {/* Ornate Saloko Crown Filigree */}
            <circle cx="50" cy="22" fill={color} r="3" />
            <path d="M42 28 C45 23, 55 23, 58 28" stroke={color} strokeWidth="1.2" />
            <path d="M36 34 C42 30, 58 30, 64 34" stroke={color} strokeWidth="1.2" />
            <circle cx="36" cy="34" fill={color} r="1.5" />
            <circle cx="64" cy="34" fill={color} r="1.5" />
            <circle cx="50" cy="14" fill={color} r="2" />
            {/* Shimmering Diamond Motif */}
            <polygon fill={color} opacity="0.9" points="50,60 55,67 50,74 45,67" />
            <line
              stroke={color}
              strokeDasharray="2,2"
              strokeWidth="1"
              x1="26"
              x2="74"
              y1="67"
              y2="67"
            />
          </svg>
        </div>

        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2CA50]/40 to-[#F2CA50]/80" />
      </div>

      {subTitle && (
        <span className="font-sans text-[10px] tracking-[0.25em] text-[#F2CA50] uppercase mt-1 text-center">
          {subTitle}
        </span>
      )}
    </div>
  );
};

