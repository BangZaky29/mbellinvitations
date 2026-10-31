import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { BugisCornerOrnament } from '../components';

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
  const bankAccounts =
    data.bank_accounts && data.bank_accounts.length > 0
      ? data.bank_accounts
      : data.banks && data.banks.length > 0
      ? data.banks
      : [
          {
            bank_name: 'Bank Mandiri',
            account_number: '1520098477121',
            account_holder: 'Andi Fauzan Pratama',
          },
          {
            bank_name: 'Bank Central Asia (BCA)',
            account_number: '7890334155',
            account_holder: 'Andi Tenri Olle',
          },
        ];

  const giftAddress = data.gift_address;

  return (
    <section className="relative w-full px-4 py-8 bg-[#00170E] text-[#C8EAD8] flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#052519] text-[#F2CA50] flex items-center justify-center mb-2 border border-[#F2CA50]/30 shadow-md">
          <span className="material-symbols-outlined text-[20px]">
            featured_seasonal_and_gifts
          </span>
        </div>
        <span className="font-sans text-[10px] text-[#F2CA50] tracking-[0.25em] uppercase font-bold">
          Tanda Kasih (Pabberre)
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#C8EAD8] font-bold mt-1">
          Amplop Digital &amp; Kado
        </h2>
        <p className="font-sans text-xs text-[#D7C594] mt-1 max-w-xs leading-relaxed">
          Doa restu Anda merupakan karunia terindah bagi kami. Apabila berkenan memberikan tanda kasih secara digital:
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Bank Account Cards */}
        {bankAccounts.map((acc: any, idx: number) => {
          const isCopied = copiedAccountIndex === idx;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#052519]/85 backdrop-blur-md border border-[#F2CA50]/25 shadow-md flex flex-col relative overflow-hidden"
            >
              <BugisCornerOrnament position="top-left" className="absolute top-1 left-1 w-4 h-4 text-[#F2CA50]/25" />
              <BugisCornerOrnament position="top-right" className="absolute top-1 right-1 w-4 h-4 text-[#F2CA50]/25" />

              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-bold text-[#F2CA50] tracking-wider uppercase">
                  {acc.bank_name || 'Transfer Bank'}
                </span>
                <span className="material-symbols-outlined text-[#F2CA50] text-[20px]">
                  account_balance
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-base sm:text-lg text-[#C8EAD8] tracking-widest font-bold select-all block break-words [overflow-wrap:anywhere]">
                    {acc.account_number}
                  </span>
                  <span className="font-sans text-[11px] text-[#D0C5AF]/90 block mt-0.5">
                    a.n. {acc.account_holder}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAccount(acc.account_number, idx)}
                  className={`py-1.5 px-3 rounded-lg font-sans text-xs uppercase font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#F2CA50] text-[#00170E] hover:bg-[#FFE088]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isCopied ? 'check' : 'content_copy'}
                  </span>
                  <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Physical Gift Delivery Address */}
        {giftAddress && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#052519]/85 backdrop-blur-md border border-[#F2CA50]/25 shadow-md flex flex-col relative overflow-hidden">
            <BugisCornerOrnament position="top-left" className="absolute top-1 left-1 w-4 h-4 text-[#F2CA50]/25" />
            <BugisCornerOrnament position="top-right" className="absolute top-1 right-1 w-4 h-4 text-[#F2CA50]/25" />

            <div className="flex items-center gap-2 text-[#F2CA50] mb-2">
              <span className="material-symbols-outlined text-[20px]">
                local_shipping
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider">
                Kirim Kado Fisik
              </span>
            </div>

            <p className="font-sans text-xs text-[#D0C5AF] leading-relaxed break-words [overflow-wrap:anywhere] mt-1 mb-3">
              {giftAddress}
            </p>

            <button
              type="button"
              onClick={() => handleCopyAddress(giftAddress)}
              className="w-full py-2 px-3 rounded-lg bg-[#00120A] border border-[#F2CA50]/30 text-[#F2CA50] font-sans text-xs uppercase font-semibold flex items-center justify-center gap-1.5 hover:bg-black/40 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                content_copy
              </span>
              <span>Salin Alamat Kado</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

