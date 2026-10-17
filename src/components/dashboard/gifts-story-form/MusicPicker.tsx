import React, { useState } from 'react';

interface MusicPickerProps {
  musicUrl?: string;
  onMusicUrlChange: (url: string) => void;
  onSaveMusic?: () => void;
}

export const MusicPicker: React.FC<MusicPickerProps> = ({
  musicUrl,
  onMusicUrlChange,
  onSaveMusic,
}) => {
  const [musicSavedSuccess, setMusicSavedSuccess] = useState(false);

  const handleSaveMusicAction = (url: string) => {
    onMusicUrlChange(url);
    if (onSaveMusic) {
      onSaveMusic();
    }
    setMusicSavedSuccess(true);
    setTimeout(() => setMusicSavedSuccess(false), 3500);
  };

  return (
    <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/70">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600 text-[22px]">smart_display</span>
          <h3 className="text-sm font-bold text-stone-900">
            Musik Latar Undangan (YouTube Backsound)
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <span className="material-symbols-outlined text-xs">play_circle</span>
          <span>Khusus Link YouTube</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs text-stone-700 font-medium flex items-center gap-1.5">
          <span className="text-red-600 font-bold">YouTube URL:</span>
          <span>Masukkan tautan video musik atau lagu pernikahan dari YouTube</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
              link
            </span>
            <input
              type="url"
              value={musicUrl || ''}
              onChange={(e) => onMusicUrlChange(e.target.value)}
              placeholder="cth: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              handleSaveMusicAction('https://www.youtube.com/watch?v=2Vv-BfVoq4g')
            }
            className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
            title="Gunakan lagu romantis pernikahan pilihan dari YouTube"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-500">auto_awesome</span>
            <span>Preset Romantis</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveMusicAction(musicUrl || '')}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs hover:shadow-sm transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>Simpan Musik</span>
          </button>
        </div>
        <p className="text-[11px] text-stone-500">
          Mendukung format link YouTube biasa, YouTube Music, dan YouTube Shorts. Musik akan otomatis diputar saat cover undangan dibuka oleh tamu.
        </p>

        {musicSavedSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in duration-300">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
            <span>Tautan musik YouTube berhasil disimpan &amp; disinkronkan ke undangan! Musik akan berbunyi otomatis saat cover dibuka.</span>
          </div>
        )}
      </div>
    </div>
  );
};
