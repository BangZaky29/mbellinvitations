import { useState, useEffect, useRef } from 'react';
import type { InvitationProps, WishItem } from '../types/invitation';
import { useCountdown } from './useCountdown';
import { useAudioPlayer } from './useAudioPlayer';
import { useUniversalScrollAnimation, anim } from '../utils/scrollAnimationEngine';

interface UseTemplateStateOptions extends InvitationProps {
  fallbackMusicUrl?: string;
}

export function useTemplateState({
  data,
  theme,
  wishes: initialWishes = [],
  isPreview = false,
  isCoverOpen = false,
  onSubmitRsvp,
  onSubmitWish,
  fallbackMusicUrl = 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
}: UseTemplateStateOptions) {
  // State Cover Gate: user opened or editor forced open
  const [isOpen, setIsOpen] = useState(isCoverOpen || false);
  const [isOpening, setIsOpening] = useState(false);
  const [copiedAccountIndex, setCopiedAccountIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error' | 'copy'>('success');
  const [activeGiftTab, setActiveGiftTab] = useState<'transfer' | 'kado'>('transfer');

  // Central Universal Scroll Animation Engine (Step 6 Config Aware)
  const activeAnimConfig = theme?.animation_config || data?.theme_config?.animation_config;
  useUniversalScrollAnimation([isOpen, isPreview, activeAnimConfig], {
    config: activeAnimConfig,
    isOpen,
  });

  // Sync isCoverOpen prop (from Dashboard Editor toggle)
  useEffect(() => {
    if (isCoverOpen !== undefined) {
      setIsOpen(isCoverOpen);
    }
  }, [isCoverOpen]);

  // Audio player hook
  const defaultMusicUrl = data.music_url || theme.music_url || fallbackMusicUrl;
  const { isPlaying, toggle, play } = useAudioPlayer(defaultMusicUrl);

  // Real-time countdown hook
  const { days, hours, minutes, seconds } = useCountdown(data.wedding_date_iso);

  // Local Wishes state
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [wishForm, setWishForm] = useState({ name: data.guest_name || '', message: '' });
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // Sync wishes if initialWishes changes (ensures live realtime Supabase wishes reflect immediately)
  useEffect(() => {
    if (initialWishes !== undefined) {
      setWishes(initialWishes);
    }
  }, [initialWishes]);

  // RSVP Form state
  const [rsvpForm, setRsvpForm] = useState({
    name: data.guest_name || '',
    status: 'hadir',
    pax: 1,
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Image Modal state (Gallery Lightbox)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Close gallery lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' | 'copy' = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(msg);
    setToastType(type);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2400);
  };

  // Handler buka undangan with smooth transition
  const handleOpenInvitation = () => {
    setIsOpening(true);
    play();
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mbell_cover_opened'));
      }
    }, 600);
  };

  // Handler copy rekening
  const handleCopyAccount = (accountNumber: string, index: number) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccountIndex(index);
    showToast('No. rekening disalin', 'copy');
    setTimeout(() => setCopiedAccountIndex(null), 2500);
  };

  // Handler copy alamat kado
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    showToast('Alamat kado disalin', 'copy');
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Handler RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitRsvp) {
      onSubmitRsvp(rsvpForm.name, rsvpForm.status, rsvpForm.pax);
    }
    setRsvpSubmitted(true);
    showToast('Konfirmasi kehadiran terkirim', 'success');
    setTimeout(() => setRsvpSubmitted(false), 2400);
  };

  // Handler Wish Submit
  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name.trim() || !wishForm.message.trim()) return;

    const newWish: WishItem = {
      id: Date.now().toString(),
      guest_name: wishForm.name,
      message: wishForm.message,
      attendance: rsvpForm.status === 'hadir' ? 'attending' : 'declined',
      created_at: new Date().toISOString(),
    };

    setWishes((prev) => [newWish, ...prev]);
    if (onSubmitWish) {
      onSubmitWish(wishForm.name, wishForm.message);
    }
    setWishForm({ name: '', message: '' });
    setWishSubmitted(true);
    showToast('Ucapan berhasil dikirim', 'success');
    setTimeout(() => setWishSubmitted(false), 2400);
  };

  // Helpers for couple order
  const firstPerson = data.is_bride_first ? data.bride : data.groom;
  const secondPerson = data.is_bride_first ? data.groom : data.bride;
  const firstPersonRole = data.is_bride_first ? 'Sang Mempelai Wanita' : 'Sang Mempelai Pria';
  const secondPersonRole = data.is_bride_first ? 'Sang Mempelai Pria' : 'Sang Mempelai Wanita';

  // Section visibility checks
  const isSectionActive = (sectionName: string) => {
    if (!theme.active_sections || theme.active_sections.length === 0) return true;
    return theme.active_sections.includes(sectionName);
  };

  return {
    isOpen,
    setIsOpen,
    isOpening,
    handleOpenInvitation,
    isPlaying,
    toggleMusic: toggle,
    playMusic: play,
    countdown: { days, hours, minutes, seconds },
    wishes,
    setWishes,
    wishForm,
    setWishForm,
    wishSubmitted,
    handleWishSubmit,
    rsvpForm,
    setRsvpForm,
    rsvpSubmitted,
    handleRsvpSubmit,
    selectedImage,
    setSelectedImage,
    showAllGallery,
    setShowAllGallery,
    copiedAccountIndex,
    copiedAddress,
    handleCopyAccount,
    handleCopyAddress,
    activeGiftTab,
    setActiveGiftTab,
    toastMessage,
    toastType,
    showToast,
    firstPerson,
    secondPerson,
    firstPersonRole,
    secondPersonRole,
    isSectionActive,
    anim,
  };
}
