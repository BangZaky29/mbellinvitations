import React from 'react';
import type { CoupleInfo } from '../../types';
import { SigerCrownSvg } from '../components/SigerCrownSvg';

export interface SundaCoupleProps {
  firstPerson: CoupleInfo;
  secondPerson: CoupleInfo;
  coupleOrderTitle: string;
}

export const CoupleSection: React.FC<SundaCoupleProps> = ({
  firstPerson,
  secondPerson,
  coupleOrderTitle,
}) => {
  return (
    <section
      className="w-full px-5 py-12 flex flex-col items-center text-center bg-[#fbf9f6]"
      id="mempelai"
    >
      <div className="w-20 h-8 flex items-center justify-center text-[#8a6822] mb-1 reveal-scale">
        <SigerCrownSvg />
      </div>
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase reveal">
        Panganten Sakembaran
      </span>
      <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-8 reveal delay-100">
        {coupleOrderTitle}
      </h2>

      {/* First Person Card */}
      <div className="w-full max-w-xs rounded-3xl p-6 bg-white shadow-md flex flex-col items-center relative mb-6 border border-[#c5a059]/30 reveal-left delay-100">
        <div className="w-44 h-56 rounded-t-full rounded-b-2xl overflow-hidden shadow-inner mb-4 bg-[#f4efe4] p-1.5 border border-[#c5a059]/40">
          <img
            src={
              firstPerson.photo_url ||
              firstPerson.photo ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
            }
            alt={firstPerson.full_name}
            className="w-full h-full object-cover rounded-t-full rounded-b-xl"
          />
        </div>
        <h3 className="text-lg sm:text-xl text-[#1b1c1a] font-serif font-bold leading-tight">
          {firstPerson.full_name}
        </h3>
        <p className="text-xs text-[#4e4639] mt-2 text-center leading-relaxed">
          {firstPerson.child_order || 'Putra ti'}:<br />
          <strong className="text-[#1b1c1a] font-semibold">
            {firstPerson.parent_father || 'Bpk. Orang Tua Pria'}
          </strong>
          <br />
          &amp; {firstPerson.parent_mother || 'Ibu Orang Tua Pria'}
        </p>
        {firstPerson.instagram && (
          <a
            href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fbf9f6] text-[#8a6822] text-[11px] font-semibold hover:bg-[#f3eedf] transition-colors border border-[#c5a059]/30"
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            <span>{firstPerson.instagram}</span>
          </a>
        )}
      </div>

      {/* Ampersand Floral Connection */}
      <div className="relative my-2 flex items-center justify-center reveal-scale delay-200">
        <div className="w-16 h-px bg-[#c5a059]/50" />
        <span className="mx-3 text-3xl font-serif text-[#8a6822] italic font-light">
          &amp;
        </span>
        <div className="w-16 h-px bg-[#c5a059]/50" />
      </div>

      {/* Second Person Card */}
      <div className="w-full max-w-xs rounded-3xl p-6 bg-white shadow-md flex flex-col items-center relative mt-6 border border-[#c5a059]/30 reveal-right delay-200">
        <div className="w-44 h-56 rounded-t-full rounded-b-2xl overflow-hidden shadow-inner mb-4 bg-[#f4efe4] p-1.5 border border-[#c5a059]/40">
          <img
            src={
              secondPerson.photo_url ||
              secondPerson.photo ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
            }
            alt={secondPerson.full_name}
            className="w-full h-full object-cover rounded-t-full rounded-b-xl"
          />
        </div>
        <h3 className="text-lg sm:text-xl text-[#1b1c1a] font-serif font-bold leading-tight">
          {secondPerson.full_name}
        </h3>
        <p className="text-xs text-[#4e4639] mt-2 text-center leading-relaxed">
          {secondPerson.child_order || 'Putri ti'}:<br />
          <strong className="text-[#1b1c1a] font-semibold">
            {secondPerson.parent_father || 'Bpk. Orang Tua Wanita'}
          </strong>
          <br />
          &amp; {secondPerson.parent_mother || 'Ibu Orang Tua Wanita'}
        </p>
        {secondPerson.instagram && (
          <a
            href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fbf9f6] text-[#8a6822] text-[11px] font-semibold hover:bg-[#f3eedf] transition-colors border border-[#c5a059]/30"
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            <span>{secondPerson.instagram}</span>
          </a>
        )}
      </div>
    </section>
  );
};

export default CoupleSection;
