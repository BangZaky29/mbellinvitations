import type { ThemeConfig } from '../../../types/invitation';
import {
  MOCK_MODERN_THEME,
  MOCK_RUSTIC_THEME,
  MOCK_JAWA_THEME,
  MOCK_ISLAMI_THEME,
  MOCK_LUXURY_THEME,
  MOCK_SUNDA_THEME,
  MOCK_MINANG_THEME,
  MOCK_BATAK_THEME,
  MOCK_BETAWI_THEME,
} from '../../../data/mockInvitation';
import { getDynamicPriceInfo } from '../../../services/templateCatalogService';

// Template ID Normalization (PostgreSQL FK constraint to public.templates)
export const THEME_TO_TEMPLATE_ID: Record<string, string> = {
  modern: 'template1',
  rustic: 'template2',
  jawa: 'template3',
  islami: 'template4',
  luxury: 'template5',
  sunda: 'template6',
  minang: 'template7',
  batak: 'template8',
  betawi: 'template11',
  template1: 'template1',
  template2: 'template2',
  template3: 'template3',
  template4: 'template4',
  template5: 'template5',
  template6: 'template6',
  template7: 'template7',
  template8: 'template8',
  template11: 'template11',
  template9: 'template11',
};

/**
 * Daftar tema eksklusif resmi yang tersedia di Wedding Studio
 */
export const CANONICAL_THEMES = ['sunda', 'minang', 'batak', 'betawi', 'jawa', 'islami', 'modern', 'rustic', 'luxury'] as const;
export const TOTAL_EXCLUSIVE_THEMES = CANONICAL_THEMES.length; // 9 Tema Eksklusif

// ID template yang sah terdaftar di master table public.templates Supabase (mencegah error 409 FK violation)
export const KNOWN_DB_TEMPLATE_IDS = new Set([
  'template1',
  'template2',
  'template3',
  'template4',
  'template5',
  'template6',
  'template7',
  'template8',
  'template11',
  'template9',
]);

/**
 * Nama-nama display resmi untuk setiap template undangan
 */
export const THEME_NAMES: Record<string, string> = {
  sunda: 'Adat Sunda Siger',
  template6: 'Adat Sunda Siger',
  minang: 'Adat Minang Baralek Gadang',
  template7: 'Adat Minang Baralek Gadang',
  batak: 'Adat Batak Toba Royal',
  template8: 'Adat Batak Toba Royal',
  betawi: 'Adat Betawi Palang Pintu',
  template11: 'Adat Betawi Palang Pintu',
  template9: 'Adat Betawi Palang Pintu',
  jawa: 'Adat Jawa',
  template3: 'Adat Jawa',
  modern: 'Modern Arch',
  template1: 'Modern Arch',
  rustic: 'Rustic Floral',
  template2: 'Rustic Floral',
  islami: 'Islami Kubah',
  template4: 'Islami Kubah',
  luxury: 'Luxury Emerald',
  template5: 'Luxury Emerald',
};

export interface ThemeMetaInfo {
  name: string;
  tag: string;
  icon: string;
  accentColor: string;
}

export const THEME_META: Record<string, ThemeMetaInfo> = {
  sunda: {
    name: 'Adat Sunda Siger',
    tag: 'Tradisi Parahyangan & Ronce Melati',
    icon: 'local_florist',
    accentColor: '#C5A059',
  },
  template6: {
    name: 'Adat Sunda Siger',
    tag: 'Tradisi Parahyangan & Ronce Melati',
    icon: 'local_florist',
    accentColor: '#C5A059',
  },
  minang: {
    name: 'Adat Minang Baralek Gadang',
    tag: 'Suntiang Gadang & Songket Silungkang',
    icon: 'temple_buddhist',
    accentColor: '#D4AF37',
  },
  template7: {
    name: 'Adat Minang Baralek Gadang',
    tag: 'Suntiang Gadang & Songket Silungkang',
    icon: 'temple_buddhist',
    accentColor: '#D4AF37',
  },
  batak: {
    name: 'Adat Batak Toba Royal',
    tag: 'Gondang Sabangunan & Ulos Hela',
    icon: 'church',
    accentColor: '#C8A253',
  },
  template8: {
    name: 'Adat Batak Toba Royal',
    tag: 'Gondang Sabangunan & Ulos Hela',
    icon: 'church',
    accentColor: '#C8A253',
  },
  betawi: {
    name: 'Adat Betawi Palang Pintu',
    tag: 'Kembang Kelapa & Busana Abang None',
    icon: 'sports_martial_arts',
    accentColor: '#FED65B',
  },
  template11: {
    name: 'Adat Betawi Palang Pintu',
    tag: 'Kembang Kelapa & Busana Abang None',
    icon: 'sports_martial_arts',
    accentColor: '#FED65B',
  },
  template9: {
    name: 'Adat Betawi Palang Pintu',
    tag: 'Kembang Kelapa & Busana Abang None',
    icon: 'sports_martial_arts',
    accentColor: '#FED65B',
  },
  jawa: {
    name: 'Adat Jawa',
    tag: 'Klasik Keraton & Gunungan',
    icon: 'architecture',
    accentColor: '#C5A059',
  },
  template3: {
    name: 'Adat Jawa',
    tag: 'Klasik Keraton & Gunungan',
    icon: 'architecture',
    accentColor: '#C5A059',
  },
  modern: {
    name: 'Modern Arch',
    tag: 'Editorial Minimalist Luxury',
    icon: 'palette',
    accentColor: '#4A3B32',
  },
  template1: {
    name: 'Modern Arch',
    tag: 'Editorial Minimalist Luxury',
    icon: 'palette',
    accentColor: '#4A3B32',
  },
  rustic: {
    name: 'Rustic Floral',
    tag: 'Botanical & Natural Warmth',
    icon: 'nature_people',
    accentColor: '#8C6D58',
  },
  template2: {
    name: 'Rustic Floral',
    tag: 'Botanical & Natural Warmth',
    icon: 'nature_people',
    accentColor: '#8C6D58',
  },
  islami: {
    name: 'Islami Kubah',
    tag: 'Sacred Mosque & Maroko',
    icon: 'mosque',
    accentColor: '#93335B',
  },
  template4: {
    name: 'Islami Kubah',
    tag: 'Sacred Mosque & Maroko',
    icon: 'mosque',
    accentColor: '#93335B',
  },
  luxury: {
    name: 'Luxury Emerald',
    tag: 'Gold Foil & Royal Obsidian',
    icon: 'diamond',
    accentColor: '#10B981',
  },
  template5: {
    name: 'Luxury Emerald',
    tag: 'Gold Foil & Royal Obsidian',
    icon: 'diamond',
    accentColor: '#10B981',
  },
};

export function getTemplateDisplayName(themeOrTemplateId?: string): string {
  if (!themeOrTemplateId) return 'Adat Sunda Siger';
  return THEME_NAMES[themeOrTemplateId] || THEME_NAMES[THEME_TO_TEMPLATE_ID[themeOrTemplateId]] || themeOrTemplateId;
}

export function getTemplateMeta(themeOrTemplateId?: string): ThemeMetaInfo {
  const key = themeOrTemplateId || 'sunda';
  return (
    THEME_META[key] ||
    THEME_META[THEME_TO_TEMPLATE_ID[key]] || {
      name: getTemplateDisplayName(key),
      tag: 'Undangan Pernikahan Eksklusif',
      icon: 'auto_awesome',
      accentColor: '#C5A059',
    }
  );
}

/**
 * Mendapatkan ID template yang aman untuk tabel public.invitations
 * Mencegah error 409 Foreign Key Constraint jika template baru (seperti template6 Sunda)
 * belum terdaftar di tabel master public.templates Supabase.
 */
export function getSafeDbTemplateId(themeOrTemplateId?: string): string {
  const mapped = THEME_TO_TEMPLATE_ID[themeOrTemplateId || 'modern'] || themeOrTemplateId || 'template1';
  return KNOWN_DB_TEMPLATE_IDS.has(mapped) ? mapped : 'template1';
}

export const TEMPLATE_ID_TO_THEME: Record<string, string> = {
  template1: 'modern',
  template2: 'rustic',
  template3: 'jawa',
  template4: 'islami',
  template5: 'luxury',
  template6: 'sunda',
  template7: 'minang',
  template8: 'batak',
  template11: 'betawi',
  template9: 'betawi',
  modern: 'modern',
  rustic: 'rustic',
  jawa: 'jawa',
  islami: 'islami',
  luxury: 'luxury',
  sunda: 'sunda',
  minang: 'minang',
  batak: 'batak',
  betawi: 'betawi',
};

export const DEFAULT_THEME_CONFIGS: Record<string, ThemeConfig> = {
  modern: MOCK_MODERN_THEME,
  template1: MOCK_MODERN_THEME,
  rustic: MOCK_RUSTIC_THEME,
  template2: MOCK_RUSTIC_THEME,
  jawa: MOCK_JAWA_THEME,
  template3: MOCK_JAWA_THEME,
  islami: MOCK_ISLAMI_THEME,
  template4: MOCK_ISLAMI_THEME,
  luxury: MOCK_LUXURY_THEME,
  template5: MOCK_LUXURY_THEME,
  sunda: MOCK_SUNDA_THEME,
  template6: MOCK_SUNDA_THEME,
  minang: MOCK_MINANG_THEME,
  template7: MOCK_MINANG_THEME,
  batak: MOCK_BATAK_THEME,
  template8: MOCK_BATAK_THEME,
  betawi: MOCK_BETAWI_THEME,
  template11: MOCK_BETAWI_THEME,
  template9: MOCK_BETAWI_THEME,
};

// Demo keywords untuk deteksi apakah form masih memakai data bawaan template
export const DEMO_KEYWORDS = [
  'dimas', 'sarah',
  'raditya', 'jessica',
  'farhan', 'nadia',
  'johannes', 'melisa', 'siregar', 'simanjuntak',
  'rizky', 'fatimah', 'marzuki', 'syamsuddin',
  'romeo', 'juliet',
  'arya', 'dian', 'suryonegoro', 'daniswara',
  'rayhan', 'yasmin', 'al-fatih', 'anbiya',
  'bagas', 'citra', 'anindita', 'pratama'
];

// =========================================================================
// SKEMA HARGA PAY-PER-TEMPLATE (Migrasi price.sql)
// =========================================================================
export interface TemplatePriceInfo {
  price: number;
  originalPrice: number;
  priceDisplay: string;
  originalPriceDisplay: string;
  badgePrice: string;
  category: 'adat' | 'modern';
  categoryLabel: string;
}

export const TEMPLATE_PRICING: Record<string, TemplatePriceInfo> = {
  // Kelompok 1: Adat Nusantara (Harga Promo: Rp 79.000, Coret: Rp 99.000)
  sunda: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template6: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  minang: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template7: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  batak: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template8: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  betawi: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template11: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template9: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  jawa: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template3: {
    price: 79000,
    originalPrice: 99000,
    priceDisplay: 'Rp 79.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 79rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },

  // Kelompok 2: Modern (Harga Promo: Rp 49.000, Coret: Rp 79.000)
  islami: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  template4: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  modern: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  template1: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  rustic: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  template2: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  luxury: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
  template5: {
    price: 49000,
    originalPrice: 79000,
    priceDisplay: 'Rp 49.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 49rb',
    category: 'modern',
    categoryLabel: 'Modern',
  },
};

export function getTemplatePriceInfo(themeOrTemplateId?: string): TemplatePriceInfo {
  const key = themeOrTemplateId || 'modern';
  const dynamic = getDynamicPriceInfo(key);
  if (dynamic) {
    return {
      price: dynamic.price,
      originalPrice: dynamic.originalPrice,
      priceDisplay: dynamic.priceDisplay,
      originalPriceDisplay: dynamic.originalPriceDisplay,
      badgePrice: dynamic.badgePrice,
      category: dynamic.category,
      categoryLabel: dynamic.categoryLabel,
    };
  }

  return (
    TEMPLATE_PRICING[key] ||
    TEMPLATE_PRICING[THEME_TO_TEMPLATE_ID[key]] || {
      price: 39000,
      originalPrice: 79000,
      priceDisplay: 'Rp 39.000',
      originalPriceDisplay: 'Rp 79.000',
      badgePrice: 'Rp 39rb',
      category: 'modern',
      categoryLabel: 'Modern',
    }
  );
}

/**
 * Memeriksa apakah sebuah template sudah dibeli/diaktivasi untuk DESAIN UNDANGAN INI.
 * Aturan Bisnis:
 * - Pembelian bersifat terikat per-desain undangan (1x beli = 1x desain undangan).
 * - Jika user membuat desain undangan baru (meski memakai template tema yang sama),
 *   desain baru tersebut memiliki status belum dibeli dan harus diaktivasi saat publish.
 */
export function isTemplateUnlocked(
  templateOrThemeId: string | undefined | null,
  unlockedTemplates?: string[] | null,
  paidTemplateId?: string | null,
  isPaid?: boolean
): boolean {
  if (!templateOrThemeId) return false;

  const technicalId = THEME_TO_TEMPLATE_ID[templateOrThemeId] || templateOrThemeId;
  const semanticId = TEMPLATE_ID_TO_THEME[templateOrThemeId] || templateOrThemeId;

  // 1. Cek pada daftar unlocked_templates milik desain undangan ini
  if (Array.isArray(unlockedTemplates) && unlockedTemplates.length > 0) {
    const found = unlockedTemplates.some((item) => {
      const itemTech = THEME_TO_TEMPLATE_ID[item] || item;
      const itemSem = TEMPLATE_ID_TO_THEME[item] || item;
      return (
        item === templateOrThemeId ||
        item === technicalId ||
        item === semanticId ||
        itemTech === technicalId ||
        itemSem === semanticId
      );
    });
    if (found) return true;
  }

  // 2. Cek jika paid_template_id cocok dan is_paid true pada desain undangan ini
  if (isPaid && paidTemplateId) {
    const paidTech = THEME_TO_TEMPLATE_ID[paidTemplateId] || paidTemplateId;
    const paidSem = TEMPLATE_ID_TO_THEME[paidTemplateId] || paidTemplateId;
    if (
      paidTemplateId === templateOrThemeId ||
      paidTemplateId === technicalId ||
      paidTemplateId === semanticId ||
      paidTech === technicalId ||
      paidSem === semanticId
    ) {
      return true;
    }
  }

  return false;
}
