import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { InvitationProps, WishItem } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';

export const Template5Luxury: React.FC<InvitationProps> = ({
  data,
  theme,
  wishes: initialWishes = [],
  isCoverOpen: propIsCoverOpen,
  isPreview = false,
  onSubmitRsvp,
  onSubmitWish,
}) => {
  const {
    isOpen,
    isOpening,
    handleOpenInvitation,
    isPlaying,
    toggleMusic: toggleAudio,
    countdown,
    toastMessage,
    toastType,
    showToast,
  } = useTemplateState({
    data,
    theme,
    wishes: initialWishes,
    isCoverOpen: propIsCoverOpen,
    isPreview,
    onSubmitRsvp,
    onSubmitWish,
    fallbackMusicUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  });

  // 4. Copy to Clipboard State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string, label: string = 'No. rekening disalin') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      showToast(label, 'copy');
      setTimeout(() => setCopiedKey(null), 2200);
    });
  };

  // 5. RSVP Form State
  const [rsvpName, setRsvpName] = useState(data.guest_name || '');
  const [rsvpContact, setRsvpContact] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState<'hadir' | 'tidak'>('hadir');
  const [rsvpPax, setRsvpPax] = useState('2');
  const [rsvpDietary, setRsvpDietary] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    if (onSubmitRsvp) {
      onSubmitRsvp(
        rsvpName,
        rsvpAttendance === 'hadir' ? 'attending' : 'declined',
        Number(rsvpPax)
      );
    }
    setRsvpSubmitted(true);
    showToast('Konfirmasi kehadiran terkirim', 'success');
  };

  // 6. Wishes State
  const [wishesList, setWishesList] = useState<WishItem[]>(initialWishes);
  const [wishName, setWishName] = useState('');
  const [wishRelation, setWishRelation] = useState('Friend');
  const [wishMessage, setWishMessage] = useState('');

  useEffect(() => {
    if (initialWishes !== undefined) {
      setWishesList(initialWishes);
    }
  }, [initialWishes]);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;

    const newWish: WishItem = {
      id: Date.now().toString(),
      guest_name: `${wishName.trim()} (${wishRelation})`,
      message: wishMessage.trim(),
      attendance: 'attending',
      created_at: new Date().toISOString(),
    };

    setWishesList((prev) => [newWish, ...prev]);
    if (onSubmitWish) {
      onSubmitWish(newWish.guest_name, wishMessage.trim());
    }
    setWishMessage('');
    setWishName('');
    showToast('Ucapan berhasil dikirim', 'success');
  };

  // 7. Lightbox Modal
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Close gallery lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    if (lightboxImg) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImg]);

  // 9. Calendar Handler
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`The Wedding of ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Holy Matrimony & Gala Reception of ${data.groom.full_name} and ${data.bride.full_name} at The St. Regis Jakarta.`
    );
    const location = encodeURIComponent(
      data.events[1]?.venue_name || data.events[0]?.venue_name || 'The St. Regis Jakarta'
    );
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261024T030000Z/20261024T160000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  // Groom and Bride Initials Monogram
  const monogram = `${data.groom.name.charAt(0)}&${data.bride.name.charAt(0)}`;

  return (
    <div className="theme-luxury bg-surface text-on-surface antialiased flex justify-center min-h-screen selection:bg-primary-container/30 selection:text-on-surface font-sans w-full">
      <div className="w-full max-w-[430px] min-h-screen bg-surface flex flex-col relative">
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />

        {/* ============================================================ */}
        {/* MAIN BODY                                                    */}
        {/* ============================================================ */}
        <main className={`flex-1 flex flex-col relative w-full ${isOpen ? 'pt-safe pb-safe' : 'p-0'} bg-surface`}>
          <div className="flex flex-col w-full relative overflow-x-hidden selection:bg-primary-container/30 selection:text-on-surface h-full flex-1">
            {/* Ambient Golden Ray Backdrops */}
            <div className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-primary-container/5 blur-3xl z-0"></div>
            <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl z-0"></div>

            {/* -------------------------------------------------------- */}
            {/* SECTION 1: COVER GATE OVERLAY                            */}
            {/* -------------------------------------------------------- */}
            {!isOpen && (
              <section
                className={`relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center text-center p-5 sm:p-7 overflow-hidden z-20 transition-all duration-700 ${
                  isOpening ? 'animate-cover-exit pointer-events-none' : ''
                }`}
                id="cover-gate"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    alt="Cover Wedding Portrait"
                    className="w-full h-full object-cover object-top filter brightness-[0.72] contrast-[1.08]"
                    src={
                      data.couple_photo ||
                      data.cover_image ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyyV8nYnWx2tEy7LxLdEPijzUQ2lkIshsrFjKYWD-tNhUs38wKz_untFwzYcIsu_NefUSV9tF1RgMhUS20kKyhra-0O76kwWMBZ1ffHnOhSwWov-uD4wkM5HmVLdVENobwnjuIzZ7fA63bQ9wacLZHJwGse9Fgnz4NRkTLd0fhnZ12nesIAdenQ-acjOcQhtncKgj5t-ndrKTTg8xT-MicB-xM2ZlycPDmo7r8XlBPTaO2n0YPvhMZ'
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-surface/30"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-surface/40 to-surface"></div>
                </div>

                {/* Top Notch-Safe Header */}
                <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-high/60 backdrop-blur-xl flex items-center justify-center mb-2 shadow-2xl shadow-surface-container-lowest border border-white/10">
                    <span className="font-headline-sm text-primary tracking-widest text-base sm:text-lg font-light">
                      {monogram}
                    </span>
                  </div>
                  <p className="font-label-eyebrow text-secondary uppercase tracking-[0.3em] text-[10px]">
                    The Wedding Of
                  </p>
                </div>

                {/* Middle Tier: Couple Typography */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
                  <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl text-on-surface tracking-wider font-normal mb-1">
                    {data.groom.name.toUpperCase()} &amp; {data.bride.name.toUpperCase()}
                  </h1>
                  <p className="font-label-md text-primary font-normal tracking-[0.2em] uppercase text-xs sm:text-sm">
                    {data.wedding_date_display}
                  </p>
                </div>

                {/* Bottom Tier: Translucent Guest Pass Card & CTA Button Anchored Bottom */}
                <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
                  <div className="w-full bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 text-center shadow-2xl shadow-surface-container-lowest/80 border border-white/10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary mb-1.5">
                      <span className="material-symbols-outlined text-xs">diamond</span>
                      <span className="font-label-eyebrow text-[9px] uppercase tracking-widest font-semibold">
                        Special Guest
                      </span>
                    </div>
                    <p className="font-label-sm text-secondary uppercase tracking-widest text-[9px] sm:text-[10px] mb-0.5">
                      Kepada Yth. Bapak/Ibu/Saudara/i:
                    </p>
                    <h2 className="font-headline-sm text-on-surface text-base sm:text-lg font-medium line-clamp-1">
                      {data.guest_name || 'Tamu Undangan'}
                    </h2>
                    {(Boolean(data.guest_code) || isPreview) && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono">
                        <span className="material-symbols-outlined text-[13px]">qr_code</span>
                        <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
                      </div>
                    )}
                    <p className="font-body-sm text-on-surface-variant max-w-[280px] mx-auto text-[10px] sm:text-[11px] leading-relaxed mt-1 italic">
                      Mohon maaf bila ada kesalahan penulisan nama/gelar
                    </p>
                  </div>

                  {/* Glowing Shimmer Pill Button */}
                  <button
                    onClick={handleOpenInvitation}
                    className="group relative inline-flex items-center justify-center gap-2.5 w-full h-12 rounded-full bg-primary text-on-primary font-label-md text-xs sm:text-sm uppercase tracking-[0.18em] shadow-[0_0_30px_rgba(226,199,146,0.35)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">mail</span>
                    <span>Buka Undangan</span>
                    <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
                      arrow_downward
                    </span>
                  </button>
                </div>
              </section>
            )}

            {/* -------------------------------------------------------- */}
            {/* INNER CONTENT (Tampil jika sudah Buka atau Mode Preview) */}
            {/* -------------------------------------------------------- */}
            {isOpen && (
              <div className="flex flex-col w-full animate-page-enter transition-opacity duration-700">
                {/* ---------------------------------------------------- */}
                {/* SECTION 2: HERO & COUNTDOWN                          */}
                {/* ---------------------------------------------------- */}
                <section
                  className="w-full px-margin pt-14 pb-12 flex flex-col items-center text-center relative z-10"
                  id="hero-countdown"
                >
                  <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl mb-8 bg-surface-container-low border border-white/5 reveal-scale">
                    <img
                      alt="Couple Staircase Noir"
                      className="w-full h-full object-cover filter contrast-[1.1]"
                      src={
                        data.gallery[3] ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDKBB8-qibEzbBkPMwrhruecaVqCTj6fThLAIftriWYQb_Jr9oOQNZsti0sdxmAw-dBIGnnZLg_B2gWx5bcAGWOHfjrEjaV8fgvKzWYXLg1qcqawihV2iNK5ocY1uqHGObqQys82uAFSlcqv-dDBDd4O20dQP0ifd3d4FGLQV8K1v7cQU-sERZWui33Jy8nJvP0gYju3iOYDx3c7xRKmm1axbS8vyXNjuGAJakCVZqShadjtVUyKC-8'
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <span className="font-label-eyebrow text-primary text-[10px] tracking-[0.25em] block mb-1">
                        Union &amp; Grace
                      </span>
                      <p className="font-headline-sm text-on-surface text-base italic leading-snug">
                        {data.events[1]?.venue_name || data.events[0]?.venue_name || 'The St. Regis Grand Ballroom'}
                      </p>
                    </div>
                  </div>

                  <blockquote className="font-headline-sm italic text-on-surface-variant text-base leading-relaxed max-w-[320px] mb-6">
                    “{data.quote}”
                  </blockquote>

                  {/* Date Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md mb-8 border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                    <span className="font-label-md text-on-surface text-xs tracking-wider">
                      24 . 10 . 2026 • JAKARTA
                    </span>
                  </div>

                  {/* Countdown Timer 4-Grid */}
                  <div className="w-full grid grid-cols-4 gap-2 max-w-[360px]" id="countdown-grid">
                    <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
                      <span className="font-headline-sm text-primary text-xl font-normal" id="cd-days">
                        {String(countdown.days).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
                        Days
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
                      <span className="font-headline-sm text-primary text-xl font-normal" id="cd-hours">
                        {String(countdown.hours).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
                        Hours
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
                      <span className="font-headline-sm text-primary text-xl font-normal" id="cd-mins">
                        {String(countdown.minutes).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
                        Mins
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low/80 backdrop-blur-md shadow-md border border-white/5">
                      <span className="font-headline-sm text-primary text-xl font-normal" id="cd-secs">
                        {String(countdown.seconds).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-secondary text-[9px] uppercase tracking-widest mt-1">
                        Secs
                      </span>
                    </div>
                  </div>
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 3: COUPLE PROFILE                            */}
                {/* ---------------------------------------------------- */}
                <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="couple">
                  <div className="text-center mb-10">
                    <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                      The Happy Couple
                    </span>
                    <h2 className="font-headline-lg-mobile text-on-surface font-normal">
                      BRIDE &amp; GROOM
                    </h2>
                    <div className="w-10 h-0.5 bg-primary-container/40 mx-auto mt-3 rounded-full"></div>
                  </div>

                  {/* Groom Card */}
                  <div className="w-full max-w-[340px] rounded-xl bg-surface-container-low/80 backdrop-blur-lg overflow-hidden p-5 flex flex-col items-center text-center shadow-xl shadow-surface-container-lowest/50 mb-6 border border-white/5">
                    <div className="w-36 h-48 rounded-lg overflow-hidden mb-4 shadow-lg bg-surface-container">
                      <img
                        alt={data.groom.full_name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                        src={
                          data.groom.photo_url ||
                          (data.groom as any).photo ||
                          data.couple_photo ||
                          data.cover_image ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                        }
                      />
                    </div>
                    <span className="font-label-eyebrow text-primary text-[10px] tracking-widest uppercase mb-1">
                      The Groom
                    </span>
                    <h3 className="font-headline-sm text-on-surface text-lg mb-1">
                      {data.groom.full_name}
                    </h3>
                    <p className="font-body-sm text-secondary text-xs mb-4">
                      {data.groom.child_order} <br />
                      {data.groom.parent_father} &amp; {data.groom.parent_mother}
                    </p>
                    {data.groom.instagram && (
                      <a
                        className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary text-xs font-label-md tracking-wider transition-colors"
                        href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">
                          alternate_email
                        </span>
                        <span>{data.groom.instagram.replace('@', '')}</span>
                      </a>
                    )}
                  </div>

                  {/* Delicate Monogram Ampersand */}
                  <div className="my-2 flex items-center justify-center">
                    <span className="font-headline-lg text-primary/70 italic text-3xl select-none">
                      &amp;
                    </span>
                  </div>

                  {/* Bride Card */}
                  <div className="w-full max-w-[340px] rounded-xl bg-surface-container-low/80 backdrop-blur-lg overflow-hidden p-5 flex flex-col items-center text-center shadow-xl shadow-surface-container-lowest/50 mt-2 border border-white/5">
                    <div className="w-36 h-48 rounded-lg overflow-hidden mb-4 shadow-lg bg-surface-container">
                      <img
                        alt={data.bride.full_name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                        src={
                          data.bride.photo_url ||
                          (data.bride as any).photo ||
                          data.couple_photo ||
                          data.cover_image ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                        }
                      />
                    </div>
                    <span className="font-label-eyebrow text-primary text-[10px] tracking-widest uppercase mb-1">
                      The Bride
                    </span>
                    <h3 className="font-headline-sm text-on-surface text-lg mb-1">
                      {data.bride.full_name}
                    </h3>
                    <p className="font-body-sm text-secondary text-xs mb-4">
                      {data.bride.child_order} <br />
                      {data.bride.parent_father} &amp; {data.bride.parent_mother}
                    </p>
                    {data.bride.instagram && (
                      <a
                        className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary text-xs font-label-md tracking-wider transition-colors"
                        href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">
                          alternate_email
                        </span>
                        <span>{data.bride.instagram.replace('@', '')}</span>
                      </a>
                    )}
                  </div>
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 4: LOVE STORY TIMELINE                       */}
                {/* ---------------------------------------------------- */}
                {theme?.show_love_story !== false && data.love_story && (
                  <section className="w-full px-margin py-12 relative z-10" id="story">
                    <div className="text-center mb-10">
                      <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                        Our Chapters
                      </span>
                      <h2 className="font-headline-lg-mobile text-on-surface font-normal">
                        A JOURNEY WRITTEN IN THE STARS
                      </h2>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative pl-6 flex flex-col gap-9 max-w-[360px] mx-auto">
                      {/* Continuous luminous spine */}
                      <div className="absolute top-2 bottom-4 left-[11px] w-[1px] bg-gradient-to-b from-primary via-secondary-fixed-dim/30 to-primary/80"></div>

                      {data.love_story.map((milestone, idx) => (
                        <div key={idx} className="relative flex flex-col">
                          <div className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-surface flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(226,199,146,0.8)]"></div>
                          </div>
                          <div className="rounded-xl bg-surface-container-low/70 backdrop-blur-md p-4 ml-2 shadow-lg border border-white/5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-label-md text-primary font-medium text-xs">
                                {milestone.year}
                              </span>
                              <span className="font-label-sm text-secondary text-[10px]">
                                {milestone.subtitle}
                              </span>
                            </div>
                            <h4 className="font-headline-sm text-on-surface text-base mb-1">
                              {milestone.title}
                            </h4>
                            <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ---------------------------------------------------- */}
                {/* SECTION 5: EVENT DETAILS & VENUE                     */}
                {/* ---------------------------------------------------- */}
                <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="events">
                  <div className="text-center mb-8">
                    <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                      Itinerary
                    </span>
                    <h2 className="font-headline-lg-mobile text-on-surface font-normal">
                      EVENT DETAILS
                    </h2>
                  </div>

                  {/* Matrimony Card */}
                  {data.events[0] && (
                    <div className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 mb-5 shadow-xl shadow-surface-container-lowest/60 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-eyebrow text-[9px] uppercase tracking-wider">
                          {data.events[0].badge || 'Chapter I'}
                        </span>
                        <span className="font-label-md text-secondary text-xs">
                          {data.events[0].time}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-on-surface text-lg mb-1">
                        {data.events[0].name}
                      </h3>
                      <div className="flex items-start gap-2 mb-3 text-secondary">
                        <span className="material-symbols-outlined text-sm text-primary mt-0.5">
                          location_on
                        </span>
                        <p className="font-body-sm text-xs leading-snug">
                          {data.events[0].venue_name}
                          <br />
                          <span className="text-on-surface-variant text-[11px]">
                            {data.events[0].venue_address}
                          </span>
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container/70 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-base">
                          checkroom
                        </span>
                        <div>
                          <p className="font-label-eyebrow text-[9px] text-secondary uppercase tracking-widest">
                            Dress Code
                          </p>
                          <p className="font-body-sm text-on-surface text-xs">
                            Formal Modest Black-Tie / Tuxedo
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gala Reception Card */}
                  {data.events[1] && (
                    <div className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 mb-6 shadow-xl shadow-surface-container-lowest/60 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-eyebrow text-[9px] uppercase tracking-wider">
                          {data.events[1].badge || 'Chapter II'}
                        </span>
                        <span className="font-label-md text-secondary text-xs">
                          {data.events[1].time}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-on-surface text-lg mb-1">
                        {data.events[1].name}
                      </h3>
                      <div className="flex items-start gap-2 mb-3 text-secondary">
                        <span className="material-symbols-outlined text-sm text-primary mt-0.5">
                          location_on
                        </span>
                        <p className="font-body-sm text-xs leading-snug">
                          {data.events[1].venue_name}
                          <br />
                          <span className="text-on-surface-variant text-[11px]">
                            {data.events[1].venue_address}
                          </span>
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container/70 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-base">
                          styler
                        </span>
                        <div>
                          <p className="font-label-eyebrow text-[9px] text-secondary uppercase tracking-widest">
                            Dress Code
                          </p>
                          <p className="font-body-sm text-on-surface text-xs">
                            Midnight Black-Tie &amp; Evening Gown (Black, Champagne, Dark Emerald)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="w-full max-w-[360px] flex flex-col gap-2.5">
                    <a
                      className="w-full py-3 px-4 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-2 font-label-md uppercase tracking-wider text-xs transition-colors shadow-md border border-white/5"
                      href={data.events[1]?.maps_url || data.events[0]?.maps_url || 'https://maps.google.com'}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-primary text-base">map</span>
                      <span>Open in Google Maps</span>
                    </a>
                    <button
                      className="w-full py-3 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary flex items-center justify-center gap-2 font-label-md uppercase tracking-wider text-xs transition-colors border border-white/5 cursor-pointer"
                      onClick={handleAddToCalendar}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      <span>Add to Calendar</span>
                    </button>
                  </div>
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 6: PHOTO GALLERY                             */}
                {/* ---------------------------------------------------- */}
                {theme?.show_gallery !== false && data.gallery && (
                  <section className="w-full px-margin py-12 z-10" id="gallery">
                    <div className="text-center mb-8">
                      <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                        Visual Prelude
                      </span>
                      <h2 className="font-headline-lg-mobile text-on-surface font-normal">
                        MOMENTS IN MONOCHROME
                      </h2>
                    </div>

                    {/* Masonry Two-Column Showcase */}
                    <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto">
                      <div className="flex flex-col gap-3">
                        {data.gallery[0] && (
                          <div
                            onClick={() => setLightboxImg(data.gallery[0])}
                            className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
                          >
                            <img
                              alt="Gala Editorial Couple"
                              className="w-full h-full object-cover filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                              src={data.gallery[0]}
                            />
                          </div>
                        )}
                        {data.gallery[1] && (
                          <div
                            onClick={() => setLightboxImg(data.gallery[1])}
                            className="w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
                          >
                            <img
                              alt="Romeo Portrait Gala"
                              className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                              src={data.gallery[1]}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 pt-4">
                        {data.gallery[2] && (
                          <div
                            onClick={() => setLightboxImg(data.gallery[2])}
                            className="w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
                          >
                            <img
                              alt="Juliet Portrait Couture"
                              className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                              src={data.gallery[2]}
                            />
                          </div>
                        )}
                        {data.gallery[3] && (
                          <div
                            onClick={() => setLightboxImg(data.gallery[3])}
                            className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
                          >
                            <img
                              alt="Marble Stairs Promenade"
                              className="w-full h-full object-cover filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                              src={data.gallery[3]}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sisa Foto Galeri (Muncul saat tombol Lihat Selengkapnya diklik) */}
                    {showAllGallery && data.gallery.length > 4 && (
                      <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto mt-3 animate-in fade-in duration-300">
                        {data.gallery.slice(4).map((imgUrl, idx) => (
                          <div
                            key={idx + 4}
                            onClick={() => setLightboxImg(imgUrl)}
                            className="w-full aspect-square rounded-xl overflow-hidden bg-surface-container shadow-md group cursor-pointer border border-white/5"
                          >
                            <img
                              alt={`Luxury Gallery ${idx + 5}`}
                              className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                              src={imgUrl}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tombol Lihat Selengkapnya jika foto > 4 */}
                    {data.gallery.length > 4 && (
                      <div className="text-center mt-6">
                        <button
                          type="button"
                          onClick={() => setShowAllGallery((prev) => !prev)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/40 bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <span>
                            {showAllGallery
                              ? 'Close Gallery'
                              : `View Full Gallery (${data.gallery.length - 4} More)`}
                          </span>
                          <span className="material-symbols-outlined text-[16px]">
                            {showAllGallery ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {/* ---------------------------------------------------- */}
                {/* SECTION 7: RSVP & DIGITAL ENVELOPE                   */}
                {/* ---------------------------------------------------- */}
                <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="rsvp">
                  <div className="text-center mb-8">
                    <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                      Reservation
                    </span>
                    <h2 className="font-headline-lg-mobile text-on-surface font-normal">
                      CONFIRM ATTENDANCE
                    </h2>
                    <p className="font-body-sm text-secondary text-xs mt-1">
                      Kindly respond on or before October 1st, 2026
                    </p>
                  </div>

                  {/* RSVP Glass Form */}
                  {theme?.show_rsvp !== false && (
                    <form
                      onSubmit={handleRsvpSubmit}
                      className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 shadow-xl shadow-surface-container-lowest/60 flex flex-col gap-4 mb-12 border border-white/5"
                    >
                      <div>
                        <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
                          Full Name
                        </label>
                        <input
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
                          placeholder="Dian Sastrowardoyo"
                          required
                          type="text"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
                          Phone / Email
                        </label>
                        <input
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
                          placeholder="dian@example.com"
                          type="text"
                          value={rsvpContact}
                          onChange={(e) => setRsvpContact(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
                          Attendance Confirmation
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container cursor-pointer border border-transparent hover:border-primary/40">
                            <input
                              checked={rsvpAttendance === 'hadir'}
                              onChange={() => setRsvpAttendance('hadir')}
                              className="accent-primary"
                              name="attendance"
                              type="radio"
                              value="hadir"
                            />
                            <span className="font-body-sm text-on-surface text-xs">
                              Hadir (Attend)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container cursor-pointer border border-transparent hover:border-primary/40">
                            <input
                              checked={rsvpAttendance === 'tidak'}
                              onChange={() => setRsvpAttendance('tidak')}
                              className="accent-primary"
                              name="attendance"
                              type="radio"
                              value="tidak"
                            />
                            <span className="font-body-sm text-on-surface text-xs">
                              Tidak Hadir
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
                          value={rsvpPax}
                          onChange={(e) => setRsvpPax(e.target.value)}
                          placeholder="Enter guest count (e.g. 2)"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-label-eyebrow text-secondary uppercase text-[10px] tracking-widest mb-1.5">
                          Dietary Restrictions (Optional)
                        </label>
                        <input
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
                          placeholder="e.g. Vegetarian, Nut Allergy"
                          type="text"
                          value={rsvpDietary}
                          onChange={(e) => setRsvpDietary(e.target.value)}
                        />
                      </div>

                      <button
                        className="w-full mt-2 py-3.5 rounded-lg bg-primary text-on-primary font-label-md uppercase tracking-[0.15em] shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform text-xs cursor-pointer"
                        type="submit"
                      >
                        Submit RSVP
                      </button>

                      {rsvpSubmitted && (
                        <div
                          className="p-3 rounded-lg bg-primary/10 text-primary text-center font-body-sm text-xs border border-primary/20 animate-fadeIn"
                          id="rsvp-success"
                        >
                          ✨ Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dengan anggun.
                        </div>
                      )}
                    </form>
                  )}

                  {/* Digital Envelope / Tanda Kasih */}
                  {theme?.show_gift !== false && (
                    <div className="w-full max-w-[360px] flex flex-col items-center" id="gift">
                      <div className="text-center mb-6">
                        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                          Digital Envelope
                        </span>
                        <h3 className="font-headline-sm text-on-surface text-lg">
                          TANDA KASIH
                        </h3>
                        <p className="font-body-sm text-on-surface-variant text-xs mt-1 max-w-[280px]">
                          Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang berkenan memberikan
                          tanda kasih secara cashless:
                        </p>
                      </div>

                      {/* Bank Accounts */}
                      {((data.banks && data.banks.length > 0) ? data.banks : ((data as any).bank_accounts || []))?.map((bank: any, index: number) => (
                        <div
                          key={index}
                          className="w-full rounded-xl bg-surface-container-high/90 backdrop-blur-md p-5 mb-4 shadow-xl relative overflow-hidden border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-label-md font-bold tracking-widest text-on-surface text-xs">
                              {bank.bank_name}
                            </span>
                            <span className="material-symbols-outlined text-primary text-lg">
                              {index === 0 ? 'credit_card' : 'contactless'}
                            </span>
                          </div>
                          <p className="font-label-sm text-secondary uppercase tracking-widest text-[9px] mb-0.5">
                            Nomor Rekening
                          </p>
                          <p className="font-headline-sm text-on-surface text-lg tracking-wider mb-2 font-mono">
                            {bank.account_number}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-body-sm text-secondary text-xs">
                              a/n {bank.account_holder}
                            </p>
                            <button
                              className="py-1 px-3 rounded-full bg-primary-container/20 text-primary text-[11px] font-label-md uppercase tracking-wider transition-colors cursor-pointer hover:bg-primary-container/30"
                              onClick={() => handleCopy(bank.account_number_raw || bank.account_number, `bank-${index}`)}
                              type="button"
                            >
                              {copiedKey === `bank-${index}` ? 'Tersalin ✓' : 'Salin No. Rekening'}
                            </button>
                          </div>
                        </div>
                      ))}


                      {/* Gift Delivery Address */}
                      {data.gift_address && (
                        <div className="w-full rounded-xl bg-surface-container-low/80 backdrop-blur-md p-5 shadow-md border border-white/5 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-label-eyebrow text-primary uppercase text-[9px] tracking-widest">
                              Physical Gift Address
                            </span>
                            <span className="material-symbols-outlined text-primary text-base">
                              inventory_2
                            </span>
                          </div>
                          <p className="font-body-sm text-on-surface-variant text-xs mb-3 leading-relaxed">
                            {data.gift_address}
                          </p>
                          <button
                            className="self-start py-1 px-3 rounded-full bg-primary-container/20 text-primary text-[11px] font-label-md uppercase tracking-wider transition-colors cursor-pointer hover:bg-primary-container/30"
                            onClick={() => handleCopy(data.gift_address || '', 'gift-address')}
                            type="button"
                          >
                            {copiedKey === 'gift-address' ? 'Tersalin ✓' : 'Salin Alamat Lengkap'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 8: LIVE WISHES WALL & GRATITUDE              */}
                {/* ---------------------------------------------------- */}
                <section className="w-full px-margin pt-10 pb-28 flex flex-col items-center z-10" id="wishes">
                  <div className="text-center mb-7">
                    <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
                      Untaian Doa &amp; Ucapan
                    </span>
                    <h2 className="font-headline-lg-mobile text-on-surface font-normal">
                      PRAYERS &amp; WISHES
                    </h2>
                  </div>

                  {/* Wish Input Card */}
                  {theme?.show_wishes !== false && (
                    <form
                      onSubmit={handleWishSubmit}
                      className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-4 shadow-xl mb-7 flex flex-col gap-3 border border-white/5"
                      id="wish-form"
                    >
                      <input
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
                        id="wish-author"
                        placeholder="Nama Anda"
                        required
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                      />
                      <select
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent focus:border-primary"
                        id="wish-relation"
                        value={wishRelation}
                        onChange={(e) => setWishRelation(e.target.value)}
                      >
                        <option value="Colleague">Colleague &amp; Partner</option>
                        <option value="Friend">Close Friend</option>
                        <option value="Family">Family Relative</option>
                      </select>
                      <textarea
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline border border-transparent focus:border-primary"
                        id="wish-content"
                        placeholder="Tuliskan doa serta restu untuk kedua mempelai..."
                        required
                        rows={3}
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                      ></textarea>
                      <button
                        className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md uppercase tracking-wider text-xs shadow-md active:scale-[0.98] transition-transform cursor-pointer font-medium"
                        type="submit"
                      >
                        Kirim Doa
                      </button>
                    </form>
                  )}

                  {/* Scrollable Stream of Translucent Wishes */}
                  <div className="w-full max-w-[360px] flex flex-col gap-3" id="wishes-stream">
                    {wishesList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-surface-container-low/70 backdrop-blur-md shadow-md border border-white/5 animate-fadeIn"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-label-md text-on-surface text-xs font-medium">
                              {item.guest_name}
                            </span>
                          </div>
                          <span className="font-body-sm text-secondary text-[10px]">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                          "{item.message}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Closing Gratitude Note */}
                  <div className="text-center mt-12 mb-4 max-w-[320px]">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high mx-auto flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-primary text-base">
                        favorite
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed mb-3">
                      Merupakan suatu kehormatan dan kebahagiaan mendalam bagi kami apabila Bapak/Ibu/Saudara(i)
                      berkenan hadir dan memberikan doa restu.
                    </p>
                    <p className="font-label-eyebrow text-secondary uppercase tracking-[0.25em] text-[10px] mb-1">
                      With All Our Love,
                    </p>
                    <h3 className="font-headline-sm text-primary text-lg">
                      {data.groom.name.toUpperCase()} &amp; {data.bride.name.toUpperCase()}
                    </h3>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>

        {/* ============================================================ */}
        {/* FLOATING CONTROLS: LUXURY AUDIO BUBBLE                       */}
        {/* ============================================================ */}
        <FloatingDock isPreview={isPreview}>
          {/* Floating Luxury Audio Controller Bubble (Pojok Kanan Bawah) */}
          {isOpen && (
            <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 pointer-events-auto`}>
              <button
                aria-label="Toggle Soundtrack"
                onClick={toggleAudio}
                className="w-11 h-11 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-transform active:scale-95 cursor-pointer hover:bg-neutral-800"
                title="Putar / Hentikan Musik"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[20px] text-amber-300 ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                >
                  {isPlaying ? 'graphic_eq' : 'volume_off'}
                </span>
              </button>
            </div>
          )}
        </FloatingDock>

        {/* ============================================================ */}
        {/* LIGHTBOX PHOTO MODAL                                         */}
        {/* ============================================================ */}
        {lightboxImg && typeof document !== 'undefined' && createPortal(
          <div
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          >
            <div
              className="relative max-w-sm sm:max-w-md w-full max-h-[88vh] flex flex-col items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm"
                type="button"
                title="Tutup Foto"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
              <img
                src={lightboxImg}
                alt="Enlarged gallery view"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default Template5Luxury;
