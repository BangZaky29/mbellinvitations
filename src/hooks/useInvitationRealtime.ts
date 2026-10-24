import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  fetchInvitationBySlug,
  fetchWishes,
  submitWish,
  submitRsvp,
  fetchGuestInfo,
  type SupabaseInvitationRecord,
  type SupabaseGuestRecord,
} from '../lib/supabaseClient';
import type { InvitationData, ThemeConfig, WishItem } from '../types/invitation';
import {
  MOCK_MODERN_DATA,
  MOCK_MODERN_THEME,
  MOCK_MODERN_WISHES,
  MOCK_THEME_WISHES_MAP,
} from '../data/mockInvitation';
import { DEFAULT_ANIMATION_CONFIG } from '../types/invitation';
import { TEMPLATE_ID_TO_THEME, THEME_TO_TEMPLATE_ID } from '../pages/dashboard/constants/themeMapping';
import { applyAnimationConfigStyles } from '../utils/scrollAnimationEngine';

export interface UseInvitationRealtimeOptions {
  slug?: string;
  guestParam?: string | null;  // dari ?to=Nama
  codeParam?: string | null;   // dari ?g=Code
  requestedTheme?: string | null; // dari /:themeSlug/:slug atau ?theme=
}

// Helper untuk inisialisasi state awal secara instan (zero-delay) dari cache atau URL slug
function getInitialRealtimeState(slug: string, guestParam?: string | null, codeParam?: string | null, requestedTheme?: string | null) {
  // 1. Coba dari cache lokal khusus slug ini
  try {
    const cachedStr = typeof window !== 'undefined' ? localStorage.getItem(`mbell_cached_inv_${slug}`) : null;
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (parsed && (parsed.invitationData || parsed.content)) {
        const rawContent = parsed.invitationData || parsed.content;
        const effectiveTheme = requestedTheme || rawContent.theme_id || parsed.theme_id || '';
        const resolvedTplId =
          effectiveTheme === 'batak'
            ? 'template8'
            : effectiveTheme === 'minang'
            ? 'template7'
            : effectiveTheme === 'sunda'
            ? 'template6'
            : (THEME_TO_TEMPLATE_ID[effectiveTheme] || parsed.templateId || 'template1');
        return {
          templateId: resolvedTplId,
          invitationData: {
            ...rawContent,
            guest_name: guestParam || rawContent.guest_name || 'Tamu Undangan',
            guest_code: codeParam || rawContent.guest_code || undefined,
          },
          themeConfig: parsed.themeConfig || parsed.theme_config || MOCK_MODERN_THEME,
          wishes: parsed.wishes || MOCK_MODERN_WISHES,
          invitationRecord: parsed.invitationRecord || null,
        };
      }
    }
  } catch (e) {}

  // 2. Fallback cerdas: Ambil nama mempelai dari slug URL (contoh "zaky-bella" -> "Zaky" & "Bella")
  let gName = MOCK_MODERN_DATA.groom?.name;
  let bName = MOCK_MODERN_DATA.bride?.name;
  if (slug && slug !== 'demo' && slug !== 'raditya-jessica') {
    const parts = slug.split('-');
    if (parts.length >= 2) {
      const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      gName = cap(parts[0]);
      bName = cap(parts.slice(1).join(' '));
    }
  }

  return {
    templateId: 'template1',
    invitationData: {
      ...MOCK_MODERN_DATA,
      groom: { ...MOCK_MODERN_DATA.groom, name: gName },
      bride: { ...MOCK_MODERN_DATA.bride, name: bName },
      guest_name: guestParam || 'Tamu Undangan',
      guest_code: codeParam || undefined,
    },
    themeConfig: MOCK_MODERN_THEME,
    wishes: MOCK_MODERN_WISHES,
    invitationRecord: null,
  };
}

export function useInvitationRealtime({
  slug = 'raditya-jessica',
  guestParam,
  codeParam,
  requestedTheme,
}: UseInvitationRealtimeOptions) {
  const initial = getInitialRealtimeState(slug, guestParam, codeParam, requestedTheme);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invitation record & template ID
  const [invitationRecord, setInvitationRecord] = useState<SupabaseInvitationRecord | null>(initial.invitationRecord);
  const [templateId, setTemplateId] = useState<string>(initial.templateId);
  const [invitationData, setInvitationData] = useState<InvitationData>(initial.invitationData);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(initial.themeConfig);

  // Guest state (for personalized link and QR code)
  const [guestRecord, setGuestRecord] = useState<SupabaseGuestRecord | null>(null);
  const [activeGuestName, setActiveGuestName] = useState<string>(guestParam || initial.invitationData.guest_name || '');
  const [activeGuestCode, setActiveGuestCode] = useState<string>(codeParam || '');

  // Wishes state
  const [wishes, setWishes] = useState<WishItem[]>(initial.wishes);
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // 1. Initial Load: Fetch Invitation & Wishes
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // If explicitly 'demo', use mock immediately
        if (slug === 'demo') {
          if (isMounted) {
            setInvitationData({
              ...MOCK_MODERN_DATA,
              guest_name: guestParam || MOCK_MODERN_DATA.guest_name || 'Tamu Undangan',
              guest_code: codeParam || undefined,
            });
            setThemeConfig(MOCK_MODERN_THEME);
            setWishes(MOCK_MODERN_WISHES);
            setLoading(false);
          }
          return;
        }

        // Fetch from Supabase
        const inv = await fetchInvitationBySlug(slug);

        if (inv && isMounted) {
          setInvitationRecord(inv);
          const rawTheme = requestedTheme || (inv.content?.theme_id || (inv as any).theme_id || inv.template_id || '') as string;
          const effectiveTheme = TEMPLATE_ID_TO_THEME[rawTheme] || rawTheme;
          const resolvedTemplateId =
            effectiveTheme === 'batak'
              ? 'template8'
              : effectiveTheme === 'minang'
              ? 'template7'
              : effectiveTheme === 'sunda'
              ? 'template6'
              : (THEME_TO_TEMPLATE_ID[effectiveTheme] || inv.template_id || 'template1');
          setTemplateId(resolvedTemplateId);

          // Merge content with guest name & code serta status dan kepemilikan template
          const mergedData: InvitationData = {
            ...inv.content,
            status: inv.status || inv.content?.status || 'draft',
            unlocked_templates: inv.unlocked_templates || inv.content?.unlocked_templates || [],
            paid_template_id: inv.paid_template_id || inv.content?.paid_template_id || null,
            is_paid: inv.is_paid ?? inv.content?.is_paid ?? false,
            guest_name: guestParam || inv.content?.guest_name || 'Tamu Undangan',
            guest_code: codeParam || undefined,
          };
          setInvitationData(mergedData);

          const resolvedAnim =
            inv.animation_config ||
            inv.theme_config?.animation_config ||
            (inv.content as any)?.theme_config?.animation_config ||
            DEFAULT_ANIMATION_CONFIG;

          const mergedTheme: ThemeConfig = {
            ...(inv.theme_config || MOCK_MODERN_THEME),
            animation_config: resolvedAnim,
          };

          setThemeConfig(mergedTheme);
          applyAnimationConfigStyles(resolvedAnim);

          // Fetch guest info if code is provided
          if (codeParam) {
            const guest = await fetchGuestInfo(inv.id, codeParam);
            if (guest && isMounted) {
              setGuestRecord(guest);
              setActiveGuestName(guest.name);
              setActiveGuestCode(guest.guest_code);
              setInvitationData((prev) => ({
                ...prev,
                guest_name: guest.name,
                guest_code: guest.guest_code,
              }));
            }
          }

          // Fetch Live Wishes with multi-ID support (inv.id + inv.alternate_id)
          const liveWishes = await fetchWishes(inv.id, inv.alternate_id);
          const currentTplId = inv.template_id || 'template1';
          const themeKey = TEMPLATE_ID_TO_THEME[currentTplId] || currentTplId;
          const themeDefaultWishes = (MOCK_THEME_WISHES_MAP as any)[themeKey] || MOCK_MODERN_WISHES;

          if (isMounted) {
            setWishes(liveWishes.length > 0 ? liveWishes : themeDefaultWishes);
          }

          // Simpan ke cache lokal agar kunjungan berikutnya instan tanpa jeda
          try {
            localStorage.setItem(`mbell_cached_inv_${slug}`, JSON.stringify({
              templateId: resolvedTemplateId,
              invitationData: mergedData,
              themeConfig: mergedTheme,
              wishes: liveWishes.length > 0 ? liveWishes : themeDefaultWishes,
              invitationRecord: inv,
            }));
          } catch (e) {}
        } else if (isMounted) {
          // Fallback to mock data if slug not yet inserted in Supabase
          console.info(`[Invitation] Slug "${slug}" not found in database, using graceful mock fallback.`);
          setInvitationData({
            ...MOCK_MODERN_DATA,
            guest_name: guestParam || 'Tamu Undangan',
            guest_code: codeParam || undefined,
          });
          setThemeConfig(MOCK_MODERN_THEME);
          setWishes(MOCK_MODERN_WISHES);
        }
      } catch (err: any) {
        console.error('[Invitation] Error loading data:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug, guestParam, codeParam]);

  // 2. Realtime Subscription: Listen for new wishes live (supports both primary and alternate IDs)
  useEffect(() => {
    const invId = invitationRecord?.id;
    const alternateId = invitationRecord?.alternate_id;
    if (!invId) return;

    const channel = supabase
      .channel(`realtime-invitation-sync-${invId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wishes',
        },
        (payload) => {
          const newWish = payload.new as any;
          if (
            newWish &&
            !newWish.is_hidden &&
            (newWish.invitation_id === invId || (alternateId && newWish.invitation_id === alternateId))
          ) {
            const formatted: WishItem = {
              id: newWish.id,
              guest_name: newWish.guest_name,
              message: newWish.message,
              attendance: newWish.attendance || 'attending',
              created_at: newWish.created_at,
            };

            setWishes((prev) => {
              // Bersihkan mock wishes saat ucapan nyata pertama masuk
              const isAllMocks = prev.every((w) => w.id === '1' || w.id === '2' || w.id === '3' || w.id.startsWith('sunda-wish-'));
              const base = isAllMocks ? [] : prev;
              if (base.some((w) => w.id === formatted.id)) return base;
              return [formatted, ...base];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invitations',
          filter: `id=eq.${invId}`,
        },
        (payload) => {
          const updated = payload.new as SupabaseInvitationRecord;
          if (updated) {
            setInvitationRecord(updated);
            const rawTheme = requestedTheme || (updated.content?.theme_id || (updated as any).theme_id || updated.template_id || '') as string;
            const effectiveTheme = TEMPLATE_ID_TO_THEME[rawTheme] || rawTheme;
            const resolvedTemplateId =
              effectiveTheme === 'batak'
                ? 'template8'
                : effectiveTheme === 'minang'
                ? 'template7'
                : effectiveTheme === 'sunda'
                ? 'template6'
                : (THEME_TO_TEMPLATE_ID[effectiveTheme] || updated.template_id || 'template1');
            setTemplateId(resolvedTemplateId);
            if (updated.content && typeof updated.content === 'object') {
              setInvitationData((prev) => ({
                ...prev,
                ...updated.content,
                guest_name: activeGuestName || updated.content.guest_name || prev.guest_name,
                guest_code: activeGuestCode || updated.content.guest_code || prev.guest_code,
              }));
            }
            if (updated.theme_config && typeof updated.theme_config === 'object') {
              const anim =
                updated.theme_config?.animation_config ||
                (updated as any).animation_config;
              setThemeConfig(updated.theme_config);
              if (anim) {
                applyAnimationConfigStyles(anim);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationRecord?.id, invitationRecord?.alternate_id, activeGuestName, activeGuestCode]);

  // 3. Handler Submit Wish
  const handleSendWish = useCallback(
    async (name: string, message: string, attendance: string = 'hadir') => {
      const invId = invitationRecord?.id || 'a0000000-0000-0000-0000-000000000001';
      const alternateId = invitationRecord?.alternate_id;
      setIsSubmittingWish(true);

      try {
        const res = await submitWish(invId, name, message, attendance, alternateId);
        if (res.success && res.data) {
          setWishes((prev) => {
            const isAllMocks = prev.every((w) => w.id === '1' || w.id === '2' || w.id === '3' || w.id.startsWith('sunda-wish-'));
            const base = isAllMocks ? [] : prev;
            if (base.some((w) => w.id === res.data!.id)) return base;
            return [res.data!, ...base];
          });
          return { success: true };
        } else {
          // Fallback optimistic for offline/demo
          const optimisticWish: WishItem = {
            id: `local-${Date.now()}`,
            guest_name: name,
            message,
            attendance: attendance === 'hadir' ? 'attending' : 'declined',
            created_at: new Date().toISOString(),
          };
          setWishes((prev) => {
            const isAllMocks = prev.every((w) => w.id === '1' || w.id === '2' || w.id === '3' || w.id.startsWith('sunda-wish-'));
            const base = isAllMocks ? [] : prev;
            return [optimisticWish, ...base];
          });
          return { success: true, localOnly: true };
        }
      } finally {
        setIsSubmittingWish(false);
      }
    },
    [invitationRecord?.id, invitationRecord?.alternate_id]
  );

  // 4. Handler Submit RSVP
  const handleSendRsvp = useCallback(
    async (name: string, status: string, pax: number = 1, notes: string = '') => {
      const invId = invitationRecord?.id || 'a0000000-0000-0000-0000-000000000001';
      setIsSubmittingRsvp(true);

      try {
        const res = await submitRsvp(invId, name, status, pax, notes, activeGuestCode);
        if (res.success && res.guest) {
          setGuestRecord(res.guest);
          setActiveGuestCode(res.guest.guest_code);
          setActiveGuestName(res.guest.name);
          setInvitationData((prev) => ({
            ...prev,
            guest_name: res.guest!.name,
            guest_code: res.guest!.guest_code,
          }));
          return { success: true, guest: res.guest, message: res.message };
        }
        return { success: false, message: res.message };
      } finally {
        setIsSubmittingRsvp(false);
      }
    },
    [invitationRecord?.id, activeGuestCode]
  );

  return {
    loading,
    error,
    invitationRecord,
    templateId,
    setTemplateId,
    invitationData,
    themeConfig,
    wishes,
    guestRecord,
    activeGuestName,
    activeGuestCode,
    isSubmittingWish,
    isSubmittingRsvp,
    handleSendWish,
    handleSendRsvp,
  };
}

export default useInvitationRealtime;
