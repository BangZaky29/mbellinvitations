import React from 'react';
import type { EventInfo } from '../../../types/invitation';

interface EventFormRowProps {
  title: string;
  badge: string;
  icon: string;
  event: EventInfo;
  minDate: string;
  onChange: (field: keyof EventInfo, value: string) => void;
  onOpenMaps: (mapsUrl?: string, venueName?: string, venueAddress?: string) => void;
  onGetDeviceLocation: () => void;
  isLocating: boolean;
  isLocationSuccess: boolean;
  locationError: string | null;
  defaultPlaceholderVenue: string;
  defaultPlaceholderAddress: string;
  isCountdownActive?: boolean;
  onSetCountdown?: () => void;
}

export const EventFormRow: React.FC<EventFormRowProps> = ({
  title,
  badge,
  icon,
  event,
  minDate,
  onChange,
  onOpenMaps,
  onGetDeviceLocation,
  isLocating,
  isLocationSuccess,
  locationError,
  defaultPlaceholderVenue,
  defaultPlaceholderAddress,
  isCountdownActive = false,
  onSetCountdown,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-stone-800 text-[20px]">{icon}</span>
          <h3 className="text-sm font-bold text-stone-900">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          {isCountdownActive ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs">
              <span className="material-symbols-outlined text-[13px]">timer</span>
              <span>Countdown Aktif</span>
            </span>
          ) : onSetCountdown ? (
            <button
              type="button"
              onClick={onSetCountdown}
              className="px-2.5 py-0.5 rounded-full border border-stone-300 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 text-stone-600 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Tetapkan acara ini sebagai patokan hitungan mundur hari, jam, menit, detik"
            >
              <span className="material-symbols-outlined text-[13px]">timer</span>
              <span>Jadikan Acara Mendatang</span>
            </button>
          ) : null}

          <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
            {badge}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700">Nama Judul Acara</label>
          <input
            type="text"
            value={event.title || event.name || ''}
            onChange={(e) => onChange('title', e.target.value)}
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
              value={event.date || ''}
              onChange={(e) => onChange('date', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
            />
            <p className="text-[10px] text-stone-400">*Tanggal sebelum hari ini tidak dapat dipilih</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Zona Waktu</label>
            <select
              value={event.timezone || 'WIB'}
              onChange={(e) => onChange('timezone', e.target.value)}
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
              value={event.start_time || ''}
              onChange={(e) => onChange('start_time', e.target.value)}
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
              value={event.end_time || ''}
              onChange={(e) => onChange('end_time', e.target.value)}
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
            value={event.location_name || event.venue_name || ''}
            onChange={(e) => onChange('location_name', e.target.value)}
            placeholder={defaultPlaceholderVenue}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700">Alamat Lengkap</label>
          <textarea
            rows={2}
            value={event.address || event.venue_address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder={defaultPlaceholderAddress}
            className="w-full px-3.5 py-2 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-stone-500">pin_drop</span>
              <span>Link Google Maps</span>
            </span>
            {event.maps_url && (
              <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>Tautan tersimpan</span>
              </span>
            )}
          </label>
          <input
            type="url"
            value={event.maps_url || ''}
            onChange={(e) => onChange('maps_url', e.target.value)}
            placeholder="https://maps.app.goo.gl/... atau koordinat GPS"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
          />

          {/* 2 Opsi Tombol Google Maps */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            <button
              type="button"
              onClick={() =>
                onOpenMaps(
                  event.maps_url,
                  event.venue_name || event.location_name,
                  event.venue_address || event.address
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
              onClick={onGetDeviceLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:border-emerald-400 text-emerald-800 text-xs font-semibold shadow-2xs hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-60"
              title="Ambil titik koordinat GPS perangkat ini secara real-time"
            >
              <span
                className={`material-symbols-outlined text-[16px] text-emerald-600 ${
                  isLocating ? 'animate-spin' : ''
                }`}
              >
                {isLocating ? 'progress_activity' : 'my_location'}
              </span>
              <span>
                {isLocating ? 'Mendeteksi Lokasi & Alamat...' : 'Gunakan Lokasi Perangkat Ini'}
              </span>
            </button>
          </div>

          {isLocationSuccess && (
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
              <span className="material-symbols-outlined text-[14px]">task_alt</span>
              <span>Tautan Maps & Alamat Lengkap berhasil terisi otomatis dari lokasi perangkat!</span>
            </p>
          )}

          {locationError && !isLocating && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 animate-in fade-in">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>{locationError}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
