import type { InvitationData, ThemeConfig } from '../../../types/invitation';
import {
  MOCK_MODERN_DATA,
  MOCK_MODERN_THEME,
  MOCK_RUSTIC_THEME,
  MOCK_JAWA_THEME,
  MOCK_ISLAMI_THEME,
  MOCK_LUXURY_THEME,
  MOCK_SUNDA_THEME,
  MOCK_MINANG_THEME,
  MOCK_BATAK_THEME,
  MOCK_BETAWI_THEME,
  MOCK_BUGIS_THEME,
  MOCK_BALI_THEME,
  MOCK_PALEMBANG_THEME,
  MOCK_THEME_DATA_MAP,
  MOCK_THEME_CONFIG_MAP,
} from '../../../data/mockInvitation';

export const DEFAULT_THEMES: Record<string, ThemeConfig> = {
  modern: MOCK_MODERN_THEME,
  rustic: MOCK_RUSTIC_THEME,
  jawa: MOCK_JAWA_THEME,
  islami: MOCK_ISLAMI_THEME,
  luxury: MOCK_LUXURY_THEME,
  sunda: MOCK_SUNDA_THEME,
  minang: MOCK_MINANG_THEME,
  batak: MOCK_BATAK_THEME,
  betawi: MOCK_BETAWI_THEME,
  template11: MOCK_BETAWI_THEME,
  template9: MOCK_BETAWI_THEME,
  bugis: MOCK_BUGIS_THEME,
  template10: MOCK_BUGIS_THEME,
  bali: MOCK_BALI_THEME,
  template12: MOCK_BALI_THEME,
  template11_bali: MOCK_BALI_THEME,
  palembang: MOCK_PALEMBANG_THEME,
  template13: MOCK_PALEMBANG_THEME,
  template12_palembang: MOCK_PALEMBANG_THEME,
};

export const THEME_ID_MAP: Record<string, string> = {
  template1: 'modern',
  template2: 'rustic',
  template3: 'jawa',
  template4: 'islami',
  template5: 'luxury',
  template6: 'sunda',
  template7: 'minang',
  template8: 'batak',
  template10: 'bugis',
  template11: 'betawi',
  template9: 'betawi',
  template12: 'bali',
  template11_bali: 'bali',
  template13: 'palembang',
  template12_palembang: 'palembang',
  modern: 'modern',
  rustic: 'rustic',
  jawa: 'jawa',
  islami: 'islami',
  luxury: 'luxury',
  sunda: 'sunda',
  minang: 'minang',
  batak: 'batak',
  betawi: 'betawi',
  bugis: 'bugis',
  bali: 'bali',
  palembang: 'palembang',
};

export function resolveNormalizedThemeId(themeId?: string): string {
  return THEME_ID_MAP[String(themeId || 'modern')] || 'modern';
}

export function buildSafePreviewData(data: InvitationData): {
  safeData: InvitationData;
  normalizedThemeId: string;
} {
  const normalizedThemeId = resolveNormalizedThemeId(data.theme_id);
  const defaultThematicData = MOCK_THEME_DATA_MAP[normalizedThemeId] || MOCK_MODERN_DATA;

  const safeData: InvitationData = {
    ...data,
    couple_photo: data.couple_photo || data.cover_image || defaultThematicData.couple_photo,
    cover_image: data.cover_image || data.couple_photo || defaultThematicData.cover_image,
    groom: {
      ...defaultThematicData.groom,
      ...data.groom,
      photo_url: data.groom?.photo_url || (data.groom as any)?.photo || defaultThematicData.groom.photo_url,
      photo: (data.groom as any)?.photo || data.groom?.photo_url || defaultThematicData.groom.photo_url,
    },
    bride: {
      ...defaultThematicData.bride,
      ...data.bride,
      photo_url: data.bride?.photo_url || (data.bride as any)?.photo || defaultThematicData.bride.photo_url,
      photo: (data.bride as any)?.photo || data.bride?.photo_url || defaultThematicData.bride.photo_url,
    },
    wedding_date_display: data.wedding_date_display !== undefined ? data.wedding_date_display : defaultThematicData.wedding_date_display,
    quote: data.quote !== undefined ? data.quote : defaultThematicData.quote,
    quote_source: data.quote_source !== undefined ? data.quote_source : defaultThematicData.quote_source,
    quote_arabic: data.quote_arabic !== undefined ? data.quote_arabic : defaultThematicData.quote_arabic,
    quote_title: data.quote_title !== undefined ? data.quote_title : defaultThematicData.quote_title,
    quote_religion: data.quote_religion !== undefined ? data.quote_religion : defaultThematicData.quote_religion,
    dresscode: data.dresscode !== undefined ? data.dresscode : defaultThematicData.dresscode,
    hashtag: data.hashtag !== undefined ? data.hashtag : defaultThematicData.hashtag,
    guest_name: (() => {
      if (data.guest_name) return data.guest_name;
      const currentSlug = data.slug || '';
      try {
        const saved = typeof window !== 'undefined' && currentSlug
          ? (localStorage.getItem(`mbell_last_guest_name_${currentSlug}`) || '').trim()
          : '';
        if (saved) return saved;
      } catch {}
      return defaultThematicData.guest_name || 'Tamu Undangan';
    })(),
    guest_code: data.guest_code !== undefined ? data.guest_code : defaultThematicData.guest_code,
    events: data.events && data.events.length > 0 ? data.events : defaultThematicData.events,
    gallery: data.gallery && data.gallery.length > 0 ? data.gallery : defaultThematicData.gallery,
    banks: (data.banks && data.banks.length > 0)
      ? data.banks
      : (data.bank_accounts && data.bank_accounts.length > 0)
      ? data.bank_accounts
      : defaultThematicData.banks || [],
    bank_accounts: (data.bank_accounts && data.bank_accounts.length > 0)
      ? data.bank_accounts
      : (data.banks && data.banks.length > 0)
      ? data.banks
      : defaultThematicData.bank_accounts || [],
    gift_address: data.gift_address || defaultThematicData.gift_address || '',
  };

  return { safeData, normalizedThemeId };
}

export function resolveEffectiveTheme(
  theme: ThemeConfig | undefined,
  normalizedThemeId: string
): ThemeConfig {
  const defaultTheme =
    MOCK_THEME_CONFIG_MAP[normalizedThemeId] ||
    DEFAULT_THEMES[normalizedThemeId] ||
    MOCK_MODERN_THEME;

  if (!theme) return defaultTheme;

  return {
    ...defaultTheme,
    ...theme,
    active_sections:
      theme.active_sections && theme.active_sections.length > 0
        ? theme.active_sections
        : defaultTheme.active_sections,
    show_gift: theme.show_gift !== undefined ? theme.show_gift : defaultTheme.show_gift,
    show_gallery: theme.show_gallery !== undefined ? theme.show_gallery : defaultTheme.show_gallery,
    show_wishes: theme.show_wishes !== undefined ? theme.show_wishes : defaultTheme.show_wishes,
    show_rsvp: theme.show_rsvp !== undefined ? theme.show_rsvp : defaultTheme.show_rsvp,
    show_dresscode:
      theme.show_dresscode !== undefined
        ? theme.show_dresscode
        : defaultTheme.show_dresscode,
    show_quote:
      theme.show_quote !== undefined
        ? theme.show_quote
        : defaultTheme.show_quote,
  };
}
