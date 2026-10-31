import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { BugisCornerOrnament } from '../components';

interface QuoteSectionProps {
  data: InvitationData;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ data }) => {
  const quoteArabic =
    data.quote_arabic ||
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً';

  const quoteText =
    data.quote ||
    '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”';

  const quoteSource = data.quote_source || 'QS. AR-RUM: 21';

  return (
    <section className="relative w-full px-4 py-8 bg-[#00170E] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Bugis Philosophy Banner: Aksara Lontara */}
        <span className="font-serif text-2xl sm:text-3xl text-[#F2CA50] tracking-widest block mb-1">
          ᨔᨗᨄᨀᨈᨕᨘ ᨔᨗᨄᨀᨕᨗᨂᨙ ᨔᨗᨄᨀᨒᨙᨅᨗ
        </span>
        <h2 className="font-serif text-base sm:text-lg text-[#C8EAD8] tracking-wider uppercase font-semibold">
          Sipakatau, Sipakainge, Sipakalebbi
        </h2>
        <p className="font-sans text-xs text-[#D7C594] italic max-w-xs mx-auto mt-1">
          "Saling memanusiakan, saling mengingatkan dalam kebaikan, dan saling memuliakan martabat."
        </p>

        <div className="flex items-center justify-center gap-2 my-4">
          <span className="w-8 h-[1px] bg-[#F2CA50]/40" />
          <span className="text-[#F2CA50] text-xs">◆</span>
          <span className="w-8 h-[1px] bg-[#F2CA50]/40" />
        </div>

        {/* TEPAT 1 Card Doa (Rule 13: Card Doa & Ayat Suci Tunggal) */}
        <div className="relative w-full bg-[#052519]/80 backdrop-blur-md border border-[#F2CA50]/30 rounded-2xl p-5 shadow-lg overflow-hidden text-center">
          <BugisCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#F2CA50]/30" />
          <BugisCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#F2CA50]/30" />

          {/* Ayat Suci Al-Qur'an (RTL Harakat Arabic) */}
          {quoteArabic && (
            <p
              dir="rtl"
              className="font-serif text-base sm:text-lg text-[#F2CA50] leading-loose mb-3 tracking-wide"
            >
              {quoteArabic}
            </p>
          )}

          {/* Terjemahan / Kutipan Restu Cinta */}
          <p className="font-sans text-xs sm:text-[13px] text-[#C8EAD8] leading-relaxed italic break-words [overflow-wrap:anywhere]">
            {quoteText}
          </p>

          <span className="font-sans text-[10px] sm:text-[11px] text-[#D7C594] font-bold tracking-widest uppercase block mt-3">
            — {quoteSource}
          </span>
        </div>
      </div>
    </section>
  );
};

