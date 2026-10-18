import type { ThemeConfig } from '../../../types/invitation';
import {
  MOCK_MODERN_THEME,
  MOCK_RUSTIC_THEME,
  MOCK_JAWA_THEME,
  MOCK_ISLAMI_THEME,
  MOCK_LUXURY_THEME,
  MOCK_SUNDA_THEME,
} from '../../../data/mockInvitation';

// Template ID Normalization (PostgreSQL FK constraint to public.templates)
export const THEME_TO_TEMPLATE_ID: Record<string, string> = {
  modern: 'template1',
  rustic: 'template2',
  jawa: 'template3',
  islami: 'template4',
  luxury: 'template5',
  sunda: 'template6',
  template1: 'template1',
  template2: 'template2',
  template3: 'template3',
  template4: 'template4',
  template5: 'template5',
  template6: 'template6',
};

/**
 * Daftar tema eksklusif resmi yang tersedia di Wedding Studio
 */
export const CANONICAL_THEMES = ['sunda', 'jawa', 'islami', 'modern', 'rustic', 'luxury'] as const;
export const TOTAL_EXCLUSIVE_THEMES = CANONICAL_THEMES.length; // 6 Tema Eksklusif

export const KNOWN_DB_TEMPLATE_IDS = new Set([
  'template1',
  'template2',
  'template3',
  'template4',
  'template5',
  'template6',
  'sunda',
  'jawa',
  'modern',
  'rustic',
  'islami',
  'luxury',
]);

/**
 * Nama-nama display resmi untuk setiap template undangan
 */
export const THEME_NAMES: Record<string, string> = {
  sunda: 'Adat Sunda Siger',
  template6: 'Adat Sunda Siger',
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
  modern: 'modern',
  rustic: 'rustic',
  jawa: 'jawa',
  islami: 'islami',
  luxury: 'luxury',
  sunda: 'sunda',
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
};

// Demo keywords untuk deteksi apakah form masih memakai data bawaan template
export const DEMO_KEYWORDS = [
  'dimas', 'sarah',
  'raditya', 'jessica',
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
  category: 'adat' | 'casual';
  categoryLabel: string;
}

export const TEMPLATE_PRICING: Record<string, TemplatePriceInfo> = {
  // Kelompok 1: Adat Nusantara (Harga: Rp 59.000, Coret: Rp 99.000)
  sunda: {
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template6: {
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  jawa: {
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template3: {
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  islami: {
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },
  template4: {
    price: 59000,
    originalPrice: 99000,
    priceDisplay: 'Rp 59.000',
    originalPriceDisplay: 'Rp 99.000',
    badgePrice: 'Rp 59rb',
    category: 'adat',
    categoryLabel: 'Adat Nusantara',
  },

  // Kelompok 2: Modern & Casual (Harga: Rp 39.000, Coret: Rp 79.000)
  modern: {
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    category: 'casual',
    categoryLabel: 'Modern & Casual',
  },
  template1: {
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    category: 'casual',
    categoryLabel: 'Modern & Casual',
  },
  rustic: {
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    category: 'casual',
    categoryLabel: 'Modern & Casual',
  },
  template2: {
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    category: 'casual',
    categoryLabel: 'Modern & Casual',
  },
  luxury: {
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    category: 'casual',
    categoryLabel: 'Modern & Casual',
  },
  template5: {
    price: 39000,
    originalPrice: 79000,
    priceDisplay: 'Rp 39.000',
    originalPriceDisplay: 'Rp 79.000',
    badgePrice: 'Rp 39rb',
    category: 'casual',
    categoryLabel: 'Modern & Casual',
  },
};

export function getTemplatePriceInfo(themeOrTemplateId?: string): TemplatePriceInfo {
  const key = themeOrTemplateId || 'modern';
  return (
    TEMPLATE_PRICING[key] ||
    TEMPLATE_PRICING[THEME_TO_TEMPLATE_ID[key]] || {
      price: 39000,
      originalPrice: 79000,
      priceDisplay: 'Rp 39.000',
      originalPriceDisplay: 'Rp 79.000',
      badgePrice: 'Rp 39rb',
      category: 'casual',
      categoryLabel: 'Modern & Casual',
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
