import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export const EventSection: React.FC<EventSectionProps> = ({
  data,
  isPreview,
}) => {
  return (
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
  );
};

export default EventSection;
