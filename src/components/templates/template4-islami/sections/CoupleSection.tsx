import React from 'react';
import type { CoupleSectionProps } from '../../types';

export const CoupleSection: React.FC<CoupleSectionProps> = ({ data }) => {
  return (
    <section
      className="px-margin py-space-xl flex flex-col items-center"
      id="mempelai"
    >
      <div className="text-center mb-8">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Pasangan Pengantin
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Mempelai Pria &amp; Wanita
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Groom Card */}
      <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-5 shadow-lg shadow-primary/5 flex flex-col items-center text-center mb-6 border border-secondary-container/20 reveal-left delay-100">
        <div className="w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden bg-surface-container mb-4 shadow-sm">
          <img
            alt={data.groom.full_name}
            className="w-full h-full object-cover object-top"
            src={
              data.groom.photo_url ||
              (data.groom as any).photo ||
              data.couple_photo ||
              data.cover_image ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
          {data.groom.full_name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-4">
          {data.groom.child_order} <br />
          <span className="font-semibold text-on-surface">
            {data.groom.parent_father}
          </span>{' '}
          &amp; <br />
          <span className="font-semibold text-on-surface">
            {data.groom.parent_mother}
          </span>
        </p>
        {data.groom.instagram && (
          <a
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm"
            href={`https://instagram.com/${data.groom.instagram.replace(
              '@',
              ''
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[16px]">
              photo_camera
            </span>
            <span>{data.groom.instagram}</span>
          </a>
        )}
      </div>

      {/* Elegant Floral Ampersand Divider */}
      <div className="my-2 flex items-center justify-center reveal-scale delay-200">
        <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center shadow-sm">
          <span className="font-headline-md text-headline-md text-primary font-serif italic">
            &amp;
          </span>
        </div>
      </div>

      {/* Bride Card */}
      <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-5 shadow-lg shadow-primary/5 flex flex-col items-center text-center mt-4 border border-secondary-container/20 reveal-right delay-300">
        <div className="w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden bg-surface-container mb-4 shadow-sm">
          <img
            alt={data.bride.full_name}
            className="w-full h-full object-cover object-top"
            src={
              data.bride.photo_url ||
              (data.bride as any).photo ||
              data.couple_photo ||
              data.cover_image ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
          {data.bride.full_name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-4">
          {data.bride.child_order} <br />
          <span className="font-semibold text-on-surface">
            {data.bride.parent_father}
          </span>{' '}
          &amp; <br />
          <span className="font-semibold text-on-surface">
            {data.bride.parent_mother}
          </span>
        </p>
        {data.bride.instagram && (
          <a
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm"
            href={`https://instagram.com/${data.bride.instagram.replace(
              '@',
              ''
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[16px]">
              photo_camera
            </span>
            <span>{data.bride.instagram}</span>
          </a>
        )}
      </div>
    </section>
  );
};
