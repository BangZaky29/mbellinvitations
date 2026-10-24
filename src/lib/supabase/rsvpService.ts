import { supabase } from './client';
import type { SupabaseGuestRecord } from './types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Submit RSVP via RPC function submit_rsvp (Smart Update for known guest, or Insert with random guest_code)
 */
export async function submitRsvp(
  invitationId: string,
  name: string,
  status: string,
  pax: number = 1,
  notes: string = '',
  guestCode?: string
): Promise<{ success: boolean; guest?: SupabaseGuestRecord; message?: string }> {
  try {
    let resolvedId: string | null = null;

    if (UUID_REGEX.test(invitationId)) {
      // 1. Cek apakah UUID ini ada di public.invitations
      const { data: directInv } = await supabase
        .from('invitations')
        .select('id')
        .eq('id', invitationId)
        .maybeSingle();

      if (directInv?.id) {
        resolvedId = directInv.id;
      } else {
        // 2. Mungkin ini ID dari user_templates!
        const { data: utRow } = await supabase
          .from('user_templates')
          .select('id, slug, user_id, template_id, content, theme_config')
          .eq('id', invitationId)
          .maybeSingle();

        if (utRow) {
          const { data: invBySlug } = await supabase
            .from('invitations')
            .select('id')
            .eq('slug', utRow.slug)
            .maybeSingle();

          if (invBySlug?.id) {
            resolvedId = invBySlug.id;
          } else {
            // Buat row di invitations agar foreign key constraint tabel guests terpenuhi
            const { data: createdInv } = await supabase
              .from('invitations')
              .insert({
                user_id: utRow.user_id,
                template_id: utRow.template_id || 'template1',
                slug: utRow.slug,
                status: 'published',
                content: utRow.content || {},
                theme_config: utRow.theme_config || {},
              })
              .select('id')
              .maybeSingle();
            if (createdInv?.id) resolvedId = createdInv.id;
          }
        }
      }
    }

    // 3. Jika belum ditemukan, cari berdasarkan slug
    if (!resolvedId) {
      const { data: invRow } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', invitationId)
        .maybeSingle();

      if (invRow?.id) {
        resolvedId = invRow.id;
      } else {
        const { data: utRow } = await supabase
          .from('user_templates')
          .select('id, slug, user_id, template_id, content, theme_config')
          .eq('slug', invitationId)
          .maybeSingle();

        if (utRow) {
          const { data: createdInv } = await supabase
            .from('invitations')
            .insert({
              user_id: utRow.user_id,
              template_id: utRow.template_id || 'template1',
              slug: utRow.slug,
              status: 'published',
              content: utRow.content || {},
              theme_config: utRow.theme_config || {},
            })
            .select('id')
            .maybeSingle();
          if (createdInv?.id) resolvedId = createdInv.id;
        }
      }
    }

    // 4. Jika tetap tidak ada record di database (demo simulator / offline mock):
    if (!resolvedId) {
      return {
        success: true,
        message: 'Konfirmasi kehadiran berhasil dicatat (Mode Demo)',
        guest: {
          id: `mock-${Date.now()}`,
          invitation_id: invitationId,
          name: name.trim(),
          guest_code: guestCode || Math.random().toString(36).substring(2, 8).toLowerCase(),
          rsvp_status: status.toLowerCase() as any,
          rsvp_pax: pax || 1,
          rsvp_notes: notes || '',
          created_at: new Date().toISOString(),
        } as any,
      };
    }

    const { data, error } = await supabase.rpc('submit_rsvp', {
      p_invitation_id: resolvedId,
      p_name: name,
      p_status: status.toLowerCase(),
      p_pax: pax,
      p_notes: notes,
      p_guest_code: guestCode || null,
    });

    if (error) {
      console.warn('[Supabase] submitRsvp RPC error, trying direct table fallback:', error.message);
      const fallbackCode = Math.random().toString(36).substring(2, 8).toLowerCase();
      const { data: directGuest, error: directError } = await supabase
        .from('guests')
        .insert({
          invitation_id: resolvedId,
          name: name.trim(),
          rsvp_status: status.toLowerCase(),
          rsvp_pax: pax || 1,
          rsvp_notes: notes || '',
          guest_code: guestCode || fallbackCode,
          category: 'Umum',
        })
        .select('*')
        .single();

      if (!directError && directGuest) {
        return { success: true, guest: directGuest as any, message: 'Konfirmasi kehadiran berhasil disimpan' };
      }
      return { success: false, message: error.message };
    }

    return {
      success: data.success,
      guest: data.guest,
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
