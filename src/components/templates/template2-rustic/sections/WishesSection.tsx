import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { WishItem } from '../../../../types/invitation';

export interface RusticWishesProps extends BaseSectionProps {
  wishes: WishItem[];
  wishForm?: { name: string; message: string; relation?: string };
  setWishForm?: (form: any) => void;
  handleWishSubmit?: (e: React.FormEvent) => void;
}

export const WishesSection: React.FC<RusticWishesProps> = ({
  wishes,
}) => {
  return (
    <section id="ucapan-section" className="flex flex-col py-space-xl">
      <div className="text-center mb-space-lg">
        <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
          Prayers &amp; Wishes
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
          Untaian Doa &amp; Ucapan
        </h3>
        <p className="text-xs text-[#4D5E53] mt-1">
          Untaian kata dan doa tulus untuk mengiringi langkah baru kami
        </p>
      </div>

      {/* Live Wishes Feed */}
      <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-0.5" id="wishesFeed">
        {wishes && wishes.length > 0 ? (
          wishes.map((wish, i) => {
            const initials = wish.guest_name
              ? wish.guest_name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'DS';

            const avatarBg =
              i % 2 === 0
                ? 'bg-[#8C4E2D] text-white'
                : 'bg-[#2C4034] text-white';

            return (
              <div key={wish.id || i} className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C4034]/10">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#2C4034]/10">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full ${avatarBg} font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                    >
                      {initials}
                    </div>
                    <span className="font-serif text-sm font-bold text-[#2C4034] break-words [overflow-wrap:anywhere]">
                      {wish.guest_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {wish.attendance && (
                      <span
                        className={`text-[9.5px] font-sans font-medium px-2 py-0.5 rounded-full ${
                          wish.attendance === 'attending'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : wish.attendance === 'declined'
                            ? 'bg-rose-50 text-rose-800 border border-rose-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {wish.attendance === 'attending'
                          ? 'Hadir'
                          : wish.attendance === 'declined'
                          ? 'Berhalangan'
                          : 'Ragu-ragu'}
                      </span>
                    )}
                    <span className="text-[10px] text-[#4D5E53]/70 font-sans">
                      {wish.created_at
                        ? new Date(wish.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Baru saja'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#4D5E53] leading-relaxed break-words [overflow-wrap:anywhere]">
                  &ldquo;{wish.message}&rdquo;
                </p>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center rounded-2xl bg-white border border-[#2C4034]/10">
            <span className="material-symbols-outlined text-3xl text-[#8C4E2D] mb-2">mark_chat_read</span>
            <p className="text-xs text-[#4D5E53]">
              Belum ada doa dan ucapan. Kirimkan doa restu pertama Anda di atas!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
