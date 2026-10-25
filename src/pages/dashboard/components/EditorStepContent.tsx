import React from 'react';
import type { InvitationData, ThemeConfig, DresscodeConfig } from '../../../types/invitation';
import { StepSelectorNav } from '../../../components/dashboard/StepSelectorNav';
import { ThemePickerCard } from '../../../components/dashboard/ThemePickerCard';
import { SectionVisibilityCard } from '../../../components/dashboard/SectionVisibilityCard';
import { CoupleFormCard } from '../../../components/dashboard/CoupleFormCard';
import { PrayerDresscodeFormCard } from '../../../components/dashboard/PrayerDresscodeFormCard';
import { EventsFormCard } from '../../../components/dashboard/EventsFormCard';
import { GalleryStoryFormCard } from '../../../components/dashboard/GalleryStoryFormCard';
import { GiftsFormCard } from '../../../components/dashboard/GiftsFormCard';
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
  // Handler sinkronisasi toggle section dua arah (SSOT: Single Source of Truth)
  const handleSectionToggle = (sectionKey: string, isActive: boolean) => {
    // 1. Update themeConfig.active_sections
    const currentSections = new Set(
      themeConfig.active_sections || [
        'quote',
        'couple',
        'events',
        'dresscode',
        'story',
        'gallery',
        'rsvp',
        'wishes',
        'gifts',
        'live_stream',
        'closing',
      ]
    );

    if (isActive) {
      currentSections.add(sectionKey);
      if (sectionKey === 'livestream') currentSections.add('live_stream');
      if (sectionKey === 'live_stream') currentSections.add('livestream');
    } else {
      currentSections.delete(sectionKey);
      if (sectionKey === 'livestream') currentSections.delete('live_stream');
      if (sectionKey === 'live_stream') currentSections.delete('livestream');
    }
    const updatedSections = Array.from(currentSections);

    const updatedThemeConfig: ThemeConfig = {
      ...themeConfig,
      active_sections: updatedSections,
      ...(sectionKey === 'dresscode' ? { show_dresscode: isActive } : {}),
      ...(sectionKey === 'quote' ? { show_quote: isActive } : {}),
      ...(sectionKey === 'livestream' || sectionKey === 'live_stream'
        ? { show_livestream: isActive }
        : {}),
    };

    setThemeConfig(updatedThemeConfig);

    // 2. Jika yang diubah adalah dresscode, sinkronkan ke formData.dresscode.enabled
    if (sectionKey === 'dresscode') {
      setFormData((prev) => ({
        ...prev,
        theme_config: updatedThemeConfig,
        dresscode: {
          enabled: isActive,
          title: prev.dresscode?.title || 'Panduan Busana (Dresscode)',
          subtitle:
            prev.dresscode?.subtitle ||
            'Kami menyarankan para tamu mengenakan pakaian yang selaras:',
          colors:
            prev.dresscode?.colors && prev.dresscode.colors.length > 0
              ? prev.dresscode.colors
              : [],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        theme_config: updatedThemeConfig,
      }));
    }
  };

  // Handler update konfigurasi Doa / Quote
  const handleQuoteChange = (patch: {
    quote?: string;
    quote_source?: string;
    quote_arabic?: string;
    quote_religion?: string;
    quote_title?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  // Handler update konfigurasi Dresscode
  const handleDresscodeChange = (dresscode: DresscodeConfig) => {
    setFormData((prev) => ({
      ...prev,
      dresscode,
    }));

    // Pastikan show_dresscode di themeConfig selaras
    if (themeConfig.show_dresscode !== dresscode.enabled) {
      const currentSections = new Set(themeConfig.active_sections || []);
      if (dresscode.enabled) {
        currentSections.add('dresscode');
      } else {
        currentSections.delete('dresscode');
      }
      const updatedConfig: ThemeConfig = {
        ...themeConfig,
        show_dresscode: dresscode.enabled,
        active_sections: Array.from(currentSections),
      };
      setThemeConfig(updatedConfig);
    }
  };

  return (
    <>
      {/* STEP NAVIGATION CAROUSEL (8 LANGKAH) */}
      <StepSelectorNav activeStep={activeStep} onSelectStep={onSelectStep} />

      {/* 1. PILIH TEMA */}
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

      {/* 2. FITUR & VISIBILITAS BAGIAN UNDANGAN */}
      {activeStep === 2 && (
        <SectionVisibilityCard
          themeConfig={themeConfig}
          formData={formData}
          onThemeConfigChange={(newConfig) => {
            setThemeConfig(newConfig);
            setFormData((prev) => ({ ...prev, theme_config: newConfig }));
          }}
          onSectionToggle={handleSectionToggle}
        />
      )}

      {/* 3. DATA & FOTO MEMPELAI */}
      {activeStep === 3 && (
        <CoupleFormCard
          groom={formData.groom}
          bride={formData.bride}
          isBrideFirst={formData.is_bride_first}
          coverImage={formData.cover_image || formData.couple_photo || ''}
          slug={
            formData.slug ||
            computeCoupleSlug(formData.groom?.name, formData.bride?.name) ||
            'undangan-baru'
          }
          templateSlug={formData.theme_id || formData.template_id || 'template_1'}
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
          onToggleBrideFirst={(isBrideFirst) =>
            setFormData({ ...formData, is_bride_first: isBrideFirst })
          }
          onCoverChange={(cover_image) =>
            setFormData({ ...formData, cover_image, couple_photo: cover_image })
          }
        />
      )}

      {/* 4. DOA, AYAT SUCI & PANDUAN BUSANA (DRESSCODE) */}
      {activeStep === 4 && (
        <PrayerDresscodeFormCard
          formData={formData}
          onQuoteChange={handleQuoteChange}
          onDresscodeChange={handleDresscodeChange}
          onToggleDresscode={(enabled) => handleSectionToggle('dresscode', enabled)}
        />
      )}

      {/* 5. RANGKAIAN ACARA (AKAD, RESEPSI & MAPS) */}
      {activeStep === 5 && (
        <EventsFormCard
          events={formData.events}
          countdownTarget={formData.countdown_target || 'akad'}
          onSetCountdownTarget={onSetCountdownTarget}
          onEventsChange={onEventsChange}
          streamingUrl={formData.streaming_url || formData.livestream_url || ''}
          onStreamingUrlChange={(url) => {
            setFormData((prev) => ({
              ...prev,
              streaming_url: url,
              livestream_url: url,
            }));
          }}
        />
      )}

      {/* 6. GALERI FOTO & KISAH CINTA */}
      {activeStep === 6 && (
        <GalleryStoryFormCard
          templateSlug={formData.theme_id || formData.template_id || 'template_1'}
          loveStory={formData.love_story || []}
          gallery={formData.gallery || []}
          onLoveStoryChange={(love_story) => setFormData({ ...formData, love_story })}
          onGalleryChange={(gallery) => setFormData({ ...formData, gallery })}
        />
      )}

      {/* 7. AMPLOP DIGITAL & HADIAH */}
      {activeStep === 7 && (
        <GiftsFormCard
          bankAccounts={formData.banks || formData.bank_accounts || []}
          giftAddress={formData.gift_address || ''}
          onBankAccountsChange={(banks) =>
            setFormData({ ...formData, banks, bank_accounts: banks })
          }
          onGiftAddressChange={(gift_address) =>
            setFormData((prev) => ({ ...prev, gift_address }))
          }
        />
      )}

      {/* 8. MUSIK LATAR & EFEK ANIMASI VISUAL */}
      {activeStep === 8 && (
        <AnimationSettingsCard
          themeConfig={themeConfig}
          musicUrl={formData.music_url || themeConfig.music_url || ''}
          onThemeConfigChange={(newConfig) => {
            setThemeConfig(newConfig);
            setFormData((prev) => ({
              ...prev,
              theme_config: newConfig,
            }));
          }}
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
    </>
  );
};
