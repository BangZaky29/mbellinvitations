import React, { useState, useEffect } from 'react';
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
  cleanDraftSlug,
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
          // 1. Cek terlebih dahulu apakah ada template tersimpan di user_templates milik user ini
          const savedActiveId = localStorage.getItem('mbell_active_template_id');
          let userTemplateQuery = supabase
            .from('user_templates')
            .select('*')
            .eq('user_id', currentUser.id)
            .neq('slug', 'raditya-jessica');

          if (savedActiveId) {
            userTemplateQuery = userTemplateQuery.eq('id', savedActiveId);
          } else {
            userTemplateQuery = userTemplateQuery.order('updated_at', { ascending: false }).limit(1);
          }

          const { data: userTemplateData } = await userTemplateQuery.maybeSingle();

          // KASUS A: User SUDAH memiliki template tersimpan di database
          if (
            userTemplateData &&
            userTemplateData.slug !== 'raditya-jessica' &&
            !(userTemplateData.title || '').toLowerCase().includes('raditya')
          ) {
            setCurrentTemplateRecordId(userTemplateData.id);
            localStorage.setItem('mbell_active_template_id', userTemplateData.id);

            const isDbPublished = userTemplateData.status === 'published';
            const dbPublishedTheme = (userTemplateData.theme_id ||
              userTemplateData.content?.theme_id ||
              (userTemplateData.template_id ? TEMPLATE_ID_TO_THEME[userTemplateData.template_id] : null) ||
              'modern') as any;

            // Jika status di database adalah published, WAJIB pertahankan status LIVE dan tema live-nya
            if (isDbPublished) {
              setPublishedThemeId(dbPublishedTheme);
            } else {
              setPublishedThemeId(null);
            }

            const loadedContent = (userTemplateData.content && typeof userTemplateData.content === 'object')
              ? userTemplateData.content
              : {};
            const gName = (loadedContent.groom?.name || '').trim();
            const bName = (loadedContent.bride?.name || '').trim();
            const coupleSlug = computeCoupleSlug(gName, bName);
            const rawSlug = userTemplateData.slug || loadedContent.slug || coupleSlug || 'undangan-baru';
            const effectiveSlug = isDbPublished
              ? getCanonicalPublishedSlug(rawSlug, gName, bName)
              : (rawSlug || coupleSlug || 'undangan-baru');

            // Jika record sudah published tapi slug di database masih memiliki suffix -draf, auto-heal ke slug kanonikal resmi
            if (isDbPublished && userTemplateData.slug && userTemplateData.slug !== effectiveSlug) {
              supabase
                .from('user_templates')
                .update({ slug: effectiveSlug })
                .eq('id', userTemplateData.id)
                .then();
              supabase
                .from('invitations')
                .update({ slug: effectiveSlug })
                .eq('slug', userTemplateData.slug)
                .then();
            }

            // Cek apakah ada perubahan belum disimpan di localStorage (misal user sedang coba preview tema lain)
            const hasUnsavedDraft = localStorage.getItem('mbell_pending_draft_hasUnsavedEdits') === 'true';
            const savedDraftFormDataStr = localStorage.getItem('mbell_pending_draft_formData');
            const savedDraftThemeConfigStr = localStorage.getItem('mbell_pending_draft_themeConfig');

            // Kolom tabel database (user_templates) adalah Single Source of Truth
            const dbHasUnlockedCol = Array.isArray(userTemplateData.unlocked_templates);
            const dbUnlocked: string[] = dbHasUnlockedCol
              ? userTemplateData.unlocked_templates
              : (Array.isArray(loadedContent.unlocked_templates) ? loadedContent.unlocked_templates : []);

            const effectiveIsPaid = Boolean(userTemplateData.is_paid ?? (isDbPublished ? true : (loadedContent.is_paid || false)));
            const effectivePaidTplId = effectiveIsPaid
              ? (userTemplateData.paid_template_id || loadedContent.paid_template_id || (isDbPublished ? dbPublishedTheme : null))
              : null;

            const effectiveUnlocked = effectiveIsPaid
              ? Array.from(new Set([...dbUnlocked, effectivePaidTplId].filter(Boolean)))
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
                  status: isDbPublished ? 'published' : (userTemplateData.status || 'draft'),
                  // Jika tema di draft berbeda, biarkan editor menampilkan preview tema tersebut
                  theme_id: pendingFormData.theme_id || dbPublishedTheme,
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

            // Jika tidak ada unsaved draft atau parse gagal, gunakan data resmi dari database
            setFormData({
              ...MOCK_MODERN_DATA,
              ...loadedContent,
              slug: effectiveSlug,
              status: isDbPublished ? 'published' : (userTemplateData.status || 'draft'),
              theme_id: dbPublishedTheme,
              unlocked_templates: effectiveUnlocked,
              is_paid: effectiveIsPaid,
              paid_template_id: effectivePaidTplId,
              ...(userTemplateData.music_url ? { music_url: userTemplateData.music_url } : {}),
            });

            if (userTemplateData.theme_config && typeof userTemplateData.theme_config === 'object') {
              setThemeConfig({
                ...userTemplateData.theme_config,
                ...(userTemplateData.music_url ? { music_url: userTemplateData.music_url } : {}),
              });
            }
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
    } else {
      setPublishedThemeId(null);
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
      };
      setFormData(updatedData);
    } else {
      updatedData = { ...formData, theme_id: semanticId as any };
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
        formData.unlocked_templates,
        formData.paid_template_id,
        formData.is_paid
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
