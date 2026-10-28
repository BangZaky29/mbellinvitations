import React from 'react';

export const GigiBalangVerticalBorder: React.FC = () => {
  return (
    <>
      {/* Left Sawtooth Border (Gigi Balang Hairline) */}
      <div className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none opacity-30 z-10 flex flex-col">
        <svg
          className="w-full h-full text-[#FED65B] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 12 240"
        >
          <pattern
            height="12"
            id="sawtooth-vertical-left"
            patternUnits="userSpaceOnUse"
            width="12"
          >
            <polygon fill="currentColor" points="0,0 12,6 0,12" />
          </pattern>
          <rect fill="url(#sawtooth-vertical-left)" height="100%" width="12" />
        </svg>
      </div>

      {/* Right Sawtooth Border (Gigi Balang Hairline) */}
      <div className="absolute right-0 top-0 bottom-0 w-3 pointer-events-none opacity-30 z-10 flex flex-col">
        <svg
          className="w-full h-full text-[#FED65B] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 12 240"
        >
          <pattern
            height="12"
            id="sawtooth-vertical-right"
            patternUnits="userSpaceOnUse"
            width="12"
          >
            <polygon fill="currentColor" points="12,0 0,6 12,12" />
          </pattern>
          <rect fill="url(#sawtooth-vertical-right)" height="100%" width="12" />
        </svg>
      </div>
    </>
  );
};

export const GigiBalangHorizontalBorder: React.FC<{
  className?: string;
  color?: string;
  inverted?: boolean;
}> = ({ className = 'w-full h-[6px]', color = '#FED65B', inverted = false }) => {
  const patternId = React.useId();
  return (
    <div className={`overflow-hidden leading-none flex ${className}`}>
      <svg
        className="w-full h-full fill-current"
        style={{ color }}
        preserveAspectRatio="none"
        viewBox="0 0 120 6"
      >
        <pattern
          height="6"
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="12"
        >
          <polygon
            fill="currentColor"
            points={inverted ? '0,6 6,0 12,6' : '0,0 6,6 12,0'}
          />
        </pattern>
        <rect fill={`url(#${patternId})`} height="6" width="100%" />
      </svg>
    </div>
  );
};

/**
 * BetawiGigiBalangDivider:
 * Pembatas section mewah dengan motif ukiran kayu lisplang Gigi Balang & Roset Ronce Melati di tengah.
 */
export const BetawiGigiBalangDivider: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = 'w-full my-4', color = '#FED65B' }) => {
  const patternId = React.useId();

  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center select-none pointer-events-none ${className}`}
    >
      <div className="flex items-center justify-center w-full max-w-[280px] gap-2">
        {/* Left Eaves */}
        <div className="flex-1 h-[8px] overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 8">
            <defs>
              <pattern id={`${patternId}-l`} width="12" height="8" patternUnits="userSpaceOnUse">
                <polygon points="0,0 12,0 6,6" fill={color} opacity="0.8" />
                <circle cx="6" cy="7.2" r="0.8" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="8" fill={`url(#${patternId}-l)`} />
          </svg>
        </div>

        {/* Center Melati Medallion */}
        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#FED65B]/40 bg-[#410403] shrink-0 text-[#FED65B] shadow-sm">
          <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
            <circle cx="10" cy="10" r="2.2" fill={color} />
            <circle cx="10" cy="5.5" r="1.6" fill={color} opacity="0.85" />
            <circle cx="10" cy="14.5" r="1.6" fill={color} opacity="0.85" />
            <circle cx="5.5" cy="10" r="1.6" fill={color} opacity="0.85" />
            <circle cx="14.5" cy="10" r="1.6" fill={color} opacity="0.85" />
            <polygon points="10,2 10.8,4.5 10,4 9.2,4.5" fill={color} />
            <polygon points="10,18 10.8,15.5 10,16 9.2,15.5" fill={color} />
            <polygon points="2,10 4.5,10.8 4,10 4.5,9.2" fill={color} />
            <polygon points="18,10 15.5,10.8 16,10 15.5,9.2" fill={color} />
          </svg>
        </div>

        {/* Right Eaves */}
        <div className="flex-1 h-[8px] overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 8">
            <defs>
              <pattern id={`${patternId}-r`} width="12" height="8" patternUnits="userSpaceOnUse">
                <polygon points="0,0 12,0 6,6" fill={color} opacity="0.8" />
                <circle cx="6" cy="7.2" r="0.8" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="8" fill={`url(#${patternId}-r)`} />
          </svg>
        </div>
      </div>
    </div>
  );
};

