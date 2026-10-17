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
