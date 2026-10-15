import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export interface DashboardHeaderProps {
  slug: string;
  onSlugChange?: (newSlug: string) => void;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  isSaving?: boolean;
  lastSaved?: Date | null;
  isPublished?: boolean;
  status?: string;
  suggestedSlug?: string;
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
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  slug,
  saveStatus,
  isSaving,
  isPublished = true,
  status = 'published',
  onSaveDraft,
  onPublishToggle,
  onPublish,
  onOpenPreview,
  userEmail,
  userAvatar,
  userName,
  accountStatus = 'Gratis',
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

  const fullUrl = `${window.location.origin}/${slug}`;

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

  const isLive = status === 'published' || isPublished;

  return (
    <>
      <header className="h-16 shrink-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-3 sm:px-6 flex items-center justify-between border-b border-stone-200/80">
        {/* Left: Brand Logo & Public Link Pill */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
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
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 active:scale-95"
            />
          </Link>

          {/* Public Slug URL Pill with Status Badge, Auto-Suggest & Quick Edit */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-stone-200/90 shadow-2xs text-stone-700 min-w-0">
            {/* Live / Draft Status Badge */}
            {isLive ? (
              <span
                title="Undangan aktif dan dapat dibuka oleh publik"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold shrink-0 shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>LIVE PUBLIK</span>
              </span>
            ) : (
              <span
                title="Undangan masih dalam status draf (belum live)"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold shrink-0 shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>DRAF</span>
              </span>
            )}

            {/* Link Text */}
            <span
              title={`Tautan aktif: ${typeof window !== 'undefined' ? `${window.location.host}/${slug}` : `mbell.id/${slug}`}`}
              className="font-mono text-xs font-bold text-stone-900 select-all truncate max-w-[150px] md:max-w-[220px]"
            >
              {typeof window !== 'undefined' ? `${window.location.host}/${slug}` : `mbell.id/${slug}`}
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
        </div>

      {/* Right: Autosave Status, Auth State (Login/Daftar or Avatar Dropdown), Publish Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Autosave Status Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low">
          {effectiveSaveStatus === 'saving' ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">
                Menyimpan...
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">
                Tersimpan otomatis
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
            <span>Pratinjau</span>
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

        {/* Save Draft / Checkpoint Button */}
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Simpan editan saat ini sebagai Draf / Checkpoint di Supabase"
          >
            <span className="material-symbols-outlined text-[17px] text-amber-700">bookmark_added</span>
            <span className="hidden sm:inline">Simpan Draf</span>
          </button>
        )}

        {/* Publish Action Button */}
        <button
          onClick={handlePublishClick}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 ${
            isLive
              ? 'bg-stone-900 text-white border border-emerald-500/50 hover:bg-stone-800 shadow-emerald-950/20'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
          }`}
          title={isLive ? 'Undangan sudah live dan online. Klik untuk kelola publikasi.' : 'Undangan masih draf. Klik untuk terbitkan sekarang!'}
          type="button"
        >
          <span className={`material-symbols-outlined text-[17px] ${isLive ? 'text-emerald-400' : 'text-stone-950'}`}>
            {isLive ? 'verified' : 'rocket_launch'}
          </span>
          <span className="hidden xs:inline">
            {isLive ? 'Live / Terbit' : 'Terbitkan Live'}
          </span>
        </button>
      </div>
    </header>
  </>
);
};
