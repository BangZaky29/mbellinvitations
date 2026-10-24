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
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
}) => {
  const isAttending = rsvpForm.status === 'hadir' || rsvpForm.status === 'attending';
  const isDeclined =
    rsvpForm.status === 'tidak_hadir' ||
    rsvpForm.status === 'declined' ||
    rsvpForm.status === 'tidak';

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1.5 text-[#EAC16E]">
        <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
        <span className="font-sans text-[11px] uppercase tracking-widest font-bold">
          Konfirmasi Kehadiran
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide text-center mb-6">
        RSVP &amp; Doa Restu
      </h2>

      {/* RSVP Form Card */}
      <div className="w-full max-w-[360px] bg-[#261E1A] rounded-2xl p-5 shadow-xl flex flex-col border border-[#EAC16E]/20 mb-2 overflow-hidden">
        <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4">
          {/* Input: Nama Lengkap */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-[11px] text-[#D1C5B3] uppercase tracking-wider font-semibold">
              Nama Lengkap Tamu
            </label>
            <input
              type="text"
              required
              value={rsvpForm.name}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Bpk. Maruli Tambunan & Istri"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#19120E] text-[#FAF6EE] placeholder:text-[#9A8F7F]/60 border border-[#4E4638] focus:outline-none focus:border-[#EAC16E] font-sans text-xs transition-colors"
            />
          </div>

          {/* Radio Buttons: Konfirmasi Kehadiran */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] text-[#D1C5B3] uppercase tracking-wider font-semibold">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl cursor-pointer border transition-all text-center ${
                  isAttending
                    ? 'bg-[#EAC16E]/15 border-[#EAC16E] text-[#EAC16E] font-bold shadow-xs'
                    : 'bg-[#19120E] border-[#4E4638]/50 text-[#FAF6EE]/80 hover:border-[#EAC16E]/40'
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="hadir"
                  checked={isAttending}
                  onChange={() => setRsvpForm((prev: any) => ({ ...prev, status: 'hadir' }))}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-[17px]">check_circle</span>
                <span className="font-sans text-xs">Hadir</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl cursor-pointer border transition-all text-center ${
                  isDeclined
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-300 font-bold shadow-xs'
                    : 'bg-[#19120E] border-[#4E4638]/50 text-[#FAF6EE]/80 hover:border-[#EAC16E]/40'
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="tidak_hadir"
                  checked={isDeclined}
                  onChange={() => setRsvpForm((prev: any) => ({ ...prev, status: 'tidak_hadir' }))}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-[17px]">cancel</span>
                <span className="font-sans text-xs">Tidak Hadir</span>
              </label>
            </div>
          </div>

          {/* Dropdown: Jumlah Tamu */}
          {isAttending && (
            <div className="flex flex-col gap-1">
              <label className="font-sans text-[11px] text-[#D1C5B3] uppercase tracking-wider font-semibold">
                Jumlah Tamu
              </label>
              <select
                value={rsvpForm.pax}
                onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, pax: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#19120E] text-[#FAF6EE] border border-[#4E4638] focus:outline-none focus:border-[#EAC16E] font-sans text-xs transition-colors"
              >
                <option value={1}>1 Orang Tamu</option>
                <option value={2}>2 Orang Tamu (Beserta Pendamping)</option>
                <option value={3}>3 Orang Tamu</option>
                <option value={4}>4 Orang Tamu</option>
              </select>
            </div>
          )}

          {/* Textarea: Ucapan & Doa */}
          <div className="flex flex-col gap-1">
            <label className="font-sans text-[11px] text-[#D1C5B3] uppercase tracking-wider font-semibold">
              Doa &amp; Ucapan Selamat
            </label>
            <textarea
              rows={3}
              value={rsvpForm.notes || ''}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))}
              placeholder="Tuliskan ucapan dan doa restu untuk kedua mempelai..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#19120E] text-[#FAF6EE] placeholder:text-[#9A8F7F]/60 border border-[#4E4638] focus:outline-none focus:border-[#EAC16E] font-sans text-xs resize-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#85291B] hover:bg-[#630F05] text-[#FFDAD4] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer mt-1"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Kirim Ucapan &amp; Konfirmasi</span>
          </button>
        </form>
      </div>
    </section>
  );
};
