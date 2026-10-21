import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_WA_TEMPLATE } from '../../../components/dashboard/guest-list/constants';

export interface WaTemplatePopupModalProps {
  isOpen: boolean;
  invitationSlug?: string;
  onClose: () => void;
  onSaved?: (newTemplate: string) => void;
}

export const WaTemplatePopupModal: React.FC<WaTemplatePopupModalProps> = ({
  isOpen,
  invitationSlug = 'undangan-baru',
  onClose,
  onSaved,
}) => {
  const storageKey = `mbell_wa_template_${invitationSlug}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [currentText, setCurrentText] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) || DEFAULT_WA_TEMPLATE;
    } catch {
      return DEFAULT_WA_TEMPLATE;
    }
  });

  // Re-sync when modal opens or slug changes
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(storageKey);
        setCurrentText(saved || DEFAULT_WA_TEMPLATE);
      } catch {
        setCurrentText(DEFAULT_WA_TEMPLATE);
      }
    }
  }, [isOpen, storageKey]);

  if (!isOpen) return null;

  const handleResetToDefault = () => {
    setCurrentText(DEFAULT_WA_TEMPLATE);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, currentText);
    } catch (e) {
      console.warn('Failed to save WA template to localStorage:', e);
    }
    if (onSaved) {
      onSaved(currentText);
    }
    onClose();
  };

  // Helper untuk menyisipkan variabel tag ke kursor textarea
  const insertVariable = (varText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setCurrentText((prev) => `${prev} ${varText}`);
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);
    const nextText = `${before}${varText}${after}`;

    setCurrentText(nextText);

    // Kembalikan kursor tepat setelah teks tag yang disisipkan
    setTimeout(() => {
      textarea.focus();
      const nextPos = start + varText.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200 text-stone-900 space-y-4 my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
          title="Tutup dialog"
        >
          <span className="material-symbols-outlined text-[19px]">close</span>
        </button>

        {/* Header Modal */}
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-stone-900">
              Template Pesan Pengantar WhatsApp
            </h4>
          </div>
        </div>

        {/* Info & Tombol Reset ke Standar */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <p className="leading-relaxed text-xs">
            Pesan otomatis muncul saat klik <strong>Salin</strong> atau <strong>Kirim WA</strong>:
          </p>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer shrink-0 ml-2"
            title="Kembalikan format teks ke kata-kata bawaan sistem"
          >
            Reset ke Standar
          </button>
        </div>

        {/* Variabel Tags Interaktif */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => insertVariable('{nama_tamu}')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] border border-stone-200 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
            title="Klik untuk sisipkan variabel nama tamu"
          >
            <span>{'{nama_tamu}'}</span>
            <span className="text-[10px] text-stone-400 font-sans">+</span>
          </button>
          <button
            type="button"
            onClick={() => insertVariable('{nama_mempelai}')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] border border-stone-200 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
            title="Klik untuk sisipkan variabel nama kedua mempelai"
          >
            <span>{'{nama_mempelai}'}</span>
            <span className="text-[10px] text-stone-400 font-sans">+</span>
          </button>
          <button
            type="button"
            onClick={() => insertVariable('{link_undangan}')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] border border-stone-200 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
            title="Klik untuk sisipkan variabel tautan undangan"
          >
            <span>{'{link_undangan}'}</span>
            <span className="text-[10px] text-stone-400 font-sans">+</span>
          </button>
        </div>

        {/* Textarea Template Editor */}
        <div>
          <textarea
            ref={textareaRef}
            rows={8}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="w-full p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed shadow-inner"
            placeholder="Ketik format template pesan WhatsApp di sini..."
          />
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">check</span>
            <span>Simpan Template Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
