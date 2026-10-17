import React, { useState, useEffect, useRef } from 'react';
import type { ThemeConfig, AnimationConfig } from '../../types/invitation';
import { DEFAULT_ANIMATION_CONFIG } from '../../types/invitation';
import {
  applyAnimationConfigStyles,
  replayUniversalScrollAnimation,
} from '../../utils/scrollAnimationEngine';

interface AnimationSettingsCardProps {
  themeConfig: ThemeConfig;
  onThemeConfigChange: (config: ThemeConfig) => void;
}

export const AnimationSettingsCard: React.FC<AnimationSettingsCardProps> = ({
  themeConfig,
  onThemeConfigChange,
}) => {
  const animConfig: AnimationConfig = {
    ...DEFAULT_ANIMATION_CONFIG,
    ...(themeConfig.animation_config || {}),
  };

  const initialSmoothness = (() => {
    let val = animConfig.smoothness ?? 75;
    if (val > 100) val = Math.round(val / 10);
    return Math.max(1, Math.min(100, val));
  })();

  const [localSmoothness, setLocalSmoothness] = useState<number>(initialSmoothness);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sinkronkan localSmoothness jika themeConfig dari luar berubah
  useEffect(() => {
    if (animConfig.smoothness !== undefined) {
      let val = animConfig.smoothness;
      if (val > 100) val = Math.round(val / 10);
      const normalized = Math.max(1, Math.min(100, val));
      if (normalized !== localSmoothness) {
        setLocalSmoothness(normalized);
      }
    }
  }, [animConfig.smoothness]);

  // Bersihkan debounce timer saat unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Update konfigurasi secara aman dengan live preview 0ms & throttled database commit
  const updateConfig = (patch: Partial<AnimationConfig>, immediateCommit: boolean = true) => {
    const nextAnimConfig: AnimationConfig = {
      ...animConfig,
      ...patch,
    };

    // 1. Terapkan variabel CSS & atribut preset ke DOM seketika (0ms delay)
    applyAnimationConfigStyles(nextAnimConfig);

    const nextConfig: ThemeConfig = {
      ...themeConfig,
      animation_config: nextAnimConfig,
    };

    if (immediateCommit) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      onThemeConfigChange(nextConfig);
      // Putar ulang pratinjau di frame phone agar terlihat nyata
      setTimeout(() => {
        replayUniversalScrollAnimation({ resetToCover: false });
      }, 50);
    } else {
      // Debounce commit ke parent/autosave database (350ms) saat slider sedang digeser cepat
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onThemeConfigChange(nextConfig);
      }, 350);
    }
  };

  // Handler slider geser
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalSmoothness(val);
    updateConfig({ smoothness: val }, false);
  };

  // Handler saat jari/mouse dilepas dari slider
  const handleSliderRelease = () => {
    updateConfig({ smoothness: localSmoothness }, true);
  };

  // Manual Trigger Replay: Mengembalikan tampilan preview ke Cover Gate agar user bisa klik "Buka Undangan" dari awal
  const handleReplayClick = () => {
    replayUniversalScrollAnimation({ resetToCover: true });
  };

  // Status keterangan berdasarkan nilai slider (1 - 100, angka 100 = tepat 5 detik)
  const getSmoothnessStatus = (val: number) => {
    const norm = Math.max(1, Math.min(100, val)) / 100;
    const durationSec = (0.40 + norm * 4.60).toFixed(2);

    if (val <= 30) {
      return {
        label: 'Cepat & Ringkas',
        desc: `Durasi ~${durationSec}s, transisi gesit langsung muncul seketika.`,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: '⚡ Gesit',
        durationSec,
      };
    }
    if (val <= 60) {
      return {
        label: 'Seimbang & Anggun',
        desc: `Durasi ~${durationSec}s, tempo standar yang santai dan proporsional.`,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        badge: '⚖️ Seimbang',
        durationSec,
      };
    }
    if (val <= 85) {
      return {
        label: 'Sangat Lembut & Mewah (Disarankan)',
        desc: `Durasi ~${durationSec}s, kurva out-quint puitis seperti kain sutra melayang.`,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badge: '✨ Rekomendasi',
        durationSec,
      };
    }
    return {
      label: 'Ultra-Smooth Cinematic Slow-Motion',
      desc: `Durasi ~${durationSec}s (maksimal 5 detik), pergerakan sangat sakral dan megah.`,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      badge: '🕊️ 5 Detik Slow-Mo',
      durationSec,
    };
  };

  const currentStatus = getSmoothnessStatus(localSmoothness);

  const stylePresets = [
    {
      id: 'romantic',
      name: 'Romantic Float',
      desc: 'Meluncur lembut dari bawah dengan peredupan hangat. Pilihan favorit 85% pengantin.',
      icon: 'favorite',
      badge: 'Favorit',
    },
    {
      id: 'cinematic',
      name: 'Cinematic Editorial',
      desc: 'Mengembang halus dari dalam (soft-scale) seperti membuka majalah pernikahan mewah.',
      icon: 'movie_filter',
    },
    {
      id: 'minimalist',
      name: 'Minimalist Pure',
      desc: 'Kemunculan murni tanpa pergeseran posisi. Sangat tenang, bersih, dan bebas goyangan.',
      icon: 'check_circle',
    },
    {
      id: 'cascade',
      name: 'Dynamic Cascade',
      desc: 'Aliran berjenjang kiri-kanan secara bergantian yang dinamis dan anggun.',
      icon: 'water_drop',
    },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-7">
      {/* Header Tahap 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              6
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Pengaturan Animasi &amp; Efek Visual
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Atur kelembutan scroll, gaya gerak, dan ornamen visual sebelum menerbitkan undangan Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReplayClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Kembalikan preview HP ke Sampul dan uji animasi dari awal pembukaan undangan"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>Putar Ulang Efek</span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig(DEFAULT_ANIMATION_CONFIG, true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Kembalikan semua pengaturan ke rekomendasi terbaik"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 1. SLIDER KELEMBUTAN UTAMA (1 - 100) */}
      <div className="space-y-3.5 p-5 rounded-2xl bg-gradient-to-br from-[#FAF9F5] via-white to-[#F6F4ED] border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <label htmlFor="smoothness-slider" className="text-sm font-bold text-stone-900">
                Tingkat Kelembutan Gerak (Smoothness)
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentStatus.color}`}>
                {currentStatus.badge}
              </span>
            </div>
            <p className="text-xs text-stone-500">{currentStatus.desc}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-2xl font-serif font-bold text-stone-900">
              {localSmoothness}
            </span>
            <span className="text-xs text-stone-400 font-semibold">/ 100</span>
          </div>
        </div>

        {/* Input Slider */}
        <div className="space-y-2 pt-2">
          <input
            id="smoothness-slider"
            type="range"
            min="1"
            max="100"
            step="1"
            value={localSmoothness}
            onChange={handleSliderChange}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900 focus:outline-none"
          />

          {/* Scale Labels */}
          <div className="flex justify-between text-[11px] text-stone-400 font-medium px-1">
            <span>1 (Cepat 0.4s)</span>
            <span className="cursor-pointer hover:text-stone-700" onClick={() => { setLocalSmoothness(25); updateConfig({ smoothness: 25 }, true); }}>
              25 (1.5s)
            </span>
            <span className="cursor-pointer hover:text-stone-700" onClick={() => { setLocalSmoothness(50); updateConfig({ smoothness: 50 }, true); }}>
              50 (2.7s)
            </span>
            <span
              className="cursor-pointer font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md"
              onClick={() => { setLocalSmoothness(75); updateConfig({ smoothness: 75 }, true); }}
            >
              75 (3.8s ★)
            </span>
            <span
              className="cursor-pointer font-bold text-purple-700 hover:text-purple-900"
              onClick={() => { setLocalSmoothness(100); updateConfig({ smoothness: 100 }, true); }}
            >
              100 (5 Detik)
            </span>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200/60">
          <span className="text-xs text-stone-400 self-center mr-1">Pintasan Cepat:</span>
          {[
            { label: 'Gesit (25)', val: 25 },
            { label: 'Seimbang (50)', val: 50 },
            { label: 'Mewah (75)', val: 75 },
            { label: 'Slow-Motion (90)', val: 90 },
            { label: 'Maksimal 5 Detik (100)', val: 100 },
          ].map((sc) => (
            <button
              key={sc.val}
              type="button"
              onClick={() => {
                setLocalSmoothness(sc.val);
                updateConfig({ smoothness: sc.val }, true);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                localSmoothness === sc.val
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SIMULASI LANGSUNG PREVIEW (INTERACTIVE LIVE MOTION TESTER) */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-13 h-13 rounded-2xl bg-white shadow-sm border border-stone-200 flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-2xl text-stone-800">
              {animConfig.preset === 'cinematic' ? 'movie_filter' : animConfig.preset === 'minimalist' ? 'check_circle' : animConfig.preset === 'cascade' ? 'water_drop' : 'favorite'}
            </span>
          </div>
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2">
              <span>Uji Coba Fisika Gerak</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-200/80 text-stone-800 font-mono font-bold">
                {currentStatus.durationSec}s
              </span>
            </h4>
            <p className="text-xs text-stone-500">
              Gaya: <strong className="text-stone-800 capitalize">{animConfig.preset || 'Romantic Float'}</strong> | 
              Jarak: <strong className="text-stone-800">{animConfig.preset === 'minimalist' ? '0px' : `${Math.round(36 - (localSmoothness / 100) * 22)}px`}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReplayClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          title="Kembalikan HP preview ke Sampul agar Anda bisa menguji animasi dari tombol Buka Undangan"
        >
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          <span>Uji Gerakan (Buka Undangan)</span>
        </button>
      </div>

      {/* 3. GAYA GERAK KEMUNCULAN (ANIMATION PRESET) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-stone-900 block">
            Gaya Gerak Kontainer &amp; Judul (Animation Preset)
          </label>
          <span className="text-xs text-stone-400">Pilih salah satu karakter gerak</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stylePresets.map((preset) => {
            const isSelected = (animConfig.preset || 'romantic') === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => updateConfig({ preset: preset.id as any }, true)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 relative ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50/70 shadow-xs ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{preset.icon}</span>
                </div>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">{preset.name}</span>
                    {preset.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{preset.desc}</p>
                </div>
                {isSelected && (
                  <span className="absolute top-4 right-4 material-symbols-outlined text-stone-900 text-[20px]">
                    check_circle
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PENGATURAN TAMBAHAN (TOGGLES & STAGGER) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Toggle Partikel Budaya Melayang */}
        <div className="p-4 rounded-xl border border-stone-200/90 bg-white flex items-start justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">
                local_florist
              </span>
              <span className="text-sm font-bold text-stone-900">
                Kelopak &amp; Ornamen Melayang
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Tampilkan partikel melati melayang (Sunda), ornamen wayang (Jawa), atau debu emas (Modern).
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={animConfig.floating_petals !== false}
              onChange={(e) => updateConfig({ floating_petals: e.target.checked }, true)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900" />
          </label>
        </div>

        {/* Toggle Efek Fokus Lensa Kamera */}
        <div className="p-4 rounded-xl border border-stone-200/90 bg-white flex items-start justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                camera
              </span>
              <span className="text-sm font-bold text-stone-900">
                Fokus Lensa pada Foto
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Foto mempelai &amp; galeri berawal dengan sedikit blur lembut lalu melebur jernih saat masuk layar.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={animConfig.lens_focus_blur !== false}
              onChange={(e) => updateConfig({ lens_focus_blur: e.target.checked }, true)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900" />
          </label>
        </div>

        {/* Jeda Aliran Kartu (Stagger Delay) */}
        <div className="p-4 rounded-xl border border-stone-200/90 bg-white space-y-2.5 sm:col-span-2 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-stone-900">
                Jeda Aliran Kartu Bertingkat (Stagger Flow)
              </span>
              <p className="text-xs text-stone-500">
                Waktu jeda kemunculan berurutan antara kartu mempelai pria, simbol hati, dan mempelai wanita.
              </p>
            </div>

            <div className="inline-flex rounded-lg border border-stone-200 p-0.5 bg-stone-100 self-start sm:self-auto">
              {[
                { id: 'fast', label: 'Cepat (70ms)' },
                { id: 'normal', label: 'Sedang (130ms)' },
                { id: 'relaxed', label: 'Santai (220ms)' },
              ].map((opt) => {
                const isActive = (animConfig.stagger_speed || 'normal') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateConfig({ stagger_speed: opt.id as any }, true)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toggle Aksesibilitas / Reduce Motion */}
        <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 flex items-start justify-between gap-3 sm:col-span-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-stone-500 text-[18px]">
                accessibility_new
              </span>
              <span className="text-sm font-semibold text-stone-800">
                Mode Ringan (Matikan Efek Gerak / Reduce Motion)
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Menghilangkan efek translasi gerakan untuk tamu dengan sensitivitas gerak atau ponsel generasi lama.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={animConfig.reduced_motion === true}
              onChange={(e) => updateConfig({ reduced_motion: e.target.checked }, true)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900" />
          </label>
        </div>
      </div>
    </section>
  );
};
