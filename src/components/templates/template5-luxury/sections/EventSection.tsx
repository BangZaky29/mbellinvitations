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

      {/* Matrimony Card */}
      {data.events[0] && (
        <div className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 mb-5 shadow-xl shadow-surface-container-lowest/60 border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="shrink-0 inline-block px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-eyebrow text-[9px] uppercase tracking-wider">
              {data.events[0].badge || 'Chapter I'}
            </span>
            <span className="shrink-0 font-label-md text-secondary text-xs">
              {data.events[0].time}
            </span>
          </div>
          <h3 className="font-headline-sm text-on-surface text-lg mb-1 break-words [overflow-wrap:anywhere]">
            {data.events[0].name}
          </h3>
          <div className="flex items-start gap-2 mb-3 text-secondary">
            <span className="material-symbols-outlined text-sm text-primary mt-0.5 shrink-0">
              location_on
            </span>
            <p className="font-body-sm text-xs leading-snug min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
              <strong className="block text-on-surface font-semibold">{data.events[0].venue_name}</strong>
              <span className="text-on-surface-variant text-[11px] block">
                {data.events[0].venue_address}
              </span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-container/70 flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-primary text-base shrink-0">
              checkroom
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-label-eyebrow text-[9px] text-secondary uppercase tracking-widest">
                Dress Code
              </p>
              <p className="font-body-sm text-on-surface text-xs break-words [overflow-wrap:anywhere]">
                Formal Modest Black-Tie / Tuxedo
              </p>
            </div>
          </div>

          {/* Interactive Real Google Maps Embed */}
          {(data.countdown_target !== 'resepsi' || !data.events[1]) && (
            <div className="w-full my-3">
              <VenueMapEmbed
                venueName={data.events[0].venue_name || 'Lokasi Akad'}
                venueAddress={data.events[0].venue_address}
                mapsUrl={data.events[0].maps_url}
                heightClass="h-44"
                isPreview={isPreview}
              />
            </div>
          )}

          {/* Google Maps Button */}
          <a
            className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-2 font-label-md uppercase tracking-wider text-xs transition-colors shadow-md border border-white/5"
            href={data.events[0].maps_url || 'https://maps.google.com'}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-primary text-base">map</span>
            <span>Open in Google Maps</span>
          </a>
        </div>
      )}

      {/* Gala Reception Card */}
      {data.events[1] && (
        <div className="w-full max-w-[360px] rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-5 mb-6 shadow-xl shadow-surface-container-lowest/60 border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="shrink-0 inline-block px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-eyebrow text-[9px] uppercase tracking-wider">
              {data.events[1].badge || 'Chapter II'}
            </span>
            <span className="shrink-0 font-label-md text-secondary text-xs">
              {data.events[1].time}
            </span>
          </div>
          <h3 className="font-headline-sm text-on-surface text-lg mb-1 break-words [overflow-wrap:anywhere]">
            {data.events[1].name}
          </h3>
          <div className="flex items-start gap-2 mb-3 text-secondary">
            <span className="material-symbols-outlined text-sm text-primary mt-0.5 shrink-0">
              location_on
            </span>
            <p className="font-body-sm text-xs leading-snug min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
              <strong className="block text-on-surface font-semibold">{data.events[1].venue_name}</strong>
              <span className="text-on-surface-variant text-[11px] block">
                {data.events[1].venue_address}
              </span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-container/70 flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-primary text-base shrink-0">
              styler
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-label-eyebrow text-[9px] text-secondary uppercase tracking-widest">
                Dress Code
              </p>
              <p className="font-body-sm text-on-surface text-xs break-words [overflow-wrap:anywhere]">
                Midnight Black-Tie &amp; Evening Gown (Black, Champagne, Dark Emerald)
              </p>
            </div>
          </div>

          {/* Interactive Real Google Maps Embed */}
          {data.countdown_target === 'resepsi' && (
            <div className="w-full my-3">
              <VenueMapEmbed
                venueName={data.events[1]?.venue_name || 'Lokasi Resepsi'}
                venueAddress={data.events[1]?.venue_address}
                mapsUrl={data.events[1]?.maps_url}
                heightClass="h-44"
                isPreview={isPreview}
              />
            </div>
          )}

          {/* Google Maps Button */}
          <a
            className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-2 font-label-md uppercase tracking-wider text-xs transition-colors shadow-md border border-white/5"
            href={data.events[1].maps_url || 'https://maps.google.com'}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-primary text-base">map</span>
            <span>Open in Google Maps</span>
          </a>
        </div>
      )}

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
