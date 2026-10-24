import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { WishItem } from '../../../../types/invitation';
import { formatWishTime } from '../../../../utils/dateHelper';

export interface LuxuryWishesProps extends BaseSectionProps {
  wishesList: WishItem[];
  wishName?: string;
  setWishName?: (name: string) => void;
  wishRelation?: string;
  setWishRelation?: (rel: string) => void;
  wishMessage?: string;
  setWishMessage?: (msg: string) => void;
  handleWishSubmit?: (e: React.FormEvent) => void;
  renderBrandFooter?: (extraProps?: any) => React.ReactNode;
}

export const WishesSection: React.FC<LuxuryWishesProps> = ({
  wishesList,
}) => {
  return (
    <section className="w-full px-margin pt-10 pb-6 flex flex-col items-center z-10" id="wishes">
        <div className="text-center mb-7">
          <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
            Untaian Doa &amp; Ucapan
          </span>
          <h2 className="font-headline-lg-mobile text-on-surface font-normal">
            PRAYERS &amp; WISHES
          </h2>
        </div>

        {/* Scrollable Stream of Translucent Wishes */}
        <div className="w-full max-w-[360px] flex flex-col gap-3 max-h-[480px] overflow-y-auto no-scrollbar overscroll-contain" id="wishes-stream">
          {wishesList && wishesList.length > 0 ? (
            wishesList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-surface-container-low/70 backdrop-blur-md shadow-md border border-white/5 animate-fadeIn"
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {(item.guest_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-label-md text-on-surface text-xs font-medium break-words [overflow-wrap:anywhere]">
                      {item.guest_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.attendance && (
                      <span
                        className={`text-[9px] font-sans font-medium px-2 py-0.5 rounded-full ${item.attendance === 'attending'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : item.attendance === 'declined'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                      >
                        {item.attendance === 'attending'
                          ? 'Hadir'
                          : item.attendance === 'declined'
                            ? 'Berhalangan'
                            : 'Ragu-ragu'}
                      </span>
                    )}
                    <span className="font-body-sm text-secondary text-[10px]">
                      {formatWishTime(item.created_at)}
                    </span>
                  </div>
                </div>
                <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed break-words [overflow-wrap:anywhere]">
                  "{item.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center rounded-xl bg-surface-container-low/50 border border-white/5">
              <span className="material-symbols-outlined text-3xl text-primary mb-2">mark_chat_read</span>
              <p className="text-xs text-secondary font-body-sm">
                Belum ada doa restu. Jadilah yang pertama memberikan ucapan!
              </p>
            </div>
          )}
        </div>
      </section>
  );
};
