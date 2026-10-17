import { useState, useEffect } from 'react';
import type { InvitationProps, WishItem } from '../types/invitation';
import { useCountdown } from './useCountdown';
import { useAudioPlayer } from './useAudioPlayer';
import { useScrollReveal } from './useScrollReveal';

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
  const [activeGiftTab, setActiveGiftTab] = useState<'transfer' | 'kado'>('transfer');

  // Hook for GPU-accelerated scroll reveal
  useScrollReveal([isOpen, isPreview]);

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

  // Sync wishes if initialWishes changes
  useEffect(() => {
    if (initialWishes && initialWishes.length > 0) {
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handler buka undangan with smooth transition
  const handleOpenInvitation = () => {
    setIsOpening(true);
    play();
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 600);
  };

  // Handler copy rekening
  const handleCopyAccount = (accountNumber: string, index: number) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccountIndex(index);
    showToast('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopiedAccountIndex(null), 2500);
  };

  // Handler copy alamat kado
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    showToast('Alamat berhasil disalin!');
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Handler RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitRsvp) {
      onSubmitRsvp(rsvpForm.name, rsvpForm.status, rsvpForm.pax);
    }
    setRsvpSubmitted(true);
    showToast('Terima kasih atas konfirmasi kehadiran Anda!');
    setTimeout(() => setRsvpSubmitted(false), 4000);
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
    showToast('Ucapan dan doa Anda telah tersampaikan!');
    setTimeout(() => setWishSubmitted(false), 3000);
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
    showToast,
    firstPerson,
    secondPerson,
    firstPersonRole,
    secondPersonRole,
    isSectionActive,
  };
}
