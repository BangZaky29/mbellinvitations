import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { WishItem } from '../../../../types/invitation';

export interface IslamiWishesProps extends BaseSectionProps {
  wishesList: WishItem[];
  wishName: string;
  setWishName: (name: string) => void;
  wishMessage: string;
  setWishMessage: (msg: string) => void;
  handleWishSubmit: (e: React.FormEvent) => void;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const WishesSection: React.FC<IslamiWishesProps> = ({
  data,
  theme,
  wishesList,
  wishName,
  setWishName,
  wishMessage,
  setWishMessage,
  handleWishSubmit,
  renderBrandFooter,
}) => {
  return (
    <>
      <section
        className="px-margin pt-space-xl pb-2 flex flex-col items-center"
        id="doa"
      >
        <div className="text-center mb-8">
          <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
            Buku Tamu
          </span>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            Doa &amp; Ucapan
          </h2>
          <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Wishes Form */}
        {theme?.show_wishes !== false && (
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-md shadow-primary/5 mb-6 border border-secondary-container/20">
            <form onSubmit={handleWishSubmit} className="space-y-4" id="form-doa">
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="nama-pengirim"
                >
                  Nama Anda
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                  id="nama-pengirim"
                  placeholder="Contoh: Sahabat Kuliah ITB"
                  required
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="teks-doa"
                >
                  Ucapan &amp; Doa Restu
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                  id="teks-doa"
                  placeholder="Tuliskan doa kebaikan untuk kedua mempelai..."
                  required
                  rows={3}
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                ></textarea>
              </div>

              <button
                className="w-full py-3 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-container transition-colors cursor-pointer"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">
                  favorite
                </span>
                <span>Kirim Doa Restu</span>
              </button>
            </form>
          </div>
        )}

        {/* Guestbook Wishes Feed */}
        <div
          className="w-full space-y-3 mb-10 max-h-[380px] overflow-y-auto pr-1"
          id="wishes-feed"
        >
          {wishesList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-secondary-container/10"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-label-md text-label-md text-primary font-bold min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                  {item.guest_name}
                </span>
                <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed break-words [overflow-wrap:anywhere]">
                "{item.message}"
              </p>
            </div>
          ))}
        </div>

        {/* Heartfelt Family Closing Statement */}
        <div className="w-full text-center p-6 rounded-t-full rounded-b-2xl bg-surface-container-lowest shadow-md shadow-primary/5 mb-4 border border-secondary-container/20">
          <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mx-auto mb-3">
            <span className="material-symbols-outlined text-[20px]">
              handshake
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga,
            apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa
            restu kepada kedua mempelai.
          </p>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
            Wassalamu’alaikum Warahmatullahi Wabarakatuh
          </h3>
          <p className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-widest mt-2">
            Kami Yang Berbahagia:
          </p>
          <p className="font-headline-sm text-headline-sm text-primary font-semibold mt-1">
            Keluarga Besar {(data.groom.parent_father || '').replace('Bpk. ', '').replace('Ir. ', '')}{' '}
            <br />&amp; Keluarga Besar {(data.bride.parent_father || '').replace('Bpk. ', '').replace('Dr. H. ', '')}
          </p>
        </div>
      </section>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter({ themeId: 'islami' })}
    </>
  );
};
