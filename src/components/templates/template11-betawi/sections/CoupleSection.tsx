import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';

interface CoupleSectionProps {
  data: InvitationData;
  firstPerson?: CoupleInfo | { name: string; full_name?: string };
  secondPerson?: CoupleInfo | { name: string; full_name?: string };
  coupleOrderTitle?: string;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
}) => {
  const isBrideFirst = data.is_bride_first === true;

  const groom = data.groom || ({} as any);
  const bride = data.bride || ({} as any);

  const groomName = groom.full_name || groom.name || 'Muhammad Rizky Pratama, S.T., M.B.A.';
  const groomPhoto =
    groom.photo_url ||
    (groom as any).photo ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDvj315uDZXn4l54Z9rsWz5dxN7n1zN6tQMm75ogSwJUInNGK1hhmHf6v0uR63NqNlWYEdx7GfC5FRRfz22O-XrVEB2UiUv6bF3KzWX4qTDz_vB0uBhihZ2WueUDeU6-9cZka5s-Sf1fXL3bTJZ4TA9lPUir3qSMU-cVBi7FpLjbVxc6dWUjwZEs3UibXHSv5LVy-fL3OSpjqL7Tv68q1htN-U8JB0wHQY4Qhi-US6bkcKfe7JNpZF3';
  const groomChildOrder = groom.child_order || 'Putra pertama dari';
  const groomParents =
    groom.parent_info ||
    (groom.parent_father && groom.parent_mother
      ? `${groom.parent_father} & ${groom.parent_mother}`
      : groom.parent_father || groom.parent_mother || '');
  const groomInstagram = groom.instagram ? groom.instagram.replace(/^@/, '') : '';

  const brideName = bride.full_name || bride.name || 'Siti Fatimah Azzahra, S.I.Kom.';
  const bridePhoto =
    bride.photo_url ||
    (bride as any).photo ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJsZ0fracfQoJP0PD9qX30gLxdwMBTZCCNdrQYozJXO6ZSzs-T02oubQQGtFZMzLl5yr508GBmd-MSK3lNDAmgi-TaYhhfs-CxXU2_VDmJUhI-i2wuo-wzh88Ldo3-GhDESotkfsBISYuwpMjbr6ZG6k8WUvF5mE2BBC65K4EoS2qM--XXXRE0vUWH2_J6kSl9EBEFLi9MM9Wh1jI-pC9SpSgdfxqLNmiW349uwvI-NnuEdif6RAGa';
  const brideChildOrder = bride.child_order || 'Putri bungsu dari';
  const brideParents =
    bride.parent_info ||
    (bride.parent_father && bride.parent_mother
      ? `${bride.parent_father} & ${bride.parent_mother}`
      : bride.parent_father || bride.parent_mother || '');
  const brideInstagram = bride.instagram ? bride.instagram.replace(/^@/, '') : '';

  const renderGroomCard = () => (
    <div
      key="groom"
      className="w-full bg-white p-5 rounded-2xl shadow-sm border border-[#E5E2DC] flex flex-col items-center text-center relative overflow-hidden"
    >
      <div className="w-28 h-36 rounded-t-full overflow-hidden shadow-md mb-3 bg-[#5E1914] p-1 border border-[#FED65B]/40">
        <img
          alt={groomName}
          className="w-full h-full object-cover rounded-t-full"
          src={groomPhoto}
        />
      </div>
      <span className="font-sans text-[10.5px] font-bold tracking-[0.2em] text-[#735c00] uppercase mb-1">
        MEMPELAI PRIA • ABANG JAKARTA
      </span>
      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#410403] mb-1 break-words [overflow-wrap:anywhere]">
        {groomName}
      </h2>
      {groomParents && (
        <p className="font-serif text-xs text-[#554240] max-w-[280px] mb-3 leading-relaxed break-words [overflow-wrap:anywhere]">
          {groomChildOrder ? `${groomChildOrder} ` : ''}{groomParents}
        </p>
      )}
      {groomInstagram && (
        <a
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0EEE8] text-[#554240] text-xs font-sans hover:text-[#410403] hover:bg-[#FED65B]/30 transition-all border border-[#E5E2DC]"
          href={`https://instagram.com/${groomInstagram}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[15px]">alternate_email</span>
          <span className="font-medium">{groomInstagram}</span>
        </a>
      )}
    </div>
  );

  const renderBrideCard = () => (
    <div
      key="bride"
      className="w-full bg-white p-5 rounded-2xl shadow-sm border border-[#E5E2DC] flex flex-col items-center text-center relative overflow-hidden"
    >
      <div className="w-28 h-36 rounded-t-full overflow-hidden shadow-md mb-3 bg-[#5E1914] p-1 border border-[#FED65B]/40">
        <img
          alt={brideName}
          className="w-full h-full object-cover rounded-t-full"
          src={bridePhoto}
        />
      </div>
      <span className="font-sans text-[10.5px] font-bold tracking-[0.2em] text-[#735c00] uppercase mb-1">
        MEMPELAI WANITA • NONE JAKARTA
      </span>
      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#410403] mb-1 break-words [overflow-wrap:anywhere]">
        {brideName}
      </h2>
      {brideParents && (
        <p className="font-serif text-xs text-[#554240] max-w-[280px] mb-3 leading-relaxed break-words [overflow-wrap:anywhere]">
          {brideChildOrder ? `${brideChildOrder} ` : ''}{brideParents}
        </p>
      )}
      {brideInstagram && (
        <a
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0EEE8] text-[#554240] text-xs font-sans hover:text-[#410403] hover:bg-[#FED65B]/30 transition-all border border-[#E5E2DC]"
          href={`https://instagram.com/${brideInstagram}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[15px]">alternate_email</span>
          <span className="font-medium">{brideInstagram}</span>
        </a>
      )}
    </div>
  );

  return (
    <section className="relative w-full bg-[#FCF9F3] text-[#1C1C18] px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[360px] flex flex-col gap-4">
        {isBrideFirst ? (
          <>
            {renderBrideCard()}
            {/* Betawi Love Knot Divider */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-px w-12 bg-[#FED65B]" />
              <span className="material-symbols-outlined text-[#5E1914] text-[18px]">
                favorite
              </span>
              <div className="h-px w-12 bg-[#FED65B]" />
            </div>
            {renderGroomCard()}
          </>
        ) : (
          <>
            {renderGroomCard()}
            {/* Betawi Love Knot Divider */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-px w-12 bg-[#FED65B]" />
              <span className="material-symbols-outlined text-[#5E1914] text-[18px]">
                favorite
              </span>
              <div className="h-px w-12 bg-[#FED65B]" />
            </div>
            {renderBrideCard()}
          </>
        )}
      </div>
    </section>
  );
};
