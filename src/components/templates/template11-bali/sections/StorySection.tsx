import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
} from '../components';

interface StorySectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({
  data,
  theme,
  isSectionActive,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isStoryVisible = isSectionActive
    ? isSectionActive('story')
    : effectiveTheme?.show_love_story !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('story'));

  const stories = data.love_story || [];

  if (!isStoryVisible || stories.length === 0) return null;

  return (
    <section className="relative w-full bg-[#F3EDE4] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.045]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Kisah Kasih • Yadnya Cinta
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            Cerita Cinta Kami
          </h3>
          <p className="font-sans text-xs text-[#524341] mt-1.5 leading-relaxed">
            Jejak langkah pertemuan yang dirajut dalam benang takdir Hyang Widhi
          </p>
          <CandiBentarDivider compact className="mt-2" />
        </div>

        {/* Vertical Timeline (Rule 7) */}
        <div className="relative w-full pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#D4AF37]/50">
          {stories.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Timeline Center Node */}
              <div className="absolute -left-[29px] top-1.5 w-5 h-5 rounded-full bg-[#735C00] flex items-center justify-center shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#FFF9EF]" />
              </div>

              {/* Story Card */}
              <div className="relative bg-[#FFF9EF] border border-[#D4AF37]/35 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden">
                <BaliCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-4 h-4 opacity-70" color="#D4AF37" />
                <BaliCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-4 h-4 opacity-70" color="#D4AF37" />

                <div className="mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3EDE4] text-[#735C00] text-[10px] font-sans font-bold tracking-wider border border-[#D4AF37]/30">
                    {item.year || `Babak ${idx + 1}`}
                  </span>
                </div>

                <h4 className="font-serif text-base sm:text-lg font-bold text-[#411710] break-words [overflow-wrap:anywhere] leading-snug">
                  {item.title}
                </h4>

                <p className="font-sans text-xs sm:text-[13px] text-[#524341] mt-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {item.story}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

