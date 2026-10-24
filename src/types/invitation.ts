// ============================================================
// INVITATION PROPS — Kontrak Data Universal untuk 5 Template
// Semua template WAJIB menerima props ini tanpa kecuali.
// ============================================================

export interface CoupleInfo {
  name: string;                // "Raditya" (untuk monogram / short display)
  full_name: string;           // "Raditya Pratama, B.Eng."
  photo_url?: string;
  photo?: string;              // alias dashboard
  parent_father?: string;       // "Bpk. Ir. Hendra Pratama"
  parent_mother?: string;       // "Ibu drg. Ratna Kusuma"
  parent_info?: string;        // alias ringkas orang tua
  child_order?: string;         // "Putra pertama dari pasangan"
  instagram: string;           // "@raditya.pratama"
  marga?: string;              // "Siregar Silali" / "Simanjuntak Sitompul"
}

export interface EventInfo {
  name?: string;               // "Akad Nikah"
  title: string;               // "Upacara Ijab & Qobul"
  date: string;                // "Sabtu, 24 Oktober 2026"
  time?: string;               // "08.00 - 10.00 WIB"
  start_time?: string;
  end_time?: string;
  timezone?: string;
  venue_name?: string;         // "The Glasshouse Grand Ballroom"
  location_name?: string;      // alias
  venue_address?: string;
  address?: string;            // alias
  maps_url: string;
  icon?: string;               // "ring" | "champagne-glasses" | "church"
  badge?: string;              // "Khusus Keluarga Inti"
}

export interface LoveStoryMilestone {
  title: string;               // "Pertama Bertemu"
  subtitle?: string;            // "Sebuah Pertemuan Tak Terduga"
  year: string;
  description?: string;
  story?: string;              // alias
  icon?: string;               // "school" | "favorite" | "loyalty" | "check"
}

export interface BankAccount {
  bank_name: string;           // "BCA"
  account_number: string;      // "8801 2345 6789"
  account_number_raw?: string; // "880123456789" (untuk copy)
  account_holder: string;      // "Raditya Pratama"
}

export interface WishItem {
  id: string;
  guest_name: string;
  message: string;
  attendance: 'attending' | 'declined' | 'pending';
  created_at: string;
}

export type TemplateThemeId =
  | 'modern'
  | 'rustic'
  | 'jawa'
  | 'islami'
  | 'luxury'
  | 'sunda'
  | 'minang'
  | 'batak'
  | 'template1'
  | 'template2'
  | 'template3'
  | 'template4'
  | 'template5'
  | 'template6'
  | 'template7'
  | 'template8';

export interface InvitationData {
  id?: string;
  user_id?: string;
  slug?: string;
  status?: string;
  title?: string;
  theme_id?: TemplateThemeId | string;

  // --- Payment & Template Ownership (Pay-Per-Template on Publish) ---
  is_paid?: boolean;
  paid_template_id?: string | null;
  unlocked_templates?: string[];
  paid_at?: string | null;
  payment_method?: string | null;
  amount_paid?: number;

  // --- Couple ---
  groom: CoupleInfo;
  bride: CoupleInfo;
  is_bride_first: boolean;
  couple_photo: string;            // Foto bersama (cover hero)
  cover_image?: string;            // alias

  // --- Wedding Date ---
  wedding_date_iso: string;        // "2026-10-24T08:00:00+07:00" → untuk countdown
  wedding_date_display?: string;   // "Sabtu, 24 Oktober 2026"
  countdown_target?: 'akad' | 'resepsi'; // Menetapkan acara patokan countdown (Akad vs Resepsi)

  // --- Content ---
  quote?: string;
  quote_source?: string;           // "QS. Ar-Rum: 21"
  hashtag?: string;                // "#RadityaJessicaForever"

  // --- Events ---
  events: any;                     // EventInfo[] or { akad: EventInfo; resepsi: EventInfo }

  // --- Love Story ---
  love_story: LoveStoryMilestone[];

  // --- Gallery ---
  gallery: string[];

  // --- Gift ---
  banks?: BankAccount[];
  bank_accounts?: BankAccount[];   // alias
  qris_url?: string;
  gift_address?: string;

  // --- Guest (dynamic per URL query param ?g=xxx) ---
  guest_name?: string;
  guest_code?: string;             // Kode unik untuk QR Check-in

  // --- Optional ---
  livestream_url?: string;         // URL livestream jika ada
  streaming_url?: string;
  music_url?: string;
  theme_config?: ThemeConfig;
}

export interface AnimationConfig {
  smoothness: number;           // 1 - 100 (Default: 75, angka 100 = 5 detik)
  preset: 'romantic' | 'cinematic' | 'minimalist' | 'cascade';
  floating_petals: boolean;     // Default: true
  stagger_speed: 'fast' | 'normal' | 'relaxed';
  lens_focus_blur: boolean;     // Default: true
  reduced_motion: boolean;      // Default: false
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  smoothness: 75,
  preset: 'romantic',
  floating_petals: true,
  stagger_speed: 'normal',
  lens_focus_blur: true,
  reduced_motion: false,
};

export interface ThemeConfig {
  primary_color: string;
  music_url: string;
  music_title?: string;
  active_sections: string[];
  // Convenience toggles (derived from active_sections but explicit for clarity)
  show_gallery?: boolean;
  show_love_story?: boolean;
  show_rsvp?: boolean;
  show_gift?: boolean;
  show_wishes?: boolean;
  animation_config?: AnimationConfig;
}

export interface InvitationProps {
  data: InvitationData;
  theme: ThemeConfig;
  invitationId?: string;           // id undangan (opsional pada preview/editor)
  wishes?: WishItem[];

  // --- Dashboard Editor Controls ---
  isPreview?: boolean;             // true saat render di panel preview Dashboard
  isCoverOpen?: boolean;           // true = skip cover gate, langsung scroll ke content

  // --- Callback Handlers ---
  onSubmitRsvp?: (name: string, status: string, pax: number) => void;
  onSubmitWish?: (name: string, message: string) => void;
}
