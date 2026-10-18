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

  const coverThumb = item.thumbnail_url || item.content?.cover_image || item.content?.couple_photo;

  return (
    <div
      className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
        isCurrentActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
          : 'border-stone-200/90 hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      {/* Sisi Kiri: Foto Sampul Thumbnail + Informasi Lengkap */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        {/* Foto Sampul / Badge Tema */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-2xs flex items-center justify-center">
          {coverThumb && !coverThumb.startsWith('blob:') ? (
            <img
              src={coverThumb}
              alt={item.title || 'Foto Cover'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${themeStyle.bg} text-white flex flex-col items-center justify-center p-2 text-center`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {themeStyle.label.toLowerCase().includes('jawa')
                  ? 'architecture'
                  : themeStyle.label.toLowerCase().includes('islami')
                  ? 'mosque'
                  : themeStyle.label.toLowerCase().includes('rustic')
                  ? 'local_florist'
                  : themeStyle.label.toLowerCase().includes('luxury')
                  ? 'hotel_class'
                  : 'auto_awesome'}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 line-clamp-1">
                {themeStyle.label.split(' ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Detail Teks Lengkap Tanpa Terpotong */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-snug">
              {item.title || `${item.content?.groom?.name || 'Mempelai Pria'} & ${item.content?.bride?.name || 'Mempelai Wanita'}`}
            </h4>

            {isCurrentActive && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-900 text-amber-300 border border-stone-800 shadow-2xs flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[13px] text-emerald-400">check_circle</span>
                <span>Sedang Aktif</span>
              </span>
            )}

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 flex items-center gap-1 ${
                item.status === 'published'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{item.status === 'published' ? 'Live Publik' : 'Draf'}</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200/80">
              {themeStyle.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-xs flex-wrap">
            <span className="font-mono text-xs font-semibold text-stone-800 select-all">
              mbell.id/{itemEffectiveSlug}
            </span>
            <button
              type="button"
              onClick={() => onCopyLink(itemEffectiveSlug)}
              title="Salin tautan undangan"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-900 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isCopied ? 'check' : 'content_copy'}
              </span>
              <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-500">
              Diperbarui: {updatedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Action Buttons Lengkap & Jelas */}
      <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 w-full md:w-auto justify-end">
        <button
          type="button"
          onClick={() => onSelectTemplate({ ...item, slug: itemEffectiveSlug })}
          className={`py-2 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isCurrentActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-stone-900 hover:bg-stone-800 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isCurrentActive ? 'edit_note' : 'palette'}
          </span>
          <span>{isCurrentActive ? 'Lanjut Edit di Editor' : 'Buka & Edit'}</span>
        </button>

        <a
          href={`/${itemEffectiveSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700 font-medium text-xs sm:text-sm transition-colors shrink-0"
          title="Buka undangan live di tab baru"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          <span className="hidden sm:inline">Lihat Live</span>
        </a>

        <button
          type="button"
          onClick={() => onDeleteClick(item.id)}
          className="p-2 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
          title="Hapus template ini"
        >
          <span className="material-symbols-outlined text-[17px] block">delete</span>
        </button>
      </div>
    </div>
  );
};
