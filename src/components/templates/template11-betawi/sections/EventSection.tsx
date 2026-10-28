import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';
import {
  TornPaperDivider,
  BetawiBatikWatermark,
  BetawiCornerFloral,
} from '../components';

interface EventSectionProps {
  data: InvitationData;
  isPreview?: boolean;
}

export const EventSection: React.FC<EventSectionProps> = ({
  data,
  isPreview = false,
}) => {
  const rawEvents = data.events;
  const events = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents && typeof rawEvents === 'object'
    ? Object.values(rawEvents)
    : [];

  const activeTargetIdx =
    data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Torn Paper Transition (Ivory to Maroon) */}
      <TornPaperDivider direction="ivory-to-maroon" fillColor="#410403" />

      {/* RITUAL & TRADISI PALANG PINTU (Rich Betawi Maroon) */}
      <section className="relative w-full bg-[#410403] text-[#FAF6EE] px-4 pt-6 pb-10 flex flex-col items-center overflow-hidden">
        {/* Pernak-pernik Batik Betawi Motif Pucuk Rebung Watermark */}
        <BetawiBatikWatermark opacityClass="opacity-[0.06]" />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 z-10">
          <div className="w-10 h-10 rounded-full bg-[#FED65B]/20 text-[#FED65B] flex items-center justify-center mb-2 border border-[#FED65B]/30">
            <span className="material-symbols-outlined text-[20px]">
              sports_martial_arts
            </span>
          </div>
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#FED65B] uppercase">
            RITUAL &amp; SAKRALITAS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FCF9F3] font-bold leading-tight mt-1">
            Rangkaian Acara &amp; Tradisi
          </h2>
          <p className="font-serif text-xs text-[#E5E2DC]/80 mt-1">
            {data.wedding_date_display || 'Sabtu, 19 Desember 2026'} • Waktu Indonesia Barat (WIB)
          </p>
        </div>

        {/* Dynamic Events Timeline with Precision Axis */}
        <div className="relative w-full max-w-[360px] flex flex-col gap-6 z-10">
          {/* Continuous Track Line if more than 1 event: perfectly centered at left-4 (16px) */}
          {events.length > 1 && (
            <div className="absolute top-[18px] bottom-[18px] left-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#FED65B] via-[#FFE088] to-[#FED65B]/40 opacity-50 pointer-events-none z-0" />
          )}

          {events.map((ev: any, idx: number) => {
            const isCountdownEvent = idx === activeTargetIdx;
            const venueTitle = ev.title || ev.name || `Sesi Acara #${idx + 1}`;
            const sessionBadge = ev.badge || (idx === 0 ? 'Tradisi Adat' : idx === 1 ? 'Akad Khidmat' : 'Hajatan Akbar');
            const venueName = ev.venue_name || ev.location_name || 'The Grand Batavia Heritage Ballroom';
            const venueAddr = ev.venue_address || ev.address || '';
            const displayDate = ev.date || data.wedding_date_display || '';

            const displayTime =
              ev.time ||
              (ev.start_time
                ? `${ev.start_time} - ${ev.end_time || 'Selesai'} ${ev.timezone || 'WIB'}`
                : '08:00 WIB');

            const iconName =
              ev.icon ||
              (idx === 0
                ? 'sports_martial_arts'
                : idx === 1
                ? 'auto_stories'
                : 'celebration');

            return (
              <div key={idx} className="relative flex items-start gap-3 z-10">
                {/* Timeline Marker Node Column: exactly w-8 (32px), centered at 16px */}
                <div className="w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(254,214,91,0.4)] transition-all ${
                      isCountdownEvent
                        ? 'bg-[#FED65B] text-[#410403] ring-2 ring-[#FED65B]/60 ring-offset-2 ring-offset-[#410403]'
                        : 'bg-[#5E1914] text-[#FED65B] border border-[#FED65B]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] font-bold">
                      {iconName}
                    </span>
                  </div>
                </div>

                {/* Event Card (Card Integrity: overflow-hidden, break-words) */}
                <div
                  className={`bg-[#5E1914]/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex-1 min-w-0 shadow-lg flex flex-col border transition-all relative overflow-hidden ${
                    isCountdownEvent
                      ? 'border-[#FED65B] ring-1 ring-[#FED65B]/50'
                      : 'border-[#FED65B]/25'
                  }`}
                >
                  <BetawiCornerFloral position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#FED65B]/35" />
                  <BetawiCornerFloral position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#FED65B]/35" />
                  {/* Badges: Time & Procession */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="font-sans text-[11px] font-bold text-[#FED65B] tracking-wider uppercase">
                      {displayTime}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#003B0A] text-[#AAF5A2] text-[10px] font-bold uppercase tracking-wider shadow-xs border border-[#387D39]/40">
                      {sessionBadge}
                    </span>
                  </div>

                  {/* Judul Acara */}
                  <h3 className="font-serif text-lg sm:text-[19px] font-bold text-[#FCF9F3] leading-snug break-words [overflow-wrap:anywhere] mb-1">
                    {venueTitle}
                  </h3>

                  {/* Tanggal & Waktu */}
                  <div className="flex items-center gap-1.5 text-xs text-[#FFE088]/90 font-serif mb-3">
                    <span className="material-symbols-outlined text-[14px] text-[#FED65B]">
                      event
                    </span>
                    <span>{displayDate}</span>
                  </div>

                  {/* Lokasi Gedung & Alamat */}
                  <div className="flex items-start gap-2 text-xs text-[#FAF6EE] mb-4 bg-black/20 p-2.5 rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-[16px] text-[#FED65B] shrink-0 mt-0.5">
                      location_on
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold font-serif text-[#FAF6EE] break-words [overflow-wrap:anywhere]">
                        {venueName}
                      </p>
                      {venueAddr && (
                        <p className="text-[11px] text-[#E5E2DC]/80 font-sans mt-0.5 break-words [overflow-wrap:anywhere] leading-relaxed">
                          {venueAddr}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rule 6: Embed Peta HANYA jika acara ini adalah Acara Mendatang / target countdown */}
                  {isCountdownEvent && (
                    <div className="w-full mb-3.5 rounded-xl overflow-hidden border border-[#FED65B]/30 shadow-md">
                      <VenueMapEmbed
                        venueName={venueName}
                        venueAddress={venueAddr}
                        mapsUrl={ev.maps_url}
                        heightClass="h-40"
                        isPreview={isPreview}
                      />
                    </div>
                  )}

                  {/* Tombol CTA Google Maps SELALU TAMPIL di setiap card acara */}
                  <a
                    href={ev.maps_url || 'https://maps.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-full bg-[#FED65B] text-[#410403] text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#FFE088] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      near_me
                    </span>
                    <span>Petunjuk Lokasi (Google Maps)</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
