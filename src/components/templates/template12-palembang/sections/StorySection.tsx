import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
  PalembangCornerFiligree,
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
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="font-sans text-[10px] text-[#785A05] uppercase tracking-[0.2em] font-bold">
            Untaian Takdir • Sungai Musi
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#4A0E12] mt-1">
            Cerita Cinta Kami
          </h3>
          <p className="font-sans text-xs text-[#544342] mt-1.5 leading-relaxed">
            Langkah perjalanan hati hingga berlabuh di pelaminan agung
          </p>
          <RumahLimasDivider compact className="mt-2" />
        </div>

        {/* Vertical Timeline */}
        <div className="relative w-full pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#FFD57A]">
          {stories.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Timeline Center Node */}
              <div className="absolute -left-[29px] top-1.5 w-5 h-5 rounded-full bg-[#785A05] flex items-center justify-center shadow-md border border-[#FFD57A]">
                <span className="w-2 h-2 rounded-full bg-[#FDF9F2]" />
              </div>

              {/* Story Card (Generous Padding & Anti-Overflow) */}
              <div className="relative bg-[#FFFFFF] border border-[#FFD57A]/40 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden">
                <PalembangCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-4 h-4 opacity-70" color="#785A05" />
                <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-4 h-4 opacity-70" color="#785A05" />

                <div className="mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F7F3EC] text-[#785A05] text-[10px] font-sans font-bold tracking-wider border border-[#FFD57A]/40">
                    {item.year || `Babak ${idx + 1}`}
                  </span>
                </div>

                <h4 className="font-serif text-base sm:text-lg font-bold text-[#4A0E12] break-words [overflow-wrap:anywhere] leading-snug">
                  {item.title}
                </h4>

                <p className="font-sans text-xs sm:text-[13px] text-[#544342] mt-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {item.story || item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

