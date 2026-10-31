import React from 'react';
import type { InvitationData, ThemeConfig, WishItem } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
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
    <section className="relative w-full bg-[#F3EDE4] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.045]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Buku Tamu &amp; Doa Restu
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            Ucapan Doa Sahabat
          </h3>
          <p className="font-sans text-xs text-[#524341] mt-1.5 max-w-[310px] mx-auto leading-relaxed">
            Untaian doa restu dan kebahagiaan dari sanak keluarga dan sahabat terkasih.
          </p>
          <CandiBentarDivider compact className="mt-2" />
        </div>

        {/* Wish Input Form Card */}
        <div className="relative w-full bg-[#FFF9EF] border border-[#D4AF37]/45 rounded-2xl p-5 shadow-sm mb-6 overflow-hidden">
          <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-5 h-5" color="#D4AF37" />
          <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-5 h-5" color="#D4AF37" />

          <form onSubmit={handleWishSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block font-sans text-[10.5px] text-[#411710] font-bold uppercase mb-1">
                Nama Anda
              </label>
              <input
                type="text"
                required
                value={wishForm.name}
                onChange={(e) =>
                  setWishForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Tuliskan nama lengkap Anda..."
                className="w-full px-3 py-2 bg-[#F3EDE4] border border-[#D4AF37]/35 rounded-xl font-sans text-xs text-[#1D1B16] outline-none focus:ring-1 focus:ring-[#735C00]"
              />
            </div>

            <div>
              <label className="block font-sans text-[10.5px] text-[#411710] font-bold uppercase mb-1">
                Doa Restu &amp; Pesan
              </label>
              <textarea
                rows={3}
                required
                value={wishForm.message}
                onChange={(e) =>
                  setWishForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Tuliskan ucapan selamat dan doa untuk mempelai..."
                className="w-full px-3 py-2 bg-[#F3EDE4] border border-[#D4AF37]/35 rounded-xl font-sans text-xs text-[#1D1B16] outline-none focus:ring-1 focus:ring-[#735C00]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#735C00] hover:bg-[#574500] text-[#FFF9EF] font-sans text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Kirim Ucapan &amp; Doa</span>
            </button>
          </form>
        </div>

        {/* Wishes Stream Feed */}
        <div className="w-full space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {wishes.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-[#FFF9EF] border border-[#D4AF37]/30 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#F3EDE4] border border-[#D4AF37]/40 flex items-center justify-center text-[#735C00] font-bold text-xs shrink-0">
                    <span className="material-symbols-outlined text-sm">spa</span>
                  </div>
                  <span className="font-sans text-xs font-bold text-[#411710] truncate">
                    {item.guest_name || (item as any).name || 'Sahabat'}
                  </span>
                </div>
                {item.created_at && (
                  <span className="font-sans text-[10px] text-[#857370] shrink-0">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-[#524341] leading-relaxed break-words [overflow-wrap:anywhere] pl-9">
                {item.message}
              </p>
            </div>
          ))}

          {wishes.length === 0 && (
            <div className="text-center py-6 text-xs text-[#857370]">
              Belum ada ucapan doa. Jadilah yang pertama memberikan doa restu!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

