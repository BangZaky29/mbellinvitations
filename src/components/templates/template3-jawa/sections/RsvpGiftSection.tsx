import React from 'react';
import type { BaseSectionProps } from '../../types';
import { MOCK_JAWA_DATA } from '../../../../data/mock/jawaData';

export interface JawaRsvpGiftProps extends BaseSectionProps {
  rsvpForm: { name: string; guests: number; presence: string };
  setRsvpForm: (form: any) => void;
  rsvpToastVisible: boolean;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  handleCopy: (text: string, label: string) => void;
}

export const RsvpGiftSection: React.FC<JawaRsvpGiftProps> = ({
  data,
  theme,
  isPreview,
  isSectionActive = () => true,
  rsvpForm,
  setRsvpForm,
  rsvpToastVisible,
  handleRsvpSubmit,
  handleCopy,
}) => {
  const showRsvp = theme?.show_rsvp !== false && isSectionActive('rsvp');
  const showGift = theme?.show_gift !== false && (isSectionActive('gift') || isPreview);

  if (!showRsvp && !showGift) return null;

  return (
    <section id="rsvp" className="relative w-full bg-surface-container-low px-margin py-space-xl flex flex-col items-center">
      {/* RSVP Form Card */}
      {showRsvp && (
        <>
          <div className="text-center mb-6">
            <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
              Palapuran Rawuh
            </span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              RSVP &amp; Konfirmasi
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
              Matur nuwun sanget katur palapuran rawuh panjenengan
            </p>
          </div>

          <div className="w-full bg-surface-container rounded-2xl p-space-md shadow-xl mb-8">
            <form onSubmit={handleRsvpSubmit} className="space-y-4" id="rsvp-form">
              <div>
                <label
                  className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1"
                  htmlFor="rsvp-name"
                >
                  Nama Lengkap
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                  placeholder="Contoh: Bpk. Bambang Prasetyo"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 placeholder:italic font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1"
                  htmlFor="rsvp-guests"
                >
                  Jumlah Tamu
                </label>
                <input
                  id="rsvp-guests"
                  type="number"
                  min={1}
                  max={50}
                  value={rsvpForm.guests || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setRsvpForm({ ...rsvpForm, guests: isNaN(val) ? 1 : Math.max(1, val) });
                  }}
                  placeholder="Ketik jumlah tamu (contoh: 2)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <span className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-2">
                  Konfirmasi Kehadiran
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                      rsvpForm.presence === 'hadir'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <input
                      type="radio"
                      name="presence"
                      value="hadir"
                      checked={rsvpForm.presence === 'hadir'}
                      onChange={() => setRsvpForm({ ...rsvpForm, presence: 'hadir' })}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span className="font-label-md text-label-md font-bold uppercase tracking-wide">
                      Pasti Hadir
                    </span>
                  </label>

                  <label
                    className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                      rsvpForm.presence === 'berhalangan'
                        ? 'bg-error text-on-error'
                        : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <input
                      type="radio"
                      name="presence"
                      value="berhalangan"
                      checked={rsvpForm.presence === 'berhalangan'}
                      onChange={() => setRsvpForm({ ...rsvpForm, presence: 'berhalangan' })}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-base">cancel</span>
                    <span className="font-label-md text-label-md font-bold uppercase tracking-wide">
                      Berhalangan
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-fixed-dim via-primary to-secondary text-on-primary font-label-lg text-label-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span className="tracking-wider">KONFIRMASI KEHADIRAN</span>
              </button>
            </form>

            {rsvpToastVisible && (
              <div className="mt-3 p-2.5 rounded-lg bg-primary-container text-on-primary-container font-body-md text-body-md text-center">
                Matur nuwun, konfirmasi rawuh panjenengan sampun katampi!
              </div>
            )}
          </div>
        </>
      )}

      {/* Tanda Kasih / Digital Envelope */}
      {showGift && (
        <>
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#FFE082] font-semibold block mb-1">
              Tandha Asih
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#FAF6F0] drop-shadow-sm">
              Kado Digital &amp; Amplop
            </h3>
            <p className="text-xs text-[#D4AF37] italic mt-1 font-serif">
              Paring tandha tresna kagem kabingahan mempelai
            </p>
          </div>

          {(() => {
            const effectiveBanks = (data.banks && data.banks.length > 0)
              ? data.banks
              : (data.bank_accounts && data.bank_accounts.length > 0)
              ? data.bank_accounts
              : (isPreview ? (MOCK_JAWA_DATA.bank_accounts || MOCK_JAWA_DATA.banks || []) : []);

            if (!effectiveBanks || effectiveBanks.length === 0) return null;

            return effectiveBanks.map((bank: any, index: number) => {
              const isBca = (bank.bank_name || '').toUpperCase().includes('BCA');
              return (
                <div
                  key={bank.account_number || index}
                  className="w-full bg-gradient-to-br from-[#251D18] via-[#1E1713] to-[#120E0B] border border-[#F3D068]/40 rounded-2xl p-5 shadow-2xl mb-4 relative overflow-hidden text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-lg font-bold tracking-wider text-[#FFE082]">
                      BANK {bank.bank_name.toUpperCase()}
                    </span>
                    <span className="material-symbols-outlined text-[#F3D068] text-2xl">
                      {isBca ? 'contactless' : 'credit_card'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#FAF6F0]/70 uppercase tracking-widest mb-1">
                    Nomor Rekening {bank.bank_name}
                  </p>
                  <p className="font-mono text-xl font-bold tracking-widest text-[#FAF6F0]">
                    {bank.account_number}
                  </p>
                  <p className="text-xs text-[#FFE082] mt-1 mb-4 font-semibold break-words [overflow-wrap:anywhere]">
                    a.n {bank.account_holder}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        bank.account_number_raw || bank.account_number,
                        `Nomor Rekening ${bank.bank_name} tersalin di Clipboard!`
                      )
                    }
                    className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-[#14100D] font-bold text-xs tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>Salin No. Rekening</span>
                  </button>
                </div>
              );
            });
          })()}

          {/* Physical Gift Address */}
          {(() => {
            const effectiveAddress = data.gift_address || (isPreview ? (MOCK_JAWA_DATA.gift_address || '') : '');
            if (!effectiveAddress) return null;
            return (
              <div className="w-full bg-[#1C1612] rounded-2xl p-5 shadow-xl border border-[#F3D068]/30 flex flex-col items-center text-center mt-2">
                <div className="w-10 h-10 rounded-full bg-[#2A201A] text-[#FFE082] flex items-center justify-center mb-2 border border-[#F3D068]/30">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <h4 className="font-serif text-base text-[#FFE082] font-bold mb-1">
                  Kirim Kado Fisik
                </h4>
                <p className="text-xs text-[#FAF6F0]/80 mb-3 leading-relaxed break-words [overflow-wrap:anywhere] max-w-xs">
                  {effectiveAddress}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(effectiveAddress, 'Alamat kado fisik disalin!')}
                  className="px-5 py-2 rounded-full bg-[#2A201A] hover:bg-[#382B22] text-[#FFE082] border border-[#F3D068]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">file_copy</span>
                  <span>Salin Alamat</span>
                </button>
              </div>
            );
          })()}
        </>
      )}
    </section>
  );
};
