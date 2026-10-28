import type { InvitationData, ThemeConfig, WishItem } from '../types/invitation';

// Re-export individual theme mock datasets
export {
  MOCK_INVITATION_DATA,
  MOCK_THEME_CONFIG,
  MOCK_WISHES,
} from './mock/modernData';

export {
  MOCK_JAWA_DATA,
  MOCK_JAWA_THEME,
  MOCK_JAWA_WISHES,
} from './mock/jawaData';

export {
  MOCK_ISLAMI_DATA,
  MOCK_ISLAMI_THEME,
  MOCK_ISLAMI_WISHES,
} from './mock/islamiData';

export {
  MOCK_LUXURY_DATA,
  MOCK_LUXURY_THEME,
  MOCK_LUXURY_WISHES,
} from './mock/luxuryData';

export {
  MOCK_RUSTIC_DATA,
  MOCK_RUSTIC_THEME,
  MOCK_RUSTIC_WISHES,
} from './mock/rusticData';

export {
  MOCK_SUNDA_DATA,
  MOCK_SUNDA_THEME,
  MOCK_SUNDA_WISHES,
} from './mock/sundaData';

export {
  MOCK_MINANG_DATA,
  MOCK_MINANG_THEME,
  MOCK_MINANG_WISHES,
} from './mock/minangData';

export {
  MOCK_BATAK_DATA,
  MOCK_BATAK_THEME,
  MOCK_BATAK_WISHES,
} from './mock/batakData';

export {
  MOCK_BETAWI_DATA,
  MOCK_BETAWI_THEME,
  MOCK_BETAWI_WISHES,
} from './mock/betawiData';

import {
  MOCK_INVITATION_DATA,
  MOCK_THEME_CONFIG,
  MOCK_WISHES,
} from './mock/modernData';
import {
  MOCK_JAWA_DATA,
  MOCK_JAWA_THEME,
  MOCK_JAWA_WISHES,
} from './mock/jawaData';
import {
  MOCK_ISLAMI_DATA,
  MOCK_ISLAMI_THEME,
  MOCK_ISLAMI_WISHES,
} from './mock/islamiData';
import {
  MOCK_LUXURY_DATA,
  MOCK_LUXURY_THEME,
  MOCK_LUXURY_WISHES,
} from './mock/luxuryData';
import {
  MOCK_RUSTIC_DATA,
  MOCK_RUSTIC_THEME,
  MOCK_RUSTIC_WISHES,
} from './mock/rusticData';
import {
  MOCK_SUNDA_DATA,
  MOCK_SUNDA_THEME,
  MOCK_SUNDA_WISHES,
} from './mock/sundaData';
import {
  MOCK_MINANG_DATA,
  MOCK_MINANG_THEME,
  MOCK_MINANG_WISHES,
} from './mock/minangData';
import {
  MOCK_BATAK_DATA,
  MOCK_BATAK_THEME,
  MOCK_BATAK_WISHES,
} from './mock/batakData';
import {
  MOCK_BETAWI_DATA,
  MOCK_BETAWI_THEME,
  MOCK_BETAWI_WISHES,
} from './mock/betawiData';

// Aliases for modern
export const MOCK_MODERN_DATA = MOCK_INVITATION_DATA;
export const MOCK_MODERN_THEME = MOCK_THEME_CONFIG;
export const MOCK_MODERN_WISHES = MOCK_WISHES;

// ============================================================
// UNIFIED MAPS (Multi-Template Concept Presets)
// ============================================================
export const MOCK_THEME_DATA_MAP: Record<string, InvitationData> = {
  modern: MOCK_MODERN_DATA,
  template1: MOCK_MODERN_DATA,
  rustic: MOCK_RUSTIC_DATA,
  template2: MOCK_RUSTIC_DATA,
  jawa: MOCK_JAWA_DATA,
  template3: MOCK_JAWA_DATA,
  islami: MOCK_ISLAMI_DATA,
  template4: MOCK_ISLAMI_DATA,
  luxury: MOCK_LUXURY_DATA,
  template5: MOCK_LUXURY_DATA,
  sunda: MOCK_SUNDA_DATA,
  template6: MOCK_SUNDA_DATA,
  minang: MOCK_MINANG_DATA,
  template7: MOCK_MINANG_DATA,
  batak: MOCK_BATAK_DATA,
  template8: MOCK_BATAK_DATA,
  betawi: MOCK_BETAWI_DATA,
  template11: MOCK_BETAWI_DATA,
  template9: MOCK_BETAWI_DATA,
};

export const MOCK_THEME_CONFIG_MAP: Record<string, ThemeConfig> = {
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

export const MOCK_THEME_WISHES_MAP: Record<string, WishItem[]> = {
  modern: MOCK_MODERN_WISHES,
  template1: MOCK_MODERN_WISHES,
  rustic: MOCK_RUSTIC_WISHES,
  template2: MOCK_RUSTIC_WISHES,
  jawa: MOCK_JAWA_WISHES,
  template3: MOCK_JAWA_WISHES,
  islami: MOCK_ISLAMI_WISHES,
  template4: MOCK_ISLAMI_WISHES,
  luxury: MOCK_LUXURY_WISHES,
  template5: MOCK_LUXURY_WISHES,
  sunda: MOCK_SUNDA_WISHES,
  template6: MOCK_SUNDA_WISHES,
  minang: MOCK_MINANG_WISHES,
  template7: MOCK_MINANG_WISHES,
  batak: MOCK_BATAK_WISHES,
  template8: MOCK_BATAK_WISHES,
  betawi: MOCK_BETAWI_WISHES,
  template11: MOCK_BETAWI_WISHES,
  template9: MOCK_BETAWI_WISHES,
};
