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
  return (
    <div
      className={`w-full max-w-[340px] xl:max-w-[360px] flex items-center justify-between mb-3 px-3 py-1.5 rounded-2xl transition-all ${
        onClose
          ? 'bg-neutral-900/90 text-white border border-white/20 shadow-2xl backdrop-blur-md'
          : 'bg-white shadow-xs border border-stone-200/80 text-stone-900'
      }`}
    >
      <div className="flex items-center gap-1.5">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all active:scale-95 cursor-pointer border border-white/10 shrink-0"
            title="Kembali ke Dashboard Editor"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Kembali</span>
          </button>
        ) : (
          <span className="font-label-sm text-xs text-stone-500 font-medium">Tampilan:</span>
        )}

        <div
          className={`flex items-center p-0.5 rounded-xl border ${
            onClose
              ? 'bg-neutral-800 border-white/10'
              : 'bg-stone-100 border-stone-200/70'
          }`}
        >
          <button
            type="button"
            onClick={() => setIsCoverOpen(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              !isCoverOpen
                ? onClose
                  ? 'bg-white text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 text-white font-semibold shadow-xs'
                : onClose
                ? 'text-neutral-300 hover:text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Lihat Sampul Pembuka (Cover Gate)"
          >
            Sampul
          </button>
          <button
            type="button"
            onClick={() => setIsCoverOpen(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isCoverOpen
                ? onClose
                  ? 'bg-white text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 text-white font-semibold shadow-xs'
                : onClose
                ? 'text-neutral-300 hover:text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Lihat Isi Lengkap Undangan"
          >
            Isi Undangan
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setDeviceMode('ios')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            deviceMode === 'ios'
              ? onClose
                ? 'text-white bg-white/20 font-bold'
                : 'text-stone-900 bg-stone-100 font-bold'
              : onClose
              ? 'text-neutral-400 hover:text-white'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="iOS View"
        >
          <span className="material-symbols-outlined text-[17px]">phone_iphone</span>
        </button>
        <button
          type="button"
          onClick={() => setDeviceMode('android')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            deviceMode === 'android'
              ? onClose
                ? 'text-white bg-white/20 font-bold'
                : 'text-stone-900 bg-stone-100 font-bold'
              : onClose
              ? 'text-neutral-400 hover:text-white'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Android View"
        >
          <span className="material-symbols-outlined text-[17px]">smartphone</span>
        </button>
        <span className={`w-px h-3.5 mx-0.5 ${onClose ? 'bg-white/20' : 'bg-stone-200'}`} />
        <button
          type="button"
          onClick={() => replayUniversalScrollAnimation()}
          className={`p-1.5 rounded-lg transition-colors active:scale-90 cursor-pointer ${
            onClose ? 'text-neutral-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Kembalikan ke Sampul & Putar Ulang Animasi"
        >
          <span className="material-symbols-outlined text-[17px]">play_circle</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className={`p-1.5 rounded-lg transition-colors active:rotate-180 cursor-pointer ${
            onClose ? 'text-neutral-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Muat Ulang Preview dari Awal"
        >
          <span className="material-symbols-outlined text-[17px]">refresh</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 ml-1 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
            title="Tutup Pratinjau"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
