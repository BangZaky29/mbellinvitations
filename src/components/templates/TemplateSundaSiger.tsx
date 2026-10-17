import React, { useState } from 'react';
import type { InvitationProps } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';
import { VenueMapEmbed } from '../common/VenueMapEmbed';
import { GalleryLightbox } from '../common/GalleryLightbox';

// Drop-in motion shim to eliminate bulky external dependencies and guarantee seamless Vite builds
const motion = {
  div: React.forwardRef<HTMLDivElement, any>(({ children, className = '', animate, initial, whileInView, transition, style, ...props }, ref) => (
    <div ref={ref} className={className} style={style} {...props}>{children}</div>
  )),
  span: React.forwardRef<HTMLSpanElement, any>(({ children, className = '', animate, initial, whileInView, transition, style, ...props }, ref) => (
    <span ref={ref} className={className} style={style} {...props}>{children}</span>
  )),
  section: React.forwardRef<HTMLElement, any>(({ children, className = '', animate, initial, whileInView, transition, style, ...props }, ref) => (
    <section ref={ref} className={className} style={style} {...props}>{children}</section>
  )),
};

// Component: Subtle Floating Jasmine Petals in the Background
const FallingPetals: React.FC = () => {
  const petals = [
    { id: 1, left: '8%', delay: '0s', duration: '10s', size: 16 },
    { id: 2, left: '24%', delay: '2.5s', duration: '12s', size: 14 },
    { id: 3, left: '42%', delay: '5s', duration: '11s', size: 18 },
    { id: 4, left: '60%', delay: '1s', duration: '13s', size: 15 },
    { id: 5, left: '78%', delay: '3.5s', duration: '9.5s', size: 16 },
    { id: 6, left: '92%', delay: '6s', duration: '14s', size: 13 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none">
      <style>{`
        @keyframes floatSiger {
          0%, 100% { transform: translateY(-5px) rotate(-0.5deg); }
          50% { transform: translateY(5px) rotate(0.5deg); }
        }
        @keyframes fallPetal {
          0% { transform: translateY(-40px) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.45; }
          50% { transform: translateY(50vh) translateX(18px) rotate(180deg); opacity: 0.45; }
          80% { opacity: 0.35; }
          100% { transform: translateY(105vh) translateX(-18px) rotate(360deg); opacity: 0; }
        }
        .animate-float-siger {
          animation: floatSiger 4.5s ease-in-out infinite;
        }
        .animate-fall-petal {
          animation: fallPetal linear infinite;
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.left,
            position: 'absolute',
            top: 0,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
          className="animate-fall-petal text-[#c5a059]/40"
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13 7 18 11 22 12C18 13 13 17 12 22C11 17 6 13 2 12C6 11 11 7 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Component: Royal Siger Crown SVG (Sundanese Bridal Crown)
const SigerCrownSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg className={className} viewBox="0 0 100 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 2 C53 14 62 20 70 12 C74 24 85 24 94 18 C92 32 78 38 50 38 C22 38 8 32 6 18 C15 24 26 24 30 12 C38 20 47 14 50 2 Z"
    />
    <circle cx="50" cy="5" r="3" fill="#775a19" />
    <circle cx="70" cy="15" r="2.5" fill="#775a19" />
    <circle cx="30" cy="15" r="2.5" fill="#775a19" />
    <circle cx="94" cy="20" r="2" fill="#775a19" />
    <circle cx="6" cy="20" r="2" fill="#775a19" />
  </svg>
);

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

  const { days, hours, minutes, seconds } = countdown;
  const [activeRsvpTab, setActiveRsvpTab] = useState<'hadir' | 'ragu' | 'tidak'>('hadir');

  // Handle Calendar Save
  const handleSaveToCalendar = () => {
    const title = encodeURIComponent(`The Wedding of ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Pernikahan Adat Sunda Siger ${data.groom.full_name} & ${data.bride.full_name}. Runtut Raut Sauyunan.`
    );
    const location = encodeURIComponent(
      data.events[1]?.venue_name || data.events[0]?.venue_name || 'Bandung, Jawa Barat'
    );
    const dateFormatted = data.wedding_date_iso
      ? data.wedding_date_iso.replace(/[-:]/g, '').split('+')[0]
      : '20261024T080000';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}/${dateFormatted}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Membuka Google Calendar', 'info');
  };

  const recipientName = data.guest_name || 'Bapak/Ibu/Saudara/i';
  const coupleOrderTitle = `${firstPerson.name} & ${secondPerson.name}`;
  const weddingDateStr = data.wedding_date_display || 'Sabtu, 24 Oktober 2026';

  return (
    <div
      className="theme-sunda bg-[#fbf9f6] text-[#1b1c1a] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-[#feaeb9] selection:text-[#7a3f49] w-full no-scrollbar"
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
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#fbf9f6] shadow-[0_20px_50px_rgba(119,90,25,0.08)] overflow-x-clip no-scrollbar">
        <main className="flex-1 flex flex-col w-full bg-[#fbf9f6] relative">
          <div className="flex flex-col w-full text-[#1b1c1a]">

            {/* ============================================================ */}
            {/* 1. COVER GATE OVERLAY SECTION                                */}
            {/* ============================================================ */}
            {!isOpen && (
              <section
                id="sampul"
                className={`w-full relative flex flex-col items-center justify-center px-5 pt-8 pb-14 text-center bg-gradient-to-b from-[#fbf9f6] via-[#f5f3f0] to-[#eae8e5] transition-all duration-700 min-h-[100dvh] z-30 ${isOpening ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100'
                  }`}
              >
                {/* Floating Siger Royal Motif with Motion Parallax */}
                <div className="w-24 h-10 mb-3 flex items-center justify-center text-[#c5a059] animate-float-siger">
                  <SigerCrownSvg />
                </div>

                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-[11px] font-semibold tracking-[0.25em] text-[#775a19] uppercase mb-2"
                >
                  The Wedding Invitation
                </motion.span>

                {/* Framed Arch Couple Image */}
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="relative w-64 h-80 rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl p-1.5 bg-gradient-to-b from-[#c5a059]/40 via-[#e4e2df] to-[#c5a059]/20 my-4"
                >
                  <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      src={
                        data.couple_photo ||
                        data.cover_image ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMQzGjURPVSsGCRPPE-zHZ7bgKvtteTLFR6OM9LyCulQKLncbS8LirSkj3E_Ec1t0kJzOapSpd3NsulL3IStOlVI1tPnPGmcvYQoygMvF5gCkYEGhruz0lao1Cvo72k1VcpUgtv_jCWbRtWdBfhARMKHCGycQV3bau425N0jO8a6JVq5ufjrf_Pobe0giwVbiqnYhx5nY-LXDs9HaYTaUkUyKwqa5yxlJAfvBxubqUxz0wQHVGIl6mQ'
                      }
                      alt={coupleOrderTitle}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8a4c56]/35 via-transparent to-transparent" />
                  </div>
                </motion.div>

                <h1 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif mt-2 font-normal">
                  {firstPerson.name}{' '}
                  <span className="text-[#775a19] text-3xl font-serif italic">&amp;</span>{' '}
                  {secondPerson.name}
                </h1>
                <p className="text-xs text-[#4e4639] tracking-wider uppercase mt-1">
                  {weddingDateStr} • Bandung
                </p>

                {/* Guest Box */}
                <div className="w-full max-w-[320px] mt-6 p-4 rounded-2xl bg-white/85 backdrop-blur-md shadow-lg text-center flex flex-col items-center border border-[#d1c5b4]/40">
                  <span className="text-[10px] text-[#735855] font-semibold uppercase tracking-widest mb-1">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </span>
                  <h3 className="text-[17px] text-[#1b1c1a] font-bold tracking-tight">
                    {recipientName}
                  </h3>
                  <p className="text-[11px] text-[#4e4639] mt-1 leading-tight">
                    Mohon maaf bila ada kesalahan penulisan nama atau gelar
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenInvitation}
                  className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#775a19] text-white font-medium text-xs shadow-xl active:scale-95 hover:bg-[#5d4201] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">drafts</span>
                  <span>Buka Undangan</span>
                  <span className="material-symbols-outlined text-[16px] animate-bounce">
                    arrow_downward
                  </span>
                </button>
              </section>
            )}

            {/* ============================================================ */}
            {/* 2. HERO SCRIPTURE & LIVE COUNTDOWN                           */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('cover') && (
              <motion.section
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 flex flex-col items-center text-center bg-white relative overflow-hidden border-b border-[#efeeeb]"
                id="doaMempelai"
              >
                {/* Jasmine Garland SVG Accent */}
                <div className="w-48 h-6 text-[#c5a059] opacity-70 mb-3">
                  <svg className="w-full h-full fill-none stroke-current stroke-1" viewBox="0 0 200 24">
                    <path d="M10,12 Q50,0 100,12 T190,12" strokeLinecap="round" />
                    <circle cx="60" cy="7" fill="#C5A059" r="3" />
                    <circle cx="100" cy="12" fill="#C5A059" r="4" />
                    <circle cx="140" cy="7" fill="#C5A059" r="3" />
                  </svg>
                </div>

                {/* Sundanese Cultural Proverb */}
                <span className="text-xl sm:text-2xl text-[#8a4c56] font-serif italic mb-2">
                  “Runtut Raut Sauyunan”
                </span>

                {/* Quranic / Scripture Verse */}
                <p data-anim="quote" className="text-sm text-[#1b1c1a] max-w-sm italic leading-relaxed">
                  “{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}”
                </p>
                <span className="text-[11px] font-semibold text-[#775a19] tracking-widest mt-2 uppercase">
                  {data.quote_source || '(QS. Ar-Rum: 21)'}
                </span>

                <div className="w-12 h-0.5 bg-[#c5a059]/40 my-6 rounded-full" />

                {/* Countdown Card */}
                <div className="w-full max-w-sm rounded-3xl p-5 bg-[#f5f3f0] shadow-md flex flex-col items-center border border-[#d1c5b4]/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px]">
                      hourglass_top
                    </span>
                    <span className="text-[11px] font-semibold text-[#4e4639] uppercase tracking-widest">
                      Menghitung Hari Bahagia
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 w-full text-center">
                    <div className="bg-white rounded-2xl py-3 px-1 shadow-xs flex flex-col items-center border border-[#efeeeb]">
                      <span className="text-xl sm:text-2xl text-[#775a19] font-bold font-serif">
                        {days}
                      </span>
                      <span className="text-[10px] text-[#735855] font-semibold uppercase mt-1">
                        Hari
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl py-3 px-1 shadow-xs flex flex-col items-center border border-[#efeeeb]">
                      <span className="text-xl sm:text-2xl text-[#775a19] font-bold font-serif">
                        {hours}
                      </span>
                      <span className="text-[10px] text-[#735855] font-semibold uppercase mt-1">
                        Jam
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl py-3 px-1 shadow-xs flex flex-col items-center border border-[#efeeeb]">
                      <span className="text-xl sm:text-2xl text-[#775a19] font-bold font-serif">
                        {minutes}
                      </span>
                      <span className="text-[10px] text-[#735855] font-semibold uppercase mt-1">
                        Menit
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl py-3 px-1 shadow-xs flex flex-col items-center border border-[#efeeeb]">
                      <span className="text-xl sm:text-2xl text-[#8a4c56] font-bold font-serif">
                        {seconds}
                      </span>
                      <span className="text-[10px] text-[#735855] font-semibold uppercase mt-1">
                        Detik
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveToCalendar}
                    className="mt-5 w-full py-2.5 rounded-full bg-[#eae8e5] hover:bg-[#ffd9dd] text-[#1b1c1a] hover:text-[#7a3f49] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#775a19]">
                      event
                    </span>
                    <span>Simpan ke Kalender</span>
                  </button>
                </div>
              </motion.section>
            )}

            {/* ============================================================ */}
            {/* 3. MEMPELAI (COUPLE PROFILE)                                 */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('couple') && (
              <motion.section
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 flex flex-col items-center text-center bg-[#fbf9f6]"
                id="mempelai"
              >
                <div className="w-20 h-8 flex items-center justify-center text-[#775a19] mb-1">
                  <SigerCrownSvg />
                </div>
                <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase">
                  Pasangan Mempelai
                </span>
                <h2 className="text-2xl text-[#1b1c1a] font-serif font-medium mt-1 mb-8">
                  {coupleOrderTitle}
                </h2>

                {/* First Person Card */}
                <div className="w-full max-w-xs rounded-3xl p-5 bg-white shadow-md flex flex-col items-center relative mb-6 border border-[#d1c5b4]/30">
                  <div data-anim="soft-scale" className="w-44 h-52 rounded-t-full rounded-b-xl overflow-hidden shadow-inner mb-4 bg-[#efeeeb] p-1">
                    <img
                      src={
                        firstPerson.photo_url ||
                        firstPerson.photo ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuASfCWw3-Nu-1IV5MGz5OqnmkZSTr7w9crraUApBuKXhWwhICHOrcfuwDGwT9mfktqCY--Lofo5hwGGkoMaAa58ALJ5EXgQb1_QFKgXg5HZpj4TlePv6eFLp1mewFt8BH8K5QEKY4Id3KXDxWU5Vua3PVCJdab8s6GtTuITN6Fnv80PFE4hxYPyRGLYl6ZrXF3_VEgaE7dHLDHkAHSLJp6MeJ4VT8HtciHBstGhMRmSk2kUlzOapEE8qA'
                      }
                      alt={firstPerson.full_name}
                      className="w-full h-full object-cover rounded-t-full rounded-b-lg"
                    />
                  </div>
                  <h3 className="text-[19px] text-[#1b1c1a] font-serif font-semibold leading-tight">
                    {firstPerson.full_name}
                  </h3>
                  <p className="text-xs text-[#4e4639] mt-2 text-center leading-relaxed">
                    {firstPerson.child_order || 'Putra sulung dari'}:<br />
                    <strong className="text-[#1b1c1a] font-semibold">
                      {firstPerson.parent_father || 'Bpk. Orang Tua Pria'}
                    </strong>
                    <br />
                    &amp; {firstPerson.parent_mother || 'Ibu Orang Tua Pria'}
                  </p>
                  {firstPerson.instagram && (
                    <a
                      href={`https://instagram.com/${firstPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5f3f0] text-[#775a19] text-[11px] font-semibold hover:bg-[#ffd9dd] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                      <span>{firstPerson.instagram}</span>
                    </a>
                  )}
                </div>

                {/* Ampersand Floral Connection */}
                <div className="relative my-2 flex items-center justify-center">
                  <div className="w-16 h-px bg-[#d1c5b4]" />
                  <span className="mx-3 text-2xl sm:text-3xl font-serif text-[#775a19] italic">
                    &amp;
                  </span>
                  <div className="w-16 h-px bg-[#d1c5b4]" />
                </div>

                {/* Second Person Card */}
                <div className="w-full max-w-xs rounded-3xl p-5 bg-white shadow-md flex flex-col items-center relative mt-6 border border-[#d1c5b4]/30">
                  <div data-anim="soft-scale" className="w-44 h-52 rounded-t-full rounded-b-xl overflow-hidden shadow-inner mb-4 bg-[#efeeeb] p-1">
                    <img
                      src={
                        secondPerson.photo_url ||
                        secondPerson.photo ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAgbBBsIYaF1FNBrw1P-ZTspaPzkE9nUJNSC3SCK3zR26aHA2aeqhD2Lnm0TveGZdkM74-ZTOLoUeh5btY_dpSFMb2tiCF0S_wCrNFcRYhqMlH9VflVykdRP1sO5RAiyw21K4FNN24mA1e6hmnvjFKWouiT1bfS619zs-_2hiGGY7HzW4V8vwel3yWKVbIJQgWJ1CKY87Lh07Tr-dCjFAFhGZwrwP2RoarAmduUVvXKtvU-O8qDHdB8rA'
                      }
                      alt={secondPerson.full_name}
                      className="w-full h-full object-cover rounded-t-full rounded-b-lg"
                    />
                  </div>
                  <h3 className="text-[19px] text-[#1b1c1a] font-serif font-semibold leading-tight">
                    {secondPerson.full_name}
                  </h3>
                  <p className="text-xs text-[#4e4639] mt-2 text-center leading-relaxed">
                    {secondPerson.child_order || 'Putri kedua dari'}:<br />
                    <strong className="text-[#1b1c1a] font-semibold">
                      {secondPerson.parent_father || 'Bpk. Orang Tua Wanita'}
                    </strong>
                    <br />
                    &amp; {secondPerson.parent_mother || 'Ibu Orang Tua Wanita'}
                  </p>
                  {secondPerson.instagram && (
                    <a
                      href={`https://instagram.com/${secondPerson.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5f3f0] text-[#775a19] text-[11px] font-semibold hover:bg-[#ffd9dd] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                      <span>{secondPerson.instagram}</span>
                    </a>
                  )}
                </div>
              </motion.section>
            )}

            {/* ============================================================ */}
            {/* 4. CULTURAL WEDDING EVENT DETAILS (AKAD & RESEPSI)           */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('event') && (
              <motion.section
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 bg-[#f5f3f0] flex flex-col items-center text-center"
                id="acara"
              >
                <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase">
                  Waktu &amp; Tempat
                </span>
                <h2 className="text-2xl text-[#1b1c1a] font-serif font-medium mt-1 mb-8">
                  Rangkaian Acara Bahagia
                </h2>

                <div className="w-full max-w-sm flex flex-col gap-6">
                  {data.events.map((ev: any, index: number) => {
                    const isResepsi = index === 1;
                    const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
                    const isCountdownEvent = index === activeTargetIdx;

                    return (
                      <div
                        key={ev.title || index}
                        className="w-full rounded-3xl p-6 bg-white shadow-md flex flex-col items-center relative border border-[#d1c5b4]/30 overflow-hidden"
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[11px] font-semibold uppercase tracking-wider mb-4 shadow-xs max-w-full ${isResepsi ? 'bg-[#775a19]' : 'bg-[#8a4c56]'
                            }`}
                        >
                          <span className="material-symbols-outlined text-[15px] shrink-0">
                            {ev.icon || (isResepsi ? 'celebration' : 'auto_stories')}
                          </span>
                          <span className="break-words [overflow-wrap:anywhere]">{ev.name || ev.title}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#775a19] text-[17px] font-serif font-semibold mb-1 max-w-full">
                          <span className="material-symbols-outlined text-[19px] shrink-0">calendar_month</span>
                          <span className="break-words [overflow-wrap:anywhere]">{ev.date}</span>
                        </div>
                        <p className="text-xs text-[#4e4639] mb-4 break-words [overflow-wrap:anywhere] max-w-full text-center">
                          {ev.time || `${ev.start_time || '08.00'} - ${ev.end_time || 'Selesai'} WIB`}
                        </p>
                        <div className="w-10 h-0.5 bg-[#d1c5b4]/50 mb-4 rounded-full shrink-0" />

                        <h4 className="text-[17px] text-[#1b1c1a] font-serif font-bold mb-1 break-words [overflow-wrap:anywhere] max-w-full text-center">
                          {ev.venue_name || ev.location_name}
                        </h4>
                        <p className="text-xs text-[#4e4639] text-center mb-4 leading-relaxed break-words [overflow-wrap:anywhere] max-w-full">
                          {ev.venue_address || ev.address}
                        </p>

                        {/* Dresscode Badge if available */}
                        {ev.badge && (
                          <div className="w-full py-2 px-3 rounded-xl bg-[#ffd9dd]/60 text-[#380a15] flex items-center justify-center gap-2 mb-3 text-xs font-medium">
                            <span className="material-symbols-outlined text-[16px] shrink-0">checkroom</span>
                            <span className="break-words [overflow-wrap:anywhere]">{ev.badge}</span>
                          </div>
                        )}

                        {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
                        {isCountdownEvent && (
                          <div className="w-full mb-4">
                            <VenueMapEmbed
                              venueName={ev.venue_name || ev.location_name}
                              venueAddress={ev.venue_address || ev.address}
                              mapsUrl={ev.maps_url}
                              heightClass="h-40"
                              isPreview={isPreview}
                            />
                          </div>
                        )}

                        {/* Google Maps Button (Selalu tampil di setiap card acara) */}
                        <a
                          href={ev.maps_url || 'https://maps.google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-2.5 rounded-full font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors ${isResepsi
                              ? 'bg-[#8a4c56] text-white hover:bg-[#6e353f]'
                              : 'bg-[#775a19] text-white hover:bg-[#5d4201]'
                            }`}
                        >
                          <span className="material-symbols-outlined text-[17px]">near_me</span>
                          <span>Buka Google Maps</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ============================================================ */}
            {/* 5. PHOTO GALLERY SECTION                                     */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('gallery') && data.gallery && data.gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 bg-white flex flex-col items-center text-center border-b border-[#efeeeb]"
                id="galeri"
              >
                <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase">
                  Galeri Memori
                </span>
                <h2 className="text-2xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2">
                  Kisah Dua Hati
                </h2>
                <p className="text-xs text-[#4e4639] italic mb-6">
                  “Dua hati, satu janji, selamanya dalam cinta suci.”
                </p>

                {/* 2-Column Responsive Masonry Showcase */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4">
                  <div className="flex flex-col gap-3">
                    {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
                      .filter((_, idx) => idx % 2 === 0)
                      .map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`rounded-2xl overflow-hidden shadow-md bg-[#efeeeb] cursor-pointer hover:opacity-95 transition-opacity ${
                            idx % 2 === 0 ? 'h-52' : 'h-36'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx * 2 + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
                      .filter((_, idx) => idx % 2 === 1)
                      .map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`rounded-2xl overflow-hidden shadow-md bg-[#efeeeb] cursor-pointer hover:opacity-95 transition-opacity ${
                            idx % 2 === 0 ? 'h-36' : 'h-52'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx * 2 + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Tombol Lihat Selengkapnya jika foto > 4 */}
                {data.gallery.length > 4 && (
                  <div className="text-center mt-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setShowAllGallery((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#d1c5b4]/50 bg-white hover:bg-[#f5f3f0] text-xs font-semibold tracking-wider uppercase text-[#1b1c1a] shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span>
                        {showAllGallery
                          ? 'Tampilkan Lebih Sedikit'
                          : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#775a19]">
                        {showAllGallery ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                )}
              </motion.section>
            )}

            {/* Universal Gallery Lightbox (Terkunci sejajar layar di HP Preview maupun Web PC) */}
            <GalleryLightbox
              isOpen={Boolean(selectedImage)}
              imageUrl={selectedImage}
              onClose={() => setSelectedImage(null)}
              isPreview={isPreview}
            />

            {/* ============================================================ */}
            {/* 6. INTERACTIVE RSVP & VIP QR TICKET CARD                     */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('rsvp') && (
              <motion.section
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 bg-[#f5f3f0] flex flex-col items-center"
                id="rsvp"
              >
                <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase text-center">
                  Konfirmasi Kehadiran
                </span>
                <h2 className="text-2xl text-[#1b1c1a] font-serif font-medium mt-1 mb-6 text-center">
                  RSVP Undangan
                </h2>

                {/* RSVP Form */}
                <form
                  onSubmit={handleRsvpSubmit}
                  className="w-full max-w-sm rounded-3xl p-5 sm:p-6 bg-white shadow-md flex flex-col gap-4 border border-[#d1c5b4]/30"
                >
                  <div>
                    <label className="text-xs font-semibold text-[#1b1c1a] block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      placeholder="Ketik nama Anda"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f5f3f0] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#d1c5b4]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1b1c1a] block mb-2">
                      Konfirmasi Kehadiran
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {[
                        { key: 'hadir', label: 'Hadir', cls: 'bg-[#775a19] text-white' },
                        { key: 'ragu', label: 'Masih Ragu', cls: 'bg-[#c5a059] text-white' },
                        { key: 'tidak', label: 'Berhalangan', cls: 'bg-[#8a4c56] text-white' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setActiveRsvpTab(item.key as any);
                            setRsvpForm({
                              ...rsvpForm,
                              status: item.key === 'tidak' ? 'declined' : 'hadir',
                            });
                          }}
                          className={`py-2 px-1 sm:px-2 text-center rounded-xl text-[10.5px] sm:text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center min-h-[42px] leading-tight ${activeRsvpTab === item.key
                              ? `${item.cls} shadow-xs`
                              : 'bg-[#efeeeb] text-[#1b1c1a] hover:bg-[#eae8e5]'
                            }`}
                        >
                          <span className="w-full text-center break-words [overflow-wrap:anywhere]">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1b1c1a] block mb-1">
                      Jumlah Tamu
                    </label>
                    <select
                      value={rsvpForm.pax}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, pax: Number(e.target.value) || 1 })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f5f3f0] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#d1c5b4]/40"
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#775a19] text-white text-xs font-semibold shadow-md hover:bg-[#5d4201] transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">send</span>
                    <span>Kirim Konfirmasi</span>
                  </button>
                </form>
              </motion.section>
            )}

            {/* ============================================================ */}
            {/* 7. LIVE WISHES WALL (BUKU TAMU)                              */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('wishes') && (
              <motion.section
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 bg-white flex flex-col items-center border-b border-[#efeeeb]"
                id="ucapan"
              >
                <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase text-center">
                  Buku Tamu Virtual
                </span>
                <h2 className="text-2xl text-[#1b1c1a] font-serif font-medium mt-1 mb-6 text-center">
                  Untaian Doa &amp; Restu
                </h2>

                {/* Wish Input Box */}
                <form
                  onSubmit={handleWishSubmit}
                  className="w-full max-w-sm rounded-3xl p-5 bg-[#f5f3f0] shadow-sm flex flex-col gap-3 mb-6 border border-[#d1c5b4]/30"
                >
                  <input
                    type="text"
                    required
                    value={wishForm.name}
                    onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1b1c1a] text-xs focus:outline-none border border-[#d1c5b4]/40"
                  />
                  <textarea
                    rows={3}
                    required
                    value={wishForm.message}
                    onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                    placeholder="Tuliskan ucapan dan doa tulus untuk mempelai..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1b1c1a] text-xs focus:outline-none border border-[#d1c5b4]/40 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#8a4c56] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#6e353f] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">favorite</span>
                    <span>Kirim Doa Restu</span>
                  </button>
                </form>

                {/* Feed of Heartfelt Wishes */}
                <div className="w-full max-w-sm flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {wishes.map((w, idx) => (
                    <div
                      key={w.id || idx}
                      className="p-4 rounded-2xl bg-[#f5f3f0] shadow-xs flex flex-col border border-[#d1c5b4]/25"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#ffdea5] text-[#261900] flex items-center justify-center font-serif text-xs font-bold shrink-0">
                            {(w.guest_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col text-left min-w-0 flex-1">
                            <span className="text-xs font-bold text-[#1b1c1a] break-words [overflow-wrap:anywhere]">
                              {w.guest_name}
                            </span>
                            <span className="text-[10px] text-[#735855]">
                              {w.created_at ? new Date(w.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#ffd9dd] text-[#380a15] text-[10px] font-semibold">
                          {w.attendance === 'attending' ? 'Hadir' : 'Doa'}
                        </span>
                      </div>
                      <p className="text-xs text-[#4e4639] leading-relaxed text-left break-words [overflow-wrap:anywhere]">
                        {w.message}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ============================================================ */}
            {/* 8. DIGITAL ENVELOPE (AMPLOP DIGITAL & KADO)                  */}
            {/* ============================================================ */}
            {isOpen && isSectionActive('gift') && (
              <motion.section
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="w-full px-5 py-12 bg-[#f5f3f0] flex flex-col items-center"
                id="kado"
              >
                <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase text-center">
                  Tanda Kasih
                </span>
                <h2 className="text-2xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2 text-center">
                  Amplop Digital
                </h2>
                <p className="text-xs text-[#4e4639] text-center max-w-xs mb-6 leading-relaxed">
                  Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberi tanda kasih, kami menyediakan dompet digital berikut:
                </p>

                {/* Bank Account Cards */}
                {data.bank_accounts && data.bank_accounts.length > 0 && (
                  <div className="w-full max-w-sm flex flex-col gap-4 mb-6">
                    {data.bank_accounts.map((bank: any, index: number) => {
                      const isEven = index % 2 === 0;
                      return (
                        <div
                          key={bank.account_number || index}
                          className={`w-full rounded-3xl p-6 shadow-xl relative overflow-hidden text-left ${isEven
                              ? 'bg-gradient-to-br from-white via-[#fbf9f6] to-[#ffdea5]/40 text-[#1b1c1a] border border-[#c5a059]/30'
                              : 'bg-gradient-to-br from-[#8a4c56] via-[#7a3f49] to-[#4d3533] text-white shadow-[#8a4c56]/20'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-5">
                            <span
                              className={`text-[17px] font-bold tracking-wider font-serif ${isEven ? 'text-[#775a19]' : 'text-[#ffd9dd]'
                                }`}
                            >
                              {bank.bank_name}
                            </span>
                            <div
                              className={`w-9 h-6 rounded-md flex items-center justify-center ${isEven ? 'bg-[#c5a059]/20 text-[#775a19]' : 'bg-white/20 text-white'
                                }`}
                            >
                              <span className="material-symbols-outlined text-[17px]">memory</span>
                            </div>
                          </div>
                          <p className="text-[19px] font-mono tracking-widest mb-1 font-semibold">
                            {bank.account_number}
                          </p>
                          <span
                            className={`text-[11px] uppercase tracking-wider block mb-4 font-semibold ${isEven ? 'text-[#735855]' : 'text-[#ffd9dd]'
                              }`}
                          >
                            a.n {bank.account_holder}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyAccount(bank.account_number_raw || bank.account_number, index)
                            }
                            className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer ${isEven
                                ? 'bg-[#775a19] text-white hover:bg-[#5d4201]'
                                : 'bg-[#feaeb9] text-[#7a3f49] hover:bg-white'
                              }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                            <span>Salin No. Rekening</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Physical Gift Address */}
                {data.gift_address && (
                  <div className="w-full max-w-sm rounded-3xl p-5 bg-white shadow-md flex flex-col items-center text-center border border-[#d1c5b4]/30">
                    <div className="w-10 h-10 rounded-full bg-[#feaeb9] text-[#7a3f49] flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    </div>
                    <h4 className="text-[16px] text-[#1b1c1a] font-serif font-bold mb-1">
                      Kirim Kado Fisik
                    </h4>
                    <p className="text-xs text-[#4e4639] mb-3 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {data.gift_address}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(data.gift_address || '')}
                      className="px-5 py-2 rounded-full bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#1b1c1a] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#d1c5b4]/40"
                    >
                      <span className="material-symbols-outlined text-[16px]">file_copy</span>
                      <span>Salin Alamat</span>
                    </button>
                  </div>
                )}
              </motion.section>
            )}

            {/* ============================================================ */}
            {/* 9. CLOSING & SUNDANESE BLESSING                              */}
            {/* ============================================================ */}
            {isOpen && (
              <footer className="w-full px-5 pt-12 pb-28 bg-[#fbf9f6] flex flex-col items-center text-center relative">
                <div className="w-20 h-8 flex items-center justify-center text-[#c5a059] mb-3">
                  <SigerCrownSvg />
                </div>
                <p className="text-xs text-[#4e4639] max-w-sm leading-relaxed mb-6">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                </p>
                <span className="text-[10px] font-bold text-[#775a19] tracking-widest uppercase mb-1">
                  Kami yang berbahagia:
                </span>
                <h3 className="text-sm font-semibold text-[#1b1c1a] mb-1">
                  Keluarga {data.groom.parent_father || 'Mempelai Pria'}
                </h3>
                <h3 className="text-sm font-semibold text-[#1b1c1a] mb-6">
                  Keluarga {data.bride.parent_father || 'Mempelai Wanita'}
                </h3>
                <div className="w-12 h-0.5 bg-[#d1c5b4]/50 my-4 rounded-full" />
                <h2 className="text-2xl text-[#775a19] font-serif italic mb-2">
                  {coupleOrderTitle}
                </h2>
                <p className="text-[10px] text-[#735855] tracking-widest uppercase mt-4">
                  © {new Date().getFullYear()} The Royal Sundanese Wedding of {coupleOrderTitle}
                </p>
              </footer>
            )}

          </div>
        </main>

        {/* ============================================================ */}
        {/* 10. FLOATING AUDIO CONTROLLER BUBBLE (CIRCULAR BUBBLE)        */}
        {/* ============================================================ */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <aside className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 flex items-center justify-center pointer-events-auto`}>
              <button
                type="button"
                onClick={toggleMusic}
                aria-label="Putar Gending Sunda"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-[#775a19] border border-[#c5a059]/40 shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full bg-[#3e2e0a] flex items-center justify-center ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                    }`}
                >
                  <span className="material-symbols-outlined text-[#e0bd68] text-lg">
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
