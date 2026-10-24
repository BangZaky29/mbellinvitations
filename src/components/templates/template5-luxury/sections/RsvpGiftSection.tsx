import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface LuxuryRsvpProps extends BaseSectionProps {
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
}

export interface LuxuryGiftProps extends BaseSectionProps {
  copiedKey: string | null;
  handleCopy: (text: string, key: string, label?: string) => void;
}

export interface LuxuryRsvpGiftProps extends BaseSectionProps {
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  copiedKey: string | null;
  handleCopy: (text: string, key: string, label?: string) => void;
}

export const RsvpSection: React.FC<LuxuryRsvpProps> = ({
  theme,
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
}) => {
  if (theme?.show_rsvp === false) return null;

  const isAttending = rsvpForm.status === 'hadir' || rsvpForm.status === 'attending';
  const isDeclined =
    rsvpForm.status === 'tidak_hadir' ||
    rsvpForm.status === 'declined' ||
    rsvpForm.status === 'tidak';

  return (
    <section className="w-full px-margin pt-12 pb-4 flex flex-col items-center z-10" id="rsvp">
      <div className="text-center mb-8">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          Reservation &amp; Wishes
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          RSVP &amp; DOA RESTU
        </h2>
        <p className="font-body-sm text-secondary text-xs mt-1">
          Mohon konfirmasi kehadiran serta kirimkan doa restu Anda
        </p>
      </div>

      {/* RSVP Glass Form */}
      <form
        onSubmit={handleRsvpSubmit}
        className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 shadow-xl shadow-surface-container-lowest/60 flex flex-col gap-4 mb-4 border border-white/5"
      >
        {/* Nama Lengkap */}
        <div>
          <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
            Nama Lengkap Tamu
          </label>
          <input
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
            placeholder="Contoh: Bpk. Dian Sastrowardoyo & Rekan"
            required
            value={rsvpForm.name}
            onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Kehadiran */}
        <div>
          <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
            Konfirmasi Kehadiran
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRsvpForm((prev: any) => ({ ...prev, status: 'hadir', pax: Math.max(1, prev.pax || 1) }))}
              className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAttending
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40 font-bold'
                  : 'bg-surface-container border-white/10 text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Hadir</span>
            </button>

            <button
              type="button"
              onClick={() => setRsvpForm((prev: any) => ({ ...prev, status: 'tidak_hadir', pax: 0 }))}
              className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDeclined
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/40 font-bold'
                  : 'bg-surface-container border-white/10 text-on-surface-variant hover:border-rose-400 hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">cancel</span>
              <span>Tidak Hadir</span>
            </button>
          </div>
        </div>

        {/* Conditional Pax Selection */}
        {isAttending && (
          <div>
            <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
              Jumlah Tamu
            </label>
            <select
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
              value={rsvpForm.pax}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, pax: Number(e.target.value) }))}
            >
              <option value={1}>1 Orang</option>
              <option value={2}>2 Orang</option>
              <option value={3}>3 Orang</option>
              <option value={4}>4 Orang</option>
              <option value={5}>5 Orang</option>
            </select>
          </div>
        )}

        {/* Doa & Ucapan */}
        <div>
          <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
            Doa &amp; Ucapan Selamat
          </label>
          <textarea
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary resize-none"
            placeholder="Tuliskan ucapan dan doa tulus untuk kedua mempelai..."
            value={rsvpForm.notes || ''}
            onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <button
          className="w-full mt-2 py-3 rounded-lg bg-primary text-on-primary font-label-md uppercase tracking-[0.15em] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-xs cursor-pointer flex items-center justify-center gap-2 font-bold"
          type="submit"
        >
          <span className="material-symbols-outlined text-[17px]">send</span>
          <span>Kirim Ucapan &amp; Konfirmasi</span>
        </button>
      </form>
    </section>
  );
};

export const GiftSection: React.FC<LuxuryGiftProps> = ({
  data,
  theme,
  copiedKey,
  handleCopy,
}) => {
  if (theme?.show_gift === false) return null;

  return (
    <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="gift">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
            Digital Envelope
          </span>
          <h3 className="font-headline-sm text-on-surface text-lg">
            TANDA KASIH
          </h3>
          <p className="font-body-sm text-on-surface-variant text-xs mt-1 max-w-[280px]">
            Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang berkenan memberikan
            tanda kasih secara cashless:
          </p>
        </div>

        {/* Bank Accounts */}
        {((data.banks && data.banks.length > 0) ? data.banks : ((data as any).bank_accounts || []))?.map((bank: any, index: number) => (
          <div
            key={index}
            className="w-full rounded-xl bg-surface-container-high/90 backdrop-blur-md p-5 mb-4 shadow-xl relative overflow-hidden border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md font-bold tracking-widest text-on-surface text-xs">
                {bank.bank_name}
              </span>
              <span className="material-symbols-outlined text-primary text-lg">
                {index === 0 ? 'credit_card' : 'contactless'}
              </span>
            </div>
            <p className="font-label-sm text-secondary uppercase tracking-widest text-[9px] mb-0.5">
              Nomor Rekening
            </p>
            <p className="font-headline-sm text-on-surface text-lg tracking-wider mb-2 font-mono">
              {bank.account_number}
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="font-body-sm text-secondary text-xs min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                a/n {bank.account_holder}
              </p>
              <button
                className="shrink-0 py-1 px-3 rounded-full bg-primary-container/20 text-primary text-[11px] font-label-md uppercase tracking-wider transition-colors cursor-pointer hover:bg-primary-container/30"
                onClick={() => handleCopy(bank.account_number_raw || bank.account_number, `bank-${index}`)}
                type="button"
              >
                {copiedKey === `bank-${index}` ? 'Tersalin ✓' : 'Salin No. Rekening'}
              </button>
            </div>
          </div>
        ))}

        {/* Gift Delivery Address */}
        {data.gift_address && (
          <div className="w-full rounded-xl bg-surface-container-low/80 backdrop-blur-md p-5 shadow-md border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-eyebrow text-primary uppercase text-[9px] tracking-widest">
                Physical Gift Address
              </span>
              <span className="material-symbols-outlined text-primary text-base">
                inventory_2
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant text-xs mb-3 leading-relaxed break-words [overflow-wrap:anywhere]">
              {data.gift_address}
            </p>
            <button
              className="self-start py-1 px-3 rounded-full bg-primary-container/20 text-primary text-[11px] font-label-md uppercase tracking-wider transition-colors cursor-pointer hover:bg-primary-container/30"
              onClick={() => handleCopy(data.gift_address || '', 'gift-address')}
              type="button"
            >
              {copiedKey === 'gift-address' ? 'Tersalin ✓' : 'Salin Alamat Lengkap'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export const RsvpGiftSection: React.FC<LuxuryRsvpGiftProps> = (props) => {
  return (
    <>
      <RsvpSection {...props} />
      <GiftSection {...props} />
    </>
  );
};
