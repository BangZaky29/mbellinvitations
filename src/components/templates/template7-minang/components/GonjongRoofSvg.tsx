import React from 'react';

export interface GonjongRoofSvgProps {
  className?: string;
}

/**
 * Minangkabau Gonjong Architectural Silhouette SVG (Rumah Gadang Peaks)
 */
export const GonjongRoofSvg: React.FC<GonjongRoofSvgProps> = ({
  className = 'w-28 h-10',
}) => (
  <svg
    className={className}
    viewBox="0 0 160 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stylized Gonjong Roof Peaks */}
    <path
      d="M80 6C74 16 65 24 50 25C38 25.8 24 23 0 38C16 34 32 32 46 32C64 32 75 40 80 44C85 40 96 32 114 32C128 32 144 34 160 38C136 23 122 25.8 110 25C95 24 86 16 80 6Z"
      fill="currentColor"
    />
    <path d="M80 0L81.5 5.5L80 7L78.5 5.5L80 0Z" fill="#FFF0B8" />
    <circle cx="80" cy="18" fill="#FFF0B8" r="3.5" />
    <path
      d="M26 12C28 17 33 22 41 24C36 25 31 27 26 31C24 26 21 24 16 23C21 21 24 18 26 12Z"
      fill="currentColor"
    />
    <path
      d="M134 12C136 17 141 22 149 24C144 25 139 27 134 31C132 26 129 24 124 23C129 21 132 18 134 12Z"
      fill="currentColor"
    />
  </svg>
);

export default GonjongRoofSvg;
