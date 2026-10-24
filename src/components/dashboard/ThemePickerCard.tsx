import React, { useState, useEffect } from 'react';
import { isTemplateUnlocked } from '../../pages/dashboard/constants/themeMapping';
import { supabase } from '../../lib/supabase/client';
import {
  type ThemeOption,
  fetchTemplatesCatalog,
  getCachedCatalog,
  buildThemeOptionsFromDb,
} from '../../services/templateCatalogService';

export { type ThemeOption };

export interface ThemePickerCardProps {
  activeThemeId: string;
  unlockedTemplates?: string[];
  paidTemplateId?: string | null;
  isPaid?: boolean;
  publishedThemeId?: string | null;
  onThemeSelect?: (themeId: any) => void;
  onSelectTheme?: (themeId: any) => void;
  onApplyPreset?: (themeId: string) => void;
}

export const ThemePickerCard: React.FC<ThemePickerCardProps> = ({
  activeThemeId,
  unlockedTemplates = [],
  paidTemplateId = null,
  isPaid = false,
  publishedThemeId = null,
  onThemeSelect,
  onSelectTheme,
  onApplyPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'adat' | 'modern'>('all');
  const [dynamicOptions, setDynamicOptions] = useState<ThemeOption[]>(() =>
    buildThemeOptionsFromDb(getCachedCatalog())
  );
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Sinkronisasi otomatis murni dengan tabel public.templates di Supabase secara Realtime
  useEffect(() => {
    let isMounted = true;

    fetchTemplatesCatalog().then((catalog) => {
      if (isMounted && catalog && catalog.length > 0) {
        setDynamicOptions(buildThemeOptionsFromDb(catalog));
      }
    });

    const handleCatalogUpdated = (e: any) => {
      if (isMounted && e.detail && Array.isArray(e.detail)) {
        setDynamicOptions(buildThemeOptionsFromDb(e.detail));
      }
    };
    window.addEventListener('mbell_templates_catalog_updated', handleCatalogUpdated);

    // Supabase Realtime: jika ada perubahan baris (update harga/kategori) di Supabase Studio
    const channel = supabase
      .channel('realtime_public_templates_picker')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, () => {
        fetchTemplatesCatalog().then((cat) => {
          if (isMounted && cat) {
            setDynamicOptions(buildThemeOptionsFromDb(cat));
          }
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      window.removeEventListener('mbell_templates_catalog_updated', handleCatalogUpdated);
      supabase.removeChannel(channel);
    };
  }, []);

  // Normalisasi ID secara dinamis dari data database Supabase (tanpa hardcode map)
  const toTemplateId = (id: string) => {
    const key = (id || '').toLowerCase().trim();
    const found = dynamicOptions.find(
      (t) => t.id.toLowerCase() === key || t.slug?.toLowerCase().includes(key)
    );
    return found ? found.id : id;
  };

  const toSemanticId = (id: string) => {
    const key = (id || '').toLowerCase().trim();
    const found = dynamicOptions.find(
      (t) => t.id.toLowerCase() === key || t.slug?.toLowerCase() === key
    );
    if (!found) return id;
    // Ekstraksi kata semantik tema dari slug database (misal 'adat-sunda' -> 'sunda', 'modern-arch' -> 'modern')
    const slugParts = (found.slug || '').split('-');
    const semantic = slugParts.find((part) => part !== 'adat') || slugParts[0] || found.id;
    return semantic;
  };

  const effectiveActive = toTemplateId(activeThemeId);
  const activeSemantic = toSemanticId(activeThemeId);
  const currentOption = dynamicOptions.find((t) => t.id === effectiveActive) || dynamicOptions[0];

  const handleSelect = (id: string) => {
    const semanticId = toSemanticId(id);
    if (semanticId === activeSemantic) return;
    onThemeSelect?.(semanticId);
    onSelectTheme?.(semanticId);
  };

  const filteredOptions =
    selectedCategory === 'all'
      ? dynamicOptions
      : dynamicOptions.filter((t) => t.category === selectedCategory);

  const adatCount = dynamicOptions.filter((t) => t.category === 'adat').length;
  const modernCount = dynamicOptions.filter((t) => t.category === 'modern').length;

  const adatSample = dynamicOptions.find((t) => t.category === 'adat');
  const modernSample = dynamicOptions.find((t) => t.category === 'modern');
  const adatBadgePrice = adatSample?.badgePrice || 'Rp 79rb';
  const modernBadgePrice = modernSample?.badgePrice || 'Rp 49rb';

  return (
    <section className="bg-white rounded-2xl p-3.5 sm:p-7 shadow-xs border border-stone-200/90 space-y-4 sm:space-y-6">
      {/* Header Tahap 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-200/80">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              1
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-stone-900">
              Pilih Tema &amp; Gaya Desain
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Pilihan konsep visual, tipografi, dan nuansa warna untuk website pernikahan digital Anda.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-semibold self-start sm:self-auto">
          <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-stone-600">palette</span>
          <span>{dynamicOptions.length} Koleksi Desain</span>
        </span>
      </div>


      {/* Filter Segmented Tab: Kategori Adat vs Modern */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100/90 border border-stone-200/70 w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Semua Koleksi ({dynamicOptions.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('adat')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'adat'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🏛️ Adat</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">{adatBadgePrice}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 font-bold">{adatCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('modern')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'modern'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🌿 Modern</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-bold">{modernBadgePrice}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 font-bold">{modernCount}</span>
        </button>
      </div>

      {/* Grid Kartu Tema (Mobile: 2 Kolom Card Mini, Desktop: 3 Kolom) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 pt-1">
        {filteredOptions.map((theme) => {
          const semanticThemeId = toSemanticId(theme.id);
          const semanticPublished = publishedThemeId ? toSemanticId(publishedThemeId) : null;
          const isLive = Boolean(
            semanticPublished &&
            (semanticThemeId === semanticPublished || theme.id === publishedThemeId)
          );
          const isActive = effectiveActive === theme.id || toSemanticId(effectiveActive) === semanticThemeId;
          const isBought = isTemplateUnlocked(theme.id, unlockedTemplates, paidTemplateId, isPaid) || isLive;

          return (
            <div
              key={theme.id}
              onClick={() => {
                if (isActive) return;
                handleSelect(theme.id);
              }}
              className={`group rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between relative transition-all duration-200 cursor-pointer border ${
                isActive && isLive
                  ? 'border-emerald-600 bg-emerald-50/25 ring-2 ring-emerald-500/25 shadow-md'
                  : isActive
                  ? 'border-stone-900 bg-stone-50/70 ring-2 ring-stone-900/15 shadow-md'
                  : isLive
                  ? 'border-emerald-300/80 bg-white hover:border-emerald-500 hover:shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs active:scale-[0.98]'
              }`}
            >
              <div className="space-y-2 sm:space-y-2.5">
                {/* Card Mini Preview Mockup */}
                <div
                  className={`relative w-full h-28 sm:h-40 rounded-lg sm:rounded-xl overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3 text-center shadow-inner transition-transform group-hover:scale-[1.01] border ${theme.bgClass}`}
                >
                  {/* Foto Mockup Template Asli dari Supabase Storage */}
                  {theme.mockupUrl && !imgErrors[theme.id] ? (
                    <>
                      <img
                        src={theme.mockupUrl}
                        alt={theme.name}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          // Deteksi jika template7 menggunakan nama file variasi di storage
                          if (img.src.includes('template7-minang.jpg')) {
                            img.src = img.src.replace('template7-minang.jpg', 'template_7_Minang.jpg');
                          } else if (img.src.includes('template_7_Minang.jpg')) {
                            img.src = img.src.replace('template_7_Minang.jpg', 'template7-minang.jpg');
                          } else if (img.src.includes('template8-batak.jpg')) {
                            img.src = img.src.replace('template8-batak.jpg', 'template_8_Batak.jpg');
                          } else if (img.src.includes('template_8_Batak.jpg')) {
                            img.src = img.src.replace('template_8_Batak.jpg', 'template8-batak.jpg');
                          } else {
                            setImgErrors((prev) => ({ ...prev, [theme.id]: true }));
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {/* Gradien Vignette halus agar badge tetap kontras & terbaca jelas */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/35 pointer-events-none" />
                    </>
                  ) : (
                    /* Fallback Mockup CSS jika gambar offline / belum tersedia */
                    <>
                      <span
                        className="material-symbols-outlined text-[20px] sm:text-[28px] mb-0.5 sm:mb-1 drop-shadow-xs"
                        style={{ color: theme.accentColor }}
                      >
                        {theme.icon}
                      </span>
                      <span className="text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold opacity-85 truncate max-w-full px-1">
                        {theme.styleTag}
                      </span>
                      <p className="font-serif text-[11px] sm:text-sm font-bold tracking-tight mt-0.5 sm:mt-1 truncate w-full px-1">
                        {theme.coupleSample}
                      </p>
                      <div
                        className="w-5 sm:w-8 h-0.5 mt-0.5 sm:mt-2 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </>
                  )}

                  {/* Top-Left: Badge Status Dibeli ATAU Badge Harga Coret */}
                  {isBought ? (
                    <span className="absolute top-1.5 left-1.5 z-10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 sm:gap-1 shadow-sm ring-1 ring-emerald-400/40">
                      <span className="material-symbols-outlined text-[11px] sm:text-[13px]">check</span>
                      <span className="hidden sm:inline">Sudah </span><span>Dibeli</span>
                    </span>
                  ) : (
                    <span className="absolute top-1.5 left-1.5 z-10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-stone-900/90 text-white text-[9px] sm:text-[10px] font-semibold backdrop-blur-md shadow-xs flex items-center gap-1 border border-white/10">
                      <span className="line-through text-stone-400 text-[8px] sm:text-[9px] hidden sm:inline">{theme.badgeOriginal}</span>
                      <span className="text-amber-300 font-bold">{theme.badgePrice}</span>
                    </span>
                  )}

                  {/* Top-Right: Indikator Live (selalu Live) ATAU Badge Bawaan Tema (tidak berubah jadi Aktif) */}
                  {isLive ? (
                    <span
                      className={`absolute top-1.5 right-1.5 z-10 px-2 sm:px-2.5 py-0.5 rounded-full text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-sm border ${
                        isActive
                          ? 'bg-emerald-600 border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-500/20'
                          : 'bg-emerald-700/95 border-emerald-400/50 backdrop-blur-xs'
                      }`}
                      title="Template ini adalah template resmi yang diterbitkan (Live)"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Live</span>
                    </span>
                  ) : theme.badge ? (
                    <span className="absolute top-1.5 right-1.5 z-10 px-1.5 sm:px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[8px] sm:text-[10px] font-medium backdrop-blur-xs shadow-2xs border border-white/15 inline-flex items-center">
                      {theme.badge}
                    </span>
                  ) : null}
                </div>

                {/* Card Meta (Judul & Caption) */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug group-hover:text-stone-700 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex-1">
                      {theme.name}
                    </h3>
                    {isLive ? (
                      <span className="inline-flex items-center text-emerald-600 shrink-0 mt-0.5" title="Template ini adalah template resmi yang diterbitkan (Live)">
                        <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-emerald-600">verified</span>
                      </span>
                    ) : isBought ? (
                      <span className="inline-flex items-center text-emerald-600 shrink-0 mt-0.5" title="Template ini sudah dibeli untuk undangan ini">
                        <span className="material-symbols-outlined text-[13px] sm:text-[15px]">check_circle</span>
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] sm:text-xs text-stone-500 line-clamp-2 leading-relaxed min-h-[1.75rem] sm:min-h-[2rem]">
                    {theme.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Bottom Action Button */}
              <div className="pt-2 sm:pt-2.5">
                {isActive ? (
                  <div
                    className={`w-full py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-center text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-2xs ${
                      isLive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 text-white'
                    }`}
                    title={isLive ? 'Template Live aktif di editor' : 'Tema dipilih untuk pratinjau editor'}
                  >
                    <span className="material-symbols-outlined text-[12px] sm:text-[15px] font-bold">check</span>
                    <span>{isLive ? 'Live Aktif' : 'Dipilih'}</span>
                  </div>
                ) : (
                  <div className="w-full py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-stone-200 text-stone-700 text-[10px] sm:text-xs font-semibold group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all flex items-center justify-center gap-1">
                    <span>Pilih Tema</span>
                    <span className="material-symbols-outlined text-[12px] sm:text-[14px] opacity-70">arrow_forward</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Sync Action Bar */}
      {onApplyPreset && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-amber-700 text-2xl shrink-0 p-1.5 bg-amber-100 rounded-lg">
              auto_fix_high
            </span>
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-stone-900 block sm:inline">
                Ingin pratinjau tema secara utuh?
              </span>
              <p className="text-stone-600 mt-0.5 sm:mt-0">
                Terapkan foto prewedding, ornamen khas, kutipan, dan susunan acara resmi bawaan tema <strong>{currentOption.name}</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onApplyPreset(activeSemantic)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold shadow-xs shrink-0 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Terapkan Konsep {currentOption.name}</span>
          </button>
        </div>
      )}
    </section>
  );
};
