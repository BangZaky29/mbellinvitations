import React from 'react';

interface GorgaFiligreeProps {
  className?: string;
  circleColor?: string;
}

export const GorgaFiligree: React.FC<GorgaFiligreeProps> = ({
  className = 'w-16 h-8 text-[#C8A253]',
  circleColor = '#85291B',
}) => {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 64 32">
      <path d="M32,2 C22,2 14,10 6,12 C0,14 0,18 6,20 C14,22 22,30 32,30 C42,30 50,22 58,20 C64,18 64,14 58,12 C50,10 42,2 32,2 Z M32,8 C38,8 44,12 48,16 C44,20 38,24 32,24 C26,24 20,20 16,16 C20,12 26,8 32,8 Z" />
      <circle cx="32" cy="16" fill={circleColor} r="3" />
    </svg>
  );
};
