import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
} from '../components';

interface GiftSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isSectionActive?: (section: string) => boolean;
  handleCopyAccount: (accountNumber: string, index: number) => void;
  handleCopyAddress: (addressText: string) => void;
  copiedAccountIndex?: number | null;
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

  if (!isGiftVisible) return null;

  // Banks array resolution
  const banksList = (data.banks && data.banks.length > 0)
    ? data.banks
    : (data.bank_accounts && data.bank_accounts.length > 0)
      ? data.bank_accounts.map((b) => ({
        bank_name: b.bank_name || 'Bank',
        account_number: b.account_number,
        account_holder: b.account_holder,
      }))
      : [
        {
          bank_name: 'Bank Central Asia (BCA)',
          account_number: '7720891204',
          account_holder: 'Anak Agung Bagus Arya Wiguna',
        },
        {
          bank_name: 'Bank Mandiri',
          account_number: '14500987721',
          account_holder: 'Sang Ayu Bulan Prameswari',
        },
      ];

  const giftAddress =
    data.gift_address ||
    'Puri Agung Ubud • Kediaman Bagus Arya & Ayu Bulan\nJl. Suweta No. 12, Ubud, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571\n(Konfirmasi penerima: +62 812-3456-7890)';

  return (
    <section className="relative w-full bg-[#F3EDE4] text-[#1D1B16] px-4 py-8 flex flex-col items-center overflow-hidden">
      {/* Patra Sari Watermark */}
      <BaliPatraWatermark opacityClass="opacity-[0.045]" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FFF9EF] border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-2 text-[#735C00] shadow-sm">
            <span className="material-symbols-outlined text-2xl">featured_seasonal_and_gifts</span>
          </div>
          <span className="font-sans text-[10px] text-[#735C00] uppercase tracking-[0.2em] font-bold">
            Tanda Kasih
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#411710] mt-1">
            Amplop Digital
          </h3>
          <p className="font-sans text-xs text-[#524341] mt-1.5 max-w-[310px] mx-auto leading-relaxed">
            Doa restu Anda adalah karunia paling bernilai. Jika hendak menyampaikan tanda kasih tanpa tunai:
          </p>
          <CandiBentarDivider compact className="mt-2" />
        </div>

        {/* Bank Accounts List */}
        <div className="w-full space-y-3 mb-5">
          {banksList.map((acc, idx) => (
            <div
              key={idx}
              className="relative bg-[#FFF9EF] border border-[#D4AF37]/40 p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 overflow-hidden"
            >
              <BaliCornerFiligree position="top-left" className="absolute top-0.5 left-0.5 w-4 h-4" color="#D4AF37" />
              <BaliCornerFiligree position="bottom-right" className="absolute bottom-0.5 right-0.5 w-4 h-4" color="#D4AF37" />

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-sans text-[10px] text-[#735C00] font-bold tracking-wider uppercase truncate">
                  {acc.bank_name}
                </span>
                <span className="font-serif text-base sm:text-lg text-[#411710] font-bold tracking-wider mt-0.5 truncate">
                  {acc.account_number}
                </span>
                <span className="font-sans text-[11px] text-[#524341] truncate">
                  a.n. {acc.account_holder}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyAccount(acc.account_number, idx)}
                className="px-3.5 py-1.5 bg-[#F3EDE4] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#411710] font-sans text-xs font-semibold rounded-lg shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedAccountIndex === idx ? 'check' : 'content_copy'}
                </span>
                <span>{copiedAccountIndex === idx ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Collapsible / Expandable Physical Gift Address */}
        {giftAddress && (
          <details className="relative w-full bg-[#FFF9EF] border border-[#D4AF37]/40 rounded-xl p-4 shadow-sm group overflow-hidden">
            <BaliCornerFiligree position="top-left" className="absolute top-0.5 left-0.5 w-4 h-4" color="#D4AF37" />
            <summary className="flex items-center justify-between cursor-pointer list-none select-none">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#735C00] text-lg">local_shipping</span>
                <span className="font-sans text-xs text-[#411710] font-bold uppercase tracking-wider">
                  Kirim Kado Fisik (Alamat Kediaman)
                </span>
              </div>
              <span className="material-symbols-outlined text-[#857370] text-lg group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>

            <div className="pt-3 mt-2 text-[#524341] font-sans text-xs border-t border-[#D7C2BE]/40 leading-relaxed">
              <p className="whitespace-pre-line break-words [overflow-wrap:anywhere]">
                {giftAddress}
              </p>
              <button
                type="button"
                onClick={() => handleCopyAddress(giftAddress)}
                className="mt-3 w-full py-2 px-3 rounded-lg bg-[#F3EDE4] border border-[#D4AF37]/40 text-[#411710] font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Salin Alamat Lengkap</span>
              </button>
            </div>
          </details>
        )}
      </div>
    </section>
  );
};
