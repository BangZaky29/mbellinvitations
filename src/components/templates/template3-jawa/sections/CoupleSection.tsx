import React from 'react';
import type { CoupleSectionProps } from '../../types';

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
}) => {
  return (
    <section
      id="mempelai"
      className="relative w-full bg-[#14100D] px-margin py-space-xl flex flex-col items-center text-center"
    >
      <div className="mb-6">
        <span className="text-xs uppercase tracking-[0.2em] text-[#FFE082] font-semibold block mb-1">
          Dhedhasaring Katresnan
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#FAF6F0] drop-shadow-sm">
          Mempelai Kekalih
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-10 h-[1px] bg-[#D4AF37]/50"></span>
          <span className="material-symbols-outlined text-[#F3D068] text-xs">local_florist</span>
          <span className="w-10 h-[1px] bg-[#D4AF37]/50"></span>
        </div>
      </div>

      {/* Person 1 Card */}
      <div className="w-full bg-[#1C1612] rounded-2xl p-6 shadow-2xl border border-[#F3D068]/35 mb-4 flex flex-col items-center text-center reveal-left delay-100">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-2 ring-[#F3D068]/70 p-1 bg-gradient-to-b from-[#F3D068]/40 to-transparent mb-4">
          <img
            src={firstPerson.photo_url || firstPerson.photo || data.couple_photo || data.cover_image}
            alt={firstPerson.full_name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#FFE082] tracking-wide drop-shadow-sm">
          {firstPerson.full_name}
        </h3>
        <p className="font-sans text-xs text-[#FAF6F0] mt-2 leading-relaxed opacity-95">
          {firstPerson.child_order} saking Bpk. <span className="font-semibold text-[#FFE082]">{firstPerson.parent_father}</span>
          <br />&amp; Ibu <span className="font-semibold text-[#FFE082]">{firstPerson.parent_mother}</span>
        </p>
        {firstPerson.instagram && (
          <a
            href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2A201A] border border-[#F3D068]/40 text-[#FFE082] hover:bg-[#382B22] transition-colors font-sans text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            <span>{firstPerson.instagram}</span>
          </a>
        )}
      </div>

      {/* Golden Ukiran Connector */}
      <div className="my-2 flex items-center justify-center gap-3 reveal-scale delay-200">
        <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#F3D068]"></div>
        <span className="font-headline-md text-headline-md text-[#FFE082] italic font-serif">&amp;</span>
        <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#F3D068]"></div>
      </div>

      {/* Person 2 Card */}
      <div className="w-full bg-[#1C1612] rounded-2xl p-6 shadow-2xl border border-[#F3D068]/35 flex flex-col items-center text-center reveal-right delay-300">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-2 ring-[#F3D068]/70 p-1 bg-gradient-to-b from-[#F3D068]/40 to-transparent mb-4">
          <img
            src={secondPerson.photo_url || secondPerson.photo || data.couple_photo || data.cover_image}
            alt={secondPerson.full_name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#FFE082] tracking-wide drop-shadow-sm">
          {secondPerson.full_name}
        </h3>
        <p className="font-sans text-xs text-[#FAF6F0] mt-2 leading-relaxed opacity-95">
          {secondPerson.child_order} saking Bpk. <span className="font-semibold text-[#FFE082]">{secondPerson.parent_father}</span>
          <br />&amp; Ibu <span className="font-semibold text-[#FFE082]">{secondPerson.parent_mother}</span>
        </p>
        {secondPerson.instagram && (
          <a
            href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2A201A] border border-[#F3D068]/40 text-[#FFE082] hover:bg-[#382B22] transition-colors font-sans text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            <span>{secondPerson.instagram}</span>
          </a>
        )}
      </div>
    </section>
  );
};
