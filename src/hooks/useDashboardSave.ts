import React, { useState, useEffect, useRef } from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import { extractYouTubeId } from './useAudioPlayer';
import { THEME_TO_TEMPLATE_ID, getSafeDbTemplateId } from '../pages/dashboard/constants/themeMapping';
import type { DashboardUser } from './useDashboardAuth';

import { computeCoupleSlug } from '../pages/dashboard/helpers/computeCoupleSlug';

interface UseDashboardSaveOptions {
  user: DashboardUser | null;
  formData: InvitationData;
  themeConfig: ThemeConfig;
  currentTemplateRecordId: string | null;
  setCurrentTemplateRecordId: React.Dispatch<React.SetStateAction<string | null>>;
  setFormData: React.Dispatch<React.SetStateAction<InvitationData>>;
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
      .select('id, user_id, status')
      .eq('slug', targetSlug);

    if (selectError) {
      console.warn('Sync invitations row query warning:', selectError.message);
      return;
    }

    const safeTemplateId = getSafeDbTemplateId(payload.template_id);

    if (existingRows && existingRows.length > 0) {
      const existing = existingRows[0];
      const canUpdate = !existing.user_id || existing.user_id === payload.user_id || !payload.user_id;
      if (canUpdate) {
        const updatePayload: any = {
          template_id: safeTemplateId,
          content: payload.content,
          theme_config: payload.theme_config,
          music_url: payload.music_url,
          music_type: payload.music_type,
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

  // 2. Debounced Autosave (800ms) to Supabase
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsSaving(true);
    const timer = setTimeout(async () => {
      try {
        const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
        const targetSlug = formData.slug || coupleSlug;
        // JANGAN autosave ke Supabase jika slug masih kosong / belum ada mempelai
        if (!targetSlug) {
          setIsSaving(false);
          return;
        }

        // Blokir permanen penyimpanan raditya-jessica agar tidak pernah hidup kembali di database
        const isRadityaJessica =
          targetSlug === 'raditya-jessica' ||
          ((formData.groom?.name || '').toLowerCase().includes('raditya') &&
            (formData.bride?.name || '').toLowerCase().includes('jessica'));

        if (isRadityaJessica) {
          setIsSaving(false);
          return;
        }

        const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
        const coupleTitle = `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
        const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
        const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

        const effectiveStatus = (formData.status || 'draft') as any;

        // 1. Simpan ke public.invitations secara aman
        await syncInvitationsRow(targetSlug, {
          user_id: user?.id || null,
          template_id,
          content: formData,
          theme_config: themeConfig,
          status: effectiveStatus,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
        });

        // 2. Autosave ke public.user_templates jika user login
        if (user?.id) {
          const res = await saveUserTemplate({
            id: currentTemplateRecordId || undefined,
            user_id: user.id,
            title: coupleTitle,
            slug: targetSlug,
            template_id,
            theme_id: formData.theme_id || 'modern',
            status: effectiveStatus,
            content: formData,
            theme_config: themeConfig,
            music_url: resolvedMusicUrl,
            music_type: resolvedMusicType,
            thumbnail_url: formData.cover_image || formData.couple_photo || null,
          });
          if (res.success && res.data && !currentTemplateRecordId) {
            setCurrentTemplateRecordId(res.data.id);
            localStorage.setItem('mbell_active_template_id', res.data.id);
          }
        }

        setLastSaved(new Date());
      } catch (error) {
        console.error('Autosave error exception:', error);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData, themeConfig, user]);

  // 3. Manual Explicit Save with User Templates Synchronization & Visual Toast Feedback
  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const targetSlug = formData.slug || coupleSlug || 'undangan-baru';

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

      // 1. Simpan ke tabel public.invitations secara aman
      await syncInvitationsRow(targetSlug, {
        user_id: user?.id || null,
        template_id,
        content: formData,
        theme_config: themeConfig,
        status: effectiveStatus,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
      });

      // 2. Jika user terautentikasi (login), simpan/upsert ke tabel public.user_templates
      if (user?.id) {
        const userTemplatePayload = {
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id,
          theme_id: formData.theme_id || 'modern',
          status: effectiveStatus,
          content: formData,
          theme_config: themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: formData.cover_image || formData.couple_photo || null,
        };

        const res = await saveUserTemplate(userTemplatePayload);
        if (res.success && res.data) {
          setCurrentTemplateRecordId(res.data.id);
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        } else if (res.error) {
          console.warn('User template save notice:', res.error);
        }
      }

      setLastSaved(new Date());
      setSaveToast({
        show: true,
        message: user?.id
          ? 'Berhasil Disimpan! Perubahan tersimpan ke koleksi Template Saya.'
          : 'Berhasil Disimpan! Perubahan template telah tersimpan.',
        isError: false,
      }, 3500);
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
      const targetSlug = coupleSlug || formData.slug || 'undangan-baru';

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

      const coupleTitle = `Draf Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      const draftContent: InvitationData = {
        ...formData,
        slug: targetSlug,
        status: 'draft',
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
        // Jika template aktif saat ini berstatus 'published', buat checkpoint baru (id: undefined)
        // agar template published yang sedang tayang tetap ada dan draf baru tersimpan di tab Draft!
        const isCurrentlyPublished = formData.status === 'published';
        const targetRecordId = isCurrentlyPublished ? undefined : (recordId || undefined);

        // Simpan / update di public.user_templates
        const res = await saveUserTemplate({
          id: targetRecordId,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id,
          theme_id: formData.theme_id || 'modern',
          status: 'draft',
          content: draftContent,
          theme_config: themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: formData.cover_image || formData.couple_photo || null,
        });

        if (res.success && res.data) {
          recordId = res.data.id;
          setCurrentTemplateRecordId(res.data.id);
          localStorage.setItem('mbell_active_template_id', res.data.id);
          // Beritahu MyTemplatesPanel untuk memperbarui daftar template
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        }

        // Jangan merusak status public.invitations menjadi 'draft' jika template live sudah terbit!
        if (!isCurrentlyPublished) {
          await syncInvitationsRow(targetSlug, {
            user_id: user.id,
            template_id,
            content: draftContent,
            theme_config: themeConfig,
            status: 'draft',
            music_url: resolvedMusicUrl,
            music_type: resolvedMusicType,
          });
        }
      }

      setFormData(draftContent);
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

  return {
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    saveToast,
    setSaveToast,
    handleManualSave,
    handleSaveDraft,
  };
}
