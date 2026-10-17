import React from 'react';

interface SaveToastNotificationProps {
  toast: { show: boolean; message: string; isError?: boolean } | null;
  onClose: () => void;
}

export const SaveToastNotification: React.FC<SaveToastNotificationProps> = ({
  toast,
  onClose,
}) => {
  if (!toast || !toast.show) return null;

  return (
    <div className="fixed top-20 right-6 z-[150] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${toast.isError
          ? 'bg-red-950/95 text-white border-red-700'
          : 'bg-stone-900/95 text-white border-emerald-500/40 shadow-emerald-950/20'
          }`}
      >
        <span
          className={`material-symbols-outlined text-xl shrink-0 p-1.5 rounded-full ${toast.isError ? 'bg-red-800 text-white' : 'bg-emerald-500/20 text-emerald-400'
            }`}
        >
          {toast.isError ? 'error' : 'cloud_done'}
        </span>
        <div className="text-xs space-y-0.5 min-w-0 flex-1">
          <p className="font-bold text-sm">
            {toast.isError ? 'Gagal Menyimpan' : 'Tersimpan Aman'}
          </p>
          <p className="text-stone-300 leading-relaxed">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
