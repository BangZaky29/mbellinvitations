import React, { useEffect } from 'react';

export interface ConfirmDeleteImageModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  imageUrl?: string | null;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDeleteImageModal: React.FC<ConfirmDeleteImageModalProps> = ({
  isOpen,
  title = 'Hapus Foto Permanen?',
  description = 'Foto ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.',
  imageUrl,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-scaleUp">
        {/* Tombol Tutup X */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-30 cursor-pointer z-10"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6">
          {/* Header Icon & Judul */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
              <span className="material-symbols-outlined text-[26px]">delete_forever</span>
            </div>
            <div className="pr-6">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Preview Foto yang Akan Dihapus (Jika Ada) */}
          {imageUrl && (
            <div className="relative mb-4 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video max-h-48 flex items-center justify-center shadow-inner">
              <img
                src={imageUrl}
                alt="Foto yang akan dihapus"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika file storage fisik sudah tidak ada
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                <span>Akan Dihapus</span>
              </div>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Hapus Permanen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
