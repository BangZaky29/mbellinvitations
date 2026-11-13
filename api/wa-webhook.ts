/// <reference types="node" />

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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'ftCpsBebkhWd27uPXtJ4';
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Urutan Model Waterfall Google AI Studio (Cerdas -> Ringan -> Fallback)
const GEMINI_MODELS_WATERFALL = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemma-4-31b-it',
  'gemini-2.5-flash',
];

/**
 * Panggil Gemini AI dengan Model Waterfall Switching
 */
async function callGeminiAi(
  prompt: string,
  systemInstruction: string,
  apiKey: string
): Promise<{ text: string; model: string }> {
  for (const model of GEMINI_MODELS_WATERFALL) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9500);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 550,
            topP: 0.85,
          },
        }),
      });

      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === 'string' && text.trim()) {
          console.log(`✅ [Gemini Webhook] Dijawab oleh model: ${model}`);
          return { text: text.trim(), model };
        }
      } else {
        const errJson = await response.json().catch(() => null);
        console.warn(`⚠️ [Gemini Webhook] Model ${model} HTTP ${response.status}:`, errJson?.error?.message);
      }
    } catch (err: any) {
      console.warn(`⚠️ [Gemini Webhook] Model ${model} error/timeout:`, err?.message || err);
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error('Semua model Gemini AI kehabisan token atau tidak tersedia.');
}

/**
 * Ambil data ringkasan live dari Supabase untuk grounding AI
 */
async function getSupabaseContext(userQuery: string): Promise<string> {
  let statsContext = '';
  let eventsContext = '';
  let specificDetail = '';

  try {
    const { data: stats } = await supabase.rpc('get_mbell_bot_stats');
    if (stats) {
      statsContext = `
[DATA STATISTIK RESMI SISTEM MBELL INVITATIONS]:
- Total Pengguna Terdaftar: ${stats.total_users || 0} akun
- Pengguna Login Hari Ini: ${stats.logged_in_today || 0} akun
- Total Undangan: ${stats.total_invitations || 0} link (Published Aktif: ${stats.published_slugs || 0}, Draft: ${stats.draft_slugs || 0})
- Transaksi Terverifikasi Lunas: ${stats.paid_count || 0} undangan
- Total Omset Lunas: Rp ${Number(stats.total_revenue || 0).toLocaleString('id-ID')}
- Daftar Slug Terkini:\n${stats.slug_list || '-'}
- Waktu Pembaruan Data: ${stats.checked_at || 'Terbaru'}
- Tautan Domain Web: https://mbellinvitations.my.id
`;
    }
  } catch (e) {
    console.warn('RPC stats warning:', e);
  }

  try {
    // Ambil daftar beberapa undangan pernikahan published terbaru
    const { data: invitations } = await supabase
      .from('invitations')
      .select('slug, status, template_id, content, views_count, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (invitations && invitations.length > 0) {
      eventsContext = `
[DATA CONTOH ACARA PERNIKAHAN AKTIF DI DATABASE]:\n` +
        invitations
          .map((inv, idx) => {
            const content = (inv.content as any) || {};
            const couple = content.couple || {};
            const groom = couple.groom || couple.pria || content.groomName || 'Mempelai Pria';
            const bride = couple.bride || couple.wanita || content.brideName || 'Mempelai Wanita';
            const events = content.events || content.eventDetails || [];
            const banks = content.banks || content.giftAccounts || [];

            return `${idx + 1}. Undangan: /${inv.slug} (https://mbellinvitations.my.id/${inv.slug})
   - Pasangan: ${groom} & ${bride}
   - Dilihat: ${inv.views_count || 0} kali | Template: ${inv.template_id}
   - Rincian Acara/Jadwal: ${JSON.stringify(events).slice(0, 250)}
   - Rekening/Amplop: ${JSON.stringify(banks).slice(0, 180)}`;
          })
          .join('\n\n');
    }
  } catch (e) {
    console.warn('Invitations fetch warning:', e);
  }

  // Jika user menyebut kata kunci slug tertentu, cari detail spesifiknya
  const queryLower = userQuery.toLowerCase();
  const slugMatch = queryLower.match(/[a-z0-9-]+(?:-wedding|undangan-[a-z0-9-]+)/);
  if (slugMatch) {
    try {
      const { data: invDetail } = await supabase
        .from('invitations')
        .select('*')
        .ilike('slug', `%${slugMatch[0]}%`)
        .maybeSingle();

      if (invDetail) {
        specificDetail = `\n[DETAIL SPESIFIK UNDANGAN TERPILIH]:\n${JSON.stringify(invDetail.content).slice(0, 600)}`;
      }
    } catch {}
  }

  return `${statsContext}\n${eventsContext}\n${specificDetail}`.trim();
}

/**
 * Respon fallback cerdas jika seluruh model AI offline / limit
 */
function getDeterministicFallbackResponse(userText: string, statsData: any): string {
  const lower = userText.toLowerCase().trim();
  const isGreeting =
    lower.includes('hallo') ||
    lower.includes('halo') ||
    lower.includes('hai') ||
    lower.includes('hey') ||
    lower.includes('p') ||
    lower.includes('assalam') ||
    lower.includes('pagi') ||
    lower.includes('siang') ||
    lower.includes('malam') ||
    lower === 'bro';

  if (isGreeting) {
    return (
      `Halo! Selamat datang di Layanan Asisten Virtual Resmi *Mbell Invitations*. Senang bisa menyapa Anda! 😊\n\n` +
      `Ada yang bisa saya bantu terkait undangan pernikahan Anda? Saya dapat membantu memeriksa:\n` +
      `• 📅 *Jadwal & Waktu Acara* (Akad & Resepsi)\n` +
      `• 📍 *Lokasi Pernikahan & Peta Google Maps*\n` +
      `• 👥 *Daftar Tamu Undangan & Status RSVP*\n` +
      `• 💳 *Nomor Rekening Amplop Digital & QRIS Hadiah*\n` +
      `• 📊 *Statistik Live Undangan* (Slug Aktif, Total Pengunjung, Status)\n` +
      `• 🔗 *Tautan / Link Undangan Digital Resmi*\n\n` +
      `Silakan beri tahu saya informasi apa yang ingin Anda tanyakan! ✨`
    );
  }

  // Peringatan di luar lingkup
  const outOfScopeKeywords = [
    'cuaca', 'politik', 'resep', 'koding', 'kripto', 'crypto', 'saham',
    'tugas', 'presiden', 'gosip', 'film', 'game', 'berita', 'mobil', 'motor'
  ];

  if (outOfScopeKeywords.some((kw) => lower.includes(kw))) {
    return (
      `Mohon maaf, saya adalah Asisten Virtual yang khusus ditugaskan untuk melayani informasi seputar *Mbell Invitations* (undangan pernikahan digital & acara pernikahan). 🙏\n\n` +
      `Saya tidak memiliki informasi dan tidak berwenang menjawab topik di luar layanan Mbell Invitations.\n\n` +
      `Apakah ada informasi seputar acara pernikahan, status RSVP, atau link undangan yang bisa saya bantu periksa?`
    );
  }

  const formattedRevenue = Number(statsData?.total_revenue || 0).toLocaleString('id-ID');
  return (
    `🤖 *ASISTEN VIRTUAL MBELL INVITATIONS*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👥 *Total User:* ${statsData?.total_users || 0} Akun (${statsData?.logged_in_today || 0} login hari ini)\n` +
    `🚀 *Slug Published:* ${statsData?.published_slugs || 0} Aktif / ${statsData?.draft_slugs || 0} Draft\n` +
    `💰 *Transaksi Lunas:* ${statsData?.paid_count || 0} (Rp ${formattedRevenue})\n\n` +
    `📋 *Slug Terbaru:*\n${statsData?.slug_list || '-'}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💡 _Ketik pertanyaan Anda seputar jadwal acara, lokasi, RSVP tamu, atau link undangan Mbell._`
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: true, message: 'Mbell AI WA Bot Webhook Active' });
  }

  try {
    const body = req.body || {};
    const rawMessage = String(body.message || body.text || '').trim();
    const text = rawMessage.toLowerCase();
    const chatSender = String(body.sender || body.from || '');
    const isGroup = chatSender.includes('@g.us') || String(body.is_group || '').toLowerCase() === 'true';
    const targetDestination = isGroup ? chatSender : (body.device || chatSender);

    if (!text) {
      return res.status(200).json({ status: false, reason: 'Empty message' });
    }

    // =========================================================================
    // ATURAN TAG / MENTION:
    // User lain yang men-tag nomor WA bot dengan "@" (atau mention bot / nama bot di grup)
    // Jika di chat pribadi (1-on-1), otomatis direspons tanpa harus ada tag
    // =========================================================================
    const hasAtSymbol = rawMessage.includes('@');
    const hasBotMention =
      text.includes('bot') ||
      text.includes('mbell') ||
      text.includes('bangzaky') ||
      text.includes('admin') ||
      text.includes('628988761937') ||
      text.includes('08988761937');

    const hasMentionPayload = Boolean(
      (body.mentioned && Array.isArray(body.mentioned) && body.mentioned.length > 0) ||
      (body.mentions && Array.isArray(body.mentions) && body.mentions.length > 0)
    );

    const isTagged = isGroup ? (hasAtSymbol || hasBotMention || hasMentionPayload) : true;

    if (!isTagged) {
      return res.status(200).json({
        status: true,
        ignored: true,
        reason: 'Pesan grup diabaikan karena tidak men-tag nomor dengan @ atau memanggil bot',
      });
    }

    // Bersihkan karakter @ dan tag ID agar pertanyaan murni didapatkan
    const cleanedQuery = rawMessage
      .replace(/@\S+/g, '')
      .replace(/^@\s*/g, '')
      .trim();

    const userQuery = cleanedQuery || rawMessage;

    // 1. Ambil data grounding terkini dari Supabase
    const dbContext = await getSupabaseContext(userQuery);

    // 2. Susun System Prompt Khusus Resepsionis Mbell Invitations & Guardrails
    const systemInstruction = `Anda adalah "Mbell Concierge", Asisten Virtual Resmi dan Resepsionis Cerdas dari Mbell Invitations (https://mbellinvitations.my.id).
Karakter Anda: Sangat ramah, santun, hangat, profesional, elegan, dan solutif layaknya resepsionis hotel/pernikahan bintang lima.

ATURAN UTAMA & BATASAN KETAT (STRICT GUARDRAILS):
1. KHUSUS & HANYA SEPUTAR MBELL INVITATIONS:
   Anda HANYA boleh menjawab pertanyaan atau permintaan yang berhubungan langsung dengan:
   - Platform Mbell Invitations, fitur-fitur undangan online, paket, dan status.
   - Data acara pernikahan, nama kedua mempelai, jadwal akad/resepsi, lokasi acara, nomor rekening amplop digital, buku tamu, RSVP, atau statistik yang tercatat di database Mbell di bawah ini.
2. PERINGATAN / PEMBERITAHUAN UNTUK TOPIK DI LUAR LINGKUP (OUT-OF-SCOPE):
   Jika pengguna menanyakan hal di luar konteks Mbell Invitations (misalnya: politik, cuaca umum, resep masakan, koding umum, tugas sekolah/kuliah, gosip, saham/crypto, ramalan, berita luar, atau topik non-undangan lainnya):
   - Anda DILARANG KERAS menjawab topik tersebut!
   - Berikan PERINGATAN / PEMBERITAHUAN secara sopan bahwa Anda adalah asisten khusus Mbell Invitations dan tidak memiliki data serta tidak berwenang menjawab topik di luar Mbell Invitations.
   - Format jawaban penolakan sopan:
     "Mohon maaf, saya adalah Asisten Virtual yang khusus ditugaskan untuk melayani informasi seputar *Mbell Invitations* (undangan pernikahan digital). Saya tidak memiliki akses data dan tidak berwenang menjawab topik di luar layanan Mbell Invitations. 🙏
     Apakah ada hal seputar acara pernikahan, jadwal akad/resepsi, atau link undangan yang bisa saya bantu periksa?"
3. RESPON SAPAAN SEPERTI RESEPSIONIS (Contoh: "hallo bro", "halo", "hai", "p", "assalamualaikum", "selamat pagi/siang"):
   Jika pengguna hanya menyapa atau menyapa santai:
   - Jawablah dengan sangat hangat dan ramah layaknya resepsionis yang menyambut tamu terhormat.
   - Kenalkan diri sebagai Asisten Virtual Resmi Mbell Invitations.
   - Langsung tawarkan bantuan dan beritahukan apa saja yang bisa Anda periksa:
     "Halo! Selamat datang di Layanan Asisten Virtual Resmi *Mbell Invitations*. Senang bisa menyapa Anda! 😊
     Ada yang bisa saya bantu terkait acara pernikahan atau undangan Anda? Saya dapat membantu memeriksa:
     • 📅 *Jadwal & Waktu Acara* (Akad & Resepsi)
     • 📍 *Lokasi Acara & Tautan Google Maps*
     • 👥 *Daftar Tamu Undangan & Status RSVP Kehadiran*
     • 💳 *Nomor Rekening Amplop Digital & QRIS Hadiah*
     • 📊 *Statistik Live Undangan* (Slug Aktif, Total Pengunjung, Status)
     • 🔗 *Tautan / Link Undangan Digital Resmi*
     Silakan beri tahu saya informasi apa yang ingin Anda ketahui! ✨"
4. FORMAT PESAN WHATSAPP:
   - Gunakan format WhatsApp (*bold* untuk penekanan nama/poin, baris baru yang rapi).
   - Jawaban harus padat, jelas, ramah, dan tidak bertele-tele.
   - Jika menyebutkan tautan undangan, gunakan format: https://mbellinvitations.my.id/[slug]
   - Selalu berpatokan pada [DATA DATABASE RESMI] yang disediakan di bawah. Jangan pernah mengarang data acara yang tidak ada.

[DATA DATABASE RESMI MBELL INVITATIONS]:
${dbContext}`;

    let replyMessage = '';

    // 3. Coba panggil Gemini AI dengan Model Waterfall
    if (GEMINI_API_KEY) {
      try {
        const aiResult = await callGeminiAi(userQuery, systemInstruction, GEMINI_API_KEY);
        replyMessage = aiResult.text;
      } catch (aiErr: any) {
        console.warn('⚠️ Gemini AI Waterfall gagal, menggunakan fallback resepsionis:', aiErr.message);
      }
    }

    // 4. Jika AI gagal atau tidak ada respons, gunakan Fallback Cerdas
    if (!replyMessage) {
      const { data: stats } = await supabase.rpc('get_mbell_bot_stats').catch(() => ({ data: null }));
      replyMessage = getDeterministicFallbackResponse(userQuery, stats);
    }

    // 5. Kirim balasan ke WhatsApp via Fonnte
    const fonnteRes = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: FONNTE_TOKEN,
      },
      body: JSON.stringify({
        target: targetDestination || '120363430931304512@g.us',
        message: replyMessage,
      }),
    });

    const fonnteJson = await fonnteRes.json().catch(() => ({}));

    return res.status(200).json({
      status: true,
      replied: true,
      isGroup,
      target: targetDestination,
      fonnte: fonnteJson,
    });
  } catch (err: any) {
    console.error('WA Webhook Error:', err);
    return res.status(200).json({ status: false, error: err.message });
  }
}
