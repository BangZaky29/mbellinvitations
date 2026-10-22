import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface MinangRsvpProps extends BaseSectionProps {
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
  };
  setRsvpForm: (form: any) => void;
  activeRsvpTab: 'hadir' | 'ragu' | 'tidak';
  setActiveRsvpTab: React.Dispatch<React.SetStateAction<'hadir' | 'ragu' | 'tidak'>>;
  handleRsvpSubmit: (e: React.FormEvent) => void;
}

export const RsvpSection: React.FC<MinangRsvpProps> = ({
  rsvpForm,
  setRsvpForm,
  activeRsvpTab,
  setActiveRsvpTab,
  handleRsvpSubmit,
}) => {
  return (
    <section
      id="rsvp"
      className="bg-[#1B0609] text-[#FAF6EE] px-5 pt-8 pb-10 bg-texture-noise relative"
      style={{ backgroundColor: '#1B0609', color: '#FAF6EE' }}
    >
      {/* Section Title */}
      <div className="text-center mb-6">
        <span className="font-script text-2xl text-[#F5E296]">Konfirmasi Undangan</span>
        <h4 className="font-cinzel text-xl font-bold tracking-wider text-gold-shimmer">
          RSVP KEHADIRAN
        </h4>
        <p className="text-xs text-[#FAF6EE]/75 font-sans mt-1 max-w-[300px] mx-auto">
          Mohon konfirmasi kehadiran Anda demi kelancaran jamuan Baralek Gadang.
        </p>
      </div>

      {/* Interactive RSVP Form */}
      <div className="bg-[#2E0A10] rounded-2xl p-5 border border-[#D4AF37]/50 shadow-2xl max-w-[340px] mx-auto text-left">
        <form className="space-y-4" onSubmit={handleRsvpSubmit}>
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-sans font-semibold text-[#F5E296] mb-1">
              Nama Lengkap Tamu
            </label>
            <input
              type="text"
              required
              value={rsvpForm.name}
              onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
              placeholder="Contoh: Dt. Maruhun Basa & Istri"
              className="w-full bg-[#1B0609] border border-[#D4AF37]/40 rounded-lg px-3 py-2 text-xs text-white placeholder-[#FAF6EE]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
            />
          </div>

          {/* Attendance Radio Buttons */}
          <div>
            <label className="block text-xs font-sans font-semibold text-[#F5E296] mb-1.5">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                onClick={() => {
                  setActiveRsvpTab('hadir');
                  setRsvpForm({ ...rsvpForm, status: 'attending' });
                }}
                className={`flex items-center justify-center p-2 rounded-lg border text-xs cursor-pointer transition-all ${activeRsvpTab === 'hadir'
                    ? 'border-[#D4AF37] gold-gradient-btn text-[#1B0609] font-bold shadow-xs'
                    : 'border-[#D4AF37]/30 bg-[#1B0609] text-[#FAF6EE]/80 hover:border-[#D4AF37]/60'
                  }`}
              >
                <span>Hadir</span>
              </label>

              <label
                onClick={() => {
                  setActiveRsvpTab('ragu');
                  setRsvpForm({ ...rsvpForm, status: 'tentative' });
                }}
                className={`flex items-center justify-center p-2 rounded-lg border text-xs cursor-pointer transition-all ${activeRsvpTab === 'ragu'
                    ? 'border-[#D4AF37] gold-gradient-btn text-[#1B0609] font-bold shadow-xs'
                    : 'border-[#D4AF37]/30 bg-[#1B0609] text-[#FAF6EE]/80 hover:border-[#D4AF37]/60'
                  }`}
              >
                <span>Ragu-ragu</span>
              </label>

              <label
                onClick={() => {
                  setActiveRsvpTab('tidak');
                  setRsvpForm({ ...rsvpForm, status: 'declined' });
                }}
                className={`flex items-center justify-center p-2 rounded-lg border text-xs cursor-pointer transition-all ${activeRsvpTab === 'tidak'
                    ? 'border-[#D4AF37] gold-gradient-btn text-[#1B0609] font-bold shadow-xs'
                    : 'border-[#D4AF37]/30 bg-[#1B0609] text-[#FAF6EE]/80 hover:border-[#D4AF37]/60'
                  }`}
              >
                <span>Berhalangan</span>
              </label>
            </div>
          </div>

          {/* Guest Count Pax Dropdown */}
          <div>
            <label className="block text-xs font-sans font-semibold text-[#F5E296] mb-1">
              Jumlah Tamu
            </label>
            <select
              value={rsvpForm.pax}
              onChange={(e) => setRsvpForm({ ...rsvpForm, pax: Number(e.target.value) })}
              className="w-full bg-[#1B0609] border border-[#D4AF37]/40 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
            >
              <option className="bg-[#1B0609] text-white" value={1}>
                1 Orang
              </option>
              <option className="bg-[#1B0609] text-white" value={2}>
                2 Orang (Bawa Pasangan)
              </option>
              <option className="bg-[#1B0609] text-white" value={3}>
                3 Orang / Keluarga
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-btn text-[#1B0609] font-sans font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Kirim Konfirmasi Kehadiran</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default RsvpSection;
