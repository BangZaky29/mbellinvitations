/**
 * Helper pemformatan waktu & tanggal untuk ucapan dan doa restu di seluruh template undangan mbell.
 * Menangani string ISO timestamptz dari database Supabase (cth: "2026-10-24T12:03:09.393608+00:00"),
 * format relatif, maupun objek Date menjadi tampilan jam, menit, dan tanggal Indonesia yang rapi.
 */
export function formatWishTime(rawDate?: string | Date | null): string {
  if (!rawDate) return 'Baru saja';

  // Jika sudah string relatif seperti "Baru saja" atau "2 jam yang lalu", langsung kembalikan
  if (typeof rawDate === 'string') {
    const trimmed = rawDate.trim();
    if (trimmed === 'Baru saja' || trimmed.includes('yang lalu')) {
      return trimmed;
    }
  }

  const d = new Date(rawDate);
  if (isNaN(d.getTime())) {
    return typeof rawDate === 'string' ? rawDate : 'Baru saja';
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  // Jika pesan baru masuk dalam 1 menit
  if (diffSec >= 0 && diffSec < 60) {
    return 'Baru saja';
  }

  // Jika pesan masuk dalam 60 menit terakhir
  if (diffMin >= 1 && diffMin < 60) {
    return `${diffMin} menit yang lalu`;
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  // Cek apakah tanggal hari ini
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 12) {
      return `${diffHours} jam yang lalu`;
    }
    return `Hari ini, ${hours}:${minutes} WIB`;
  }

  // Cek apakah kemarin
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Kemarin, ${hours}:${minutes} WIB`;
  }

  // Format tanggal lengkap: "24 Okt 2026, 19:03 WIB"
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hours}:${minutes} WIB`;
}
