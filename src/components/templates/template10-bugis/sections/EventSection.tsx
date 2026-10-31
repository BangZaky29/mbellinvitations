import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';
import { openGoogleCalendar } from '../../../../utils/calendarHelper';
import {
  BugisTenunWatermark,
  BugisCornerOrnament,
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
      {/* RITUAL & TRADISI TUDANG BOTTUNG (Deep Royal Emerald) */}
      <section className="relative w-full bg-[#00170E] text-[#C8EAD8] px-4 pt-6 pb-10 flex flex-col items-center overflow-hidden">
        {/* Pernak-pernik Tenun Sa'be Watermark */}
        <BugisTenunWatermark opacityClass="opacity-[0.06]" />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 z-10">
          <div className="w-10 h-10 rounded-full bg-[#052519] text-[#F2CA50] flex items-center justify-center mb-2 border border-[#F2CA50]/30 shadow-md">
            <span className="material-symbols-outlined text-[20px]">
              local_fire_department
            </span>
          </div>
          <span className="font-sans text-[11px] font-bold tracking-[0.25em] text-[#F2CA50] uppercase">
            Rangkaian Acara Adat
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#C8EAD8] font-bold leading-tight mt-1">
            Tudang Bottung &amp; Mappacci
          </h2>
          <p className="font-sans text-xs text-[#D7C594] mt-1 max-w-xs mx-auto">
            Mengikuti prosesi luhur adat Bugis-Makassar yang sakral dan penuh keberkahan.
          </p>
        </div>

        {/* Dynamic Events Timeline with Precision Axis (Rule 7) */}
        <div className="relative w-full max-w-[360px] flex flex-col gap-6 z-10">
          {/* Continuous Track Line: centered at left-4 (16px) */}
          {events.length > 1 && (
            <div className="absolute top-[18px] bottom-[18px] left-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#F2CA50] via-[#D4AF37]/60 to-[#F2CA50]/20 pointer-events-none z-0" />
          )}

          {events.map((ev: any, idx: number) => {
            const isCountdownEvent = idx === activeTargetIdx;
            const venueTitle = ev.title || ev.name || `Sesi Acara #${idx + 1}`;
            const sessionBadge =
              ev.badge ||
              (idx === 0
                ? 'Malam Pensucian'
                : idx === 1
                ? 'Akad Khidmat'
                : 'Puncak Acara');
            const venueName =
              ev.venue_name ||
              ev.location_name ||
              'The Phinisi Grand Ballroom • Hotel Claro Makassar';
            const venueAddr = ev.venue_address || ev.address || '';
            const displayDate = ev.date || data.wedding_date_display || '';

            const displayTime =
              ev.time ||
              (ev.start_time
                ? `${ev.start_time} - ${ev.end_time || 'Selesai'} ${ev.timezone || 'WITA'}`
                : '09:00 WITA');

            const iconName =
              ev.icon ||
              (idx === 0
                ? 'spa'
                : idx === 1
                ? 'favorite'
                : 'celebration');

            return (
              <div key={idx} className="relative flex items-start gap-3 z-10">
                {/* Timeline Marker Node Column: exactly w-8 (32px), centered at 16px */}
                <div className="w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(242,202,80,0.4)] transition-all ${
                      isCountdownEvent
                        ? 'bg-[#F2CA50] text-[#00170E] ring-2 ring-[#F2CA50]/60 ring-offset-2 ring-offset-[#00170E]'
                        : 'bg-[#052519] text-[#F2CA50] border border-[#F2CA50]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] font-bold">
                      {iconName}
                    </span>
                  </div>
                </div>

                {/* Event Card (Card Integrity: overflow-hidden, break-words) */}
                <div
                  className={`bg-[#052519]/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex-1 min-w-0 shadow-lg flex flex-col border transition-all relative overflow-hidden ${
                    isCountdownEvent
                      ? 'border-[#F2CA50] ring-1 ring-[#F2CA50]/50'
                      : 'border-[#F2CA50]/25'
                  }`}
                >
                  <BugisCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 w-5 h-5 text-[#F2CA50]/30" />
                  <BugisCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 w-5 h-5 text-[#F2CA50]/30" />

                  {/* Badges: Time & Procession */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="font-sans text-[11px] font-bold text-[#F2CA50] tracking-wider uppercase">
                      {displayTime}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2CA50]/15 text-[#F2CA50] text-[10px] font-bold uppercase tracking-wider border border-[#F2CA50]/30">
                      {sessionBadge}
                    </span>
                  </div>

                  {/* Judul Acara */}
                  <h3 className="font-serif text-lg sm:text-[19px] font-bold text-[#C8EAD8] leading-snug break-words [overflow-wrap:anywhere] mb-1">
                    {venueTitle}
                  </h3>

                  {/* Tanggal Acara */}
                  <div className="flex items-center gap-1.5 text-xs text-[#D7C594] font-sans mb-3">
                    <span className="material-symbols-outlined text-[14px] text-[#F2CA50]">
                      event
                    </span>
                    <span>{displayDate}</span>
                  </div>

                  {/* Lokasi Gedung & Alamat */}
                  <div className="flex items-start gap-2 text-xs text-[#C8EAD8] mb-4 bg-black/30 p-2.5 rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-[16px] text-[#F2CA50] shrink-0 mt-0.5">
                      location_on
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold font-serif text-[#C8EAD8] break-words [overflow-wrap:anywhere]">
                        {venueName}
                      </p>
                      {venueAddr && (
                        <p className="text-[11px] text-[#D0C5AF]/90 font-sans mt-0.5 break-words [overflow-wrap:anywhere] leading-relaxed">
                          {venueAddr}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rule 6: Embed Peta HANYA jika acara ini adalah Acara Mendatang / target countdown */}
                  {isCountdownEvent && (
                    <div className="w-full mb-3.5 rounded-xl overflow-hidden border border-[#F2CA50]/30 shadow-md">
                      <VenueMapEmbed
                        venueName={venueName}
                        venueAddress={venueAddr}
                        mapsUrl={ev.maps_url}
                        heightClass="h-40"
                        isPreview={isPreview}
                      />
                    </div>
                  )}

                  {/* Tombol Aksi: Google Maps & Simpan ke Google Calendar */}
                  <div className="flex flex-col gap-2 w-full">
                    <a
                      href={ev.maps_url || 'https://maps.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-full bg-[#F2CA50] text-[#00170E] text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#FFE088] active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        near_me
                      </span>
                      <span>Petunjuk Lokasi (Google Maps)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => openGoogleCalendar(data, ev)}
                      className="w-full py-2 rounded-full bg-white/10 hover:bg-white/15 text-[#F2CA50] border border-[#F2CA50]/30 text-xs font-sans font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        calendar_add_on
                      </span>
                      <span>Ingatkan Sesi Ini di Google Calendar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

