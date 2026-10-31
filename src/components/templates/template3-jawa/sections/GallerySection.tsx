import React from 'react';
import type { GallerySectionProps } from '../../types';
import { UniversalGalleryView } from '../../../common/gallery';

export const GallerySection: React.FC<GallerySectionProps> = ({
  data,
  theme,
  setSelectedImage,
}) => {
  const defaultPhotos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtF6SNDAVw9PclpW__UCoK15JCOnrUxa3SpSh8tBeieO6elVHnbQ7e9j4UQNFXESREMjKbEOTbz7BDOIihhTa69cTeslvSLhrtzlSJ6RaSFTXNyJ0UpGPIih2lpOnWTwiSbJsLS-JQXhctz9klyf2VrBJHbW5MowOrZxZKYL8YYJ3uf66M_5CFU-AGPjLd3b2TcoGQxUMhzQuvtCxYYUx6T6pfxlVvqxMtVxdLLn07tHvyeEK6zTwI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCGrqlEISAaXnaxC2OTt1Rs-fzAx-5B57Ssv_OKzplO-BAGhl8WCSHbBDbdaoJrjCq6t11wBKMYHMAila2ihhV5v3zS4hd6Qq92nd6Bb8WgEku6dp02eFYENb6SaTWQeLv994deQMzJFUVSXHRRL3WJM3ewGSvXkSK9jikUlORkBmO46Rm8LmJNryAVoHasjuR4sG9yemDH9g8eMryx-h5M1P0de6vSJWHWQ0uAx6g2kuiQW-Ww5hUG',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCOK4k8V-u1F0I39kBfKzKuqsS3hX5xzBB1ZQIaZtuKkLiM57QueHRPeDqNcBAOlSovVw3af4pGRGseZ9dpvyKZMFGCtoZXvyu-fFPXRcJgyFlEB0fsLcGkdbrLE8lT1tFSO6taV8zgAEW4lX26UKi3G-o0ag2aBFslBtUwSH0tSa8amYuwBngGK6vJxVRkaXksnGGBfw6TkTdaMDzxYL0D2oAQwkmvU7DLEJHZPjtd8WbDunJZkaKw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA2V-3uY62r_SVy7ntONZGPcZ-X70hgkAukqYUKDon2fXZ8v2Rp8KDV-dusTyLjL74C-j-T8P5s0bLa8gIS5LAw2OSRdD4TNmymLSJmnGHEouujgheTkFZg0yQpjZNCWE8eU6VXLyLc0ggcfYF-ajdg8wo-bYDZA3RSW_eQDi-DYdid3D2hM6JgqJukQulVCk5o9fYiRwq3lhguGOJqphsVkLYju7_q8MkKVdPLL1eizZpgZvRsiLyN',
  ];

  const photos =
    data.gallery && data.gallery.length > 0 ? data.gallery : defaultPhotos;

  const effectiveTheme = theme || (data as any).theme_config;
  const currentStyle = data.gallery_style || effectiveTheme?.gallery_style || 'bento-grid';

  return (
    <section
      id="galeri"
      className="relative w-full shrink-0 bg-[#1a110d] text-[#FAF6F0] px-4 py-8 flex flex-col items-center overflow-visible"
    >
      <div className="text-center mb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
          Rerenggan Potret
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          Galeri Sasana &amp; Bahagia
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
          Gatra katresnan ingkang kerekam ing sajroning wekdal
        </p>
      </div>

      {/* Universal Gallery View Engine */}
      <div className="w-full max-w-[390px]">
        <UniversalGalleryView
          photos={photos}
          style={currentStyle}
          onSelectImage={(url) => setSelectedImage(url)}
          themeAccent={{
            primaryColor: '#f2ca50',
            goldAccent: '#C89D47',
            badgeBg: '#271e18',
            badgeText: '#f1dfd6',
            cardBg: '#211611',
            borderColor: '#C89D47',
          }}
        />
      </div>
    </section>
  );
};

export default GallerySection;
