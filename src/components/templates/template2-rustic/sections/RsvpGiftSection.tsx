import React from 'react';
import type { BaseSectionProps } from '../../types';
import { MOCK_RUSTIC_DATA } from '../../../../data/mock/rusticData';

export interface RusticRsvpProps extends BaseSectionProps {
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
}

export interface RusticGiftProps extends BaseSectionProps {
  activeGiftTab: 'transfer' | 'kado';
  setActiveGiftTab: (tab: 'transfer' | 'kado') => void;
  handleCopy: (text: string, label: string) => void;
}

export interface RusticRsvpGiftProps extends BaseSectionProps {
  rsvpForm: {
    name: string;
    status: string;
    pax: number;
    notes?: string;
  };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  activeGiftTab: 'transfer' | 'kado';
  setActiveGiftTab: (tab: 'transfer' | 'kado') => void;
  handleCopy: (text: string, label: string) => void;
}

export const RsvpSection: React.FC<RusticRsvpProps> = ({
  theme,
  isSectionActive = () => true,
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
}) => {
  const showRsvp = theme?.show_rsvp !== false && isSectionActive('rsvp');
  if (!showRsvp) return null;

  const isAttending = rsvpForm.status === 'hadir' || rsvpForm.status === 'attending' || rsvpForm.status === 'Hadir';
  const isDeclined =
    rsvpForm.status === 'tidak_hadir' ||
    rsvpForm.status === 'declined' ||
    rsvpForm.status === 'tidak' ||
    rsvpForm.status === 'Tidak Hadir';

  return (
    <section id="rsvp" className="flex flex-col pt-space-xl pb-4">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#2C4034]/15 mb-4">
        <div className="text-center mb-space-md">
          <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
            Attendance &amp; Wishes
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
            RSVP &amp; Doa Restu
          </h3>
          <p className="text-xs text-[#4D5E53] mt-1">
            Mohon konfirmasi kesediaan hadir serta untaian doa Anda
          </p>
        </div>

        <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4" id="rsvpForm">
          <div>
            <label className="block text-xs font-semibold text-[#2C4034] mb-1.5 font-sans">
              Nama Lengkap Tamu
            </label>
            <input
              type="text"
              name="nama"
              required
              placeholder="Contoh: Bpk. Ahmad Dahlan & Keluarga"
              value={rsvpForm.name}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, name: e.target.value }))}
              className="w-full h-11 px-4 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C4034] mb-2 font-sans">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRsvpForm((prev: any) => ({ ...prev, status: 'hadir', pax: Math.max(1, prev.pax || 1) }))}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  isAttending
                    ? 'bg-emerald-700 border-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-[#FAF8F5] border-[#2C4034]/15 text-[#4D5E53] hover:border-[#2C4034] hover:text-[#2C4034]'
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
                    ? 'bg-rose-700 border-rose-600 text-white shadow-sm font-bold'
                    : 'bg-[#FAF8F5] border-[#2C4034]/15 text-[#4D5E53] hover:border-rose-400 hover:text-[#2C4034]'
                }`}
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                <span>Tidak Hadir</span>
              </button>
            </div>
          </div>

          {/* Conditional Jumlah Tamu */}
          {isAttending && (
            <div>
              <label className="block text-xs font-semibold text-[#2C4034] mb-1.5 font-sans">
                Jumlah Tamu
              </label>
              <select
                name="jumlah_tamu"
                value={rsvpForm.pax}
                onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, pax: Number(e.target.value) }))}
                className="w-full h-11 px-4 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034]"
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
            <label className="block text-xs font-semibold text-[#2C4034] mb-1.5 font-sans">
              Doa &amp; Ucapan Selamat
            </label>
            <textarea
              name="pesan"
              rows={3}
              value={rsvpForm.notes || ''}
              onChange={(e) => setRsvpForm((prev: any) => ({ ...prev, notes: e.target.value }))}
              placeholder="Tuliskan doa serta ucapan tulus untuk kedua mempelai..."
              className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[50px] rounded-full bg-[#2C4034] hover:bg-[#1E2D24] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 shadow-md shadow-[#2C4034]/20 transition-all active:scale-95 cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Kirim Ucapan &amp; Konfirmasi</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export const GiftSection: React.FC<RusticGiftProps> = ({
  data,
  theme,
  isPreview,
  isSectionActive = () => true,
  activeGiftTab,
  setActiveGiftTab,
  handleCopy,
}) => {
  const showGift = theme?.show_gift !== false && (isSectionActive('gift') || isPreview);
  if (!showGift) return null;

  return (
    <section id="gift" className="flex flex-col py-space-xl">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#2C4034]/15">
        <div className="text-center mb-5">
          <span className="font-label-md text-xs text-[#855233] uppercase tracking-widest font-semibold">
            Wedding Gift
          </span>
          <h3 className="font-serif text-2xl text-[#2C4034] font-bold mt-1">
            Tanda Kasih
          </h3>
          <p className="text-xs text-[#5C6F61] max-w-xs mx-auto mt-1 leading-relaxed">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat melalui:
          </p>
        </div>

        {/* Tabs Switch */}
        <div className="flex rounded-full bg-[#F2EDE4] p-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveGiftTab('transfer')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeGiftTab === 'transfer'
              ? 'bg-[#2C4034] text-white shadow-xs'
              : 'text-[#5C6F61] hover:text-[#2C4034]'
              }`}
          >
            Transfer Bank
          </button>
          <button
            type="button"
            onClick={() => setActiveGiftTab('kado')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeGiftTab === 'kado'
              ? 'bg-[#2C4034] text-white shadow-xs'
              : 'text-[#5C6F61] hover:text-[#2C4034]'
              }`}
          >
            Kirim Kado
          </button>
        </div>

        {/* Tab 1: Bank Transfer Content */}
        {activeGiftTab === 'transfer' && (
          <div className="flex flex-col gap-4">
            {(() => {
              const effectiveBanks = (data.banks && data.banks.length > 0)
                ? data.banks
                : (data.bank_accounts && data.bank_accounts.length > 0)
                  ? data.bank_accounts
                  : (isPreview ? (MOCK_RUSTIC_DATA.banks || []) : []);

              if (!effectiveBanks || effectiveBanks.length === 0) return null;

              return effectiveBanks.map((bank: any, index: number) => {
                const isPrimary = index % 2 === 0;
                return (
                  <div
                    key={bank.account_number || index}
                    className={`rounded-2xl p-5 border text-left shadow-sm relative overflow-hidden ${isPrimary
                      ? 'bg-gradient-to-br from-[#2C4034] to-[#1E2D24] text-white border-[#2C4034]/30'
                      : 'bg-[#FAF8F5] text-[#2C4034] border-[#8C4E2D]/20'
                      }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`text-xs font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded ${isPrimary
                          ? 'bg-white/10 text-white/90'
                          : 'bg-[#8C4E2D]/10 text-[#8C4E2D]'
                          }`}
                      >
                        {bank.bank_name || 'BANK'}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[20px] ${isPrimary ? 'text-white/70' : 'text-[#8C4E2D]'
                          }`}
                      >
                        credit_card
                      </span>
                    </div>

                    <p
                      className={`text-[10px] tracking-widest uppercase mb-1 ${isPrimary ? 'text-white/60' : 'text-[#4D5E53]'
                        }`}
                    >
                      Nomor Rekening
                    </p>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-base sm:text-lg font-bold tracking-wider">
                        {bank.account_number}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            bank.account_number_raw || bank.account_number,
                            `Nomor rekening ${bank.bank_name} berhasil disalin`
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${isPrimary
                          ? 'bg-white/20 hover:bg-white/30 text-white'
                          : 'bg-[#8C4E2D] hover:bg-[#6F4125] text-white shadow-2xs'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          content_copy
                        </span>
                        <span>Salin</span>
                      </button>
                    </div>

                    <div className="border-t border-current/10 pt-2 flex items-center justify-between text-xs">
                      <span className={isPrimary ? 'text-white/60' : 'text-[#4D5E53]'}>
                        Atas Nama
                      </span>
                      <span className="font-semibold">{bank.account_holder}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Tab 2: Send Physical Gift Address */}
        {activeGiftTab === 'kado' && (
          <div className="flex flex-col gap-3">
            {(() => {
              const effectiveAddress = data.gift_address || (isPreview ? MOCK_RUSTIC_DATA.gift_address : '');
              return (
                <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#855233]/20 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EFE8DE] text-[#855233] flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[20px]">
                      home_pin
                    </span>
                  </div>
                  <div className="font-serif text-base font-bold text-[#2C4034] mb-1">
                    Alamat Pengiriman Kado
                  </div>
                  <p className="text-xs text-[#5C6F61] my-1 leading-relaxed break-words [overflow-wrap:anywhere] max-w-xs">
                    {effectiveAddress || 'Villa Pine Sanctuary Blok B7, Jl. Maribaya No. 120, Kayuambon, Kec. Lembang, Kabupaten Bandung Barat, Jawa Barat 40391'}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        effectiveAddress || 'Villa Pine Sanctuary Blok B7, Jl. Maribaya No. 120, Kayuambon, Lembang, Bandung Barat 40391',
                        'Alamat pengiriman berhasil disalin'
                      )
                    }
                    className="px-5 py-2.5 mt-2 rounded-full bg-[#855233] hover:bg-[#6F4125] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      content_copy
                    </span>
                    <span>Salin Alamat Lengkap</span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};

export const RsvpGiftSection: React.FC<RusticRsvpGiftProps> = (props) => {
  return (
    <>
      <RsvpSection {...props} />
      <GiftSection {...props} />
    </>
  );
};
