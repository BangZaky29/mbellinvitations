import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface LuxuryRsvpGiftProps extends BaseSectionProps {
  rsvpName: string;
  setRsvpName: (name: string) => void;
  rsvpContact: string;
  setRsvpContact: (contact: string) => void;
  rsvpAttendance: 'hadir' | 'tidak';
  setRsvpAttendance: (att: 'hadir' | 'tidak') => void;
  rsvpPax: string;
  setRsvpPax: (pax: string) => void;
  rsvpDietary: string;
  setRsvpDietary: (diet: string) => void;
  rsvpSubmitted: boolean;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  copiedKey: string | null;
  handleCopy: (text: string, key: string, label?: string) => void;
}

export const RsvpGiftSection: React.FC<LuxuryRsvpGiftProps> = ({
  data,
  theme,
  rsvpName,
  setRsvpName,
  rsvpContact,
  setRsvpContact,
  rsvpAttendance,
  setRsvpAttendance,
  rsvpPax,
  setRsvpPax,
  rsvpDietary,
  setRsvpDietary,
  rsvpSubmitted,
  handleRsvpSubmit,
  copiedKey,
  handleCopy,
}) => {
  return (
    <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="rsvp">
      <div className="text-center mb-8">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          Reservation
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          CONFIRM ATTENDANCE
        </h2>
        <p className="font-body-sm text-secondary text-xs mt-1">
          Kindly respond on or before October 1st, 2026
        </p>
      </div>

      {/* RSVP Glass Form */}
      {theme?.show_rsvp !== false && (
        <form
          onSubmit={handleRsvpSubmit}
          className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 shadow-xl shadow-surface-container-lowest/60 flex flex-col gap-4 mb-12 border border-white/5"
        >
          <div>
            <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
              Full Name
            </label>
            <input
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
              placeholder="Dian Sastrowardoyo"
              required
              type="text"
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
              Phone / Email
            </label>
            <input
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
              placeholder="dian@example.com"
              type="text"
              value={rsvpContact}
              onChange={(e) => setRsvpContact(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
              Attendance Confirmation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container cursor-pointer border border-transparent hover:border-primary/40">
                <input
                  checked={rsvpAttendance === 'hadir'}
                  onChange={() => setRsvpAttendance('hadir')}
                  className="accent-primary"
                  name="attendance"
                  type="radio"
                  value="hadir"
                />
                <span className="font-body-sm text-on-surface text-xs">
                  Hadir (Attend)
                </span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container cursor-pointer border border-transparent hover:border-primary/40">
                <input
                  checked={rsvpAttendance === 'tidak'}
                  onChange={() => setRsvpAttendance('tidak')}
                  className="accent-primary"
                  name="attendance"
                  type="radio"
                  value="tidak"
                />
                <span className="font-body-sm text-on-surface text-xs">
                  Tidak Hadir
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
              Number of Guests
            </label>
            <input
              type="number"
              min={1}
              max={50}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
              value={rsvpPax}
              onChange={(e) => setRsvpPax(e.target.value)}
              placeholder="Enter guest count (e.g. 2)"
              required
            />
          </div>

          <div>
            <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
              Dietary Restrictions (Optional)
            </label>
            <input
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
              placeholder="e.g. Vegetarian, Nut Allergy"
              type="text"
              value={rsvpDietary}
              onChange={(e) => setRsvpDietary(e.target.value)}
            />
          </div>

          <button
            className="w-full mt-2 py-3.5 rounded-lg bg-primary text-on-primary font-label-md uppercase tracking-[0.15em] shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform text-xs cursor-pointer"
            type="submit"
          >
            Submit RSVP
          </button>

          {rsvpSubmitted && (
            <div
              className="p-3 rounded-lg bg-primary/10 text-primary text-center font-body-sm text-xs border border-primary/20 animate-fadeIn"
              id="rsvp-success"
            >
              ✨ Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dengan anggun.
            </div>
          )}
        </form>
      )}

      {/* Digital Envelope / Tanda Kasih */}
      {theme?.show_gift !== false && (
        <div className="w-full max-w-[360px] flex flex-col items-center" id="gift">
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
      )}
    </section>
  );
};
