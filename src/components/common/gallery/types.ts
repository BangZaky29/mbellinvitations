import type { GalleryStyleType } from '../../../types/invitation';

export interface GalleryThemeAccent {
  primaryColor?: string;
  goldAccent?: string;
  badgeBg?: string;
  badgeText?: string;
  cardBg?: string;
  borderColor?: string;
}

export interface UniversalGalleryProps {
  photos: string[];
  style?: GalleryStyleType;
  onSelectImage: (url: string, index: number) => void;
  themeAccent?: GalleryThemeAccent;
  className?: string;
  captions?: string[];
}

