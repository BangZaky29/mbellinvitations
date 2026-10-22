import React from 'react';
import { TOTAL_EXCLUSIVE_THEMES } from '../../pages/dashboard/constants/themeMapping';

export type DashboardTab = 'edit-undangan' | 'template-saya' | 'daftar-tamu' | 'ucapan-masuk' | 'pengaturan';

export interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  onSelectTab?: (tab: DashboardTab) => void;
  unreadWishesCount?: number;
  totalGuestsCount?: number;
  totalTemplatesCount?: number;
  unlockedTemplatesCount?: number;
  savedTemplatesCount?: number;
  activeThemeName?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  onSelectTab,
  unreadWishesCount = 0,
  totalGuestsCount = 0,
  totalTemplatesCount,
  unlockedTemplatesCount = 0,
  savedTemplatesCount = 0,
}) => {
  const effectiveTotalTemplates = totalTemplatesCount || TOTAL_EXCLUSIVE_THEMES;

  const handleTabClick = (tab: DashboardTab) => {
    onTabChange?.(tab);
    onSelectTab?.(tab);
  };

  const menuItems: {
    id: DashboardTab;
    label: string;
    subtitle: string;
    icon: string;
    badge?: string | number;
  }[] = [
    {
      id: 'edit-undangan',
      label: 'Edit Undangan',
      subtitle: 'Editor Desain & Konten',
      icon: 'edit_document',
    },
    {
      id: 'template-saya',
      label: 'Template Saya',
      subtitle: 'Koleksi & Draf Tersimpan',
      icon: 'dashboard_customize',
      badge: savedTemplatesCount > 0 ? savedTemplatesCount : undefined,
    },
    {
      id: 'daftar-tamu',
      label: 'Daftar Tamu',
      subtitle: 'Manajemen Tamu & RSVP',
      icon: 'group',
      badge: totalGuestsCount > 0 ? totalGuestsCount : undefined,
    },
    {
      id: 'ucapan-masuk',
      label: 'Ucapan Masuk',
      subtitle: 'Doa & Harapan Tamu',
      icon: 'mark_email_read',
      badge: unreadWishesCount > 0 ? unreadWishesCount : undefined,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      subtitle: 'Akun & Konfigurasi',
      icon: 'tune',
    },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP SIDEBAR (w-64 shrink-0, in flex row)              */}
      {/* ============================================================ */}
      <aside className="w-64 shrink-0 h-full overflow-y-auto border-r border-stone-200/80 hidden lg:flex flex-col justify-between bg-[#FAF8F5]/90 backdrop-blur-xl py-5 px-3.5 z-20 shadow-[1px_0_12px_rgba(0,0,0,0.02)] select-none">
        <div className="flex flex-col w-full">
          {/* Section Sub-header */}
          <div className="px-2.5 pb-2.5 mb-2 border-b border-stone-200/60 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Menu Studio
            </span>
            <span className="text-[10px] font-semibold text-stone-600 bg-stone-200/60 px-1.5 py-0.5 rounded">
              v2.0
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 w-full">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  type="button"
                  className={`group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-md shadow-stone-900/10'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  {/* Gold active vertical accent indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/10 text-amber-300 border border-white/10'
                          : 'bg-stone-100/90 text-stone-600 group-hover:bg-stone-200/70 group-hover:text-stone-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs tracking-tight truncate leading-tight ${
                          isActive ? 'font-semibold text-white' : 'font-medium text-stone-700 group-hover:text-stone-900'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-[10px] truncate mt-0.5 leading-none ${
                          isActive ? 'text-amber-200/70' : 'text-stone-600 group-hover:text-stone-700'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold leading-none shrink-0 ${
                        isActive
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Helper Info: Synchronized Studio Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white via-[#FAF7F2] to-amber-50/40 border border-stone-200/90 shadow-xs relative overflow-hidden group">
          {/* Ambient corner highlight */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Top Row: Brand & Live Pulse Indicator */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-stone-900 to-stone-800 text-amber-400 flex items-center justify-center shadow-xs border border-amber-400/20">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-stone-900 tracking-wide leading-tight">
                  Wedding Studio v2.0
                </p>
                <p className="text-[10px] font-medium text-stone-600 leading-none mt-0.5">
                  Pro Cloud Engine
                </p>
              </div>
            </div>

            {/* Pulse Status */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                Aktif
              </span>
            </div>
          </div>

          {/* Middle Row: Synchronized Theme Count */}
          <div className="space-y-1.5 pt-1 border-t border-stone-200/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-amber-600">
                  auto_awesome
                </span>
                <span>{effectiveTotalTemplates} Tema Eksklusif Aktif</span>
              </span>
              {unlockedTemplatesCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 border border-amber-200/50">
                  {unlockedTemplatesCount}/{effectiveTotalTemplates} Terbuka
                </span>
              )}
            </div>

            {/* Micro Progress Bar (if unlocked themes available) */}
            {unlockedTemplatesCount > 0 && (
              <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(16, (unlockedTemplatesCount / effectiveTotalTemplates) * 100)
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Quick Navigation Action to My Templates */}
          <button
            type="button"
            onClick={() => handleTabClick('template-saya')}
            className="w-full mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer group/link"
          >
            <span>Katalog Koleksi Desain</span>
            <span className="material-symbols-outlined text-[14px] text-stone-600 group-hover/link:text-stone-900 group-hover/link:translate-x-0.5 transition-all">
              arrow_forward
            </span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE & TABLET BOTTOM DOCK NAVIGATION (lg:hidden)        */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#FAF8F5]/95 backdrop-blur-md shadow-[0_-1px_12px_rgba(0,0,0,0.05)] flex justify-around items-center lg:hidden z-30 px-2 border-t border-stone-200/80">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer relative ${
                isActive ? 'text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'text-amber-700' : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold leading-none bg-amber-600 text-white shadow-xs pointer-events-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

