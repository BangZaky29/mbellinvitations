import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Jika belum login, redirect ke /login
        navigate('/login');
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    }
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <span className="material-symbols-outlined text-xl">favorite</span>
          </div>
          <span className="font-bold text-base text-white tracking-wide">Wedding SaaS Studio</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/raditya-jessica"
            target="_blank"
            className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
          >
            <span>Buka Undangan Live</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-rose-500/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold tracking-wider uppercase mb-2">
              Tahap 2 &amp; 3 — Portal SaaS
            </span>
            <h1 className="text-2xl font-bold text-white mb-1">
              Halo, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-sm text-neutral-400 max-w-xl">
              Selamat datang di studio undangan digital Anda. Skema database, bucket storage, dan 5 template interaktif telah aktif dan siap dihubungkan ke editor form ini.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/demo"
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors border border-neutral-700 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">palette</span>
              <span>5-Template Demo</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
            <span className="text-xs text-neutral-400 block mb-1">Total Tamu Diundang</span>
            <span className="text-2xl font-bold text-white">2 Orang (Demo)</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
            <span className="text-xs text-neutral-400 block mb-1">Konfirmasi Hadir</span>
            <span className="text-2xl font-bold text-emerald-400">1 (2 Pax)</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
            <span className="text-xs text-neutral-400 block mb-1">Ucapan &amp; Doa</span>
            <span className="text-2xl font-bold text-amber-400">Live Realtime</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
            <span className="text-xs text-neutral-400 block mb-1">Storage Bucket</span>
            <span className="text-2xl font-bold text-blue-400">invitations</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
