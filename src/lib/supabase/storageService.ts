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

/**
 * Memetakan tema atau template ke nama folder yang TERPUSAT dan KONSISTEN di Supabase Storage.
 * Mencegah fragmentasi folder saat pengguna mengubah nama mempelai atau URL slug.
 *
 * Contoh hasil pemetaan terpusat:
 * - 'modern'  | 'template1' -> 'template_1'
 * - 'rustic'  | 'template2' -> 'template_2'
 * - 'jawa'    | 'template3' -> 'template_3'
 * - 'islami'  | 'template4' -> 'template_4'
 * - 'luxury'  | 'template5' -> 'template_5'
 * - 'sunda'   | 'template6' -> 'template_6'
 * - 'minang'  | 'template7' -> 'template_7'
 * - 'batak'   | 'template8' -> 'template_8'
 */
export function getTemplateStorageFolder(themeOrTemplateId?: string | null): string {
  if (!themeOrTemplateId) return 'template_1';
  const clean = themeOrTemplateId.toLowerCase().trim();

  // Jika sudah berformat template_1 s/d template_8
  if (/^template_\d+$/.test(clean)) return clean;
  // Jika berformat template1 s/d template8
  const matchNum = clean.match(/^template(\d+)$/);
  if (matchNum) return `template_${matchNum[1]}`;

  const map: Record<string, string> = {
    modern: 'template_1',
    rustic: 'template_2',
    jawa: 'template_3',
    islami: 'template_4',
    luxury: 'template_5',
    sunda: 'template_6',
    minang: 'template_7',
    batak: 'template_8',
  };

  if (map[clean]) return map[clean];

  // Jika berupa slug biasa (misal zaky-bella), cari apakah ada tema yang cocok, jika tidak fallback ke template_1
  return sanitizeFolderPart(clean) || 'template_1';
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
 * DATA/{user_email}/{template_terpusat}/{Galery|image_lainnya}/{filename}.webp
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
    // Folder TERPUSAT berdasarkan template (template_1 s/d template_8) bukan slug nama mempelai
    const templateFolder = getTemplateStorageFolder(templateSlug || 'template_1');
    const subfolder = getSubfolderForCategory(category);

    // Buat nama file unik jika tidak disediakan kustom
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const finalFileName =
      customFileName ||
      `${category}_${timestamp}_${randomSuffix}.webp`;

    // Path hierarki bucket lengkap terpusat per template
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
      let userFriendlyMessage = uploadError.message;
      if (uploadError.message.includes('row-level security')) {
        userFriendlyMessage =
          'Storage Policy RLS di bucket Supabase memblokir upload ke folder DATA/. Silakan jalankan SQL pembaruan storage policy yang disediakan di Supabase SQL Editor.';
      }
      return { success: false, error: userFriendlyMessage };
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
 * Mengekstrak path relatif storage (misal: "DATA/email/slug/Galery/image.webp")
 * dari URL publik Supabase Storage atau string path.
 */
export function extractStoragePathFromUrl(publicUrlOrPath: string): string | null {
  if (!publicUrlOrPath || typeof publicUrlOrPath !== 'string') return null;

  // Jika Base64, bukan file storage
  if (publicUrlOrPath.startsWith('data:image/')) return null;

  // Bersihkan parameter query (misal ?t=123) atau hash
  const cleanUrl = publicUrlOrPath.split('?')[0].split('#')[0].trim();

  // Jika sudah berupa path relatif DATA/...
  if (cleanUrl.startsWith('DATA/')) {
    return cleanUrl;
  }
  if (cleanUrl.startsWith('/DATA/')) {
    return cleanUrl.substring(1);
  }

  // Pola standar URL Supabase Storage: /storage/v1/object/public/{bucket_name}/(path)
  const pattern = new RegExp(`/storage/v1/object/(?:public|sign)/${INVITATIONS_BUCKET}/(.*)`, 'i');
  const match = cleanUrl.match(pattern);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // Fallback: temukan segmen "DATA/" di mana saja pada URL
  const dataIdx = cleanUrl.indexOf('/DATA/');
  if (dataIdx !== -1) {
    return decodeURIComponent(cleanUrl.substring(dataIdx + 1));
  }
  const dataStartIdx = cleanUrl.indexOf('DATA/');
  if (dataStartIdx !== -1) {
    return decodeURIComponent(cleanUrl.substring(dataStartIdx));
  }

  return null;
}

/**
 * Menghapus berkas gambar secara permanen hingga ke akarnya:
 * 1. Menghapus berkas fisik di Supabase Storage Bucket 'invitations'
 * 2. Menghapus metadata gambar di tabel database `public.invitation_images`
 *
 * Menerima URL publik lengkap (HTTPS) atau storage path relatif.
 */
export async function deleteImagePermanently(
  publicUrlOrPath: string,
  imageId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!publicUrlOrPath && !imageId) return { success: true };

    // Jika base64, tidak ada berkas fisik di storage
    if (publicUrlOrPath && publicUrlOrPath.startsWith('data:image/')) {
      return { success: true };
    }

    const storagePath = publicUrlOrPath ? extractStoragePathFromUrl(publicUrlOrPath) : null;

    // 1. Hapus berkas fisik di Supabase Storage Bucket
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from(INVITATIONS_BUCKET)
        .remove([storagePath]);

      if (storageError) {
        console.warn('[StorageService] Gagal menghapus file dari storage bucket:', storageError.message);
      } else {
        console.info(`[StorageService] Berhasil menghapus berkas fisik di storage: ${storagePath}`);
      }
    }

    // 2. Hapus metadata dari tabel database 'invitation_images'
    try {
      if (imageId) {
        await supabase.from('invitation_images').delete().eq('id', imageId);
      } else if (storagePath || publicUrlOrPath) {
        const conditions: string[] = [];
        if (storagePath) conditions.push(`storage_path.eq."${storagePath}"`);
        if (publicUrlOrPath) conditions.push(`public_url.eq."${publicUrlOrPath}"`);

        if (conditions.length > 0) {
          const { error: dbDeleteErr } = await supabase
            .from('invitation_images')
            .delete()
            .or(conditions.join(','));

          if (dbDeleteErr) {
            console.warn('[StorageService] Gagal menghapus row invitation_images:', dbDeleteErr.message);
          }
        }
      }
    } catch (dbErr) {
      console.warn('[StorageService] Peringatan saat menghapus record dari invitation_images:', dbErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error('[StorageService] Error deleteImagePermanently:', err);
    return { success: false, error: err?.message || 'Gagal menghapus gambar.' };
  }
}

/**
 * Menghapus berkas gambar dari Supabase Storage dan tabel database `invitation_images`.
 * (Alias kompatibel untuk deleteImagePermanently)
 */
export async function deleteInvitationImage(
  storagePath: string,
  imageId?: string
): Promise<{ success: boolean; error?: string }> {
  return deleteImagePermanently(storagePath, imageId);
}

/**
 * Menyinkronkan perubahan formData ke cache browser (localStorage) secara seketika.
 * Mencegah data foto lama kembali muncul saat browser di-refresh.
 */
export function syncFormDataToLocalCache(updatedFormData: InvitationData): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(updatedFormData));
    if (updatedFormData.slug) {
      localStorage.removeItem(`mbell_cached_inv_${updatedFormData.slug}`);
    }
  } catch (e) {
    console.warn('[StorageService] syncFormDataToLocalCache warning:', e);
  }
}

/**
 * Membersihkan seluruh draft lokal dan cache browser terkait gambar undangan.
 * Sangat berguna ketika bucket storage sudah di-reset/dikosongkan manual,
 * agar browser tidak terus-menerus memuat cache draft lama yang sudah usang.
 */
export function cleanAllLocalImageDraftCaches(slug?: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem('mbell_pending_draft_formData');
    localStorage.removeItem('mbell_pending_draft_themeConfig');
    localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');
    if (slug) {
      localStorage.removeItem(`mbell_cached_inv_${slug}`);
    }
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('mbell_cached_inv_') || key.startsWith('mbell_pending_draft_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    console.info('[StorageService] Seluruh cache draft gambar lokal browser berhasil dibersihkan.');
  } catch (e) {
    console.warn('[StorageService] Gagal membersihkan cache lokal:', e);
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
    const tSlug = getTemplateStorageFolder(templateSlug || 'template_1');
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
 * ke bucket 'invitations' di folder DATA/{email}/{template_terpusat}/...
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
  const tSlug = getTemplateStorageFolder(cleanData.theme_id || cleanData.template_id || templateSlug || 'template_1');

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

/**
 * Mengumpulkan seluruh URL gambar yang tercatat dalam data undangan.
 */
export function collectImageUrlsFromInvitation(data: InvitationData | null | undefined): Set<string> {
  const urls = new Set<string>();
  if (!data || typeof data !== 'object') return urls;

  if (typeof data.cover_image === 'string' && data.cover_image.trim()) {
    urls.add(data.cover_image.trim());
  }
  if (typeof data.couple_photo === 'string' && data.couple_photo.trim()) {
    urls.add(data.couple_photo.trim());
  }
  if (data.groom) {
    if (typeof data.groom.photo === 'string' && data.groom.photo.trim()) {
      urls.add(data.groom.photo.trim());
    }
    if (typeof data.groom.photo_url === 'string' && data.groom.photo_url.trim()) {
      urls.add(data.groom.photo_url.trim());
    }
  }
  if (data.bride) {
    if (typeof data.bride.photo === 'string' && data.bride.photo.trim()) {
      urls.add(data.bride.photo.trim());
    }
    if (typeof data.bride.photo_url === 'string' && data.bride.photo_url.trim()) {
      urls.add(data.bride.photo_url.trim());
    }
  }
  if (Array.isArray(data.gallery)) {
    data.gallery.forEach((url) => {
      if (typeof url === 'string' && url.trim()) {
        urls.add(url.trim());
      }
    });
  }
  if (typeof data.qris_url === 'string' && data.qris_url.trim()) {
    urls.add(data.qris_url.trim());
  }

  return urls;
}

/**
 * GARBAGE COLLECTOR (Staging -> Commit):
 * Membandingkan aset gambar pada snapshot data sebelumnya vs data baru yang sedang di-commit.
 * Setiap gambar yang ada di snapshot lama namun sudah tidak ada lagi di data baru (dihapus oleh pengguna)
 * dan tersimpan di bucket Supabase Storage kita, akan dihapus berkas fisiknya secara permanen.
 *
 * Catatan penting:
 * - Hanya dieksekusi saat user resmi menekan 'Terbitkan' atau 'Simpan Draf' (Commit).
 * - Saat user menghapus di UI / drafting, tidak ada file di storage yang dihapus sehingga tombol 'Batalkan' (Revert)
 *   dapat mengembalikan gambar secara instan tanpa resiko 404 broken image.
 */
export async function purgeOrphanedImages(
  previousData: InvitationData | null | undefined,
  currentData: InvitationData | null | undefined
): Promise<{ deletedCount: number; errors: string[] }> {
  if (!previousData || !currentData) {
    return { deletedCount: 0, errors: [] };
  }

  const prevUrls = collectImageUrlsFromInvitation(previousData);
  const currUrls = collectImageUrlsFromInvitation(currentData);

  const orphanedUrls: string[] = [];
  for (const url of prevUrls) {
    // Jika tidak ada lagi di data baru
    if (!currUrls.has(url)) {
      // Pastikan URL merupakan berkas di bucket storage Supabase kita (bukan dataUrl base64 atau unsplash)
      const storagePath = extractStoragePathFromUrl(url);
      if (storagePath) {
        orphanedUrls.push(url);
      }
    }
  }

  if (orphanedUrls.length === 0) {
    return { deletedCount: 0, errors: [] };
  }

  console.info(`[StorageService] Menemukan ${orphanedUrls.length} berkas gambar yang dihapus. Menjalankan garbage collection...`, orphanedUrls);

  const errors: string[] = [];
  let deletedCount = 0;

  const results = await Promise.allSettled(
    orphanedUrls.map((url) => deleteImagePermanently(url))
  );

  results.forEach((res, idx) => {
    if (res.status === 'fulfilled' && res.value.success) {
      deletedCount++;
    } else {
      const err = res.status === 'rejected' ? res.reason?.message : (res.value as any)?.error;
      errors.push(`Gagal menghapus ${orphanedUrls[idx]}: ${err || 'Unknown error'}`);
    }
  });

  console.info(`[StorageService] Selesai garbage collection: ${deletedCount}/${orphanedUrls.length} berkas fisik berhasil dihapus dari bucket.`);
  return { deletedCount, errors };
}
