import React, { useState, useEffect } from 'react';
import { supabase, type UserTemplateRecord } from '../../lib/supabaseClient';
import type { InvitationData } from '../../types/invitation';
import { TemplateCardSelector, type TemplateSelectorItem } from './common/TemplateCardSelector';
import { getInvitationFullUrl, getInvitationDisplayUrl } from '../../utils/urlHelper';
import { formatWishTime } from '../../utils/dateHelper';

interface WishEntry {
  id: string;
  invitation_id?: string;
  guest_name: string;
  message: string;
  attendance?: string;
  created_at: string;
}

export interface WishesListPanelProps {
  userId?: string | null;
  invitationId?: string | null;
  invitationSlug?: string;
  coupleNames?: string;
  currentFormData?: InvitationData;
  activeTemplateId?: string | null;
  onGoToEditor: () => void;
  onOpenMyTemplates?: () => void;
  onOpenAuthGate?: () => void;
  onSelectSavedTemplate?: (template: UserTemplateRecord, stayOnCurrentTab?: boolean) => void;
}

export const WishesListPanel: React.FC<WishesListPanelProps> = ({
  userId,
  invitationId,
  invitationSlug = 'undangan-baru',
  coupleNames = 'Mempelai Pria & Mempelai Wanita',
  currentFormData,
  activeTemplateId,
  onGoToEditor,
  onOpenMyTemplates,
  onOpenAuthGate,
  onSelectSavedTemplate,
}) => {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'hadir' | 'mendoakan'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [hasCopied, setHasCopied] = useState(false);
  const [copiedWishId, setCopiedWishId] = useState<string | null>(null);
  const [wishToDelete, setWishToDelete] = useState<WishEntry | null>(null);
  const [isDeletingWish, setIsDeletingWish] = useState(false);

  // 🌟 Real-time Status & Notifikasi Pesan Masuk
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [newlyArrivedIds, setNewlyArrivedIds] = useState<Set<string>>(new Set());
  const [realtimeNotice, setRealtimeNotice] = useState<{
    guestName: string;
    message: string;
    attendance?: string;
  } | null>(null);

  // State template yang sedang dipilih di selector
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSelectorItem | null>(null);

  const effectiveSlug = selectedTemplate?.slug || invitationSlug || 'undangan-baru';
  const effectiveId = selectedTemplate?.invitationRecordId || selectedTemplate?.id || invitationId;
  const effectiveCouple = selectedTemplate?.coupleNames || coupleNames;

  const handleSelectTemplate = (item: TemplateSelectorItem) => {
    setSelectedTemplate(item);
    if (item.rawTemplate && onSelectSavedTemplate) {
      onSelectSavedTemplate(item.rawTemplate, true);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let targetInvitationId = effectiveId;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchWishes = async () => {
      setIsLoading(true);

      try {
        if (!userId) {
          if (isMounted) {
            setWishes([]);
            setIsLoading(false);
            window.dispatchEvent(
              new CustomEvent('mbell_wishes_count_changed', { detail: { count: 0 } })
            );
          }
          return;
        }

        // Jika ada slug, resolve ID record dari tabel invitations
        if (effectiveSlug && effectiveSlug !== 'undangan-baru' && effectiveSlug !== 'raditya-jessica') {
          const { data: invRow } = await supabase
            .from('invitations')
            .select('id')
            .eq('slug', effectiveSlug)
            .maybeSingle();

          if (invRow?.id) {
            targetInvitationId = invRow.id;
          }
        }

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
          let query = supabase.from('wishes').select('*');
          if (effectiveId && targetInvitationId && effectiveId !== targetInvitationId) {
            query = query.or(`invitation_id.eq.${targetInvitationId},invitation_id.eq.${effectiveId}`);
          } else {
            query = query.eq('invitation_id', targetInvitationId);
          }

          const { data: wishesData, error } = await query.order('created_at', { ascending: false });

          if (!error && wishesData && isMounted) {
            setWishes(wishesData as WishEntry[]);
            window.dispatchEvent(
              new CustomEvent('mbell_wishes_count_changed', { detail: { count: wishesData.length } })
            );
          } else if (isMounted) {
            setWishes([]);
            window.dispatchEvent(
              new CustomEvent('mbell_wishes_count_changed', { detail: { count: 0 } })
            );
          }
        } else if (isMounted) {
          setWishes([]);
          window.dispatchEvent(
            new CustomEvent('mbell_wishes_count_changed', { detail: { count: 0 } })
          );
        }
      } catch {
        if (isMounted) {
          setWishes([]);
          window.dispatchEvent(
            new CustomEvent('mbell_wishes_count_changed', { detail: { count: 0 } })
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWishes();

    // 🌟 SETUP SUPABASE REAL-TIME CHANNEL PADA TABEL 'wishes'
    const channelName = `realtime-wishes-${effectiveSlug || effectiveId || 'panel'}-${Date.now()}`;
    channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishes',
        },
        (payload) => {
          if (!isMounted) return;

          if (payload.eventType === 'INSERT') {
            const newWish = payload.new as WishEntry;
            const isMatch =
              !targetInvitationId ||
              newWish.invitation_id === targetInvitationId ||
              (effectiveId && newWish.invitation_id === effectiveId);

            if (isMatch) {
              setWishes((prev) => {
                if (prev.some((w) => w.id === newWish.id)) return prev;
                const nextList = [newWish, ...prev];
                const realCount = nextList.filter((w) => !w.id.startsWith('wish-')).length;
                window.dispatchEvent(
                  new CustomEvent('mbell_wishes_count_changed', { detail: { count: realCount } })
                );
                return nextList;
              });

              // Tandai ID sebagai wish baru untuk animasi highlight
              setNewlyArrivedIds((prev) => new Set(prev).add(newWish.id));
              setTimeout(() => {
                if (isMounted) {
                  setNewlyArrivedIds((prev) => {
                    const copy = new Set(prev);
                    copy.delete(newWish.id);
                    return copy;
                  });
                }
              }, 12000);

              // Tampilkan toast notifikasi realtime
              setRealtimeNotice({
                guestName: newWish.guest_name,
                message: newWish.message,
                attendance: newWish.attendance,
              });
              setTimeout(() => {
                if (isMounted) {
                  setRealtimeNotice(null);
                }
              }, 6000);
            } else {
              // Jika target id belum sinkron, panggil fetch ulang
              fetchWishes();
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setWishes((prev) => {
                const nextList = prev.filter((w) => w.id !== deletedId);
                const realCount = nextList.filter((w) => !w.id.startsWith('wish-')).length;
                window.dispatchEvent(
                  new CustomEvent('mbell_wishes_count_changed', { detail: { count: realCount } })
                );
                return nextList;
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            fetchWishes();
          }
        }
      )
      .subscribe((status) => {
        if (isMounted) {
          setIsRealtimeConnected(status === 'SUBSCRIBED');
        }
      });

    // 🌟 LISTENER EVENT LOKAL UNTUK PREVIEW EDITOR DI DASHBOARD
    const handleWishEvent = (e: any) => {
      if (e?.detail?.name && e?.detail?.message) {
        const localId = `local-${Date.now()}`;
        const newWish: WishEntry = {
          id: localId,
          guest_name: e.detail.name,
          message: e.detail.message,
          attendance: e.detail.attendance || (e.detail.status === 'hadir' ? 'attending' : 'declined'),
          created_at: new Date().toISOString(),
        };

        setWishes((prev) => {
          if (prev.some((w) => w.guest_name === newWish.guest_name && w.message === newWish.message)) {
            return prev;
          }
          const nextList = [newWish, ...prev];
          window.dispatchEvent(
            new CustomEvent('mbell_wishes_count_changed', { detail: { count: nextList.length } })
          );
          return nextList;
        });

        setNewlyArrivedIds((prev) => new Set(prev).add(localId));
        setTimeout(() => {
          if (isMounted) {
            setNewlyArrivedIds((prev) => {
              const copy = new Set(prev);
              copy.delete(localId);
              return copy;
            });
          }
        }, 12000);

        setRealtimeNotice({
          guestName: newWish.guest_name,
          message: newWish.message,
          attendance: newWish.attendance,
        });
        setTimeout(() => {
          if (isMounted) {
            setRealtimeNotice(null);
          }
        }, 6000);
      }
      fetchWishes();
    };

    window.addEventListener('mbell_wish_submitted', handleWishEvent);
    window.addEventListener('mbell_rsvp_submitted', handleWishEvent);

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('mbell_wish_submitted', handleWishEvent);
      window.removeEventListener('mbell_rsvp_submitted', handleWishEvent);
    };
  }, [userId, effectiveId, effectiveSlug]);

  const handleCopyLink = () => {
    const url = getInvitationFullUrl(effectiveSlug);
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleShareWa = () => {
    const url = getInvitationFullUrl(effectiveSlug);
    const text = encodeURIComponent(
      `Halo! Kami mengundang Anda untuk memberikan doa restu pernikahan kami melalui tautan berikut:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyWishMessage = (wish: WishEntry) => {
    const text = `"${wish.message}" — ${wish.guest_name}`;
    navigator.clipboard.writeText(text);
    setCopiedWishId(wish.id);
    setTimeout(() => setCopiedWishId(null), 2500);
  };

  const handleConfirmDeleteWish = async () => {
    if (!wishToDelete) return;
    setIsDeletingWish(true);
    try {
      if (!wishToDelete.id.startsWith('wish-')) {
        await supabase.from('wishes').delete().eq('id', wishToDelete.id);
      }
      setWishes((prev) => {
        const next = prev.filter((w) => w.id !== wishToDelete.id);
        const realCount = next.filter((w) => !w.id.startsWith('wish-')).length;
        window.dispatchEvent(
          new CustomEvent('mbell_wishes_count_changed', { detail: { count: realCount } })
        );
        return next;
      });
      setWishToDelete(null);
    } catch (e) {
      console.error('Gagal menghapus pesan ucapan:', e);
    } finally {
      setIsDeletingWish(false);
    }
  };

  // Hitung metrik kehadiran
  const attendingCount = wishes.filter(
    (w) => w.attendance === 'attending' || w.attendance === 'hadir'
  ).length;
  const remoteCount = wishes.length - attendingCount;

  // Filter & Urutan
  const filteredWishes = wishes
    .filter((w) => {
      // 1. Text filter
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        w.guest_name.toLowerCase().includes(q) ||
        w.message.toLowerCase().includes(q);
      if (!matchQuery) return false;

      // 2. Attendance category filter
      const isAttending = w.attendance === 'attending' || w.attendance === 'hadir';
      if (attendanceFilter === 'hadir') return isAttending;
      if (attendanceFilter === 'mendoakan') return !isAttending;
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 0. SELECTOR KARTU TEMPLATE UNDANGAN (Hanya tampil jika user sudah login) */}
      {userId && (
        <TemplateCardSelector
          userId={userId}
          currentFormData={currentFormData}
          activeTemplateId={activeTemplateId}
          activeSlug={effectiveSlug}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleSelectTemplate}
          onGoToEditor={onGoToEditor}
          onOpenMyTemplates={onOpenMyTemplates}
          onOpenAuthGate={onOpenAuthGate}
          sectionTitle="Pilih Template Undangan Yang Dikelola"
          sectionSubtitle="Pilih kartu undangan di bawah untuk melihat pesan doa & ucapan khusus undangan tersebut:"
          badgeLabel="Ucapan Masuk"
        />
      )}

      {/* 1. HEADER PANEL UCAPAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight">
              Ucapan &amp; Doa Restu
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {effectiveCouple}
            </span>

            {/* 🌟 Status Indikator Supabase Real-time */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                isRealtimeConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs'
                  : 'bg-stone-100 border-stone-200 text-stone-500'
              }`}
              title={
                isRealtimeConnected
                  ? 'Koneksi Supabase Real-time aktif. Pesan doa baru akan langsung muncul otomatis di layar.'
                  : 'Menghubungkan ke Supabase Real-time...'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                }`}
              />
              <span>{isRealtimeConnected ? 'Real-time Aktif' : 'Menghubungkan...'}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Koleksi pesan selamat dan doa tulus untuk tautan{' '}
            <strong className="font-mono text-stone-800 font-semibold">{getInvitationDisplayUrl(effectiveSlug)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWa}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Bagikan link ke WhatsApp untuk minta doa restu"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span className="hidden sm:inline">Bagikan ke WA</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">
              {hasCopied ? 'done' : 'content_copy'}
            </span>
            <span>{hasCopied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
        </div>
      </div>

      {/* 2. INTERACTIVE SENTIMENT STATS (3 KARTU METRIK) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Total Doa */}
        <div
          onClick={() => setAttendanceFilter('all')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
            attendanceFilter === 'all'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
              : 'bg-white border-stone-200/90 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-stone-500 truncate">Total Doa</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">mail</span>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>{wishes.length}</span>
            {newlyArrivedIds.size > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-sans animate-bounce border border-emerald-300">
                +{newlyArrivedIds.size} baru
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block truncate">Semua ucapan masuk</span>
        </div>

        {/* Konfirmasi Hadir */}
        <div
          onClick={() => setAttendanceFilter('hadir')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
            attendanceFilter === 'hadir'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
              : 'bg-white border-stone-200/90 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-emerald-800 truncate">Konfirmasi Hadir</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">event_available</span>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-emerald-900">
            {attendingCount}
          </div>
          <span className="text-[10px] text-emerald-700/80 mt-0.5 block truncate">
            {wishes.length > 0 ? `${Math.round((attendingCount / wishes.length) * 100)}% dari total` : '0%'}
          </span>
        </div>

        {/* Mendoakan dari Jauh */}
        <div
          onClick={() => setAttendanceFilter('mendoakan')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
            attendanceFilter === 'mendoakan'
              ? 'bg-stone-100 border-stone-400 ring-2 ring-stone-400/20 shadow-xs'
              : 'bg-white border-stone-200/90 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-stone-600 truncate">Mendoakan</span>
            <span className="material-symbols-outlined text-[18px] text-stone-500">volunteer_activism</span>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-stone-900">
            {remoteCount}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block truncate">Izin berhalangan</span>
        </div>
      </div>

      {/* 3. TOOLBAR PENCARIAN & FILTER PILLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input dengan Tombol Clear */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari pengirim atau pesan doa...`}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills & Sort Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setAttendanceFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                attendanceFilter === 'all'
                  ? 'bg-white text-stone-900 font-bold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({wishes.length})
            </button>
            <button
              type="button"
              onClick={() => setAttendanceFilter('hadir')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                attendanceFilter === 'hadir'
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hadir ({attendingCount})
            </button>
            <button
              type="button"
              onClick={() => setAttendanceFilter('mendoakan')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                attendanceFilter === 'mendoakan'
                  ? 'bg-stone-900 text-white font-bold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Mendoakan ({remoteCount})
            </button>
          </div>

          {/* Sort Button Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors shrink-0 cursor-pointer"
            title={sortOrder === 'desc' ? 'Urutan: Terbaru ke Terlama' : 'Urutan: Terlama ke Terbaru'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
            </span>
            <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* 4. GRID KARTU UCAPAN (LOVE NOTE CARDS) */}
      {isLoading ? (
        <div className="py-20 text-center text-stone-400">
          <span className="material-symbols-outlined text-3xl animate-spin text-stone-600">
            progress_activity
          </span>
          <p className="text-xs mt-2 font-medium">Memuat ucapan dan doa restu...</p>
        </div>
      ) : filteredWishes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 border border-stone-200/90 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-700">
            <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
              {wishes.length === 0
                ? `Belum Ada Ucapan untuk ${effectiveCouple}`
                : 'Tidak Ada Ucapan yang Sesuai Filter'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {wishes.length === 0
                ? `Bagikan tautan ${getInvitationDisplayUrl(effectiveSlug)} ke keluarga & sahabat untuk mulai menerima pesan doa restu online.`
                : 'Coba ubah kata kunci pencarian atau reset filter kehadiran untuk melihat ucapan lainnya.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {wishes.length === 0 ? (
              <>
                <button
                  type="button"
                  onClick={handleShareWa}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  <span>Bagikan Link via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Salin Tautan</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setAttendanceFilter('all');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Reset Pencarian &amp; Filter</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWishes.map((wish) => {
            const isAttending = wish.attendance === 'attending' || wish.attendance === 'hadir';
            const isCopied = copiedWishId === wish.id;
            const isNew = newlyArrivedIds.has(wish.id);

            return (
              <div
                key={wish.id}
                className={`p-5 rounded-2xl bg-white border transition-all space-y-3.5 flex flex-col justify-between relative group ${
                  isNew
                    ? 'border-emerald-500 ring-2 ring-emerald-400/30 bg-emerald-50/15 shadow-md animate-in fade-in slide-in-from-top-3 duration-500'
                    : 'border-stone-200/90 hover:border-amber-300 hover:shadow-xs'
                }`}
              >
                {/* Decorative Watermark Quote Icon */}
                <span className="material-symbols-outlined text-[36px] text-stone-200/50 absolute right-4 top-4 select-none pointer-events-none group-hover:text-amber-200/60 transition-colors">
                  format_quote
                </span>

                <div className="space-y-3">
                  {/* Top Bar: Avatar, Nama, Status RSVP, Tanggal, & Badge Pesan Baru */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                          isNew
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white ring-2 ring-emerald-300'
                            : 'bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950'
                        }`}
                      >
                        {wish.guest_name ? wish.guest_name.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                            {wish.guest_name}
                          </h4>
                          {isNew && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 animate-pulse shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Baru Saja
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isAttending ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <span className="material-symbols-outlined text-[11px]">event_available</span>
                              <span>Konfirmasi Hadir</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                              <span className="material-symbols-outlined text-[11px]">volunteer_activism</span>
                              <span>Mendoakan dari Jauh</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono shrink-0">
                      {formatWishTime(wish.created_at)}
                    </span>
                  </div>

                  {/* Isi Pesan Doa Restu */}
                  <div
                    className={`p-3.5 rounded-xl border text-xs sm:text-[13px] leading-relaxed font-sans relative ${
                      isNew
                        ? 'bg-white border-emerald-200 text-stone-900 font-medium shadow-2xs'
                        : 'bg-[#FAF8F5] border-stone-200/70 text-stone-800'
                    }`}
                  >
                    <p className="italic whitespace-pre-line">"{wish.message}"</p>
                  </div>
                </div>

                {/* Footer Micro-Actions: Salin & Hapus */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  <button
                    type="button"
                    onClick={() => handleCopyWishMessage(wish)}
                    className="text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    title="Salin ucapan ini untuk repost di media sosial"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isCopied ? 'done' : 'content_copy'}
                    </span>
                    <span>{isCopied ? 'Doa Disalin!' : 'Salin Doa'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWishToDelete(wish)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
                    title="Hapus doa ini"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. FLOATING REALTIME TOAST NOTIFICATION BANNER */}
      {realtimeNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 bg-stone-950/95 text-white rounded-2xl shadow-2xl border border-emerald-500/50 backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px] animate-bounce">mark_email_unread</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ucapan Doa Baru Masuk!
              </span>
              <button
                type="button"
                onClick={() => setRealtimeNotice(null)}
                className="text-stone-400 hover:text-white cursor-pointer"
                title="Tutup notifikasi"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            </div>
            <h5 className="font-serif font-bold text-sm text-white truncate mt-0.5">
              {realtimeNotice.guestName}
            </h5>
            <p className="text-[11px] text-stone-300 line-clamp-2 mt-1 italic">
              "{realtimeNotice.message}"
            </p>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS UCAPAN */}
      {wishToDelete && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-stone-900">Hapus Ucapan Ini?</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Pesan doa dari <strong className="text-stone-800">{wishToDelete.guest_name}</strong> akan dihapus permanen dari buku tamu online.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isDeletingWish}
                onClick={() => setWishToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingWish}
                onClick={handleConfirmDeleteWish}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                {isDeletingWish ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                ) : (
                  <span>Hapus Permanen</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
