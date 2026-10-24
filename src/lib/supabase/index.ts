// Client
export { supabase } from './client';

// Types
export type {
  SupabaseTemplateRecord,
  SupabaseInvitationRecord,
  SupabaseGuestRecord,
  UserTemplateRecord,
  ImageCategory,
  InvitationImageRecord,
} from './types';

// Services
export { fetchInvitationBySlug } from './invitationService';
export { fetchGuestInfo, updateGuestWaStatus } from './guestService';
export { fetchWishes, submitWish } from './wishService';
export { submitRsvp } from './rsvpService';
export {
  fetchUserTemplates,
  saveUserTemplate,
  deleteUserTemplate,
  purgeRadityaJessica,
} from './userTemplateService';
export {
  INVITATIONS_BUCKET,
  uploadInvitationImage,
  deleteInvitationImage,
  deleteImagePermanently,
  extractStoragePathFromUrl,
  syncFormDataToLocalCache,
  cleanAllLocalImageDraftCaches,
  fetchInvitationImages,
  initializeUserTemplateStorage,
  getStorageFolderForUser,
  sanitizeFolderPart,
  getSubfolderForCategory,
  getTemplateStorageFolder,
  sanitizeAndUploadBase64InFormData,
  dataUrlToBlob,
  purgeOrphanedImages,
  collectImageUrlsFromInvitation,
} from './storageService';
export { runBase64Migration, containsBase64 } from './migrateBase64ToStorage';

