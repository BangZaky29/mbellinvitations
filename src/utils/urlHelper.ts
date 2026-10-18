/**
 * URL Helper Utilities
 * Berisi helper terpusat untuk menghasilkan URL publik lengkap (origin)
 * dan format tampilan host tanpa hardcoded domain statis.
 */

/**
 * Menghasilkan URL lengkap (dengan protokol & origin aktual browser) untuk disalin ke clipboard atau dibagikan.
 * Contoh di localhost: http://localhost:5174/zaky-bella
 * Contoh di domain live: https://domain-anda.com/zaky-bella
 */
export function getInvitationFullUrl(slug: string): string {
  const cleanSlug = (slug || '').replace(/^\/+/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/${cleanSlug}`;
  }
  return `/${cleanSlug}`;
}

/**
 * Menghasilkan representasi string tampilan host + slug (tanpa http:// atau https://).
 * Contoh di localhost: localhost:5174/zaky-bella
 * Contoh di domain live: domain-anda.com/zaky-bella
 */
export function getInvitationDisplayUrl(slug: string): string {
  const cleanSlug = (slug || '').replace(/^\/+/, '');
  if (typeof window !== 'undefined' && window.location?.host) {
    return `${window.location.host}/${cleanSlug}`;
  }
  return `/${cleanSlug}`;
}
