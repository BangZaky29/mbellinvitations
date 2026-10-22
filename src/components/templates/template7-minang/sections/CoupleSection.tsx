import React from 'react';
import type { BaseSectionProps, CoupleInfo } from '../../types';
import { MinangDivider } from '../components';

export interface MinangCoupleProps extends BaseSectionProps {
  firstPerson: CoupleInfo;
  secondPerson: CoupleInfo;
  coupleOrderTitle: string;
}

export const CoupleSection: React.FC<MinangCoupleProps> = ({
  data,
  firstPerson,
  secondPerson,
}) => {
  const isGroomFirst = !data.is_bride_first;
  const groom = data.groom;
  const bride = data.bride;

  const renderPersonCard = (person: CoupleInfo, isBride: boolean) => {
    const roleBadge = isBride
      ? 'ANAK DARO (PENGANTIN WANITA)'
      : 'MARAPULAI (PENGANTIN PRIA)';
    const clanFallback = isBride
      ? 'Suku: Koto — Batipuh, Tanah Datar'
      : 'Suku: Chaniago — Koto Nan Ampek, Payakumbuh';

    const defaultPhoto = isBride
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJvKvZ2xgLAnECRSyY58tE27Axd2hSIlTg0aNlPcfBk27c-WI7BI5DGQcQofS0eOnAhKumPQuxc6SEwE2aLYsmbM3lntrCRb_WSjLZcDWuCmOSqhAAlQrmpP5uf55MxIrpYA33C7UMSTIVnyfmUSyErIrFIEeCx2vjWKqWRev0rmZEj8qwIrI3GCng5iapknfYTc2LmihwTI63bEjLW8HaTUPEx_0cLuFk3D8540QBMpUjxm4IRc-t'
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXKmE54OTIFHSVXCm7XRblmdEHEXPmQDEoxbImtKMM5XnTPSWuNQ9rzggqwZf8HQ9jjv8RdSH_taax0q3ATesgmIfMAE7LhDi-IIDhncothrG1fqIwNoPoTdOkzd-Lo7SfpNafq65Sc7LHp9kblje7PNYXVM1SmEg7ZQGrmpnIdIJd_bJVUuXI50us3l67wWTTsGGUUdqUF6RsURGqu8rJP6xL9K0P0M1CnglMHN1iG4wk0HNgX0D9';

    return (
      <div className="bg-white rounded-2xl p-5 border-2 border-[#D4AF37]/40 shadow-md text-center relative overflow-hidden w-full">
        <div className="w-32 h-40 mx-auto mb-4 rounded-t-full rounded-b-xl p-1 bg-gradient-to-b from-[#F5E296] via-[#D4AF37] to-[#7D5C1E] shadow-md">
          <img
            src={person.photo_url || person.photo || defaultPhoto}
            alt={person.full_name || person.name}
            className="w-full h-full object-cover rounded-t-full rounded-b-lg"
            loading="lazy"
          />
        </div>

        <span className="inline-block px-3 py-0.5 rounded-full text-[9.5px] font-cinzel font-bold tracking-widest text-[#F5E296] bg-[#4A121A] mb-1.5 border border-[#D4AF37]/40">
          {roleBadge}
        </span>

        <h4 className="font-serif text-xl font-bold text-[#2E0A10] tracking-wide mt-1 break-words [overflow-wrap:anywhere]">
          {person.full_name || person.name}
        </h4>

        <div className="text-xs text-[#4A121A] font-sans mt-2 max-w-[280px] mx-auto leading-relaxed break-words [overflow-wrap:anywhere]">
          <p>{person.child_order || (isBride ? 'Putri dari pasangan' : 'Putra dari pasangan')}</p>
          <p className="font-semibold text-[#2E0A10] mt-0.5">
            {person.parent_info ||
              `${person.parent_father || 'Bapak'} & ${person.parent_mother || 'Ibu'}`}
          </p>
        </div>

        <p className="text-[11px] text-[#7D5C1E] font-serif italic mt-1.5 font-medium">
          {clanFallback}
        </p>

        {person.instagram && (
          <a
            href={
              person.instagram.startsWith('http')
                ? person.instagram
                : `https://instagram.com/${person.instagram.replace('@', '')}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex items-center gap-1.5 text-xs text-[#4A121A] font-medium bg-[#FAF6EE] px-3.5 py-1 rounded-full border border-[#D4AF37]/40 hover:bg-[#F3EAD8] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-[#7D5C1E]">photo_camera</span>
            <span>{person.instagram}</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <section
      className="bg-[#FAF6EE] text-[#1B0609] px-5 pt-4 pb-12 relative"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
    >
      {/* Section Title */}
      <div className="text-center mb-8">
        <span className="font-script text-2xl text-[#7D5C1E]">Sang Mempelai</span>
        <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#2E0A10]">
          ANAK DARO &amp; MARAPULAI
        </h3>
        <MinangDivider className="my-1.5" color="gold-bronze" />
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* First Person */}
        {renderPersonCard(isGroomFirst ? groom : bride, !isGroomFirst)}

        {/* Center Interlock Sign */}
        <div className="flex items-center justify-center -my-1 relative z-10">
          <span className="w-10 h-10 rounded-full bg-[#FAF6EE] border-2 border-[#D4AF37] flex items-center justify-center font-script text-2xl text-[#8A6822] shadow-md">
            &amp;
          </span>
        </div>

        {/* Second Person */}
        {renderPersonCard(isGroomFirst ? bride : groom, isGroomFirst)}
      </div>
    </section>
  );
};

export default CoupleSection;
