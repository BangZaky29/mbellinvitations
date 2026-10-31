import React, { useState, useEffect } from 'react';
import type { InvitationProps } from '../../../types/invitation';
import { useTemplateState } from '../../../hooks/useTemplateState';
import { openGoogleCalendar } from '../../../utils/calendarHelper';
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
  RsvpSection,
  GiftSection,
  WishesSection,
  ClosingFooterSection,
} from './sections';
import { UniversalDresscodeSection } from '../../common/UniversalDresscodeSection';

export const Template5Luxury: React.FC<InvitationProps> = ({
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
    wishes,
    rsvpForm,
    setRsvpForm,
    handleRsvpSubmit,
    toastMessage,
    toastType,
    showToast,
    renderSwipeHint,
    renderBrandFooter,
    isSectionActive,
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

  // Calendar Handler (Universal Engine)
  const handleAddToCalendar = () => {
    openGoogleCalendar(data, undefined, () => {
      showToast('Membuka Google Calendar', 'info');
    });
  };

  // Groom and Bride Initials Monogram
  const monogram = `${data.groom.name.charAt(0)}&${data.bride.name.charAt(0)}`;

  return (
    <div className="theme-luxury bg-surface text-on-surface antialiased flex justify-center min-h-screen selection:bg-primary-container/30 selection:text-on-surface font-sans w-full no-scrollbar">
      <div className="w-full max-w-[430px] min-h-screen bg-surface flex flex-col relative overflow-x-clip no-scrollbar">
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />

        {/* MAIN BODY */}
        <main className={`flex-1 flex flex-col relative w-full ${isOpen ? 'pt-safe pb-safe' : 'p-0'} bg-surface`}>
          <div className={`flex flex-col w-full relative selection:bg-primary-container/30 selection:text-on-surface ${!isOpen ? (isPreview ? 'h-full overflow-hidden' : 'h-[100dvh] overflow-hidden') : 'min-h-screen overflow-visible'
            }`}>
            {/* Ambient Golden Ray Backdrops */}
            <div className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-primary-container/5 blur-3xl z-0"></div>
            <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl z-0"></div>

            {/* SECTION 1: COVER GATE OVERLAY */}
            <DraggableCoverSheet
              isOpen={isOpen}
              isOpening={isOpening}
              onOpenInvitation={handleOpenInvitation}
            >
              <CoverSection
                data={data}
                monogram={monogram}
                handleOpenInvitation={handleOpenInvitation}
                renderSwipeHint={renderSwipeHint}
                isPreview={isPreview}
              />
            </DraggableCoverSheet>

            {/* INNER CONTENT */}
            <div className={`flex flex-col w-full ${!isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : ''}`}>
              {/* SECTION 2: HERO & COUNTDOWN */}
              <HeroSection
                data={data}
                theme={theme}
                isSectionActive={isSectionActive}
                countdown={countdown}
              />

              {/* SECTION 3: COUPLE PROFILE */}
              <CoupleSection
                data={data}
                theme={theme}
                isPreview={isPreview}
              />

              {/* SECTION 4: LOVE STORY */}
              <StorySection
                data={data}
              />

              {/* SECTION 5: EVENT DETAILS */}
              <EventSection
                data={data}
                isPreview={isPreview}
                handleAddToCalendar={handleAddToCalendar}
              />

              {/* SECTION: DRESS CODE */}
              {isSectionActive('dresscode') && (
                <UniversalDresscodeSection data={data} themeStyle="luxury" />
              )}

              {/* SECTION 6: PHOTO GALLERY */}
              <GallerySection
                data={data}
                theme={theme}
                selectedImage={lightboxImg}
                setSelectedImage={setLightboxImg}
                showAllGallery={showAllGallery}
                setShowAllGallery={setShowAllGallery}
              />

              {/* SECTION 7: RSVP */}
              <RsvpSection
                data={data}
                theme={theme}
                rsvpForm={rsvpForm}
                setRsvpForm={setRsvpForm}
                handleRsvpSubmit={handleRsvpSubmit}
              />

              {/* SECTION 8: WISHES STREAM */}
              <WishesSection
                data={data}
                theme={theme}
                wishesList={wishes}
              />

              {/* SECTION 9: DIGITAL GIFT (CARD REKENING & ALAMAT) */}
              <GiftSection
                data={data}
                theme={theme}
                copiedKey={copiedKey}
                handleCopy={handleCopy}
              />

              {/* SECTION 10: CLOSING GRATITUDE & BRAND FOOTER */}
              <ClosingFooterSection
                data={data}
                renderBrandFooter={renderBrandFooter}
              />
            </div>
          </div>
        </main>

        {/* FLOATING CONTROLS: LUXURY AUDIO BUBBLE */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 pointer-events-auto`}>
              <button
                aria-label="Toggle Soundtrack"
                onClick={toggleAudio}
                className="w-11 h-11 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-transform active:scale-95 cursor-pointer hover:bg-neutral-800"
                title="Putar / Hentikan Musik"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[20px] text-amber-300 ${isPlaying ? 'animate-spin-slow' : ''
                    }`}
                >
                  {isPlaying ? 'graphic_eq' : 'volume_off'}
                </span>
              </button>
            </div>
          )}
        </FloatingDock>

        {/* Universal Gallery Lightbox */}
        <GalleryLightbox
          isOpen={Boolean(lightboxImg)}
          imageUrl={lightboxImg}
          onClose={() => setLightboxImg(null)}
          isPreview={isPreview}
          photos={data.gallery || []}
          currentIndex={
            lightboxImg && data.gallery ? data.gallery.indexOf(lightboxImg) : 0
          }
          onIndexChange={(newIdx) => {
            if (data.gallery && data.gallery[newIdx]) {
              setLightboxImg(data.gallery[newIdx]);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Template5Luxury;
