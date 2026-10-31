import React from 'react';
import type { InvitationProps } from '../../../types/invitation';
import { useTemplateState } from '../../../hooks/useTemplateState';
import { openGoogleCalendar } from '../../../utils/calendarHelper';
import { FloatingDock } from '../../common/FloatingDock';
import { SleekToast } from '../../common/SleekToast';
import { GalleryLightbox } from '../../common/GalleryLightbox';
import { DraggableCoverSheet } from '../../common/DraggableCoverSheet';
import {
  BugisTenunWatermark,
  FloatingBugisParticles,
} from './components';
import {
  CoverSection,
  HeroSection,
  QuoteSection,
  CoupleSection,
  EventSection,
  DresscodeSection,
  StorySection,
  GallerySection,
  GiftSection,
  RsvpSection,
  WishesSection,
  ClosingFooterSection,
} from './sections';

export const TemplateBugis: React.FC<InvitationProps> = ({
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
    copiedAccountIndex,
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

  // Dynamic event array resolution
  const rawEvents = data.events;
  const eventsList: any[] = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents && typeof rawEvents === 'object'
    ? Object.values(rawEvents)
    : [];

  // Handle Google Calendar Save (Universal Engine)
  const handleSaveToCalendar = () => {
    openGoogleCalendar(data, undefined, () => {
      showToast('Membuka Google Calendar', 'info');
    });
  };

  const recipientName = data.guest_name || 'Bapak/Ibu/Saudara/i';
  const coupleOrderTitle = `${firstPerson.name} & ${secondPerson.name}`;
  const weddingDateStr =
    data.wedding_date_display || 'Sabtu, 12 Desember 2026';
  const venueCity =
    eventsList[2]?.venue_city ||
    eventsList[1]?.venue_city ||
    eventsList[0]?.venue_city ||
    'Makassar';

  return (
    <div
      className="theme-bugis bg-[#00120A] text-[#C8EAD8] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-[#F2CA50] selection:text-[#00170E] w-full no-scrollbar"
      style={{ backgroundColor: '#00120A', color: '#C8EAD8' }}
    >
      {/* Universal Sleek Toast Notification (Rule 5) */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        isInsideMockup={isPreview}
      />

      {/* Main Mobile Centered Frame Container (Max-Width 430px, Rule 9) */}
      <div
        className={`w-full max-w-[430px] flex flex-col relative bg-[#00170E] shadow-[0_0_80px_rgba(0,18,10,0.95)] overflow-x-clip no-scrollbar border-x border-[#F2CA50]/20 ${
          !isOpen
            ? isPreview
              ? 'h-full max-h-full overflow-hidden'
              : 'h-[100dvh] max-h-[100dvh] overflow-hidden'
            : 'min-h-screen h-auto overflow-visible'
        }`}
        style={{ backgroundColor: '#00170E' }}
      >
        {/* Pernak-pernik Latar Belakang Khas Bugis (Tenun Sa'be & Partikel Bunga Pacci Emas) */}
        <BugisTenunWatermark />
        <FloatingBugisParticles isPreview={isPreview} />

        {/* Outer Top Decorative Lines (Matching Prototype) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3 z-40 opacity-30 flex flex-col justify-around py-4">
          <div className="h-full w-[1px] bg-[#F2CA50] mx-auto" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-3 z-40 opacity-30 flex flex-col justify-around py-4">
          <div className="h-full w-[1px] bg-[#F2CA50] mx-auto" />
        </div>

        <main className="flex-1 flex flex-col w-full bg-transparent relative z-10 min-h-full">
          <div
            className={`flex flex-col w-full text-[#C8EAD8] relative ${
              !isOpen
                ? isPreview
                  ? 'h-full max-h-full overflow-hidden'
                  : 'h-[100dvh] max-h-[100dvh] overflow-hidden'
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
              className={`flex flex-col w-full transition-all duration-700 ease-out ${
                !isOpen && !isOpening
                  ? 'pointer-events-none select-none opacity-90'
                  : 'pointer-events-auto opacity-100'
              }`}
              style={{
                transform: !isOpen && !isOpening ? 'scale(0.985)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out',
              }}
            >
              {/* HERO SCRIPTURE & LIVE COUNTDOWN & CALENDAR */}
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

              {/* QUOTE SECTION (Single Doa Card: Aksara Lontara & QS. Ar-Rum: 21, Rule 13) */}
              {isSectionActive('quote') && <QuoteSection data={data} />}

              {/* COUPLE PROFILES (BOTTING BURANE & BOTTING MAKKUNRAI) */}
              {isSectionActive('couple') && (
                <CoupleSection
                  data={data}
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                  coupleOrderTitle={coupleOrderTitle}
                />
              )}

              {/* EVENT TIMELINE & VENUE DETAILS (MAPPACCI, AKAD, TUDANG BOTTUNG) */}
              {isSectionActive('event') && (
                <EventSection data={data} isPreview={isPreview} />
              )}

              {/* DRESS CODE PALETTE SECTION */}
              {isSectionActive('dresscode') && (
                <DresscodeSection data={data} isPreview={isPreview} />
              )}

              {/* KISAH CINTA (LOVE STORY) */}
              {isSectionActive('story') &&
                data.love_story &&
                data.love_story.length > 0 && (
                  <StorySection data={data} isPreview={isPreview} />
                )}

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

              {/* DIGITAL GIFT / TANDA KASIH (Card Rekening & Alamat Kado) */}
              {isSectionActive('gift') && (
                <GiftSection
                  data={data}
                  handleCopyAccount={handleCopyAccount}
                  handleCopyAddress={handleCopyAddress}
                  copiedAccountIndex={copiedAccountIndex}
                />
              )}

              {/* RSVP KONFIRMASI KEHADIRAN (Clean without foreign barcodes) */}
              {isSectionActive('rsvp') && (
                <RsvpSection
                  data={data}
                  rsvpForm={rsvpForm}
                  setRsvpForm={setRsvpForm}
                  handleRsvpSubmit={handleRsvpSubmit}
                />
              )}

              {/* GUEST WISHES / UCAPAN DOA RESTU */}
              {isSectionActive('wishes') && <WishesSection wishes={wishes} />}

              {/* CLOSING FOOTER (KURRU SUMANGA' TARIMA KASI' & MBell.ID FOOTER) */}
              <ClosingFooterSection
                data={data}
                firstPerson={firstPerson}
                secondPerson={secondPerson}
                renderBrandFooter={renderBrandFooter}
              />
            </div>
          </div>
        </main>

        {/* 3. UNIVERSAL GALLERY LIGHTBOX (Rule 3) */}
        <GalleryLightbox
          isOpen={Boolean(selectedImage)}
          imageUrl={selectedImage}
          photos={data.gallery || []}
          onClose={() => setSelectedImage(null)}
          isPreview={isPreview}
        />

        {/* 4. CIRCULAR FLOATING AUDIO BUBBLE (Rule 4) */}
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
                aria-label="Putar Musik Tradisional Bugis"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-[#F2CA50] text-[#00170E] border border-white/20 shadow-xl transition-transform active:scale-95 cursor-pointer"
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

export default TemplateBugis;

