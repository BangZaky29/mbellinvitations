import React, { useState, useEffect } from 'react';

interface MusicPickerProps {
  musicUrl?: string;
  onMusicUrlChange: (url: string) => void;
  onSaveMusic?: (url: string) => void;
}

export interface YouTubeValidationResult {
  isValid: boolean;
  type?: 'standard' | 'short' | 'music' | 'shorts';
  label?: string;
}

/**
 * Mendeteksi & memvalidasi apakah tautan berasal dari domain resmi YouTube:
 * 1. YouTube Standard (youtube.com/watch?v=...)
 * 2. YouTube Shortlink (youtu.be/...)
 * 3. YouTube Music (music.youtube.com/watch?v=...)
 * 4. YouTube Shorts (youtube.com/shorts/...)
 * 5. YouTube Embed (youtube.com/embed/...)
 */
export function validateYouTubeUrl(url: string): YouTubeValidationResult {
  if (!url || !url.trim()) {
    // String kosong dianggap valid (opsional bila user ingin mengosongkan musik)
    return { isValid: true, label: 'Tanpa Musik' };
  }

  const trimmed = url.trim();

  // 1. YouTube Shorts: youtube.com/shorts/<id>
  if (/^https?:\/\/(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i.test(trimmed)) {
    return { isValid: true, type: 'shorts', label: 'YouTube Shorts' };
  }

  // 2. YouTube Music: music.youtube.com/watch?v=<id>
  if (/^https?:\/\/music\.youtube\.com\/(?:watch\?.*v=|embed\/)?([a-zA-Z0-9_-]{11})/i.test(trimmed)) {
    return { isValid: true, type: 'music', label: 'YouTube Music' };
  }

  // 3. YouTube Short URL: youtu.be/<id>
  if (/^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i.test(trimmed)) {
    return { isValid: true, type: 'short', label: 'YouTube Shortlink' };
  }

  // 4. YouTube Video Biasa: youtube.com/watch?v=<id> atau youtube.com/embed/<id>
  if (/^https?:\/\/(?:www\.|m\.)?youtube\.com\/(?:watch\?.*v=|embed\/|v\/)([a-zA-Z0-9_-]{11})/i.test(trimmed)) {
    return { isValid: true, type: 'standard', label: 'YouTube Video' };
  }

  // Bila URL tidak cocok dengan format resmi YouTube manapun
  return { isValid: false };
}

export const MusicPicker: React.FC<MusicPickerProps> = ({
  musicUrl = '',
  onMusicUrlChange,
  onSaveMusic,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(musicUrl || '');
  const [savedUrl, setSavedUrl] = useState<string>(musicUrl || '');
  const [musicSavedSuccess, setMusicSavedSuccess] = useState<boolean>(false);

  // Sinkronisasi jika nilai props berubah dari luar (misal preset diterapkan)
  useEffect(() => {
    if (musicUrl !== undefined && musicUrl !== savedUrl) {
      setInputUrl(musicUrl || '');
      setSavedUrl(musicUrl || '');
    }
  }, [musicUrl]);

  const validation = validateYouTubeUrl(inputUrl);
  const isDirty = inputUrl.trim() !== (savedUrl || '').trim();
  const hasSavedValue = Boolean(savedUrl && savedUrl.trim());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUrl(val);
    // Reset banner status tersimpan jika user mulai mengetik link baru
    setMusicSavedSuccess(false);
  };

  const handleClear = () => {
    setInputUrl('');
    setMusicSavedSuccess(false);
  };

  const handleSaveAction = (urlToSave: string) => {
    const cleanUrl = urlToSave.trim();
    if (!cleanUrl) {
      onMusicUrlChange('');
      if (onSaveMusic) onSaveMusic('');
      setSavedUrl('');
      setInputUrl('');
      setMusicSavedSuccess(true);
      setTimeout(() => setMusicSavedSuccess(false), 4000);
      return;
    }

    const check = validateYouTubeUrl(cleanUrl);
    if (!check.isValid) return;

    onMusicUrlChange(cleanUrl);
    if (onSaveMusic) {
      onSaveMusic(cleanUrl);
    }
    setSavedUrl(cleanUrl);
    setInputUrl(cleanUrl);
    setMusicSavedSuccess(true);
    setTimeout(() => setMusicSavedSuccess(false), 4000);
  };

  const handleApplyPreset = () => {
    const preset = 'https://www.youtube.com/watch?v=2Vv-BfVoq4g';
    setInputUrl(preset);
    handleSaveAction(preset);
  };

  return (
    <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4">
      {/* Header Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/70">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600 text-[22px]">smart_display</span>
          <h3 className="text-sm font-bold text-stone-900">
            Musik Latar Undangan (YouTube Backsound)
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold self-start sm:self-auto">
          <span className="material-symbols-outlined text-xs">play_circle</span>
          <span>Khusus Link YouTube Resmi</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs text-stone-700 font-medium flex items-center justify-between gap-1.5">
          <span className="flex items-center gap-1">
            <span className="text-red-600 font-bold">YouTube URL:</span>
            <span>Masukkan tautan video musik atau lagu pernikahan dari YouTube</span>
          </span>
          {isDirty && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              ● Perubahan Belum Disimpan
            </span>
          )}
        </label>

        {/* Input & Action Button Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
              link
            </span>
            <input
              type="url"
              value={inputUrl}
              onChange={handleInputChange}
              placeholder="cth: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-white text-stone-900 border text-sm shadow-2xs transition-all focus:outline-none focus:ring-2 ${
                inputUrl.trim() && !validation.isValid
                  ? 'border-red-400 focus:border-red-600 focus:ring-red-100 bg-red-50/20'
                  : 'border-stone-200 hover:border-stone-300 focus:border-stone-900 focus:ring-stone-900/10'
              }`}
            />
            {inputUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center"
                title="Hapus teks link musik"
                aria-label="Hapus teks link musik"
              >
                <span className="material-symbols-outlined text-[18px]">
                  cancel
                </span>
              </button>
            )}
          </div>

          {/* Tombol Preset Romantis */}
          <button
            type="button"
            onClick={handleApplyPreset}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
            title="Gunakan lagu romantis pernikahan pilihan dari YouTube"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-500">auto_awesome</span>
            <span>Preset Romantis</span>
          </button>

          {/* Tombol Simpan Musik Dinamis (Reset ke belum check saat diedit) */}
          <button
            type="button"
            disabled={Boolean(inputUrl.trim() && !validation.isValid)}
            onClick={() => handleSaveAction(inputUrl)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              inputUrl.trim() && !validation.isValid
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed border border-stone-300'
                : !isDirty && hasSavedValue
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 cursor-default'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md cursor-pointer active:scale-95'
            }`}
          >
            {!isDirty && hasSavedValue ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-emerald-600 font-bold">
                  check_circle
                </span>
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] text-stone-400">
                  save
                </span>
                <span>Simpan Musik</span>
              </>
            )}
          </button>
        </div>

        {/* Validasi Link YouTube Realtime */}
        {inputUrl.trim() !== '' && (
          <div>
            {!validation.isValid ? (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0">error</span>
                <span>
                  Tautan bukan dari YouTube yang valid. Harap gunakan link resmi YouTube Video, YouTube Music, atau YouTube Shorts.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                <span>Link valid: terdeteksi sebagai <strong>{validation.label}</strong>.</span>
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-stone-500">
          Mendukung format link YouTube biasa (Desktop/Mobile), YouTube Music, dan YouTube Shorts. Musik akan otomatis berputar saat cover undangan dibuka oleh tamu.
        </p>

        {/* Banner Konfirmasi Berhasil Tersimpan */}
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
