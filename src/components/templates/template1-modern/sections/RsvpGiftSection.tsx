import React from 'react';
import type { RsvpGiftSectionProps } from '../../types';

export const RsvpGiftSection: React.FC<RsvpGiftSectionProps> = ({
  data,
  theme,
  isSectionActive = () => true,
  rsvpForm,
  setRsvpForm,
  rsvpSubmitted,
  handleRsvpSubmit,
  copiedAccountIndex,
  copiedAddress,
  handleCopyAccount,
  handleCopyAddress,
}) => {
  const showRsvp = theme.show_rsvp !== false && isSectionActive('rsvp');
  const showGift = theme.show_gift !== false && isSectionActive('gift');

  if (!showRsvp && !showGift) return null;

  return (
    <section id="rsvp" className="py-12 px-6">
      {/* RSVP Form */}
      {showRsvp && (
        <>
          <div className="text-center mb-8 reveal">
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
              Konfirmasi Kehadiran
            </span>
            <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
              RSVP Online
            </h2>
            <p className="text-xs text-charcoal-muted mt-1 font-light">
              Mohon kesediaannya mengisi konfirmasi kehadiran
            </p>
          </div>

          <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm mb-12 reveal-scale delay-100">
            {rsvpSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                <i className="fa-solid fa-circle-check text-2xl text-emerald-600 mb-2"></i>
                <p className="text-xs font-semibold">Konfirmasi Berhasil Terkirim!</p>
                <p className="text-[11px] text-emerald-700/80 mt-1">
                  Terima kasih banyak atas konfirmasi kehadiran Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-dark mb-1 tracking-wide">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    placeholder="Masukkan nama Anda"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-dark mb-1 tracking-wide">
                    Status Kehadiran
                  </label>
                  <select
                    value={rsvpForm.status}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                  >
                    <option value="hadir">Ya, Saya Akan Hadir</option>
                    <option value="tidak_hadir">Maaf, Tidak Dapat Hadir</option>
                    <option value="ragu">Masih Belum Pasti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-dark mb-1 tracking-wide">
                    Jumlah Tamu (Pax)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={rsvpForm.pax || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setRsvpForm({ ...rsvpForm, pax: isNaN(val) ? 1 : Math.max(1, val) });
                    }}
                    placeholder="Ketik jumlah tamu (contoh: 2)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 rounded-full bg-charcoal-dark text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-champagne active:scale-98 transition-all shadow cursor-pointer"
                >
                  Kirim Konfirmasi RSVP
                </button>
              </form>
            )}
          </div>
        </>
      )}

      {/* Digital Envelope (Amplop Digital) */}
      {showGift && (
        <>
          <div className="text-center mb-8">
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
              Tanda Kasih
            </span>
            <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
              Amplop Digital
            </h2>
            <p className="text-xs text-charcoal-muted mt-1 font-light max-w-[300px] mx-auto">
              Doa restu Anda adalah karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat melalui:
            </p>
          </div>

          <div className="space-y-4">
            {/* Bank Accounts */}
            {((data.banks && data.banks.length > 0) ? data.banks : ((data as any).bank_accounts || []))?.map((bank: any, index: number) => {
              const isEven = index % 2 === 0;
              const isCopied = copiedAccountIndex === index;
              return (
                <div
                  key={index}
                  className={`relative w-full rounded-2xl p-5 text-white shadow-lg border overflow-hidden ${isEven
                    ? 'bg-gradient-to-br from-[#1F1F1F] via-[#2A2A2A] to-[#141414] border-neutral-700'
                    : 'bg-gradient-to-br from-[#8C713B] via-[#A88746] to-[#6E5728] border-amber-400/30'
                    }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-editorial italic text-base tracking-widest text-gold-champagne font-light">
                      {data.groom.name} &amp; {data.bride.name}
                    </span>
                    <span className="font-bold tracking-widest text-sm bg-white/10 px-2 py-0.5 rounded border border-white/20">
                      {bank.bank_name}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] uppercase text-white/50 tracking-[0.2em]">Nomor Rekening</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-lg tracking-wider text-white">
                        {bank.account_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(bank.account_number_raw || bank.account_number, index)}
                        className={`px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-medium transition-colors flex items-center space-x-1 cursor-pointer ${isCopied
                          ? 'bg-emerald-600 text-white'
                          : isEven
                            ? 'bg-white/15 hover:bg-gold-champagne text-white'
                            : 'bg-black/30 hover:bg-charcoal-dark text-white'
                          }`}
                      >
                        <i className={`text-xs ${isCopied ? 'fa-solid fa-check' : 'fa-regular fa-copy'}`}></i>
                        <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-3">
                    <div>
                      <p className="text-[9px] uppercase text-white/40 tracking-wider">Atas Nama</p>
                      <p className="text-xs font-medium text-white tracking-wide uppercase">
                        {bank.account_holder}
                      </p>
                    </div>
                    <i className={`text-2xl text-white/40 ${isEven ? 'fa-brands fa-cc-mastercard' : 'fa-brands fa-cc-visa'}`}></i>
                  </div>
                </div>
              );
            })}

            {/* Optional Physical Gift Address */}
            {data.gift_address && (
              <div className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm">
                <div className="flex items-center space-x-2 text-charcoal-dark mb-2">
                  <i className="fa-solid fa-gift text-gold-champagne"></i>
                  <span className="text-xs font-semibold tracking-widest uppercase">
                    Kirim Kado Fisik
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted font-light leading-relaxed mb-3">
                  {data.gift_address}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyAddress(data.gift_address || '')}
                  className="px-4 py-2 rounded-full border border-border-subtle hover:border-gold-champagne text-xs text-charcoal-dark hover:text-gold-champagne transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <i className={`text-xs ${copiedAddress ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy'}`}></i>
                  <span>{copiedAddress ? 'Alamat Tersalin' : 'Salin Alamat'}</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};
