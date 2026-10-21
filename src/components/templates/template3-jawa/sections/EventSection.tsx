import React from 'react';
import type { EventSectionProps } from '../../types';
import { VenueMapEmbed } from '../../../common/VenueMapEmbed';

export const EventSection: React.FC<EventSectionProps> = ({
  data,
  isPreview,
}) => {
  return (
    <section
      id="acara"
      className="relative w-full bg-surface-container-low px-margin py-space-xl flex flex-col items-center"
    >
      <div className="text-center mb-8">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1">
          Rantamaning Adicara
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          Pawiwahan &amp; Resepsi
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant italic mt-1">
          Sinartan berkah donga pangestu panjenengan sami
        </p>
      </div>

      {data.events.map((event: any, idx: number) => {
        const badgeIcon = idx === 0 ? 'verified' : 'celebration';
        const badgeText = event.badge || (idx === 0 ? 'Ijab Qobul' : 'Panggih & Pahargyan');
        const headerSub = idx === 0 ? 'Sasana Ageng' : 'Resepsi Ageng';

        const activeTargetIdx = data.countdown_target === 'resepsi' && data.events.length > 1 ? 1 : 0;
        const isCountdownEvent = idx === activeTargetIdx;

        return (
          <div
            key={idx}
            className="w-full bg-surface-container rounded-2xl p-space-md shadow-xl mb-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-sm">{badgeIcon}</span>
                <span className="font-label-md text-label-md uppercase tracking-wider">
                  {badgeText}
                </span>
              </div>
              <span className="font-caption text-caption text-secondary">
                {headerSub}
              </span>
            </div>

            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 break-words [overflow-wrap:anywhere]">
              {event.name}
            </h3>

            <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                  calendar_today
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface font-semibold break-words [overflow-wrap:anywhere]">{event.date}</p>
                  <p className="font-caption text-caption break-words [overflow-wrap:anywhere]">Dinten Berkah Mulya</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                  schedule
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface font-semibold break-words [overflow-wrap:anywhere]">{event.time}</p>
                  <p className="font-caption text-caption break-words [overflow-wrap:anywhere]">Kanthi khidmad kawiwitan tepat wekdal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                  account_balance
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface font-semibold break-words [overflow-wrap:anywhere]">{event.venue_name}</p>
                  <p className="font-caption text-caption leading-relaxed break-words [overflow-wrap:anywhere]">{event.venue_address}</p>
                </div>
              </div>
            </div>

            {/* Interactive Real Google Maps Embed (Hanya untuk Acara Mendatang Terpilih) */}
            {isCountdownEvent && (
              <div className="w-full mt-4 mb-3">
                <VenueMapEmbed
                  venueName={event.venue_name || 'Kraton Yogyakarta Hadiningrat'}
                  venueAddress={event.venue_address}
                  mapsUrl={event.maps_url}
                  heightClass="h-44"
                  isPreview={isPreview}
                />
              </div>
            )}

            {/* Google Maps CTA Button (Selalu tampil di setiap card acara) */}
            <a
              href={event.maps_url || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 py-3 px-6 rounded-full bg-gradient-to-r from-primary-fixed-dim via-primary to-secondary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-lg">map</span>
              <span className="tracking-wider">BUKA GOOGLE MAPS</span>
            </a>
          </div>
        );
      })}
    </section>
  );
};
