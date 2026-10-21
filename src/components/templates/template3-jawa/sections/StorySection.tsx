import React from 'react';
import type { StorySectionProps } from '../../types';

export const StorySection: React.FC<StorySectionProps> = ({ data }) => {
  return (
    <section className="relative w-full bg-[#14100D] px-margin py-space-xl">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-[#FFE082] font-semibold block mb-1">
          Cariyos Katresnan
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#FAF6F0] drop-shadow-sm">
          Lampahing Katresnan
        </h2>
        <p className="text-xs text-[#D4AF37] italic mt-1 font-serif">
          Jejak langkah takdir tumuju marang janji suci
        </p>
      </div>

      <div className="relative pl-6 space-y-6">
        {/* Golden connecting line */}
        <div className="absolute top-3 bottom-3 left-[11px] w-[2px] bg-gradient-to-b from-[#F3D068] via-[#D4AF37] to-[#F3D068]/20"></div>

        {data.love_story.map((story, index) => {
          const iconName =
            story.icon === 'explore'
              ? 'explore'
              : story.icon === 'favorite'
              ? 'favorite'
              : story.icon === 'church'
              ? 'church'
              : index === 0
              ? 'explore'
              : index === 1
              ? 'favorite'
              : 'church';

          return (
            <div key={index} className="relative flex flex-col">
              <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-[#1C1612] border border-[#F3D068] flex items-center justify-center shadow-md">
                {index === 0 && (
                  <span className="absolute w-3.5 h-3.5 rounded-full bg-[#F3D068]/60 animate-ping pointer-events-none" />
                )}
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#F3D068] shrink-0" />
              </div>
              <div className="bg-[#1C1612] rounded-2xl p-5 shadow-xl border border-[#F3D068]/30 ml-2 text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#FFE082] font-bold uppercase tracking-wider">
                    {story.year} • {story.title}
                  </span>
                  <span className="material-symbols-outlined text-xs text-[#F3D068]">
                    {iconName}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-white mt-1">
                  {story.subtitle}
                </h4>
                <p className="font-sans text-xs text-[#FAF6F0]/90 mt-2 leading-relaxed">
                  {story.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
