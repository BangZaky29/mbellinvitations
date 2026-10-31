import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  PalembangCornerFiligree,
  PalembangSongketWatermark,
} from '../components';

interface QuoteSectionProps {
  data: InvitationData;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ data }) => {
  const pantunText =
    data.quote ||
    '“Kapal berlayar ke Sungai Musi,\nsinggah sebentar di Pulau Kemaro.\nNiat suci mematri janji,\nmohon doa restu sanak dan dulur.”';

  const holyText =
    data.quote_source ||
    'QS. Ar-Rum: 21 — “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”';

  return (
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 pt-6 pb-10 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Tepak Sirih Ceremonial Emblem */}
        <div className="flex flex-col items-center mb-4 text-[#785A05]">
          <svg className="w-14 h-14 drop-shadow-sm" fill="none" viewBox="0 0 56 56">
            <rect fill="currentColor" fillOpacity="0.12" height="18" rx="2" width="36" x="10" y="24" />
            <path d="M8 24 L28 14 L48 24 L28 34 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M8 24 L28 14 L48 24" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 24 V38 C8 40 10 42 12 42 H44 C46 42 48 40 48 38 V24" stroke="currentColor" strokeWidth="1.4" />
            <path d="M28 14 V34" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1.2" />
            {/* Golden Sirih Leaf Silhouette */}
            <path d="M28 8 C23 11 22 17 28 22 C34 17 33 11 28 8 Z" fill="currentColor" />
          </svg>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#785A05] mt-1 font-bold">
            Sekapur Sirih Doa Restu
          </span>
        </div>

        {/* Single Quote Card: Pantun Palembang & Ayat Suci (Rule 1 & 13) */}
        <div className="relative w-full bg-[#F7F3EC] border border-[#FFD57A]/50 rounded-2xl p-5 sm:p-6 text-center shadow-md overflow-hidden">
          {/* Corner Filigrees */}
          <PalembangCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#785A05" />
          <PalembangCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#785A05" />
          <PalembangCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#785A05" />
          <PalembangCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#785A05" />

          {/* Arabic Scripture if available */}
          {data.quote_arabic && (
            <p className="font-serif text-lg text-[#4A0E12] leading-loose mb-3 dir-rtl font-semibold">
              {data.quote_arabic}
            </p>
          )}

          {/* Palembang Welcoming Pantun */}
          <p className="font-serif text-base sm:text-lg text-[#4A0E12] italic font-semibold leading-relaxed mb-3 whitespace-pre-line">
            {pantunText}
          </p>

          <div className="w-16 h-px bg-[#FFD57A] mx-auto my-3" />

          {/* Quranic Translation */}
          <p className="font-sans text-xs text-[#544342] leading-relaxed break-words [overflow-wrap:anywhere]">
            {holyText}
          </p>
        </div>
      </div>
    </section>
  );
};

