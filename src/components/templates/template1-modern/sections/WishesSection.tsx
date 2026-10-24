import React from 'react';
import type { BaseSectionProps, WishItem } from '../../types';
import { formatWishTime } from '../../../../utils/dateHelper';

export interface ModernWishesSectionProps extends BaseSectionProps {
  wishes: WishItem[];
}

export const WishesSection: React.FC<ModernWishesSectionProps> = ({
  wishes,
}) => {
  return (
    <section id="wishes" className="py-12 px-6">
      <div className="text-center mb-8">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Buku Tamu
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Ucapan &amp; Doa Restu
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 font-light">
          Tuliskan pesan penuh cinta untuk kedua mempelai
        </p>
      </div>

      {/* Scrollable Guest Comment Cards */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {wishes && wishes.length > 0 ? (
          wishes.map((wish, idx) => {
            const initials = wish.guest_name
              ? wish.guest_name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
              : 'TM';

            return (
              <div key={wish.id || idx} className="bg-white border border-border-subtle rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border-subtle/50">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-gold-light border border-gold-champagne/40 flex items-center justify-center text-gold-champagne text-xs font-semibold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-semibold text-charcoal-dark break-words [overflow-wrap:anywhere]">
                        {wish.guest_name}
                      </h5>
                      <span className="text-[9px] text-charcoal-muted">
                        {formatWishTime(wish.created_at)}
                      </span>
                    </div>
                  </div>

                  {wish.attendance && (
                    <span
                      className={`text-[9.5px] font-sans font-medium px-2 py-0.5 rounded-full shrink-0 ${wish.attendance === 'attending'
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
                          : 'Belum Pasti'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-dark/80 font-light leading-relaxed pl-9 break-words [overflow-wrap:anywhere]">
                  {wish.message}
                </p>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center rounded-2xl bg-white border border-border-subtle">
            <i className="fa-regular fa-comment-dots text-2xl text-gold-champagne mb-2"></i>
            <p className="text-xs text-charcoal-muted font-light">
              Belum ada ucapan dan doa restu. Kirimkan doa pertama Anda di atas!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};