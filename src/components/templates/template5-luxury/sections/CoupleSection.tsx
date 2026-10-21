import React from 'react';
import type { BaseSectionProps } from '../../types';

export const CoupleSection: React.FC<BaseSectionProps> = ({ data }) => {
  return (
    <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="couple">
      <div className="text-center mb-10">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          The Happy Couple
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          BRIDE &amp; GROOM
        </h2>
        <div className="w-10 h-0.5 bg-primary-container/40 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Groom Card */}
      <div className="w-full max-w-[340px] rounded-xl bg-surface-container-low/80 backdrop-blur-lg overflow-hidden p-5 flex flex-col items-center text-center shadow-xl shadow-surface-container-lowest/50 mb-6 border border-white/5">
        <div className="w-36 h-48 rounded-lg overflow-hidden mb-4 shadow-lg bg-surface-container">
          <img
            alt={data.groom.full_name}
            className="w-full h-full object-cover filter contrast-[1.05]"
            src={
              data.groom.photo_url ||
              (data.groom as any).photo ||
              data.couple_photo ||
              data.cover_image ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        <span className="font-label-eyebrow text-primary text-[10px] tracking-widest uppercase mb-1">
          The Groom
        </span>
        <h3 className="font-headline-sm text-on-surface text-lg mb-1">
          {data.groom.full_name}
        </h3>
        <p className="font-body-sm text-secondary text-xs mb-4">
          {data.groom.child_order} <br />
          {data.groom.parent_father} &amp; {data.groom.parent_mother}
        </p>
        {data.groom.instagram && (
          <a
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary text-xs font-label-md tracking-wider transition-colors"
            href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-sm text-primary">
              alternate_email
            </span>
            <span>{data.groom.instagram.replace('@', '')}</span>
          </a>
        )}
      </div>

      {/* Delicate Monogram Ampersand */}
      <div className="my-2 flex items-center justify-center">
        <span className="font-headline-lg text-primary/70 italic text-3xl select-none">
          &amp;
        </span>
      </div>

      {/* Bride Card */}
      <div className="w-full max-w-[340px] rounded-xl bg-surface-container-low/80 backdrop-blur-lg overflow-hidden p-5 flex flex-col items-center text-center shadow-xl shadow-surface-container-lowest/50 mt-2 border border-white/5">
        <div className="w-36 h-48 rounded-lg overflow-hidden mb-4 shadow-lg bg-surface-container">
          <img
            alt={data.bride.full_name}
            className="w-full h-full object-cover filter contrast-[1.05]"
            src={
              data.bride.photo_url ||
              (data.bride as any).photo ||
              data.couple_photo ||
              data.cover_image ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        <span className="font-label-eyebrow text-primary text-[10px] tracking-widest uppercase mb-1">
          The Bride
        </span>
        <h3 className="font-headline-sm text-on-surface text-lg mb-1">
          {data.bride.full_name}
        </h3>
        <p className="font-body-sm text-secondary text-xs mb-4">
          {data.bride.child_order} <br />
          {data.bride.parent_father} &amp; {data.bride.parent_mother}
        </p>
        {data.bride.instagram && (
          <a
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary text-xs font-label-md tracking-wider transition-colors"
            href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-sm text-primary">
              alternate_email
            </span>
            <span>{data.bride.instagram.replace('@', '')}</span>
          </a>
        )}
      </div>
    </section>
  );
};
