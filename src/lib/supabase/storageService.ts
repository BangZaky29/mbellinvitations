import { supabase } from './client';
import type { ImageCategory, InvitationImageRecord } from './types';
import type { InvitationData } from '../../types/invitation';

export const INVITATIONS_BUCKET = 'invitations';

/**
 * Sanitasi string agar aman dijadikan nama folder/file di Supabase Storage (S3 compatible)
 * Contoh: "zaky.pratama@gmail.com" -> "zaky_pratama_gmail_com"
 */
export function sanitizeFolderPart(text: string): string {
  if (!text) return 'default';
  return text
    .toLowerCase()
    .trim()
    .replace(/[@.]/g, '_') // Ganti @ dan . dengan underscore
    .replace(/[^a-z0-9_-]/g, '_') // Hapus karakter selain alfanumerik, underscore, dan dash
    .replace(/_+/g, '_'); // Rapikan underscore ganda
}

/**
 * Mendapatkan nama folder owner utama di bawah folder /DATA/
 * Memprioritaskan email pengguna, atau fallback ke user ID singkat jika email tidak tersedia.
 */
export function getStorageFolderForUser(email?: string | null, userId?: string | null): string {
  if (email && email.trim().length > 0) {
    return sanitizeFolderPart(email);
  }
  if (userId && userId.trim().length > 0) {
    return `user_${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}`;
  }
  return 'user_general';
}

/**
 * Mengelompokkan subfolder berdasarkan kategori gambar sesuai struktur bucket:
 * - 'gallery' -> 'Galery'
 * - 'cover', 'groom', 'bride', 'couple', 'thumbnail', 'qris' -> 'image_lainnya'
 */
export function getSubfolderForCategory(category: ImageCategory): string {
  if (category === 'gallery') {
    return 'Galery';
  }
  return 'image_lainnya';
}

export interface UploadInvitationImageParams {
  file: File | Blob;
  userId: string;
  userEmail?: string | null;
  templateSlug?: string | null;
  category: ImageCategory;
  userTemplateId?: string | null;
  invitationId?: string | null;
  customFileName?: string;
  displayOrder?: number;
}

export interface UploadImageResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  record?: InvitationImageRecord | null;
  error?: string;
}

/**
 * Mengunggah berkas gambar (WebP biner) ke Supabase Storage Bucket 'invitations'
 * dan mencatat entri aset ke tabel database `public.invitation_images`.
 *
 * Path yang dihasilkan:
 * DATA/{user_email}/{template_slug}/{Galery|image_lainnya}/{filename}.webp
 */
export async function uploadInvitationImage({
  file,
  userId,
  userEmail,
  templateSlug,
  category,
  userTemplateId,
  invitationId,
  customFileName,
  displayOrder = 0,
}: UploadInvitationImageParams): Promise<UploadImageResult> {
  if (!file) {
    return { success: false, error: 'Berkas gambar tidak ditemukan.' };
  }
  if (!userId) {
    return { success: false, error: 'User ID wajib disertakan untuk mengunggah gambar.' };
  }

  try {
    const ownerFolder = getStorageFolderForUser(userEmail, userId);
    const templateFolder = sanitizeFolderPart(templateSlug || 'template_1');
    const subfolder = getSubfolderForCategory(category);

    // Buat nama file unik jika tidak disediakan kustom
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const finalFileName =
      customFileName ||
      `${category}_${timestamp}_${randomSuffix}.webp`;

    // Path hierarki bucket lengkap
    const storagePath = `DATA/${ownerFolder}/${templateFolder}/${subfolder}/${finalFileName}`;

    // 1. Upload biner WebP ke Supabase Storage Bucket 'invitations'
    const { error: uploadError } = await supabase.storage
      .from(INVITATIONS_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type || 'image/webp',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('[StorageService] Gagal upload file ke bucket:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // 2. Ambil URL Publik permanen dari Supabase Storage
    const { data: publicUrlData } = supabase.storage
      .from(INVITATIONS_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Catat metadata gambar ke tabel database 'public.invitation_images'
    let dbRecord: InvitationImageRecord | null = null;
    try {
      const { data: inserted, error: dbError } = await supabase
        .from('invitation_images')
        .insert({
          user_id: userId,
          user_template_id: userTemplateId || null,
          invitation_id: invitationId || null,
          category,
          file_name: finalFileName,
          storage_path: storagePath,
          public_url: publicUrl,
          file_size: file.size || 0,
          mime_type: file.type || 'image/webp',
          display_order: displayOrder,
        })
        .select()
        .single();

      if (dbError) {
        console.warn(
          '[StorageService] File berhasil di-upload ke bucket, namun gagal mencatat ke invitation_images:',
          dbError.message
        );
      } else {
        dbRecord = inserted as InvitationImageRecord;
      }
    } catch (insertCatch) {
      console.warn('[StorageService] Peringatan saat mencatat ke tabel invitation_images:', insertCatch);
    }

    return {
      success: true,
      publicUrl,
      storagePath,
      record: dbRecord,
    };
  } catch (err: any) {
    console.error('[StorageService] Terjadi kesalahan tak terduga saat upload gambar:', err);
    return {
      success: false,
      error: err?.message || 'Terjadi kesalahan sistem saat mengunggah gambar.',
    };
  }
}

/**
 * Menghapus berkas gambar dari Supabase Storage dan tabel database `invitation_images`.
 */
export async function deleteInvitationImage(
  storagePath: string,
  imageId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from(INVITATIONS_BUCKET)
        .remove([storagePath]);

      if (storageError) {
        console.warn('[StorageService] Gagal menghapus file dari storage:', storageError.message);
      }
    }

    if (imageId) {
      const { error: dbError } = await supabase
        .from('invitation_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        console.warn('[StorageService] Gagal menghapus record dari invitation_images:', dbError.message);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('[StorageService] Error deleting image:', err);
    return { success: false, error: err?.message || 'Gagal menghapus gambar.' };
  }
}

/**
 * Mengambil daftar gambar terdata dari tabel `invitation_images`
 */
export async function fetchInvitationImages(filter: {
  userId?: string;
  userTemplateId?: string;
  invitationId?: string;
  category?: ImageCategory;
}): Promise<InvitationImageRecord[]> {
  try {
    let query = supabase
      .from('invitation_images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (filter.userTemplateId) {
      query = query.eq('user_template_id', filter.userTemplateId);
    } else if (filter.invitationId) {
      query = query.eq('invitation_id', filter.invitationId);
    } else if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }

    if (filter.category) {
      query = query.eq('category', filter.category);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[StorageService] Gagal fetch invitation_images:', error.message);
      return [];
    }

    return (data || []) as InvitationImageRecord[];
  } catch (err) {
    console.error('[StorageService] Unexpected error fetching invitation_images:', err);
    return [];
  }
}

/**
 * Inisialisasi struktur folder awal untuk akun / template baru
 * Membuat file penanda .keep di subfolder Galery dan image_lainnya
 */
export async function initializeUserTemplateStorage(
  userId: string,
  userEmail: string,
  templateSlug: string
): Promise<void> {
  try {
    const ownerFolder = getStorageFolderForUser(userEmail, userId);
    const tSlug = sanitizeFolderPart(templateSlug || 'template_1');
    const dummyBlob = new Blob(['init'], { type: 'text/plain' });

    await Promise.allSettled([
      supabase.storage
        .from(INVITATIONS_BUCKET)
        .upload(`DATA/${ownerFolder}/${tSlug}/Galery/.keep`, dummyBlob, { upsert: true }),
      supabase.storage
        .from(INVITATIONS_BUCKET)
        .upload(`DATA/${ownerFolder}/${tSlug}/image_lainnya/.keep`, dummyBlob, { upsert: true }),
    ]);
  } catch (err) {
    // Non-blocking initialization
    console.info('[StorageService] Notice initializing folder placeholders:', err);
  }
}

/**
 * Mengonversi string Base64 dataUrl (cth: "data:image/webp;base64,...") menjadi Blob biner
 */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } | null {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return null;
  }
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/webp';
    const binaryStr = atob(parts[1]);
    const len = binaryStr.length;
    const u8arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      u8arr[i] = binaryStr.charCodeAt(i);
    }
    return { blob: new Blob([u8arr], { type: mimeType }), mimeType };
  } catch (err) {
    console.warn('[StorageService] Gagal parsing dataUrl ke Blob:', err);
    return null;
  }
}

/**
 * FIREWALL & SANITIZER:
 * Memindai seluruh properti gambar dalam formData sebelum disimpan ke database Supabase.
 * Jika ditemukan string Base64 (data:image/...), otomatis dikonversi ke Blob dan diunggah
 * ke bucket 'invitations' di folder DATA/{email}/{templateSlug}/...
 *
 * Mengembalikan salinan formData yang sudah bersih (100% URL publik HTTPS).
 */
export async function sanitizeAndUploadBase64InFormData(
  formData: InvitationData,
  userId: string,
  userEmail?: string | null,
  templateSlug?: string | null
): Promise<InvitationData> {
  if (!formData || typeof formData !== 'object') return formData;

  // Clone formData agar tidak mutasi langsung
  const cleanData: InvitationData = JSON.parse(JSON.stringify(formData));
  const tSlug = templateSlug || cleanData.slug || cleanData.theme_id || 'template_1';

  // 1. Periksa foto cover
  if (cleanData.cover_image && typeof cleanData.cover_image === 'string' && cleanData.cover_image.startsWith('data:image/')) {
    const parsed = dataUrlToBlob(cleanData.cover_image);
    if (parsed) {
      const uploadRes = await uploadInvitationImage({
        file: parsed.blob,
        userId,
        userEmail,
        templateSlug: tSlug,
        category: 'cover',
      });
      if (uploadRes.success && uploadRes.publicUrl) {
        cleanData.cover_image = uploadRes.publicUrl;
      }
    }
  }

  // 2. Periksa couple_photo
  if (cleanData.couple_photo && typeof cleanData.couple_photo === 'string' && cleanData.couple_photo.startsWith('data:image/')) {
    if (cleanData.cover_image && !cleanData.cover_image.startsWith('data:image/')) {
      cleanData.couple_photo = cleanData.cover_image;
    } else {
      const parsed = dataUrlToBlob(cleanData.couple_photo);
      if (parsed) {
        const uploadRes = await uploadInvitationImage({
          file: parsed.blob,
          userId,
          userEmail,
          templateSlug: tSlug,
          category: 'couple',
        });
        if (uploadRes.success && uploadRes.publicUrl) {
          cleanData.couple_photo = uploadRes.publicUrl;
        }
      }
    }
  }

  // 3. Periksa foto Groom
  if (cleanData.groom) {
    if (cleanData.groom.photo && typeof cleanData.groom.photo === 'string' && cleanData.groom.photo.startsWith('data:image/')) {
      const parsed = dataUrlToBlob(cleanData.groom.photo);
      if (parsed) {
        const uploadRes = await uploadInvitationImage({
          file: parsed.blob,
          userId,
          userEmail,
          templateSlug: tSlug,
          category: 'groom',
        });
        if (uploadRes.success && uploadRes.publicUrl) {
          cleanData.groom.photo = uploadRes.publicUrl;
          cleanData.groom.photo_url = uploadRes.publicUrl;
        }
      }
    }
    if (cleanData.groom.photo_url && typeof cleanData.groom.photo_url === 'string' && cleanData.groom.photo_url.startsWith('data:image/')) {
      if (cleanData.groom.photo && !cleanData.groom.photo.startsWith('data:image/')) {
        cleanData.groom.photo_url = cleanData.groom.photo;
      }
    }
  }

  // 4. Periksa foto Bride
  if (cleanData.bride) {
    if (cleanData.bride.photo && typeof cleanData.bride.photo === 'string' && cleanData.bride.photo.startsWith('data:image/')) {
      const parsed = dataUrlToBlob(cleanData.bride.photo);
      if (parsed) {
        const uploadRes = await uploadInvitationImage({
          file: parsed.blob,
          userId,
          userEmail,
          templateSlug: tSlug,
          category: 'bride',
        });
        if (uploadRes.success && uploadRes.publicUrl) {
          cleanData.bride.photo = uploadRes.publicUrl;
          cleanData.bride.photo_url = uploadRes.publicUrl;
        }
      }
    }
    if (cleanData.bride.photo_url && typeof cleanData.bride.photo_url === 'string' && cleanData.bride.photo_url.startsWith('data:image/')) {
      if (cleanData.bride.photo && !cleanData.bride.photo.startsWith('data:image/')) {
        cleanData.bride.photo_url = cleanData.bride.photo;
      }
    }
  }

  // 5. Periksa array gallery
  if (Array.isArray(cleanData.gallery) && cleanData.gallery.length > 0) {
    const updatedGallery: string[] = [];
    for (let i = 0; i < cleanData.gallery.length; i++) {
      const item = cleanData.gallery[i];
      if (typeof item === 'string' && item.startsWith('data:image/')) {
        const parsed = dataUrlToBlob(item);
        if (parsed) {
          const uploadRes = await uploadInvitationImage({
            file: parsed.blob,
            userId,
            userEmail,
            templateSlug: tSlug,
            category: 'gallery',
            displayOrder: i,
          });
          if (uploadRes.success && uploadRes.publicUrl) {
            updatedGallery.push(uploadRes.publicUrl);
            continue;
          }
        }
      }
      updatedGallery.push(item);
    }
    cleanData.gallery = updatedGallery;
  }

  // 6. Periksa qris_url
  if (cleanData.qris_url && typeof cleanData.qris_url === 'string' && cleanData.qris_url.startsWith('data:image/')) {
    const parsed = dataUrlToBlob(cleanData.qris_url);
    if (parsed) {
      const uploadRes = await uploadInvitationImage({
        file: parsed.blob,
        userId,
        userEmail,
        templateSlug: tSlug,
        category: 'qris',
      });
      if (uploadRes.success && uploadRes.publicUrl) {
        cleanData.qris_url = uploadRes.publicUrl;
      }
    }
  }

  return cleanData;
}
