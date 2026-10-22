import React from 'react';
import type { BaseSectionProps } from '../../types';
import { MOCK_MINANG_DATA } from '../../../../data/mock/minangData';

export interface MinangGiftProps extends BaseSectionProps {
  handleCopyAccount: (accNum: string, index: number) => void;
  handleCopyAddress: (addr: string) => void;
}

export const GiftSection: React.FC<MinangGiftProps> = ({
  data,
  isPreview,
  handleCopyAccount,
  handleCopyAddress,
}) => {
  const effectiveBanks =
    data.banks && data.banks.length > 0
      ? data.banks
      : data.bank_accounts && data.bank_accounts.length > 0
      ? data.bank_accounts
      : isPreview
      ? MOCK_MINANG_DATA.bank_accounts || MOCK_MINANG_DATA.banks || []
      : [];

  const effectiveGiftAddress =
    data.gift_address || (isPreview ? MOCK_MINANG_DATA.gift_address : '');

  return (
    <section
      id="kado"
      className="bg-[#1B0609] text-[#FAF6EE] px-5 pt-8 pb-10 bg-texture-noise relative"
      style={{ backgroundColor: '#1B0609', color: '#FAF6EE' }}
    >
      {/* Section Title */}
      <div className="text-center mb-7">
        <span className="font-script text-2xl text-[#F5E296]">Tanda Kasih</span>
        <h3 className="font-cinzel text-2xl font-bold tracking-wider text-gold-shimmer">
          AMPLOP DIGITAL
        </h3>
        <p className="text-xs text-[#FAF6EE]/75 font-sans max-w-[290px] mx-auto mt-1 leading-relaxed">
          Doa restu Anda adalah karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih berupa cashless gift:
        </p>
        <div className="w-12 h-0.5 bg-[#D4AF37]/60 mx-auto mt-2" />
      </div>

      {/* Bank Cards List */}
      <div className="space-y-4 max-w-[340px] mx-auto mb-6">
        {effectiveBanks.map((bank: any, idx: number) => {
          const rawNumber = (bank.account_number_raw || bank.account_number || '').replace(/\s/g, '');
          const displayNumber = bank.account_number || rawNumber;

          return (
            <div
              key={rawNumber || idx}
              className="bg-gradient-to-br from-[#2E0A10] via-[#380C14] to-[#24060B] p-5 rounded-2xl border border-[#D4AF37]/60 shadow-xl relative overflow-hidden"
            >
              {/* Top Bank Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel text-base font-bold text-[#F5E296] tracking-wider uppercase">
                  {bank.bank_name || 'BANK'}
                </span>
                <span className="text-[9.5px] text-[#F5E296] font-mono tracking-widest uppercase bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 font-semibold">
                  TRANSFER
                </span>
              </div>

              {/* Label Nomor Rekening */}
              <p className="text-[10px] text-[#FAF6EE]/60 uppercase tracking-[0.18em] font-sans mt-3 mb-1.5 font-medium">
                Nomor Rekening
              </p>

              {/* Dedicated Account Number & Copy Box */}
              <div className="flex items-center justify-between gap-2 bg-[#1B0609]/75 px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/35 shadow-inner">
                <span className="font-mono text-base font-bold text-white tracking-[0.08em] select-all break-all">
                  {displayNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAccount(rawNumber, idx)}
                  className="px-3.5 py-1.5 rounded-lg gold-gradient-btn text-[#1B0609] text-xs font-sans font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm hover:brightness-105"
                  title="Salin Nomor Rekening"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>Salin</span>
                </button>
              </div>

              {/* Account Holder Name */}
              <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-xs font-sans">
                <span className="material-symbols-outlined text-[15px] text-[#D4AF37] shrink-0">
                  person
                </span>
                <span className="text-[#FAF6EE]/65">a.n.</span>
                <span className="font-semibold text-[#F5E296] break-words [overflow-wrap:anywhere]">
                  {bank.account_holder || bank.holder_name || 'Mempelai'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Physical Gift Address Accordion */}
        {effectiveGiftAddress && (
          <details className="bg-[#2E0A10] rounded-2xl border border-[#D4AF37]/45 p-4 text-xs text-left group shadow-lg">
            <summary className="cursor-pointer font-sans font-semibold text-[#F5E296] flex items-center justify-between list-none select-none">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#D4AF37] shrink-0">
                  featured_seasonal_and_gifts
                </span>
                <span className="tracking-wide">Kirim Kado Fisik ke Alamat</span>
              </span>
              <span className="text-[#D4AF37] text-xs transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-3.5 pt-3.5 border-t border-[#D4AF37]/25 text-[#FAF6EE]/85 leading-relaxed font-sans">
              <p className="font-semibold text-white mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">home</span>
                <span>Rumah Kediaman Mempelai:</span>
              </p>
              <div className="bg-[#1B0609]/60 p-3 rounded-xl border border-[#D4AF37]/25 text-[#FAF6EE]/90 break-words [overflow-wrap:anywhere]">
                {effectiveGiftAddress}
              </div>
              <button
                type="button"
                onClick={() => handleCopyAddress(effectiveGiftAddress)}
                className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-[#1B0609] text-xs font-sans font-bold transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Salin Alamat Lengkap</span>
              </button>
            </div>
          </details>
        )}
      </div>
    </section>
  );
};

export default GiftSection;
