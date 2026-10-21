import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { CoupleInfo, WishItem } from '../../../../types/invitation';

export interface JawaWishesProps extends BaseSectionProps {
  firstPerson: CoupleInfo;
  secondPerson: CoupleInfo;
  wishes: WishItem[];
  wishForm: { name: string; message: string };
  setWishForm: (form: any) => void;
  handleWishSubmit: (e: React.FormEvent) => void;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}

export const WishesSection: React.FC<JawaWishesProps> = ({
  data,
  firstPerson,
  secondPerson,
  wishes,
  wishForm,
  setWishForm,
  handleWishSubmit,
  renderBrandFooter,
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

      {/* Wishes Input Form */}
      <div className="w-full bg-surface-container-low rounded-2xl p-space-md shadow-lg mb-6">
        <form onSubmit={handleWishSubmit} className="space-y-3" id="wishes-form">
          <input
            type="text"
            value={wishForm.name}
            onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
            placeholder="Asma Panjenengan (Nama Anda)"
            required
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 placeholder:italic font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <textarea
            rows={3}
            value={wishForm.message}
            onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
            placeholder="Tuliskan donga berkah saha pangestu panjenengan..."
            required
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 placeholder:italic font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-fixed-dim to-secondary text-on-primary font-label-lg text-label-lg shadow active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">rate_review</span>
            <span>KIRIM UCAPAN</span>
          </button>
        </form>
      </div>

      {/* Live Wishes List */}
      <div className="w-full space-y-3" id="wishes-container">
        {wishes.map((wish) => (
          <div key={wish.id} className="bg-surface-container-low rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-title-md text-title-md text-primary font-semibold break-words [overflow-wrap:anywhere]">
                  {wish.guest_name}
                </span>
              </div>
              <span className="shrink-0 font-caption text-caption text-on-surface-variant/60">
                {new Date(wish.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed break-words [overflow-wrap:anywhere]">
              {wish.message}
            </p>
          </div>
        ))}
      </div>

      {/* Final Royal Footer Emblem */}
      <div className="mt-6 flex flex-col items-center text-center opacity-80">
        <span className="material-symbols-outlined text-primary text-2xl mb-2">flare</span>
        <p className="font-caption text-caption text-on-surface-variant tracking-wider uppercase">
          Matur Nuwun Sanget
        </p>
        <p className="font-title-md text-title-md text-primary italic">
          {firstPerson.name} &amp; {secondPerson.name}
        </p>
        <p className="font-caption text-caption text-on-surface-variant/50 mt-1">
          {data.hashtag || 'Kraton Ngayogyakarta Hadiningrat'}
        </p>
      </div>

      {/* Dynamic mbell Invitations Brand Signature Footer */}
      {renderBrandFooter({ themeId: 'jawa' })}
    </section>
  );
};
