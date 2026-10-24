import React, { useState } from 'react';
import type { InvitationData } from '../../../../types/invitation';

interface GiftSectionProps {
  data: InvitationData;
  handleCopyAccount: (accNum: string, index: number) => void;
  handleCopyAddress: (address: string) => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({
  data,
  handleCopyAccount,
  handleCopyAddress,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const defaultBanks = [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1370 0192 8472 1',
      account_holder: data.groom?.full_name || 'Johannes Parlindungan Siregar',
      account_number_raw: '1370019284721',
    },
    {
      bank_name: 'Bank BCA',
      account_number: '5420 8819 23',
      account_holder: data.bride?.full_name || 'Melisa Yohana Simanjuntak',
      account_number_raw: '5420881923',
    },
  ];

  const rawBanks =
    data.banks && data.banks.length > 0
      ? data.banks
      : data.bank_accounts && data.bank_accounts.length > 0
      ? data.bank_accounts
      : defaultBanks;

  const banks = rawBanks;

  const onCopy = (num: string, idx: number, key: string) => {
    handleCopyAccount(num, idx);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const giftAddress =
    data.gift_address ||
    'Kediaman Keluarga Siregar: Jl. Patra Kuningan VII No. 14, RT 06/RW 04, Kuningan Timur, Setiabudi, Jakarta Selatan 12950 (Penerima: Johannes Siregar / 0812-8899-7711)';

  return (
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1.5 text-[#EAC16E]">
        <span className="material-symbols-outlined text-[20px]">card_giftcard</span>
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
          Tanda Holong
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide text-center mb-2">
        Digital Gift &amp; Angpau
      </h2>

      <p className="font-sans text-xs text-[#D1C5B3] text-center max-w-[320px] mb-6 leading-relaxed">
        Doa restu Anda merupakan karunia terindah bagi kami. Bagi keluarga dan sahabat yang ingin memberikan tanda kasih:
      </p>

      {/* Bank Cards Container */}
      <div className="w-full max-w-[360px] flex flex-col gap-3 mb-4">
        {banks.map((bank, idx) => {
          const rawNum = bank.account_number_raw || bank.account_number.replace(/\s+/g, '');
          const isCopied = copiedKey === `bank-${idx}`;

          return (
            <div
              key={idx}
              className="bg-[#261E1A] rounded-xl p-4 flex flex-col gap-1.5 shadow-md border border-[#EAC16E]/20 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold text-[#EAC16E] tracking-wider uppercase">
                  {bank.bank_name}
                </span>
                <span className="font-sans text-[10px] text-[#D1C5B3]/80">
                  {idx === 0 ? 'Rekening Pengantin Pria' : 'Rekening Pengantin Wanita'}
                </span>
              </div>

              <p className="font-mono text-base sm:text-lg text-[#FAF6EE] tracking-wider font-semibold mt-1">
                {bank.account_number}
              </p>

              <p className="font-sans text-xs text-[#D1C5B3] break-words [overflow-wrap:anywhere]">
                a.n. {bank.account_holder}
              </p>

              <button
                type="button"
                onClick={() => onCopy(rawNum, idx, `bank-${idx}`)}
                className={`mt-2 py-2 px-3 rounded-lg font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#3C332E] text-[#EAC16E] hover:bg-[#4E4638]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isCopied ? 'check' : 'content_copy'}
                </span>
                <span>{isCopied ? 'Nomor Tersalin!' : 'Salin Nomor Rekening'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Kirim Kado Fisik Accordion */}
      {giftAddress && (
        <details className="w-full max-w-[360px] bg-[#261E1A] rounded-xl p-4 mb-3 shadow-md border border-[#EAC16E]/20 group">
          <summary className="font-sans text-xs text-[#EAC16E] font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer list-none">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Kirim Kado Fisik ke Alamat</span>
            </span>
            <span className="material-symbols-outlined transition-transform duration-200 group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="pt-3 mt-2 font-sans text-xs text-[#D1C5B3] leading-relaxed border-t border-[#EAC16E]/15">
            <p className="break-words [overflow-wrap:anywhere]">{giftAddress}</p>
            <button
              type="button"
              onClick={() => handleCopyAddress(giftAddress)}
              className="mt-3 py-2 px-3 rounded-lg bg-[#3C332E] text-[#EAC16E] hover:bg-[#4E4638] font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer w-full"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Salin Alamat Lengkap</span>
            </button>
          </div>
        </details>
      )}

      {/* QRIS Digital Payment jika diisi */}
      {data.qris_url && (
        <div className="w-full max-w-[360px] bg-[#261E1A] rounded-xl p-4 mb-2 flex flex-col items-center text-center shadow-md border border-[#EAC16E]/20">
          <span className="font-sans text-xs font-bold text-[#EAC16E] tracking-wider uppercase mb-2.5">
            QRIS Pembayaran Digital
          </span>
          <img
            src={data.qris_url}
            alt="QRIS Digital Gift"
            className="w-48 h-48 object-contain bg-white p-2 rounded-xl shadow-inner mb-2"
          />
          <p className="font-sans text-[11px] text-[#D1C5B3]">
            Pindai QRIS menggunakan BCA, Mandiri, GoPay, OVO, atau aplikasi mobile banking lainnya.
          </p>
        </div>
      )}
    </section>
  );
};
