import { createClient } from '@supabase/supabase-js';
import type { InvitationData, ThemeConfig, WishItem } from '../types/invitation';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseInvitationRecord {
  id: string;
  user_id: string | null;
  template_id: string;
  slug: string;
  custom_domain: string | null;
  status: 'draft' | 'published' | 'archived';
  storage_path: string | null;
  theme_config: ThemeConfig;
  content: InvitationData;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseGuestRecord {
  id: string;
  invitation_id: string;
  guest_code: string;
  name: string;
  phone_number: string | null;
  category: string;
  pax_allocated: number;
  rsvp_status: 'pending' | 'hadir' | 'tidak_hadir' | 'ragu';
  rsvp_pax: number;
  rsvp_notes: string | null;
  rsvp_at: string | null;
  is_checked_in: boolean;
  checked_in_at: string | null;
}

/**
 * Fetch invitation data by slug
 */
export async function fetchInvitationBySlug(slug: string): Promise<SupabaseInvitationRecord | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.warn(`[Supabase] Invitation slug "${slug}" not found:`, error?.message);
    return null;
  }

  return data as SupabaseInvitationRecord;
}

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

export interface UserTemplateRecord {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template_id: string;
  theme_id: string;
  status: 'draft' | 'published' | 'archived';
  content: InvitationData;
  theme_config: ThemeConfig;
  thumbnail_url: string | null;
  music_url?: string | null;
  music_type?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all saved templates for a given user
 */
export async function fetchUserTemplates(userId: string): Promise<UserTemplateRecord[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_templates')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchUserTemplates error:', error.message);
      return [];
    }
    return (data || []) as UserTemplateRecord[];
  } catch (err) {
    console.error('[Supabase] fetchUserTemplates exception:', err);
    return [];
  }
}

/**
 * Save or update a user template in user_templates table
 */
export async function saveUserTemplate(
  payload: Partial<UserTemplateRecord> & { user_id: string; slug: string }
): Promise<{ success: boolean; data?: UserTemplateRecord; error?: string }> {
  try {
    const now = new Date().toISOString();
    const record = {
      ...payload,
      updated_at: now,
    };

    let result;
    if (payload.id) {
      result = await supabase
        .from('user_templates')
        .update(record)
        .eq('id', payload.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('user_templates')
        .insert({
          ...record,
          created_at: now,
        })
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.data as UserTemplateRecord };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a user template by id
 */
export async function deleteUserTemplate(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_templates')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
