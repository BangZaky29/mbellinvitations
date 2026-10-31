import React, { useState, useEffect } from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import { sanitizeAndUploadBase64InFormData, purgeOrphanedImages } from '../lib/supabase/storageService';
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
import {
  getCanonicalPublishedSlug,
  generateUniqueSlug,
} from '../pages/dashboard/helpers/computeCoupleSlug';

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

          if (isMounted && utRecord && utRecord.status === 'published') {
            const liveTheme =
              utRecord.theme_id ||
              utRecord.content?.theme_id ||
              (utRecord.template_id ? TEMPLATE_ID_TO_THEME[utRecord.template_id] : null) ||
              utRecord.content?.paid_template_id;
            if (liveTheme) {
              setEffectivePublishedThemeId(liveTheme);
              return;
            }
          }
        }

        // 2. Cek apakah ada record berstatus published milik user ini di user_templates
        if (activeUserId) {
          const { data: utPublished } = await supabase
            .from('user_templates')
            .select('id, user_id, status, template_id, theme_id, slug, content')
            .eq('user_id', activeUserId)
            .eq('status', 'published')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (isMounted && utPublished) {
            const liveTheme =
              utPublished.theme_id ||
              utPublished.content?.theme_id ||
              (utPublished.template_id ? TEMPLATE_ID_TO_THEME[utPublished.template_id] : null) ||
              utPublished.content?.paid_template_id;
            if (liveTheme) {
              setEffectivePublishedThemeId(liveTheme);
              return;
            }
          }

          // 3. Cek di tabel invitations milik user aktif ini
          const { data: invRow } = await supabase
            .from('invitations')
            .select('id, user_id, status, template_id, content')
            .eq('user_id', activeUserId)
            .eq('status', 'published')
            .order('updated_at', { ascending: false })
            .limit(1)
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

        // 4. Fallback: jika formData statusnya published
        if (formData.status === 'published') {
          const fallbackTheme =
            formData.paid_template_id ||
            formData.theme_id ||
            (Array.isArray(formData.unlocked_templates) && formData.unlocked_templates[0]);
          if (isMounted && fallbackTheme) {
            setEffectivePublishedThemeId(fallbackTheme);
          }
          return;
        }

        if (isMounted && !effectivePublishedThemeId) {
          setEffectivePublishedThemeId(null);
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

    const targetSlug = getCanonicalPublishedSlug(formData.slug, formData.groom?.name, formData.bride?.name);

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
    const rawSlug = getCanonicalPublishedSlug(formData.slug, formData.groom?.name, formData.bride?.name);

    // 🔒 Slug Collision Prevention: Pastikan slug unik sebelum publish
    const { slug: targetSlug, wasSuffixed } = await generateUniqueSlug(
      rawSlug,
      user?.id,
      currentTemplateRecordId
    );

    // Sinkronisasi slug baru ke formData jika ada suffix
    if (wasSuffixed) {
      setFormData((prev) => ({ ...prev, slug: targetSlug }));
    }

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

    // FIREWALL BASE64: Pastikan aset gambar bersih dari Base64 sebelum dipublikasikan
    let cleanFormData = formData;
    if (user?.id) {
      cleanFormData = await sanitizeAndUploadBase64InFormData(formData, user.id, user.email, targetSlug);
      if (JSON.stringify(cleanFormData) !== JSON.stringify(formData)) {
        setFormData(cleanFormData);
      }
    }

    const resolvedGalleryStyle = cleanFormData.gallery_style || themeConfig.gallery_style || 'bento-grid';

    const updatedContent: InvitationData = {
      ...cleanFormData,
      gallery_style: resolvedGalleryStyle,
      slug: targetSlug,
      status: 'published' as const,
      theme_id: currentThemeId as any,
      is_paid: true,
      paid_template_id: safeDbTemplateId,
      unlocked_templates: updatedUnlockedTemplates,
      music_url: resolvedMusicUrl,
    };

    const updatedThemeConfig: ThemeConfig = {
      ...themeConfig,
      gallery_style: resolvedGalleryStyle,
      music_url: resolvedMusicUrl,
    };

    // 1. Simpan ke invitations dengan status published secara aman tanpa error 409
    const invPayload = {
      user_id: user?.id || null,
      template_id: safeDbTemplateId,
      slug: targetSlug,
      content: updatedContent,
      theme_config: updatedThemeConfig,
      status: 'published',
      is_paid: true,
      paid_template_id: safeDbTemplateId,
      unlocked_templates: updatedUnlockedTemplates,
      music_url: resolvedMusicUrl,
      music_type: resolvedMusicType,
      updated_at: new Date().toISOString(),
    };

    const { data: existingInv } = await supabase
      .from('invitations')
      .select('id, content')
      .eq('slug', targetSlug)
      .maybeSingle();

    const previousDbFormData = existingInv?.content as InvitationData | undefined;

    if (existingInv?.id) {
      await supabase
        .from('invitations')
        .update(invPayload)
        .eq('id', existingInv.id);
    } else {
      await supabase
        .from('invitations')
        .insert(invPayload);
    }

    // Bersihkan row slug draf lama di tabel invitations jika berbeda dari targetSlug
    if (formData.slug && formData.slug !== targetSlug && formData.slug.includes('-draf')) {
      try {
        await supabase
          .from('invitations')
          .delete()
          .eq('slug', formData.slug);
      } catch (cleanupErr) {
        console.warn('Cleanup draft slug row warning:', cleanupErr);
      }
    }

    // 2. Simpan ke user_templates
    if (user?.id) {
      const res = await saveUserTemplate({
        id: currentTemplateRecordId || undefined,
        user_id: user.id,
        title: coupleTitle,
        slug: targetSlug,
        template_id: safeDbTemplateId,
        theme_id: currentThemeId,
        status: 'published' as const,
        is_paid: true,
        paid_template_id: safeDbTemplateId,
        unlocked_templates: updatedUnlockedTemplates,
        content: updatedContent,
        theme_config: updatedThemeConfig,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        thumbnail_url: cleanFormData.cover_image || cleanFormData.couple_photo || null,
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
        themeConfig: updatedThemeConfig,
      }));
    } catch (e) { }
    setLastSaved(new Date());

    // Garbage Collector (Staging -> Commit): Bersihkan berkas gambar yatim di storage Supabase secara aman
    if (previousDbFormData) {
      purgeOrphanedImages(previousDbFormData, updatedContent).catch((gcErr) =>
        console.warn('[StorageService] Garbage collection warning in publish:', gcErr)
      );
    }

    // PENTING: Dispatch event agar useDashboardSave mereset baseline & menghapus counter (+2)
    window.dispatchEvent(
      new CustomEvent('mbell_template_loaded', {
        detail: {
          formData: updatedContent,
          themeConfig: updatedThemeConfig,
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent('mbell_published_updated', {
        detail: {
          formData: updatedContent,
          themeConfig: updatedThemeConfig,
        },
      })
    );

    setSaveToast({
      show: true,
      message: wasSuffixed
        ? `Undangan live aktif di /${targetSlug} (slug disesuaikan otomatis karena slug asli sudah digunakan)`
        : `Undangan live berhasil diperbarui! Tautan tetap aktif di /${targetSlug}`,
      type: wasSuffixed ? 'info' : 'success',
      isError: false,
    }, wasSuffixed ? 6000 : 4000);
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
    const rawSlug = getCanonicalPublishedSlug(formData.slug, formData.groom?.name, formData.bride?.name);

    // 🔒 Slug Collision Prevention
    const { slug: targetSlug, wasSuffixed } = await generateUniqueSlug(
      rawSlug,
      user?.id,
      currentTemplateRecordId
    );

    if (wasSuffixed) {
      setFormData((prev) => ({ ...prev, slug: targetSlug }));
    }

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

    // FIREWALL BASE64: Pastikan form data bersih dari Base64 sebelum dipublikasikan
    let cleanFormData = formData;
    if (user?.id) {
      cleanFormData = await sanitizeAndUploadBase64InFormData(formData, user.id, user.email, targetSlug);
      if (JSON.stringify(cleanFormData) !== JSON.stringify(formData)) {
        setFormData(cleanFormData);
      }
    }

    const resolvedGalleryStyle = cleanFormData.gallery_style || themeConfig.gallery_style || 'bento-grid';

    const publishedContent = {
      ...cleanFormData,
      gallery_style: resolvedGalleryStyle,
      slug: targetSlug,
      theme_id: activeThemeId,
      status: 'published' as const,
      is_paid: true,
      paid_template_id: safeDbTemplateId,
      unlocked_templates: updatedUnlockedTemplates,
      paid_at: nowIso,
      payment_method: selectedMethod,
      amount_paid: paidAmount,
      music_url: resolvedMusicUrl,
    };

    const updatedThemeConfig: ThemeConfig = {
      ...themeConfig,
      gallery_style: resolvedGalleryStyle,
      music_url: resolvedMusicUrl,
    };

    // 1. Simpan dan terbitkan ke tabel public.invitations (menggunakan safeDbTemplateId)
    const payload = {
      user_id: user?.id || null,
      template_id: safeDbTemplateId,
      slug: targetSlug,
      content: publishedContent,
      theme_config: updatedThemeConfig,
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

    const { data: existingInv } = await supabase
      .from('invitations')
      .select('id, content')
      .eq('slug', targetSlug)
      .maybeSingle();

    const previousDbFormData = existingInv?.content as InvitationData | undefined;

    if (existingInv?.id) {
      await supabase
        .from('invitations')
        .update(payload)
        .eq('id', existingInv.id);
    } else {
      await supabase
        .from('invitations')
        .insert(payload);
    }

    // Bersihkan row slug draf lama di tabel invitations jika berbeda dari targetSlug
    if (formData.slug && formData.slug !== targetSlug && formData.slug.includes('-draf')) {
      try {
        await supabase
          .from('invitations')
          .delete()
          .eq('slug', formData.slug);
      } catch (cleanupErr) {
        console.warn('Cleanup draft slug row warning:', cleanupErr);
      }
    }

    // 2. Simpan dan perbarui status ke tabel public.user_templates
    if (user?.id) {
      const userTemplatePayload = {
        id: currentTemplateRecordId || undefined,
        user_id: user.id,
        title: coupleTitle,
        slug: targetSlug,
        template_id: safeDbTemplateId,
        theme_id: activeThemeId,
        status: 'published' as const,
        is_paid: true,
        paid_template_id: safeDbTemplateId,
        unlocked_templates: updatedUnlockedTemplates,
        paid_at: nowIso,
        payment_method: selectedMethod,
        amount_paid: paidAmount,
        content: publishedContent,
        theme_config: updatedThemeConfig,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        thumbnail_url: cleanFormData.cover_image || cleanFormData.couple_photo || null,
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
        themeConfig: updatedThemeConfig,
      }));
    } catch (e) { }
    setLastSaved(new Date());

    // Garbage Collector (Staging -> Commit): Bersihkan berkas gambar yatim di storage Supabase secara aman
    if (previousDbFormData) {
      purgeOrphanedImages(previousDbFormData, publishedContent).catch((gcErr) =>
        console.warn('[StorageService] Garbage collection warning in pay publish:', gcErr)
      );
    }

    // PENTING: Dispatch event agar useDashboardSave mereset baseline & menghapus counter (+2)
    window.dispatchEvent(
      new CustomEvent('mbell_template_loaded', {
        detail: {
          formData: publishedContent,
          themeConfig: updatedThemeConfig,
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent('mbell_published_updated', {
        detail: {
          formData: publishedContent,
          themeConfig: updatedThemeConfig,
        },
      })
    );
    setSaveToast({
      show: true,
      message: wasSuffixed
        ? `Undangan live aktif di /${targetSlug}! (slug disesuaikan otomatis)`
        : 'Pembayaran berhasil diverifikasi! Undangan Anda resmi live & aktif selamanya.',
      type: wasSuffixed ? 'info' : 'success',
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
