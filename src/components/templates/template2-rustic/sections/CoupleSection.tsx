import React from 'react';
import type { CoupleSectionProps } from '../../types';

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
}) => {
  return (
    <section id="mempelai-section" className="flex flex-col items-center py-space-xl">
      {/* Section Header & Divider */}
      <div className="flex flex-col items-center text-center mb-space-lg">
        <div className="flex items-center gap-2 text-[#8C4E2D] mb-1">
          <span className="material-symbols-outlined text-[20px]">spa</span>
          <span className="font-sans text-xs uppercase tracking-widest font-semibold">
            The Happy Couple
          </span>
          <span className="material-symbols-outlined text-[20px]">spa</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4034]">
          Pengantin Pria &amp; Wanita
        </h3>
        <p className="text-xs text-[#4D5E53] max-w-xs mt-1.5 leading-relaxed">
          Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Anda untuk merayakan cinta kami.
        </p>
      </div>

      {/* Person 1 Card */}
      <div className="w-full rounded-2xl bg-white p-6 shadow-md border border-[#2C4034]/15 flex flex-col items-center text-center relative overflow-hidden mb-space-md reveal-left delay-100">
        <div className="w-32 h-32 rounded-full overflow-hidden p-1 shadow-md bg-white border-2 border-[#855233]/30 mb-4">
          <img
            src={firstPerson.photo_url || firstPerson.photo || data.couple_photo || data.cover_image}
            alt={firstPerson.full_name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h4 className="font-serif text-2xl text-[#2C4034] font-bold">
          {firstPerson.full_name}
        </h4>
        <p className="text-xs text-[#4D5E53] mt-2 mb-4 max-w-xs leading-relaxed">
          {firstPerson.child_order} <br />
          <span className="font-semibold text-[#2C4034]">{firstPerson.parent_father}</span> &amp;{' '}
          <span className="font-semibold text-[#2C4034]">{firstPerson.parent_mother}</span>
        </p>
        {firstPerson.instagram && (
          <a
            href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2EDE4] text-[#2C4034] text-xs font-semibold hover:bg-[#2C4034] hover:text-white transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>{firstPerson.instagram}</span>
          </a>
        )}
      </div>

      {/* Connecting Floral Knot */}
      <div className="my-1 text-[#855233] flex items-center justify-center gap-2 reveal-scale delay-200">
        <div className="w-12 h-px bg-[#855233]/30"></div>
        <span className="material-symbols-outlined text-[26px]">all_inclusive</span>
        <div className="w-12 h-px bg-[#855233]/30"></div>
      </div>

      {/* Person 2 Card */}
      <div className="w-full rounded-2xl bg-white p-6 shadow-md border border-[#2C4034]/15 flex flex-col items-center text-center relative overflow-hidden mt-space-md reveal-right delay-300">
        <div className="w-32 h-32 rounded-full overflow-hidden p-1 shadow-md bg-white border-2 border-[#855233]/30 mb-4">
          <img
            src={secondPerson.photo_url || secondPerson.photo || data.couple_photo || data.cover_image}
            alt={secondPerson.full_name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h4 className="font-serif text-2xl text-[#2C4034] font-bold">
          {secondPerson.full_name}
        </h4>
        <p className="text-xs text-[#4D5E53] mt-2 mb-4 max-w-xs leading-relaxed">
          {secondPerson.child_order} <br />
          <span className="font-semibold text-[#2C4034]">{secondPerson.parent_father}</span> &amp;{' '}
          <span className="font-semibold text-[#2C4034]">{secondPerson.parent_mother}</span>
        </p>
        {secondPerson.instagram && (
          <a
            href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2EDE4] text-[#2C4034] text-xs font-semibold hover:bg-[#2C4034] hover:text-white transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>{secondPerson.instagram}</span>
          </a>
        )}
      </div>
    </section>
  );
};
