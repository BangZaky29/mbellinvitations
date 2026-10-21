import React from 'react';
import type { CoupleSectionProps, CoupleInfo } from '../../types';

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
  firstPerson: rawFirst,
  secondPerson: rawSecond,
  firstPersonRole,
  secondPersonRole,
}) => {
  const isBrideFirst = Boolean(data?.is_bride_first);
  const defaultFirst = isBrideFirst ? data?.bride : data?.groom;
  const defaultSecond = isBrideFirst ? data?.groom : data?.bride;

  const firstPerson: CoupleInfo = rawFirst || defaultFirst || {
    name: isBrideFirst ? 'Mempelai Wanita' : 'Mempelai Pria',
    full_name: isBrideFirst ? 'Mempelai Wanita' : 'Mempelai Pria',
    child_order: isBrideFirst ? 'Putri pertama' : 'Putra pertama',
    parent_father: 'Bapak',
    parent_mother: 'Ibu',
    parent_info: '',
    instagram: '',
  };

  const secondPerson: CoupleInfo = rawSecond || defaultSecond || {
    name: isBrideFirst ? 'Mempelai Pria' : 'Mempelai Wanita',
    full_name: isBrideFirst ? 'Mempelai Pria' : 'Mempelai Wanita',
    child_order: isBrideFirst ? 'Putra pertama' : 'Putri pertama',
    parent_father: 'Bapak',
    parent_mother: 'Ibu',
    parent_info: '',
    instagram: '',
  };

  const resolvedFirstRole = firstPersonRole || (isBrideFirst ? 'Sang Mempelai Wanita' : 'Sang Mempelai Pria');
  const resolvedSecondRole = secondPersonRole || (isBrideFirst ? 'Sang Mempelai Pria' : 'Sang Mempelai Wanita');

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

      {/* Person 1 Card */}
      <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-5 shadow-lg shadow-primary/5 flex flex-col items-center text-center mb-6 border border-secondary-container/20 reveal-left delay-100">
        <div className="w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden bg-surface-container mb-4 shadow-sm">
          <img
            alt={firstPerson.full_name || firstPerson.name}
            className="w-full h-full object-cover object-top"
            src={
              firstPerson.photo_url ||
              firstPerson.photo ||
              data?.couple_photo ||
              data?.cover_image ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        {resolvedFirstRole && (
          <span className="font-label-sm text-xs text-secondary uppercase font-semibold mb-1">
            {resolvedFirstRole}
          </span>
        )}
        <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
          {firstPerson.full_name || firstPerson.name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-4">
          {firstPerson.child_order && (
            <>
              {firstPerson.child_order} <br />
            </>
          )}
          {firstPerson.parent_info ? (
            <span className="font-semibold text-on-surface">{firstPerson.parent_info}</span>
          ) : (
            <>
              {firstPerson.parent_father && (
                <span className="font-semibold text-on-surface">
                  {firstPerson.parent_father}
                </span>
              )}
              {firstPerson.parent_father && firstPerson.parent_mother && (
                <> &amp; <br /></>
              )}
              {firstPerson.parent_mother && (
                <span className="font-semibold text-on-surface">
                  {firstPerson.parent_mother}
                </span>
              )}
            </>
          )}
        </p>
        {firstPerson.instagram && (
          <a
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm"
            href={`https://instagram.com/${firstPerson.instagram.replace(
              '@',
              ''
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[16px]">
              photo_camera
            </span>
            <span>{firstPerson.instagram}</span>
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

      {/* Person 2 Card */}
      <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-5 shadow-lg shadow-primary/5 flex flex-col items-center text-center mt-4 border border-secondary-container/20 reveal-right delay-300">
        <div className="w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden bg-surface-container mb-4 shadow-sm">
          <img
            alt={secondPerson.full_name || secondPerson.name}
            className="w-full h-full object-cover object-top"
            src={
              secondPerson.photo_url ||
              secondPerson.photo ||
              data?.couple_photo ||
              data?.cover_image ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        {resolvedSecondRole && (
          <span className="font-label-sm text-xs text-secondary uppercase font-semibold mb-1">
            {resolvedSecondRole}
          </span>
        )}
        <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
          {secondPerson.full_name || secondPerson.name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-4">
          {secondPerson.child_order && (
            <>
              {secondPerson.child_order} <br />
            </>
          )}
          {secondPerson.parent_info ? (
            <span className="font-semibold text-on-surface">{secondPerson.parent_info}</span>
          ) : (
            <>
              {secondPerson.parent_father && (
                <span className="font-semibold text-on-surface">
                  {secondPerson.parent_father}
                </span>
              )}
              {secondPerson.parent_father && secondPerson.parent_mother && (
                <> &amp; <br /></>
              )}
              {secondPerson.parent_mother && (
                <span className="font-semibold text-on-surface">
                  {secondPerson.parent_mother}
                </span>
              )}
            </>
          )}
        </p>
        {secondPerson.instagram && (
          <a
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm"
            href={`https://instagram.com/${secondPerson.instagram.replace(
              '@',
              ''
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[16px]">
              photo_camera
            </span>
            <span>{secondPerson.instagram}</span>
          </a>
        )}
      </div>
    </section>
  );
};
