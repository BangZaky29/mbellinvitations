import React from 'react';
import type { StorySectionProps } from '../../types';

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  if (!data.love_story || data.love_story.length === 0) return null;

  return (
    <section className="px-margin py-space-xl flex flex-col">
      <div className="text-center mb-8">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Kisah Perjalanan
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Our Halal Journey
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-secondary-container">
        {data.love_story.map((story, idx) => (
          <div key={idx} className="relative flex flex-col">
            <div className="absolute -left-[29px] top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[13px]">
                {story.icon || 'favorite'}
              </span>
            </div>
            <div className="rounded-t-2xl rounded-b-xl bg-surface-container-lowest p-4 shadow-sm border border-secondary-container/20">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">
                  {story.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-[11px] font-medium">
                  {story.year}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {story.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
