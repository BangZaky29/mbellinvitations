import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { CoupleInfo, WishItem } from '../../../../types/invitation';
import { formatWishTime } from '../../../../utils/dateHelper';

export interface JawaWishesProps extends BaseSectionProps {
  firstPerson?: CoupleInfo;
  secondPerson?: CoupleInfo;
  wishes: WishItem[];
  wishForm?: { name: string; message: string };
  setWishForm?: (form: any) => void;
  handleWishSubmit?: (e: React.FormEvent) => void;
  renderBrandFooter?: (extraProps?: any) => React.ReactNode;
}

export const WishesSection: React.FC<JawaWishesProps> = ({
  wishes,
}) => {
  return (
    <section className="relative w-full bg-surface px-margin pt-space-xl pb-6 flex flex-col items-center">
      <div className="text-center mb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
          Buku Pasugatan
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          Donga &amp; Pangestu
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
          Serat donga restu kagem kalenggahan temanten kekalih
        </p>
      </div>

      {/* Live Wishes List */}
      <div className="w-full space-y-3 max-h-[480px] overflow-y-auto pr-0.5" id="wishes-container">
        {wishes && wishes.length > 0 ? (
          wishes.map((wish, idx) => (
            <div key={wish.id || idx} className="bg-surface-container-low rounded-xl p-4 shadow-sm border border-[#D4AF37]/15">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#D4AF37]/10">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {(wish.guest_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-title-md text-title-md text-primary font-semibold min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                    {wish.guest_name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {wish.attendance && (
                    <span
                      className={`text-[9.5px] font-sans font-medium px-2 py-0.5 rounded-full ${
                        wish.attendance === 'attending'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          : wish.attendance === 'declined'
                          ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      }`}
                    >
                      {wish.attendance === 'attending'
                        ? 'Rawuh'
                        : wish.attendance === 'declined'
                        ? 'Nyenyuwun Pangapunten'
                        : 'Mangu-mangu'}
                    </span>
                  )}
                  <span className="shrink-0 font-caption text-caption text-on-surface-variant/60 text-[10px]">
                    {formatWishTime(wish.created_at)}
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed break-words [overflow-wrap:anywhere]">
                {wish.message}
              </p>
            </div>
          ))
        ) : (
          <div className="p-6 text-center rounded-xl bg-surface-container-low border border-[#D4AF37]/20">
            <span className="material-symbols-outlined text-3xl text-secondary mb-2">mark_chat_read</span>
            <p className="text-xs text-on-surface-variant">
              Dereng wonten donga pangestu. Kirimaken donga restu panjenengan wonten ing nginggil!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
