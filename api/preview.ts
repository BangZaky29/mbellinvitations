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

const THEME_SUBTITLE_MAP: Record<string, string> = {
  jawa: 'Pawiwahan Ageng Adat Jawa Kasunanan',
  template3: 'Pawiwahan Ageng Adat Jawa Kasunanan',
  rustic: 'The Rustic & Botanical Wedding Celebration',
  template2: 'The Rustic & Botanical Wedding Celebration',
  islami: 'Walimatul Ursy Islami Penuh Berkah',
  template4: 'Walimatul Ursy Islami Penuh Berkah',
  luxury: 'The Royal Grand Luxury Wedding',
  template5: 'The Royal Grand Luxury Wedding',
  modern: 'The Modern Contemporary Wedding',
  template1: 'The Modern Contemporary Wedding',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const slug = (url.searchParams.get('slug') || '').toLowerCase().trim();
  const origin = url.origin;

  // Supabase Credentials
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
  const SUPABASE_ANON_KEY =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYnZua3d4d3ZmZmdocmR4bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODY1NTIsImV4cCI6MjA4NTA2MjU1Mn0.lT6ZSx9ZEwrLu-3olklSCr5cl_lq9xIcimFY8HBSKzg';

  let html = '';
  try {
    const baseRes = await fetch(new URL('/index.html', req.url));
    if (baseRes.ok) {
      html = await baseRes.text();
    }
  } catch (e) {
    console.warn('Failed to fetch base index.html:', e);
  }

  // Jika index.html tidak didapatkan, buat template cadangan
  if (!html) {
    html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>mbell invitations</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }

  // Default Fallbacks
  let coupleTitle = 'Raditya & Jessica';
  let weddingDate = 'Sabtu, 24 Oktober 2026';
  let themeId = 'modern';
  let venueName = 'The Glasshouse Grand Ballroom';
  let customCover = '';

  // 1. Fetch data dari Supabase jika ada slug
  if (slug) {
    try {
      let record: any = null;

      // Coba tabel invitations
      const invRes = await fetch(
        `${SUPABASE_URL}/rest/v1/invitations?slug=eq.${encodeURIComponent(slug)}&select=*`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (invRes.ok) {
        const invRows = await invRes.json();
        if (Array.isArray(invRows) && invRows.length > 0) {
          record = invRows[0];
        }
      }

      // Coba user_templates jika invitations belum ada atau kosong
      if (!record || !record.content) {
        const utRes = await fetch(
          `${SUPABASE_URL}/rest/v1/user_templates?slug=eq.${encodeURIComponent(slug)}&select=*&order=updated_at.desc&limit=1`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (utRes.ok) {
          const utRows = await utRes.json();
          if (Array.isArray(utRows) && utRows.length > 0) {
            record = utRows[0];
          }
        }
      }

      // Ekstraksi data konten undangan
      if (record) {
        let content = record.content;
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content);
          } catch {
            content = {};
          }
        }

        const groom = content?.groom?.name || content?.groom?.full_name || 'Mempelai Pria';
        const bride = content?.bride?.name || content?.bride?.full_name || 'Mempelai Wanita';
        const isBrideFirst = Boolean(content?.is_bride_first);

        coupleTitle = isBrideFirst ? `${bride} & ${groom}` : `${groom} & ${bride}`;
        weddingDate =
          content?.wedding_date_display ||
          (content?.wedding_date_iso
            ? new Date(content.wedding_date_iso).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : weddingDate);

        themeId = (content?.theme_id || record.theme_id || record.template_id || 'modern').toLowerCase();

        // Venue name
        if (Array.isArray(content?.events) && content.events.length > 0) {
          venueName = content.events[0]?.venue_name || venueName;
        } else if (content?.events?.akad?.venue_name) {
          venueName = content.events.akad.venue_name;
        }

        // Cover foto pasangan jika ada
        const rawCover = content?.cover_image || content?.couple_photo || record.thumbnail_url;
        if (rawCover && typeof rawCover === 'string') {
          if (rawCover.startsWith('http://') || rawCover.startsWith('https://')) {
            customCover = rawCover;
          } else if (rawCover.startsWith('data:image/')) {
            customCover = `${origin}/api/cover?slug=${encodeURIComponent(slug)}&v=${record?.updated_at ? new Date(record.updated_at).getTime() : Date.now()}`;
          }
        }
      } else {
        // Fallback jika slug tidak ditemukan di database, parsing nama dari format slug (misal: "zaky-bella")
        const parts = slug.split('-');
        if (parts.length >= 2) {
          const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
          coupleTitle = `${cap(parts[0])} & ${cap(parts[1])}`;
        }
      }
    } catch (dbErr) {
      console.warn('Supabase fetch error in OG Preview:', dbErr);
    }
  }

  // Tentukan gambar OG: Prioritas 1 Foto Pengantin Asli via /api/cover, Prioritas 2 Banner Nuansa Tema
  const themeBannerRel = THEME_BANNER_MAP[themeId] || '/og-banners/og-modern.jpg';
  const resolvedOgImage = customCover || (slug ? `${origin}/api/cover?slug=${encodeURIComponent(slug)}` : `${origin}${themeBannerRel}`);

  const themeSubtitle = THEME_SUBTITLE_MAP[themeId] || 'Undangan Pernikahan Eksklusif';
  const pageTitle = `The Wedding of ${coupleTitle} — ${themeSubtitle} | mbell invitations`;
  const pageDesc = `Kami mengundang Anda untuk merayakan hari bahagia pernikahan ${coupleTitle} pada ${weddingDate} di ${venueName}. Buka undangan digital resmi di sini.`;
  const canonicalUrl = `${origin}/${slug}`;

  // Replace atau inject meta tags
  let modifiedHtml = html;

  // 1. Title Tag
  if (modifiedHtml.includes('<title>')) {
    modifiedHtml = modifiedHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);
  } else {
    modifiedHtml = modifiedHtml.replace('</head>', `  <title>${escapeHtml(pageTitle)}</title>\n</head>`);
  }

  // 2. Meta tags helper
  const replaceOrAddMeta = (attr: string, key: string, content: string) => {
    const regex = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
    const replacement = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
    if (regex.test(modifiedHtml)) {
      modifiedHtml = modifiedHtml.replace(regex, replacement);
    } else {
      modifiedHtml = modifiedHtml.replace('</head>', `  ${replacement}\n</head>`);
    }
  };

  // Open Graph Tags
  replaceOrAddMeta('property', 'og:title', pageTitle);
  replaceOrAddMeta('property', 'og:description', pageDesc);
  replaceOrAddMeta('property', 'og:image', resolvedOgImage);
  replaceOrAddMeta('property', 'og:image:secure_url', resolvedOgImage);
  replaceOrAddMeta('property', 'og:url', canonicalUrl);
  replaceOrAddMeta('property', 'og:type', 'website');
  replaceOrAddMeta('property', 'og:site_name', 'mbell invitations');

  // Twitter Card Tags
  replaceOrAddMeta('name', 'twitter:card', 'summary_large_image');
  replaceOrAddMeta('name', 'twitter:title', pageTitle);
  replaceOrAddMeta('name', 'twitter:description', pageDesc);
  replaceOrAddMeta('name', 'twitter:image', resolvedOgImage);
  replaceOrAddMeta('name', 'twitter:url', canonicalUrl);

  // General Description & Canonical
  replaceOrAddMeta('name', 'description', pageDesc);

  return new Response(modifiedHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
