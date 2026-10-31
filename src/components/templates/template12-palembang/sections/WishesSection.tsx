import React from 'react';
import type { InvitationData, ThemeConfig, WishItem } from '../../../../types/invitation';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
  PalembangCornerFiligree,
} from '../components';

interface WishesSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
  wishes: WishItem[];
  wishForm: { name: string; message: string };
  setWishForm: React.Dispatch<React.SetStateAction<{ name: string; message: string }>>;
  handleWishSubmit: (e: React.FormEvent) => Promise<void> | void;
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  data,
  theme,
  isSectionActive,
  wishes,
  wishForm,
  setWishForm,
  handleWishSubmit,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isWishesVisible = isSectionActive
    ? isSectionActive('wishes')
    : effectiveTheme?.show_wishes !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('wishes'));

  if (!isWishesVisible) return null;

  return (
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#785A05] uppercase tracking-[0.2em] font-bold">
            Buku Tamu &amp; Untaian Doa
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#4A0E12] mt-1">
            Doa Restu Sanak &amp; Sahabat
          </h3>
          <p className="font-sans text-xs text-[#544342] mt-1.5 max-w-[310px] mx-auto leading-relaxed">
            Untaian doa restu dan kebahagiaan dari sanak keluarga dan dulur terkasih.
          </p>
          <RumahLimasDivider compact className="mt-2" />
        </div>

        {/* Wish Input Form Card */}
        <div className="relative w-full bg-[#FFFFFF] border border-[#FFD57A]/45 rounded-2xl p-5 shadow-sm mb-6 overflow-hidden">
          <PalembangCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 opacity-70" color="#785A05" />
          <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 opacity-70" color="#785A05" />

          <form onSubmit={handleWishSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block font-sans text-[11px] text-[#544342] uppercase tracking-wider font-bold mb-1">
                Nama Anda
              </label>
              <input
                type="text"
                required
                value={wishForm.name}
                onChange={(e) =>
                  setWishForm({ ...wishForm, name: e.target.value })
                }
                placeholder="Contoh: Kgs. H. Baharuddin"
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/40 text-[#1C1C18] font-sans text-xs outline-none focus:ring-1 focus:ring-[#785A05] transition-all"
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] text-[#544342] uppercase tracking-wider font-bold mb-1">
                Untaian Doa &amp; Harapan
              </label>
              <textarea
                required
                rows={3}
                value={wishForm.message}
                onChange={(e) =>
                  setWishForm({ ...wishForm, message: e.target.value })
                }
                placeholder="Tuliskan ucapan dan doa restu untuk kedua mempelai..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/40 text-[#1C1C18] font-sans text-xs outline-none focus:ring-1 focus:ring-[#785A05] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#4A0E12] via-[#2A0003] to-[#4A0E12] text-[#FFD57A] border border-[#FFD57A]/50 font-sans text-xs uppercase tracking-wider font-bold shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>Kirim Ucapan</span>
            </button>
          </form>
        </div>

        {/* Wishes Real-time Feed */}
        <div className="w-full space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          {wishes.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-[#FFFFFF] border border-[#FFD57A]/35 rounded-xl p-3.5 shadow-sm text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="font-serif text-sm font-bold text-[#4A0E12] truncate">
                  {item.guest_name}
                </span>
                {item.attendance && (
                  <span
                    className={`text-[9.5px] px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider shrink-0 ${
                      item.attendance === 'attending'
                        ? 'bg-[#EAC168]/20 text-[#785A05] border border-[#EAC168]/50'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {item.attendance === 'attending' ? 'Hadir' : 'Kirim Doa'}
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-[#544342] leading-relaxed break-words [overflow-wrap:anywhere]">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

