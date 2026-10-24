import React from 'react';

interface RumahBolonCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RumahBolonCrest: React.FC<RumahBolonCrestProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-24 h-16',
    lg: 'w-32 h-20',
  }[size];

  return (
    <svg
      className={`${sizeClasses} text-[#EAC16E] drop-shadow-[0_2px_8px_rgba(234,193,110,0.3)] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 120 70"
    >
      {/* Rumah Bolon Curved Roof & Singa-singa filigree */}
      <path d="M10,52 C28,42 42,22 60,8 C78,22 92,42 110,52" strokeLinecap="round" />
      <path d="M16,58 C32,48 45,28 60,16 C75,28 88,48 104,58" strokeLinecap="round" />
      <path d="M25,50 L25,62 M95,50 L95,62 M60,16 L60,62" strokeDasharray="2 2" />
      <path d="M40,58 L80,58" strokeLinecap="round" />
      {/* Starburst motif */}
      <circle cx="60" cy="8" r="3" fill="#EAC16E" />
      <path d="M60,0 L60,5 M55,3 L65,3" stroke="#EAC16E" strokeWidth="1.5" />
      <circle cx="36" cy="48" r="2" fill="#C8A253" />
      <circle cx="84" cy="48" r="2" fill="#C8A253" />
    </svg>
  );
};
