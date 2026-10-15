import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleRegister = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendaftar dengan Google. Silakan periksa koneksi Anda.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] px-4 text-stone-900 selection:bg-amber-500/20">
      <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber-100/50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-2xl">favorite</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-stone-900 tracking-tight">
              mbell<span className="text-amber-600">.id</span>
            </h1>
            <p className="text-xs text-stone-500">Pendaftaran Pengantin Baru</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-stone-900 mb-2">Buat Undangan Digital</h2>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          Daftar gratis dalam hitungan detik dengan akun Google Anda dan nikmati seluruh kemudahan platform.
        </p>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="space-y-2.5 mb-7 bg-stone-50 rounded-2xl p-4 border border-stone-200/60">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">palette</span>
            <p className="font-body-sm text-xs text-stone-700">
              <strong>5 Tema Eksklusif:</strong> Desain Modern, Rustic, Jawa Tradisional, Islami, dan Luxury.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">cloud_done</span>
            <p className="font-body-sm text-xs text-stone-700">
              <strong>Penyimpanan Cloud Aman:</strong> Data pernikahan dan RSVP tersimpan otomatis secara rapi.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">share</span>
            <p className="font-body-sm text-xs text-stone-700">
              <strong>Link Undangan Kustom:</strong> Bagikan link undangan pernikahan unik ke keluarga dan kerabat.
            </p>
          </div>
        </div>

        {/* Exclusive Google Registration Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60"
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
            <span>{loading ? 'Menghubungkan...' : 'Daftar Cepat dengan Google'}</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-stone-900 font-semibold hover:underline">
            Masuk dengan Google
          </Link>
          <span className="mx-2">•</span>
          <Link to="/dashboard" className="text-stone-600 hover:text-stone-900 font-medium">
            Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
