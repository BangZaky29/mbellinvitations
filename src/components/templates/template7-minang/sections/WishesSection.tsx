import React from 'react';
import type { WishItem } from '../../types';

export interface MinangWishesProps {
  wishes: WishItem[];
  wishForm: { name: string; message: string };
  setWishForm: (form: any) => void;
  handleWishSubmit: (e: React.FormEvent) => void;
}

export const WishesSection: React.FC<MinangWishesProps> = ({
  wishes,
  wishForm,
  setWishForm,
  handleWishSubmit,
}) => {
  return (
    <section
      id="ucapan"
      className="bg-[#FAF6EE] text-[#1B0609] px-5 pt-8 pb-10 relative"
      style={{ backgroundColor: '#FAF6EE', color: '#1B0609' }}
    >
      <div className="text-center mb-6">
        <span className="font-script text-2xl text-[#7D5C1E]">Buku Tamu Virtual</span>
        <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#2E0A10]">
          UNTAIAN DOA &amp; RESTU
        </h3>
        <div className="w-10 h-0.5 bg-[#D4AF37]/60 mx-auto mt-1" />
      </div>

      {/* Wish Submission Form */}
      <form
        onSubmit={handleWishSubmit}
        className="w-full max-w-sm mx-auto rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-3 mb-6 border border-[#D4AF37]/40"
      >
        <input
          type="text"
          required
          value={wishForm.name}
          onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
          placeholder="Nama Anda"
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] text-[#2E0A10] text-xs focus:outline-none border border-[#D4AF37]/40 focus:border-[#D4AF37] placeholder-[#2E0A10]/40"
        />
        <textarea
          rows={3}
          required
          value={wishForm.message}
          onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
          placeholder="Tuliskan ucapan dan doa tulus untuk kedua mempelai..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] text-[#2E0A10] text-xs focus:outline-none border border-[#D4AF37]/40 focus:border-[#D4AF37] resize-none placeholder-[#2E0A10]/40"
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl gold-gradient-btn text-[#1B0609] text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[17px]">favorite</span>
          <span>Kirim Doa Restu</span>
        </button>
      </form>

      {/* Feed of Wishes */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
        {wishes.map((w, idx) => (
          <div
            key={w.id || idx}
            className="p-3.5 rounded-xl bg-white shadow-2xs flex flex-col border border-[#D4AF37]/30 relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-[#2E0A10] text-[#F5E296] border border-[#D4AF37]/50 flex items-center justify-center font-cinzel text-xs font-bold shrink-0">
                  {(w.guest_name || 'T').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-serif text-sm font-bold text-[#2E0A10] truncate">
                    {w.guest_name}
                  </h5>
                  <span className="text-[10px] text-[#4A121A]/70 font-sans block">
                    {w.created_at
                      ? new Date(w.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Baru saja'}
                  </span>
                </div>
              </div>

              {w.attendance && (
                <span
                  className={`text-[9.5px] font-sans font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    w.attendance === 'attending'
                      ? 'bg-emerald-900/15 text-emerald-800 border border-emerald-600/30'
                      : w.attendance === 'declined'
                      ? 'bg-rose-900/15 text-rose-800 border border-rose-600/30'
                      : 'bg-amber-900/15 text-amber-800 border border-amber-600/30'
                  }`}
                >
                  {w.attendance === 'attending'
                    ? 'Hadir'
                    : w.attendance === 'declined'
                    ? 'Berhalangan'
                    : 'Ragu-ragu'}
                </span>
              )}
            </div>

            <p className="text-xs text-[#2E0A10]/90 font-sans leading-relaxed break-words [overflow-wrap:anywhere]">
              {w.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishesSection;
