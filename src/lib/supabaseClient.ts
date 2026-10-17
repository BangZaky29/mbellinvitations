// Backward compatibility re-export barrel from modular domain services in ./supabase
export {
  supabase,
  type SupabaseInvitationRecord,
  type SupabaseGuestRecord,
  type UserTemplateRecord,
  fetchInvitationBySlug,
  fetchGuestInfo,
  fetchWishes,
  submitWish,
  submitRsvp,
  fetchUserTemplates,
  saveUserTemplate,
  deleteUserTemplate,
  purgeRadityaJessica,
} from './supabase';
