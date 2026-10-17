import React from 'react';

interface EditorBottomBarProps {
  activeStep: number;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onRequestPublish: () => void;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  activeStep,
  isSaving,
  onSaveDraft,
  onPrevStep,
  onNextStep,
  onRequestPublish,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/90 mb-1 sm:mb-2">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'
            }`}
        />
        <span className="text-xs sm:text-sm text-stone-600 font-medium">
          {isSaving ? 'Menyimpan perubahan...' : 'Tersimpan otomatis & aman'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Tombol Simpan Draf / Checkpoint */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 font-semibold text-xs sm:text-sm border border-stone-300 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
          title="Simpan editan saat ini sebagai Draf / Checkpoint di Supabase"
        >
          <span className="material-symbols-outlined text-[17px] text-amber-700">bookmark_added</span>
          <span>Simpan Perubahan</span>
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

        {/* Tombol Lanjutkan (Muncul di Step 1-4, di Step 5 tampil tombol Selesai & Terbitkan) */}
        {activeStep < 5 ? (
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
