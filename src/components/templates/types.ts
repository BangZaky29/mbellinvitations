// ============================================================
// SHARED SECTION PROPS — Kontrak Props untuk Section Components
// Digunakan oleh semua template section agar konsisten.
// ============================================================
import type { InvitationData, ThemeConfig, CoupleInfo, WishItem } from '../../types/invitation';

export type { InvitationData, ThemeConfig, CoupleInfo, WishItem };

/**
 * Props dasar yang dimiliki SEMUA section component.
 */
export interface BaseSectionProps {
  data: InvitationData;
  theme?: ThemeConfig;
  isPreview?: boolean;
  isSectionActive?: (section: string) => boolean;
}

/**
 * Props untuk Cover Section — berisi data cover gate overlay.
 */
export interface CoverSectionProps extends BaseSectionProps {
  firstPerson?: CoupleInfo;
  secondPerson?: CoupleInfo;
  handleOpenInvitation: () => void;
  renderSwipeHint: (extraProps?: any) => React.ReactNode;
}

/**
 * Props untuk Hero & Countdown Section.
 */
export interface HeroSectionProps extends BaseSectionProps {
  firstPerson?: CoupleInfo;
  secondPerson?: CoupleInfo;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
}

/**
 * Props untuk Couple Profile Section.
 */
export interface CoupleSectionProps extends BaseSectionProps {
  firstPerson?: CoupleInfo;
  secondPerson?: CoupleInfo;
  firstPersonRole?: string;
  secondPersonRole?: string;
}

/**
 * Props untuk Love Story Timeline Section.
 */
export interface StorySectionProps extends BaseSectionProps {}

/**
 * Props untuk Event Details & Venue Section.
 */
export interface EventSectionProps extends BaseSectionProps {}

/**
 * Props untuk Photo Gallery Section.
 */
export interface GallerySectionProps extends BaseSectionProps {
  selectedImage?: string | null;
  setSelectedImage: (url: string | null) => void;
  showAllGallery: boolean;
  setShowAllGallery: (show: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * Props untuk RSVP & Digital Envelope Section.
 */
export interface RsvpGiftSectionProps extends BaseSectionProps {
  rsvpForm: { name: string; status: string; pax: number; notes?: string };
  setRsvpForm: (form: any) => void;
  rsvpSubmitted: boolean;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  copiedAccountIndex: number | null;
  copiedAddress: boolean;
  handleCopyAccount: (accountNumber: string, index: number) => void;
  handleCopyAddress: (address: string) => void;
}

/**
 * Props untuk Wishes Wall Section.
 */
export interface WishesSectionProps extends BaseSectionProps {
  wishes: WishItem[];
  wishForm?: { name: string; message: string };
  setWishForm?: (form: any) => void;
  wishSubmitted?: boolean;
  handleWishSubmit?: (e: React.FormEvent) => void;
  renderBrandFooter: (extraProps?: any) => React.ReactNode;
}
