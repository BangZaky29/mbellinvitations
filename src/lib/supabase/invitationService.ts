import { supabase } from './client';
import type { SupabaseInvitationRecord } from './types';

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

  // 3. Smart reconciliation: If user_templates has a customized version (e.g. Adat Jawa by user)
  // and the invitations row is either missing, unowned demo (user_id IS NULL), or older:
  if (utData) {
    const isUtNewer =
      !invData?.updated_at ||
      (utData.updated_at && new Date(utData.updated_at) >= new Date(invData.updated_at));
    const isDemoUnowned = invData && !invData.user_id;

    if (isUtNewer || isDemoUnowned) {
      const primaryId = invData?.id || utData.id;
      const altId = utData.id !== primaryId ? utData.id : (invData?.id !== primaryId ? invData?.id : undefined);

      const animConfig =
        utData.animation_config ||
        utData.theme_config?.animation_config ||
        invData?.animation_config ||
        invData?.theme_config?.animation_config;

      const baseThemeConfig = utData.theme_config || invData?.theme_config || {};
      const mergedThemeConfig = {
        ...baseThemeConfig,
        ...(animConfig ? { animation_config: animConfig } : {}),
      };

      const effectiveTheme = utData.theme_id || utData.content?.theme_id || invData?.content?.theme_id || '';
      const resolvedTplId =
        (effectiveTheme === 'sunda' || utData.template_id === 'template6' || utData.template_id === 'sunda')
          ? 'template6'
          : (utData.template_id || (effectiveTheme === 'jawa' ? 'template3' : effectiveTheme === 'rustic' ? 'template2' : effectiveTheme === 'islami' ? 'template4' : effectiveTheme === 'luxury' ? 'template5' : 'template1'));

      return {
        id: primaryId,
        alternate_id: altId,
        user_id: utData.user_id,
        template_id: resolvedTplId,
        slug: utData.slug,
        custom_domain: null,
        status: (utData.status as any) || 'published',
        storage_path: null,
        theme_config: mergedThemeConfig,
        content: utData.content || invData?.content,
        animation_config: animConfig,
        views_count: invData?.views_count || 0,
        created_at: utData.created_at || new Date().toISOString(),
        updated_at: utData.updated_at || new Date().toISOString(),
      };
    }
  }

  if (!invData) {
    // Cek fallback jika slug lama dibuka atau baru diubah: ambil template terbaru yang aktif/terbit
    const { data: latestUt } = await supabase
      .from('user_templates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestUt) {
      const animConfig = latestUt.animation_config || latestUt.theme_config?.animation_config;
      const mergedThemeConfig = {
        ...(latestUt.theme_config || {}),
        ...(animConfig ? { animation_config: animConfig } : {}),
      };

      return {
        id: latestUt.id,
        user_id: latestUt.user_id,
        template_id: latestUt.template_id || 'template1',
        slug: latestUt.slug,
        custom_domain: null,
        status: (latestUt.status as any) || 'published',
        storage_path: null,
        theme_config: mergedThemeConfig,
        content: latestUt.content,
        animation_config: animConfig,
        views_count: 0,
        created_at: latestUt.created_at || new Date().toISOString(),
        updated_at: latestUt.updated_at || new Date().toISOString(),
      };
    }

    console.warn(`[Supabase] Invitation slug "${slug}" not found in invitations or user_templates`);
    return null;
  }

  const animConfig = invData.animation_config || invData.theme_config?.animation_config;
  if (animConfig && invData.theme_config) {
    invData.theme_config.animation_config = animConfig;
  }

  const effectiveTheme = invData.content?.theme_id || (invData as any).theme_id || '';
  const resolvedTemplateId =
    (effectiveTheme === 'sunda' || invData.template_id === 'template6' || invData.template_id === 'sunda')
      ? 'template6'
      : (invData.template_id || (effectiveTheme === 'jawa' ? 'template3' : effectiveTheme === 'rustic' ? 'template2' : effectiveTheme === 'islami' ? 'template4' : effectiveTheme === 'luxury' ? 'template5' : 'template1'));

  return {
    ...invData,
    template_id: resolvedTemplateId,
    animation_config: animConfig,
  } as SupabaseInvitationRecord;
}
