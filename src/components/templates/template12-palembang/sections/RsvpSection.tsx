import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
  PalembangCornerFiligree,
} from '../components';

interface RsvpSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => Promise<void> | void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  data,
  theme,
  isSectionActive,
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isRsvpVisible = isSectionActive
    ? isSectionActive('rsvp')
    : effectiveTheme?.show_rsvp !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('rsvp'));

  if (!isRsvpVisible) return null;

  return (
    <section className="relative w-full shrink-0 bg-[#FDF9F2] text-[#1C1C18] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.035]" color="#785A05" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#785A05] uppercase tracking-[0.2em] font-bold">
            Konfirmasi Undangan
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#4A0E12] mt-0.5">
            Kehadiran &amp; Doa Restu
          </h3>
          <RumahLimasDivider compact className="mt-1.5" />
        </div>

        {/* Interactive RSVP Card */}
        <div className="relative w-full bg-[#FFFFFF] border border-[#FFD57A]/45 rounded-2xl p-5 sm:p-6 shadow-md overflow-hidden">
          <PalembangCornerFiligree position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 opacity-70" color="#785A05" />
          <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 opacity-70" color="#785A05" />

          <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4">
            {/* Nama Tamu */}
            <div>
              <label className="block font-sans text-[11px] text-[#544342] uppercase tracking-wider font-bold mb-1">
                Nama Lengkap Tamu
              </label>
              <input
                type="text"
                required
                value={rsvpForm.name}
                onChange={(e) =>
                  setRsvpForm({ ...rsvpForm, name: e.target.value })
                }
                placeholder="Contoh: Raden H. Zainal Abidin"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/40 text-[#1C1C18] font-sans text-xs outline-none focus:ring-1 focus:ring-[#785A05] transition-all"
              />
            </div>

            {/* Konfirmasi Kehadiran */}
            <div>
              <label className="block font-sans text-[11px] text-[#544342] uppercase tracking-wider font-bold mb-1.5">
                Konfirmasi Kehadiran
              </label>
              <div className="flex flex-col gap-2 font-sans text-xs text-[#1C1C18]">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/30 cursor-pointer hover:bg-[#FFD57A]/15 transition-colors">
                  <input
                    type="radio"
                    name="attendance_status"
                    value="attending"
                    checked={rsvpForm.status === 'attending' || rsvpForm.status === 'all'}
                    onChange={() =>
                      setRsvpForm({ ...rsvpForm, status: 'attending' })
                    }
                    className="accent-[#785A05] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">Hadir Akad &amp; Resepsi</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/30 cursor-pointer hover:bg-[#FFD57A]/15 transition-colors">
                  <input
                    type="radio"
                    name="attendance_status"
                    value="resepsi"
                    checked={rsvpForm.status === 'resepsi'}
                    onChange={() =>
                      setRsvpForm({ ...rsvpForm, status: 'resepsi' })
                    }
                    className="accent-[#785A05] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">Hadir Resepsi Saja</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/30 cursor-pointer hover:bg-[#FFD57A]/15 transition-colors">
                  <input
                    type="radio"
                    name="attendance_status"
                    value="declined"
                    checked={rsvpForm.status === 'declined' || rsvpForm.status === 'absent'}
                    onChange={() =>
                      setRsvpForm({ ...rsvpForm, status: 'declined' })
                    }
                    className="accent-[#785A05] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">Berhalangan Hadir (Kirim Doa)</span>
                </label>
              </div>
            </div>

            {/* Jumlah Tamu (Pax) */}
            <div>
              <label className="block font-sans text-[11px] text-[#544342] uppercase tracking-wider font-bold mb-1">
                Jumlah Tamu
              </label>
              <select
                value={rsvpForm.pax}
                onChange={(e) =>
                  setRsvpForm({ ...rsvpForm, pax: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/40 text-[#1C1C18] font-sans text-xs outline-none focus:ring-1 focus:ring-[#785A05]"
              >
                <option value={1}>1 Orang</option>
                <option value={2}>2 Orang (Berpasangan)</option>
              </select>
            </div>

            {/* Catatan / Pesan Singkat */}
            <div>
              <label className="block font-sans text-[11px] text-[#544342] uppercase tracking-wider font-bold mb-1">
                Untaian Doa &amp; Harapan
              </label>
              <textarea
                rows={3}
                value={rsvpForm.notes || ''}
                onChange={(e) =>
                  setRsvpForm({ ...rsvpForm, notes: e.target.value })
                }
                placeholder="Tuliskan ucapan selamat dan doa restu untuk mempelai..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7F3EC] border border-[#FFD57A]/40 text-[#1C1C18] font-sans text-xs outline-none focus:ring-1 focus:ring-[#785A05] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#4A0E12] via-[#2A0003] to-[#4A0E12] text-[#FFD57A] border border-[#FFD57A]/50 font-sans text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>Kirim Doa &amp; Konfirmasi</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

