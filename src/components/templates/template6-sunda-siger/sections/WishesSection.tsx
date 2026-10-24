import React from 'react';
import type { WishItem } from '../../types';
import { formatWishTime } from '../../../../utils/dateHelper';

export interface SundaWishesProps {
  wishes: WishItem[];
  wishForm?: { name: string; message: string };
  setWishForm?: (form: any) => void;
  handleWishSubmit?: (e: React.FormEvent) => void;
}

export const WishesSection: React.FC<SundaWishesProps> = ({
  wishes,
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

      {/* Feed of Heartfelt Wishes */}
      <div className="w-full max-w-sm flex flex-col gap-3 pr-1 max-h-[480px] overflow-y-auto no-scrollbar overscroll-contain">
        {wishes && wishes.length > 0 ? (
          wishes.map((w, idx) => (
            <div
              key={w.id || idx}
              className="p-4 rounded-2xl bg-[#fbf9f6] shadow-2xs flex flex-col border border-[#ede9e1]"
            >
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#ede9e1]/60">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#f4efe4] text-[#5d4201] border border-[#c5a059]/30 flex items-center justify-center font-serif text-xs font-bold shrink-0">
                    {(w.guest_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#1b1c1a] break-words [overflow-wrap:anywhere]">
                      {w.guest_name}
                    </span>
                    <span className="text-[10px] text-[#735855]">
                      {formatWishTime(w.created_at)}
                    </span>
                  </div>
                </div>

                {w.attendance && (
                  <span
                    className={`text-[9.5px] font-sans font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                      w.attendance === 'attending'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/70'
                        : w.attendance === 'declined'
                        ? 'bg-rose-50 text-rose-800 border border-rose-300/70'
                        : 'bg-amber-50 text-amber-800 border border-amber-300/70'
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
              <p className="text-xs text-[#4e4639] leading-relaxed text-left break-words [overflow-wrap:anywhere]">
                {w.message}
              </p>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 px-4 rounded-2xl bg-[#fbf9f6] border border-[#ede9e1]">
            <span className="material-symbols-outlined text-3xl text-[#c5a059] mb-2">mark_chat_read</span>
            <p className="text-xs text-[#735855]">
              Belum ada ucapan dan doa restu. Kirimkan ucapan pertama Anda di atas!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishesSection;
