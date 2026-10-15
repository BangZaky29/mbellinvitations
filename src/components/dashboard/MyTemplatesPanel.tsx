import React, { useState, useEffect } from 'react';
import { fetchUserTemplates, deleteUserTemplate, type UserTemplateRecord } from '../../lib/supabaseClient';
import type { InvitationData } from '../../types/invitation';

export interface ThemePresetItem {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
}

export const THEME_PRESETS: ThemePresetItem[] = [
  {
    id: 'modern',
    name: 'Modern Arch & Minimalist',
    category: 'Editorial Luxury',
    description: 'Palet warm champagne, typografi majalah editorial, clean layout',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rustic',
    name: 'Rustic Botanical Garden',
    category: 'Earthy Nature',
    description: 'Nuansa botanical sage green & wood warm, hangat & natural',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'jawa',
    name: 'Klasik Keraton Jawa',
    category: 'Adat Nusantara',
    description: 'Sentuhan ornamen ukir batik emas & tradisi panggih agung',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'islami',
    name: 'Islami Nuansa Kubah',
    category: 'Sacred Ornament',
    description: 'Kubah Maroko bernuansa emerald dan ayat-ayat suci pernikahan',
    thumbnail: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'luxury',
    name: 'Midnight Black & Gold Luxury',
    category: 'VIP Glamour',
    description: 'Kemewahan monokrom midnight black dan aksen foil emas berkilau',
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
  },
];

export interface MyTemplatesPanelProps {
  currentUserId?: string | null;
  currentFormData: InvitationData;
  activeTemplateId?: string | null;
  onSelectTemplate: (template: UserTemplateRecord) => void;
  onImplementActiveTemplate?: () => void;
  onOpenAuthGate: () => void;
  onAddNewTemplate: (themeId: string) => void;
  onSlugChange?: (newSlug: string) => void;
}

const THEME_BANNER_COLORS: Record<string, { bg: string; text: string; badge: string; label: string }> = {
  modern: {
    bg: 'from-stone-900 via-stone-800 to-amber-950/80',
    text: 'text-amber-200',
    badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    label: 'Modern Minimalist',
  },
  rustic: {
    bg: 'from-stone-800 via-amber-900/60 to-emerald-950/80',
    text: 'text-amber-100',
    badge: 'bg-amber-600/20 text-amber-200 border-amber-500/30',
    label: 'Rustic Garden & Wood',
  },
  jawa: {
    bg: 'from-amber-950 via-stone-900 to-yellow-950/80',
    text: 'text-yellow-200',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    label: 'Jawa Klasik Kasunanan',
  },
  islami: {
    bg: 'from-emerald-950 via-teal-900 to-stone-900',
    text: 'text-emerald-200',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    label: 'Islami Nuansa Emerald',
  },
  luxury: {
    bg: 'from-slate-950 via-stone-900 to-amber-950/90',
    text: 'text-amber-300',
    badge: 'bg-amber-300/20 text-amber-300 border-amber-300/40',
    label: 'Royal Gold & Black Luxury',
  },
};

export const MyTemplatesPanel: React.FC<MyTemplatesPanelProps> = ({
  currentUserId,
  currentFormData,
  activeTemplateId,
  onSelectTemplate,
  onImplementActiveTemplate,
  onOpenAuthGate,
  onAddNewTemplate,
}) => {
  const [templates, setTemplates] = useState<UserTemplateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user templates
  const loadTemplates = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const data = await fetchUserTemplates(currentUserId);
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load user templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadTemplates();
    }
    const handleUpdate = () => {
      if (currentUserId) {
        loadTemplates();
      }
    };
    window.addEventListener('mbell_templates_updated', handleUpdate);
    return () => {
      window.removeEventListener('mbell_templates_updated', handleUpdate);
    };
  }, [currentUserId, activeTemplateId]);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await deleteUserTemplate(id);
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(`Gagal menghapus template: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Terjadi error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredTemplates = templates.filter((t) => {
    if (filter === 'published') return t.status === 'published';
    if (filter === 'draft') return t.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-[24px]">dashboard_customize</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                Template Saya
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-sans">
                Kelola dan beralih antara template undangan yang telah Anda simpan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUserId && (
            <button
              onClick={loadTemplates}
              disabled={loading}
              title="Perbarui daftar"
              className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
            >
              <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Buat Undangan Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Guest Notice (If Not Logged In) */}
      {!currentUserId && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[22px]">lock</span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Simpan Template ke Akun Anda
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Anda sedang mengedit sebagai tamu. Masuk atau Daftar gratis agar setiap template yang Anda simpan dapat diakses kembali dan dikelola secara mandiri kapan saja.
              </p>
            </div>

            <button
              onClick={onOpenAuthGate}
              className="shrink-0 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Masuk / Daftar Akun</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Filter Tabs (If user has templates) */}
      {currentUserId && templates.length > 0 && (
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Semua ({templates.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'published'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Published ({templates.filter((t) => t.status === 'published').length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'draft'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Draft ({templates.filter((t) => t.status === 'draft').length})
            </button>
          </div>

          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Tersimpan di Supabase Cloud
          </span>
        </div>
      )}

      {/* 4. Active Current Draft Card (Always accessible for editing) */}
      {(() => {
        const gSlug = (currentFormData.groom?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const bSlug = (currentFormData.bride?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const autoCoupleSlug = (gSlug && bSlug) ? `${gSlug}-${bSlug}` : '';
        const currentEffectiveSlug = (currentFormData.slug && currentFormData.slug !== 'raditya-jessica')
          ? currentFormData.slug
          : (autoCoupleSlug || currentFormData.slug || 'raditya-jessica');

        return (
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-stone-300/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center font-serif font-bold text-xl shadow-xs shrink-0">
                  {currentFormData.groom?.name?.charAt(0) || 'Z'}
                  <span className="text-stone-400 text-xs mx-0.5">&</span>
                  {currentFormData.bride?.name?.charAt(0) || 'B'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                      Sedang Aktif di Editor
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium uppercase">
                      Tema: {currentFormData.theme_id || 'modern'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      currentFormData.status === 'published'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1'
                        : 'bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1'
                    }`}>
                      {currentFormData.status === 'published' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Live Tayang</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Draf Checkpoint</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mt-1">
                    {currentFormData.groom?.name || 'Raditya'} & {currentFormData.bride?.name || 'Jessica'}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-stone-500">
                      Tautan Website: <span className="font-mono text-stone-900 font-bold select-all">mbell.id/{currentEffectiveSlug}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {onImplementActiveTemplate && (
                  <button
                    type="button"
                    onClick={onImplementActiveTemplate}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-200">edit_note</span>
                    <span>Lanjut Edit di Editor</span>
                  </button>
                )}
                <a
                  href={`/${currentEffectiveSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>Pratinjau Live</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. User Saved Templates Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500">Memuat koleksi template Anda...</p>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTemplates.map((item) => {
            const themeStyle = THEME_BANNER_COLORS[item.theme_id || 'modern'] || THEME_BANNER_COLORS.modern;
            
            // Hitung slug otomatis dari nama mempelai pada setiap template tersimpan
            const itemG = (item.content?.groom?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const itemB = (item.content?.bride?.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const itemAutoSlug = (itemG && itemB) ? `${itemG}-${itemB}` : '';
            const itemEffectiveSlug = (item.slug && item.slug !== 'raditya-jessica') ? item.slug : (itemAutoSlug || item.slug || 'raditya-jessica');

            const isCopied = copiedSlug === itemEffectiveSlug;
            
            const currentG = (currentFormData.groom?.name || '').trim().toLowerCase();
            const currentB = (currentFormData.bride?.name || '').trim().toLowerCase();
            const namesMatch = currentG && currentB && itemG === currentG && itemB === currentB;

            const isCurrentActive =
              (Boolean(activeTemplateId) && item.id === activeTemplateId) ||
              namesMatch ||
              (itemEffectiveSlug === (currentFormData.slug || 'raditya-jessica') &&
                (item.theme_id === currentFormData.theme_id ||
                  (item.template_id === 'template3' && currentFormData.theme_id === 'jawa') ||
                  (item.template_id === 'template1' && currentFormData.theme_id === 'modern') ||
                  (item.template_id === 'template2' && currentFormData.theme_id === 'rustic') ||
                  (item.template_id === 'template4' && currentFormData.theme_id === 'islami') ||
                  (item.template_id === 'template5' && currentFormData.theme_id === 'luxury')));

            const updatedDate = item.updated_at
              ? new Date(item.updated_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Baru saja';

            const isDraft = item.status === 'draft';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between group ${
                  isCurrentActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                    : 'border-stone-200/90 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Banner Visual */}
                <div className={`p-5 bg-gradient-to-br ${themeStyle.bg} text-white relative`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${themeStyle.badge}`}>
                      {themeStyle.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isCurrentActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-stone-900 border border-amber-300 shadow-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          <span>Sedang Aktif</span>
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                          item.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/25 text-amber-200 border border-amber-400/30'
                        }`}
                      >
                        {item.status === 'published' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[11px]">bookmark</span>
                            <span>Draf Checkpoint</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {item.title || 'Undangan Pernikahan'}
                  </h3>
                  <p className="text-xs text-stone-300/80 mt-0.5">
                    {item.content?.groom?.name || 'Mempelai Pria'} & {item.content?.bride?.name || 'Mempelai Wanita'}
                  </p>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Slug & Link */}
                    <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="material-symbols-outlined text-stone-400 text-[16px]">link</span>
                        <span className="font-mono text-xs text-stone-700 font-bold truncate">
                          /{itemEffectiveSlug}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyLink(itemEffectiveSlug)}
                        title="Salin tautan undangan"
                        className="p-1 hover:bg-stone-200 rounded-md text-stone-500 transition-colors shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isCopied ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                      <span>Diperbarui: {updatedDate}</span>
                      <span>ID: {item.template_id}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => onSelectTemplate({ ...item, slug: itemEffectiveSlug })}
                      className={`flex-1 py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer ${
                        isCurrentActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : isDraft
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isCurrentActive ? 'edit_note' : isDraft ? 'file_open' : 'palette'}
                      </span>
                      <span>
                        {isCurrentActive
                          ? '✓ Sedang Diedit (Lanjut)'
                          : isDraft
                          ? '📂 Tarik & Lanjut Edit Draf Ini'
                          : 'Buka & Edit Template Ini'}
                      </span>
                    </button>

                    <a
                      href={`/${itemEffectiveSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Buka pratinjau publik"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-600 text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
                      title="Hapus template"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : currentUserId ? (
        /* Empty State for Logged In User */
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">
              {filter === 'draft' ? 'bookmark_border' : filter === 'published' ? 'public_off' : 'folder_open'}
            </span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {filter === 'draft'
                ? 'Belum Ada Draf Checkpoint'
                : filter === 'published'
                ? 'Belum Ada Undangan Live'
                : 'Belum Ada Template Tersimpan'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {filter === 'draft' ? (
                <>
                  Anda belum memiliki draf checkpoint. Saat mengedit undangan, klik tombol <strong>"Simpan Draf"</strong> di toolbar atas editor untuk menyimpan checkpoint progres editan Anda.
                </>
              ) : filter === 'published' ? (
                <>
                  Undangan Anda belum dipublikasikan ke publik. Buka editor dan klik <strong>"Publikasikan"</strong> di pojok kanan atas untuk menerbitkan undangan live.
                </>
              ) : (
                <>
                  Rancangan undangan aktif Anda otomatis tersimpan aman, atau klik <strong>"Buat Undangan Baru"</strong> di bawah untuk menambah variasi template.
                </>
              )}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            {filter !== 'all' && (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 transition-colors"
              >
                <span>Lihat Semua Template</span>
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs sm:text-sm hover:bg-stone-800 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Mulai Buat Undangan Baru</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* 6. Quick Start Theme Showcase (Presets) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
              Pilihan Konsep Desain Tersedia
            </h3>
            <p className="text-xs text-stone-500">
              Pilih salah satu dari 5 preset tema eksklusif untuk memulai desain undangan baru.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onAddNewTemplate(preset.id)}
              className="bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-stone-900/40 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-2.5 relative bg-stone-100">
                <img
                  src={preset.thumbnail}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-[9px] font-semibold text-white">
                  {preset.category}
                </span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-stone-900 group-hover:text-amber-800 line-clamp-1">
                  {preset.name}
                </h4>
                <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Modal Konfirmasi Hapus */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900">
                Hapus Template Ini?
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Template ini akan dihapus dari koleksi Anda di cloud. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-xs hover:bg-stone-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal Pilih Tema Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h4 className="font-serif font-bold text-lg text-stone-900">
                  Pilih Konsep Undangan Baru
                </h4>
                <p className="text-xs text-stone-500">
                  Pilih gaya visual awal untuk proyek undangan baru Anda
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {THEME_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    onAddNewTemplate(preset.id);
                    setShowCreateModal(false);
                  }}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-stone-900/40 hover:bg-stone-50 flex items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.thumbnail}
                      alt={preset.name}
                      className="w-14 h-12 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-800">
                        {preset.name}
                      </h5>
                      <span className="text-[10px] text-stone-500 block">
                        {preset.category} &bull; {preset.description}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-stone-300 group-hover:text-stone-900 text-[18px]">
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
