import { supabase } from './client';
import type { SupabaseInvitationRecord } from './types';
import { THEME_TO_TEMPLATE_ID, TEMPLATE_ID_TO_THEME } from '../../pages/dashboard/constants/themeMapping';
import { cleanDraftSlug } from '../../pages/dashboard/helpers/computeCoupleSlug';

/**
 * Fetch invitation data by slug (Dual-sync: prioritizes latest customized version from user_templates or invitations)
 */
export async function fetchInvitationBySlug(slug: string): Promise<SupabaseInvitationRecord | null> {
  const cleanedSlug = cleanDraftSlug(slug);
  const candidateSlugs = Array.from(new Set([slug, cleanedSlug].filter(Boolean)));

  // 1. Fetch record from public.invitations
  let invData: any = null;
  const { data: invMatches } = await supabase
    .from('invitations')
    .select('*')
    .in('slug', candidateSlugs)
    .order('updated_at', { ascending: false });

  if (invMatches && invMatches.length > 0) {
    invData = invMatches.find((r) => r.slug === slug) || invMatches.find((r) => r.status === 'published') || invMatches[0];
  }

  // 2. Fetch record from public.user_templates (where user saves their active/published templates)
  let utData: any = null;
  const { data: utMatches } = await supabase
    .from('user_templates')
    .select('*')
    .in('slug', candidateSlugs)
    .order('updated_at', { ascending: false });

  if (utMatches && utMatches.length > 0) {
    utData = utMatches.find((r) => r.slug === slug) || utMatches.find((r) => r.status === 'published') || utMatches[0];
  }

  let fallbackUt: any = null;
  if (!invData && !utData) {
    // Cek fallback jika slug lama dibuka atau baru diubah: ambil template terbaru yang aktif/terbit
    const { data: latestUt } = await supabase
      .from('user_templates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestUt) {
      console.warn(`[Supabase] Invitation slug "${slug}" not found in invitations or user_templates`);
      return null;
    }
    fallbackUt = latestUt;
  }

  const effectiveUt = utData || fallbackUt;

  // 3. Status Publikasi: Jika salah satu tabel (invitations ATAU user_templates) berstatus 'published',
  // maka halaman publik WAJIB dianggap LIVE ('published') untuk tamu undangan
  const isPublished = invData?.status === 'published' || effectiveUt?.status === 'published';

  // 4. Resolusi Tema Aktif yang Terbit
  // Bandingkan updated_at antara user_templates dan invitations untuk memprioritaskan yang diedit/dibeli paling terakhir
  const utTime = effectiveUt?.updated_at ? new Date(effectiveUt.updated_at).getTime() : 0;
  const invTime = invData?.updated_at ? new Date(invData.updated_at).getTime() : 0;
  const latestSource = (utTime >= invTime ? (effectiveUt || invData) : (invData || effectiveUt)) || effectiveUt || invData;
  const olderSource = latestSource === effectiveUt ? invData : effectiveUt;

  // Ambil tema: periksa theme_id pada sumber terbaru & olderSource secara ketat
  const rawTheme =
    latestSource?.content?.theme_id ||
    latestSource?.theme_id ||
    olderSource?.content?.theme_id ||
    olderSource?.theme_id ||
    latestSource?.template_id ||
    olderSource?.template_id ||
    latestSource?.paid_template_id ||
    olderSource?.paid_template_id ||
    'modern';

  const effectiveTheme = TEMPLATE_ID_TO_THEME[rawTheme] || rawTheme;

  const resolvedTplId =
    effectiveTheme === 'minang'
      ? 'template7'
      : effectiveTheme === 'sunda'
      ? 'template6'
      : (THEME_TO_TEMPLATE_ID[effectiveTheme] || THEME_TO_TEMPLATE_ID[rawTheme] || 'template3');

  // 5. Konsolidasi Unlocked Templates dari sumber resmi tabel database
  const isPaid = isPublished || Boolean(
    (effectiveUt?.is_paid !== undefined ? effectiveUt.is_paid : effectiveUt?.content?.is_paid) ||
    (invData?.is_paid !== undefined ? invData.is_paid : invData?.content?.is_paid)
  );

  const paidTemplateId = isPaid
    ? (effectiveUt?.paid_template_id || invData?.paid_template_id || effectiveUt?.content?.paid_template_id || invData?.content?.paid_template_id || (isPublished ? resolvedTplId : null))
    : null;

  const utUnlocked = Array.isArray(effectiveUt?.unlocked_templates)
    ? effectiveUt.unlocked_templates
    : (Array.isArray(effectiveUt?.content?.unlocked_templates) ? effectiveUt.content.unlocked_templates : []);
  const invUnlocked = Array.isArray(invData?.unlocked_templates)
    ? invData.unlocked_templates
    : (Array.isArray(invData?.content?.unlocked_templates) ? invData.content.unlocked_templates : []);

  const allUnlocked = isPaid
    ? Array.from(
        new Set([
          ...utUnlocked,
          ...invUnlocked,
          paidTemplateId,
          ...(isPublished ? [effectiveTheme, resolvedTplId, TEMPLATE_ID_TO_THEME[resolvedTplId]] : []),
        ].filter(Boolean))
      )
    : (Array.isArray(effectiveUt?.unlocked_templates)
        ? effectiveUt.unlocked_templates
        : (Array.isArray(invData?.unlocked_templates) ? invData.unlocked_templates : []));

  // 6. Tema & Animasi
  const baseThemeConfig = effectiveUt?.theme_config || invData?.theme_config || {};
  const animConfig =
    effectiveUt?.animation_config ||
    effectiveUt?.theme_config?.animation_config ||
    invData?.animation_config ||
    invData?.theme_config?.animation_config;

  const mergedThemeConfig = {
    ...baseThemeConfig,
    ...(animConfig ? { animation_config: animConfig } : {}),
  };

  // 7. Konten Gabungan Terpadu
  const mergedContent = {
    ...(olderSource?.content || {}),
    ...(latestSource?.content || {}),
    theme_id: effectiveTheme,
    status: isPublished ? 'published' : ((latestSource?.status || olderSource?.status || 'draft') as any),
    unlocked_templates: allUnlocked,
    is_paid: isPaid,
    paid_template_id: paidTemplateId,
  };

  const primaryId = latestSource?.id || olderSource?.id;
  const altId = olderSource?.id !== primaryId ? olderSource?.id : undefined;

  return {
    id: primaryId,
    alternate_id: altId,
    user_id: latestSource?.user_id || olderSource?.user_id,
    template_id: resolvedTplId,
    slug: slug,
    custom_domain: null,
    status: isPublished ? 'published' : ((effectiveUt?.status || invData?.status || 'draft') as any),
    storage_path: null,
    theme_config: mergedThemeConfig,
    content: mergedContent,
    animation_config: animConfig,
    views_count: invData?.views_count || 0,
    is_paid: isPaid,
    paid_template_id: paidTemplateId,
    unlocked_templates: allUnlocked,
    paid_at: effectiveUt?.paid_at || invData?.paid_at || (isPublished ? new Date().toISOString() : null),
    payment_method: effectiveUt?.payment_method || invData?.payment_method || null,
    amount_paid: effectiveUt?.amount_paid ?? invData?.amount_paid ?? 0,
    created_at: effectiveUt?.created_at || invData?.created_at || new Date().toISOString(),
    updated_at: effectiveUt?.updated_at || invData?.updated_at || new Date().toISOString(),
  } as SupabaseInvitationRecord;
}

