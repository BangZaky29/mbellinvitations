import React from 'react';
import type { InvitationData } from '../../../types/invitation';
import type { UserTemplateRecord } from '../../../lib/supabaseClient';

interface ActiveDraftCardProps {
  currentFormData: InvitationData;
  activeRecord?: UserTemplateRecord | null;
  copiedSlug?: string | null;
  onCopyLink?: (slug: string) => void;
  onImplementActiveTemplate?: () => void;
  onDeleteClick?: (id: string) => void;
}

export const ActiveDraftCard: React.FC<ActiveDraftCardProps> = ({
  currentFormData,
  activeRecord,
  copiedSlug,
  onCopyLink,
  onImplementActiveTemplate,
  onDeleteClick,
}) => {
  const gSlug = (currentFormData.groom?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const bSlug = (currentFormData.bride?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const autoCoupleSlug = gSlug && bSlug ? `${gSlug}-${bSlug}` : '';
  const currentEffectiveSlug =
    currentFormData.slug && currentFormData.slug !== 'raditya-jessica'
      ? currentFormData.slug
      : autoCoupleSlug || currentFormData.slug || 'undangan-baru';

  const isDemoRaditya =
    (currentFormData.groom?.name || '').toLowerCase().includes('raditya') &&
    (currentFormData.bride?.name || '').toLowerCase().includes('jessica');
  const displayGroom = isDemoRaditya ? 'Mempelai Pria' : (currentFormData.groom?.name || 'Mempelai Pria');
  const displayBride = isDemoRaditya ? 'Mempelai Wanita' : (currentFormData.bride?.name || 'Mempelai Wanita');

  const isCopied = copiedSlug === currentEffectiveSlug;

  const updatedDate = activeRecord?.updated_at
    ? new Date(activeRecord.updated_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-dashed border-stone-300/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center font-serif font-bold text-lg sm:text-xl shadow-xs shrink-0">
            {displayGroom.charAt(0) || 'M'}
            <span className="text-stone-400 text-xs mx-0.5">&</span>
            {displayBride.charAt(0) || 'W'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                Sedang Aktif di Editor
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium uppercase">
                Tema: {currentFormData.theme_id || 'modern'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  currentFormData.status === 'published'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1'
                    : 'bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1'
                }`}
              >
                {currentFormData.status === 'published' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Live Tayang</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Draf Checkpoint</span>
                  </>
                )}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mt-1 truncate">
              {displayGroom} & {displayBride}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <span>Tautan:</span>
                <span className="font-mono text-stone-900 font-bold select-all">
                  mbell.id/{currentEffectiveSlug}
                </span>
              </p>
              {onCopyLink && (
                <button
                  type="button"
                  onClick={() => onCopyLink(currentEffectiveSlug)}
                  title="Salin tautan"
                  className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] block">
                    {isCopied ? 'check' : 'content_copy'}
                  </span>
                </button>
              )}
              {updatedDate && (
                <span className="text-[11px] text-stone-400 hidden md:inline">
                  • Disimpan {updatedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto justify-end">
          {onImplementActiveTemplate && (
            <button
              type="button"
              onClick={onImplementActiveTemplate}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-200">edit_note</span>
              <span>Lanjut Edit di Editor</span>
            </button>
          )}

          <a
            href={`/${currentEffectiveSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
            title="Buka pratinjau live"
          >
            <span className="hidden sm:inline">Pratinjau Live</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>

          {activeRecord?.id && onDeleteClick && (
            <button
              type="button"
              onClick={() => onDeleteClick(activeRecord.id)}
              className="p-2 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
              title="Hapus template aktif ini"
            >
              <span className="material-symbols-outlined text-[16px] block">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
