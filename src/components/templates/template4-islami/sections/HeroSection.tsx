import React from 'react';
import type { HeroSectionProps } from '../../types';

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  countdown,
}) => {
  return (
    <section
      className="px-margin py-space-xl flex flex-col items-center text-center"
      id="salam"
    >
      {/* Moroccan Dome Framed Hero Couple Portrait */}
      <div className="w-full max-w-[340px] rounded-t-full rounded-b-2xl bg-surface-container-lowest p-3 shadow-xl shadow-primary/5 flex flex-col items-center border border-secondary-container/30 mb-8 reveal-scale">
        <div className="relative w-full rounded-t-full rounded-b-xl overflow-hidden bg-gradient-to-b from-secondary-container/30 to-surface-container-low p-2">
          <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-lg overflow-hidden bg-surface-container-high/60 shadow-inner flex items-center justify-center">
            <img
              className="w-full h-full object-cover"
              alt={`${data.groom.name} & ${data.bride.name}`}
              src={
                data.couple_photo ||
                data.cover_image ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9L8ISRUM7mLqvnPG1IUud4itXFzYibGb-gsVdr2o8XOghzC2pdxs3o4Y2QQOZT5FDELCcHb1hQXs0m_y-Ug4bTBYR_zj1eXdzZ_EYzKQ5aJLGJsYRXpgssNhtGWT6egpeoVh-gBwyzuhPmyDGWnAET59APKBr1X9uYdaxY7TpdT6rg3zm48_6s4Va2AuaAL7-qkj_lnVIPqmYeb4KJVg6qBDlsZ1TKkNe3MGDcM_G9le8id4Vh3few'
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-3 inset-x-3 text-center">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold px-3.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-xs">
                {data.hashtag || 'Walimatul Ursy'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calligraphy Banner */}
      <div className="mb-4">
        <p
          className="font-serif text-2xl tracking-widest text-primary font-medium"
          dir="rtl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* Islamic Warm Greeting */}
      <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
        Assalamu’alaikum Warahmatullahi Wabarakatuh
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-[340px] mb-6">
        Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
        Dengan memohon rahmat dan ridho-Nya, kami mengundang Anda untuk
        merayakan momen suci kami.
      </p>

      {/* Dome Shaped Quranic Verse Card */}
      <div className="w-full rounded-t-full rounded-b-2xl bg-surface-container-lowest p-6 shadow-md shadow-primary/5 mb-8 flex flex-col items-center border border-secondary-container/20 reveal-scale delay-100">
        <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary mb-4">
          <span className="material-symbols-outlined text-[22px]">
            auto_stories
          </span>
        </div>
        <p
          className="font-serif text-lg leading-relaxed text-primary mb-4"
          dir="rtl"
        >
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
          لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
          إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant italic mb-2">
          "{data.quote}"
        </p>
        <span className="font-label-sm text-label-sm text-primary font-semibold tracking-wider">
          ({data.quote_source || 'QS. Ar-Rum: 21'})
        </span>
      </div>

      {/* Wedding Date Header */}
      <div className="mb-4">
        <span className="font-label-md text-label-md text-secondary tracking-widest uppercase font-semibold">
          Menuju Hari Bahagia
        </span>
        <h3 className="font-headline-md text-headline-md text-primary mt-1">
          {data.wedding_date_display}
        </h3>
      </div>

      {/* 4-Column Rose-Gold Countdown Grid */}
      <div
        className="grid grid-cols-4 gap-2 w-full max-w-[360px] reveal delay-200"
        id="countdown-timer"
      >
        <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
            {String(countdown.days).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
            Hari
          </span>
        </div>
        <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
            {String(countdown.hours).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
            Jam
          </span>
        </div>
        <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
            {String(countdown.minutes).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
            Menit
          </span>
        </div>
        <div className="rounded-t-2xl rounded-b-lg bg-surface-container-lowest p-3 flex flex-col items-center shadow-sm border border-secondary-container/20">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
            {String(countdown.seconds).padStart(2, '0')}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
            Detik
          </span>
        </div>
      </div>
    </section>
  );
};
