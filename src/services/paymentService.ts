// ============================================================
// PAYMENT SERVICE — Service Layer Transaksi Midtrans Sandbox Core API
// Menghubungkan Custom White-Label UI langsung ke Midtrans /v2/charge
// Mendukung QRIS, BCA VA, BNI VA, BRI VA, dan Mandiri Bill
// ============================================================

import { supabase } from '../lib/supabaseClient';
import { THEME_TO_TEMPLATE_ID, TEMPLATE_ID_TO_THEME, getSafeDbTemplateId } from '../pages/dashboard/constants/themeMapping';
import type {
  PaymentMethod,
  CreateChargeParams,
  ChargeResult,
  TransactionRecord,
} from '../types/transaction';

// =========================================================================
// MIDTRANS CONFIGURATION & HELPERS
// =========================================================================

const MIDTRANS_SERVER_KEY =
  import.meta.env.VITE_MIDTRANS_SERVER_KEY || '';

/**
 * Endpoint Midtrans:
 * Di mode dev (Vite), kita gunakan proxy '/api/midtrans' untuk mem-bypass CORS browser.
 * Di mode produksi (atau fallback), gunakan endpoint sandbox / production resmi.
 */
const isDev = import.meta.env.DEV;
const isSandbox = import.meta.env.VITE_MIDTRANS_IS_SANDBOX !== 'false';
const MIDTRANS_PROD_URL = 'https://api.midtrans.com';
const MIDTRANS_SANDBOX_URL = 'https://api.sandbox.midtrans.com';

function getMidtransBaseUrl(): string {
  if (isDev) {
    return '/api/midtrans';
  }
  return isSandbox ? MIDTRANS_SANDBOX_URL : MIDTRANS_PROD_URL;
}

/**
 * Header Authorization Basic Auth: Base64(ServerKey + :)
 * Menggunakan Web API btoa standar browser
 */
function getMidtransAuthHeader(): string {
  const rawKey = `${MIDTRANS_SERVER_KEY}:`;
  return `Basic ${btoa(rawKey)}`;
}

/**
 * Generate Order ID unik format: MBELL-{timestamp}-{random4}
 * Contoh: MBELL-1729501234567-A3K9
 */
function generateOrderId(): string {
  const timestamp = Date.now();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MBELL-${timestamp}-${random}`;
}

/**
 * Generate nomor Virtual Account cadangan (fallback jika offline)
 */
function getSimulatedVaNumber(method: PaymentMethod): string {
  const randomDigits = (len: number) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  switch (method) {
    case 'bca_va': return '8277081' + randomDigits(8);
    case 'bni_va': return '9881' + randomDigits(8);
    case 'bri_va': return '1269' + randomDigits(8);
    case 'mandiri_va': return '990' + randomDigits(8);
    default: return randomDigits(12);
  }
}

/**
 * Generate QR string cadangan
 */
function getSimulatedQrString(orderId: string, amount: number): string {
  const paddedAmount = amount.toString().padStart(10, '0');
  return `00020101021226670016COM.NOBUBANK.WWW01189360050300000879140214${orderId}5303360540${paddedAmount}5802ID5917Mbell Invitations6007JAKARTA6304A1B2`;
}

/**
 * Generate QR Code image URL dari QR string
 */
function generateQrCodeUrl(qrString: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}&format=png&margin=10`;
}

/**
 * Resolve nama bank dari payment method
 */
function resolveBankName(method: PaymentMethod): string {
  switch (method) {
    case 'bca_va': return 'BCA';
    case 'bni_va': return 'BNI';
    case 'bri_va': return 'BRI';
    case 'mandiri_va': return 'Mandiri';
    case 'qris': return 'QRIS';
    default: return 'Bank';
  }
}

// =========================================================================
// MIDTRANS CORE API CALLERS
// =========================================================================

interface MidtransChargeResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  bill_key?: string;
  biller_code?: string;
  qr_string?: string;
  actions?: Array<{ name: string; method: string; url: string }>;
  expiry_time?: string;
  [key: string]: any;
}

/**
 * Panggil Midtrans Core API `/v2/charge`
 * Menggunakan Vite proxy '/api/midtrans' di mode dev (bebas CORS).
 */
async function callMidtransChargeApi(
  orderId: string,
  amount: number,
  paymentMethod: PaymentMethod,
  templateId: string
): Promise<MidtransChargeResponse | null> {
  const authHeader = getMidtransAuthHeader();

  const basePayload: Record<string, any> = {
    transaction_details: {
      order_id: orderId,
      gross_amount: Math.round(amount),
    },
  };

  switch (paymentMethod) {
    case 'qris':
      basePayload.payment_type = 'qris';
      basePayload.qris = { acquirer: 'gopay' };
      break;

    case 'bca_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bca' };
      break;

    case 'bni_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bni' };
      break;

    case 'bri_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bri' };
      break;

    case 'mandiri_va':
      basePayload.payment_type = 'echannel';
      basePayload.echannel = {
        bill_info1: 'Aktivasi Template:',
        bill_info2: templateId || 'Mbell Undangan',
      };
      break;

    default:
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bca' };
  }

  // Coba URL proxy dulu (Vite dev), jika gagal coba direct Sandbox
  const endpoints = [
    `${getMidtransBaseUrl()}/v2/charge`,
    `${MIDTRANS_SANDBOX_URL}/v2/charge`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Calling Midtrans Core API: ${endpoint}`, basePayload);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(basePayload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Midtrans Core API Charge SUCCESS:', data);
        return data as MidtransChargeResponse;
      } else {
        const errData = await res.json().catch(() => null);
        console.warn(`⚠️ Midtrans Charge returned status ${res.status}:`, errData);
      }
    } catch (err) {
      console.warn(`⚠️ Fetch failed for ${endpoint}:`, err);
    }
  }

  return null;
}

/**
 * Panggil Midtrans Core API `/v2/{order_id}/status`
 */
async function callMidtransStatusApi(orderId: string): Promise<any | null> {
  const authHeader = getMidtransAuthHeader();
  const endpoints = [
    `${getMidtransBaseUrl()}/v2/${orderId}/status`,
    `${MIDTRANS_SANDBOX_URL}/v2/${orderId}/status`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      // ignore
    }
  }

  return null;
}

// =========================================================================
// CORE SERVICE FUNCTIONS
// =========================================================================

/**
 * Membuat transaksi charge baru ke Midtrans Sandbox Core API (/v2/charge).
 *
 * Flow:
 * 1. Resolve UUID valid pada public.invitations (mencegah error FK constraint).
 * 2. Generate order_id unik: MBELL-...
 * 3. Tembak HTTP POST ke Midtrans Core API (/v2/charge).
 * 4. Ambil nomor VA / QR Code url ASLI dari respons Midtrans Sandbox.
 * 5. Simpan baris transaksi ke tabel public.transactions di Supabase.
 * 6. Return ChargeResult ke modal checkout.
 */
export async function createChargeTransaction(params: CreateChargeParams): Promise<ChargeResult> {
  const { userId, invitationId, invitationSlug, templateId, amount, paymentMethod } = params;

  // 1. Resolve valid UUID for invitationId
  let resolvedInvitationId = invitationId;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedInvitationId || '');

  if (!isUuid && invitationSlug) {
    const { data: invRow } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', invitationSlug)
      .maybeSingle();

    if (invRow?.id) {
      resolvedInvitationId = invRow.id;
    }
  }

  if (!resolvedInvitationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedInvitationId)) {
    const targetSlug = invitationSlug || `undangan-${Date.now()}`;
    const safeTemplateId = getSafeDbTemplateId(templateId);

    const { data: upsertedInv } = await supabase
      .from('invitations')
      .upsert(
        {
          slug: targetSlug,
          user_id: userId || null,
          template_id: safeTemplateId,
          status: 'draft',
          is_paid: false,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .maybeSingle();

    if (upsertedInv?.id) {
      resolvedInvitationId = upsertedInv.id;
    } else {
      const { data: fallbackInv } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', targetSlug)
        .maybeSingle();

      if (fallbackInv?.id) {
        resolvedInvitationId = fallbackInv.id;
      }
    }
  }

  const orderId = generateOrderId();
  const now = new Date();

  // Expiry standar: QRIS = 15 menit, VA = 24 jam
  const expiryMinutes = paymentMethod === 'qris' ? 15 : 24 * 60;
  let expiryTime = new Date(now.getTime() + expiryMinutes * 60 * 1000).toISOString();

  // 2. TEMBAK LANGSUNG KE MIDTRANS SANDBOX CORE API
  const midtransRes = await callMidtransChargeApi(orderId, amount, paymentMethod, templateId);

  let vaNumber: string | null = null;
  let bankName: string | null = null;
  let qrCodeUrl: string | null = null;
  let qrString: string | null = null;
  let billKey: string | null = null;
  let billerCode: string | null = null;

  if (midtransRes) {
    // ── Midtrans API Berhasil Merespons ──
    if (midtransRes.expiry_time) {
      try {
        expiryTime = new Date(midtransRes.expiry_time.replace(' ', 'T') + '+07:00').toISOString();
      } catch (e) {
        // keep default
      }
    }

    if (paymentMethod === 'qris') {
      qrString = midtransRes.qr_string || null;
      // Midtrans menyediakan URL generate QR langsung di actions array
      const actionQr = midtransRes.actions?.find((a: any) => a.name === 'generate-qr-code')?.url;
      qrCodeUrl = actionQr || (qrString ? generateQrCodeUrl(qrString) : null);
    } else if (paymentMethod === 'mandiri_va') {
      billKey = midtransRes.bill_key || null;
      billerCode = midtransRes.biller_code || '70012';
      bankName = 'Mandiri';
      vaNumber = billKey;
    } else {
      // BCA, BNI, BRI VA
      vaNumber = midtransRes.va_numbers?.[0]?.va_number || null;
      bankName = (midtransRes.va_numbers?.[0]?.bank || resolveBankName(paymentMethod)).toUpperCase();
    }
  } else {
    // ── Fallback Simulasi jika koneksi Midtrans gagal ──
    console.warn('⚠️ Menggunakan data fallback simulasi untuk modal.');
    if (paymentMethod === 'qris') {
      qrString = getSimulatedQrString(orderId, amount);
      qrCodeUrl = generateQrCodeUrl(qrString);
    } else if (paymentMethod === 'mandiri_va') {
      billKey = getSimulatedVaNumber(paymentMethod);
      billerCode = '70012';
      bankName = 'Mandiri';
      vaNumber = billKey;
    } else {
      vaNumber = getSimulatedVaNumber(paymentMethod);
      bankName = resolveBankName(paymentMethod);
    }
  }

  // 3. Simpan ke Supabase public.transactions
  const transactionPayload = {
    order_id: orderId,
    user_id: userId,
    invitation_id: resolvedInvitationId,
    template_id: templateId,
    amount,
    payment_method: paymentMethod,
    payment_status: 'pending',
    va_number: vaNumber,
    bank_name: bankName,
    qr_code_url: qrCodeUrl,
    qr_string: qrString,
    bill_key: billKey,
    biller_code: billerCode,
    expiry_time: expiryTime,
    midtrans_response: midtransRes || { note: 'simulated_fallback', order_id: orderId },
  };

  const { error } = await supabase.from('transactions').insert(transactionPayload);

  if (error) {
    console.error('❌ createChargeTransaction Supabase insert error:', error);
    throw new Error(`Gagal menyimpan tagihan pembayaran: ${error.message}`);
  }

  return {
    orderId,
    paymentMethod,
    expiryTime,
    ...(qrCodeUrl ? { qrCodeUrl } : {}),
    ...(qrString ? { qrString } : {}),
    ...(vaNumber ? { vaNumber } : {}),
    ...(bankName ? { bankName } : {}),
    ...(billKey ? { billKey } : {}),
    ...(billerCode ? { billerCode } : {}),
  };
}

/**
 * Konfirmasi pembayaran berhasil (Settlement).
 */
export async function confirmPaymentSuccess(
  orderId: string,
  invitationId: string,
  templateId: string,
  userId?: string | null
): Promise<boolean> {
  const nowIso = new Date().toISOString();

  try {
    // 1. Update public.transactions → settlement
    const { error: txError } = await supabase
      .from('transactions')
      .update({
        payment_status: 'settlement',
        paid_at: nowIso,
        updated_at: nowIso,
      })
      .eq('order_id', orderId);

    if (txError) {
      console.error('❌ confirmPaymentSuccess tx update error:', txError);
      throw new Error(`Gagal update status transaksi: ${txError.message}`);
    }

    // 2. Update public.invitations → published + paid
    let targetInvId = invitationId;
    if (!targetInvId) {
      const { data: txRow } = await supabase
        .from('transactions')
        .select('invitation_id')
        .eq('order_id', orderId)
        .maybeSingle();
      if (txRow?.invitation_id) {
        targetInvId = txRow.invitation_id;
      }
    }

    const safeTplId = THEME_TO_TEMPLATE_ID[templateId] || templateId;
    const semanticTheme = TEMPLATE_ID_TO_THEME[templateId] || templateId;

    if (targetInvId) {
      const { data: invRow } = await supabase
        .from('invitations')
        .select('unlocked_templates, template_id, content')
        .eq('id', targetInvId)
        .maybeSingle();

      const existingUnlocked = Array.isArray(invRow?.unlocked_templates)
        ? invRow.unlocked_templates
        : [];
      const updatedUnlocked = Array.from(new Set([...existingUnlocked, templateId, safeTplId, semanticTheme]));

      const updatedContent = {
        ...(invRow?.content || {}),
        theme_id: semanticTheme,
        status: 'published',
        is_paid: true,
        paid_template_id: safeTplId,
        unlocked_templates: updatedUnlocked,
      };

      await supabase
        .from('invitations')
        .update({
          template_id: getSafeDbTemplateId(templateId),
          content: updatedContent,
          status: 'published',
          is_paid: true,
          paid_template_id: safeTplId,
          unlocked_templates: updatedUnlocked,
          paid_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', targetInvId);
    }

    // 3. Update public.user_templates → published + paid
    if (userId) {
      const { data: utRows } = await supabase
        .from('user_templates')
        .select('id, unlocked_templates, content')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (utRows && utRows.length > 0) {
        const utExistingUnlocked = Array.isArray(utRows[0].unlocked_templates)
          ? utRows[0].unlocked_templates
          : [];
        const utUpdatedUnlocked = Array.from(new Set([...utExistingUnlocked, templateId, safeTplId, semanticTheme]));

        const utUpdatedContent = {
          ...(utRows[0]?.content || {}),
          theme_id: semanticTheme,
          status: 'published',
          is_paid: true,
          paid_template_id: safeTplId,
          unlocked_templates: utUpdatedUnlocked,
        };

        await supabase
          .from('user_templates')
          .update({
            template_id: safeTplId,
            theme_id: semanticTheme,
            content: utUpdatedContent,
            status: 'published',
            is_paid: true,
            paid_template_id: safeTplId,
            unlocked_templates: utUpdatedUnlocked,
            paid_at: nowIso,
            updated_at: nowIso,
          })
          .eq('id', utRows[0].id);
      }
    }

    return true;
  } catch (err) {
    console.error('❌ confirmPaymentSuccess error:', err);
    return false;
  }
}

/**
 * Cek status transaksi:
 * 1. Query langsung status resmi ke Midtrans Sandbox Core API (/v2/{order_id}/status).
 * 2. Jika Midtrans mengembalikan status 'settlement' / 'capture', otomatis update Supabase.
 * 3. Mengambil record transaksi dari tabel Supabase.
 */
export async function checkTransactionStatus(orderId: string): Promise<TransactionRecord | null> {
  try {
    // 1. Cek langsung ke server Midtrans
    const midtransStatus = await callMidtransStatusApi(orderId);
    console.log(`🔍 Midtrans /status result for ${orderId}:`, midtransStatus);

    if (
      midtransStatus &&
      (midtransStatus.transaction_status === 'settlement' ||
        midtransStatus.transaction_status === 'capture')
    ) {
      // Ambil transaksi di Supabase untuk update
      const { data: currentTx } = await supabase
        .from('transactions')
        .select('invitation_id, template_id, user_id')
        .eq('order_id', orderId)
        .maybeSingle();

      if (currentTx) {
        await confirmPaymentSuccess(
          orderId,
          currentTx.invitation_id,
          currentTx.template_id,
          currentTx.user_id
        );
      }
    }
  } catch (e) {
    console.warn('Midtrans status check warning:', e);
  }

  // 2. Kembalikan data terbaru dari Supabase
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) {
    console.error('❌ checkTransactionStatus error:', error);
    return null;
  }

  return data as TransactionRecord | null;
}

/**
 * Format harga ke format Rupiah display.
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Format VA number agar mudah dibaca (4 digit per grup).
 * Contoh: "827708112345678" → "8277 0811 2345 678"
 */
export function formatVaDisplay(va: string): string {
  return va.replace(/(\d{4})(?=\d)/g, '$1 ');
}
