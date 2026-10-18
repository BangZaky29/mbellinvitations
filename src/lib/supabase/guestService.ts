import { supabase } from './client';
import type { SupabaseGuestRecord } from './types';

/**
 * Fetch guest info by guest_code or invitation_id
 */
export async function fetchGuestInfo(
  invitationId: string,
  guestCode: string
): Promise<SupabaseGuestRecord | null> {
  if (!guestCode) return null;

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('guest_code', guestCode)
    .maybeSingle();

  if (error) {
    console.warn('[Supabase] Failed to fetch guest:', error.message);
    return null;
  }

  return data as SupabaseGuestRecord | null;
}

/**
 * Update status pengiriman WhatsApp tamu di database Supabase (price.sql)
 */
export async function updateGuestWaStatus(
  guestId: string,
  isSent: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('guests')
      .update({
        is_sent: isSent,
        sent_at: isSent ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guestId);

    if (error) {
      console.warn('[Supabase] Failed to update guest WA status:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] updateGuestWaStatus exception:', err);
    return { success: false, error: err.message };
  }
}

