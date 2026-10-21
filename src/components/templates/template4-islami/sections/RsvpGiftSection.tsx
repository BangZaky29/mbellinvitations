import React from 'react';
import type { BaseSectionProps } from '../../types';

export interface IslamiRsvpGiftProps extends BaseSectionProps {
  rsvpName: string;
  setRsvpName: (name: string) => void;
  rsvpPax: string;
  setRsvpPax: (pax: string) => void;
  rsvpStatus: 'hadir' | 'ragu' | 'tidak';
  setRsvpStatus: (status: 'hadir' | 'ragu' | 'tidak') => void;
  rsvpSubmitted: boolean;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  copiedKey: string | null;
  handleCopy: (text: string, key: string, label?: string) => void;
}

export const RsvpGiftSection: React.FC<IslamiRsvpGiftProps> = ({
  data,
  theme,
  rsvpName,
  setRsvpName,
  rsvpPax,
  setRsvpPax,
  rsvpStatus,
  setRsvpStatus,
  rsvpSubmitted,
  handleRsvpSubmit,
  copiedKey,
  handleCopy,
}) => {
  return (
    <section
      className="px-margin py-space-xl flex flex-col items-center"
      id="rsvp-amplop"
    >
      <div className="text-center mb-8">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Kehadiran &amp; Kado
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          RSVP &amp; Amplop Digital
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      {/* RSVP Form Card */}
      {theme?.show_rsvp !== false && (
        <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-md shadow-primary/5 mb-8 border border-secondary-container/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">
                contact_mail
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Konfirmasi Kehadiran
            </h3>
          </div>

          {rsvpSubmitted ? (
            <div className="p-4 rounded-xl bg-secondary-container/40 text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-1">
                check_circle
              </span>
              <p className="font-bold text-primary text-sm">
                Konfirmasi Berhasil Terkirim!
              </p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Jazakumullahu khairan katsiran atas konfirmasi kehadiran Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4" id="rsvp-form">
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="rsvp-nama"
                >
                  Nama Lengkap
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                  id="rsvp-nama"
                  placeholder="Masukkan nama Anda"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="rsvp-pax"
                >
                  Jumlah Tamu
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                  id="rsvp-pax"
                  value={rsvpPax}
                  onChange={(e) => setRsvpPax(e.target.value)}
                  placeholder="Ketik jumlah tamu (contoh: 2)"
                  required
                />
              </div>

              <div>
                <span className="block font-label-md text-label-md text-on-surface mb-2">
                  Status Kehadiran
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="kehadiran"
                      value="hadir"
                      checked={rsvpStatus === 'hadir'}
                      onChange={() => setRsvpStatus('hadir')}
                      className="sr-only"
                    />
                    <div
                      className={`text-center py-2 px-1 rounded-xl text-label-md transition-all shadow-sm ${
                        rsvpStatus === 'hadir'
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      Hadir
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="kehadiran"
                      value="ragu"
                      checked={rsvpStatus === 'ragu'}
                      onChange={() => setRsvpStatus('ragu')}
                      className="sr-only"
                    />
                    <div
                      className={`text-center py-2 px-1 rounded-xl text-label-md transition-all shadow-sm ${
                        rsvpStatus === 'ragu'
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      Ragu-ragu
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="kehadiran"
                      value="tidak"
                      checked={rsvpStatus === 'tidak'}
                      onChange={() => setRsvpStatus('tidak')}
                      className="sr-only"
                    />
                    <div
                      className={`text-center py-2 px-1 rounded-xl text-label-md transition-all shadow-sm ${
                        rsvpStatus === 'tidak'
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      Tidak Hadir
                    </div>
                  </label>
                </div>
              </div>

              <button
                className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
                <span>Kirim Konfirmasi</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Digital Envelope (Amplop Digital) Cards */}
      {theme?.show_gift !== false && (
        <div className="w-full space-y-4">
          <div className="text-center mb-2">
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
      )}
    </section>
  );
};
