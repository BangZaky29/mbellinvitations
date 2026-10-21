import React, { useState } from 'react';
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

export const Template3Jawa: React.FC<InvitationProps> = ({
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
    selectedImage,
    setSelectedImage,
    showAllGallery,
    setShowAllGallery,
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

  // RSVP Form state specific to Javanese theme
  const [rsvpForm, setRsvpForm] = useState({
    name: data.guest_name || '',
    guests: 2,
    presence: 'hadir',
  });
  const [rsvpToastVisible, setRsvpToastVisible] = useState(false);

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(label);
  };

  // Handler RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitRsvp) {
      onSubmitRsvp(rsvpForm.name, rsvpForm.presence, rsvpForm.guests);
    }
    setRsvpToastVisible(true);
    setTimeout(() => setRsvpToastVisible(false), 4000);
    showToast('Matur nuwun, konfirmasi rawuh panjenengan sampun katampi!');
  };

  return (
    <div
      className="theme-jawa dark bg-[#120E0B] min-h-screen font-body-md text-body-md text-[#FAF6F0] antialiased flex justify-center no-scrollbar"
      style={{ backgroundColor: '#120E0B', color: '#FAF6F0' }}
    >
      {/* Mobile Viewport Container (Max 430px) */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#14100D] relative flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.95)] overflow-x-clip border-x border-[#D4AF37]/25 no-scrollbar">
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />

        <main className="flex flex-col relative w-full bg-[#14100D] min-h-screen flex-1">
          <div
            className={`flex flex-col w-full relative ${
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
            {/* SECTION 2: HERO & COUNTDOWN                */}
            {/* ========================================== */}
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

            {/* ========================================== */}
            {/* SECTION 3: COUPLE PROFILE                  */}
            {/* ========================================== */}
            {isSectionActive('couple') && (
              <CoupleSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                firstPersonRole=""
                secondPersonRole=""
              />
            )}

            {/* ========================================== */}
            {/* SECTION 4: LOVE STORY TIMELINE             */}
            {/* ========================================== */}
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

            {/* ========================================== */}
            {/* SECTION 5: EVENT DETAILS & VENUE           */}
            {/* ========================================== */}
            {isSectionActive('event') && data.events && data.events.length > 0 && (
              <EventSection
                data={data}
                theme={theme}
                isPreview={isPreview}
              />
            )}

            {/* ========================================== */}
            {/* SECTION 6: PHOTO GALLERY                   */}
            {/* ========================================== */}
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

            {/* ========================================== */}
            {/* SECTION 7: RSVP & DIGITAL ENVELOPE         */}
            {/* ========================================== */}
            <RsvpGiftSection
              data={data}
              theme={theme}
              isPreview={isPreview}
              isSectionActive={isSectionActive}
              rsvpForm={rsvpForm}
              setRsvpForm={setRsvpForm}
              rsvpToastVisible={rsvpToastVisible}
              handleRsvpSubmit={handleRsvpSubmit}
              handleCopy={handleCopy}
            />

            {/* ========================================== */}
            {/* SECTION 8: LIVE WISHES WALL & GUESTBOOK    */}
            {/* ========================================== */}
            {theme.show_wishes !== false && isSectionActive('wishes') && (
              <WishesSection
                data={data}
                theme={theme}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                wishes={wishes}
                wishForm={wishForm}
                setWishForm={setWishForm}
                handleWishSubmit={handleWishSubmit}
                renderBrandFooter={renderBrandFooter}
              />
            )}
          </div>
        </main>

        {/* FLOATING AUDIO CONTROLLER BUBBLE */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <aside className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 flex items-center justify-center pointer-events-auto`}>
              <button
                type="button"
                onClick={toggleMusic}
                aria-label="Putar Gamelan Kraton"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-[#322822] border border-[#f2ca50]/40 shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full bg-[#150c08] flex items-center justify-center ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[#f2ca50] text-lg">
                    {isPlaying ? 'music_note' : 'music_off'}
                  </span>
                </div>
              </button>
            </aside>
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

export default Template3Jawa;
