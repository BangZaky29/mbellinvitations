import React from 'react';
import {
  getTemplateDisplayName,
  getTemplateMeta,
  getTemplatePriceInfo,
} from '../constants/themeMapping';

export interface UnpurchasedThemeModalProps {
  isOpen: boolean;
  slug: string;
  currentThemeId: string;
  publishedThemeId?: string | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onKeepPublishedThemeAndSave: () => void;
  onRevertToOriginalTheme: () => void;
}

export const UnpurchasedThemeModal: React.FC<UnpurchasedThemeModalProps> = ({
  isOpen,
  slug,
  currentThemeId,
  publishedThemeId = 'sunda',
  onClose,
  onProceedToCheckout,
  onKeepPublishedThemeAndSave,
  onRevertToOriginalTheme,
}) => {
  if (!isOpen) return null;

  const currentMeta = getTemplateMeta(currentThemeId);
  const currentDisplayName = getTemplateDisplayName(currentThemeId);
  const publishedDisplayName = publishedThemeId ? getTemplateDisplayName(publishedThemeId) : 'Tema Sebelumnya';
  const priceInfo = getTemplatePriceInfo(currentThemeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overflow-hidden my-auto">
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Dialog"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <div>
            <h3 className="font-title-lg text-lg sm:text-xl text-stone-900 font-bold leading-tight">
              Aktivasi Template Diperlukan
            </h3>
            <p className="text-xs text-stone-500">
              Tema baru belum dibeli untuk tautan undangan ini.
            </p>
          </div>
        </div>

        {/* Card Ringkasan Status Tema */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 mb-5">
          {/* Tema yang Dipilih Sekarang */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: currentMeta.accentColor }}
              >
                <span className="material-symbols-outlined text-[18px]">{currentMeta.icon}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                  Tema Dipilih (Belum Dibeli)
                </span>
                <p className="text-sm font-bold text-stone-900 truncate">{currentDisplayName}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {priceInfo.priceDisplay}
              </span>
            </div>
          </div>

          {/* Tema Publik yang Masih Aktif */}
          <div className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Tema Live Publik Saat Ini:</span>
            </span>
            <span className="font-bold text-stone-900">{publishedDisplayName}</span>
          </div>
        </div>

        {/* Penjelasan Transparan */}
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          Sesuai ketentuan, pembelian template berlaku <strong>sekali per-desain undangan</strong>. Agar tautan publik <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono text-[11px]">/{slug}</code> beralih ke <strong>{currentDisplayName}</strong>, silakan selesaikan aktivasi pembayaran template.
        </p>

        {/* Opsi Aksi */}
        <div className="space-y-2.5">
          {/* Tombol 1: Beli & Terbitkan Sekarang */}
          <button
            type="button"
            onClick={onProceedToCheckout}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-105 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[19px]">rocket_launch</span>
            <span>Beli &amp; Terbitkan {currentDisplayName} ({priceInfo.priceDisplay})</span>
          </button>

          {/* Tombol 2: Simpan Draf Saja (Live Tetap Tema Semula) */}
          <button
            type="button"
            onClick={onKeepPublishedThemeAndSave}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs border border-stone-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-stone-500">bookmark</span>
            <span>Simpan Data Draf Saja (Live Tetap {publishedDisplayName})</span>
          </button>

          {/* Tombol 3: Revert Kembali ke Tema Semula */}
          <button
            type="button"
            onClick={onRevertToOriginalTheme}
            className="w-full py-2 px-4 rounded-xl text-stone-500 hover:text-stone-800 font-medium text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">undo</span>
            <span>Batalkan Pilihan &amp; Kembali ke {publishedDisplayName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
