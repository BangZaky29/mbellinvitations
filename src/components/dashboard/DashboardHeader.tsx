import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTemplateDisplayName } from '../../pages/dashboard/constants/themeMapping';
import { getInvitationFullUrl, getInvitationDisplayUrl } from '../../utils/urlHelper';

export interface DashboardHeaderProps {
  slug: string;
  onSlugChange?: (newSlug: string) => void;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  isSaving?: boolean;
  lastSaved?: Date | null;
  isPublished?: boolean;
  isAlreadyPublished?: boolean;
  isTemplateChanged?: boolean;
  status?: string;
  suggestedSlug?: string;
  publishedThemeId?: string | null;
  currentThemeId?: string;
  onSaveDraft?: () => void;
  onPublishToggle?: () => void;
  onPublish?: () => void;
  onOpenPreview?: () => void;
  userEmail?: string | null;
  userAvatar?: string | null;
  userName?: string | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onOpenSettings?: () => void;
  onOpenMyTemplates?: () => void;
  onLogout?: () => void;
  onReplayOpening?: () => void;
  accountStatus?: 'Gratis' | 'Pro' | 'Platinum';
  hasUnsavedChanges?: boolean;
  unsavedCount?: number;
  onRevertAll?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  slug,
  saveStatus,
  isSaving,
  isPublished = true,
  isAlreadyPublished,
  isTemplateChanged = false,
  status = 'published',
  publishedThemeId = null,
  currentThemeId,
  onPublishToggle,
  onPublish,
  onOpenPreview,
  userEmail,
  userAvatar,
  userName,
  accountStatus = 'Gratis',
  hasUnsavedChanges = false,
  unsavedCount = 0,
  onLoginClick,
  onRegisterClick,
  onOpenSettings,
  onOpenMyTemplates,
  onLogout,
  onReplayOpening,
}) => {
  const [copied, setCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  const effectiveSaveStatus = isSaving !== undefined ? (isSaving ? 'saving' : 'saved') : (saveStatus || 'saved');
  const handlePublishClick = onPublish || onPublishToggle || (() => { });

  const fullUrl = getInvitationFullUrl(slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getInitial = () => {
    if (userName && userName.trim().length > 0) return userName.trim()[0].toUpperCase();
    if (userEmail && userEmail.trim().length > 0) return userEmail.trim()[0].toUpperCase();
    return 'U';
  };

  const isLive = Boolean(publishedThemeId && (status === 'published' || isPublished));
  const isSamePublishedTheme = Boolean(
    (isAlreadyPublished ?? isLive) && !isTemplateChanged
  );

  // Resolusi nama tema live publik & tema di editor (menggunakan data asli database tanpa hardcode)
  const liveDisplayName = publishedThemeId ? getTemplateDisplayName(publishedThemeId) : '';
  const currentDisplayName = currentThemeId ? getTemplateDisplayName(currentThemeId) : (liveDisplayName || 'Modern Minimalist');

  // Hanya tampilkan tautan link publik di header (mobile & desktop) jika user SUDAH LOGIN dan memiliki template yang diterbitkan (published)
  const shouldShowPublicLink = Boolean(
    (userEmail || userName) && (isAlreadyPublished || (publishedThemeId && (status === 'published' || isPublished)))
  );

  return (
    <>
      <header className="h-16 shrink-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-3 sm:px-6 flex items-center justify-between border-b border-stone-200/80">
        {/* Left: Brand Logo, Mobile Mini Live Badge & Desktop Public Link Pill */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <Link
            to="/dashboard"
            onClick={(e) => {
              if (onReplayOpening) {
                e.preventDefault();
                onReplayOpening();
              }
            }}
            title="Klik untuk memutar ulang Animasi Opening"
            className="flex items-center shrink-0 group cursor-pointer"
          >
            <img
              src="/mbell-logo-1-noBG.png"
              alt="mbell invitations logo"
              className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 active:scale-95"
            />
          </Link>

          {/* Tautan Link Publik: Hanya tampil jika pengguna sudah memiliki template yang sudah diterbitkan (published) */}
          {shouldShowPublicLink && (
            <>
              {/* MOBILE ONLY: Live Published Theme Interactive Link Pill Button */}
              <div className="sm:hidden flex items-center min-w-0">
                <a
                  href={`/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`Buka Undangan Live: ${getInvitationDisplayUrl(slug)}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold shadow-2xs truncate max-w-[155px] active:scale-95 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                  <span className="truncate">/{slug}</span>
                  <span className="material-symbols-outlined text-[13px] shrink-0 text-emerald-700">open_in_new</span>
                </a>
              </div>

              {/* DESKTOP ONLY: Public Slug URL Pill with Live & Draft Theme Indicators */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-stone-200/90 shadow-2xs text-stone-700 min-w-0">
                {/* Live / Draft Status Badge dengan Nama Tema */}
                {isSamePublishedTheme ? (
                  <span
                    title={`Undangan live publik saat ini menayangkan tema ${liveDisplayName}`}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold shrink-0 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>LIVE: {liveDisplayName}</span>
                  </span>
                ) : isTemplateChanged ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      title={`Tema yang saat ini live ditayangkan ke publik: ${liveDisplayName}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>LIVE: {liveDisplayName}</span>
                    </span>
                    <span
                      title={`Anda sedang mengedit / mencoba tema: ${currentDisplayName} (belum terbit)`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[11px]">edit</span>
                      <span>Draf: {currentDisplayName}</span>
                    </span>
                  </div>
                ) : (
                  <span
                    title="Undangan masih dalam status draf (belum live)"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold shrink-0 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                    <span>DRAF • {currentDisplayName}</span>
                  </span>
                )}

                {/* Link Text */}
                <span
                  title={`Tautan aktif: ${getInvitationDisplayUrl(slug)}`}
                  className="font-mono text-xs font-bold text-stone-900 select-all truncate max-w-[130px] md:max-w-[190px]"
                >
                  {getInvitationDisplayUrl(slug)}
                </span>

                {/* Button: Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="p-1 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                  title="Salin Link Undangan"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                </button>

                {/* Button: Open in New Tab */}
                <a
                  href={`/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                  title="Buka Undangan Live di Tab Baru"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </>
          )}
        </div>

        {/* Right: Autosave Status, Auth State (Login/Daftar or Avatar Dropdown), Publish Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Save Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low">
            {effectiveSaveStatus === 'saving' || isSaving ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">
                  Menyimpan...
                </span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-amber-800 font-semibold hidden md:inline">
                  {unsavedCount > 0 ? `${unsavedCount} Perubahan belum disimpan` : 'Perubahan belum disimpan'}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-label-sm text-label-sm text-stone-600 font-medium hidden md:inline">
                  Tersimpan di database
                </span>
              </>
            )}
          </div>

          {/* Optional Fullscreen Preview Button */}
          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="hidden sm:flex xl:hidden items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Preview</span>
            </button>
          )}

          {/* CONDITION: If user logged in, show User Menu Dropdown; If NOT logged in, show Masuk & Daftar button */}
          {userEmail ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 py-1 pl-2 pr-2.5 rounded-full hover:bg-stone-200/80 bg-white/80 border border-stone-200 shadow-xs transition-all cursor-pointer group"
              >
                {userAvatar && !avatarLoadFailed ? (
                  <img
                    alt={userName || userEmail}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500/50 shadow-xs"
                    src={userAvatar}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarLoadFailed(true)}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {getInitial()}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="font-label-md text-xs font-semibold text-stone-800 max-w-[120px] truncate">
                    {userName || userEmail.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                    {accountStatus}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-stone-500 transition-transform group-hover:translate-y-0.5">
                  {showUserMenu ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in text-stone-800">
                    <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-3">
                      {userAvatar && !avatarLoadFailed ? (
                        <img
                          alt={userName || userEmail}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-500/40"
                          src={userAvatar}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarLoadFailed(true)}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center">
                          {getInitial()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-label-md text-xs font-bold text-stone-900 truncate">
                            {userName || 'Pengguna Mbell'}
                          </p>
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                            {accountStatus}
                          </span>
                        </div>
                        <p className="font-body-sm text-[11px] text-stone-500 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          if (onOpenMyTemplates) onOpenMyTemplates();
                        }}
                        className="w-full px-4 py-2 text-left font-label-md text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-amber-600">folder_special</span>
                        <span>Template Saya</span>
                      </button>

                      {onOpenSettings && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenSettings();
                          }}
                          className="w-full px-4 py-2 text-left font-label-md text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-stone-500">manage_accounts</span>
                          <span>Pengaturan Akun</span>
                        </button>
                      )}
                    </div>

                    {onLogout && (
                      <div className="pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2 text-left font-label-md text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick || onRegisterClick}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span>Masuk / Daftar Akun</span>
            </button>
          )}

        </div>
      </header>

      {/* Minimalist Guest Notice Strip: Tampil di bawah header mobile & web saat user belum login */}
      {!(userEmail || userName) && (
        <div className="w-full bg-[#FAF7F2] border-b border-amber-500/25 px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-stone-700 animate-in fade-in duration-200 shrink-0 z-30">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0">edit_note</span>
            <span className="text-[11px] sm:text-xs text-stone-600 truncate">
              Anda sedang mengedit sebagai <strong className="font-semibold text-stone-900">tamu</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onLoginClick || onRegisterClick}
            className="text-[11px] sm:text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>Masuk / Daftar</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Sub-Strip Bar: Muncul saat user login, undangan sudah published dan user sedang mencoba tema lain */}
      {(userEmail || userName) && isAlreadyPublished && isTemplateChanged && Boolean(publishedThemeId) && (
        <div className="w-full bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 border-b border-amber-200/90 px-3 sm:px-6 py-1.5 flex items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs animate-fade-in shrink-0 z-30">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0">info</span>
            <span className="truncate text-[11px] sm:text-xs">
              Sedang pratinjau tema <strong className="font-bold text-stone-900">{currentDisplayName}</strong> • Tema live publik saat ini: <strong className="font-bold text-emerald-800">{liveDisplayName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handlePublishClick}
            className="shrink-0 px-2.5 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[10px] sm:text-[11px] shadow-2xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            title="Terbitkan tema baru ini ke tautan publik"
          >
            <span>Terbitkan {currentDisplayName}</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>
      )}
    </>
  );
};
