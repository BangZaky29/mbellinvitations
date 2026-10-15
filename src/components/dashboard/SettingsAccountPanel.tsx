import React from 'react';
import { supabase } from '../../lib/supabaseClient';

interface SettingsAccountPanelProps {
  userId?: string | null;
  userEmail?: string | null;
  userAvatar?: string | null;
  invitationSlug?: string;
  onLogout?: () => void;
  onGoToEditor: () => void;
  onOpenAuthGate?: () => void;
}

export const SettingsAccountPanel: React.FC<SettingsAccountPanelProps> = ({
  userId,
  userEmail,
  userAvatar,
  invitationSlug = 'raditya-jessica',
  onLogout,
  onGoToEditor,
  onOpenAuthGate,
}) => {
  const handleLogoutAction = async () => {
    await supabase.auth.signOut();
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  if (!userId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">manage_accounts</span>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Masuk untuk Mengakses Pengaturan Akun
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Anda belum masuk. Masuk dengan akun Google Anda untuk mengelola profil, keamanan, dan tautan undangan.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onOpenAuthGate || onGoToEditor}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Masuk / Daftar Akun</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200/80">
        <h2 className="font-serif font-bold text-2xl text-stone-900">
          Pengaturan Akun &amp; Profil
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Kelola informasi akun pengguna terhubung dan pengaturan platform undangan Anda.
        </p>
      </div>

      {/* Profil Akun Google Terhubung */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3.5">
            <img
              src={
                userAvatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
              }
              alt="Avatar Pengguna"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-stone-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-stone-900">
                  {userEmail?.split('@')[0] || 'Pengguna Mbell'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                  <span className="material-symbols-outlined text-[12px] text-emerald-600">verified</span>
                  <span>Google Connected</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Info Detail Akun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70">
            <span className="text-stone-400 block text-[11px] mb-1 font-medium">Metode Masuk</span>
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              <span className="material-symbols-outlined text-red-500 text-[16px]">account_circle</span>
              <span>Google One-Click Authentication</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70">
            <span className="text-stone-400 block text-[11px] mb-1 font-medium">Tautan Undangan Aktif</span>
            <div className="font-semibold text-stone-800 font-mono truncate">
              mbell.id/{invitationSlug}
            </div>
          </div>
        </div>

        {/* Tombol Logout */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleLogoutAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
