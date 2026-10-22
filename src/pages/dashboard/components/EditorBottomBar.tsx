import React, { useState } from 'react';
import { WaTemplatePopupModal } from './WaTemplatePopupModal';
import { DEFAULT_WA_TEMPLATE } from '../../../components/dashboard/guest-list/constants';
import { getInvitationFullUrl } from '../../../utils/urlHelper';

interface EditorBottomBarProps {
  activeStep: number;
  isSaving?: boolean;
  isSavingDraft?: boolean;
  isPublishing?: boolean;
  hasUnsavedChanges?: boolean;
  unsavedCount?: number;
  isAlreadyPublished?: boolean;
  isTemplateChanged?: boolean;
  invitationSlug?: string;
  coupleNames?: string;
  showToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'copy') => void;
  onSaveDraft: () => void;
  onRevertAll?: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onRequestPublish: () => void;
  onOpenPreview?: () => void;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  activeStep,
  isSaving = false,
  isSavingDraft = false,
  isPublishing = false,
  hasUnsavedChanges = false,
  unsavedCount = 0,
  isAlreadyPublished = false,
  isTemplateChanged = false,
  invitationSlug = 'undangan-baru',
  coupleNames = 'Mempelai Pria & Mempelai Wanita',
  showToast,
  onSaveDraft,
  onRevertAll,
  onPrevStep,
  onNextStep,
  onRequestPublish,
  onOpenPreview,
}) => {
  const [showWaTemplateModal, setShowWaTemplateModal] = useState(false);
  const displayCount = unsavedCount > 0 ? unsavedCount : (isTemplateChanged ? 1 : 0);
  const shouldShowPublishButton = !isAlreadyPublished || isTemplateChanged || displayCount > 0;

  // Handler salin teks pesan undangan lengkap untuk dikirimkan ke tamu
  const handleCopyInviteMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const storageKey = `mbell_wa_template_${invitationSlug}`;
      const template = localStorage.getItem(storageKey) || DEFAULT_WA_TEMPLATE;
      const publicUrl = getInvitationFullUrl(invitationSlug);
      const guestGreeting = 'Bapak/Ibu/Saudara/i';
      
      const formattedMessage = template
        .replace(/{nama_tamu}/g, guestGreeting)
        .replace(/{nama_mempelai}/g, coupleNames)
        .replace(/{link_undangan}/g, publicUrl);

      await navigator.clipboard.writeText(formattedMessage);
      if (showToast) {
        showToast('Pesan & tautan undangan tersalin!', 'copy');
      }
    } catch (err) {
      console.warn('Gagal menyalin teks undangan:', err);
    }
  };

  const isBusy = isSaving || isSavingDraft || isPublishing;

  return (
    <>
      <div className="fixed bottom-[72px] left-3 right-3 max-w-lg mx-auto sm:static sm:bottom-auto sm:left-auto sm:right-auto sm:max-w-none sm:mx-0 z-30 bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-stone-200/90 sm:border-0 sm:border-t sm:border-stone-200/90 shadow-lg sm:shadow-none rounded-full sm:rounded-none px-3.5 py-1.5 sm:p-0 sm:pt-4 sm:mb-2 transition-all w-auto sm:w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* SISI KIRI: INDIKATOR STEP TAHAP (Mobile: 1/6, Desktop: Tahap 1/6) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 py-1">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isBusy
                ? 'bg-amber-500 animate-pulse'
                : displayCount > 0
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-600'
            }`}
            title={
              isPublishing
                ? 'Menerbitkan perubahan...'
                : isSavingDraft
                ? 'Menyimpan draf baru...'
                : displayCount > 0
                ? `${displayCount} perubahan belum diterbitkan`
                : 'Tersimpan di database'
            }
          />
          <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
            <span className="inline sm:hidden">{activeStep}/6</span>
            <span className="hidden sm:inline">Tahap {activeStep}/6</span>
          </span>
        </div>

        {/* SISI KANAN: BARIS TOMBOL AKSI */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
          {/* Tombol Batalkan / Revert Perubahan */}
          {hasUnsavedChanges && unsavedCount > 0 && onRevertAll && (
            <button
              type="button"
              onClick={onRevertAll}
              disabled={isBusy}
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-full sm:rounded-xl font-medium text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs shrink-0 active:scale-95 disabled:opacity-50"
              title="Kembalikan semua nilai ke kondisi semula (Batalkan)"
            >
              <span className="material-symbols-outlined text-[17px]">undo</span>
              <span className="hidden md:inline">Batalkan</span>
            </button>
          )}

          {/* Tombol Simpan Draf Baru (+1 ke Template Saya) */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isBusy}
            className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-300 disabled:opacity-50"
            title="Simpan setup ini sebagai template draf baru di menu Template Saya (+1)"
          >
            {isSavingDraft ? (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-stone-700 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <span className="material-symbols-outlined text-[18px] text-stone-700">note_add</span>
            )}
            <span className="inline sm:hidden">{isSavingDraft ? 'Menyimpan...' : 'Draf'}</span>
            <span className="hidden sm:inline">{isSavingDraft ? 'Menyimpan...' : 'Simpan Draf'}</span>
          </button>

          {/* Tombol Terbitkan (Dengan Badge Perubahan +X & Spinner Loading Menerbitkan) */}
          {shouldShowPublishButton ? (
            <button
              type="button"
              onClick={onRequestPublish}
              disabled={isBusy}
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 ${
                displayCount > 0 || isTemplateChanged
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 border border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20 hover:brightness-105'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              }`}
              title="Simpan & terbitkan seluruh perubahan ke tautan publik secara langsung"
            >
              {isPublishing ? (
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <span className="material-symbols-outlined text-[18px] text-stone-950">rocket_launch</span>
              )}
              <span>{isPublishing ? 'Menerbitkan...' : 'Terbitkan'}</span>
              {displayCount > 0 && !isPublishing && (
                <span className="px-1.5 py-0.2 rounded-full bg-stone-950 text-amber-300 text-[10px] font-black tracking-tight shadow-xs">
                  +{displayCount}
                </span>
              )}
            </button>
          ) : isAlreadyPublished ? (
            /* CLUSTER AKSI: [Live] + [Salin Pesan & Link] + [Edit Template WA] */
            <div className="flex items-center rounded-full sm:rounded-xl bg-stone-900 border border-emerald-500/40 p-0.5 sm:p-1 shadow-xs shrink-0">
              {/* Sub-tombol 1: [✅ Live] */}
              <button
                type="button"
                onClick={onRequestPublish}
                disabled={isBusy}
                className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-full sm:rounded-lg font-bold text-xs sm:text-sm text-emerald-400 hover:bg-stone-800/80 transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 shrink-0"
                title="Undangan live dan aktif di tautan publik. Klik untuk lihat detail link."
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px] text-emerald-400">verified</span>
                <span>Live</span>
              </button>

              {/* Garis Pemisah Vertikal 1 */}
              <div className="w-px h-3.5 sm:h-4 bg-stone-700/60 my-auto shrink-0" />

              {/* Sub-tombol 2: [📋 Salin] */}
              <button
                type="button"
                onClick={handleCopyInviteMessage}
                className="px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-full sm:rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/80 transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 text-xs font-medium shrink-0"
                title="Salin teks pesan undangan & tautan siap kirim ke tamu"
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px] text-stone-300">content_copy</span>
                <span className="hidden sm:inline">Salin</span>
              </button>

              {/* Garis Pemisah Vertikal 2 */}
              <div className="w-px h-3.5 sm:h-4 bg-stone-700/60 my-auto shrink-0" />

              {/* Sub-tombol 3: [✏️ Edit] */}
              <button
                type="button"
                onClick={() => setShowWaTemplateModal(true)}
                className="px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-full sm:rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/80 transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 text-xs font-medium shrink-0"
                title="Ubah template teks pesan pengantar WhatsApp"
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px] text-stone-300">edit_note</span>
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
          ) : null}

          {/* Tombol Sebelumnya (Step > 1) */}
          {activeStep > 1 && (
            <button
              type="button"
              onClick={onPrevStep}
              className="p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl bg-white text-stone-700 font-semibold text-xs sm:text-sm border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center justify-center gap-1 active:scale-95"
              title="Kembali ke tahap sebelumnya"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden md:inline">Sebelumnya</span>
            </button>
          )}

          {/* Tombol Lanjutkan (Icon Panah di mobile, Teks + Panah di desktop) */}
          {activeStep < 6 && (
            <button
              type="button"
              onClick={onNextStep}
              className="p-1.5 sm:px-3.5 sm:py-2 rounded-full sm:rounded-xl bg-stone-900 text-white font-semibold text-xs sm:text-sm hover:bg-stone-800 transition-transform active:scale-95 shadow-sm cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              title="Lanjutkan ke tahap berikutnya"
            >
              <span className="hidden md:inline">Lanjutkan</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}

          {/* Tombol Preview (Hanya tampil di mobile, disembunyikan pada tampilan web/desktop) */}
          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex sm:hidden p-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-all active:scale-95 shadow-sm cursor-pointer items-center justify-center gap-1.5 shrink-0 border border-white/10"
              title="Buka Pratinjau Undangan (Preview)"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Pop-up Dialog Template Pesan Pengantar WhatsApp */}
    <WaTemplatePopupModal
      isOpen={showWaTemplateModal}
      invitationSlug={invitationSlug}
      onClose={() => setShowWaTemplateModal(false)}
      onSaved={() => {
        if (showToast) {
          showToast('Template pesan WhatsApp berhasil diperbarui!');
        }
      }}
    />
  </>
  );
};
