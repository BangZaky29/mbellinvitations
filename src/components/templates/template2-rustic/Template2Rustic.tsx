import React from 'react';
import type { InvitationProps } from '../../../types/invitation';
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
  FooterSection,
} from './sections';

export const Template2Rustic: React.FC<InvitationProps> = ({
  data,
  theme,
  wishes: initialWishes = [],
  isPreview = false,
  isCoverOpen = false,
  onSubmitRsvp,
  onSubmitWish,
}) => {
  const {
    isOpen,
    isOpening,
    handleOpenInvitation,
    isPlaying,
    toggleMusic,
    countdown,
    wishes,
    wishForm,
    setWishForm,
    handleWishSubmit,
    rsvpForm,
    setRsvpForm,
    handleRsvpSubmit,
    selectedImage,
    setSelectedImage,
    showAllGallery,
    setShowAllGallery,
    activeGiftTab,
    setActiveGiftTab,
    toastMessage,
    toastType,
    showToast,
    firstPerson,
    secondPerson,
    isSectionActive,
    renderSwipeHint,
    renderBrandFooter,
  } = useTemplateState({
    data,
    theme,
    wishes: initialWishes,
    isPreview,
    isCoverOpen,
    onSubmitRsvp,
    onSubmitWish,
    fallbackMusicUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-walk-257.mp3',
  });

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(label);
  };

  return (
    <div
      className="theme-rustic bg-[#EBF0EC] min-h-screen flex justify-center text-[#1b1c1a] antialiased no-scrollbar"
      style={{ backgroundColor: '#EBF0EC', color: '#1b1c1a' }}
    >
      {/* Mobile Viewport Container (Max 430px) */}
      <div className="w-full max-w-[430px] min-h-screen relative flex flex-col bg-[#fbf9f5] shadow-[0_12px_36px_-6px_rgba(44,64,52,0.08),0_4px_12px_-2px_rgba(44,64,52,0.04)] overflow-x-clip no-scrollbar">
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />

        {/* Main Content Area */}
        <main
          className={`flex flex-col relative w-full ${
            isOpen ? 'pt-4 pb-28 px-margin' : 'p-0'
          } bg-[#FAF8F5] min-h-screen flex-1`}
        >
          <div
            className={`flex flex-col w-full text-[#1E2E22] relative ${
              !isOpen
                ? isPreview
                  ? 'h-full overflow-hidden'
                  : 'h-[100dvh] overflow-hidden'
                : 'min-h-screen overflow-visible'
            }`}
          >
            {/* ========================================== */}
            {/* SECTION 1: COVER GATE OVERLAY              */}
            {/* ========================================== */}
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

            {/* ========================================== */}
            {/* INNER CONTENT (Tersedia di bawah cover & interaktif) */}
            {/* ========================================== */}
            <div
              className={`flex flex-col w-full ${
                !isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : ''
              }`}
            >
              {/* SECTION 2: HERO & LIVE COUNTDOWN */}
              {isSectionActive('hero') && (
                <HeroSection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                  countdown={countdown}
                />
              )}

              {/* SECTION 3: COUPLE PROFILE (MEMPELAI) */}
              {isSectionActive('couple') && (
                <CoupleSection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                />
              )}

              {/* SECTION 4: LOVE STORY TIMELINE */}
              {theme.show_love_story !== false &&
                isSectionActive('story') &&
                data.love_story &&
                data.love_story.length > 0 && (
                  <StorySection
                    data={data}
                    theme={theme}
                    isPreview={isPreview}
                  />
                )}

              {/* SECTION 5: EVENT DETAILS & VENUE */}
              {isSectionActive('event') && data.events && data.events.length > 0 && (
                <EventSection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                />
              )}

              {/* SECTION 6: PHOTO GALLERY */}
              {theme.show_gallery !== false &&
                isSectionActive('gallery') &&
                data.gallery &&
                data.gallery.length > 0 && (
                  <GallerySection
                    data={data}
                    theme={theme}
                    isPreview={isPreview}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    showAllGallery={showAllGallery}
                    setShowAllGallery={setShowAllGallery}
                  />
                )}

              {/* SECTION 7: RSVP & DIGITAL ENVELOPE */}
              <RsvpGiftSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                isSectionActive={isSectionActive}
                rsvpForm={rsvpForm}
                setRsvpForm={setRsvpForm}
                handleRsvpSubmit={handleRsvpSubmit}
                activeGiftTab={activeGiftTab}
                setActiveGiftTab={setActiveGiftTab}
                handleCopy={handleCopy}
              />

              {/* SECTION 8: LIVE WISHES WALL & GREETINGS */}
              {theme.show_wishes !== false && isSectionActive('wishes') && (
                <WishesSection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  wishes={wishes}
                  wishForm={wishForm}
                  setWishForm={setWishForm}
                  handleWishSubmit={handleWishSubmit}
                />
              )}

              {/* FOOTER ORNAMENT & BRAND FOOTER */}
              <FooterSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
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
                onClick={toggleMusic}
                aria-label="Toggle music playback"
                className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#2C4034]/20 flex items-center justify-center text-[#2C4034] shadow-lg transition-transform active:scale-95 cursor-pointer hover:bg-[#FAF8F5]"
                title="Putar / Hentikan Musik"
              >
                <span
                  className={`material-symbols-outlined text-[20px] text-[#2C4034] ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s' }}
                >
                  {isPlaying ? 'album' : 'music_off'}
                </span>
              </button>
            </div>
          )}
        </FloatingDock>

        {/* Universal Gallery Lightbox */}
        <GalleryLightbox
          isOpen={Boolean(selectedImage)}
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          isPreview={isPreview}
        />
      </div>
    </div>
  );
};

export default Template2Rustic;
