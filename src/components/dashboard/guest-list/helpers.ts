import type { ParsedGuest } from './types';

// Helper untuk generate 5-karakter alphanumeric acak (unik, non-ambigu)
export function generateGuestCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Normalisasi nomor telepon format Indonesia (08xx / 8xx -> 628xx)
export function normalizePhoneNumber(raw: string): string {
  let cleaned = raw.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.slice(1);
  } else if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

// Smart parser per baris untuk Bulk Paste
export function parseBulkText(text: string): ParsedGuest[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const result: ParsedGuest[] = [];

  for (const line of lines) {
    // 1. Cek pemisah umum seperti strip (-), koma (,), pipe (|), titik dua (:), atau tab (\t)
    const matchDelim = line.split(/[-|,;:\t]/);
    if (matchDelim.length >= 2) {
      const partA = matchDelim[0].trim();
      const partB = matchDelim.slice(1).join(' ').trim();

      const digitsB = partB.replace(/[^0-9]/g, '');
      const digitsA = partA.replace(/[^0-9]/g, '');

      if (digitsB.length >= 8) {
        result.push({
          name: partA,
          phoneNumber: normalizePhoneNumber(partB),
        });
        continue;
      } else if (digitsA.length >= 8) {
        result.push({
          name: partB,
          phoneNumber: normalizePhoneNumber(partA),
        });
        continue;
      }
    }

    // 2. Cek regex nomor telepon di dalam teks baris
    const phoneMatch = line.match(/(?:\+?62|08)[0-9\s-]{8,16}/);
    if (phoneMatch) {
      const phone = phoneMatch[0];
      const name = line.replace(phone, '').replace(/[-|,;:()]/g, '').trim();
      result.push({
        name: name || 'Tamu Undangan',
        phoneNumber: normalizePhoneNumber(phone),
      });
    } else {
      // 3. Hanya teks nama tamu saja
      result.push({
        name: line,
      });
    }
  }

  return result;
}
