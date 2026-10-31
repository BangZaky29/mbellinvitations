import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { BugisCornerOrnament } from '../components';

interface RsvpSectionProps {
  data?: InvitationData;
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void | Promise<void>;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
}) => {
  const isDeclined =
    rsvpForm.status === 'tidak_hadir' ||
    rsvpForm.status === 'declined' ||
    rsvpForm.status === 'absen';

  return (
    <section className="relative w-full px-4 py-8 bg-[#00120A] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#F2CA50] text-[#00170E] flex items-center justify-center mb-2 shadow-md">
          <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
        </div>
        <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
          Konfirmasi Kehadiran
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#C8EAD8] font-bold mt-1">
          RSVP Kehadiran
        </h2>
        <p className="font-sans text-xs text-[#D7C594] mt-1 max-w-xs leading-relaxed">
          Kehadiran dan lantunan doa restu Anda merupakan kehormatan tak terhingga bagi kami sekeluarga.
        </p>
      </div>

      {/* RSVP Form Card */}
      <form
        onSubmit={handleRsvpSubmit}
        className="relative w-full max-w-sm p-5 sm:p-6 rounded-2xl bg-[#052519]/90 backdrop-blur-md border border-[#F2CA50]/30 shadow-xl flex flex-col gap-4 overflow-hidden"
      >
        <BugisCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#F2CA50]/30" />
        <BugisCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#F2CA50]/30" />

        {/* Guest Name Input */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="font-sans text-xs uppercase tracking-wider text-[#F2CA50] font-semibold">
            Nama Lengkap Tamu Undangan
          </label>
          <input
            type="text"
            required
            value={rsvpForm.name}
            onChange={(e) =>
              setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Contoh: Andi Baso Karaeng & Istri"
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#00120A] border border-white/15 text-[#C8EAD8] placeholder:text-stone-500 font-sans text-xs focus:outline-none focus:border-[#F2CA50] focus:ring-1 focus:ring-[#F2CA50] transition-all"
          />
        </div>

        {/* Attendance Radios */}
        <div className="flex flex-col gap-2 text-left">
          <label className="font-sans text-xs uppercase tracking-wider text-[#F2CA50] font-semibold">
            Konfirmasi Kehadiran
          </label>
          
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#00120A] border border-white/10 cursor-pointer hover:border-[#F2CA50]/40 transition-colors">
            <input
              type="radio"
              name="status"
              value="hadir"
              checked={rsvpForm.status === 'hadir' || rsvpForm.status === 'attending'}
              onChange={() =>
                setRsvpForm((prev: any) => ({ ...prev, status: 'hadir' }))
              }
              className="accent-[#F2CA50] w-4 h-4 cursor-pointer"
            />
            <span className="font-sans text-xs text-[#C8EAD8] font-medium">
              Hadir Akad &amp; Resepsi (Tudang Bottung)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#00120A] border border-white/10 cursor-pointer hover:border-[#F2CA50]/40 transition-colors">
            <input
              type="radio"
              name="status"
              value="resepsi"
              checked={rsvpForm.status === 'resepsi'}
              onChange={() =>
                setRsvpForm((prev: any) => ({ ...prev, status: 'resepsi' }))
              }
              className="accent-[#F2CA50] w-4 h-4 cursor-pointer"
            />
            <span className="font-sans text-xs text-[#C8EAD8] font-medium">
              Hadir Resepsi Saja (Tudang Bottung)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#00120A] border border-white/10 cursor-pointer hover:border-[#F2CA50]/40 transition-colors">
            <input
              type="radio"
              name="status"
              value="tidak_hadir"
              checked={isDeclined}
              onChange={() =>
                setRsvpForm((prev: any) => ({ ...prev, status: 'tidak_hadir' }))
              }
              className="accent-[#F2CA50] w-4 h-4 cursor-pointer"
            />
            <span className="font-sans text-xs text-[#D0C5AF]/70 font-medium">
              Mohon Maaf Berhalangan Hadir
            </span>
          </label>
        </div>

        {/* Guest Count Dropdown (Hanya tampil jika hadir) */}
        {!isDeclined && (
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-sans text-xs uppercase tracking-wider text-[#F2CA50] font-semibold">
              Jumlah Orang Hadir
            </label>
            <select
              value={rsvpForm.pax}
              onChange={(e) =>
                setRsvpForm((prev: any) => ({
                  ...prev,
                  pax: Number(e.target.value),
                }))
              }
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#00120A] border border-white/15 text-[#C8EAD8] font-sans text-xs focus:outline-none focus:border-[#F2CA50] focus:ring-1 focus:ring-[#F2CA50] transition-all cursor-pointer"
            >
              <option value={1}>1 Orang</option>
              <option value={2}>2 Orang (Bersama Pasangan)</option>
              <option value={3}>3 Orang</option>
              <option value={4}>4 Orang (Keluarga)</option>
              <option value={5}>5 Orang</option>
            </select>
          </div>
        )}

        {/* Notes / Wishes in RSVP */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="font-sans text-xs uppercase tracking-wider text-[#F2CA50] font-semibold">
            Lantunan Doa &amp; Ucapan Restu
          </label>
          <textarea
            rows={3}
            value={rsvpForm.notes || ''}
            onChange={(e) =>
              setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Tuliskan doa restu untuk kedua mempelai..."
            className="w-full py-2 px-3.5 rounded-xl bg-[#00120A] border border-white/15 text-[#C8EAD8] placeholder:text-stone-500 font-sans text-xs focus:outline-none focus:border-[#F2CA50] focus:ring-1 focus:ring-[#F2CA50] transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#F2CA50] via-[#FFE088] to-[#F2CA50] text-[#00170E] font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          <span>Kirim Konfirmasi Kehadiran</span>
        </button>
      </form>
    </section>
  );
};
