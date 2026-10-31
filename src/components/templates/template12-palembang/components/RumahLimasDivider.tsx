import React from 'react';

interface RumahLimasDividerProps {
  className?: string;
  color?: string;
  subTitle?: string;
  compact?: boolean;
}

/**
 * RumahLimasDivider (Layer 4):
 * Ornamen pembatas arsitektur tradisional Kesultanan Palembang Darussalam:
 * Siluet atap bertingkat Rumah Limas Palembang bermahkota Simbar Tanduk Kambing,
 * dipadukan dengan medallion mahkota Aesan Gede & kembang cempako berhias prada emas.
 * Didesain 100% simetris kiri-kanan (sumbu senter X=40).
 */
export const RumahLimasDivider: React.FC<RumahLimasDividerProps> = ({
  className = '',
  color = '#FFD57A',
  subTitle,
  compact = false,
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-3 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center gap-3 w-full max-w-[280px] mx-auto">
        {/* Left Golden Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FFD57A]/40 to-[#FFD57A]/80" />

        {/* SVG Crest: Rumah Limas Palembang & Mahkota Aesan Gede */}
        <div
          className={
            compact
              ? 'w-10 h-8 shrink-0 flex items-center justify-center'
              : 'w-16 h-12 shrink-0 flex items-center justify-center'
          }
        >
          <svg
            viewBox="0 0 80 64"
            fill="none"
            className="w-full h-full text-[#FFD57A] drop-shadow-[0_2px_8px_rgba(255,213,122,0.35)]"
          >
            {/* Rumah Limas Tiered Roof Silhouette */}
            <path
              d="M40 4L12 22H68L40 4Z"
              fill={color}
              fillOpacity="0.18"
              stroke={color}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M40 9L20 22H60L40 9Z"
              stroke={color}
              strokeWidth="0.9"
            />
            <path
              d="M12 22L8 34H72L68 22"
              stroke={color}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Golden Aesan Gede Crown Central Medallion */}
            <circle
              cx="40"
              cy="38"
              fill={color}
              fillOpacity="0.25"
              r="7"
              stroke={color}
              strokeWidth="1.2"
            />
            {/* Medallion 4-Point Star Blossom */}
            <path
              d="M40 32C41.5 35 44 36.5 47 38C44 39.5 41.5 41 40 44C38.5 41 36 39.5 33 38C36 36.5 38.5 35 40 32Z"
              fill={color}
            />

            {/* Trembling Cempako Floral Hairpins (Left & Right Symmetric) */}
            <path
              d="M26 30C23 27 21 21 23 18C25 21 27 24 28 29"
              stroke={color}
              strokeLinecap="round"
              strokeWidth="1"
            />
            <path
              d="M54 30C57 27 59 21 57 18C55 21 53 24 52 29"
              stroke={color}
              strokeLinecap="round"
              strokeWidth="1"
            />
            <circle cx="23" cy="18" fill={color} r="1.5" />
            <circle cx="57" cy="18" fill={color} r="1.5" />
            <circle cx="40" cy="4" fill={color} r="2" />

            {/* Filigree Base Scroll */}
            <path
              d="M16 46C24 43 32 45 40 47C48 45 56 43 64 46"
              stroke={color}
              strokeLinecap="round"
              strokeWidth="1.2"
            />
            <circle cx="40" cy="54" fill={color} r="1.5" />
          </svg>
        </div>

        {/* Right Golden Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#FFD57A]/40 to-[#FFD57A]/80" />
      </div>

      {subTitle && (
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#FFD57A] mt-1 text-center font-semibold">
          {subTitle}
        </span>
      )}
    </div>
  );
};

