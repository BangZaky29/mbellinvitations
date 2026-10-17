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
        (item.template_id === 'template5' && currentFormData.theme_id === 'luxury') ||
        (item.template_id === 'template6' && currentFormData.theme_id === 'sunda')));

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
      className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
        isCurrentActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/15 shadow-xs'
          : 'border-stone-200/90 hover:border-amber-400 hover:shadow-xs'
      }`}
    >
      {/* Sisi Kiri: Thumbnail Tema Mini + Detail Teks */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Thumbnail Mini Tema */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${themeStyle.bg} text-white flex flex-col items-center justify-center shrink-0 shadow-xs relative overflow-hidden`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {themeStyle.label.toLowerCase().includes('sunda') || themeStyle.label.toLowerCase().includes('rustic')
              ? 'local_florist'
              : themeStyle.label.toLowerCase().includes('jawa')
              ? 'architecture'
              : themeStyle.label.toLowerCase().includes('islami')
              ? 'mosque'
              : themeStyle.label.toLowerCase().includes('luxury')
              ? 'hotel_class'
              : 'auto_awesome'}
          </span>
          <span className="text-[8px] font-bold tracking-tight uppercase opacity-90 truncate max-w-full px-1">
            {themeStyle.label.split(' ')[0]}
          </span>
        </div>

        {/* Informasi Utama Template */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 truncate">
              {item.title || `${item.content?.groom?.name || 'Mempelai Pria'} & ${item.content?.bride?.name || 'Mempelai Wanita'}`}
            </h4>
            {isCurrentActive && (
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase bg-amber-400 text-stone-900 border border-amber-300 shadow-2xs flex items-center gap-0.5 shrink-0">
                <span className="material-symbols-outlined text-[11px]">check_circle</span>
                <span>Aktif</span>
              </span>
            )}
            <span
              className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                item.status === 'published'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {item.status === 'published' ? 'Live' : 'Draf'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-xs flex-wrap">
            <span className="font-mono text-[11px] text-stone-600 font-semibold truncate">
              mbell.id/{itemEffectiveSlug}
            </span>
            <button
              type="button"
              onClick={() => onCopyLink(itemEffectiveSlug)}
              title="Salin tautan"
              className="p-0.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[13px] block">
                {isCopied ? 'check' : 'content_copy'}
              </span>
            </button>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-400">
              {updatedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Action Buttons Ramping */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={() => onSelectTemplate({ ...item, slug: itemEffectiveSlug })}
          className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs ${
            isCurrentActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : isDraft
              ? 'bg-stone-900 hover:bg-stone-800 text-white'
              : 'bg-stone-900 hover:bg-stone-800 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {isCurrentActive ? 'edit_note' : 'palette'}
          </span>
          <span>{isCurrentActive ? 'Sedang Diedit' : 'Buka & Edit'}</span>
        </button>

        <a
          href={`/${itemEffectiveSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors shrink-0"
          title="Buka pratinjau publik"
        >
          <span className="material-symbols-outlined text-[16px] block">open_in_new</span>
        </a>

        <button
          type="button"
          onClick={() => onDeleteClick(item.id)}
          className="p-1.5 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
          title="Hapus template ini"
        >
          <span className="material-symbols-outlined text-[16px] block">delete</span>
        </button>
      </div>
    </div>
  );
};
