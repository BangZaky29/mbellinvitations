import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { WishItem } from '../../../../types/invitation';

export interface LuxuryWishesProps extends BaseSectionProps {
  wishesList: WishItem[];
  wishName: string;
  setWishName: (name: string) => void;
  wishRelation: string;
  setWishRelation: (rel: string) => void;
  wishMessage: string;
  setWishMessage: (msg: string) => void;
  handleWishSubmit: (e: React.FormEvent) => void;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const WishesSection: React.FC<LuxuryWishesProps> = ({
  data,
  theme,
  wishesList,
  wishName,
  setWishName,
  wishRelation,
  setWishRelation,
  wishMessage,
  setWishMessage,
  handleWishSubmit,
  renderBrandFooter,
}) => {
  return (
    <>
      <section className="w-full px-margin pt-10 pb-6 flex flex-col items-center z-10" id="wishes">
        <div className="text-center mb-7">
          <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
            Untaian Doa &amp; Ucapan
          </span>
          <h2 className="font-headline-lg-mobile text-on-surface font-normal">
            PRAYERS &amp; WISHES
          </h2>
        </div>

        {/* Wish Input Card */}
        {theme?.show_wishes !== false && (
          <form
            onSubmit={handleWishSubmit}
            className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-4 shadow-xl mb-7 flex flex-col gap-3 border border-white/5"
            id="wish-form"
          >
            <input
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
              id="wish-author"
              placeholder="Nama Anda"
              required
              type="text"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
            />
            <select
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent focus:border-primary"
              id="wish-relation"
              value={wishRelation}
              onChange={(e) => setWishRelation(e.target.value)}
            >
              <option value="Colleague">Colleague &amp; Partner</option>
              <option value="Friend">Close Friend</option>
              <option value="Family">Family Relative</option>
            </select>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
              id="wish-content"
              placeholder="Tuliskan doa serta restu untuk kedua mempelai..."
              required
              rows={3}
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
            ></textarea>
            <button
              className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md uppercase tracking-wider text-xs shadow-md active:scale-[0.98] transition-transform cursor-pointer font-medium"
              type="submit"
            >
              Kirim Doa
            </button>
          </form>
        )}

        {/* Scrollable Stream of Translucent Wishes */}
        <div className="w-full max-w-[360px] flex flex-col gap-3" id="wishes-stream">
          {wishesList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface-container-low/70 backdrop-blur-md shadow-md border border-white/5 animate-fadeIn"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-label-md text-on-surface text-xs font-medium break-words [overflow-wrap:anywhere]">
                    {item.guest_name}
                  </span>
                </div>
                <span className="shrink-0 font-body-sm text-secondary text-[10px]">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed break-words [overflow-wrap:anywhere]">
                "{item.message}"
              </p>
            </div>
          ))}
        </div>

        {/* Closing Gratitude Note */}
        <div className="text-center mt-12 mb-4 max-w-[320px]">
          <div className="w-8 h-8 rounded-full bg-surface-container-high mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-primary text-base">
              favorite
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed mb-3">
            Merupakan suatu kehormatan dan kebahagiaan mendalam bagi kami apabila Bapak/Ibu/Saudara(i)
            berkenan hadir dan memberikan doa restu.
          </p>
          <p className="font-label-eyebrow text-secondary uppercase tracking-[0.25em] text-[10px] mb-1">
            With All Our Love,
          </p>
          <h3 className="font-headline-sm text-primary text-lg">
            {data.groom.name.toUpperCase()} &amp; {data.bride.name.toUpperCase()}
          </h3>
        </div>
      </section>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter({ themeId: 'luxury' })}
    </>
  );
};
