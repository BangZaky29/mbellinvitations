import React from 'react';
import type { GuestItem } from './types';

interface GuestTableRowProps {
  guest: GuestItem;
  index: number;
  isSent: boolean;
  onToggleSentStatus: (guestId: string) => void;
  onCopyPersonalLink: (guest: GuestItem) => void;
  onSendWhatsApp: (guest: GuestItem) => void;
  onDeleteGuest: (guestId: string, guestName: string) => void;
}

export const GuestTableRow: React.FC<GuestTableRowProps> = ({
  guest,
  index,
  isSent,
  onToggleSentStatus,
  onCopyPersonalLink,
  onSendWhatsApp,
  onDeleteGuest,
}) => {
  return (
    <tr
      className={`transition-colors ${
        isSent ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-stone-50/60'
      }`}
    >
      {/* Nomor Urut */}
      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-stone-400">
        {index + 1}
      </td>

      {/* Nama Tamu & Kategori */}
      <td className="py-3.5 px-4">
        <div className="font-bold text-stone-900 text-sm">{guest.name}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
            {guest.category || 'Reguler'}
          </span>
          {guest.pax_allocated && guest.pax_allocated > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
              {guest.pax_allocated} Pax
            </span>
          )}
        </div>
      </td>

      {/* Nomor Telepon */}
      <td className="py-3.5 px-4">
        {guest.phone_number ? (
          <div className="font-mono text-xs text-stone-700 flex items-center gap-1">
            <span className="material-symbols-outlined text-emerald-600 text-[14px]">call</span>
            <span>{guest.phone_number}</span>
          </div>
        ) : (
          <span className="text-[11px] text-stone-400 italic">Tanpa Nomor</span>
        )}
      </td>

      {/* Kode Check-in Pass */}
      <td className="py-3.5 px-4 text-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-mono text-[11px] font-bold">
          <span className="material-symbols-outlined text-[13px] text-stone-500">qr_code</span>
          <span>{guest.guest_code}</span>
        </span>
      </td>

      {/* Status RSVP */}
      <td className="py-3.5 px-4 text-center">
        {guest.rsvp_status === 'hadir' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hadir ({guest.rsvp_pax || 1})
          </span>
        ) : guest.rsvp_status === 'tidak_hadir' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Berhalangan
          </span>
        ) : guest.rsvp_status === 'ragu' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Ragu
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px]">
            Menunggu
          </span>
        )}
      </td>

      {/* Tracker Kirim WA Badge (Bisa di-toggle manual) */}
      <td className="py-3.5 px-4 text-center">
        <div className="flex flex-col items-center justify-center gap-0.5">
          <button
            type="button"
            onClick={() => onToggleSentStatus(guest.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
              isSent
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300/50'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200 border border-stone-200'
            }`}
            title="Klik untuk mengubah status kirim WhatsApp"
          >
            <span className="material-symbols-outlined text-[13px]">
              {isSent ? 'check_circle' : 'pending'}
            </span>
            <span>{isSent ? 'Sudah Dikirim ✔️' : 'Belum Dikirim'}</span>
          </button>
          {isSent && guest.sent_at && (
            <span
              className="text-[9px] text-stone-400 font-mono tracking-tight"
              title={`Waktu kirim: ${new Date(guest.sent_at).toLocaleString('id-ID')}`}
            >
              {new Date(guest.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          )}
        </div>
      </td>

      {/* Tombol Aksi: Salin Link, Kirim WA, Hapus */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Salin Link Unik */}
          <button
            type="button"
            onClick={() => onCopyPersonalLink(guest)}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Salin Link Unik Tamu Ini"
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
          </button>

          {/* Kirim Pesan WhatsApp */}
          <button
            type="button"
            onClick={() => onSendWhatsApp(guest)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Kirim Undangan via WhatsApp"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span>Kirim WA</span>
          </button>

          {/* Hapus Tamu */}
          <button
            type="button"
            onClick={() => onDeleteGuest(guest.id, guest.name)}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Hapus dari daftar tamu"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
