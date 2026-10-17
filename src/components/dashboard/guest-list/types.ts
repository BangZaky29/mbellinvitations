export interface GuestItem {
  id: string;
  invitation_id?: string;
  guest_code: string;
  name: string;
  phone_number?: string | null;
  category?: string;
  pax_allocated?: number;
  rsvp_status: 'hadir' | 'tidak_hadir' | 'ragu' | 'pending';
  rsvp_pax?: number;
  rsvp_notes?: string;
  created_at: string;
}

import type { InvitationData } from '../../../types/invitation';
import type { UserTemplateRecord } from '../../../lib/supabaseClient';

export interface GuestListPanelProps {
  userId?: string | null;
  invitationId?: string | null;
  invitationSlug?: string;
  coupleNames?: string;
  currentFormData?: InvitationData;
  activeTemplateId?: string | null;
  onGoToEditor: () => void;
  onOpenMyTemplates?: () => void;
  onOpenAuthGate?: () => void;
  onSelectSavedTemplate?: (template: UserTemplateRecord, stayOnCurrentTab?: boolean) => void;
}

export interface ParsedGuest {
  name: string;
  phoneNumber?: string;
}
