import React from 'react';
import type { InvitationProps } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';
import { VenueMapEmbed } from '../common/VenueMapEmbed';
import { GalleryLightbox } from '../common/GalleryLightbox';

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

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-start bg-[#ECE8E1]">
      {/* Sleek Universal Toast Notification */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        isInsideMockup={isPreview}
      />

      {/* Mobile Viewport Container (Max 430px) */}
      <div className="relative w-full max-w-[430px] h-full min-h-screen bg-alabaster shadow-2xl overflow-x-hidden border-x border-[#E2DDD3] flex flex-col">

        {/* ========================================== */}
        {/* 1. COVER GATE OVERLAY (Full-screen)        */}
        {/* ========================================== */}
        {!isOpen && (
          <section
            id="cover-overlay"
            className={`relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center text-center p-5 sm:p-7 z-30 transition-all duration-700 ${
              isOpening ? 'animate-cover-exit pointer-events-none' : ''
            }`}
          >
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={data.couple_photo || data.cover_image}
                alt="Wedding Couple Cover"
                className="w-full h-full object-cover filter brightness-[0.78]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/85"></div>
            </div>

            {/* Header Monogram with notch-safe padding */}
            <div className="relative z-10 pt-10 sm:pt-12 flex flex-col items-center shrink-0">
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/80 font-light mb-1.5">
                The Wedding Celebration
              </span>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/35 flex items-center justify-center backdrop-blur-md bg-white/10 my-1 shadow-md ring-1 ring-white/15">
                <div className="inline-flex items-center justify-center gap-1.5 leading-none select-none">
                  <span className="font-editorial text-xl sm:text-2xl text-white font-normal uppercase leading-none">
                    {data.groom?.name ? data.groom.name.charAt(0) : 'D'}
                  </span>
                  <span className="font-serif text-xs sm:text-sm text-gold-champagne/90 italic leading-none">
                    &amp;
                  </span>
                  <span className="font-editorial text-xl sm:text-2xl text-white font-normal uppercase leading-none">
                    {data.bride?.name ? data.bride.name.charAt(0) : 'S'}
                  </span>
                </div>
              </div>
            </div>

            {/* Center Typography */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
              <h2 className="font-editorial text-3xl sm:text-4xl text-white font-light tracking-wide leading-tight">
                {firstPerson.name} <br />
                <span className="font-serif italic text-2xl sm:text-3xl font-light text-gold-champagne">&amp;</span> <br />
                {secondPerson.name}
              </h2>
              <div className="mt-3 sm:mt-4 flex items-center space-x-3 text-white/90">
                <span className="h-[1px] w-6 bg-gold-champagne/70"></span>
                <p className="text-xs tracking-[0.25em] uppercase font-light text-alabaster">
                  {data.wedding_date_display}
                </p>
                <span className="h-[1px] w-6 bg-gold-champagne/70"></span>
              </div>
            </div>

            {/* Guest Box & Open Button Anchored Bottom */}
            <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
              <div className="w-full backdrop-blur-md bg-white/10 border border-white/25 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg">
                <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/75 font-light mb-0.5">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="font-editorial text-xl sm:text-2xl font-medium tracking-wide text-white capitalize">
                  {data.guest_name || 'Tamu Undangan'}
                </h3>
                {(Boolean(data.guest_code) || isPreview) && (
                  <div className="mt-1.5 inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] tracking-wider uppercase text-gold-light font-mono">
                    <span className="material-symbols-outlined text-[13px]">qr_code</span>
                    <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
                  </div>
                )}
                <p className="text-[9px] text-white/60 tracking-wider mt-1 italic">
                  *Mohon maaf bila ada kesalahan penulisan nama/gelar
                </p>
              </div>

              {/* Sleek Pill Button */}
              <button
                type="button"
                onClick={handleOpenInvitation}
                className="w-full py-3.5 px-6 rounded-full bg-white text-charcoal-dark font-medium text-xs tracking-[0.2em] uppercase hover:bg-gold-light active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <i className="fa-regular fa-envelope-open text-gold-champagne text-sm group-hover:scale-110 transition-transform"></i>
                <span>Buka Undangan</span>
              </button>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* Main Invitation Content Wrapper            */}
        {/* ========================================== */}
        {isOpen && (
          <main
            id="main-content"
            className="relative z-20 pb-28 animate-page-enter"
          >
          {/* ========================================== */}
          {/* 2. HERO & COUNTDOWN SECTION                */}
          {/* ========================================== */}
          {isSectionActive('hero') && (
            <section id="hero" className="pt-16 pb-12 px-6 flex flex-col items-center text-center">
              <div className="inline-flex items-center space-x-2 mb-3">
                <span className="w-8 h-[1px] bg-gold-champagne"></span>
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold-champagne">
                  The Royal Nuptials
                </span>
                <span className="w-8 h-[1px] bg-gold-champagne"></span>
              </div>

              <h1 className="font-editorial text-4xl text-charcoal-dark font-normal tracking-wide">
                {firstPerson.name} &amp; {secondPerson.name}
              </h1>
              <p className="text-xs text-charcoal-muted tracking-[0.2em] uppercase mt-1 mb-8">
                {data.wedding_date_display}
              </p>

              {/* Tall Arch-shaped Couple Frame */}
              <div className="relative w-full max-w-[280px] p-2 bg-white rounded-arch shadow-md border border-border-subtle mb-8 reveal-scale">
                <div className="w-full h-[380px] arch-frame overflow-hidden relative">
                  <img
                    src={data.couple_photo}
                    alt={`${firstPerson.name} and ${secondPerson.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                {/* Corner Fine-line Accent */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border border-gold-champagne/40 bg-alabaster flex items-center justify-center">
                  <i className="fa-solid fa-heart text-[10px] text-gold-champagne"></i>
                </div>
              </div>

              {/* Religious / Romantic Quote */}
              <div className="max-w-[340px] px-2 mb-10 reveal delay-100">
                <p className="font-editorial italic text-base leading-relaxed text-charcoal-dark/90">
                  &ldquo;{data.quote}&rdquo;
                </p>
                <span className="block text-[11px] tracking-[0.2em] text-gold-champagne uppercase font-medium mt-3">
                  — {data.quote_source}
                </span>
              </div>

              {/* 4-Column Minimalist Countdown Timer */}
              <div className="w-full max-w-[350px] bg-white border border-border-subtle rounded-2xl p-5 shadow-sm reveal delay-200">
                <p className="text-[11px] tracking-[0.25em] text-charcoal-muted uppercase mb-4 font-medium">
                  Menuju Hari Bahagia
                </p>
                <div className="grid grid-cols-4 divide-x divide-border-subtle">
                  {/* Hari */}
                  <div className="flex flex-col items-center px-1">
                    <span className="font-editorial text-3xl font-semibold text-charcoal-dark tracking-tight">
                      {days}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
                      Hari
                    </span>
                  </div>
                  {/* Jam */}
                  <div className="flex flex-col items-center px-1">
                    <span className="font-editorial text-3xl font-semibold text-charcoal-dark tracking-tight">
                      {String(hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
                      Jam
                    </span>
                  </div>
                  {/* Menit */}
                  <div className="flex flex-col items-center px-1">
                    <span className="font-editorial text-3xl font-semibold text-charcoal-dark tracking-tight">
                      {String(minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
                      Menit
                    </span>
                  </div>
                  {/* Detik */}
                  <div className="flex flex-col items-center px-1">
                    <span className="font-editorial text-3xl font-semibold text-gold-champagne tracking-tight">
                      {String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-light">
                      Detik
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Livestream Banner */}
              {data.livestream_url && (
                <div className="mt-8 w-full max-w-[350px] bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                      <i className="fa-solid fa-video text-sm animate-pulse"></i>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/60">Live Streaming</p>
                      <h4 className="text-xs font-semibold text-white">Saksikan Siaran Langsung</h4>
                    </div>
                  </div>
                  <a
                    href={data.livestream_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white text-neutral-900 text-[10px] font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
                  >
                    Tonton
                  </a>
                </div>
              )}
            </section>
          )}

          {/* Section Divider */}
          <div className="flex justify-center items-center py-4">
            <span className="w-12 h-[1px] bg-border-subtle"></span>
            <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
            <span className="w-12 h-[1px] bg-border-subtle"></span>
          </div>

          {/* ========================================== */}
          {/* 3. COUPLE PROFILE SECTION                  */}
          {/* ========================================== */}
          {isSectionActive('couple') && (
            <section id="couple" className="py-12 px-6">
              <div className="text-center mb-10 reveal">
                <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                  Maha Suci Allah
                </span>
                <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                  Mempelai Pengantin
                </h2>
                <p className="text-xs text-charcoal-muted mt-2 max-w-[300px] mx-auto font-light leading-relaxed">
                  Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengikat janji suci pernikahan:
                </p>
              </div>

              <div className="space-y-8">
                {/* Person 1 Card */}
                <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col items-center text-center reveal-left delay-100">
                  <div className="w-48 h-64 rounded-xl overflow-hidden shadow-inner border border-border-subtle mb-5">
                    <img
                      src={
                        firstPerson.photo_url ||
                        (firstPerson as any).photo ||
                        data.couple_photo ||
                        data.cover_image ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={firstPerson.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium">
                    {firstPersonRole}
                  </span>
                  <h3 className="font-editorial text-2xl text-charcoal-dark font-medium mt-1">
                    {firstPerson.full_name}
                  </h3>

                  <p className="text-xs text-charcoal-muted font-light mt-3 leading-relaxed">
                    {firstPerson.child_order}<br />
                    <span className="font-medium text-charcoal-dark">{firstPerson.parent_father}</span> &amp;<br />
                    <span className="font-medium text-charcoal-dark">{firstPerson.parent_mother}</span>
                  </p>

                  {firstPerson.instagram && (
                    <a
                      href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-border-subtle hover:border-gold-champagne text-xs text-charcoal-dark hover:text-gold-champagne transition-colors"
                    >
                      <i className="fa-brands fa-instagram text-sm"></i>
                      <span className="font-medium text-[11px] tracking-wider">{firstPerson.instagram}</span>
                    </a>
                  )}
                </div>

                {/* Ampersand Graphic Divider */}
                <div className="text-center py-1 reveal-scale delay-200">
                  <span className="font-editorial italic text-3xl text-gold-champagne">&amp;</span>
                </div>

                {/* Person 2 Card */}
                <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col items-center text-center reveal-right delay-300">
                  <div className="w-48 h-64 rounded-xl overflow-hidden shadow-inner border border-border-subtle mb-5">
                    <img
                      src={
                        secondPerson.photo_url ||
                        (secondPerson as any).photo ||
                        data.couple_photo ||
                        data.cover_image ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={secondPerson.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] tracking-[0.25em] text-gold-champagne uppercase font-medium">
                    {secondPersonRole}
                  </span>
                  <h3 className="font-editorial text-2xl text-charcoal-dark font-medium mt-1">
                    {secondPerson.full_name}
                  </h3>

                  <p className="text-xs text-charcoal-muted font-light mt-3 leading-relaxed">
                    {secondPerson.child_order}<br />
                    <span className="font-medium text-charcoal-dark">{secondPerson.parent_father}</span> &amp;<br />
                    <span className="font-medium text-charcoal-dark">{secondPerson.parent_mother}</span>
                  </p>

                  {secondPerson.instagram && (
                    <a
                      href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-border-subtle hover:border-gold-champagne text-xs text-charcoal-dark hover:text-gold-champagne transition-colors"
                    >
                      <i className="fa-brands fa-instagram text-sm"></i>
                      <span className="font-medium text-[11px] tracking-wider">{secondPerson.instagram}</span>
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section Divider */}
          <div className="flex justify-center items-center py-4">
            <span className="w-12 h-[1px] bg-border-subtle"></span>
            <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
            <span className="w-12 h-[1px] bg-border-subtle"></span>
          </div>

          {/* ========================================== */}
          {/* 4. LOVE STORY TIMELINE SECTION             */}
          {/* ========================================== */}
          {theme.show_love_story !== false && isSectionActive('story') && data.love_story?.length > 0 && (
            <section id="story" className="py-12 px-6">
              <div className="text-center mb-10 reveal">
                <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                  Perjalanan Cinta
                </span>
                <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                  Kisah Cinta Kami
                </h2>
                <p className="text-xs text-charcoal-muted mt-1 font-light">
                  Setiap langkah membawa kami menuju takdir ini
                </p>
              </div>

              <div className="relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gold-champagne/40 space-y-8">
                {data.love_story.map((story, index) => {
                  const isLast = index === data.love_story.length - 1;
                  return (
                    <div key={index} className="relative group reveal delay-100">
                      {/* Timeline Pin */}
                      <div
                        className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          isLast
                            ? 'bg-gold-champagne text-white shadow-md'
                            : 'bg-alabaster border-2 border-gold-champagne'
                        }`}
                      >
                        {isLast ? (
                          <i className="fa-solid fa-check text-[10px]"></i>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gold-champagne"></div>
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className={`bg-white border rounded-xl p-5 shadow-sm ${
                          isLast ? 'border-gold-champagne/40' : 'border-border-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-gold-champagne tracking-widest uppercase">
                            {story.title}
                          </span>
                          <span
                            className={`text-[10px] tracking-wider px-2 py-0.5 rounded-full ${
                              isLast
                                ? 'bg-charcoal-dark text-white font-medium'
                                : 'bg-alabaster border border-border-subtle text-charcoal-muted'
                            }`}
                          >
                            {story.year}
                          </span>
                        </div>
                        <h4 className="font-editorial text-xl text-charcoal-dark font-medium">
                          {story.subtitle}
                        </h4>
                        <p className="text-xs text-charcoal-muted font-light leading-relaxed mt-2">
                          {story.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section Divider */}
          <div className="flex justify-center items-center py-4">
            <span className="w-12 h-[1px] bg-border-subtle"></span>
            <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
            <span className="w-12 h-[1px] bg-border-subtle"></span>
          </div>

          {/* ========================================== */}
          {/* 5. EVENT DETAILS & VENUE SECTION           */}
          {/* ========================================== */}
          {isSectionActive('event') && data.events?.length > 0 && (
            <section id="event" className="py-12 px-6">
              <div className="text-center mb-10 reveal">
                <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                  Agenda &amp; Lokasi
                </span>
                <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                  Rangkaian Acara
                </h2>
                <p className="text-xs text-charcoal-muted mt-1 font-light">
                  Merupakan kehormatan atas kehadiran dan doa restu Anda
                </p>
              </div>

              <div className="space-y-6">
                {data.events.map((event: any, idx: number) => {
                  const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
                  const isCountdownEvent = idx === activeTargetIdx;

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm relative overflow-hidden reveal-scale delay-150"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-light/40 rounded-bl-full pointer-events-none"></div>

                      <div className="flex items-center space-x-2 text-gold-champagne mb-2">
                        <i
                          className={`text-sm ${
                            event.icon === 'champagne-glasses'
                              ? 'fa-solid fa-champagne-glasses'
                              : 'fa-solid fa-ring'
                          }`}
                        ></i>
                        <span className="text-[11px] tracking-[0.25em] uppercase font-semibold">
                          {event.name}
                        </span>
                      </div>

                      <h3 className="font-editorial text-2xl text-charcoal-dark font-medium break-words [overflow-wrap:anywhere]">
                        {event.title}
                      </h3>

                      <div className="my-4 py-3 border-y border-border-subtle space-y-2 text-xs text-charcoal-muted">
                        <div className="flex items-center space-x-3">
                          <i className="fa-regular fa-calendar text-gold-champagne w-4 text-center shrink-0"></i>
                          <span className="font-medium text-charcoal-dark min-w-0 flex-1 break-words [overflow-wrap:anywhere]">{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <i className="fa-regular fa-clock text-gold-champagne w-4 text-center shrink-0"></i>
                          <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">{event.time}</span>
                        </div>
                        <div className="flex items-start space-x-3 pt-1">
                          <i className="fa-solid fa-location-dot text-gold-champagne w-4 text-center mt-0.5 shrink-0"></i>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-charcoal-dark block break-words [overflow-wrap:anywhere]">
                              {event.venue_name}
                            </span>
                            <span className="font-light leading-relaxed break-words [overflow-wrap:anywhere]">
                              {event.venue_address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
                      {isCountdownEvent && (
                        <div className="w-full mb-4">
                          <VenueMapEmbed
                            venueName={event.venue_name}
                            venueAddress={event.venue_address}
                            mapsUrl={event.maps_url}
                            heightClass="h-40"
                            isPreview={isPreview}
                          />
                        </div>
                      )}

                      {/* Google Maps Button (Selalu tampil di setiap card acara) */}
                      <a
                        href={event.maps_url || 'https://maps.google.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-full bg-charcoal-dark text-white text-xs tracking-[0.15em] uppercase font-medium flex items-center justify-center space-x-2 hover:bg-gold-champagne transition-colors shadow"
                      >
                        <i className="fa-solid fa-location-arrow text-xs"></i>
                        <span>Buka Google Maps</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section Divider */}
          <div className="flex justify-center items-center py-4">
            <span className="w-12 h-[1px] bg-border-subtle"></span>
            <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
            <span className="w-12 h-[1px] bg-border-subtle"></span>
          </div>

          {/* ========================================== */}
          {/* 6. PHOTO GALLERY SECTION                   */}
          {/* ========================================== */}
          {theme.show_gallery !== false && isSectionActive('gallery') && data.gallery?.length > 0 && (
            <section id="gallery" className="py-12 px-6">
              <div className="text-center mb-8 reveal">
                <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                  Dokumentasi
                </span>
                <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                  Galeri Kenangan
                </h2>
                <p className="text-xs text-charcoal-muted mt-1 font-light">
                  Potret momen kebersamaan yang terukir abadi
                </p>
              </div>

              {/* 2-Column Editorial Masonry Grid */}
              <div className="grid grid-cols-2 gap-3 reveal-scale delay-100">
                {/* Column 1 */}
                <div className="space-y-3">
                  {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
                    .filter((_, idx) => idx % 2 === 0)
                    .map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className="overflow-hidden rounded-lg border border-border-subtle bg-white shadow-sm cursor-pointer group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx * 2 + 1}`}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            idx % 2 === 0 ? 'h-64' : 'h-44'
                          }`}
                        />
                      </div>
                    ))}
                </div>

                {/* Column 2 */}
                <div className="space-y-3">
                  {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
                    .filter((_, idx) => idx % 2 === 1)
                    .map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className="overflow-hidden rounded-lg border border-border-subtle bg-white shadow-sm cursor-pointer group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx * 2 + 2}`}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            idx % 2 === 0 ? 'h-44' : 'h-64'
                          }`}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Tombol Lihat Selengkapnya jika foto > 4 */}
              {data.gallery.length > 4 && (
                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={() => setShowAllGallery((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle bg-white hover:bg-stone-50 text-xs font-semibold tracking-wider uppercase text-charcoal-dark shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>
                      {showAllGallery
                        ? 'Tampilkan Lebih Sedikit'
                        : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
                    </span>
                    <i
                      className={`fa-solid ${
                        showAllGallery ? 'fa-chevron-up' : 'fa-chevron-down'
                      } text-xs text-gold-champagne`}
                    ></i>
                  </button>
                </div>
              )}

              <div className="text-center mt-6">
                <span className="text-[11px] text-charcoal-muted tracking-widest uppercase italic font-editorial">
                  &ldquo;Captured in eternal grace &amp; simplicity&rdquo;
                </span>
              </div>
            </section>
          )}

          {/* Section Divider */}
          <div className="flex justify-center items-center py-4">
            <span className="w-12 h-[1px] bg-border-subtle"></span>
            <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
            <span className="w-12 h-[1px] bg-border-subtle"></span>
          </div>

          {/* ========================================== */}
          {/* 7. RSVP & DIGITAL ENVELOPE SECTION         */}
          {/* ========================================== */}
          <section id="rsvp" className="py-12 px-6">
            {/* RSVP Form */}
            {theme.show_rsvp !== false && isSectionActive('rsvp') && (
              <>
                <div className="text-center mb-8 reveal">
                  <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                    Konfirmasi Kehadiran
                  </span>
                  <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                    RSVP Online
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1 font-light">
                    Mohon kesediaannya mengisi konfirmasi kehadiran
                  </p>
                </div>

                <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm mb-12 reveal-scale delay-100">
                  {rsvpSubmitted ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                      <i className="fa-solid fa-circle-check text-2xl text-emerald-600 mb-2"></i>
                      <p className="text-xs font-semibold">Konfirmasi Berhasil Terkirim!</p>
                      <p className="text-[11px] text-emerald-700/80 mt-1">
                        Terima kasih banyak atas konfirmasi kehadiran Anda.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-dark mb-1 tracking-wide">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={rsvpForm.name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                          placeholder="Masukkan nama Anda"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-charcoal-dark mb-1 tracking-wide">
                          Status Kehadiran
                        </label>
                        <select
                          value={rsvpForm.status}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                        >
                          <option value="hadir">Ya, Saya Akan Hadir</option>
                          <option value="tidak_hadir">Maaf, Tidak Dapat Hadir</option>
                          <option value="ragu">Masih Belum Pasti</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-charcoal-dark mb-1 tracking-wide">
                          Jumlah Tamu (Pax)
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
                          className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-3.5 rounded-full bg-charcoal-dark text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-champagne active:scale-98 transition-all shadow cursor-pointer"
                      >
                        Kirim Konfirmasi RSVP
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}

            {/* Digital Envelope (Amplop Digital) */}
            {theme.show_gift !== false && isSectionActive('gift') && (
              <>
                <div className="text-center mb-8">
                  <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                    Tanda Kasih
                  </span>
                  <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                    Amplop Digital
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1 font-light max-w-[300px] mx-auto">
                    Doa restu Anda adalah karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat melalui:
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Bank Accounts */}
                  {((data.banks && data.banks.length > 0) ? data.banks : ((data as any).bank_accounts || []))?.map((bank: any, index: number) => {
                    const isEven = index % 2 === 0;
                    const isCopied = copiedAccountIndex === index;
                    return (
                      <div
                        key={index}
                        className={`relative w-full rounded-2xl p-5 text-white shadow-lg border overflow-hidden ${
                          isEven
                            ? 'bg-gradient-to-br from-[#1F1F1F] via-[#2A2A2A] to-[#141414] border-neutral-700'
                            : 'bg-gradient-to-br from-[#8C713B] via-[#A88746] to-[#6E5728] border-amber-400/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <span className="font-editorial italic text-base tracking-widest text-gold-champagne font-light">
                            {data.groom.name} &amp; {data.bride.name}
                          </span>
                          <span className="font-bold tracking-widest text-sm bg-white/10 px-2 py-0.5 rounded border border-white/20">
                            {bank.bank_name}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-[10px] uppercase text-white/50 tracking-[0.2em]">Nomor Rekening</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-mono text-lg tracking-wider text-white">
                              {bank.account_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyAccount(bank.account_number_raw || bank.account_number, index)}
                              className={`px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-medium transition-colors flex items-center space-x-1 cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : isEven
                                  ? 'bg-white/15 hover:bg-gold-champagne text-white'
                                  : 'bg-black/30 hover:bg-charcoal-dark text-white'
                              }`}
                            >
                              <i className={`text-xs ${isCopied ? 'fa-solid fa-check' : 'fa-regular fa-copy'}`}></i>
                              <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/10 pt-3">
                          <div>
                            <p className="text-[9px] uppercase text-white/40 tracking-wider">Atas Nama</p>
                            <p className="text-xs font-medium text-white tracking-wide uppercase">
                              {bank.account_holder}
                            </p>
                          </div>
                          <i className={`text-2xl text-white/40 ${isEven ? 'fa-brands fa-cc-mastercard' : 'fa-brands fa-cc-visa'}`}></i>
                        </div>
                      </div>
                    );
                  })}


                  {/* Optional Physical Gift Address */}
                  {data.gift_address && (
                    <div className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center space-x-2 text-charcoal-dark mb-2">
                        <i className="fa-solid fa-gift text-gold-champagne"></i>
                        <span className="text-xs font-semibold tracking-widest uppercase">
                          Kirim Kado Fisik
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted font-light leading-relaxed mb-3">
                        {data.gift_address}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(data.gift_address || '')}
                        className="px-4 py-2 rounded-full border border-border-subtle hover:border-gold-champagne text-xs text-charcoal-dark hover:text-gold-champagne transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <i className={`text-xs ${copiedAddress ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy'}`}></i>
                        <span>{copiedAddress ? 'Alamat Tersalin' : 'Salin Alamat'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          {/* Section Divider */}
          <div className="flex justify-center items-center py-4">
            <span className="w-12 h-[1px] bg-border-subtle"></span>
            <span className="mx-3 text-gold-champagne text-xs">&#10022;</span>
            <span className="w-12 h-[1px] bg-border-subtle"></span>
          </div>

          {/* ========================================== */}
          {/* 8. LIVE WISHES WALL SECTION                */}
          {/* ========================================== */}
          {theme.show_wishes !== false && isSectionActive('wishes') && (
            <section id="wishes" className="py-12 px-6">
              <div className="text-center mb-8">
                <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
                  Buku Tamu
                </span>
                <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
                  Ucapan &amp; Doa Restu
                </h2>
                <p className="text-xs text-charcoal-muted mt-1 font-light">
                  Tuliskan pesan penuh cinta untuk kedua mempelai
                </p>
              </div>

              {/* Input Wishes Form */}
              <div className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm mb-8">
                {wishSubmitted && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center">
                    Ucapan berhasil dikirim! Terima kasih atas doa restunya.
                  </div>
                )}
                <form onSubmit={handleWishSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={wishForm.name}
                    onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                    placeholder="Nama Anda"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
                  />
                  <textarea
                    rows={3}
                    value={wishForm.message}
                    onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                    placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-charcoal-dark text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-champagne transition-colors shadow flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <i className="fa-regular fa-paper-plane text-xs"></i>
                    <span>Kirim Ucapan</span>
                  </button>
                </form>
              </div>

              {/* Scrollable Guest Comment Cards */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {wishes.map((wish) => {
                  const initials = wish.guest_name
                    ? wish.guest_name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'TM';

                  return (
                    <div key={wish.id} className="bg-white border border-border-subtle rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-gold-light border border-gold-champagne/40 flex items-center justify-center text-gold-champagne text-xs font-semibold">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-semibold text-charcoal-dark break-words [overflow-wrap:anywhere]">{wish.guest_name}</h5>
                            <span className="text-[9px] text-charcoal-muted">
                              {new Date(wish.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border shrink-0 flex items-center space-x-1 ${
                            wish.attendance === 'attending'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-amber-700 bg-amber-50 border-amber-200'
                          }`}
                        >
                          <i
                            className={`text-[8px] ${
                              wish.attendance === 'attending' ? 'fa-solid fa-circle-check' : 'fa-solid fa-paper-plane'
                            }`}
                          ></i>
                          <span>{wish.attendance === 'attending' ? 'Hadir' : 'Berhalangan'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-dark/80 font-light leading-relaxed pl-9 break-words [overflow-wrap:anywhere]">
                        {wish.message}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer Thank You */}
              <div className="text-center pt-14 pb-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold-champagne font-medium mb-1">
                  Terima Kasih
                </p>
                <h3 className="font-editorial text-2xl text-charcoal-dark font-normal">
                  {data.groom.name} &amp; {data.bride.name}
                </h3>
                <p className="text-[10px] text-charcoal-muted tracking-widest mt-2 font-light">
                  {data.hashtag} &bull; 2026
                </p>
              </div>
            </section>
          )}
        </main>
      )}

      {/* ========================================== */}
      {/* FLOATING AUDIO CONTROLLER BUBBLE           */}
      {/* ========================================== */}
      <FloatingDock isPreview={isPreview}>
        {/* Floating Audio Toggle Button (Pojok Kanan Bawah) */}
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
export default Template1Modern;
