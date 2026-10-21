import React from 'react';
import type { StorySectionProps } from '../../types';

export const StorySection: React.FC<StorySectionProps> = ({
  data,
}) => {
  return (
    <section id="story" className="py-12 px-6">
      <div className="text-center mb-10 reveal">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Perjalanan Cinta
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Kisah Cinta Kami
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 font-light">
          Setiap langkah membawa kami menuju takdir ini
        </p>
      </div>

      <div className="relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gold-champagne/40 space-y-8">
        {data.love_story.map((story, index) => {
          const isLast = index === data.love_story.length - 1;
          return (
            <div key={index} className="relative group reveal delay-100">
              {/* Timeline Pin */}
              <div
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center ${isLast
                  ? 'bg-gold-champagne text-white shadow-md'
                  : 'bg-alabaster border-2 border-gold-champagne'
                  }`}
              >
                {isLast ? (
                  <i className="fa-solid fa-check text-[10px]"></i>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gold-champagne"></div>
                )}
              </div>

              {/* Card */}
              <div
                className={`bg-white border rounded-xl p-5 shadow-sm ${isLast ? 'border-gold-champagne/40' : 'border-border-subtle'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-gold-champagne tracking-widest uppercase">
                    {story.title}
                  </span>
                  <span
                    className={`text-[10px] tracking-wider px-2 py-0.5 rounded-full ${isLast
                      ? 'bg-charcoal-dark text-white font-medium'
                      : 'bg-alabaster border border-border-subtle text-charcoal-muted'
                      }`}
                  >
                    {story.year}
                  </span>
                </div>
                <h4 className="font-editorial text-xl text-charcoal-dark font-medium">
                  {story.subtitle}
                </h4>
                <p className="text-xs text-charcoal-muted font-light leading-relaxed mt-2">
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
