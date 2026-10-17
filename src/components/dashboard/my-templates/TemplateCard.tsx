import React from 'react';
import type { UserTemplateRecord } from '../../../lib/supabaseClient';
import type { InvitationData } from '../../../types/invitation';
import { THEME_BANNER_COLORS } from './types';

interface TemplateCardProps {
  item: UserTemplateRecord;
  currentFormData: InvitationData;
  activeTemplateId?: string | null;
  copiedSlug: string | null;
  onCopyLink: (slug: string) => void;
  onSelectTemplate: (template: UserTemplateRecord) => void;
  onDeleteClick: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  item,
  currentFormData,
  activeTemplateId,
  copiedSlug,
  onCopyLink,
  onSelectTemplate,
  onDeleteClick,
}) => {
  const themeStyle = THEME_BANNER_COLORS[item.theme_id || 'modern'] || THEME_BANNER_COLORS.modern;

  // Hitung slug otomatis dari nama mempelai pada setiap template tersimpan
  const itemG = (item.content?.groom?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const itemB = (item.content?.bride?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const itemAutoSlug = itemG && itemB ? `${itemG}-${itemB}` : '';
  const itemEffectiveSlug =
    item.slug && item.slug !== 'raditya-jessica'
      ? item.slug
      : itemAutoSlug || item.slug || 'undangan-baru';

  const isCopied = copiedSlug === itemEffectiveSlug;

  const currentG = (currentFormData.groom?.name || '').trim().toLowerCase();
  const currentB = (currentFormData.bride?.name || '').trim().toLowerCase();
  const namesMatch = currentG && currentB && itemG === currentG && itemB === currentB;

  const isCurrentActive =
    (Boolean(activeTemplateId) && item.id === activeTemplateId) ||
    namesMatch ||
    (itemEffectiveSlug === (currentFormData.slug || 'undangan-baru') &&
      (item.theme_id === currentFormData.theme_id ||
        (item.template_id === 'template3' && currentFormData.theme_id === 'jawa') ||
        (item.template_id === 'template1' && currentFormData.theme_id === 'modern') ||
        (item.template_id === 'template2' && currentFormData.theme_id === 'rustic') ||
        (item.template_id === 'template4' && currentFormData.theme_id === 'islami') ||
        (item.template_id === 'template5' && currentFormData.theme_id === 'luxury')));

  const updatedDate = item.updated_at
    ? new Date(item.updated_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Baru saja';

  const isDraft = item.status === 'draft';

  return (
    <div
      className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between group ${
        isCurrentActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
          : 'border-stone-200/90 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Banner Visual */}
      <div className={`p-5 bg-gradient-to-br ${themeStyle.bg} text-white relative`}>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${themeStyle.badge}`}
          >
            {themeStyle.label}
          </span>
          <div className="flex items-center gap-1.5">
            {isCurrentActive && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-stone-900 border border-amber-300 shadow-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>Sedang Aktif</span>
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                item.status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/25 text-amber-200 border border-amber-400/30'
              }`}
            >
              {item.status === 'published' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[11px]">bookmark</span>
                  <span>Draf Checkpoint</span>
                </>
              )}
            </span>
          </div>
        </div>

        <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-200 transition-colors line-clamp-1">
          {item.title || 'Undangan Pernikahan'}
        </h3>
        <p className="text-xs text-stone-300/80 mt-0.5">
          {item.content?.groom?.name || 'Mempelai Pria'} & {item.content?.bride?.name || 'Mempelai Wanita'}
        </p>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Slug & Link */}
          <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="material-symbols-outlined text-stone-400 text-[16px]">link</span>
              <span className="font-mono text-xs text-stone-700 font-bold truncate">
                /{itemEffectiveSlug}
              </span>
            </div>
            <button
              onClick={() => onCopyLink(itemEffectiveSlug)}
              title="Salin tautan undangan"
              className="p-1 hover:bg-stone-200 rounded-md text-stone-500 transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isCopied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>Diperbarui: {updatedDate}</span>
            <span>ID: {item.template_id}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => onSelectTemplate({ ...item, slug: itemEffectiveSlug })}
            className={`flex-1 py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer ${
              isCurrentActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : isDraft
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isCurrentActive ? 'edit_note' : isDraft ? 'file_open' : 'palette'}
            </span>
            <span>
              {isCurrentActive
                ? '✓ Sedang Diedit (Lanjut)'
                : isDraft
                ? '📂 Tarik & Lanjut Edit Draf Ini'
                : 'Buka & Edit Template Ini'}
            </span>
          </button>

          <a
            href={`/${itemEffectiveSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            title="Buka pratinjau publik"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>

          <button
            type="button"
            onClick={() => onDeleteClick(item.id)}
            className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-600 text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
            title="Hapus template"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
