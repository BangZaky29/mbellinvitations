import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationSlug?: string;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  isOpen,
  onClose,
  invitationSlug = 'raditya-jessica',
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
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
      setErrorMsg(err.message || 'Gagal menghubungkan ke akun Google. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-5 shadow-xs">
          <span className="material-symbols-outlined text-3xl">lock_open</span>
        </div>

        {/* Title & Description */}
        <h3 className="font-title-lg text-title-lg text-stone-900 font-bold mb-2">
          Masuk atau Daftar Akun
        </h3>
        <p className="font-body-md text-body-md text-stone-600 mb-6 leading-relaxed">
          Untuk menerbitkan undangan <span className="font-semibold text-stone-900">mbell.id/{invitationSlug}</span> secara live dan mengaktifkan fitur RSVP online, silakan lanjutkan dengan akun Google Anda.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="space-y-2.5 mb-7 bg-stone-50 rounded-2xl p-4 border border-stone-200/70">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">verified</span>
            <p className="font-body-sm text-body-sm text-stone-700">
              <strong>Data Tersimpan Permanen:</strong> Desain dan pengaturan Anda selalu aman.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">public</span>
            <p className="font-body-sm text-body-sm text-stone-700">
              <strong>Website Live 24/7:</strong> Siap dibagikan ke WhatsApp dan media sosial.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">mark_email_read</span>
            <p className="font-body-sm text-body-sm text-stone-700">
              <strong>Amplop Digital &amp; RSVP:</strong> Rekap tamu hadir dan ucapan secara otomatis.
            </p>
          </div>
        </div>

        {/* Action Buttons: 1-Click Google OAuth */}
        <div className="flex flex-col gap-2.5">
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

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-stone-500 hover:text-stone-800 font-label-sm text-xs transition-colors cursor-pointer text-center mt-1"
          >
            Lanjutkan Mengedit Desain Dulu
          </button>
        </div>
      </div>
    </div>
  );
};
