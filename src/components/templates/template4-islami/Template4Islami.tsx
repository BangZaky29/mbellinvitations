import React, { useState, useEffect } from 'react';
import type { InvitationProps, WishItem } from '../../../types/invitation';
import { useTemplateState } from '../../../hooks/useTemplateState';
import { FloatingDock } from '../../common/FloatingDock';
import { SleekToast } from '../../common/SleekToast';
import { GalleryLightbox } from '../../common/GalleryLightbox';
import { DraggableCoverSheet } from '../../common/DraggableCoverSheet';
import {
  CoverSection,
  HeroSection,
  CoupleSection,
  StorySection,
  EventSection,
  GallerySection,
  RsvpGiftSection,
  WishesSection,
} from './sections';

export const Template4Islami: React.FC<InvitationProps> = ({
  data,
  theme,
  wishes: initialWishes = [],
  isCoverOpen: propIsCoverOpen,
  isPreview = false,
  onSubmitRsvp,
  onSubmitWish,
}) => {
  const {
    isOpen,
    isOpening,
    handleOpenInvitation,
    isPlaying,
    toggleMusic: toggleAudio,
    countdown,
    toastMessage,
    toastType,
    showToast,
    firstPerson,
    secondPerson,
    renderSwipeHint,
    renderBrandFooter,
  } = useTemplateState({
    data,
    theme,
    wishes: initialWishes,
    isCoverOpen: propIsCoverOpen,
    isPreview,
    onSubmitRsvp,
    onSubmitWish,
    fallbackMusicUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  });

  // Copy to Clipboard State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string, label: string = 'No. rekening disalin') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      showToast(label, 'copy');
      setTimeout(() => setCopiedKey(null), 2200);
    });
  };

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(data.guest_name || '');
  const [rsvpPax, setRsvpPax] = useState('1');
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'ragu' | 'tidak'>('hadir');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    const statusMap: Record<'hadir' | 'ragu' | 'tidak', 'attending' | 'pending' | 'declined'> = {
      hadir: 'attending',
      ragu: 'pending',
      tidak: 'declined',
    };
    if (onSubmitRsvp) {
      onSubmitRsvp(rsvpName, statusMap[rsvpStatus], Number(rsvpPax));
    }
    setRsvpSubmitted(true);
    showToast('Konfirmasi kehadiran terkirim', 'success');
  };

  // Wishes State
  const [wishesList, setWishesList] = useState<WishItem[]>(initialWishes);
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');

  useEffect(() => {
    if (initialWishes !== undefined) {
      setWishesList(initialWishes);
    }
  }, [initialWishes]);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;

    const newWish: WishItem = {
      id: Date.now().toString(),
      guest_name: wishName.trim(),
      message: wishMessage.trim(),
      attendance: 'attending',
      created_at: new Date().toISOString(),
    };

    setWishesList((prev) => [newWish, ...prev]);
    if (onSubmitWish) {
      onSubmitWish(wishName.trim(), wishMessage.trim());
    }
    setWishMessage('');
    showToast('Ucapan berhasil dikirim', 'success');
  };

  // Lightbox Modal
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Close gallery lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    if (lightboxImg) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImg]);

  // Calendar Handler
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`Walimatul Ursy: ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Akad Nikah & Resepsi Pernikahan ${data.groom.full_name} dan ${data.bride.full_name}.`
    );
    const location = encodeURIComponent(
      data.events[1]?.venue_name || data.events[0]?.venue_name || 'Grand Asrilia Hotel Bandung'
    );
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20250524T010000Z/20250524T070000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div
      className="theme-islami bg-[#fcf8f8] flex justify-center min-h-screen text-[#1c1b1c] antialiased font-sans w-full no-scrollbar"
      style={{ backgroundColor: '#fcf8f8', color: '#1c1b1c' }}
    >
      <div className="w-full max-w-[430px] min-h-screen bg-surface flex flex-col relative shadow-[0_20px_50px_rgba(94,40,50,0.08)] overflow-x-clip no-scrollbar">
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />

        {/* TOP FIXED APP BAR */}
        {isOpen && (
          <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-16 px-margin flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary truncate max-w-[190px]">
                  {data.groom.name} &amp; {data.bride.name}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  aria-label="Toggle Musik Latar"
                  onClick={toggleAudio}
                  className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(94,40,50,0.08)] hover:bg-surface-container transition-colors cursor-pointer"
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isPlaying ? 'animate-spin-slow' : ''
                    }`}
                  >
                    {isPlaying ? 'music_note' : 'music_off'}
                  </span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* MAIN BODY */}
        <main
          className={`flex-1 flex flex-col relative w-full bg-surface ${
            isOpen ? 'pt-16 pb-6' : 'p-0'
          }`}
        >
          <div
            className={`flex flex-col w-full text-on-surface relative ${
              !isOpen
                ? isPreview
                  ? 'h-full overflow-hidden'
                  : 'h-[100dvh] overflow-hidden'
                : 'min-h-screen overflow-visible'
            }`}
          >
            {/* SECTION 1: Cover Gate Overlay */}
            <DraggableCoverSheet
              isOpen={isOpen}
              isOpening={isOpening}
              onOpenInvitation={handleOpenInvitation}
            >
              <CoverSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                handleOpenInvitation={handleOpenInvitation}
                renderSwipeHint={renderSwipeHint}
              />
            </DraggableCoverSheet>

            {/* INNER CONTENT */}
            <div
              className={`flex flex-col w-full ${
                !isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : ''
              }`}
            >
              {/* SECTION 2: Hero & Countdown */}
              <HeroSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                countdown={countdown}
              />

              {/* SECTION 3: Couple Profile */}
              <CoupleSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                firstPersonRole=""
                secondPersonRole=""
              />

              {/* SECTION 4: Love Story Timeline */}
              {theme?.show_love_story !== false && data.love_story && (
                <StorySection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                />
              )}

              {/* SECTION 5: Event Details & Venue */}
              <EventSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                handleAddToCalendar={handleAddToCalendar}
              />

              {/* SECTION 6: Photo Gallery */}
              {theme?.show_gallery !== false && data.gallery && (
                <GallerySection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  selectedImage={lightboxImg}
                  setSelectedImage={setLightboxImg}
                  showAllGallery={showAllGallery}
                  setShowAllGallery={setShowAllGallery}
                />
              )}

              {/* SECTION 7: RSVP & Digital Envelope */}
              <RsvpGiftSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                rsvpName={rsvpName}
                setRsvpName={setRsvpName}
                rsvpPax={rsvpPax}
                setRsvpPax={setRsvpPax}
                rsvpStatus={rsvpStatus}
                setRsvpStatus={setRsvpStatus}
                rsvpSubmitted={rsvpSubmitted}
                handleRsvpSubmit={handleRsvpSubmit}
                copiedKey={copiedKey}
                handleCopy={handleCopy}
              />

              {/* SECTION 8: Live Wishes Wall & Closing */}
              <WishesSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                wishesList={wishesList}
                wishName={wishName}
                setWishName={setWishName}
                wishMessage={wishMessage}
                setWishMessage={setWishMessage}
                handleWishSubmit={handleWishSubmit}
                renderBrandFooter={renderBrandFooter}
              />
            </div>
          </div>
        </main>

        {/* FLOATING AUDIO CONTROLLER BUBBLE */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 pointer-events-auto`}>
              <button
                type="button"
                onClick={toggleAudio}
                aria-label="Toggle Musik Latar"
                className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-secondary-container/40 flex items-center justify-center text-primary shadow-[0_4px_16px_rgba(94,40,50,0.18)] transition-transform active:scale-95 cursor-pointer hover:bg-surface-container"
                title="Putar / Hentikan Musik"
              >
                <span
                  className={`material-symbols-outlined text-[20px] text-primary ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                >
                  {isPlaying ? 'music_note' : 'music_off'}
                </span>
              </button>
            </div>
          )}
        </FloatingDock>

        {/* LIGHTBOX PHOTO MODAL */}
        <GalleryLightbox
          isOpen={Boolean(lightboxImg)}
          imageUrl={lightboxImg}
          onClose={() => setLightboxImg(null)}
          isPreview={isPreview}
        />
      </div>
    </div>
  );
};

export default Template4Islami;
