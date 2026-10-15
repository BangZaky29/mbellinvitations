import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, saveUserTemplate, type UserTemplateRecord } from '../../lib/supabaseClient';
import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';
import {
  MOCK_MODERN_DATA,
  MOCK_MODERN_THEME,
  MOCK_RUSTIC_THEME,
  MOCK_JAWA_THEME,
  MOCK_ISLAMI_THEME,
  MOCK_LUXURY_THEME,
  MOCK_MODERN_WISHES,
  MOCK_THEME_DATA_MAP,
  MOCK_THEME_CONFIG_MAP,
  MOCK_THEME_WISHES_MAP,
} from '../../data/mockInvitation';

// Dashboard Components
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardSidebar, type DashboardTab } from '../../components/dashboard/DashboardSidebar';
import { StepSelectorNav } from '../../components/dashboard/StepSelectorNav';
import { ThemePickerCard } from '../../components/dashboard/ThemePickerCard';
import { CoupleFormCard } from '../../components/dashboard/CoupleFormCard';
import { EventsFormCard } from '../../components/dashboard/EventsFormCard';
import { GiftsStoryFormCard } from '../../components/dashboard/GiftsStoryFormCard';
import { extractYouTubeId } from '../../hooks/useAudioPlayer';
import { PhoneMockupPreview } from '../../components/dashboard/PhoneMockupPreview';
import { AuthGateModal } from '../../components/dashboard/AuthGateModal';
import { PricingPaywallModal } from '../../components/dashboard/PricingPaywallModal';
import { MyTemplatesPanel } from '../../components/dashboard/MyTemplatesPanel';
import { GuestListPanel } from '../../components/dashboard/GuestListPanel';
import { WishesListPanel } from '../../components/dashboard/WishesListPanel';
import { SettingsAccountPanel } from '../../components/dashboard/SettingsAccountPanel';
import { OpeningSplashScreen } from '../../components/common/OpeningSplashScreen';

// Template ID Normalization (PostgreSQL FK constraint to public.templates)
const THEME_TO_TEMPLATE_ID: Record<string, string> = {
  modern: 'template1',
  rustic: 'template2',
  jawa: 'template3',
  islami: 'template4',
  luxury: 'template5',
  template1: 'template1',
  template2: 'template2',
  template3: 'template3',
  template4: 'template4',
  template5: 'template5',
};

const TEMPLATE_ID_TO_THEME: Record<string, string> = {
  template1: 'modern',
  template2: 'rustic',
  template3: 'jawa',
  template4: 'islami',
  template5: 'luxury',
  modern: 'modern',
  rustic: 'rustic',
  jawa: 'jawa',
  islami: 'islami',
  luxury: 'luxury',
};

const DEFAULT_THEME_CONFIGS: Record<string, ThemeConfig> = {
  modern: MOCK_MODERN_THEME,
  template1: MOCK_MODERN_THEME,
  rustic: MOCK_RUSTIC_THEME,
  template2: MOCK_RUSTIC_THEME,
  jawa: MOCK_JAWA_THEME,
  template3: MOCK_JAWA_THEME,
  islami: MOCK_ISLAMI_THEME,
  template4: MOCK_ISLAMI_THEME,
  luxury: MOCK_LUXURY_THEME,
  template5: MOCK_LUXURY_THEME,
};

// 🌟 HELPER UNIVERSAL: Hitung slug bersih otomatis dari nama panggilan kedua mempelai
export const computeCoupleSlug = (groomName?: string, brideName?: string): string => {
  const cleanG = (groomName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const cleanB = (brideName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  if (cleanG && cleanB) {
    return `${cleanG}-${cleanB}`;
  }
  if (cleanG) return cleanG;
  if (cleanB) return cleanB;
  return 'raditya-jessica';
};

export const DashboardEditorPage: React.FC = () => {
  // User Auth State
  const [user, setUser] = useState<{
    email?: string;
    id?: string;
    avatar_url?: string;
    full_name?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Invitation Form Data State
  const [formData, setFormData] = useState<InvitationData>(MOCK_MODERN_DATA);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(MOCK_MODERN_THEME);
  const [wishes] = useState<WishItem[]>(MOCK_MODERN_WISHES);
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  // Editor UI State
  const [activeTab, setActiveTab] = useState<DashboardTab>('edit-undangan');
  const [currentTemplateRecordId, setCurrentTemplateRecordId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; isError?: boolean } | null>(null);
  const [showOpeningSplash, setShowOpeningSplash] = useState(true);

  // 🌟 FASE 3.3: SEAMLESS DRAFT PRESERVATION HELPER
  const preserveDraftToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(formData));
      localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(themeConfig));
      localStorage.setItem('mbell_pending_draft_hasUnsavedEdits', 'true');
    } catch (e) {
      console.warn('Gagal menyimpan draf sementara ke localStorage:', e);
    }
  }, [formData, themeConfig]);

  // Auto-persist draf lokal saat user belum login
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(formData));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(themeConfig));
        localStorage.setItem('mbell_pending_draft_hasUnsavedEdits', 'true');
      } catch (e) { }
    }
  }, [formData, themeConfig, user]);

  // Helper ekstraksi profil lengkap user Google / Supabase
  const parseSupabaseUser = (u: any) => {
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

  // Handler saat user berhasil login via modal (Email / Google)
  const handleAuthSuccess = async (loggedInUser: any) => {
    const parsed = parseSupabaseUser(loggedInUser);
    setUser(parsed);

    try {
      const saveResult = await saveUserTemplate({
        user_id: loggedInUser.id,
        slug: formData.slug || 'raditya-jessica',
        title: `${formData.groom?.name || 'Mempelai'} & ${formData.bride?.name || 'Mempelai'}`,
        template_id: THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1',
        theme_id: formData.theme_id || 'modern',
        status: 'draft',
        content: formData,
        theme_config: themeConfig,
        thumbnail_url: formData.cover_image || null,
        music_url: formData.music_url || null,
      });

      if (saveResult.success && saveResult.data) {
        setCurrentTemplateRecordId(saveResult.data.id);
        localStorage.setItem('mbell_active_template_id', saveResult.data.id);
      }
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');

      setSaveToast({
        show: true,
        message: `Selamat datang, ${parsed?.full_name || loggedInUser.email}! Draf undangan Anda telah otomatis tersimpan aman.`,
        isError: false,
      });
    } catch (err) {
      console.warn('Auto upsert exception:', err);
    }
  };

  // Listener Real-time status autentikasi Google Supabase
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) {
        setUser(parseSupabaseUser(u));
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 1. Initial Load: Auth check and fetch invitation from Supabase
  useEffect(() => {
    async function initDashboard() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || null;
        if (currentUser) {
          setUser(parseSupabaseUser(currentUser));

          // 🌟 FITUR 3.3: SEAMLESS DRAFT PRESERVATION (AUTO-RESTORE & AUTO-UPSERT SETELAH LOGIN)
          const hasUnsavedDraft = localStorage.getItem('mbell_pending_draft_hasUnsavedEdits') === 'true';
          const savedDraftFormDataStr = localStorage.getItem('mbell_pending_draft_formData');
          const savedDraftThemeConfigStr = localStorage.getItem('mbell_pending_draft_themeConfig');

          if (hasUnsavedDraft && savedDraftFormDataStr) {
            try {
              const pendingFormData: InvitationData = JSON.parse(savedDraftFormDataStr);
              const pendingThemeConfig: ThemeConfig = savedDraftThemeConfigStr
                ? JSON.parse(savedDraftThemeConfigStr)
                : themeConfig;

              setFormData(pendingFormData);
              if (pendingThemeConfig) setThemeConfig(pendingThemeConfig);

              // Auto-upsert ke Supabase di bawah currentUser.id
              const saveResult = await saveUserTemplate({
                user_id: currentUser.id,
                slug: pendingFormData.slug || 'raditya-jessica',
                title: `${pendingFormData.groom?.name || 'Mempelai'} & ${pendingFormData.bride?.name || 'Mempelai'}`,
                template_id: THEME_TO_TEMPLATE_ID[pendingFormData.theme_id || 'modern'] || 'template1',
                theme_id: pendingFormData.theme_id || 'modern',
                status: 'draft',
                content: pendingFormData,
                theme_config: pendingThemeConfig,
                thumbnail_url: pendingFormData.cover_image || null,
                music_url: pendingFormData.music_url || null,
              });

              if (saveResult.success && saveResult.data) {
                setCurrentTemplateRecordId(saveResult.data.id);
                localStorage.setItem('mbell_active_template_id', saveResult.data.id);
              }

              localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');

              setSaveToast({
                show: true,
                message: `Selamat datang, ${currentUser.user_metadata?.full_name || currentUser.email}! Draf yang Anda ketik telah otomatis tersimpan aman ke akun Anda.`,
                isError: false,
              });
              setLoading(false);
              return;
            } catch (err) {
              console.warn('Gagal memproses draf pending setelah login:', err);
            }
          }

          // Cek apakah ada template tersimpan di user_templates milik user ini
          const savedActiveId = localStorage.getItem('mbell_active_template_id');
          let userTemplateQuery = supabase
            .from('user_templates')
            .select('*')
            .eq('user_id', currentUser.id);

          if (savedActiveId) {
            userTemplateQuery = userTemplateQuery.eq('id', savedActiveId);
          } else {
            userTemplateQuery = userTemplateQuery.order('updated_at', { ascending: false }).limit(1);
          }

          const { data: userTemplateData } = await userTemplateQuery.maybeSingle();
          if (userTemplateData) {
            setCurrentTemplateRecordId(userTemplateData.id);
            if (userTemplateData.content && typeof userTemplateData.content === 'object') {
              const loadedContent = userTemplateData.content;
              const gName = (loadedContent.groom?.name || '').trim();
              const bName = (loadedContent.bride?.name || '').trim();
              const coupleSlug = computeCoupleSlug(gName, bName);

              let effectiveSlug = userTemplateData.slug || loadedContent.slug || 'raditya-jessica';
              if (
                (effectiveSlug === 'raditya-jessica' || !effectiveSlug) &&
                coupleSlug !== 'raditya-jessica'
              ) {
                effectiveSlug = coupleSlug;
                // Sinkronkan perbaikan slug otomatis ini langsung ke Supabase
                (async () => {
                  try {
                    await saveUserTemplate({
                      id: userTemplateData.id,
                      user_id: currentUser.id,
                      slug: coupleSlug,
                      content: { ...loadedContent, slug: coupleSlug },
                    });

                    const { error: syncInvError } = await supabase.from('invitations').upsert({
                      user_id: currentUser.id,
                      template_id: THEME_TO_TEMPLATE_ID[userTemplateData.theme_id || loadedContent.theme_id || 'modern'] || 'template1',
                      slug: coupleSlug,
                      content: { ...loadedContent, slug: coupleSlug },
                      theme_config: userTemplateData.theme_config || themeConfig,
                      status: userTemplateData.status || 'draft',
                      updated_at: new Date().toISOString(),
                    }, { onConflict: 'slug' });

                    if (syncInvError) {
                      console.warn('Sync invitations notice:', syncInvError.message);
                    }
                  } catch (syncErr) {
                    console.warn('Sync slug error:', syncErr);
                  }
                })();
              }

              setFormData({
                ...MOCK_MODERN_DATA,
                ...loadedContent,
                slug: effectiveSlug,
                status: (userTemplateData.status || loadedContent.status || 'draft') as any,
                theme_id: (userTemplateData.theme_id || loadedContent.theme_id || 'modern') as any,
                ...(userTemplateData.music_url ? { music_url: userTemplateData.music_url } : {}),
              });
            }
            if (userTemplateData.theme_config && typeof userTemplateData.theme_config === 'object') {
              setThemeConfig({
                ...userTemplateData.theme_config,
                ...(userTemplateData.music_url ? { music_url: userTemplateData.music_url } : {}),
              });
            }
            setLoading(false);
            return;
          }
        }

        // Jika user belum login, cek apakah ada draf lokal tersimpan
        if (!currentUser) {
          const guestDraftStr = localStorage.getItem('mbell_pending_draft_formData');
          const guestThemeStr = localStorage.getItem('mbell_pending_draft_themeConfig');
          if (guestDraftStr) {
            try {
              const parsedGuest = JSON.parse(guestDraftStr);
              const gName = (parsedGuest.groom?.name || '').trim();
              const bName = (parsedGuest.bride?.name || '').trim();
              const coupleSlug = computeCoupleSlug(gName, bName);
              const effectiveSlug = (parsedGuest.slug && parsedGuest.slug !== 'raditya-jessica')
                ? parsedGuest.slug
                : (coupleSlug || parsedGuest.slug || 'raditya-jessica');

              setFormData((prev) => ({
                ...prev,
                ...parsedGuest,
                slug: effectiveSlug,
                status: (parsedGuest.status || 'draft') as any,
              }));
              if (guestThemeStr) {
                setThemeConfig(JSON.parse(guestThemeStr));
              }
              setLoading(false);
              return;
            } catch (e) { }
          }
        }

        // Fetch demo or user invitation from Supabase
        const querySlug = 'raditya-jessica';
        const { data: invitationRow, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', querySlug)
          .maybeSingle();

        if (error) {
          console.warn('Supabase fetch invitation notice:', error.message);
        }

        if (invitationRow) {
          let merged: InvitationData = { ...MOCK_MODERN_DATA };

          // If content JSONB exists, prioritize it
          if (invitationRow.content && typeof invitationRow.content === 'object') {
            merged = {
              ...merged,
              ...invitationRow.content,
            };
          }

          const gName = (merged.groom?.name || '').trim();
          const bName = (merged.bride?.name || '').trim();
          const coupleSlug = computeCoupleSlug(gName, bName);
          let effectiveSlug = invitationRow.slug || merged.slug || 'raditya-jessica';
          if (effectiveSlug === 'raditya-jessica' && coupleSlug !== 'raditya-jessica') {
            effectiveSlug = coupleSlug;
          }

          // Ensure database primary metadata is mapped
          merged.id = invitationRow.id || merged.id;
          merged.slug = effectiveSlug;
          merged.status = invitationRow.status || 'published';

          if (invitationRow.template_id) {
            const resolvedTheme = TEMPLATE_ID_TO_THEME[invitationRow.template_id] || 'modern';
            merged.theme_id = resolvedTheme as any;
          }

          // Ensure groom & bride parent info fallback
          if (merged.groom) {
            if (!merged.groom.child_order) merged.groom.child_order = 'Putra pertama dari pasangan';
            if (!merged.groom.parent_father) merged.groom.parent_father = 'Bpk. Ir. Hendra Pratama';
            if (!merged.groom.parent_mother) merged.groom.parent_mother = 'Ibu drg. Ratna Kusuma';
          }
          if (merged.bride) {
            if (!merged.bride.child_order) merged.bride.child_order = 'Putri pertama dari pasangan';
            if (!merged.bride.parent_father) merged.bride.parent_father = 'Bpk. Bambang Wijaya';
            if (!merged.bride.parent_mother) merged.bride.parent_mother = 'Ibu Endang Rahayu';
          }

          setFormData(merged);

          if (invitationRow.theme_config && typeof invitationRow.theme_config === 'object' && Object.keys(invitationRow.theme_config).length > 0) {
            setThemeConfig(invitationRow.theme_config);
          } else if (invitationRow.template_id) {
            const resolvedTheme = TEMPLATE_ID_TO_THEME[invitationRow.template_id] || 'modern';
            const matchedConfig = DEFAULT_THEME_CONFIGS[resolvedTheme];
            if (matchedConfig) {
              setThemeConfig(matchedConfig);
            }
          }
        }
      } catch (err) {
        console.warn('Init Dashboard warning:', err);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
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
        const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
        const targetSlug = formData.slug || 'raditya-jessica';
        const coupleTitle = `Pernikahan ${formData.groom?.name || 'Raditya'} & ${formData.bride?.name || 'Jessica'}`;
        const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
        const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

        const effectiveStatus = (formData.status || 'draft') as any;

        // 1. Simpan ke public.invitations
        const payload = {
          user_id: user?.id || null,
          template_id,
          slug: targetSlug,
          content: formData,
          theme_config: themeConfig,
          status: effectiveStatus,
          music_url: resolvedMusicUrl,
          music_type: resolvedMusicType,
          updated_at: new Date().toISOString(),
        };

        const { data: invUpdate, error: invError } = await supabase
          .from('invitations')
          .update(payload)
          .eq('slug', targetSlug)
          .select();

        if (invError || !invUpdate || invUpdate.length === 0) {
          const { error: upsertErr } = await supabase
            .from('invitations')
            .upsert(payload, { onConflict: 'slug' });
          if (upsertErr) {
            console.warn('Autosave invitations upsert notice:', upsertErr.message);
          }
        }

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
      const targetSlug = formData.slug || 'raditya-jessica';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Raditya'} & ${formData.bride?.name || 'Jessica'}`;

      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';
      const effectiveStatus = (formData.status || 'draft') as any;

      // 1. Simpan ke tabel public.invitations
      const payload = {
        user_id: user?.id || null,
        template_id,
        slug: targetSlug,
        content: formData,
        theme_config: themeConfig,
        status: effectiveStatus,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: new Date().toISOString(),
      };

      const { data: updateData, error: invError } = await supabase
        .from('invitations')
        .update(payload)
        .eq('slug', targetSlug)
        .select();

      if (invError || !updateData || updateData.length === 0) {
        const { error: upsertErr } = await supabase
          .from('invitations')
          .upsert(payload, { onConflict: 'slug' });
        if (upsertErr) {
          console.warn('Invitations upsert notice:', upsertErr.message);
        }
      }

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
      });
    } catch (err: any) {
      console.error('Manual save exception:', err);
      setSaveToast({
        show: true,
        message: 'Terjadi kesalahan saat menyimpan perubahan.',
        isError: true,
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveToast(null);
      }, 4000);
    }
  };

  // 💾 4. Explicit Save Draft / Checkpoint ke Supabase & LocalStorage
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
      // Pastikan slug mengikuti nama kedua mempelai secara dinamis
      const coupleSlug = computeCoupleSlug(formData.groom?.name, formData.bride?.name);
      const targetSlug = coupleSlug || formData.slug || 'raditya-jessica';

      const coupleTitle = `Draf Pernikahan ${formData.groom?.name || 'Mempelai'} & ${formData.bride?.name || 'Mempelai'}`;
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
          const invDraftPayload = {
            user_id: user.id,
            template_id,
            slug: targetSlug,
            content: draftContent,
            theme_config: themeConfig,
            status: 'draft',
            music_url: resolvedMusicUrl,
            music_type: resolvedMusicType,
            updated_at: new Date().toISOString(),
          };

          const { data: updateData, error: invError } = await supabase
            .from('invitations')
            .update(invDraftPayload)
            .eq('slug', targetSlug)
            .select();

          if (invError || !updateData || updateData.length === 0) {
            await supabase
              .from('invitations')
              .upsert(invDraftPayload, { onConflict: 'slug' });
          }
        }
      }

      setFormData(draftContent);
      setLastSaved(new Date());

      setSaveToast({
        show: true,
        message: user?.id
          ? `💾 Checkpoint draf "${coupleTitle}" berhasil disimpan ke Supabase! Anda dapat menariknya kembali kapan saja melalui menu Template Saya.`
          : '💾 Draf tersimpan sementara di browser. Masuk akun agar tersimpan permanen di cloud!',
        isError: false,
      });
    } catch (err: any) {
      console.error('Save draft error:', err);
      setSaveToast({
        show: true,
        message: 'Gagal menyimpan draf: ' + (err.message || 'Silakan coba lagi.'),
        isError: true,
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  // Handler Implementasikan / Tarik Kembali Template Tersimpan dari MyTemplatesPanel
  const handleSelectSavedTemplate = (template: UserTemplateRecord) => {
    setCurrentTemplateRecordId(template.id);
    localStorage.setItem('mbell_active_template_id', template.id);

    if (template.content && typeof template.content === 'object') {
      const gName = (template.content.groom?.name || '').trim();
      const bName = (template.content.bride?.name || '').trim();
      const coupleSlug = computeCoupleSlug(gName, bName);
      const effectiveSlug = (template.slug && template.slug !== 'raditya-jessica')
        ? template.slug
        : (coupleSlug || template.slug || 'raditya-jessica');

      const mergedContent: InvitationData = {
        ...MOCK_MODERN_DATA,
        ...template.content,
        slug: effectiveSlug,
        status: (template.status || template.content.status || 'draft') as any,
        theme_id: (template.theme_id || template.content.theme_id || 'modern') as any,
      };
      if (template.music_url) {
        mergedContent.music_url = template.music_url;
      }
      setFormData(mergedContent);
    }

    if (template.theme_config && typeof template.theme_config === 'object') {
      setThemeConfig({
        ...template.theme_config,
        ...(template.music_url ? { music_url: template.music_url } : {}),
      });
    }

    setActiveTab('edit-undangan');
    const isDraft = template.status === 'draft';
    setSaveToast({
      show: true,
      message: isDraft
        ? `📂 Draf checkpoint "${template.title}" berhasil ditarik ke editor! Silakan lanjutkan pengeditan.`
        : `Template "${template.title}" berhasil diimplementasikan ke editor!`,
      isError: false,
    });
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Handler Implementasikan Template Aktif
  const handleImplementActiveTemplate = () => {
    setActiveTab('edit-undangan');
    setSaveToast({
      show: true,
      message: 'Melanjutkan pengeditan template di editor!',
      isError: false,
    });
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Handler Sinkronisasi Jadwal Acara, Tanggal & Hitung Mundur Real-time
  const handleEventsChange = (events: any) => {
    const isArray = Array.isArray(events);
    const primaryEvent = isArray ? events[0] : (events?.akad || events?.resepsi);
    const dateStr = primaryEvent?.date;
    const timeStr = primaryEvent?.start_time || '08:00';
    const tzStr = primaryEvent?.timezone || 'WIB';

    let updatedIso = formData.wedding_date_iso;
    let updatedDisplay = formData.wedding_date_display;

    if (dateStr) {
      const tzOffset = tzStr === 'WIT' ? '+09:00' : tzStr === 'WITA' ? '+08:00' : '+07:00';
      const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
      updatedIso = `${dateStr}T${formattedTime}${tzOffset}`;

      try {
        const [year, month, day] = dateStr.split('-').map(Number);
        if (year && month && day) {
          const d = new Date(year, month - 1, day);
          updatedDisplay = d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }
      } catch (e) {
        console.warn('Date formatting error:', e);
      }
    }

    setFormData((prev) => ({
      ...prev,
      events,
      wedding_date_iso: updatedIso,
      wedding_date_display: updatedDisplay,
    }));
  };

  // Handler Buat Undangan / Template Baru dari Preset
  const handleAddNewTemplate = (themeId: string) => {
    handleThemeChange(themeId, true);
    setCurrentTemplateRecordId(null);
    setActiveTab('edit-undangan');
    setActiveStep(1);
    setSaveToast({
      show: true,
      message: `Preset tema ${themeId.toUpperCase()} siap diedit!`,
      isError: false,
    });
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Handler Pengubahan Alamat Tautan Undangan (Slug) dengan Sinkronisasi Database Instan
  const handleSlugChange = async (newSlug: string) => {
    const cleanSlug = newSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    if (!cleanSlug) return;

    setIsCustomSlug(true);
    const oldSlug = formData.slug || 'raditya-jessica';
    const updatedFormData = { ...formData, slug: cleanSlug };
    setFormData(updatedFormData);

    setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Raditya'} & ${formData.bride?.name || 'Jessica'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      const effectiveStatus = (formData.status || 'draft') as any;

      // 1. Update/Upsert di public.invitations
      const invPayload = {
        user_id: user?.id || null,
        template_id,
        slug: cleanSlug,
        content: updatedFormData,
        theme_config: themeConfig,
        status: effectiveStatus,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: new Date().toISOString(),
      };

      // Coba perbarui row dengan slug lama atau slug baru
      const { data: updateData } = await supabase
        .from('invitations')
        .update(invPayload)
        .or(`slug.eq.${cleanSlug},slug.eq.${oldSlug}`)
        .select();

      if (!updateData || updateData.length === 0) {
        await supabase
          .from('invitations')
          .upsert(invPayload, { onConflict: 'slug' });
      }

      // 2. Update di public.user_templates jika user login
      if (user?.id) {
        const res = await saveUserTemplate({
          id: currentTemplateRecordId || undefined,
          user_id: user.id,
          title: coupleTitle,
          slug: cleanSlug,
          template_id,
          theme_id: formData.theme_id || 'modern',
          status: effectiveStatus,
          content: updatedFormData,
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

      setLastSaved(new Date());
      setSaveToast({
        show: true,
        message: `Alamat tautan berhasil diubah & disinkronkan: mbell.id/${cleanSlug}`,
        isError: false,
      });
    } catch (err: any) {
      console.warn('Slug change sync error:', err);
      setSaveToast({
        show: true,
        message: `Alamat tautan diubah ke: mbell.id/${cleanSlug}`,
        isError: false,
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveToast(null), 3500);
    }
  };

  // Handler Step Selection
  const handleSelectStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  // Handler Next Step
  const handleNextStep = () => {
    if (activeStep < 5) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleRequestPublish();
    }
  };

  // Handler Previous Step
  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

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
      const targetSlug = formData.slug || 'raditya-jessica';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Raditya'} & ${formData.bride?.name || 'Jessica'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      const publishedContent = {
        ...formData,
        status: 'published' as const,
        plan: planId,
        is_paid: true,
      };

      // 1. Simpan dan terbitkan ke tabel public.invitations
      const payload = {
        user_id: user?.id || null,
        template_id,
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



  const handleThemeChange = (newThemeId: string, forcePreset = false) => {
    const semanticId = TEMPLATE_ID_TO_THEME[newThemeId] || newThemeId;
    const matchedConfig = MOCK_THEME_CONFIG_MAP[semanticId] || DEFAULT_THEME_CONFIGS[semanticId] || themeConfig;
    const thematicData = MOCK_THEME_DATA_MAP[semanticId];

    // Deteksi cerdas: apakah form masih memakai nama demo/bawaan template
    const DEMO_KEYWORDS = [
      'raditya', 'jessica',
      'romeo', 'juliet',
      'arya', 'dian', 'suryonegoro', 'daniswara',
      'rayhan', 'yasmin', 'al-fatih', 'anbiya',
      'bagas', 'citra', 'anindita', 'pratama'
    ];
    const currentGroom = (formData.groom?.name || '').toLowerCase().trim();
    const currentBride = (formData.bride?.name || '').toLowerCase().trim();
    const isUsingDemoContent =
      !currentGroom ||
      !currentBride ||
      DEMO_KEYWORDS.some((kw) => currentGroom.includes(kw)) ||
      DEMO_KEYWORDS.some((kw) => currentBride.includes(kw));

    if ((isUsingDemoContent || forcePreset) && thematicData) {
      setFormData({
        ...thematicData,
        id: formData.id,
        slug: formData.slug || 'raditya-jessica',
        status: formData.status || 'published',
        theme_id: semanticId as any,
      });
    } else {
      setFormData((prev) => ({ ...prev, theme_id: semanticId as any }));
    }
    setThemeConfig(matchedConfig);
  };

  const handleApplyPreset = (themeId: string) => {
    handleThemeChange(themeId, true);
  };

  return (
    <>
      {/* 0. OPENING ANIMATION LOADING SCREEN (10 Detik Video Intro) */}
      {showOpeningSplash && (
        <OpeningSplashScreen onFinish={() => setShowOpeningSplash(false)} />
      )}

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] text-stone-800">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
            <p className="font-label-md text-label-md text-stone-600">Memuat Editor Undangan...</p>
          </div>
        </div>
      ) : (
        <div className="h-screen overflow-hidden flex flex-col bg-[#F5F2EB] text-stone-800 font-sans selection:bg-stone-900/10 selection:text-stone-900">
          {/* 1. TOP HEADER (SOLID / BACKDROP BLUR - TIDAK TERTABRAK SAAT SCROLL) */}
          <DashboardHeader
            slug={formData.slug || 'raditya-jessica'}
            onSlugChange={handleSlugChange}
            status={formData.status || 'published'}
            isPublished={formData.status === 'published'}
            suggestedSlug={computeCoupleSlug(formData.groom?.name, formData.bride?.name)}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
            lastSaved={lastSaved}
            userEmail={user?.email || null}
            userAvatar={user?.avatar_url || null}
            userName={user?.full_name || null}
            accountStatus="Gratis"
            onLoginClick={() => setShowAuthGateModal(true)}
            onRegisterClick={() => setShowAuthGateModal(true)}
            onOpenSettings={() => setActiveTab('pengaturan')}
            onOpenMyTemplates={() => setActiveTab('template-saya')}
            onReplayOpening={() => setShowOpeningSplash(true)}
            onLogout={async () => {
              await supabase.auth.signOut();
              setUser(null);
              setSaveToast({
                show: true,
                message: 'Berhasil keluar akun',
                isError: false,
              });
              setTimeout(() => setSaveToast(null), 3000);
            }}
            onPublish={handleRequestPublish}
            onOpenPreview={() => setShowFullscreenModal(true)}
          />

          {/* 2. BODY CONTAINER (FLEX 3-KOLOM: SIDEBAR KIRI, EDITOR TENGAH, PREVIEW KANAN) */}
          <div className="flex-1 flex overflow-hidden">
            {/* KOLOM 1: LEFT SIDEBAR (TETAP DIAM DI KIRI) */}
            <DashboardSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

            {/* KOLOM 2: CENTER EDITOR PANEL (HANYA INI YANG SCROLL VERTIKAL) */}
            <main className="flex-1 h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scroll-smooth bg-[#F5F2EB]">
              <div className="max-w-3xl mx-auto space-y-6 pb-32 sm:pb-28">
                {activeTab === 'template-saya' ? (
                  <MyTemplatesPanel
                    currentUserId={user?.id || null}
                    currentFormData={formData}
                    activeTemplateId={currentTemplateRecordId}
                    onSelectTemplate={handleSelectSavedTemplate}
                    onImplementActiveTemplate={handleImplementActiveTemplate}
                    onOpenAuthGate={() => setShowAuthGateModal(true)}
                    onAddNewTemplate={handleAddNewTemplate}
                    onSlugChange={handleSlugChange}
                  />
                ) : activeTab === 'edit-undangan' ? (
                  <>
                    {/* STEP NAVIGATION CAROUSEL (NO-SCROLLBAR) */}
                    <StepSelectorNav activeStep={activeStep} onSelectStep={handleSelectStep} />

                    {/* CONDITIONAL RENDERING BERDASARKAN activeStep */}
                    {activeStep === 1 && (
                      <ThemePickerCard
                        activeThemeId={formData.theme_id || 'modern'}
                        onSelectTheme={handleThemeChange}
                        onThemeSelect={handleThemeChange}
                        onApplyPreset={handleApplyPreset}
                      />
                    )}

                    {activeStep === 2 && (
                      <CoupleFormCard
                        groom={formData.groom}
                        bride={formData.bride}
                        isBrideFirst={formData.is_bride_first}
                        coverImage={formData.cover_image || formData.couple_photo || ''}
                        slug={formData.slug || 'raditya-jessica'}
                        onSlugChange={handleSlugChange}
                        onGroomChange={(groom) => {
                          const newGName = groom.name || '';
                          const currentBName = formData.bride?.name || '';
                          const autoSlug = computeCoupleSlug(newGName, currentBName);
                          setFormData((prev) => ({
                            ...prev,
                            groom,
                            slug: autoSlug,
                          }));
                        }}
                        onBrideChange={(bride) => {
                          const currentGName = formData.groom?.name || '';
                          const newBName = bride.name || '';
                          const autoSlug = computeCoupleSlug(currentGName, newBName);
                          setFormData((prev) => ({
                            ...prev,
                            bride,
                            slug: autoSlug,
                          }));
                        }}
                        onToggleBrideFirst={(isBrideFirst) => setFormData({ ...formData, is_bride_first: isBrideFirst })}
                        onCoverChange={(cover_image) => setFormData({ ...formData, cover_image, couple_photo: cover_image })}
                      />
                    )}

                    {activeStep === 3 && (
                      <EventsFormCard
                        events={formData.events}
                        onEventsChange={handleEventsChange}
                      />
                    )}

                    {activeStep === 4 && (
                      <GiftsStoryFormCard
                        activeTabMode="story_gallery"
                        loveStory={formData.love_story || []}
                        gallery={formData.gallery || []}
                        musicUrl={formData.music_url || themeConfig.music_url || ''}
                        onLoveStoryChange={(love_story) => setFormData({ ...formData, love_story })}
                        onGalleryChange={(gallery) => setFormData({ ...formData, gallery })}
                        onMusicUrlChange={(music_url) => {
                          setFormData((prev) => ({ ...prev, music_url }));
                          setThemeConfig((prev) => ({ ...prev, music_url }));
                        }}
                        onSaveMusic={handleManualSave}
                        onBankAccountsChange={() => { }}
                      />
                    )}

                    {activeStep === 5 && (
                      <GiftsStoryFormCard
                        activeTabMode="gifts"
                        bankAccounts={formData.banks || formData.bank_accounts || []}
                        onBankAccountsChange={(banks) => setFormData({ ...formData, banks, bank_accounts: banks })}
                        onLoveStoryChange={() => { }}
                        onMusicUrlChange={(music_url) => {
                          setFormData((prev) => ({ ...prev, music_url }));
                          setThemeConfig((prev) => ({ ...prev, music_url }));
                        }}
                        onSaveMusic={handleManualSave}
                      />
                    )}

                    {/* BOTTOM ACTION BAR */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/90 mb-1 sm:mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'
                            }`}
                        />
                        <span className="text-xs sm:text-sm text-stone-600 font-medium">
                          {isSaving ? 'Menyimpan perubahan...' : 'Tersimpan otomatis & aman'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Tombol Simpan Draf / Checkpoint */}
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={isSaving}
                          className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 font-semibold text-xs sm:text-sm border border-stone-300 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                          title="Simpan editan saat ini sebagai Draf / Checkpoint di Supabase"
                        >
                          <span className="material-symbols-outlined text-[17px] text-amber-700">bookmark_added</span>
                          <span>Simpan Draf</span>
                        </button>

                        {activeStep > 1 && (
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2.5 rounded-xl bg-white text-stone-700 font-semibold text-xs sm:text-sm border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
                          >
                            Sebelumnya
                          </button>
                        )}

                        {/* Tombol Lanjutkan (Muncul di Step 1-4, di Step 5 tampil tombol Selesai & Terbitkan) */}
                        {activeStep < 5 ? (
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs sm:text-sm hover:bg-stone-800 transition-transform active:scale-95 shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Lanjutkan</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleRequestPublish}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                            <span>Selesai &amp; Terbitkan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : activeTab === 'daftar-tamu' ? (
                  <GuestListPanel
                    userId={user?.id}
                    invitationId={formData.id}
                    invitationSlug={formData.slug || 'raditya-jessica'}
                    coupleNames={`${formData.groom?.name || 'Raditya'} & ${formData.bride?.name || 'Jessica'}`}
                    onGoToEditor={() => setActiveTab('edit-undangan')}
                    onOpenAuthGate={() => setShowAuthGateModal(true)}
                  />
                ) : activeTab === 'ucapan-masuk' ? (
                  <WishesListPanel
                    userId={user?.id}
                    invitationId={formData.id}
                    invitationSlug={formData.slug || 'raditya-jessica'}
                    onGoToEditor={() => setActiveTab('edit-undangan')}
                    onOpenAuthGate={() => setShowAuthGateModal(true)}
                  />
                ) : (
                  <SettingsAccountPanel
                    userId={user?.id}
                    userEmail={user?.email}
                    userName={user?.full_name}
                    userAvatar={user?.avatar_url}
                    invitationSlug={formData.slug || 'raditya-jessica'}
                    onGoToEditor={() => setActiveTab('edit-undangan')}
                    onOpenAuthGate={() => setShowAuthGateModal(true)}
                    onLogout={() => {
                      setUser(null);
                      setActiveTab('edit-undangan');
                    }}
                  />
                )}
              </div>
            </main>

            {/* KOLOM 3: RIGHT PREVIEW PANEL (100% DIAM / STATIC DI LAYAR DESKTOP) */}
            <aside className="w-[440px] shrink-0 h-full border-l border-stone-200/80 hidden xl:flex flex-col items-center justify-center bg-[#EFECE6] p-4 relative overflow-hidden select-none">
              <PhoneMockupPreview
                data={formData}
                theme={themeConfig}
                wishes={MOCK_THEME_WISHES_MAP[TEMPLATE_ID_TO_THEME[String(formData.theme_id || 'modern')]] || wishes}
                previewUrl={`mbell.id/${formData.slug || 'raditya-jessica'}`}
              />
            </aside>
          </div>

          {/* MOBILE FLOATING PILL BUTTON "Pratinjau" (DIPOSISIKAN DI POJOK KANAN BAWAH DI ATAS MENU BAR AGAR TIDAK MENUTUPI TOMBOL BAWAH) */}
          <div className="fixed bottom-[74px] right-4 sm:right-6 z-30 xl:hidden">
            <button
              type="button"
              onClick={() => setShowFullscreenModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900 text-white font-label-md text-xs sm:text-sm shadow-2xl hover:bg-stone-800 transition-all active:scale-95 cursor-pointer border border-white/20 backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Pratinjau</span>
            </button>
          </div>

          {/* FULLSCREEN PREVIEW MODAL DENGAN PHONE MOCKUP PREVIEW (SINGLE UNIFIED HEADER) */}
          {showFullscreenModal && (
            <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
              {/* PHONE MOCKUP CONTAINER - MENJAMIN BOTTOM BAR & AUDIO TEPAT DI DASAR HP DAN HEADER TUNGGAL */}
              <div className="w-full max-w-[365px] h-[calc(100vh-30px)] max-h-[760px] flex items-center justify-center overflow-hidden">
                <PhoneMockupPreview
                  data={formData}
                  theme={themeConfig}
                  wishes={MOCK_THEME_WISHES_MAP[TEMPLATE_ID_TO_THEME[String(formData.theme_id || 'modern')]] || wishes}
                  previewUrl={`mbell.id/${formData.slug || 'raditya-jessica'}`}
                  onClose={() => setShowFullscreenModal(false)}
                />
              </div>
            </div>
          )}

          {/* 3.5 MODAL POPUP: KONFIRMASI SIMPAN & TERBITKAN */}
          {showConfirmPublishModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overflow-hidden">
                {/* Subtle decorative background gradient */}
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPublishModal(false)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Modal"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                {/* Header Icon */}
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>

                {/* Title & Description */}
                <h3 className="font-title-lg text-title-lg text-stone-900 font-bold mb-2">
                  Konfirmasi Simpan &amp; Terbitkan
                </h3>
                <p className="font-body-md text-body-md text-stone-600 mb-6 leading-relaxed">
                  Apakah Anda yakin ingin menyimpan seluruh perubahan pada undangan <span className="font-semibold text-stone-900">mbell.id/{formData.slug || 'raditya-jessica'}</span> dan melanjutkan proses penerbitan?
                </p>

                {/* Checklist Highlights */}
                <div className="space-y-2 mb-6 bg-stone-50 rounded-2xl p-4 border border-stone-200/70 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Semua data mempelai &amp; jadwal tersimpan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Link Google Maps &amp; amplop rekening diperbarui</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Siap dibagikan ke seluruh tamu undangan</span>
                  </div>
                </div>

                {/* Action Buttons: Yakin Simpan / Kembali */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPublishModal(false)}
                    className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-label-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSaveAndPublish}
                    className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-label-md text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Yakin &amp; Simpan</span>
                    <span className="material-symbols-outlined text-base">check</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. MODAL POPUP: AUTH GATE ("LOGIN / REGISTER DULU") */}
          <AuthGateModal
            isOpen={showAuthGateModal}
            onClose={() => setShowAuthGateModal(false)}
            invitationSlug={formData.slug || 'raditya-jessica'}
            onBeforeAuth={preserveDraftToLocalStorage}
            onSuccessLogin={handleAuthSuccess}
          />

          {/* 5. MODAL POPUP: HARGA & PAYWALL SEBELUM PUBLISH */}
          <PricingPaywallModal
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
            onConfirmPublish={handleConfirmPublish}
            invitationSlug={formData.slug || 'raditya-jessica'}
          />

          {/* 6. FLOATING TOAST NOTIFICATION SINKRONISASI DATABASE SUPABASE */}
          {saveToast && saveToast.show && (
            <div className="fixed top-20 right-6 z-[150] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div
                className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${saveToast.isError
                  ? 'bg-red-950/95 text-white border-red-700'
                  : 'bg-stone-900/95 text-white border-emerald-500/40 shadow-emerald-950/20'
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-xl shrink-0 p-1.5 rounded-full ${saveToast.isError ? 'bg-red-800 text-white' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                >
                  {saveToast.isError ? 'error' : 'cloud_done'}
                </span>
                <div className="text-xs space-y-0.5 min-w-0 flex-1">
                  <p className="font-bold text-sm">
                    {saveToast.isError ? 'Gagal Menyimpan' : 'Tersimpan Aman'}
                  </p>
                  <p className="text-stone-300 leading-relaxed">{saveToast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveToast(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
