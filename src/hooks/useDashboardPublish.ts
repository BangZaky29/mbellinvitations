import React, { useState, useEffect } from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import { extractYouTubeId } from './useAudioPlayer';
import {
  THEME_TO_TEMPLATE_ID,
  TEMPLATE_ID_TO_THEME,
  getSafeDbTemplateId,
  isTemplateUnlocked,
  getTemplatePriceInfo,
} from '../pages/dashboard/constants/themeMapping';
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
  publishedThemeId?: string | null;
  setPublishedThemeId?: React.Dispatch<React.SetStateAction<string | null>>;
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
  publishedThemeId,
  setPublishedThemeId,
}: UseDashboardPublishOptions) {
  const [localPublishedThemeId, setLocalPublishedThemeId] = useState<string | null>(null);
  const effectivePublishedThemeId = publishedThemeId !== undefined ? publishedThemeId : localPublishedThemeId;
  const setEffectivePublishedThemeId = setPublishedThemeId || setLocalPublishedThemeId;

  // Deteksi kepemilikan template per-desain undangan:
  // 1x beli berlaku untuk 1x desain undangan.
  const isUnlocked = isTemplateUnlocked(
    formData.theme_id || 'modern',
    formData.unlocked_templates,
    formData.paid_template_id,
    formData.is_paid
  );

  // Deteksi reaktif:
  // 1. isAlreadyPublished: Undangan berstatus published dan memiliki tema yang telah terbit.
  // 2. isTemplateChanged: Undangan sudah terbit tapi tema saat ini berbeda dari tema terbit di database.
  const isAlreadyPublished = Boolean(
    effectivePublishedThemeId && formData.status === 'published'
  );
  const currentTheme = formData.theme_id || 'modern';
  const isTemplateChanged = Boolean(
    isAlreadyPublished && effectivePublishedThemeId && effectivePublishedThemeId !== currentTheme
  );

  // Otomatis sinkronisasi tema terbit dari Supabase berdasarkan data asli user_id dan id template per user id
  useEffect(() => {
    let isMounted = true;
    async function resolveLiveTheme() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const activeUserId = sessionData?.session?.user?.id || user?.id;

        // 1. Prioritaskan pengecekan data asli record template spesifik milik user ini di public.user_templates
        if (activeUserId && currentTemplateRecordId) {
          const { data: utRecord } = await supabase
            .from('user_templates')
            .select('id, user_id, status, template_id, theme_id, slug, content')
            .eq('id', currentTemplateRecordId)
            .eq('user_id', activeUserId)
            .maybeSingle();

          if (isMounted && utRecord) {
            if (utRecord.status === 'published') {
              const liveTheme =
                utRecord.theme_id ||
                utRecord.content?.theme_id ||
                (utRecord.template_id ? TEMPLATE_ID_TO_THEME[utRecord.template_id] : null) ||
                utRecord.content?.paid_template_id;
              if (liveTheme) {
                setEffectivePublishedThemeId(liveTheme);
                return;
              }
            } else {
              // Jika record spesifik ini berstatus draf di database, tema ini belum live
              setEffectivePublishedThemeId(null);
              return;
            }
          }
        }

        // 2. Jika currentTemplateRecordId belum ada atau baru, cek record published milik user ini berdasarkan slug aktif
        const targetSlug = formData.slug || computeCoupleSlug(formData.groom?.name, formData.bride?.name);
        if (activeUserId && targetSlug) {
          const { data: utBySlug } = await supabase
            .from('user_templates')
            .select('id, user_id, status, template_id, theme_id, slug, content')
            .eq('user_id', activeUserId)
            .eq('slug', targetSlug)
            .eq('status', 'published')
            .maybeSingle();

          if (isMounted && utBySlug) {
            const liveTheme =
              utBySlug.theme_id ||
              utBySlug.content?.theme_id ||
              (utBySlug.template_id ? TEMPLATE_ID_TO_THEME[utBySlug.template_id] : null) ||
              utBySlug.content?.paid_template_id;
            if (liveTheme) {
              setEffectivePublishedThemeId(liveTheme);
              return;
            }
          }

          // Cek juga di tabel invitations milik user aktif ini
          const { data: invRow } = await supabase
            .from('invitations')
            .select('id, user_id, status, template_id, content')
            .eq('user_id', activeUserId)
            .eq('slug', targetSlug)
            .eq('status', 'published')
            .maybeSingle();

          if (isMounted && invRow) {
            const liveTheme =
              invRow.content?.theme_id ||
              (invRow.template_id ? TEMPLATE_ID_TO_THEME[invRow.template_id] : null) ||
              invRow.content?.paid_template_id;
            if (liveTheme) {
              setEffectivePublishedThemeId(liveTheme);
              return;
            }
          }
        }

        // 3. Fallback: jika formData statusnya published
        if (formData.status === 'published') {
          const fallbackTheme =
            formData.paid_template_id ||
            formData.theme_id ||
            (Array.isArray(formData.unlocked_templates) && formData.unlocked_templates[0]);
          if (isMounted) {
            setEffectivePublishedThemeId(fallbackTheme || null);
          }
        } else {
          if (isMounted) {
            setEffectivePublishedThemeId(null);
          }
        }
      } catch (e) {
        console.warn('Initial live theme fetch warning:', e);
      }
    }

    resolveLiveTheme();
  }, [user?.id, currentTemplateRecordId, formData.slug, formData.status, formData.paid_template_id]);

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

      // Cek record yang tersimpan saat ini di Supabase untuk user dan slug ini
      let invQuery = supabase
        .from('invitations')
        .select('status, template_id, content')
        .eq('slug', targetSlug);

      if (currentUser?.id) {
        invQuery = invQuery.eq('user_id', currentUser.id);
      }
      const { data: invRow } = await invQuery.maybeSingle();

      const isLive = invRow?.status === 'published' || formData.status === 'published';
      const existingTheme = invRow?.content?.theme_id || (invRow?.template_id ? TEMPLATE_ID_TO_THEME[invRow.template_id] : null) || effectivePublishedThemeId;

      if (isLive && existingTheme) {
        setEffectivePublishedThemeId(existingTheme);
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

      const currentThemeId = formData.theme_id || 'modern';
      const rawUnlockedList = [
        ...(formData.unlocked_templates || []),
        currentThemeId,
        template_id,
        safeDbTemplateId,
      ].filter(Boolean);
      const updatedUnlockedTemplates = Array.from(
        new Set(rawUnlockedList.map((id) => TEMPLATE_ID_TO_THEME[id] || id))
      );

      const updatedContent: InvitationData = {
        ...formData,
        status: 'published' as const,
        theme_id: currentThemeId as any,
        is_paid: true,
        paid_template_id: safeDbTemplateId,
        unlocked_templates: updatedUnlockedTemplates,
      };

      // 1. Simpan ke invitations dengan status published
      const invPayload = {
        user_id: user?.id || null,
        template_id: safeDbTemplateId,
        slug: targetSlug,
        content: updatedContent,
        theme_config: themeConfig,
        status: 'published',
        is_paid: true,
        paid_template_id: safeDbTemplateId,
        unlocked_templates: updatedUnlockedTemplates,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: new Date().toISOString(),
      };

      const { data: updateData, error: updateError } = await supabase
        .from('invitations')
        .update(invPayload)
        .eq('slug', targetSlug)
        .select();

      if (updateError || !updateData || updateData.length === 0) {
        await supabase
          .from('invitations')
          .upsert(invPayload, { onConflict: 'slug' });
      }

      // 2. Simpan ke user_templates
      if (user?.id) {
        const res = await saveUserTemplate({
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: coupleTitle,
          slug: targetSlug,
          template_id,
          theme_id: currentThemeId,
          status: 'published' as const,
          is_paid: true,
          paid_template_id: safeDbTemplateId,
          unlocked_templates: updatedUnlockedTemplates,
          content: updatedContent,
          theme_config: themeConfig,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          thumbnail_url: formData.cover_image || formData.couple_photo || null,
        });
        if (res.success && res.data) {
          setCurrentTemplateRecordId(res.data.id);
          localStorage.setItem('mbell_active_template_id', res.data.id);
          window.dispatchEvent(new CustomEvent('mbell_templates_updated'));
        }
      }

      setFormData(updatedContent);
      setEffectivePublishedThemeId(currentThemeId);
      try {
        localStorage.setItem(`mbell_cached_inv_${targetSlug}`, JSON.stringify({
          templateId: template_id,
          invitationData: updatedContent,
          themeConfig,
        }));
      } catch (e) {}
      setLastSaved(new Date());

      // PENTING: Dispatch event agar useDashboardSave mereset baseline & menghapus counter (+2)
      window.dispatchEvent(
        new CustomEvent('mbell_template_loaded', {
          detail: {
            formData: updatedContent,
            themeConfig,
          },
        })
      );

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

  // 4. Handler Konfirmasi Pembayaran Template & Menerbitkan Live ke Supabase (Pay-Per-Template)
  const handleConfirmPublish = async (paymentDetails?: { themeId?: string; paymentMethod?: string; amount?: number } | string) => {
    setIsSaving(true);
    try {
      const activeThemeId = (typeof paymentDetails === 'object' && paymentDetails?.themeId)
        ? paymentDetails.themeId
        : (formData.theme_id || 'modern');
      const selectedMethod = (typeof paymentDetails === 'object' && paymentDetails?.paymentMethod)
        ? paymentDetails.paymentMethod
        : 'qris';
      const priceInfo = getTemplatePriceInfo(activeThemeId);
      const paidAmount = (typeof paymentDetails === 'object' && paymentDetails?.amount)
        ? paymentDetails.amount
        : priceInfo.price;

      const template_id = THEME_TO_TEMPLATE_ID[activeThemeId] || 'template1';
      const safeDbTemplateId = getSafeDbTemplateId(activeThemeId);
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const targetSlug = formData.slug || coupleSlug || 'undangan-baru';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      // Akumulasikan template yang telah di-unlock pada desain undangan ini secara kanonikal
      const rawUnlockedList = [
        ...(formData.unlocked_templates || []),
        activeThemeId,
        template_id,
        safeDbTemplateId,
      ].filter(Boolean);
      const updatedUnlockedTemplates = Array.from(
        new Set(rawUnlockedList.map((id) => TEMPLATE_ID_TO_THEME[id] || id))
      );

      const nowIso = new Date().toISOString();

      const publishedContent = {
        ...formData,
        theme_id: activeThemeId,
        status: 'published' as const,
        is_paid: true,
        paid_template_id: safeDbTemplateId,
        unlocked_templates: updatedUnlockedTemplates,
        paid_at: nowIso,
        payment_method: selectedMethod,
        amount_paid: paidAmount,
      };

      // 1. Simpan dan terbitkan ke tabel public.invitations (menggunakan safeDbTemplateId)
      const payload = {
        user_id: user?.id || null,
        template_id: safeDbTemplateId,
        slug: targetSlug,
        content: publishedContent,
        theme_config: themeConfig,
        status: 'published',
        is_paid: true,
        paid_template_id: safeDbTemplateId,
        unlocked_templates: updatedUnlockedTemplates,
        paid_at: nowIso,
        payment_method: selectedMethod,
        amount_paid: paidAmount,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: nowIso,
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
          theme_id: activeThemeId,
          status: 'published' as const,
          is_paid: true,
          paid_template_id: safeDbTemplateId,
          unlocked_templates: updatedUnlockedTemplates,
          paid_at: nowIso,
          payment_method: selectedMethod,
          amount_paid: paidAmount,
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
      setEffectivePublishedThemeId(activeThemeId);
      try {
        localStorage.setItem(`mbell_cached_inv_${targetSlug}`, JSON.stringify({
          templateId: template_id,
          invitationData: publishedContent,
          themeConfig,
        }));
      } catch (e) {}
      setLastSaved(new Date());

      // PENTING: Dispatch event agar useDashboardSave mereset baseline & menghapus counter (+2)
      window.dispatchEvent(
        new CustomEvent('mbell_template_loaded', {
          detail: {
            formData: publishedContent,
            themeConfig,
          },
        })
      );
      setSaveToast({
        show: true,
        message: 'Pembayaran berhasil diverifikasi! Undangan Anda resmi live & aktif selamanya.',
        type: 'success',
        isError: false,
      }, 5000);
    } catch (err: any) {
      console.error('Publish error exception:', err);
      setSaveToast({
        show: true,
        message: 'Gagal menerbitkan undangan: ' + (err.message || 'Silakan coba lagi.'),
        isError: true,
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    publishedThemeId: effectivePublishedThemeId,
    isAlreadyPublished,
    isTemplateChanged,
    isUnlocked,
    handleRequestPublish,
    handleConfirmSameTemplatePublish,
    handleProceedToPayment,
    handleConfirmPublish,
  };
}
