import React from 'react';
import type { InvitationData } from '../../../../types/invitation';
import {
  CandiBentarDivider,
  BaliPatraWatermark,
  BaliCornerFiligree,
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
  const events = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents && typeof rawEvents === 'object'
      ? Object.values(rawEvents)
      : [];

  const activeTargetIdx =
    data.countdown_target === 'resepsi' && events.length > 1 ? 1 : 0;

  return (
    <div className="relative w-full">
      {/* Top Transition Wave SVG from Cream to Deep Terracotta */}
      <div className="w-full overflow-hidden leading-none z-10 -mb-1 bg-[#F3EDE4]">
        <svg
          className="w-full h-7 text-[#5C2C23]"
          fill="none"
          viewBox="0 0 430 28"
          preserveAspectRatio="none"
        >
          <path
            d="M0 28L25 10L68 22L120 6L182 18L240 4L310 20L375 8L430 28V28H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <section className="relative w-full bg-[#5C2C23] text-[#FFF9EF] px-4 py-8 flex flex-col items-center overflow-hidden">
        {/* Patra Sari Gold Watermark on Deep Terracotta */}
        <BaliPatraWatermark color="#D4AF37" opacityClass="opacity-[0.06]" />

        <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">
          {/* Header Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[#FED65B] text-base">hotel_class</span>
              <span className="font-sans text-[10px] text-[#FED65B] uppercase tracking-[0.25em] font-bold">
                Tata Upacara
              </span>
              <span className="material-symbols-outlined text-[#FED65B] text-base">hotel_class</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#FFF9EF]">
              Rangkaian Acara Adat
            </h3>
            <p className="font-sans text-xs text-[#F3EDE4]/80 mt-1">
              Waktu Indonesia Tengah (WITA) • Yadnya Pawiwahan
            </p>
            <CandiBentarDivider compact color="#FED65B" className="mt-2" />
          </div>

          {/* Vertical Timeline with Centered Axis (Rule 7) */}
          <div className="relative w-full pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#FED65B]/40">
            {events.map((ev: any, idx: number) => {
              const isCountdownEvent = idx === activeTargetIdx;
              const eventTitle = ev.title || ev.name || `Prosesi ${idx + 1}`;
              const eventTime =
                ev.time ||
                (ev.start_time
                  ? `${ev.start_time} - ${ev.end_time || 'Selesai'} ${ev.timezone || 'WITA'}`
                  : '09:00 WITA');
              const venueName = ev.venue_name || ev.location_name || 'Puri Santrian Sanctuary';
              const venueAddress =
                ev.venue_address || ev.address || 'Ubud, Gianyar, Bali';

              return (
                <div key={idx} className="relative">
                  {/* Timeline Node Point (Rule 7 formula) */}
                  <div className="absolute -left-[30px] top-1.5 w-6 h-6 rounded-full bg-[#FED65B] flex items-center justify-center shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5C2C23]" />
                  </div>

                  {/* Event Card (Card Integrity: Rule 8) */}
                  <div className="relative bg-[#411710]/90 border border-[#FED65B]/35 rounded-2xl p-4.5 sm:p-5 shadow-lg backdrop-blur-md overflow-hidden">
                    {/* Corner Ornaments */}
                    <BaliCornerFiligree position="top-left" className="absolute top-1 left-1 w-5 h-5" color="#FED65B" />
                    <BaliCornerFiligree position="top-right" className="absolute top-1 right-1 w-5 h-5" color="#FED65B" />

                    {/* Badge Waktu & Acara Mendatang */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span className="font-sans text-[10px] text-[#FED65B] uppercase tracking-wider font-bold">
                        {eventTime}
                      </span>
                      {isCountdownEvent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FED65B]/20 border border-[#FED65B]/40 text-[#FED65B] text-[9px] font-sans font-bold tracking-wider uppercase">
                          Acara Utama
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h4 className="font-serif text-lg text-[#FFF9EF] font-bold break-words [overflow-wrap:anywhere]">
                      {eventTitle}
                    </h4>

                    {/* Event Date */}
                    {ev.date && (
                      <div className="flex items-center gap-1.5 text-xs text-[#FED65B] font-medium mt-1">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        <span>{ev.date}</span>
                      </div>
                    )}

                    {/* Venue Name & Address (Anti-overflow: Rule 8) */}
                    <div className="mt-2.5 pt-2.5 border-t border-[#FED65B]/20 flex flex-col gap-1">
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#FED65B] shrink-0 mt-0.5">
                          location_on
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs font-bold text-[#FFF9EF] break-words [overflow-wrap:anywhere]">
                            {venueName}
                          </p>
                          <p className="font-sans text-[11px] text-[#F3EDE4]/80 mt-0.5 leading-relaxed break-words [overflow-wrap:anywhere]">
                            {venueAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Real Google Maps Embed (Hanya pada Acara Mendatang: Rule 6) */}
                    {isCountdownEvent && (
                      <div className="w-full mt-3.5 mb-1 overflow-hidden rounded-xl border border-[#FED65B]/30 shadow-md">
                        <VenueMapEmbed
                          venueName={venueName}
                          venueAddress={venueAddress}
                          mapsUrl={ev.maps_url}
                          heightClass="h-40"
                          isPreview={isPreview}
                        />
                      </div>
                    )}

                    {/* Tombol CTA Google Maps (SELALU TAMPIL di setiap card acara: Rule 6) */}
                    <a
                      href={ev.maps_url || 'https://maps.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FED65B] text-[#411710] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
                    >
                      <span className="material-symbols-outlined text-base">near_me</span>
                      <span>Petunjuk Lokasi (Google Maps)</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Transition Wave SVG back to Sandstone Cream */}
      <div className="w-full overflow-hidden leading-none z-10 -mb-1 bg-[#5C2C23]">
        <svg
          className="w-full h-6 text-[#FFF9EF]"
          fill="none"
          viewBox="0 0 430 24"
          preserveAspectRatio="none"
        >
          <path
            d="M0 24C80 8 160 22 240 8C320 -6 380 18 430 24V24H0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

