import React from 'react';
import type { InvitationData, CoupleInfo } from '../../../../types/invitation';
import {
  PalembangCornerFiligree,
  PalembangSongketWatermark,
} from '../components';

interface CoupleSectionProps {
  data: InvitationData;
  firstPerson: CoupleInfo | { name: string; full_name?: string };
  secondPerson: CoupleInfo | { name: string; full_name?: string };
  coupleOrderTitle?: string;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  data,
}) => {
  const isBrideFirst = Boolean(data.is_bride_first);

  const groom = data.groom;
  const bride = data.bride;

  const renderGroomCard = () => (
    <div className="w-full bg-[#FFFFFF] border border-[#FFD57A]/45 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden">
      {/* Decorative Corner Filigrees */}
      <PalembangCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 opacity-70" color="#785A05" />
      <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 opacity-70" color="#785A05" />

      {/* Profile Photo */}
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-4 bg-[#4A0E12] p-1 border-2 border-[#FFD57A]">
        <img
          src={
            groom.photo_url ||
            groom.photo ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBtkeawZsxXK8Vh7J0px2hri_9qkQJL7RoPNNQU3Bbin2dEwWum2MpOf70rzq1dj6K3ufrEmyAiNtc6CcPniF--DetWbdlqf7LGkbKWufpTw43j29rgWRuySZ1wzWCHuT3iuzXQOcGYVSLN1LZ3kB1dDiXbhzyKHXzVcyAzIErVyEkdVhCa4jC2Wwj1diG50Q4_YXEgI9H5MOLm2wa2xmhVDiXTMT-JJcSpDPL5m-EVb3PlbBzOpLwG'
          }
          alt={groom.full_name}
          className="w-full h-full object-cover object-top rounded-full"
        />
      </div>

      <span className="font-sans text-[10px] text-[#785A05] tracking-[0.2em] uppercase font-bold mb-1">
        Mempelai Pria
      </span>
      <h3 className="font-serif text-lg sm:text-xl text-[#4A0E12] font-bold break-words [overflow-wrap:anywhere]">
        {groom.full_name}
      </h3>

      <p className="font-sans text-xs text-[#544342] mt-2 max-w-[280px] leading-relaxed break-words [overflow-wrap:anywhere]">
        {groom.child_order || 'Putra sulung dari:'}
        <br />
        <span className="text-[#1C1C18] font-semibold">
          {groom.parent_father}
        </span>{' '}
        &amp;{' '}
        <span className="text-[#1C1C18] font-semibold">
          {groom.parent_mother}
        </span>
      </p>

      {groom.instagram && (
        <a
          href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F3EC] text-[#4A0E12] font-sans text-xs tracking-wider border border-[#FFD57A]/40 hover:bg-[#FFD57A]/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-[#785A05]">
            alternate_email
          </span>
          <span className="font-semibold">{groom.instagram}</span>
        </a>
      )}
    </div>
  );

  const renderBrideCard = () => (
    <div className="w-full bg-[#FFFFFF] border border-[#FFD57A]/45 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden">
      {/* Decorative Corner Filigrees */}
      <PalembangCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 opacity-70" color="#785A05" />
      <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 opacity-70" color="#785A05" />

      {/* Profile Photo */}
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-4 bg-[#4A0E12] p-1 border-2 border-[#FFD57A]">
        <img
          src={
            bride.photo_url ||
            bride.photo ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWtjU5TX5OYbELr_sliov4ZkbyMtbDcst5INcKMuL42oRm5XpUlM8wlbmyS8MOrj-XiPT6uoNv3UU-L9dxfSWDyeDhVpz-Gpn0R2wU-IkXuUPsbfT_IQwqWp3anMIgDrMOSNsuxoiD1gTWf5JTDQBvUzx3hDDz42AxVLDFn9XlhqXC0hvVnD3Wtp1HxQo3BCPZEU6kBAL6NDPIdQJBHlZ13ZSzLQNxUowzozjPY727GEgaYWfyfb3O'
          }
          alt={bride.full_name}
          className="w-full h-full object-cover object-top rounded-full"
        />
      </div>

      <span className="font-sans text-[10px] text-[#785A05] tracking-[0.2em] uppercase font-bold mb-1">
        Mempelai Wanita
      </span>
      <h3 className="font-serif text-lg sm:text-xl text-[#4A0E12] font-bold break-words [overflow-wrap:anywhere]">
        {bride.full_name}
      </h3>

      <p className="font-sans text-xs text-[#544342] mt-2 max-w-[280px] leading-relaxed break-words [overflow-wrap:anywhere]">
        {bride.child_order || 'Putri kedua dari:'}
        <br />
        <span className="text-[#1C1C18] font-semibold">
          {bride.parent_father}
        </span>{' '}
        &amp;{' '}
        <span className="text-[#1C1C18] font-semibold">
          {bride.parent_mother}
        </span>
      </p>

      {bride.instagram && (
        <a
          href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F3EC] text-[#4A0E12] font-sans text-xs tracking-wider border border-[#FFD57A]/40 hover:bg-[#FFD57A]/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-[#785A05]">
            alternate_email
          </span>
          <span className="font-semibold">{bride.instagram}</span>
        </a>
      )}
    </div>
  );

  return (
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 pt-4 pb-12 flex flex-col items-center overflow-hidden">
      {/* Background Ambience */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col gap-6 items-center">
        {/* First Person */}
        {isBrideFirst ? renderBrideCard() : renderGroomCard()}

        {/* Sacred Binding Ornament (Center Medallion) */}
        <div className="flex items-center justify-center gap-3 w-full">
          <span className="w-16 h-px bg-[#FFD57A]" />
          <div className="w-8 h-8 rounded-full bg-[#4A0E12] text-[#FFD57A] flex items-center justify-center shadow-md border border-[#FFD57A]">
            <span className="material-symbols-outlined text-[16px]">favorite</span>
          </div>
          <span className="w-16 h-px bg-[#FFD57A]" />
        </div>

        {/* Second Person */}
        {isBrideFirst ? renderGroomCard() : renderBrideCard()}
      </div>

      {/* Deckled Transition returning to Lacquer Crimson */}
      <div className="w-full overflow-hidden leading-none -mb-12 mt-10 pointer-events-none select-none text-[#4A0E12]">
        <svg className="w-full h-7 block" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 430 28">
          <path d="M0,28 C42,10 88,24 135,11 C172,2 210,18 248,8 C285,0 328,16 368,9 C400,2 418,12 430,28 L430,28 L0,28 Z" />
        </svg>
      </div>
    </section>
  );
};

