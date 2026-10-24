import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface IslamiRsvpProps extends BaseSectionProps {
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
}

export interface IslamiGiftProps extends BaseSectionProps {
  copiedKey: string | null;
  handleCopy: (text: string, key: string, label?: string) => void;
}

export interface IslamiRsvpGiftProps extends BaseSectionProps {
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

export const RsvpSection: React.FC<IslamiRsvpProps> = ({
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
    <section
      className="px-margin pt-space-xl pb-space-md flex flex-col items-center w-full"
      id="rsvp"
    >
      <div className="text-center mb-8">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Kehadiran &amp; Doa Restu
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          RSVP &amp; Doa Restu
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      {/* RSVP Form Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-md shadow-primary/5 mb-4 border border-secondary-container/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">
              how_to_reg
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
            Konfirmasi Kehadiran &amp; Doa
          </h3>
        </div>

        <form onSubmit={handleRsvpSubmit} className="space-y-4" id="rsvp-form">
          <div>
            <label
              className="block font-label-md text-label-md text-on-surface mb-1 font-semibold"
              htmlFor="rsvp-nama"
            >
              Nama Lengkap Tamu
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
              id="rsvp-nama"
              placeholder="Contoh: Bpk. Ahmad Dahlan & Keluarga"
              required
              value={rsvpForm.name}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRsvpForm((prev: any) => ({ ...prev, status: 'hadir', pax: Math.max(1, prev.pax || 1) }))}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  isAttending
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/30 font-bold'
                    : 'bg-surface-container-low border-secondary-container/30 text-on-surface-variant hover:border-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Hadir</span>
              </button>

              <button
                type="button"
                onClick={() => setRsvpForm((prev: any) => ({ ...prev, status: 'tidak_hadir', pax: 0 }))}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  isDeclined
                    ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-900/30 font-bold'
                    : 'bg-surface-container-low border-secondary-container/30 text-on-surface-variant hover:border-rose-400 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                <span>Tidak Hadir</span>
              </button>
            </div>
          </div>

          {/* Conditional Jumlah Tamu Pax */}
          {isAttending && (
            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-1 font-semibold"
                htmlFor="rsvp-pax"
              >
                Jumlah Tamu
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                id="rsvp-pax"
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
            <label
              className="block font-label-md text-label-md text-on-surface mb-1 font-semibold"
              htmlFor="rsvp-notes"
            >
              Doa &amp; Ucapan Selamat
            </label>
            <textarea
              id="rsvp-notes"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary resize-none"
              placeholder="Tuliskan ucapan dan doa tulus untuk kedua mempelai..."
              value={rsvpForm.notes || ''}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <button
            className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
            type="submit"
          >
            <span className="material-symbols-outlined text-[18px]">
              send
            </span>
            <span>Kirim Ucapan &amp; Konfirmasi</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export const GiftSection: React.FC<IslamiGiftProps> = ({
  data,
  theme,
  copiedKey,
  handleCopy,
}) => {
  if (theme?.show_gift === false) return null;

  return (
    <section
      className="px-margin py-space-xl flex flex-col items-center w-full"
      id="gift"
    >
      <div className="w-full space-y-4">
        <div className="text-center mb-4">
          <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold block mb-1">
            Tanda Kasih
          </span>
          <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">
            Tanda Kasih Digital
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[300px] mx-auto mt-1">
            Doa restu Anda merupakan karunia yang paling berarti bagi kami. Namun
            jika memberi adalah ungkapan kasih, Anda dapat memberi kado secara
            cashless.
          </p>
        </div>

        {/* Bank Accounts */}
        {((data.banks && data.banks.length > 0) ? data.banks : ((data as any).bank_accounts || []))?.map((acc: any, index: number) => (
          <div
            key={index}
            className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col border border-secondary-container/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-lg text-label-lg text-primary font-bold tracking-widest">
                {acc.bank_name}
              </span>
              <span className="material-symbols-outlined text-secondary">
                credit_card
              </span>
            </div>
            <p className="font-headline-sm text-headline-sm text-on-surface font-mono tracking-wider font-semibold mb-1 break-words [overflow-wrap:anywhere]">
              {acc.account_number}
            </p>
            <span className="font-body-sm text-body-sm text-on-surface-variant mb-4 break-words [overflow-wrap:anywhere]">
              a.n {acc.account_holder}
            </span>
            <button
              className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer"
              onClick={() =>
                handleCopy(acc.account_number_raw || acc.account_number, `bank-${index}`)
              }
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedKey === `bank-${index}` ? 'check' : 'content_copy'}
              </span>
              <span>
                {copiedKey === `bank-${index}`
                  ? 'Tersalin!'
                  : 'Salin Nomor Rekening'}
              </span>
            </button>
          </div>
        ))}

        {/* Physical Gift Address Card */}
        {data.gift_address && (
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col border border-secondary-container/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-lg text-label-lg text-primary font-bold">
                Kirim Kado Fisik
              </span>
              <span className="material-symbols-outlined text-secondary">
                inventory_2
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface mb-3 break-words [overflow-wrap:anywhere]">
              {data.gift_address}
            </p>
            <button
              className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer"
              onClick={() => handleCopy(data.gift_address!, 'address')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedKey === 'address' ? 'check' : 'content_copy'}
              </span>
              <span>
                {copiedKey === 'address'
                  ? 'Tersalin!'
                  : 'Salin Alamat Lengkap'}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export const RsvpGiftSection: React.FC<IslamiRsvpGiftProps> = (props) => {
  return (
    <>
      <RsvpSection {...props} />
      <GiftSection {...props} />
    </>
  );
};
