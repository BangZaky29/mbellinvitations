import type { InvitationData, ThemeConfig, AnimationConfig } from '../../types/invitation';

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
  animation_config?: AnimationConfig;
  views_count: number;
  alternate_id?: string;
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
  animation_config?: AnimationConfig;
  thumbnail_url: string | null;
  music_url?: string | null;
  music_type?: string;
  created_at?: string;
  updated_at?: string;
}
