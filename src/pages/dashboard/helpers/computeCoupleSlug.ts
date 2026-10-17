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
