import React from 'react';
import type { InvitationData, ThemeConfig } from '../../../types/invitation';
import { StepSelectorNav } from '../../../components/dashboard/StepSelectorNav';
import { ThemePickerCard } from '../../../components/dashboard/ThemePickerCard';
import { CoupleFormCard } from '../../../components/dashboard/CoupleFormCard';
import { EventsFormCard } from '../../../components/dashboard/EventsFormCard';
import { GiftsStoryFormCard } from '../../../components/dashboard/GiftsStoryFormCard';
import { AnimationSettingsCard } from '../../../components/dashboard/AnimationSettingsCard';
import { computeCoupleSlug } from '../helpers/computeCoupleSlug';

interface EditorStepContentProps {
  activeStep: number;
  formData: InvitationData;
  themeConfig: ThemeConfig;
  publishedThemeId?: string | null;
  onSelectStep: (step: number) => void;
  onThemeChange: (themeId: string) => void;
  onApplyPreset: (themeId: string) => void;
  onSlugChange: (slug: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<InvitationData>>;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  onEventsChange: (events: any) => void;
  onSetCountdownTarget?: (target: 'akad' | 'resepsi') => void;
  onManualSave: () => void;
  onSaveMusicOnly?: (url: string) => void;
}

export const EditorStepContent: React.FC<EditorStepContentProps> = ({
  activeStep,
  formData,
  themeConfig,
  publishedThemeId = null,
  onSelectStep,
  onThemeChange,
  onApplyPreset,
  onSlugChange,
  setFormData,
  setThemeConfig,
  onEventsChange,
  onSetCountdownTarget,
  onManualSave,
  onSaveMusicOnly,
}) => {
  return (
    <>
      {/* STEP NAVIGATION CAROUSEL (NO-SCROLLBAR) */}
      <StepSelectorNav activeStep={activeStep} onSelectStep={onSelectStep} />

      {/* CONDITIONAL RENDERING BERDASARKAN activeStep */}
      {activeStep === 1 && (
        <ThemePickerCard
          activeThemeId={formData.theme_id || 'modern'}
          unlockedTemplates={formData.unlocked_templates}
          paidTemplateId={formData.paid_template_id}
          isPaid={formData.is_paid}
          publishedThemeId={publishedThemeId}
          onSelectTheme={onThemeChange}
          onThemeSelect={onThemeChange}
          onApplyPreset={onApplyPreset}
        />
      )}

      {activeStep === 2 && (
        <CoupleFormCard
          groom={formData.groom}
          bride={formData.bride}
          isBrideFirst={formData.is_bride_first}
          coverImage={formData.cover_image || formData.couple_photo || ''}
          slug={formData.slug || computeCoupleSlug(formData.groom?.name, formData.bride?.name) || 'undangan-baru'}
          onSlugChange={onSlugChange}
          onGroomChange={(groom) => {
            const newGName = groom.name || '';
            const currentBName = formData.bride?.name || '';
            const autoSlug = computeCoupleSlug(newGName, currentBName);
            setFormData((prev) => ({
              ...prev,
              groom,
              slug: autoSlug,
            }));
          }}
          onBrideChange={(bride) => {
            const currentGName = formData.groom?.name || '';
            const newBName = bride.name || '';
            const autoSlug = computeCoupleSlug(currentGName, newBName);
            setFormData((prev) => ({
              ...prev,
              bride,
              slug: autoSlug,
            }));
          }}
          onToggleBrideFirst={(isBrideFirst) => setFormData({ ...formData, is_bride_first: isBrideFirst })}
          onCoverChange={(cover_image) => setFormData({ ...formData, cover_image, couple_photo: cover_image })}
        />
      )}

      {activeStep === 3 && (
        <EventsFormCard
          events={formData.events}
          countdownTarget={formData.countdown_target || 'akad'}
          onSetCountdownTarget={onSetCountdownTarget}
          onEventsChange={onEventsChange}
        />
      )}

      {activeStep === 4 && (
        <GiftsStoryFormCard
          activeTabMode="story_gallery"
          loveStory={formData.love_story || []}
          gallery={formData.gallery || []}
          musicUrl={formData.music_url || themeConfig.music_url || ''}
          onLoveStoryChange={(love_story) => setFormData({ ...formData, love_story })}
          onGalleryChange={(gallery) => setFormData({ ...formData, gallery })}
          onMusicUrlChange={(music_url) => {
            setFormData((prev) => ({ ...prev, music_url }));
            setThemeConfig((prev) => ({ ...prev, music_url }));
          }}
          onSaveMusic={(url) => {
            if (onSaveMusicOnly) {
              onSaveMusicOnly(url);
            } else if (onManualSave) {
              onManualSave();
            }
          }}
          onBankAccountsChange={() => { }}
        />
      )}

      {activeStep === 5 && (
        <GiftsStoryFormCard
          activeTabMode="gifts"
          bankAccounts={formData.banks || formData.bank_accounts || []}
          onBankAccountsChange={(banks) => setFormData({ ...formData, banks, bank_accounts: banks })}
          onLoveStoryChange={() => { }}
          onMusicUrlChange={(music_url) => {
            setFormData((prev) => ({ ...prev, music_url }));
            setThemeConfig((prev) => ({ ...prev, music_url }));
          }}
          onSaveMusic={(url) => {
            if (onSaveMusicOnly) {
              onSaveMusicOnly(url);
            } else if (onManualSave) {
              onManualSave();
            }
          }}
        />
      )}

      {activeStep === 6 && (
        <AnimationSettingsCard
          themeConfig={themeConfig}
          onThemeConfigChange={(newConfig) => {
            setThemeConfig(newConfig);
            setFormData((prev) => ({
              ...prev,
              theme_config: newConfig,
            }));
          }}
        />
      )}
    </>
  );
};
