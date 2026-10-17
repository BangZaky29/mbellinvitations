import React from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import { extractYouTubeId } from './useAudioPlayer';
import { THEME_TO_TEMPLATE_ID, getSafeDbTemplateId } from '../pages/dashboard/constants/themeMapping';
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
  handleManualSave,
}: UseDashboardPublishOptions) {
  // Handler Meminta Terbitkan: Cek Status Autentikasi User Terlebih Dahulu
  // - Jika BELUM login/register: Langsung tampilkan pop-up AuthGateModal (Login/Register Google 1-Klik)
  //   karena data & URL live tidak dapat terhubung dan tersimpan tanpa akun user_id yang valid.
  // - Jika SUDAH login: Tampilkan pop-up konfirmasi simpan & terbitkan.
  const handleRequestPublish = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user || (user?.id ? user : null);

      if (!currentUser || !currentUser.id) {
        // User belum terautentikasi -> Langsung tampilkan Pop-up Login / Register
        setShowAuthGateModal(true);
        return;
      }

      // User sudah terautentikasi -> Tampilkan Pop-up Konfirmasi Yakin Simpan / Kembali
      setShowConfirmPublishModal(true);
    } catch (err) {
      console.warn('Auth check error:', err);
      setShowAuthGateModal(true);
    }
  };

  // Handler Konfirmasi Simpan & Terbitkan: Simpan seluruh perubahan ke Supabase, lalu jalankan alur penerbitan
  const handleConfirmSaveAndPublish = async () => {
    setShowConfirmPublishModal(false);
    await handleManualSave();
    await handlePublish();
  };

  // Handler Publish: Cek Auth -> Jika belum login munculkan AuthGateModal, jika sudah munculkan PricingPaywallModal
  const handlePublish = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (!currentUser) {
        // User belum terautentikasi -> Tampilkan Popup "Login / Register Dulu"
        setShowAuthGateModal(true);
        return;
      }

      // User sudah login -> Tampilkan Modal Menu Harga / Paywall
      setShowPricingModal(true);
    } catch (err) {
      console.warn('Auth check notice:', err);
      setShowAuthGateModal(true);
    }
  };

  // Handler Konfirmasi Pembayaran Paket & Menerbitkan Live ke Supabase
  const handleConfirmPublish = async (planId: string) => {
    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
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

      // 1. Simpan dan terbitkan ke tabel public.invitations (menggunakan safeDbTemplateId untuk mencegah 409 FK violation)
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
          theme_id: formData.theme_id || 'modern',
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
        }
      }

      setFormData(publishedContent);
      setLastSaved(new Date());
      setSaveToast({
        show: true,
        message: 'Undangan berhasil diterbitkan live ke publik!',
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
    handleRequestPublish,
    handleConfirmSaveAndPublish,
    handlePublish,
    handleConfirmPublish,
  };
}
