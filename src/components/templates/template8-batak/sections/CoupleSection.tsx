import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import { GorgaFiligree } from '../components/GorgaFiligree';

interface CoupleSectionProps {
  data: InvitationData;
  firstPerson?: CoupleInfo | { name: string; full_name?: string };
  secondPerson?: CoupleInfo | { name: string; full_name?: string };
  coupleOrderTitle?: string;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
}) => {
  const isBrideFirst = data.is_bride_first || false;

  const groomCard = (
    <div
      key="groom"
      className="w-full max-w-[340px] bg-[#EDE1D0] text-[#362F25] rounded-2xl p-5 flex flex-col items-center shadow-lg border border-[#85291B]/20 overflow-hidden"
    >
      <div className="w-28 h-36 rounded-t-full rounded-b-lg overflow-hidden shadow-md mb-3 p-0.5 bg-[#85291B] shrink-0">
        <img
          src={
            data.groom.photo_url ||
            data.groom.photo ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ul7JpVEUwTKOddyKJL42jdmBf9BvugyW8n5K0ckhOAkBeS1zwjL_An4ucB0kFz-NVopaFXia3QiNDJ5lSs5FQn4LktVL64uL32UiOg2OLd7w5Ak60GXdZsuVXeJFnOeCugwmZKQ8gWxkDH30MSrIvHTdcFQ5uN-GTc2TPzEJMCGYAyWTwONGyLCMcvJPj7GFogzG5mCxBgV6kC9xdkZoWkPfeUy6Q7Jy8qRq3IsY9iYmbgxUMqUO'
          }
          alt={data.groom.name || 'Groom'}
          className="w-full h-full object-cover object-top rounded-t-full rounded-b-md"
        />
      </div>

      <span className="px-3 py-0.5 bg-[#85291B] text-[#FFDAD4] rounded-full font-sans text-[10px] tracking-widest uppercase mb-1.5 font-bold shadow-xs">
        Anak Ni Raja
      </span>

      <h3 className="font-serif text-lg sm:text-[19px] font-bold text-[#362F25] text-center leading-tight break-words [overflow-wrap:anywhere]">
        {data.groom.full_name || data.groom.name}
      </h3>

      <p className="font-sans text-xs text-[#630F05] font-semibold mt-1">
        Marga: {data.groom.marga || 'Siregar Silali'}
      </p>

      <div className="font-sans text-xs text-[#4D463A] mt-2 text-center leading-snug">
        <p className="opacity-80">{data.groom.child_order || 'Putra sulung (Anak Sasada) dari:'}</p>
        {data.groom.parent_father || data.groom.parent_mother ? (
          <>
            {data.groom.parent_father && (
              <p className="font-bold text-[#201B11] mt-0.5 break-words [overflow-wrap:anywhere]">
                {data.groom.parent_father}
              </p>
            )}
            {data.groom.parent_father && data.groom.parent_mother && (
              <p className="opacity-75 text-[11px]">&amp;</p>
            )}
            {data.groom.parent_mother && (
              <p className="font-bold text-[#201B11] break-words [overflow-wrap:anywhere]">
                {data.groom.parent_mother}
              </p>
            )}
          </>
        ) : (
          <p className="font-bold text-[#201B11] mt-0.5 break-words [overflow-wrap:anywhere]">
            {data.groom.parent_info || 'Bpk. Ir. Mangantar Siregar & Ibu Donna br. Hutabarat'}
          </p>
        )}
      </div>

      {data.groom.instagram && (
        <a
          href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 font-sans text-xs text-[#85291B] hover:text-[#630F05] font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">alternate_email</span>
          <span>{data.groom.instagram}</span>
        </a>
      )}
    </div>
  );

  const brideCard = (
    <div
      key="bride"
      className="w-full max-w-[340px] bg-[#EDE1D0] text-[#362F25] rounded-2xl p-5 flex flex-col items-center shadow-lg border border-[#85291B]/20 overflow-hidden"
    >
      <div className="w-28 h-36 rounded-t-full rounded-b-lg overflow-hidden shadow-md mb-3 p-0.5 bg-[#85291B] shrink-0">
        <img
          src={
            data.bride.photo_url ||
            data.bride.photo ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuACluK0g8lfNC6qzb0-HsuAuxxdLkgtUyxM9rcegwbzLZGkFWhJelsj4g97nZIA9LnzZ_hGg7SMoYbbVi2nT4sboQjm3991lgQhb3ImR_s4S3duYz_yro4gyK_PzAHM3wLeBc-UAuu5_3XGTfyeP4Xu7OV6wo9mJBgAkwMHDIlHC1HP1YcnK3OsifSacXbZd_ztpfyVoD7kmw_zzr-QOYSRcl-QZPsj573UyPbM9bYlyYO6iQ8v_i6U'
          }
          alt={data.bride.name || 'Bride'}
          className="w-full h-full object-cover object-top rounded-t-full rounded-b-md"
        />
      </div>

      <span className="px-3 py-0.5 bg-[#85291B] text-[#FFDAD4] rounded-full font-sans text-[10px] tracking-widest uppercase mb-1.5 font-bold shadow-xs">
        Boru Ni Raja
      </span>

      <h3 className="font-serif text-lg sm:text-[19px] font-bold text-[#362F25] text-center leading-tight break-words [overflow-wrap:anywhere]">
        {data.bride.full_name || data.bride.name}
      </h3>

      <p className="font-sans text-xs text-[#630F05] font-semibold mt-1">
        Marga: {data.bride.marga || 'Simanjuntak Sitompul'}
      </p>

      <div className="font-sans text-xs text-[#4D463A] mt-2 text-center leading-snug">
        <p className="opacity-80">{data.bride.child_order || 'Putri tercinta (Boru Sasada) dari:'}</p>
        {data.bride.parent_father || data.bride.parent_mother ? (
          <>
            {data.bride.parent_father && (
              <p className="font-bold text-[#201B11] mt-0.5 break-words [overflow-wrap:anywhere]">
                {data.bride.parent_father}
              </p>
            )}
            {data.bride.parent_father && data.bride.parent_mother && (
              <p className="opacity-75 text-[11px]">&amp;</p>
            )}
            {data.bride.parent_mother && (
              <p className="font-bold text-[#201B11] break-words [overflow-wrap:anywhere]">
                {data.bride.parent_mother}
              </p>
            )}
          </>
        ) : (
          <p className="font-bold text-[#201B11] mt-0.5 break-words [overflow-wrap:anywhere]">
            {data.bride.parent_info || 'Bpk. Dr. Tumpal Simanjuntak, Sp.A & Ibu Christine br. Nainggolan'}
          </p>
        )}
      </div>

      {data.bride.instagram && (
        <a
          href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 font-sans text-xs text-[#85291B] hover:text-[#630F05] font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">alternate_email</span>
          <span>{data.bride.instagram}</span>
        </a>
      )}
    </div>
  );

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Salam Pembuka Adat & Kasih */}
      <div className="text-center max-w-[340px] mx-auto mb-7 flex flex-col items-center">
        <GorgaFiligree className="w-14 h-7 text-[#EAC16E] opacity-85 mb-2.5" />

        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#EAC16E] font-semibold mb-3">
          {data.quote_religion === 'islam' ? 'Doa Restu Pernikahan' : 'Salam Sejahtera Dalam Kasih'}
        </span>

        <p className="font-sans text-xs text-[#D1C5B3] leading-relaxed max-w-[310px]">
          Atas Kasih dan Karunia Tuhan Yang Maha Kuasa, dengan penuh rasa syukur dan kerendahan hati kami bermaksud melangsungkan Ibadah Pernikahan Kudus dan Pesta Adat Batak Toba putra-putri kami:
        </p>

        <div className="flex items-center gap-2 mt-4 opacity-40">
          <span className="w-12 h-px bg-[#EAC16E]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#EAC16E]" />
          <span className="w-12 h-px bg-[#EAC16E]" />
        </div>
      </div>

      {/* Header Mempelai */}
      <div className="w-full flex items-center justify-center gap-2 mb-2 text-[#EAC16E]">
        <span className="h-px w-10 bg-[#EAC16E]/40" />
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
          Mempelai Pengantin
        </span>
        <span className="h-px w-10 bg-[#EAC16E]/40" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF6EE] text-center mb-6">
        Anak Ni Raja &amp; Boru Ni Raja
      </h2>

      <div className="w-full flex flex-col gap-5 items-center">
        {isBrideFirst ? [brideCard, <div key="amp" className="font-serif text-[#EAC16E] italic text-3xl -my-1">&amp;</div>, groomCard] : [groomCard, <div key="amp" className="font-serif text-[#EAC16E] italic text-3xl -my-1">&amp;</div>, brideCard]}
      </div>
    </section>
  );
};
