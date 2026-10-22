import React from 'react';
import type { BaseSectionProps, CoupleInfo } from '../../types';
import { GonjongRoofSvg, MinangCornerStar } from '../components';

export interface MinangCoverProps extends BaseSectionProps {
  firstPerson: CoupleInfo;
  secondPerson: CoupleInfo;
  coupleOrderTitle: string;
  weddingDateStr: string;
  venueCity: string;
  recipientName: string;
  handleOpenInvitation: () => void;
  renderSwipeHint: (options?: any) => React.ReactNode;
}

export const CoverSection: React.FC<MinangCoverProps> = ({
  data,
  coupleOrderTitle,
  recipientName,
  isPreview,
  handleOpenInvitation,
  renderSwipeHint,
}) => {
  return (
    <section
      id="sampul"
      className="w-full h-full min-h-full relative flex flex-col items-center justify-between px-6 pt-6 pb-8 text-center bg-[#1B0609] text-[#FAF6EE] bg-texture-noise overflow-hidden"
      style={{ backgroundColor: '#1B0609', color: '#FAF6EE' }}
    >
      {/* Background Cover Overlay if image provided */}
      {(data.cover_image || data.couple_photo) && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={data.cover_image || data.couple_photo}
            alt="Minangkabau Royal Backdrop"
            className="w-full h-full object-cover opacity-20 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B0609]/95 via-[#2E0A10]/90 to-[#1B0609]" />
        </div>
      )}

      {/* Top Header: Gonjong Silhouette & Royal Minang Badge */}
      <div className="relative z-10 pt-3 shrink-0 flex flex-col items-center">
        <div className="text-[#D4AF37] mb-1.5 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] animate-float-gonjong">
          <GonjongRoofSvg className="w-24 h-9" />
        </div>

        <div className="inline-block px-4 py-1 rounded-full border border-[#D4AF37]/50 bg-[#2E0A10]/80 backdrop-blur-sm shadow-sm">
          <p className="font-cinzel text-[10px] tracking-[0.28em] text-[#F5E296] uppercase font-semibold">
            Baralek Gadang Minangkabau
          </p>
        </div>
      </div>

      {/* Center Arch Photo Frame with Golden Filigree */}
      <div className="relative z-10 my-2 flex flex-col items-center justify-center max-w-[280px]">
        <div className="p-1.5 rounded-t-[170px] rounded-b-[20px] bg-gradient-to-b from-[#F5E296] via-[#D4AF37] to-[#7D5C1E] shadow-gold-glow">
          <div className="p-1 rounded-t-[164px] rounded-b-[16px] bg-[#2E0A10]">
            <div className="overflow-hidden rounded-t-[160px] rounded-b-[12px] relative aspect-[3/4.1] w-56 sm:w-60">
              <img
                src={
                  data.cover_image ||
                  data.couple_photo ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgLnqV_U-riKLNLyLBn6NqnwbV933vGSbT-EUd-TBZFqnAU5xn0G99ZpdiU9-SarwFoKF-rUdaFpjhH3LP6818oBvzB3x4mBJ2fsEovR541jqP3cdVPTqZZb-V02Q2stPzv8TDvmPdl3zJcBMxU51mwGe51QEqHGwrvm9JtTMhgqO9eiobF4XJVW0uGJ-q4tatqQ1vPUPna0a3xUYSyPsf96p8XYuTP0cqYJD8vKascFqqLcE6FzBA'
                }
                alt={coupleOrderTitle}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E0A10]/90 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 inset-x-0 text-center px-3">
                <span className="font-serif italic text-[#F5E296] text-xs tracking-widest drop-shadow-md">
                  ~ Saikek Bak Siriah, Sarumpun Bak Sarai ~
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Filigree Stars */}
        <div className="absolute -top-1 -left-2 pointer-events-none">
          <MinangCornerStar className="w-7 h-7 text-[#D4AF37] opacity-90 drop-shadow" />
        </div>
        <div className="absolute -top-1 -right-2 pointer-events-none">
          <MinangCornerStar className="w-7 h-7 text-[#D4AF37] opacity-90 drop-shadow" />
        </div>
      </div>

      {/* Bottom Guest Pass & CTA Button */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center space-y-2.5 shrink-0">
        <div className="w-full p-3.5 rounded-xl bg-[#2E0A10]/95 backdrop-blur-md shadow-xl text-center flex flex-col items-center border border-[#D4AF37]/50">
          <span className="text-[10px] text-[#FAF6EE]/70 tracking-widest uppercase mb-1 font-sans">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <h3 className="font-cinzel text-sm sm:text-base text-[#F5E296] font-bold tracking-wider line-clamp-1">
            {recipientName}
          </h3>
          {(Boolean(data.guest_code) || isPreview) && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[#F5E296] border border-[#D4AF37]/40 text-[10px] font-mono">
              <span className="material-symbols-outlined text-[13px]">qr_code</span>
              <span>INVITATION PASS: {data.guest_code || 'VIP-BARALEK'}</span>
            </div>
          )}
          <p className="text-[9.5px] text-[#FAF6EE]/60 mt-1 italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-3.5 px-6 rounded-full gold-gradient-btn text-[#1B0609] font-cinzel font-bold text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ring-1 ring-white/30 hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          <span>Buka Undangan</span>
          <span className="material-symbols-outlined text-[17px]">arrow_downward</span>
        </button>

        {/* Swipe Hint */}
        {renderSwipeHint({ variant: 'gold' })}
      </div>
    </section>
  );
};

export default CoverSection;
