import React from 'react';
import type { CoupleSectionProps } from '../../types';

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
  firstPerson,
  secondPerson,
  firstPersonRole,
  secondPersonRole,
}) => {
  return (
    <section id="couple" className="py-12 px-6">
      <div className="text-center mb-10 reveal">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Maha Suci Allah
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Mempelai Pengantin
        </h2>
        <p className="text-xs text-charcoal-muted mt-2 max-w-[300px] mx-auto font-light leading-relaxed">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengikat janji suci pernikahan:
        </p>
      </div>

      <div className="space-y-8">
        {/* Person 1 Card */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col items-center text-center reveal-left delay-100">
          <div className="w-48 h-64 rounded-xl overflow-hidden shadow-inner border border-border-subtle mb-5">
            <img
              src={
                firstPerson.photo_url ||
                (firstPerson as any).photo ||
                data.couple_photo ||
                data.cover_image ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
              }
              alt={firstPerson.full_name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium">
            {firstPersonRole}
          </span>
          <h3 className="font-editorial text-2xl text-charcoal-dark font-medium mt-1">
            {firstPerson.full_name}
          </h3>

          <p className="text-xs text-charcoal-muted font-light mt-3 leading-relaxed">
            {firstPerson.child_order}<br />
            <span className="font-medium text-charcoal-dark">{firstPerson.parent_father}</span> &amp;<br />
            <span className="font-medium text-charcoal-dark">{firstPerson.parent_mother}</span>
          </p>

          {firstPerson.instagram && (
            <a
              href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-border-subtle hover:border-gold-champagne text-xs text-charcoal-dark hover:text-gold-champagne transition-colors"
            >
              <i className="fa-brands fa-instagram text-sm"></i>
              <span className="font-medium text-[11px] tracking-wider">{firstPerson.instagram}</span>
            </a>
          )}
        </div>

        {/* Ampersand Graphic Divider */}
        <div className="text-center py-1 reveal-scale delay-200">
          <span className="font-editorial italic text-3xl text-gold-champagne">&amp;</span>
        </div>

        {/* Person 2 Card */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col items-center text-center reveal-right delay-300">
          <div className="w-48 h-64 rounded-xl overflow-hidden shadow-inner border border-border-subtle mb-5">
            <img
              src={
                secondPerson.photo_url ||
                (secondPerson as any).photo ||
                data.couple_photo ||
                data.cover_image ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
              }
              alt={secondPerson.full_name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium">
            {secondPersonRole}
          </span>
          <h3 className="font-editorial text-2xl text-charcoal-dark font-medium mt-1">
            {secondPerson.full_name}
          </h3>

          <p className="text-xs text-charcoal-muted font-light mt-3 leading-relaxed">
            {secondPerson.child_order}<br />
            <span className="font-medium text-charcoal-dark">{secondPerson.parent_father}</span> &amp;<br />
            <span className="font-medium text-charcoal-dark">{secondPerson.parent_mother}</span>
          </p>

          {secondPerson.instagram && (
            <a
              href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-border-subtle hover:border-gold-champagne text-xs text-charcoal-dark hover:text-gold-champagne transition-colors"
            >
              <i className="fa-brands fa-instagram text-sm"></i>
              <span className="font-medium text-[11px] tracking-wider">{secondPerson.instagram}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
