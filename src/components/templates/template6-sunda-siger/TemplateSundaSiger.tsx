import React, { useState } from 'react';
import type { InvitationProps } from '../../../types/invitation';
import { useTemplateState } from '../../../hooks/useTemplateState';
import { openGoogleCalendar } from '../../../utils/calendarHelper';
import { FloatingDock } from '../../common/FloatingDock';
import { SleekToast } from '../../common/SleekToast';
import { GalleryLightbox } from '../../common/GalleryLightbox';
import { DraggableCoverSheet } from '../../common/DraggableCoverSheet';
import { FallingPetals } from './components/FallingPetals';
import {
  CoverSection,
  HeroSection,
  CoupleSection,
  EventSection,
  GallerySection,
  RsvpSection,
  WishesSection,
  GiftSection,
  ClosingFooterSection,
} from './sections';
import { UniversalDresscodeSection } from '../../common/UniversalDresscodeSection';

export const TemplateSundaSiger: React.FC<InvitationProps> = ({
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
    handleCopyAccount,
    handleCopyAddress,
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
    fallbackMusicUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  });

  const [activeRsvpTab, setActiveRsvpTab] = useState<'hadir' | 'ragu' | 'tidak'>('hadir');

  // Handle Calendar Save (Universal Engine)
  const handleSaveToCalendar = () => {
    openGoogleCalendar(data, undefined, () => {
      showToast('Membuka Google Calendar', 'info');
    });
  };

  const recipientName = data.guest_name || 'Bapak/Ibu/Saudara/i';
  const coupleOrderTitle = `${firstPerson.name} & ${secondPerson.name}`;
  const weddingDateStr = data.wedding_date_display || 'Sabtu, 24 Oktober 2026';
  const venueCity =
    data.events?.[0]?.venue_city ||
    data.events?.[0]?.venue_name ||
    data.events?.[1]?.venue_city ||
    'Indonesia';

  return (
    <div
      className="theme-sunda bg-[#fbf9f6] text-[#1b1c1a] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-[#ad8633]/20 selection:text-[#5d4201] w-full no-scrollbar"
      style={{ backgroundColor: '#fbf9f6', color: '#1b1c1a' }}
    >
      {/* Sleek Universal Toast Notification */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        isInsideMockup={isPreview}
      />

      {/* Falling Jasmine Petals Ambient Particle Animation */}
      <FallingPetals />

      {/* Main Container Phone Frame Max-Width 430px */}
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#fbf9f6] shadow-[0_20px_50px_rgba(119,90,25,0.08)] overflow-x-clip no-scrollbar border-x border-[#ede9e1]/80">
        <main className="flex-1 flex flex-col w-full bg-[#fbf9f6] relative">
          <div
            className={`flex flex-col w-full text-[#1b1c1a] relative ${
              !isOpen
                ? isPreview
                  ? 'h-full overflow-hidden'
                  : 'h-[100dvh] overflow-hidden'
                : 'min-h-screen overflow-visible'
            }`}
          >
            {/* 1. PHYSICAL DRAGGABLE COVER SHEET OVERLAY */}
            <DraggableCoverSheet
              isOpen={isOpen}
              isOpening={isOpening}
              onOpenInvitation={handleOpenInvitation}
            >
              <CoverSection
                data={data}
                isPreview={isPreview}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                coupleOrderTitle={coupleOrderTitle}
                weddingDateStr={weddingDateStr}
                venueCity={venueCity}
                recipientName={recipientName}
                handleOpenInvitation={handleOpenInvitation}
                renderSwipeHint={renderSwipeHint}
              />
            </DraggableCoverSheet>

            {/* 2. INNER CONTENT (Tersedia di bawah cover & interaktif) */}
            <div
              className={`flex flex-col w-full ${
                !isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : ''
              }`}
            >
              {/* HERO SCRIPTURE & LIVE COUNTDOWN */}
              {(isSectionActive('cover') || isSectionActive('hero')) && (
                <HeroSection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  isSectionActive={isSectionActive}
                  countdown={countdown}
                  handleSaveToCalendar={handleSaveToCalendar}
                />
              )}

              {/* MEMPELAI (COUPLE PROFILE) */}
              {isSectionActive('couple') && (
                <CoupleSection
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                  coupleOrderTitle={coupleOrderTitle}
                />
              )}

              {/* CULTURAL WEDDING EVENT DETAILS (AKAD & RESEPSI) */}
              {isSectionActive('event') && (
                <EventSection
                  data={data}
                  isPreview={isPreview}
                />
              )}

              {/* DRESS CODE PALETTE SECTION */}
              {isSectionActive('dresscode') && (
                <UniversalDresscodeSection data={data} themeStyle="sunda" />
              )}

              {/* PHOTO GALLERY SECTION */}
              {isSectionActive('gallery') && data.gallery && data.gallery.length > 0 && (
                <GallerySection
                  data={data}
                  isPreview={isPreview}
                  setSelectedImage={setSelectedImage}
                  showAllGallery={showAllGallery}
                  setShowAllGallery={setShowAllGallery}
                />
              )}

              {/* Universal Gallery Lightbox */}
              <GalleryLightbox
                isOpen={Boolean(selectedImage)}
                imageUrl={selectedImage}
                onClose={() => setSelectedImage(null)}
                isPreview={isPreview}
              />

              {/* INTERACTIVE RSVP & VIP CARD */}
              {isSectionActive('rsvp') && (
                <RsvpSection
                  rsvpForm={rsvpForm}
                  setRsvpForm={setRsvpForm}
                  activeRsvpTab={activeRsvpTab}
                  setActiveRsvpTab={setActiveRsvpTab}
                  handleRsvpSubmit={handleRsvpSubmit}
                />
              )}

              {/* LIVE WISHES WALL (BUKU TAMU) */}
              {isSectionActive('wishes') && (
                <WishesSection
                  wishes={wishes}
                  wishForm={wishForm}
                  setWishForm={setWishForm}
                  handleWishSubmit={handleWishSubmit}
                />
              )}

              {/* DIGITAL ENVELOPE (AMPLOP DIGITAL & KADO) */}
              {(isPreview || (theme?.show_gift !== false && isSectionActive('gift'))) && (
                <GiftSection
                  data={data}
                  isPreview={isPreview}
                  handleCopyAccount={handleCopyAccount}
                  handleCopyAddress={handleCopyAddress}
                />
              )}

              {/* CLOSING & SUNDANESE BLESSING */}
              <ClosingFooterSection
                data={data}
                coupleOrderTitle={coupleOrderTitle}
                renderBrandFooter={renderBrandFooter}
              />
            </div>
          </div>
        </main>

        {/* FLOATING AUDIO CONTROLLER BUBBLE */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <aside
              className={`${
                isPreview ? 'absolute' : 'fixed'
              } bottom-5 right-5 z-40 flex items-center justify-center pointer-events-auto`}
            >
              <button
                type="button"
                onClick={toggleMusic}
                aria-label="Putar Musik Gending Sunda"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-[#b38728] to-[#8a6822] border border-[#ffe082]/40 shadow-xl transition-transform active:scale-95 cursor-pointer ring-1 ring-black/10"
              >
                <div
                  className={`w-9 h-9 rounded-full bg-[#2c241c] flex items-center justify-center ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[#e8c676] text-lg">
                    {isPlaying ? 'music_note' : 'music_off'}
                  </span>
                </div>
              </button>
            </aside>
          )}
        </FloatingDock>
      </div>
    </div>
  );
};

export default TemplateSundaSiger;
