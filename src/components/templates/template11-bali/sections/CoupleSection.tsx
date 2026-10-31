import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
} from '../components';

interface CoupleSectionProps {
  data: InvitationData;
  firstPerson: CoupleInfo | { name: string; full_name?: string };
  secondPerson: CoupleInfo | { name: string; full_name?: string };
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
}) => {
  const isBrideFirst = Boolean(data.is_bride_first);

  const groomInfo = data.groom;
  const brideInfo = data.bride;

  const groomPhoto =
    groomInfo.photo_url ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuABcncbuZFV_wDzfMUSvzivw-WHG_DjWI9kngwMeqJZ0BAubTO1Gl8p2oRc1RuKpFBJnUQrlg5KAfFNkYFEgd_xZFmJJTjw7zTOjbGT0YXz9b4Iwh1y3HrsFtKWrwr8YVldPkiXSkPxFYFn4oOK2F4dYqepT4iK13iRBvDQhDSvVJ9x1AoZJAlQGSzQP8BfoyZAEWjXIPO49XiCzb6CW-Gr1Qp_na6I-KPOzWd11_68t3R7D0RTqVim';

  const bridePhoto =
    brideInfo.photo_url ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCcx_gA9cokEyxGX8Q2h3fZIyaObh-zLYHM2MaPrB-0ciUqHebb0HhOvB9Xf8a87TqeGJCnr2MuBFDjvrbCNiPbHh9hje2lfw5eLOPLtijquq6iuQypqF2yr2OLAG--gypnOeXusufPCmvgx7P_qOnXSvxkpWzS5YJg6Q1-xeEc8llvhH3uTUTNIcCssHctxx0Vp7OXzRKzAW1Ac7A3jNJL2xl-406D7I4c0qWORkaXZTNvX2OB59yP';

  const renderGroomCard = () => (
    <div className="relative w-full bg-[#FFF9EF] border border-[#D4AF37]/45 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col items-center text-center overflow-hidden">
      {/* Corner Filigrees */}
      <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
      <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
      <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
      <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

      {/* Groom Photo in Circular Frame */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FED65B] to-[#411710] shadow-md mb-3.5">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#F3EDE4]">
          <img
            src={groomPhoto}
            alt={groomInfo.full_name || groomInfo.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-widest font-bold">
        Mempelai Pria • Purusa
      </span>

      <h4 className="font-serif text-lg sm:text-xl text-[#411710] font-bold mt-1 break-words [overflow-wrap:anywhere] max-w-[280px]">
        {groomInfo.full_name || groomInfo.name}
      </h4>

      <p className="font-sans text-xs text-[#524341] mt-1.5 leading-relaxed break-words [overflow-wrap:anywhere] max-w-[280px]">
        {groomInfo.child_order || 'Putra sulung dari Pasangan'}
        <br />
        <span className="text-[#1D1B16] font-semibold">
          {groomInfo.parent_info ||
            `${groomInfo.parent_father || 'Anak Agung Ngurah Gede'} & ${groomInfo.parent_mother || 'Desak Made Ratna'}`}
        </span>
      </p>

      {groomInfo.instagram && (
        <a
          href={
            groomInfo.instagram.startsWith('http')
              ? groomInfo.instagram
              : `https://instagram.com/${groomInfo.instagram.replace('@', '')}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3EDE4] border border-[#D4AF37]/30 rounded-full text-[#735C00] hover:text-[#411710] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">photo_camera</span>
          <span className="font-sans text-[11px] font-semibold">
            {groomInfo.instagram.startsWith('@') ? groomInfo.instagram : `@${groomInfo.instagram}`}
          </span>
        </a>
      )}
    </div>
  );

  const renderBrideCard = () => (
    <div className="relative w-full bg-[#FFF9EF] border border-[#D4AF37]/45 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col items-center text-center overflow-hidden">
      {/* Corner Filigrees */}
      <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
      <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
      <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
      <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

      {/* Bride Photo in Circular Frame */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FED65B] to-[#411710] shadow-md mb-3.5">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#F3EDE4]">
          <img
            src={bridePhoto}
            alt={brideInfo.full_name || brideInfo.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-widest font-bold">
        Mempelai Wanita • Pradana
      </span>

      <h4 className="font-serif text-lg sm:text-xl text-[#411710] font-bold mt-1 break-words [overflow-wrap:anywhere] max-w-[280px]">
        {brideInfo.full_name || brideInfo.name}
      </h4>

      <p className="font-sans text-xs text-[#524341] mt-1.5 leading-relaxed break-words [overflow-wrap:anywhere] max-w-[280px]">
        {brideInfo.child_order || 'Putri kedua dari Pasangan'}
        <br />
        <span className="text-[#1D1B16] font-semibold">
          {brideInfo.parent_info ||
            `${brideInfo.parent_father || 'I Gusti Made Suweta'} & ${brideInfo.parent_mother || 'Ni Luh Made Kencana'}`}
        </span>
      </p>

      {brideInfo.instagram && (
        <a
          href={
            brideInfo.instagram.startsWith('http')
              ? brideInfo.instagram
              : `https://instagram.com/${brideInfo.instagram.replace('@', '')}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3EDE4] border border-[#D4AF37]/30 rounded-full text-[#735C00] hover:text-[#411710] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">photo_camera</span>
          <span className="font-sans text-[11px] font-semibold">
            {brideInfo.instagram.startsWith('@') ? brideInfo.instagram : `@${brideInfo.instagram}`}
          </span>
        </a>
      )}
    </div>
  );

  return (
    <section className="relative w-full bg-[#F3EDE4] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.045]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Title */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Sang Mempelai
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            Purusa &amp; Pradana
          </h3>
          <p className="font-sans text-xs text-[#524341] max-w-[310px] mx-auto mt-2 leading-relaxed">
            Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, perkenankan kami mempertemukan dua keluarga dalam ikatan suci Dharma Yadnya.
          </p>
        </div>

        {/* First Person Card */}
        {isBrideFirst ? renderBrideCard() : renderGroomCard()}

        {/* Sacred Knot / Love Connection Divider */}
        <div className="my-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#FFF9EF] border border-[#D4AF37]/40 flex items-center justify-center shadow-md text-[#735C00]">
            <span className="material-symbols-outlined text-xl text-[#735C00]">favorite</span>
          </div>
          <CandiBentarDivider compact className="my-1" />
        </div>

        {/* Second Person Card */}
        {isBrideFirst ? renderGroomCard() : renderBrideCard()}
      </div>
    </section>
  );
};

