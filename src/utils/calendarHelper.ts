import type { InvitationData, EventInfo } from '../types/invitation';
import { getInvitationFullUrl } from './urlHelper';

/**
 * Universal Google Calendar Generator & Handler untuk Seluruh Template Undangan Mbell
 *
 * Mengatasi:
 * 1. Bug durasi 0 menit (start dan end date identik: 8:00am to 8:00am).
 * 2. Hardcode tanggal kuno (misal 2025 di template Islami atau 2026 St. Regis di Luxury).
 * 3. Hardcode teks deskripsi adat yang kaku.
 * 4. Normalisasi zona waktu Indonesia (WIB, WITA, WIT) ke standar ISO UTC.
 * 5. Menghasilkan ringkasan deskripsi lengkap dengan link undangan digital & Google Maps.
 */

const INDONESIA_MONTH_MAP: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  jun: 5,
  jul: 6,
  agu: 7,
  agt: 7,
  sep: 8,
  okt: 9,
  nov: 10,
  des: 11,
};

/**
 * Normalisasi array events dari berbagai variasi data (Array vs Object `{ akad, resepsi }`)
 */
export function getNormalizedEvents(data: InvitationData): EventInfo[] {
  const raw = data.events;
  if (Array.isArray(raw)) {
    return raw.filter(Boolean);
  }
  if (raw && typeof raw === 'object') {
    return Object.values(raw).filter(Boolean) as EventInfo[];
  }
  return [];
}

/**
 * Menentukan target event spesifik (berdasarkan countdown_target atau urutan pertama)
 */
export function resolveTargetEvent(data: InvitationData, specificEvent?: EventInfo): EventInfo {
  if (specificEvent) return specificEvent;

  const events = getNormalizedEvents(data);
  if (events.length === 0) {
    return {
      title: 'Pernikahan',
      name: 'Resepsi & Akad',
      date: data.wedding_date_display || '',
      start_time: '08:00',
      end_time: '11:00',
      timezone: 'WIB',
      venue_name: '',
      venue_address: '',
      maps_url: '',
    };
  }

  const activeIdx = data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;
  return events[activeIdx] || events[0];
}

/**
 * Parsing tanggal ke format tahun, bulan (0-indexed), hari
 */
function parseDateComponents(dateStr?: string, fallbackIso?: string): { year: number; month: number; day: number } {
  // 1. Coba parse dari format YYYY-MM-DD
  if (dateStr) {
    const trimmed = dateStr.trim();
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      return {
        year: parseInt(isoMatch[1], 10),
        month: parseInt(isoMatch[2], 10) - 1,
        day: parseInt(isoMatch[3], 10),
      };
    }

    // 2. Coba parse nama bulan Indonesia (contoh: "Sabtu, 19 Desember 2026" atau "19 Des 2026")
    const words = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    let foundDay: number | null = null;
    let foundMonth: number | null = null;
    let foundYear: number | null = null;

    for (const w of words) {
      if (INDONESIA_MONTH_MAP[w] !== undefined && foundMonth === null) {
        foundMonth = INDONESIA_MONTH_MAP[w];
      } else if (/^\d{4}$/.test(w) && foundYear === null) {
        foundYear = parseInt(w, 10);
      } else if (/^\d{1,2}$/.test(w) && foundDay === null) {
        foundDay = parseInt(w, 10);
      }
    }

    if (foundYear !== null && foundMonth !== null && foundDay !== null) {
      return { year: foundYear, month: foundMonth, day: foundDay };
    }
  }

  // 3. Fallback ke wedding_date_iso (contoh: "2026-10-24T08:00:00+07:00")
  if (fallbackIso) {
    const d = new Date(fallbackIso);
    if (!isNaN(d.getTime())) {
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
      };
    }
  }

  // 4. Default aman: Tanggal hari ini + 30 hari ke depan
  const now = new Date();
  now.setDate(now.getDate() + 30);
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  };
}

/**
 * Parsing waktu jam & menit dari string (contoh: "08:00", "08.30", "11:00 WIB")
 */
function parseTimeComponents(timeStr?: string, defaultHour: number = 8, defaultMinute: number = 0): { hour: number; minute: number } {
  if (!timeStr) return { hour: defaultHour, minute: defaultMinute };

  // Cari pola "08:00" atau "08.00"
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (match) {
    return {
      hour: Math.min(23, Math.max(0, parseInt(match[1], 10))),
      minute: Math.min(59, Math.max(0, parseInt(match[2], 10))),
    };
  }

  return { hour: defaultHour, minute: defaultMinute };
}

/**
 * Format Date UTC ke Google Calendar UTC representation (YYYYMMDDTHHmmssZ)
 */
function toGCalUtcString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getUTCFullYear();
  const m = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const h = pad(date.getUTCHours());
  const min = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

/**
 * Membangun URL resmi Google Calendar Event Creator
 */
export function buildGoogleCalendarUrl(
  data: InvitationData,
  specificEvent?: EventInfo
): string {
  const event = resolveTargetEvent(data, specificEvent);

  // 1. Judul Event (Text)
  const isBrideFirst = Boolean(data.is_bride_first);
  const firstName = isBrideFirst ? (data.bride?.name || 'Mempelai') : (data.groom?.name || 'Mempelai');
  const secondName = isBrideFirst ? (data.groom?.name || 'Mempelai') : (data.bride?.name || 'Mempelai');
  const coupleTitle = `${firstName} & ${secondName}`;

  const eventName = event.title || event.name || 'Pernikahan';
  const calendarTitle = `${eventName} — ${coupleTitle}`;

  // 2. Resolusi Tanggal & Jam
  const { year, month, day } = parseDateComponents(event.date, data.wedding_date_iso);

  // Parse Waktu Mulai
  const startRaw = event.start_time || (event.time ? event.time.split('-')[0] : '') || '08:00';
  const { hour: startHour, minute: startMinute } = parseTimeComponents(startRaw, 8, 0);

  // Parse Waktu Selesai
  const endRaw = event.end_time || (event.time && event.time.includes('-') ? event.time.split('-')[1] : '');
  let endHour: number;
  let endMinute: number;

  if (endRaw && !endRaw.toLowerCase().includes('selesai')) {
    const parsedEnd = parseTimeComponents(endRaw, startHour + 2, startMinute);
    endHour = parsedEnd.hour;
    endMinute = parsedEnd.minute;
    // Jika waktu selesai lebih kecil/sama dengan waktu mulai, beri durasi +2.5 jam
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      endHour = (startHour + 2) % 24;
      endMinute = (startMinute + 30) % 60;
    }
  } else {
    // Default durasi cerdas: 2 jam 30 menit (Mencegah bug 8:00am to 8:00am)
    endHour = (startHour + 2) % 24;
    endMinute = (startMinute + 30) % 60;
  }

  // Timezone Offset Indonesia (WIB: +7, WITA: +8, WIT: +9)
  const tz = (event.timezone || (event.time && event.time.includes('WITA') ? 'WITA' : event.time && event.time.includes('WIT') ? 'WIT' : 'WIB')).toUpperCase();
  const tzOffsetHours = tz === 'WIT' ? 9 : tz === 'WITA' ? 8 : 7;

  // Buat objek Date UTC murni
  // Date.UTC mengharapkan nilai waktu lokal, lalu kita kurangi offset timezone untuk mendapatkan waktu UTC
  const startUtcMs = Date.UTC(year, month, day, startHour - tzOffsetHours, startMinute, 0);
  const endUtcMs = Date.UTC(year, month, day, endHour - tzOffsetHours, endMinute, 0);

  const startDateUtc = new Date(startUtcMs);
  const endDateUtc = new Date(endUtcMs);

  const datesFormatted = `${toGCalUtcString(startDateUtc)}/${toGCalUtcString(endDateUtc)}`;

  // 3. Lokasi
  const venueName = event.venue_name || event.location_name || '';
  const venueAddr = event.venue_address || event.address || '';
  const locationString = [venueName, venueAddr].filter(Boolean).join(', ');

  // 4. Deskripsi / Catatan (Details)
  const groomFullName = data.groom?.full_name || data.groom?.name || 'Mempelai Pria';
  const brideFullName = data.bride?.full_name || data.bride?.name || 'Mempelai Wanita';
  const coupleFullTitle = isBrideFirst
    ? `${brideFullName} & ${groomFullName}`
    : `${groomFullName} & ${brideFullName}`;

  const publicUrl = data.slug ? getInvitationFullUrl(data.slug) : '';

  const displayTime =
    event.time ||
    `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')} ${tz}`;

  const descriptionLines: string[] = [
    `The Wedding of ${coupleTitle}`,
    `Sesi: ${eventName}`,
    '',
    'Mempelai:',
    `• ${coupleFullTitle}`,
    '',
    'Waktu & Lokasi:',
    `• Waktu: ${displayTime}`,
    event.date ? `• Tanggal: ${event.date}` : '',
    venueName ? `• Tempat: ${venueName}` : '',
    venueAddr ? `• Alamat: ${venueAddr}` : '',
  ].filter(Boolean);

  if (event.maps_url) {
    descriptionLines.push('', `📍 Petunjuk Lokasi (Google Maps):`, event.maps_url);
  }

  if (publicUrl) {
    descriptionLines.push('', `💌 Buka Undangan Digital Lengkap:`, publicUrl);
  }

  if (data.dresscode?.enabled && Array.isArray(data.dresscode.colors) && data.dresscode.colors.length > 0) {
    const colorNames = data.dresscode.colors.map((c) => c.name).filter(Boolean).join(', ');
    if (colorNames) {
      descriptionLines.push('', `👗 Dress Code: ${colorNames}`);
    }
  }

  const detailsString = descriptionLines.join('\n');

  // 5. Susun URL Google Calendar
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarTitle,
    dates: datesFormatted,
    details: detailsString,
  });

  if (locationString) {
    params.set('location', locationString);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Eksekusi buka Google Calendar di tab baru
 */
export function openGoogleCalendar(
  data: InvitationData,
  specificEvent?: EventInfo,
  onSuccess?: () => void
): void {
  try {
    const url = buildGoogleCalendarUrl(data, specificEvent);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (err) {
    console.error('[GoogleCalendar] Gagal membuka Google Calendar:', err);
  }
}

