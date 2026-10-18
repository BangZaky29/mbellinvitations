import React, { useState } from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import { extractYouTubeId } from './useAudioPlayer';
import { THEME_TO_TEMPLATE_ID, TEMPLATE_ID_TO_THEME, getSafeDbTemplateId } from '../pages/dashboard/constants/themeMapping';
import type { DashboardUser } from './useDashboardAuth';
import { computeCoupleSlug } from '../pages/dashboard/helpers/computeCoupleSlug';

interface UseDashboardPublishOptions {
  user: DashboardUser | null;
  formData: InvitationData;
  themeConfig: ThemeConfig;
  currentTemplateRecordId: string | null;
  setCurrentTemplateRecordId: React.Dispatch<React.SetStateAction<string | null>>;
  setFormData: React.Dispatch<React.SetStateAction<InvitationData>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  setSaveToast: ((toast: { show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null, duration?: number) => void) | React.Dispatch<React.SetStateAction<{ show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null>>;
  setShowAuthGateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPricingModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleManualSave: () => Promise<void>;
}

export function useDashboardPublish({
  user,
  formData,
  themeConfig,
  currentTemplateRecordId,
  setCurrentTemplateRecordId,
  setFormData,
  setIsSaving,
  setLastSaved,
  setSaveToast,
  setShowAuthGateModal,
  setShowConfirmPublishModal,
  setShowPricingModal,
  handleManualSave: _handleManualSave,
}: UseDashboardPublishOptions) {
  const [publishedThemeId, setPublishedThemeId] = useState<string | null>(null);
  const [isAlreadyPublished, setIsAlreadyPublished] = useState<boolean>(false);
  const [isTemplateChanged, setIsTemplateChanged] = useState<boolean>(false);

  // 1. Handler Meminta Terbitkan: Cek Auth, Deteksi Perubahan Template & Munculkan Pop-up Konfirmasi
  const handleRequestPublish = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user || (user?.id ? user : null);

      if (!currentUser || !currentUser.id) {
        setShowAuthGateModal(true);
        return;
      }

      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const targetSlug = formData.slug || coupleSlug || 'undangan';

      // Cek record yang tersimpan saat ini di Supabase untuk slug ini
      const { data: invRow } = await supabase
        .from('invitations')
        .select('status, template_id, content')
        .eq('slug', targetSlug)
        .maybeSingle();

      const isLive = invRow?.status === 'published' || formData.status === 'published';
      const existingTheme = invRow?.content?.theme_id || (invRow?.template_id ? TEMPLATE_ID_TO_THEME[invRow.template_id] : null);
      const currentTheme = formData.theme_id || 'sunda';

      if (isLive && existingTheme) {
        setPublishedThemeId(existingTheme);
        setIsAlreadyPublished(true);
        setIsTemplateChanged(existingTheme !== currentTheme);
      } else {
        setPublishedThemeId(null);
        setIsAlreadyPublished(false);
        setIsTemplateChanged(false);
      }

      // Wajib SELALU munculkan Pop-up Konfirmasi sebelum publikasi
      setShowConfirmPublishModal(true);
    } catch (err) {
      console.warn('Auth check error:', err);
      setShowAuthGateModal(true);
    }
  };

  // 2. Handler saat user mengonfirmasi publikasi untuk template yang SAMA (Free instant publish)
  const handleConfirmSameTemplatePublish = async () => {
    setShowConfirmPublishModal(false);
    setIsSaving(true);
    try {
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const targetSlug = formData.slug || coupleSlug || 'undangan-baru';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'sunda'] || 'template6';
      const safeDbTemplateId = getSafeDbTemplateId(formData.theme_id);
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      const updatedContent = {
        ...formData,
        status: 'published' as const,
      };

      // 1. Simpan ke invitations dengan status published
      const invPayload = {
        user_id: user?.id || null,
        template_id: safeDbTemplateId,
        slug: targetSlug,
        content: updatedContent,
        theme_config: themeConfig,
        status: 'published',
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: new Date().toISOString(),
      };

      await supabase
        .from('invitations')
        .update(invPayload)
        .eq('slug', targetSlug);

      // 2. Simpan ke user_templates
      if (user?.id) {
        await saveUserTemplate({
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id,
          theme_id: formData.theme_id || 'sunda',
          status: 'published' as const,
          content: updatedContent,
          theme_config: themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: formData.cover_image || formData.couple_photo || null,
        });
      }

      setFormData(updatedContent);
      setPublishedThemeId(formData.theme_id || 'sunda');
      setIsAlreadyPublished(true);
      setIsTemplateChanged(false);
      setLastSaved(new Date());
      setSaveToast({
        show: true,
        message: `Undangan live berhasil diperbarui! Tautan tetap aktif di /${targetSlug}`,
        type: 'success',
        isError: false,
      }, 4000);
    } catch (err: any) {
      console.error('Publish update error:', err);
      setSaveToast({
        show: true,
        message: 'Gagal memperbarui publikasi: ' + (err.message || 'Coba lagi.'),
        isError: true,
      }, 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Handler saat diarahkan ke menu pembayaran (karena perubahan template / publikasi pertama)
  const handleProceedToPayment = () => {
    setShowConfirmPublishModal(false);
    setShowPricingModal(true);
  };

  // 4. Handler Konfirmasi Pembayaran Paket & Menerbitkan Live ke Supabase
  const handleConfirmPublish = async (planId: string) => {
    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'sunda'] || 'template6';
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const targetSlug = formData.slug || coupleSlug || 'undangan-baru';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      const publishedContent = {
        ...formData,
        status: 'published' as const,
        plan: planId,
        is_paid: true,
      };

      // 1. Simpan dan terbitkan ke tabel public.invitations (menggunakan safeDbTemplateId)
      const safeDbTemplateId = getSafeDbTemplateId(formData.theme_id);
      const payload = {
        user_id: user?.id || null,
        template_id: safeDbTemplateId,
        slug: targetSlug,
        content: publishedContent,
        theme_config: themeConfig,
        status: 'published',
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: new Date().toISOString(),
      };

      const { data: updateData, error: updateError } = await supabase
        .from('invitations')
        .update(payload)
        .eq('slug', targetSlug)
        .select();

      if (updateError || !updateData || updateData.length === 0) {
        const { error: upsertError } = await supabase
          .from('invitations')
          .upsert(payload, { onConflict: 'slug' });
        if (upsertError) {
          console.warn('Invitations publish upsert notice:', upsertError.message);
        }
      }

      // 2. Simpan dan perbarui status ke tabel public.user_templates
      if (user?.id) {
        const userTemplatePayload = {
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id,
          theme_id: formData.theme_id || 'sunda',
          status: 'published' as const,
          content: publishedContent,
          theme_config: themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: formData.cover_image || formData.couple_photo || null,
        };

        const res = await saveUserTemplate(userTemplatePayload);
        if (res.success && res.data) {
          setCurrentTemplateRecordId(res.data.id);
          localStorage.setItem('mbell_active_template_id', res.data.id);
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        }
      }

      setFormData(publishedContent);
      setPublishedThemeId(formData.theme_id || 'sunda');
      setIsAlreadyPublished(true);
      setIsTemplateChanged(false);
      setLastSaved(new Date());
      setSaveToast({
        show: true,
        message: 'Undangan berhasil diterbitkan live ke publik!',
        type: 'success',
        isError: false,
      });
    } catch (err: any) {
      console.error('Publish error exception:', err);
      setSaveToast({
        show: true,
        message: 'Gagal menerbitkan undangan: ' + (err.message || 'Silakan coba lagi.'),
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    publishedThemeId,
    isAlreadyPublished,
    isTemplateChanged,
    handleRequestPublish,
    handleConfirmSameTemplatePublish,
    handleProceedToPayment,
    handleConfirmPublish,
  };
}
