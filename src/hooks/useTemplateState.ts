import React, { useState, useEffect, useRef } from 'react';
import type { InvitationProps, WishItem } from '../types/invitation';
import { useCountdown } from './useCountdown';
import { useAudioPlayer } from './useAudioPlayer';
import { useUniversalScrollAnimation, anim } from '../utils/scrollAnimationEngine';
import { renderMbellBrandFooter, type MbellBrandFooterProps } from '../components/common/MbellBrandFooter';
import { CoverSwipeHint, type CoverSwipeHintProps } from '../components/common/CoverSwipeHint';

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

  // Real-time countdown hook targeting active countdown event dynamically
  const targetCountdownISO = React.useMemo(() => {
    const rawEvents = data.events;
    const events = Array.isArray(rawEvents)
      ? rawEvents
      : rawEvents && typeof rawEvents === 'object'
      ? Object.values(rawEvents)
      : [];
    const activeIdx = data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;
    const targetEvent = events[activeIdx] || events[0];

    if (targetEvent?.date) {
      const dateStr = String(targetEvent.date).trim();
      const timeStr = targetEvent.start_time || '09:00';
      const tzStr = targetEvent.timezone || 'WIB';
      const tzOffset = tzStr === 'WIT' ? '+09:00' : tzStr === 'WITA' ? '+08:00' : '+07:00';
      const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;

      const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T${formattedTime}${tzOffset}`;
      }
      const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (slashMatch) {
        const y = slashMatch[3];
        const m = String(slashMatch[2]).padStart(2, '0');
        const d = String(slashMatch[1]).padStart(2, '0');
        return `${y}-${m}-${d}T${formattedTime}${tzOffset}`;
      }
    }
    if (data.wedding_date_iso) {
      return data.wedding_date_iso;
    }
    return '2026-11-14T09:00:00+07:00';
  }, [data.wedding_date_iso, data.events, data.countdown_target]);

  const { days, hours, minutes, seconds } = useCountdown(targetCountdownISO);

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

  // RSVP Form state (Unified: Kehadiran, Jumlah Tamu & Doa/Ucapan)
  const [rsvpForm, setRsvpForm] = useState({
    name: data.guest_name || '',
    status: 'hadir',
    pax: 1,
    notes: '',
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

  // Handler buka undangan with smooth paper lift transition
  const handleOpenInvitation = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    play();
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mbell_cover_opened'));
      }
    }, 500);
  };

  // Touch & Pointer gesture tracking for swipe-up cover opening
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isOpen || isOpening) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartY.current = clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (isOpen || isOpening || touchStartY.current === null) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = touchStartY.current - clientY; // Nilai positif = usap/geser ke atas
    const deltaTime = Date.now() - touchStartTime.current;

    // Trigger open jika diusap ke atas > 40px atau flick cepat > 20px
    if (deltaY > 40 || (deltaY > 20 && deltaTime < 350)) {
      handleOpenInvitation();
    }
    touchStartY.current = null;
  };

  const coverSwipeProps = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseUp: handleTouchEnd,
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

  // Handler RSVP Submit (Unified: Kirim Konfirmasi Kehadiran & Doa Restu Sekaligus)
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) {
      showToast('Mohon masukkan nama lengkap Anda', 'error');
      return;
    }

    try {
      // 1. Kirim Konfirmasi Kehadiran -> Tabel guests (Dashboard: Daftar Tamu)
      if (onSubmitRsvp) {
        const res = await onSubmitRsvp(rsvpForm.name, rsvpForm.status, rsvpForm.pax, rsvpForm.notes);
        if (res && typeof res === 'object' && 'success' in res && !(res as any).success) {
          throw new Error((res as any).message || 'Gagal menyimpan konfirmasi kehadiran');
        }
      }

      // 2. Jika ada pesan doa restu, kirim -> Tabel wishes (Dashboard: Ucapan Masuk)
      const wishMsg = rsvpForm.notes?.trim();
      if (wishMsg) {
        if (onSubmitWish) {
          await onSubmitWish(rsvpForm.name, wishMsg, rsvpForm.status);
        }

        // Optimistic UI: Tampilkan seketika di daftar ucapan realtime
        const newWish: WishItem = {
          id: `local-${Date.now()}`,
          guest_name: rsvpForm.name.trim(),
          message: wishMsg,
          attendance: rsvpForm.status === 'hadir' || rsvpForm.status === 'attending' ? 'attending' : 'declined',
          created_at: new Date().toISOString(),
        };
        setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);
      }

      setRsvpSubmitted(true);
      showToast('Konfirmasi kehadiran & ucapan berhasil dikirim!', 'success');
      // Kosongkan pesan ucapan setelah terkirim
      setRsvpForm((prev: any) => ({ ...prev, notes: '' }));
      setTimeout(() => setRsvpSubmitted(false), 2500);
    } catch (err: any) {
      console.error('[RSVP] Error submitting:', err);
      showToast(err?.message || 'Gagal mengirim konfirmasi, silakan coba lagi', 'error');
    }
  };

  // Handler Wish Submit (Fallback / Standalone bila dipanggil terpisah)
  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name.trim() || !wishForm.message.trim()) return;

    try {
      const newWish: WishItem = {
        id: Date.now().toString(),
        guest_name: wishForm.name,
        message: wishForm.message,
        attendance: rsvpForm.status === 'hadir' ? 'attending' : 'declined',
        created_at: new Date().toISOString(),
      };

      setWishes((prev) => [newWish, ...prev]);
      if (onSubmitWish) {
        await onSubmitWish(wishForm.name, wishForm.message);
      }
      setWishForm({ name: '', message: '' });
      setWishSubmitted(true);
      showToast('Ucapan berhasil dikirim', 'success');
      setTimeout(() => setWishSubmitted(false), 2400);
    } catch (err: any) {
      console.error('[Wish] Error submitting:', err);
      showToast('Gagal mengirim ucapan, silakan coba lagi', 'error');
    }
  };

  // Helpers for couple order
  const firstPerson = data.is_bride_first ? data.bride : data.groom;
  const secondPerson = data.is_bride_first ? data.groom : data.bride;
  const firstPersonRole = data.is_bride_first ? 'Sang Mempelai Wanita' : 'Sang Mempelai Pria';
  const secondPersonRole = data.is_bride_first ? 'Sang Mempelai Pria' : 'Sang Mempelai Wanita';

  // Section visibility checks with SSOT resolution for dresscode and quote
  const isSectionActive = (sectionName: string) => {
    // 1. Khusus dresscode: periksa themeConfig.show_dresscode, data.dresscode.enabled, dan active_sections
    if (sectionName === 'dresscode') {
      if (theme.show_dresscode === false) return false;
      if (data.dresscode && data.dresscode.enabled === false) return false;
      if (theme.active_sections && !theme.active_sections.includes('dresscode')) return false;
      return true;
    }

    // 2. Khusus quote / doa: periksa themeConfig.show_quote dan active_sections
    if (sectionName === 'quote') {
      if (theme.show_quote === false) return false;
      if (theme.active_sections && !theme.active_sections.includes('quote')) return false;
      return true;
    }

    // 3. Khusus livestream: periksa themeConfig.show_livestream dan active_sections
    if (sectionName === 'livestream' || sectionName === 'live_stream') {
      if (theme.show_livestream === false) return false;
      if (
        theme.active_sections &&
        !theme.active_sections.includes('livestream') &&
        !theme.active_sections.includes('live_stream')
      ) {
        return false;
      }
      return true;
    }

    // 4. Section umum lainnya
    if (!theme.active_sections || theme.active_sections.length === 0) return true;
    return theme.active_sections.includes(sectionName);
  };

  // Dynamic Cover & Couple Photo Resolution with seamless fallback
  const resolvedCoverImage = data.cover_image || data.couple_photo || '';
  const resolvedCouplePhoto = data.couple_photo || data.cover_image || '';

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
    resolvedCoverImage,
    resolvedCouplePhoto,
    anim,
    coverSwipeProps,
    renderSwipeHint: (extraProps?: Partial<CoverSwipeHintProps>) =>
      React.createElement(CoverSwipeHint, {
        isOpen,
        ...extraProps,
      }),
    renderBrandFooter: (extraProps?: Partial<MbellBrandFooterProps>) =>
      renderMbellBrandFooter({
        themeId: (theme as any)?.theme_id || (data as any)?.theme_id || '',
        isOpen,
        ...extraProps,
      }),
  };
}
