// ============================================================
// PRICING PAYWALL MODAL — Progressive Step-by-Step Checkout UI
// Step 1: Review Order & Paket Keunggulan (Compact)
// Step 2: Pilih Metode Pembayaran & Konfirmasi Tagihan
// Step 3: Instruksi Pembayaran (QRIS / VA) + Live Realtime Listener
// Step 4: Sukses & Tautan Undangan Resmi Aktif
// ============================================================

import React, { useState, useCallback, useRef } from 'react';
import {
  getTemplateDisplayName,
  getTemplateMeta,
  getTemplatePriceInfo,
} from '../../pages/dashboard/constants/themeMapping';
import { getInvitationFullUrl, getInvitationDisplayUrl } from '../../utils/urlHelper';
import {
  createChargeTransaction,
  formatRupiah,
  formatVaDisplay,
} from '../../services/paymentService';
import { usePaymentTransaction } from '../../hooks/usePaymentTransaction';
import type {
  PaymentMethod,
  CheckoutStep,
  ChargeResult,
} from '../../types/transaction';
import { PAYMENT_METHOD_OPTIONS } from '../../types/transaction';

// =========================================================================
// PROPS & CONSTANTS
// =========================================================================

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
  invitationId?: string;
  themeId?: string;
  coupleName?: string;
  userId?: string | null;
}

const INCLUDED_FEATURES = [
  'Masa Aktif Tautan Selamanya (Tanpa Langganan)',
  'Amplop Digital & QRIS Hadiah (100% Tanpa Potongan)',
  'Bebas Edit Teks, Foto & Jam Acara Kapan Saja',
  'Buku Tamu & Ucapan Doa Realtime Tanpa Batas',
  'Akses Penuh Seluruh Desain & Fitur Template',
  'Navigasi Peta Google Maps & Integrasi Kalender',
  'Pemutar Musik Latar (Lagu Pilihan / YouTube Audio)',
  'Generator WhatsApp Broadcast Tamu Terintegrasi',
];

/** Instruksi m-Banking per bank (singkat) */
const VA_INSTRUCTIONS: Record<string, string[]> = {
  BCA: [
    'Buka aplikasi m-BCA / BCA Mobile',
    'Pilih menu "Transfer" → "BCA Virtual Account"',
    'Masukkan Nomor VA lalu konfirmasi jumlah',
    'Masukkan PIN dan selesaikan pembayaran',
  ],
  BNI: [
    'Buka aplikasi BNI Mobile Banking',
    'Pilih menu "Transfer" → "Virtual Account Billing"',
    'Masukkan Nomor VA dan konfirmasi nominal',
    'Masukkan password transaksi',
  ],
  BRI: [
    'Buka aplikasi BRImo',
    'Pilih menu "Transfer" → "BRIVA"',
    'Masukkan Nomor VA dan konfirmasi',
    'Masukkan PIN untuk menyelesaikan',
  ],
  Mandiri: [
    'Buka aplikasi Livin\' by Mandiri',
    'Pilih menu "Bayar" → "Multipayment"',
    'Masukkan Biller Code & Bill Key',
    'Konfirmasi dan masukkan PIN',
  ],
};

// =========================================================================
// MODAL COMPONENT
// =========================================================================

export const PricingPaywallModal: React.FC<PricingPaywallModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  invitationSlug = 'undangan-baru',
  invitationId = '',
  themeId = 'modern',
  coupleName = 'Mempelai Pengantin',
  userId = null,
}) => {
  // ── Progressive Step State ──
  const [step, setStep] = useState<CheckoutStep>('review_order');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [chargeResult, setChargeResult] = useState<ChargeResult | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // ── Anti Double-Click Protection & Race-Condition Guards ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);
  const hasConfirmedPublishRef = useRef(false);

  // ── UI State ──
  const [copiedVa, setCopiedVa] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVaInstructions, setShowVaInstructions] = useState(false);

  const activeThemeId = themeId || 'modern';
  const priceInfo = getTemplatePriceInfo(activeThemeId);
  const templateMeta = getTemplateMeta(activeThemeId);
  const templateName = getTemplateDisplayName(activeThemeId);
  const fullUrl = getInvitationFullUrl(invitationSlug);

  // Helper trigger publish dengan proteksi idempotency
  const triggerConfirmPublish = useCallback(async () => {
    if (hasConfirmedPublishRef.current) return;
    hasConfirmedPublishRef.current = true;
    try {
      await onConfirmPublish({
        themeId: activeThemeId,
        paymentMethod,
        amount: priceInfo.price,
      });
    } catch (err) {
      console.warn('onConfirmPublish error:', err);
    }
  }, [activeThemeId, paymentMethod, priceInfo.price, onConfirmPublish]);

  // ── Realtime Hook ──
  const {
    isPaid,
    isExpired,
    countdown,
    progressPercent,
    isRefreshing,
    startListening,
    stopListening,
    refreshStatus,
  } = usePaymentTransaction({
    onPaymentSuccess: async () => {
      await triggerConfirmPublish();
      setStep('success');
    },
    onExpired: () => {
      // Tetap di Step 3, tampilkan status expired
    },
  });

  if (!isOpen) return null;

  // ── Helpers ──
  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2500);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      stopListening();
      setStep('review_order');
      setChargeResult(null);
      setIsSubmitting(false);
      submitLockRef.current = false;
      hasConfirmedPublishRef.current = false;
      setShowAllFeatures(false);
      onClose();
    }
  };

  // ═══════════════════════════════════════════════════════════
  // STEP 2 → STEP 3: Buat Tagihan Pembayaran
  // ═══════════════════════════════════════════════════════════
  const handleCreateCharge = async () => {
    if (submitLockRef.current || isSubmitting) return;
    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await createChargeTransaction({
        userId,
        invitationId,
        invitationSlug,
        templateId: activeThemeId,
        amount: priceInfo.price,
        paymentMethod,
      });

      setChargeResult(result);
      setStep('waiting_payment');

      // Mulai realtime listener + live countdown
      startListening(result.orderId, result.expiryTime);
    } catch (err: any) {
      console.error('❌ handleCreateCharge error:', err);
      alert('Gagal membuat tagihan pembayaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // STEP 3 ← Kembali ke Step 2 (Ganti Metode)
  // ═══════════════════════════════════════════════════════════
  const handleBackToSelectMethod = () => {
    stopListening();
    setChargeResult(null);
    hasConfirmedPublishRef.current = false;
    setStep('select_method');
  };

  // ═══════════════════════════════════════════════════════════
  // Download QR Code
  // ═══════════════════════════════════════════════════════════
  const handleDownloadQr = async () => {
    if (!chargeResult?.qrCodeUrl) return;
    try {
      const response = await fetch(chargeResult.qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-${chargeResult.orderId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download QR error:', err);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-stone-200 text-stone-900 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        {/* ── Progressive Stepper Bar & Close Header ── */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-100 shrink-0">
          {/* Stepper Steps */}
          <div className="flex items-center flex-1 max-w-sm justify-between">
            {/* Step 1: Paket */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'review_order'
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400/40 shadow-xs'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {step === 'review_order' ? '1' : '✓'}
              </div>
              <span className={`text-xs font-semibold ${step === 'review_order' ? 'text-stone-900' : 'text-stone-500'}`}>
                Paket
              </span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 min-w-[12px] transition-colors ${step !== 'review_order' ? 'bg-emerald-500' : 'bg-stone-200'}`} />

            {/* Step 2: Pembayaran */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'select_method' || step === 'waiting_payment'
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400/40 shadow-xs'
                    : step === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {step === 'success' ? '✓' : '2'}
              </div>
              <span
                className={`text-xs font-semibold ${
                  step === 'select_method' || step === 'waiting_payment'
                    ? 'text-stone-900'
                    : 'text-stone-500'
                }`}
              >
                Bayar
              </span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 min-w-[12px] transition-colors ${step === 'success' ? 'bg-emerald-500' : 'bg-stone-200'}`} />

            {/* Step 3: Selesai */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'success'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40 shadow-xs'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                3
              </div>
              <span className={`text-xs font-semibold ${step === 'success' ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                Aktif
              </span>
            </div>
          </div>

          {/* Close Button — in-flow with flex layout to prevent overlap */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0 ml-1"
            aria-label="Tutup Modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ── Scrollable Body Content ── */}
        <div className="overflow-y-auto pr-0.5 space-y-4 flex-1">
          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 1: Review Order & Keunggulan Template      */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'review_order' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tracking-wider uppercase mb-1">
                  <span className="material-symbols-outlined text-[13px]">lock_open</span>
                  <span>Beli Sekali • Aktif Selamanya</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Aktivasi Desain Template
                </h2>
                <p className="text-stone-500 text-xs">
                  Satu kali bayar per desain. Tautan live aktif selamanya tanpa biaya langganan bulanan.
                </p>
              </div>

              {/* Compact Template Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-stone-50 to-stone-50 border border-amber-200/80 shadow-2xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                      style={{ backgroundColor: templateMeta.accentColor }}
                    >
                      <span className="material-symbols-outlined text-xl">{templateMeta.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          {priceInfo.categoryLabel}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium truncate">
                          {templateMeta.tag}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                        {templateName}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-white/95 border border-amber-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-stone-400 line-through block leading-tight">
                      {priceInfo.originalPriceDisplay}
                    </span>
                    <span className="text-sm sm:text-base font-black text-amber-900">
                      {priceInfo.priceDisplay}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex items-center justify-between gap-2 text-[11px] text-stone-600">
                  <span className="font-semibold text-stone-800 truncate">💑 {coupleName}</span>
                  <span className="font-mono text-stone-500 text-[10px] truncate">
                    {getInvitationDisplayUrl(invitationSlug)}
                  </span>
                </div>
              </div>

              {/* Fasilitas & Fitur - Progressive Accordion */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Fasilitas &amp; Fitur Unggulan Termasuk:
                </span>
                <div className="grid grid-cols-1 gap-1 text-xs text-stone-700">
                  {(showAllFeatures ? INCLUDED_FEATURES : INCLUDED_FEATURES.slice(0, 3)).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[15px] shrink-0 font-bold">check_circle</span>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-2 text-[11px] font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{showAllFeatures ? 'Sembunyikan' : `+ Lihat ${INCLUDED_FEATURES.length - 3} Fasilitas Lainnya`}</span>
                  <span className={`material-symbols-outlined text-xs transition-transform ${showAllFeatures ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
              </div>

              {/* Total Summary Mini */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <div>
                  <span className="font-bold text-stone-800 block">Total Tagihan:</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Hemat {formatRupiah(priceInfo.originalPrice - priceInfo.price)}
                  </span>
                </div>
                <span className="text-lg font-black text-amber-900">{priceInfo.priceDisplay}</span>
              </div>

              {/* CTA Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/3 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => setStep('select_method')}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Pilih Cara Bayar</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 2: Pilih Metode Pembayaran                */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'select_method' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Header */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Pilih Metode Pembayaran Instan
                </h2>
                <p className="text-stone-500 text-xs">
                  Verifikasi otomatis &amp; aman sesuai standar Bank Indonesia.
                </p>
              </div>

              {/* Mini Order Strip */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-stone-800 truncate">{templateName}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-mono text-[10px] truncate">{getInvitationDisplayUrl(invitationSlug)}</span>
                </div>
                <span className="font-black text-amber-900 shrink-0">{priceInfo.priceDisplay}</span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                {PAYMENT_METHOD_OPTIONS.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => !isSubmitting && setPaymentMethod(opt.id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/40 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      } ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{opt.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{opt.badge}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-600 bg-amber-500 text-stone-950' : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact Fee Summary */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                <span>Biaya Layanan: <strong className="text-emerald-700">Gratis (Rp 0)</strong></span>
                <span>Total: <strong className="text-amber-900 text-sm font-black">{priceInfo.priceDisplay}</strong></span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('review_order')}
                  disabled={isSubmitting}
                  className="w-1/3 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer text-center disabled:opacity-50"
                >
                  ← Detail
                </button>
                <button
                  type="button"
                  onClick={handleCreateCharge}
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Membuat Tagihan...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      <span>Buat Tagihan ({priceInfo.priceDisplay})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 3: Instruksi Pembayaran (QRIS / VA)        */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'waiting_payment' && chargeResult && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Header: Order ID, Total, Countdown */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-[10px] font-bold font-mono tracking-wider">
                    {chargeResult.orderId}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Total: {priceInfo.priceDisplay}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  {paymentMethod === 'qris'
                    ? 'Scan Kode QR untuk Membayar'
                    : `Transfer ke ${chargeResult.bankName || 'Virtual Account'}`}
                </h2>

                {/* Countdown Timer */}
                {!isPaid && !isExpired && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                      <span className="flex items-center gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        <span>Bayar sebelum batas waktu</span>
                      </span>
                      <span
                        className={`font-mono font-bold text-xs sm:text-sm ${
                          parseInt(countdown) <= 5 ? 'text-red-600 animate-pulse' : 'text-stone-900'
                        }`}
                      >
                        {countdown}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                          progressPercent > 30 ? 'bg-amber-500' : progressPercent > 10 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Expired State */}
                {isExpired && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-center">
                    <span className="material-symbols-outlined text-red-500 text-2xl block mb-0.5">schedule</span>
                    <p className="text-xs font-bold text-red-800">Waktu Pembayaran Habis</p>
                    <p className="text-[10px] text-red-600 mt-0.5">Silakan buat tagihan baru dengan tombol di bawah.</p>
                  </div>
                )}
              </div>

              {/* ──── QRIS Card (Compact) ──── */}
              {paymentMethod === 'qris' && !isExpired && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white to-stone-50 border-2 border-stone-200 shadow-sm text-center">
                  {/* QR Code Image */}
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto bg-white rounded-xl border border-stone-200 p-2 shadow-inner mb-2.5">
                    <img
                      src={chargeResult.qrCodeUrl}
                      alt={`QR Code ${chargeResult.orderId}`}
                      className="w-full h-full object-contain"
                      loading="eager"
                    />
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[9px] font-bold whitespace-nowrap shadow-sm">
                      Mbell Invitations
                    </div>
                  </div>

                  {/* Download QR Button */}
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Unduh Kode QR</span>
                  </button>

                  {/* Supported e-wallets */}
                  <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-center gap-1 flex-wrap">
                    {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'BCA Mobile', 'Livin\'', 'BRImo'].map((name) => (
                      <span key={name} className="px-1.5 py-0.2 rounded-md bg-stone-100 text-[9px] font-semibold text-stone-500">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ──── Virtual Account Card (Compact) ──── */}
              {paymentMethod !== 'qris' && !isExpired && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white to-stone-50 border-2 border-stone-200 shadow-sm space-y-2.5">
                  {/* Bank Header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">account_balance</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-stone-900">{chargeResult.bankName} Virtual Account</p>
                      <p className="text-[10px] text-stone-500">Transfer tepat sesuai nominal</p>
                    </div>
                  </div>

                  {/* VA Number */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      {paymentMethod === 'mandiri_va' ? 'Bill Key' : 'Nomor Virtual Account'}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base sm:text-lg font-black text-stone-900 font-mono tracking-wider select-all">
                        {formatVaDisplay(chargeResult.vaNumber || chargeResult.billKey || '')}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(chargeResult.vaNumber || chargeResult.billKey || '', setCopiedVa)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-xs">{copiedVa ? 'check' : 'content_copy'}</span>
                        <span>{copiedVa ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                    {paymentMethod === 'mandiri_va' && chargeResult.billerCode && (
                      <div className="mt-2 pt-2 border-t border-stone-200">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">Biller Code</span>
                        <span className="text-xs font-bold text-stone-800 font-mono select-all">{chargeResult.billerCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Nominal */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                      Nominal Transfer (Harus Persis)
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-black text-amber-900 font-mono">{formatRupiah(priceInfo.price)}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(priceInfo.price.toString(), setCopiedAmount)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 text-amber-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-xs">{copiedAmount ? 'check' : 'content_copy'}</span>
                        <span>{copiedAmount ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Accordion Instruksi */}
                  <div className="rounded-xl border border-stone-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowVaInstructions(!showVaInstructions)}
                      className="w-full px-3 py-2 flex items-center justify-between bg-white hover:bg-stone-50 transition-colors cursor-pointer text-left text-xs font-bold text-stone-700"
                    >
                      <span>Petunjuk Pembayaran {chargeResult.bankName}</span>
                      <span className={`material-symbols-outlined text-xs text-stone-400 transition-transform ${showVaInstructions ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {showVaInstructions && (
                      <div className="px-3 pb-2.5 pt-1 bg-stone-50 border-t border-stone-200">
                        <ol className="space-y-1 text-[10px] text-stone-600">
                          {(VA_INSTRUCTIONS[chargeResult.bankName || 'BCA'] || VA_INSTRUCTIONS.BCA).map((instruction, idx) => (
                            <li key={idx} className="flex gap-1.5">
                              <span className="w-3.5 h-3.5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ──── Action Buttons Step 3 ──── */}
              <div className="space-y-2 pt-1">
                {/* Cek Status Pembayaran (Tombol Utama) */}
                <button
                  type="button"
                  onClick={refreshStatus}
                  disabled={isRefreshing || isPaid}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRefreshing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengecek Status Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Cek Status Pembayaran</span>
                    </>
                  )}
                </button>

                {/* Back to Step 2 */}
                {!isPaid && (
                  <button
                    type="button"
                    onClick={handleBackToSelectMethod}
                    disabled={isSubmitting}
                    className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-700 font-medium transition-colors cursor-pointer disabled:opacity-50 text-center"
                  >
                    ← Ganti Metode Pembayaran
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 4: Pembayaran Berhasil & Undangan Aktif   */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-3.5 animate-fade-in">
              {/* Success Animation */}
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full bg-emerald-200/50 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                  Pembayaran Terverifikasi
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  🎉 Undangan Anda Resmi Live!
                </h2>
                <p className="text-stone-600 max-w-sm mx-auto text-xs leading-relaxed mt-1">
                  Template <span className="font-bold text-stone-900">{templateName}</span> telah aktif permanen dan siap disebarkan ke seluruh tamu undangan.
                </p>
              </div>

              {/* Template Purchased Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>✓ Sudah Dibeli — {templateName}</span>
              </div>

              {/* Public Link Card */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 max-w-sm mx-auto flex items-center justify-between gap-2.5 text-left">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">
                    Tautan Aktif Publik
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-900 truncate block select-all">
                    {fullUrl}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fullUrl, setCopiedLink)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Salin Link"
                  >
                    <span className="material-symbols-outlined text-xs">{copiedLink ? 'check' : 'content_copy'}</span>
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                  <a
                    href={`/${invitationSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Buka</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Kembali ke Editor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    window.dispatchEvent(new CustomEvent('mbell_navigate_tab', { detail: { tab: 'guests' } }));
                  }}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  <span>Kelola Tamu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
