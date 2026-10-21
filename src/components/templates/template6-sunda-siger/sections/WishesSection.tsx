import React from 'react';
import type { WishItem } from '../../types';

export interface SundaWishesProps {
  wishes: WishItem[];
  wishForm: { name: string; message: string };
  setWishForm: (form: any) => void;
  handleWishSubmit: (e: React.FormEvent) => void;
}

export const WishesSection: React.FC<SundaWishesProps> = ({
  wishes,
  wishForm,
  setWishForm,
  handleWishSubmit,
}) => {
  return (
    <section
      className="w-full px-5 py-12 bg-white flex flex-col items-center border-b border-[#ede9e1]"
      id="ucapan"
    >
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase text-center reveal">
        Buku Tamu Virtual
      </span>
      <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-6 text-center reveal delay-100">
        Untaian Doa &amp; Restu
      </h2>

      {/* Wish Input Box */}
      <form
        onSubmit={handleWishSubmit}
        className="w-full max-w-sm rounded-3xl p-5 bg-[#fbf9f6] shadow-sm flex flex-col gap-3 mb-6 border border-[#c5a059]/30 reveal-scale delay-150"
      >
        <input
          type="text"
          required
          value={wishForm.name}
          onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
          placeholder="Nama Anda"
          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1b1c1a] text-xs focus:outline-none border border-[#ede9e1] focus:border-[#c5a059]"
        />
        <textarea
          rows={3}
          required
          value={wishForm.message}
          onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
          placeholder="Tuliskan ucapan dan doa tulus untuk mempelai..."
          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1b1c1a] text-xs focus:outline-none border border-[#ede9e1] focus:border-[#c5a059] resize-none"
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-[#8a6822] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#6e5318] transition-colors cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[17px]">favorite</span>
          <span>Kirim Doa Restu</span>
        </button>
      </form>

      {/* Feed of Heartfelt Wishes */}
      <div className="w-full max-w-sm flex flex-col gap-3 pr-1">
        {wishes.map((w, idx) => (
          <div
            key={w.id || idx}
            className="p-4 rounded-2xl bg-[#fbf9f6] shadow-2xs flex flex-col border border-[#ede9e1]"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#f4efe4] text-[#5d4201] border border-[#c5a059]/30 flex items-center justify-center font-serif text-xs font-bold shrink-0">
                  {(w.guest_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#1b1c1a] break-words [overflow-wrap:anywhere]">
                    {w.guest_name}
                  </span>
                  <span className="text-[10px] text-[#735855]">
                    {w.created_at ? new Date(w.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#4e4639] leading-relaxed text-left break-words [overflow-wrap:anywhere]">
              {w.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishesSection;
