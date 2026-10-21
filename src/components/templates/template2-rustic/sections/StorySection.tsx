import React from 'react';
import type { StorySectionProps } from '../../types';

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  return (
    <section className="flex flex-col py-space-xl">
      <div className="text-center mb-space-lg">
        <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
          Our Journey
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
          Kisah Kasih Kami
        </h3>
        <p className="text-xs text-[#4D5E53] mt-1">
          Perjalanan cinta kami hingga melangkah menuju pelaminan suci
        </p>
      </div>

      <div className="relative pl-6 flex flex-col gap-4">
        {/* Vertical Branch Line */}
        <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#8C4E2D]/25 rounded-full"></div>

        {data.love_story.map((story, index) => {
          const iconName =
            story.icon === 'school'
              ? 'school'
              : story.icon === 'favorite'
                ? 'favorite'
                : story.icon === 'loyalty'
                  ? 'loyalty'
                  : index === 0
                    ? 'school'
                    : index === 1
                      ? 'favorite'
                      : 'loyalty';

          const isEven = index % 2 === 0;

          return (
            <div key={index} className="relative flex flex-col bg-white p-5 rounded-2xl shadow-sm border border-[#2C4034]/12">
              <div
                className={`absolute -left-[27px] top-4.5 w-6 h-6 rounded-full ${isEven ? 'bg-[#2C4034] text-white' : 'bg-[#8C4E2D] text-white'
                  } flex items-center justify-center text-xs shadow-xs ring-2 ring-white`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {iconName}
                </span>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-serif text-lg text-[#2C4034] font-bold">
                  {story.title}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5ECE0] text-[#8C4E2D] text-xs font-bold border border-[#DECFBD]">
                  {story.year}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-[#8C4E2D] mb-1.5">
                {story.subtitle}
              </h5>
              <p className="text-xs text-[#4D5E53] leading-relaxed">
                {story.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
