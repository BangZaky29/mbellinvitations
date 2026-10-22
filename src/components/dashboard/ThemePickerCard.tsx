import React, { useState } from 'react';
import { isTemplateUnlocked } from '../../pages/dashboard/constants/themeMapping';

export interface ThemeOption {
  id: string;
  name: string;
  subtitle: string;
  styleTag: string;
  coupleSample: string;
  badge?: string;
  accentColor: string;
  icon: string;
  bgClass: string;
  category: 'adat' | 'casual';
  price: number;
  originalPrice: number;
  priceDisplay: string;
  originalPriceDisplay: string;
  badgePrice: string;
  badgeOriginal: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  // Kategori 1: Adat & Tradisi Nusantara (Rp 59.000 / Coret Rp 99.000)
  {
    id: 'template6',
    name: 'Adat Sunda Siger',
    subtitle: 'Mahkota Siger & Ronce Melati',
    styleTag: 'Tradisi Parahyangan',
    coupleSample: 'Raditya & Jessica',
    badge: 'Royal Adat',
    accentColor: '#C5A059',
    icon: 'local_florist',
    bgClass: 'bg-[#FBF9F6] text-[#775A19] border-[#C5A059]/40',
    category: 'adat',
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    badgeOriginal: 'Rp 99rb',
  },
  {
    id: 'template7',
    name: 'Adat Minang Baralek Gadang',
    subtitle: 'Suntiang Gadang & Songket Silungkang',
    styleTag: 'Tradisi Ranah Minang',
    coupleSample: 'Farhan & Nadia',
    badge: 'New Royal',
    accentColor: '#D4AF37',
    icon: 'temple_buddhist',
    bgClass: 'bg-[#1B0609] text-[#D4AF37] border-[#D4AF37]/50',
    category: 'adat',
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    badgeOriginal: 'Rp 99rb',
  },
  {
    id: 'template3',
    name: 'Adat Jawa',
    subtitle: 'Klasik Keraton & Wayang',
    styleTag: 'Batik & Budaya',
    coupleSample: 'Arya & Dian',
    badge: 'Best Choice',
    accentColor: '#C5A059',
    icon: 'architecture',
    bgClass: 'bg-[#1C1A17] text-[#C5A059] border-amber-900/50',
    category: 'adat',
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    badgeOriginal: 'Rp 99rb',
  },
  {
    id: 'template4',
    name: 'Islami Kubah',
    subtitle: 'Sacred Mosque Ornament',
    styleTag: 'Kubah Maroko & Doa',
    coupleSample: 'Rayhan & Yasmin',
    badge: 'Eksklusif',
    accentColor: '#93335B',
    icon: 'mosque',
    bgClass: 'bg-[#FDF8F9] text-[#5E2832] border-rose-200',
    category: 'adat',
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    badgeOriginal: 'Rp 99rb',
  },

  // Kategori 2: Modern & Casual Editorial (Rp 39.000 / Coret Rp 79.000)
  {
    id: 'template1',
    name: 'Modern Arch',
    subtitle: 'Editorial Quiet Luxury',
    styleTag: 'Editorial Minimalis',
    coupleSample: 'Dimas & Sarah',
    badge: 'Trending',
    accentColor: '#D4AF37',
    icon: 'flare',
    bgClass: 'bg-[#FAF8F5] text-stone-900 border-stone-300',
    category: 'casual',
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    badgeOriginal: 'Rp 79rb',
  },
  {
    id: 'template2',
    name: 'Rustic Casual',
    subtitle: 'Botanical Warm Harmony',
    styleTag: 'Botanical Earthy',
    coupleSample: 'Romeo & Juliet',
    badge: 'Populer',
    accentColor: '#8C4E2D',
    icon: 'local_florist',
    bgClass: 'bg-gradient-to-b from-[#FBF9F5] to-[#EFE8DE] text-[#1E2E22] border-[#DECFBD]',
    category: 'casual',
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    badgeOriginal: 'Rp 79rb',
  },
  {
    id: 'template5',
    name: 'Luxury Glamour',
    subtitle: 'Midnight Dark & Gold Foil',
    styleTag: 'Gold Foil VIP',
    coupleSample: 'Romeo & Juliet A.',
    badge: 'VIP Only',
    accentColor: '#E2C792',
    icon: 'hotel_class',
    bgClass: 'bg-[#121316] text-[#E2C792] border-amber-600/40',
    category: 'casual',
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    badgeOriginal: 'Rp 79rb',
  },
];

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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'adat' | 'casual'>('all');

  const toTemplateId = (id: string) => {
    const map: Record<string, string> = {
      modern: 'template1',
      rustic: 'template2',
      jawa: 'template3',
      islami: 'template4',
      luxury: 'template5',
      sunda: 'template6',
      minang: 'template7',
    };
    return map[id] || id;
  };

  const toSemanticId = (id: string) => {
    const map: Record<string, string> = {
      template1: 'modern',
      template2: 'rustic',
      template3: 'jawa',
      template4: 'islami',
      template5: 'luxury',
      template6: 'sunda',
      template7: 'minang',
    };
    return map[id] || id;
  };

  const effectiveActive = toTemplateId(activeThemeId);
  const activeSemantic = toSemanticId(activeThemeId);
  const currentOption = THEME_OPTIONS.find((t) => t.id === effectiveActive) || THEME_OPTIONS[0];

  const handleSelect = (id: string) => {
    const semanticId = toSemanticId(id);
    if (semanticId === activeSemantic) return;
    onThemeSelect?.(semanticId);
    onSelectTheme?.(semanticId);
  };

  const filteredOptions =
    selectedCategory === 'all'
      ? THEME_OPTIONS
      : THEME_OPTIONS.filter((t) => t.category === selectedCategory);

  const adatCount = THEME_OPTIONS.filter((t) => t.category === 'adat').length;
  const casualCount = THEME_OPTIONS.filter((t) => t.category === 'casual').length;

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
          <span>{THEME_OPTIONS.length} Koleksi Desain</span>
        </span>
      </div>

      {/* Banner Mode Bebas Coba (Free Sandbox Mode) */}
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-stone-50 border border-amber-200/80 text-amber-950 text-xs shadow-2xs">
        <span className="material-symbols-outlined text-amber-700 text-lg sm:text-xl shrink-0 p-1 bg-amber-100 rounded-lg">
          auto_awesome
        </span>
        <div className="leading-relaxed text-[11px] sm:text-xs">
          <span className="font-bold text-stone-900 block sm:inline">
            Mode Bebas Coba (Free Sandbox):
          </span>{' '}
          <span className="text-stone-700">
            Bebas memilih seluruh tema di Live Preview dan menyimpan Draf tanpa biaya. Pembayaran hanya dilakukan saat Anda siap menerbitkan undangan (Publish).
          </span>
        </div>
      </div>

      {/* Filter Segmented Tab: Kategori Adat vs Casual */}
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
          Semua Koleksi ({THEME_OPTIONS.length})
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
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">Rp 59rb</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 font-bold">{adatCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('casual')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'casual'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🌿 Modern</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-800 font-bold">Rp 39rb</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 font-bold">{casualCount}</span>
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
              className={`group rounded-xl sm:rounded-2xl p-2 sm:p-4 space-y-2 sm:space-y-3 relative transition-all duration-200 cursor-pointer border ${
                isActive && isLive
                  ? 'border-emerald-600 bg-emerald-50/25 ring-2 ring-emerald-500/25 shadow-md'
                  : isActive
                  ? 'border-stone-900 bg-stone-50/70 ring-2 ring-stone-900/15 shadow-md'
                  : isLive
                  ? 'border-emerald-300/80 bg-white hover:border-emerald-500 hover:shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs active:scale-[0.98]'
              }`}
            >
              {/* Card Mini Preview Mockup */}
              <div
                className={`relative w-full h-24 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3 text-center shadow-inner transition-transform group-hover:scale-[1.01] border ${theme.bgClass}`}
              >
                {/* Top-Left: Badge Status Dibeli ATAU Badge Harga Coret */}
                {isBought ? (
                  <span className="absolute top-1.5 left-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 sm:gap-1 shadow-sm ring-1 ring-emerald-400/40">
                    <span className="material-symbols-outlined text-[11px] sm:text-[13px]">check</span>
                    <span className="hidden sm:inline">Sudah </span><span>Dibeli</span>
                  </span>
                ) : (
                  <span className="absolute top-1.5 left-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-stone-900/90 text-white text-[9px] sm:text-[10px] font-semibold backdrop-blur-md shadow-xs flex items-center gap-1 border border-white/10">
                    <span className="line-through text-stone-400 text-[8px] sm:text-[9px] hidden sm:inline">{theme.badgeOriginal}</span>
                    <span className="text-amber-300 font-bold">{theme.badgePrice}</span>
                  </span>
                )}

                {/* Top-Right: Indikator Live (selalu Live) ATAU Badge Bawaan Tema (tidak berubah jadi Aktif) */}
                {isLive ? (
                  <span
                    className={`absolute top-1.5 right-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-sm border ${
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
                  <span className="absolute top-1.5 right-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-stone-900/70 text-white text-[8px] sm:text-[10px] font-medium backdrop-blur-xs shadow-2xs border border-white/10 inline-flex items-center">
                    {theme.badge}
                  </span>
                ) : null}

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
              </div>

              {/* Card Bottom Meta */}
              <div className="flex items-center justify-between pt-0.5 sm:pt-1 gap-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-stone-700 transition-colors">
                      {theme.name}
                    </h3>
                    {isLive ? (
                      <span className="inline-flex items-center text-emerald-600 shrink-0" title="Template ini adalah template resmi yang diterbitkan (Live)">
                        <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-emerald-600">verified</span>
                      </span>
                    ) : isBought ? (
                      <span className="inline-flex items-center text-emerald-600 shrink-0" title="Template ini sudah dibeli untuk undangan ini">
                        <span className="material-symbols-outlined text-[13px] sm:text-[15px]">check_circle</span>
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] sm:text-xs text-stone-500 truncate leading-tight mt-0.5">
                    {theme.subtitle}
                  </p>
                </div>

                {isActive ? (
                  <span
                    className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-white shadow-sm shrink-0 ${
                      isLive ? 'bg-emerald-600' : 'bg-stone-900'
                    }`}
                    title={isLive ? 'Template Live aktif di editor' : 'Template sedang aktif'}
                  >
                    <span className="material-symbols-outlined text-[14px] sm:text-[17px] font-bold">check</span>
                  </span>
                ) : (
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-stone-200 text-stone-700 text-[10px] sm:text-xs font-semibold group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all shrink-0">
                    Pilih
                  </span>
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
