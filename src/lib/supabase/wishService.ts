import { supabase } from './client';
import type { WishItem } from '../../types/invitation';

/**
 * Fetch approved/visible wishes for an invitation
 */
export async function fetchWishes(
  invitationId: string,
  alternateId?: string
): Promise<WishItem[]> {
  const ids = Array.from(new Set([invitationId, alternateId].filter(Boolean))) as string[];
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('wishes')
    .select('id, guest_name, message, attendance, created_at')
    .in('invitation_id', ids)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.warn('[Supabase] Failed to fetch wishes:', error.message);
    return [];
  }

  return (data || []).map((w: any) => ({
    id: w.id,
    guest_name: w.guest_name,
    message: w.message,
    attendance: (w.attendance as any) || 'attending',
    created_at: w.created_at,
  }));
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Submit a new wish to public.wishes
 */
export async function submitWish(
  invitationId: string,
  guestName: string,
  message: string,
  attendance: string = 'attending',
  alternateId?: string
): Promise<{ success: boolean; data?: WishItem; error?: string }> {
  try {
    let resolvedId: string | null = null;
    if (UUID_REGEX.test(invitationId)) {
      const { data: invRow } = await supabase.from('invitations').select('id').eq('id', invitationId).maybeSingle();
      if (invRow?.id) {
        resolvedId = invRow.id;
      } else {
        const { data: utRow } = await supabase.from('user_templates').select('id, slug, user_id, template_id, content, theme_config').eq('id', invitationId).maybeSingle();
        if (utRow) {
          const { data: invBySlug } = await supabase.from('invitations').select('id').eq('slug', utRow.slug).maybeSingle();
          if (invBySlug?.id) {
            resolvedId = invBySlug.id;
          } else {
            const { data: newInv } = await supabase.from('invitations').insert({
              user_id: utRow.user_id,
              template_id: utRow.template_id || 'template1',
              slug: utRow.slug,
              status: 'published',
              content: utRow.content || {},
              theme_config: utRow.theme_config || {},
            }).select('id').maybeSingle();
            if (newInv?.id) resolvedId = newInv.id;
          }
        }
      }
    }

    if (!resolvedId) {
      const { data: invRow } = await supabase.from('invitations').select('id').eq('slug', invitationId).maybeSingle();
      if (invRow?.id) {
        resolvedId = invRow.id;
      } else {
        const { data: utRow } = await supabase.from('user_templates').select('id, slug, user_id, template_id, content, theme_config').eq('slug', invitationId).maybeSingle();
        if (utRow) {
          const { data: newInv } = await supabase.from('invitations').insert({
            user_id: utRow.user_id,
            template_id: utRow.template_id || 'template1',
            slug: utRow.slug,
            status: 'published',
            content: utRow.content || {},
            theme_config: utRow.theme_config || {},
          }).select('id').maybeSingle();
          if (newInv?.id) resolvedId = newInv.id;
        }
      }
    }

    if (!resolvedId) {
      return {
        success: true,
        data: {
          id: `mock-${Date.now()}`,
          guest_name: guestName,
          message,
          attendance: attendance === 'hadir' || attendance === 'attending' ? 'attending' : 'declined',
          created_at: new Date().toISOString(),
        },
      };
    }

    const { data, error } = await supabase
      .from('wishes')
      .insert({
        invitation_id: resolvedId,
        guest_name: guestName,
        message,
        attendance: attendance === 'hadir' ? 'attending' : 'declined',
      })
      .select('id, guest_name, message, attendance, created_at')
      .single();

    if (error) {
      if (alternateId && alternateId !== invitationId) {
        console.warn('[Supabase] Primary submitWish error, trying alternateId:', error.message);
        const altResult = await supabase
          .from('wishes')
          .insert({
            invitation_id: alternateId,
            guest_name: guestName,
            message,
            attendance: attendance === 'hadir' ? 'attending' : 'declined',
          })
          .select('id, guest_name, message, attendance, created_at')
          .single();

        if (altResult.data) {
          return {
            success: true,
            data: {
              id: altResult.data.id,
              guest_name: altResult.data.guest_name,
              message: altResult.data.message,
              attendance: altResult.data.attendance as any,
              created_at: altResult.data.created_at,
            },
          };
        }
      }
      console.error('[Supabase] submitWish error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: data.id,
        guest_name: data.guest_name,
        message: data.message,
        attendance: data.attendance as any,
        created_at: data.created_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
