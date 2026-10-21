import React from 'react';
import type { BaseSectionProps } from '../../types';
import { MOCK_SUNDA_DATA } from '../../../../data/mock/sundaData';

export interface SundaGiftProps extends BaseSectionProps {
  handleCopyAccount: (accNum: string, index: number) => void;
  handleCopyAddress: (addr: string) => void;
}

export const GiftSection: React.FC<SundaGiftProps> = ({
  data,
  isPreview,
  handleCopyAccount,
  handleCopyAddress,
}) => {
  return (
    <section
      className="w-full px-5 py-12 bg-[#f7f4ed] flex flex-col items-center"
      id="kado"
    >
      <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase text-center block mb-1">
        Tanda Kasih
      </span>
      <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2 text-center">
        Amplop Digital
      </h2>
      <p className="text-xs text-[#4e4639] text-center max-w-xs mb-6 leading-relaxed">
        Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberi tanda kasih, kami menyediakan dompet digital berikut:
      </p>

      {/* Bank Account Cards (Regal Gold & Obsidian Gold) */}
      {(() => {
        const effectiveBanks =
          data.banks && data.banks.length > 0
            ? data.banks
            : data.bank_accounts && data.bank_accounts.length > 0
            ? data.bank_accounts
            : isPreview
            ? MOCK_SUNDA_DATA.bank_accounts || MOCK_SUNDA_DATA.banks || []
            : [];

        if (!effectiveBanks || effectiveBanks.length === 0) return null;

        return (
          <div className="w-full max-w-sm flex flex-col gap-4 mb-6">
            {effectiveBanks.map((bank: any, index: number) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={bank.account_number || index}
                  className={`w-full rounded-3xl p-6 shadow-xl relative overflow-hidden text-left transition-all duration-300 ${
                    isEven
                      ? 'bg-gradient-to-br from-[#c5a059] via-[#ad8633] to-[#775a19] text-white shadow-amber-900/10'
                      : 'bg-gradient-to-br from-[#2c241c] via-[#1e1915] to-[#120f0d] text-[#eed08a] border border-[#c5a059]/40 shadow-stone-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-[17px] font-bold tracking-wider font-serif ${
                        isEven ? 'text-white' : 'text-[#f5dfa8]'
                      }`}
                    >
                      {bank.bank_name}
                    </span>
                    <div
                      className={`w-9 h-6 rounded-md flex items-center justify-center ${
                        isEven ? 'bg-white/20 text-white' : 'bg-[#c5a059]/20 text-[#c5a059]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">memory</span>
                    </div>
                  </div>
                  <p className="text-[19px] font-mono tracking-widest mb-1 font-semibold">
                    {bank.account_number}
                  </p>
                  <span
                    className={`text-[11px] uppercase tracking-wider block mb-4 font-semibold ${
                      isEven ? 'text-white/80' : 'text-[#eed08a]/80'
                    }`}
                  >
                    a.n {bank.account_holder}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyAccount(bank.account_number_raw || bank.account_number, index)
                    }
                    className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer ${
                      isEven
                        ? 'bg-white text-[#775a19] hover:bg-[#fbf9f6]'
                        : 'bg-[#c5a059] text-stone-950 hover:bg-[#d8b56d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Salin No. Rekening</span>
                  </button>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Physical Gift Address */}
      {(() => {
        const effectiveAddress = data.gift_address || (isPreview ? MOCK_SUNDA_DATA.gift_address : '');
        if (!effectiveAddress) return null;

        return (
          <div className="w-full max-w-sm rounded-3xl p-5 bg-white shadow-md flex flex-col items-center text-center border border-[#c5a059]/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-[#f4efe4] text-[#8a6822] flex items-center justify-center mb-2 border border-[#c5a059]/30">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <h4 className="text-[16px] text-[#1b1c1a] font-serif font-bold mb-1">
              Kirim Kado Fisik
            </h4>
            <p className="text-xs text-[#4e4639] mb-3 leading-relaxed break-words [overflow-wrap:anywhere]">
              {effectiveAddress}
            </p>
            <button
              type="button"
              onClick={() => handleCopyAddress(effectiveAddress)}
              className="px-5 py-2 rounded-full bg-[#fbf9f6] hover:bg-[#f4efe4] text-[#1b1c1a] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#c5a059]/30"
            >
              <span className="material-symbols-outlined text-[16px]">file_copy</span>
              <span>Salin Alamat</span>
            </button>
          </div>
        );
      })()}
    </section>
  );
};

export default GiftSection;
