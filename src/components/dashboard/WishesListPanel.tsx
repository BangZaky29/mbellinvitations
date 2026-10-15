import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface WishEntry {
  id: string;
  guest_name: string;
  message: string;
  attendance?: string;
  created_at: string;
}

interface WishesListPanelProps {
  userId?: string | null;
  invitationId?: string | null;
  invitationSlug?: string;
  onGoToEditor: () => void;
  onOpenAuthGate?: () => void;
}

export const WishesListPanel: React.FC<WishesListPanelProps> = ({
  userId,
  invitationId,
  invitationSlug = 'raditya-jessica',
  onGoToEditor,
  onOpenAuthGate,
}) => {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const fetchWishes = async () => {
      setIsLoading(true);
      try {
        if (!userId) {
          setWishes([]);
          setIsLoading(false);
          return;
        }

        let targetInvitationId = invitationId;
        if (!targetInvitationId) {
          const { data: invData } = await supabase
            .from('invitations')
            .select('id')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (invData) {
            targetInvitationId = invData.id;
          }
        }

        if (targetInvitationId) {
          const { data: wishesData, error } = await supabase
            .from('wishes')
            .select('*')
            .eq('invitation_id', targetInvitationId)
            .order('created_at', { ascending: false });

          if (!error && wishesData) {
            setWishes(wishesData as WishEntry[]);
          }
        } else {
          setWishes([]);
        }
      } catch {
        setWishes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishes();
  }, [userId, invitationId]);

  const handleCopyLink = () => {
    const url = `https://mbell.id/${invitationSlug}`;
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const filteredWishes = wishes.filter(
    (w) =>
      !searchQuery ||
      w.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. Kondisi Belum Login
  if (!userId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Masuk untuk Melihat Ucapan &amp; Doa Restu
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Silakan masuk dengan akun Anda untuk melihat pesan hangat dan doa restu dari para sahabat dan keluarga.
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

  // 2. Kondisi Undangan Belum Dibuat
  if (!invitationId && wishes.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">draft</span>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Belum Ada Undangan yang Dibuat
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Anda belum memiliki undangan pernikahan aktif. Buat undangan terlebih dahulu untuk mulai menerima ucapan penuh berkah dari para tamu.
          </p>
        </div>
        <button
          onClick={onGoToEditor}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Mulai Buat Undangan</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            Ucapan &amp; Doa Restu Masuk
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Kumpulan doa dan ucapan selamat dari keluarga serta sahabat tercinta.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">
            {hasCopied ? 'done' : 'content_copy'}
          </span>
          <span>{hasCopied ? 'Tautan Tersalin!' : 'Bagikan Link Undangan'}</span>
        </button>
      </div>

      {/* Bar Pencarian & Total Badge */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengirim atau pesan doa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold self-start sm:self-auto">
          <span className="material-symbols-outlined text-[16px] text-amber-600">volunteer_activism</span>
          <span>Total {wishes.length} Doa Diterima</span>
        </div>
      </div>

      {/* Grid Kartu Ucapan */}
      {isLoading ? (
        <div className="py-16 text-center text-stone-400">
          <span className="material-symbols-outlined text-3xl animate-spin text-stone-600">
            progress_activity
          </span>
          <p className="text-xs mt-2 font-medium">Memuat ucapan dan doa restu...</p>
        </div>
      ) : filteredWishes.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-stone-200/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
            <span className="material-symbols-outlined text-2xl">mark_email_read</span>
          </div>
          <h4 className="font-semibold text-stone-800 text-sm">
            {wishes.length === 0
              ? 'Belum Ada Ucapan dan Doa yang Masuk'
              : 'Tidak Ada Ucapan yang Sesuai dengan Pencarian'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {wishes.length === 0
              ? 'Bagikan tautan undangan Anda ke keluarga & sahabat untuk mulai menerima pesan doa restu.'
              : 'Silakan gunakan kata kunci lain untuk mencari ucapan tertentu.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredWishes.map((wish) => (
            <div
              key={wish.id}
              className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {wish.guest_name ? wish.guest_name.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        {wish.guest_name}
                      </h4>
                      {wish.attendance && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                          {wish.attendance === 'attending' || wish.attendance === 'hadir'
                            ? 'Konfirmasi Hadir'
                            : 'Mendoakan dari Jauh'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(wish.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                  "{wish.message}"
                </p>
              </div>

              <div className="flex items-center justify-end text-[10px] text-stone-400 font-medium">
                <span>Diterima via Undangan Digital</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
