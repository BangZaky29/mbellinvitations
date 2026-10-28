import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  BetawiBatikWatermark,
  BetawiCornerFloral,
} from '../components';

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

  return (
    <section className="relative w-full px-4 pt-4 pb-6 flex flex-col items-center bg-[#410403] text-[#FAF6EE] overflow-hidden">
      {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark */}
      <BetawiBatikWatermark opacityClass="opacity-[0.06]" />

      {/* INTERACTIVE RSVP FORM */}
      <div className="relative w-full max-w-[360px] bg-white text-[#1C1C18] p-5 rounded-2xl shadow-xl flex flex-col mb-6 border border-[#FED65B]/30 overflow-hidden z-10">
        <BetawiCornerFloral position="top-left" className="absolute top-2.5 left-2.5 w-7 h-7 text-[#FED65B]/60" />
        <BetawiCornerFloral position="top-right" className="absolute top-2.5 right-2.5 w-7 h-7 text-[#FED65B]/60" />
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
              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${isAttendingFull
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
              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${isAttendingReceptionOnly
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
              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${isDeclined
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
    </section>
  );
};

export default RsvpSection;
