import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export const EventSection: React.FC<EventSectionProps> = ({
  data,
  isPreview,
}) => {
  const events = Array.isArray(data.events)
    ? data.events
    : Object.values(data.events || {});

  const activeTargetIdx =
    data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;

  const primaryEvent = events[activeTargetIdx] || events[0] || {};
  const mainVenueName =
    primaryEvent.venue_name || primaryEvent.location_name || 'The Grand Zuri Royal Ballroom & Pelaminan';
  const mainVenueAddress =
    primaryEvent.venue_address ||
    primaryEvent.address ||
    'Jl. M. Tamrin No. 27, Alang Laweh, Kec. Padang Selatan, Kota Padang, Sumatera Barat 25133';
  const mainMapsUrl = primaryEvent.maps_url || 'https://maps.google.com/?q=The+Grand+Zuri+Hotel+Padang';

  return (
    <section
      id="acara"
      className="bg-[#1B0609] text-[#FAF6EE] px-5 pt-8 pb-12 bg-texture-noise relative"
      style={{ backgroundColor: '#1B0609', color: '#FAF6EE' }}
    >
      {/* Section Title */}
      <div className="text-center mb-8">
        <span className="font-script text-2xl text-[#F5E296]">Agenda Baralek</span>
        <h3 className="font-cinzel text-2xl font-bold tracking-wider text-gold-shimmer">
          RANGKAIAN ACARA
        </h3>
        <p className="font-sans text-[11px] text-[#FAF6EE]/70 tracking-widest uppercase mt-1">
          {data.wedding_date_display || 'Sabtu, 24 Oktober 2026'}
        </p>
        <div className="w-12 h-0.5 bg-[#D4AF37]/60 mx-auto mt-2" />
      </div>

      {/* Vertical Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#E5C158] before:to-[#7D5C1E]">
        {events.map((ev: any, idx: number) => {
          const isCountdownEvent = idx === activeTargetIdx;
          const venueName = ev.venue_name || ev.location_name || 'Lokasi Acara';
          const venueAddress = ev.venue_address || ev.address || '';
          const mapsUrl = ev.maps_url || 'https://maps.google.com';

          return (
            <div key={ev.title || idx} className="relative group">
              {/* Timeline Marker Node */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#1B0609] border-2 border-[#D4AF37] flex items-center justify-center shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#F5E296]" />
              </div>

              {/* Event Card Container */}
              <div
                className={`bg-[#2E0A10] p-4 rounded-xl border relative overflow-hidden transition-all shadow-md ${
                  isCountdownEvent
                    ? 'border-[#D4AF37]/70 shadow-gold-card ring-1 ring-[#D4AF37]/30'
                    : 'border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                  <span className="text-[10px] font-sans font-bold text-[#F5E296] tracking-widest uppercase bg-[#D4AF37]/20 px-2.5 py-0.5 rounded border border-[#D4AF37]/40 shrink-0">
                    {ev.time || `${ev.start_time || '08.00'} - ${ev.end_time || 'Selesai'}`}
                  </span>
                  {isCountdownEvent && (
                    <span className="text-[9.5px] text-[#F5E296] font-cinzel font-semibold tracking-wider bg-[#1B0609]/90 px-2 py-0.5 rounded border border-[#D4AF37]/40">
                      ACARA UTAMA
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#FAF6EE] mt-1 break-words [overflow-wrap:anywhere]">
                  {ev.title || ev.name}
                </h4>

                {ev.date && (
                  <p className="text-xs text-[#FAF6EE]/70 font-sans mt-0.5 mb-2">
                    {ev.date}
                  </p>
                )}

                {/* Location detail row */}
                <div className="mt-2.5 pt-2.5 border-t border-[#D4AF37]/25 flex items-start gap-2 text-xs text-[#FAF6EE]/90 font-sans">
                  <span className="material-symbols-outlined text-[17px] text-[#D4AF37] shrink-0 mt-0.5">
                    location_on
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#FAF6EE] break-words [overflow-wrap:anywhere]">
                      {venueName}
                    </p>
                    {venueAddress && (
                      <p className="text-[11px] text-[#FAF6EE]/70 leading-relaxed mt-0.5 break-words [overflow-wrap:anywhere]">
                        {venueAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badge/Dresscode info if any */}
                {ev.badge && (
                  <div className="mt-2.5 py-1.5 px-2.5 rounded-lg bg-[#1B0609]/70 border border-[#D4AF37]/30 flex items-center gap-1.5 text-[11px] text-[#F5E296] font-medium">
                    <span className="material-symbols-outlined text-[14px] shrink-0 text-[#D4AF37]">
                      info
                    </span>
                    <span className="break-words [overflow-wrap:anywhere]">
                      {ev.badge}
                    </span>
                  </div>
                )}

                {/* Tombol CTA Google Maps */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-[#1B0609] font-sans font-bold text-xs uppercase tracking-widest shadow-md hover:brightness-105 transition-all cursor-pointer"
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

      {/* Lokasi Acara Real Google Maps Showcase Card (Matches Foto 3) */}
      <div className="mt-10 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 bg-[#2E0A10] shadow-2xl">
        <div className="relative w-full">
          <VenueMapEmbed
            venueName={mainVenueName}
            venueAddress={mainVenueAddress}
            mapsUrl={mainMapsUrl}
            heightClass="h-48"
            isPreview={isPreview}
          />
        </div>
        <div className="p-5 text-center">
          <span className="inline-block px-3 py-1 bg-[#4A121A] rounded border border-[#D4AF37]/40 text-[10px] font-cinzel text-[#F5E296] uppercase tracking-wider font-semibold mb-2 shadow-xs">
            LOKASI ACARA
          </span>
          <h4 className="font-serif text-xl font-bold text-gold-shimmer break-words [overflow-wrap:anywhere]">
            {mainVenueName}
          </h4>
          <p className="text-xs text-[#FAF6EE]/80 font-sans mt-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
            {mainVenueAddress}
          </p>
          <a
            href={mainMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl gold-gradient-btn text-[#1B0609] font-sans font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-105 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">location_on</span>
            <span>Petunjuk Lokasi (Google Maps)</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventSection;
