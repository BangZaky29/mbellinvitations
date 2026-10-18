import React, { useState, useEffect } from 'react';
import {
  fetchUserTemplates,
  deleteUserTemplate,
  purgeRadityaJessica,
  type UserTemplateRecord,
} from '../../lib/supabaseClient';
import {
  type ThemePresetItem,
  type MyTemplatesPanelProps,
  THEME_PRESETS,
  THEME_BANNER_COLORS,
} from './my-templates/types';
import { ActiveDraftCard } from './my-templates/ActiveDraftCard';
import { TemplateCard } from './my-templates/TemplateCard';
import { ThemeShowcase } from './my-templates/ThemeShowcase';
import { DeleteTemplateModal } from './my-templates/DeleteTemplateModal';
import { NewTemplateModal } from './my-templates/NewTemplateModal';
import { SleekToast } from '../common/SleekToast';

// Re-export types and presets for external consumers
export type { ThemePresetItem, MyTemplatesPanelProps };
export { THEME_PRESETS, THEME_BANNER_COLORS };

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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
    // Jalankan pembersihan raditya-jessica di background
    purgeRadityaJessica();

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
    setToastMsg(`Tautan mbell.id/${slug} berhasil disalin!`);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const targetTemplate = templates.find((t) => t.id === id);
      const targetSlug = targetTemplate?.slug;

      const res = await deleteUserTemplate(id, targetSlug);
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        setDeleteConfirmId(null);
        setToastMsg('Template berhasil dihapus permanen');

        // Beritahu seluruh komponen dashboard (Selector, Tamu, Ucapan) bahwa template ini telah dihapus
        window.dispatchEvent(new CustomEvent('mbell_template_deleted', { detail: { id, slug: targetSlug } }));
        window.dispatchEvent(new CustomEvent('mbell_templates_updated'));

        // Jika target slug adalah raditya-jessica, jalankan pembersihan tuntas
        if (targetSlug === 'raditya-jessica' || (targetTemplate?.title || '').toLowerCase().includes('raditya')) {
          await purgeRadityaJessica();
        }

        // Jika template yang dihapus adalah template yang sedang aktif di editor
        const isActiveBeingDeleted =
          activeTemplateId === id ||
          currentFormData.slug === targetSlug ||
          targetSlug === 'raditya-jessica';

        if (isActiveBeingDeleted) {
          localStorage.removeItem('mbell_active_template_id');
          localStorage.removeItem('mbell_pending_draft_formData');
          localStorage.removeItem('mbell_pending_draft_themeConfig');
          localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');

          // Reset editor state ke draf bersih baru
          window.dispatchEvent(new CustomEvent('mbell_reset_editor_blank'));
        }
      } else {
        alert(`Gagal menghapus template: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Terjadi error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Deteksi template yang sedang aktif di editor
  const isTemplateActive = (t: UserTemplateRecord) => {
    if (activeTemplateId && t.id === activeTemplateId) return true;
    if (t.slug && currentFormData.slug && t.slug === currentFormData.slug) return true;
    const gName = (t.content?.groom?.name || '').trim().toLowerCase();
    const bName = (t.content?.bride?.name || '').trim().toLowerCase();
    const curG = (currentFormData.groom?.name || '').trim().toLowerCase();
    const curB = (currentFormData.bride?.name || '').trim().toLowerCase();
    if (curG && curB && gName === curG && bName === curB) return true;
    return false;
  };

  // Record template aktif di Supabase jika sudah tersimpan
  const activeRecord = templates.find(isTemplateActive) || null;

  // Filtered list: pastikan raditya-jessica dan judul Raditya & Jessica disaring keluar 100%
  const cleanTemplates = templates.filter((t) => {
    if (t.slug === 'raditya-jessica') return false;
    const title = (t.title || '').toLowerCase();
    if (title.includes('raditya') && title.includes('jessica')) return false;
    const gName = (t.content?.groom?.name || '').toLowerCase();
    const bName = (t.content?.bride?.name || '').toLowerCase();
    if (gName.includes('raditya') && bName.includes('jessica')) return false;
    return true;
  });

  // Filter berdasarkan status tab (Semua, Published, Draft)
  const filteredTemplates = cleanTemplates.filter((t) => {
    if (filter === 'published') return t.status === 'published';
    if (filter === 'draft') return t.status === 'draft';
    return true;
  });

  // Hanya tampilkan draft box khusus jika user benar-benar belum memiliki template tersimpan di DB
  const hasValidNames =
    (Boolean(currentFormData.groom?.name) && currentFormData.groom?.name !== 'Mempelai Pria') ||
    (Boolean(currentFormData.bride?.name) && currentFormData.bride?.name !== 'Mempelai Wanita');
  const showUnsavedDraft = cleanTemplates.length === 0 && hasValidNames;

  return (
    <div className="space-y-6">
      {/* Sleek Universal Toast Notification */}
      <SleekToast
        show={Boolean(toastMsg)}
        message={toastMsg || ''}
        type="copy"
        onClose={() => setToastMsg(null)}
      />

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
      {currentUserId && cleanTemplates.length > 0 && (
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
              Semua ({cleanTemplates.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'published'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Published ({cleanTemplates.filter((t) => t.status === 'published').length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'draft'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Draft ({cleanTemplates.filter((t) => t.status === 'draft').length})
            </button>
          </div>

          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Tersimpan di Supabase Cloud
          </span>
        </div>
      )}

      {/* 4. Daftar Template Pengguna (Clean, Simple, Terbaca Jelas & Tanpa Duplikasi) */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500">Memuat koleksi template Anda...</p>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-600">collections_bookmark</span>
              <span>Daftar Template Undangan ({filteredTemplates.length})</span>
            </h3>
          </div>
          <div className="space-y-3.5">
            {filteredTemplates.map((item) => (
              <TemplateCard
                key={item.id}
                item={item}
                currentFormData={currentFormData}
                activeTemplateId={activeTemplateId}
                copiedSlug={copiedSlug}
                onCopyLink={handleCopyLink}
                onSelectTemplate={onSelectTemplate}
                onDeleteClick={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        </div>
      ) : cleanTemplates.length > 0 && filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-xs space-y-2">
          <p className="text-stone-600 text-sm">Tidak ada template dengan status <strong>{filter}</strong>.</p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="text-xs text-amber-700 font-semibold hover:underline cursor-pointer"
          >
            Tampilkan semua template ({cleanTemplates.length})
          </button>
        </div>
      ) : showUnsavedDraft ? (
        <ActiveDraftCard
          currentFormData={currentFormData}
          activeRecord={activeRecord}
          copiedSlug={copiedSlug}
          onCopyLink={handleCopyLink}
          onImplementActiveTemplate={onImplementActiveTemplate}
          onDeleteClick={(id) => setDeleteConfirmId(id)}
        />
      ) : cleanTemplates.length === 0 && currentUserId ? (
        /* Empty State for Logged In User jika benar-benar belum ada data */
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Lihat Semua Template</span>
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs sm:text-sm hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Mulai Buat Undangan Baru</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* 6. Quick Start Theme Showcase (Presets) */}
      <ThemeShowcase onAddNewTemplate={onAddNewTemplate} />

      {/* 7. Modal Konfirmasi Hapus */}
      <DeleteTemplateModal
        isOpen={Boolean(deleteConfirmId)}
        isDeleting={isDeleting}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
      />

      {/* 8. Modal Pilih Tema Baru */}
      <NewTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSelectTheme={onAddNewTemplate}
      />
    </div>
  );
};
