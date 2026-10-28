import React from 'react';
import type { InvitationData } from '../../../../types/invitation';

interface RsvpSectionProps {
  data: InvitationData;
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  data,
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
}) => {
  const isAttendingFull = rsvpForm.status === 'hadir' || rsvpForm.status === 'full';
  const isAttendingReceptionOnly = rsvpForm.status === 'resepsi';
  const isDeclined =
    rsvpForm.status === 'tidak_hadir' ||
    rsvpForm.status === 'declined' ||
    rsvpForm.status === 'absen';

  const guestName = data.guest_name || rsvpForm.name || 'Tamu Terhormat';

  return (
    <section className="relative w-full px-4 pt-4 pb-6 flex flex-col items-center bg-[#410403] text-[#FAF6EE]">
      {/* INTERACTIVE RSVP FORM */}
      <div className="w-full max-w-[360px] bg-white text-[#1C1C18] p-5 rounded-2xl shadow-xl flex flex-col mb-6 border border-[#FED65B]/30 overflow-hidden">
        <div className="flex flex-col text-center mb-4">
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#735c00] uppercase">
            KONFIRMASI KEHADIRAN
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#410403] mt-0.5">
            RSVP &amp; Doa Restu
          </h2>
        </div>

        <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-3.5">
          {/* Nama Tamu Input */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#410403] font-bold">
              Nama Lengkap Tamu
            </label>
            <input
              required
              type="text"
              value={rsvpForm.name}
              onChange={(e) =>
                setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Bpk. H. Rahmat & Keluarga"
              className="w-full py-2.5 px-3 rounded-xl bg-[#F6F3ED] text-[#1C1C18] font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#5E1914] border border-[#E5E2DC]"
            />
          </div>

          {/* Pilihan Kehadiran */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#410403] font-bold">
              Status Kehadiran
            </label>
            <label
              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${
                isAttendingFull
                  ? 'bg-[#FED65B]/25 border-[#FED65B] font-bold text-[#410403]'
                  : 'bg-[#F6F3ED] border-[#E5E2DC] text-[#554240] hover:bg-[#F0EEE8]'
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="hadir"
                checked={isAttendingFull}
                onChange={() =>
                  setRsvpForm((prev: any) => ({ ...prev, status: 'hadir' }))
                }
                className="accent-[#5E1914] w-4 h-4 shrink-0"
              />
              <span className="font-serif text-xs">
                Hadir Palang Pintu &amp; Resepsi
              </span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${
                isAttendingReceptionOnly
                  ? 'bg-[#FED65B]/25 border-[#FED65B] font-bold text-[#410403]'
                  : 'bg-[#F6F3ED] border-[#E5E2DC] text-[#554240] hover:bg-[#F0EEE8]'
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="resepsi"
                checked={isAttendingReceptionOnly}
                onChange={() =>
                  setRsvpForm((prev: any) => ({ ...prev, status: 'resepsi' }))
                }
                className="accent-[#5E1914] w-4 h-4 shrink-0"
              />
              <span className="font-serif text-xs">Hadir Resepsi Saja</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${
                isDeclined
                  ? 'bg-rose-50 border-rose-300 font-bold text-rose-800'
                  : 'bg-[#F6F3ED] border-[#E5E2DC] text-[#554240] hover:bg-[#F0EEE8]'
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="tidak_hadir"
                checked={isDeclined}
                onChange={() =>
                  setRsvpForm((prev: any) => ({
                    ...prev,
                    status: 'tidak_hadir',
                  }))
                }
                className="accent-[#5E1914] w-4 h-4 shrink-0"
              />
              <span className="font-serif text-xs">
                Berhalangan Hadir (Kirim Doa)
              </span>
            </label>
          </div>

          {/* Jumlah Tamu */}
          {!isDeclined && (
            <div className="flex flex-col gap-1">
              <label className="font-sans text-[11px] uppercase tracking-wider text-[#410403] font-bold">
                Jumlah Orang
              </label>
              <select
                value={rsvpForm.pax}
                onChange={(e) =>
                  setRsvpForm((prev: any) => ({
                    ...prev,
                    pax: Number(e.target.value),
                  }))
                }
                className="w-full py-2.5 px-3 rounded-xl bg-[#F6F3ED] text-[#1C1C18] font-serif text-xs focus:outline-none border border-[#E5E2DC]"
              >
                <option value={1}>1 Orang</option>
                <option value={2}>2 Orang (Berpasangan)</option>
                <option value={3}>3 Orang</option>
                <option value={4}>4 Orang (Rombongan Keluarga)</option>
              </select>
            </div>
          )}

          {/* Textarea: Ucapan & Doa */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-[11px] uppercase tracking-wider text-[#410403] font-bold">
              Doa Restu &amp; Pesan Hangat
            </label>
            <textarea
              rows={3}
              value={rsvpForm.notes || ''}
              onChange={(e) =>
                setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Tuliskan doa kebaikan untuk kedua mempelai..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#F6F3ED] text-[#1C1C18] font-serif text-xs focus:outline-none border border-[#E5E2DC] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#5E1914] hover:bg-[#410403] text-[#FED65B] font-sans text-xs uppercase tracking-widest font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#FED65B]/30 mt-1"
          >
            <span className="material-symbols-outlined text-[17px]">send</span>
            <span>Kirim Doa &amp; Konfirmasi</span>
          </button>
        </form>
      </div>

      {/* PERSONALIZED VIP GUEST PASS */}
      <div className="w-full max-w-[360px] bg-[#FCF9F3] text-[#1C1C18] p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col relative overflow-hidden border border-[#FED65B]/40">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E2DC]">
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[10px] tracking-widest text-[#735c00] uppercase font-bold">
              DIGITAL PASS ACCREDITATION
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#410403] truncate">
              {guestName}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#FED65B] text-[#410403] font-sans text-xs font-bold shrink-0">
            VIP-09
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#F0EEE8] p-3 rounded-xl mb-3">
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[10px] uppercase tracking-wider text-[#554240] font-semibold">
              Penempatan Meja
            </span>
            <span className="font-sans text-xs font-bold text-[#410403] truncate">
              MEJA UTAMA FATAHILLAH • T-09
            </span>
          </div>
          <span className="material-symbols-outlined text-[#735c00] text-[24px] shrink-0">
            table_restaurant
          </span>
        </div>

        {/* Simulated Barcode */}
        <div className="w-full bg-white p-2.5 rounded-xl border border-[#E5E2DC] flex flex-col items-center">
          <div className="flex items-center justify-center gap-1 h-9 w-full px-2 overflow-hidden">
            <div className="w-1 h-full bg-[#1C1C18]" />
            <div className="w-2 h-full bg-[#1C1C18]" />
            <div className="w-0.5 h-full bg-[#1C1C18]" />
            <div className="w-1.5 h-full bg-[#1C1C18]" />
            <div className="w-3 h-full bg-[#1C1C18]" />
            <div className="w-1 h-full bg-[#1C1C18]" />
            <div className="w-0.5 h-full bg-[#1C1C18]" />
            <div className="w-2 h-full bg-[#1C1C18]" />
            <div className="w-1.5 h-full bg-[#1C1C18]" />
            <div className="w-2.5 h-full bg-[#1C1C18]" />
            <div className="w-0.5 h-full bg-[#1C1C18]" />
            <div className="w-1.5 h-full bg-[#1C1C18]" />
            <div className="w-3 h-full bg-[#1C1C18]" />
            <div className="w-1 h-full bg-[#1C1C18]" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#88726F] mt-1 font-semibold">
            BTW-2026-VIP-099
          </span>
        </div>
      </div>
    </section>
  );
};

export default RsvpSection;
