import React, { useState } from 'react';
import type { EventInfo } from '../../types/invitation';
import { EventFormRow } from './events-form/EventFormRow';
import { reverseGeocodeCoords, extractCoordsFromUrlOrText } from '../../lib/reverseGeocode';

interface EventsFormCardProps {
  events: any;
  countdownTarget?: 'akad' | 'resepsi';
  onSetCountdownTarget?: (target: 'akad' | 'resepsi') => void;
  onEventsChange: (events: any) => void;
}

export const EventsFormCard: React.FC<EventsFormCardProps> = ({
  events,
  countdownTarget = 'akad',
  onSetCountdownTarget,
  onEventsChange,
}) => {
  const isArray = Array.isArray(events);
  const [locatingTarget, setLocatingTarget] = useState<'akad' | 'resepsi' | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleOpenGoogleMaps = (mapsUrl?: string, venueName?: string, venueAddress?: string) => {
    if (mapsUrl && mapsUrl.trim().startsWith('http')) {
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    } else {
      const query = encodeURIComponent(
        [venueName, venueAddress].filter(Boolean).join(', ') || 'Lokasi Pernikahan'
      );
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const minDate = getTodayDateString();

  const akad: EventInfo = isArray
    ? events[0] || { title: 'Akad Nikah', date: '', maps_url: '' }
    : events?.akad || { title: 'Akad Nikah', date: '', maps_url: '' };

  const resepsi: EventInfo = isArray
    ? events[1] || { title: 'Resepsi Pernikahan', date: '', maps_url: '' }
    : events?.resepsi || { title: 'Resepsi Pernikahan', date: '', maps_url: '' };

  const buildTimeString = (startTime?: string, endTime?: string, tz?: string) => {
    if (!startTime) return '';
    return `${startTime} - ${endTime || 'Selesai'} ${tz || 'WIB'}`;
  };

  const handleAkadChange = (field: keyof EventInfo, value: string) => {
    let cleanVal = value;
    if (field === 'date' && value && value < minDate) {
      cleanVal = minDate;
    }

    const nextStart = field === 'start_time' ? cleanVal : akad.start_time;
    const nextEnd = field === 'end_time' ? cleanVal : akad.end_time;
    const nextTz = field === 'timezone' ? cleanVal : akad.timezone || 'WIB';

    const updatedAkad: EventInfo = {
      ...akad,
      [field]: cleanVal,
      ...(field === 'location_name' ? { venue_name: cleanVal } : {}),
      ...(field === 'address' ? { venue_address: cleanVal } : {}),
      ...(field === 'start_time' || field === 'end_time' || field === 'timezone'
        ? { time: buildTimeString(nextStart, nextEnd, nextTz) }
        : {}),
    };

    if (isArray) {
      onEventsChange([updatedAkad, resepsi]);
    } else {
      onEventsChange({
        ...events,
        akad: updatedAkad,
      });
    }

    // Auto-detect & auto-fill alamat jika user memasukkan URL atau koordinat GPS ke maps_url
    if (field === 'maps_url' && value) {
      const coords = extractCoordsFromUrlOrText(value);
      if (coords && (!akad.address || akad.address.includes('Kompleks Kraton') || akad.address.includes('Kraton'))) {
        reverseGeocodeCoords(coords.lat, coords.lng)
          .then((res) => {
            if (res.formattedAddress) {
              handleAkadChange('address', res.formattedAddress);
            }
          })
          .catch((err) => console.warn('Auto geocode from maps_url error:', err));
      }
    }
  };

  const handleResepsiChange = (field: keyof EventInfo, value: string) => {
    let cleanVal = value;
    if (field === 'date' && value && value < minDate) {
      cleanVal = minDate;
    }

    const nextStart = field === 'start_time' ? cleanVal : resepsi.start_time;
    const nextEnd = field === 'end_time' ? cleanVal : resepsi.end_time;
    const nextTz = field === 'timezone' ? cleanVal : resepsi.timezone || 'WIB';

    const updatedResepsi: EventInfo = {
      ...resepsi,
      [field]: cleanVal,
      ...(field === 'location_name' ? { venue_name: cleanVal } : {}),
      ...(field === 'address' ? { venue_address: cleanVal } : {}),
      ...(field === 'start_time' || field === 'end_time' || field === 'timezone'
        ? { time: buildTimeString(nextStart, nextEnd, nextTz) }
        : {}),
    };

    if (isArray) {
      onEventsChange([akad, updatedResepsi]);
    } else {
      onEventsChange({
        ...events,
        resepsi: updatedResepsi,
      });
    }

    // Auto-detect & auto-fill alamat jika user memasukkan URL atau koordinat GPS ke maps_url
    if (field === 'maps_url' && value) {
      const coords = extractCoordsFromUrlOrText(value);
      if (coords && (!resepsi.address || resepsi.address.includes('Rotowijayan') || resepsi.address.includes('Kraton'))) {
        reverseGeocodeCoords(coords.lat, coords.lng)
          .then((res) => {
            if (res.formattedAddress) {
              handleResepsiChange('address', res.formattedAddress);
            }
          })
          .catch((err) => console.warn('Auto geocode from maps_url error:', err));
      }
    }
  };

  const handleGetDeviceLocation = (target: 'akad' | 'resepsi') => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      setTimeout(() => setLocationError(null), 5000);
      return;
    }

    setLocatingTarget(target);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const generatedUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        // Ambil alamat lengkap otomatis via reverse geocoding
        let resolvedAddress = '';
        let resolvedVenue = '';
        try {
          const res = await reverseGeocodeCoords(latitude, longitude);
          resolvedAddress = res.formattedAddress;
          resolvedVenue = res.venueName || '';
        } catch (e) {
          console.warn('Gagal reverse geocode koordinat GPS:', e);
        }

        if (target === 'akad') {
          const currentAkad = akad;
          const updated: EventInfo = {
            ...currentAkad,
            maps_url: generatedUrl,
            ...(resolvedAddress ? { address: resolvedAddress, venue_address: resolvedAddress } : {}),
            ...(resolvedVenue && (!currentAkad.location_name && !currentAkad.venue_name)
              ? { location_name: resolvedVenue, venue_name: resolvedVenue }
              : {}),
          };
          if (isArray) {
            onEventsChange([updated, resepsi]);
          } else {
            onEventsChange({ ...events, akad: updated });
          }
        } else {
          const currentResepsi = resepsi;
          const updated: EventInfo = {
            ...currentResepsi,
            maps_url: generatedUrl,
            ...(resolvedAddress ? { address: resolvedAddress, venue_address: resolvedAddress } : {}),
            ...(resolvedVenue && (!currentResepsi.location_name && !currentResepsi.venue_name)
              ? { location_name: resolvedVenue, venue_name: resolvedVenue }
              : {}),
          };
          if (isArray) {
            onEventsChange([akad, updated]);
          } else {
            onEventsChange({ ...events, resepsi: updated });
          }
        }

        setLocatingTarget(null);
        setLocationSuccess(target);
        setTimeout(() => setLocationSuccess(null), 4000);
      },
      (error) => {
        setLocatingTarget(null);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            'Izin akses lokasi perangkat ditolak. Mohon izinkan browser mengakses lokasi.'
          );
        } else {
          setLocationError('Gagal mendeteksi lokasi perangkat. Pastikan GPS aktif.');
        }
        setTimeout(() => setLocationError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const copyAkadToResepsi = () => {
    const updatedResepsi: EventInfo = {
      ...resepsi,
      date: akad.date,
      location_name: akad.location_name || akad.venue_name || '',
      venue_name: akad.location_name || akad.venue_name || '',
      address: akad.address || akad.venue_address || '',
      venue_address: akad.address || akad.venue_address || '',
      maps_url: akad.maps_url,
      timezone: akad.timezone || 'WIB',
    };

    if (isArray) {
      onEventsChange([akad, updatedResepsi]);
    } else {
      onEventsChange({
        ...events,
        resepsi: updatedResepsi,
      });
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              3
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Jadwal &amp; Lokasi Acara
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Atur waktu, tanggal, dan koordinat lokasi untuk Akad Nikah / Pemberkatan dan Resepsi.
          </p>
        </div>

        <button
          type="button"
          onClick={copyAkadToResepsi}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200/80 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          <span>Salin Lokasi Akad ke Resepsi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventFormRow
          title="Akad Nikah / Pemberkatan"
          badge="Sesi 1"
          icon="church"
          event={akad}
          minDate={minDate}
          onChange={handleAkadChange}
          onOpenMaps={handleOpenGoogleMaps}
          onGetDeviceLocation={() => handleGetDeviceLocation('akad')}
          isLocating={locatingTarget === 'akad'}
          isLocationSuccess={locationSuccess === 'akad'}
          locationError={locationError}
          defaultPlaceholderVenue="cth: Masjid Agung Sunda Kelapa"
          defaultPlaceholderAddress="Jl. Taman Sunda Kelapa No. 16, Menteng, Jakarta Pusat"
          isCountdownActive={countdownTarget === 'akad'}
          onSetCountdown={() => onSetCountdownTarget?.('akad')}
        />

        <EventFormRow
          title="Resepsi Pernikahan"
          badge="Sesi 2"
          icon="celebration"
          event={resepsi}
          minDate={minDate}
          onChange={handleResepsiChange}
          onOpenMaps={handleOpenGoogleMaps}
          onGetDeviceLocation={() => handleGetDeviceLocation('resepsi')}
          isLocating={locatingTarget === 'resepsi'}
          isLocationSuccess={locationSuccess === 'resepsi'}
          locationError={locationError}
          defaultPlaceholderVenue="cth: Grand Ballroom Hotel Indonesia Kempinski"
          defaultPlaceholderAddress="Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat"
          isCountdownActive={countdownTarget === 'resepsi'}
          onSetCountdown={() => onSetCountdownTarget?.('resepsi')}
        />
      </div>
    </section>
  );
};
