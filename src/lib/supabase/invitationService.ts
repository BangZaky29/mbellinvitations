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

      return {
        id: primaryId,
        alternate_id: altId,
        user_id: utData.user_id,
        template_id: utData.template_id || 'template1',
        slug: utData.slug,
        custom_domain: null,
        status: (utData.status as any) || 'published',
        storage_path: null,
        theme_config: utData.theme_config || invData?.theme_config,
        content: utData.content || invData?.content,
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
      return {
        id: latestUt.id,
        user_id: latestUt.user_id,
        template_id: latestUt.template_id || 'template1',
        slug: latestUt.slug,
        custom_domain: null,
        status: (latestUt.status as any) || 'published',
        storage_path: null,
        theme_config: latestUt.theme_config,
        content: latestUt.content,
        views_count: 0,
        created_at: latestUt.created_at || new Date().toISOString(),
        updated_at: latestUt.updated_at || new Date().toISOString(),
      };
    }

    console.warn(`[Supabase] Invitation slug "${slug}" not found in invitations or user_templates`);
    return null;
  }

  return invData as SupabaseInvitationRecord;
}
