/**
 * Helper Reverse Geocoding & Google Maps Parsing
 * Mengubah koordinat GPS atau tautan Google Maps menjadi Alamat Lengkap otomatis (Indonesian localization)
 */

export interface GeocodedAddressResult {
  formattedAddress: string;
  venueName?: string;
  latitude: number;
  longitude: number;
  plusCode?: string;
}

/**
 * Format Plus Code menjadi short plus code (contoh: '6P5RCMC9+V6H' -> 'CMC9+V6H')
 */
export function formatShortPlusCode(plusCode?: string): string {
  if (!plusCode) return '';
  const trimmed = plusCode.trim();
  if (!trimmed.includes('+')) return trimmed;

  const [left, right] = trimmed.split('+');
  if (left && right && left.length > 4) {
    return `${left.slice(-4)}+${right}`;
  }
  return trimmed;
}

/**
 * Ekstrak koordinat latitude & longitude dari teks atau URL Google Maps
 */
export function extractCoordsFromUrlOrText(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const decoded = decodeURIComponent(input);

  // 1. Format decimal: -6.577813, 106.668118 atau q=-6.577813,106.668118 atau @-6.577813,106.668118
  const decMatch = decoded.match(/(-?\d{1,2}\.\d{3,10})[,\s]+(-?\d{1,3}\.\d{3,10})/);
  if (decMatch) {
    const lat = parseFloat(decMatch[1]);
    const lng = parseFloat(decMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }

  // 2. Format DMS: 6°34'40.1"S 106°40'05.2"E
  const dmsMatch = decoded.match(
    /(\d{1,2})[°\s]+(\d{1,2})['\s]+(\d{1,2}(?:\.\d+)?)["]?\s*([NSns])[,\s]+(\d{1,3})[°\s]+(\d{1,2})['\s]+(\d{1,2}(?:\.\d+)?)["]?\s*([EWew])/
  );
  if (dmsMatch) {
    const latDeg = parseFloat(dmsMatch[1]) + parseFloat(dmsMatch[2]) / 60 + parseFloat(dmsMatch[3]) / 3600;
    const lat = dmsMatch[4].toUpperCase() === 'S' ? -latDeg : latDeg;

    const lngDeg = parseFloat(dmsMatch[5]) + parseFloat(dmsMatch[6]) / 60 + parseFloat(dmsMatch[7]) / 3600;
    const lng = dmsMatch[8].toUpperCase() === 'W' ? -lngDeg : lngDeg;

    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Bersihkan Plus Code (seperti 'CMC9+V6', 'CMC9+V6H') dan duplikasi nama daerah pada alamat
 */
export function cleanAddress(rawAddress: string): string {
  if (!rawAddress) return '';
  // Hilangkan pola Plus Code di awal (misal: 'CMC9+V6 ', 'CMC9+V6H ', '6P5RCMC9+V6H ')
  let cleaned = rawAddress.replace(/^[A-Z0-9]{4,8}\+[A-Z0-9]{0,4}\s*/i, '').trim();

  // Bersihkan duplikasi kata yang berulang (misal: 'Cibungbulang, Cibungbulang, Jawa Barat')
  const parts = cleaned
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const uniqueParts: string[] = [];
  for (const p of parts) {
    if (!uniqueParts.some((existing) => existing.toLowerCase() === p.toLowerCase())) {
      uniqueParts.push(p);
    }
  }

  return uniqueParts.join(', ');
}

/**
 * Ambil data alamat lengkap via BigDataCloud (Client-side native CORS) & Nominatim OpenStreetMap
 * (Tanpa kode plus / Plus Code CMC9+V6 agar teks alamat bersih dan natural)
 */
export async function reverseGeocodeCoords(
  latitude: number,
  longitude: number
): Promise<GeocodedAddressResult> {
  // Opsi 1: Nominatim OpenStreetMap (Alamat lengkap bertingkat: Desa, Kecamatan, Kabupaten, Provinsi)
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=id`;
    const res = await fetch(osmUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const road = addr.road || addr.street || '';
      const village = addr.village || addr.suburb || addr.neighbourhood || '';
      const district = addr.city_district || addr.subdistrict || '';
      const city = addr.city || addr.county || addr.town || '';
      const state = addr.state || '';

      const rawParts = [road, village, district, city, state].filter(Boolean);
      const rawString = rawParts.length > 0 ? rawParts.join(', ') : data.display_name || '';
      const formattedAddress = cleanAddress(rawString);

      if (formattedAddress) {
        return {
          formattedAddress,
          venueName: village || district || city || undefined,
          latitude,
          longitude,
        };
      }
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode failed, trying BigDataCloud...', err);
  }

  // Opsi 2: BigDataCloud Reverse Geocode fallback
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`;
    const res = await fetch(bdcUrl, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.localityInfo?.administrative?.[3]?.name || '';
      const city = data.city || data.localityInfo?.administrative?.[2]?.name || '';
      const state = data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || '';

      const rawComponents = [locality, city, state].filter(Boolean).join(', ');
      // Bersihkan dari Plus Code dan duplikasi
      const formattedAddress = cleanAddress(rawComponents);

      if (formattedAddress) {
        return {
          formattedAddress,
          venueName: locality || city || undefined,
          latitude,
          longitude,
        };
      }
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode failed:', err);
  }

  // Fallback default jika offline atau diblokir
  return {
    formattedAddress: `Lokasi (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
    latitude,
    longitude,
  };
}
