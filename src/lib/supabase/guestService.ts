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
