import { supabase } from './client';
import { sanitizeAndUploadBase64InFormData } from './storageService';
import type { InvitationData } from '../../types/invitation';

export interface MigrationReport {
  userTemplatesTotal: number;
  userTemplatesMigrated: number;
  invitationsTotal: number;
  invitationsMigrated: number;
  errors: string[];
}

/**
 * Memeriksa secara cepat apakah suatu objek atau string mengandung format Base64 gambar
 */
export function containsBase64(value: any): boolean {
  if (!value) return false;
  if (typeof value === 'string') {
    return value.includes('data:image/');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value).includes('data:image/');
  }
  return false;
}

/**
 * Mengambil email pengguna dari tabel profiles berdasarkan user_id
 */
async function getUserEmail(userId: string): Promise<string | null> {
  if (!userId) return null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .maybeSingle();

    return data?.email || null;
  } catch (err) {
    return null;
  }
}

/**
 * Skrip migrasi untuk mengekstrak seluruh gambar Base64 dari tabel `user_templates`
 * dan `invitations`, mengunggahnya ke Supabase Storage Bucket 'invitations',
 * dan memperbarui record database dengan URL publik permanen.
 */
export async function runBase64Migration(
  onProgress?: (message: string) => void
): Promise<MigrationReport> {
  const log = (msg: string) => {
    console.info(`[Base64 Migration] ${msg}`);
    if (onProgress) onProgress(msg);
  };

  log('Memulai proses pemindaian data Base64 di database Supabase...');

  const report: MigrationReport = {
    userTemplatesTotal: 0,
    userTemplatesMigrated: 0,
    invitationsTotal: 0,
    invitationsMigrated: 0,
    errors: [],
  };

  // ==========================================
  // 1. MIGRASI TABEL user_templates
  // ==========================================
  try {
    log('Memindai tabel public.user_templates...');
    const { data: userTemplates, error: utError } = await supabase
      .from('user_templates')
      .select('id, user_id, slug, content, thumbnail_url');

    if (utError) {
      throw new Error(`Gagal membaca user_templates: ${utError.message}`);
    }

    const templatesWithBase64 = (userTemplates || []).filter((item: any) => {
      const hasThumbBase64 = typeof item.thumbnail_url === 'string' && item.thumbnail_url.startsWith('data:image/');
      const hasContentBase64 = containsBase64(item.content);
      return hasThumbBase64 || hasContentBase64;
    });

    report.userTemplatesTotal = templatesWithBase64.length;
    log(`Ditemukan ${templatesWithBase64.length} baris di user_templates yang mengandung Base64.`);

    for (let i = 0; i < templatesWithBase64.length; i++) {
      const item = templatesWithBase64[i];
      log(`[${i + 1}/${templatesWithBase64.length}] Memproses user_template ID: ${item.id} (${item.slug})...`);

      try {
        const userEmail = await getUserEmail(item.user_id);
        const rawContent = (item.content || {}) as InvitationData;

        // Bersihkan dan unggah semua foto Base64 ke Storage bucket 'invitations'
        const cleanedContent = await sanitizeAndUploadBase64InFormData(
          rawContent,
          item.user_id,
          userEmail,
          item.slug
        );

        // Tentukan thumbnail_url bersih
        let cleanThumbnail = item.thumbnail_url;
        if (cleanThumbnail && cleanThumbnail.startsWith('data:image/')) {
          cleanThumbnail = cleanedContent.cover_image || cleanedContent.couple_photo || null;
        }

        // Perbarui record di database
        const { error: updateError } = await supabase
          .from('user_templates')
          .update({
            content: cleanedContent,
            thumbnail_url: cleanThumbnail,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (updateError) {
          throw updateError;
        }

        report.userTemplatesMigrated++;
        log(`✓ Berhasil memigrasi user_template: ${item.slug}`);
      } catch (itemErr: any) {
        const errMsg = `Gagal memigrasi user_template ${item.id}: ${itemErr.message}`;
        console.error(errMsg, itemErr);
        report.errors.push(errMsg);
      }
    }
  } catch (err: any) {
    const errMsg = `Error saat memproses user_templates: ${err.message}`;
    console.error(errMsg, err);
    report.errors.push(errMsg);
  }

  // ==========================================
  // 2. MIGRASI TABEL invitations
  // ==========================================
  try {
    log('Memindai tabel public.invitations...');
    const { data: invitations, error: invError } = await supabase
      .from('invitations')
      .select('id, user_id, slug, content');

    if (invError) {
      throw new Error(`Gagal membaca invitations: ${invError.message}`);
    }

    const invitationsWithBase64 = (invitations || []).filter((item: any) => {
      return containsBase64(item.content);
    });

    report.invitationsTotal = invitationsWithBase64.length;
    log(`Ditemukan ${invitationsWithBase64.length} baris di invitations yang mengandung Base64.`);

    for (let i = 0; i < invitationsWithBase64.length; i++) {
      const item = invitationsWithBase64[i];
      log(`[${i + 1}/${invitationsWithBase64.length}] Memproses invitation ID: ${item.id} (${item.slug})...`);

      try {
        const userEmail = await getUserEmail(item.user_id);
        const rawContent = (item.content || {}) as InvitationData;

        // Bersihkan dan unggah semua foto Base64 ke Storage bucket 'invitations'
        const cleanedContent = await sanitizeAndUploadBase64InFormData(
          rawContent,
          item.user_id || 'anonymous',
          userEmail,
          item.slug
        );

        // Perbarui record di database
        const { error: updateError } = await supabase
          .from('invitations')
          .update({
            content: cleanedContent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (updateError) {
          throw updateError;
        }

        report.invitationsMigrated++;
        log(`✓ Berhasil memigrasi invitation: ${item.slug}`);
      } catch (itemErr: any) {
        const errMsg = `Gagal memigrasi invitation ${item.id}: ${itemErr.message}`;
        console.error(errMsg, itemErr);
        report.errors.push(errMsg);
      }
    }
  } catch (err: any) {
    const errMsg = `Error saat memproses invitations: ${err.message}`;
    console.error(errMsg, err);
    report.errors.push(errMsg);
  }

  log(
    `Selesai! Laporan Migrasi: ${report.userTemplatesMigrated}/${report.userTemplatesTotal} user_templates dimigrasi, ${report.invitationsMigrated}/${report.invitationsTotal} invitations dimigrasi. Total error: ${report.errors.length}.`
  );

  return report;
}

// Pasang ke window object peramban agar bisa langsung dipanggil kapan saja dari Developer Console (F12)
if (typeof window !== 'undefined') {
  (window as any).runMbellBase64Migration = runBase64Migration;
}
