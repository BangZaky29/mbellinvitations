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
