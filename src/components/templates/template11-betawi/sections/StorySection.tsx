import React from 'react';
import type { InvitationData } from '../../../../types/invitation';

interface StorySectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  if (!data.love_story || data.love_story.length === 0) return null;

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#FCF9F3] text-[#1C1C18]">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex items-center gap-1.5 mb-1 text-[#735c00]">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
            JEJAK LANGKAH CINTA
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410403]">
          Kisah Kasih Abang &amp; None
        </h2>
        <p className="font-serif text-xs text-[#554240] italic mt-1 max-w-[300px]">
          Perjalanan takdir dua insan menyatukan rasa menuju pelaminan agung
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative w-full max-w-[360px] flex flex-col gap-5">
        {/* Continuous luminous spine: perfectly centered at left-4 (16px) */}
        {data.love_story.length > 1 && (
          <div className="absolute top-[18px] bottom-[18px] left-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#FED65B] via-[#5E1914] to-[#FED65B] opacity-40 pointer-events-none z-0" />
        )}

        {data.love_story.map((milestone, idx) => {
          const displayTitle = milestone.title || milestone.subtitle || `Momen #${idx + 1}`;
          const displayStory = milestone.description || milestone.story || '';

          return (
            <div key={idx} className="relative flex items-start gap-3 z-10 group">
              {/* Timeline Marker Node Column: exactly w-8 (32px), centered at 16px */}
              <div className="w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-[#5E1914] flex items-center justify-center shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#FED65B]" />
                </div>
              </div>

              {/* Story Content Card */}
              <div className="bg-white rounded-2xl p-4 flex-1 min-w-0 shadow-sm border border-[#E5E2DC] hover:border-[#FED65B] transition-colors overflow-hidden">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5E1914] text-[#FED65B] font-sans text-[10px] font-bold tracking-widest uppercase border border-[#FED65B]/40 shadow-2xs">
                    Tahun {milestone.year}
                  </span>
                  <span className="material-symbols-outlined text-xs text-[#735c00]">
                    loyalty
                  </span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#410403] leading-snug break-words [overflow-wrap:anywhere]">
                  {displayTitle}
                </h3>

                {displayStory && (
                  <p className="font-serif text-xs text-[#554240] mt-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {displayStory}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StorySection;
