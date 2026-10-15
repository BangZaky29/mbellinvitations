import React, { useState } from 'react';
import type { EventInfo } from '../../types/invitation';

interface EventsFormCardProps {
  events: any;
  onEventsChange: (events: any) => void;
}

export const EventsFormCard: React.FC<EventsFormCardProps> = ({
  events,
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
      const query = encodeURIComponent([venueName, venueAddress].filter(Boolean).join(', ') || 'Lokasi Pernikahan');
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
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
      (position) => {
        const { latitude, longitude } = position.coords;
        const generatedUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        if (target === 'akad') {
          handleAkadChange('maps_url', generatedUrl);
        } else {
          handleResepsiChange('maps_url', generatedUrl);
        }
        setLocatingTarget(null);
        setLocationSuccess(target);
        setTimeout(() => setLocationSuccess(null), 4000);
      },
      (error) => {
        setLocatingTarget(null);
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
    // Validasi blokir tanggal masa lalu: jika user memasukkan tanggal sebelum hari ini, batasi ke minDate
    if (field === 'date' && value && value < minDate) {
      value = minDate;
    }

    const nextStart = field === 'start_time' ? value : akad.start_time;
    const nextEnd = field === 'end_time' ? value : akad.end_time;
    const nextTz = field === 'timezone' ? value : (akad.timezone || 'WIB');

    const updatedAkad: EventInfo = {
      ...akad,
      [field]: value,
      ...(field === 'location_name' ? { venue_name: value } : {}),
      ...(field === 'address' ? { venue_address: value } : {}),
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
  };

  const handleResepsiChange = (field: keyof EventInfo, value: string) => {
    // Validasi blokir tanggal masa lalu
    if (field === 'date' && value && value < minDate) {
      value = minDate;
    }

    const nextStart = field === 'start_time' ? value : resepsi.start_time;
    const nextEnd = field === 'end_time' ? value : resepsi.end_time;
    const nextTz = field === 'timezone' ? value : (resepsi.timezone || 'WIB');

    const updatedResepsi: EventInfo = {
      ...resepsi,
      [field]: value,
      ...(field === 'location_name' ? { venue_name: value } : {}),
      ...(field === 'address' ? { venue_address: value } : {}),
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
        {/* BLOCK 1: AKAD NIKAH / PEMBERKATAN */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-800 text-[20px]">church</span>
              <h3 className="text-sm font-bold text-stone-900">
                Akad Nikah / Pemberkatan
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Sesi 1
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Nama Judul Acara
              </label>
              <input
                type="text"
                value={akad.title || akad.name || ''}
                onChange={(e) => handleAkadChange('title', e.target.value)}
                placeholder="Akad Nikah / Pemberkatan Suci"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">calendar_month</span>
                  <span>Tanggal Acara</span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={akad.date || ''}
                  onChange={(e) => handleAkadChange('date', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
                <p className="text-[10px] text-stone-400">
                  *Tanggal sebelum hari ini tidak dapat dipilih
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Zona Waktu
                </label>
                <select
                  value={akad.timezone || 'WIB'}
                  onChange={(e) => handleAkadChange('timezone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                >
                  <option value="WIB">WIB (Waktu Indonesia Barat)</option>
                  <option value="WITA">WITA (Waktu Indonesia Tengah)</option>
                  <option value="WIT">WIT (Waktu Indonesia Timur)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">schedule</span>
                  <span>Mulai</span>
                </label>
                <input
                  type="time"
                  value={akad.start_time || ''}
                  onChange={(e) => handleAkadChange('start_time', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">alarm_off</span>
                  <span>Selesai</span>
                </label>
                <input
                  type="time"
                  value={akad.end_time || ''}
                  onChange={(e) => handleAkadChange('end_time', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-stone-500">apartment</span>
                <span>Nama Tempat / Gedung</span>
              </label>
              <input
                type="text"
                value={akad.location_name || akad.venue_name || ''}
                onChange={(e) => handleAkadChange('location_name', e.target.value)}
                placeholder="cth: Masjid Agung Sunda Kelapa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={akad.address || akad.venue_address || ''}
                onChange={(e) => handleAkadChange('address', e.target.value)}
                placeholder="Jl. Taman Sunda Kelapa No. 16, Menteng, Jakarta Pusat"
                className="w-full px-3.5 py-2 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">pin_drop</span>
                  <span>Link Google Maps</span>
                </span>
                {akad.maps_url && (
                  <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Tautan tersimpan</span>
                  </span>
                )}
              </label>
              <input
                type="url"
                value={akad.maps_url || ''}
                onChange={(e) => handleAkadChange('maps_url', e.target.value)}
                placeholder="https://maps.app.goo.gl/... atau koordinat GPS"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />

              {/* 2 Opsi Tombol Google Maps */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenGoogleMaps(
                      akad.maps_url,
                      akad.venue_name || akad.location_name,
                      akad.venue_address || akad.address
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-all cursor-pointer"
                  title="Buka atau cari lokasi venue di Google Maps"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-600">map</span>
                  <span>Buka di Google Maps</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGetDeviceLocation('akad')}
                  disabled={locatingTarget === 'akad'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:border-emerald-400 text-emerald-800 text-xs font-semibold shadow-2xs hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-60"
                  title="Ambil titik koordinat GPS perangkat ini secara real-time"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] text-emerald-600 ${
                      locatingTarget === 'akad' ? 'animate-spin' : ''
                    }`}
                  >
                    {locatingTarget === 'akad' ? 'progress_activity' : 'my_location'}
                  </span>
                  <span>
                    {locatingTarget === 'akad'
                      ? 'Mendeteksi Lokasi GPS...'
                      : 'Gunakan Lokasi Perangkat Ini'}
                  </span>
                </button>
              </div>

              {locationSuccess === 'akad' && (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                  <span>Koordinat lokasi perangkat real-time berhasil disematkan ke tautan maps!</span>
                </p>
              )}

              {locationError && locatingTarget === null && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 animate-in fade-in">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>{locationError}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BLOCK 2: RESEPSI PERNIKAHAN */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-800 text-[20px]">celebration</span>
              <h3 className="text-sm font-bold text-stone-900">
                Resepsi Pernikahan
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Sesi 2
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Nama Judul Acara
              </label>
              <input
                type="text"
                value={resepsi.title || resepsi.name || ''}
                onChange={(e) => handleResepsiChange('title', e.target.value)}
                placeholder="Resepsi Pernikahan / Walimatul Ursy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">calendar_month</span>
                  <span>Tanggal Acara</span>
                </label>
                <input
                  type="date"
                  min={akad.date || minDate}
                  value={resepsi.date || ''}
                  onChange={(e) => handleResepsiChange('date', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
                <p className="text-[10px] text-stone-400">
                  *Tanggal sebelum hari ini tidak dapat dipilih
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Zona Waktu
                </label>
                <select
                  value={resepsi.timezone || 'WIB'}
                  onChange={(e) => handleResepsiChange('timezone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                >
                  <option value="WIB">WIB (Waktu Indonesia Barat)</option>
                  <option value="WITA">WITA (Waktu Indonesia Tengah)</option>
                  <option value="WIT">WIT (Waktu Indonesia Timur)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">schedule</span>
                  <span>Mulai</span>
                </label>
                <input
                  type="time"
                  value={resepsi.start_time || ''}
                  onChange={(e) => handleResepsiChange('start_time', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">alarm_off</span>
                  <span>Selesai</span>
                </label>
                <input
                  type="time"
                  value={resepsi.end_time || ''}
                  onChange={(e) => handleResepsiChange('end_time', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-stone-500">apartment</span>
                <span>Nama Tempat / Gedung</span>
              </label>
              <input
                type="text"
                value={resepsi.location_name || resepsi.venue_name || ''}
                onChange={(e) => handleResepsiChange('location_name', e.target.value)}
                placeholder="cth: Grand Ballroom Hotel Mulia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={resepsi.address || resepsi.venue_address || ''}
                onChange={(e) => handleResepsiChange('address', e.target.value)}
                placeholder="Jl. Asia Afrika Senayan, Gelora, Jakarta Pusat"
                className="w-full px-3.5 py-2 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-stone-500">pin_drop</span>
                  <span>Link Google Maps</span>
                </span>
                {resepsi.maps_url && (
                  <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Tautan tersimpan</span>
                  </span>
                )}
              </label>
              <input
                type="url"
                value={resepsi.maps_url || ''}
                onChange={(e) => handleResepsiChange('maps_url', e.target.value)}
                placeholder="https://maps.app.goo.gl/... atau koordinat GPS"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />

              {/* 2 Opsi Tombol Google Maps */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenGoogleMaps(
                      resepsi.maps_url,
                      resepsi.venue_name || resepsi.location_name,
                      resepsi.venue_address || resepsi.address
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-all cursor-pointer"
                  title="Buka atau cari lokasi venue di Google Maps"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-600">map</span>
                  <span>Buka di Google Maps</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGetDeviceLocation('resepsi')}
                  disabled={locatingTarget === 'resepsi'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:border-emerald-400 text-emerald-800 text-xs font-semibold shadow-2xs hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-60"
                  title="Ambil titik koordinat GPS perangkat ini secara real-time"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] text-emerald-600 ${
                      locatingTarget === 'resepsi' ? 'animate-spin' : ''
                    }`}
                  >
                    {locatingTarget === 'resepsi' ? 'progress_activity' : 'my_location'}
                  </span>
                  <span>
                    {locatingTarget === 'resepsi'
                      ? 'Mendeteksi Lokasi GPS...'
                      : 'Gunakan Lokasi Perangkat Ini'}
                  </span>
                </button>
              </div>

              {locationSuccess === 'resepsi' && (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                  <span>Koordinat lokasi perangkat real-time berhasil disematkan ke tautan maps!</span>
                </p>
              )}

              {locationError && locatingTarget === null && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 animate-in fade-in">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>{locationError}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
