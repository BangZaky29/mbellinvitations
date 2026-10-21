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
        RSVP Undangan
      </h2>

      {/* RSVP Form */}
      <form
        onSubmit={handleRsvpSubmit}
        className="w-full max-w-sm rounded-3xl p-6 bg-white shadow-md flex flex-col gap-4 border border-[#c5a059]/30 reveal-scale delay-150"
      >
        <div>
          <label className="text-xs font-semibold text-[#1b1c1a] block mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={rsvpForm.name}
            onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
            placeholder="Ketik nama Anda"
            className="w-full px-4 py-2.5 rounded-xl bg-[#fbf9f6] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#ede9e1] focus:border-[#c5a059]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1b1c1a] block mb-2">
            Konfirmasi Kehadiran
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[
              { key: 'hadir', label: 'Hadir', cls: 'bg-[#8a6822] text-white shadow-xs' },
              { key: 'ragu', label: 'Masih Ragu', cls: 'bg-[#c5a059] text-white shadow-xs' },
              { key: 'tidak', label: 'Berhalangan', cls: 'bg-[#54463d] text-white shadow-xs' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveRsvpTab(item.key as any);
                  setRsvpForm({
                    ...rsvpForm,
                    status: item.key === 'tidak' ? 'declined' : 'hadir',
                  });
                }}
                className={`py-2 px-1 sm:px-2 text-center rounded-xl text-[10.5px] sm:text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center min-h-[42px] leading-tight ${
                  activeRsvpTab === item.key
                    ? item.cls
                    : 'bg-[#f4efe4] text-[#1b1c1a] hover:bg-[#ede7dc]'
                }`}
              >
                <span className="w-full text-center break-words [overflow-wrap:anywhere]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

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
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
            <option value="3">3 Orang</option>
            <option value="4">4 Orang</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#8a6822] text-white text-xs font-semibold shadow-md hover:bg-[#6e5318] transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">send</span>
          <span>Kirim Konfirmasi Kehadiran</span>
        </button>
      </form>
    </section>
  );
};

export default RsvpSection;
