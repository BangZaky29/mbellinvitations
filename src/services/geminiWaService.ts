// =========================================================================
// GEMINI WA AI SERVICE — Google AI Studio WhatsApp Broadcast Generator
// Arsitektur Waterfall Switching (Auto Fallback Model Cerdas -> Ringan -> Template Manual)
// =========================================================================

import { DEFAULT_WA_TEMPLATE } from '../components/dashboard/guest-list/constants';

/**
 * Daftar model Google AI Studio gratis terurut dari kemampuan tertinggi hingga teringan.
 * Jika model utama terkena rate limit / token harian habis (429/503), sistem beralih otomatis.
 */
export const GEMINI_MODELS_WATERFALL = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemma-4-31b-it',
  'gemini-2.5-flash',
] as const;

export type GeminiModelName = (typeof GEMINI_MODELS_WATERFALL)[number];

export interface GenerateWaParams {
  guestName: string;
  coupleNames?: string;
  invitationUrl: string;
  guestCode?: string;
  forceRegenerate?: boolean;
}

export interface GenerateWaResult {
  text: string;
  usedModel: GeminiModelName | 'default_template';
  isAi: boolean;
  failedModels: string[];
}

// In-Memory & LocalStorage Cache (Mencegah pemborosan token untuk tamu yang sama)
const CACHE_PREFIX = 'mbell_ai_wa_cache_';

function getCache(key: string): string | null {
  try {
    return localStorage.getItem(CACHE_PREFIX + key);
  } catch {
    return null;
  }
}

function setCache(key: string, value: string): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, value);
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Format teks menggunakan template bawaan jika semua model AI tidak tersedia.
 */
export function formatFallbackTemplate(
  guestName: string,
  coupleNames: string = 'Mempelai Pria & Wanita',
  invitationUrl: string
): string {
  return DEFAULT_WA_TEMPLATE
    .replace(/{nama_tamu}/g, guestName)
    .replace(/{nama_mempelai}/g, coupleNames)
    .replace(/{link_undangan}/g, invitationUrl);
}

/**
 * Ambil API Key Google AI Studio dari environment variable atau localStorage.
 */
export function getGeminiApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  try {
    const customKey = localStorage.getItem('mbell_custom_gemini_key');
    if (customKey && customKey.trim()) {
      return customKey.trim();
    }
  } catch {}
  return '';
}

/**
 * Panggil Google AI Studio REST API untuk model tertentu dengan timeout AbortController.
 */
async function callGeminiGenerateContent(
  model: string,
  apiKey: string,
  prompt: string,
  timeoutMs: number = 7500
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
          topP: 0.9,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      const errorMessage =
        errBody?.error?.message || `HTTP ${response.status} (${response.statusText})`;
      throw new Error(`Model ${model} gagal: ${errorMessage} (status: ${response.status})`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText || typeof generatedText !== 'string' || !generatedText.trim()) {
      throw new Error(`Model ${model} mengembalikan respons kosong.`);
    }

    return generatedText.trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generate pesan WhatsApp pengantar undangan dengan AI & Model Waterfall Switching.
 * - Mengutamakan model terbaik (gemini-3.8-flash)
 * - Jika token harian habis / error (429/503), otomatis switch ke model berikutnya
 * - Jika semua model AI gagal / offline, menggunakan DEFAULT_WA_TEMPLATE asli
 */
export async function generateWaInvitationMessage({
  guestName,
  coupleNames = 'Mempelai Pria & Wanita',
  invitationUrl,
  guestCode = '',
  forceRegenerate = false,
}: GenerateWaParams): Promise<GenerateWaResult> {
  const cacheKey = `${invitationUrl}_${guestName}_${guestCode}`;

  // 1. Cek cache lokal jika tidak dipaksa regenerate
  if (!forceRegenerate) {
    const cachedText = getCache(cacheKey);
    if (cachedText) {
      return {
        text: cachedText,
        usedModel: 'gemini-3.8-flash',
        isAi: true,
        failedModels: [],
      };
    }
  }

  // 2. Susun prompt ringkas, efisien, dan informatif
  const prompt = `Anda adalah asisten penulis undangan pernikahan islami dan modern khas Indonesia yang elegan, sopan, dan hangat.
Tuliskan 1 pesan pengantar WhatsApp undangan pernikahan yang SINGKAT, EFISIEN, dan INFORMATIF (sekitar 50 - 75 kata).

Informasi Acara:
- Nama Tamu: ${guestName}
- Nama Mempelai: ${coupleNames}
- Tautan Undangan Resmi: ${invitationUrl}

Panduan Penulisan WhatsApp:
1. Mulai dengan salam sopan (contoh: Assalamu'alaikum Wr. Wb. / Salam Sejahtera) dan sebut nama tamu dengan hormat: *${guestName}*.
2. Tuliskan kalimat pengantar yang hangat dan tulus bahwa kedua mempelai (*${coupleNames}*) mengundang beliau untuk hadir dan memberikan doa restu.
3. Cantumkan tautan undangan resmi berikut secara UTUH pada baris terpisah:
${invitationUrl}
4. Akhiri dengan ucapan terima kasih singkat yang penuh rasa hormat.
5. Gunakan format WhatsApp (*bold* untuk nama mempelai & nama tamu). Jangan gunakan markdown header (#) atau format berlebihan.
6. PENTING: Tuliskan HANYA isi pesan WhatsApp tersebut, tanpa kalimat pembuka atau penutup dari Anda.`;

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn('⚠️ [Gemini AI WA] VITE_GEMINI_API_KEY belum disetel. Menggunakan template bawaan.');
    return {
      text: formatFallbackTemplate(guestName, coupleNames, invitationUrl),
      usedModel: 'default_template',
      isAi: false,
      failedModels: ['No API Key configured'],
    };
  }

  const failedModels: string[] = [];

  // 3. Iterasi Waterfall Switching Model
  for (const model of GEMINI_MODELS_WATERFALL) {
    try {
      console.log(`🤖 [Gemini AI WA] Mencoba generate dengan model: ${model}...`);
      const aiResponse = await callGeminiGenerateContent(model, apiKey, prompt);

      // Pastikan tautan undangan tetap ada di dalam teks
      let finalText = aiResponse;
      if (!finalText.includes(invitationUrl)) {
        finalText = `${finalText}\n\nTautan Undangan:\n${invitationUrl}`;
      }

      console.log(`✅ [Gemini AI WA] Berhasil digenerate oleh model: ${model}`);
      setCache(cacheKey, finalText);

      return {
        text: finalText,
        usedModel: model,
        isAi: true,
        failedModels,
      };
    } catch (err: any) {
      console.warn(`⚠️ [Gemini AI WA] Model ${model} gagal:`, err.message || err);
      failedModels.push(`${model}: ${err.message || 'Error'}`);
      // Lanjut otomatis ke model waterfall berikutnya
    }
  }

  // 4. Ultimate Fallback jika semua model AI gagal
  console.warn('⚠️ [Gemini AI WA] Seluruh model AI tidak tersedia. Menggunakan template bawaan.');
  const fallbackText = formatFallbackTemplate(guestName, coupleNames, invitationUrl);

  return {
    text: fallbackText,
    usedModel: 'default_template',
    isAi: false,
    failedModels,
  };
}

/**
 * Hapus cache AI WA untuk tamu tertentu jika ingin memaksa generate ulang.
 */
export function invalidateAiWaCache(invitationUrl: string, guestName: string, guestCode: string = ''): void {
  try {
    const cacheKey = `${invitationUrl}_${guestName}_${guestCode}`;
    localStorage.removeItem(CACHE_PREFIX + cacheKey);
  } catch {}
}
