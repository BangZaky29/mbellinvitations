import React, { useState } from 'react';
import type { EventInfo } from '../../types/invitation';
import { EventFormRow } from './events-form/EventFormRow';
import { reverseGeocodeCoords, extractCoordsFromUrlOrText } from '../../lib/reverseGeocode';

interface EventsFormCardProps {
  events: any;
  countdownTarget?: 'akad' | 'resepsi' | string;
  onSetCountdownTarget?: (target: 'akad' | 'resepsi') => void;
  onEventsChange: (events: any) => void;
}

export const EventsFormCard: React.FC<EventsFormCardProps> = ({
  events,
  countdownTarget = 'akad',
  onSetCountdownTarget,
  onEventsChange,
}) => {
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [locatingIndex, setLocatingIndex] = useState<number | null>(null);
  const [locationSuccessIndex, setLocationSuccessIndex] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const minDate = getTodayDateString();

  // Normalisasi data events ke format Array EventInfo[] dinamis
  const eventList: EventInfo[] = React.useMemo(() => {
    if (Array.isArray(events) && events.length > 0) {
      return events.map((ev, idx) => ({
        ...ev,
        title: ev.title || ev.name || (idx === 0 ? 'Akad Nikah' : idx === 1 ? 'Resepsi Pernikahan' : `Sesi Acara ${idx + 1}`),
        timezone: ev.timezone || 'WIB',
      }));
    }
    if (events && typeof events === 'object') {
      const list: EventInfo[] = [];
      if (events.akad) {
        list.push({
          ...events.akad,
          title: events.akad.title || 'Akad Nikah',
          timezone: events.akad.timezone || 'WIB',
        });
      }
      if (events.resepsi) {
        list.push({
          ...events.resepsi,
          title: events.resepsi.title || 'Resepsi Pernikahan',
          timezone: events.resepsi.timezone || 'WIB',
        });
      }
      if (list.length > 0) return list;
    }
    return [
      {
        title: 'Akad Nikah',
        date: '',
        start_time: '08:00',
        end_time: '10:00',
        timezone: 'WIB',
        location_name: '',
        address: '',
        maps_url: '',
      },
      {
        title: 'Resepsi Pernikahan',
        date: '',
        start_time: '11:00',
        end_time: '14:00',
        timezone: 'WIB',
        location_name: '',
        address: '',
        maps_url: '',
      },
    ];
  }, [events]);

  const safeActiveIndex = Math.min(Math.max(0, activeEventIndex), eventList.length - 1);

  const buildTimeString = (startTime?: string, endTime?: string, tz?: string) => {
    if (!startTime) return '';
    return `${startTime} - ${endTime || 'Selesai'} ${tz || 'WIB'}`;
  };

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

  const formatIndonesianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    }
    return dateStr;
  };

  const handleEventChange = (index: number, field: keyof EventInfo, value: string) => {
    let cleanVal = value;
    if (field === 'date' && value && value < minDate) {
      cleanVal = minDate;
    }

    const currentEv: EventInfo = eventList[index] || {
      title: '',
      name: '',
      date: '',
      maps_url: '',
    };
    const nextStart = field === 'start_time' ? cleanVal : currentEv.start_time;
    const nextEnd = field === 'end_time' ? cleanVal : currentEv.end_time;
    const nextTz = field === 'timezone' ? cleanVal : currentEv.timezone || 'WIB';

    const calculatedTime = buildTimeString(nextStart, nextEnd, nextTz) || currentEv.time || '';

    const updatedEvent: EventInfo = {
      ...currentEv,
      [field]: cleanVal,
      // Sinkronisasi alias nama judul acara (title & name selalu kembar)
      title: field === 'title' || field === 'name' ? cleanVal : (currentEv.title || currentEv.name || ''),
      name: field === 'title' || field === 'name' ? cleanVal : (currentEv.name || currentEv.title || ''),
      // Sinkronisasi alias nama tempat/gedung
      ...(field === 'location_name' || field === 'venue_name'
        ? { location_name: cleanVal, venue_name: cleanVal }
        : {}),
      // Sinkronisasi alias alamat lengkap
      ...(field === 'address' || field === 'venue_address'
        ? { address: cleanVal, venue_address: cleanVal }
        : {}),
      // Format dan sinkronisasi tanggal
      ...(field === 'date'
        ? {
            date: formatIndonesianDate(cleanVal),
            date_iso: cleanVal,
          }
        : {}),
      time: calculatedTime,
    };

    const nextList = [...eventList];
    nextList[index] = updatedEvent;
    onEventsChange(nextList);

    // Auto-detect & auto-fill alamat jika user memasukkan URL atau koordinat GPS ke maps_url
    if (field === 'maps_url' && value) {
      const coords = extractCoordsFromUrlOrText(value);
      if (coords && (!updatedEvent.address || updatedEvent.address.includes('Kraton') || updatedEvent.address.length < 5)) {
        reverseGeocodeCoords(coords.lat, coords.lng)
          .then((res) => {
            if (res.formattedAddress) {
              const patchedList = nextList.map((ev, i) =>
                i === index
                  ? {
                      ...ev,
                      address: res.formattedAddress,
                      venue_address: res.formattedAddress,
                      ...(res.venueName && !ev.venue_name && !ev.location_name
                        ? { location_name: res.venueName, venue_name: res.venueName }
                        : {}),
                    }
                  : ev
              );
              onEventsChange(patchedList);
            }
          })
          .catch((err) => console.warn('Auto geocode from maps_url error:', err));
      }
    }
  };

  const handleAddEvent = () => {
    const firstEvent: Partial<EventInfo> = eventList[0] || {};
    const newIndex = eventList.length;
    const defaultTitle = newIndex === 2 ? 'Malam Bainai / Siraman' : `Sesi Acara ${newIndex + 1}`;
    const newEvent: EventInfo = {
      title: defaultTitle,
      name: defaultTitle,
      date: firstEvent.date || '',
      start_time: '19:00',
      end_time: '21:00',
      timezone: firstEvent.timezone || 'WIB',
      location_name: firstEvent.location_name || firstEvent.venue_name || '',
      venue_name: firstEvent.location_name || firstEvent.venue_name || '',
      address: firstEvent.address || firstEvent.venue_address || '',
      venue_address: firstEvent.address || firstEvent.venue_address || '',
      maps_url: firstEvent.maps_url || '',
    };
    newEvent.time = buildTimeString(newEvent.start_time, newEvent.end_time, newEvent.timezone);

    const nextList = [...eventList, newEvent];
    onEventsChange(nextList);
    setActiveEventIndex(newIndex);
  };

  const handleDeleteEvent = (index: number) => {
    if (eventList.length <= 1) return;
    const nextList = eventList.filter((_, idx) => idx !== index);
    onEventsChange(nextList);
    if (safeActiveIndex >= nextList.length) {
      setActiveEventIndex(nextList.length - 1);
    }
  };

  const copyEventLocation = (fromIndex: number, toIndex: number) => {
    const source = eventList[fromIndex];
    if (!source) return;
    const target = eventList[toIndex];
    if (!target) return;

    const updated: EventInfo = {
      ...target,
      date: source.date || target.date,
      location_name: source.location_name || source.venue_name || '',
      venue_name: source.location_name || source.venue_name || '',
      address: source.address || source.venue_address || '',
      venue_address: source.address || source.venue_address || '',
      maps_url: source.maps_url || target.maps_url,
      timezone: source.timezone || target.timezone || 'WIB',
    };

    const nextList = [...eventList];
    nextList[toIndex] = updated;
    onEventsChange(nextList);
  };

  const handleGetDeviceLocation = (index: number) => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      setTimeout(() => setLocationError(null), 5000);
      return;
    }

    setLocatingIndex(index);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const generatedUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        let resolvedAddress = '';
        let resolvedVenue = '';
        try {
          const res = await reverseGeocodeCoords(latitude, longitude);
          resolvedAddress = res.formattedAddress;
          resolvedVenue = res.venueName || '';
        } catch (e) {
          console.warn('Gagal reverse geocode koordinat GPS:', e);
        }

        const currentEv = eventList[index];
        if (!currentEv) {
          setLocatingIndex(null);
          return;
        }

        const updated: EventInfo = {
          ...currentEv,
          maps_url: generatedUrl,
          ...(resolvedAddress ? { address: resolvedAddress, venue_address: resolvedAddress } : {}),
          ...(resolvedVenue && (!currentEv.location_name && !currentEv.venue_name)
            ? { location_name: resolvedVenue, venue_name: resolvedVenue }
            : {}),
        };

        const nextList = [...eventList];
        nextList[index] = updated;
        onEventsChange(nextList);

        setLocatingIndex(null);
        setLocationSuccessIndex(index);
        setTimeout(() => setLocationSuccessIndex(null), 4000);
      },
      (error) => {
        setLocatingIndex(null);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Izin akses lokasi perangkat ditolak. Mohon izinkan browser mengakses lokasi.');
        } else {
          setLocationError('Gagal mendeteksi lokasi perangkat. Pastikan GPS aktif.');
        }
        setTimeout(() => setLocationError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const isCountdownForIndex = (index: number) => {
    if (index === 0 && countdownTarget === 'akad') return true;
    if (index === 1 && countdownTarget === 'resepsi') return true;
    return false;
  };

  const handleSetCountdownForIndex = (index: number) => {
    const target = index === 0 ? 'akad' : 'resepsi';
    onSetCountdownTarget?.(target);
  };

  const getEventBadge = (index: number) => {
    if (index === 0) return 'Sesi 1 (Akad)';
    if (index === 1) return 'Sesi 2 (Resepsi)';
    return `Sesi ${index + 1}`;
  };

  const getEventIcon = (index: number) => {
    if (index === 0) return 'church';
    if (index === 1) return 'celebration';
    return 'event';
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-7 shadow-xs border border-stone-200/90 space-y-5 sm:space-y-6">
      {/* Header Card & Tombol Tambah Acara */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              3
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Jadwal &amp; Lokasi Acara
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Atur waktu, tanggal, dan koordinat lokasi untuk setiap sesi acara pernikahan Anda.
          </p>
        </div>

        {/* Action Buttons Desktop */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {eventList.length >= 2 && (
            <button
              type="button"
              onClick={() => copyEventLocation(0, 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200/80 transition-colors cursor-pointer"
              title="Salin alamat dan maps dari acara 1 ke acara 2"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Salin Lokasi Akad ke Resepsi</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddEvent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Tambah Acara</span>
          </button>
        </div>
      </div>

      {/* TAMPILAN MOBILE: Card Stack Slider (md:hidden) */}
      <div className="md:hidden space-y-3">
        {/* Tab Switcher Horizontal untuk Semua Sesi Acara */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {eventList.map((ev, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveEventIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                safeActiveIndex === idx
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {getEventIcon(idx)}
              </span>
              <span>
                {ev.title || `Sesi ${idx + 1}`}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={handleAddEvent}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 shrink-0 cursor-pointer"
            title="Tambah sesi acara baru"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Tambah</span>
          </button>
        </div>

        {/* Efek Visual Card Stack (Tumpukan Kartu Bertingkat) */}
        <div className="relative pb-2">
          {/* Layer Bayangan Tumpukan Belakang 2 */}
          <div
            className="absolute inset-x-3 -bottom-1 h-12 rounded-2xl bg-stone-300/60 border border-stone-300 shadow-2xs pointer-events-none transform scale-[0.96] transition-all"
            aria-hidden="true"
          />
          {/* Layer Bayangan Tumpukan Belakang 1 */}
          <div
            className="absolute inset-x-1.5 bottom-0.5 h-12 rounded-2xl bg-stone-200/90 border border-stone-200 shadow-xs pointer-events-none transform scale-[0.98] transition-all"
            aria-hidden="true"
          />

          {/* Kartu Depan Aktif */}
          <div className="relative z-10 transition-all duration-200">
            {eventList[safeActiveIndex] && (
              <div className="space-y-2.5">
                <EventFormRow
                  title={eventList[safeActiveIndex].title || `Sesi ${safeActiveIndex + 1}`}
                  badge={getEventBadge(safeActiveIndex)}
                  icon={getEventIcon(safeActiveIndex)}
                  event={eventList[safeActiveIndex]}
                  minDate={minDate}
                  onChange={(field, val) => handleEventChange(safeActiveIndex, field, val)}
                  onOpenMaps={handleOpenGoogleMaps}
                  onGetDeviceLocation={() => handleGetDeviceLocation(safeActiveIndex)}
                  isLocating={locatingIndex === safeActiveIndex}
                  isLocationSuccess={locationSuccessIndex === safeActiveIndex}
                  locationError={locatingIndex === safeActiveIndex ? locationError : null}
                  defaultPlaceholderVenue="cth: Gedung Pernikahan / Masjid"
                  defaultPlaceholderAddress="Jl. Nama Jalan No. 123, Kota"
                  isCountdownActive={isCountdownForIndex(safeActiveIndex)}
                  onSetCountdown={() => handleSetCountdownForIndex(safeActiveIndex)}
                  canDelete={eventList.length > 1}
                  onDelete={() => handleDeleteEvent(safeActiveIndex)}
                />

                {/* Tombol Cepat: Salin dari Acara 1 ATAU Lanjut ke Acara Berikutnya */}
                <div className="flex gap-2">
                  {safeActiveIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => copyEventLocation(0, safeActiveIndex)}
                      className="flex-1 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1 hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span>Salin Lokasi Acara 1</span>
                    </button>
                  )}

                  {safeActiveIndex < eventList.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveEventIndex(safeActiveIndex + 1)}
                      className="flex-1 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
                    >
                      <span>Acara Selanjutnya</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddEvent}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Tambah Sesi Baru</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kontrol Navigasi Panah Kiri-Kanan Bawah Mobile */}
        <div className="flex items-center justify-between gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200 pt-2">
          <button
            type="button"
            onClick={() => setActiveEventIndex(Math.max(0, safeActiveIndex - 1))}
            disabled={safeActiveIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              safeActiveIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Sebelumnya</span>
          </button>

          {/* Dots Indikator Posisi */}
          <div className="flex items-center gap-1.5">
            {eventList.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setActiveEventIndex(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  safeActiveIndex === idx ? 'w-5 bg-stone-900' : 'w-2 bg-stone-300'
                }`}
                title={`Sesi ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveEventIndex(Math.min(eventList.length - 1, safeActiveIndex + 1))}
            disabled={safeActiveIndex === eventList.length - 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              safeActiveIndex === eventList.length - 1
                ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
            }`}
          >
            <span>Berikutnya</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* TAMPILAN DESKTOP: Grid Dinamis Semua Sesi Acara (hidden md:grid) */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {eventList.map((ev, idx) => (
          <EventFormRow
            key={idx}
            title={ev.title || `Sesi Acara ${idx + 1}`}
            badge={getEventBadge(idx)}
            icon={getEventIcon(idx)}
            event={ev}
            minDate={minDate}
            onChange={(field, val) => handleEventChange(idx, field, val)}
            onOpenMaps={handleOpenGoogleMaps}
            onGetDeviceLocation={() => handleGetDeviceLocation(idx)}
            isLocating={locatingIndex === idx}
            isLocationSuccess={locationSuccessIndex === idx}
            locationError={locatingIndex === idx ? locationError : null}
            defaultPlaceholderVenue={
              idx === 0
                ? 'cth: Masjid Agung Sunda Kelapa'
                : 'cth: Grand Ballroom Hotel Indonesia Kempinski'
            }
            defaultPlaceholderAddress={
              idx === 0
                ? 'Jl. Taman Sunda Kelapa No. 16, Menteng, Jakarta Pusat'
                : 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat'
            }
            isCountdownActive={isCountdownForIndex(idx)}
            onSetCountdown={() => handleSetCountdownForIndex(idx)}
            canDelete={eventList.length > 1}
            onDelete={() => handleDeleteEvent(idx)}
          />
        ))}

        {/* Card Tambah Acara Baru di Desktop */}
        <div
          onClick={handleAddEvent}
          className="p-6 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-900 hover:bg-stone-50/50 transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer min-h-[300px] group"
        >
          <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-colors flex items-center justify-center text-stone-700">
            <span className="material-symbols-outlined text-2xl">add</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">Tambah Sesi Acara Baru</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-[240px]">
              Misal: Malam Bainai, Siraman, Ngunduh Mantu, atau Acara Adat lainnya.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold group-hover:bg-stone-800 transition-colors shadow-2xs">
            + Tambah Sesi
          </span>
        </div>
      </div>
    </section>
  );
};
