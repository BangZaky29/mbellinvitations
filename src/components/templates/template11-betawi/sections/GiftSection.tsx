import React, { useState } from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  TornPaperDivider,
  BetawiBatikWatermark,
  BetawiCornerFloral,
} from '../components';

interface GiftSectionProps {
  data: InvitationData;
  handleCopyAccount: (accountNumber: string, index: number) => void;
  handleCopyAddress: (address: string) => void;
  copiedAccountIndex?: number | null;
}

export const GiftSection: React.FC<GiftSectionProps> = ({
  data,
  handleCopyAccount,
  handleCopyAddress,
  copiedAccountIndex,
}) => {
  const [isGiftAddressOpen, setIsGiftAddressOpen] = useState(false);

  const fallbackAccounts = [
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '8420198221',
      account_holder: 'Muhammad Rizky Pratama',
      icon: 'account_balance',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '13700984432',
      account_holder: 'Siti Fatimah Azzahra',
      icon: 'account_balance',
    },
  ];

  const bankAccounts =
    data.bank_accounts && data.bank_accounts.length > 0
      ? data.bank_accounts
      : (data as any).banks && (data as any).banks.length > 0
      ? (data as any).banks
      : fallbackAccounts;

  const giftAddress =
    data.gift_address ||
    'Kediaman Keluarga H. Ahmad Marzuki, Jl. Teuku Cik Ditiro No. 45, Menteng, Jakarta Pusat 10310 (Konfirmasi kurir: +62 812-9988-7711)';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Torn Paper Transition (Ivory to Maroon) */}
      <TornPaperDivider direction="ivory-to-maroon" fillColor="#410403" />

      {/* AMPLOD DIGITAL (Maroon Canvas) */}
      <section className="relative w-full bg-[#410403] text-[#FAF6EE] px-4 pt-6 pb-8 flex flex-col items-center text-center overflow-hidden">
        {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark */}
        <BetawiBatikWatermark opacityClass="opacity-[0.06]" />

        <div className="w-10 h-10 rounded-full bg-[#FED65B]/20 text-[#FED65B] flex items-center justify-center mb-2 border border-[#FED65B]/30 z-10">
          <span className="material-symbols-outlined text-[20px]">
            card_giftcard
          </span>
        </div>
        <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#FED65B] uppercase mb-1 z-10">
          TANDA KASIH
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FCF9F3] mb-2 z-10">
          Amplop Digital
        </h2>
        <p className="font-serif text-xs text-[#E5E2DC]/80 max-w-[300px] mb-5 leading-relaxed z-10">
          Doa restu Anda merupakan karunia terindah bagi kami. Apabila berkenan memberikan tanda kasih, dapat disalurkan melalui:
        </p>

        {/* Bank Cards Container */}
        <div className="w-full max-w-[360px] flex flex-col gap-3 mb-4 z-10">
          {bankAccounts.map((acc: any, idx: number) => {
            const bankTitle = acc.bank_name || acc.name || 'Bank Transfer';
            const accNum = acc.account_number || acc.number || '';
            const accHolder = acc.account_holder || acc.holder || '';

            return (
              <div
                key={idx}
                className="w-full bg-white text-[#1C1C18] p-4 rounded-2xl shadow-lg border border-[#FED65B]/30 flex flex-col text-left relative overflow-hidden"
              >
                <BetawiCornerFloral position="top-left" className="absolute top-2 left-2 w-6 h-6 text-[#FED65B]/60" />
                <BetawiCornerFloral position="top-right" className="absolute top-2 right-2 w-6 h-6 text-[#FED65B]/60" />

                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-bold text-[#410403] uppercase tracking-wide break-words [overflow-wrap:anywhere]">
                    {bankTitle}
                  </span>
                  <span className="material-symbols-outlined text-[#735c00] shrink-0">
                    account_balance
                  </span>
                </div>

                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#410403] mb-0.5 break-words [overflow-wrap:anywhere]">
                  {accNum}
                </span>
                <span className="font-sans text-xs text-[#554240] mb-3 break-words [overflow-wrap:anywhere]">
                  a.n. {accHolder}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyAccount(accNum, idx)}
                  className="w-full py-2 rounded-full bg-[#F0EEE8] hover:bg-[#FED65B]/30 active:bg-[#FED65B] text-[#410403] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#E5E2DC]"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {copiedAccountIndex === idx ? 'done' : 'content_copy'}
                  </span>
                  <span>
                    {copiedAccountIndex === idx
                      ? 'Tersalin ke Clipboard!'
                      : 'Salin Nomor Rekening'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Physical Gift Address Accordion */}
        {giftAddress && (
          <div className="w-full max-w-[360px] bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-left p-3.5 transition-all overflow-hidden">
            <button
              type="button"
              onClick={() => setIsGiftAddressOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-left cursor-pointer text-[#FED65B]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] shrink-0">
                  home_pin
                </span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider truncate">
                  Kirim Kado Fisik (Kediaman Pengantin)
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] shrink-0 transition-transform">
                {isGiftAddressOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isGiftAddressOpen && (
              <div className="pt-3 border-t border-white/10 mt-2.5 flex flex-col gap-2">
                <p className="font-serif text-xs text-[#FAF6EE] leading-relaxed break-words [overflow-wrap:anywhere]">
                  {giftAddress}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyAddress(giftAddress)}
                  className="w-full py-2 rounded-full bg-[#FED65B] text-[#410403] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#FFE088] active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    content_copy
                  </span>
                  <span>Salin Alamat Lengkap</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default GiftSection;
