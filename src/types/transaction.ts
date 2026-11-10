// ============================================================
// TRANSACTION TYPES — Kontrak Data untuk Midtrans Custom UI
// Reflect 1:1 dengan kolom tabel public.transactions di Supabase
// ============================================================

/** Metode pembayaran yang didukung Midtrans Core API & Transfer Manual */
export type PaymentMethod =
  | 'bca_manual'
  | 'gopay'
  | 'bni_va'
  | 'bri_va'
  | 'mandiri_va'
  | 'permata_va'
  | 'cimb_va'
  | 'bca_va'
  | 'qris';

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
  // Midtrans Snap (Official popup & redirect)
  snapToken?: string;
  snapRedirectUrl?: string;
  // QRIS / GoPay-specific
  qrCodeUrl?: string;
  qrString?: string;
  deeplinkUrl?: string; // Buka langsung aplikasi GoPay / Gojek di HP
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
  subLabel?: string;
  category: 'manual' | 'ewallet' | 'va';
}

/**
 * Helper: Cek apakah Midtrans Sandbox mode aktif dari env.
 */
export function isMidtransSandbox(): boolean {
  return import.meta.env.VITE_MIDTRANS_IS_SANDBOX === 'true';
}

/**
 * Daftar opsi metode pembayaran resmi yang aktif di UI Checkout.
 * Khusus 5 Virtual Account yang sudah aktif di Midtrans Production (BNI, BRI, Mandiri, Permata, CIMB).
 */
export const PAYMENT_METHOD_OPTIONS: PaymentOptionItem[] = [
  // ── VIRTUAL ACCOUNT OTOMATIS (Midtrans 24 Jam) ──
  {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    badge: 'Otomatis 24 Jam',
    icon: 'account_balance',
    description: 'Transfer via BNI Mobile Banking, ATM BNI, atau ATM Bersama.',
    category: 'va',
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account (BRIVA)',
    badge: 'Otomatis 24 Jam',
    icon: 'account_balance',
    description: 'Transfer via BRImo, ATM BRI, atau Agen BRILink.',
    category: 'va',
  },
  {
    id: 'mandiri_va',
    name: 'Bank Mandiri (Bill Payment)',
    badge: 'Otomatis 24 Jam',
    icon: 'credit_card',
    description: 'Bayar via Livin\' by Mandiri (Menu Bayar > Tagihan 70012) atau ATM Mandiri.',
    category: 'va',
  },
  {
    id: 'permata_va',
    name: 'PermataBank Virtual Account',
    badge: 'Otomatis 24 Jam',
    icon: 'account_balance',
    description: 'Transfer via PermataMobile X, ATM Permata, atau ATM Bersama.',
    category: 'va',
  },
  {
    id: 'cimb_va',
    name: 'CIMB Niaga Virtual Account',
    badge: 'Otomatis 24 Jam',
    icon: 'account_balance',
    description: 'Transfer via OCTO Mobile, OCTO Clicks, atau ATM CIMB Niaga.',
    category: 'va',
  },
];
