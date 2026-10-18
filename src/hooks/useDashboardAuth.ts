import React, { useState, useEffect, useCallback } from 'react';
import { supabase, saveUserTemplate } from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import { THEME_TO_TEMPLATE_ID } from '../pages/dashboard/constants/themeMapping';
import { computeCoupleSlug } from '../pages/dashboard/helpers/computeCoupleSlug';

interface DashboardUser {
  email?: string;
  id?: string;
  avatar_url?: string;
  full_name?: string;
}

interface UseDashboardAuthOptions {
  formData?: InvitationData;
  themeConfig?: ThemeConfig;
  setCurrentTemplateRecordId?: React.Dispatch<React.SetStateAction<string | null>>;
  setSaveToast?: React.Dispatch<React.SetStateAction<{ show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null>>;
}

// Helper ekstraksi profil lengkap user Google / Supabase
export const parseSupabaseUser = (u: any): DashboardUser | null => {
  if (!u) return null;
  const meta = u.user_metadata || {};
  const identityData = u.identities?.[0]?.identity_data || {};
  const avatar =
    meta.avatar_url ||
    meta.picture ||
    identityData.avatar_url ||
    identityData.picture ||
    null;
  const name =
    meta.full_name ||
    meta.name ||
    identityData.full_name ||
    identityData.name ||
    u.email?.split('@')[0] ||
    'Pengguna';
  return {
    email: u.email,
    id: u.id,
    avatar_url: avatar,
    full_name: name,
  };
};

// Helper universal simpan draf lokal
export const preserveDraftToLocalStorage = (formData?: InvitationData, themeConfig?: ThemeConfig) => {
  if (!formData || !themeConfig) return;
  // Jangan simpan jika data masih kosong/default atau merupakan data akun tersimpan
  const isDefaultBlank =
    (!formData.groom?.name || formData.groom.name === 'Mempelai Pria' || formData.groom.name === '') &&
    (!formData.bride?.name || formData.bride.name === 'Mempelai Wanita' || formData.bride.name === '') &&
    (!formData.slug || formData.slug === 'undangan-baru' || formData.slug === '');

  if (isDefaultBlank) return;

  // Jangan simpan sebagai draf tamu jika memiliki id database atau berstatus published dari akun user
  if (formData.id || formData.status === 'published' || formData.slug === 'zaky-bella') {
    return;
  }

  try {
    localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(formData));
    localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(themeConfig));
    localStorage.setItem('mbell_pending_draft_hasUnsavedEdits', 'true');
  } catch (e) {
    console.warn('Gagal menyimpan draf sementara ke localStorage:', e);
  }
};

export function useDashboardAuth(options?: UseDashboardAuthOptions) {
  const {
    formData,
    themeConfig,
    setCurrentTemplateRecordId,
    setSaveToast,
  } = options || {};

  const [user, setUser] = useState<DashboardUser | null>(null);

  // Initial session check
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUser(parseSupabaseUser(data.session.user));
      }
    });
  }, []);

  // Real-time auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? parseSupabaseUser(u) : null);
    });

  return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Auto-persist draf lokal saat user belum login HANYA jika form merupakan draf tamu murni
  useEffect(() => {
    if (!user && formData && themeConfig) {
      if (!formData.id && formData.status !== 'published' && formData.slug !== 'zaky-bella') {
        preserveDraftToLocalStorage(formData, themeConfig);
      }
    }
  }, [formData, themeConfig, user]);

  const handlePreserveDraft = useCallback(() => {
    if (formData && themeConfig) {
      preserveDraftToLocalStorage(formData, themeConfig);
    }
  }, [formData, themeConfig]);

  // Handler saat user berhasil login via modal (Email / Google)
  const handleAuthSuccess = async (loggedInUser: any) => {
    const parsed = parseSupabaseUser(loggedInUser);
    setUser(parsed);

    if (!formData || !themeConfig) return;

    try {
      const saveResult = await saveUserTemplate({
        user_id: loggedInUser.id,
        slug: formData.slug || computeCoupleSlug(formData.groom?.name, formData.bride?.name) || 'undangan-baru',
        title: `${formData.groom?.name || 'Mempelai'} & ${formData.bride?.name || 'Mempelai'}`,
        template_id: THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1',
        theme_id: formData.theme_id || 'modern',
        status: 'draft',
        content: formData,
        theme_config: themeConfig,
        thumbnail_url: formData.cover_image || null,
        music_url: formData.music_url || null,
      });

      if (saveResult.success && saveResult.data && setCurrentTemplateRecordId) {
        setCurrentTemplateRecordId(saveResult.data.id);
        localStorage.setItem('mbell_active_template_id', saveResult.data.id);
      }
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');

      if (setSaveToast) {
        setSaveToast({
          show: true,
          message: 'Berhasil masuk akun',
          type: 'success',
          isError: false,
        });
      }
    } catch (err) {
      console.warn('Auto upsert exception:', err);
    }
  };

  return {
    user,
    setUser,
    preserveDraftToLocalStorage: handlePreserveDraft,
    handleAuthSuccess,
  };
}

export type { DashboardUser };
