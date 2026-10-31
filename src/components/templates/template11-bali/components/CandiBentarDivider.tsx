import React from 'react';

interface CandiBentarDividerProps {
  className?: string;
  color?: string;
  subTitle?: string;
  compact?: boolean;
}

/**
 * CandiBentarDivider:
 * Ornamen pembatas arsitektur tradisional pura dan puri Bali:
 * Siluet sakral gerbang belah Candi Bentar / Kori Agung serta ornamen matahari Surya Majapahit / Karang Bhoma.
 * Didesain 100% simetris kiri-kanan (sumbu senter X=50).
 */
export const CandiBentarDivider: React.FC<CandiBentarDividerProps> = ({
  className = '',
  color = '#D4AF37',
  subTitle,
  compact = false,
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-3.5 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center gap-3 w-full max-w-[280px] mx-auto">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-[#D4AF37]/80" />

        {/* SVG Crest: Candi Bentar (Gerbang Sakral) & Bunga Kamboja Pusat */}
        <div
          className={
            compact
              ? 'w-10 h-8 shrink-0 flex items-center justify-center'
              : 'w-14 h-11 shrink-0 flex items-center justify-center'
          }
        >
          <svg
            viewBox="0 0 100 80"
            fill="none"
            stroke="currentColor"
            className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
          >
            {/* Left Gate Wing (Sayap Kiri Candi Bentar) */}
            <path
              d="M47 8 L32 8 L32 20 L24 20 L24 36 L16 36 L16 56 L10 56 L10 74 L47 74 Z"
              fill="#411710"
              fillOpacity="0.85"
              stroke={color}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Left Wing Architectural Ridges */}
            <line x1="32" y1="20" x2="47" y2="20" stroke={color} strokeWidth="0.8" />
            <line x1="24" y1="36" x2="47" y2="36" stroke={color} strokeWidth="0.8" />
            <line x1="16" y1="56" x2="47" y2="56" stroke={color} strokeWidth="0.8" />

            {/* Right Gate Wing (Sayap Kanan Candi Bentar - Sumbu Simetris X=50) */}
            <path
              d="M53 8 L68 8 L68 20 L76 20 L76 36 L84 36 L84 56 L90 56 L90 74 L53 74 Z"
              fill="#411710"
              fillOpacity="0.85"
              stroke={color}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Right Wing Architectural Ridges */}
            <line x1="68" y1="20" x2="53" y2="20" stroke={color} strokeWidth="0.8" />
            <line x1="76" y1="36" x2="53" y2="36" stroke={color} strokeWidth="0.8" />
            <line x1="84" y1="56" x2="53" y2="56" stroke={color} strokeWidth="0.8" />

            {/* Center Sacred Gap Portal Space (X=47 to X=53) */}
            {/* Central Sacred Lotus / Padmasana Bud at Center (X=50) */}
            <circle cx="50" cy="40" r="3.5" fill={color} />
            <path
              d="M50 28 C47 34 47 38 50 42 C53 38 53 34 50 28 Z"
              fill={color}
              stroke="#FFF9EF"
              strokeWidth="0.5"
            />
            <circle cx="50" cy="22" r="1.5" fill={color} />

            {/* Stepped Pedestal Base */}
            <rect x="6" y="74" width="88" height="3" fill={color} rx="1" />
          </svg>
        </div>

        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#D4AF37]/40 to-[#D4AF37]/80" />
      </div>

      {subTitle && (
        <span className="font-label-sm text-[#735C00] uppercase tracking-[0.25em] font-medium text-[10px] mt-1.5 select-none">
          {subTitle}
        </span>
      )}
    </div>
  );
};

