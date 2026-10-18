import React from 'react';
import { replayUniversalScrollAnimation } from '../../../utils/scrollAnimationEngine';

interface PreviewToolbarProps {
  onClose?: () => void;
  isCoverOpen: boolean;
  setIsCoverOpen: (val: boolean) => void;
  deviceMode: 'ios' | 'android';
  setDeviceMode: (val: 'ios' | 'android') => void;
  onRefresh: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  onClose,
  isCoverOpen,
  setIsCoverOpen,
  deviceMode,
  setDeviceMode,
  onRefresh,
}) => {
  const handleOpenContent = () => {
    setIsCoverOpen(true);
    setTimeout(() => {
      const scrollables = document.querySelectorAll(
        '[data-phone-scroll="true"], #phone-screen-scroll-container, [data-phone-preview="true"] .overflow-y-auto'
      );
      scrollables.forEach((s) => {
        s.scrollTop = 0;
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mbell_cover_opened'));
      }
    }, 40);
  };

  return (
    <div
      className={`w-full max-w-[370px] sm:max-w-[390px] xl:max-w-[400px] h-11 flex items-center justify-between mb-3 px-2 sm:px-2.5 rounded-2xl transition-all select-none ${
        onClose
          ? 'bg-neutral-900/95 text-white border border-white/15 shadow-2xl backdrop-blur-xl'
          : 'bg-white/95 shadow-xs border border-stone-200/90 text-stone-900 backdrop-blur-md'
      }`}
    >
      {/* BAGIAN KIRI: TOMBOL KEMBALI & SEGMENTED NAV */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-white/10 shrink-0"
            title="Kembali ke Dashboard Editor"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          </button>
        )}

        {/* SEGMENTED TAB: SAMPUL VS ISI UNDANGAN */}
        <div
          className={`flex items-center p-0.5 rounded-xl border shrink-0 ${
            onClose
              ? 'bg-neutral-800/90 border-white/10'
              : 'bg-stone-100/90 border-stone-200/80'
          }`}
        >
          <button
            type="button"
            onClick={() => setIsCoverOpen(false)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center justify-center leading-none ${
              !isCoverOpen
                ? onClose
                  ? 'bg-white text-neutral-950 font-bold shadow-xs'
                  : 'bg-stone-900 text-white font-bold shadow-xs'
                : onClose
                ? 'text-neutral-400 hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Lihat Sampul Pembuka (Cover Gate)"
          >
            Sampul
          </button>
          <button
            type="button"
            onClick={handleOpenContent}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center justify-center leading-none ${
              isCoverOpen
                ? onClose
                  ? 'bg-white text-neutral-950 font-bold shadow-xs'
                  : 'bg-stone-900 text-white font-bold shadow-xs'
                : onClose
                ? 'text-neutral-400 hover:text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Lihat Isi Lengkap Undangan"
          >
            Isi Undangan
          </button>
        </div>
      </div>

      {/* BAGIAN KANAN: DEVICE SWITCHER, PLAY ANIMATION & REFRESH */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-2">
        {/* Device Mode Toggle Pill */}
        <div
          className={`flex items-center p-0.5 rounded-lg border ${
            onClose
              ? 'bg-neutral-800/80 border-white/10'
              : 'bg-stone-100/80 border-stone-200/70'
          }`}
        >
          <button
            type="button"
            onClick={() => setDeviceMode('ios')}
            className={`w-6 h-6 rounded-md transition-all cursor-pointer flex items-center justify-center ${
              deviceMode === 'ios'
                ? onClose
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : onClose
                ? 'text-neutral-400 hover:text-white'
                : 'text-stone-400 hover:text-stone-700'
            }`}
            title="Tampilan iOS (Dynamic Island)"
          >
            <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('android')}
            className={`w-6 h-6 rounded-md transition-all cursor-pointer flex items-center justify-center ${
              deviceMode === 'android'
                ? onClose
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : onClose
                ? 'text-neutral-400 hover:text-white'
                : 'text-stone-400 hover:text-stone-700'
            }`}
            title="Tampilan Android (Punch Hole)"
          >
            <span className="material-symbols-outlined text-[15px]">smartphone</span>
          </button>
        </div>

        {/* Separator Divider */}
        <span className={`w-px h-3.5 mx-0.5 ${onClose ? 'bg-white/15' : 'bg-stone-200'}`} />

        {/* Play / Replay Animation */}
        <button
          type="button"
          onClick={() => replayUniversalScrollAnimation()}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
            onClose
              ? 'text-neutral-300 hover:text-white hover:bg-white/10'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
          }`}
          title="Putar Ulang Efek Animasi"
        >
          <span className="material-symbols-outlined text-[16px]">play_circle</span>
        </button>

        {/* Refresh Preview */}
        <button
          type="button"
          onClick={onRefresh}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-all active:rotate-180 cursor-pointer flex items-center justify-center ${
            onClose
              ? 'text-neutral-300 hover:text-white hover:bg-white/10'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
          }`}
          title="Muat Ulang Pratinjau dari Awal"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
        </button>
      </div>
    </div>
  );
};
