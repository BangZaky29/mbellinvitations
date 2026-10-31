import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  PalembangCornerFiligree,
  PalembangSongketWatermark,
} from '../components';

interface GiftSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
  handleCopyAccount: (accountNumber: string, index: number) => void;
  handleCopyAddress?: (address: string) => void;
  copiedAccountIndex: number | null;
}

export const GiftSection: React.FC<GiftSectionProps> = ({
  data,
  theme,
  isSectionActive,
  handleCopyAccount,
  handleCopyAddress,
  copiedAccountIndex,
}) => {
  const effectiveTheme = theme || data.theme_config;

  const isGiftVisible = isSectionActive
    ? isSectionActive('gift')
    : effectiveTheme?.show_gift !== false &&
    (!effectiveTheme?.active_sections ||
      effectiveTheme.active_sections.includes('gift'));

  const bankAccounts = data.bank_accounts || data.banks || [];
  const giftAddress = data.gift_address;

  if (!isGiftVisible) return null;

  return (
    <section className="relative w-full shrink-0 bg-[#4A0E12] text-[#FDF9F2] px-4 pt-10 pb-12 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.07]" showPucukBorders />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Digital Envelope Card */}
        <div className="w-full bg-[#2A0003]/90 border border-[#FFD57A]/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden mb-6">
          <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 opacity-70" color="#FFD57A" />

          <div className="flex items-center gap-2 mb-2 text-[#FFD57A]">
            <span className="material-symbols-outlined text-[20px]">card_giftcard</span>
            <span className="font-sans text-[10px] tracking-widest uppercase font-bold">
              Tanda Kasih Digital
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#FDF9F2] font-bold">
            Amplop Digital &amp; Bingkisan
          </h3>
          <p className="font-sans text-xs text-[#F1EDE6]/80 mt-1 mb-5 leading-relaxed">
            Doa restu sanak keluarga adalah anugerah terindah. Apabila hendak memberikan tanda kasih, dapat disalurkan melalui:
          </p>

          {/* Bank Accounts List */}
          <div className="space-y-3">
            {bankAccounts.map((account, idx) => {
              const isCopied = copiedAccountIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] text-[#1C1C18] rounded-xl p-3.5 shadow-md flex items-center justify-between border border-[#FFD57A]/40"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-sans text-[10px] text-[#785A05] tracking-widest uppercase font-bold block">
                      {account.bank_name}
                    </span>
                    <p className="font-mono text-sm sm:text-base font-bold tracking-wider text-[#4A0E12]">
                      {account.account_number}
                    </p>
                    <span className="font-sans text-xs text-[#544342] truncate block">
                      a.n. {account.account_holder}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyAccount(account.account_number, idx)}
                    className="p-2.5 rounded-full bg-[#F7F3EC] text-[#4A0E12] hover:bg-[#FFD57A] transition-colors shrink-0 border border-[#FFD57A]/50 cursor-pointer shadow-sm active:scale-95"
                    title="Salin Nomor Rekening"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isCopied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Physical Gift Address Note */}
          {giftAddress && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#4A0E12]/80 border border-[#FFD57A]/30 text-[#F1EDE6] text-xs font-sans flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#FFD57A] shrink-0 mt-0.5">
                inventory_2
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[#FFD57A] font-bold block mb-0.5 uppercase text-[10px] tracking-wider">
                  Kirim Kado Fisik
                </span>
                <p className="text-[11.5px] leading-relaxed whitespace-pre-line text-[#FDF9F2]/90">
                  {giftAddress}
                </p>
                {handleCopyAddress && (
                  <button
                    type="button"
                    onClick={() => handleCopyAddress(giftAddress)}
                    className="mt-2 text-[10px] font-bold text-[#FFD57A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">content_copy</span>
                    <span>Salin Alamat Kado</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Digital VIP Guest Pass (Exclusive Palembang Feature) */}
        <div className="w-full bg-gradient-to-br from-[#FFD57A] via-[#EAC168] to-[#785A05] p-0.5 rounded-2xl shadow-xl">
          <div className="bg-[#2A0003] rounded-[14px] p-5 text-[#FDF9F2] flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 text-[#FFD57A] font-sans text-[10px] uppercase tracking-widest mb-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Digital VIP Invitation Pass</span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#FDF9F2] tracking-wide">
              TAMU KEHORMATAN VIP
            </h4>
            <div className="w-12 h-px bg-[#FFD57A]/40 my-2" />
            <p className="font-sans text-xs text-[#F1EDE6]/90">
              Meja Reservasi Khusus:<br />
              <strong className="text-[#FFD57A] font-serif text-sm tracking-wide">
                MEJA RADEN ARYA • T-01
              </strong>
            </p>

            {/* Mock Barcode Strip */}
            <div className="bg-[#FFFFFF] text-[#1C1C18] px-4 py-2 rounded-lg mt-3 flex flex-col items-center w-full max-w-[220px] shadow-sm">
              <div className="flex items-center justify-center gap-1 h-7 w-full overflow-hidden">
                <span className="w-1 h-full bg-black" />
                <span className="w-0.5 h-full bg-black" />
                <span className="w-2 h-full bg-black" />
                <span className="w-1.5 h-full bg-black" />
                <span className="w-0.5 h-full bg-black" />
                <span className="w-1 h-full bg-black" />
                <span className="w-2.5 h-full bg-black" />
                <span className="w-1 h-full bg-black" />
                <span className="w-0.5 h-full bg-black" />
                <span className="w-1.5 h-full bg-black" />
                <span className="w-2 h-full bg-black" />
                <span className="w-0.5 h-full bg-black" />
                <span className="w-1 h-full bg-black" />
              </div>
              <span className="font-mono text-[9px] tracking-widest mt-1 text-stone-600 font-bold">
                SWJ-2026-VIP-0089
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

