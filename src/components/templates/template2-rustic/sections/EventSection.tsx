import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export const EventSection: React.FC<EventSectionProps> = ({
  data,
  isPreview,
}) => {
  return (
    <section id="acara-section" className="flex flex-col py-space-xl">
      <div className="text-center mb-space-xl reveal">
        <span className="text-xs text-[#8C4E2D] uppercase tracking-widest font-semibold font-sans">
          Save The Date
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C4034] font-bold mt-1">
          Rangkaian Acara
        </h3>
      </div>

      {data.events.map((event: any, idx: number) => {
        const icon =
          event.icon === 'ring' || event.icon === 'church'
            ? 'church'
            : event.icon === 'champagne-glasses' || event.icon === 'celebration'
              ? 'celebration'
              : idx === 0
                ? 'church'
                : 'celebration';

        const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
        const isCountdownEvent = idx === activeTargetIdx;

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-md border border-[#2C4034]/15 mb-space-lg relative overflow-hidden reveal-scale delay-150"
          >
            {/* Event Header: Category & Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 text-[#8C4E2D]">
                <span className="material-symbols-outlined text-[18px] shrink-0">
                  {icon}
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase font-sans">
                  {idx === 0 ? 'Akad Nikah' : 'Resepsi'}
                </span>
              </div>
              <span
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold leading-normal ${idx === 0
                  ? 'bg-[#2C4034] text-white shadow-2xs'
                  : 'bg-[#8C4E2D] text-white shadow-2xs'
                  }`}
              >
                {event.badge || (idx === 0 ? 'Khusus Keluarga Inti' : 'Sesi 1 & 2')}
              </span>
            </div>

            {/* Event Name */}
            <h4 className="font-serif text-xl sm:text-2xl text-[#2C4034] font-bold mb-4 break-words">
              {event.name}
            </h4>

            <div className="flex flex-col gap-3 text-xs text-[#4D5E53] mb-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8C4E2D] text-[20px] mt-0.5 shrink-0">
                  calendar_month
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#1E2E22] break-words [overflow-wrap:anywhere]">{event.date}</div>
                  <div className="text-[11px] text-[#526859] break-words [overflow-wrap:anywhere]">Pukul {event.time}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8C4E2D] text-[20px] mt-0.5 shrink-0">
                  location_on
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#1E2E22] break-words [overflow-wrap:anywhere]">{event.venue_name}</div>
                  <div className="text-[11px] text-[#526859] leading-relaxed break-words [overflow-wrap:anywhere]">{event.venue_address}</div>
                </div>
              </div>
            </div>

            {/* Interactive Real Google Maps Embed */}
            {isCountdownEvent && (
              <div className="w-full mb-3 rounded-xl overflow-hidden border border-[#2C4034]/15">
                <VenueMapEmbed
                  venueName={event.venue_name || 'Lokasi Pernikahan'}
                  venueAddress={event.venue_address}
                  mapsUrl={event.maps_url}
                  heightClass="h-44"
                  isPreview={isPreview}
                />
              </div>
            )}

            {/* Google Maps Button */}
            <a
              href={event.maps_url || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[46px] py-2.5 px-4 rounded-full bg-[#2C4034] hover:bg-[#1E2D24] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#2C4034]/20 text-center"
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">near_me</span>
              <span>Buka Google Maps</span>
            </a>
          </div>
        );
      })}
    </section>
  );
};
