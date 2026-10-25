import React from 'react';
import type { InvitationData, ThemeConfig } from '../../types/invitation';

export interface SectionVisibilityItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  isRequired?: boolean;
  enabled: boolean;
  tag?: string;
}

interface SectionVisibilityCardProps {
  themeConfig: ThemeConfig;
  formData?: InvitationData;
  onThemeConfigChange?: (config: ThemeConfig) => void;
  onSectionToggle?: (id: string, enabled: boolean) => void;
  onToggleSection?: (id: string, enabled: boolean) => void;
  onApplyPresetVisibility?: (preset: 'all' | 'minimal' | 'reset') => void;
  onNextStep?: () => void;
}

export const SectionVisibilityCard: React.FC<SectionVisibilityCardProps> = ({
  themeConfig,
  formData,
  onThemeConfigChange,
  onSectionToggle,
  onToggleSection,
  onApplyPresetVisibility,
  onNextStep,
}) => {
  const activeSections = themeConfig?.active_sections || [];

  const handleToggle = (id: string, enabled: boolean) => {
    if (onSectionToggle) {
      onSectionToggle(id, enabled);
    } else if (onToggleSection) {
      onToggleSection(id, enabled);
    }
  };

  const handleApplyPreset = (preset: 'all' | 'minimal' | 'reset') => {
    if (onApplyPresetVisibility) {
      onApplyPresetVisibility(preset);
      return;
    }

    if (!onThemeConfigChange) return;

    if (preset === 'all') {
      const allSections = [
        'hero',
        'quote',
        'dresscode',
        'couple',
        'story',
        'event',
        'gallery',
        'gift',
        'rsvp',
        'wishes',
        'livestream',
      ];
      onThemeConfigChange({
        ...themeConfig,
        active_sections: allSections,
        show_quote: true,
        show_dresscode: true,
        show_love_story: true,
        show_gallery: true,
        show_gift: true,
        show_rsvp: true,
        show_wishes: true,
        show_livestream: true,
      });
    } else if (preset === 'minimal') {
      const minimalSections = ['hero', 'quote', 'couple', 'event', 'rsvp', 'wishes'];
      onThemeConfigChange({
        ...themeConfig,
        active_sections: minimalSections,
        show_quote: true,
        show_dresscode: false,
        show_love_story: false,
        show_gallery: false,
        show_gift: false,
        show_rsvp: true,
        show_wishes: true,
        show_livestream: false,
      });
    } else if (preset === 'reset') {
      const defaultSections = [
        'hero',
        'quote',
        'dresscode',
        'couple',
        'story',
        'event',
        'gallery',
        'gift',
        'rsvp',
        'wishes',
        'livestream',
      ];
      onThemeConfigChange({
        ...themeConfig,
        active_sections: defaultSections,
        show_quote: true,
        show_dresscode: true,
        show_love_story: true,
        show_gallery: true,
        show_gift: true,
        show_rsvp: true,
        show_wishes: true,
        show_livestream: true,
      });
    }
  };

  const isEnabled = (id: string): boolean => {
    if (id === 'hero' || id === 'cover' || id === 'couple' || id === 'event') {
      return true; // Bagian wajib
    }
    if (id === 'quote') {
      return themeConfig?.show_quote !== false && activeSections.includes('quote');
    }
    if (id === 'dresscode') {
      return (
        themeConfig?.show_dresscode !== false &&
        formData?.dresscode?.enabled !== false &&
        activeSections.includes('dresscode')
      );
    }
    if (id === 'story') {
      return themeConfig?.show_love_story !== false && activeSections.includes('story');
    }
    if (id === 'gallery') {
      return themeConfig?.show_gallery !== false && activeSections.includes('gallery');
    }
    if (id === 'gift') {
      return themeConfig?.show_gift !== false && activeSections.includes('gift');
    }
    if (id === 'rsvp') {
      return themeConfig?.show_rsvp !== false && activeSections.includes('rsvp');
    }
    if (id === 'wishes') {
      return themeConfig?.show_wishes !== false && activeSections.includes('wishes');
    }
    if (id === 'livestream') {
      return (
        themeConfig?.show_livestream !== false &&
        (activeSections.includes('livestream') || activeSections.includes('live_stream'))
      );
    }
    return activeSections.includes(id);
  };

  const sectionsList: SectionVisibilityItem[] = [
    {
      id: 'hero',
      name: 'Sampul & Salam Pembuka (Cover Hero)',
      description: 'Layar sampul depan dengan foto mempelai, tanggal acara, dan tombol buka undangan',
      icon: 'auto_awesome',
      isRequired: true,
      enabled: true,
      tag: 'Wajib',
    },
    {
      id: 'quote',
      name: 'Doa, Ayat Suci & Kutipan Cinta',
      description: 'Kutipan doa pernikahan lintas agama (Islam Arab RTL, Kristen, Universal, atau Adat)',
      icon: 'menu_book',
      isRequired: false,
      enabled: isEnabled('quote'),
      tag: 'Rekomendasi',
    },
    {
      id: 'dresscode',
      name: 'Panduan Busana (Dress Code Tamu)',
      description: 'Palet warna kondangan dan etiket pakaian yang disarankan bagi tamu undangan',
      icon: 'styler',
      isRequired: false,
      enabled: isEnabled('dresscode'),
      tag: 'Populer',
    },
    {
      id: 'couple',
      name: 'Profil Mempelai (Pria & Wanita)',
      description: 'Foto pasangan, nama lengkap, gelar, instagram, serta nama kedua orang tua',
      icon: 'favorite',
      isRequired: true,
      enabled: true,
      tag: 'Wajib',
    },
    {
      id: 'event',
      name: 'Rangkaian Acara (Akad & Resepsi)',
      description: 'Jadwal, waktu akad/pemberkatan, resepsi, serta integrasi peta Google Maps',
      icon: 'event',
      isRequired: true,
      enabled: true,
      tag: 'Wajib',
    },
    {
      id: 'story',
      name: 'Kisah Cinta (Love Story Timeline)',
      description: 'Momen berkesan perjalanan cinta dari awal bertemu hingga menuju pelaminan',
      icon: 'history_edu',
      isRequired: false,
      enabled: isEnabled('story'),
    },
    {
      id: 'gallery',
      name: 'Galeri Foto Prewedding',
      description: 'Koleksi foto prewedding dalam susunan grid modern dengan pratinjau lightbox',
      icon: 'photo_library',
      isRequired: false,
      enabled: isEnabled('gallery'),
    },
    {
      id: 'gift',
      name: 'Amplop Digital & Kado Pernikahan',
      description: 'Nomor rekening transfer bank, dompet digital, barcode QRIS, dan alamat kirim kado fisik',
      icon: 'redeem',
      isRequired: false,
      enabled: isEnabled('gift'),
    },
    {
      id: 'rsvp',
      name: 'Konfirmasi Kehadiran Tamu (RSVP)',
      description: 'Formulir interaktif bagi tamu untuk konfirmasi kehadiran (Hadir / Ragu / Berhalangan)',
      icon: 'how_to_reg',
      isRequired: false,
      enabled: isEnabled('rsvp'),
    },
    {
      id: 'wishes',
      name: 'Buku Tamu & Ucapan Doa Restu',
      description: 'Dinding pesan ucapan selamat dan doa restu secara langsung dari para tamu',
      icon: 'chat',
      isRequired: false,
      enabled: isEnabled('wishes'),
    },
    {
      id: 'livestream',
      name: 'Siaran Langsung (Live Streaming)',
      description: 'Tautan video YouTube Live / Zoom untuk tamu yang menghadiri secara daring',
      icon: 'videocam',
      isRequired: false,
      enabled: isEnabled('livestream'),
    },
  ];

  const totalActive = sectionsList.filter((s) => s.enabled).length;

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Fitur &amp; Tampilan Template
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Pilih bagian yang ingin ditampilkan atau disembunyikan pada website undangan Anda ({totalActive} dari {sectionsList.length} fitur aktif).
            </p>
          </div>

          {/* Quick Action Presets */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => handleApplyPreset('all')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200/80 transition-colors cursor-pointer"
              title="Aktifkan seluruh bagian tampilan"
            >
              <span className="material-symbols-outlined text-[15px]">done_all</span>
              <span>Semua Aktif</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('minimal')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200/80 transition-colors cursor-pointer"
              title="Tampilkan hanya bagian utama"
            >
              <span className="material-symbols-outlined text-[15px]">filter_list</span>
              <span>Mode Inti</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('reset')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200/80 transition-colors cursor-pointer"
              title="Kembalikan ke settingan bawaan tema"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Section List Cards */}
        <div className="grid grid-cols-1 gap-3">
          {sectionsList.map((section) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                section.enabled
                  ? 'bg-stone-50/70 border-stone-200 hover:border-stone-300 shadow-2xs'
                  : 'bg-stone-50/30 border-stone-200/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border transition-colors ${
                    section.enabled
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-stone-100 border-stone-200/60 text-stone-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px] sm:text-[21px]">{section.icon}</span>
                </div>
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {section.name}
                    </p>
                    {section.tag && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                          section.isRequired
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {section.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* iOS-Style Toggle Switch (Minimum 44px Touch Target) */}
              <div className="flex items-center shrink-0 ml-2">
                {section.isRequired ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={true}
                    disabled={true}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-stone-900 p-0.5 opacity-90 shadow-inner"
                    title="Bagian ini wajib ada pada template undangan"
                  >
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm translate-x-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={section.enabled}
                    onClick={() => handleToggle(section.id, !section.enabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors p-0.5 focus:outline-none shadow-inner ${
                      section.enabled ? 'bg-stone-900' : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                    title={section.enabled ? `Klik untuk sembunyikan ${section.name}` : `Klik untuk tampilkan ${section.name}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        section.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Guidance Prompt to Next Step */}
        {onNextStep && (
          <div className="pt-2 flex items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-100">
            <span className="flex items-center gap-1.5 text-stone-600">
              <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
              Pengaturan visibilitas langsung tersinkron ke pratinjau di sebelah kanan
            </span>
            <button
              type="button"
              onClick={onNextStep}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-stone-700 underline underline-offset-2 cursor-pointer"
            >
              <span>Lanjut ke Data Mempelai</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
