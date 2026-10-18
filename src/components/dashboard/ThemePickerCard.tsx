import React, { useState } from 'react';

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
}

const THEME_OPTIONS: ThemeOption[] = [
  // Kategori 1: Adat & Tradisi Nusantara
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
  },

  // Kategori 2: Modern & Casual Editorial
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
  },
];

export interface ThemePickerCardProps {
  activeThemeId: string;
  onThemeSelect?: (themeId: any) => void;
  onSelectTheme?: (themeId: any) => void;
  onApplyPreset?: (themeId: string) => void;
}

export const ThemePickerCard: React.FC<ThemePickerCardProps> = ({
  activeThemeId,
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
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
      {/* Header Tahap 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              1
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Pilih Tema & Gaya Desain
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Pilihan konsep visual, tipografi, dan nuansa warna untuk undangan pernikahan digital Anda.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-semibold self-start sm:self-auto">
          <span className="material-symbols-outlined text-[16px] text-stone-600">palette</span>
          <span>{THEME_OPTIONS.length} Koleksi Desain</span>
        </span>
      </div>

      {/* Filter Segmented Tab: Kategori Adat vs Casual */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100/90 border border-stone-200/70 w-full sm:w-fit overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'adat'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🏛️ Adat Nusantara</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 font-bold">{adatCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('casual')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'casual'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🌿 Modern & Casual</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 font-bold">{casualCount}</span>
        </button>
      </div>

      {/* Grid Kartu Tema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {filteredOptions.map((theme) => {
          const isActive = effectiveActive === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => {
                if (isActive) return;
                handleSelect(theme.id);
              }}
              className={`group rounded-2xl p-4 space-y-3.5 relative transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'border-stone-900 bg-stone-50/60 ring-2 ring-stone-900/10 shadow-md'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {/* Card Mini Preview Mockup */}
              <div
                className={`relative w-full h-36 rounded-xl overflow-hidden flex flex-col items-center justify-center p-3 text-center shadow-inner transition-transform group-hover:scale-[1.01] border ${theme.bgClass}`}
              >
                {/* Active Indicator or Badge */}
                {isActive ? (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Aktif
                  </span>
                ) : theme.badge ? (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[10px] font-medium backdrop-blur-xs shadow-xs">
                    {theme.badge}
                  </span>
                ) : null}

                <span
                  className="material-symbols-outlined text-[28px] mb-1 drop-shadow-xs"
                  style={{ color: theme.accentColor }}
                >
                  {theme.icon}
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold opacity-80">
                  {theme.styleTag}
                </span>
                <p className="font-serif text-sm font-bold tracking-tight mt-1 truncate w-full px-2">
                  {theme.coupleSample}
                </p>
                <div
                  className="w-8 h-0.5 mt-2 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>

              {/* Card Bottom Meta */}
              <div className="flex items-center justify-between pt-1">
                <div className="min-w-0 pr-2">
                  <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-stone-700 transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-stone-500 truncate">
                    {theme.subtitle}
                  </p>
                </div>

                {isActive ? (
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-stone-900 text-white shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all shrink-0">
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
