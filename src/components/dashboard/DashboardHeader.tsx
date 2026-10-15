import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export interface DashboardHeaderProps {
  slug: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  isSaving?: boolean;
  lastSaved?: Date | null;
  isPublished?: boolean;
  onPublishToggle?: () => void;
  onPublish?: () => void;
  onOpenPreview?: () => void;
  userEmail?: string | null;
  userAvatar?: string | null;
  userName?: string | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  slug,
  saveStatus,
  isSaving,
  isPublished = true,
  onPublishToggle,
  onPublish,
  onOpenPreview,
  userEmail,
  userAvatar,
  userName,
  onLoginClick,
  onRegisterClick,
  onOpenSettings,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  return (
    <header className="h-16 shrink-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-3 sm:px-6 flex items-center justify-between border-b border-stone-200/80">
      {/* Left: Brand Logo & Public Link Pill */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-[19px]">favorite</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            mbell<span className="text-secondary">.id</span>
          </span>
        </Link>

        {/* Public Slug URL Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors min-w-0">
          <span className="font-label-md text-label-md select-all text-on-surface-variant truncate max-w-[200px]">
            mbell.id/{slug}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Salin Link Undangan"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            title="Buka Undangan di Tab Baru"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Right: Autosave Status, Auth State (Login/Daftar or Avatar Dropdown), Publish Action */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
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

        {/* CONDITION: If user logged in, show User Menu Dropdown; If NOT logged in, show Masuk & Daftar buttons */}
        {userEmail ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-1.5 rounded-full hover:bg-stone-200/70 border border-stone-200 transition-colors cursor-pointer"
            >
              <span className="hidden lg:inline font-label-sm text-xs font-medium text-stone-700 max-w-[130px] truncate">
                {userName || userEmail}
              </span>
              {userAvatar ? (
                <img
                  alt={userName || userEmail}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-300 shadow-xs"
                  src={userAvatar}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitial()}
                </div>
              )}
              <span className="material-symbols-outlined text-[16px] text-stone-500">
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
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <p className="font-label-md text-xs font-semibold text-stone-900 truncate">
                      {userName || 'Akun Google'}
                    </p>
                    <p className="font-body-sm text-[11px] text-stone-500 truncate">
                      {userEmail}
                    </p>
                  </div>

                  <div className="py-1">
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
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left font-label-md text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-stone-500">folder_special</span>
                      <span>Daftar Undangan Saya</span>
                    </Link>
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-3 py-1.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 font-label-md text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-stone-500">login</span>
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={onRegisterClick}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-neutral-800 text-white font-label-md text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">person_add</span>
              <span>Daftar</span>
            </button>
          </div>
        )}

        {/* Publish Button */}
        <button
          onClick={handlePublishClick}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-label-lg text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 ${isPublished
              ? 'bg-primary text-on-primary hover:bg-neutral-800'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-surface-variant'
            }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPublished ? 'verified' : 'upload'}
          </span>
          <span className="hidden xs:inline">{isPublished ? 'Published' : 'Publish'}</span>
        </button>
      </div>
    </header>
  );
};
