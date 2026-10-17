import React from 'react';

interface GuestStatsBarProps {
  totalGuests: number;
  totalSent: number;
  totalHadir: number;
  totalPaxHadir: number;
  totalTidakHadir: number;
  totalRagu: number;
}

export const GuestStatsBar: React.FC<GuestStatsBarProps> = ({
  totalGuests,
  totalSent,
  totalHadir,
  totalPaxHadir,
  totalTidakHadir,
  totalRagu,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
        <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Total Tamu</span>
        <p className="text-2xl font-bold text-stone-900 mt-1">{totalGuests}</p>
        <span className="text-[11px] text-stone-400">Di buku tamu</span>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
        <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Sudah Dikirim</span>
        <p className="text-2xl font-bold text-emerald-900 mt-1">{totalSent}</p>
        <span className="text-[11px] text-emerald-600 font-semibold">Tersampaikan ✔️</span>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
        <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Akan Hadir</span>
        <p className="text-2xl font-bold text-emerald-900 mt-1">{totalHadir}</p>
        <span className="text-[11px] text-emerald-600 font-semibold">{totalPaxHadir} Orang tamu</span>
      </div>

      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs">
        <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wider">Berhalangan</span>
        <p className="text-2xl font-bold text-rose-900 mt-1">{totalTidakHadir}</p>
        <span className="text-[11px] text-rose-600">Tidak dapat hadir</span>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs col-span-2 sm:col-span-1">
        <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Masih Ragu</span>
        <p className="text-2xl font-bold text-amber-900 mt-1">{totalRagu}</p>
        <span className="text-[11px] text-amber-600">Belum dipastikan</span>
      </div>
    </div>
  );
};
