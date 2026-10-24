import React from 'react';

export interface SundaRsvpProps {
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

export const RsvpSection: React.FC<SundaRsvpProps> = ({
  rsvpForm,
  setRsvpForm,
  activeRsvpTab,
  setActiveRsvpTab,
  handleRsvpSubmit,
}) => {
  return (
    <section
      className="w-full px-5 py-12 bg-[#f7f4ed] flex flex-col items-center"
      id="rsvp"
    >
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase text-center reveal">
        Konfirmasi Kehadiran
      </span>
      <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-6 text-center reveal delay-100">
        RSVP &amp; Doa Restu
      </h2>

      {/* RSVP Form */}
      <form
        onSubmit={handleRsvpSubmit}
        className="w-full max-w-sm rounded-3xl p-6 bg-white shadow-md flex flex-col gap-4 border border-[#c5a059]/30 reveal-scale delay-150"
      >
        <div>
          <label className="text-xs font-semibold text-[#1b1c1a] block mb-1">
            Nama Lengkap Tamu
          </label>
          <input
            type="text"
            required
            value={rsvpForm.name}
            onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
            placeholder="Ketik nama lengkap Anda"
            className="w-full px-4 py-2.5 rounded-xl bg-[#fbf9f6] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#ede9e1] focus:border-[#c5a059]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1b1c1a] block mb-2">
            Konfirmasi Kehadiran
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'hadir', label: 'Hadir', icon: 'check_circle', cls: 'bg-[#8a6822] text-white shadow-xs font-semibold' },
              { key: 'tidak', label: 'Tidak Hadir', icon: 'cancel', cls: 'bg-rose-950/15 text-rose-800 border border-rose-300 shadow-xs font-semibold' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveRsvpTab(item.key as any);
                  setRsvpForm({
                    ...rsvpForm,
                    status: item.key === 'tidak' ? 'tidak_hadir' : 'hadir',
                  });
                }}
                className={`py-2.5 px-3 text-center rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] ${
                  activeRsvpTab === item.key
                    ? item.cls
                    : 'bg-[#f4efe4] text-[#1b1c1a] hover:bg-[#ede7dc]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeRsvpTab === 'hadir' && (
          <div>
            <label className="text-xs font-semibold text-[#1b1c1a] block mb-1">
              Jumlah Tamu
            </label>
            <select
              value={rsvpForm.pax}
              onChange={(e) =>
                setRsvpForm({ ...rsvpForm, pax: Number(e.target.value) || 1 })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf9f6] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#ede9e1] focus:border-[#c5a059]"
            >
              <option value="1">1 Orang Tamu</option>
              <option value="2">2 Orang Tamu</option>
              <option value="3">3 Orang Tamu</option>
              <option value="4">4 Orang Tamu</option>
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-[#1b1c1a] block mb-1">
            Doa &amp; Ucapan Selamat
          </label>
          <textarea
            rows={3}
            value={(rsvpForm as any).notes || ''}
            onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })}
            placeholder="Tuliskan ucapan dan doa restu untuk kedua mempelai..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#fbf9f6] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#ede9e1] focus:border-[#c5a059] resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#8a6822] text-white text-xs font-semibold shadow-md hover:bg-[#6e5318] transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">send</span>
          <span>Kirim Ucapan &amp; Konfirmasi</span>
        </button>
      </form>
    </section>
  );
};

export default RsvpSection;
