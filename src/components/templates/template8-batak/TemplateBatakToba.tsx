import React from 'react';
import type { InvitationProps } from '../../../types/invitation';
import { useTemplateState } from '../../../hooks/useTemplateState';
import { FloatingDock } from '../../common/FloatingDock';
import { SleekToast } from '../../common/SleekToast';
import { GalleryLightbox } from '../../common/GalleryLightbox';
import { DraggableCoverSheet } from '../../common/DraggableCoverSheet';
import { UlosSideBorder } from './components';
import {
  CoverSection,
  HeroSection,
  CoupleSection,
  StorySection,
  EventSection,
  DresscodeSection,
  GallerySection,
  GiftSection,
  RsvpSection,
  WishesSection,
  ClosingFooterSection,
} from './sections';

export const TemplateBatakToba: React.FC<InvitationProps> = ({
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
    fallbackMusicUrl:
      'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  });

  // Handle Google Calendar Save
  const handleSaveToCalendar = () => {
    const rawEvents = data.events;
    const events = Array.isArray(rawEvents)
      ? rawEvents
      : rawEvents && typeof rawEvents === 'object'
      ? Object.values(rawEvents)
      : [];
    const activeIdx = data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;
    const targetEvent = events[activeIdx] || events[0] || {};

    const eventTitle = targetEvent.title || targetEvent.name || 'Pesta Adat Batak Toba';
    const title = encodeURIComponent(
      `${eventTitle} — ${firstPerson.name} & ${secondPerson.name}`
    );
    const details = encodeURIComponent(
      `Pernikahan Kudus & Pesta Adat Batak Toba ${data.groom.full_name || data.groom.name} & ${data.bride.full_name || data.bride.name}. Dua gabe sada di bagas holong ni Kristus.`
    );
    const location = encodeURIComponent(
      targetEvent.venue_name || targetEvent.location_name || targetEvent.venue_address || 'Jakarta'
    );
    const dateFormatted = data.wedding_date_iso
      ? data.wedding_date_iso.replace(/[-:]/g, '').split('+')[0]
      : '20261114T090000';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}/${dateFormatted}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Membuka Google Calendar', 'info');
  };

  const recipientName = data.guest_name || 'Bapak/Ibu/Saudara/i';
  const coupleOrderTitle = `${firstPerson.name} & ${secondPerson.name}`;
  const weddingDateStr = data.wedding_date_display || 'Sabtu, 14 November 2026';
  const venueCity =
    data.events?.[1]?.venue_city ||
    data.events?.[0]?.venue_city ||
    'Jakarta Pusat';

  return (
    <div
      className="theme-batak bg-[#140D09] text-[#FAF6EE] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-[#EAC16E] selection:text-[#140D09] w-full no-scrollbar"
      style={{ backgroundColor: '#140D09', color: '#FAF6EE' }}
    >
      {/* Universal Sleek Toast Notification */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        isInsideMockup={isPreview}
      />

      {/* Main Mobile Centered Frame Container (Max-Width 430px) */}
      <div
        className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#19120E] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-x-clip no-scrollbar border-x border-[#EAC16E]/20"
        style={{ backgroundColor: '#19120E' }}
      >
        {/* Continuous Batak Ulos & Gorga Vertical Side Stripes */}
        <UlosSideBorder />

        <main className="flex-1 flex flex-col w-full bg-[#19120E] relative">
          <div
            className={`flex flex-col w-full text-[#FAF6EE] relative ${
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

            {/* 2. INNER INVITATION CONTENT (Tersedia setelah sampul dibuka) */}
            <div
              className={`flex flex-col w-full ${
                !isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : ''
              }`}
            >
              {/* HERO SCRIPTURE & LIVE COUNTDOWN & CALENDAR */}
              {(isSectionActive('cover') || isSectionActive('hero')) && (
                <HeroSection
                  data={data}
                  isPreview={isPreview}
                  countdown={countdown}
                  handleSaveToCalendar={handleSaveToCalendar}
                />
              )}

              {/* COUPLE PROFILES (ANAK NI RAJA & BORU NI RAJA) */}
              {isSectionActive('couple') && (
                <CoupleSection
                  data={data}
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                  coupleOrderTitle={coupleOrderTitle}
                />
              )}

              {/* KISAH CINTA (LOVE STORY) */}
              {isSectionActive('story') &&
                data.love_story &&
                data.love_story.length > 0 && (
                  <StorySection data={data} isPreview={isPreview} />
                )}

              {/* EVENT TIMELINE & VENUE DETAILS (IBADAH & PESTA ADAT) */}
              {isSectionActive('event') && (
                <EventSection
                  data={data}
                  isPreview={isPreview}
                />
              )}

              {/* DRESS CODE PALETTE SECTION */}
              <DresscodeSection
                data={data}
                isPreview={isPreview}
              />

              {/* PHOTO GALLERY (BENTO MEMORIES SHOWCASE) */}
              {isSectionActive('gallery') && (
                <GallerySection
                  data={data}
                  isPreview={isPreview}
                  setSelectedImage={setSelectedImage}
                  showAllGallery={showAllGallery}
                  setShowAllGallery={setShowAllGallery}
                />
              )}

              {/* RSVP & DIGITAL PASS MEJA VIP */}
              {isSectionActive('rsvp') && (
                <RsvpSection
                  data={data}
                  rsvpForm={rsvpForm}
                  setRsvpForm={setRsvpForm}
                  handleRsvpSubmit={handleRsvpSubmit}
                />
              )}

              {/* GUEST WISHES / UCAPAN DOA RESTU */}
              {isSectionActive('wishes') && (
                <WishesSection wishes={wishes} />
              )}

              {/* DIGITAL GIFT / TANDA HOLONG (Card Rekening & Alamat Kado) */}
              {isSectionActive('gift') && (
                <GiftSection
                  data={data}
                  handleCopyAccount={handleCopyAccount}
                  handleCopyAddress={handleCopyAddress}
                />
              )}

              {/* CLOSING FOOTER (MAULIATE GODANG) */}
              <ClosingFooterSection
                data={data}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                renderBrandFooter={renderBrandFooter}
              />
            </div>
          </div>
        </main>

        {/* 3. UNIVERSAL GALLERY LIGHTBOX */}
        <GalleryLightbox
          isOpen={Boolean(selectedImage)}
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          isPreview={isPreview}
        />

        {/* 4. CIRCULAR FLOATING AUDIO BUBBLE */}
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
                aria-label="Putar Musik"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-[#C8A253] text-[#402D00] border border-white/20 shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-lg font-bold">
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

export default TemplateBatakToba;
