import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUserTemplates, type UserTemplateRecord } from '../../../lib/supabaseClient';
import type { InvitationData } from '../../../types/invitation';
import { THEME_BANNER_COLORS } from '../my-templates/types';
import { getInvitationDisplayUrl } from '../../../utils/urlHelper';
import { cleanDraftSlug } from '../../../pages/dashboard/helpers/computeCoupleSlug';

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

// Fallback template jika database belum termuat / offline (hanya draf kosong standar)
const FALLBACK_DEFAULT_TEMPLATES: TemplateSelectorItem[] = [
  {
    id: 'tpl-default-draft',
    title: 'Draf Undangan Saya',
    slug: 'undangan-baru',
    themeId: 'modern',
    status: 'draft',
    groomName: 'Mempelai Pria',
    brideName: 'Mempelai Wanita',
    coupleNames: 'Mempelai Pria & Mempelai Wanita',
  },
];

// In-Memory Cache agar perpindahan antar-tab instan (0ms) tanpa reload/kedipan kosong
const globalTemplatesCache = new Map<string, TemplateSelectorItem[]>();

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
  // Langsung inisialisasi dari cache jika user sudah pernah load sebelumnya
  const [items, setItems] = useState<TemplateSelectorItem[]>(() => {
    if (userId && globalTemplatesCache.has(userId)) {
      return globalTemplatesCache.get(userId) || [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

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

  const loadAllTemplates = useCallback(async (isSilent = false) => {
    if (!isSilent && itemsRef.current.length === 0) {
      setLoading(true);
    }
    try {
      const list: TemplateSelectorItem[] = [];
      const seenSlugs = new Set<string>();

      // 1. Jika user BELUM login (!userId):
      // Kartu selector disembunyikan sepenuhnya (tidak ada pilihan template)
      if (!userId) {
        setItems([]);
        return;
      }

      // 2. Ambil dari user_templates jika ada userId
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

      // 3. Masukkan draft aktif dari editor saat ini HANYA jika list masih kosong atau slug benar-benar berbeda
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

      // Simpan ke in-memory cache
      globalTemplatesCache.set(userId, list);
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
    // Jika data sudah ada di cache, lakukan silent refresh di background tanpa kedipan
    const hasCached = itemsRef.current.length > 0;
    loadAllTemplates(hasCached);

    const handleUpdate = () => loadAllTemplates(true);
    const handleDelete = (e: any) => {
      const deletedId = e?.detail?.id;
      const deletedSlug = e?.detail?.slug;
      setItems((prev) => {
        const updated = prev.filter((p) => p.id !== deletedId && p.slug !== deletedSlug);
        if (userId) globalTemplatesCache.set(userId, updated);
        return updated;
      });
    };

    window.addEventListener('mbell_templates_updated', handleUpdate);
    window.addEventListener('mbell_template_deleted', handleDelete);

    return () => {
      window.removeEventListener('mbell_templates_updated', handleUpdate);
      window.removeEventListener('mbell_template_deleted', handleDelete);
    };
  }, [loadAllTemplates, userId]);

  // Sembunyikan total kartu selector jika user belum login atau belum memiliki koleksi template tersimpan di DB
  if (!userId || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs space-y-3.5">
      {/* 1. Header Toolbar Pemilih Template (Sleek & Sejajar di Web dan Mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                {sectionTitle}
              </h3>
              {badgeLabel && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200/80">
                  {badgeLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5 truncate hidden sm:block">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar Kanan */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {loading && (
            <span className="material-symbols-outlined text-[16px] text-amber-600 animate-spin mr-1" title="Memuat template...">
              progress_activity
            </span>
          )}
          {onOpenMyTemplates && (
            <button
              type="button"
              onClick={onOpenMyTemplates}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-stone-500">folder_open</span>
              <span>Template Saya</span>
            </button>
          )}
          {onGoToEditor && (
            <button
              type="button"
              onClick={onGoToEditor}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Buat Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Grid Card Pilihan Template (Clean, Ergonomic & Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const isSelected = selectedTemplate?.id === item.id || selectedTemplate?.slug === item.slug;
          const themeStyle = THEME_BANNER_COLORS[item.themeId] || THEME_BANNER_COLORS.modern;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTemplate(item)}
              className={`group rounded-2xl border p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer text-left relative ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 shadow-xs'
                  : 'border-stone-200/80 bg-white hover:border-amber-400 hover:shadow-2xs'
              }`}
            >
              {/* Visual Thumbnail Mini Tema */}
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${themeStyle.bg} text-white flex flex-col items-center justify-center shrink-0 shadow-2xs relative overflow-hidden`}
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
                    {getInvitationDisplayUrl(item.status === 'published' ? cleanDraftSlug(item.slug) : item.slug)}
                  </span>
                </div>
              </div>

              {/* Action Tombol Kanan */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isSelected ? (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs">
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
                    className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    Pilih
                  </button>
                )}

                <a
                  href={`/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                  title={item.status === 'published' ? 'Buka Undangan Live di Tab Baru' : 'Buka Pratinjau Draf di Tab Baru'}
                >
                  <span className="material-symbols-outlined text-[15px] block">open_in_new</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
