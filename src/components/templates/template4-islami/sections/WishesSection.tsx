import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { WishItem } from '../../../../types/invitation';
import { formatWishTime } from '../../../../utils/dateHelper';

export interface IslamiWishesProps extends BaseSectionProps {
  wishesList: WishItem[];
  wishName?: string;
  setWishName?: (name: string) => void;
  wishMessage?: string;
  setWishMessage?: (msg: string) => void;
  handleWishSubmit?: (e: React.FormEvent) => void;
  renderBrandFooter?: (extraProps?: any) => React.ReactNode;
}

export const WishesSection: React.FC<IslamiWishesProps> = ({
  wishesList,
}) => {
  return (
    <section
        className="px-margin pt-space-xl pb-2 flex flex-col items-center"
        id="doa"
      >
        <div className="text-center mb-8">
          <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
            Buku Tamu Virtual
          </span>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            Untaian Doa &amp; Restu
          </h2>
          <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Guestbook Wishes Feed */}
        <div
          className="w-full space-y-3 mb-10 max-h-[480px] overflow-y-auto pr-1"
          id="wishes-feed"
        >
          {wishesList && wishesList.length > 0 ? (
            wishesList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-secondary-container/20"
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-secondary-container/15">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-secondary-container/60 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {(item.guest_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-label-md text-label-md text-primary font-bold min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                      {item.guest_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.attendance && (
                      <span
                        className={`text-[9.5px] font-sans font-medium px-2 py-0.5 rounded-full ${item.attendance === 'attending'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : item.attendance === 'declined'
                            ? 'bg-rose-50 text-rose-800 border border-rose-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}
                      >
                        {item.attendance === 'attending'
                          ? 'Hadir'
                          : item.attendance === 'declined'
                            ? 'Berhalangan'
                            : 'Ragu-ragu'}
                      </span>
                    )}
                    <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                      {formatWishTime(item.created_at)}
                    </span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed break-words [overflow-wrap:anywhere]">
                  "{item.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center rounded-xl bg-surface-container-lowest border border-secondary-container/20">
              <span className="material-symbols-outlined text-3xl text-secondary mb-2">mark_chat_read</span>
              <p className="text-xs text-on-surface-variant">
                Belum ada doa restu. Kirimkan ucapan dan doa Anda di atas!
              </p>
            </div>
          )}
        </div>
      </section>
  );
};
