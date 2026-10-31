import React from 'react';
import type { WishItem } from '../../../../types/invitation';
import { BugisCornerOrnament } from '../components';

interface WishesSectionProps {
  wishes: WishItem[];
}

export const WishesSection: React.FC<WishesSectionProps> = ({ wishes }) => {
  return (
    <section className="relative w-full px-4 py-8 bg-[#00170E] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center mb-6">
        <div className="w-9 h-9 rounded-full bg-[#052519] text-[#F2CA50] flex items-center justify-center mb-2 border border-[#F2CA50]/30 shadow-md">
          <span className="material-symbols-outlined text-[19px]">volunteer_activism</span>
        </div>
        <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
          Untaian Doa &amp; Restu
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#C8EAD8] font-bold mt-1">
          Buku Tamu Doa Restu
        </h2>
        <p className="font-sans text-xs text-[#D7C594] mt-1">
          Lantunan doa restu dari para kerabat, sahabat, dan tamu undangan terhormat.
        </p>
      </div>

      {/* Wishes Stream List */}
      <div className="w-full max-w-sm flex flex-col gap-3.5 max-h-[460px] overflow-y-auto no-scrollbar pr-0.5">
        {(!wishes || wishes.length === 0) && (
          <div className="p-6 rounded-2xl bg-[#052519]/70 border border-[#F2CA50]/20 text-center">
            <span className="font-sans text-xs text-[#D0C5AF]/80 italic">
              Belum ada ucapan. Jadilah yang pertama memberikan doa restu bagi kedua mempelai!
            </span>
          </div>
        )}

        {wishes &&
          wishes.map((w, idx) => {
            const guestName = w.guest_name || (w as any).name || 'Tamu Undangan';
            const message = w.message || '';
            const isAttending = w.attendance === 'attending';

            const firstLetter = (guestName.charAt(0) || 'A').toUpperCase();

            // Format timestamp
            let timeStr = 'Baru saja';
            if (w.created_at) {
              try {
                const d = new Date(w.created_at);
                if (!isNaN(d.getTime())) {
                  timeStr = d.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                }
              } catch (_) {
                timeStr = '';
              }
            }

            return (
              <div
                key={w.id || idx}
                className="relative p-4 rounded-xl bg-[#052519]/85 backdrop-blur-md border border-[#F2CA50]/20 shadow-sm flex flex-col overflow-hidden text-left"
              >
                <BugisCornerOrnament position="top-left" className="absolute top-1 left-1 w-3.5 h-3.5 text-[#F2CA50]/20" />
                <BugisCornerOrnament position="top-right" className="absolute top-1 right-1 w-3.5 h-3.5 text-[#F2CA50]/20" />

                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#F2CA50] text-[#00170E] font-serif text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                      {firstLetter}
                    </div>
                    <span className="font-serif text-xs font-bold text-[#C8EAD8] truncate">
                      {guestName}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      isAttending
                        ? 'bg-[#F2CA50]/15 text-[#F2CA50] border border-[#F2CA50]/30'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {isAttending ? 'Hadir' : 'Absen'}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#D0C5AF] leading-relaxed break-words [overflow-wrap:anywhere]">
                  {message}
                </p>

                {timeStr && (
                  <span className="font-sans text-[9px] text-[#D7C594]/60 mt-2 text-right">
                    {timeStr}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};
