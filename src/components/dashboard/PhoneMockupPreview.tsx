import React, { useState, useEffect, useCallback } from 'react';
import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';
import { Template1Modern } from '../templates/Template1Modern';
import { Template2Rustic } from '../templates/Template2Rustic';
import { Template3Jawa } from '../templates/Template3Jawa';
import { Template4Islami } from '../templates/Template4Islami';
import { Template5Luxury } from '../templates/Template5Luxury';
import { PreviewToolbar } from './phone-preview/PreviewToolbar';
import { PhoneFrame } from './phone-preview/PhoneFrame';
import {
  buildSafePreviewData,
  resolveEffectiveTheme,
} from './phone-preview/helpers';
import { computeCoupleSlug } from '../../pages/dashboard/helpers/computeCoupleSlug';

export interface PhoneMockupPreviewProps {
  data: InvitationData;
  theme: ThemeConfig;
  wishes?: WishItem[];
  previewUrl?: string;
  onClose?: () => void;
}

export const PhoneMockupPreview: React.FC<PhoneMockupPreviewProps> = ({
  data,
  theme,
  wishes = [],
  previewUrl,
  onClose,
}) => {
  const [isCoverOpen, setIsCoverOpen] = useState(onClose ? true : false);
  const [deviceMode, setDeviceMode] = useState<'ios' | 'android'>('ios');
  const [previewKey, setPreviewKey] = useState(0);
  const [dockNode, setDockNode] = useState<HTMLDivElement | null>(null);

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

  const handleRefresh = () => {
    setPreviewKey((prev) => prev + 1);
  };

  const { safeData, normalizedThemeId } = buildSafePreviewData(data);
  const effectiveTheme = resolveEffectiveTheme(theme, normalizedThemeId);

  const renderActiveTemplate = () => {
    const props = {
      data: safeData,
      theme: effectiveTheme,
      invitationId: safeData.id || 'preview-demo',
      wishes,
      isPreview: true,
      isCoverOpen,
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
      default:
        return <Template1Modern {...props} />;
    }
  };

  const currentSlug = data.slug || computeCoupleSlug(data.groom?.name, data.bride?.name) || 'undangan-baru';
  const displayUrl = previewUrl || `mbell.id/${currentSlug}`;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none py-2">
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
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white font-label-sm text-label-sm text-stone-600 shadow-xs border border-stone-200/60">
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
