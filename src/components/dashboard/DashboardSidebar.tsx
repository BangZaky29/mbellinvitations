import React from 'react';

export type DashboardTab = 'edit-undangan' | 'template-saya' | 'daftar-tamu' | 'ucapan-masuk' | 'pengaturan';

export interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  onSelectTab?: (tab: DashboardTab) => void;
  unreadWishesCount?: number;
  totalGuestsCount?: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  onSelectTab,
  unreadWishesCount = 0,
  totalGuestsCount = 0,
}) => {
  const handleTabClick = (tab: DashboardTab) => {
    onTabChange?.(tab);
    onSelectTab?.(tab);
  };
  const menuItems: { id: DashboardTab; label: string; icon: string; badge?: string | number }[] = [
    {
      id: 'edit-undangan',
      label: 'Edit Undangan',
      icon: 'edit_document',
    },
    {
      id: 'template-saya',
      label: 'Template Saya',
      icon: 'dashboard_customize',
    },
    {
      id: 'daftar-tamu',
      label: 'Daftar Tamu',
      icon: 'group',
      badge: totalGuestsCount > 0 ? totalGuestsCount : undefined,
    },
    {
      id: 'ucapan-masuk',
      label: 'Ucapan Masuk',
      icon: 'mark_email_read',
      badge: unreadWishesCount > 0 ? unreadWishesCount : undefined,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: 'tune',
    },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP SIDEBAR (w-60 shrink-0, in flex row)              */}
      {/* ============================================================ */}
      <aside className="w-60 shrink-0 h-full overflow-y-auto border-r border-stone-200/80 hidden lg:flex flex-col justify-between bg-[#FDFCFA] py-6 px-3 z-20 shadow-[1px_0_8px_rgba(0,0,0,0.02)]">
        <nav className="flex flex-col gap-1 w-full">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                type="button"
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all cursor-pointer font-label-lg text-label-lg ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Helper Info */}
        <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-variant/40 text-center space-y-1">
          <p className="font-label-sm text-label-sm text-on-surface font-semibold">
            Wedding Studio v2.0
          </p>
          <p className="font-label-sm text-[10px] text-on-surface-variant">
            5 Tema Eksklusif Aktif
          </p>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE BOTTOM DOCK NAVIGATION (md:hidden)                 */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-1px_8px_rgba(0,0,0,0.04)] flex justify-around items-center md:hidden z-30 px-2 border-t border-surface-variant/40">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer relative ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-sm text-[10px] mt-0.5 leading-tight">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-secondary"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
