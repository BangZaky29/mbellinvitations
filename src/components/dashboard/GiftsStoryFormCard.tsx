import React from 'react';
import type { BankAccount, LoveStoryMilestone } from '../../types/invitation';
import { GalleryEditor } from './gifts-story-form/GalleryEditor';
import { LoveStoryEditor } from './gifts-story-form/LoveStoryEditor';
import { MusicPicker } from './gifts-story-form/MusicPicker';
import { BankAccountEditor } from './gifts-story-form/BankAccountEditor';

interface GiftsStoryFormCardProps {
  bankAccounts?: BankAccount[];
  loveStory?: LoveStoryMilestone[];
  gallery?: string[];
  musicUrl?: string;
  activeTabMode?: 'all' | 'story_gallery' | 'gifts';
  onBankAccountsChange: (accounts: BankAccount[]) => void;
  onLoveStoryChange: (story: LoveStoryMilestone[]) => void;
  onGalleryChange?: (gallery: string[]) => void;
  onMusicUrlChange: (url: string) => void;
  onSaveMusic?: (url: string) => void;
}

export const GiftsStoryFormCard: React.FC<GiftsStoryFormCardProps> = ({
  bankAccounts = [],
  loveStory = [],
  gallery = [],
  musicUrl,
  activeTabMode = 'all',
  onBankAccountsChange,
  onLoveStoryChange,
  onGalleryChange,
  onMusicUrlChange,
  onSaveMusic,
}) => {
  const showGifts = activeTabMode === 'all' || activeTabMode === 'gifts';
  const showStoryGallery = activeTabMode === 'all' || activeTabMode === 'story_gallery';

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-7">
      {showStoryGallery && (
        <>
          <GalleryEditor gallery={gallery} onGalleryChange={onGalleryChange} />
          <LoveStoryEditor loveStory={loveStory} onLoveStoryChange={onLoveStoryChange} />
          <MusicPicker
            musicUrl={musicUrl}
            onMusicUrlChange={onMusicUrlChange}
            onSaveMusic={onSaveMusic}
          />
        </>
      )}

      {showGifts && (
        <BankAccountEditor
          bankAccounts={bankAccounts}
          onBankAccountsChange={onBankAccountsChange}
        />
      )}
    </section>
  );
};
