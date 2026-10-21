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

  const resolvedFirstRole = firstPersonRole || (isBrideFirst ? 'The Bride' : 'The Groom');
  const resolvedSecondRole = secondPersonRole || (isBrideFirst ? 'The Groom' : 'The Bride');

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

      {/* Person 1 Card */}
      <div className="w-full max-w-[340px] rounded-xl bg-surface-container-low/80 backdrop-blur-lg overflow-hidden p-5 flex flex-col items-center text-center shadow-xl shadow-surface-container-lowest/50 mb-6 border border-white/5">
        <div className="w-36 h-48 rounded-lg overflow-hidden mb-4 shadow-lg bg-surface-container">
          <img
            alt={firstPerson.full_name || firstPerson.name}
            className="w-full h-full object-cover filter contrast-[1.05]"
            src={
              firstPerson.photo_url ||
              firstPerson.photo ||
              data?.couple_photo ||
              data?.cover_image ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        <span className="font-label-eyebrow text-primary text-[10px] tracking-widest uppercase mb-1">
          {resolvedFirstRole}
        </span>
        <h3 className="font-headline-sm text-on-surface text-lg mb-1">
          {firstPerson.full_name || firstPerson.name}
        </h3>
        <p className="font-body-sm text-secondary text-xs mb-4">
          {firstPerson.child_order && (
            <>
              {firstPerson.child_order} <br />
            </>
          )}
          {firstPerson.parent_info ? (
            <span>{firstPerson.parent_info}</span>
          ) : (
            <>
              {firstPerson.parent_father && <span>{firstPerson.parent_father}</span>}
              {firstPerson.parent_father && firstPerson.parent_mother && ' & '}
              {firstPerson.parent_mother && <span>{firstPerson.parent_mother}</span>}
            </>
          )}
        </p>
        {firstPerson.instagram && (
          <a
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary text-xs font-label-md tracking-wider transition-colors"
            href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-sm text-primary">
              alternate_email
            </span>
            <span>{firstPerson.instagram.replace('@', '')}</span>
          </a>
        )}
      </div>

      {/* Delicate Monogram Ampersand */}
      <div className="my-2 flex items-center justify-center">
        <span className="font-headline-lg text-primary/70 italic text-3xl select-none">
          &amp;
        </span>
      </div>

      {/* Person 2 Card */}
      <div className="w-full max-w-[340px] rounded-xl bg-surface-container-low/80 backdrop-blur-lg overflow-hidden p-5 flex flex-col items-center text-center shadow-xl shadow-surface-container-lowest/50 mt-2 border border-white/5">
        <div className="w-36 h-48 rounded-lg overflow-hidden mb-4 shadow-lg bg-surface-container">
          <img
            alt={secondPerson.full_name || secondPerson.name}
            className="w-full h-full object-cover filter contrast-[1.05]"
            src={
              secondPerson.photo_url ||
              secondPerson.photo ||
              data?.couple_photo ||
              data?.cover_image ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
            }
          />
        </div>
        <span className="font-label-eyebrow text-primary text-[10px] tracking-widest uppercase mb-1">
          {resolvedSecondRole}
        </span>
        <h3 className="font-headline-sm text-on-surface text-lg mb-1">
          {secondPerson.full_name || secondPerson.name}
        </h3>
        <p className="font-body-sm text-secondary text-xs mb-4">
          {secondPerson.child_order && (
            <>
              {secondPerson.child_order} <br />
            </>
          )}
          {secondPerson.parent_info ? (
            <span>{secondPerson.parent_info}</span>
          ) : (
            <>
              {secondPerson.parent_father && <span>{secondPerson.parent_father}</span>}
              {secondPerson.parent_father && secondPerson.parent_mother && ' & '}
              {secondPerson.parent_mother && <span>{secondPerson.parent_mother}</span>}
            </>
          )}
        </p>
        {secondPerson.instagram && (
          <a
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary text-xs font-label-md tracking-wider transition-colors"
            href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-sm text-primary">
              alternate_email
            </span>
            <span>{secondPerson.instagram.replace('@', '')}</span>
          </a>
        )}
      </div>
    </section>
  );
};
