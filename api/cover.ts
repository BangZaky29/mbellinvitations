export const config = {
  runtime: 'edge',
};

declare const process: {
  env: Record<string, string | undefined>;
};

// Map fallback banner per tema (1200 x 630 px)
const THEME_BANNER_MAP: Record<string, string> = {
  modern: '/og-banners/og-modern.jpg',
  template1: '/og-banners/og-modern.jpg',
  rustic: '/og-banners/og-rustic.jpg',
  template2: '/og-banners/og-rustic.jpg',
  jawa: '/og-banners/og-jawa.jpg',
  template3: '/og-banners/og-jawa.jpg',
  islami: '/og-banners/og-islami.jpg',
  template4: '/og-banners/og-islami.jpg',
  luxury: '/og-banners/og-luxury.jpg',
  template5: '/og-banners/og-luxury.jpg',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const slug = (url.searchParams.get('slug') || '').toLowerCase().trim();
  const origin = url.origin;

  // Supabase Credentials
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
  const SUPABASE_ANON_KEY =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYnZua3d4d3ZmZmdocmR4bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODY1NTIsImV4cCI6MjA4NTA2MjU1Mn0.lT6ZSx9ZEwrLu-3olklSCr5cl_lq9xIcimFY8HBSKzg';

  let rawCover: string | null = null;
  let themeId = 'modern';

  if (slug) {
    try {
      let record: any = null;

      // Dual-fetch: invitations dan user_templates secara paralel
      const [invRes, utRes] = await Promise.all([
        fetch(
          `${SUPABASE_URL}/rest/v1/invitations?slug=eq.${encodeURIComponent(slug)}&select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        ).catch(() => null),
        fetch(
          `${SUPABASE_URL}/rest/v1/user_templates?slug=eq.${encodeURIComponent(slug)}&select=*&order=updated_at.desc&limit=1`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        ).catch(() => null),
      ]);

      let invRecord: any = null;
      if (invRes && invRes.ok) {
        const invRows = await invRes.json();
        if (Array.isArray(invRows) && invRows.length > 0) {
          invRecord = invRows[0];
        }
      }

      let utRecord: any = null;
      if (utRes && utRes.ok) {
        const utRows = await utRes.json();
        if (Array.isArray(utRows) && utRows.length > 0) {
          utRecord = utRows[0];
        }
      }

      // Pilih record yang paling mutakhir (newest updated_at) agar foto sampul live selalu sinkron
      if (invRecord && utRecord) {
        const invTime = invRecord.updated_at ? new Date(invRecord.updated_at).getTime() : 0;
        const utTime = utRecord.updated_at ? new Date(utRecord.updated_at).getTime() : 0;
        record = utTime >= invTime ? utRecord : invRecord;
      } else {
        record = invRecord || utRecord;
      }

      if (record) {
        let content = record.content;
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content);
          } catch {
            content = {};
          }
        }

        themeId = (content?.theme_id || record.theme_id || record.template_id || 'modern').toLowerCase();
        rawCover = content?.cover_image || content?.couple_photo || record.thumbnail_url || null;
      }
    } catch (err) {
      console.warn('Cover API fetch error:', err);
    }
  }

  // Jika cover adalah Base64 Data URL (data:image/webp;base64,... atau data:image/jpeg;base64,...)
  if (rawCover && typeof rawCover === 'string' && rawCover.startsWith('data:image/')) {
    try {
      const match = rawCover.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const binaryStr = atob(base64Data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        return new Response(bytes, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': String(bytes.length),
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        });
      }
    } catch (decodeErr) {
      console.warn('Cover API base64 decode error:', decodeErr);
    }
  }

  // Jika cover adalah URL HTTP eksternal (misal Unsplash atau Supabase storage)
  if (rawCover && typeof rawCover === 'string' && (rawCover.startsWith('http://') || rawCover.startsWith('https://'))) {
    return Response.redirect(rawCover, 302);
  }

  // Fallback ke banner nuansa tema resmi
  const fallbackBanner = THEME_BANNER_MAP[themeId] || '/og-banners/og-modern.jpg';
  return Response.redirect(`${origin}${fallbackBanner}`, 302);
}
