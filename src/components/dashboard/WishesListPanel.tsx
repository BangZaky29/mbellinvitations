import React, { useState, useEffect } from 'react';
import { supabase, type UserTemplateRecord } from '../../lib/supabaseClient';
import type { InvitationData } from '../../types/invitation';
import { TemplateCardSelector, type TemplateSelectorItem } from './common/TemplateCardSelector';
import { MOCK_THEME_WISHES_MAP, MOCK_MODERN_WISHES } from '../../data/mockInvitation';

interface WishEntry {
  id: string;
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
  const [hasCopied, setHasCopied] = useState(false);

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
    const fetchWishes = async () => {
      setIsLoading(true);
      const themeKey = selectedTemplate?.themeId || 'modern';
      const defaultMocks: WishEntry[] = ((MOCK_THEME_WISHES_MAP as any)[themeKey] || MOCK_MODERN_WISHES).map(
        (m: any, i: number) => ({
          id: `wish-${themeKey}-${i}`,
          guest_name: m.guest_name,
          message: m.message,
          attendance: m.attendance,
          created_at: m.created_at || new Date().toISOString(),
        })
      );

      try {
        if (!userId) {
          setWishes(defaultMocks);
          setIsLoading(false);
          return;
        }

        let targetInvitationId = effectiveId;

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

          if (!error && wishesData && wishesData.length > 0) {
            setWishes(wishesData as WishEntry[]);
          } else {
            setWishes(defaultMocks);
          }
        } else {
          setWishes(defaultMocks);
        }
      } catch {
        setWishes(defaultMocks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishes();
  }, [userId, effectiveId, effectiveSlug]);

  const handleCopyLink = () => {
    const url = `https://mbell.id/${effectiveSlug}`;
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 0. SELECTOR KARTU TEMPLATE UNDANGAN */}
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

      {/* HEADER PANEL UCAPAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Ucapan &amp; Doa Restu Masuk
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {effectiveCouple}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Kumpulan doa dan ucapan selamat dari keluarga serta sahabat tercinta untuk tautan{' '}
            <span className="font-mono text-stone-700 font-semibold">mbell.id/{effectiveSlug}</span>.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
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
            placeholder={`Cari pengirim atau ucapan untuk ${effectiveCouple}...`}
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
              ? `Belum Ada Ucapan dan Doa untuk ${effectiveCouple}`
              : 'Tidak Ada Ucapan yang Sesuai dengan Pencarian'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {wishes.length === 0
              ? `Bagikan tautan mbell.id/${effectiveSlug} ke keluarga & sahabat untuk mulai menerima pesan doa restu pada template ini.`
              : 'Silakan gunakan kata kunci lain untuk mencari ucapan tertentu.'}
          </p>
          {wishes.length === 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Salin Link Undangan Ini</span>
              </button>
            </div>
          )}
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
                <span>Diterima via mbell.id/{effectiveSlug}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
