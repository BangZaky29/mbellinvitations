import { supabase } from './client';
import type { WishItem } from '../../types/invitation';

/**
 * Fetch approved/visible wishes for an invitation
 */
export async function fetchWishes(invitationId: string): Promise<WishItem[]> {
  const { data, error } = await supabase
    .from('wishes')
    .select('id, guest_name, message, attendance, created_at')
    .eq('invitation_id', invitationId)
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

/**
 * Submit a new wish to public.wishes
 */
export async function submitWish(
  invitationId: string,
  guestName: string,
  message: string,
  attendance: string = 'attending'
): Promise<{ success: boolean; data?: WishItem; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .insert({
        invitation_id: invitationId,
        guest_name: guestName,
        message,
        attendance: attendance === 'hadir' ? 'attending' : 'declined',
      })
      .select('id, guest_name, message, attendance, created_at')
      .single();

    if (error) {
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
