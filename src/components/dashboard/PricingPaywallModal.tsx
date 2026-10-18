import React, { useState } from 'react';
import {
  getTemplateDisplayName,
  getTemplateMeta,
  getTemplatePriceInfo,
} from '../../pages/dashboard/constants/themeMapping';
import { getInvitationFullUrl, getInvitationDisplayUrl } from '../../utils/urlHelper';

export interface PaymentDetails {
  themeId: string;
  paymentMethod: string;
  amount: number;
}

export interface PricingPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: (details: PaymentDetails) => Promise<void>;
  invitationSlug?: string;
  themeId?: string;
  coupleName?: string;
}

interface PaymentOption {
  id: 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va';
  name: string;
  badge: string;
  icon: string;
  description: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & Mobile Banking)',
    badge: 'Paling Populer',
    icon: 'qr_code_scanner',
    description: 'GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin, dll.',
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    badge: 'Verifikasi Otomatis',
    icon: 'account_balance',
    description: 'Transfer via m-BCA, KlikBCA, atau ATM BCA 24 jam.',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    badge: 'Verifikasi Otomatis',
    icon: 'credit_card',
    description: 'Transfer via Livin by Mandiri atau ATM Mandiri.',
  },
  {
    id: 'bri_va',
    name: 'BRI / BNI Virtual Account',
    badge: 'Verifikasi Otomatis',
    icon: 'account_balance_wallet',
    description: 'Transfer via BRImo, BNI Mobile, atau ATM bersama.',
  },
];

const INCLUDED_FEATURES = [
  'Masa Aktif Tautan Selamanya (Tanpa Langganan)',
  'Akses Penuh Seluruh Desain & Fitur Template',
  'Bebas Edit Teks, Foto & Jam Acara Kapan Saja',
  'Navigasi Peta Google Maps & Integrasi Kalender',
  'Amplop Digital & QRIS Hadiah (100% Tanpa Potongan)',
  'Buku Tamu & Ucapan Doa Realtime Tanpa Batas',
  'Pemutar Musik Latar (Lagu Pilihan / YouTube Audio)',
  'Generator WhatsApp Broadcast Tamu Terintegrasi',
];

export const PricingPaywallModal: React.FC<PricingPaywallModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  invitationSlug = 'undangan-baru',
  themeId = 'modern',
  coupleName = 'Mempelai Pengantin',
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca_va' | 'mandiri_va' | 'bri_va'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeThemeId = themeId || 'modern';
  const priceInfo = getTemplatePriceInfo(activeThemeId);
  const templateMeta = getTemplateMeta(activeThemeId);
  const templateName = getTemplateDisplayName(activeThemeId);
  const fullUrl = getInvitationFullUrl(invitationSlug);

  const handlePayAndPublish = async () => {
    setIsProcessing(true);
    try {
      // Mock simulasi auto-approve verifikasi pembayaran (~1.5 detik)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await onConfirmPublish({
        themeId: activeThemeId,
        paymentMethod,
        amount: priceInfo.price,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Terjadi kesalahan saat memproses aktivasi. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200 text-stone-900 my-auto overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 z-10"
          aria-label="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {isSuccess ? (
          /* SUCCESS STATE AFTER MOCK 1.5S APPROVAL */
          <div className="text-center py-6 sm:py-8 space-y-5 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider inline-block mb-2">
                Pembayaran Terverifikasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                🎉 Undangan Anda Resmi Live &amp; Aktif!
              </h2>
              <p className="text-stone-600 max-w-md mx-auto text-xs sm:text-sm leading-relaxed mt-2">
                Template <span className="font-bold text-stone-900">{templateName}</span> telah berhasil diaktifkan secara permanen. Tautan live siap disebarkan ke seluruh keluarga dan tamu undangan tercinta.
              </p>
            </div>

            {/* Public Link Card */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto flex items-center justify-between gap-3 text-left">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Tautan Aktif Publik
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-stone-900 truncate block select-all">
                  {fullUrl}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Salin Link Undangan"
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <a
                  href={`/${invitationSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Buka</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Selesai &amp; Kembali ke Editor
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT STATE */
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold tracking-wider uppercase mb-1.5">
                <span className="material-symbols-outlined text-[14px]">lock_open</span>
                <span>Beli Sekali • Aktif Selamanya</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Aktivasi &amp; Pembayaran Template
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm">
                Satu kali bayar per desain template. Tautan live aktif selamanya tanpa biaya langganan bulanan.
              </p>
            </div>

            {/* Template Selected Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-stone-50 to-stone-50 border border-amber-200/80 shadow-2xs">
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                    style={{ backgroundColor: templateMeta.accentColor }}
                  >
                    <span className="material-symbols-outlined text-2xl">{templateMeta.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {priceInfo.categoryLabel}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500">
                        {templateMeta.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 truncate">
                      {templateName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 bg-white/90 border border-amber-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
                  <span className="text-xs text-stone-400 line-through">
                    {priceInfo.originalPriceDisplay}
                  </span>
                  <span className="text-base font-black text-amber-900">
                    {priceInfo.priceDisplay}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[15px] text-stone-400">favorite</span>
                  <span className="font-semibold text-stone-800 truncate">{coupleName}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-stone-500 truncate">
                  <span className="material-symbols-outlined text-[14px] text-amber-600">link</span>
                  <span>{getInvitationDisplayUrl(invitationSlug)}</span>
                </div>
              </div>
            </div>

            {/* All-in Included Features */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-2">
                Fasilitas &amp; Fitur Unggulan Termasuk:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                {INCLUDED_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[15px] shrink-0 font-bold">check_circle</span>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Pilih Metode Pembayaran Instan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{opt.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{opt.badge}</p>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-600 bg-amber-500 text-stone-950' : 'border-stone-300'
                      }`}>
                        {isSelected && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Breakdown */}
            <div className="p-3.5 rounded-2xl bg-stone-100/80 border border-stone-200/90 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Harga Normal Template:</span>
                <span className="line-through">{priceInfo.originalPriceDisplay}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-semibold">
                <span>Potongan Promo Terbatas:</span>
                <span>-Rp 40.000</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Biaya Transaksi / Layanan:</span>
                <span className="font-bold text-stone-800">Gratis (Rp 0)</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block leading-tight">Total Tagihan:</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Hemat Rp 40.000</span>
                </div>
                <span className="text-xl font-black text-amber-900">
                  {priceInfo.priceDisplay}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handlePayAndPublish}
                disabled={isProcessing}
                className="w-full sm:w-2/3 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Bayar &amp; Terbitkan Sekarang ({priceInfo.priceDisplay})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
