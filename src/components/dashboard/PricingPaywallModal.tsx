import React, { useState } from 'react';

export interface PlanOption {
  id: string;
  name: string;
  badge?: string;
  priceDisplay: string;
  priceNumber: number;
  duration: string;
  isPopular?: boolean;
  features: string[];
}

const PLANS: PlanOption[] = [
  {
    id: 'starter',
    name: 'Paket Starter',
    priceDisplay: 'Rp 49.000',
    priceNumber: 49000,
    duration: 'Aktif 3 Bulan',
    features: [
      'Pilihan 1 Template Aktif',
      'Maksimal 100 Tamu Undangan',
      'Musik Latar & Navigasi Maps',
      'Hitung Mundur Acara',
      'Support WhatsApp',
    ],
  },
  {
    id: 'premium',
    name: 'Paket Premium',
    badge: 'Paling Populer',
    priceDisplay: 'Rp 99.000',
    priceNumber: 99000,
    duration: 'Aktif 1 Tahun',
    isPopular: true,
    features: [
      'Bebas Ganti Semua 5 Template',
      'Tamu Tak Terbatas (Unlimited)',
      'Amplop Digital & QRIS Hadiah',
      'Buku Tamu & RSVP Live Realtime',
      'Galeri 12 Foto + Video YouTube',
      'Kisah Cinta & Timeline Romantis',
      'Export Data RSVP ke Excel',
    ],
  },
  {
    id: 'vip',
    name: 'Paket VIP Exclusive',
    badge: 'Sultan Choice',
    priceDisplay: 'Rp 149.000',
    priceNumber: 149000,
    duration: 'Aktif Selamanya (Lifetime)',
    features: [
      'Semua Fitur Paket Premium',
      'Aktif Selamanya (Tanpa Batas Waktu)',
      'Custom Link Domain Pribadi',
      'Broadcast WhatsApp Generator',
      'Prioritas Setup & Bantuan 24/7',
      'Bebas Watermark & Iklan',
    ],
  },
];

interface PricingPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: (planId: string) => Promise<void>;
  invitationSlug?: string;
}

export const PricingPaywallModal: React.FC<PricingPaywallModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  invitationSlug = 'undangan-baru',
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('premium');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const handlePayAndPublish = async () => {
    setIsProcessing(true);
    try {
      // Simulasi proses pembayaran instan
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await onConfirmPublish(selectedPlanId);
      setIsSuccess(true);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="text-center py-8 space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              🎉 Pembayaran Berhasil &amp; Undangan Aktif!
            </h2>
            <p className="text-stone-600 max-w-md mx-auto text-sm leading-relaxed">
              Website pernikahan Anda sekarang sudah online dan siap disebarkan ke keluarga serta sahabat tercinta.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto flex items-center justify-between gap-3">
              <div className="text-left min-w-0 flex-1">
                <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Link Undangan Anda</span>
                <span className="font-mono text-sm font-bold text-stone-900 truncate block">
                  {typeof window !== 'undefined' ? `${window.location.host}/${invitationSlug}` : `mbell.id/${invitationSlug}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}/${invitationSlug}`;
                    navigator.clipboard.writeText(fullUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-label-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Salin Link"
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <a
                  href={`/${invitationSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-neutral-800 text-white font-label-md text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Buka</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-label-md text-sm font-semibold transition-colors"
              >
                Kembali ke Dashboard Editor
              </button>
            </div>
          </div>
        ) : (
          /* PRICING & PAYMENT SELECTION STATE */
          <>
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-label-md text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[15px]">diamond</span>
                <span>Aktivasi Publikasi Live</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Pilih Paket Undangan Digital
              </h2>
              <p className="text-stone-600 text-sm mt-1.5">
                Satu kali bayar untuk website pernikahan elegan tanpa biaya langganan bulanan.
              </p>
            </div>

            {/* 3 Columns Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative rounded-2xl p-5 cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'border-stone-950 bg-stone-50 ring-2 ring-stone-950 shadow-lg'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          plan.isPopular
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-stone-800 text-white'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-stone-900 text-base">{plan.name}</h4>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-2xl font-black text-stone-900">{plan.priceDisplay}</span>
                        <span className="text-xs text-stone-500 block mt-0.5">{plan.duration}</span>
                      </div>

                      <ul className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200/60">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">check</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
                Metode Pembayaran Instan (Verifikasi Otomatis)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'qris'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                  <span>QRIS (Semua E-Wallet)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'bca'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  <span>Virtual Account BCA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mandiri')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'mandiri'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  <span>Mandiri / Kartu</span>
                </button>
              </div>
            </div>

            {/* Total & Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div>
                <span className="text-xs text-stone-500 block">Total Pembayaran:</span>
                <span className="text-2xl font-bold text-stone-900">{selectedPlan.priceDisplay}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-label-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handlePayAndPublish}
                  disabled={isProcessing}
                  className="w-full sm:w-auto py-3 px-7 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-label-md text-sm font-bold transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Bayar &amp; Terbitkan Sekarang</span>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
