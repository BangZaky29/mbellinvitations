import React from 'react';

/**
 * Minangkabau Songket Weaving Filigree Vertical Side Stripes
 */
export const SongketBorder: React.FC = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 w-2.5 songket-side-border-left z-30 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 right-0 w-2.5 songket-side-border-right z-30 pointer-events-none"
      />
    </>
  );
};

export default SongketBorder;
