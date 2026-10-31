import React from 'react';

export type LiveStreamVariant =
  | 'modern'
  | 'rustic'
  | 'jawa'
  | 'islami'
  | 'luxury'
  | 'sunda'
  | 'minang'
  | 'batak'
  | 'betawi'
  | 'bugis'
  | 'bali'
  | 'palembang';

interface LiveStreamBannerProps {
  url?: string;
  variant?: LiveStreamVariant;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  className?: string;
}

export const LiveStreamBanner: React.FC<LiveStreamBannerProps> = ({
  url,
  variant = 'modern',
  title,
  subtitle,
  buttonText,
  className = '',
}) => {
  if (!url || !url.trim()) return null;

  const cleanUrl = url.trim();

  // Deteksi platform siaran
  const getPlatformDetails = () => {
    const lower = cleanUrl.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      return { platform: 'YouTube Live', icon: 'play_circle' };
    }
    if (lower.includes('zoom.us')) {
      return { platform: 'Zoom Meeting', icon: 'videocam' };
    }
    if (lower.includes('instagram.com')) {
      return { platform: 'Instagram Live', icon: 'camera_alt' };
    }
    if (lower.includes('meet.google.com')) {
      return { platform: 'Google Meet', icon: 'video_call' };
    }
    if (lower.includes('tiktok.com')) {
      return { platform: 'TikTok Live', icon: 'live_tv' };
    }
    return { platform: 'Live Stream', icon: 'sensors' };
  };

  const { platform, icon } = getPlatformDetails();

  // Konfigurasi per varian tema
  const variantStyles: Record<
    LiveStreamVariant,
    {
      card: string;
      iconBox: string;
      iconText: string;
      platformBadge: string;
      title: string;
      subtitle: string;
      button: string;
      defaultTitle: string;
      defaultSubtitle: string;
      defaultBtn: string;
    }
  > = {
    modern: {
      card: 'bg-neutral-900 border border-neutral-700/80 text-white shadow-xl',
      iconBox: 'bg-red-500/20 border border-red-500/40 text-red-500',
      iconText: 'text-red-400',
      platformBadge: 'bg-white/10 text-white/80 border-white/15',
      title: 'text-white',
      subtitle: 'text-neutral-400',
      button: 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-md',
      defaultTitle: 'Saksikan Siaran Langsung',
      defaultSubtitle: 'Hadir secara daring untuk menyaksikan momen bahagia kami',
      defaultBtn: 'Tonton Siaran',
    },
    rustic: {
      card: 'bg-[#FAF7F2] border border-[#8C4E2D]/25 text-[#2C4034] shadow-md',
      iconBox: 'bg-[#8C4E2D]/15 border border-[#8C4E2D]/30 text-[#8C4E2D]',
      iconText: 'text-[#8C4E2D]',
      platformBadge: 'bg-[#8C4E2D]/10 text-[#8C4E2D] border-[#8C4E2D]/20',
      title: 'text-[#2C4034]',
      subtitle: 'text-[#2C4034]/70',
      button: 'bg-[#8C4E2D] hover:bg-[#733D1F] text-white shadow-xs',
      defaultTitle: 'Siaran Langsung Acara',
      defaultSubtitle: 'Hadir & berbagi doa bersama secara daring dari mana saja',
      defaultBtn: 'Saksikan Live',
    },
    jawa: {
      card: 'bg-[#1C1612] border border-[#F3D068]/35 text-[#FAF6F0] shadow-xl',
      iconBox: 'bg-[#F3D068]/15 border border-[#F3D068]/40 text-[#F3D068]',
      iconText: 'text-[#F3D068]',
      platformBadge: 'bg-[#F3D068]/15 text-[#F3D068] border-[#F3D068]/30',
      title: 'text-[#FAF6F0] font-serif',
      subtitle: 'text-[#D4AF37]/80',
      button: 'bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-[#14100D] font-bold shadow-md hover:brightness-105',
      defaultTitle: 'Pawiwahan Live Streaming',
      defaultSubtitle: 'Mirsani siaran langsung pahargyan saking tebih',
      defaultBtn: 'Mirsani Siaran',
    },
    islami: {
      card: 'bg-[#032e24] border border-[#D4AF37]/30 text-white shadow-xl',
      iconBox: 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E5C378]',
      iconText: 'text-[#E5C378]',
      platformBadge: 'bg-[#D4AF37]/20 text-[#E5C378] border-[#D4AF37]/30',
      title: 'text-white font-serif',
      subtitle: 'text-emerald-100/75',
      button: 'bg-[#D4AF37] hover:bg-[#c49f2e] text-[#032e24] font-bold shadow-md',
      defaultTitle: 'Siaran Langsung Walimah',
      defaultSubtitle: 'Saksikan prosesi akad nikah & doa restu secara daring',
      defaultBtn: 'Saksikan Siaran',
    },
    luxury: {
      card: 'bg-[#0e0e11] border border-[#D4AF37]/45 text-white shadow-2xl ring-1 ring-[#D4AF37]/20',
      iconBox: 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB]',
      iconText: 'text-[#F3E5AB]',
      platformBadge: 'bg-[#D4AF37]/15 text-[#F3E5AB] border-[#D4AF37]/30',
      title: 'text-white font-serif tracking-wide',
      subtitle: 'text-stone-400',
      button: 'bg-gradient-to-r from-[#E5C378] to-[#D4AF37] text-neutral-950 font-bold shadow-lg hover:brightness-110',
      defaultTitle: 'Exclusive Wedding Livestream',
      defaultSubtitle: 'Join us live and witness the sacred moments in real-time',
      defaultBtn: 'Watch Live',
    },
    sunda: {
      card: 'bg-white border border-[#c5a059]/40 text-[#2B231D] shadow-md',
      iconBox: 'bg-[#8a6822]/15 border border-[#8a6822]/30 text-[#8a6822]',
      iconText: 'text-[#8a6822]',
      platformBadge: 'bg-[#8a6822]/10 text-[#8a6822] border-[#8a6822]/25',
      title: 'text-[#2B231D] font-serif',
      subtitle: 'text-[#735855]',
      button: 'bg-[#8a6822] hover:bg-[#745517] text-white shadow-xs',
      defaultTitle: "Siaran Langsung Walimatul 'Ursy",
      defaultSubtitle: 'Nyakseni momen ijab kabul sacara online kalayan khidmat',
      defaultBtn: 'Tonton Siaran',
    },
    minang: {
      card: 'bg-[#2E0A10] border border-[#D4AF37]/50 text-[#FAF6EE] shadow-xl',
      iconBox: 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5E296]',
      iconText: 'text-[#F5E296]',
      platformBadge: 'bg-[#D4AF37]/15 text-[#F5E296] border-[#D4AF37]/30',
      title: 'text-[#FAF6EE] font-serif',
      subtitle: 'text-[#FAF6EE]/75',
      button: 'bg-gradient-to-r from-[#D4AF37] to-[#F5E296] text-[#2E0A10] font-bold shadow-md hover:brightness-105',
      defaultTitle: 'Siaran Langsung Baralek Gadang',
      defaultSubtitle: 'Manyaksikan prosesi ijab kabul & alek sacara daring',
      defaultBtn: 'Saksikan Alek',
    },
    batak: {
      card: 'bg-[#261E1A] border border-[#EAC16E]/40 text-[#FAF6EE] shadow-xl',
      iconBox: 'bg-[#85291B] border border-[#EAC16E]/40 text-[#EAC16E]',
      iconText: 'text-[#EAC16E]',
      platformBadge: 'bg-[#EAC16E]/15 text-[#EAC16E] border-[#EAC16E]/30',
      title: 'text-[#FAF6EE] font-serif',
      subtitle: 'text-[#D1C5B3]',
      button: 'bg-[#85291B] hover:bg-[#9c3020] text-[#FFDAD4] border border-[#EAC16E]/40 font-bold shadow-md',
      defaultTitle: 'Siaran Langsung Ulaon Unjuk',
      defaultSubtitle: 'Manonton siaran langsung pamasu-masuon sacara daring',
      defaultBtn: 'Saksikan Siaran',
    },
    betawi: {
      card: 'bg-[#410403] border border-[#FED65B]/40 text-[#FAF6EE] shadow-xl',
      iconBox: 'bg-[#5E1914] border border-[#FED65B]/40 text-[#FED65B]',
      iconText: 'text-[#FED65B]',
      platformBadge: 'bg-[#FED65B]/20 text-[#FFE088] border-[#FED65B]/30',
      title: 'text-[#FCF9F3] font-serif',
      subtitle: 'text-[#E5E2DC]/80',
      button: 'bg-[#FED65B] hover:bg-[#FFE088] text-[#410403] font-bold shadow-md',
      defaultTitle: 'Siaran Langsung Hajatan Betawi',
      defaultSubtitle: 'Saksikan momen sakral akad & walimah secara daring',
      defaultBtn: 'Tonton Siaran',
    },
    bugis: {
      card: 'bg-[#052519] border border-[#F2CA50]/40 text-[#C8EAD8] shadow-xl',
      iconBox: 'bg-[#F2CA50]/15 border border-[#F2CA50]/40 text-[#F2CA50]',
      iconText: 'text-[#F2CA50]',
      platformBadge: 'bg-[#F2CA50]/20 text-[#FFE088] border-[#F2CA50]/30',
      title: 'text-[#C8EAD8] font-serif',
      subtitle: 'text-[#D0C5AF]/85',
      button: 'bg-[#F2CA50] hover:bg-[#FFE088] text-[#00170E] font-bold shadow-md',
      defaultTitle: 'Siaran Langsung Tudang Bottung',
      defaultSubtitle: 'Saksikan perhelatan agung adat Bugis-Makassar secara daring',
      defaultBtn: 'Tonton Siaran',
    },
    bali: {
      card: 'bg-[#411710] border border-[#D4AF37]/45 text-[#FFF9EF] shadow-xl',
      iconBox: 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FED65B]',
      iconText: 'text-[#FED65B]',
      platformBadge: 'bg-[#D4AF37]/20 text-[#FFE088] border-[#D4AF37]/30',
      title: 'text-[#FFF9EF] font-serif',
      subtitle: 'text-[#F3EDE4]/85',
      button: 'bg-gradient-to-r from-[#D4AF37] to-[#FED65B] hover:brightness-105 text-[#411710] font-bold shadow-md',
      defaultTitle: 'Pawiwahan Ageng Live Streaming',
      defaultSubtitle: 'Saksikan prosesi sakral Dharma Yadnya Pawiwahan secara daring',
      defaultBtn: 'Tonton Siaran',
    },
    palembang: {
      card: 'bg-[#4A0E12] border border-[#FFD57A]/40 text-[#FDF9F2] shadow-xl',
      iconBox: 'bg-[#FFD57A]/20 border border-[#FFD57A]/40 text-[#FFD57A]',
      iconText: 'text-[#FFD57A]',
      platformBadge: 'bg-[#FFD57A]/20 text-[#FFD57A] border-[#FFD57A]/30',
      title: 'text-[#FDF9F2] font-serif',
      subtitle: 'text-[#F1EDE6]/85',
      button: 'bg-gradient-to-r from-[#EAC168] to-[#FFD57A] hover:brightness-105 text-[#2A0003] font-bold shadow-md',
      defaultTitle: 'Siaran Langsung Prosesi Munggah & Akad',
      defaultSubtitle: 'Saksikan sakralnya prosesi adat Palembang Darussalam secara daring',
      defaultBtn: 'Tonton Siaran',
    },
  };

  const currentTheme = variantStyles[variant] || variantStyles.modern;
  const displayTitle = title || currentTheme.defaultTitle;
  const displaySubtitle = subtitle || currentTheme.defaultSubtitle;
  const displayBtn = buttonText || currentTheme.defaultBtn;

  return (
    <div
      className={`w-full max-w-[360px] mx-auto p-4 sm:p-4.5 rounded-2xl transition-all duration-300 ${currentTheme.card} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon & Live Pulse Indicator */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${currentTheme.iconBox}`}
          >
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
          {/* Animated Pulsing Red Live Badge */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white/60"></span>
          </span>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase border ${currentTheme.platformBadge}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              {platform}
            </span>
          </div>
          <h4 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-1 ${currentTheme.title}`}>
            {displayTitle}
          </h4>
          <p className={`text-[11px] leading-relaxed line-clamp-2 mt-0.5 ${currentTheme.subtitle}`}>
            {displaySubtitle}
          </p>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        <span className="text-[10px] opacity-70 tracking-wide flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">tap_and_play</span>
          <span>Dapat diakses publik</span>
        </span>
        <a
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all active:scale-95 cursor-pointer ${currentTheme.button}`}
        >
          <span>{displayBtn}</span>
          <span className="material-symbols-outlined text-xs">open_in_new</span>
        </a>
      </div>
    </div>
  );
};
