import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface MinangClosingProps extends BaseSectionProps {
  coupleOrderTitle: string;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const ClosingFooterSection: React.FC<MinangClosingProps> = ({
  data,
  coupleOrderTitle,
  renderBrandFooter,
}) => {
  return (
    <footer
      className="text-center pt-8 pb-12 px-5 bg-[#1B0609] text-[#FAF6EE] bg-texture-noise border-t border-[#D4AF37]/30 relative"
      style={{ backgroundColor: '#1B0609', color: '#FAF6EE' }}
    >
      {/* Center Couple Portrait Oval Frame */}
      <div className="w-20 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-b from-[#F5E296] via-[#D4AF37] to-[#7D5C1E] shadow-gold-glow">
        <img
          src={
            data.couple_photo ||
            data.cover_image ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDgLnqV_U-riKLNLyLBn6NqnwbV933vGSbT-EUd-TBZFqnAU5xn0G99ZpdiU9-SarwFoKF-rUdaFpjhH3LP6818oBvzB3x4mBJ2fsEovR541jqP3cdVPTqZZb-V02Q2stPzv8TDvmPdl3zJcBMxU51mwGe51QEqHGwrvm9JtTMhgqO9eiobF4XJVW0uGJ-q4tatqQ1vPUPna0a3xUYSyPsf96p8XYuTP0cqYJD8vKascFqqLcE6FzBA'
          }
          alt={coupleOrderTitle}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
      </div>

      <p className="font-script text-3xl sm:text-4xl text-[#F5E296] mb-1">
        Tarimo Kasih Banyak
      </p>

      <p className="font-serif italic text-[#FAF6EE]/90 text-sm max-w-[280px] mx-auto leading-relaxed">
        "Ateh doa, restu, sarato kahadiran Bapak/Ibu/Saudara/i nan maramikan Alek Gadang kami."
      </p>

      <p className="font-cinzel text-xs text-[#D4AF37] font-bold tracking-widest uppercase mt-5">
        Kami nan Babahagia,
      </p>

      <p className="font-serif text-2xl font-bold text-gold-shimmer tracking-wider mt-1">
        {coupleOrderTitle}
      </p>

      <p className="font-sans text-[11px] text-[#FAF6EE]/70 mt-1">
        Beserta Kaluarga Gadang Chaniago &amp; Koto
      </p>

      <div className="mt-8 pt-4 border-t border-[#D4AF37]/20 text-center text-[10px] text-[#FAF6EE]/50 font-sans">
        Baralek Gadang Minangkabau Digital Invitation • 2026
      </div>

      {/* Mbell Official Brand Footer */}
      <div className="mt-4">
        {renderBrandFooter({ theme: 'dark' })}
      </div>
    </footer>
  );
};

export default ClosingFooterSection;
