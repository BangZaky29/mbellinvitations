import React, { useState } from 'react';
import type { WishItem } from '../../../../types/invitation';
import { formatWishTime } from '../../../../utils/dateHelper';

interface WishesSectionProps {
  wishes: WishItem[];
}

export const WishesSection: React.FC<WishesSectionProps> = ({ wishes }) => {
  const [visibleCount, setVisibleCount] = useState(4);

  const defaultWishes: WishItem[] = [
    {
      id: 'w-1',
      guest_name: 'Bpk. St. Mangapul Siregar & Keluarga',
      attendance: 'attending',
      message:
        'Selamat mangalap boru tu lae Johannes dohot paribandiba dr. Melisa. Sai gabe jala horas ma pardengganbasaon muna, tubu anak na bisuk jala boru na malo marparange.',
      created_at: '2 jam yang lalu',
    },
    {
      id: 'w-2',
      guest_name: 'Ny. Dameria Simanjuntak br. Sitompul',
      attendance: 'attending',
      message:
        'Tuhan Yesus memberkati bahtera rumah tangga Johannes dan Melisa. Seia sekata menapaki jalan hidup baru di dalam damai Kristus.',
      created_at: '5 jam yang lalu',
    },
    {
      id: 'w-3',
      guest_name: 'Keluarga Besar Parsadaan Siraja Oloan',
      attendance: 'attending',
      message:
        'Horas jala gabe! Kiranya pesta adat berlangsung dengan lancar, penuh berkat dan sukacita dari awal hingga selesai.',
      created_at: '1 hari yang lalu',
    },
  ];

  const items = wishes && wishes.length > 0 ? wishes : defaultWishes;
  const displayedItems = items.slice(0, visibleCount);

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1.5 text-[#EAC16E]">
        <span className="material-symbols-outlined text-[18px]">forum</span>
        <span className="font-sans text-[11px] uppercase tracking-widest font-bold">
          Doa &amp; Ucapan Tamu
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide text-center mb-6">
        Untaian Doa Restu
      </h2>

      {/* Wishes List Container */}
      <div className="w-full max-w-[360px] flex flex-col gap-3">
        {displayedItems.map((wish, idx) => {
          const guestName = wish.guest_name || (wish as any).name || 'Tamu Undangan';
          const timeText = formatWishTime(wish.created_at || (wish as any).time);
          const isAttending = wish.attendance === 'attending' || (wish.attendance as any) === 'hadir';
          const isDeclined = wish.attendance === 'declined' || (wish.attendance as any) === 'tidak_hadir';

          return (
            <div
              key={wish.id || idx}
              className="bg-[#261E1A] rounded-xl p-4 shadow-sm border border-[#EAC16E]/15 flex flex-col gap-1.5 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-sm font-bold text-[#EAC16E] break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                  {guestName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3C332E] text-[#D1C5B3] shrink-0 font-sans">
                  {isAttending ? 'Hadir' : isDeclined ? 'Tidak Hadir' : 'Ragu'}
                </span>
              </div>

              <p className="font-sans text-xs text-[#FAF6EE] leading-relaxed break-words [overflow-wrap:anywhere]">
                {wish.message}
              </p>

              {timeText && (
                <span className="font-sans text-[10px] text-[#D1C5B3]/60 mt-0.5">
                  {timeText}
                </span>
              )}
            </div>
          );
        })}

        {visibleCount < items.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="w-full py-2.5 rounded-xl bg-[#261E1A] hover:bg-[#3C332E] text-[#EAC16E] font-sans text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1 transition-colors border border-[#EAC16E]/20 cursor-pointer mt-1"
          >
            <span>Tampilkan Ucapan Lainnya</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        )}
      </div>
    </section>
  );
};
