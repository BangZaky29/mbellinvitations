import { supabase } from './client';
import type { SupabaseInvitationRecord } from './types';
import { THEME_TO_TEMPLATE_ID, TEMPLATE_ID_TO_THEME } from '../../pages/dashboard/constants/themeMapping';

/**
 * Fetch invitation data by slug (Dual-sync: prioritizes latest customized version from user_templates or invitations)
 */
export async function fetchInvitationBySlug(slug: string): Promise<SupabaseInvitationRecord | null> {
  // 1. Fetch record from public.invitations
  const { data: invData } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  // 2. Fetch record from public.user_templates (where user saves their active/published templates)
  const { data: utData } = await supabase
    .from('user_templates')
    .select('*')
    .eq('slug', slug)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

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
  const primarySource = effectiveUt || invData;
  const effectiveTheme =
    (invData?.status === 'published' ? (invData.content?.theme_id || invData.template_id) : null) ||
    (effectiveUt?.status === 'published' ? (effectiveUt.theme_id || effectiveUt.content?.theme_id || effectiveUt.template_id) : null) ||
    primarySource?.theme_id ||
    primarySource?.content?.theme_id ||
    'jawa';

  const resolvedTplId =
    (effectiveTheme === 'sunda' || primarySource?.template_id === 'template6' || primarySource?.template_id === 'sunda')
      ? 'template6'
      : (THEME_TO_TEMPLATE_ID[effectiveTheme] || primarySource?.template_id || 'template3');

  // 5. Konsolidasi Unlocked Templates dari seluruh sumber (kolom tabel & content json)
  const allUnlocked = Array.from(
    new Set([
      ...(Array.isArray(effectiveUt?.unlocked_templates) ? effectiveUt.unlocked_templates : []),
      ...(Array.isArray(effectiveUt?.content?.unlocked_templates) ? effectiveUt.content.unlocked_templates : []),
      ...(Array.isArray(invData?.unlocked_templates) ? invData.unlocked_templates : []),
      ...(Array.isArray(invData?.content?.unlocked_templates) ? invData.content.unlocked_templates : []),
      effectiveUt?.paid_template_id,
      effectiveUt?.content?.paid_template_id,
      invData?.paid_template_id,
      invData?.content?.paid_template_id,
      // Jika statusnya published, tema yang sedang terbit secara hukum sah dibeli / unlocked
      ...(isPublished ? [effectiveTheme, resolvedTplId, TEMPLATE_ID_TO_THEME[resolvedTplId]] : []),
    ].filter(Boolean))
  );

  const isPaid = isPublished || Boolean(effectiveUt?.is_paid || invData?.is_paid || effectiveUt?.content?.is_paid || invData?.content?.is_paid);
  const paidTemplateId =
    effectiveUt?.paid_template_id ||
    invData?.paid_template_id ||
    effectiveUt?.content?.paid_template_id ||
    invData?.content?.paid_template_id ||
    (isPublished ? resolvedTplId : null);

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
    ...(invData?.content || {}),
    ...(effectiveUt?.content || {}),
    theme_id: effectiveTheme,
    status: isPublished ? 'published' : ((effectiveUt?.status || invData?.status || 'draft') as any),
    unlocked_templates: allUnlocked,
    is_paid: isPaid,
    paid_template_id: paidTemplateId,
  };

  const primaryId = invData?.id || effectiveUt?.id;
  const altId = effectiveUt?.id !== primaryId ? effectiveUt?.id : (invData?.id !== primaryId ? invData?.id : undefined);

  return {
    id: primaryId,
    alternate_id: altId,
    user_id: effectiveUt?.user_id || invData?.user_id,
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

