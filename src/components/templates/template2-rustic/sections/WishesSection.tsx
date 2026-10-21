import React from 'react';
import type { BaseSectionProps } from '../../types';
import type { WishItem } from '../../../../types/invitation';

export interface RusticWishesProps extends BaseSectionProps {
  wishes: WishItem[];
  wishForm: { name: string; message: string; relation?: string };
  setWishForm: (form: any) => void;
  handleWishSubmit: (e: React.FormEvent) => void;
}

export const WishesSection: React.FC<RusticWishesProps> = ({
  wishes,
  wishForm,
  setWishForm,
  handleWishSubmit,
}) => {
  return (
    <section id="ucapan-section" className="flex flex-col py-space-xl">
      <div className="text-center mb-space-lg">
        <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
          Prayers &amp; Wishes
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
          Doa &amp; Ucapan Selamat
        </h3>
        <p className="text-xs text-[#4D5E53] mt-1">
          Untaian kata dan doa tulus untuk mengiringi langkah baru kami
        </p>
      </div>

      {/* Wishes Input Form Card */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#2C4034]/15 mb-space-lg">
        <form onSubmit={handleWishSubmit} className="flex flex-col gap-4" id="wishesForm">
          <div>
            <label className="text-xs font-bold text-[#2C4034] uppercase tracking-wider mb-1 block">
              Nama Anda
            </label>
            <input
              type="text"
              value={wishForm.name}
              onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
              placeholder="Contoh: Dimas &amp; Sarah"
              required
              className="w-full h-11 px-4 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#2C4034] uppercase tracking-wider mb-1 block">
              Hubungan
            </label>
            <div className="relative">
              <select
                value={(wishForm as any).relation || 'Sahabat'}
                onChange={(e) => setWishForm({ ...wishForm, relation: e.target.value } as any)}
                className="w-full h-11 px-4 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm appearance-none focus:outline-none focus:bg-white focus:border-[#2C4034]"
              >
                <option value="Sahabat">Sahabat</option>
                <option value="Teman Kuliah">Teman Kuliah</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
                <option value="Keluarga Besar">Keluarga Besar</option>
              </select>
              <span className="material-symbols-outlined text-[20px] text-[#526859] absolute right-3 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#2C4034] uppercase tracking-wider mb-1 block">
              Ucapan &amp; Doa
            </label>
            <textarea
              rows={3}
              value={wishForm.message}
              onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
              placeholder="Tulis doa dan ucapan manis untuk kedua mempelai..."
              required
              className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034] resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="h-11 rounded-full bg-[#8C4E2D] hover:bg-[#733D1F] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#8C4E2D]/20 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
            <span>Kirim Ucapan</span>
          </button>
        </form>
      </div>

      {/* Live Wishes Feed */}
      <div className="flex flex-col gap-3" id="wishesFeed">
        {wishes.map((wish, i) => {
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
            <div key={wish.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C4034]/10">
              <div className="flex items-center justify-between gap-2 mb-1.5">
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
              </div>
              <p className="text-xs text-[#4D5E53] leading-relaxed break-words [overflow-wrap:anywhere]">
                &ldquo;{wish.message}&rdquo;
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
