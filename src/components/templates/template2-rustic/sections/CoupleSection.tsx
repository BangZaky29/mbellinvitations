import React from 'react';
import type { CoupleSectionProps, CoupleInfo } from '../../types';

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  firstPersonRole,
  secondPersonRole,
}) => {
  const isBrideFirst = Boolean(data?.is_bride_first);
  const defaultFirst = isBrideFirst ? data?.bride : data?.groom;
  const defaultSecond = isBrideFirst ? data?.groom : data?.bride;

  const firstPerson: CoupleInfo = rawFirst || defaultFirst || {
    name: isBrideFirst ? 'Mempelai Wanita' : 'Mempelai Pria',
    full_name: isBrideFirst ? 'Mempelai Wanita' : 'Mempelai Pria',
    child_order: isBrideFirst ? 'Putri pertama' : 'Putra pertama',
    parent_father: 'Bapak',
    parent_mother: 'Ibu',
    parent_info: '',
    instagram: '',
  };

  const secondPerson: CoupleInfo = rawSecond || defaultSecond || {
    name: isBrideFirst ? 'Mempelai Pria' : 'Mempelai Wanita',
    full_name: isBrideFirst ? 'Mempelai Pria' : 'Mempelai Wanita',
    child_order: isBrideFirst ? 'Putra pertama' : 'Putri pertama',
    parent_father: 'Bapak',
    parent_mother: 'Ibu',
    parent_info: '',
    instagram: '',
  };

  const resolvedFirstRole = firstPersonRole || (isBrideFirst ? 'Sang Mempelai Wanita' : 'Sang Mempelai Pria');
  const resolvedSecondRole = secondPersonRole || (isBrideFirst ? 'Sang Mempelai Pria' : 'Sang Mempelai Wanita');

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
            src={firstPerson.photo_url || firstPerson.photo || data?.couple_photo || data?.cover_image}
            alt={firstPerson.full_name || firstPerson.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {resolvedFirstRole && (
          <span className="text-[11px] uppercase tracking-wider text-[#8C4E2D] font-semibold mb-1">
            {resolvedFirstRole}
          </span>
        )}
        <h4 className="font-serif text-2xl text-[#2C4034] font-bold">
          {firstPerson.full_name || firstPerson.name}
        </h4>
        <p className="text-xs text-[#4D5E53] mt-2 mb-4 max-w-xs leading-relaxed">
          {firstPerson.child_order && (
            <>
              {firstPerson.child_order}
              <br />
            </>
          )}
          {firstPerson.parent_info ? (
            <span className="font-semibold text-[#2C4034]">{firstPerson.parent_info}</span>
          ) : (
            <>
              {firstPerson.parent_father && (
                <span className="font-semibold text-[#2C4034]">{firstPerson.parent_father}</span>
              )}
              {firstPerson.parent_father && firstPerson.parent_mother && ' & '}
              {firstPerson.parent_mother && (
                <span className="font-semibold text-[#2C4034]">{firstPerson.parent_mother}</span>
              )}
            </>
          )}
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
            src={secondPerson.photo_url || secondPerson.photo || data?.couple_photo || data?.cover_image}
            alt={secondPerson.full_name || secondPerson.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {resolvedSecondRole && (
          <span className="text-[11px] uppercase tracking-wider text-[#8C4E2D] font-semibold mb-1">
            {resolvedSecondRole}
          </span>
        )}
        <h4 className="font-serif text-2xl text-[#2C4034] font-bold">
          {secondPerson.full_name || secondPerson.name}
        </h4>
        <p className="text-xs text-[#4D5E53] mt-2 mb-4 max-w-xs leading-relaxed">
          {secondPerson.child_order && (
            <>
              {secondPerson.child_order}
              <br />
            </>
          )}
          {secondPerson.parent_info ? (
            <span className="font-semibold text-[#2C4034]">{secondPerson.parent_info}</span>
          ) : (
            <>
              {secondPerson.parent_father && (
                <span className="font-semibold text-[#2C4034]">{secondPerson.parent_father}</span>
              )}
              {secondPerson.parent_father && secondPerson.parent_mother && ' & '}
              {secondPerson.parent_mother && (
                <span className="font-semibold text-[#2C4034]">{secondPerson.parent_mother}</span>
              )}
            </>
          )}
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
