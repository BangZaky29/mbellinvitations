import React from 'react';

interface DeleteTemplateModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[28px]">warning</span>
        </div>
        <div>
          <h4 className="font-serif font-bold text-base text-stone-900">
            Hapus Template Ini?
          </h4>
          <p className="text-xs text-stone-500 mt-1">
            Template ini akan dihapus dari koleksi Anda di cloud. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-xs hover:bg-stone-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Ya, Hapus</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
