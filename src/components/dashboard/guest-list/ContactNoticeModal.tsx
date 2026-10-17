import React from 'react';

interface ContactNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBulkModal: () => void;
}

export const ContactNoticeModal: React.FC<ContactNoticeModalProps> = ({
  isOpen,
  onClose,
  onOpenBulkModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">smartphone</span>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-bold text-stone-900 text-base">
            Fitur Khusus Smartphone Android
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Fitur <strong>Ambil dari Kontak HP</strong> menggunakan Web Contact Picker API yang hanya didukung oleh browser smartphone (Google Chrome Android).
          </p>
          <p className="text-xs text-stone-600 pt-1">
            Untuk penggunaan di laptop atau komputer PC, silakan gunakan fitur{' '}
            <strong>⚡ Quick Bulk Paste</strong> yang dapat membaca puluhan nama sekaligus dalam 1 detik!
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBulkModal();
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold shadow-xs cursor-pointer hover:bg-stone-800"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Buka Quick Bulk Paste</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer hover:bg-stone-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
