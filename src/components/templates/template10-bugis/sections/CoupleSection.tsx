import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  BugisCornerOrnament,
  BugisTimpaLajaDivider,
  BugisTenunWatermark,
} from '../components';

interface CoupleSectionProps {
  data: InvitationData;
  firstPerson?: CoupleInfo | { name: string; full_name?: string };
  secondPerson?: CoupleInfo | { name: string; full_name?: string };
  coupleOrderTitle?: string;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
}) => {
  const isBrideFirst = data.is_bride_first === true;

  const groomInfo = data.groom || {
    name: 'Andi Fauzan',
    full_name: 'Andi Fauzan Pratama, S.T., M.Sc.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5iPu1V7l1Dxz7-YQzWEY6-9AzgdfqQ-xbx3yxPUg9VkdnxL7YYlDXSiBSYTBtLhfTOaK8Ij29KT5CaVj__9aUpgR5qusJTLofCjenrapTOWeKkrp27ueQDzapAnXCJyV3h7knLdr70b29gG2diTQNIh2SkdwtAi_fHob6gfSEhe0RsN9-N3NNaXcfNse-nju4N3nvj8VJhwr-tw2hox1hKkRhGkFrey-8r80rKyJfZbX0bzhB_mQ6',
    child_order: 'Putra pertama dari',
    parent_info: 'Bpk. Andi Muhammad Ridwan & Ibu Hj. Andi Bau Mirah',
    instagram: '@andi.fauzan',
  };

  const brideInfo = data.bride || {
    name: 'Andi Tenri',
    full_name: 'Andi Tenri Olle, S.Ked.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBx6CY-lmGdNYlDAeONVZWfZfclZxWpNktDwFgD8k3y4_Or5RkKVQUR0MHOqFUMZdJmP3t6wfdNTGUDIVpY2SksTBvJDHg8EHQaRYwkcEqVw6FYb57Ftpq8rw7bJq7CXg-uEnFdnY-xbxByP43GSfRJUNMZ9eTt58V-OP7la75Mmt0vs6eRiEmJheMqp_eJtuYnyFoQsARM-3N--OuRkUmUx46GgE5qYRIw-H55-k7bRXyJs7EVnwJy',
    child_order: 'Putri bungsu dari',
    parent_info: 'Bpk. Dr. Andi Ilham Karaeng Patunru & Ibu Hj. Andi Sitti Aminah',
    instagram: '@tenri.olle',
  };

  const renderPersonCard = (info: any, isGroom: boolean) => {
    const roleBadge = isGroom
      ? 'Botting Burane • Pengantin Pria'
      : 'Botting Makkunrai • Pengantin Wanita';

    const defaultTitle = isGroom ? 'Gelar Adat: Daeng Mattutu' : 'Gelar Adat: Daeng Bau';
    const adatTitle = info.custom_title || defaultTitle;

    const instagramHandle = (info.instagram || '').replace(/^@/, '');

    return (
      <div className="relative w-full p-5 rounded-2xl bg-white shadow-md text-center overflow-hidden border border-[#CBB57B]/30 flex flex-col items-center">
        <BugisCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#9B7B1E]/40" />
        <BugisCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#9B7B1E]/40" />

        {/* Arch Shaped Photo Container */}
        <div className="w-28 h-36 rounded-t-full rounded-b-md overflow-hidden p-0.5 bg-gradient-to-b from-[#D4AF37] to-[#13382B] shadow-sm mb-3">
          <img
            src={info.photo_url}
            alt={info.name || 'Mempelai'}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Role Badge */}
        <span className="font-sans text-[10px] sm:text-[11px] text-[#9B7B1E] tracking-widest uppercase font-bold">
          {roleBadge}
        </span>

        {/* Full Name */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A261B] mt-1 break-words [overflow-wrap:anywhere]">
          {info.full_name || info.name}
        </h3>

        {/* Adat Title / Gelar Kebangsawanan */}
        <span className="font-sans text-xs text-[#2A5944] italic font-medium mt-0.5">
          {adatTitle}
        </span>

        {/* Parents Information */}
        <div className="font-sans text-xs text-[#4B6056] mt-2.5 leading-relaxed">
          <span>{info.child_order || 'Putra/i dari Pasangan'}</span>
          <br />
          <strong className="text-[#0A261B] font-semibold break-words [overflow-wrap:anywhere]">
            {info.parent_info ||
              `${info.parent_father || 'Bpk. Orang Tua'} & ${info.parent_mother || 'Ibu Orang Tua'}`}
          </strong>
        </div>

        {/* Instagram Link */}
        {instagramHandle && (
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[#0F2E22]/5 text-[#9B7B1E] hover:text-[#0A261B] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            <span>@{instagramHandle}</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <section className="relative w-full bg-[#00170E] text-[#C8EAD8] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Pernak-pernik Motif Tenun Sa'be Bugis */}
      <BugisTenunWatermark opacityClass="opacity-[0.06]" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center mb-6">
        <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
          Mempelai Yang Berbahagia
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#C8EAD8] mt-1">
          Mahligai Dua Insan
        </h2>
        <p className="font-sans text-xs text-[#D7C594] mt-1">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud melangsungkan pernikahan agung putra-putri kami:
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">
        {isBrideFirst ? (
          <>
            {renderPersonCard(brideInfo, false)}
            <BugisTimpaLajaDivider compact color="#F2CA50" className="my-0" />
            {renderPersonCard(groomInfo, true)}
          </>
        ) : (
          <>
            {renderPersonCard(groomInfo, true)}
            <BugisTimpaLajaDivider compact color="#F2CA50" className="my-0" />
            {renderPersonCard(brideInfo, false)}
          </>
        )}
      </div>
    </section>
  );
};
