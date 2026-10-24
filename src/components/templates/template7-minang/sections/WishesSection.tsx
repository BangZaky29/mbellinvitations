import React from 'react';
import type { WishItem } from '../../types';
import { formatWishTime } from '../../../../utils/dateHelper';

export interface MinangWishesProps {
  wishes: WishItem[];
  wishForm?: { name: string; message: string };
  setWishForm?: (form: any) => void;
  handleWishSubmit?: (e: React.FormEvent) => void;
}

export const WishesSection: React.FC<MinangWishesProps> = ({
  wishes,
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
        <div className="w-10 h-0.5 bg-[#D4AF37]/60 mx-auto mt-1 mb-6" />
      </div>

      {/* Feed of Wishes */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3.5 max-h-[480px] overflow-y-auto no-scrollbar pr-0.5 overscroll-contain">
        {wishes && wishes.length > 0 ? (
          wishes.map((w, idx) => (
            <div
              key={w.id || idx}
              className="p-4 sm:p-4.5 rounded-xl bg-white shadow-sm flex flex-col border border-[#D4AF37]/35 relative shrink-0 transition-all"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E0A10] to-[#4A121A] text-[#F5E296] border border-[#D4AF37]/60 flex items-center justify-center font-cinzel text-xs font-bold shrink-0 shadow-xs">
                    {(w.guest_name || 'T').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif text-[13px] font-bold text-[#2E0A10] truncate">
                      {w.guest_name}
                    </h5>
                    <span className="text-[10px] text-[#7D5C1E]/80 font-sans block">
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

              <div className="pt-2.5">
                <p className="text-xs sm:text-[13px] text-[#2E0A10]/95 font-sans leading-relaxed break-words [overflow-wrap:anywhere]">
                  {w.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 px-4 rounded-xl bg-white/70 border border-[#D4AF37]/30">
            <span className="material-symbols-outlined text-3xl text-[#D4AF37] mb-2">mark_chat_read</span>
            <p className="text-xs text-[#2E0A10]/70 font-sans">
              Belum ada ucapan dan doa restu. Kirimkan ucapan pertama Anda di atas!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishesSection;
