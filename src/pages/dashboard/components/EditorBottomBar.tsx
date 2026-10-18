import React from 'react';

interface EditorBottomBarProps {
  activeStep: number;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  unsavedCount?: number;
  isAlreadyPublished?: boolean;
  isTemplateChanged?: boolean;
  onSaveDraft: () => void;
  onRevertAll?: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onRequestPublish: () => void;
  onOpenPreview?: () => void;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  activeStep,
  isSaving,
  hasUnsavedChanges = false,
  unsavedCount = 0,
  isAlreadyPublished = false,
  isTemplateChanged = false,
  onSaveDraft,
  onRevertAll,
  onPrevStep,
  onNextStep,
  onRequestPublish,
  onOpenPreview,
}) => {
  const shouldShowPublishButton = !isAlreadyPublished || isTemplateChanged;

  return (
    <div className="fixed bottom-[72px] left-3 right-3 max-w-lg mx-auto sm:static sm:bottom-auto sm:left-auto sm:right-auto sm:max-w-none sm:mx-0 z-30 bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-stone-200/90 sm:border-0 sm:border-t sm:border-stone-200/90 shadow-lg sm:shadow-none rounded-full sm:rounded-none px-3.5 py-1.5 sm:p-0 sm:pt-4 sm:mb-2 transition-all w-auto sm:w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* SISI KIRI: INDIKATOR STEP TAHAP (Ramping & Bersih) */}
        <div className="flex items-center gap-2 shrink-0 py-1">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isSaving
                ? 'bg-amber-500 animate-pulse'
                : hasUnsavedChanges && unsavedCount > 0
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-600'
            }`}
            title={
              isSaving
                ? 'Menyimpan perubahan...'
                : hasUnsavedChanges && unsavedCount > 0
                ? `${unsavedCount} perubahan belum disimpan`
                : 'Tersimpan di database'
            }
          />
          <span className="text-xs font-semibold text-stone-500">
            Tahap {activeStep}/6
          </span>
        </div>

        {/* SISI KANAN: BARIS TOMBOL AKSI (Toolbar Rapi, Ergonomis & Bebas Tabrakan) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
          {/* Tombol Batalkan / Revert Perubahan (Button Kembali) */}
          {hasUnsavedChanges && unsavedCount > 0 && onRevertAll && (
            <button
              type="button"
              onClick={onRevertAll}
              disabled={isSaving}
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-full sm:rounded-xl font-medium text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs shrink-0 active:scale-95"
              title="Kembalikan semua nilai ke kondisi semula (Batalkan)"
            >
              <span className="material-symbols-outlined text-[17px]">undo</span>
              <span className="hidden md:inline">Batalkan</span>
            </button>
          )}

          {/* Tombol Simpan Perubahan / Checkpoint */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className={`p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              hasUnsavedChanges && unsavedCount > 0
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 border border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20 hover:brightness-105'
                : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-300'
            }`}
            title="Simpan draf perubahan ke database"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                hasUnsavedChanges && unsavedCount > 0 ? 'text-stone-950 font-bold' : 'text-amber-700'
              }`}
            >
              {hasUnsavedChanges && unsavedCount > 0 ? 'save' : 'bookmark_added'}
            </span>
            <span className="hidden sm:inline">Simpan</span>
            {hasUnsavedChanges && unsavedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-stone-950 text-amber-300 text-[10px] font-black tracking-tight shadow-xs">
                +{unsavedCount}
              </span>
            )}
          </button>

          {/* Tombol Terbitkan (Rocket) atau Status Live (Checklist Verified) */}
          {shouldShowPublishButton ? (
            isTemplateChanged || activeStep === 6 ? (
              <button
                type="button"
                onClick={onRequestPublish}
                disabled={isSaving}
                className="p-1.5 sm:px-3.5 sm:py-2 rounded-full sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 shrink-0"
                title={
                  isTemplateChanged
                    ? 'Perubahan tema terdeteksi. Klik untuk terbitkan tema baru!'
                    : 'Undangan masih draf. Klik untuk terbitkan sekarang!'
                }
              >
                <span className="material-symbols-outlined text-[18px] text-stone-950">rocket_launch</span>
                <span className="hidden sm:inline">Terbitkan</span>
              </button>
            ) : null
          ) : isAlreadyPublished ? (
            <button
              type="button"
              onClick={onRequestPublish}
              disabled={isSaving}
              className="p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1 bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-500/40 shrink-0"
              title="Undangan live dan aktif di tautan publik"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">verified</span>
              <span className="hidden sm:inline text-white">Live</span>
            </button>
          ) : null}

          {/* Tombol Sebelumnya (Step > 1) */}
          {activeStep > 1 && (
            <button
              type="button"
              onClick={onPrevStep}
              className="p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl bg-white text-stone-700 font-semibold text-xs sm:text-sm border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center justify-center gap-1 active:scale-95"
              title="Kembali ke tahap sebelumnya"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden md:inline">Sebelumnya</span>
            </button>
          )}

          {/* Tombol Lanjutkan (Icon Panah di mobile, Teks + Panah di desktop) */}
          {activeStep < 6 && (
            <button
              type="button"
              onClick={onNextStep}
              className="p-1.5 sm:px-3.5 sm:py-2 rounded-full sm:rounded-xl bg-stone-900 text-white font-semibold text-xs sm:text-sm hover:bg-stone-800 transition-transform active:scale-95 shadow-sm cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              title="Lanjutkan ke tahap berikutnya"
            >
              <span className="hidden md:inline">Lanjutkan</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}

          {/* Tombol Preview (Icon Mata di mobile, Mata + Teks di desktop) */}
          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-sm cursor-pointer flex items-center justify-center gap-1.5 shrink-0 border border-white/10"
              title="Buka Pratinjau Undangan (Preview)"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span className="hidden md:inline">Preview</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
