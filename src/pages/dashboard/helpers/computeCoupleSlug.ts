import { supabase } from '../../../lib/supabase/client';

// 🌟 HELPER UNIVERSAL: Hitung slug bersih otomatis dari nama panggilan kedua mempelai
export const computeCoupleSlug = (groomName?: string, brideName?: string): string => {
  const getCallName = (name?: string) => {
    if (!name) return '';
    const beforeComma = name.trim().split(',')[0].trim();
    const words = beforeComma.split(/\s+/).filter(Boolean);
    return words[0] || beforeComma;
  };

  const cleanG = getCallName(groomName).toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanB = getCallName(brideName).toLowerCase().replace(/[^a-z0-9]/g, '');

  if (cleanG && cleanB) {
    return `${cleanG}-${cleanB}`;
  }
  if (cleanG) return cleanG;
  if (cleanB) return cleanB;
  return '';
};

/**
 * Membersihkan suffix draf dari slug secara menyeluruh.
 * Contoh:
 * - "zaky-bella-draf-g90o" -> "zaky-bella"
 * - "zaky-bella-draf" -> "zaky-bella"
 * - "zaky-bella-draft-x1y2" -> "zaky-bella"
 */
export const cleanDraftSlug = (slug?: string | null): string => {
  if (!slug) return '';
  return slug
    .replace(/(-draf(-[a-z0-9]+)?)+$/i, '')
    .replace(/(-draft(-[a-z0-9]+)?)+$/i, '');
};

/**
 * Menghasilkan slug kanonikal resmi untuk publikasi live:
 * Memprioritaskan slug yang sudah dibersihkan dari suffix draf, atau fallback ke nama mempelai
 */
export const getCanonicalPublishedSlug = (
  rawSlug?: string | null,
  groomName?: string,
  brideName?: string
): string => {
  const cleaned = cleanDraftSlug(rawSlug);
  const coupleSlug = computeCoupleSlug(groomName, brideName);

  if (cleaned && cleaned !== 'raditya-jessica' && cleaned !== 'undangan-baru') {
    // Validasi apakah slug lama sinkron dengan nama mempelai aktif
    const getFirstWord = (name?: string) => {
      if (!name) return '';
      const beforeComma = name.trim().split(',')[0].trim();
      const words = beforeComma.split(/\s+/).filter(Boolean);
      return (words[0] || beforeComma).toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const firstG = getFirstWord(groomName);
    const firstB = getFirstWord(brideName);

    if (firstG || firstB) {
      const cleanedLower = cleaned.toLowerCase();
      const hasG = Boolean(firstG && cleanedLower.includes(firstG));
      const hasB = Boolean(firstB && cleanedLower.includes(firstB));

      // Jika slug sama sekali tidak mengandung nama panggilan groom maupun bride,
      // maka ini adalah slug stale/bekas template sebelumnya (misal: 'ghifari-nadia' padahal aktif 'arya-dian')
      if (!hasG && !hasB && coupleSlug) {
        return coupleSlug;
      }
    }
    return cleaned;
  }
  return coupleSlug || 'undangan';
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔒 SLUG COLLISION PREVENTION: Auto-Increment Suffix System
// Mencegah bentrok slug antar user yang berbeda dengan nama mempelai yang sama
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mengecek ketersediaan slug di kedua tabel (invitations & user_templates).
 * Mengembalikan `true` jika slug tersedia untuk user ini, `false` jika sudah dipakai user lain.
 *
 * @param slug - Slug yang ingin dicek
 * @param currentUserId - ID user yang sedang aktif (opsional, slug milik user ini dianggap tersedia)
 * @param currentInvitationId - ID invitation yang sedang diedit (opsional, slug milik invitation ini dianggap tersedia)
 */
export async function isSlugAvailable(
  slug: string,
  currentUserId?: string | null,
  currentInvitationId?: string | null
): Promise<boolean> {
  try {
    // 1. Cek di tabel invitations
    const { data: inv } = await supabase
      .from('invitations')
      .select('id, user_id')
      .eq('slug', slug)
      .maybeSingle();

    if (inv && inv.id !== currentInvitationId && inv.user_id !== currentUserId) {
      return false;
    }

    // 2. Cek di tabel user_templates
    const { data: ut } = await supabase
      .from('user_templates')
      .select('id, user_id')
      .eq('slug', slug)
      .maybeSingle();

    if (ut && ut.user_id !== currentUserId) {
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[isSlugAvailable] Error checking slug:', err);
    // Jika error (misal network), anggap tersedia agar tidak blocking flow
    return true;
  }
}

/**
 * Menghasilkan slug unik yang tidak bentrok dengan slug milik user lain.
 * Jika slug dasar sudah dipakai user lain, otomatis menambahkan suffix: -2, -3, dst.
 *
 * Contoh:
 * - "rizky-fatimah"   → tersedia → "rizky-fatimah"
 * - "rizky-fatimah"   → sudah dipakai user lain → "rizky-fatimah-2"
 * - "rizky-fatimah-2" → sudah dipakai user lain → "rizky-fatimah-3"
 *
 * @param baseSlug - Slug dasar (tanpa suffix angka)
 * @param currentUserId - ID user aktif (slug milik user ini tidak dianggap bentrok)
 * @param currentInvitationId - ID invitation aktif (slug milik invitation ini tidak dianggap bentrok)
 * @returns Object { slug, wasSuffixed } — slug unik dan flag apakah ada penambahan suffix
 */
export async function generateUniqueSlug(
  baseSlug: string,
  currentUserId?: string | null,
  currentInvitationId?: string | null
): Promise<{ slug: string; wasSuffixed: boolean }> {
  if (!baseSlug) {
    return { slug: 'undangan', wasSuffixed: false };
  }

  // Bersihkan slug dari suffix angka yang sudah ada sebelumnya (misal "rizky-fatimah-2" → "rizky-fatimah")
  // agar increment dimulai dari base yang benar
  const cleanBase = baseSlug.replace(/-\d+$/, '');

  try {
    // 1. Cek apakah slug dasar tersedia untuk user ini
    const baseAvailable = await isSlugAvailable(cleanBase, currentUserId, currentInvitationId);
    if (baseAvailable) {
      return { slug: cleanBase, wasSuffixed: false };
    }

    // 2. Slug dasar sudah dipakai user lain → cari suffix terkecil yang tersedia
    // Ambil semua slug yang dimulai dengan baseSlug dari kedua tabel
    const [{ data: invSlugs }, { data: utSlugs }] = await Promise.all([
      supabase
        .from('invitations')
        .select('slug')
        .like('slug', `${cleanBase}%`),
      supabase
        .from('user_templates')
        .select('slug')
        .like('slug', `${cleanBase}%`),
    ]);

    const usedSlugs = new Set<string>();
    invSlugs?.forEach((r) => usedSlugs.add(r.slug));
    utSlugs?.forEach((r) => usedSlugs.add(r.slug));

    // Iterasi dari -2 hingga menemukan yang tersedia
    let counter = 2;
    const MAX_ATTEMPTS = 100; // Safety limit
    while (counter <= MAX_ATTEMPTS) {
      const candidate = `${cleanBase}-${counter}`;
      if (!usedSlugs.has(candidate)) {
        // Double-check ketersediaan di database (antisipasi race condition)
        const isAvail = await isSlugAvailable(candidate, currentUserId, currentInvitationId);
        if (isAvail) {
          return { slug: candidate, wasSuffixed: true };
        }
      }
      counter++;
    }

    // Fallback ekstrem: gunakan random suffix jika counter habis
    const rand = Math.random().toString(36).substring(2, 6);
    return { slug: `${cleanBase}-${rand}`, wasSuffixed: true };
  } catch (err) {
    console.warn('[generateUniqueSlug] Error:', err);
    // Jika error, kembalikan slug asli (best effort)
    return { slug: baseSlug, wasSuffixed: false };
  }
}

