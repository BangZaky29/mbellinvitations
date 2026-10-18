import React, { useState, useRef } from 'react';
import type { GuestItem, GuestListPanelProps } from './guest-list/types';
import { useWaBlast } from '../../hooks/useWaBlast';
import { useGuestList } from '../../hooks/useGuestList';
import { TemplateCardSelector, type TemplateSelectorItem } from './common/TemplateCardSelector';
import { SleekToast } from '../common/SleekToast';

// Sub-components
import { QuickLinkGenerator } from './guest-list/QuickLinkGenerator';
import { GuestStatsBar } from './guest-list/GuestStatsBar';
import { GuestTableRow } from './guest-list/GuestTableRow';
import { BulkPasteModal } from './guest-list/BulkPasteModal';
import { SingleAddModal } from './guest-list/SingleAddModal';
import { ContactNoticeModal } from './guest-list/ContactNoticeModal';
import { WaTemplateEditorModal } from './guest-list/WaTemplateEditorModal';

// Re-export types for backward compatibility
export type { GuestItem, GuestListPanelProps };

export const GuestListPanel: React.FC<GuestListPanelProps> = ({
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showContactNoticeModal, setShowContactNoticeModal] = useState(false);

  // State template undangan yang sedang dipilih
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSelectorItem | null>(null);

  const effectiveSlug = selectedTemplate?.slug || invitationSlug || 'undangan-baru';
  const effectiveId = selectedTemplate?.invitationRecordId || selectedTemplate?.id || invitationId;
  const effectiveCouple = selectedTemplate?.coupleNames || coupleNames;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTemplate = (item: TemplateSelectorItem) => {
    setSelectedTemplate(item);
    if (item.rawTemplate && onSelectSavedTemplate) {
      onSelectSavedTemplate(item.rawTemplate, true);
    }
  };

  // Bridge ref untuk update status WA tamu ke database tanpa circular dependency
  const updateWaStatusRef = useRef<((guestId: string, isSent: boolean) => Promise<void>) | null>(null);

  // 1. Hook WA Blast (Template, sent tracker, WhatsApp links)
  const wa = useWaBlast({
    invitationSlug: effectiveSlug,
    coupleNames: effectiveCouple,
    onUpdateWaStatus: async (guestId, isSent) => {
      if (updateWaStatusRef.current) {
        await updateWaStatusRef.current(guestId, isSent);
      }
    },
    showToast,
  });

  // 2. Hook Guest List (State, CRUD, Filter, CSV)
  const gl = useGuestList({
    userId,
    invitationId: effectiveId,
    invitationSlug: effectiveSlug,
    sentGuestIds: wa.sentGuestIds,
    onSyncSentIds: wa.syncSentIds,
    showToast,
  });

  updateWaStatusRef.current = gl.updateGuestWaStatusInList;

  // Handlers for modal interactions
  const handleBulkProcess = async (
    parsed: { name: string; phoneNumber?: string }[],
    category: string
  ) => {
    try {
      await gl.addBulkGuests(parsed, category);
      showToast(`🎉 Berhasil menambahkan ${parsed.length} tamu sekaligus & link unik telah dibuat!`);
    } catch (err: any) {
      showToast('❌ Gagal menyimpan tamu: ' + (err.message || 'Coba lagi'));
    }
  };

  const handleSingleAdd = async (data: {
    name: string;
    phone: string;
    category: string;
    pax: string;
  }) => {
    try {
      await gl.addSingleGuest(data);
      showToast(`✅ Tamu "${data.name.trim()}" berhasil ditambahkan!`);
    } catch (err: any) {
      showToast('❌ Gagal menambah tamu: ' + err.message);
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!window.confirm(`Hapus tamu "${guestName}" dari daftar?`)) return;
    try {
      await gl.deleteGuest(guestId);
      wa.setSentGuestIds((prev) => {
        const next = new Set(prev);
        next.delete(guestId);
        return next;
      });
      showToast(`🗑️ Tamu "${guestName}" telah dihapus.`);
    } catch (err: any) {
      showToast('❌ Gagal menghapus: ' + err.message);
    }
  };

  // Web Contact Picker API Handler
  const handleImportContacts = async () => {
    const isSupported =
      typeof navigator !== 'undefined' &&
      'contacts' in navigator &&
      'ContactsManager' in window;

    if (!isSupported) {
      setShowContactNoticeModal(true);
      return;
    }

    try {
      const props = ['name', 'tel'];
      const opts = { multiple: true };
      const selected = await (navigator as any).contacts.select(props, opts);

      if (!selected || selected.length === 0) return;

      await gl.addContactGuests(selected);
      showToast(`📱 Berhasil mengimpor ${selected.length} kontak dari buku telepon HP!`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        showToast('⚠️ Gagal membaca kontak: ' + (err.message || 'Izin ditolak'));
      }
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notifikasi Standar Konsisten */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type="info"
        onClose={() => setToastMessage(null)}
      />

      {/* Hidden File Input untuk CSV */}
      <input
        ref={gl.fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={gl.handleFileUpload}
      />

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
        sectionSubtitle="Pilih kartu undangan di bawah untuk melihat & mengelola buku tamu khusus undangan tersebut:"
        badgeLabel="Daftar Tamu"
      />

      {/* KARTU 1: GENERATOR LINK CEPAT & GRUP WA */}
      <QuickLinkGenerator
        invitationSlug={effectiveSlug}
        coupleNames={effectiveCouple}
        waTemplate={wa.waTemplate}
        showToast={showToast}
      />

      {/* HEADER SECTION & ACTION BUTTONS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            Daftar Tamu &amp; Sebar Undangan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Tambah ratusan tamu dalam 1-klik, buat link personal unik, dan lacak status kirim WhatsApp.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* METODE 1: QUICK BULK PASTE */}
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>⚡ Tambah Banyak Tamu (Copy-Paste)</span>
          </button>

          {/* METODE 2: AMBIL DARI KONTAK HP */}
          <button
            type="button"
            onClick={handleImportContacts}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Pilih langsung dari buku telepon smartphone Anda"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-600">contacts</span>
            <span>📱 Dari Kontak HP</span>
          </button>

          {/* METODE 3: CSV IMPORT */}
          <button
            type="button"
            onClick={() => gl.fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Import data tamu dari file Excel / CSV"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-600">upload_file</span>
            <span>Import CSV</span>
          </button>

          {/* SINGLE MANUAL ADD */}
          <button
            type="button"
            onClick={() => setShowSingleModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Tamu Baru</span>
          </button>

          {/* TEMPLATE WA TOGGLE */}
          <button
            type="button"
            onClick={() => wa.setShowTemplateEditor(!wa.showTemplateEditor)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              wa.showTemplateEditor
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title="Ubah kalimat pengantar undangan WhatsApp"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Format Pesan WA</span>
          </button>
        </div>
      </div>

      {/* ACCORDION: TEMPLATE PESAN WHATSAPP */}
      <WaTemplateEditorModal
        isOpen={wa.showTemplateEditor}
        waTemplate={wa.waTemplate}
        onChangeTemplate={wa.setWaTemplate}
        onSaveTemplate={wa.handleSaveTemplate}
      />

      {/* METRIK STATISTIK */}
      <GuestStatsBar
        totalGuests={gl.guests.length}
        totalSent={gl.totalSent}
        totalHadir={gl.totalHadir}
        totalPaxHadir={gl.totalPaxHadir}
        totalTidakHadir={gl.totalTidakHadir}
        totalRagu={gl.totalRagu}
      />

      {/* FILTER & PENCARIAN */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={gl.searchQuery}
            onChange={(e) => gl.setSearchQuery(e.target.value)}
            placeholder="Cari nama, nomor WA, atau kode pass..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => gl.setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              gl.filterStatus === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua ({gl.guests.length})
          </button>
          <button
            onClick={() => gl.setFilterStatus('unsent')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              gl.filterStatus === 'unsent'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Belum Dikirim ({gl.guests.length - gl.totalSent})
          </button>
          <button
            onClick={() => gl.setFilterStatus('sent')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              gl.filterStatus === 'sent'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Sudah Dikirim ({gl.totalSent})
          </button>
          <button
            onClick={() => gl.setFilterStatus('hadir')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              gl.filterStatus === 'hadir'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Hadir ({gl.totalHadir})
          </button>
        </div>
      </div>

      {/* TABEL DAFTAR TAMU DENGAN TRACKER WA BLAST */}
      {gl.isLoading ? (
        <div className="py-16 text-center text-stone-400">
          <span className="material-symbols-outlined text-3xl animate-spin text-stone-600">
            progress_activity
          </span>
          <p className="text-xs mt-2 font-medium">Memuat daftar tamu undangan...</p>
        </div>
      ) : gl.filteredGuests.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-stone-200/80 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">people</span>
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-bold text-stone-800 text-base">
              {gl.guests.length === 0
                ? 'Belum Ada Tamu di Buku Tamu Anda'
                : 'Tidak Ada Tamu yang Sesuai dengan Filter'}
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {gl.guests.length === 0
                ? 'Gunakan tombol "⚡ Tambah Banyak Tamu (Copy-Paste)" untuk memasukkan puluhan nama teman sekaligus dalam 1 detik!'
                : 'Coba ubah kata kunci pencarian atau pilih filter status lainnya.'}
            </p>
          </div>
          {gl.guests.length === 0 && (
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Buka Quick Bulk Paste Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/90 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Tamu &amp; Kategori</th>
                  <th className="py-3.5 px-4">Kontak WhatsApp</th>
                  <th className="py-3.5 px-4 text-center">Check-in Pass</th>
                  <th className="py-3.5 px-4 text-center">Status RSVP</th>
                  <th className="py-3.5 px-4 text-center">Tracker Kirim WA</th>
                  <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-800">
                {gl.filteredGuests.map((guest, idx) => (
                  <GuestTableRow
                    key={guest.id}
                    guest={guest}
                    index={idx}
                    isSent={Boolean(guest.is_sent || wa.sentGuestIds.has(guest.id))}
                    onToggleSentStatus={wa.toggleSentStatus}
                    onCopyPersonalLink={wa.handleCopyPersonalLink}
                    onSendWhatsApp={wa.handleSendWhatsApp}
                    onDeleteGuest={handleDeleteGuest}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Bar: Ekspor & Template Download */}
          <div className="p-4 bg-stone-50/80 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500">
              Menampilkan {gl.filteredGuests.length} dari total {gl.guests.length} tamu undangan
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={gl.downloadCsvTemplate}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Unduh Template CSV
              </button>
              <button
                type="button"
                onClick={() => gl.exportGuestsToCsv(wa.getPersonalLink)}
                className="px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer font-semibold shadow-2xs"
              >
                Ekspor Semua Tamu (.CSV)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: QUICK BULK PASTE */}
      <BulkPasteModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onProcess={handleBulkProcess}
      />

      {/* MODAL 2: SINGLE MANUAL ADD */}
      <SingleAddModal
        isOpen={showSingleModal}
        onClose={() => setShowSingleModal(false)}
        onAdd={handleSingleAdd}
      />

      {/* MODAL 3: CONTACT PICKER FALLBACK */}
      <ContactNoticeModal
        isOpen={showContactNoticeModal}
        onClose={() => setShowContactNoticeModal(false)}
        onOpenBulkModal={() => setShowBulkModal(true)}
      />
    </div>
  );
};
