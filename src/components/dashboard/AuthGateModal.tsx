import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationSlug?: string;
  onBeforeAuth?: () => void;
  onSuccessLogin?: (user: any) => void;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  isOpen,
  onClose,
  invitationSlug = 'undangan-baru',
  onBeforeAuth,
  onSuccessLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'email'>('google');
  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Google 1-Click OAuth Login
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Kritis: Simpan draf saat ini ke localStorage sebelum dialihkan ke Google
    onBeforeAuth?.();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghubungkan ke akun Google. Silakan periksa koneksi internet Anda.');
      setLoading(false);
    }
  };

  // 2. Email & Password Authentication (Login / Register)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Silakan isi email dan kata sandi Anda.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Kritis: Amankan draf ke localStorage sebelum otentikasi
    onBeforeAuth?.();

    try {
      if (emailMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        if (data.user) {
          setSuccessMsg('Berhasil masuk! Menyinkronkan draf undangan Anda...');
          setTimeout(() => {
            onSuccessLogin?.(data.user);
            onClose();
          }, 800);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        if (data.user) {
          if (data.session) {
            setSuccessMsg('Pendaftaran berhasil! Menyinkronkan akun Anda...');
            setTimeout(() => {
              onSuccessLogin?.(data.user);
              onClose();
            }, 800);
          } else {
            setSuccessMsg('Pendaftaran berhasil! Silakan cek kotak masuk email Anda untuk konfirmasi.');
          }
        }
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMsg('Email atau kata sandi tidak cocok. Silakan periksa kembali.');
      } else if (msg.includes('User already registered')) {
        setErrorMsg('Email ini sudah terdaftar. Silakan pilih tab Masuk.');
      } else {
        setErrorMsg(msg || 'Terjadi gangguan saat memproses akun. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/90 text-stone-900 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-rose-100/40 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">lock_open</span>
          </div>
          <div>
            <h3 className="font-title-lg text-lg sm:text-xl text-stone-900 font-bold">
              Masuk atau Daftar Akun
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Amankan draf <span className="font-semibold text-stone-800">mbell.id/{invitationSlug}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher: Google vs Email */}
        <div className="flex items-center p-1 bg-stone-100 rounded-2xl mb-5 mt-2 border border-stone-200/70">
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'google'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google (1-Klik)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'email'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Email &amp; Sandi</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span className="flex-1 leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-base shrink-0 text-emerald-600">check_circle</span>
            <span className="flex-1 leading-snug font-medium">{successMsg}</span>
          </div>
        )}

        {/* TAB 1: GOOGLE 1-KLIK (UTAMA & REKOMENDASI) */}
        {activeTab === 'google' && (
          <div>
            <div className="space-y-2 mb-6 bg-stone-50 rounded-2xl p-4 border border-stone-200/70 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
                <span>Draf yang Anda ketik langsung otomatis tersimpan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-base">cloud_sync</span>
                <span>Sinkronisasi otomatis ke semua perangkat Anda</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-base">flash_on</span>
                <span>Langsung masuk tanpa perlu menghafal kata sandi</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-neutral-800 text-white font-label-md text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{loading ? 'Menghubungkan...' : 'Lanjutkan dengan Google (1-Klik)'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: EMAIL & PASSWORD (OPSIONAL) */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                  alternate_email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none text-xs sm:text-sm text-stone-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none text-xs sm:text-sm text-stone-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-base">
                  {emailMode === 'login' ? 'login' : 'person_add'}
                </span>
              )}
              <span>
                {loading
                  ? 'Memproses...'
                  : emailMode === 'login'
                  ? 'Masuk ke Akun'
                  : 'Daftar Akun Baru'}
              </span>
            </button>

            {/* Toggle Mode: Login vs Register */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmailMode(emailMode === 'login' ? 'register' : 'login');
                  setErrorMsg(null);
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium transition-colors cursor-pointer"
              >
                {emailMode === 'login' ? (
                  <span>
                    Belum punya akun?{' '}
                    <strong className="text-amber-600 underline">Daftar sekarang</strong>
                  </span>
                ) : (
                  <span>
                    Sudah punya akun?{' '}
                    <strong className="text-amber-600 underline">Masuk di sini</strong>
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer: Lanjutkan Mengedit Desain Dulu */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 font-label-sm text-xs transition-colors cursor-pointer"
          >
            Lanjutkan Mengedit Desain Dulu
          </button>
        </div>
      </div>
    </div>
  );
};
