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
} from './sections';

const SectionDivider: React.FC = () => (
  <div className="flex justify-center items-center py-4">
    <span className="w-12 h-[1px] bg-border-subtle"></span>
    <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
    <span className="w-12 h-[1px] bg-border-subtle"></span>
  </div>
);

export const Template1Modern: React.FC<InvitationProps> = ({
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
    toastMessage,
    toastType,
    firstPerson,
    secondPerson,
    firstPersonRole,
    secondPersonRole,
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
    fallbackMusicUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  });

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-start bg-[#ECE8E1] no-scrollbar">
      {/* Sleek Universal Toast Notification */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        isInsideMockup={isPreview}
      />

      {/* Mobile Viewport Container (Max 430px) */}
      <div
        className={`relative w-full max-w-[430px] bg-alabaster shadow-2xl overflow-x-clip border-x border-[#E2DDD3] flex flex-col no-scrollbar ${
          !isOpen
            ? isPreview
              ? 'h-full overflow-hidden'
              : 'h-[100dvh] overflow-hidden'
            : 'h-full min-h-screen overflow-visible'
        }`}
      >
        {/* ========================================== */}
        {/* 1. PHYSICAL DRAGGABLE COVER SHEET OVERLAY  */}
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

        {/* MAIN INVITATION CONTENT (Scrollable when open) */}
        <main className={`w-full transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          {/* 2. HERO & COUNTDOWN SECTION */}
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

          {/* 3. COUPLE PROFILE SECTION */}
          {isSectionActive('couple') && (
            <>
              <SectionDivider />
              <CoupleSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                firstPersonRole={firstPersonRole}
                secondPersonRole={secondPersonRole}
              />
            </>
          )}

          {/* 4. LOVE STORY TIMELINE SECTION */}
          {theme.show_love_story !== false &&
            isSectionActive('story') &&
            data.love_story &&
            data.love_story.length > 0 && (
              <>
                <SectionDivider />
                <StorySection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                />
              </>
            )}

          {/* 5. EVENT DETAILS & CEREMONY SECTION */}
          {isSectionActive('event') && (
            <>
              <SectionDivider />
              <EventSection
                data={data}
                theme={theme}
                isPreview={isPreview}
              />
            </>
          )}

          {/* 6. PHOTO GALLERY SECTION */}
          {theme.show_gallery !== false &&
            isSectionActive('gallery') &&
            data.gallery &&
            data.gallery.length > 0 && (
              <>
                <SectionDivider />
                <GallerySection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  showAllGallery={showAllGallery}
                  setShowAllGallery={setShowAllGallery}
                />
              </>
            )}

          {/* 7. RSVP & DIGITAL ENVELOPE SECTION */}
          <SectionDivider />
          <RsvpGiftSection
            data={data}
            theme={theme}
            isPreview={isPreview}
            isSectionActive={isSectionActive}
            rsvpForm={rsvpForm}
            setRsvpForm={setRsvpForm}
            rsvpSubmitted={rsvpSubmitted}
            handleRsvpSubmit={handleRsvpSubmit}
            copiedAccountIndex={copiedAccountIndex}
            copiedAddress={copiedAddress}
            handleCopyAccount={handleCopyAccount}
            handleCopyAddress={handleCopyAddress}
          />

          {/* 8. LIVE WISHES WALL SECTION */}
          {theme.show_wishes !== false && isSectionActive('wishes') && (
            <>
              <SectionDivider />
              <WishesSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                wishes={wishes}
                wishForm={wishForm}
                setWishForm={setWishForm}
                wishSubmitted={wishSubmitted}
                handleWishSubmit={handleWishSubmit}
                renderBrandFooter={renderBrandFooter}
              />
            </>
          )}
        </main>

        {/* FLOATING AUDIO CONTROLLER BUBBLE */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 pointer-events-auto`}>
              <button
                id="music-btn"
                type="button"
                onClick={toggleMusic}
                className="w-11 h-11 rounded-full glass-button border border-border-subtle shadow-lg flex items-center justify-center text-gold-champagne hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title="Putar / Hentikan Musik"
              >
                <i
                  id="music-icon"
                  className={`fa-solid fa-compact-disc text-xl animate-spin-slow ${
                    !isPlaying ? 'paused' : ''
                  }`}
                ></i>
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

export default Template1Modern;
