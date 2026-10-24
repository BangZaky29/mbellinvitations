import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_WA_TEMPLATE } from '../../../components/dashboard/guest-list/constants';
import { getInvitationFullUrl } from '../../../utils/urlHelper';

export interface WaTemplatePopupModalProps {
  isOpen: boolean;
  invitationSlug?: string;
  coupleNames?: string;
  onClose: () => void;
  onSaved?: (newTemplate: string) => void;
  onCopySuccess?: (msg: string) => void;
}

export const WaTemplatePopupModal: React.FC<WaTemplatePopupModalProps> = ({
  isOpen,
  invitationSlug = 'undangan-baru',
  coupleNames = 'Mempelai Pria & Mempelai Wanita',
  onClose,
  onSaved,
  onCopySuccess,
}) => {
  const storageKey = `mbell_wa_template_${invitationSlug}`;
  const guestStorageKey = `mbell_last_guest_name_${invitationSlug}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [currentText, setCurrentText] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) || DEFAULT_WA_TEMPLATE;
    } catch {
      return DEFAULT_WA_TEMPLATE;
    }
  });

  const [targetGuestName, setTargetGuestName] = useState<string>(() => {
    try {
      return localStorage.getItem(guestStorageKey) || '';
    } catch {
      return '';
    }
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);

  // Re-sync when modal opens or slug changes
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(storageKey);
        setCurrentText(saved || DEFAULT_WA_TEMPLATE);
        const savedGuest = localStorage.getItem(guestStorageKey);
        if (savedGuest !== null) {
          setTargetGuestName(savedGuest);
        }
      } catch {
        setCurrentText(DEFAULT_WA_TEMPLATE);
      }
    }
  }, [isOpen, storageKey, guestStorageKey]);

  if (!isOpen) return null;

  // Hitung tautan undangan personalisasi
  const basePublicUrl = getInvitationFullUrl(invitationSlug);
  const guestTrimmed = targetGuestName.trim();
  const personalizedUrl = guestTrimmed
    ? `${basePublicUrl}?to=${encodeURIComponent(guestTrimmed)}`
    : basePublicUrl;

  // Format pesan siap kirim
  const formattedMessage = currentText
    .replace(/{nama_tamu}/g, guestTrimmed || 'Bapak/Ibu/Saudara/i')
    .replace(/{nama_mempelai}/g, coupleNames || 'Mempelai Pria & Mempelai Wanita')
    .replace(/{link_undangan}/g, personalizedUrl);

  const handleGuestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetGuestName(val);
    try {
      localStorage.setItem(guestStorageKey, val);
    } catch (err) {
      console.warn('Gagal menyimpan nama tamu ke localStorage:', err);
    }
  };

  const handleResetToDefault = () => {
    setCurrentText(DEFAULT_WA_TEMPLATE);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, currentText);
      localStorage.setItem(guestStorageKey, targetGuestName);
    } catch (e) {
      console.warn('Failed to save WA template to localStorage:', e);
    }
    if (onSaved) {
      onSaved(currentText);
    }
    onClose();
  };

  const handleCopyFormatted = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      if (onCopySuccess) {
        onCopySuccess('Pesan WhatsApp terpersonalisasi berhasil disalin!');
      }
    } catch (err) {
      console.warn('Gagal menyalin pesan WA:', err);
    }
  };

  const handleSendWhatsApp = () => {
    try {
      localStorage.setItem(storageKey, currentText);
      localStorage.setItem(guestStorageKey, targetGuestName);
    } catch {}
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Helper untuk menyisipkan variabel {nama_tamu} ke kursor textarea
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

    setTimeout(() => {
      textarea.focus();
      const nextPos = start + varText.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4 my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
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
        <div className="flex items-center gap-2.5 pr-8">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <span className="material-symbols-outlined text-[21px]">chat_bubble</span>
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">
              Pesan Undangan WhatsApp
            </h4>
            <p className="text-[11px] text-stone-500">
              Personalisasikan nama tamu & link otomatis
            </p>
          </div>
        </div>

        {/* INPUT NAMA TAMU */}
        <div className="bg-stone-50/80 border border-stone-200/90 rounded-2xl p-3.5 space-y-1.5">
          <label className="flex items-center justify-between text-xs font-semibold text-stone-800">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">badge</span>
              Nama Tamu / Penerima Undangan
            </span>
            {guestTrimmed && (
              <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Terpersonalisasi
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              value={targetGuestName}
              onChange={handleGuestNameChange}
              placeholder="Contoh: Iwan Sekeluarga"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-stone-400"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[17px] text-stone-400">
              person
            </span>
            {targetGuestName && (
              <button
                type="button"
                onClick={() => {
                  setTargetGuestName('');
                  try {
                    localStorage.removeItem(guestStorageKey);
                  } catch {}
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                title="Hapus nama tamu"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-0.5">
            <span className="material-symbols-outlined text-[14px] text-stone-400 shrink-0">link</span>
            <span className="truncate font-mono text-[10.5px] text-stone-600">
              {personalizedUrl}
            </span>
          </div>
        </div>

        {/* Tab Switcher: Edit Format vs Preview Siap Kirim */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Edit Format Pesan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              <span>Hasil Teks ({guestTrimmed || 'Standar'})</span>
            </button>
          </div>

          {activeTab === 'edit' && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer shrink-0"
              title="Kembalikan format teks ke kata-kata bawaan sistem"
            >
              Reset ke Standar
            </button>
          )}
        </div>

        {activeTab === 'edit' ? (
          <div className="space-y-2">
            {/* Tag Variabel: hanya {nama_tamu} */}
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="text-[11px]">Sisipkan variabel:</span>
              <button
                type="button"
                onClick={() => insertVariable('{nama_tamu}')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[11px] border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                title="Sisipkan variabel nama tamu ke posisi kursor"
              >
                <span>{'{nama_tamu}'}</span>
                <span className="text-[11px] font-sans font-bold">+</span>
              </button>
            </div>

            {/* Textarea Template Editor */}
            <textarea
              ref={textareaRef}
              rows={7}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="w-full p-3 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed shadow-inner"
              placeholder="Ketik format template pesan WhatsApp di sini..."
            />
          </div>
        ) : (
          /* Preview Tampilan Pesan Siap Kirim */
          <div className="space-y-1.5">
            <div className="w-full max-h-56 overflow-y-auto p-3 sm:p-3.5 rounded-xl bg-emerald-950/5 border border-emerald-600/20 text-xs sm:text-sm text-stone-800 font-sans whitespace-pre-wrap leading-relaxed select-text shadow-inner">
              {formattedMessage}
            </div>
            <p className="text-[10.5px] text-stone-500 italic">
              *Teks di atas adalah isi pesan persis seperti yang akan diterima tamu.
            </p>
          </div>
        )}

        {/* CLUSTER TOMBOL AKSI UTAMA */}
        <div className="pt-2 border-t border-stone-200 space-y-2">
          {/* Tombol Salin & Kirim WA */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyFormatted}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
              }`}
              title="Salin pesan lengkap dengan nama tamu dan link personalisasi"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'done' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin!' : 'Salin Pesan WA'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              title="Buka WhatsApp langsung dengan pesan terisi"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Kirim via WA</span>
            </button>
          </div>

          {/* Tombol Simpan Template Format & Batal */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">save</span>
              <span>Simpan Format Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
