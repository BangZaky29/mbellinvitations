import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  BetawiBatikWatermark,
  BetawiCornerFloral,
  BetawiGigiBalangDivider,
} from '../components';

interface QuoteSectionProps {
  data: InvitationData;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ data }) => {
  const quoteTitle = data.quote_title || 'PANTUN PENYAMBUT';
  const quoteArabic = data.quote_arabic;
  const quoteText =
    data.quote ||
    '“Buah manggis buah pepaye,\npohon beringin daunnye lebat.\nKite kumpulin sanak sodare,\nniat baik menyambung hajat.”';
  const quoteSource =
    data.quote_source ||
    'QS. AR-RUM: 21 • “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.”';

  return (
    <section className="relative w-full bg-[#FCF9F3] text-[#1C1C18] px-4 pt-2 pb-6 flex flex-col items-center overflow-hidden">
      {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark (Ivory Tone) */}
      <BetawiBatikWatermark color="#5E1914" opacityClass="opacity-[0.035]" />

      <div className="relative w-full max-w-[360px] bg-white p-5 rounded-2xl shadow-sm border border-[#E5E2DC] flex flex-col items-center text-center overflow-hidden z-10">
        <BetawiCornerFloral position="top-left" className="absolute top-2 left-2 w-6 h-6 text-[#FED65B]/60" />
        <BetawiCornerFloral position="top-right" className="absolute top-2 right-2 w-6 h-6 text-[#FED65B]/60" />

        {/* Title / Badge */}
        <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#735c00] uppercase mb-2">
          {quoteTitle}
        </span>

        {/* Optional Arabic Quranic calligraphy */}
        {quoteArabic && (
          <p
            dir="rtl"
            className="font-serif text-lg sm:text-xl leading-loose text-[#410403] my-2 px-1 font-normal"
          >
            {quoteArabic}
          </p>
        )}

        {/* Pantun or Quote Text */}
        <div className="font-serif text-base sm:text-lg italic text-[#5E1914] leading-relaxed my-2 whitespace-pre-line font-medium">
          {quoteText}
        </div>

        {/* Pernak-pernik Gigi Balang Divider */}
        <BetawiGigiBalangDivider className="w-full my-2.5" color="#5E1914" />

        {/* Quote Source / Tafsir */}
        <p className="font-serif text-xs text-[#554240] leading-relaxed max-w-[300px]">
          {quoteSource}
        </p>
      </div>
    </section>
  );
};
