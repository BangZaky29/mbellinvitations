import React, { useState } from 'react';
import type { BankAccount } from '../../types/invitation';
import { BankAccountEditor } from './gifts-story-form/BankAccountEditor';
import { reverseGeocodeCoords } from '../../lib/reverseGeocode';

interface GiftsFormCardProps {
  bankAccounts?: BankAccount[];
  giftAddress?: string;
  onBankAccountsChange: (accounts: BankAccount[]) => void;
  onGiftAddressChange?: (address: string) => void;
}

export const GiftsFormCard: React.FC<GiftsFormCardProps> = ({
  bankAccounts = [],
  giftAddress = '',
  onBankAccountsChange,
  onGiftAddressChange,
}) => {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationSuccess, setLocationSuccess] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      setTimeout(() => setLocationError(null), 5000);
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await reverseGeocodeCoords(latitude, longitude);
          if (res && res.formattedAddress) {
            onGiftAddressChange?.(res.formattedAddress);
            setLocationSuccess(true);
            setTimeout(() => setLocationSuccess(false), 5000);
          } else {
            setLocationError('Gagal menerjemahkan titik lokasi ke alamat. Silakan tulis manual.');
            setTimeout(() => setLocationError(null), 5000);
          }
        } catch (e) {
          console.warn('Gagal reverse geocode koordinat GPS:', e);
          setLocationError('Terjadi kendala saat menerjemahkan koordinat lokasi ke alamat.');
          setTimeout(() => setLocationError(null), 5000);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Gagal mengakses GPS perangkat.';
        if (err.code === 1) {
          msg = 'Izin akses lokasi ditolak oleh browser/perangkat Anda.';
        } else if (err.code === 2) {
          msg = 'Sinyal lokasi perangkat tidak tersedia.';
        } else if (err.code === 3) {
          msg = 'Waktu permintaan lokasi habis (timeout).';
        }
        setLocationError(msg);
        setTimeout(() => setLocationError(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Amplop Digital &amp; Hadiah
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Kelola nomor rekening bank / dompet digital dan alamat pengiriman kado fisik untuk kemudahan para tamu undangan.
            </p>
          </div>
        </div>

        {/* 1. Bank Account & E-Wallet Editor */}
        <BankAccountEditor
          bankAccounts={bankAccounts}
          onBankAccountsChange={onBankAccountsChange}
        />

        {/* 2. Alamat Pengiriman Kado Fisik (Opsional) */}
        <div className="pt-6 border-t border-stone-200/80 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-stone-600 text-[18px]">local_shipping</span>
                <span>Alamat Kirim Kado Fisik (Opsional)</span>
              </label>
              <p className="text-xs text-stone-500 mt-0.5">
                Tamu yang ingin mengirimkan bingkisan / kado fisik dapat menyalin alamat ini langsung di undangan.
              </p>
            </div>

            {/* Button 1x Klik Deteksi Alamat HP Real-time */}
            <button
              type="button"
              onClick={handleGetDeviceLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:border-emerald-400 text-emerald-800 text-xs font-semibold shadow-2xs hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-60 shrink-0 self-start sm:self-auto"
              title="Ambil titik koordinat GPS perangkat ini dan konversi ke alamat lengkap secara real-time"
            >
              <span
                className={`material-symbols-outlined text-[16px] text-emerald-600 ${isLocating ? 'animate-spin' : ''
                  }`}
              >
                {isLocating ? 'progress_activity' : 'my_location'}
              </span>
              <span>
                {isLocating ? 'Mendeteksi Lokasi...' : 'Gunakan Lokasi Perangkat ini'}
              </span>
            </button>
          </div>

          <div className="space-y-1.5">
            <textarea
              rows={3}
              value={giftAddress || ''}
              onChange={(e) => onGiftAddressChange?.(e.target.value)}
              placeholder="Contoh: Jl. Kenanga No. 12, RT 02 / RW 05, Menteng, Jakarta Pusat (Penerima: Romeo & Juliet, Telp: 08123456789)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs sm:text-sm shadow-2xs transition-all resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Bisa sertakan nama penerima, nomor telepon aktif, dan patokan rumah.</span>
              {giftAddress && (
                <button
                  type="button"
                  onClick={() => onGiftAddressChange?.('')}
                  className="text-stone-400 hover:text-red-500 hover:underline transition-colors cursor-pointer"
                >
                  Hapus Alamat
                </button>
              )}
            </div>
          </div>

          {/* Feedback Sukses */}
          {locationSuccess && (
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
              <span className="material-symbols-outlined text-[14px]">task_alt</span>
              <span>Alamat kirim kado fisik berhasil terisi otomatis dari lokasi perangkat ini!</span>
            </p>
          )}

          {/* Feedback Error */}
          {locationError && !isLocating && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 animate-in fade-in">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>{locationError}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
