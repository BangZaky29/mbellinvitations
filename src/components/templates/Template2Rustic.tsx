import React from 'react';
import type { InvitationProps } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';
import { VenueMapEmbed } from '../common/VenueMapEmbed';
import { GalleryLightbox } from '../common/GalleryLightbox';
import { MOCK_RUSTIC_DATA } from '../../data/mock/rusticData';

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

  const { days, hours, minutes, seconds } = countdown;

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
        <main className={`flex flex-col relative w-full ${isOpen ? 'pt-4 pb-28 px-margin' : 'p-0'} bg-surface min-h-screen flex-1`}>
          <div className="flex flex-col w-full text-on-surface h-full flex-1">

            {/* ========================================== */}
            {/* SECTION 1: COVER GATE OVERLAY              */}
            {/* ========================================== */}
            {!isOpen && (
              <section
                id="sampul"
                className={`relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center text-center p-5 sm:p-7 z-30 overflow-hidden transition-all duration-700 ${
                  isOpening ? 'animate-cover-exit pointer-events-none' : ''
                }`}
              >
                {/* Ambient Rustic Backdrop using Cover Photo if present */}
                {(data.cover_image || data.couple_photo) && (
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img
                      src={data.cover_image || data.couple_photo}
                      alt="Cover Background"
                      className="w-full h-full object-cover opacity-25 filter blur-[0.8px] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#2c4034]/75 via-[#fbf9f5]/80 to-[#fbf9f5]"></div>
                  </div>
                )}

                {/* Atmospheric Botanical Vignette Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center z-1">
                  <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 400 400">
                    <path
                      d="M200 40 C140 70 80 140 80 220 C80 290 130 350 200 370 C270 350 320 290 320 220 C320 140 260 70 200 40 Z"
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      strokeWidth="1.2"
                    ></path>
                    <circle cx="200" cy="200" opacity="0.6" r="160" stroke="currentColor" strokeWidth="0.8"></circle>
                  </svg>
                </div>

                {/* Top Notch-Safe Header */}
                <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
                  <span className="font-label-md text-xs sm:text-sm text-secondary tracking-widest uppercase font-semibold mb-1">
                    The Wedding Invitation Of
                  </span>
                  <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary italic">
                    {firstPerson.name} <span className="font-normal not-italic text-secondary">&amp;</span> {secondPerson.name}
                  </h2>
                </div>

                {/* Middle Tier: Wreath & Circle Couple Portrait */}
                <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-2 w-full max-w-[280px]">
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                    <svg
                      className="absolute inset-0 w-full h-full text-[#855233]/70 animate-spin"
                      fill="none"
                      style={{ animationDuration: '40s' }}
                      viewBox="0 0 200 200"
                    >
                      <path
                        d="M100 12 C120 12 150 25 170 50 C185 70 190 95 186 120 C180 150 160 175 135 185 C110 195 80 190 55 175 C30 158 15 130 14 100 C13 70 30 40 55 25 C75 13 90 12 100 12 Z"
                        stroke="currentColor"
                        strokeDasharray="6 6"
                        strokeWidth="1.5"
                      ></path>
                      <circle cx="100" cy="14" fill="currentColor" r="3.5"></circle>
                      <circle cx="186" cy="100" fill="currentColor" r="3.5"></circle>
                      <circle cx="100" cy="186" fill="currentColor" r="3.5"></circle>
                      <circle cx="14" cy="100" fill="currentColor" r="3.5"></circle>
                    </svg>
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1 shadow-xl bg-white border-2 border-[#855233]/30">
                      <img
                        src={data.couple_photo || data.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
                        alt={`${firstPerson.name} & ${secondPerson.name}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Tier: Frosted Guest Card & High-Contrast Pine Green CTA Button */}
                <div className="w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
                  <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-lg border border-[#2C4034]/15 flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs text-[#5C6F61] uppercase tracking-wider font-semibold mb-1">
                      Kepada Yth. Bapak/Ibu/Saudara/i:
                    </span>
                    <div className="font-serif text-xl sm:text-2xl text-[#1B2A20] font-bold line-clamp-1 my-0.5">
                      {data.guest_name || 'Tamu Undangan Kinasih'}
                    </div>
                    {(Boolean(data.guest_code) || isPreview) && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DE] text-[#855233] text-xs font-mono font-semibold border border-[#855233]/25 shadow-xs">
                        <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                        <span>CHECK-IN PASS: {data.guest_code || 'RST-2025'}</span>
                      </div>
                    )}
                    <p className="text-[10px] sm:text-[11px] text-[#78887D] text-center mt-2 italic">
                      Mohon maaf bila ada kesalahan penulisan nama/gelar
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenInvitation}
                    className="w-full h-[50px] sm:h-[54px] rounded-full bg-[#2C4034] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#2C4034]/25 hover:bg-[#1E2D24] active:scale-95 transition-all cursor-pointer ring-2 ring-[#2C4034]/20 group"
                  >
                    <span className="material-symbols-outlined text-[20px] text-amber-200 group-hover:scale-110 transition-transform">
                      mail
                    </span>
                    <span>Buka Undangan</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>
                </div>
              </section>
            )}

            {/* ========================================== */}
            {/* INNER CONTENT (Tampil jika sudah Buka atau Mode Preview) */}
            {/* ========================================== */}
            {isOpen && (
              <div className="flex flex-col w-full animate-page-enter">
                {/* ========================================== */}
                {/* SECTION 2: HERO & LIVE COUNTDOWN           */}
                {/* ========================================== */}
                {isSectionActive('hero') && (
                  <section id="hero-section" className="flex flex-col items-center pt-space-xl pb-space-lg text-center">
                {/* Wedding Date Badge */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#855233] text-white font-label-md text-xs uppercase tracking-wider mb-space-md shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>{data.wedding_date_display || (data.wedding_date_iso ? new Date(data.wedding_date_iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sabtu, 24 Oktober 2026')}</span>
                </div>

                {/* Arch Framed Couple Photo */}
                <div className="relative w-full max-w-xs h-96 rounded-t-full rounded-b-2xl overflow-hidden shadow-xl mb-space-md bg-[#eae8e4] border-4 border-white reveal-scale">
                  <img
                    src={data.couple_photo || data.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
                    alt={`${firstPerson.name} & ${secondPerson.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C4034]/70 via-transparent to-transparent flex items-end justify-center p-space-md">
                    <span className="font-serif text-lg text-white italic drop-shadow-sm">
                      {data.hashtag || '#RusticWeddingForever'}
                    </span>
                  </div>
                </div>

                {/* Romantic Quote Card */}
                <div className="bg-white/95 border border-[#2C4034]/15 rounded-2xl p-5 shadow-sm max-w-sm mb-space-lg reveal delay-100">
                  <p className="font-serif text-base sm:text-lg text-[#1B2A20] italic font-normal mb-2 leading-relaxed">
                    &ldquo;{data.quote}&rdquo;
                  </p>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#855233]">
                    — {data.quote_source}
                  </span>
                </div>

                {/* Countdown Timer 4 Cards */}
                <div className="w-full grid grid-cols-4 gap-2 sm:gap-2.5 mb-space-lg px-2 reveal delay-200" id="countdownGrid">
                  <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
                      {days}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
                      Hari
                    </span>
                  </div>
                  <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
                      {String(hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
                      Jam
                    </span>
                  </div>
                  <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
                      {String(minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
                      Menit
                    </span>
                  </div>
                  <div className="bg-[#2C4034] text-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-[#2C4034]/20">
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F4E3CA]">
                      {String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200 mt-1">
                      Detik
                    </span>
                  </div>
                </div>

                {/* Livestream or Calendar Action */}
                {data.livestream_url ? (
                  <a
                    href={data.livestream_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-6 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center gap-2 hover:bg-on-secondary-container transition-colors active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    <span>Saksikan Live Streaming</span>
                  </a>
                ) : (
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-6 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg flex items-center gap-2 hover:bg-secondary-fixed transition-colors active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      event_available
                    </span>
                    <span>Simpan ke Google Calendar</span>
                  </a>
                )}
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 3: COUPLE PROFILE (MEMPELAI)       */}
            {/* ========================================== */}
            {isSectionActive('couple') && (
              <section id="mempelai-section" className="flex flex-col items-center py-space-xl">
                {/* Section Header & Divider */}
                <div className="flex flex-col items-center text-center mb-space-lg">
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined text-[20px]">spa</span>
                    <span className="font-label-md text-label-md uppercase tracking-widest font-semibold">
                      The Happy Couple
                    </span>
                    <span className="material-symbols-outlined text-[20px]">spa</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-primary">
                    Pengantin Pria &amp; Wanita
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-1">
                    Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Anda untuk merayakan cinta kami.
                  </p>
                </div>

                {/* Person 1 Card */}
                <div className="w-full rounded-2xl bg-white p-6 shadow-md border border-[#2C4034]/15 flex flex-col items-center text-center relative overflow-hidden mb-space-md reveal-left delay-100">
                  <div className="w-32 h-32 rounded-full overflow-hidden p-1 shadow-md bg-white border-2 border-[#855233]/30 mb-4">
                    <img
                      src={firstPerson.photo_url || firstPerson.photo || data.couple_photo || data.cover_image}
                      alt={firstPerson.full_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-serif text-2xl text-[#2C4034] font-bold">
                    {firstPerson.full_name}
                  </h4>
                  <p className="text-xs text-[#4D5E53] mt-2 mb-4 max-w-xs leading-relaxed">
                    {firstPerson.child_order} <br />
                    <span className="font-semibold text-[#2C4034]">{firstPerson.parent_father}</span> &amp;{' '}
                    <span className="font-semibold text-[#2C4034]">{firstPerson.parent_mother}</span>
                  </p>
                  {firstPerson.instagram && (
                    <a
                      href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2EDE4] text-[#2C4034] text-xs font-semibold hover:bg-[#2C4034] hover:text-white transition-all shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      <span>{firstPerson.instagram}</span>
                    </a>
                  )}
                </div>

                {/* Connecting Floral Knot */}
                <div className="my-1 text-[#855233] flex items-center justify-center gap-2 reveal-scale delay-200">
                  <div className="w-12 h-px bg-[#855233]/30"></div>
                  <span className="material-symbols-outlined text-[26px]">all_inclusive</span>
                  <div className="w-12 h-px bg-[#855233]/30"></div>
                </div>

                {/* Person 2 Card */}
                <div className="w-full rounded-2xl bg-white p-6 shadow-md border border-[#2C4034]/15 flex flex-col items-center text-center relative overflow-hidden mt-space-md reveal-right delay-300">
                  <div className="w-32 h-32 rounded-full overflow-hidden p-1 shadow-md bg-white border-2 border-[#855233]/30 mb-4">
                    <img
                      src={secondPerson.photo_url || secondPerson.photo || data.couple_photo || data.cover_image}
                      alt={secondPerson.full_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-serif text-2xl text-[#2C4034] font-bold">
                    {secondPerson.full_name}
                  </h4>
                  <p className="text-xs text-[#4D5E53] mt-2 mb-4 max-w-xs leading-relaxed">
                    {secondPerson.child_order} <br />
                    <span className="font-semibold text-[#2C4034]">{secondPerson.parent_father}</span> &amp;{' '}
                    <span className="font-semibold text-[#2C4034]">{secondPerson.parent_mother}</span>
                  </p>
                  {secondPerson.instagram && (
                    <a
                      href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2EDE4] text-[#2C4034] text-xs font-semibold hover:bg-[#2C4034] hover:text-white transition-all shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      <span>{secondPerson.instagram}</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 4: LOVE STORY TIMELINE             */}
            {/* ========================================== */}
            {theme.show_love_story !== false && isSectionActive('story') && data.love_story?.length > 0 && (
              <section className="flex flex-col py-space-xl">
                <div className="text-center mb-space-xl">
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                    Our Journey
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-primary mt-1">
                    Kisah Kasih Kami
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Perjalanan cinta kami hingga melangkah menuju pelaminan suci
                  </p>
                </div>

                <div className="relative pl-6 flex flex-col gap-space-lg">
                  {/* Vertical Branch Line */}
                  <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-secondary-fixed-dim rounded-full"></div>

                  {data.love_story.map((story, index) => {
                    const iconName =
                      story.icon === 'school'
                        ? 'school'
                        : story.icon === 'favorite'
                        ? 'favorite'
                        : story.icon === 'loyalty'
                        ? 'loyalty'
                        : index === 0
                        ? 'school'
                        : index === 1
                        ? 'favorite'
                        : 'loyalty';

                    const pinBg =
                      index === 0
                        ? 'bg-primary text-on-primary'
                        : index === 1
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-primary-container text-on-primary';

                    return (
                      <div key={index} className="relative flex flex-col bg-surface-bright p-space-md rounded-lg shadow-sm">
                        <div
                          className={`absolute -left-[27px] top-4 w-6 h-6 rounded-full ${pinBg} flex items-center justify-center text-xs shadow-sm`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {iconName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-headline-sm text-headline-sm text-primary">
                            {story.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                            {story.year}
                          </span>
                        </div>
                        <h5 className="font-body-sm font-semibold text-secondary mb-1">
                          {story.subtitle}
                        </h5>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          {story.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 5: EVENT DETAILS & VENUE           */}
            {/* ========================================== */}
            {isSectionActive('event') && data.events?.length > 0 && (
              <section id="acara-section" className="flex flex-col py-space-xl">
                <div className="text-center mb-space-xl reveal">
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                    Save The Date
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-primary mt-1">
                    Rangkaian Acara
                  </h3>
                </div>

                {data.events.map((event: any, idx: number) => {
                  const icon =
                    event.icon === 'ring' || event.icon === 'church'
                      ? 'church'
                      : event.icon === 'champagne-glasses' || event.icon === 'celebration'
                      ? 'celebration'
                      : idx === 0
                      ? 'church'
                      : 'celebration';

                  const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
                  const isCountdownEvent = idx === activeTargetIdx;

                  return (
                    <div
                      key={idx}
                      className="bg-surface-bright rounded-xl p-space-lg shadow-sm mb-space-lg relative overflow-hidden reveal-scale delay-150"
                    >
                      {/* Event Header: Category & Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 text-secondary">
                          <span className="material-symbols-outlined text-[18px] shrink-0">
                            {icon}
                          </span>
                          <span className="text-[11px] font-bold tracking-widest uppercase text-secondary">
                            {idx === 0 ? 'Akad' : 'Resepsi'}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-normal ${
                            idx === 0
                              ? 'bg-surface-container text-primary'
                              : 'bg-secondary-fixed text-on-secondary-fixed'
                          }`}
                        >
                          {event.badge || (idx === 0 ? 'Khusus Keluarga Inti' : 'Sesi 1 & 2')}
                        </span>
                      </div>

                      {/* Event Name: Full Width & Elegantly Proportioned */}
                      <h4 className="font-headline-md text-headline-md text-primary font-bold mb-4 break-words">
                        {event.name}
                      </h4>

                      <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant mb-4">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0">
                            calendar_month
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-primary break-words [overflow-wrap:anywhere]">{event.date}</div>
                            <div className="text-body-sm font-body-sm break-words [overflow-wrap:anywhere]">Pukul {event.time}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0">
                            location_on
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-primary break-words [overflow-wrap:anywhere]">{event.venue_name}</div>
                            <div className="text-body-sm font-body-sm break-words [overflow-wrap:anywhere]">{event.venue_address}</div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
                      {isCountdownEvent && (
                        <div className="w-full mb-3">
                          <VenueMapEmbed
                            venueName={event.venue_name || 'Lokasi Pernikahan'}
                            venueAddress={event.venue_address}
                            mapsUrl={event.maps_url}
                            heightClass="h-44"
                            isPreview={isPreview}
                          />
                        </div>
                      )}

                      {/* Google Maps Button (Selalu tampil di setiap card acara) */}
                      <a
                        href={event.maps_url || 'https://maps.google.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-primary-container active:scale-98 transition-all shadow-sm text-center"
                      >
                        <span className="material-symbols-outlined text-[18px] shrink-0">near_me</span>
                        <span>Buka Google Maps</span>
                      </a>
                    </div>
                  );
                })}
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 6: PHOTO GALLERY                   */}
            {/* ========================================== */}
            {theme.show_gallery !== false && isSectionActive('gallery') && data.gallery?.length > 0 && (
              <section id="galeri-section" className="flex flex-col py-space-xl">
                <div className="text-center mb-space-lg">
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                    Pre-Wedding Memories
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-primary mt-1">
                    Momen Bahagia
                  </h3>
                </div>

                {/* Featured Hero Landscape */}
                {data.gallery[0] && (
                  <div
                    onClick={() => setSelectedImage(data.gallery[0])}
                    className="relative w-full h-56 rounded-lg overflow-hidden shadow-sm mb-3 group bg-surface-container cursor-pointer"
                  >
                    <img
                      src={data.gallery[0]}
                      alt="Featured Pre-wedding"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-primary/70 backdrop-blur-md px-3 py-1 rounded-full text-on-primary font-label-md text-label-md">
                      Rustic Moments
                    </div>
                  </div>
                )}

                {/* 2-Column Aesthetic Masonry Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Left Column (Tall Portrait) */}
                  {data.gallery[1] && (
                    <div
                      onClick={() => setSelectedImage(data.gallery[1])}
                      className="h-64 rounded-lg overflow-hidden shadow-sm bg-surface-container cursor-pointer group"
                    >
                      <img
                        src={data.gallery[1]}
                        alt="Gallery 2"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Right Column (Stacked 2 Portraits) */}
                  <div className="flex flex-col gap-3">
                    {data.gallery[2] && (
                      <div
                        onClick={() => setSelectedImage(data.gallery[2])}
                        className="h-[122px] rounded-lg overflow-hidden shadow-sm bg-surface-container cursor-pointer group"
                      >
                        <img
                          src={data.gallery[2]}
                          alt="Gallery 3"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    {data.gallery[3] && (
                      <div
                        onClick={() => setSelectedImage(data.gallery[3])}
                        className="h-[122px] rounded-lg overflow-hidden shadow-sm bg-surface-container cursor-pointer group"
                      >
                        <img
                          src={data.gallery[3]}
                          alt="Gallery 4"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sisa Foto Galeri (Muncul saat tombol Lihat Selengkapnya diklik) */}
                {showAllGallery && data.gallery.length > 4 && (
                  <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in duration-300">
                    {data.gallery.slice(4).map((imgUrl, idx) => (
                      <div
                        key={idx + 4}
                        onClick={() => setSelectedImage(imgUrl)}
                        className="h-44 rounded-lg overflow-hidden shadow-sm bg-surface-container cursor-pointer group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx + 5}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tombol Lihat Selengkapnya jika foto > 4 */}
                {data.gallery.length > 4 && (
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAllGallery((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-secondary hover:text-on-secondary transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>
                        {showAllGallery
                          ? 'Tampilkan Lebih Sedikit'
                          : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
                      </span>
                      <span className="material-symbols-outlined text-[18px]">
                        {showAllGallery ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Quote Card */}
                <div className="mt-4 bg-surface-container-low rounded-lg p-space-md text-center shadow-sm">
                  <p className="font-script-accent text-script-accent text-primary italic">
                    &ldquo;Two souls with but a single thought, two hearts that beat as one.&rdquo;
                  </p>
                </div>
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 7: RSVP & DIGITAL ENVELOPE         */}
            {/* ========================================== */}
            <section className="flex flex-col py-space-xl">
              {/* Part A: RSVP Card */}
              {theme.show_rsvp !== false && isSectionActive('rsvp') && (
                <div className="bg-surface-bright rounded-xl p-space-lg shadow-sm mb-space-xl">
                  <div className="text-center mb-space-md">
                    <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                      Attendance
                    </span>
                    <h3 className="font-headline-md text-headline-md text-primary mt-1">
                      Konfirmasi Kehadiran
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Mohon konfirmasi kesediaan hadir Anda
                    </p>
                  </div>

                  <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-space-md" id="rsvpForm">
                    <div>
                      <label className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                        className="w-full h-12 px-4 rounded-lg bg-surface-container text-primary font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest"
                      />
                    </div>

                    <div>
                      <label className="font-label-md text-label-md text-primary uppercase tracking-wider mb-2 block">
                        Konfirmasi Kehadiran
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Hadir', 'Tidak Hadir', 'Ragu'].map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center justify-center py-2.5 px-1 rounded-lg font-label-md text-label-md cursor-pointer transition-all ${
                              rsvpForm.status === opt
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            <input
                              type="radio"
                              name="attendance"
                              value={opt}
                              checked={rsvpForm.status === opt}
                              onChange={() => setRsvpForm({ ...rsvpForm, status: opt })}
                              className="hidden"
                            />
                            <span>{opt === 'Ragu' ? 'Masih Ragu' : opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">
                        Jumlah Tamu
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={rsvpForm.pax || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setRsvpForm({ ...rsvpForm, pax: isNaN(val) ? 1 : Math.max(1, val) });
                        }}
                        placeholder="Ketik jumlah tamu (contoh: 2)"
                        required
                        className="w-full h-12 px-4 rounded-lg bg-surface-container text-primary font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary/30"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-[52px] rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 mt-2 shadow-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Kirim Konfirmasi</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Part B: Digital Envelope (Tanda Kasih) */}
              {(theme.show_gift !== false && (isSectionActive('gift') || isPreview)) && (
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#2C4034]/15">
                  <div className="text-center mb-5">
                    <span className="font-label-md text-xs text-[#855233] uppercase tracking-widest font-semibold">
                      Wedding Gift
                    </span>
                    <h3 className="font-serif text-2xl text-[#2C4034] font-bold mt-1">
                      Tanda Kasih
                    </h3>
                    <p className="text-xs text-[#5C6F61] max-w-xs mx-auto mt-1 leading-relaxed">
                      Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat melalui:
                    </p>
                  </div>

                  {/* Tabs Switch */}
                  <div className="flex rounded-full bg-[#F2EDE4] p-1 mb-5">
                    <button
                      type="button"
                      onClick={() => setActiveGiftTab('transfer')}
                      className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeGiftTab === 'transfer'
                          ? 'bg-[#2C4034] text-white shadow-xs'
                          : 'text-[#5C6F61] hover:text-[#2C4034]'
                      }`}
                    >
                      Transfer Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGiftTab('kado')}
                      className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeGiftTab === 'kado'
                          ? 'bg-[#2C4034] text-white shadow-xs'
                          : 'text-[#5C6F61] hover:text-[#2C4034]'
                      }`}
                    >
                      Kirim Kado
                    </button>
                  </div>

                  {/* Tab 1: Bank Transfer Content */}
                  {activeGiftTab === 'transfer' && (
                    <div className="flex flex-col gap-4">
                      {(() => {
                        const effectiveBanks = (data.banks && data.banks.length > 0)
                          ? data.banks
                          : (data.bank_accounts && data.bank_accounts.length > 0)
                          ? data.bank_accounts
                          : (isPreview ? (MOCK_RUSTIC_DATA.banks || []) : []);

                        if (!effectiveBanks || effectiveBanks.length === 0) return null;

                        return effectiveBanks.map((bank: any, index: number) => {
                          const isPrimary = index % 2 === 0;
                          return (
                            <div
                              key={bank.account_number || index}
                              className={`rounded-2xl p-5 shadow-lg relative overflow-hidden text-left ${
                                isPrimary
                                  ? 'bg-gradient-to-br from-[#2C4034] via-[#24352B] to-[#18241D] text-white border border-[#2C4034]/30'
                                  : 'bg-gradient-to-br from-[#855233] via-[#744528] to-[#553018] text-white border border-[#855233]/30'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-serif text-lg font-bold tracking-wider text-white">
                                  {bank.bank_name}
                                </span>
                                <span className={`material-symbols-outlined text-[24px] ${isPrimary ? 'text-amber-300' : 'text-amber-200'}`}>
                                  credit_card
                                </span>
                              </div>
                              <div className={`font-mono text-xl font-bold tracking-widest my-1 break-words [overflow-wrap:anywhere] ${
                                isPrimary ? 'text-[#F4E3CA]' : 'text-[#FBEEDC]'
                              }`}>
                                {bank.account_number}
                              </div>
                              <div className="text-xs uppercase tracking-wider text-white/80 mb-3 break-words [overflow-wrap:anywhere]">
                                a.n. {bank.account_holder}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    bank.account_number_raw || bank.account_number,
                                    `No. Rekening ${bank.bank_name} ${bank.account_holder} disalin`
                                  )
                                }
                                className={`w-full py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer bg-white ${
                                  isPrimary ? 'text-[#2C4034] hover:bg-stone-100' : 'text-[#855233] hover:bg-stone-100'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  content_copy
                                </span>
                                <span>Salin No. Rekening</span>
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}

                  {/* Tab 2: Physical Gift Content */}
                  {activeGiftTab === 'kado' && (
                    <div className="flex flex-col gap-3">
                      {(() => {
                        const effectiveAddress = data.gift_address || (isPreview ? (MOCK_RUSTIC_DATA.gift_address || '') : '');
                        return (
                          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#855233]/20 shadow-sm flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-[#EFE8DE] text-[#855233] flex items-center justify-center mb-2">
                              <span className="material-symbols-outlined text-[20px]">
                                home_pin
                              </span>
                            </div>
                            <div className="font-serif text-base font-bold text-[#2C4034] mb-1">
                              Alamat Pengiriman Kado
                            </div>
                            <p className="text-xs text-[#5C6F61] my-1 leading-relaxed break-words [overflow-wrap:anywhere] max-w-xs">
                              {effectiveAddress || 'Villa Pine Sanctuary Blok B7, Jl. Maribaya No. 120, Kayuambon, Kec. Lembang, Kabupaten Bandung Barat, Jawa Barat 40391'}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  effectiveAddress || 'Villa Pine Sanctuary Blok B7, Jl. Maribaya No. 120, Kayuambon, Lembang, Bandung Barat 40391',
                                  'Alamat pengiriman berhasil disalin'
                                )
                              }
                              className="px-5 py-2.5 mt-2 rounded-full bg-[#855233] hover:bg-[#6F4125] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                content_copy
                              </span>
                              <span>Salin Alamat Lengkap</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ========================================== */}
            {/* SECTION 8: LIVE WISHES WALL & GREETINGS    */}
            {/* ========================================== */}
            {theme.show_wishes !== false && isSectionActive('wishes') && (
              <section id="ucapan-section" className="flex flex-col py-space-xl">
                <div className="text-center mb-space-lg">
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                    Prayers &amp; Wishes
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-primary mt-1">
                    Doa &amp; Ucapan Selamat
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Untaian kata dan doa tulus untuk mengiringi langkah baru kami
                  </p>
                </div>

                {/* Wishes Input Form Card */}
                <div className="bg-surface-bright rounded-xl p-space-lg shadow-sm mb-space-lg">
                  <form onSubmit={handleWishSubmit} className="flex flex-col gap-space-md" id="wishesForm">
                    <div>
                      <label className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">
                        Nama Anda
                      </label>
                      <input
                        type="text"
                        value={wishForm.name}
                        onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                        placeholder="Contoh: Dimas &amp; Sarah"
                        required
                        className="w-full h-11 px-4 rounded-lg bg-surface-container text-primary font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest"
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">
                        Hubungan
                      </label>
                      <div className="relative">
                        <select
                          value={(wishForm as any).relation || 'Sahabat'}
                          onChange={(e) => setWishForm({ ...wishForm, relation: e.target.value } as any)}
                          className="w-full h-11 px-4 rounded-lg bg-surface-container text-primary font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container-lowest"
                        >
                          <option value="Sahabat">Sahabat</option>
                          <option value="Teman Kuliah">Teman Kuliah</option>
                          <option value="Rekan Kerja">Rekan Kerja</option>
                          <option value="Keluarga Besar">Keluarga Besar</option>
                        </select>
                        <span className="material-symbols-outlined text-[20px] text-outline absolute right-3 top-2.5 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">
                        Ucapan &amp; Doa
                      </label>
                      <textarea
                        rows={3}
                        value={wishForm.message}
                        onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                        placeholder="Tulis doa dan ucapan manis untuk kedua mempelai..."
                        required
                        className="w-full p-3 rounded-lg bg-surface-container text-primary font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="h-11 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-on-secondary-container transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                      <span>Kirim Ucapan</span>
                    </button>
                  </form>
                </div>

                {/* Live Wishes Feed */}
                <div className="flex flex-col gap-3" id="wishesFeed">
                  {wishes.map((wish, i) => {
                    const initials = wish.guest_name
                      ? wish.guest_name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'DS';

                    const avatarBg =
                      i % 3 === 0
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : i % 3 === 1
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed';

                    return (
                      <div key={wish.id} className="bg-surface-bright rounded-lg p-space-md shadow-sm">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full ${avatarBg} font-bold flex items-center justify-center text-xs shrink-0`}
                            >
                              {initials}
                            </div>
                            <span className="font-headline-sm text-headline-sm text-primary break-words [overflow-wrap:anywhere]">
                              {wish.guest_name}
                            </span>
                          </div>
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-medium">
                            {wish.attendance === 'attending' ? 'Hadir' : 'Berhalangan'}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed break-words [overflow-wrap:anywhere]">
                          &ldquo;{wish.message}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ========================================== */}
            {/* FOOTER ORNAMENT                            */}
            {/* ========================================== */}
            <footer className="pt-space-md pb-space-lg flex flex-col items-center text-center">
              <div className="w-16 h-px bg-secondary-fixed mb-space-sm"></div>
              <span className="material-symbols-outlined text-secondary text-[24px]">
                local_florist
              </span>
              <h5 className="font-headline-sm text-headline-sm text-primary mt-1">
                {firstPerson.name} &amp; {secondPerson.name}
              </h5>
              <p className="font-body-sm text-body-sm text-outline mt-0.5">
                Created with Love • {new Date(data.wedding_date_iso || Date.now()).getFullYear()}
              </p>
            </footer>
              </div>
            )}

          </div>
        </main>

        {/* ========================================== */}
        {/* FLOATING AUDIO CONTROLLER BUBBLE           */}
        {/* ========================================== */}
        <FloatingDock isPreview={isPreview}>
          {/* Floating Audio Play/Off Bubble (Pojok Kanan Bawah) */}
          {isOpen && (
            <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 pointer-events-auto`}>
              <button
                type="button"
                onClick={toggleMusic}
                aria-label="Toggle music playback"
                className="w-11 h-11 rounded-full bg-surface-container/90 backdrop-blur-md border border-primary/20 flex items-center justify-center text-primary shadow-lg transition-transform active:scale-95 cursor-pointer hover:bg-surface-container-high"
                title="Putar / Hentikan Musik"
              >
                <span
                  className={`material-symbols-outlined text-[20px] text-primary ${
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

        {/* Universal Gallery Lightbox (Terkunci sejajar layar di HP Preview maupun Web PC) */}
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
