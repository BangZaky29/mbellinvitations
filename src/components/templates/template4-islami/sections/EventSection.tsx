import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';
import { openGoogleCalendar } from '../../../../utils/calendarHelper';

export interface IslamiEventProps extends EventSectionProps {
  handleAddToCalendar?: () => void;
}

export const EventSection: React.FC<IslamiEventProps> = ({
  data,
  isPreview,
  handleAddToCalendar,
}) => {
  const onCalendarClick = (eventItem?: any) => {
    if (eventItem) {
      openGoogleCalendar(data, eventItem);
      return;
    }
    if (handleAddToCalendar) {
      handleAddToCalendar();
      return;
    }
    openGoogleCalendar(data);
  };

  return (
    <section
      className="px-margin py-space-xl flex flex-col items-center"
      id="acara"
    >
      <div className="text-center mb-8">
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
          Agenda Pernikahan
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Waktu &amp; Tempat
        </h2>
        <div className="w-12 h-0.5 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Event Cards List */}
      {data.events.map((event: any, idx: number) => {
        const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
        const isCountdownEvent = idx === activeTargetIdx;
        const isFirst = idx === 0;
        const defaultIcon = isFirst ? 'verified' : 'diversity_3';
        const defaultLocationIcon = isFirst ? 'location_on' : 'apartment';

        return (
          <div
            key={event.title || idx}
            className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-6 shadow-md shadow-primary/5 mb-6 text-center flex flex-col items-center border border-secondary-container/20 overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-[24px]">
                {event.icon || defaultIcon}
              </span>
            </div>
            {event.badge && (
              <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-primary font-label-sm text-label-sm uppercase tracking-wider mb-2 font-semibold">
                {event.badge}
              </span>
            )}
            <h3 className="font-headline-md text-headline-md text-primary font-bold mb-3 break-words [overflow-wrap:anywhere] max-w-full">
              {event.title || event.name}
            </h3>
            <div className="space-y-2 mb-4 font-body-md text-body-md text-on-surface w-full">
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                  calendar_today
                </span>
                <span className="break-words [overflow-wrap:anywhere]">{event.date}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                  schedule
                </span>
                <span className="break-words [overflow-wrap:anywhere]">{event.time}</span>
              </div>
              <div className="flex items-start justify-center gap-2 max-w-[280px] mx-auto text-on-surface-variant text-center">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                  {defaultLocationIcon}
                </span>
                <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                  <strong className="block font-semibold text-primary">{event.venue_name || event.location_name}</strong>
                  <span>{event.venue_address || event.address}</span>
                </span>
              </div>
            </div>

            {/* Interactive Real Google Maps Embed */}
            {isCountdownEvent && (
              <div className="w-full my-4">
                <VenueMapEmbed
                  venueName={event.venue_name || event.location_name || 'Lokasi Acara'}
                  venueAddress={event.venue_address || event.address}
                  mapsUrl={event.maps_url}
                  heightClass="h-44"
                  isPreview={isPreview}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5">
              <a
                className="w-full py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
                href={event.maps_url || 'https://maps.google.com'}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">
                  map
                </span>
                <span>Buka Google Maps</span>
              </a>
              <button
                className="w-full py-2.5 px-4 rounded-full bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer border border-secondary-container/30 active:scale-95"
                onClick={() => onCalendarClick(event)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  event_available
                </span>
                <span>Simpan ke Google Calendar</span>
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
};
