import React from 'react';
import type { BaseSectionProps } from '../../types';
import { MOCK_RUSTIC_DATA } from '../../../../data/mock/rusticData';

export interface RusticRsvpGiftProps extends BaseSectionProps {
  rsvpForm: { name: string; status: string; pax: number };
  setRsvpForm: (form: any) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  activeGiftTab: 'transfer' | 'kado';
  setActiveGiftTab: (tab: 'transfer' | 'kado') => void;
  handleCopy: (text: string, label: string) => void;
}

export const RsvpGiftSection: React.FC<RusticRsvpGiftProps> = ({
  data,
  theme,
  isPreview,
  isSectionActive = () => true,
  rsvpForm,
  setRsvpForm,
  handleRsvpSubmit,
  activeGiftTab,
  setActiveGiftTab,
  handleCopy,
}) => {
  const showRsvp = theme.show_rsvp !== false && isSectionActive('rsvp');
  const showGift = theme.show_gift !== false && (isSectionActive('gift') || isPreview);

  if (!showRsvp && !showGift) return null;

  return (
    <section className="flex flex-col py-space-xl">
      {/* Part A: RSVP Card */}
      {showRsvp && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#2C4034]/15 mb-space-xl">
          <div className="text-center mb-space-md">
            <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
              Attendance
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
              Konfirmasi Kehadiran
            </h3>
            <p className="text-xs text-[#4D5E53] mt-1">
              Mohon konfirmasi kesediaan hadir Anda
            </p>
          </div>

          <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4" id="rsvpForm">
            <div>
              <label className="text-xs font-bold text-[#2C4034] uppercase tracking-wider mb-1 block">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={rsvpForm.name}
                onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C4034] uppercase tracking-wider mb-2 block">
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Hadir', 'Tidak Hadir', 'Ragu'].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center py-2.5 px-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${rsvpForm.status === opt
                      ? 'bg-[#2C4034] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#4D5E53] border border-[#2C4034]/12 hover:bg-[#F2EDE4]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value={opt}
                      checked={rsvpForm.status === opt}
                      onChange={() => setRsvpForm({ ...rsvpForm, status: opt })}
                      className="hidden"
                    />
                    <span>{opt === 'Ragu' ? 'Masih Ragu' : opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C4034] uppercase tracking-wider mb-1 block">
                Jumlah Tamu
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
                className="w-full h-12 px-4 rounded-xl bg-[#FAF8F5] border border-[#2C4034]/15 text-[#2C4034] text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#2C4034]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[50px] rounded-full bg-[#2C4034] hover:bg-[#1E2D24] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 shadow-md shadow-[#2C4034]/20 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Kirim Konfirmasi Kehadiran</span>
            </button>
          </form>
        </div>
      )}

      {/* Part B: Digital Envelope (Tanda Kasih) */}
      {showGift && (
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
                      className={`rounded-2xl p-5 shadow-lg relative overflow-hidden text-left ${isPrimary
                        ? 'bg-gradient-to-br from-[#2C4034] via-[#24352B] to-[#18241D] text-white border border-[#2C4034]/30'
                        : 'bg-gradient-to-br from-[#855233] via-[#744528] to-[#553018] text-white border border-[#855233]/30'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-serif text-lg font-bold tracking-wider text-white">
                          {bank.bank_name}
                        </span>
                        <span className={`material-symbols-outlined text-[24px] ${isPrimary ? 'text-amber-300' : 'text-amber-200'}`}>
                          credit_card
                        </span>
                      </div>
                      <div className={`font-mono text-xl font-bold tracking-widest my-1 break-words [overflow-wrap:anywhere] ${isPrimary ? 'text-[#F4E3CA]' : 'text-[#FBEEDC]'
                        }`}>
                        {bank.account_number}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-white/80 mb-3 break-words [overflow-wrap:anywhere]">
                        a.n. {bank.account_holder}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            bank.account_number_raw || bank.account_number,
                            `No. Rekening ${bank.bank_name} ${bank.account_holder} disalin`
                          )
                        }
                        className={`w-full py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer bg-white ${isPrimary ? 'text-[#2C4034] hover:bg-stone-100' : 'text-[#855233] hover:bg-stone-100'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          content_copy
                        </span>
                        <span>Salin No. Rekening</span>
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Tab 2: Physical Gift Content */}
          {activeGiftTab === 'kado' && (
            <div className="flex flex-col gap-3">
              {(() => {
                const effectiveAddress = data.gift_address || (isPreview ? (MOCK_RUSTIC_DATA.gift_address || '') : '');
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
      )}
    </section>
  );
};
