import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  RumahLimasDivider,
  PalembangSongketWatermark,
  PalembangCornerFiligree,
} from '../components';
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
  const events: any[] = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents && typeof rawEvents === 'object'
      ? Object.values(rawEvents)
      : [];

  const targetIdx =
    data.countdown_target === 'resepsi' && events.length > 1
      ? events.length - 1
      : 0;

  const eventIcons = ['menu_book', 'stars', 'restaurant', 'celebration'];
  const eventTags = ['Sakral', 'Adat Agung', 'Resepsi', 'Syukuran'];

  return (
    <section className="relative w-full shrink-0 bg-[#4A0E12] text-[#FDF9F2] px-4 pt-6 pb-12 flex flex-col items-center overflow-hidden">
      {/* Background Watermark */}
      <PalembangSongketWatermark opacityClass="opacity-[0.07]" showPucukBorders />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-8">
          <RumahLimasDivider
            compact
            subTitle="Munggah • Resepsi Agung"
            className="mb-1"
          />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF9F2] mt-1">
            Rangkaian Prosesi Adat
          </h2>
          <p className="font-sans text-xs text-[#FFD57A]/80 mt-1">
            Mengikuti prosesi sakral Kesultanan Palembang Darussalam
          </p>
        </div>

        {/* Timeline Processions */}
        <div className="w-full relative flex flex-col gap-6 pl-4 before:content-[''] before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-[#FFD57A]/30">
          {events.map((evt, idx) => {
            const isTarget = idx === targetIdx;
            const icon = eventIcons[idx % eventIcons.length];
            const tag = eventTags[idx % eventTags.length];
            const timeStr = evt.time || `${evt.start_time || '08.00'} - ${evt.end_time || 'Selesai'} ${evt.timezone || 'WIB'}`;

            return (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Timeline Icon Node */}
                <div className="w-8 h-8 rounded-full bg-[#2A0003] text-[#FFD57A] border border-[#FFD57A]/60 flex items-center justify-center shrink-0 z-10 shadow-md">
                  <span className="material-symbols-outlined text-[16px]">{icon}</span>
                </div>

                {/* Event Card (Card Integrity: overflow-hidden, break-words) */}
                <div className="bg-[#2A0003]/85 border border-[#FFD57A]/35 p-4 sm:p-5 rounded-2xl shadow-md w-full relative overflow-hidden">
                  <PalembangCornerFiligree position="top-right" className="absolute top-1.5 right-1.5 w-4 h-4 opacity-70" color="#FFD57A" />

                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="font-sans text-[10px] text-[#FFD57A] tracking-wider uppercase font-bold">
                      {timeStr}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9.5px] bg-[#785A05] text-[#FFD57A] font-bold uppercase tracking-wider shrink-0 border border-[#FFD57A]/30">
                      {tag}
                    </span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg text-[#FDF9F2] font-bold break-words [overflow-wrap:anywhere]">
                    {evt.title || evt.name}
                  </h4>

                  <p className="font-sans text-xs text-[#FFD57A] mt-1 font-semibold">
                    {evt.date || data.wedding_date_display}
                  </p>

                  {evt.description && (
                    <p className="font-sans text-xs text-[#F1EDE6]/90 mt-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {evt.description}
                    </p>
                  )}

                  {/* Venue Address */}
                  <div className="mt-3 pt-2.5 border-t border-[#FFD57A]/20">
                    <p className="font-sans text-[11px] font-bold text-[#FDF9F2] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#FFD57A]">location_on</span>
                      <span>{evt.venue_name || 'The Grand Sriwijaya Royal Ballroom'}</span>
                    </p>
                    <p className="font-sans text-[10px] text-[#F1EDE6]/80 mt-0.5 leading-snug">
                      {evt.venue_address || 'Jl. Jenderal Sudirman No. 88, Kota Palembang, Sumatera Selatan'}
                    </p>
                  </div>

                  {/* Interactive Map Embed on Target Event (Rule 6) */}
                  {isTarget && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-[#FFD57A]/30 shadow-inner">
                      <VenueMapEmbed
                        venueName={evt.venue_name || 'The Grand Sriwijaya Royal Ballroom'}
                        venueAddress={evt.venue_address || 'Jl. Jenderal Sudirman No. 88, Kota Palembang'}
                        mapsUrl={evt.maps_url || evt.map_url || 'https://maps.google.com'}
                        isPreview={isPreview}
                      />
                    </div>
                  )}

                  {/* Google Maps CTA Button */}
                  <div className="mt-3">
                    <a
                      href={evt.maps_url || evt.map_url || 'https://maps.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-r from-[#785A05] via-[#EAC168] to-[#785A05] text-[#2A0003] font-sans text-xs font-bold shadow hover:brightness-105 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">near_me</span>
                      <span>Petunjuk Lokasi (Google Maps)</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

