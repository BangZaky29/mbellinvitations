// Tipe resmi Vercel Serverless Function (Self-contained, bebas error tanpa dependensi eksternal @vercel/node)
export interface VercelRequest {
    method?: string;
    body?: any;
    query?: Record<string, string | string[]>;
    headers?: Record<string, string | string[] | undefined>;
}

export interface VercelResponse {
    status: (statusCode: number) => VercelResponse;
    json: (jsonBody: any) => VercelResponse;
    send: (body: any) => VercelResponse;
}
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'ftCpsBebkhWd27uPXtJ4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(200).json({ status: true, message: 'Mbell WA Bot Webhook Active' });
    }

    try {
        const body = req.body || {};
        // Fonnte mengirimkan pesan di dalam properti 'message' dan pengirim/grup di 'sender'
        const rawMessage = String(body.message || '').trim();
        const text = rawMessage.toLowerCase();
        const sender = String(body.sender || '120363430931304512@g.us');

        if (!text) {
            return res.status(200).json({ status: false, reason: 'Empty message' });
        }

        // Deteksi apakah pesan men-tag @bangzaky29, @bangzaky, atau mention nomor WA bot (628988761937 / 08988761937)
        const isTagged =
            text.includes('@bangzaky29') ||
            text.includes('@bangzaky') ||
            text.includes('628988761937') ||
            text.includes('08988761937');

        if (!isTagged) {
            return res.status(200).json({ status: true, ignored: true });
        }

        // Ambil data statistik live dari Supabase RPC
        const { data: stats, error } = await supabase.rpc('get_mbell_bot_stats');
        if (error || !stats) {
            throw new Error(error?.message || 'Gagal mengambil statistik dari database');
        }

        const askLogin = text.includes('login') || text.includes('user') || text.includes('akun') || text.includes('pengguna');
        const askSlug = text.includes('slug') || text.includes('link') || text.includes('undangan') || text.includes('aktif');
        const askOmset = text.includes('transaksi') || text.includes('omset') || text.includes('bayar') || text.includes('lunas');

        let replyMessage = '';

        // 1. Jika ditanya soal Total Login / User
        if (askLogin && !askSlug) {
            replyMessage =
                `📊 *LAPORAN USER & LOGIN MBELL*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `👥 *Total Akun Terdaftar:* ${stats.total_users} User\n` +
                `🟢 *User Login Hari Ini:* ${stats.logged_in_today} User\n\n` +
                `🕒 *Login Terakhir:*\n` +
                `• *Nama:* ${stats.last_user_name}\n` +
                `• *Email:* ${stats.last_user_email}\n` +
                `• *Waktu:* ${stats.last_login_time}\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `_Diperbarui: ${stats.checked_at}_`;
        }
        // 2. Jika ditanya soal Slug / Link Undangan Aktif
        else if (askSlug && !askLogin) {
            replyMessage =
                `🔗 *LAPORAN SLUG UNDANGAN MBELL*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `🚀 *Slug Aktif (Published):* ${stats.published_slugs} Link\n` +
                `📝 *Slug Draft:* ${stats.draft_slugs} Link\n` +
                `📦 *Total Semua Slug:* ${stats.total_invitations} Link\n\n` +
                `📋 *Daftar Slug Terbaru:*\n${stats.slug_list}\n\n` +
                `🌐 *Domain:* https://mbellinvitations.vercel.app\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `_Diperbarui: ${stats.checked_at}_`;
        }
        // 3. Jika ditanya soal Transaksi / Omset
        else if (askOmset) {
            const formattedRevenue = Number(stats.total_revenue || 0).toLocaleString('id-ID');
            replyMessage =
                `💰 *LAPORAN TRANSAKSI MBELL*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `✅ *Transaksi Lunas:* ${stats.paid_count} Undangan\n` +
                `💵 *Total Pemasukan:* Rp ${formattedRevenue}\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `_Diperbarui: ${stats.checked_at}_`;
        }
        // 4. Jika ditanya gabungan atau tag @bangzaky29 secara umum (Menu Bantuan + Ringkasan)
        else {
            const formattedRevenue = Number(stats.total_revenue || 0).toLocaleString('id-ID');
            replyMessage =
                `🤖 *HALO! INI REKAP LIVE MBELL INVITATIONS*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `👥 *Total User:* ${stats.total_users} Akun (${stats.logged_in_today} login hari ini)\n` +
                `🚀 *Slug Published:* ${stats.published_slugs} Aktif / ${stats.draft_slugs} Draft\n` +
                `💰 *Transaksi Lunas:* ${stats.paid_count} (Rp ${formattedRevenue})\n\n` +
                `📋 *Slug Terbaru:*\n${stats.slug_list}\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `💡 _Tips: Tag *@bangzaky29* disertai kata kunci *"total login"*, *"slug aktif"*, atau *"cek omset"*._`;
        }

        // Kirim balasan kembali ke Grup WA / Pengirim melalui Fonnte
        await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: FONNTE_TOKEN,
            },
            body: JSON.stringify({
                target: sender,
                message: replyMessage,
            }),
        });

        return res.status(200).json({ status: true, replied: true });
    } catch (err: any) {
        console.error('WA Webhook Error:', err);
        return res.status(200).json({ status: false, error: err.message });
    }
}