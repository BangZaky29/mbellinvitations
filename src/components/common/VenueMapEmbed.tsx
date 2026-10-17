import React from 'react';

export interface VenueMapEmbedProps {
  venueName?: string;
  venueAddress?: string;
  mapsUrl?: string;
  className?: string;
  heightClass?: string;
  isPreview?: boolean;
}

export const VenueMapEmbed: React.FC<VenueMapEmbedProps> = ({
  venueName,
  venueAddress,
  mapsUrl,
  className = '',
  heightClass = 'h-44 sm:h-48',
  isPreview = false,
}) => {
  // Ekstrak query lokasi terbaik: Alamat lengkap + Nama venue, atau fallback dari mapsUrl
  let query = [venueName, venueAddress].filter(Boolean).join(', ');

  if (!query && mapsUrl) {
    try {
      // Coba ekstrak query parameter jika mapsUrl mengandung query/q
      const url = new URL(mapsUrl);
      const q = url.searchParams.get('query') || url.searchParams.get('q');
      if (q) {
        query = decodeURIComponent(q);
      }
    } catch {
      // Jika mapsUrl adalah teks mentah atau URL pendek, gunakan sebagai string
      if (!mapsUrl.startsWith('http')) {
        query = mapsUrl;
      }
    }
  }

  if (!query) {
    query = 'Kraton Yogyakarta Hadiningrat, Indonesia';
  }

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`w-full ${heightClass} rounded-2xl overflow-hidden relative shadow-md bg-stone-100 border border-stone-200/60 ${className} ${isPreview ? 'pointer-events-auto' : ''}`}>
      <iframe
        title={`Peta Lokasi ${venueName || 'Acara'}`}
        src={embedUrl}
        className="w-full h-full border-0 rounded-2xl"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* Subtle overlay header showing venue name */}
      {venueName && (
        <div className="absolute top-2 left-2 right-2 pointer-events-none flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/90 text-stone-800 backdrop-blur-md shadow-xs truncate max-w-[85%] border border-stone-200/80">
            📍 {venueName}
          </span>
        </div>
      )}
    </div>
  );
};
