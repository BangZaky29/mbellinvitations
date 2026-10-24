import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { GorgaFiligree } from '../components/GorgaFiligree';

interface StorySectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  if (!data.love_story || data.love_story.length === 0) return null;

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Ornamen Gorga & Eyebrow */}
      <div className="flex flex-col items-center text-center mb-6">
        <GorgaFiligree className="w-12 h-6 text-[#EAC16E] opacity-80 mb-2" />
        <div className="flex items-center gap-2 mb-1 text-[#EAC16E]">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
            Parjalanan Holong
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide mt-1">
          Kisah Kasih &amp; Perjalanan Cinta
        </h2>
        <p className="font-sans text-xs text-[#D1C5B3] italic mt-1 max-w-[300px]">
          Jejak langkah takdir nan indah menuju ikatan janji suci pernikahan
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative w-full max-w-[360px] flex flex-col gap-5">
        {/* Continuous luminous spine: perfectly centered at left-4 (16px) */}
        {data.love_story.length > 1 && (
          <div className="absolute top-[18px] bottom-[18px] left-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#EAC16E] via-[#C8A253] to-[#85291B] opacity-60 pointer-events-none z-0" />
        )}

        {data.love_story.map((milestone, idx) => {
          const displayTitle = milestone.title || milestone.subtitle || `Momen #${idx + 1}`;
          const displayStory = milestone.description || milestone.story || '';

          return (
            <div key={idx} className="relative flex items-start gap-3 z-10 group">
              {/* Timeline Marker Node Column: exactly w-8 (32px), centered at 16px */}
              <div className="w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                <div className="w-6 h-6 rounded-full bg-[#19120E] border-2 border-[#EAC16E] flex items-center justify-center shadow-[0_0_10px_rgba(234,193,110,0.5)]">
                  <span className="w-2 h-2 rounded-full bg-[#EAC16E]" />
                </div>
              </div>

              {/* Story Content Card */}
              <div className="bg-[#261E1A] rounded-2xl p-4 flex-1 min-w-0 shadow-md border border-[#EAC16E]/20 hover:border-[#EAC16E]/40 transition-colors overflow-hidden">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#85291B]/40 text-[#FFDAD4] font-sans text-[10px] font-bold tracking-widest uppercase border border-[#85291B]/60">
                    Tahun {milestone.year}
                  </span>
                  <span className="material-symbols-outlined text-xs text-[#EAC16E] opacity-70">
                    loyalty
                  </span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#FAF6EE] leading-snug break-words [overflow-wrap:anywhere]">
                  {displayTitle}
                </h3>

                {displayStory && (
                  <p className="font-sans text-xs text-[#D1C5B3] mt-2 leading-relaxed break-words [overflow-wrap:anywhere]">
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
