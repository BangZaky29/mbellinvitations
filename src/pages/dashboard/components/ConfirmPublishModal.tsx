import React from 'react';
import { getTemplateDisplayName, getTemplateMeta, getTemplatePriceInfo } from '../constants/themeMapping';
import { getInvitationDisplayUrl } from '../../../utils/urlHelper';

export interface ConfirmPublishModalProps {
  isOpen: boolean;
  slug: string;
  coupleName?: string;
  currentThemeId: string;
  publishedThemeId?: string | null;
  isAlreadyPublished?: boolean;
  isTemplateChanged?: boolean;
  isUnlocked?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onConfirmSameTemplatePublish: () => void;
  onProceedToPayment: () => void;
}

export const ConfirmPublishModal: React.FC<ConfirmPublishModalProps> = ({
  isOpen,
  slug,
  coupleName = 'Mempelai Pengantin',
  currentThemeId,
  publishedThemeId = null,
  isAlreadyPublished = false,
  isTemplateChanged = false,
  isUnlocked = false,
  isSaving = false,
  onClose,
  onConfirmSameTemplatePublish,
  onProceedToPayment,
}) => {
  if (!isOpen) return null;

  const currentMeta = getTemplateMeta(currentThemeId);
  const currentDisplayName = getTemplateDisplayName(currentThemeId);
  const publishedDisplayName = publishedThemeId ? getTemplateDisplayName(publishedThemeId) : null;
  const priceInfo = getTemplatePriceInfo(currentThemeId);

  // Periksa apakah template ini bebas biaya terbit (sudah dibeli atau tema sama dengan yang live)
  const isFreeToPublish = isUnlocked || (isAlreadyPublished && !isTemplateChanged);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overflow-hidden my-auto">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-2xl">
              {isTemplateChanged ? 'swap_horiz' : isAlreadyPublished ? 'verified' : 'rocket_launch'}
            </span>
          </div>
          <div>
            <h3 className="font-title-lg text-lg sm:text-xl text-stone-900 font-bold leading-tight">
              Konfirmasi Publikasi Undangan
            </h3>
            <p className="text-xs text-stone-500">
              Periksa ringkasan template &amp; tautan sebelum publikasi live.
            </p>
          </div>
        </div>

        {/* CARD: TEMPLATE YANG AKAN DIPUBLIKASIKAN */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 via-stone-50 to-stone-50 border border-amber-200/80 mb-5 relative overflow-hidden shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                style={{ backgroundColor: currentMeta.accentColor }}
              >
                <span className="material-symbols-outlined text-2xl">{currentMeta.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full inline-block">
                    Template Akan Diterbitkan
                  </span>
                  {isUnlocked && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      <span>Sudah Dibeli</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-stone-900 truncate">
                  {currentDisplayName}
                </h4>
                <p className="text-xs text-stone-500 truncate">
                  {currentMeta.tag}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[15px] text-stone-400">favorite</span>
              <span className="font-semibold text-stone-800 truncate">{coupleName}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-white/90 px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700">
              <span className="material-symbols-outlined text-[14px] text-amber-600">link</span>
              <span className="truncate">{getInvitationDisplayUrl(slug)}</span>
            </div>
          </div>
        </div>

        {/* CONDITIONAL BANNER: STATUS KEPEMILIKAN / PERUBAHAN TEMPLATE */}
        {isFreeToPublish ? (
          /* KASUS 1: GRATIS - TEMPLATE SAMA DENGAN LIVE ATAU SUDAH PERNAH DIBELI */
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 mb-6 text-stone-800 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
              <span>
                {isAlreadyPublished && !isTemplateChanged
                  ? 'Template Aktif Sama (Pembaruan Gratis)'
                  : 'Template Sudah Dimiliki (Aktivasi Gratis)'}
              </span>
            </div>
            <p>
              {isAlreadyPublished && !isTemplateChanged
                ? `Undangan sudah aktif dengan template ${currentDisplayName}. Seluruh pembaruan konten, jam acara, foto & amplop digital akan langsung diperbarui ke tautan publik tanpa biaya tambahan!`
                : `Template ${currentDisplayName} sudah dibeli untuk desain undangan ini. Anda dapat langsung menerbitkan pembaruan ke tautan publik tanpa biaya tambahan!`}
            </p>
          </div>
        ) : (
          /* KASUS 2: PERLU PEMBELIAN SATU KALI PER TEMPLATE (PAY-PER-TEMPLATE) */
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/50 mb-6 text-stone-800 text-xs leading-relaxed space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <span className="material-symbols-outlined text-[18px] text-amber-600">
                  {isTemplateChanged ? 'notification_important' : 'rocket_launch'}
                </span>
                <span>
                  {isTemplateChanged ? 'Perubahan Desain Template Terdeteksi' : 'Aktivasi Publikasi Perdana'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                <span className="text-[10px] text-stone-400 line-through">
                  {priceInfo.originalPriceDisplay}
                </span>
                <span className="text-xs font-black text-amber-900">
                  {priceInfo.priceDisplay}
                </span>
              </div>
            </div>

            <p>
              {isTemplateChanged ? (
                <>
                  Template undangan sebelumnya adalah <span className="font-bold text-stone-900">{publishedDisplayName || 'Template Lama'}</span>, dan Anda saat ini memilih <span className="font-bold text-stone-900">{currentDisplayName}</span>.
                </>
              ) : (
                <>
                  Undangan siap diterbitkan perdana dengan tema <span className="font-bold text-stone-900">{currentDisplayName}</span>.
                </>
              )}
            </p>

            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-stone-600">
              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                <span className="material-symbols-outlined text-[14px]">lock_open</span>
                <span>Beli 1x Aktif Permanen (Tanpa Langganan)</span>
              </span>
              <span className="text-emerald-700 font-bold">Hemat Rp 40.000</span>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-1/3 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Batal
          </button>

          {!isFreeToPublish ? (
            <button
              type="button"
              onClick={onProceedToPayment}
              disabled={isSaving}
              className="w-full sm:w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Lanjut ke Pembayaran ({priceInfo.priceDisplay})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirmSameTemplatePublish}
              disabled={isSaving}
              className="w-full sm:w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  <span>Ya, Publikasikan Sekarang</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

