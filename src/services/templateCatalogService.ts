import { supabase } from '../lib/supabase/client';

export interface ThemeOption {
  id: string;
  slug?: string;
  name: string;
  subtitle: string;
  styleTag: string;
  coupleSample: string;
  badge?: string;
  accentColor: string;
  icon: string;
  bgClass: string;
  category: 'adat' | 'modern';
  price: number;
  originalPrice: number;
  priceDisplay: string;
  originalPriceDisplay: string;
  badgePrice: string;
  badgeOriginal: string;
  mockupUrl?: string | null;
  thumbnailUrl?: string | null;
}

export interface DbTemplateRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  description?: string | null;
  thumbnail_url?: string | null;
  mockup_url?: string | null;
  preview_badge?: string | null;
  accent_color?: string | null;
  default_audio_url?: string | null;
  is_active?: boolean;
  is_premium?: boolean;
  price: number;
  original_price: number;
}

export interface DynamicPriceInfo {
  price: number;
  originalPrice: number;
  priceDisplay: string;
  originalPriceDisplay: string;
  badgePrice: string;
  badgeOriginal: string;
  category: 'adat' | 'modern';
  categoryLabel: string;
}



// Preset styling visual mockup (icon, background card, couple sample) untuk card preview
export const TEMPLATE_VISUAL_PRESETS: Record<
  string,
  {
    icon: string;
    bgClass: string;
    styleTag: string;
    coupleSample: string;
  }
> = {
  template1: {
    icon: 'flare',
    bgClass: 'bg-[#FAF8F5] text-stone-900 border-stone-300',
    styleTag: 'Editorial Minimalis',
    coupleSample: 'Dimas & Sarah',
  },
  'modern-arch': {
    icon: 'flare',
    bgClass: 'bg-[#FAF8F5] text-stone-900 border-stone-300',
    styleTag: 'Editorial Minimalis',
    coupleSample: 'Dimas & Sarah',
  },
  template2: {
    icon: 'local_florist',
    bgClass: 'bg-gradient-to-b from-[#FBF9F5] to-[#EFE8DE] text-[#1E2E22] border-[#DECFBD]',
    styleTag: 'Botanical Earthy',
    coupleSample: 'Romeo & Juliet',
  },
  'rustic-casual': {
    icon: 'local_florist',
    bgClass: 'bg-gradient-to-b from-[#FBF9F5] to-[#EFE8DE] text-[#1E2E22] border-[#DECFBD]',
    styleTag: 'Botanical Earthy',
    coupleSample: 'Romeo & Juliet',
  },
  template3: {
    icon: 'architecture',
    bgClass: 'bg-[#1C1A17] text-[#C5A059] border-amber-900/50',
    styleTag: 'Batik & Budaya',
    coupleSample: 'Arya & Dian',
  },
  'adat-jawa': {
    icon: 'architecture',
    bgClass: 'bg-[#1C1A17] text-[#C5A059] border-amber-900/50',
    styleTag: 'Batik & Budaya',
    coupleSample: 'Arya & Dian',
  },
  template4: {
    icon: 'mosque',
    bgClass: 'bg-[#FDF8F9] text-[#5E2832] border-rose-200',
    styleTag: 'Kubah Maroko & Doa',
    coupleSample: 'Rayhan & Yasmin',
  },
  'islami-maroko': {
    icon: 'mosque',
    bgClass: 'bg-[#FDF8F9] text-[#5E2832] border-rose-200',
    styleTag: 'Kubah Maroko & Doa',
    coupleSample: 'Rayhan & Yasmin',
  },
  template5: {
    icon: 'hotel_class',
    bgClass: 'bg-[#121316] text-[#E2C792] border-amber-600/40',
    styleTag: 'Gold Foil VIP',
    coupleSample: 'Romeo & Juliet A.',
  },
  'luxury-glamour': {
    icon: 'hotel_class',
    bgClass: 'bg-[#121316] text-[#E2C792] border-amber-600/40',
    styleTag: 'Gold Foil VIP',
    coupleSample: 'Romeo & Juliet A.',
  },
  template6: {
    icon: 'local_florist',
    bgClass: 'bg-[#FBF9F6] text-[#775A19] border-[#C5A059]/40',
    styleTag: 'Tradisi Parahyangan',
    coupleSample: 'Raditya & Jessica',
  },
  'adat-sunda': {
    icon: 'local_florist',
    bgClass: 'bg-[#FBF9F6] text-[#775A19] border-[#C5A059]/40',
    styleTag: 'Tradisi Parahyangan',
    coupleSample: 'Raditya & Jessica',
  },
  template7: {
    icon: 'temple_buddhist',
    bgClass: 'bg-[#1B0609] text-[#D4AF37] border-[#D4AF37]/50',
    styleTag: 'Tradisi Ranah Minang',
    coupleSample: 'Farhan & Nadia',
  },
  'adat-minang': {
    icon: 'temple_buddhist',
    bgClass: 'bg-[#1B0609] text-[#D4AF37] border-[#D4AF37]/50',
    styleTag: 'Tradisi Ranah Minang',
    coupleSample: 'Farhan & Nadia',
  },
  template8: {
    icon: 'church',
    bgClass: 'bg-[#19120E] text-[#EAC16E] border-[#EAC16E]/40',
    styleTag: 'Adat Batak Toba',
    coupleSample: 'Johannes & Melisa',
  },
  'adat-batak': {
    icon: 'church',
    bgClass: 'bg-[#19120E] text-[#EAC16E] border-[#EAC16E]/40',
    styleTag: 'Adat Batak Toba',
    coupleSample: 'Johannes & Melisa',
  },
  template11: {
    icon: 'sports_martial_arts',
    bgClass: 'bg-[#410403] text-[#FED65B] border-[#FED65B]/40',
    styleTag: 'Adat Betawi Palang Pintu',
    coupleSample: 'Rizky & Fatimah',
  },
  'adat-betawi': {
    icon: 'sports_martial_arts',
    bgClass: 'bg-[#410403] text-[#FED65B] border-[#FED65B]/40',
    styleTag: 'Adat Betawi Palang Pintu',
    coupleSample: 'Rizky & Fatimah',
  },
  template10: {
    icon: 'crown',
    bgClass: 'bg-[#00170E] text-[#F2CA50] border-[#F2CA50]/40',
    styleTag: 'Adat Bugis Makassar',
    coupleSample: 'Andi Fauzan & Tenri',
  },
  'adat-bugis': {
    icon: 'crown',
    bgClass: 'bg-[#00170E] text-[#F2CA50] border-[#F2CA50]/40',
    styleTag: 'Adat Bugis Makassar',
    coupleSample: 'Andi Fauzan & Tenri',
  },
  bali: {
    icon: 'temple_hindu',
    bgClass: 'bg-[#411710] text-[#FED65B] border-[#D4AF37]/40',
    styleTag: 'Adat Bali Royal',
    coupleSample: 'Bagus Arya & Bulan',
  },
  'adat-bali': {
    icon: 'temple_hindu',
    bgClass: 'bg-[#411710] text-[#FED65B] border-[#D4AF37]/40',
    styleTag: 'Adat Bali Royal',
    coupleSample: 'Bagus Arya & Bulan',
  },
  template12: {
    icon: 'temple_hindu',
    bgClass: 'bg-[#411710] text-[#FED65B] border-[#D4AF37]/40',
    styleTag: 'Adat Bali Royal',
    coupleSample: 'Bagus Arya & Bulan',
  },
  template11_bali: {
    icon: 'temple_hindu',
    bgClass: 'bg-[#411710] text-[#FED65B] border-[#D4AF37]/40',
    styleTag: 'Adat Bali Royal',
    coupleSample: 'Bagus Arya & Bulan',
  },
  palembang: {
    icon: 'crown',
    bgClass: 'bg-[#4A0E12] text-[#FFD57A] border-[#FFD57A]/40',
    styleTag: 'Adat Palembang',
    coupleSample: 'M. Farhan & Nyimas',
  },
  'adat-palembang': {
    icon: 'crown',
    bgClass: 'bg-[#4A0E12] text-[#FFD57A] border-[#FFD57A]/40',
    styleTag: 'Adat Palembang',
    coupleSample: 'M. Farhan & Nyimas',
  },
  template13: {
    icon: 'crown',
    bgClass: 'bg-[#4A0E12] text-[#FFD57A] border-[#FFD57A]/40',
    styleTag: 'Adat Palembang',
    coupleSample: 'M. Farhan & Nyimas',
  },
  template12_palembang: {
    icon: 'crown',
    bgClass: 'bg-[#4A0E12] text-[#FFD57A] border-[#FFD57A]/40',
    styleTag: 'Adat Palembang',
    coupleSample: 'M. Farhan & Nyimas',
  },
};

export const SUPABASE_MOCKUP_BASE_URL =
  'https://fsbvnkwxwvffghrdxnxr.supabase.co/storage/v1/object/public/invitations/mock-up_Template';

// Seed default fallback jika Supabase belum selesai fetch pertama kali
export const DEFAULT_CATALOG_SEEDS: DbTemplateRecord[] = [
  {
    id: 'template13',
    slug: 'adat-palembang',
    name: 'Adat Palembang Sriwijaya',
    category: 'adat',
    description: 'Kemegahan Kesultanan Palembang Darussalam, Busana Aesan Gede, Songket Lepus Emas & Rumah Limas',
    preview_badge: 'New Royal Adat',
    accent_color: '#FFD57A',
    is_active: true,
    is_premium: true,
    price: 79000,
    original_price: 99000,
    mockup_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp',
  },
  {
    id: 'template12',
    slug: 'adat-bali',
    name: 'Adat Bali Royal Pawiwahan',
    category: 'adat',
    description: 'Pawiwahan Ageng Hindu Bali, Sloka Rgveda, Wastra Endek Prada & Gerbang Candi Bentar',
    preview_badge: 'New Royal Adat',
    accent_color: '#D4AF37',
    is_active: true,
    is_premium: true,
    price: 79000,
    original_price: 99000,
    mockup_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R',
  },
  {
    id: 'template10',
    slug: 'adat-bugis',
    name: 'Adat Bugis Makassar Royal',
    category: 'adat',
    description: 'Tudang Bottung, Malam Mappacci & Baju Bodo Kebesaran Adat Bugis-Makassar',
    preview_badge: 'New Royal Adat',
    accent_color: '#F2CA50',
    is_active: true,
    is_premium: true,
    price: 79000,
    original_price: 99000,
    mockup_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0',
  },
  {
    id: 'template11',
    slug: 'adat-betawi',
    name: 'Adat Betawi Palang Pintu',
    category: 'adat',
    description: 'Kembang Kelapa, Palang Pintu & Busana Pengantin Abang None',
    preview_badge: 'New Royal Adat',
    accent_color: '#FED65B',
    is_active: true,
    is_premium: true,
    price: 79000,
    original_price: 99000,
    mockup_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI',
  },
  {
    id: 'template8',
    slug: 'adat-batak',
    name: 'Adat Batak Toba Royal',
    category: 'adat',
    description: 'Pemberkatan Nikah Kudus & Pesta Adat Batak Toba Mangulosi',
    preview_badge: 'Royal Adat',
    accent_color: '#C8A253',
    is_active: true,
    is_premium: true,
    price: 79000,
    original_price: 99000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template8-batak.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template8-batak.jpg`,
  },
  {
    id: 'template6',
    slug: 'adat-sunda',
    name: 'Adat Sunda Siger',
    category: 'adat',
    description: 'Mahkota Siger & Ronce Melati Tradisi Parahyangan',
    preview_badge: 'Royal Adat',
    accent_color: '#C5A059',
    is_active: true,
    is_premium: false,
    price: 79000,
    original_price: 99000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template6-sunda-siger.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template6-sunda-siger.jpg`,
  },
  {
    id: 'template7',
    slug: 'adat-minang',
    name: 'Adat Minang Baralek Gadang',
    category: 'adat',
    description: 'Suntiang Gadang & Songket Silungkang',
    preview_badge: 'New Royal',
    accent_color: '#D4AF37',
    is_active: true,
    is_premium: true,
    price: 79000,
    original_price: 99000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template_7_Minang.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template_7_Minang.jpg`,
  },
  {
    id: 'template3',
    slug: 'adat-jawa',
    name: 'Adat Jawa Royal Keraton',
    category: 'adat',
    description: 'Tradisi luhur Keraton Jawa beraksen Gunungan Wayang emas prada dan motif Kawung klasik nan agung.',
    preview_badge: 'Best Choice',
    accent_color: '#C5A059',
    is_active: true,
    is_premium: false,
    price: 79000,
    original_price: 99000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template3-jawa.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template3-jawa.jpg`,
  },
  {
    id: 'template4',
    slug: 'islami-maroko',
    name: 'Islami Kubah Maroko',
    category: 'modern',
    description: 'Sentuhan arsitektur kubah lengkung Maroko bernuansa burgundy hangat, ornamen arabesque, dan kaligrafi suci.',
    preview_badge: 'Exclusive',
    accent_color: '#5E2832',
    is_active: true,
    is_premium: false,
    price: 49000,
    original_price: 79000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template4-islami.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template4-islami.jpg`,
  },
  {
    id: 'template1',
    slug: 'modern-arch',
    name: 'Modern Editorial Arch',
    category: 'modern',
    description: 'Gaya tipografi editorial majalah bernuansa champagne emas dan bingkai arch melengkung mewah.',
    preview_badge: 'Trending',
    accent_color: '#D4AF37',
    is_active: true,
    is_premium: false,
    price: 49000,
    original_price: 79000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template1-modern.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template1-modern.jpg`,
  },
  {
    id: 'template2',
    slug: 'rustic-casual',
    name: 'Rustic Earthy Sage',
    category: 'modern',
    description: 'Nuansa hangat botanical dedaunan sage green, terracotta earthy, dan estetika casual santai.',
    preview_badge: 'Popular',
    accent_color: '#556B2F',
    is_active: true,
    is_premium: false,
    price: 49000,
    original_price: 79000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template2-rustic.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template2-rustic.jpg`,
  },
  {
    id: 'template5',
    slug: 'luxury-glamour',
    name: 'Luxury Midnight Gold',
    category: 'modern',
    description: 'Kemewahan ultra-eksklusif tema gelap deep charcoal & midnight navy dipadu shimmer emas mengilap.',
    preview_badge: 'VIP Only',
    accent_color: '#E2C792',
    is_active: true,
    is_premium: true,
    price: 49000,
    original_price: 79000,
    mockup_url: `${SUPABASE_MOCKUP_BASE_URL}/template5-luxury.jpg`,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE_URL}/template5-luxury.jpg`,
  },
];

export function formatTemplatePrice(price: number, originalPrice: number = 79000) {
  const safePrice = Number(price) > 0 ? Number(price) : 49000;
  const safeOrig = Number(originalPrice) > 0 ? Number(originalPrice) : 79000;
  return {
    price: safePrice,
    originalPrice: safeOrig,
    priceDisplay: `Rp ${safePrice.toLocaleString('id-ID')}`,
    originalPriceDisplay: `Rp ${safeOrig.toLocaleString('id-ID')}`,
    badgePrice: `Rp ${Math.round(safePrice / 1000)}rb`,
    badgeOriginal: `Rp ${Math.round(safeOrig / 1000)}rb`,
  };
}

export function normalizeCategory(cat?: string | null): 'adat' | 'modern' {
  const lower = (cat || '').toLowerCase().trim();
  if (lower === 'adat') return 'adat';
  return 'modern';
}

/**
 * Menggabungkan katalog database dengan seed frontend bawaan.
 * Memastikan template baru yang telah diimplementasikan di kode (misal: template11 Betawi)
 * langsung tampil di UI dashboard meskipun barisnya belum di-insert di tabel SQL Supabase.
 */
function mergeWithSeeds(records: DbTemplateRecord[]): DbTemplateRecord[] {
  if (!records || records.length === 0) return DEFAULT_CATALOG_SEEDS;

  const result = [...records];
  for (const seed of DEFAULT_CATALOG_SEEDS) {
    const exists = result.some(
      (item) =>
        item.id?.toLowerCase() === seed.id?.toLowerCase() ||
        item.slug?.toLowerCase() === seed.slug?.toLowerCase()
    );
    if (!exists) {
      result.push(seed);
    }
  }
  return result;
}

let inMemoryCatalogCache: DbTemplateRecord[] | null = null;

export function getCachedCatalog(): DbTemplateRecord[] {
  if (inMemoryCatalogCache && inMemoryCatalogCache.length > 0) {
    return inMemoryCatalogCache;
  }
  try {
    const raw = localStorage.getItem('mbell_cached_templates_catalog');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = mergeWithSeeds(parsed);
        inMemoryCatalogCache = merged;
        return merged;
      }
    }
  } catch (e) {}
  return DEFAULT_CATALOG_SEEDS;
}

export async function fetchTemplatesCatalog(): Promise<DbTemplateRecord[]> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Gagal memuat katalog templates Supabase:', error.message);
      return getCachedCatalog();
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const merged = mergeWithSeeds(data);
      inMemoryCatalogCache = merged;
      try {
        localStorage.setItem('mbell_cached_templates_catalog', JSON.stringify(merged));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('mbell_templates_catalog_updated', { detail: merged }));
      return merged;
    }
  } catch (err) {
    console.warn('Error saat fetch templates catalog:', err);
  }
  return getCachedCatalog();
}

/**
 * Mencocokkan template di frontend dengan baris record di tabel public.templates secara murni:
 * 1. Cocokkan ID tabel persis ('template1', 'template2', ...)
 * 2. Cocokkan slug tabel persis ('modern-arch', 'adat-sunda', ...)
 * 3. Cocokkan kata kunci di slug atau nama ('sunda' cocok ke 'adat-sunda', 'modern' cocok ke 'modern-arch')
 */
export function findDbTemplate(themeOrTemplateId: string, catalog: DbTemplateRecord[]): DbTemplateRecord | null {
  if (!catalog || catalog.length === 0) return null;

  const key = (themeOrTemplateId || '').toLowerCase().trim();
  if (!key) return catalog[0] || null;

  // 1. Cocokkan kolom id persis di database
  const byId = catalog.find((item) => item.id?.toLowerCase() === key);
  if (byId) return byId;

  // 2. Cocokkan kolom slug persis di database
  const bySlug = catalog.find((item) => item.slug?.toLowerCase() === key);
  if (bySlug) return bySlug;

  // 3. Cocokkan kata kunci semantic di slug atau name dari database
  const byKeyword = catalog.find(
    (item) => item.slug?.toLowerCase().includes(key) || item.name?.toLowerCase().includes(key)
  );
  if (byKeyword) return byKeyword;

  // 4. Fallback ke item pertama
  return catalog[0] || null;
}

/**
 * Membangun ThemeOption[] murni langsung dari record Supabase public.templates
 * Tidak ada lagi hardcode THEME_OPTIONS di file komponen
 */
export function buildThemeOptionsFromDb(catalog: DbTemplateRecord[]): ThemeOption[] {
  const records = catalog && catalog.length > 0 ? catalog : DEFAULT_CATALOG_SEEDS;

  return records.map((record) => {
    const cat = normalizeCategory(record.category);
    const priceMeta = formatTemplatePrice(
      record.price || (cat === 'adat' ? 79000 : 49000),
      record.original_price || (cat === 'adat' ? 99000 : 79000)
    );

    const preset =
      TEMPLATE_VISUAL_PRESETS[record.id] ||
      (record.slug ? TEMPLATE_VISUAL_PRESETS[record.slug] : undefined);

    return {
      id: record.id,
      slug: record.slug,
      name: record.name,
      subtitle: record.description || (cat === 'adat' ? 'Adat Nusantara Eksklusif' : 'Desain Modern Elegan'),
      styleTag: preset?.styleTag || (cat === 'adat' ? 'Tradisi Nusantara' : 'Modern Editorial'),
      coupleSample: preset?.coupleSample || 'Romeo & Juliet',
      badge: record.preview_badge || undefined,
      accentColor: record.accent_color || (cat === 'adat' ? '#C5A059' : '#D4AF37'),
      icon: preset?.icon || (cat === 'adat' ? 'temple_buddhist' : 'palette'),
      bgClass: preset?.bgClass || 'bg-[#FAF8F5] text-stone-900 border-stone-300',
      category: cat,
      price: priceMeta.price,
      originalPrice: priceMeta.originalPrice,
      priceDisplay: priceMeta.priceDisplay,
      originalPriceDisplay: priceMeta.originalPriceDisplay,
      badgePrice: priceMeta.badgePrice,
      badgeOriginal: priceMeta.badgeOriginal,
      mockupUrl: record.mockup_url || record.thumbnail_url || null,
      thumbnailUrl: record.thumbnail_url || record.mockup_url || null,
    };
  });
}

/**
 * Mengambil harga dinamis untuk pop-up checkout dan payment gateway
 */
export function getDynamicPriceInfo(themeOrTemplateId?: string): DynamicPriceInfo | null {
  const catalog = getCachedCatalog();
  if (!catalog || catalog.length === 0) return null;

  const key = themeOrTemplateId || 'modern';
  const dbMatch = findDbTemplate(key, catalog);
  if (!dbMatch) return null;

  const priceMeta = formatTemplatePrice(dbMatch.price, dbMatch.original_price);
  const cat = normalizeCategory(dbMatch.category);

  return {
    ...priceMeta,
    category: cat,
    categoryLabel: cat === 'adat' ? 'Adat Nusantara' : 'Modern',
  };
}
