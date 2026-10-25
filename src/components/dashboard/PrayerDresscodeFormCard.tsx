import React, { useState, useRef, useEffect } from 'react';
import type { InvitationData, DresscodeConfig, DresscodeColor } from '../../types/invitation';

interface PrayerDresscodeFormCardProps {
  formData: InvitationData;
  onQuoteChange: (patch: {
    quote?: string;
    quote_source?: string;
    quote_arabic?: string;
    quote_religion?: string;
    quote_title?: string;
  }) => void;
  onDresscodeChange: (dresscode: DresscodeConfig) => void;
  onToggleDresscode: (enabled: boolean) => void;
}

// Preset Doa Lintas Agama & Budaya
interface PrayerPreset {
  id: string;
  label: string;
  icon: string;
  religion: string;
  title: string;
  arabic?: string;
  quote: string;
  source: string;
}

const PRAYER_PRESETS: PrayerPreset[] = [
  {
    id: 'islam-rum-21',
    label: 'Islam: QS. Ar-Rum: 21',
    icon: 'mosque',
    religion: 'islam',
    title: 'Kalam Ilahi & Doa Suci',
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    quote:
      'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
    source: 'QS. Ar-Rum: 21',
  },
  {
    id: 'islam-nur-32',
    label: 'Islam: QS. An-Nur: 32',
    icon: 'mosque',
    religion: 'islam',
    title: 'Janji Keberkahan',
    arabic:
      'وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ',
    quote:
      'Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan. Jika mereka miskin, Allah akan memampukan mereka dengan karunia-Nya.',
    source: 'QS. An-Nur: 32',
  },
  {
    id: 'islam-hadits-barakah',
    label: 'Islam: Doa Keberkahan Nabi',
    icon: 'favorite',
    religion: 'islam',
    title: 'Doa Restu Nabi Muhammad SAW',
    arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    quote:
      'Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, serta menghimpun kalian berdua dalam kebaikan dan keridhaan-Nya selamanya.',
    source: 'HR. Abu Dawud & At-Tirmidzi',
  },
  {
    id: 'kristen-1korintus-13',
    label: 'Kristen: 1 Korintus 13:4-8',
    icon: 'church',
    religion: 'kristen',
    title: 'Hakekat Kasih Sejati',
    arabic: '',
    quote:
      'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Kasih tidak berkesudahan.',
    source: '1 Korintus 13:4-8',
  },
  {
    id: 'kristen-matius-19',
    label: 'Kristen: Matius 19:6',
    icon: 'church',
    religion: 'kristen',
    title: 'Penyatuan Kudus Ilahi',
    arabic: '',
    quote:
      'Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.',
    source: 'Matius 19:6',
  },
  {
    id: 'katolik-kolose-3',
    label: 'Katolik: Kolose 3:14',
    icon: 'church',
    religion: 'katolik',
    title: 'Pengikat Kesempurnaan',
    arabic: '',
    quote:
      'Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan. Damai sejahtera Kristus kiranya memerintah dalam hatimu.',
    source: 'Kolose 3:14-15',
  },
  {
    id: 'adat-minang',
    label: 'Adat Minang: Pepatah Pusaka',
    icon: 'temple_buddhist',
    religion: 'islam',
    title: 'Petuah Sakral Minangkabau',
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    quote:
      'Saikek bak siriah, sarumpun bak sarai. Sahino samalu, sasakik sasanang. Tali tigo sapilin, tungku tigo sajarangan. Rukun damai manjalani hiduik baru manuju rumah tanggo sakinah mawaddah warahmah.',
    source: 'Pepatah Adat Minangkabau • Baralek Gadang',
  },
  {
    id: 'adat-batak',
    label: 'Adat Batak: Ulos Holong',
    icon: 'military_tech',
    religion: 'kristen',
    title: 'Pasupasu Dohot Holong Ni Kristus',
    arabic: '',
    quote:
      '“Dua gabe sada, marsitangiangan di bagas holong ni Kristus.” Tubu ma anak na bisuk jala boru na malo marparange. Sai gabe jala horas ma pardengganbasaon muna saleleng lelengna.',
    source: 'Umpasa Batak Toba • 1 Korintus 13:4-8',
  },
  {
    id: 'universal-gibran',
    label: 'Universal: Puisi Cinta Khalil Gibran',
    icon: 'auto_stories',
    religion: 'universal',
    title: 'Ikrar Jiwa Bersama',
    arabic: '',
    quote:
      'Berdirilah bersama, namun jangan terlalu dekat. Berikan ruang bagi angin surga menari di antara kalian. Cintailah satu sama lain, namun jangan jadikan cinta sebagai belenggu, melainkan laut yang bergerak di antara pantai jiwamu.',
    source: 'Kahlil Gibran • Sang Nabi',
  },
];

// Preset Palet Warna Dresscode
interface ColorPreset {
  name: string;
  category: string;
  colors: DresscodeColor[];
}

const DRESSCODE_COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'Earthy Terracotta & Sage',
    category: 'Botanical / Alam',
    colors: [
      { name: 'Terracotta', hex: '#9E3B2B' },
      { name: 'Sage Green', hex: '#7A8471' },
      { name: 'Warm Ivory', hex: '#FAF6EE' },
      { name: 'Ebony Wood', hex: '#241C18' },
    ],
  },
  {
    name: 'Royal Emerald & Pure Gold',
    category: 'Mewah & Glamor',
    colors: [
      { name: 'Royal Emerald', hex: '#1E4B38' },
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Ivory Cream', hex: '#FAF6EE' },
      { name: 'Velvet Noir', hex: '#121816' },
    ],
  },
  {
    name: 'Soft Dusty Rose & Champagne',
    category: 'Romantic Pastel',
    colors: [
      { name: 'Dusty Rose', hex: '#B76E79' },
      { name: 'Champagne Gold', hex: '#C5A059' },
      { name: 'Warm Silk', hex: '#F4EFE6' },
      { name: 'Burgundy Wine', hex: '#4A121A' },
    ],
  },
  {
    name: 'Monochrome Modern & Silver',
    category: 'Minimalis',
    colors: [
      { name: 'Charcoal Black', hex: '#1A1A1A' },
      { name: 'Slate Gray', hex: '#4A4A4A' },
      { name: 'Platinum Silver', hex: '#B0B0B0' },
      { name: 'Pure White', hex: '#FFFFFF' },
    ],
  },
  {
    name: 'Tradisi Sogan Jawa',
    category: 'Adat Nusantara',
    colors: [
      { name: 'Sogan Gold', hex: '#C5A059' },
      { name: 'Coklat Truntum', hex: '#5A3825' },
      { name: 'Gading Anget', hex: '#FAF6EE' },
      { name: 'Hitam Wulung', hex: '#1F1A17' },
      { name: 'Merah Maroon', hex: '#6B1D28' },
    ],
  },
  {
    name: 'Minang Baralek Gadang',
    category: 'Adat Nusantara',
    colors: [
      { name: 'Burgundy', hex: '#4A121A' },
      { name: 'Gold', hex: '#D4AF37' },
      { name: 'Ivory', hex: '#FAF6EE' },
      { name: 'Dusty Rose', hex: '#B76E79' },
      { name: 'Emerald', hex: '#1E4B38' },
    ],
  },
  {
    name: 'Batak Ulos & Sortali',
    category: 'Adat Nusantara',
    colors: [
      { name: 'Terracotta', hex: '#9E3B2B' },
      { name: 'Ebony Wood', hex: '#241C18' },
      { name: 'Sortali Gold', hex: '#C8A253' },
      { name: 'Warm Ivory', hex: '#F4EFE6' },
      { name: 'Ulos Maroon', hex: '#661D24' },
      { name: 'Forest Sage', hex: '#5B6349' },
    ],
  },
];

export const PrayerDresscodeFormCard: React.FC<PrayerDresscodeFormCardProps> = ({
  formData,
  onQuoteChange,
  onDresscodeChange,
  onToggleDresscode,
}) => {
  const [activeTab, setActiveTab] = useState<'prayer' | 'dresscode'>('prayer');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [showAllPrayerPresets, setShowAllPrayerPresets] = useState<boolean>(false);
  const prayerScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScrollState = () => {
    if (prayerScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = prayerScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollState();
  }, [activeTab, showAllPrayerPresets]);

  const scrollPrayerPresets = (direction: 'left' | 'right') => {
    if (prayerScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      prayerScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollState, 300);
    }
  };

  // State Dresscode aman dengan default fallback
  const dresscode: DresscodeConfig = formData.dresscode || {
    enabled: true,
    title: 'Panduan Busana (Dress Code)',
    subtitle: 'Tamu undangan diharapkan mengenakan pakaian formal bernuansa warna berikut:',
    colors: [
      { name: 'Sage Green', hex: '#7A8471' },
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Warm Ivory', hex: '#FAF6EE' },
      { name: 'Terracotta', hex: '#9E3B2B' },
    ],
  };

  const currentColors = dresscode.colors || [];

  // Handler Preset Doa
  const handleSelectPrayerPreset = (preset: PrayerPreset) => {
    setSelectedPresetId(preset.id);
    onQuoteChange({
      quote_title: preset.title,
      quote_religion: preset.religion,
      quote_arabic: preset.arabic || '',
      quote: preset.quote,
      quote_source: preset.source,
    });
  };

  // Deteksi preset aktif secara presisi (exact match) agar tidak terjadi konflik substring nama ayat
  const activePresetId = React.useMemo(() => {
    if (selectedPresetId) return selectedPresetId;
    const exactMatch = PRAYER_PRESETS.find(
      (p) =>
        p.quote.trim() === (formData.quote || '').trim() ||
        p.source.trim() === (formData.quote_source || '').trim()
    );
    return exactMatch ? exactMatch.id : null;
  }, [selectedPresetId, formData.quote, formData.quote_source]);

  // Handler Preset Warna Dresscode
  const handleApplyColorPreset = (preset: ColorPreset) => {
    onDresscodeChange({
      ...dresscode,
      colors: [...preset.colors],
    });
  };

  // Handler Update Warna Satuan
  const handleUpdateColor = (index: number, patch: Partial<DresscodeColor>) => {
    const updated = currentColors.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onDresscodeChange({
      ...dresscode,
      colors: updated,
    });
  };

  // Handler Tambah Warna Baru
  const handleAddColor = () => {
    if (currentColors.length >= 8) return;
    const defaultNewColor: DresscodeColor = {
      name: `Warna ${currentColors.length + 1}`,
      hex: '#8C6D58',
    };
    onDresscodeChange({
      ...dresscode,
      colors: [...currentColors, defaultNewColor],
    });
  };

  // Handler Hapus Warna
  const handleRemoveColor = (index: number) => {
    if (currentColors.length <= 1) return;
    const updated = currentColors.filter((_, i) => i !== index);
    onDresscodeChange({
      ...dresscode,
      colors: updated,
    });
  };

  const isIslam = formData.quote_religion === 'islam' || Boolean(formData.quote_arabic);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Doa, Ayat Suci &amp; Dress Code
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Sesuaikan teks doa pembuka, ayat kitab suci, serta panduan warna pakaian tamu dalam satu pengaturan terpadu.
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('prayer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'prayer'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Doa &amp; Kutipan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dresscode')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dresscode'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">styler</span>
              <span>Panduan Busana</span>
              {dresscode.enabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PENGATURAN TEKS DOA & AYAT SUCI                   */}
        {/* ======================================================== */}
        {activeTab === 'prayer' && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Preset Selector Buttons (Dengan Indikator Scroll & Mode Grid Kompak) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Pilih Preset Doa &amp; Ayat
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    <span>{PRAYER_PRESETS.length} Pilihan</span>
                    <span className="material-symbols-outlined text-[12px] text-emerald-600 animate-pulse">
                      arrow_forward
                    </span>
                  </span>
                </div>

                {/* Toggle Mode: Baris Geser ↔ Grid Tampilkan Semua */}
                <button
                  type="button"
                  onClick={() => setShowAllPrayerPresets((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-[11px] font-semibold transition-all cursor-pointer border border-stone-200"
                  title={showAllPrayerPresets ? 'Beralih ke 1 baris geser' : 'Tampilkan seluruh 8 preset dalam bentuk kisi'}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {showAllPrayerPresets ? 'view_carousel' : 'grid_view'}
                  </span>
                  <span>{showAllPrayerPresets ? 'Mode Geser' : 'Lihat Semua (8)'}</span>
                </button>
              </div>

              {showAllPrayerPresets ? (
                /* MODE GRID: Menampilkan semua 8 preset tersusun rapi */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 animate-in fade-in duration-200">
                  {PRAYER_PRESETS.map((preset) => {
                    const isSelected = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPrayerPreset(preset)}
                        className={`flex items-start gap-2 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs ring-2 ring-stone-900/20'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/90'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                            isSelected ? 'text-amber-300' : 'text-stone-500'
                          }`}
                        >
                          {preset.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold leading-tight truncate">
                            {preset.label}
                          </p>
                          <p
                            className={`text-[10px] mt-0.5 line-clamp-1 ${
                              isSelected ? 'text-stone-300' : 'text-stone-500'
                            }`}
                          >
                            {preset.source}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[16px] text-amber-300 shrink-0">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* MODE HORIZONTAL SLIDER: Dengan Gradient Fade di Kanan & Tombol Panah Scroll */
                <div className="relative group">
                  {/* Tombol Panah Kiri (Muncul saat sudah digeser ke kanan) */}
                  {canScrollLeft && (
                    <button
                      type="button"
                      onClick={() => scrollPrayerPresets('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-stone-200 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-all cursor-pointer"
                      aria-label="Geser ke kiri"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                  )}

                  {/* Container Baris Tombol Scrollable */}
                  <div
                    ref={prayerScrollRef}
                    onScroll={checkScrollState}
                    className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
                  >
                    {PRAYER_PRESETS.map((preset) => {
                      const isSelected = activePresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPrayerPreset(preset)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border snap-start ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">{preset.icon}</span>
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Gradient Fade Affordance & Tombol Panah Kanan */}
                  {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-1.5 flex items-center pl-6 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none">
                      <button
                        type="button"
                        onClick={() => scrollPrayerPresets('right')}
                        className="pointer-events-auto w-7 h-7 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-all cursor-pointer shrink-0"
                        aria-label="Geser ke kanan"
                        title="Geser melihat preset lainnya"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hint Bawah Tambahan untuk Kemudahan Pengguna Mobile */}
              {!showAllPrayerPresets && (
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5 px-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-stone-400">swipe</span>
                    <span>Usap ke kanan untuk Islam, Kristen, Katolik, Adat &amp; Universal</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllPrayerPresets(true)}
                    className="text-stone-500 hover:text-stone-800 font-medium underline underline-offset-2 cursor-pointer"
                  >
                    Tampilkan Semua
                  </button>
                </div>
              )}
            </div>

            {/* 2. Form Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Judul Bagian Doa / Kutipan
                </label>
                <input
                  type="text"
                  value={formData.quote_title || ''}
                  onChange={(e) => onQuoteChange({ quote_title: e.target.value })}
                  placeholder="Contoh: Doa &amp; Ayat Suci / Kalam Ilahi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-xs sm:text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Sumber / Referensi Ayat
                </label>
                <input
                  type="text"
                  value={formData.quote_source || ''}
                  onChange={(e) => onQuoteChange({ quote_source: e.target.value })}
                  placeholder="Contoh: QS. Ar-Rum: 21 atau 1 Korintus 13:4-8"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-xs sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* 3. Teks Arab / Naskah Asli (RTL Support) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  Teks Naskah Asli / Kaligrafi Arab (Opsional)
                </label>
                <span className="text-[11px] text-stone-400">
                  Mendukung tulisan Arab berharakat (RTL)
                </span>
              </div>
              <textarea
                rows={3}
                dir={isIslam ? 'rtl' : 'ltr'}
                value={formData.quote_arabic || ''}
                onChange={(e) => onQuoteChange({ quote_arabic: e.target.value })}
                placeholder="Masukkan teks ayat Arab atau naskah asli (misal: وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm sm:text-base leading-relaxed transition-all font-serif"
              />
            </div>

            {/* 4. Terjemahan / Teks Utama Doa */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Terjemahan / Pesan Utama Doa &amp; Kutipan
              </label>
              <textarea
                rows={4}
                value={formData.quote || ''}
                onChange={(e) => onQuoteChange({ quote: e.target.value })}
                placeholder="Tuliskan terjemahan doa atau kata-kata mutiara pernikahan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-xs sm:text-sm leading-relaxed transition-all"
              />
            </div>

            {/* 5. Mini Live Preview Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200/60 pb-2">
                <span>Pratinjau Tampilan Doa di Template</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  Sinkron Langsung
                </span>
              </div>
              <div className="text-center max-w-md mx-auto py-2 space-y-2">
                {formData.quote_arabic && (
                  <p className="font-serif text-base sm:text-lg leading-relaxed text-stone-800" dir="rtl">
                    {formData.quote_arabic}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed">
                  &ldquo;{formData.quote || 'Teks doa atau kutipan pernikahan akan tampil di sini...'}&rdquo;
                </p>
                {formData.quote_source && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    — {formData.quote_source}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PENGATURAN PANDUAN BUSANA (DRESSCODE KONDANGAN)    */}
        {/* ======================================================== */}
        {activeTab === 'dresscode' && (
          <div className="space-y-6 animate-fade-in">
            {/* Toggle Status Dresscode */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-stone-900">
                  Aktifkan Panduan Busana (Dress Code)
                </p>
                <p className="text-xs text-stone-500">
                  Tampilkan bagian palet warna kondangan pada website undangan
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={dresscode.enabled}
                onClick={() => onToggleDresscode(!dresscode.enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors p-0.5 focus:outline-none shadow-inner ${
                  dresscode.enabled ? 'bg-stone-900' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    dresscode.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {dresscode.enabled ? (
              <>
                {/* 1. Header Text Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Judul Bagian Busana
                    </label>
                    <input
                      type="text"
                      value={dresscode.title || ''}
                      onChange={(e) =>
                        onDresscodeChange({
                          ...dresscode,
                          title: e.target.value,
                        })
                      }
                      placeholder="Contoh: Panduan Busana (Dress Code)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-xs sm:text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Catatan / Pesan untuk Tamu
                    </label>
                    <input
                      type="text"
                      value={dresscode.subtitle || ''}
                      onChange={(e) =>
                        onDresscodeChange({
                          ...dresscode,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="Contoh: Tamu undangan diharapkan mengenakan pakaian bernuansa warna berikut:"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-xs sm:text-sm transition-all"
                    />
                  </div>
                </div>

                {/* 2. Preset Palet Warna 1-Klik */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Pilih Rekomendasi Palet Warna Kondangan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {DRESSCODE_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyColorPreset(preset)}
                        className="flex flex-col p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-stone-800 group-hover:text-stone-950">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {preset.category}
                          </span>
                        </div>
                        {/* Swatches dots row */}
                        <div className="flex items-center gap-1.5">
                          {preset.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} (${c.hex})`}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Editor Warna Satuan Dinamis */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Daftar Warna Busana ({currentColors.length} dari maks. 8)
                    </label>
                    {currentColors.length < 8 && (
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Tambah Warna</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentColors.map((colorItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                      >
                        {/* Native Color Picker Circle */}
                        <div className="relative w-8 h-8 rounded-full shrink-0 border border-stone-300 shadow-2xs overflow-hidden cursor-pointer group">
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: colorItem.hex }}
                          />
                          <input
                            type="color"
                            value={colorItem.hex}
                            onChange={(e) => handleUpdateColor(idx, { hex: e.target.value.toUpperCase() })}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            title="Klik untuk memilih warna"
                          />
                        </div>

                        {/* Nama Warna */}
                        <input
                          type="text"
                          value={colorItem.name}
                          onChange={(e) => handleUpdateColor(idx, { name: e.target.value })}
                          placeholder="Nama Warna (misal: Sage Green)"
                          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium focus:border-stone-800 focus:outline-none"
                        />

                        {/* Kode HEX */}
                        <input
                          type="text"
                          value={colorItem.hex}
                          onChange={(e) => handleUpdateColor(idx, { hex: e.target.value.toUpperCase() })}
                          maxLength={7}
                          placeholder="#000000"
                          className="w-20 px-2 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-mono font-semibold text-center uppercase focus:border-stone-800 focus:outline-none"
                        />

                        {/* Hapus Warna */}
                        {currentColors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(idx)}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus warna ini"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Mini Live Preview Bar */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    <span>Pratinjau Palet Busana di Template</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      Live Output
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4 flex-wrap py-2">
                    {currentColors.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <span
                          className="w-9 h-9 rounded-full border-2 border-white shadow-md transform hover:scale-110 transition-transform"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11px] font-semibold text-stone-800">
                          {c.name}
                        </span>
                        <span className="text-[9px] font-mono text-stone-400">
                          {c.hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="material-symbols-outlined text-3xl text-stone-400">styler</span>
                <p className="text-xs font-semibold text-stone-600">
                  Bagian Panduan Busana saat ini dinonaktifkan.
                </p>
                <p className="text-[11px] text-stone-400">
                  Aktifkan switch di atas untuk menampilkan panduan warna busana bagi tamu undangan Anda.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
