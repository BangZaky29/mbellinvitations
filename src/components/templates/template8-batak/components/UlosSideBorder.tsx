import React from 'react';

export const UlosSideBorder: React.FC = () => {
  return (
    <>
      {/* Left Continuous Batak Ulos & Gorga Edge Strip */}
      <div className="fixed top-0 bottom-0 left-0 w-3 z-30 pointer-events-none opacity-85 flex flex-col justify-between overflow-hidden bg-[#140D09]">
        <svg
          className="w-3 h-full shrink-0 text-[#C8A253]"
          fill="currentColor"
          preserveAspectRatio="none"
          viewBox="0 0 12 400"
        >
          <pattern id="ulos-edge-left" patternUnits="userSpaceOnUse" width="12" height="40">
            <rect width="12" height="40" fill="#140D09" />
            <path d="M0,0 L6,10 L12,0 L12,5 L6,15 L0,5 Z" fill="#9E3B2B" />
            <path d="M0,15 L6,25 L12,15 L12,20 L6,30 L0,20 Z" fill="#C8A253" />
            <path d="M0,30 L6,40 L12,30 L12,35 L6,45 L0,35 Z" fill="#661D24" />
            <circle cx="6" cy="10" r="1.5" fill="#C8A253" />
            <circle cx="6" cy="25" r="1.5" fill="#EDE1D0" />
          </pattern>
          <rect width="12" height="100%" fill="url(#ulos-edge-left)" />
        </svg>
      </div>

      {/* Right Continuous Batak Ulos & Gorga Edge Strip */}
      <div className="fixed top-0 bottom-0 right-0 w-3 z-30 pointer-events-none opacity-85 flex flex-col justify-between overflow-hidden bg-[#140D09]">
        <svg
          className="w-3 h-full shrink-0 text-[#C8A253]"
          fill="currentColor"
          preserveAspectRatio="none"
          viewBox="0 0 12 400"
        >
          <pattern id="ulos-edge-right" patternUnits="userSpaceOnUse" width="12" height="40">
            <rect width="12" height="40" fill="#140D09" />
            <path d="M12,0 L6,10 L0,0 L0,5 L6,15 L12,5 Z" fill="#9E3B2B" />
            <path d="M12,15 L6,25 L0,15 L0,20 L6,30 L12,20 Z" fill="#C8A253" />
            <path d="M12,30 L6,40 L0,30 L0,35 L6,45 L12,35 Z" fill="#661D24" />
            <circle cx="6" cy="10" r="1.5" fill="#C8A253" />
            <circle cx="6" cy="25" r="1.5" fill="#EDE1D0" />
          </pattern>
          <rect width="12" height="100%" fill="url(#ulos-edge-right)" />
        </svg>
      </div>
    </>
  );
};
