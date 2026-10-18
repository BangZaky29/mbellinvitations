import React from 'react';

export interface ConfirmLogoutModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  userName?: string | null;
  userEmail?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  isLoggingOut,
  userName,
  userEmail,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const displayName = userName || userEmail?.split('@')[0] || 'Pengguna';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        {/* Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <span className="material-symbols-outlined text-[28px]">logout</span>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 id="logout-modal-title" className="font-serif font-bold text-lg sm:text-xl text-stone-900">
            Konfirmasi Keluar Akun
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Hai <strong className="font-semibold text-stone-900">{displayName}</strong>, apakah Anda yakin ingin keluar dari akun?
          </p>
          <p className="text-[11px] text-stone-600 pt-1">
            Setelah keluar, editor dan template akan dikembalikan ke tampilan awal bawaan (default).
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Keluar...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px]">logout</span>
                <span>Ya, Keluar Akun</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
