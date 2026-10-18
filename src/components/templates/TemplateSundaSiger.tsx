import React, { useState } from 'react';
import type { InvitationProps } from '../../types/invitation';
import { useTemplateState } from '../../hooks/useTemplateState';
import { FloatingDock } from '../common/FloatingDock';
import { SleekToast } from '../common/SleekToast';
import { VenueMapEmbed } from '../common/VenueMapEmbed';
import { GalleryLightbox } from '../common/GalleryLightbox';
import { DraggableCoverSheet } from '../common/DraggableCoverSheet';
import { MOCK_SUNDA_DATA } from '../../data/mock/sundaData';

// Component: Subtle Floating Jasmine Petals in the Background (Ronce Melati Pasundan)
const FallingPetals: React.FC = () => {
  const petals = [
    { id: 1, left: '8%', delay: '0s', duration: '11s', size: 16 },
    { id: 2, left: '25%', delay: '2.5s', duration: '13s', size: 14 },
    { id: 3, left: '44%', delay: '5s', duration: '12s', size: 18 },
    { id: 4, left: '62%', delay: '1s', duration: '14s', size: 15 },
    { id: 5, left: '79%', delay: '3.5s', duration: '10s', size: 16 },
    { id: 6, left: '92%', delay: '6s', duration: '15s', size: 13 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none">
      <style>{`
        @keyframes floatSiger {
          0%, 100% { transform: translateY(-4px) rotate(-0.5deg); }
          50% { transform: translateY(4px) rotate(0.5deg); }
        }
        @keyframes fallPetal {
          0% {
            opacity: 0;
            transform: translateY(-20px) rotate(0deg) scale(0.85);
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            opacity: 0;
            transform: translateY(105vh) rotate(360deg) scale(1);
          }
        }
        .animate-float-siger {
          animation: floatSiger 4.5s ease-in-out infinite;
        }
        .animate-petal {
          animation: fallPetal linear infinite;
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal text-[#c5a059]/40"
          style={{
            left: p.left,
            top: '-20px',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}px`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};

// Ornate Sundanese Royal Siger Crown Motif SVG
const SigerCrownSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 120 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Base Tiara Filigree */}
    <path
      d="M6 36 C30 38, 90 38, 114 36 C105 32, 85 30, 60 30 C35 30, 15 32, 6 36 Z"
      fill="currentColor"
      opacity="0.85"
    />
    {/* Center 9-Peak Siger Crown Structure */}
    <path
      d="M60 4 L65 24 L75 14 L78 28 L90 20 L91 32 L106 26 L102 36 L18 36 L14 26 L29 32 L30 20 L42 28 L45 14 L55 24 Z"
      fill="currentColor"
    />
    {/* Sparkling Royal Gem Jewels */}
    <circle cx="60" cy="5" r="3" fill="#ffe082" />
    <circle cx="45" cy="14" r="2.2" fill="#ffe082" />
    <circle cx="75" cy="14" r="2.2" fill="#ffe082" />
    <circle cx="30" cy="20" r="1.8" fill="#ffe082" />
    <circle cx="90" cy="20" r="1.8" fill="#ffe082" />
    <circle cx="14" cy="26" r="1.5" fill="#ffe082" />
    <circle cx="106" cy="26" r="1.5" fill="#ffe082" />
    {/* Center Diamond Emblem */}
    <polygon points="60,18 63,23 60,28 57,23" fill="#ffffff" opacity="0.9" />
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

  const { days, hours, minutes, seconds } = countdown;
  const [activeRsvpTab, setActiveRsvpTab] = useState<'hadir' | 'ragu' | 'tidak'>('hadir');

  // Handle Calendar Save
  const handleSaveToCalendar = () => {
    const title = encodeURIComponent(`The Wedding of ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Pernikahan Adat Sunda Siger ${data.groom.full_name} & ${data.bride.full_name}. Runtut Raut Sauyunan.`
    );
    const location = encodeURIComponent(
      data.events?.[1]?.venue_name || data.events?.[0]?.venue_name || 'Indonesia'
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
  const venueCity = data.events?.[0]?.venue_city || data.events?.[0]?.venue_name || data.events?.[1]?.venue_city || 'Indonesia';

  return (
    <div
      className="theme-sunda bg-[#fbf9f6] text-[#1b1c1a] font-sans antialiased flex flex-col items-center justify-start min-h-screen relative selection:bg-[#ad8633]/20 selection:text-[#5d4201] w-full no-scrollbar"
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
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#fbf9f6] shadow-[0_20px_50px_rgba(119,90,25,0.08)] overflow-x-clip no-scrollbar border-x border-[#ede9e1]/80">
        <main className="flex-1 flex flex-col w-full bg-[#fbf9f6] relative">
          <div className={`flex flex-col w-full text-[#1b1c1a] relative ${
            !isOpen ? (isPreview ? 'h-full overflow-hidden' : 'h-[100dvh] overflow-hidden') : 'min-h-screen overflow-visible'
          }`}>

            {/* ============================================================ */}
            {/* 1. PHYSICAL DRAGGABLE COVER SHEET OVERLAY                    */}
            {/* ============================================================ */}
            <DraggableCoverSheet
              isOpen={isOpen}
              isOpening={isOpening}
              onOpenInvitation={handleOpenInvitation}
            >
              <section
                id="sampul"
                className="w-full h-full min-h-full relative flex flex-col items-center justify-between px-6 pt-8 pb-10 text-center bg-gradient-to-b from-[#fbf9f6] via-[#f7f4ed] to-[#ede7dc] overflow-hidden"
              >
                {/* Ambient Sundanese Backdrop using Cover Photo if present */}
                {(data.cover_image || data.couple_photo) && (
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img
                      src={data.cover_image || data.couple_photo}
                      alt="Cover Background"
                      className="w-full h-full object-cover opacity-20 filter blur-[0.8px] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e1915]/85 via-[#2c241c]/75 to-[#1a140f]/90"></div>
                  </div>
                )}

                {/* Top Notch-Safe Siger Header */}
                <div className="relative z-10 pt-4 shrink-0 flex flex-col items-center">
                  <div className="w-24 h-10 mb-2 flex items-center justify-center text-[#e8c676] animate-float-siger drop-shadow-md">
                    <SigerCrownSvg />
                  </div>

                  <span className={`text-[10.5px] font-semibold tracking-[0.28em] uppercase mb-1 drop-shadow-sm ${
                    (data.cover_image || data.couple_photo) ? 'text-[#ebd49d]' : 'text-[#8a6822]'
                  }`}>
                    The Wedding Celebration
                  </span>

                  <div className="flex items-center gap-2 opacity-80 my-0.5">
                    <span className="w-8 h-px bg-[#c5a059]" />
                    <span className="text-[10px] tracking-widest uppercase font-serif text-[#c5a059] italic">Parahyangan</span>
                    <span className="w-8 h-px bg-[#c5a059]" />
                  </div>
                </div>

                {/* Center Framed Arch Couple Image with Gold Rim */}
                <div className="relative z-10 my-3 flex flex-col items-center justify-center">
                  <div className="relative w-60 h-76 sm:w-64 sm:h-80 rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl p-2 bg-gradient-to-b from-[#d4af37] via-[#c5a059]/60 to-[#8a6822] ring-1 ring-white/30">
                    <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden relative bg-[#2c241c]">
                      <img
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        src={
                          data.cover_image ||
                          data.couple_photo ||
                          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={coupleOrderTitle}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </div>

                  <h1 className={`text-2xl sm:text-3xl font-serif mt-3 font-medium tracking-wide drop-shadow-sm ${
                    (data.cover_image || data.couple_photo) ? 'text-white' : 'text-[#1b1c1a]'
                  }`}>
                    {firstPerson.name}{' '}
                    <span className="text-[#e8c676] text-2xl font-serif italic font-light">&amp;</span>{' '}
                    {secondPerson.name}
                  </h1>

                  <p className={`text-xs tracking-wider uppercase mt-1 ${
                    (data.cover_image || data.couple_photo) ? 'text-[#e2d5c3]' : 'text-[#5d4201]'
                  }`}>
                    {weddingDateStr} • {venueCity}
                  </p>
                </div>

                {/* Bottom Guest Pass & CTA Button */}
                <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center space-y-3 shrink-0">
                  <div className="w-full p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl text-center flex flex-col items-center border border-[#c5a059]/40">
                    <span className="text-[10px] text-[#8a6822] font-semibold uppercase tracking-widest mb-0.5">
                      Kahatur Kagem Bapak/Ibu/Saudara/i:
                    </span>
                    <h3 className="text-base sm:text-lg text-[#1b1c1a] font-serif font-bold tracking-tight line-clamp-1">
                      {recipientName}
                    </h3>
                    {(Boolean(data.guest_code) || isPreview) && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f7f3ea] text-[#775a19] border border-[#c5a059]/30 text-[11px] font-mono font-medium">
                        <span className="material-symbols-outlined text-[14px]">qr_code</span>
                        <span>CHECK-IN PASS: {data.guest_code || 'KRT-2026'}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-[#735855] mt-1 italic">
                      Mohon maaf bila ada kesalahan penulisan nama/gelar
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenInvitation}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#b38728] via-[#c5a059] to-[#8a6822] hover:brightness-105 text-white font-serif font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ring-1 ring-white/30"
                  >
                    <span className="material-symbols-outlined text-[19px]">mail</span>
                    <span>Buka Undangan</span>
                  </button>

                  {/* Interaktif Petunjuk Usap ke Atas */}
                  {renderSwipeHint({ variant: 'gold' })}
                </div>
              </section>
            </DraggableCoverSheet>

            {/* ============================================================ */}
            {/* 2. INNER CONTENT (Tersedia di bawah cover & interaktif)      */}
            {/* ============================================================ */}
            <div className={`flex flex-col w-full ${!isOpen ? 'pointer-events-none select-none max-h-screen overflow-hidden' : 'animate-page-enter'}`}>

                {/* ============================================================ */}
                {/* 2. HERO SCRIPTURE & LIVE COUNTDOWN                           */}
                {/* ============================================================ */}
                {isSectionActive('cover') && (
                  <section
                    className="w-full px-5 py-12 flex flex-col items-center text-center bg-white relative overflow-hidden border-b border-[#ede9e1]"
                    id="doaMempelai"
                  >
                    {/* Jasmine Garland Motif Accent */}
                    <div className="w-48 h-6 text-[#c5a059] opacity-80 mb-2 reveal-scale">
                      <svg className="w-full h-full fill-none stroke-current stroke-1" viewBox="0 0 200 24">
                        <path d="M10,12 Q50,0 100,12 T190,12" strokeLinecap="round" />
                        <circle cx="60" cy="7" fill="#C5A059" r="3" />
                        <circle cx="100" cy="12" fill="#C5A059" r="4" />
                        <circle cx="140" cy="7" fill="#C5A059" r="3" />
                      </svg>
                    </div>

                    {/* Sundanese Cultural Proverb */}
                    <span className="text-xl sm:text-2xl text-[#8a6822] font-serif italic mb-2 reveal delay-100">
                      “Runtut Raut Sauyunan”
                    </span>

                    {/* Quranic / Scripture Verse */}
                    <p data-anim="quote" className="text-xs sm:text-sm text-[#4e4639] max-w-sm italic leading-relaxed reveal delay-150">
                      “{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}”
                    </p>
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-widest mt-2 uppercase reveal delay-200">
                      {data.quote_source || '(QS. Ar-Rum: 21)'}
                    </span>

                    <div className="w-12 h-0.5 bg-[#c5a059]/40 my-6 rounded-full" />

                    {/* Countdown Card with Regal Gold Frame */}
                    <div className="w-full max-w-sm rounded-3xl p-5 bg-[#fbf9f6] shadow-sm flex flex-col items-center border border-[#c5a059]/30 reveal-scale delay-200">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#8a6822] text-[20px]">
                          hourglass_top
                        </span>
                        <span className="text-[11px] font-semibold text-[#5d4201] uppercase tracking-widest">
                          Menghitung Hari Bahagia
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 w-full text-center">
                        <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
                          <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
                            {days}
                          </span>
                          <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
                            Hari
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
                          <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
                            {hours}
                          </span>
                          <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
                            Jam
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
                          <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
                            {minutes}
                          </span>
                          <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
                            Menit
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl py-3 px-1 shadow-2xs flex flex-col items-center border border-[#ede9e1]">
                          <span className="text-xl sm:text-2xl text-[#8a6822] font-bold font-serif">
                            {seconds}
                          </span>
                          <span className="text-[10px] text-[#735855] font-semibold uppercase mt-0.5">
                            Detik
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveToCalendar}
                        className="mt-5 w-full py-2.5 rounded-full bg-white hover:bg-[#f3eedf] text-[#5d4201] text-xs font-semibold flex items-center justify-center gap-2 border border-[#c5a059]/40 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#8a6822]">
                          event
                        </span>
                        <span>Simpan ke Google Calendar</span>
                      </button>
                    </div>
                  </section>
                )}

                {/* ============================================================ */}
                {/* 3. MEMPELAI (COUPLE PROFILE)                                 */}
                {/* ============================================================ */}
                {isSectionActive('couple') && (
                  <section
                    className="w-full px-5 py-12 flex flex-col items-center text-center bg-[#fbf9f6]"
                    id="mempelai"
                  >
                    <div className="w-20 h-8 flex items-center justify-center text-[#8a6822] mb-1 reveal-scale">
                      <SigerCrownSvg />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase reveal">
                      Panganten Sakembaran
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-8 reveal delay-100">
                      {coupleOrderTitle}
                    </h2>

                    {/* First Person Card */}
                    <div className="w-full max-w-xs rounded-3xl p-6 bg-white shadow-md flex flex-col items-center relative mb-6 border border-[#c5a059]/30 reveal-left delay-100">
                      <div className="w-44 h-56 rounded-t-full rounded-b-2xl overflow-hidden shadow-inner mb-4 bg-[#f4efe4] p-1.5 border border-[#c5a059]/40">
                        <img
                          src={
                            firstPerson.photo_url ||
                            firstPerson.photo ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
                          }
                          alt={firstPerson.full_name}
                          className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                        />
                      </div>
                      <h3 className="text-lg sm:text-xl text-[#1b1c1a] font-serif font-bold leading-tight">
                        {firstPerson.full_name}
                      </h3>
                      <p className="text-xs text-[#4e4639] mt-2 text-center leading-relaxed">
                        {firstPerson.child_order || 'Putra ti'}:<br />
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
                          className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fbf9f6] text-[#8a6822] text-[11px] font-semibold hover:bg-[#f3eedf] transition-colors border border-[#c5a059]/30"
                        >
                          <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                          <span>{firstPerson.instagram}</span>
                        </a>
                      )}
                    </div>

                    {/* Ampersand Floral Connection */}
                    <div className="relative my-2 flex items-center justify-center reveal-scale delay-200">
                      <div className="w-16 h-px bg-[#c5a059]/50" />
                      <span className="mx-3 text-3xl font-serif text-[#8a6822] italic font-light">
                        &amp;
                      </span>
                      <div className="w-16 h-px bg-[#c5a059]/50" />
                    </div>

                    {/* Second Person Card */}
                    <div className="w-full max-w-xs rounded-3xl p-6 bg-white shadow-md flex flex-col items-center relative mt-6 border border-[#c5a059]/30 reveal-right delay-200">
                      <div className="w-44 h-56 rounded-t-full rounded-b-2xl overflow-hidden shadow-inner mb-4 bg-[#f4efe4] p-1.5 border border-[#c5a059]/40">
                        <img
                          src={
                            secondPerson.photo_url ||
                            secondPerson.photo ||
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
                          }
                          alt={secondPerson.full_name}
                          className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                        />
                      </div>
                      <h3 className="text-lg sm:text-xl text-[#1b1c1a] font-serif font-bold leading-tight">
                        {secondPerson.full_name}
                      </h3>
                      <p className="text-xs text-[#4e4639] mt-2 text-center leading-relaxed">
                        {secondPerson.child_order || 'Putri ti'}:<br />
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
                          className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fbf9f6] text-[#8a6822] text-[11px] font-semibold hover:bg-[#f3eedf] transition-colors border border-[#c5a059]/30"
                        >
                          <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                          <span>{secondPerson.instagram}</span>
                        </a>
                      )}
                    </div>
                  </section>
                )}

                {/* ============================================================ */}
                {/* 4. CULTURAL WEDDING EVENT DETAILS (AKAD & RESEPSI)           */}
                {/* ============================================================ */}
                {isSectionActive('event') && (
                  <section
                    className="w-full px-5 py-12 bg-[#f7f4ed] flex flex-col items-center text-center"
                    id="acara"
                  >
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase reveal">
                      Waktu &amp; Tempat
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-8 reveal delay-100">
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
                            className={`w-full rounded-3xl p-6 bg-white shadow-md flex flex-col items-center relative border border-[#c5a059]/30 overflow-hidden ${
                              index === 0 ? 'reveal-left delay-100' : 'reveal-right delay-200'
                            }`}
                          >
                            <div
                              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[11px] font-semibold uppercase tracking-wider mb-4 shadow-xs max-w-full ${
                                isResepsi ? 'bg-[#a37c2c]' : 'bg-[#8a6822]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[15px] shrink-0">
                                {ev.icon || (isResepsi ? 'celebration' : 'auto_stories')}
                              </span>
                              <span className="break-words [overflow-wrap:anywhere]">{ev.name || ev.title}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[#8a6822] text-[17px] font-serif font-semibold mb-1 max-w-full">
                              <span className="material-symbols-outlined text-[19px] shrink-0">calendar_month</span>
                              <span className="break-words [overflow-wrap:anywhere]">{ev.date}</span>
                            </div>
                            <p className="text-xs text-[#4e4639] mb-4 break-words [overflow-wrap:anywhere] max-w-full text-center">
                              {ev.time || `${ev.start_time || '08.00'} - ${ev.end_time || 'Selesai'} WIB`}
                            </p>
                            <div className="w-10 h-0.5 bg-[#c5a059]/40 mb-4 rounded-full shrink-0" />

                            <h4 className="text-[17px] text-[#1b1c1a] font-serif font-bold mb-1 break-words [overflow-wrap:anywhere] max-w-full text-center">
                              {ev.venue_name || ev.location_name}
                            </h4>
                            <p className="text-xs text-[#4e4639] text-center mb-4 leading-relaxed break-words [overflow-wrap:anywhere] max-w-full">
                              {ev.venue_address || ev.address}
                            </p>

                            {/* Dresscode Badge if available */}
                            {ev.badge && (
                              <div className="w-full py-2 px-3 rounded-xl bg-[#f7f3ea] text-[#5d4201] border border-[#c5a059]/30 flex items-center justify-center gap-2 mb-3 text-xs font-medium">
                                <span className="material-symbols-outlined text-[16px] shrink-0">checkroom</span>
                                <span className="break-words [overflow-wrap:anywhere]">{ev.badge}</span>
                              </div>
                            )}

                            {/* Interactive Real Google Maps Embed */}
                            {isCountdownEvent && (
                              <div className="w-full mb-4 rounded-2xl overflow-hidden border border-[#ede9e1]">
                                <VenueMapEmbed
                                  venueName={ev.venue_name || ev.location_name}
                                  venueAddress={ev.venue_address || ev.address}
                                  mapsUrl={ev.maps_url}
                                  heightClass="h-40"
                                  isPreview={isPreview}
                                />
                              </div>
                            )}

                            {/* Google Maps Button */}
                            <a
                              href={ev.maps_url || 'https://maps.google.com'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-2.5 rounded-full font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors ${
                                isResepsi
                                  ? 'bg-[#a37c2c] hover:bg-[#8a6822] text-white'
                                  : 'bg-[#8a6822] hover:bg-[#6e5318] text-white'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[17px]">near_me</span>
                              <span>Buka Google Maps</span>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ============================================================ */}
                {/* 5. PHOTO GALLERY SECTION                                     */}
                {/* ============================================================ */}
                {isSectionActive('gallery') && data.gallery && data.gallery.length > 0 && (
                  <section
                    className="w-full px-5 py-12 bg-white flex flex-col items-center text-center border-b border-[#ede9e1]"
                    id="galeri"
                  >
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase reveal">
                      Galeri Memori
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2 reveal delay-100">
                      Kisah Dua Hati
                    </h2>
                    <p className="text-xs text-[#4e4639] italic mb-6 reveal delay-150">
                      “Dua hati, satu janji, selamanya dalam cinta suci.”
                    </p>

                    {/* 2-Column Responsive Masonry Showcase */}
                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4 reveal-scale delay-200">
                      <div className="flex flex-col gap-3">
                        {(showAllGallery ? data.gallery : data.gallery.slice(0, 4))
                          .filter((_, idx) => idx % 2 === 0)
                          .map((imgUrl, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedImage(imgUrl)}
                              className={`rounded-2xl overflow-hidden shadow-md bg-[#f4efe4] cursor-pointer hover:opacity-95 transition-opacity ${
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
                              className={`rounded-2xl overflow-hidden shadow-md bg-[#f4efe4] cursor-pointer hover:opacity-95 transition-opacity ${
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
                      <div className="text-center mt-2 mb-2 reveal delay-250">
                        <button
                          type="button"
                          onClick={() => setShowAllGallery((prev) => !prev)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c5a059]/40 bg-white hover:bg-[#fbf9f6] text-xs font-semibold tracking-wider uppercase text-[#1b1c1a] shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <span>
                            {showAllGallery
                              ? 'Tampilkan Lebih Sedikit'
                              : `Lihat Selengkapnya (${data.gallery.length - 4} Foto Lainnya)`}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-[#8a6822]">
                            {showAllGallery ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {/* Universal Gallery Lightbox */}
                <GalleryLightbox
                  isOpen={Boolean(selectedImage)}
                  imageUrl={selectedImage}
                  onClose={() => setSelectedImage(null)}
                  isPreview={isPreview}
                />

                {/* ============================================================ */}
                {/* 6. INTERACTIVE RSVP & VIP CARD                                */}
                {/* ============================================================ */}
                {isSectionActive('rsvp') && (
                  <section
                    className="w-full px-5 py-12 bg-[#f7f4ed] flex flex-col items-center"
                    id="rsvp"
                  >
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase text-center reveal">
                      Konfirmasi Kehadiran
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-6 text-center reveal delay-100">
                      RSVP Undangan
                    </h2>

                    {/* RSVP Form */}
                    <form
                      onSubmit={handleRsvpSubmit}
                      className="w-full max-w-sm rounded-3xl p-6 bg-white shadow-md flex flex-col gap-4 border border-[#c5a059]/30 reveal-scale delay-150"
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
                          className="w-full px-4 py-2.5 rounded-xl bg-[#fbf9f6] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#ede9e1] focus:border-[#c5a059]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#1b1c1a] block mb-2">
                          Konfirmasi Kehadiran
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {[
                            { key: 'hadir', label: 'Hadir', cls: 'bg-[#8a6822] text-white shadow-xs' },
                            { key: 'ragu', label: 'Masih Ragu', cls: 'bg-[#c5a059] text-white shadow-xs' },
                            { key: 'tidak', label: 'Berhalangan', cls: 'bg-[#54463d] text-white shadow-xs' },
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
                              className={`py-2 px-1 sm:px-2 text-center rounded-xl text-[10.5px] sm:text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center min-h-[42px] leading-tight ${
                                activeRsvpTab === item.key
                                  ? item.cls
                                  : 'bg-[#f4efe4] text-[#1b1c1a] hover:bg-[#ede7dc]'
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
                          className="w-full px-4 py-2.5 rounded-xl bg-[#fbf9f6] text-[#1b1c1a] text-xs focus:outline-none focus:bg-white border border-[#ede9e1] focus:border-[#c5a059]"
                        >
                          <option value="1">1 Orang</option>
                          <option value="2">2 Orang</option>
                          <option value="3">3 Orang</option>
                          <option value="4">4 Orang</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-[#8a6822] text-white text-xs font-semibold shadow-md hover:bg-[#6e5318] transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">send</span>
                        <span>Kirim Konfirmasi Kehadiran</span>
                      </button>
                    </form>
                  </section>
                )}

                {/* ============================================================ */}
                {/* 7. LIVE WISHES WALL (BUKU TAMU)                              */}
                {/* ============================================================ */}
                {isSectionActive('wishes') && (
                  <section
                    className="w-full px-5 py-12 bg-white flex flex-col items-center border-b border-[#ede9e1]"
                    id="ucapan"
                  >
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase text-center reveal">
                      Buku Tamu Virtual
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-6 text-center reveal delay-100">
                      Untaian Doa &amp; Restu
                    </h2>

                    {/* Wish Input Box */}
                    <form
                      onSubmit={handleWishSubmit}
                      className="w-full max-w-sm rounded-3xl p-5 bg-[#fbf9f6] shadow-sm flex flex-col gap-3 mb-6 border border-[#c5a059]/30 reveal-scale delay-150"
                    >
                      <input
                        type="text"
                        required
                        value={wishForm.name}
                        onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1b1c1a] text-xs focus:outline-none border border-[#ede9e1] focus:border-[#c5a059]"
                      />
                      <textarea
                        rows={3}
                        required
                        value={wishForm.message}
                        onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                        placeholder="Tuliskan ucapan dan doa tulus untuk mempelai..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1b1c1a] text-xs focus:outline-none border border-[#ede9e1] focus:border-[#c5a059] resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-[#8a6822] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#6e5318] transition-colors cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[17px]">favorite</span>
                        <span>Kirim Doa Restu</span>
                      </button>
                    </form>

                    {/* Feed of Heartfelt Wishes */}
                    <div className="w-full max-w-sm flex flex-col gap-3 pr-1">
                      {wishes.map((w, idx) => (
                        <div
                          key={w.id || idx}
                          className="p-4 rounded-2xl bg-[#fbf9f6] shadow-2xs flex flex-col border border-[#ede9e1]"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-full bg-[#f4efe4] text-[#5d4201] border border-[#c5a059]/30 flex items-center justify-center font-serif text-xs font-bold shrink-0">
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
                          </div>
                          <p className="text-xs text-[#4e4639] leading-relaxed text-left break-words [overflow-wrap:anywhere]">
                            {w.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ============================================================ */}
                {/* 8. DIGITAL ENVELOPE (AMPLOP DIGITAL & KADO)                  */}
                {/* ============================================================ */}
                {(isPreview || (theme.show_gift !== false && isSectionActive('gift'))) && (
                  <section
                    className="w-full px-5 py-12 bg-[#f7f4ed] flex flex-col items-center"
                    id="kado"
                  >
                    <span className="text-[11px] font-semibold text-[#8a6822] tracking-[0.2em] uppercase text-center block mb-1">
                      Tanda Kasih
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-[#1b1c1a] font-serif font-medium mt-1 mb-2 text-center">
                      Amplop Digital
                    </h2>
                    <p className="text-xs text-[#4e4639] text-center max-w-xs mb-6 leading-relaxed">
                      Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberi tanda kasih, kami menyediakan dompet digital berikut:
                    </p>

                    {/* Bank Account Cards (Regal Gold & Obsidian Gold) */}
                    {(() => {
                      const effectiveBanks =
                        (data.banks && data.banks.length > 0)
                          ? data.banks
                          : (data.bank_accounts && data.bank_accounts.length > 0)
                          ? data.bank_accounts
                          : (isPreview ? (MOCK_SUNDA_DATA.bank_accounts || MOCK_SUNDA_DATA.banks || []) : []);

                      if (!effectiveBanks || effectiveBanks.length === 0) return null;

                      return (
                        <div className="w-full max-w-sm flex flex-col gap-4 mb-6">
                          {effectiveBanks.map((bank: any, index: number) => {
                            const isEven = index % 2 === 0;
                            return (
                              <div
                                key={bank.account_number || index}
                                className={`w-full rounded-3xl p-6 shadow-xl relative overflow-hidden text-left transition-all duration-300 ${
                                  isEven
                                    ? 'bg-gradient-to-br from-[#c5a059] via-[#ad8633] to-[#775a19] text-white shadow-amber-900/10'
                                    : 'bg-gradient-to-br from-[#2c241c] via-[#1e1915] to-[#120f0d] text-[#eed08a] border border-[#c5a059]/40 shadow-stone-900/20'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-5">
                                  <span
                                    className={`text-[17px] font-bold tracking-wider font-serif ${
                                      isEven ? 'text-white' : 'text-[#f5dfa8]'
                                    }`}
                                  >
                                    {bank.bank_name}
                                  </span>
                                  <div
                                    className={`w-9 h-6 rounded-md flex items-center justify-center ${
                                      isEven ? 'bg-white/20 text-white' : 'bg-[#c5a059]/20 text-[#c5a059]'
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[17px]">memory</span>
                                  </div>
                                </div>
                                <p className="text-[19px] font-mono tracking-widest mb-1 font-semibold">
                                  {bank.account_number}
                                </p>
                                <span
                                  className={`text-[11px] uppercase tracking-wider block mb-4 font-semibold ${
                                    isEven ? 'text-white/80' : 'text-[#eed08a]/80'
                                  }`}
                                >
                                  a.n {bank.account_holder}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyAccount(bank.account_number_raw || bank.account_number, index)
                                  }
                                  className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer ${
                                    isEven
                                      ? 'bg-white text-[#775a19] hover:bg-[#fbf9f6]'
                                      : 'bg-[#c5a059] text-stone-950 hover:bg-[#d8b56d]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                  <span>Salin No. Rekening</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Physical Gift Address */}
                    {(() => {
                      const effectiveAddress = data.gift_address || (isPreview ? MOCK_SUNDA_DATA.gift_address : '');
                      if (!effectiveAddress) return null;

                      return (
                        <div className="w-full max-w-sm rounded-3xl p-5 bg-white shadow-md flex flex-col items-center text-center border border-[#c5a059]/30 transition-all duration-300">
                          <div className="w-10 h-10 rounded-full bg-[#f4efe4] text-[#8a6822] flex items-center justify-center mb-2 border border-[#c5a059]/30">
                            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                          </div>
                          <h4 className="text-[16px] text-[#1b1c1a] font-serif font-bold mb-1">
                            Kirim Kado Fisik
                          </h4>
                          <p className="text-xs text-[#4e4639] mb-3 leading-relaxed break-words [overflow-wrap:anywhere]">
                            {effectiveAddress}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopyAddress(effectiveAddress)}
                            className="px-5 py-2 rounded-full bg-[#fbf9f6] hover:bg-[#f4efe4] text-[#1b1c1a] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#c5a059]/30"
                          >
                            <span className="material-symbols-outlined text-[16px]">file_copy</span>
                            <span>Salin Alamat</span>
                          </button>
                        </div>
                      );
                    })()}
                  </section>
                )}

                {/* ============================================================ */}
                {/* 9. CLOSING & SUNDANESE BLESSING                              */}
                {/* ============================================================ */}
                <footer className="w-full px-5 pt-10 pb-4 bg-[#fbf9f6] flex flex-col items-center text-center relative border-t border-[#ede9e1]">
                  <div className="w-20 h-8 flex items-center justify-center text-[#8a6822] mb-3">
                    <SigerCrownSvg />
                  </div>
                  <p className="text-xs text-[#4e4639] max-w-sm leading-relaxed mb-6">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                  </p>
                  <span className="text-[10px] font-bold text-[#8a6822] tracking-widest uppercase mb-1">
                    Kami yang berbahagia:
                  </span>
                  <h3 className="text-sm font-semibold text-[#1b1c1a] mb-1">
                    Keluarga {data.groom.parent_father || 'Mempelai Pria'}
                  </h3>
                  <h3 className="text-sm font-semibold text-[#1b1c1a] mb-6">
                    Keluarga {data.bride.parent_father || 'Mempelai Wanita'}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#c5a059]/40 my-4 rounded-full" />
                  <h2 className="text-2xl text-[#8a6822] font-serif italic mb-2">
                    {coupleOrderTitle}
                  </h2>
                  <p className="text-[10px] text-[#735855] tracking-widest uppercase mt-4">
                    © {new Date().getFullYear()} The Royal Sundanese Wedding of {coupleOrderTitle}
                  </p>

                  {/* Dynamic mbell Invitations Brand Signature Footer */}
                  {renderBrandFooter()}
                </footer>

              </div>

          </div>
        </main>

        {/* ============================================================ */}
        {/* 10. FLOATING AUDIO CONTROLLER BUBBLE                         */}
        {/* ============================================================ */}
        <FloatingDock isPreview={isPreview}>
          {isOpen && (
            <aside className={`${isPreview ? 'absolute' : 'fixed'} bottom-5 right-5 z-40 flex items-center justify-center pointer-events-auto`}>
              <button
                type="button"
                onClick={toggleMusic}
                aria-label="Putar Musik Gending Sunda"
                className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-[#b38728] to-[#8a6822] border border-[#ffe082]/40 shadow-xl transition-transform active:scale-95 cursor-pointer ring-1 ring-black/10"
              >
                <div
                  className={`w-9 h-9 rounded-full bg-[#2c241c] flex items-center justify-center ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[#e8c676] text-lg">
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
