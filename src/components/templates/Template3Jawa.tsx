import React, { useState } from 'react';
import type { InvitationProps } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';
import { VenueMapEmbed } from '../common/VenueMapEmbed';
import { GalleryLightbox } from '../common/GalleryLightbox';

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
      className="theme-jawa dark bg-[#1a110d] min-h-screen font-body-md text-body-md text-[#f1dfd6] antialiased flex justify-center"
      style={{ backgroundColor: '#1a110d', color: '#f1dfd6' }}
    >
      {/* Mobile Viewport Container (Max 430px) */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#1a110d] relative flex flex-col shadow-[0_12px_40px_rgba(10,6,4,0.9)] overflow-x-hidden border-x border-[#322822]/60">
        
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />

        <main className={`flex flex-col relative w-full bg-surface min-h-screen flex-1`}>
          <div className="flex flex-col w-full relative select-none h-full flex-1">
            {/* ========================================== */}
            {/* SECTION 1: COVER GATE OVERLAY              */}
            {/* ========================================== */}
            {!isOpen && (
              <section
                id="sampul"
                className={`relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center text-center p-5 sm:p-7 z-30 overflow-hidden bg-surface-container-low transition-all duration-700 ${
                  isOpening ? 'animate-cover-exit pointer-events-none' : ''
                }`}
              >
                {/* Traditional Javanese Kawung lattice geometric decorative background */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#f2ca50_1px,transparent_1px)] [background-size:18px_18px]"></div>

                {/* Top Notch-Safe Ornamental Motif & Royal Title */}
                <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
                  <div className="flex items-center space-x-2 mb-2 opacity-75">
                    <span className="w-8 h-[1px] bg-secondary-container"></span>
                    <span className="material-symbols-outlined text-primary text-sm">spa</span>
                    <span className="w-8 h-[1px] bg-secondary-container"></span>
                  </div>
                  <span className="font-label-lg text-xs sm:text-sm uppercase tracking-widest text-[#edc155] font-medium">
                    The Royal Wedding Of
                  </span>
                </div>

                {/* Middle Tier: Gunungan Wayang & Couple Names */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center mb-3">
                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                    <svg
                      className="w-full h-full text-primary drop-shadow-[0_4px_16px_rgba(242,202,80,0.35)]"
                      fill="none"
                      viewBox="0 0 100 135"
                    >
                      <path
                        d="M50 4 C48 18 18 60 18 90 C18 116 34 130 50 130 C66 130 82 116 82 90 C82 60 52 18 50 4 Z"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                      ></path>
                      <path
                        d="M50 16 C48 30 26 68 26 92 C26 112 38 122 50 122 C62 122 74 112 74 92 C74 68 52 30 50 16 Z"
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        strokeWidth="1.2"
                      ></path>
                      <path
                        d="M50 36 C42 45 42 58 50 66 C58 58 58 45 50 36 Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      ></path>
                      <path
                        d="M50 62 C34 72 34 90 50 98 C66 90 66 72 50 62 Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      ></path>
                      <path
                        d="M50 94 C38 102 38 116 50 122 C62 116 62 102 50 94 Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      ></path>
                      <circle cx="50" cy="4" fill="currentColor" r="3"></circle>
                      <rect height="18" rx="2" stroke="currentColor" strokeWidth="1.4" width="12" x="44" y="104"></rect>
                    </svg>
                  </div>

                  <div className="space-y-0.5 text-center">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#f2ca50] tracking-wide drop-shadow-sm">
                      {firstPerson.name}
                    </h1>
                    <p className="font-serif italic text-sm text-[#d0c5af] my-0.5">&amp;</p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f2ca50] tracking-wide drop-shadow-sm">
                      {secondPerson.name}
                    </h2>
                  </div>
                </div>

                {/* Bottom Tier: Undangan Kepada Card & CTA Button Anchored Bottom */}
                <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
                  <div className="w-full bg-surface-container rounded-2xl p-3.5 sm:p-4 shadow-lg shadow-surface-container-lowest relative overflow-hidden border border-[#3e322d]">
                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-primary/10 blur-md pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-1.5 opacity-60">
                      <span className="material-symbols-outlined text-xs text-primary">filter_vintage</span>
                      <span className="font-label-md text-[11px] sm:text-xs text-on-surface-variant uppercase tracking-wider">
                        Serat Katur Dhumateng
                      </span>
                      <span className="material-symbols-outlined text-xs text-primary">filter_vintage</span>
                    </div>
                    <p className="font-body-md text-xs text-on-surface font-medium">
                      Kepada Yth. Bapak/Ibu/Saudara/i:
                    </p>
                    <div className="my-1.5 py-1.5 px-3 bg-surface-container-lowest/70 rounded-lg">
                      <p className="font-title-lg text-base sm:text-lg text-primary tracking-wide font-bold line-clamp-1">
                        {data.guest_name || 'Tamu Undangan'}
                      </p>
                    </div>
                    {(Boolean(data.guest_code) || isPreview) && (
                      <div className="mt-1 mb-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary font-label-md text-xs font-mono">
                        <span className="material-symbols-outlined text-[13px]">qr_code</span>
                        <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
                      </div>
                    )}
                    <p className="font-caption text-[10px] text-on-surface-variant/80 mt-1 italic">
                      Mohon maaf bila ada kesalahan penulisan nama/gelar
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenInvitation}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-[#e9c349] via-[#f2ca50] to-[#edc155] text-[#241a00] font-label-lg text-sm shadow-[0_8px_24px_rgba(242,202,80,0.35)] hover:brightness-105 active:scale-95 transition-all cursor-pointer font-bold tracking-wider flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">drafts</span>
                    <span>BUKA UNDANGAN</span>
                  </button>
                </div>
              </section>
            )}

            {/* ========================================== */}
            {/* INNER CONTENT (Tampil jika sudah Buka atau Mode Preview) */}
            {/* ========================================== */}
            {isOpen && (
              <div className="flex flex-col w-full animate-page-enter transition-opacity duration-700">
                {/* ========================================== */}
                {/* SECTION 2: HERO & COUNTDOWN                */}
                {/* ========================================== */}
                {isSectionActive('hero') && (
              <section
                id="pawarta"
                className="relative w-full bg-surface px-margin py-space-xl flex flex-col items-center text-center"
              >
                {/* Decorative Filigree Arch Frame */}
                <div className="w-full relative rounded-2xl bg-surface-container-low p-3 shadow-2xl shadow-surface-container-lowest mb-6 reveal-scale">
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-surface-container">
                    <img
                      src={data.couple_photo || data.cover_image}
                      alt={`${firstPerson.name} & ${secondPerson.name}`}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/30"></div>
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed px-3 py-1 bg-surface-container-low/80 backdrop-blur-sm rounded-full">
                        {data.hashtag || 'Kraton Ngayogyakarta Hadiningrat'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Royal Date & Javanese Calendar */}
                <div className="mb-4">
                  <p className="font-headline-md text-headline-md text-primary">
                    {data.wedding_date_display}
                  </p>
                  <p className="font-title-md text-title-md text-tertiary mt-1 italic">
                    Dinten Berkah • Windu Sancaya
                  </p>
                </div>

                {/* Philosophical Sacred Quote */}
                <div className="w-full bg-surface-container-low/60 rounded-xl p-space-md mb-8 reveal delay-100">
                  <p className="font-body-lg text-body-lg text-on-surface-variant italic leading-relaxed">
                    &ldquo;{data.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="w-6 h-[1px] bg-secondary-container"></span>
                    <span className="font-caption text-caption text-secondary tracking-widest uppercase">
                      {data.quote_source}
                    </span>
                    <span className="w-6 h-[1px] bg-secondary-container"></span>
                  </div>
                </div>

                {/* Royal Countdown Timer Cards */}
                <div className="w-full reveal delay-200">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-3">
                    Menghitung Waktu Berkah
                  </span>
                  <div className="grid grid-cols-4 gap-2 w-full">
                    <div className="bg-surface-container-high rounded-xl py-3 px-1 shadow-md flex flex-col items-center">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        {days}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">
                        Hari
                      </span>
                    </div>
                    <div className="bg-surface-container-high rounded-xl py-3 px-1 shadow-md flex flex-col items-center">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        {String(hours).padStart(2, '0')}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">
                        Jam
                      </span>
                    </div>
                    <div className="bg-surface-container-high rounded-xl py-3 px-1 shadow-md flex flex-col items-center">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        {String(minutes).padStart(2, '0')}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">
                        Menit
                      </span>
                    </div>
                    <div className="bg-surface-container-high rounded-xl py-3 px-1 shadow-md flex flex-col items-center">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        {String(seconds).padStart(2, '0')}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">
                        Detik
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Livestream Banner */}
                {data.livestream_url && (
                  <div className="mt-6 w-full p-4 rounded-xl bg-surface-container-low border border-primary/30 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-2xl animate-pulse">
                        videocam
                      </span>
                      <div>
                        <p className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                          Siaran Langsung
                        </p>
                        <h4 className="font-title-md text-title-md text-on-surface">
                          Pawiwahan Live Streaming
                        </h4>
                      </div>
                    </div>
                    <a
                      href={data.livestream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:brightness-105"
                    >
                      Mirsani
                    </a>
                  </div>
                )}
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 3: COUPLE PROFILE                  */}
            {/* ========================================== */}
            {isSectionActive('couple') && (
              <section
                id="mempelai"
                className="relative w-full bg-surface-container-low px-margin py-space-xl flex flex-col items-center text-center"
              >
                <div className="mb-6">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                    Dhedhasaring Katresnan
                  </span>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Mempelai Kekalih
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="w-10 h-[1px] bg-secondary-container"></span>
                    <span className="material-symbols-outlined text-primary text-xs">local_florist</span>
                    <span className="w-10 h-[1px] bg-secondary-container"></span>
                  </div>
                </div>

                {/* Person 1 Card */}
                <div className="w-full bg-surface-container rounded-2xl p-space-md shadow-xl mb-4 flex flex-col items-center text-center reveal-left delay-100">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg shadow-surface-container-lowest mb-4">
                    <img
                      src={firstPerson.photo_url || firstPerson.photo || data.couple_photo || data.cover_image}
                      alt={firstPerson.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-title-lg text-title-lg text-primary">
                    {firstPerson.full_name}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                    {firstPerson.child_order} saking Bpk. {firstPerson.parent_father}
                    <br />&amp; Ibu {firstPerson.parent_mother}
                  </p>
                  {firstPerson.instagram && (
                    <a
                      href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors font-label-md text-label-md"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      <span>{firstPerson.instagram}</span>
                    </a>
                  )}
                </div>

                {/* Golden Ukiran Connector */}
                <div className="my-2 flex items-center justify-center gap-3 reveal-scale delay-200">
                  <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-primary"></div>
                  <span className="font-headline-md text-headline-md text-primary italic font-serif">&amp;</span>
                  <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-primary"></div>
                </div>

                {/* Person 2 Card */}
                <div className="w-full bg-surface-container rounded-2xl p-space-md shadow-xl flex flex-col items-center text-center reveal-right delay-300">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg shadow-surface-container-lowest mb-4">
                    <img
                      src={secondPerson.photo_url || secondPerson.photo || data.couple_photo || data.cover_image}
                      alt={secondPerson.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-title-lg text-title-lg text-primary">
                    {secondPerson.full_name}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                    {secondPerson.child_order} saking Bpk. {secondPerson.parent_father}
                    <br />&amp; Ibu {secondPerson.parent_mother}
                  </p>
                  {secondPerson.instagram && (
                    <a
                      href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors font-label-md text-label-md"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
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
              <section className="relative w-full bg-surface px-margin py-space-xl">
                <div className="text-center mb-8">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                    Cariyos Katresnan
                  </span>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Lampahing Katresnan
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
                    Jejak langkah takdir tumuju marang janji suci
                  </p>
                </div>

                <div className="relative pl-6 space-y-6">
                  {/* Golden connecting line */}
                  <div className="absolute top-3 bottom-3 left-[11px] w-[2px] bg-gradient-to-b from-primary via-secondary-container to-primary/30"></div>

                  {data.love_story.map((story, index) => {
                    const iconName =
                      story.icon === 'explore'
                        ? 'explore'
                        : story.icon === 'favorite'
                        ? 'favorite'
                        : story.icon === 'church'
                        ? 'church'
                        : index === 0
                        ? 'explore'
                        : index === 1
                        ? 'favorite'
                        : 'church';

                    return (
                      <div key={index} className="relative flex flex-col">
                        <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shadow-md">
                          {index === 0 && (
                            <span className="absolute w-3.5 h-3.5 rounded-full bg-primary/60 animate-ping pointer-events-none" />
                          )}
                          <span className="relative w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                        </div>
                        <div className="bg-surface-container-low rounded-xl p-4 shadow-md ml-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                              {story.year} • {story.title}
                            </span>
                            <span className="material-symbols-outlined text-xs text-secondary">
                              {iconName}
                            </span>
                          </div>
                          <h4 className="font-title-md text-title-md text-on-surface">
                            {story.subtitle}
                          </h4>
                          <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                            {story.description}
                          </p>
                        </div>
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
              <section
                id="acara"
                className="relative w-full bg-surface-container-low px-margin py-space-xl flex flex-col items-center"
              >
                <div className="text-center mb-8">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                    Rantamaning Adicara
                  </span>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Pawiwahan &amp; Resepsi
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
                    Sinartan berkah donga pangestu panjenengan sami
                  </p>
                </div>

                {data.events.map((event: any, idx: number) => {
                  const badgeIcon = idx === 0 ? 'verified' : 'celebration';
                  const badgeText = event.badge || (idx === 0 ? 'Ijab Qobul' : 'Panggih & Pahargyan');
                  const headerSub = idx === 0 ? 'Sasana Ageng' : 'Resepsi Ageng';

                  const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
                  const isCountdownEvent = idx === activeTargetIdx;

                  return (
                    <div
                      key={idx}
                      className="w-full bg-surface-container rounded-2xl p-space-md shadow-xl mb-6 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary">
                          <span className="material-symbols-outlined text-sm">{badgeIcon}</span>
                          <span className="font-label-md text-label-md uppercase tracking-wider">
                            {badgeText}
                          </span>
                        </div>
                        <span className="font-caption text-caption text-secondary">
                          {headerSub}
                        </span>
                      </div>

                      <h3 className="font-headline-md text-headline-md text-on-surface mb-4 break-words [overflow-wrap:anywhere]">
                        {event.name}
                      </h3>

                      <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                            calendar_today
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-on-surface font-semibold break-words [overflow-wrap:anywhere]">{event.date}</p>
                            <p className="font-caption text-caption break-words [overflow-wrap:anywhere]">Dinten Berkah Mulya</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                            schedule
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-on-surface font-semibold break-words [overflow-wrap:anywhere]">{event.time}</p>
                            <p className="font-caption text-caption break-words [overflow-wrap:anywhere]">Kanthi khidmad kawiwitan tepat wekdal</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                            account_balance
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-on-surface font-semibold break-words [overflow-wrap:anywhere]">{event.venue_name}</p>
                            <p className="font-caption text-caption leading-relaxed break-words [overflow-wrap:anywhere]">{event.venue_address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
                      {isCountdownEvent && (
                        <div className="w-full mt-4 mb-3">
                          <VenueMapEmbed
                            venueName={event.venue_name || 'Kraton Yogyakarta Hadiningrat'}
                            venueAddress={event.venue_address}
                            mapsUrl={event.maps_url}
                            heightClass="h-44"
                            isPreview={isPreview}
                          />
                        </div>
                      )}

                      {/* Google Maps CTA Button (Selalu tampil di setiap card acara) */}
                      <a
                        href={event.maps_url || 'https://maps.google.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-4 py-3 px-6 rounded-full bg-gradient-to-r from-primary-fixed-dim via-primary to-secondary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-lg">map</span>
                        <span className="tracking-wider">BUKA GOOGLE MAPS</span>
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
              <section id="galeri" className="relative w-full bg-surface px-margin py-space-xl flex flex-col items-center">
                <div className="text-center mb-6">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                    Rerenggan Potret
                  </span>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Galeri Sasana &amp; Bahagia
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
                    Gatra katresnan ingkang kerekam ing sajroning wekdal
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-3">
                  {(showAllGallery ? data.gallery : data.gallery.slice(0, 4)).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className="rounded-xl overflow-hidden aspect-[3/4] bg-surface-container shadow-md group cursor-pointer"
                    >
                      <img
                        src={imgUrl}
                        alt={`Galeri ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Tombol Lihat Selengkapnya jika foto > 4 */}
                {data.gallery.length > 4 && (
                  <div className="text-center mt-2 mb-4 w-full">
                    <button
                      type="button"
                      onClick={() => setShowAllGallery((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-primary border border-primary/30 font-label-md text-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>
                        {showAllGallery
                          ? 'Tutup Rerenggan Potret'
                          : `Lihat Selengkapnya (${data.gallery.length - 4} Foto)`}
                      </span>
                      <span className="material-symbols-outlined text-[18px]">
                        {showAllGallery ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* ========================================== */}
            {/* SECTION 7: RSVP & DIGITAL ENVELOPE         */}
            {/* ========================================== */}
            <section id="rsvp" className="relative w-full bg-surface-container-low px-margin py-space-xl flex flex-col items-center">
              {/* RSVP Form Card */}
              {theme.show_rsvp !== false && isSectionActive('rsvp') && (
                <>
                  <div className="text-center mb-6">
                    <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                      Palapuran Rawuh
                    </span>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                      RSVP &amp; Konfirmasi
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
                      Matur nuwun sanget katur palapuran rawuh panjenengan
                    </p>
                  </div>

                  <div className="w-full bg-surface-container rounded-2xl p-space-md shadow-xl mb-8">
                    <form onSubmit={handleRsvpSubmit} className="space-y-4" id="rsvp-form">
                      <div>
                        <label
                          className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1"
                          htmlFor="rsvp-name"
                        >
                          Nama Lengkap
                        </label>
                        <input
                          id="rsvp-name"
                          type="text"
                          value={rsvpForm.name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                          placeholder="Contoh: Bpk. Bambang Prasetyo"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 placeholder:italic font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label
                          className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1"
                          htmlFor="rsvp-guests"
                        >
                          Jumlah Tamu
                        </label>
                        <input
                          id="rsvp-guests"
                          type="number"
                          min={1}
                          max={50}
                          value={rsvpForm.guests || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setRsvpForm({ ...rsvpForm, guests: isNaN(val) ? 1 : Math.max(1, val) });
                          }}
                          placeholder="Ketik jumlah tamu (contoh: 2)"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <span className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-2">
                          Konfirmasi Kehadiran
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <label
                            className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                              rsvpForm.presence === 'hadir'
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            <input
                              type="radio"
                              name="presence"
                              value="hadir"
                              checked={rsvpForm.presence === 'hadir'}
                              onChange={() => setRsvpForm({ ...rsvpForm, presence: 'hadir' })}
                              className="hidden"
                            />
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span className="font-label-md text-label-md font-bold uppercase tracking-wide">
                              Pasti Hadir
                            </span>
                          </label>

                          <label
                            className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                              rsvpForm.presence === 'berhalangan'
                                ? 'bg-error text-on-error'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            <input
                              type="radio"
                              name="presence"
                              value="berhalangan"
                              checked={rsvpForm.presence === 'berhalangan'}
                              onChange={() => setRsvpForm({ ...rsvpForm, presence: 'berhalangan' })}
                              className="hidden"
                            />
                            <span className="material-symbols-outlined text-base">cancel</span>
                            <span className="font-label-md text-label-md font-bold uppercase tracking-wide">
                              Berhalangan
                            </span>
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-fixed-dim via-primary to-secondary text-on-primary font-label-lg text-label-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">send</span>
                        <span className="tracking-wider">KONFIRMASI KEHADIRAN</span>
                      </button>
                    </form>

                    {rsvpToastVisible && (
                      <div className="mt-3 p-2.5 rounded-lg bg-primary-container text-on-primary-container font-body-md text-body-md text-center">
                        Matur nuwun, konfirmasi rawuh panjenengan sampun katampi!
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tanda Kasih / Digital Envelope */}
              {theme.show_gift !== false && isSectionActive('gift') && (
                <>
                  <div className="text-center mb-6">
                    <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                      Tandha Asih
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Kado Digital &amp; Amplop
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
                      Paring tandha tresna kagem kabingahan mempelai
                    </p>
                  </div>

                  {(data.banks && data.banks.length > 0 ? data.banks : (data.bank_accounts || [])).map((bank, index) => {
                    const isBca = bank.bank_name.toUpperCase().includes('BCA');
                    return (
                      <div
                        key={index}
                        className="w-full bg-gradient-to-br from-surface-container-high to-surface-container rounded-2xl p-space-md shadow-xl mb-4 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`font-title-lg text-title-lg font-bold tracking-wider ${
                              isBca ? 'text-primary' : 'text-secondary'
                            }`}
                          >
                            BANK {bank.bank_name.toUpperCase()}
                          </span>
                          <span className="material-symbols-outlined text-secondary text-2xl">
                            {isBca ? 'contactless' : 'credit_card'}
                          </span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-1">
                          Nomor Rekening {bank.bank_name}
                        </p>
                        <p className="font-headline-md text-headline-md text-primary font-mono tracking-widest">
                          {bank.account_number}
                        </p>
                        <p className="font-body-md text-body-md text-on-surface mt-1 mb-4 break-words [overflow-wrap:anywhere]">
                          a.n {bank.account_holder}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              bank.account_number_raw || bank.account_number,
                              `Nomor Rekening ${bank.bank_name} tersalin di Clipboard!`
                            )
                          }
                          className="w-full py-2.5 px-4 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-bright font-label-md text-label-md font-semibold tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                          <span>Salin No. Rekening</span>
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </section>

            {/* ========================================== */}
            {/* SECTION 8: LIVE WISHES WALL & GUESTBOOK    */}
            {/* ========================================== */}
            {theme.show_wishes !== false && isSectionActive('wishes') && (
              <section className="relative w-full bg-surface px-margin pt-space-xl pb-32 flex flex-col items-center">
                <div className="text-center mb-6">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
                    Buku Pasugatan
                  </span>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Donga &amp; Pangestu
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
                    Serat donga restu kagem kalenggahan temanten kekalih
                  </p>
                </div>

                {/* Wishes Input Form */}
                <div className="w-full bg-surface-container-low rounded-2xl p-space-md shadow-lg mb-6">
                  <form onSubmit={handleWishSubmit} className="space-y-3" id="wishes-form">
                    <input
                      type="text"
                      value={wishForm.name}
                      onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                      placeholder="Asma Panjenengan (Nama Anda)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 placeholder:italic font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <textarea
                      rows={3}
                      value={wishForm.message}
                      onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                      placeholder="Tuliskan donga berkah saha pangestu panjenengan..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 placeholder:italic font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-fixed-dim to-secondary text-on-primary font-label-lg text-label-lg shadow active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">rate_review</span>
                      <span>KIRIM UCAPAN</span>
                    </button>
                  </form>
                </div>

                {/* Live Wishes List */}
                <div className="w-full space-y-3" id="wishes-container">
                  {wishes.map((wish) => (
                    <div key={wish.id} className="bg-surface-container-low rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="font-title-md text-title-md text-primary font-semibold break-words [overflow-wrap:anywhere]">
                            {wish.guest_name}
                          </span>
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-md text-label-md">
                            {wish.attendance === 'attending' ? 'Hadir' : 'Kinasih'}
                          </span>
                        </div>
                        <span className="shrink-0 font-caption text-caption text-on-surface-variant/60">
                          {new Date(wish.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed break-words [overflow-wrap:anywhere]">
                        {wish.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Final Royal Footer Emblem */}
                <div className="mt-12 flex flex-col items-center text-center opacity-80">
                  <span className="material-symbols-outlined text-primary text-2xl mb-2">flare</span>
                  <p className="font-caption text-caption text-on-surface-variant tracking-wider uppercase">
                    Matur Nuwun Sanget
                  </p>
                  <p className="font-title-md text-title-md text-primary italic">
                    {firstPerson.name} &amp; {secondPerson.name}
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant/50 mt-1">
                    {data.hashtag || 'Kraton Ngayogyakarta Hadiningrat'}
                  </p>
                </div>
              </section>
            )}

              </div>
            )}

          </div>
        </main>

        {/* ============================================================ */}
        {/* FLOATING AUDIO CONTROLLER BUBBLE                             */}
        {/* ============================================================ */}
        <FloatingDock isPreview={isPreview}>
          {/* Audio Floating Gamelan Kraton Player (Pojok Kanan Bawah) */}
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
export default Template3Jawa;
