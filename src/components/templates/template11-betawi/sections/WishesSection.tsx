import React, { useState } from 'react';
import type { WishItem } from '../../../../types/invitation';
import { formatWishTime } from '../../../../utils/dateHelper';
import {
  BetawiBatikWatermark,
  BetawiCornerFloral,
} from '../components';

interface WishesSectionProps {
  wishes: WishItem[];
}

export const WishesSection: React.FC<WishesSectionProps> = ({ wishes }) => {
  const [visibleCount, setVisibleCount] = useState(4);

  const defaultWishes: WishItem[] = [
    {
      id: 'w-1',
      guest_name: 'H. Romli & Keluarga (Condet)',
      attendance: 'attending',
      message:
        'Selamat buat Abang Rizky & None Fatimah! Semoga langgeng kayak pohon kelapa, berkah rejekinye, rukun terus sampai kakek-nenek. Aamiin ya rabbal alamin.',
      created_at: '2 jam yang lalu',
    },
    {
      id: 'w-2',
      guest_name: 'Mpok Leha & Bang Jampang',
      attendance: 'attending',
      message:
        'Makan kerak telor diciprat kuah soto, selamat menempuh hidup baru buat kedua mempelai! Lancar acaranye, sukses pelaminan agung hajatan Betawinye!',
      created_at: '5 jam yang lalu',
    },
    {
      id: 'w-3',
      guest_name: 'Keluarga Besar Silat Beksi Petukangan',
      attendance: 'attending',
      message:
        'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khoir. Salam takzim dari kami sekeluarga perguruan.',
      created_at: '1 hari yang lalu',
    },
  ];

  const items = wishes && wishes.length > 0 ? wishes : defaultWishes;
  const displayedItems = items.slice(0, visibleCount);

  return (
    <section className="relative w-full px-4 pt-2 pb-6 flex flex-col items-center bg-[#410403] text-[#FAF6EE] overflow-hidden">
      {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark */}
      <BetawiBatikWatermark opacityClass="opacity-[0.06]" />

      {/* Title */}
      <div className="flex items-center gap-1.5 mb-1 text-[#FED65B] z-10">
        <span className="material-symbols-outlined text-[18px]">forum</span>
        <span className="font-sans text-[11px] uppercase tracking-widest font-bold">
          BUKU TAMU &amp; DOA RESTU
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#FCF9F3] font-bold text-center mb-5 z-10">
        Untaian Doa Kebaikan
      </h2>

      {/* Wishes List Container */}
      <div className="w-full max-w-[360px] flex flex-col gap-3 z-10">
        {displayedItems.map((wish, idx) => {
          const guestName =
            wish.guest_name ||
            (wish as any).sender_name ||
            (wish as any).name ||
            'Tamu Undangan';
          const timeText = formatWishTime(wish.created_at || (wish as any).time);
          const isAttending =
            wish.attendance === 'attending' ||
            (wish as any).attendance_status === 'hadir' ||
            (wish as any).attendance === 'hadir';
          const isDeclined =
            wish.attendance === 'declined' ||
            (wish as any).attendance_status === 'tidak_hadir' ||
            (wish as any).attendance === 'tidak_hadir';

          return (
            <div
              key={wish.id || idx}
              className="bg-white text-[#1C1C18] rounded-2xl p-4 shadow-sm border border-[#FED65B]/30 flex flex-col gap-1.5 relative overflow-hidden"
            >
              <BetawiCornerFloral position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#FED65B]/40" />
              <BetawiCornerFloral position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#FED65B]/40" />
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-sm font-bold text-[#410403] break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                  {guestName}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-sans font-semibold shrink-0 ${
                    isAttending
                      ? 'bg-[#003B0A]/15 text-[#003B0A]'
                      : isDeclined
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#F0EEE8] text-[#554240]'
                  }`}
                >
                  {isAttending ? 'Hadir' : isDeclined ? 'Tidak Hadir' : 'Konfirmasi'}
                </span>
              </div>

              <p className="font-serif text-xs text-[#554240] leading-relaxed break-words [overflow-wrap:anywhere]">
                {wish.message || (wish as any).wishes || ''}
              </p>

              {timeText && (
                <span className="font-sans text-[10px] text-[#88726F] mt-0.5">
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
            className="w-full py-2.5 rounded-full bg-[#5E1914] hover:bg-[#410403] text-[#FED65B] font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors border border-[#FED65B]/30 cursor-pointer mt-1"
          >
            <span>Tampilkan Doa Lainnya</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default WishesSection;
