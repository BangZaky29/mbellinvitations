import React, { useState, useEffect, useCallback } from 'react';
import { fetchUserTemplates, type UserTemplateRecord } from '../../../lib/supabaseClient';
import type { InvitationData } from '../../../types/invitation';
import { THEME_BANNER_COLORS } from '../my-templates/types';

export interface TemplateSelectorItem {
  id: string;
  invitationRecordId?: string | null;
  title: string;
  slug: string;
  themeId: string;
  status: 'published' | 'draft' | 'archived';
  groomName: string;
  brideName: string;
  coupleNames: string;
  coverImage?: string | null;
  updatedAt?: string | null;
  isCurrentDraft?: boolean;
  rawTemplate?: UserTemplateRecord;
}

export interface TemplateCardSelectorProps {
  userId?: string | null;
  currentFormData?: InvitationData;
  activeTemplateId?: string | null;
  activeSlug?: string;
  selectedTemplate: TemplateSelectorItem | null;
  onSelectTemplate: (item: TemplateSelectorItem) => void;
  onGoToEditor?: () => void;
  onOpenMyTemplates?: () => void;
  onOpenAuthGate?: () => void;
  sectionTitle?: string;
  sectionSubtitle?: string;
  badgeLabel?: string;
}

// Fallback template jika database belum termuat / offline
const FALLBACK_DEFAULT_TEMPLATES: TemplateSelectorItem[] = [
  {
    id: 'tpl-zaky-bella',
    title: 'Pernikahan Zaky & Bella',
    slug: 'zaky-bella',
    themeId: 'jawa',
    status: 'draft',
    groomName: 'Zaky',
    brideName: 'Bella',
    coupleNames: 'Zaky & Bella',
  },
  {
    id: 'tpl-dimas-sarah',
    title: 'Pernikahan Dimas & Sarah',
    slug: 'dimas-sarah',
    themeId: 'modern',
    status: 'published',
    groomName: 'Dimas',
    brideName: 'Sarah',
    coupleNames: 'Dimas & Sarah',
  },
];

export const TemplateCardSelector: React.FC<TemplateCardSelectorProps> = ({
  userId,
  currentFormData,
  activeTemplateId,
  activeSlug,
  selectedTemplate,
  onSelectTemplate,
  onGoToEditor,
  onOpenMyTemplates,
  sectionTitle = 'Pilih Template Undangan Yang Dikelola',
  sectionSubtitle = 'Pilih salah satu kartu template di bawah untuk melihat & mengelola buku tamu atau pesan ucapan khusus undangan tersebut:',
  badgeLabel,
}) => {
  const [items, setItems] = useState<TemplateSelectorItem[]>([]);
  const [loading, setLoading] = useState(false);

  const parseCouple = (content?: any, fallbackTitle?: string) => {
    const groom = (content?.groom?.name || '').trim();
    const bride = (content?.bride?.name || '').trim();
    if (groom && bride) return { groom, bride, couple: `${groom} & ${bride}` };
    if (groom) return { groom, bride: 'Mempelai Wanita', couple: `${groom} & Mempelai Wanita` };
    if (bride) return { groom: 'Mempelai Pria', bride, couple: `Mempelai Pria & ${bride}` };
    if (fallbackTitle && fallbackTitle.includes('&')) {
      const parts = fallbackTitle.split('&').map((s) => s.trim());
      return { groom: parts[0] || 'Mempelai Pria', bride: parts[1] || 'Mempelai Wanita', couple: fallbackTitle };
    }
    return {
      groom: 'Mempelai Pria',
      bride: 'Mempelai Wanita',
      couple: fallbackTitle || 'Mempelai Pria & Mempelai Wanita',
    };
  };

  const loadAllTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const list: TemplateSelectorItem[] = [];
      const seenSlugs = new Set<string>();

      // 1. Ambil dari user_templates jika ada userId
      if (userId) {
        try {
          const userTemplates = await fetchUserTemplates(userId);
          for (const ut of userTemplates) {
            if (!ut.slug || seenSlugs.has(ut.slug)) continue;
            // Blokir template raditya-jessica
            if (ut.slug === 'raditya-jessica' || (ut.title || '').toLowerCase().includes('raditya')) continue;
            seenSlugs.add(ut.slug);

            const { groom, bride, couple } = parseCouple(ut.content, ut.title);
            list.push({
              id: ut.id,
              invitationRecordId: ut.id,
              title: ut.title || couple,
              slug: ut.slug,
              themeId: String(ut.theme_id || ut.template_id || 'modern'),
              status: (ut.status as any) || 'draft',
              groomName: groom,
              brideName: bride,
              coupleNames: couple,
              coverImage: ut.thumbnail_url || ut.content?.cover_image || null,
              updatedAt: ut.updated_at || ut.created_at || null,
              rawTemplate: ut,
            });
          }
        } catch (e) {
          console.warn('Gagal fetch user_templates:', e);
        }
      }

      // 2. Masukkan draft aktif dari editor saat ini HANYA jika list masih kosong atau slug benar-benar berbeda
      if (currentFormData && list.length === 0) {
        const { groom, bride, couple } = parseCouple(currentFormData);
        const draftSlug = currentFormData.slug || '';
        const isNotPlaceholder =
          (currentFormData.groom?.name && currentFormData.groom.name !== 'Mempelai Pria') ||
          (currentFormData.bride?.name && currentFormData.bride.name !== 'Mempelai Wanita');

        if (isNotPlaceholder && (!draftSlug || !seenSlugs.has(draftSlug))) {
          list.push({
            id: currentFormData.id || 'current-editor-draft',
            invitationRecordId: currentFormData.id || null,
            title: `${couple}`,
            slug: draftSlug || 'undangan-baru',
            themeId: String(currentFormData.theme_id || 'modern'),
            status: (currentFormData.status as any) || 'draft',
            groomName: groom,
            brideName: bride,
            coupleNames: couple,
            coverImage: currentFormData.cover_image || null,
            updatedAt: new Date().toISOString(),
            isCurrentDraft: true,
          });
          if (draftSlug) seenSlugs.add(draftSlug);
        }
      }

      // 4. Jika masih kosong, gunakan fallback template agar UI kartu SELALU MUNCUL dan bisa dipilih
      if (list.length === 0) {
        FALLBACK_DEFAULT_TEMPLATES.forEach((fb) => list.push(fb));
      }

      setItems(list);

      // Pilih default jika belum ada yang dipilih
      if (list.length > 0) {
        const matched =
          list.find(
            (p) =>
              (activeTemplateId && p.id === activeTemplateId) ||
              (activeSlug && p.slug === activeSlug)
          ) || list[0];

        if (!selectedTemplate) {
          onSelectTemplate(matched);
        } else {
          const updatedSelected = list.find((p) => p.id === selectedTemplate.id || p.slug === selectedTemplate.slug);
          if (updatedSelected && updatedSelected.id !== selectedTemplate.id) {
            onSelectTemplate(updatedSelected);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [userId, currentFormData, activeTemplateId, activeSlug]);

  useEffect(() => {
    loadAllTemplates();

    const handleUpdate = () => loadAllTemplates();
    const handleDelete = (e: any) => {
      const deletedId = e?.detail?.id;
      const deletedSlug = e?.detail?.slug;
      setItems((prev) => prev.filter((p) => p.id !== deletedId && p.slug !== deletedSlug));
    };

    window.addEventListener('mbell_templates_updated', handleUpdate);
    window.addEventListener('mbell_template_deleted', handleDelete);
    return () => {
      window.removeEventListener('mbell_templates_updated', handleUpdate);
      window.removeEventListener('mbell_template_deleted', handleDelete);
    };
  }, [loadAllTemplates]);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
      {/* 1. Header Toolbar Pemilih Template */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">dashboard_customize</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                {sectionTitle}
              </h3>
              {badgeLabel && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {badgeLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {loading && (
            <span className="material-symbols-outlined text-[16px] text-amber-600 animate-spin" title="Memuat template...">
              progress_activity
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            {items.length} Template Pilihan
          </span>
          {onOpenMyTemplates && (
            <button
              type="button"
              onClick={onOpenMyTemplates}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">folder_special</span>
              <span>Template Saya</span>
            </button>
          )}
          {onGoToEditor && (
            <button
              type="button"
              onClick={onGoToEditor}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>+ Buat Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Grid Card Pilihan Template (Compact Row Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {items.map((item) => {
          const isSelected = selectedTemplate?.id === item.id || selectedTemplate?.slug === item.slug;
          const themeStyle = THEME_BANNER_COLORS[item.themeId] || THEME_BANNER_COLORS.modern;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTemplate(item)}
              className={`group rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all cursor-pointer text-left relative ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/20 shadow-xs'
                  : 'border-stone-200/90 bg-white hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              {/* Visual Thumbnail Mini Tema */}
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${themeStyle.bg} text-white flex flex-col items-center justify-center shrink-0 shadow-xs relative overflow-hidden`}
              >
                <span className="material-symbols-outlined text-[18px]">
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

              {/* Info Pasangan & Slug */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                    {item.coupleNames}
                  </h4>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status === 'published' ? 'Live' : 'Draf'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-500 text-xs">
                  <span className="font-mono text-[11px] text-stone-500 truncate">
                    mbell.id/{item.slug}
                  </span>
                </div>
              </div>

              {/* Action Tombol Kanan */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isSelected ? (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    <span>Aktif</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(item);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    Pilih
                  </button>
                )}

                <a
                  href={`/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
                  title="Buka Halaman Live"
                >
                  <span className="material-symbols-outlined text-[15px] block">open_in_new</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Banner Konfirmasi Template Terpilih */}
      {selectedTemplate && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">check_circle</span>
            <span className="text-emerald-900">
              Menampilkan data untuk:{' '}
              <strong className="font-serif font-bold text-emerald-950 text-sm">
                {selectedTemplate.coupleNames}
              </strong>{' '}
              (Tautan:{' '}
              <span className="font-mono font-bold text-emerald-800">
                mbell.id/{selectedTemplate.slug}
              </span>
              )
            </span>
          </div>

          <a
            href={`/${selectedTemplate.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold underline underline-offset-2 shrink-0"
          >
            <span>Lihat Halaman Live</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      )}
    </div>
  );
};
