import type { UserTemplateRecord } from '../../../lib/supabaseClient';
import type { InvitationData } from '../../../types/invitation';

export interface ThemePresetItem {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
}

export const THEME_PRESETS: ThemePresetItem[] = [
  {
    id: 'modern',
    name: 'Modern Arch & Minimalist',
    category: 'Editorial Luxury',
    description: 'Palet warm champagne, typografi majalah editorial, clean layout',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rustic',
    name: 'Rustic Botanical Garden',
    category: 'Earthy Nature',
    description: 'Nuansa botanical sage green & wood warm, hangat & natural',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'jawa',
    name: 'Klasik Keraton Jawa',
    category: 'Adat Nusantara',
    description: 'Sentuhan ornamen ukir batik emas & tradisi panggih agung',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'islami',
    name: 'Islami Nuansa Kubah',
    category: 'Sacred Ornament',
    description: 'Kubah Maroko bernuansa emerald dan ayat-ayat suci pernikahan',
    thumbnail: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'luxury',
    name: 'Midnight Black & Gold Luxury',
    category: 'VIP Glamour',
    description: 'Kemewahan monokrom midnight black dan aksen foil emas berkilau',
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sunda',
    name: 'Adat Sunda Siger & Melati',
    category: 'Adat Nusantara',
    description: 'Kemegahan Mahkota Siger, ronce melati, gending kecapi suling, dan nuansa Parahyangan',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMQzGjURPVSsGCRPPE-zHZ7bgKvtteTLFR6OM9LyCulQKLncbS8LirSkj3E_Ec1t0kJzOapSpd3NsulL3IStOlVI1tPnPGmcvYQoygMvF5gCkYEGhruz0lao1Cvo72k1VcpUgtv_jCWbRtWdBfhARMKHCGycQV3bau425N0jO8a6JVq5ufjrf_Pobe0giwVbiqnYhx5nY-LXDs9HaYTaUkUyKwqa5yxlJAfvBxubqUxz0wQHVGIl6mQ',
  },
  {
    id: 'minang',
    name: 'Adat Minang Baralek Gadang',
    category: 'Adat Nusantara',
    description: 'Kemegahan Suntiang Gadang, Songket Silungkang, Gonjong Rumah Gadang, dan ornamen ukir Minangkabau',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'batak',
    name: 'Adat Batak Toba & Gorga Bolon',
    category: 'Adat Nusantara',
    description: 'Kemegahan Sortali Emas, Ulos Ragi Hotang, Ornamen Gorga Boras Pati, dan Arsitektur Rumah Bolon',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
];

export const THEME_BANNER_COLORS: Record<string, { bg: string; text: string; badge: string; label: string }> = {
  modern: {
    bg: 'from-stone-900 via-stone-800 to-amber-950/80',
    text: 'text-amber-200',
    badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    label: 'Modern Minimalist',
  },
  rustic: {
    bg: 'from-stone-800 via-amber-900/60 to-emerald-950/80',
    text: 'text-amber-100',
    badge: 'bg-amber-600/20 text-amber-200 border-amber-500/30',
    label: 'Rustic Garden & Wood',
  },
  jawa: {
    bg: 'from-amber-950 via-stone-900 to-yellow-950/80',
    text: 'text-yellow-200',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    label: 'Jawa Klasik Kasunanan',
  },
  islami: {
    bg: 'from-emerald-950 via-teal-900 to-stone-900',
    text: 'text-emerald-200',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    label: 'Islami Nuansa Emerald',
  },
  luxury: {
    bg: 'from-slate-950 via-stone-900 to-amber-950/90',
    text: 'text-amber-300',
    badge: 'bg-amber-300/20 text-amber-300 border-amber-300/40',
    label: 'Royal Gold & Black Luxury',
  },
  sunda: {
    bg: 'from-[#775a19]/90 via-[#c5a059]/70 to-[#8a4c56]/80',
    text: 'text-[#ffdea5]',
    badge: 'bg-[#c5a059]/25 text-[#ffdea5] border-[#c5a059]/40',
    label: 'Adat Sunda Siger',
  },
  template6: {
    bg: 'from-[#775a19]/90 via-[#c5a059]/70 to-[#8a4c56]/80',
    text: 'text-[#ffdea5]',
    badge: 'bg-[#c5a059]/25 text-[#ffdea5] border-[#c5a059]/40',
    label: 'Adat Sunda Siger',
  },
  minang: {
    bg: 'from-[#5a1018] via-[#8a1c28] to-[#d4af37]/80',
    text: 'text-[#f5e6c8]',
    badge: 'bg-[#d4af37]/25 text-[#f5e6c8] border-[#d4af37]/40',
    label: 'Adat Minang Baralek Gadang',
  },
  template7: {
    bg: 'from-[#5a1018] via-[#8a1c28] to-[#d4af37]/80',
    text: 'text-[#f5e6c8]',
    badge: 'bg-[#d4af37]/25 text-[#f5e6c8] border-[#d4af37]/40',
    label: 'Adat Minang Baralek Gadang',
  },
  batak: {
    bg: 'from-[#19120e] via-[#661d24] to-[#c8a253]/80',
    text: 'text-[#ede1d0]',
    badge: 'bg-[#c8a253]/25 text-[#f5e6c8] border-[#c8a253]/40',
    label: 'Adat Batak Toba',
  },
  template8: {
    bg: 'from-[#19120e] via-[#661d24] to-[#c8a253]/80',
    text: 'text-[#ede1d0]',
    badge: 'bg-[#c8a253]/25 text-[#f5e6c8] border-[#c8a253]/40',
    label: 'Adat Batak Toba',
  },
};

export interface MyTemplatesPanelProps {
  currentUserId?: string | null;
  currentFormData: InvitationData;
  activeTemplateId?: string | null;
  onSelectTemplate: (template: UserTemplateRecord) => void;
  onImplementActiveTemplate?: () => void;
  onOpenAuthGate: () => void;
  onAddNewTemplate: (themeId: string) => void;
  onSlugChange?: (newSlug: string) => void;
}
