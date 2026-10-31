import React, { useState, useEffect, useRef } from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import {
  sanitizeAndUploadBase64InFormData,
  purgeOrphanedImages,
  unregisterStagedBlob,
  collectImageUrlsFromInvitation,
} from '../lib/supabase/storageService';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import { extractYouTubeId } from './useAudioPlayer';
import {
  THEME_TO_TEMPLATE_ID,
  TEMPLATE_ID_TO_THEME,
  getSafeDbTemplateId,
} from '../pages/dashboard/constants/themeMapping';
import type { DashboardUser } from './useDashboardAuth';

import { computeCoupleSlug, getCanonicalPublishedSlug, generateUniqueSlug } from '../pages/dashboard/helpers/computeCoupleSlug';
import {
  computeAuditTrail,
  type FieldChangeDetail,
  type AuditTrailState,
} from '../utils/changeAuditEngine';

export type { FieldChangeDetail, AuditTrailState };

interface UseDashboardSaveOptions {
  user: DashboardUser | null;
  formData: InvitationData;
  themeConfig: ThemeConfig;
  currentTemplateRecordId: string | null;
  setCurrentTemplateRecordId: React.Dispatch<React.SetStateAction<string | null>>;
  setFormData: React.Dispatch<React.SetStateAction<InvitationData>>;
  setThemeConfig?: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  loading?: boolean;
  liveBaseline?: {
    formData: InvitationData;
    themeConfig: ThemeConfig;
    theme_id?: string;
  } | null;
  isAlreadyPublished?: boolean;
}

/**
 * Sinkronisasi baris invitations dengan aman tanpa memicu 409 Conflict:
 * - Menggunakan getSafeDbTemplateId untuk menghindari pelanggaran foreign key ke public.templates
 * - Update berdasarkan primary key 'id' jika row sudah ada
 * - Menjaga status 'published' agar tidak tertimpa 'draft' saat autosave
 * - Mencegah error foreign key jika user belum login
 */
async function syncInvitationsRow(
  targetSlug: string,
  payload: {
    user_id?: string | null;
    template_id: string;
    content: any;
    theme_config: any;
    status: 'draft' | 'published' | 'archived';
    music_url: string;
    music_type: string;
  }
) {
  try {
    const { data: existingRows, error: selectError } = await supabase
      .from('invitations')
      .select('id, user_id, status, template_id, content, theme_config, is_paid, paid_template_id, unlocked_templates')
      .eq('slug', targetSlug);

    if (selectError) {
      console.warn('Sync invitations row query warning:', selectError.message);
      return;
    }

    const safeTemplateId = getSafeDbTemplateId(payload.template_id);

    if (existingRows && existingRows.length > 0) {
      const existing: any = existingRows[0];
      const canUpdate = !existing.user_id || existing.user_id === payload.user_id || !payload.user_id;
      if (canUpdate) {
        // Ambil tema yang sah dari data existing live di Supabase
        const existingTheme =
          existing.content?.theme_id ||
          TEMPLATE_ID_TO_THEME[existing.template_id] ||
          existing.template_id ||
          'sunda';
        const newTheme = payload.content?.theme_id || TEMPLATE_ID_TO_THEME[payload.template_id] || 'sunda';


        // Jika status undangan SUDAH LIVE (published):
        // Jika tema yang diedit berbeda dari tema live yang sudah terbit di Supabase (newTheme !== existingTheme):
        // Tautan publik WAJIB TETAP mempertahankan template live yang sah (existing.template_id, existingTheme, & existing theme_config)
        // sampai user secara sadar menekan tombol 'Terbitkan'!
        const isAttemptingDifferentThemeOnLive =
          existing.status === 'published' && newTheme !== existingTheme;

        const activeLiveTemplateId = isAttemptingDifferentThemeOnLive
          ? existing.template_id
          : safeTemplateId;

        const liveContent = isAttemptingDifferentThemeOnLive
          ? { ...payload.content, theme_id: existingTheme }
          : payload.content;
        const effectiveIsPaid = Boolean(existing.is_paid ?? (existing.status === 'published'));
        const effectivePaidTplId = effectiveIsPaid
          ? (payload.content?.paid_template_id || existing.paid_template_id || (existing.status === 'published' ? activeLiveTemplateId : null))
          : null;
        const effectiveUnlocked = effectiveIsPaid
          ? (Array.isArray(existing.unlocked_templates) && existing.unlocked_templates.length > 0 ? existing.unlocked_templates : (payload.content?.unlocked_templates || []))
          : (Array.isArray(existing.unlocked_templates) ? existing.unlocked_templates : []);

        const synchronizedContent = {
          ...liveContent,
          is_paid: effectiveIsPaid,
          paid_template_id: effectivePaidTplId,
          unlocked_templates: effectiveUnlocked,
        };

        const updatePayload: any = {
          template_id: activeLiveTemplateId,
          content: synchronizedContent,
          theme_config: isAttemptingDifferentThemeOnLive ? (existing.content?.theme_config || (existing as any).theme_config || payload.theme_config) : payload.theme_config,
          music_url: payload.music_url,
          music_type: payload.music_type,
          is_paid: effectiveIsPaid,
          paid_template_id: effectivePaidTplId,
          unlocked_templates: effectiveUnlocked,
          updated_at: new Date().toISOString(),
        };
        if (existing.status !== 'published') {
          updatePayload.status = payload.status;
        }
        if (payload.user_id && !existing.user_id) {
          updatePayload.user_id = payload.user_id;
        }
        const { error: updateError } = await supabase
          .from('invitations')
          .update(updatePayload)
          .eq('id', existing.id);

        if (updateError) {
          console.warn('Sync invitations row update warning:', updateError.message);
        }
      }
    } else if (payload.user_id) {
      const insertPayload = {
        ...payload,
        template_id: safeTemplateId,
        slug: targetSlug,
        updated_at: new Date().toISOString(),
      };
      const { error: insertError } = await supabase
        .from('invitations')
        .insert(insertPayload);

      if (insertError) {
        console.warn('Sync invitations insert warning:', insertError.message);
      }
    }
  } catch (err: any) {
    console.warn('Sync invitations row notice:', err?.message || err);
  }
}

export function useDashboardSave({
  user,
  formData,
  themeConfig,
  currentTemplateRecordId,
  setCurrentTemplateRecordId,
  setFormData,
  setThemeConfig,
  loading = false,
  liveBaseline,
  isAlreadyPublished = false,
}: UseDashboardSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveToast, setSaveToastState] = useState<{ show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null>(null);
  const saveToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveToastTimerRef.current) {
        clearTimeout(saveToastTimerRef.current);
      }
    };
  }, []);

  const setSaveToast = React.useCallback((toastData: { show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null, duration: number = 2400) => {
    if (saveToastTimerRef.current) {
      clearTimeout(saveToastTimerRef.current);
      saveToastTimerRef.current = null;
    }
    if (!toastData || !toastData.show) {
      setSaveToastState(null);
      return;
    }
    setSaveToastState(toastData);
    saveToastTimerRef.current = setTimeout(() => {
      setSaveToastState(null);
      saveToastTimerRef.current = null;
    }, duration);
  }, []);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [unsavedCount, setUnsavedCount] = useState(0);
  const [auditTrail, setAuditTrail] = useState<AuditTrailState>({
    count: 0,
    changes: [],
    hasChanges: false,
  });

  // Snapshot baseline data yang tersimpan di server/database (draf)
  const baselineSnapshotRef = useRef<{
    formData: InvitationData;
    themeConfig: ThemeConfig;
  } | null>(null);

  // Snapshot data yang sudah benar-benar live di tautan publik (public.invitations)
  const publishedSnapshotRef = useRef<{
    formData: InvitationData;
    themeConfig: ThemeConfig;
  } | null>(null);

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [unpublishedCount, setUnpublishedCount] = useState(0);

  const prevRecordIdRef = useRef<string | null>(currentTemplateRecordId);

  // Inisialisasi published snapshot jika undangan berstatus published atau ada liveBaseline resmi
  useEffect(() => {
    if (liveBaseline) {
      publishedSnapshotRef.current = {
        formData: JSON.parse(JSON.stringify(liveBaseline.formData)),
        themeConfig: JSON.parse(JSON.stringify(liveBaseline.themeConfig)),
      };
    } else if (isAlreadyPublished || formData.status === 'published') {
      if (!publishedSnapshotRef.current && !loading) {
        publishedSnapshotRef.current = {
          formData: JSON.parse(JSON.stringify(formData)),
          themeConfig: JSON.parse(JSON.stringify(themeConfig)),
        };
      }
    }
  }, [liveBaseline, isAlreadyPublished, formData.status, loading]);

  // Listener saat undangan berhasil diterbitkan ke live Supabase
  useEffect(() => {
    const handlePublishedUpdated = (e: any) => {
      const detail = e.detail;
      if (detail?.formData) {
        publishedSnapshotRef.current = {
          formData: JSON.parse(JSON.stringify(detail.formData)),
          themeConfig: JSON.parse(JSON.stringify(detail.themeConfig || themeConfig)),
        };
        setHasUnpublishedChanges(false);
        setUnpublishedCount(0);
      }
    };
    window.addEventListener('mbell_published_updated', handlePublishedUpdated);
    return () => {
      window.removeEventListener('mbell_published_updated', handlePublishedUpdated);
    };
  }, [themeConfig]);

  // Listener sinkronisasi baseline saat template di-load dari MyTemplates atau di-reset
  useEffect(() => {
    const handleTemplateLoaded = (e: any) => {
      const detail = e.detail;
      if (detail?.formData && detail?.themeConfig) {
        baselineSnapshotRef.current = {
          formData: JSON.parse(JSON.stringify(detail.formData)),
          themeConfig: JSON.parse(JSON.stringify(detail.themeConfig)),
        };
        if (detail.formData.status === 'published') {
          publishedSnapshotRef.current = {
            formData: JSON.parse(JSON.stringify(detail.formData)),
            themeConfig: JSON.parse(JSON.stringify(detail.themeConfig)),
          };
          setHasUnpublishedChanges(false);
          setUnpublishedCount(0);
        }
      } else {
        baselineSnapshotRef.current = {
          formData: JSON.parse(JSON.stringify(formData)),
          themeConfig: JSON.parse(JSON.stringify(themeConfig)),
        };
      }
      setHasUnsavedChanges(false);
      setUnsavedCount(0);
      setAuditTrail({ count: 0, changes: [], hasChanges: false });
      try {
        localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
      } catch (e) {}
    };

    const handleResetBlank = () => {
      baselineSnapshotRef.current = null;
      publishedSnapshotRef.current = null;
      setHasUnsavedChanges(false);
      setUnsavedCount(0);
      setHasUnpublishedChanges(false);
      setUnpublishedCount(0);
      setAuditTrail({ count: 0, changes: [], hasChanges: false });
      try {
        localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
      } catch (e) {}
    };

    window.addEventListener('mbell_template_loaded', handleTemplateLoaded);
    window.addEventListener('mbell_reset_editor_blank', handleResetBlank);
    return () => {
      window.removeEventListener('mbell_template_loaded', handleTemplateLoaded);
      window.removeEventListener('mbell_reset_editor_blank', handleResetBlank);
    };
  }, [formData, themeConfig]);

  // Pantau perubahan record template ID (ganti template tersimpan)
  useEffect(() => {
    if (currentTemplateRecordId !== prevRecordIdRef.current) {
      prevRecordIdRef.current = currentTemplateRecordId;
      if (!loading) {
        baselineSnapshotRef.current = {
          formData: JSON.parse(JSON.stringify(formData)),
          themeConfig: JSON.parse(JSON.stringify(themeConfig)),
        };
        setHasUnsavedChanges(false);
        setUnsavedCount(0);
        setAuditTrail({ count: 0, changes: [], hasChanges: false });
      }
    }
  }, [currentTemplateRecordId, loading, formData, themeConfig]);

  // 2. Diff Calculator: hitung perubahan nyata terhadap baseline menggunakan ChangeAuditEngine
  useEffect(() => {
    if (loading) return;

    // Jika baseline belum terpasang, inisialisasi dengan data awal yang baru dimuat
    if (!baselineSnapshotRef.current) {
      baselineSnapshotRef.current = {
        formData: JSON.parse(JSON.stringify(formData)),
        themeConfig: JSON.parse(JSON.stringify(themeConfig)),
      };
      setHasUnsavedChanges(false);
      setUnsavedCount(0);
      setAuditTrail({ count: 0, changes: [], hasChanges: false });
      return;
    }

    // Hitung audit trail perubahan nyata
    const trail = computeAuditTrail(baselineSnapshotRef.current, {
      formData,
      themeConfig,
    });

    setAuditTrail(trail);
    setUnsavedCount(trail.count);
    setHasUnsavedChanges(trail.hasChanges);

    // Hitung audit trail unpublished changes jika undangan sudah berstatus published / live
    const isLive = Boolean(isAlreadyPublished || formData.status === 'published' || liveBaseline);
    const pubBaseline = publishedSnapshotRef.current || liveBaseline;

    if (isLive && pubBaseline) {
      const pubTrail = computeAuditTrail(pubBaseline, {
        formData,
        themeConfig,
      });
      setHasUnpublishedChanges(pubTrail.hasChanges);
      setUnpublishedCount(pubTrail.count);
    } else {
      setHasUnpublishedChanges(false);
      setUnpublishedCount(0);
    }

    if (trail.hasChanges) {
      try {
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(formData));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(themeConfig));
        localStorage.setItem('mbell_pending_draft_hasUnsavedEdits', 'true');
      } catch (e) {
        console.warn('Draft local cache warning:', e);
      }
    } else {
      try {
        localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
      } catch (e) {}
    }
  }, [formData, themeConfig, loading]);

  // 🔄 Revert All Changes: mengembalikan seluruh data ke baseline tersimpan
  const handleRevertAll = React.useCallback(() => {
    if (!baselineSnapshotRef.current) return;

    // Bersihkan seluruh objek staged blob lokal yang dibatalkan
    const currentUrls = collectImageUrlsFromInvitation(formData);
    currentUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        unregisterStagedBlob(url);
      }
    });

    setFormData(JSON.parse(JSON.stringify(baselineSnapshotRef.current.formData)));
    if (setThemeConfig) {
      setThemeConfig(JSON.parse(JSON.stringify(baselineSnapshotRef.current.themeConfig)));
    }
    setUnsavedCount(0);
    setHasUnsavedChanges(false);
    setAuditTrail({ count: 0, changes: [], hasChanges: false });
    try {
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
    } catch (e) {}
    setSaveToast({
      show: true,
      message: 'Semua perubahan berhasil dikembalikan ke posisi semula',
      type: 'info',
    });
  }, [formData, setFormData, setThemeConfig, setSaveToast]);

  // ↩️ Revert Single Field: mengembalikan 1 field spesifik ke baseline
  const handleRevertField = React.useCallback((fieldKey: string) => {
    if (!baselineSnapshotRef.current) return;
    const baseForm = baselineSnapshotRef.current.formData;
    const baseTheme = baselineSnapshotRef.current.themeConfig;

    if (fieldKey === 'theme_id') {
      setFormData((prev) => ({ ...prev, theme_id: baseForm.theme_id }));
    } else if (fieldKey.startsWith('groom.')) {
      const prop = fieldKey.replace('groom.', '');
      setFormData((prev) => ({
        ...prev,
        groom: { ...prev.groom, [prop]: (baseForm.groom as any)?.[prop] },
      }));
    } else if (fieldKey.startsWith('bride.')) {
      const prop = fieldKey.replace('bride.', '');
      setFormData((prev) => ({
        ...prev,
        bride: { ...prev.bride, [prop]: (baseForm.bride as any)?.[prop] },
      }));
    } else if (fieldKey === 'is_bride_first') {
      setFormData((prev) => ({ ...prev, is_bride_first: baseForm.is_bride_first }));
    } else if (fieldKey === 'wedding_date_iso') {
      setFormData((prev) => ({ ...prev, wedding_date_iso: baseForm.wedding_date_iso }));
    } else if (fieldKey === 'wedding_date_display') {
      setFormData((prev) => ({ ...prev, wedding_date_display: baseForm.wedding_date_display }));
    } else if (fieldKey === 'countdown_target') {
      setFormData((prev) => ({ ...prev, countdown_target: baseForm.countdown_target }));
    } else if (fieldKey.startsWith('events')) {
      setFormData((prev) => ({ ...prev, events: JSON.parse(JSON.stringify(baseForm.events || [])) }));
    } else if (fieldKey === 'cover_image') {
      setFormData((prev) => ({
        ...prev,
        cover_image: baseForm.cover_image,
        couple_photo: baseForm.couple_photo,
      }));
    } else if (fieldKey === 'gallery') {
      setFormData((prev) => ({ ...prev, gallery: JSON.parse(JSON.stringify(baseForm.gallery || [])) }));
    } else if (fieldKey === 'gallery_style') {
      const revertedStyle = baseForm.gallery_style || baseTheme.gallery_style || 'bento-grid';
      setFormData((prev) => ({
        ...prev,
        gallery_style: revertedStyle,
        theme_config: prev.theme_config ? { ...prev.theme_config, gallery_style: revertedStyle } : undefined,
      }));
      if (setThemeConfig) {
        setThemeConfig((prev) => ({ ...prev, gallery_style: revertedStyle }));
      }
    } else if (fieldKey === 'quote') {
      setFormData((prev) => ({ ...prev, quote: baseForm.quote }));
    } else if (fieldKey === 'quote_source') {
      setFormData((prev) => ({ ...prev, quote_source: baseForm.quote_source }));
    } else if (fieldKey === 'love_story') {
      setFormData((prev) => ({ ...prev, love_story: JSON.parse(JSON.stringify(baseForm.love_story || [])) }));
    } else if (fieldKey === 'banks') {
      setFormData((prev) => ({
        ...prev,
        banks: JSON.parse(JSON.stringify(baseForm.banks || [])),
        bank_accounts: JSON.parse(JSON.stringify(baseForm.banks || [])),
      }));
    } else if (fieldKey === 'qris_url') {
      setFormData((prev) => ({ ...prev, qris_url: baseForm.qris_url }));
    } else if (fieldKey === 'gift_address') {
      setFormData((prev) => ({ ...prev, gift_address: baseForm.gift_address }));
    } else if (fieldKey === 'slug') {
      setFormData((prev) => ({ ...prev, slug: baseForm.slug }));
    } else if (fieldKey === 'hashtag') {
      setFormData((prev) => ({ ...prev, hashtag: baseForm.hashtag }));
    } else if (fieldKey === 'streaming_url') {
      setFormData((prev) => ({ ...prev, streaming_url: baseForm.streaming_url }));
    } else if (fieldKey === 'music_url') {
      setFormData((prev) => ({ ...prev, music_url: baseForm.music_url }));
      if (setThemeConfig) {
        setThemeConfig((prev) => ({ ...prev, music_url: baseTheme.music_url }));
      }
    } else if (fieldKey.startsWith('anim.')) {
      const prop = fieldKey.replace('anim.', '');
      if (setThemeConfig) {
        setThemeConfig((prev) => ({
          ...prev,
          animation_config: {
            ...prev.animation_config,
            [prop]: (baseTheme.animation_config as any)?.[prop],
          } as any,
        }));
      }
    } else if (fieldKey === 'theme.primary_color') {
      if (setThemeConfig) {
        setThemeConfig((prev) => ({ ...prev, primary_color: baseTheme.primary_color }));
      }
    }

    setSaveToast({
      show: true,
      message: 'Perubahan field berhasil dibatalkan',
      type: 'info',
    });
  }, [setFormData, setThemeConfig, setSaveToast]);

  // 3. Manual Explicit Save with User Templates Synchronization & Visual Toast Feedback
  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const isCurrentlyPublished = Boolean(formData.status === 'published' || isAlreadyPublished || liveBaseline);
      const rawTargetSlug = isCurrentlyPublished
        ? getCanonicalPublishedSlug(formData.slug, formData.groom?.name, formData.bride?.name)
        : (formData.slug || coupleSlug || 'undangan-baru');

      // 🔒 Slug Collision Prevention: Pastikan slug unik antar user berbeda
      const { slug: targetSlug, wasSuffixed } = await generateUniqueSlug(
        rawTargetSlug,
        user?.id,
        currentTemplateRecordId
      );

      // Sinkronisasi slug baru ke formData jika ada suffix
      if (wasSuffixed) {
        setFormData((prev) => ({ ...prev, slug: targetSlug }));
      }

      // Blokir permanen raditya-jessica agar tidak pernah disimpan kembali
      const isRadityaJessica =
        targetSlug === 'raditya-jessica' ||
        ((formData.groom?.name || '').toLowerCase().includes('raditya') &&
          (formData.bride?.name || '').toLowerCase().includes('jessica'));

      if (isRadityaJessica) {
        setIsSaving(false);
        setSaveToast({
          show: true,
          message: 'Template raditya-jessica telah dihapus permanen dan tidak dapat disimpan.',
          isError: true,
        }, 3000);
        return;
      }

      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;

      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';
      const effectiveStatus = (formData.status || 'draft') as any;

      // 0. FIREWALL BASE64: Pastikan seluruh aset gambar telah bersih dari string Base64
      let safeFormData = formData;
      if (user?.id) {
        safeFormData = await sanitizeAndUploadBase64InFormData(formData, user.id, user.email, targetSlug);
        if (JSON.stringify(safeFormData) !== JSON.stringify(formData)) {
          setFormData(safeFormData);
        }
      }

      // 1. Simpan ke tabel public.invitations secara aman (tanpa Base64)
      await syncInvitationsRow(targetSlug, {
        user_id: user?.id || null,
        template_id,
        content: safeFormData,
        theme_config: themeConfig,
        status: effectiveStatus,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
      });

      // 2. Simpan ke localStorage sebagai cadangan offline
      try {
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(safeFormData));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(themeConfig));
      } catch (e) {
        console.warn('Manual save local cache notice:', e);
      }

      // 3. Jika user terautentikasi (login), simpan/upsert ke tabel public.user_templates
      if (user?.id) {

        // Jika status undangan adalah published, dan user sedang memilih tema yang berbeda di editor (pratinjau):
        // Simpan tema yang sudah terbit di kolom utama agar rute publik & record live tetap aman
        const publishedLiveTheme = baselineSnapshotRef.current?.formData?.theme_id;
        const isDifferentThemeOnLive = effectiveStatus === 'published' && Boolean(publishedLiveTheme) && safeFormData.theme_id !== publishedLiveTheme;
        const resolvedDbTheme = isDifferentThemeOnLive
          ? (publishedLiveTheme || 'modern')
          : (safeFormData.theme_id || 'modern');
        const resolvedDbTemplateId = getSafeDbTemplateId(resolvedDbTheme);

        const userTemplatePayload = {
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id: resolvedDbTemplateId,
          theme_id: resolvedDbTheme,
          status: effectiveStatus,
          is_paid: safeFormData.is_paid ?? (effectiveStatus === 'published'),
          paid_template_id: safeFormData.paid_template_id || (effectiveStatus === 'published' ? resolvedDbTemplateId : null),
          unlocked_templates: safeFormData.unlocked_templates || [],
          content: isDifferentThemeOnLive ? { ...safeFormData, theme_id: resolvedDbTheme } : safeFormData,
          theme_config: isDifferentThemeOnLive ? (baselineSnapshotRef.current?.themeConfig || themeConfig) : themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: safeFormData.cover_image || safeFormData.couple_photo || null,
        };

        const res = await saveUserTemplate(userTemplatePayload);
        if (res.success && res.data) {
          setCurrentTemplateRecordId(res.data.id);
          localStorage.setItem('mbell_active_template_id', res.data.id);
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        } else if (res.error) {
          console.warn('User template save notice:', res.error);
        }
      }

      const previousBaselineFormData = baselineSnapshotRef.current?.formData;

      baselineSnapshotRef.current = {
        formData: JSON.parse(JSON.stringify(formData)),
        themeConfig: JSON.parse(JSON.stringify(themeConfig)),
      };
      setHasUnsavedChanges(false);
      setUnsavedCount(0);
      setAuditTrail({ count: 0, changes: [], hasChanges: false });

      // Garbage Collector (Staging -> Commit): Bersihkan berkas gambar yatim di storage Supabase secara aman
      if (previousBaselineFormData) {
        purgeOrphanedImages(previousBaselineFormData, safeFormData).catch((gcErr) =>
          console.warn('[StorageService] Garbage collection warning in manual save:', gcErr)
        );
      }

      // Hitung ulang unpublished changes terhadap live baseline
      const isLiveCurrently = Boolean(isAlreadyPublished || formData.status === 'published' || liveBaseline);
      const activePubBase = publishedSnapshotRef.current || liveBaseline;
      if (isLiveCurrently && activePubBase) {
        const pubTrail = computeAuditTrail(activePubBase, {
          formData,
          themeConfig,
        });
        setHasUnpublishedChanges(pubTrail.hasChanges);
        setUnpublishedCount(pubTrail.count);
      }
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
      try {
        const publishedLiveTheme = baselineSnapshotRef.current?.formData?.theme_id;
        const isThemeLiveOrDraft = !publishedLiveTheme || formData.theme_id === publishedLiveTheme || effectiveStatus !== 'published';
        if (isThemeLiveOrDraft) {
          localStorage.setItem(`mbell_cached_inv_${targetSlug}`, JSON.stringify({
            templateId: template_id,
            invitationData: formData,
            themeConfig,
          }));
        }
      } catch (e) {}
      setLastSaved(new Date());

      const isLiveAlready = formData.status === 'published';
      setSaveToast({
        show: true,
        message: wasSuffixed
          ? `Tersimpan! Slug otomatis menjadi "${targetSlug}" karena slug asli sudah digunakan user lain.`
          : isLiveAlready
          ? 'Perubahan berhasil disimpan & langsung aktif di tautan live!'
          : user?.id
          ? 'Perubahan berhasil disimpan ke database!'
          : 'Berhasil Disimpan! Perubahan template telah tersimpan.',
        isError: false,
        type: wasSuffixed ? 'info' : 'success',
      }, wasSuffixed ? 5000 : 3500);
    } catch (err: any) {
      console.error('Manual save exception:', err);
      setSaveToast({
        show: true,
        message: 'Terjadi kesalahan saat menyimpan perubahan.',
        isError: true,
      }, 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // 💾 4. Explicit Save Draft / Checkpoint ke Supabase & LocalStorage
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
      // Pastikan slug mengikuti nama kedua mempelai secara dinamis
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const rawTargetSlug = formData.slug || coupleSlug || 'undangan-baru';

      // 🔒 Slug Collision Prevention
      const { slug: targetSlug, wasSuffixed } = await generateUniqueSlug(
        rawTargetSlug,
        user?.id,
        currentTemplateRecordId
      );

      if (wasSuffixed) {
        setFormData((prev) => ({ ...prev, slug: targetSlug }));
      }

      // Blokir permanen raditya-jessica agar tidak pernah disimpan kembali
      const isRadityaJessica =
        targetSlug === 'raditya-jessica' ||
        ((formData.groom?.name || '').toLowerCase().includes('raditya') &&
          (formData.bride?.name || '').toLowerCase().includes('jessica'));

      if (isRadityaJessica) {
        setIsSaving(false);
        setSaveToast({
          show: true,
          message: 'Template raditya-jessica telah dihapus permanen dan tidak dapat disimpan.',
          isError: true,
        }, 3000);
        return;
      }

      const isCurrentlyPublished = formData.status === 'published';
      const effectiveStatus = (isCurrentlyPublished ? 'published' : 'draft') as any;
      const coupleTitle = isCurrentlyPublished
        ? `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`
        : `Draf Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      // 0. PURE STAGING COMMIT: Unggah gambar staged (blob: / base64) ke Supabase Storage saat simpan draf
      let safeDraftData = formData;
      if (user?.id) {
        safeDraftData = await sanitizeAndUploadBase64InFormData(formData, user.id, user.email, targetSlug);
        if (JSON.stringify(safeDraftData) !== JSON.stringify(formData)) {
          setFormData(safeDraftData);
        }
      }

      const draftContent: InvitationData = {
        ...safeDraftData,
        slug: targetSlug,
        status: effectiveStatus,
      };

      // 1. Simpan selalu ke localStorage sebagai cadangan offline & guest
      try {
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(draftContent));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(themeConfig));
        localStorage.setItem('mbell_pending_draft_hasUnsavedEdits', 'true');
      } catch (e) {
        console.warn('Draft local cache warning:', e);
      }

      // 2. Simpan ke Supabase jika user sudah login
      let recordId = currentTemplateRecordId;
      if (user?.id) {
        const targetRecordId = recordId || undefined;

        const publishedLiveTheme = baselineSnapshotRef.current?.formData?.theme_id;
        const isDifferentThemeOnLive = effectiveStatus === 'published' && Boolean(publishedLiveTheme) && safeDraftData.theme_id !== publishedLiveTheme;
        const resolvedDbTheme = isDifferentThemeOnLive
          ? (publishedLiveTheme || 'modern')
          : (safeDraftData.theme_id || 'modern');
        const resolvedDbTemplateId = getSafeDbTemplateId(resolvedDbTheme);

        // Simpan / update di public.user_templates
        const res = await saveUserTemplate({
          id: targetRecordId,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id: resolvedDbTemplateId,
          theme_id: resolvedDbTheme,
          status: effectiveStatus,
          content: isDifferentThemeOnLive ? { ...draftContent, theme_id: resolvedDbTheme } : draftContent,
          theme_config: isDifferentThemeOnLive ? (baselineSnapshotRef.current?.themeConfig || themeConfig) : themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: safeDraftData.cover_image || safeDraftData.couple_photo || null,
        });

        if (res.success && res.data) {
          recordId = res.data.id;
          setCurrentTemplateRecordId(res.data.id);
          localStorage.setItem('mbell_active_template_id', res.data.id);
          // Beritahu MyTemplatesPanel untuk memperbarui daftar template
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        }

        // Sinkronisasi selalu ke public.invitations
        await syncInvitationsRow(targetSlug, {
          user_id: user.id,
          template_id,
          content: draftContent,
          theme_config: themeConfig,
          status: effectiveStatus,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
        });
      }

      const previousBaselineFormData = baselineSnapshotRef.current?.formData;

      baselineSnapshotRef.current = {
        formData: JSON.parse(JSON.stringify(draftContent)),
        themeConfig: JSON.parse(JSON.stringify(themeConfig)),
      };
      setFormData(draftContent);
      setHasUnsavedChanges(false);
      setUnsavedCount(0);
      setAuditTrail({ count: 0, changes: [], hasChanges: false });

      // Garbage Collector (Staging -> Commit): Bersihkan berkas gambar yatim di storage Supabase secara aman
      if (previousBaselineFormData) {
        purgeOrphanedImages(previousBaselineFormData, draftContent).catch((gcErr) =>
          console.warn('[StorageService] Garbage collection warning in draft save:', gcErr)
        );
      }
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
      try {
        const publishedLiveTheme = baselineSnapshotRef.current?.formData?.theme_id;
        const isThemeLiveOrDraft = !publishedLiveTheme || formData.theme_id === publishedLiveTheme || effectiveStatus !== 'published';
        if (isThemeLiveOrDraft) {
          localStorage.setItem(`mbell_cached_inv_${targetSlug}`, JSON.stringify({
            templateId: template_id,
            invitationData: draftContent,
            themeConfig,
          }));
        }
      } catch (e) {}
      setLastSaved(new Date());

      setSaveToast({
        show: true,
        message: user?.id
          ? 'Perubahan draf berhasil disimpan'
          : 'Draf tersimpan di browser',
        type: 'success',
        isError: false,
      });
    } catch (err: any) {
      console.error('Save draft error:', err);
      setSaveToast({
        show: true,
        message: 'Gagal menyimpan perubahan',
        type: 'error',
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Khusus Musik: Simpan sebagai draf (local + user_templates) & langsung aktifkan status perubahan (+1)
  const handleSaveMusicDraft = async (newMusicUrl: string) => {
    setIsSaving(true);
    try {
      const cleanUrl = (newMusicUrl || '').trim();
      const updatedFormData: InvitationData = { ...formData, music_url: cleanUrl };
      const updatedThemeConfig: ThemeConfig = { ...themeConfig, music_url: cleanUrl };

      // 1. Update form & theme react state agar preview real-time langsung memutar musik
      setFormData(updatedFormData);
      if (setThemeConfig) {
        setThemeConfig(updatedThemeConfig);
      }

      // 2. Simpan cache draf lokal
      try {
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(updatedFormData));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(updatedThemeConfig));
        localStorage.setItem('mbell_pending_draft_hasUnsavedEdits', 'true');
      } catch (e) {
        console.warn('Draft local cache warning:', e);
      }

      // 3. Simpan draf ke user_templates milik user di Supabase (TIDAK langsung menimpa live invitation jika belum diterbitkan)
      if (user?.id) {
        const coupleSlug = computeCoupleSlug(updatedFormData.groom?.name, updatedFormData.bride?.name);
        const targetSlug = updatedFormData.slug || coupleSlug || 'undangan-baru';
        const safeDbTemplateId = getSafeDbTemplateId(updatedFormData.theme_id);
        const resolvedMusicType = Boolean(extractYouTubeId(cleanUrl)) ? 'youtube' : 'mp3';
        const effectiveStatus: 'published' | 'draft' | 'archived' =
          updatedFormData.status === 'published' ? 'published' : 'draft';

        let safeUpdatedData = updatedFormData;
        safeUpdatedData = await sanitizeAndUploadBase64InFormData(updatedFormData, user.id, user.email, targetSlug);

        const res = await saveUserTemplate({
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: `Pernikahan ${safeUpdatedData.groom?.name || 'Mempelai Pria'} & ${safeUpdatedData.bride?.name || 'Mempelai Wanita'}`,
          slug: targetSlug,
          template_id: safeDbTemplateId,
          theme_id: safeUpdatedData.theme_id || 'modern',
          status: effectiveStatus,
          content: safeUpdatedData,
          theme_config: updatedThemeConfig,
          music_url: cleanUrl,
          music_type: resolvedMusicType,
          thumbnail_url: safeUpdatedData.cover_image || safeUpdatedData.couple_photo || null,
        });

        if (res.success && res.data) {
          setCurrentTemplateRecordId(res.data.id);
          localStorage.setItem('mbell_active_template_id', res.data.id);
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        }
      }

      // 4. Update baseline draft lokal
      baselineSnapshotRef.current = {
        formData: JSON.parse(JSON.stringify(updatedFormData)),
        themeConfig: JSON.parse(JSON.stringify(updatedThemeConfig)),
      };

      // 5. Audit pembanding terhadap baseline LIVE publik
      const activePubBase = publishedSnapshotRef.current || liveBaseline;
      const isLiveCurrently = Boolean(isAlreadyPublished || formData.status === 'published' || liveBaseline);

      if (isLiveCurrently && activePubBase) {
        const pubTrail = computeAuditTrail(activePubBase, {
          formData: updatedFormData,
          themeConfig: updatedThemeConfig,
        });
        const pubCount = pubTrail.count > 0 ? pubTrail.count : 1;
        setHasUnpublishedChanges(true);
        setUnpublishedCount(pubCount);
      } else {
        setHasUnsavedChanges(true);
        setUnsavedCount(1);
      }

      setLastSaved(new Date());

      setSaveToast({
        show: true,
        message: isLiveCurrently
          ? 'Musik berhasil disimpan di draf! Klik tombol "Terbitkan (+1)" di bawah untuk mengaktifkannya di link undangan.'
          : 'Musik latar berhasil disimpan di draf!',
        type: 'info',
        isError: false,
      }, 5000);
    } catch (err: any) {
      console.error('Save music draft error:', err);
      setSaveToast({
        show: true,
        message: 'Gagal menyimpan draf musik: ' + (err?.message || 'Coba lagi'),
        type: 'error',
        isError: true,
      }, 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    saveToast,
    setSaveToast,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    unsavedCount,
    setUnsavedCount,
    hasUnpublishedChanges,
    setHasUnpublishedChanges,
    unpublishedCount,
    setUnpublishedCount,
    auditTrail,
    handleRevertAll,
    handleRevertField,
    handleManualSave,
    handleSaveDraft,
    handleSaveMusicDraft,
  };
}
