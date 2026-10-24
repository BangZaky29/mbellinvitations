import React, { useState, useEffect, useCallback } from 'react';
import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';
import { Template1Modern } from '../templates/Template1Modern';
import { Template2Rustic } from '../templates/Template2Rustic';
import { Template3Jawa } from '../templates/Template3Jawa';
import { Template4Islami } from '../templates/Template4Islami';
import { Template5Luxury } from '../templates/Template5Luxury';
import { TemplateSundaSiger } from '../templates/TemplateSundaSiger';
import { TemplateMinangBaralek } from '../templates/Template7Minang';
import { TemplateBatakToba } from '../templates/Template8Batak';
import { PreviewToolbar } from './phone-preview/PreviewToolbar';
import { PhoneFrame } from './phone-preview/PhoneFrame';
import {
  buildSafePreviewData,
  resolveEffectiveTheme,
} from './phone-preview/helpers';
import { computeCoupleSlug } from '../../pages/dashboard/helpers/computeCoupleSlug';
import { getInvitationDisplayUrl } from '../../utils/urlHelper';
import { submitRsvp, submitWish } from '../../lib/supabaseClient';

export interface PhoneMockupPreviewProps {
  data: InvitationData;
  theme: ThemeConfig;
  wishes?: WishItem[];
  previewUrl?: string;
  onClose?: () => void;
  invitationId?: string | null;
}

export const PhoneMockupPreview: React.FC<PhoneMockupPreviewProps> = ({
  data,
  theme,
  wishes = [],
  previewUrl,
  onClose,
  invitationId,
}) => {
  const [isCoverOpen, setIsCoverOpen] = useState(onClose ? true : false);
  const [deviceMode, setDeviceMode] = useState<'ios' | 'android'>('ios');
  const [previewKey, setPreviewKey] = useState(0);
  const [dockNode, setDockNode] = useState<HTMLDivElement | null>(null);
  const [localWishes, setLocalWishes] = useState<WishItem[]>(wishes);

  useEffect(() => {
    setLocalWishes(wishes);
  }, [wishes]);

  const effectiveInvId = invitationId || data.id || localStorage.getItem('mbell_active_template_id') || data.slug || null;

  const handlePreviewSubmitRsvp = async (name: string, status: string, pax: number, notes: string = '') => {
    const invId = effectiveInvId;
    if (invId && invId !== 'preview-demo') {
      try {
        const res = await submitRsvp(invId, name, status, pax, notes);
        window.dispatchEvent(new CustomEvent('mbell_rsvp_submitted', { detail: { name, status, pax, notes } }));
        return res;
      } catch (e) {
        console.warn('[PhoneMockupPreview] RSVP submission fallback:', e);
      }
    }
  };

  const handlePreviewSubmitWish = async (name: string, message: string, attendance: string = 'hadir') => {
    const invId = effectiveInvId;
    if (invId && invId !== 'preview-demo') {
      try {
        await submitWish(invId, name, message, attendance);
        window.dispatchEvent(new CustomEvent('mbell_wish_submitted', { detail: { name, message, attendance } }));
      } catch (e) {
        console.warn('[PhoneMockupPreview] Wish submission fallback:', e);
      }
    }
    const newWish: WishItem = {
      id: `preview-${Date.now()}`,
      guest_name: name,
      message,
      attendance: attendance === 'hadir' || attendance === 'attending' ? 'attending' : 'declined',
      created_at: 'Baru saja',
    };
    setLocalWishes((prev) => [newWish, ...prev]);
  };

  const dockTargetCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setDockNode(node);
    }
  }, []);

  // Otomatis reset ke Sampul saat tema berubah (kecuali di modal pratinjau yang fokus ke isi)
  useEffect(() => {
    if (!onClose) {
      setIsCoverOpen(false);
    }
  }, [data.theme_id, onClose]);

  // Dengarkan event putar ulang: kembalikan tampilan frame HP ke Sampul (Cover Gate)
  useEffect(() => {
    const handleReplayEvent = () => {
      setIsCoverOpen(false);
      setPreviewKey((prev) => prev + 1);

      setTimeout(() => {
        const phoneScrollable = document.querySelector('[data-phone-preview="true"] .overflow-y-auto');
        if (phoneScrollable) {
          phoneScrollable.scrollTop = 0;
        }
      }, 40);
    };

    window.addEventListener('mbell_replay_preview', handleReplayEvent);

    // Sinkronisasi status preview saat cover dibuka (drag to open atau klik buka)
    const handleCoverOpenedEvent = () => {
      setIsCoverOpen(true);
    };
    window.addEventListener('mbell_cover_opened', handleCoverOpenedEvent);

    return () => {
      window.removeEventListener('mbell_replay_preview', handleReplayEvent);
      window.removeEventListener('mbell_cover_opened', handleCoverOpenedEvent);
    };
  }, []);

  const handleRefresh = () => {
    setIsCoverOpen(false);
    setPreviewKey((prev) => prev + 1);
  };

  const { safeData, normalizedThemeId } = buildSafePreviewData(data);
  const effectiveTheme = resolveEffectiveTheme(theme, normalizedThemeId);

  const renderActiveTemplate = () => {
    const props = {
      data: safeData,
      theme: effectiveTheme,
      invitationId: safeData.id || 'preview-demo',
      wishes: localWishes,
      isPreview: true,
      isCoverOpen,
      onSubmitRsvp: handlePreviewSubmitRsvp,
      onSubmitWish: handlePreviewSubmitWish,
    };

    switch (normalizedThemeId) {
      case 'modern':
        return <Template1Modern {...props} />;
      case 'rustic':
        return <Template2Rustic {...props} />;
      case 'jawa':
        return <Template3Jawa {...props} />;
      case 'islami':
        return <Template4Islami {...props} />;
      case 'luxury':
        return <Template5Luxury {...props} />;
      case 'sunda':
      case 'template6':
        return <TemplateSundaSiger {...props} />;
      case 'minang':
      case 'template7':
        return <TemplateMinangBaralek {...props} />;
      case 'batak':
      case 'template8':
        return <TemplateBatakToba {...props} />;
      default:
        return <Template1Modern {...props} />;
    }
  };

  const currentSlug = data.slug || computeCoupleSlug(data.groom?.name, data.bride?.name) || 'undangan-baru';
  const displayUrl = previewUrl || getInvitationDisplayUrl(currentSlug);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none py-1 sm:py-2">
      {/* 1. TOOLBAR DI ATAS PHONE */}
      <PreviewToolbar
        onClose={onClose}
        isCoverOpen={isCoverOpen}
        setIsCoverOpen={setIsCoverOpen}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onRefresh={handleRefresh}
      />

      {/* 2. PHONE FRAME MOCKUP */}
      <PhoneFrame
        deviceMode={deviceMode}
        previewKey={previewKey}
        dockNode={dockNode}
        dockTargetCallback={dockTargetCallback}
      >
        {renderActiveTemplate()}
      </PhoneFrame>

      {/* 3. PREVIEW URL PILL */}
      <div className="mt-2 sm:mt-2.5 flex items-center gap-2 px-3 py-1 rounded-full bg-white font-label-sm text-label-sm text-stone-600 shadow-xs border border-stone-200/60 max-w-[95%]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs text-stone-700">{displayUrl}</span>
        <a
          href={`/${currentSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-600 hover:text-stone-900 transition-colors flex items-center"
          title="Buka di tab baru"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
};
