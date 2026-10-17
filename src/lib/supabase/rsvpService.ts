import { supabase } from './client';
import type { SupabaseGuestRecord } from './types';

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
    const { data, error } = await supabase.rpc('submit_rsvp', {
      p_invitation_id: invitationId,
      p_name: name,
      p_status: status.toLowerCase(),
      p_pax: pax,
      p_notes: notes,
      p_guest_code: guestCode || null,
    });

    if (error) {
      console.error('[Supabase] submitRsvp RPC error:', error);
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
