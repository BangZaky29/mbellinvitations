import React from 'react';

export const KembangKelapaCrest: React.FC<{
  className?: string;
  crestColor?: string;
  circleColor?: string;
}> = ({
  className = 'w-16 h-12',
  crestColor = '#FED65B',
  circleColor = '#FFE088',
}) => {
  return (
    <svg
      className={`${className} fill-current`}
      style={{ color: crestColor }}
      viewBox="0 0 80 50"
    >
      <path
        d="M40 2 C41 12 47 18 58 18 C58 18 48 22 43 27 C46 38 41 48 40 50 C39 48 34 38 37 27 C32 22 22 18 22 18 C33 18 39 12 40 2 Z"
        opacity="0.9"
      />
      <circle cx="40" cy="24" fill={circleColor} r="3.5" />
      <path
        d="M28 32 C33 34 38 35 40 35 C42 35 47 34 52 32"
        fill="none"
        stroke={crestColor}
        strokeWidth="1.5"
      />
      <polygon
        fill="none"
        points="14,48 20,40 26,48 32,40 38,48 44,40 50,48 56,40 62,48 68,40"
        stroke={crestColor}
        strokeWidth="1"
      />
    </svg>
  );
};
