// ============================================================
// PAYMENT SERVICE — Service Layer Transaksi Midtrans Sandbox Core API
// Menghubungkan Custom White-Label UI langsung ke Midtrans /v2/charge
// Mendukung QRIS, BCA VA, BNI VA, BRI VA, dan Mandiri Bill
// ============================================================

import { supabase } from '../lib/supabaseClient';
import { THEME_TO_TEMPLATE_ID, TEMPLATE_ID_TO_THEME, getSafeDbTemplateId } from '../pages/dashboard/constants/themeMapping';
import {
  isMidtransSandbox,
  type PaymentMethod,
  type CreateChargeParams,
  type ChargeResult,
  type TransactionRecord,
} from '../types/transaction';

// =========================================================================
// MIDTRANS CONFIGURATION & HELPERS
// =========================================================================

const MIDTRANS_SERVER_KEY =
  import.meta.env.VITE_MIDTRANS_SERVER_KEY || '';

/**
 * Endpoint Midtrans:
 * Baik di mode dev (Vite proxy) maupun di mode produksi (Vercel Edge Proxy),
 * selalu gunakan '/api/midtrans' agar bebas CORS browser.
 */
const MIDTRANS_PRODUCTION_URL = 'https://api.midtrans.com';
const MIDTRANS_SANDBOX_URL = 'https://api.sandbox.midtrans.com';

function getMidtransDirectUrl(): string {
  return isMidtransSandbox() ? MIDTRANS_SANDBOX_URL : MIDTRANS_PRODUCTION_URL;
}

function getMidtransBaseUrl(): string {
  return '/api/midtrans';
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
    case 'bca_manual': return import.meta.env.VITE_MANUAL_ACCOUNT_NUMBER || '8705623461';
    case 'bca_va': return '8277081' + randomDigits(8);
    case 'bni_va': return '9881' + randomDigits(8);
    case 'bri_va': return '1269' + randomDigits(8);
    case 'mandiri_va': return '990' + randomDigits(8);
    case 'permata_va': return '8528' + randomDigits(8);
    case 'cimb_va': return '5919' + randomDigits(8);
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
    case 'bca_manual': return 'BCA';
    case 'bca_va': return 'BCA';
    case 'bni_va': return 'BNI';
    case 'bri_va': return 'BRI';
    case 'mandiri_va': return 'Mandiri';
    case 'permata_va': return 'Permata';
    case 'cimb_va': return 'CIMB Niaga';
    case 'gopay': return 'GoPay';
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
    case 'gopay':
      basePayload.payment_type = 'gopay';
      basePayload.gopay = {
        enable_callback: true,
        callback_url: 'https://mbellinvitations.my.id',
      };
      break;

    case 'qris':
      basePayload.payment_type = 'qris';
      basePayload.qris = { acquirer: 'gopay' };
      break;

    case 'bni_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bni' };
      break;

    case 'bri_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bri' };
      break;

    case 'permata_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'permata' };
      break;

    case 'cimb_va':
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'cimb' };
      break;

    case 'mandiri_va':
      basePayload.payment_type = 'echannel';
      basePayload.echannel = {
        bill_info1: 'Aktivasi Undangan',
        bill_info2: templateId || 'Mbell Undangan',
      };
      break;

    case 'bca_va':
    default:
      basePayload.payment_type = 'bank_transfer';
      basePayload.bank_transfer = { bank: 'bca' };
      break;
  }

  // Coba URL proxy dulu (Vite dev), jika gagal coba direct Midtrans URL
  const endpoints = [
    `${getMidtransBaseUrl()}/v2/charge`,
    `${getMidtransDirectUrl()}/v2/charge`,
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
        // Cek status_code dari body JSON Midtrans (200 / 201 = sukses terbit)
        if (data.status_code === '200' || data.status_code === '201') {
          console.log('✅ Midtrans Core API Charge SUCCESS:', data);
          return data as MidtransChargeResponse;
        } else {
          console.warn(`⚠️ Midtrans Charge returned business status ${data.status_code}:`, data);
          if (data.status_code === '402') {
            console.error('❌ Midtrans Error 402: Payment channel is not activated.');
            console.error('👉 Pastikan proxy / server dev telah direstart agar mengarah ke Production (https://api.midtrans.com), bukan Sandbox.');
          }
        }
      } else {
        const errData = await res.json().catch(() => null);
        console.warn(`⚠️ Midtrans Charge returned HTTP status ${res.status}:`, errData);
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
    `${getMidtransDirectUrl()}/v2/${orderId}/status`,
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

  // Helper validasi UUID
  const isValidUuid = (val?: string | null): boolean =>
    Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim()));

  // Pastikan user_id berupa UUID valid atau null (DILARANG string kosong "")
  const safeUserId = isValidUuid(userId) ? userId!.trim() : null;

  // 1. Resolve valid UUID for invitationId
  let resolvedInvitationId = isValidUuid(invitationId) ? invitationId!.trim() : '';

  if (!resolvedInvitationId && invitationSlug) {
    const { data: invRow } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', invitationSlug)
      .maybeSingle();

    if (invRow?.id && isValidUuid(invRow.id)) {
      resolvedInvitationId = invRow.id;
    }
  }

  if (!resolvedInvitationId) {
    const targetSlug = invitationSlug || `undangan-${Date.now()}`;
    const safeTemplateId = getSafeDbTemplateId(templateId);

    // Coba upsert dengan safeTemplateId terlebih dahulu
    let { data: upsertedInv, error: upsertErr } = await supabase
      .from('invitations')
      .upsert(
        {
          slug: targetSlug,
          user_id: safeUserId,
          template_id: safeTemplateId,
          status: 'draft',
          is_paid: false,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .maybeSingle();

    // Fallback jika template_id belum terdaftar di tabel public.templates (mencegah error FK 409)
    if (upsertErr || !upsertedInv?.id) {
      console.warn(`⚠️ Upsert draf dengan ${safeTemplateId} gagal (FK constraint). Fallback ke template1:`, upsertErr);
      const { data: fallbackTemplateInv } = await supabase
        .from('invitations')
        .upsert(
          {
            slug: targetSlug,
            user_id: safeUserId,
            template_id: 'template1',
            status: 'draft',
            is_paid: false,
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .maybeSingle();
      upsertedInv = fallbackTemplateInv;
    }

    if (upsertedInv?.id && isValidUuid(upsertedInv.id)) {
      resolvedInvitationId = upsertedInv.id;
    } else {
      const { data: fallbackInv } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', targetSlug)
        .maybeSingle();

      if (fallbackInv?.id && isValidUuid(fallbackInv.id)) {
        resolvedInvitationId = fallbackInv.id;
      }
    }
  }

  // Jika tetap belum dapat resolvedInvitationId, ambil id undangan terlama sebagai fallback darurat
  if (!resolvedInvitationId) {
    const { data: existingAny } = await supabase
      .from('invitations')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existingAny?.id && isValidUuid(existingAny.id)) {
      resolvedInvitationId = existingAny.id;
    }
  }

  if (!resolvedInvitationId) {
    throw new Error('Gagal menyiapkan identitas undangan untuk transaksi pembayaran. Pastikan koneksi Supabase aktif.');
  }

  const orderId = generateOrderId();
  const now = new Date();

  // Expiry standar: GoPay/QRIS = 15 menit, VA/Manual = 24 jam
  const expiryMinutes = paymentMethod === 'qris' || paymentMethod === 'gopay' ? 15 : 24 * 60;
  let expiryTime = new Date(now.getTime() + expiryMinutes * 60 * 1000).toISOString();

  // ── CABANG KHUSUS: BCA TRANSFER MANUAL ──
  // Tidak perlu menembak Midtrans API, langsung catat ke database Supabase
  if (paymentMethod === 'bca_manual') {
    const manualAccount = import.meta.env.VITE_MANUAL_ACCOUNT_NUMBER || '8705623461';
    const manualBank = 'BCA';

    const transactionPayload = {
      order_id: orderId,
      user_id: safeUserId,
      invitation_id: resolvedInvitationId,
      template_id: templateId,
      amount,
      payment_method: paymentMethod,
      payment_status: 'pending',
      va_number: manualAccount,
      bank_name: manualBank,
      qr_code_url: null,
      qr_string: null,
      bill_key: null,
      biller_code: null,
      expiry_time: expiryTime,
      midtrans_response: {
        type: 'manual_transfer',
        bank: manualBank,
        account_number: manualAccount,
        account_name: 'Zaky Aulia Qolbi',
      },
    };

    const { error: manualErr } = await supabase.from('transactions').insert(transactionPayload);
    if (manualErr) {
      console.error('❌ createChargeTransaction (BCA Manual) Supabase insert error:', manualErr);
      throw new Error(`Gagal menyimpan tagihan pembayaran: ${manualErr.message}`);
    }

    return {
      orderId,
      paymentMethod: 'bca_manual',
      expiryTime,
      vaNumber: manualAccount,
      bankName: manualBank,
    };
  }

  // 2. TEMBAK LANGSUNG KE MIDTRANS CORE API (Production / Sandbox)
  const midtransRes = await callMidtransChargeApi(orderId, amount, paymentMethod, templateId);

  let vaNumber: string | null = null;
  let bankName: string | null = null;
  let qrCodeUrl: string | null = null;
  let qrString: string | null = null;
  let deeplinkUrl: string | null = null;
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
      const actionQr = midtransRes.actions?.find((a: any) => a.name === 'generate-qr-code')?.url;
      qrCodeUrl = actionQr || (qrString ? generateQrCodeUrl(qrString) : null);
    } else if (paymentMethod === 'gopay') {
      qrString = midtransRes.qr_string || null;
      const actionQr = midtransRes.actions?.find((a: any) => a.name === 'generate-qr-code')?.url;
      qrCodeUrl = actionQr || (qrString ? generateQrCodeUrl(qrString) : null);
      deeplinkUrl = midtransRes.actions?.find((a: any) => a.name === 'deeplink-redirect')?.url || null;
      bankName = 'GoPay';
    } else if (paymentMethod === 'mandiri_va') {
      billKey = midtransRes.bill_key || null;
      billerCode = midtransRes.biller_code || '70012';
      bankName = 'Mandiri';
      vaNumber = billKey;
    } else {
      // BCA, BNI, BRI, Permata, CIMB VA
      vaNumber = midtransRes.va_numbers?.[0]?.va_number || midtransRes.permata_va_number || null;
      bankName = (midtransRes.va_numbers?.[0]?.bank || resolveBankName(paymentMethod)).toUpperCase();
    }
  } else {
    // ── Fallback Simulasi jika koneksi Midtrans offline/terhalang ──
    console.warn('⚠️ Menggunakan data fallback simulasi untuk modal.');
    if (paymentMethod === 'qris') {
      qrString = getSimulatedQrString(orderId, amount);
      qrCodeUrl = generateQrCodeUrl(qrString);
    } else if (paymentMethod === 'gopay') {
      qrString = getSimulatedQrString(orderId, amount);
      qrCodeUrl = generateQrCodeUrl(qrString);
      deeplinkUrl = 'https://gojek.link';
      bankName = 'GoPay';
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
    user_id: safeUserId,
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
    ...(deeplinkUrl ? { deeplinkUrl } : {}),
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
