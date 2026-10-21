import React from 'react';

export interface SigerCrownSvgProps {
  className?: string;
}

/**
 * Ornate Sundanese Royal Siger Crown Motif SVG
 */
export const SigerCrownSvg: React.FC<SigerCrownSvgProps> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 120 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Base Tiara Filigree */}
    <path
      d="M6 36 C30 38, 90 38, 114 36 C105 32, 85 30, 60 30 C35 30, 15 32, 6 36 Z"
      fill="currentColor"
      opacity="0.85"
    />
    {/* Center 9-Peak Siger Crown Structure */}
    <path
      d="M60 4 L65 24 L75 14 L78 28 L90 20 L91 32 L106 26 L102 36 L18 36 L14 26 L29 32 L30 20 L42 28 L45 14 L55 24 Z"
      fill="currentColor"
    />
    {/* Sparkling Royal Gem Jewels */}
    <circle cx="60" cy="5" r="3" fill="#ffe082" />
    <circle cx="45" cy="14" r="2.2" fill="#ffe082" />
    <circle cx="75" cy="14" r="2.2" fill="#ffe082" />
    <circle cx="30" cy="20" r="1.8" fill="#ffe082" />
    <circle cx="90" cy="20" r="1.8" fill="#ffe082" />
    <circle cx="14" cy="26" r="1.5" fill="#ffe082" />
    <circle cx="106" cy="26" r="1.5" fill="#ffe082" />
    {/* Center Diamond Emblem */}
    <polygon points="60,18 63,23 60,28 57,23" fill="#ffffff" opacity="0.9" />
  </svg>
);

export default SigerCrownSvg;
