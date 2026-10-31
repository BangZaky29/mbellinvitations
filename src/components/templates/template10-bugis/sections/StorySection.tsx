import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { BugisCornerOrnament } from '../components';

interface StorySectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  const stories = data.love_story || [];

  if (!stories || stories.length === 0) return null;

  return (
    <section className="relative w-full px-4 py-8 bg-[#00170E] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center mb-6">
        <div className="w-9 h-9 rounded-full bg-[#052519] text-[#F2CA50] flex items-center justify-center mb-2 border border-[#F2CA50]/30 shadow-md">
          <span className="material-symbols-outlined text-[19px]">favorite</span>
        </div>
        <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
          Kisah &amp; Memori
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#C8EAD8] font-bold mt-1">
          Jejak Kasih Dua Insan
        </h2>
        <p className="font-sans text-xs text-[#D7C594] mt-1">
          Kisah manis perjalanan cinta yang berlabuh dalam janji suci pernikahan.
        </p>
      </div>

      {/* Dynamic Love Story Timeline with Precision Axis (Rule 7) */}
      <div className="relative w-full max-w-[360px] flex flex-col gap-5">
        {stories.length > 1 && (
          <div className="absolute top-[16px] bottom-[16px] left-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#F2CA50] via-[#D4AF37]/50 to-[#F2CA50]/20 pointer-events-none z-0" />
        )}

        {stories.map((item: any, idx: number) => {
          const year = item.year || item.date || `${2022 + idx}`;
          const title = item.title || `Babak #${idx + 1}`;
          const desc = item.description || item.story || '';

          return (
            <div key={idx} className="relative flex items-start gap-3 z-10">
              {/* Marker Node Column: exactly w-8 (32px), centered at 16px */}
              <div className="w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                <div className="w-6 h-6 rounded-full bg-[#F2CA50] text-[#00170E] flex items-center justify-center shadow-md ring-2 ring-[#F2CA50]/40">
                  <span className="material-symbols-outlined text-[13px] font-bold">
                    favorite
                  </span>
                </div>
              </div>

              {/* Story Content Card (Card Integrity: overflow-hidden, break-words) */}
              <div className="bg-[#052519]/85 backdrop-blur-md rounded-2xl p-4 flex-1 min-w-0 shadow-md border border-[#F2CA50]/25 relative overflow-hidden">
                <BugisCornerOrnament position="top-left" className="absolute top-1 left-1 w-4 h-4 text-[#F2CA50]/25" />
                <BugisCornerOrnament position="top-right" className="absolute top-1 right-1 w-4 h-4 text-[#F2CA50]/25" />

                <span className="font-sans text-[10px] font-bold text-[#F2CA50] tracking-wider uppercase px-2 py-0.5 rounded bg-[#F2CA50]/15 inline-block mb-1">
                  {year}
                </span>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#C8EAD8] break-words [overflow-wrap:anywhere] mt-0.5">
                  {title}
                </h3>

                <p className="font-sans text-xs text-[#D0C5AF]/90 mt-1 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

