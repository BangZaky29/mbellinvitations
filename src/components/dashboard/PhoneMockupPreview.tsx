import React, { useState, useEffect, useCallback } from 'react';
import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';
import { PhoneDockContext } from '../../context/PhoneDockContext';
import {
  MOCK_MODERN_DATA,
  MOCK_MODERN_THEME,
  MOCK_RUSTIC_THEME,
  MOCK_JAWA_THEME,
  MOCK_ISLAMI_THEME,
  MOCK_LUXURY_THEME,
  MOCK_THEME_DATA_MAP,
  MOCK_THEME_CONFIG_MAP,
} from '../../data/mockInvitation';
import { Template1Modern } from '../templates/Template1Modern';
import { Template2Rustic } from '../templates/Template2Rustic';
import { Template3Jawa } from '../templates/Template3Jawa';
import { Template4Islami } from '../templates/Template4Islami';
import { Template5Luxury } from '../templates/Template5Luxury';

interface PhoneMockupPreviewProps {
  data: InvitationData;
  theme: ThemeConfig;
  wishes?: WishItem[];
  previewUrl?: string;
  onClose?: () => void;
}

const DEFAULT_THEMES: Record<string, ThemeConfig> = {
  modern: MOCK_MODERN_THEME,
  rustic: MOCK_RUSTIC_THEME,
  jawa: MOCK_JAWA_THEME,
  islami: MOCK_ISLAMI_THEME,
  luxury: MOCK_LUXURY_THEME,
};

const THEME_ID_MAP: Record<string, string> = {
  template1: 'modern',
  template2: 'rustic',
  template3: 'jawa',
  template4: 'islami',
  template5: 'luxury',
  modern: 'modern',
  rustic: 'rustic',
  jawa: 'jawa',
  islami: 'islami',
  luxury: 'luxury',
};

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

  const normalizedThemeId = THEME_ID_MAP[String(data.theme_id || 'modern')] || 'modern';
  const defaultThematicData = MOCK_THEME_DATA_MAP[normalizedThemeId] || MOCK_MODERN_DATA;

  // Fallback hierarkis yang cerdas: utamakan data kustom user secara reaktif
  const safeData: InvitationData = {
    ...data,
    couple_photo: data.couple_photo || data.cover_image || defaultThematicData.couple_photo,
    cover_image: data.cover_image || data.couple_photo || defaultThematicData.cover_image,
    groom: {
      name: data.groom?.name !== undefined ? data.groom.name : defaultThematicData.groom.name,
      full_name: data.groom?.full_name !== undefined ? data.groom.full_name : defaultThematicData.groom.full_name,
      child_order: data.groom?.child_order !== undefined ? data.groom.child_order : defaultThematicData.groom.child_order,
      parent_father: data.groom?.parent_father !== undefined ? data.groom.parent_father : defaultThematicData.groom.parent_father,
      parent_mother: data.groom?.parent_mother !== undefined ? data.groom.parent_mother : defaultThematicData.groom.parent_mother,
      instagram: data.groom?.instagram !== undefined ? data.groom.instagram : defaultThematicData.groom.instagram,
      ...data.groom,
      photo_url: data.groom?.photo_url || (data.groom as any)?.photo || defaultThematicData.groom.photo_url,
      photo: (data.groom as any)?.photo || data.groom?.photo_url || defaultThematicData.groom.photo_url,
    },
    bride: {
      name: data.bride?.name !== undefined ? data.bride.name : defaultThematicData.bride.name,
      full_name: data.bride?.full_name !== undefined ? data.bride.full_name : defaultThematicData.bride.full_name,
      child_order: data.bride?.child_order !== undefined ? data.bride.child_order : defaultThematicData.bride.child_order,
      parent_father: data.bride?.parent_father !== undefined ? data.bride.parent_father : defaultThematicData.bride.parent_father,
      parent_mother: data.bride?.parent_mother !== undefined ? data.bride.parent_mother : defaultThematicData.bride.parent_mother,
      instagram: data.bride?.instagram !== undefined ? data.bride.instagram : defaultThematicData.bride.instagram,
      ...data.bride,
      photo_url: data.bride?.photo_url || (data.bride as any)?.photo || defaultThematicData.bride.photo_url,
      photo: (data.bride as any)?.photo || data.bride?.photo_url || defaultThematicData.bride.photo_url,
    },
    wedding_date_display: data.wedding_date_display !== undefined ? data.wedding_date_display : defaultThematicData.wedding_date_display,
    wedding_date_iso: data.wedding_date_iso !== undefined ? data.wedding_date_iso : defaultThematicData.wedding_date_iso,
    quote: data.quote !== undefined ? data.quote : defaultThematicData.quote,
    quote_source: data.quote_source !== undefined ? data.quote_source : defaultThematicData.quote_source,
    hashtag: data.hashtag !== undefined ? data.hashtag : defaultThematicData.hashtag,
    guest_name: data.guest_name !== undefined ? data.guest_name : defaultThematicData.guest_name,
    guest_code: data.guest_code !== undefined ? data.guest_code : defaultThematicData.guest_code,
    events: (data.events && data.events.length > 0) ? data.events : defaultThematicData.events,
    gallery: (data.gallery && data.gallery.length > 0) ? data.gallery : defaultThematicData.gallery,
    love_story: (data.love_story && data.love_story.length > 0) ? data.love_story : defaultThematicData.love_story,
    banks: (data.banks && data.banks.length > 0 ? data.banks : data.bank_accounts) || defaultThematicData.banks || [],
    bank_accounts: (data.bank_accounts && data.bank_accounts.length > 0 ? data.bank_accounts : data.banks) || defaultThematicData.bank_accounts || [],
  };

  const effectiveTheme = theme || MOCK_THEME_CONFIG_MAP[normalizedThemeId] || DEFAULT_THEMES[normalizedThemeId] || MOCK_MODERN_THEME;

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

  const currentSlug = data.slug || 'raditya-jessica';
  const displayUrl = previewUrl || `mbell.id/${currentSlug}`;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none py-2">
      {/* TOOLBAR DI ATAS PHONE (ADAPTIF: STANDAR & MODE MODAL TERPADU) */}
      <div
        className={`w-full max-w-[340px] xl:max-w-[360px] flex items-center justify-between mb-3 px-3 py-1.5 rounded-2xl transition-all ${
          onClose
            ? 'bg-neutral-900/90 text-white border border-white/20 shadow-2xl backdrop-blur-md'
            : 'bg-white shadow-xs border border-stone-200/80 text-stone-900'
        }`}
      >
        <div className="flex items-center gap-1.5">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all active:scale-95 cursor-pointer border border-white/10 shrink-0"
              title="Kembali ke Dashboard Editor"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>Kembali</span>
            </button>
          ) : (
            <span className="font-label-sm text-xs text-stone-500 font-medium">Tampilan:</span>
          )}

          <div
            className={`flex items-center p-0.5 rounded-xl border ${
              onClose
                ? 'bg-neutral-800 border-white/10'
                : 'bg-stone-100 border-stone-200/70'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsCoverOpen(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                !isCoverOpen
                  ? onClose
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-900 text-white font-semibold shadow-xs'
                  : onClose
                  ? 'text-neutral-300 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Lihat Sampul Pembuka (Cover Gate)"
            >
              Sampul
            </button>
            <button
              type="button"
              onClick={() => setIsCoverOpen(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isCoverOpen
                  ? onClose
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-900 text-white font-semibold shadow-xs'
                  : onClose
                  ? 'text-neutral-300 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Lihat Isi Lengkap Undangan"
            >
              Isi Undangan
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDeviceMode('ios')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'ios'
                ? onClose
                  ? 'text-white bg-white/20 font-bold'
                  : 'text-stone-900 bg-stone-100 font-bold'
                : onClose
                ? 'text-neutral-400 hover:text-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="iOS View"
          >
            <span className="material-symbols-outlined text-[17px]">phone_iphone</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('android')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'android'
                ? onClose
                  ? 'text-white bg-white/20 font-bold'
                  : 'text-stone-900 bg-stone-100 font-bold'
                : onClose
                ? 'text-neutral-400 hover:text-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Android View"
          >
            <span className="material-symbols-outlined text-[17px]">smartphone</span>
          </button>
          <span className={`w-px h-3.5 mx-0.5 ${onClose ? 'bg-white/20' : 'bg-stone-200'}`} />
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-1.5 rounded-lg transition-colors active:rotate-180 ${
              onClose ? 'text-neutral-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Muat Ulang Preview"
          >
            <span className="material-symbols-outlined text-[17px]">refresh</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 ml-1 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
              title="Tutup Pratinjau"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* PHONE FRAME MOCKUP (340px-360px) */}
      <div
        className={`relative w-[340px] xl:w-[355px] h-[640px] xl:h-[680px] max-h-[calc(100vh-140px)] ${
          deviceMode === 'ios' ? 'rounded-[46px]' : 'rounded-[32px]'
        } bg-slate-900 border-[7px] border-slate-950 p-1 shadow-2xl shrink-0 flex flex-col`}
      >
        {/* INNER SCREEN BEZEL - ACTS AS CONTAINING BLOCK FOR FIXED ELEMENTS (BOTTOM NAV & AUDIO) */}
        <div
          data-phone-preview="true"
          className={`w-full h-full ${
            deviceMode === 'ios' ? 'rounded-[38px]' : 'rounded-[24px]'
          } bg-white overflow-hidden flex flex-col relative shadow-inner [transform:translateZ(0)]`}
        >
          {/* DYNAMIC ISLAND / CAMERA NOTCH */}
          {deviceMode === 'ios' ? (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-end px-2 pointer-events-none shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>
          ) : (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 pointer-events-none" />
          )}

          {/* PROVIDER CONTEXT DOCK TERISOLASI UNTUK INSTANCE PHONE INI */}
          <PhoneDockContext.Provider value={dockNode}>
            {/* PHONE SCREEN SCROLLABLE CONTENT (LIVE TEMPLATE DENGAN NO-SCROLLBAR) */}
            <div
              key={previewKey}
              data-phone-preview="true"
              className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar relative text-left flex flex-col"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {renderActiveTemplate()}
            </div>

            {/* FLOATING CONTROLS PORTAL DOCK (BOTTOM NAV & AUDIO BUBBLE) - PERMANEN DI DASAR HP DENGAN ZERO-SCROLL */}
            <div
              ref={dockTargetCallback}
              id="phone-dock-target"
              className="absolute inset-0 pointer-events-none z-40 overflow-hidden"
            />
          </PhoneDockContext.Provider>

          {/* PHONE HOME INDICATOR BAR (ABSOLUTE BOTTOM) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/40 rounded-full pointer-events-none z-40" />
        </div>
      </div>

      {/* PREVIEW URL PILL */}
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
