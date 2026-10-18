import React, { useState, useEffect } from 'react';
import type { InvitationProps, WishItem } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';
import { VenueMapEmbed } from '../common/VenueMapEmbed';
import { GalleryLightbox } from '../common/GalleryLightbox';
import { DraggableCoverSheet } from '../common/DraggableCoverSheet';

export const Template4Islami: React.FC<InvitationProps> = ({
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
    renderSwipeHint,
    renderBrandFooter,
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
  const [rsvpPax, setRsvpPax] = useState('1');
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'ragu' | 'tidak'>('hadir');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    const statusMap: Record<'hadir' | 'ragu' | 'tidak', 'attending' | 'pending' | 'declined'> = {
      hadir: 'attending',
      ragu: 'pending',
      tidak: 'declined',
    };
    if (onSubmitRsvp) {
      onSubmitRsvp(rsvpName, statusMap[rsvpStatus], Number(rsvpPax));
    }
    setRsvpSubmitted(true);
    showToast('Konfirmasi kehadiran terkirim', 'success');
  };

  // 6. Wishes State
  const [wishesList, setWishesList] = useState<WishItem[]>(initialWishes);
  const [wishName, setWishName] = useState('');
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
      guest_name: wishName.trim(),
      message: wishMessage.trim(),
      attendance: 'attending',
      created_at: new Date().toISOString(),
    };

    setWishesList((prev) => [newWish, ...prev]);
    if (onSubmitWish) {
      onSubmitWish(wishName.trim(), wishMessage.trim());
    }
    setWishMessage('');
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
    const title = encodeURIComponent(`Walimatul Ursy: ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Akad Nikah & Resepsi Pernikahan ${data.groom.full_name} dan ${data.bride.full_name}.`
    );
    const location = encodeURIComponent(
      data.events[1]?.venue_name || data.events[0]?.venue_name || 'Grand Asrilia Hotel Bandung'
    );
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20250524T010000Z/20250524T070000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const recipientName = data.guest_name || 'Tamu Undangan';

  return (
    <div
      className="theme-islami bg-[#fcf8f8] flex justify-center min-h-screen text-[#1c1b1c] antialiased font-sans w-full no-scrollbar"
      style={{ backgroundColor: '#fcf8f8', color: '#1c1b1c' }}
    >
      <div className="w-full max-w-[430px] min-h-screen bg-surface flex flex-col relative shadow-[0_20px_50px_rgba(94,40,50,0.08)] overflow-x-clip no-scrollbar">
        {/* Sleek Universal Toast Notification */}
        <SleekToast
          show={Boolean(toastMessage)}
          message={toastMessage || ''}
          type={toastType}
          isInsideMockup={isPreview}
        />
        {/* ============================================================ */}
        {/* TOP FIXED APP BAR                                            */}
        {/* ============================================================ */}
        {isOpen && (
          <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-16 px-margin flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary truncate max-w-[190px]">
                  {data.groom.name} &amp; {data.bride.name}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  aria-label="Toggle Musik Latar"
                  onClick={toggleAudio}
                  className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(94,40,50,0.08)] hover:bg-surface-container transition-colors cursor-pointer"
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isPlaying ? 'animate-spin-slow' : ''
                    }`}
                  >
                    {isPlaying ? 'music_note' : 'music_off'}
                  </span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* ============================================================ */}
        {/* MAIN BODY                                                    */}
        {/* ============================================================ */}
        <main className={`flex-1 flex flex-col relative w-full bg-surface ${isOpen ? 'pt-16 pb-6' : 'p-0'}`}>
          <div className={`flex flex-col w-full text-on-surface relative ${
            !isOpen ? (isPreview ? 'h-full overflow-hidden' : 'h-[100dvh] overflow-hidden') : 'min-h-screen overflow-visible'
          }`}>
            {/* -------------------------------------------------------- */}
            {/* SECTION 1: Cover Gate Overlay (Sampul & Opening Gate)   */}
            {/* -------------------------------------------------------- */}
            <DraggableCoverSheet
              isOpen={isOpen}
              isOpening={isOpening}
              onOpenInvitation={handleOpenInvitation}
            >
              <section
                id="sampul"
                className="relative w-full h-full min-h-full flex flex-col justify-between items-center text-center p-5 sm:p-7 overflow-hidden"
              >
                {/* Ambient Islamic Backdrop using Cover Photo if present */}
                {(data.cover_image || data.couple_photo) && (
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img
                      src={data.cover_image || data.couple_photo}
                      alt="Cover Background"
                      className="w-full h-full object-cover opacity-20 filter blur-[0.8px] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#5e2832]/85 via-[#fcf8f8]/85 to-[#fcf8f8]"></div>
                  </div>
                )}

                {/* Top Notch-Safe Header */}
                <div className="relative z-10 pt-10 sm:pt-12 shrink-0 flex flex-col items-center">
                  <div className="px-4 py-1 rounded-full bg-secondary-container/50 text-primary font-label-md text-xs sm:text-sm tracking-widest uppercase shadow-sm mb-1.5 font-medium">
                    Walimatul Ursy
                  </div>
                  <p className="font-headline-sm text-xs sm:text-sm text-primary/80 tracking-widest italic">
                    The Wedding of
                  </p>
                  <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl text-primary font-semibold mt-0.5">
                    {data.groom.name} &amp; {data.bride.name}
                  </h1>
                </div>

                {/* Middle Tier: Elegant Arch Photo Silhouette */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 w-full max-w-[260px]">
                  <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-t-full rounded-b-2xl overflow-hidden bg-gradient-to-b from-secondary-container/40 to-surface-container-low p-2 shadow-lg shadow-primary/10 border border-secondary-container/40">
                    <div className="relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-surface-container-high/60 shadow-inner">
                      <img
                        className="w-full h-full object-cover"
                        alt={`${data.groom.name} & ${data.bride.name}`}
                        src={
                          data.cover_image ||
                          data.couple_photo ||
                          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800'
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Tier: Guest Card & CTA Button Anchored Bottom */}
                <div className="relative z-10 w-full max-w-[340px] pb-6 sm:pb-8 flex flex-col items-center space-y-3 shrink-0 mt-auto">
                  <div className="w-full bg-surface-container-low/90 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 shadow-sm border border-secondary-container/30">
                    <span className="block font-label-sm text-[11px] sm:text-xs text-on-surface-variant uppercase tracking-wider mb-0.5">
                      Kepada Yth. Bapak/Ibu/Saudara/i:
                    </span>
                    <p className="font-headline-sm text-lg sm:text-xl text-primary font-bold line-clamp-1">
                      {recipientName}
                    </p>
                    {(Boolean(data.guest_code) || isPreview) && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono">
                        <span className="material-symbols-outlined text-[13px]">qr_code</span>
                        <span>CHECK-IN PASS: {data.guest_code || 'K8X9P'}</span>
                      </div>
                    )}
                    <span className="block mt-1 font-body-sm text-[10px] sm:text-xs text-on-surface-variant italic">
                      Mohon maaf bila ada kesalahan penulisan nama/gelar
                    </span>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={handleOpenInvitation}
                    className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
                    id="btn-buka-undangan"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      mark_email_read
                    </span>
                    <span>Buka Undangan</span>
                  </button>

                  {/* Interaktif Petunjuk Usap ke Atas */}
                  {renderSwipeHint({ variant: 'gold' })}
                </div>
              </section>
            </DraggableCoverSheet>

            {/* -------------------------------------------------------- */}
            {/* INNER CONTENT (Tersedia di bawah cover & interaktif)     */}
            {/* -------------------------------------------------------- */}
            <div className={`flex flex-col w-full ${!isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : 'animate-page-enter'}`}>
                {/* ---------------------------------------------------- */}
                {/* SECTION 2: Hero & Countdown (Salam & Hitung Mundur)  */}
                {/* ---------------------------------------------------- */}
                <section
                  className="px-margin py-space-xl flex flex-col items-center text-center"
                  id="salam"
                >
                  {/* Moroccan Dome Framed Hero Couple Portrait */}
                  <div className="w-full max-w-[340px] rounded-t-full rounded-b-2xl bg-surface-container-lowest p-3 shadow-xl shadow-primary/5 flex flex-col items-center border border-secondary-container/30 mb-8 reveal-scale">
                    <div className="relative w-full rounded-t-full rounded-b-xl overflow-hidden bg-gradient-to-b from-secondary-container/30 to-surface-container-low p-2">
                      <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-lg overflow-hidden bg-surface-container-high/60 shadow-inner flex items-center justify-center">
                        <img
                          className="w-full h-full object-cover"
                          alt={`${data.groom.name} & ${data.bride.name}`}
                          src={
                            data.couple_photo ||
                            data.cover_image ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9L8ISRUM7mLqvnPG1IUud4itXFzYibGb-gsVdr2o8XOghzC2pdxs3o4Y2QQOZT5FDELCcHb1hQXs0m_y-Ug4bTBYR_zj1eXdzZ_EYzKQ5aJLGJsYRXpgssNhtGWT6egpeoVh-gBwyzuhPmyDGWnAET59APKBr1X9uYdaxY7TpdT6rg3zm48_6s4Va2AuaAL7-qkj_lnVIPqmYeb4KJVg6qBDlsZ1TKkNe3MGDcM_G9le8id4Vh3few'
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-3 inset-x-3 text-center">
                          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold px-3.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-xs">
                            {data.hashtag || 'Walimatul Ursy'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calligraphy Banner */}
                  <div className="mb-4">
                    <p
                      className="font-serif text-2xl tracking-widest text-primary font-medium"
                      dir="rtl"
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>

                  {/* Islamic Warm Greeting */}
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
                    Assalamu’alaikum Warahmatullahi Wabarakatuh
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-[340px] mb-6">
                    Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                    Dengan memohon rahmat dan ridho-Nya, kami mengundang Anda untuk
                    merayakan momen suci kami.
                  </p>

                  {/* Dome Shaped Quranic Verse Card */}
                  <div className="w-full rounded-t-full rounded-b-2xl bg-surface-container-lowest p-6 shadow-md shadow-primary/5 mb-8 flex flex-col items-center border border-secondary-container/20 reveal-scale delay-100">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined text-[22px]">
                        auto_stories
                      </span>
                    </div>
                    <p
                      className="font-serif text-lg leading-relaxed text-primary mb-4"
                      dir="rtl"
                    >
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
                      لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
                      إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant italic mb-2">
                      "{data.quote}"
                    </p>
                    <span className="font-label-sm text-label-sm text-primary font-semibold tracking-wider">
                      ({data.quote_source || 'QS. Ar-Rum: 21'})
                    </span>
                  </div>

                  {/* Wedding Date Header */}
                  <div className="mb-4">
                    <span className="font-label-md text-label-md text-secondary tracking-widest uppercase font-semibold">
                      Menuju Hari Bahagia
                    </span>
                    <h3 className="font-headline-md text-headline-md text-primary mt-1">
                      {data.wedding_date_display}
                    </h3>
                  </div>

                  {/* 4-Column Rose-Gold Countdown Grid */}
                  <div
                    className="grid grid-cols-4 gap-2 w-full max-w-[360px] reveal delay-200"
                    id="countdown-timer"
                  >
                    <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
                      <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
                        {String(countdown.days).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
                        Hari
                      </span>
                    </div>
                    <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
                      <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
                        {String(countdown.hours).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
                        Jam
                      </span>
                    </div>
                    <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
                      <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
                        {String(countdown.minutes).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
                        Menit
                      </span>
                    </div>
                    <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
                      <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
                        {String(countdown.seconds).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
                        Detik
                      </span>
                    </div>
                  </div>
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 3: Couple Profile (Profil Mempelai)         */}
                {/* ---------------------------------------------------- */}
                <section
                  className="px-margin py-space-xl flex flex-col items-center"
                  id="mempelai"
                >
                  <div className="text-center mb-8">
                    <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
                      Pasangan Pengantin
                    </span>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      Mempelai Pria &amp; Wanita
                    </h2>
                    <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
                  </div>

                  {/* Groom Card */}
                  <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-5 shadow-lg shadow-primary/5 flex flex-col items-center text-center mb-6 border border-secondary-container/20 reveal-left delay-100">
                    <div className="w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden bg-surface-container mb-4 shadow-sm">
                      <img
                        alt={data.groom.full_name}
                        className="w-full h-full object-cover object-top"
                        src={
                          data.groom.photo_url ||
                          (data.groom as any).photo ||
                          data.couple_photo ||
                          data.cover_image ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                        }
                      />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
                      {data.groom.full_name}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-4">
                      {data.groom.child_order} <br />
                      <span className="font-semibold text-on-surface">
                        {data.groom.parent_father}
                      </span>{' '}
                      &amp; <br />
                      <span className="font-semibold text-on-surface">
                        {data.groom.parent_mother}
                      </span>
                    </p>
                    {data.groom.instagram && (
                      <a
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm"
                        href={`https://instagram.com/${data.groom.instagram.replace(
                          '@',
                          ''
                        )}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          photo_camera
                        </span>
                        <span>{data.groom.instagram}</span>
                      </a>
                    )}
                  </div>

                  {/* Elegant Floral Ampersand Divider */}
                  <div className="my-2 flex items-center justify-center reveal-scale delay-200">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center shadow-sm">
                      <span className="font-headline-md text-headline-md text-primary font-serif italic">
                        &amp;
                      </span>
                    </div>
                  </div>

                  {/* Bride Card */}
                  <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-5 shadow-lg shadow-primary/5 flex flex-col items-center text-center mt-4 border border-secondary-container/20 reveal-right delay-300">
                    <div className="w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden bg-surface-container mb-4 shadow-sm">
                      <img
                        alt={data.bride.full_name}
                        className="w-full h-full object-cover object-top"
                        src={
                          data.bride.photo_url ||
                          (data.bride as any).photo ||
                          data.couple_photo ||
                          data.cover_image ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                        }
                      />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
                      {data.bride.full_name}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-4">
                      {data.bride.child_order} <br />
                      <span className="font-semibold text-on-surface">
                        {data.bride.parent_father}
                      </span>{' '}
                      &amp; <br />
                      <span className="font-semibold text-on-surface">
                        {data.bride.parent_mother}
                      </span>
                    </p>
                    {data.bride.instagram && (
                      <a
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm"
                        href={`https://instagram.com/${data.bride.instagram.replace(
                          '@',
                          ''
                        )}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          photo_camera
                        </span>
                        <span>{data.bride.instagram}</span>
                      </a>
                    )}
                  </div>
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 4: Love Story Timeline (Our Halal Journey)   */}
                {/* ---------------------------------------------------- */}
                {theme?.show_love_story !== false && data.love_story && (
                  <section className="px-margin py-space-xl flex flex-col">
                    <div className="text-center mb-8">
                      <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
                        Kisah Perjalanan
                      </span>
                      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                        Our Halal Journey
                      </h2>
                      <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-secondary-container">
                      {data.love_story.map((story, idx) => (
                        <div key={idx} className="relative flex flex-col">
                          <div className="absolute -left-[29px] top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                            <span className="material-symbols-outlined text-[13px]">
                              {story.icon || 'favorite'}
                            </span>
                          </div>
                          <div className="rounded-t-2xl rounded-b-xl bg-surface-container-lowest p-4 shadow-sm border border-secondary-container/20">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">
                                {story.title}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-[11px] font-medium">
                                {story.year}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {story.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ---------------------------------------------------- */}
                {/* SECTION 5: Event Details & Venue (Agenda Pernikahan) */}
                {/* ---------------------------------------------------- */}
                <section
                  className="px-margin py-space-xl flex flex-col items-center"
                  id="acara"
                >
                  <div className="text-center mb-8">
                    <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
                      Agenda Pernikahan
                    </span>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      Waktu &amp; Tempat
                    </h2>
                    <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
                  </div>

                  {/* Akad Nikah Card */}
                  {data.events[0] && (
                    <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-6 shadow-md shadow-primary/5 mb-6 text-center flex flex-col items-center border border-secondary-container/20">
                      <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
                        <span className="material-symbols-outlined text-[24px]">
                          {data.events[0].icon || 'verified'}
                        </span>
                      </div>
                      {data.events[0].badge && (
                        <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-primary font-label-sm text-label-sm uppercase tracking-wider mb-2 font-semibold">
                          {data.events[0].badge}
                        </span>
                      )}
                      <h3 className="font-headline-md text-headline-md text-primary font-bold mb-3 break-words [overflow-wrap:anywhere] max-w-full">
                        {data.events[0].name}
                      </h3>
                      <div className="space-y-2 mb-4 font-body-md text-body-md text-on-surface w-full">
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                            calendar_today
                          </span>
                          <span className="break-words [overflow-wrap:anywhere]">{data.events[0].date}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                            schedule
                          </span>
                          <span className="break-words [overflow-wrap:anywhere]">{data.events[0].time}</span>
                        </div>
                        <div className="flex items-start justify-center gap-2 max-w-[280px] mx-auto text-on-surface-variant text-center">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                            location_on
                          </span>
                          <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                            <strong className="block font-semibold text-primary">{data.events[0].venue_name}</strong>
                            <span>{data.events[0].venue_address}</span>
                          </span>
                        </div>
                      </div>

                      {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
                      {(data.countdown_target !== 'resepsi' || !data.events[1]) && (
                        <div className="w-full my-4">
                          <VenueMapEmbed
                            venueName={data.events[0].venue_name || 'Lokasi Akad Nikah'}
                            venueAddress={data.events[0].venue_address}
                            mapsUrl={data.events[0].maps_url}
                            heightClass="h-44"
                            isPreview={isPreview}
                          />
                        </div>
                      )}

                      {/* Action Buttons (Selalu tampil di setiap card acara) */}
                      <div className="w-full flex flex-col gap-2.5">
                        <a
                          className="w-full py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
                          href={data.events[0].maps_url || 'https://maps.google.com'}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            map
                          </span>
                          <span>Buka Google Maps</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Resepsi Card */}
                  {data.events[1] && (
                    <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-6 shadow-md shadow-primary/5 text-center flex flex-col items-center border border-secondary-container/20 overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
                        <span className="material-symbols-outlined text-[24px]">
                          {data.events[1].icon || 'diversity_3'}
                        </span>
                      </div>
                      {data.events[1].badge && (
                        <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-primary font-label-sm text-label-sm uppercase tracking-wider mb-2 font-semibold">
                          {data.events[1].badge}
                        </span>
                      )}
                      <h3 className="font-headline-md text-headline-md text-primary font-bold mb-3 break-words [overflow-wrap:anywhere] max-w-full">
                        {data.events[1].name}
                      </h3>
                      <div className="space-y-2 mb-5 font-body-md text-body-md text-on-surface w-full">
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                            calendar_today
                          </span>
                          <span className="break-words [overflow-wrap:anywhere]">{data.events[1].date}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                            schedule
                          </span>
                          <span className="break-words [overflow-wrap:anywhere]">{data.events[1].time}</span>
                        </div>
                        <div className="flex items-start justify-center gap-2 max-w-[280px] mx-auto text-on-surface-variant text-center">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                            apartment
                          </span>
                          <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                            <strong className="block font-semibold text-primary">{data.events[1].venue_name}</strong>
                            <span>{data.events[1].venue_address}</span>
                          </span>
                        </div>
                      </div>

                      {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
                      {data.countdown_target === 'resepsi' && (
                        <div className="w-full my-4">
                          <VenueMapEmbed
                            venueName={data.events[1]?.venue_name || 'Lokasi Resepsi'}
                            venueAddress={data.events[1]?.venue_address}
                            mapsUrl={data.events[1]?.maps_url}
                            heightClass="h-44"
                            isPreview={isPreview}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="w-full flex flex-col gap-2.5">
                        <a
                          className="w-full py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
                          href={data.events[1].maps_url || 'https://maps.google.com'}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            map
                          </span>
                          <span>Buka Google Maps</span>
                        </a>
                        <button
                          className="w-full py-3 px-4 rounded-full bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer"
                          id="btn-calendar"
                          onClick={handleAddToCalendar}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            event_available
                          </span>
                          <span>Simpan ke Kalender</span>
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 6: Photo Gallery (Galeri Bahagia)            */}
                {/* ---------------------------------------------------- */}
                {theme?.show_gallery !== false && data.gallery && (
                  <section className="px-margin py-space-xl flex flex-col" id="galeri">
                    <div className="text-center mb-8">
                      <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
                        Dokumentasi
                      </span>
                      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                        Moment Bahagia
                      </h2>
                      <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Mosaic Photo Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {/* Photo 1: Arch Top */}
                      {data.gallery[0] && (
                        <div
                          onClick={() => setLightboxImg(data.gallery[0])}
                          className="rounded-t-full rounded-b-xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
                        >
                          <img
                            alt="Foto Galeri 1"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={data.gallery[0]}
                          />
                        </div>
                      )}

                      {/* Photo 2: Stage Decor */}
                      {data.gallery[1] && (
                        <div
                          onClick={() => setLightboxImg(data.gallery[1])}
                          className="rounded-2xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
                        >
                          <img
                            alt="Foto Galeri 2"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={data.gallery[1]}
                          />
                        </div>
                      )}

                      {/* Photo 3: Ring Shot */}
                      {data.gallery[2] && (
                        <div
                          onClick={() => setLightboxImg(data.gallery[2])}
                          className="rounded-2xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
                        >
                          <img
                            alt="Foto Galeri 3"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={data.gallery[2]}
                          />
                        </div>
                      )}

                      {/* Photo 4: Groom Arch Top */}
                      {data.gallery[3] && (
                        <div
                          onClick={() => setLightboxImg(data.gallery[3])}
                          className="rounded-t-full rounded-b-xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
                        >
                          <img
                            alt="Foto Galeri 4"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={data.gallery[3]}
                          />
                        </div>
                      )}

                      {/* Photo 5: Full Width Couple Portrait (spanning 2 cols) */}
                      {data.gallery[4] && (
                        <div
                          onClick={() => setLightboxImg(data.gallery[4])}
                          className="col-span-2 rounded-2xl overflow-hidden bg-surface-container aspect-[16/9] shadow-sm cursor-pointer group hover:opacity-95 transition-all"
                        >
                          <img
                            alt="Foto Galeri 5"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={data.gallery[4]}
                          />
                        </div>
                      )}

                      {/* Sisa Foto Galeri (Muncul saat tombol Lihat Selengkapnya diklik) */}
                      {showAllGallery && data.gallery.length > 5 &&
                        data.gallery.slice(5).map((imgUrl, idx) => (
                          <div
                            key={idx + 5}
                            onClick={() => setLightboxImg(imgUrl)}
                            className="rounded-2xl overflow-hidden bg-surface-container aspect-[3/4] shadow-sm cursor-pointer group hover:opacity-95 transition-all animate-in fade-in duration-300"
                          >
                            <img
                              alt={`Foto Galeri ${idx + 6}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              src={imgUrl}
                            />
                          </div>
                        ))}
                    </div>

                    {/* Tombol Lihat Selengkapnya jika foto > 5 */}
                    {data.gallery.length > 5 && (
                      <div className="text-center mt-5 w-full">
                        <button
                          type="button"
                          onClick={() => setShowAllGallery((prev) => !prev)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-secondary-dim transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <span>
                            {showAllGallery
                              ? 'Tutup Galeri'
                              : `Lihat Selengkapnya (${data.gallery.length - 5} Foto Lainnya)`}
                          </span>
                          <span className="material-symbols-outlined text-[18px]">
                            {showAllGallery ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {/* ---------------------------------------------------- */}
                {/* SECTION 7: RSVP & Digital Envelope                   */}
                {/* ---------------------------------------------------- */}
                <section
                  className="px-margin py-space-xl flex flex-col items-center"
                  id="rsvp-amplop"
                >
                  <div className="text-center mb-8">
                    <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
                      Kehadiran &amp; Kado
                    </span>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      RSVP &amp; Amplop Digital
                    </h2>
                    <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
                  </div>

                  {/* RSVP Form Card */}
                  {theme?.show_rsvp !== false && (
                    <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-md shadow-primary/5 mb-8 border border-secondary-container/20">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">
                            contact_mail
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                          Konfirmasi Kehadiran
                        </h3>
                      </div>

                      {rsvpSubmitted ? (
                        <div className="p-4 rounded-xl bg-secondary-container/40 text-center">
                          <span className="material-symbols-outlined text-primary text-3xl mb-1">
                            check_circle
                          </span>
                          <p className="font-bold text-primary text-sm">
                            Konfirmasi Berhasil Terkirim!
                          </p>
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            Jazakumullahu khairan katsiran atas konfirmasi kehadiran Anda.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleRsvpSubmit} className="space-y-4" id="rsvp-form">
                          <div>
                            <label
                              className="block font-label-md text-label-md text-on-surface mb-1"
                              htmlFor="rsvp-nama"
                            >
                              Nama Lengkap
                            </label>
                            <input
                              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                              id="rsvp-nama"
                              placeholder="Masukkan nama Anda"
                              required
                              value={rsvpName}
                              onChange={(e) => setRsvpName(e.target.value)}
                              type="text"
                            />
                          </div>

                          <div>
                            <label
                              className="block font-label-md text-label-md text-on-surface mb-1"
                              htmlFor="rsvp-pax"
                            >
                              Jumlah Tamu
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                              id="rsvp-pax"
                              value={rsvpPax}
                              onChange={(e) => setRsvpPax(e.target.value)}
                              placeholder="Ketik jumlah tamu (contoh: 2)"
                              required
                            />
                          </div>

                          <div>
                            <span className="block font-label-md text-label-md text-on-surface mb-2">
                              Status Kehadiran
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              <label className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="kehadiran"
                                  value="hadir"
                                  checked={rsvpStatus === 'hadir'}
                                  onChange={() => setRsvpStatus('hadir')}
                                  className="sr-only"
                                />
                                <div
                                  className={`text-center py-2 px-1 rounded-xl text-label-md transition-all shadow-sm ${
                                    rsvpStatus === 'hadir'
                                      ? 'bg-primary text-on-primary font-semibold'
                                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                                  }`}
                                >
                                  Hadir
                                </div>
                              </label>

                              <label className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="kehadiran"
                                  value="ragu"
                                  checked={rsvpStatus === 'ragu'}
                                  onChange={() => setRsvpStatus('ragu')}
                                  className="sr-only"
                                />
                                <div
                                  className={`text-center py-2 px-1 rounded-xl text-label-md transition-all shadow-sm ${
                                    rsvpStatus === 'ragu'
                                      ? 'bg-primary text-on-primary font-semibold'
                                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                                  }`}
                                >
                                  Ragu-ragu
                                </div>
                              </label>

                              <label className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="kehadiran"
                                  value="tidak"
                                  checked={rsvpStatus === 'tidak'}
                                  onChange={() => setRsvpStatus('tidak')}
                                  className="sr-only"
                                />
                                <div
                                  className={`text-center py-2 px-1 rounded-xl text-label-md transition-all shadow-sm ${
                                    rsvpStatus === 'tidak'
                                      ? 'bg-primary text-on-primary font-semibold'
                                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                                  }`}
                                >
                                  Tidak Hadir
                                </div>
                              </label>
                            </div>
                          </div>

                          <button
                            className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
                            type="submit"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              send
                            </span>
                            <span>Kirim Konfirmasi</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Digital Envelope (Amplop Digital) Cards */}
                  {theme?.show_gift !== false && (
                    <div className="w-full space-y-4">
                      <div className="text-center mb-2">
                        <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">
                          Tanda Kasih Digital
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[300px] mx-auto mt-1">
                          Doa restu Anda merupakan karunia yang paling berarti bagi kami. Namun
                          jika memberi adalah ungkapan kasih, Anda dapat memberi kado secara
                          cashless.
                        </p>
                      </div>

                      {/* Bank Accounts */}
                      {((data.banks && data.banks.length > 0) ? data.banks : ((data as any).bank_accounts || []))?.map((acc: any, index: number) => (
                        <div
                          key={index}
                          className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col border border-secondary-container/20"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-label-lg text-label-lg text-primary font-bold tracking-widest">
                              {acc.bank_name}
                            </span>
                            <span className="material-symbols-outlined text-secondary">
                              credit_card
                            </span>
                          </div>
                          <p className="font-headline-sm text-headline-sm text-on-surface font-mono tracking-wider font-semibold mb-1 break-words [overflow-wrap:anywhere]">
                            {acc.account_number}
                          </p>
                          <span className="font-body-sm text-body-sm text-on-surface-variant mb-4 break-words [overflow-wrap:anywhere]">
                            a.n {acc.account_holder}
                          </span>
                          <button
                            className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer"
                            onClick={() =>
                              handleCopy(acc.account_number_raw || acc.account_number, `bank-${index}`)
                            }
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {copiedKey === `bank-${index}` ? 'check' : 'content_copy'}
                            </span>
                            <span>
                              {copiedKey === `bank-${index}`
                                ? 'Tersalin!'
                                : 'Salin Nomor Rekening'}
                            </span>
                          </button>
                        </div>
                      ))}

                      {/* Physical Gift Address Card */}
                      {data.gift_address && (
                        <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col border border-secondary-container/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-label-lg text-label-lg text-primary font-bold">
                              Kirim Kado Fisik
                            </span>
                            <span className="material-symbols-outlined text-secondary">
                              inventory_2
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface mb-3 break-words [overflow-wrap:anywhere]">
                            {data.gift_address}
                          </p>
                          <button
                            className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer"
                            onClick={() => handleCopy(data.gift_address!, 'address')}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {copiedKey === 'address' ? 'check' : 'content_copy'}
                            </span>
                            <span>
                              {copiedKey === 'address'
                                ? 'Tersalin!'
                                : 'Salin Alamat Lengkap'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* ---------------------------------------------------- */}
                {/* SECTION 8: Live Wishes Wall & Closing                */}
                {/* ---------------------------------------------------- */}
                <section
                  className="px-margin pt-space-xl pb-2 flex flex-col items-center"
                  id="doa"
                >
                  <div className="text-center mb-8">
                    <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
                      Buku Tamu
                    </span>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      Doa &amp; Ucapan
                    </h2>
                    <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
                  </div>

                  {/* Wishes Form */}
                  {theme?.show_wishes !== false && (
                    <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-md shadow-primary/5 mb-6 border border-secondary-container/20">
                      <form onSubmit={handleWishSubmit} className="space-y-4" id="form-doa">
                        <div>
                          <label
                            className="block font-label-md text-label-md text-on-surface mb-1"
                            htmlFor="nama-pengirim"
                          >
                            Nama Anda
                          </label>
                          <input
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                            id="nama-pengirim"
                            placeholder="Contoh: Sahabat Kuliah ITB"
                            required
                            value={wishName}
                            onChange={(e) => setWishName(e.target.value)}
                            type="text"
                          />
                        </div>

                        <div>
                          <label
                            className="block font-label-md text-label-md text-on-surface mb-1"
                            htmlFor="teks-doa"
                          >
                            Ucapan &amp; Doa Restu
                          </label>
                          <textarea
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors border border-transparent focus:border-secondary"
                            id="teks-doa"
                            placeholder="Tuliskan doa kebaikan untuk kedua mempelai..."
                            required
                            rows={3}
                            value={wishMessage}
                            onChange={(e) => setWishMessage(e.target.value)}
                          ></textarea>
                        </div>

                        <button
                          className="w-full py-3 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-container transition-colors cursor-pointer"
                          type="submit"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            favorite
                          </span>
                          <span>Kirim Doa Restu</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Guestbook Wishes Feed */}
                  <div
                    className="w-full space-y-3 mb-10 max-h-[380px] overflow-y-auto pr-1"
                    id="wishes-feed"
                  >
                    {wishesList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-secondary-container/10"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-label-md text-label-md text-primary font-bold min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                            {item.guest_name}
                          </span>
                          <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface leading-relaxed break-words [overflow-wrap:anywhere]">
                          "{item.message}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Heartfelt Family Closing Statement */}
                  <div className="w-full text-center p-6 rounded-t-full rounded-b-2xl bg-surface-container-lowest shadow-md shadow-primary/5 mb-4 border border-secondary-container/20">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mx-auto mb-3">
                      <span className="material-symbols-outlined text-[20px]">
                        handshake
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                      Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga,
                      apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa
                      restu kepada kedua mempelai.
                    </p>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                      Wassalamu’alaikum Warahmatullahi Wabarakatuh
                    </h3>
                    <p className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-widest mt-2">
                      Kami Yang Berbahagia:
                    </p>
                    <p className="font-headline-sm text-headline-sm text-primary font-semibold mt-1">
                      Keluarga Besar {(data.groom.parent_father || '').replace('Bpk. ', '').replace('Ir. ', '')}{' '}
                      <br />&amp; Keluarga Besar {(data.bride.parent_father || '').replace('Bpk. ', '').replace('Dr. H. ', '')}
                    </p>
                  </div>
                </section>

                {/* Dynamic mbell Invitations Brand Signature Footer */}
                {renderBrandFooter({ themeId: 'islami' })}
              </div>
          </div>
        </main>

        {/* ============================================================ */}
        {/* FLOATING AUDIO CONTROLLER BUBBLE                             */}
        {/* ============================================================ */}
        <FloatingDock isPreview={isPreview}>
          {/* Floating Audio Play/Off Bubble (Pojok Kanan Bawah) */}
          {isOpen && (
            <div className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 pointer-events-auto`}>
              <button
                type="button"
                onClick={toggleAudio}
                aria-label="Toggle Musik Latar"
                className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-secondary-container/40 flex items-center justify-center text-primary shadow-[0_4px_16px_rgba(94,40,50,0.18)] transition-transform active:scale-95 cursor-pointer hover:bg-surface-container"
                title="Putar / Hentikan Musik"
              >
                <span
                  className={`material-symbols-outlined text-[20px] text-primary ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                >
                  {isPlaying ? 'music_note' : 'music_off'}
                </span>
              </button>
            </div>
          )}
        </FloatingDock>

        {/* ============================================================ */}
        {/* LIGHTBOX PHOTO MODAL (Terkunci sejajar layar di HP & Web PC)  */}
        {/* ============================================================ */}
        <GalleryLightbox
          isOpen={Boolean(lightboxImg)}
          imageUrl={lightboxImg}
          onClose={() => setLightboxImg(null)}
          isPreview={isPreview}
        />
      </div>
    </div>
  );
};

export default Template4Islami;
