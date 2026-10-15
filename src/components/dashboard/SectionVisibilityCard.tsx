import React from 'react';

export interface SectionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  isRequired?: boolean;
  isOptionalBadge?: boolean;
  enabled: boolean;
}

interface SectionVisibilityCardProps {
  sections: SectionItem[];
  onToggleSection: (id: string, enabled: boolean) => void;
  onResetSections: () => void;
  onPublish?: () => void;
  isSaving?: boolean;
}

export const SectionVisibilityCard: React.FC<SectionVisibilityCardProps> = ({
  sections,
  onToggleSection,
  onResetSections,
  onPublish,
  isSaving = false,
}) => {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Atur Visibilitas Section
              </h2>
            </div>
            <p className="text-sm text-stone-500">
              Pilih bagian yang ingin ditampilkan atau disembunyikan pada website undangan Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetSections}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200/80 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Urutan Bawaan</span>
          </button>
        </div>

        {/* Section List */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                section.enabled
                  ? 'bg-stone-50/70 border-stone-200/90 hover:border-stone-300'
                  : 'bg-stone-50/30 border-stone-200/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-stone-400 cursor-grab text-[20px]">
                  drag_indicator
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/90 flex items-center justify-center text-stone-800 shadow-2xs shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-stone-900">
                      {section.name}
                    </p>
                    {section.isOptionalBadge && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-semibold">
                        Opsional
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                {section.isRequired ? (
                  <>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
                      Wajib
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={true}
                      disabled={true}
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-stone-800 p-0.5 opacity-90"
                    >
                      <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm translate-x-5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={section.enabled}
                    onClick={() => onToggleSection(section.id, !section.enabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors p-0.5 focus:outline-none ${
                      section.enabled ? 'bg-stone-900' : 'bg-stone-300'
                    }`}
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
      </section>

      {/* FINALIZATION & SAVE CARD */}
      <section className="bg-gradient-to-br from-stone-900 to-neutral-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-stone-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-2xl">verified</span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                Tahap Terakhir: Siap Diterbitkan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-300">
              Seluruh konfigurasi undangan Anda telah lengkap dan siap disimpan serta diterbitkan secara online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-base">rocket_launch</span>
                <span>{isSaving ? 'Menyimpan...' : 'Selesai & Terbitkan'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Checklist Mini */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/10 text-xs text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>Tema Dipilih</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>Profil Mempelai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>Jadwal &amp; Maps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>Amplop &amp; Galeri</span>
          </div>
        </div>
      </section>
    </div>
  );
};
