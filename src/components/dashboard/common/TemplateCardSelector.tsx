import React, { useState, useEffect, useCallback } from 'react';
import { supabase, fetchUserTemplates, type UserTemplateRecord } from '../../../lib/supabaseClient';
import type { InvitationData } from '../../../types/invitation';
import { THEME_BANNER_COLORS } from '../my-templates/types';

export interface TemplateSelectorItem {
  id: string; // user_template.id or invitation.id or 'current-draft'
  invitationRecordId?: string | null; // ID in public.invitations for foreign keys (guests/wishes)
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

export const TemplateCardSelector: React.FC<TemplateCardSelectorProps> = ({
  userId,
  currentFormData,
  activeTemplateId,
  activeSlug,
  selectedTemplate,
  onSelectTemplate,
  onGoToEditor,
  onOpenMyTemplates,
  onOpenAuthGate,
  sectionTitle = 'Pilih Template Undangan Yang Dikelola',
  sectionSubtitle = 'Pilih undangan di bawah untuk melihat dan mengelola data tamu atau ucapan untuk undangan tersebut:',
  badgeLabel,
}) => {
  const [items, setItems] = useState<TemplateSelectorItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper untuk mengekstrak nama mempelai dan slug bersih
  const parseCoupleNames = (content?: InvitationData | null, fallbackTitle?: string) => {
    const groom = (content?.groom?.name || '').trim();
    const bride = (content?.bride?.name || '').trim();
    if (groom && bride) {
      return { groom, bride, couple: `${groom} & ${bride}` };
    }
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

  // Muat semua template user dan sinkronkan dengan database Supabase
  const loadTemplates = useCallback(async () => {
    if (!userId) {
      // Jika belum login, cek apakah ada draft aktif di editor
      if (currentFormData) {
        const { groom, bride, couple } = parseCoupleNames(currentFormData);
        const draftSlug = currentFormData.slug || 'undangan-baru';
        if (draftSlug !== 'raditya-jessica') {
          const draftItem: TemplateSelectorItem = {
            id: currentFormData.id || 'current-draft',
            invitationRecordId: currentFormData.id || null,
            title: couple,
            slug: draftSlug,
            themeId: String(currentFormData.theme_id || 'modern'),
            status: (currentFormData.status as 'published' | 'draft' | 'archived') || 'draft',
            groomName: groom,
            brideName: bride,
            coupleNames: couple,
            coverImage: currentFormData.cover_image || null,
            updatedAt: new Date().toISOString(),
            isCurrentDraft: true,
          };
          setItems([draftItem]);
          if (!selectedTemplate) {
            onSelectTemplate(draftItem);
          }
        }
      } else {
        setItems([]);
      }
      return;
    }

    setLoading(true);
    try {
      // 1. Ambil dari user_templates
      const userTemplates = await fetchUserTemplates(userId);

      // 2. Ambil dari invitations table untuk pencocokan invitation_id
      const { data: invRows } = await supabase
        .from('invitations')
        .select('id, slug, status, template_id, content, theme_config, updated_at')
        .eq('user_id', userId)
        .neq('slug', 'raditya-jessica');

      const invMap = new Map<string, any>();
      (invRows || []).forEach((inv) => {
        if (inv.slug && inv.slug !== 'raditya-jessica') {
          invMap.set(inv.slug, inv);
        }
      });

      const parsedItems: TemplateSelectorItem[] = [];
      const seenSlugs = new Set<string>();

      // Proses template yang tersimpan di user_templates
      for (const ut of userTemplates) {
        if (!ut.slug || ut.slug === 'raditya-jessica' || seenSlugs.has(ut.slug)) continue;
        seenSlugs.add(ut.slug);

        const { groom, bride, couple } = parseCoupleNames(ut.content, ut.title);
        const matchedInv = invMap.get(ut.slug);

        parsedItems.push({
          id: ut.id,
          invitationRecordId: matchedInv?.id || ut.id,
          title: ut.title || couple,
          slug: ut.slug,
          themeId: ut.theme_id || ut.template_id || 'modern',
          status: (ut.status as any) || 'draft',
          groomName: groom,
          brideName: bride,
          coupleNames: couple,
          coverImage: ut.thumbnail_url || ut.content?.cover_image || null,
          updatedAt: ut.updated_at || ut.created_at || null,
          rawTemplate: ut,
        });
      }

      // Cek apakah ada record invitations yang belum ada di user_templates
      for (const inv of invRows || []) {
        if (!inv.slug || inv.slug === 'raditya-jessica' || seenSlugs.has(inv.slug)) continue;
        seenSlugs.add(inv.slug);

        const { groom, bride, couple } = parseCoupleNames(inv.content);
        parsedItems.push({
          id: inv.id,
          invitationRecordId: inv.id,
          title: couple,
          slug: inv.slug,
          themeId: inv.template_id || 'modern',
          status: (inv.status as any) || 'published',
          groomName: groom,
          brideName: bride,
          coupleNames: couple,
          coverImage: inv.content?.cover_image || null,
          updatedAt: inv.updated_at || null,
        });
      }

      // Cek apakah ada draf aktif di editor saat ini yang belum tersimpan
      if (currentFormData) {
        const { groom, bride, couple } = parseCoupleNames(currentFormData);
        const draftSlug = currentFormData.slug || '';
        const isAlreadyIncluded =
          draftSlug &&
          parsedItems.some(
            (p) => p.slug === draftSlug || (p.groomName === groom && p.brideName === bride)
          );

        if (!isAlreadyIncluded && (groom !== 'Mempelai Pria' || bride !== 'Mempelai Wanita')) {
          parsedItems.unshift({
            id: currentFormData.id || 'current-editor-draft',
            invitationRecordId: currentFormData.id || null,
            title: `${couple} (Draf Editor)`,
            slug: draftSlug || 'draf-aktif',
            themeId: String(currentFormData.theme_id || 'modern'),
            status: 'draft',
            groomName: groom,
            brideName: bride,
            coupleNames: couple,
            coverImage: currentFormData.cover_image || null,
            updatedAt: new Date().toISOString(),
            isCurrentDraft: true,
          });
        }
      }

      // Pastikan jika parsedItems masih kosong tetapi ada currentFormData, masukkan draf editor aktif
      if (parsedItems.length === 0 && currentFormData) {
        const { groom, bride, couple } = parseCoupleNames(currentFormData);
        parsedItems.push({
          id: currentFormData.id || 'current-editor-draft',
          invitationRecordId: currentFormData.id || null,
          title: couple,
          slug: currentFormData.slug || 'undangan-baru',
          themeId: String(currentFormData.theme_id || 'modern'),
          status: (currentFormData.status as 'published' | 'draft' | 'archived') || 'draft',
          groomName: groom,
          brideName: bride,
          coupleNames: couple,
          coverImage: currentFormData.cover_image || null,
          updatedAt: new Date().toISOString(),
          isCurrentDraft: true,
        });
      }

      setItems(parsedItems);

      // Sinkronkan template terpilih jika belum dipilih
      if (parsedItems.length > 0) {
        if (!selectedTemplate) {
          // Cari yang cocok dengan activeTemplateId atau activeSlug
          const matched =
            parsedItems.find(
              (p) =>
                (activeTemplateId && p.id === activeTemplateId) ||
                (activeSlug && p.slug === activeSlug)
            ) || parsedItems[0];
          onSelectTemplate(matched);
        } else {
          // Pastikan selectedTemplate diperbarui jika datanya di-refresh
          const refreshed = parsedItems.find(
            (p) => p.id === selectedTemplate.id || p.slug === selectedTemplate.slug
          );
          if (refreshed && refreshed.invitationRecordId !== selectedTemplate.invitationRecordId) {
            onSelectTemplate(refreshed);
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memuat template cards:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, currentFormData, activeTemplateId, activeSlug]);

  useEffect(() => {
    loadTemplates();

    const handleUpdate = () => loadTemplates();
    window.addEventListener('mbell_templates_updated', handleUpdate);
    return () => {
      window.removeEventListener('mbell_templates_updated', handleUpdate);
    };
  }, [loadTemplates]);

  // JIKA BELUM LOGIN
  if (!userId) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Masuk Akun untuk Mengelola Berbagai Undangan
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Kelola daftar tamu dan ucapan untuk Template Undangan A, Undangan B, atau draf lainnya secara terpisah.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAuthGate || onGoToEditor}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">login</span>
          <span>Masuk / Daftar Akun</span>
        </button>
      </div>
    );
  }

  // JIKA BELUM ADA TEMPLATE SAMA SEKALI
  if (!loading && items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
          <span className="material-symbols-outlined text-[28px]">style</span>
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Belum Ada Undangan yang Dibuat
          </h3>
          <p className="text-xs text-stone-500">
            Anda belum memiliki undangan pernikahan aktif. Buat undangan terlebih dahulu untuk mulai mengelola daftar tamu dan mengumpulkan ucapan penuh berkah.
          </p>
        </div>
        <div className="pt-1">
          <button
            type="button"
            onClick={onGoToEditor}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Mulai Buat Undangan Sekarang</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 via-white to-amber-50/20 rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
      {/* HEADER PILIH TEMPLATE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[20px]">layers</span>
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

        {/* Action Toolbar Kanan */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            {items.length} Undangan Terdaftar
          </span>
          {onOpenMyTemplates && (
            <button
              type="button"
              onClick={onOpenMyTemplates}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
              title="Buka Halaman Template Saya"
            >
              <span className="material-symbols-outlined text-[15px]">folder_special</span>
              <span className="hidden sm:inline">Kelola Template</span>
            </button>
          )}
          {onGoToEditor && (
            <button
              type="button"
              onClick={onGoToEditor}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              title="Buat Undangan Baru"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Buat Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* GRID KARTU TEMPLATE */}
      {loading && items.length === 0 ? (
        <div className="py-8 text-center text-stone-400">
          <span className="material-symbols-outlined text-2xl animate-spin text-stone-600">
            progress_activity
          </span>
          <p className="text-xs mt-1">Memuat daftar undangan...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {items.map((item) => {
            const isSelected = selectedTemplate?.id === item.id || selectedTemplate?.slug === item.slug;
            const themeStyle = THEME_BANNER_COLORS[item.themeId] || THEME_BANNER_COLORS.modern;

            return (
              <div
                key={item.id}
                onClick={() => onSelectTemplate(item)}
                className={`group rounded-2xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer text-left relative ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-white shadow-md'
                    : 'border-stone-200/90 bg-white hover:border-amber-400 hover:shadow-md'
                }`}
              >
                {/* Visual Header Banner dengan Tema */}
                <div className={`p-3.5 bg-gradient-to-br ${themeStyle.bg} text-white relative`}>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${themeStyle.badge}`}
                    >
                      {themeStyle.label}
                    </span>

                    {/* Badge Status Live / Draft & Selected */}
                    <div className="flex items-center gap-1.5">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-400 text-stone-900 shadow-xs flex items-center gap-1 animate-in fade-in">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          <span>Sedang Dikelola</span>
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
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
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Draf</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body Kartu */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-300 font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {item.groomName.charAt(0) || 'M'}
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 line-clamp-1">
                        {item.coupleNames}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span className="material-symbols-outlined text-[14px] text-stone-400">link</span>
                      <span className="font-mono text-stone-700 font-medium truncate">
                        mbell.id/{item.slug}
                      </span>
                    </div>
                  </div>

                  {/* Footer Aksi Kartu */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 w-full justify-center">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Aktif Dikelola</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate(item);
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">radio_button_unchecked</span>
                        <span>Pilih Undangan Ini</span>
                      </button>
                    )}

                    <a
                      href={`/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors shrink-0"
                      title="Lihat Pratinjau Live"
                    >
                      <span className="material-symbols-outlined text-[16px] block">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Banner Konfirmasi Undangan Terpilih */}
      {selectedTemplate && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[18px]">info</span>
            <span className="text-emerald-900">
              Data yang tampil di bawah adalah milik:{' '}
              <strong className="font-serif font-bold text-emerald-950">
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
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 shrink-0"
          >
            <span>Buka Undangan Live</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      )}
    </div>
  );
};
