// 🌟 HELPER UNIVERSAL: Hitung slug bersih otomatis dari nama panggilan kedua mempelai
export const computeCoupleSlug = (groomName?: string, brideName?: string): string => {
  const cleanG = (groomName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const cleanB = (brideName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

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
  if (cleaned && cleaned !== 'raditya-jessica' && cleaned !== 'undangan-baru') {
    return cleaned;
  }
  const coupleSlug = computeCoupleSlug(groomName, brideName);
  return coupleSlug || 'undangan';
};

