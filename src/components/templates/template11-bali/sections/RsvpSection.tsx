import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
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
    <section className="relative w-full bg-[#FFF9EF] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.04]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Konfirmasi Kehadiran
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            RSVP Tamu
          </h3>
          <p className="font-sans text-xs text-[#524341] mt-1.5 max-w-[310px] mx-auto leading-relaxed">
            Mohon konfirmasikan kehadiran Anda demi kenyamanan jamuan suci Pawiwahan Ageng.
          </p>
          <CandiBentarDivider compact className="mt-2" />
        </div>

        {/* RSVP Card Form */}
        <div className="relative w-full bg-[#F9F3EA] border border-[#D4AF37]/45 rounded-2xl p-5 sm:p-6 shadow-md overflow-hidden">
          {/* Corner Filigrees */}
          <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-left" className="absolute bottom-1 left-1 w-6 h-6" color="#D4AF37" />
          <BaliCornerFiligree position="bottom-right" className="absolute bottom-1 right-1 w-6 h-6" color="#D4AF37" />

          <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4">
            {/* Nama Tamu */}
            <div>
              <label className="block font-sans text-[11px] text-[#411710] font-bold uppercase mb-1">
                Nama Lengkap Tamu
              </label>
              <input
                type="text"
                required
                value={rsvpForm.name}
                onChange={(e) =>
                  setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: I Gusti Bagus Wirawan"
                className="w-full px-3 py-2.5 bg-[#FFF9EF] border border-[#D4AF37]/35 rounded-xl font-sans text-xs text-[#1D1B16] outline-none focus:ring-1 focus:ring-[#735C00]"
              />
            </div>

            {/* Rencana Kehadiran */}
            <div>
              <label className="block font-sans text-[11px] text-[#411710] font-bold uppercase mb-1">
                Rencana Kehadiran
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 bg-[#FFF9EF] border border-[#D4AF37]/30 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="rsvp-status"
                    checked={rsvpForm.status === 'attending'}
                    onChange={() =>
                      setRsvpForm((prev: any) => ({ ...prev, status: 'attending' }))
                    }
                    className="accent-[#735C00]"
                  />
                  <span className="font-sans text-xs text-[#1D1B16]">
                    Hadir Pawiwahan &amp; Resepsi
                  </span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-[#FFF9EF] border border-[#D4AF37]/30 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="rsvp-status"
                    checked={rsvpForm.status === 'declined'}
                    onChange={() =>
                      setRsvpForm((prev: any) => ({ ...prev, status: 'declined' }))
                    }
                    className="accent-[#735C00]"
                  />
                  <span className="font-sans text-xs text-[#1D1B16]">
                    Berhalangan Hadir (Kirim Doa Restu)
                  </span>
                </label>
              </div>
            </div>

            {/* Jumlah Tamu (Tampil jika hadir) */}
            {rsvpForm.status === 'attending' && (
              <div>
                <label className="block font-sans text-[11px] text-[#411710] font-bold uppercase mb-1">
                  Jumlah Tamu Hadir
                </label>
                <select
                  value={rsvpForm.pax}
                  onChange={(e) =>
                    setRsvpForm((prev: any) => ({
                      ...prev,
                      pax: Number(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-[#FFF9EF] border border-[#D4AF37]/35 rounded-xl font-sans text-xs text-[#1D1B16] outline-none focus:ring-1 focus:ring-[#735C00]"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang (Bersama Pasangan)</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang (Keluarga)</option>
                </select>
              </div>
            )}

            {/* Catatan / Doa Singkat */}
            <div>
              <label className="block font-sans text-[11px] text-[#411710] font-bold uppercase mb-1">
                Catatan / Doa Singkat
              </label>
              <textarea
                rows={2}
                value={rsvpForm.notes || ''}
                onChange={(e) =>
                  setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Tuliskan catatan kehadiran bila ada..."
                className="w-full px-3 py-2 bg-[#FFF9EF] border border-[#D4AF37]/35 rounded-xl font-sans text-xs text-[#1D1B16] outline-none focus:ring-1 focus:ring-[#735C00]"
              />
            </div>

            {/* Tombol Kirim */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#411710] via-[#5C2C23] to-[#411710] text-[#FFF9EF] font-sans text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-base text-[#FED65B]">
                send
              </span>
              <span>Kirim Konfirmasi Kehadiran</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

