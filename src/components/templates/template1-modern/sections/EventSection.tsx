import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export const EventSection: React.FC<EventSectionProps> = ({
  data,
  isPreview,
}) => {
  return (
    <section id="event" className="py-12 px-6">
      <div className="text-center mb-10 reveal">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Agenda &amp; Lokasi
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Rangkaian Acara
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 font-light">
          Merupakan kehormatan atas kehadiran dan doa restu Anda
        </p>
      </div>

      <div className="space-y-6">
        {data.events.map((event: any, idx: number) => {
          const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
          const isCountdownEvent = idx === activeTargetIdx;

          return (
            <div
              key={idx}
              className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm relative overflow-hidden reveal-scale delay-150"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-light/40 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-center space-x-2 text-gold-champagne mb-2">
                <i
                  className={`text-sm ${event.icon === 'champagne-glasses'
                    ? 'fa-solid fa-champagne-glasses'
                    : 'fa-solid fa-ring'
                    }`}
                ></i>
                <span className="text-[11px] tracking-[0.25em] uppercase font-semibold">
                  {event.name}
                </span>
              </div>

              <h3 className="font-editorial text-2xl text-charcoal-dark font-medium break-words [overflow-wrap:anywhere]">
                {event.title}
              </h3>

              <div className="my-4 py-3 border-y border-border-subtle space-y-2 text-xs text-charcoal-muted">
                <div className="flex items-center space-x-3">
                  <i className="fa-regular fa-calendar text-gold-champagne w-4 text-center shrink-0"></i>
                  <span className="font-medium text-charcoal-dark min-w-0 flex-1 break-words [overflow-wrap:anywhere]">{event.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fa-regular fa-clock text-gold-champagne w-4 text-center shrink-0"></i>
                  <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">{event.time}</span>
                </div>
                <div className="flex items-start space-x-3 pt-1">
                  <i className="fa-solid fa-location-dot text-gold-champagne w-4 text-center mt-0.5 shrink-0"></i>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-charcoal-dark block break-words [overflow-wrap:anywhere]">
                      {event.venue_name}
                    </span>
                    <span className="font-light leading-relaxed break-words [overflow-wrap:anywhere]">
                      {event.venue_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
              {isCountdownEvent && (
                <div className="w-full mb-4">
                  <VenueMapEmbed
                    venueName={event.venue_name}
                    venueAddress={event.venue_address}
                    mapsUrl={event.maps_url}
                    heightClass="h-40"
                    isPreview={isPreview}
                  />
                </div>
              )}

              {/* Google Maps Button (Selalu tampil di setiap card acara) */}
              <a
                href={event.maps_url || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-charcoal-dark text-white text-xs tracking-[0.15em] uppercase font-medium flex items-center justify-center space-x-2 hover:bg-gold-champagne transition-colors shadow"
              >
                <i className="fa-solid fa-location-arrow text-xs"></i>
                <span>Buka Google Maps</span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};
