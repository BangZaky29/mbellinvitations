import React, { useState } from 'react';
import type { InvitationProps } from '../../../types/invitation';
import { useTemplateState } from '../../../hooks/useTemplateState';
import { openGoogleCalendar } from '../../../utils/calendarHelper';
import { FloatingDock } from '../../common/FloatingDock';
import { SleekToast } from '../../common/SleekToast';
import { GalleryLightbox } from '../../common/GalleryLightbox';
import { DraggableCoverSheet } from '../../common/DraggableCoverSheet';
import {
  SongketBorder,
  GoldShimmerParticles,
  TornPaperDivider,
} from './components';
import {
  CoverSection,
  HeroSection,
  CoupleSection,
  EventSection,
  DresscodeSection,
  GallerySection,
  GiftSection,
  RsvpSection,
  WishesSection,
  ClosingFooterSection,
} from './sections';

export const TemplateMinangBaralek: React.FC<InvitationProps> = ({
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

  // Handle Google Calendar Save (Universal Engine)
  const handleSaveToCalendar = () => {
    openGoogleCalendar(data, undefined, () => {
      showToast('Membuka Google Calendar', 'info');
    });
  };

  const recipientName = data.guest_name || 'Bapak/Ibu/Saudara/i';
  const coupleOrderTitle = `${firstPerson.name} & ${secondPerson.name}`;
  const weddingDateStr = data.wedding_date_display || 'Sabtu, 24 Oktober 2026';
  const venueCity =
    data.events?.[1]?.venue_city ||
    data.events?.[0]?.venue_city ||
    'Padang, Sumbar';

  return (
    <div
      className="theme-minang bg-[#1B0609] text-[#FAF6EE] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-gold selection:text-burgundy-deep w-full no-scrollbar"
      style={{ backgroundColor: '#1B0609', color: '#FAF6EE' }}
    >
      {/* Universal Sleek Toast Notification */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        isInsideMockup={isPreview}
      />

      {/* Ambient Royal Gold Dust Particle Animation */}
      <GoldShimmerParticles />

      {/* Main Mobile Centered Frame Container (Max-Width 430px) */}
      <div
        className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#1B0609] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-x-clip no-scrollbar border-x border-[#D4AF37]/30"
        style={{ backgroundColor: '#1B0609' }}
      >
        {/* Songket Weaving Filigree Vertical Side Stripes */}
        <SongketBorder />

        <main
          className="flex-1 flex flex-col w-full bg-[#1B0609] relative"
          style={{ backgroundColor: '#1B0609' }}
        >
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
              {/* Torn Paper Edge Transition (Burgundy to Cream) */}
              <TornPaperDivider fillColor="#FAF6EE" />

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

              {/* COUPLE PROFILES (ANAK DARO & MARAPULAI) */}
              {isSectionActive('couple') && (
                <CoupleSection
                  data={data}
                  firstPerson={firstPerson}
                  secondPerson={secondPerson}
                  coupleOrderTitle={coupleOrderTitle}
                />
              )}

              {/* Torn Paper Edge Transition (Cream back to Burgundy) */}
              <TornPaperDivider invert fillColor="#FAF6EE" />

              {/* EVENT TIMELINE & VENUE DETAILS (AKAD & RESEPSI BARALEK) */}
              {isSectionActive('event') && (
                <EventSection
                  data={data}
                  isPreview={isPreview}
                />
              )}

              {/* Torn Paper Edge Transition (Burgundy to Cream) */}
              <TornPaperDivider fillColor="#FAF6EE" />

              {/* DRESS CODE PALETTE SECTION */}
              {isSectionActive('dresscode') && (
                <DresscodeSection
                  data={data}
                  isPreview={isPreview}
                />
              )}

              {/* PHOTO GALLERY (UNIVERSAL GALLERY SHOWCASE) */}
              {isSectionActive('gallery') && data.gallery && data.gallery.length > 0 && (
                <GallerySection
                  data={data}
                  theme={theme}
                  isPreview={isPreview}
                  setSelectedImage={setSelectedImage}
                  showAllGallery={showAllGallery}
                  setShowAllGallery={setShowAllGallery}
                />
              )}

              {/* Universal Gallery Lightbox Portal */}
              <GalleryLightbox
                isOpen={Boolean(selectedImage)}
                imageUrl={selectedImage}
                onClose={() => setSelectedImage(null)}
                isPreview={isPreview}
                photos={data.gallery || []}
                currentIndex={
                  selectedImage && data.gallery ? data.gallery.indexOf(selectedImage) : 0
                }
                onIndexChange={(newIdx) => {
                  if (data.gallery && data.gallery[newIdx]) {
                    setSelectedImage(data.gallery[newIdx]);
                  }
                }}
              />

              {/* Torn Paper Edge Transition (Cream back to Burgundy) */}
              <TornPaperDivider invert fillColor="#FAF6EE" />

              {/* DIGITAL ENVELOPE (AMPLOP DIGITAL & KADO) */}
              {(isPreview || (theme?.show_gift !== false && isSectionActive('gift'))) && (
                <GiftSection
                  data={data}
                  isPreview={isPreview}
                  handleCopyAccount={handleCopyAccount}
                  handleCopyAddress={handleCopyAddress}
                />
              )}

              {/* INTERACTIVE RSVP & VIP BARCODE PASS */}
              {isSectionActive('rsvp') && (
                <RsvpSection
                  data={data}
                  isPreview={isPreview}
                  rsvpForm={rsvpForm}
                  setRsvpForm={setRsvpForm}
                  activeRsvpTab={activeRsvpTab}
                  setActiveRsvpTab={setActiveRsvpTab}
                  handleRsvpSubmit={handleRsvpSubmit}
                />
              )}

              {/* Torn Paper Edge Transition (Burgundy to Cream) */}
              <TornPaperDivider fillColor="#FAF6EE" />

              {/* LIVE WISHES WALL (BUKU TAMU & DOA RESTU) */}
              {isSectionActive('wishes') && (
                <WishesSection
                  wishes={wishes}
                  wishForm={wishForm}
                  setWishForm={setWishForm}
                  handleWishSubmit={handleWishSubmit}
                />
              )}

              {/* Torn Paper Edge Transition (Cream back to Burgundy) */}
              <TornPaperDivider invert fillColor="#FAF6EE" />

              {/* CLOSING BLESSING & MINANG SIGNOFF */}
              <ClosingFooterSection
                data={data}
                coupleOrderTitle={coupleOrderTitle}
                renderBrandFooter={renderBrandFooter}
              />
            </div>
          </div>
        </main>

        {/* FLOATING AUDIO CONTROLLER BUBBLE (CIRCULAR w-11 h-11) */}
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
                aria-label="Putar Musik Instrumental Saluang & Minang Klasik"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full gold-gradient-btn border border-[#FFF0B8]/50 shadow-xl transition-transform active:scale-95 cursor-pointer ring-1 ring-black/20"
              >
                <div
                  className={`w-9 h-9 rounded-full bg-[#1B0609] flex items-center justify-center ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[#F5E296] text-lg">
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

export default TemplateMinangBaralek;
