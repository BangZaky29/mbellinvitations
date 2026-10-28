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

export const TemplateBetawi: React.FC<InvitationProps> = ({
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

  // Handle Google Calendar Save
  const handleSaveToCalendar = () => {
    const activeIdx =
      data.countdown_target === 'resepsi' && eventsList.length > 1 ? 1 : 0;
    const targetEvent = eventsList[activeIdx] || eventsList[0] || {};

    const eventTitle =
      targetEvent.title || targetEvent.name || 'Hajatan Besar Adat Betawi';
    const title = encodeURIComponent(
      `${eventTitle} — ${firstPerson.name} & ${secondPerson.name}`
    );
    const details = encodeURIComponent(
      `Pernikahan & Hajatan Palang Pintu Adat Betawi ${data.groom?.full_name || data.groom?.name} & ${data.bride?.full_name || data.bride?.name}.`
    );
    const location = encodeURIComponent(
      targetEvent.venue_name ||
        targetEvent.location_name ||
        targetEvent.venue_address ||
        'The Grand Batavia Heritage Ballroom'
    );
    const dateFormatted = data.wedding_date_iso
      ? data.wedding_date_iso.replace(/[-:]/g, '').split('+')[0]
      : '20261219T080000';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}/${dateFormatted}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Membuka Google Calendar', 'info');
  };

  const recipientName = data.guest_name || 'Bapak/Ibu/Saudara/i';
  const coupleOrderTitle = `${firstPerson.name} & ${secondPerson.name}`;
  const weddingDateStr =
    data.wedding_date_display || 'Sabtu, 19 Desember 2026';
  const venueCity =
    eventsList[1]?.venue_city ||
    eventsList[0]?.venue_city ||
    'Jakarta Barat';

  return (
    <div
      className="theme-betawi bg-[#300202] text-[#FCF9F3] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-[#FED65B] selection:text-[#410403] w-full no-scrollbar"
      style={{ backgroundColor: '#300202', color: '#FCF9F3' }}
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
        className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#410403] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-x-clip no-scrollbar border-x border-[#FED65B]/20"
        style={{ backgroundColor: '#410403' }}
      >
        <main className="flex-1 flex flex-col w-full bg-[#410403] relative">
          <div
            className={`flex flex-col w-full text-[#FCF9F3] relative ${
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
                !isOpen
                  ? 'pointer-events-none select-none max-h-screen overflow-hidden'
                  : ''
              }`}
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

              {/* QUOTE & PANTUN BETAWI SECTION (Single Doa Card) */}
              {isSectionActive('quote') && <QuoteSection data={data} />}

              {/* COUPLE PROFILES (ABANG & NONE JAKARTA) */}
              {isSectionActive('couple') && (
                <CoupleSection
                  data={data}
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                  coupleOrderTitle={coupleOrderTitle}
                />
              )}

              {/* EVENT TIMELINE & VENUE DETAILS (PALANG PINTU, AKAD, RESEPSI) */}
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
              {isSectionActive('wishes') && <WishesSection wishes={wishes} />}

              {/* CLOSING FOOTER (TERIMA KASIH BANYAK & MBell.ID FOOTER) */}
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
                aria-label="Putar Musik Gambang Kromong"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-[#FED65B] text-[#410403] border border-white/20 shadow-xl transition-transform active:scale-95 cursor-pointer"
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

export default TemplateBetawi;
