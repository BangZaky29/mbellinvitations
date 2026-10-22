// ============================================================
// TRANSACTION TYPES — Kontrak Data untuk Midtrans Custom UI
// Reflect 1:1 dengan kolom tabel public.transactions di Supabase
// ============================================================

/** Metode pembayaran yang didukung Midtrans Core API */
export type PaymentMethod = 'qris' | 'bca_va' | 'bni_va' | 'bri_va' | 'mandiri_va';

/** Status pembayaran sesuai lifecycle Midtrans */
export type PaymentStatus = 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny';

/** State step pada Checkout Modal Progresif */
export type CheckoutStep = 'review_order' | 'select_method' | 'waiting_payment' | 'success';

/**
 * Record transaksi dari tabel public.transactions di Supabase.
 * Digunakan untuk read/write ke database.
 */
export interface TransactionRecord {
  id: string;
  order_id: string;
  user_id: string | null;
  invitation_id: string;
  template_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  va_number: string | null;
  bank_name: string | null;
  qr_code_url: string | null;
  qr_string: string | null;
  bill_key: string | null;
  biller_code: string | null;
  expiry_time: string | null;
  paid_at: string | null;
  midtrans_response: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Parameter input untuk membuat transaksi baru (charge).
 * Digunakan oleh createChargeTransaction().
 */
export interface CreateChargeParams {
  userId: string | null;
  invitationId: string;
  invitationSlug?: string;
  templateId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

/**
 * Hasil dari createChargeTransaction().
 * Berisi data yang dirender di Step 2 (instruksi pembayaran).
 */
export interface ChargeResult {
  orderId: string;
  paymentMethod: PaymentMethod;
  expiryTime: string;
  // QRIS-specific
  qrCodeUrl?: string;
  qrString?: string;
  // VA-specific
  vaNumber?: string;
  bankName?: string;
  // Mandiri Bill Payment (echannel)
  billKey?: string;
  billerCode?: string;
}

/**
 * Opsi metode pembayaran untuk UI selector di Step 1.
 */
export interface PaymentOptionItem {
  id: PaymentMethod;
  name: string;
  badge: string;
  icon: string;
  description: string;
  subLabel?: string;    // Sub-label tambahan (e.g. "Rekomendasi Instan")
}

/**
 * Helper: Cek apakah Midtrans Sandbox mode aktif dari env.
 */
export function isMidtransSandbox(): boolean {
  return import.meta.env.VITE_MIDTRANS_IS_SANDBOX === 'true';
}

/**
 * Daftar opsi metode pembayaran yang ditampilkan di Step 1 Modal Checkout.
 */
export const PAYMENT_METHOD_OPTIONS: PaymentOptionItem[] = [
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & Mobile Banking)',
    badge: 'Rekomendasi Instan',
    icon: 'qr_code_scanner',
    description: 'GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin\' Mandiri, BRImo',
    subLabel: 'Bayar instan dari aplikasi manapun',
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    badge: 'Verifikasi Otomatis',
    icon: 'account_balance',
    description: 'Transfer via m-BCA, KlikBCA, atau ATM BCA.',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    badge: 'Verifikasi Otomatis',
    icon: 'credit_card',
    description: 'Transfer via Livin\' by Mandiri atau ATM Mandiri.',
  },
  {
    id: 'bri_va',
    name: 'BRI / BNI Virtual Account',
    badge: 'Verifikasi Otomatis',
    icon: 'account_balance_wallet',
    description: 'Transfer via BRImo, BNI Mobile, atau ATM bersama.',
  },
];
