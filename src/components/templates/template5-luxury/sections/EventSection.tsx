import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export interface LuxuryEventProps extends EventSectionProps {
  handleAddToCalendar?: () => void;
}

export const EventSection: React.FC<LuxuryEventProps> = ({
  data,
  isPreview,
  handleAddToCalendar,
}) => {
  const onCalendarClick = () => {
    if (handleAddToCalendar) {
      handleAddToCalendar();
      return;
    }
    const title = encodeURIComponent(`The Wedding of ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Holy Matrimony & Gala Reception of ${data.groom.full_name} and ${data.bride.full_name} at The St. Regis Jakarta.`
    );
    const location = encodeURIComponent(
      data.events[1]?.venue_name || data.events[0]?.venue_name || 'The St. Regis Jakarta'
    );
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261024T030000Z/20261024T160000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <section className="w-full px-margin py-12 flex flex-col items-center z-10" id="events">
      <div className="text-center mb-8">
        <span className="font-label-eyebrow text-primary tracking-[0.25em] text-[10px] uppercase block mb-1">
          Itinerary
        </span>
        <h2 className="font-headline-lg-mobile text-on-surface font-normal">
          EVENT DETAILS
        </h2>
      </div>

      {/* Event Cards List */}
      {data.events.map((event: any, idx: number) => {
        const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
        const isCountdownEvent = idx === activeTargetIdx;
        const defaultBadge = idx === 0 ? 'Chapter I' : idx === 1 ? 'Chapter II' : `Chapter ${idx + 1}`;
        const dressCodeText = idx === 0
          ? 'Formal Modest Black-Tie / Tuxedo'
          : 'Midnight Black-Tie & Evening Gown (Black, Champagne, Dark Emerald)';
        const dressCodeIcon = idx === 0 ? 'checkroom' : 'styler';

        return (
          <div
            key={event.title || idx}
            className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 mb-5 shadow-xl shadow-surface-container-lowest/60 border border-white/5 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="shrink-0 inline-block px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-eyebrow text-[9px] uppercase tracking-wider">
                {event.badge || defaultBadge}
              </span>
              <span className="shrink-0 font-label-md text-secondary text-xs">
                {event.time}
              </span>
            </div>
            <h3 className="font-headline-sm text-on-surface text-lg mb-1 break-words [overflow-wrap:anywhere]">
              {event.title || event.name}
            </h3>
            <div className="flex items-start gap-2 mb-3 text-secondary">
              <span className="material-symbols-outlined text-sm text-primary mt-0.5 shrink-0">
                location_on
              </span>
              <p className="font-body-sm text-xs leading-snug min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                <strong className="block text-on-surface font-semibold">{event.venue_name || event.location_name}</strong>
                <span className="text-on-surface-variant text-[11px] block">
                  {event.venue_address || event.address}
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-container/70 flex items-center gap-2.5 mb-3">
              <span className="material-symbols-outlined text-primary text-base shrink-0">
                {dressCodeIcon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-label-eyebrow text-[9px] text-secondary uppercase tracking-widest">
                  Dress Code
                </p>
                <p className="font-body-sm text-on-surface text-xs break-words [overflow-wrap:anywhere]">
                  {dressCodeText}
                </p>
              </div>
            </div>

            {/* Interactive Real Google Maps Embed */}
            {isCountdownEvent && (
              <div className="w-full my-3">
                <VenueMapEmbed
                  venueName={event.venue_name || event.location_name || 'Lokasi Acara'}
                  venueAddress={event.venue_address || event.address}
                  mapsUrl={event.maps_url}
                  heightClass="h-44"
                  isPreview={isPreview}
                />
              </div>
            )}

            {/* Google Maps Button */}
            <a
              className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-2 font-label-md uppercase tracking-wider text-xs transition-colors shadow-md border border-white/5"
              href={event.maps_url || 'https://maps.google.com'}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-primary text-base">map</span>
              <span>Open in Google Maps</span>
            </a>
          </div>
        );
      })}

      {/* Add to Calendar Button */}
      <div className="w-full max-w-[360px] flex flex-col gap-2.5">
        <button
          className="w-full py-3 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary flex items-center justify-center gap-2 font-label-md uppercase tracking-wider text-xs transition-colors border border-white/5 cursor-pointer"
          onClick={onCalendarClick}
          type="button"
        >
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <span>Add to Calendar</span>
        </button>
      </div>
    </section>
  );
};
