import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export interface IslamiEventProps extends EventSectionProps {
  handleAddToCalendar?: () => void;
}

export const EventSection: React.FC<IslamiEventProps> = ({
  data,
  isPreview,
  handleAddToCalendar,
}) => {
  const onCalendarClick = () => {
    if (handleAddToCalendar) {
      handleAddToCalendar();
      return;
    }
    const title = encodeURIComponent(`Walimatul Ursy: ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Akad Nikah & Resepsi Pernikahan ${data.groom.full_name} dan ${data.bride.full_name}.`
    );
    const location = encodeURIComponent(
      data.events[1]?.venue_name || data.events[0]?.venue_name || 'Grand Asrilia Hotel Bandung'
    );
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20250524T010000Z/20250524T070000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
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

      {/* Akad Nikah Card */}
      {data.events[0] && (
        <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-6 shadow-md shadow-primary/5 mb-6 text-center flex flex-col items-center border border-secondary-container/20">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined text-[24px]">
              {data.events[0].icon || 'verified'}
            </span>
          </div>
          {data.events[0].badge && (
            <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-primary font-label-sm text-label-sm uppercase tracking-wider mb-2 font-semibold">
              {data.events[0].badge}
            </span>
          )}
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-3 break-words [overflow-wrap:anywhere] max-w-full">
            {data.events[0].name}
          </h3>
          <div className="space-y-2 mb-4 font-body-md text-body-md text-on-surface w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                calendar_today
              </span>
              <span className="break-words [overflow-wrap:anywhere]">{data.events[0].date}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                schedule
              </span>
              <span className="break-words [overflow-wrap:anywhere]">{data.events[0].time}</span>
            </div>
            <div className="flex items-start justify-center gap-2 max-w-[280px] mx-auto text-on-surface-variant text-center">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                location_on
              </span>
              <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                <strong className="block font-semibold text-primary">{data.events[0].venue_name}</strong>
                <span>{data.events[0].venue_address}</span>
              </span>
            </div>
          </div>

          {/* Interactive Real Google Maps Embed */}
          {(data.countdown_target !== 'resepsi' || !data.events[1]) && (
            <div className="w-full my-4">
              <VenueMapEmbed
                venueName={data.events[0].venue_name || 'Lokasi Akad Nikah'}
                venueAddress={data.events[0].venue_address}
                mapsUrl={data.events[0].maps_url}
                heightClass="h-44"
                isPreview={isPreview}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <a
              className="w-full py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
              href={data.events[0].maps_url || 'https://maps.google.com'}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">
                map
              </span>
              <span>Buka Google Maps</span>
            </a>
          </div>
        </div>
      )}

      {/* Resepsi Card */}
      {data.events[1] && (
        <div className="w-full bg-surface-container-lowest rounded-t-full rounded-b-2xl p-6 shadow-md shadow-primary/5 text-center flex flex-col items-center border border-secondary-container/20 overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined text-[24px]">
              {data.events[1].icon || 'diversity_3'}
            </span>
          </div>
          {data.events[1].badge && (
            <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-primary font-label-sm text-label-sm uppercase tracking-wider mb-2 font-semibold">
              {data.events[1].badge}
            </span>
          )}
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-3 break-words [overflow-wrap:anywhere] max-w-full">
            {data.events[1].name}
          </h3>
          <div className="space-y-2 mb-5 font-body-md text-body-md text-on-surface w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                calendar_today
              </span>
              <span className="break-words [overflow-wrap:anywhere]">{data.events[1].date}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                schedule
              </span>
              <span className="break-words [overflow-wrap:anywhere]">{data.events[1].time}</span>
            </div>
            <div className="flex items-start justify-center gap-2 max-w-[280px] mx-auto text-on-surface-variant text-center">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                apartment
              </span>
              <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                <strong className="block font-semibold text-primary">{data.events[1].venue_name}</strong>
                <span>{data.events[1].venue_address}</span>
              </span>
            </div>
          </div>

          {/* Interactive Real Google Maps Embed */}
          {data.countdown_target === 'resepsi' && (
            <div className="w-full my-4">
              <VenueMapEmbed
                venueName={data.events[1]?.venue_name || 'Lokasi Resepsi'}
                venueAddress={data.events[1]?.venue_address}
                mapsUrl={data.events[1]?.maps_url}
                heightClass="h-44"
                isPreview={isPreview}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <a
              className="w-full py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
              href={data.events[1].maps_url || 'https://maps.google.com'}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">
                map
              </span>
              <span>Buka Google Maps</span>
            </a>
            <button
              className="w-full py-3 px-4 rounded-full bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors cursor-pointer"
              id="btn-calendar"
              onClick={onCalendarClick}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                event_available
              </span>
              <span>Simpan ke Kalender</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
