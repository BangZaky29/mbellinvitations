import React from 'react';
import type { LoveStoryMilestone } from '../../types/invitation';
import { GalleryEditor } from './gifts-story-form/GalleryEditor';
import { LoveStoryEditor } from './gifts-story-form/LoveStoryEditor';

interface GalleryStoryFormCardProps {
  gallery?: string[];
  loveStory?: LoveStoryMilestone[];
  templateSlug?: string;
  userId?: string | null;
  userEmail?: string | null;
  userTemplateId?: string | null;
  onGalleryChange?: (gallery: string[]) => void;
  onLoveStoryChange: (story: LoveStoryMilestone[]) => void;
}

export const GalleryStoryFormCard: React.FC<GalleryStoryFormCardProps> = ({
  gallery = [],
  loveStory = [],
  templateSlug,
  userId,
  userEmail,
  userTemplateId,
  onGalleryChange,
  onLoveStoryChange,
}) => {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Galeri Foto &amp; Cerita Cinta
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Unggah koleksi foto prewedding dan bagikan momen perjalanan kisah cinta Anda berdua.
            </p>
          </div>
        </div>

        {/* 1. Gallery Section */}
        <GalleryEditor
          gallery={gallery}
          templateSlug={templateSlug}
          userId={userId}
          userEmail={userEmail}
          userTemplateId={userTemplateId}
          onGalleryChange={onGalleryChange}
        />

        <div className="border-t border-stone-100 my-4" />

        {/* 2. Love Story Section */}
        <LoveStoryEditor
          loveStory={loveStory}
          onLoveStoryChange={onLoveStoryChange}
        />
      </section>
    </div>
  );
};
