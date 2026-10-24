import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

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
    <section className="relative w-full px-4 py-8 flex flex-col items-center bg-[#19120E] text-[#FAF6EE]">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-1.5 text-[#EAC16E]">
        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
        <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold">
          Jadwal &amp; Lokasi Acara
        </span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#EAC16E] tracking-wide text-center mb-6">
        Rangkaian Acara Pesta Adat
      </h2>

      {/* Dynamic Events Timeline */}
      <div className="relative w-full max-w-[360px] flex flex-col gap-6">
        {/* Continuous Track Line if more than 1 event: perfectly centered at left-4 (16px) */}
        {events.length > 1 && (
          <div className="absolute top-[18px] bottom-[18px] left-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#EAC16E] via-[#C8A253] to-[#85291B] opacity-60 pointer-events-none z-0" />
        )}

        {events.map((ev: any, idx: number) => {
          const isCountdownEvent = idx === activeTargetIdx;
          const venueTitle = ev.title || ev.name || `Sesi Acara #${idx + 1}`;
          const sessionName = ev.name || `Sesi ${idx + 1}`;
          const venueName = ev.venue_name || ev.location_name || 'Gedung Pernikahan';
          const venueAddr = ev.venue_address || ev.address || '';
          const displayDate = ev.date || data.wedding_date_display || '';
          
          // Format Time
          const displayTime =
            ev.time ||
            (ev.start_time
              ? `${ev.start_time} - ${ev.end_time || 'Selesai'} ${ev.timezone || 'WIB'}`
              : '09.00 WIB');

          const iconName =
            ev.icon ||
            (idx === 0
              ? 'church'
              : idx === 1
              ? 'celebration'
              : 'schedule');

          return (
            <div key={idx} className="relative flex items-start gap-3 z-10">
              {/* Timeline Marker Node Column: exactly w-8 (32px), centered at 16px */}
              <div className="w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(234,193,110,0.5)] transition-all ${
                    isCountdownEvent
                      ? 'bg-[#EAC16E] text-[#402D00] ring-2 ring-[#EAC16E]/60 ring-offset-2 ring-offset-[#19120E]'
                      : 'bg-[#261E1A] text-[#EAC16E] border border-[#EAC16E]/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">
                    {iconName}
                  </span>
                </div>
              </div>

              {/* Event Card */}
              <div
                className={`bg-[#261E1A] rounded-2xl p-4 sm:p-5 flex-1 min-w-0 shadow-lg flex flex-col border transition-all overflow-hidden ${
                  isCountdownEvent
                    ? 'border-[#EAC16E] ring-1 ring-[#EAC16E]/40'
                    : 'border-[#EAC16E]/20'
                }`}
              >
                {/* Event Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="font-sans text-[11px] font-bold text-[#EAC16E] tracking-wider uppercase">
                    {sessionName}
                  </span>
                  {isCountdownEvent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EAC16E] text-[#402D00] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      <span>Acara Utama</span>
                    </span>
                  )}
                </div>

                {/* Judul Acara */}
                <h3 className="font-serif text-lg sm:text-[19px] font-bold text-[#FAF6EE] leading-snug break-words [overflow-wrap:anywhere]">
                  {venueTitle}
                </h3>

                {/* Tanggal & Waktu */}
                <div className="my-2.5 space-y-1.5 font-sans text-xs text-[#D1C5B3] border-t border-[#EAC16E]/15 pt-2.5">
                  {displayDate && (
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#EAC16E] shrink-0">
                        calendar_today
                      </span>
                      <span className="font-semibold text-[#FAF6EE]">{displayDate}</span>
                    </p>
                  )}

                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#EAC16E] shrink-0">
                      schedule
                    </span>
                    <span className="text-[#FAF6EE]">{displayTime}</span>
                  </p>

                  <div className="flex items-start gap-2 pt-1">
                    <span className="material-symbols-outlined text-[16px] text-[#EAC16E] shrink-0 mt-0.5">
                      location_on
                    </span>
                    <div className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                      <strong className="text-[#FAF6EE] block font-semibold">{venueName}</strong>
                      {venueAddr && (
                        <span className="text-[11px] text-[#D1C5B3]/80 leading-relaxed block mt-0.5">
                          {venueAddr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge khusus jika ada (misal: Sakramen Kudus / Gondang Sabangunan) */}
                {ev.badge && (
                  <div className="mb-2 py-1 px-2.5 rounded-lg bg-[#19120E]/80 border border-[#EAC16E]/20 flex items-center gap-1.5 text-[11px] text-[#EAC16E]">
                    <span className="material-symbols-outlined text-[14px] shrink-0">
                      info
                    </span>
                    <span className="break-words [overflow-wrap:anywhere]">{ev.badge}</span>
                  </div>
                )}

                {/* Peta Interaktif Google Maps HANYA pada acara utama countdown */}
                {isCountdownEvent && (
                  <div className="w-full my-3 rounded-xl overflow-hidden border border-[#EAC16E]/30 shadow-md">
                    <VenueMapEmbed
                      venueName={venueName}
                      venueAddress={venueAddr}
                      mapsUrl={ev.maps_url}
                      heightClass="h-44"
                      isPreview={isPreview}
                    />
                  </div>
                )}

                {/* Tombol CTA Google Maps */}
                <a
                  href={ev.maps_url || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-[#85291B] hover:bg-[#630F05] text-[#FFDAD4] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                  <span>Petunjuk Lokasi (Google Maps)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EventSection;
