import React from 'react';
import type { StorySectionProps } from '../../types';

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  if (!data.love_story || data.love_story.length === 0) return null;

  return (
    <section className="w-full px-margin py-12 relative z-10" id="story">
      <div className="text-center mb-10">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          Our Chapters
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          A JOURNEY WRITTEN IN THE STARS
        </h2>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-6 flex flex-col gap-9 max-w-[360px] mx-auto">
        {/* Continuous luminous spine */}
        <div className="absolute top-2 bottom-4 left-[11px] w-[1px] bg-gradient-to-b from-primary via-secondary-fixed-dim/30 to-primary/80"></div>

        {data.love_story.map((milestone, idx) => (
          <div key={idx} className="relative flex flex-col">
            <div className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-surface flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(226,199,146,0.8)]"></div>
            </div>
            <div className="rounded-xl bg-surface-container-low/70 backdrop-blur-md p-4 ml-2 shadow-lg border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-label-md text-primary font-medium text-xs">
                  {milestone.year}
                </span>
                <span className="font-label-sm text-secondary text-[10px]">
                  {milestone.subtitle}
                </span>
              </div>
              <h4 className="font-headline-sm text-on-surface text-base mb-1">
                {milestone.title}
              </h4>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
