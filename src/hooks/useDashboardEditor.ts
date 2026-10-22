import React, { useState, useEffect, useRef } from 'react';
import { supabase, saveUserTemplate, purgeRadityaJessica, type UserTemplateRecord } from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig } from '../types/invitation';
import type { DashboardTab } from '../components/dashboard/DashboardSidebar';
import { extractYouTubeId } from './useAudioPlayer';
import {
  MOCK_MODERN_DATA,
  MOCK_THEME_DATA_MAP,
  MOCK_THEME_CONFIG_MAP,
} from '../data/mockInvitation';
import {
  THEME_TO_TEMPLATE_ID,
  TEMPLATE_ID_TO_THEME,
  DEFAULT_THEME_CONFIGS,
  DEMO_KEYWORDS,
  getSafeDbTemplateId,
  isTemplateUnlocked,
} from '../pages/dashboard/constants/themeMapping';
import {
  computeCoupleSlug,
  getCanonicalPublishedSlug,
} from '../pages/dashboard/helpers/computeCoupleSlug';
import { parseSupabaseUser, type DashboardUser } from './useDashboardAuth';

export const INITIAL_BLANK_DRAFT: InvitationData = {
  id: '',
  slug: '',
  status: 'draft',
  theme_id: 'modern',
  groom: {
    name: '',
    full_name: '',
    instagram: '',
    child_order: 'Putra pertama dari pasangan',
    parent_father: '',
    parent_mother: '',
  },
  bride: {
    name: '',
    full_name: '',
    instagram: '',
    child_order: 'Putri pertama dari pasangan',
    parent_father: '',
    parent_mother: '',
  },
  is_bride_first: false,
  couple_photo: '',
  cover_image: '',
  wedding_date_iso: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  wedding_date_display: 'Pilih Tanggal Acara',
  quote: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
  quote_source: 'QS. Ar-Rum: 21',
  hashtag: '',
  events: [
    {
      name: 'Akad Nikah',
      title: 'Akad Nikah',
      date: '',
      time: '08:00 - 10:00 WIB',
      start_time: '08:00',
      end_time: '10:00',
      timezone: 'WIB',
      venue_name: '',
      venue_address: '',
      maps_url: '',
    },
    {
      name: 'Resepsi Pernikahan',
      title: 'Resepsi Pernikahan',
      date: '',
      time: '11:00 - 13:00 WIB',
      start_time: '11:00',
      end_time: '13:00',
      timezone: 'WIB',
      venue_name: '',
      venue_address: '',
      maps_url: '',
    },
  ],
  love_story: [],
  gallery: [],
  banks: [],
  music_url: '',
};

export interface UseDashboardEditorOptions {
  user?: DashboardUser | null;
  setUser?: React.Dispatch<React.SetStateAction<DashboardUser | null>> | ((u: DashboardUser | null) => void);
  setSaveToast?: ((toast: { show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null) => void) | React.Dispatch<React.SetStateAction<{ show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null>>;
  setIsSaving?: ((saving: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>;
  setLastSaved?: ((date: Date | null) => void) | React.Dispatch<React.SetStateAction<Date | null>>;
}

export function useDashboardEditor(options?: UseDashboardEditorOptions) {
  const {
    user = null,
    setUser,
    setSaveToast,
    setIsSaving,
    setLastSaved,
  } = options || {};
  // Invitation Form Data State (Mulai bersih di Step 1, tidak memuat data demo Raditya & Jessica)
  const [formData, setFormData] = useState<InvitationData>(INITIAL_BLANK_DRAFT);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIGS['modern']);

  // Editor UI State
  const [activeTab, setActiveTab] = useState<DashboardTab>('edit-undangan');
  const [currentTemplateRecordId, setCurrentTemplateRecordId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showOpeningSplash, setShowOpeningSplash] = useState(true);
  const [publishedThemeId, setPublishedThemeId] = useState<string | null>(null);
  const liveBaselineRef = useRef<{
    formData: InvitationData;
    themeConfig: ThemeConfig;
    theme_id: string;
  } | null>(null);

  // 1. Initial Load: Auth check and fetch invitation from Supabase
  useEffect(() => {
    async function initDashboard() {
      try {
        // Purge raditya-jessica permanently dari database Supabase
        purgeRadityaJessica();

        // Bersihkan cache draft lama jika ada sisa raditya-jessica di localStorage
        const cachedDraft = localStorage.getItem('mbell_pending_draft_formData');
        if (cachedDraft && (cachedDraft.includes('raditya-jessica') || (cachedDraft.includes('Raditya') && cachedDraft.includes('Jessica')))) {
          localStorage.removeItem('mbell_pending_draft_formData');
          localStorage.removeItem('mbell_pending_draft_themeConfig');
          localStorage.removeItem('mbell_active_template_id');
          localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || null;
        if (currentUser && setUser) {
          setUser(parseSupabaseUser(currentUser));
        }

        if (currentUser) {
          // Cari record berstatus 'published' yang resmi milik user ini di public.user_templates & public.invitations
          const { data: publishedUt } = await supabase
            .from('user_templates')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('status', 'published')
            .neq('slug', 'raditya-jessica')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { data: publishedInv } = await supabase
            .from('invitations')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('status', 'published')
            .neq('slug', 'raditya-jessica')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const livePublishedTheme =
            publishedUt?.theme_id ||
            publishedUt?.content?.theme_id ||
            (publishedUt?.template_id ? TEMPLATE_ID_TO_THEME[publishedUt.template_id] : null) ||
            publishedInv?.content?.theme_id ||
            (publishedInv?.template_id ? TEMPLATE_ID_TO_THEME[publishedInv.template_id] : null) ||
            null;

          if (livePublishedTheme) {
            setPublishedThemeId(livePublishedTheme);
          }

          const liveSource = publishedUt || publishedInv;
          if (liveSource && livePublishedTheme) {
            const liveContent = (liveSource.content && typeof liveSource.content === 'object') ? liveSource.content : {};
            const liveGName = (liveContent.groom?.name || '').trim();
            const liveBName = (liveContent.bride?.name || '').trim();
            const coupleSlug = computeCoupleSlug(liveGName, liveBName);
            const rawSlug = liveSource.slug || liveContent.slug || coupleSlug || 'undangan-baru';
            const liveSlug = getCanonicalPublishedSlug(rawSlug, liveGName, liveBName);
            const liveConfig: ThemeConfig =
              (liveSource.theme_config && typeof liveSource.theme_config === 'object')
                ? {
                    ...liveSource.theme_config,
                    ...(liveSource.music_url ? { music_url: liveSource.music_url } : {}),
                  }
                : (DEFAULT_THEME_CONFIGS[livePublishedTheme] || DEFAULT_THEME_CONFIGS['modern']);

            const liveUnlocked = Array.from(new Set([
              ...(Array.isArray(liveSource.unlocked_templates) ? liveSource.unlocked_templates : []),
              ...(Array.isArray(liveContent.unlocked_templates) ? liveContent.unlocked_templates : []),
              livePublishedTheme,
              liveSource.paid_template_id,
            ].filter(Boolean)));

            liveBaselineRef.current = {
              formData: {
                ...MOCK_MODERN_DATA,
                ...liveContent,
                slug: liveSlug,
                status: 'published',
                theme_id: livePublishedTheme as any,
                is_paid: true,
                paid_template_id: liveSource.paid_template_id || livePublishedTheme,
                unlocked_templates: liveUnlocked,
                ...(liveSource.music_url ? { music_url: liveSource.music_url } : {}),
              },
              themeConfig: liveConfig,
              theme_id: livePublishedTheme,
            };
          }

          // Cek template yang ingin dimuat ke editor
          const savedActiveId = localStorage.getItem('mbell_active_template_id');
          let userTemplateData: any = null;

          if (savedActiveId) {
            const { data } = await supabase
              .from('user_templates')
              .select('*')
              .eq('user_id', currentUser.id)
              .eq('id', savedActiveId)
              .neq('slug', 'raditya-jessica')
              .maybeSingle();
            userTemplateData = data;
          }

          if (!userTemplateData) {
            // Jika savedActiveId tidak ditemukan, prioritaskan template berstatus published
            if (publishedUt) {
              userTemplateData = publishedUt;
            } else {
              const { data } = await supabase
                .from('user_templates')
                .select('*')
                .eq('user_id', currentUser.id)
                .neq('slug', 'raditya-jessica')
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();
              userTemplateData = data;
            }
          }

          // KASUS A: User SUDAH memiliki template tersimpan di database
          if (
            userTemplateData &&
            userTemplateData.slug !== 'raditya-jessica' &&
            !(userTemplateData.title || '').toLowerCase().includes('raditya')
          ) {
            setCurrentTemplateRecordId(userTemplateData.id);
            localStorage.setItem('mbell_active_template_id', userTemplateData.id);

            // Deteksi apakah template ini adalah template live yang dipublikasikan secara nyata
            const isThisPublished =
              userTemplateData.status === 'published' ||
              Boolean(publishedUt && publishedUt.id === userTemplateData.id) ||
              Boolean(publishedInv && userTemplateData.slug === publishedInv.slug && publishedInv.status === 'published');

            const activeTheme = (userTemplateData.theme_id ||
              userTemplateData.content?.theme_id ||
              (userTemplateData.template_id ? TEMPLATE_ID_TO_THEME[userTemplateData.template_id] : null) ||
              livePublishedTheme ||
              'modern') as any;

            if (livePublishedTheme) {
              setPublishedThemeId(livePublishedTheme);
            } else if (isThisPublished) {
              setPublishedThemeId(activeTheme);
            }

            const loadedContent = (userTemplateData.content && typeof userTemplateData.content === 'object')
              ? userTemplateData.content
              : {};
            const gName = (loadedContent.groom?.name || '').trim();
            const bName = (loadedContent.bride?.name || '').trim();
            const coupleSlug = computeCoupleSlug(gName, bName);
            const rawSlug = userTemplateData.slug || loadedContent.slug || coupleSlug || 'undangan-baru';
            const effectiveSlug = rawSlug;

            // Cek apakah ada perubahan belum disimpan di localStorage (misal user sedang coba preview tema lain)
            const hasUnsavedDraft = localStorage.getItem('mbell_pending_draft_hasUnsavedEdits') === 'true';
            const savedDraftFormDataStr = localStorage.getItem('mbell_pending_draft_formData');
            const savedDraftThemeConfigStr = localStorage.getItem('mbell_pending_draft_themeConfig');

            // Kolom tabel database (user_templates) adalah Single Source of Truth
            const dbHasUnlockedCol = Array.isArray(userTemplateData.unlocked_templates);
            const dbUnlocked: string[] = dbHasUnlockedCol
              ? userTemplateData.unlocked_templates
              : (Array.isArray(loadedContent.unlocked_templates) ? loadedContent.unlocked_templates : []);

            const effectiveIsPaid = Boolean(userTemplateData.is_paid ?? (isThisPublished ? true : (loadedContent.is_paid || false)));
            const effectivePaidTplId = effectiveIsPaid
              ? (userTemplateData.paid_template_id || loadedContent.paid_template_id || livePublishedTheme || activeTheme)
              : null;

            const effectiveUnlocked = effectiveIsPaid
              ? Array.from(new Set([...dbUnlocked, effectivePaidTplId, livePublishedTheme].filter(Boolean)))
              : (dbHasUnlockedCol ? userTemplateData.unlocked_templates : []);

            if (hasUnsavedDraft && savedDraftFormDataStr) {
              try {
                const pendingFormData: InvitationData = JSON.parse(savedDraftFormDataStr);
                const pendingThemeConfig: ThemeConfig = savedDraftThemeConfigStr
                  ? JSON.parse(savedDraftThemeConfigStr)
                  : (userTemplateData.theme_config || themeConfig);

                // Jika di database is_paid adalah false (misal di-reset), jangan biarkan draf lokal membangkitkan status berbayar
                const draftUnlocked = effectiveIsPaid
                  ? Array.from(new Set([...effectiveUnlocked, ...(Array.isArray(pendingFormData.unlocked_templates) ? pendingFormData.unlocked_templates : [])]))
                  : effectiveUnlocked;

                // Muat ke state form editor agar perubahan tidak hilang, tapi status pembayaran database TETAP SEJATI
                setFormData({
                  ...MOCK_MODERN_DATA,
                  ...pendingFormData,
                  slug: effectiveSlug,
                  status: isThisPublished ? 'published' : (userTemplateData.status || 'draft'),
                  // Jika tema di draft berbeda, biarkan editor menampilkan preview tema tersebut
                  theme_id: pendingFormData.theme_id || activeTheme,
                  unlocked_templates: draftUnlocked,
                  is_paid: effectiveIsPaid,
                  paid_template_id: effectivePaidTplId,
                });
                setThemeConfig(pendingThemeConfig);
                setLoading(false);
                return;
              } catch (err) {
                console.warn('Gagal mem-parse unsaved draft:', err);
              }
            }

            const officialForm: InvitationData = {
              ...MOCK_MODERN_DATA,
              ...loadedContent,
              slug: effectiveSlug,
              status: isThisPublished ? 'published' : (userTemplateData.status || 'draft'),
              theme_id: activeTheme,
              unlocked_templates: effectiveUnlocked,
              is_paid: effectiveIsPaid,
              paid_template_id: effectivePaidTplId,
              ...(userTemplateData.music_url ? { music_url: userTemplateData.music_url } : {}),
            };

            const officialThemeConfig: ThemeConfig =
              userTemplateData.theme_config && typeof userTemplateData.theme_config === 'object'
                ? {
                    ...userTemplateData.theme_config,
                    ...(userTemplateData.music_url ? { music_url: userTemplateData.music_url } : {}),
                  }
                : themeConfig;

            if (isThisPublished || (livePublishedTheme && (livePublishedTheme === activeTheme || livePublishedTheme === userTemplateData.theme_id))) {
              liveBaselineRef.current = {
                formData: JSON.parse(JSON.stringify(officialForm)),
                themeConfig: JSON.parse(JSON.stringify(officialThemeConfig)),
                theme_id: activeTheme,
              };
            }

            setFormData(officialForm);
            setThemeConfig(officialThemeConfig);
            setLoading(false);
            return;
          }

          // KASUS A.2: User belum punya di user_templates tapi punya record resmi di invitations!
          if (!userTemplateData && publishedInv) {
            const invContent = (publishedInv.content && typeof publishedInv.content === 'object') ? publishedInv.content : {};
            const gName = (invContent.groom?.name || '').trim();
            const bName = (invContent.bride?.name || '').trim();
            const coupleSlug = computeCoupleSlug(gName, bName);
            const effectiveSlug = getCanonicalPublishedSlug(publishedInv.slug || coupleSlug, gName, bName);
            const activeTheme = livePublishedTheme || 'modern';

            if (livePublishedTheme) {
              setPublishedThemeId(livePublishedTheme);
            }

            const invFormData: InvitationData = {
              ...MOCK_MODERN_DATA,
              ...invContent,
              slug: effectiveSlug,
              status: 'published',
              theme_id: activeTheme,
              is_paid: true,
              paid_template_id: activeTheme,
              unlocked_templates: [activeTheme],
            };
            const invThemeConfig: ThemeConfig =
              publishedInv.theme_config && typeof publishedInv.theme_config === 'object'
                ? publishedInv.theme_config
                : themeConfig;

            liveBaselineRef.current = {
              formData: JSON.parse(JSON.stringify(invFormData)),
              themeConfig: JSON.parse(JSON.stringify(invThemeConfig)),
              theme_id: activeTheme,
            };

            setFormData(invFormData);
            setThemeConfig(invThemeConfig);
            setLoading(false);
            return;
          }

          // KASUS B: User baru pertama kali login dan BELUM memiliki template di database sama sekali
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

              const saveResult = await saveUserTemplate({
                user_id: currentUser.id,
                slug: pendingFormData.slug || computeCoupleSlug(pendingFormData.groom?.name, pendingFormData.bride?.name) || 'undangan-baru',
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
              setLoading(false);
              return;
            } catch (err) {
              console.warn('Gagal memproses draf awal setelah login:', err);
            }
          }
        }

        // Jika user belum login, cek apakah ada draf lokal tersimpan
        if (!currentUser) {
          const guestDraftStr = localStorage.getItem('mbell_pending_draft_formData');
          const guestThemeStr = localStorage.getItem('mbell_pending_draft_themeConfig');
          if (guestDraftStr) {
            try {
              const parsedGuest = JSON.parse(guestDraftStr);

              // Jika draft lokal terdeteksi merupakan sisa data akun sebelumnya:
              const isAccountResidue = Boolean(
                parsedGuest.id ||
                parsedGuest.status === 'published' ||
                parsedGuest.slug === 'zaky-bella' ||
                parsedGuest.paid_template_id
              );

              if (isAccountResidue) {
                localStorage.removeItem('mbell_pending_draft_formData');
                localStorage.removeItem('mbell_pending_draft_themeConfig');
                localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
                localStorage.removeItem('mbell_active_template_id');
                setFormData(INITIAL_BLANK_DRAFT);
                setThemeConfig(DEFAULT_THEME_CONFIGS['modern']);
                setLoading(false);
                return;
              }

              const gName = (parsedGuest.groom?.name || '').trim();
              const bName = (parsedGuest.bride?.name || '').trim();
              const coupleSlug = computeCoupleSlug(gName, bName);
              const effectiveSlug = (parsedGuest.slug && parsedGuest.slug !== 'raditya-jessica')
                ? parsedGuest.slug
                : (coupleSlug || parsedGuest.slug || 'undangan-baru');

              setFormData((prev) => ({
                ...prev,
                ...parsedGuest,
                id: '',
                slug: effectiveSlug,
                status: 'draft',
              }));
              if (guestThemeStr) {
                setThemeConfig(JSON.parse(guestThemeStr));
              }
              setLoading(false);
              return;
            } catch (e) { }
          }
        }

        // Inisialisasi awal bersih untuk pengunjung baru: tidak memuat data live 'raditya-jessica'
        // Dashboard langsung siap di Step 1 (Pilih Tema) dengan template bersih
        setActiveStep(1);
      } catch (err) {
        console.warn('Init Dashboard warning:', err);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, []);

  // Listener reset editor ke blank ketika template aktif dihapus dari MyTemplatesPanel
  useEffect(() => {
    const handleResetBlank = () => {
      setFormData(INITIAL_BLANK_DRAFT);
      setThemeConfig(DEFAULT_THEME_CONFIGS['modern']);
      setCurrentTemplateRecordId(null);
      setPublishedThemeId(null);
      setActiveStep(1);
      localStorage.removeItem('mbell_active_template_id');
      localStorage.removeItem('mbell_pending_draft_formData');
      localStorage.removeItem('mbell_pending_draft_themeConfig');
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
    };
    window.addEventListener('mbell_reset_editor_blank', handleResetBlank);
    return () => {
      window.removeEventListener('mbell_reset_editor_blank', handleResetBlank);
    };
  }, []);

  // Handler Implementasikan / Tarik Kembali Template Tersimpan dari MyTemplatesPanel
  const handleSelectSavedTemplate = (template: UserTemplateRecord, stayOnCurrentTab: boolean = false) => {
    setCurrentTemplateRecordId(template.id);
    localStorage.setItem('mbell_active_template_id', template.id);

    const isPublishedTemplate = template.status === 'published';
    const effectiveTheme = (template.theme_id || template.content?.theme_id || (template.template_id ? TEMPLATE_ID_TO_THEME[template.template_id] : null) || 'modern') as any;

    if (isPublishedTemplate) {
      setPublishedThemeId(effectiveTheme);
    }

    let loadedFormData: InvitationData = formData;
    if (template.content && typeof template.content === 'object') {
      const gName = (template.content.groom?.name || '').trim();
      const bName = (template.content.bride?.name || '').trim();
      const coupleSlug = computeCoupleSlug(gName, bName);
      const rawSlug = (template.slug && template.slug !== 'raditya-jessica')
        ? template.slug
        : (coupleSlug || template.slug || 'undangan-baru');
      const effectiveSlug = isPublishedTemplate
        ? getCanonicalPublishedSlug(rawSlug, gName, bName)
        : rawSlug;

      const mergedContent: InvitationData = {
        ...MOCK_MODERN_DATA,
        ...template.content,
        slug: effectiveSlug,
        status: (template.status || template.content.status || 'draft') as any,
        theme_id: effectiveTheme,
      };
      if (template.music_url) {
        mergedContent.music_url = template.music_url;
      }
      loadedFormData = mergedContent;
      setFormData(mergedContent);
    }

    const loadedThemeConfig: ThemeConfig =
      template.theme_config && typeof template.theme_config === 'object'
        ? {
            ...template.theme_config,
            ...(template.music_url ? { music_url: template.music_url } : {}),
          }
        : themeConfig;

    if (template.theme_config && typeof template.theme_config === 'object') {
      setThemeConfig(loadedThemeConfig);
    }

    if (isPublishedTemplate) {
      liveBaselineRef.current = {
        formData: JSON.parse(JSON.stringify(loadedFormData)),
        themeConfig: JSON.parse(JSON.stringify(loadedThemeConfig)),
        theme_id: effectiveTheme,
      };
    }

    if (!stayOnCurrentTab) {
      setActiveTab('edit-undangan');
      const isDraft = template.status === 'draft';
      if (setSaveToast) {
        setSaveToast({
          show: true,
          message: isDraft
            ? `Draf "${template.title}" dimuat ke editor`
            : `Template "${template.title}" aktif di editor`,
          type: 'info',
        });
      }
    } else {
      if (setSaveToast) {
        setSaveToast({
          show: true,
          message: `Template: ${template.title} dipilih`,
          type: 'info',
        });
      }
    }

    window.dispatchEvent(
      new CustomEvent('mbell_template_loaded', {
        detail: {
          template,
          formData: loadedFormData,
          themeConfig: loadedThemeConfig,
        },
      })
    );
  };

  // Listener sinkronisasi liveBaselineRef ketika ada event mbell_template_loaded
  useEffect(() => {
    const handleTemplateLoaded = (e: any) => {
      const detail = e.detail;
      if (detail?.formData && detail?.themeConfig) {
        const isPub = detail.formData.status === 'published' || detail.template?.status === 'published';
        if (isPub) {
          const pubTheme = detail.formData.theme_id || publishedThemeId || 'modern';
          liveBaselineRef.current = {
            formData: JSON.parse(JSON.stringify(detail.formData)),
            themeConfig: JSON.parse(JSON.stringify(detail.themeConfig)),
            theme_id: pubTheme,
          };
          setPublishedThemeId(pubTheme);
        }
      }
    };
    window.addEventListener('mbell_template_loaded', handleTemplateLoaded);
    return () => {
      window.removeEventListener('mbell_template_loaded', handleTemplateLoaded);
    };
  }, [publishedThemeId]);

  // Handler Implementasikan Template Aktif
  const handleImplementActiveTemplate = () => {
    setActiveTab('edit-undangan');
    if (setSaveToast) {
      setSaveToast({
        show: true,
        message: 'Lanjut mengedit template aktif',
        type: 'info',
      });
    }
  };

  // Handler Sinkronisasi Jadwal Acara, Tanggal & Hitung Mundur Real-time
  const handleEventsChange = (events: any, targetCountdown?: 'akad' | 'resepsi') => {
    const isArray = Array.isArray(events);
    const activeTarget = targetCountdown || formData.countdown_target || 'akad';

    let primaryEvent;
    if (isArray) {
      primaryEvent = activeTarget === 'resepsi' ? (events[1] || events[0]) : events[0];
    } else {
      primaryEvent = activeTarget === 'resepsi' ? (events?.resepsi || events?.akad) : (events?.akad || events?.resepsi);
    }

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
      countdown_target: activeTarget,
      wedding_date_iso: updatedIso,
      wedding_date_display: updatedDisplay,
    }));
  };

  const handleSetCountdownTarget = (target: 'akad' | 'resepsi') => {
    handleEventsChange(formData.events, target);
    if (setSaveToast) {
      setSaveToast({
        show: true,
        message: `Hitungan mundur diatur ke ${target === 'resepsi' ? 'Resepsi Pernikahan' : 'Akad Nikah'}`,
        type: 'info',
      });
    }
  };

  // Handler Buat Undangan / Template Baru dari Preset
  const handleAddNewTemplate = (themeId: string) => {
    handleThemeChange(themeId, true);
    setCurrentTemplateRecordId(null);
    setActiveTab('edit-undangan');
    setActiveStep(1);
    if (setSaveToast) {
      setSaveToast({
        show: true,
        message: `Preset tema ${themeId.toUpperCase()} siap diedit!`,
        isError: false,
      });
    }
  };

  // Handler Pengubahan Alamat Tautan Undangan (Slug) dengan Sinkronisasi Database Instan
  const handleSlugChange = async (newSlug: string) => {
    const cleanSlug = newSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    if (!cleanSlug) return;

    const oldSlug = formData.slug || computeCoupleSlug(formData.groom?.name, formData.bride?.name) || 'undangan-baru';
    const updatedFormData = { ...formData, slug: cleanSlug };
    setFormData(updatedFormData);

    if (setIsSaving) setIsSaving(true);
    try {
      const template_id = THEME_TO_TEMPLATE_ID[formData.theme_id || 'modern'] || 'template1';
      const coupleTitle = `Pernikahan ${formData.groom?.name || 'Mempelai Pria'} & ${formData.bride?.name || 'Mempelai Wanita'}`;
      const resolvedMusicUrl = formData.music_url || themeConfig.music_url || '';
      const resolvedMusicType = Boolean(extractYouTubeId(resolvedMusicUrl)) ? 'youtube' : 'mp3';

      const effectiveStatus = (formData.status || 'draft') as any;

      // 1. Update/Upsert di public.invitations
      const safeDbTemplateId = getSafeDbTemplateId(formData.theme_id);
      const invPayload = {
        user_id: user?.id || null,
        template_id: safeDbTemplateId,
        slug: cleanSlug,
        content: updatedFormData,
        theme_config: themeConfig,
        status: effectiveStatus,
        music_url: resolvedMusicUrl,
        music_type: resolvedMusicType,
        updated_at: new Date().toISOString(),
      };

      // Coba perbarui row dengan slug lama atau slug baru
      const { data: existingInv } = await supabase
        .from('invitations')
        .select('id')
        .or(`slug.eq.${cleanSlug},slug.eq.${oldSlug}`)
        .maybeSingle();

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

      if (setLastSaved) setLastSaved(new Date());
      if (setSaveToast) {
        setSaveToast({
          show: true,
          message: `Alamat tautan berhasil diubah & disinkronkan: /${cleanSlug}`,
          isError: false,
        });
      }
    } catch (err: any) {
      console.warn('Slug change sync error:', err);
      if (setSaveToast) {
        setSaveToast({
          show: true,
          message: `Alamat tautan diubah ke: /${cleanSlug}`,
          isError: false,
        });
      }
    } finally {
      if (setIsSaving) setIsSaving(false);
      if (setSaveToast) {
        setTimeout(() => setSaveToast(null), 3500);
      }
    }
  };

  // Handler Step Selection
  const handleSelectStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  // Handler Next Step
  const handleNextStep = () => {
    if (activeStep < 6) {
      setActiveStep((prev) => prev + 1);
    }
  };

  // Handler Previous Step
  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Theme Change Handler
  const handleThemeChange = (newThemeId: string, forcePreset = false) => {
    const semanticId = TEMPLATE_ID_TO_THEME[newThemeId] || newThemeId;
    const currentTheme = formData.theme_id || 'modern';
    if (!forcePreset && currentTheme === semanticId) {
      return;
    }

    // Deteksi apakah user kembali memilih template yang saat ini sedang LIVE / PUBLISHED
    const effectiveLiveTheme = publishedThemeId || liveBaselineRef.current?.theme_id;
    const isReturningToLive = Boolean(
      effectiveLiveTheme &&
      (semanticId === effectiveLiveTheme || (liveBaselineRef.current && liveBaselineRef.current.formData.theme_id === semanticId))
    );

    if (isReturningToLive && !forcePreset) {
      const restoredForm: InvitationData = liveBaselineRef.current
        ? JSON.parse(JSON.stringify(liveBaselineRef.current.formData))
        : {
            ...formData,
            theme_id: semanticId as any,
            status: 'published',
            is_paid: true,
          };
      const restoredConfig: ThemeConfig = liveBaselineRef.current
        ? JSON.parse(JSON.stringify(liveBaselineRef.current.themeConfig))
        : (MOCK_THEME_CONFIG_MAP[semanticId] || DEFAULT_THEME_CONFIGS[semanticId] || themeConfig);

      setFormData(restoredForm);
      setThemeConfig(restoredConfig);

      try {
        localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(restoredForm));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(restoredConfig));
        const activeSlug = restoredForm.slug || computeCoupleSlug(restoredForm.groom?.name, restoredForm.bride?.name);
        if (activeSlug) {
          localStorage.setItem(`mbell_cached_inv_${activeSlug}`, JSON.stringify({
            templateId: getSafeDbTemplateId(semanticId),
            invitationData: restoredForm,
            themeConfig: restoredConfig,
          }));
        }
      } catch (e) {}

      // Dispatch mbell_template_loaded agar useDashboardSave mereset baseline & unsavedCount ke 0
      window.dispatchEvent(
        new CustomEvent('mbell_template_loaded', {
          detail: {
            formData: restoredForm,
            themeConfig: restoredConfig,
          },
        })
      );
      return;
    }

    const matchedConfig = MOCK_THEME_CONFIG_MAP[semanticId] || DEFAULT_THEME_CONFIGS[semanticId] || themeConfig;
    const thematicData = MOCK_THEME_DATA_MAP[semanticId];

    // Deteksi cerdas: apakah form masih memakai nama demo/bawaan template
    const currentGroom = (formData.groom?.name || '').toLowerCase().trim();
    const currentBride = (formData.bride?.name || '').toLowerCase().trim();
    const isUsingDemoContent =
      !currentGroom ||
      !currentBride ||
      DEMO_KEYWORDS.some((kw) => currentGroom.includes(kw)) ||
      DEMO_KEYWORDS.some((kw) => currentBride.includes(kw));

    // Pertahankan status template yang sudah dibeli dan status pembayaran agar badge 'Sudah Dibeli' tidak hilang saat ganti tema
    const currentUnlocked = (Array.isArray(formData.unlocked_templates) && formData.unlocked_templates.length > 0)
      ? formData.unlocked_templates
      : (() => {
          try {
            const raw = localStorage.getItem('mbell_pending_draft_formData');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed?.unlocked_templates) && parsed.unlocked_templates.length > 0) {
                return parsed.unlocked_templates;
              }
            }
          } catch (e) {}
          return [];
        })();

    const currentIsPaid = formData.is_paid ?? (() => {
      try {
        const raw = localStorage.getItem('mbell_pending_draft_formData');
        if (raw) {
          const parsed = JSON.parse(raw);
          return Boolean(parsed?.is_paid);
        }
      } catch (e) {}
      return false;
    })();

    const currentPaidTpl = formData.paid_template_id || (() => {
      try {
        const raw = localStorage.getItem('mbell_pending_draft_formData');
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?.paid_template_id || null;
        }
      } catch (e) {}
      return null;
    })();

    let updatedData: InvitationData;
    if ((isUsingDemoContent || forcePreset) && thematicData) {
      const gName = (thematicData.groom?.name || '').trim();
      const bName = (thematicData.bride?.name || '').trim();
      const dynamicSlug = computeCoupleSlug(gName, bName) || 'undangan-baru';
      updatedData = {
        ...thematicData,
        id: formData.id,
        slug: formData.slug || dynamicSlug,
        status: formData.status || 'draft',
        theme_id: semanticId as any,
        unlocked_templates: currentUnlocked,
        paid_template_id: currentPaidTpl,
        is_paid: currentIsPaid,
        paid_at: formData.paid_at || null,
      };
      setFormData(updatedData);
    } else {
      updatedData = {
        ...formData,
        theme_id: semanticId as any,
        unlocked_templates: currentUnlocked,
        paid_template_id: currentPaidTpl,
        is_paid: currentIsPaid,
      };
      setFormData(updatedData);
    }
    setThemeConfig(matchedConfig);

    // Sinkronkan cache lokal seketika agar saat membuka tab publik link langsung menampilkan tema baru
    const activeSlug = updatedData.slug || computeCoupleSlug(updatedData.groom?.name, updatedData.bride?.name);
    const safeDbTpl = getSafeDbTemplateId(semanticId);
    if (activeSlug) {
      try {
        localStorage.setItem(`mbell_cached_inv_${activeSlug}`, JSON.stringify({
          templateId: safeDbTpl,
          invitationData: updatedData,
          themeConfig: matchedConfig,
        }));
        localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(updatedData));
        localStorage.setItem('mbell_pending_draft_themeConfig', JSON.stringify(matchedConfig));
      } catch (e) {}

      // Jika tema yang dipilih sudah berstatus dibeli (unlocked) atau undangan published,
      // langsung lakukan sinkronisasi diam-diam (silent-sync) ke database Supabase
      const isUnlocked = isTemplateUnlocked(
        semanticId,
        updatedData.unlocked_templates,
        updatedData.paid_template_id,
        updatedData.is_paid
      );

      if (isUnlocked) {
        (async () => {
          try {
            await supabase
              .from('invitations')
              .update({
                template_id: safeDbTpl,
                content: updatedData,
                theme_config: matchedConfig,
                updated_at: new Date().toISOString(),
              })
              .eq('slug', activeSlug);

            if (currentTemplateRecordId) {
              await supabase
                .from('user_templates')
                .update({
                  template_id: safeDbTpl,
                  theme_id: semanticId,
                  content: updatedData,
                  theme_config: matchedConfig,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', currentTemplateRecordId);
            }
          } catch (err) {
            console.warn('Silent theme switch sync notice:', err);
          }
        })();
      }
    }
  };

  const handleApplyPreset = (themeId: string) => {
    handleThemeChange(themeId, true);
  };

  return {
    // State
    formData,
    setFormData,
    themeConfig,
    setThemeConfig,
    activeTab,
    setActiveTab,
    currentTemplateRecordId,
    setCurrentTemplateRecordId,
    activeStep,
    setActiveStep,
    loading,
    showFullscreenModal,
    setShowFullscreenModal,
    showConfirmPublishModal,
    setShowConfirmPublishModal,
    showAuthGateModal,
    setShowAuthGateModal,
    showPricingModal,
    setShowPricingModal,
    showOpeningSplash,
    setShowOpeningSplash,
    publishedThemeId,
    setPublishedThemeId,
    // Handlers
    handleSelectSavedTemplate,
    handleImplementActiveTemplate,
    handleEventsChange,
    handleSetCountdownTarget,
    handleAddNewTemplate,
    handleSlugChange,
    handleSelectStep,
    handleNextStep,
    handlePrevStep,
    handleThemeChange,
    handleApplyPreset,
  };
}
