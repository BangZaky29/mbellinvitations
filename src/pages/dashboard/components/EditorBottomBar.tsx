import React from 'react';

interface EditorBottomBarProps {
  activeStep: number;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  unsavedCount?: number;
  onSaveDraft: () => void;
  onRevertAll?: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onRequestPublish: () => void;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  activeStep,
  isSaving,
  hasUnsavedChanges = false,
  unsavedCount = 0,
  onSaveDraft,
  onRevertAll,
  onPrevStep,
  onNextStep,
  onRequestPublish,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/90 mb-1 sm:mb-2">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isSaving
              ? 'bg-amber-500 animate-pulse'
              : hasUnsavedChanges && unsavedCount > 0
              ? 'bg-amber-500 animate-pulse'
              : 'bg-emerald-600'
          }`}
        />
        <span className={`text-xs sm:text-sm font-medium ${
          hasUnsavedChanges && unsavedCount > 0 ? 'text-amber-800 font-semibold' : 'text-stone-600'
        }`}>
          {isSaving
            ? 'Menyimpan perubahan...'
            : hasUnsavedChanges && unsavedCount > 0
            ? `${unsavedCount} perubahan belum disimpan`
            : 'Tersimpan otomatis & aman'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Tombol Batalkan / Revert Perubahan */}
        {hasUnsavedChanges && unsavedCount > 0 && onRevertAll && (
          <button
            type="button"
            onClick={onRevertAll}
            disabled={isSaving}
            className="px-3 sm:px-3.5 py-2.5 rounded-xl font-medium text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Kembalikan semua nilai ke kondisi tersimpan semula (Revert)"
          >
            <span className="material-symbols-outlined text-[15px]">undo</span>
            <span className="hidden sm:inline">Batalkan</span>
          </button>
        )}

        {/* Tombol Simpan Draf / Checkpoint */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 ${
            hasUnsavedChanges && unsavedCount > 0
              ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 border border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20 animate-pulse hover:brightness-105'
              : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-300'
          }`}
          title="Simpan editan saat ini sebagai Draf / Checkpoint di Supabase"
        >
          <span className={`material-symbols-outlined text-[17px] ${
            hasUnsavedChanges && unsavedCount > 0 ? 'text-stone-950 font-bold' : 'text-amber-700'
          }`}>
            {hasUnsavedChanges && unsavedCount > 0 ? 'save' : 'bookmark_added'}
          </span>
          <span>Simpan Perubahan</span>
          {hasUnsavedChanges && unsavedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-stone-950 text-amber-300 text-[10px] font-black tracking-tight shadow-xs">
              +{unsavedCount}
            </span>
          )}
        </button>

        {activeStep > 1 && (
          <button
            type="button"
            onClick={onPrevStep}
            className="px-4 py-2.5 rounded-xl bg-white text-stone-700 font-semibold text-xs sm:text-sm border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
          >
            Sebelumnya
          </button>
        )}

        {/* Tombol Lanjutkan (Muncul di Step 1-5, di Step 6 tampil tombol Selesai & Terbitkan) */}
        {activeStep < 6 ? (
          <button
            type="button"
            onClick={onNextStep}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs sm:text-sm hover:bg-stone-800 transition-transform active:scale-95 shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>Lanjutkan</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onRequestPublish}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            <span>Selesai &amp; Terbitkan</span>
          </button>
        )}
      </div>
    </div>
  );
};
