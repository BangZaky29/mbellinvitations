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
    parent_father: '',
    parent_mother: '',
    parent_info: '',
    instagram: '',
  };

  const secondPerson: CoupleInfo = rawSecond || defaultSecond || {
    name: isBrideFirst ? 'Mempelai Pria' : 'Mempelai Wanita',
    full_name: isBrideFirst ? 'Mempelai Pria' : 'Mempelai Wanita',
    child_order: isBrideFirst ? 'Putra pertama' : 'Putri pertama',
    parent_father: '',
    parent_mother: '',
    parent_info: '',
    instagram: '',
  };

  const resolvedFirstRole = firstPersonRole || (isBrideFirst ? 'Sang Mempelai Wanita' : 'Sang Mempelai Pria');
  const resolvedSecondRole = secondPersonRole || (isBrideFirst ? 'Sang Mempelai Pria' : 'Sang Mempelai Wanita');

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
                firstPerson.photo ||
                data?.couple_photo ||
                data?.cover_image ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
              }
              alt={firstPerson.full_name || firstPerson.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium">
            {resolvedFirstRole}
          </span>
          <h3 className="font-editorial text-2xl text-charcoal-dark font-medium mt-1">
            {firstPerson.full_name || firstPerson.name}
          </h3>

          <p className="text-xs text-charcoal-muted font-light mt-3 leading-relaxed">
            {firstPerson.child_order && (
              <>
                {firstPerson.child_order}
                <br />
              </>
            )}
            {firstPerson.parent_info ? (
              <span className="font-medium text-charcoal-dark">{firstPerson.parent_info}</span>
            ) : (
              <>
                {firstPerson.parent_father && (
                  <span className="font-medium text-charcoal-dark">{firstPerson.parent_father}</span>
                )}
                {firstPerson.parent_father && firstPerson.parent_mother && ' & '}
                {firstPerson.parent_mother && (
                  <span className="font-medium text-charcoal-dark">{firstPerson.parent_mother}</span>
                )}
              </>
            )}
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
                secondPerson.photo ||
                data?.couple_photo ||
                data?.cover_image ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
              }
              alt={secondPerson.full_name || secondPerson.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium">
            {resolvedSecondRole}
          </span>
          <h3 className="font-editorial text-2xl text-charcoal-dark font-medium mt-1">
            {secondPerson.full_name || secondPerson.name}
          </h3>

          <p className="text-xs text-charcoal-muted font-light mt-3 leading-relaxed">
            {secondPerson.child_order && (
              <>
                {secondPerson.child_order}
                <br />
              </>
            )}
            {secondPerson.parent_info ? (
              <span className="font-medium text-charcoal-dark">{secondPerson.parent_info}</span>
            ) : (
              <>
                {secondPerson.parent_father && (
                  <span className="font-medium text-charcoal-dark">{secondPerson.parent_father}</span>
                )}
                {secondPerson.parent_father && secondPerson.parent_mother && ' & '}
                {secondPerson.parent_mother && (
                  <span className="font-medium text-charcoal-dark">{secondPerson.parent_mother}</span>
                )}
              </>
            )}
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
