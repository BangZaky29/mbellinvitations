import React from 'react';

interface ConfirmPublishModalProps {
  isOpen: boolean;
  slug: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmPublishModal: React.FC<ConfirmPublishModalProps> = ({
  isOpen,
  slug,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-5 shadow-xs">
          <span className="material-symbols-outlined text-3xl">rocket_launch</span>
        </div>

        {/* Title & Description */}
        <h3 className="font-title-lg text-title-lg text-stone-900 font-bold mb-2">
          Konfirmasi Simpan &amp; Terbitkan
        </h3>
        <p className="font-body-md text-body-md text-stone-600 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menyimpan seluruh perubahan pada undangan <span className="font-semibold text-stone-900">mbell.id/{slug}</span> dan melanjutkan proses penerbitan?
        </p>

        {/* Checklist Highlights */}
        <div className="space-y-2 mb-6 bg-stone-50 rounded-2xl p-4 border border-stone-200/70 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
            <span>Semua data mempelai &amp; jadwal tersimpan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
            <span>Link Google Maps &amp; amplop rekening diperbarui</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
            <span>Siap dibagikan ke seluruh tamu undangan</span>
          </div>
        </div>

        {/* Action Buttons: Yakin Simpan / Kembali */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-label-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-label-md text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Yakin &amp; Simpan</span>
            <span className="material-symbols-outlined text-base">check</span>
          </button>
        </div>
      </div>
    </div>
  );
};
