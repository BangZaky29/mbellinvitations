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

