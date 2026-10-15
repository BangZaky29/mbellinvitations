import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

export interface GuestItem {
  id: string;
  invitation_id?: string;
  guest_code: string;
  name: string;
  phone_number?: string | null;
  category?: string;
  pax_allocated?: number;
  rsvp_status: 'hadir' | 'tidak_hadir' | 'ragu' | 'pending';
  rsvp_pax?: number;
  rsvp_notes?: string;
  created_at: string;
}

interface GuestListPanelProps {
  userId?: string | null;
  invitationId?: string | null;
  invitationSlug?: string;
  coupleNames?: string;
  onGoToEditor: () => void;
  onOpenAuthGate?: () => void;
}

interface ParsedGuest {
  name: string;
  phoneNumber?: string;
}

const DEFAULT_WA_TEMPLATE = `Kepada Yth.
{nama_tamu}

Assalamu'alaikum Wr. Wb. / Salam Sejahtera,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

💍 {nama_mempelai}

Info lengkap acara, lokasi, dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan berikut:
{link_undangan}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

// Helper untuk generate 5-karakter alphanumeric acak (unik, non-ambigu)
function generateGuestCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Normalisasi nomor telepon format Indonesia (08xx / 8xx -> 628xx)
function normalizePhoneNumber(raw: string): string {
  let cleaned = raw.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.slice(1);
  } else if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

// Smart parser per baris untuk Bulk Paste
function parseBulkText(text: string): ParsedGuest[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const result: ParsedGuest[] = [];

  for (const line of lines) {
    // 1. Cek pemisah umum seperti strip (-), koma (,), pipe (|), titik dua (:), atau tab (\t)
    const matchDelim = line.split(/[-|,;:\t]/);
    if (matchDelim.length >= 2) {
      const partA = matchDelim[0].trim();
      const partB = matchDelim.slice(1).join(' ').trim();

      const digitsB = partB.replace(/[^0-9]/g, '');
      const digitsA = partA.replace(/[^0-9]/g, '');

      if (digitsB.length >= 8) {
        result.push({
          name: partA,
          phoneNumber: normalizePhoneNumber(partB),
        });
        continue;
      } else if (digitsA.length >= 8) {
        result.push({
          name: partB,
          phoneNumber: normalizePhoneNumber(partA),
        });
        continue;
      }
    }

    // 2. Cek regex nomor telepon di dalam teks baris
    const phoneMatch = line.match(/(?:\+?62|08)[0-9\s-]{8,16}/);
    if (phoneMatch) {
      const phone = phoneMatch[0];
      const name = line.replace(phone, '').replace(/[-|,;:()]/g, '').trim();
      result.push({
        name: name || 'Tamu Undangan',
        phoneNumber: normalizePhoneNumber(phone),
      });
    } else {
      // 3. Hanya teks nama tamu saja
      result.push({
        name: line,
      });
    }
  }

  return result;
}

export const GuestListPanel: React.FC<GuestListPanelProps> = ({
  userId,
  invitationId,
  invitationSlug = 'raditya-jessica',
  coupleNames = 'Raditya & Jessica',
  onGoToEditor,
  onOpenAuthGate,
}) => {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'hadir' | 'tidak_hadir' | 'ragu' | 'sent' | 'unsent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invitation ID aktif yang terhubung di database
  const [activeInvId, setActiveInvId] = useState<string | null>(invitationId || null);

  // WA Blast Tracker & Sent States (Disimpan di localStorage per slug)
  const sentStorageKey = `mbell_sent_guests_${invitationSlug}`;
  const templateStorageKey = `mbell_wa_template_${invitationSlug}`;

  const [sentGuestIds, setSentGuestIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(sentStorageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Template Pesan WA Kustom
  const [waTemplate, setWaTemplate] = useState<string>(() => {
    try {
      return localStorage.getItem(templateStorageKey) || DEFAULT_WA_TEMPLATE;
    } catch {
      return DEFAULT_WA_TEMPLATE;
    }
  });

  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  // 1. State Modal: Quick Bulk Paste
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Reguler');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // 2. State Modal: Single Manual Add
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCategory, setSingleCategory] = useState('Reguler');
  const [singlePax, setSinglePax] = useState('1');

  // 3. State Modal: Contact Picker Fallback Notice
  const [showContactNoticeModal, setShowContactNoticeModal] = useState(false);

  // 4. State Generator Link Cepat / Link Grup WA (Tanpa Database)
  const [quickGroupName, setQuickGroupName] = useState('');
  const [quickCopied, setQuickCopied] = useState(false);

  // File Input Ref untuk CSV Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simpan sent IDs ke localStorage saat berubah
  useEffect(() => {
    try {
      localStorage.setItem(sentStorageKey, JSON.stringify(Array.from(sentGuestIds)));
    } catch {
      // Ignored
    }
  }, [sentGuestIds, sentStorageKey]);

  // Simpan WA Template ke localStorage saat berubah
  const handleSaveTemplate = (newTemplate: string) => {
    setWaTemplate(newTemplate);
    try {
      localStorage.setItem(templateStorageKey, newTemplate);
    } catch {
      // Ignored
    }
    showToast('💾 Template pesan WhatsApp berhasil disimpan!');
  };

  // -------------------------------------------------------------
  // FETCH GUESTS FROM SUPABASE
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true);
      try {
        if (!userId) {
          setGuests([]);
          setIsLoading(false);
          return;
        }

        let targetId = invitationId;
        if (!targetId) {
          const { data: invData } = await supabase
            .from('invitations')
            .select('id')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (invData) {
            targetId = invData.id;
            setActiveInvId(invData.id);
          }
        } else {
          setActiveInvId(targetId);
        }

        if (targetId) {
          const { data: guestsData, error } = await supabase
            .from('guests')
            .select('*')
            .eq('invitation_id', targetId)
            .order('created_at', { ascending: false });

          if (!error && guestsData) {
            setGuests(guestsData as GuestItem[]);
          }
        } else {
          setGuests([]);
        }
      } catch {
        setGuests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuests();
  }, [userId, invitationId]);

  // -------------------------------------------------------------
  // METODE 1: QUICK BULK PASTE HANDLER
  // -------------------------------------------------------------
  const handleProcessBulkPaste = async () => {
    const parsed = parseBulkText(bulkInputText);
    if (parsed.length === 0) {
      showToast('⚠️ Silakan tempelkan minimal 1 nama tamu terlebih dahulu.');
      return;
    }

    setIsBulkProcessing(true);
    try {
      const newItems: Omit<GuestItem, 'id' | 'created_at'>[] = parsed.map((item) => ({
        invitation_id: activeInvId || undefined,
        guest_code: generateGuestCode(),
        name: item.name,
        phone_number: item.phoneNumber || null,
        category: bulkCategory || 'Reguler',
        pax_allocated: 1,
        rsvp_status: 'pending',
        rsvp_pax: 1,
      }));

      // Jika ada target invitation id di Supabase, lakukan bulk INSERT
      if (activeInvId) {
        const { data: insertedData, error } = await supabase
          .from('guests')
          .insert(newItems)
          .select('*');

        if (error) throw error;
        if (insertedData) {
          setGuests((prev) => [...(insertedData as GuestItem[]), ...prev]);
        }
      } else {
        // Fallback lokal jika undangan belum di-publish ke DB
        const localItems: GuestItem[] = newItems.map((item, idx) => ({
          ...item,
          id: `local-${Date.now()}-${idx}`,
          created_at: new Date().toISOString(),
        }));
        setGuests((prev) => [...localItems, ...prev]);
      }

      showToast(`🎉 Berhasil menambahkan ${parsed.length} tamu sekaligus & link unik telah dibuat!`);
      setBulkInputText('');
      setShowBulkModal(false);
    } catch (err: any) {
      showToast('❌ Gagal menyimpan tamu: ' + (err.message || 'Coba lagi'));
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // METODE 2: IMPORT DARI KONTAK HP (Web Contact Picker API)
  // -------------------------------------------------------------
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

      const contactGuests: Omit<GuestItem, 'id' | 'created_at'>[] = selected.map((c: any) => {
        const rawName = c.name?.[0] || 'Tamu Undangan';
        const rawTel = c.tel?.[0] || '';
        return {
          invitation_id: activeInvId || undefined,
          guest_code: generateGuestCode(),
          name: rawName,
          phone_number: rawTel ? normalizePhoneNumber(rawTel) : null,
          category: 'Kontak HP',
          pax_allocated: 1,
          rsvp_status: 'pending',
          rsvp_pax: 1,
        };
      });

      if (activeInvId) {
        const { data: insertedData, error } = await supabase
          .from('guests')
          .insert(contactGuests)
          .select('*');

        if (error) throw error;
        if (insertedData) {
          setGuests((prev) => [...(insertedData as GuestItem[]), ...prev]);
        }
      } else {
        const localItems: GuestItem[] = contactGuests.map((item, idx) => ({
          ...item,
          id: `contact-${Date.now()}-${idx}`,
          created_at: new Date().toISOString(),
        }));
        setGuests((prev) => [...localItems, ...prev]);
      }

      showToast(`📱 Berhasil mengimpor ${selected.length} kontak dari buku telepon HP!`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        showToast('⚠️ Gagal membaca kontak: ' + (err.message || 'Izin ditolak'));
      }
    }
  };

  // -------------------------------------------------------------
  // METODE 3: IMPORT FILE CSV & DOWNLOAD TEMPLATE
  // -------------------------------------------------------------
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        'Nama Tamu,Nomor WhatsApp,Kategori,Jumlah Pax\n' +
        'Budi Santoso & Partner,081234567890,Sahabat,2\n' +
        'Rizky Pratama,085712345678,Teman Kantor,1\n' +
        'Keluarga Besar Bpk. Hendra,,Keluarga,4\n' +
        'Dinda Kirana,087812345678,VIP,2\n'
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `template_daftar_tamu_${invitationSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length <= 1) {
          showToast('⚠️ File CSV kosong atau hanya berisi baris header.');
          return;
        }

        // Abaikan baris header (index 0)
        const dataLines = lines.slice(1);
        const csvGuests: Omit<GuestItem, 'id' | 'created_at'>[] = [];

        for (const line of dataLines) {
          const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
          const name = cols[0];
          if (!name) continue;

          const rawPhone = cols[1] || '';
          const category = cols[2] || 'Reguler';
          const pax = parseInt(cols[3] || '1', 10) || 1;

          csvGuests.push({
            invitation_id: activeInvId || undefined,
            guest_code: generateGuestCode(),
            name,
            phone_number: rawPhone ? normalizePhoneNumber(rawPhone) : null,
            category,
            pax_allocated: pax,
            rsvp_status: 'pending',
            rsvp_pax: 1,
          });
        }

        if (csvGuests.length === 0) {
          showToast('⚠️ Tidak ada baris nama tamu yang valid di dalam CSV.');
          return;
        }

        if (activeInvId) {
          const { data: insertedData, error } = await supabase
            .from('guests')
            .insert(csvGuests)
            .select('*');

          if (error) throw error;
          if (insertedData) {
            setGuests((prev) => [...(insertedData as GuestItem[]), ...prev]);
          }
        } else {
          const localItems: GuestItem[] = csvGuests.map((item, idx) => ({
            ...item,
            id: `csv-${Date.now()}-${idx}`,
            created_at: new Date().toISOString(),
          }));
          setGuests((prev) => [...localItems, ...prev]);
        }

        showToast(`📄 Berhasil mengimpor ${csvGuests.length} tamu dari file CSV!`);
      } catch (err: any) {
        showToast('❌ Gagal membaca CSV: ' + err.message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // -------------------------------------------------------------
  // SINGLE TAMBAH 1 TAMU MANUAL
  // -------------------------------------------------------------
  const handleAddSingleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) {
      showToast('⚠️ Nama tamu wajib diisi.');
      return;
    }

    try {
      const newGuest: Omit<GuestItem, 'id' | 'created_at'> = {
        invitation_id: activeInvId || undefined,
        guest_code: generateGuestCode(),
        name: singleName.trim(),
        phone_number: singlePhone.trim() ? normalizePhoneNumber(singlePhone.trim()) : null,
        category: singleCategory,
        pax_allocated: parseInt(singlePax, 10) || 1,
        rsvp_status: 'pending',
        rsvp_pax: 1,
      };

      if (activeInvId) {
        const { data, error } = await supabase
          .from('guests')
          .insert([newGuest])
          .select('*')
          .single();

        if (error) throw error;
        if (data) {
          setGuests((prev) => [data as GuestItem, ...prev]);
        }
      } else {
        const localGuest: GuestItem = {
          ...newGuest,
          id: `single-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        setGuests((prev) => [localGuest, ...prev]);
      }

      showToast(`✅ Tamu "${singleName.trim()}" berhasil ditambahkan!`);
      setSingleName('');
      setSinglePhone('');
      setSinglePax('1');
      setShowSingleModal(false);
    } catch (err: any) {
      showToast('❌ Gagal menambah tamu: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // DELETE GUEST
  // -------------------------------------------------------------
  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!window.confirm(`Hapus tamu "${guestName}" dari daftar?`)) return;

    try {
      if (activeInvId && !guestId.startsWith('local-') && !guestId.startsWith('single-') && !guestId.startsWith('contact-') && !guestId.startsWith('csv-')) {
        await supabase.from('guests').delete().eq('id', guestId);
      }
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      setSentGuestIds((prev) => {
        const next = new Set(prev);
        next.delete(guestId);
        return next;
      });
      showToast(`🗑️ Tamu "${guestName}" telah dihapus.`);
    } catch (err: any) {
      showToast('❌ Gagal menghapus: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // ACTION: SALIN LINK PERSONAL & KIRIM WA (TRACKER TRIGGER)
  // -------------------------------------------------------------
  const getPersonalLink = (name: string, code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mbell.id';
    return `${origin}/${invitationSlug}?to=${encodeURIComponent(name)}&g=${encodeURIComponent(code)}`;
  };

  const markAsSent = (guestId: string) => {
    setSentGuestIds((prev) => new Set(prev).add(guestId));
  };

  const toggleSentStatus = (guestId: string) => {
    setSentGuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(guestId)) {
        next.delete(guestId);
      } else {
        next.add(guestId);
      }
      return next;
    });
  };

  const handleCopyPersonalLink = (guest: GuestItem) => {
    const link = getPersonalLink(guest.name, guest.guest_code);
    navigator.clipboard.writeText(link);
    markAsSent(guest.id);
    showToast(`📋 Link unik untuk "${guest.name}" tersalin! Ditandai: Sudah Dikirim ✔️`);
  };

  const handleSendWhatsApp = (guest: GuestItem) => {
    const link = getPersonalLink(guest.name, guest.guest_code);
    const message = waTemplate
      .replace(/{nama_tamu}/g, guest.name)
      .replace(/{nama_mempelai}/g, coupleNames)
      .replace(/{link_undangan}/g, link);

    markAsSent(guest.id);

    const encodedMsg = encodeURIComponent(message);
    const phone = guest.phone_number ? guest.phone_number.replace(/[^0-9]/g, '') : '';
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
    showToast(`💬 Membuka WhatsApp untuk "${guest.name}"... Ditandai: Sudah Dikirim ✔️`);
  };

  // -------------------------------------------------------------
  // METODE 4: GENERATOR LINK CEPAT / LINK GRUP WA
  // -------------------------------------------------------------
  const getQuickGroupLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mbell.id';
    if (!quickGroupName.trim()) {
      return `${origin}/${invitationSlug}`;
    }
    return `${origin}/${invitationSlug}?to=${encodeURIComponent(quickGroupName.trim())}`;
  };

  const handleCopyQuickGroupLink = () => {
    const url = getQuickGroupLink();
    navigator.clipboard.writeText(url);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2500);
    showToast('🚀 Link grup instan berhasil disalin ke clipboard!');
  };

  const handleShareQuickGroupWhatsApp = () => {
    const link = getQuickGroupLink();
    const targetName = quickGroupName.trim() || 'Bapak/Ibu/Rekan-rekan';
    const message = waTemplate
      .replace(/{nama_tamu}/g, targetName)
      .replace(/{nama_mempelai}/g, coupleNames)
      .replace(/{link_undangan}/g, link);

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Export Semua Tamu ke CSV
  const handleExportGuestsToCsv = () => {
    if (guests.length === 0) {
      showToast('⚠️ Belum ada tamu untuk diekspor.');
      return;
    }

    let csv = 'Nama Tamu,Nomor WhatsApp,Kategori,Kode Pass,Status RSVP,Pax,Status Kirim,Link Undangan\n';
    for (const g of guests) {
      const isSent = sentGuestIds.has(g.id) ? 'Sudah Dikirim' : 'Belum Dikirim';
      const link = getPersonalLink(g.name, g.guest_code);
      csv += `"${g.name}","${g.phone_number || ''}","${g.category || 'Reguler'}","${g.guest_code}","${g.rsvp_status}","${g.rsvp_pax || 1}","${isSent}","${link}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rekap_tamu_${invitationSlug}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------------------------
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      !searchQuery ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phone_number && g.phone_number.includes(searchQuery)) ||
      g.guest_code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'sent') return sentGuestIds.has(g.id);
    if (filterStatus === 'unsent') return !sentGuestIds.has(g.id);
    return g.rsvp_status === filterStatus;
  });

  const totalHadir = guests.filter((g) => g.rsvp_status === 'hadir').length;
  const totalTidakHadir = guests.filter((g) => g.rsvp_status === 'tidak_hadir').length;
  const totalRagu = guests.filter((g) => g.rsvp_status === 'ragu').length;
  const totalPaxHadir = guests
    .filter((g) => g.rsvp_status === 'hadir')
    .reduce((acc, curr) => acc + (curr.rsvp_pax || 1), 0);
  const totalSent = guests.filter((g) => sentGuestIds.has(g.id)).length;

  // -------------------------------------------------------------
  // KONDISI BELUM LOGIN (Sesuai Foto ke-3)
  // -------------------------------------------------------------
  if (!userId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            Masuk untuk Melihat Daftar Tamu
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Silakan masuk dengan akun Anda untuk melihat rekap kehadiran tamu undangan pernikahan secara langsung.
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-medium shadow-2xl border border-stone-700 flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hidden File Input untuk CSV */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ============================================================ */}
      {/* KARTU 1: METODE 4 - GENERATOR LINK CEPAT & GRUP WA           */}
      {/* ============================================================ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-stone-50 border border-amber-500/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                Bagikan Cepat / Link Grup WhatsApp
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 text-[10px] font-semibold">
                  Tanpa Simpan DB
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Buat link dengan nama khusus untuk grup atau perorangan detik ini juga.
              </p>
            </div>
          </div>
        </div>

        {/* Preset Chips Sapaan */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-medium text-stone-400 mr-1">Preset Sapaan:</span>
          {[
            { label: '👥 Grup Alumni', val: 'Teman-teman Alumni' },
            { label: '🏢 Rekan Kerja', val: 'Rekan-rekan Kerja' },
            { label: '👨‍👩‍👧‍👦 Keluarga Besar', val: 'Keluarga Besar' },
            { label: '✨ Tamu Undangan', val: 'Tamu Undangan' },
            { label: 'Kosongkan', val: '' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setQuickGroupName(preset.val)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                quickGroupName === preset.val
                  ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Bar & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
              badge
            </span>
            <input
              type="text"
              value={quickGroupName}
              onChange={(e) => setQuickGroupName(e.target.value)}
              placeholder="Ketik nama khusus (contoh: Keluarga Besar Bpk. H. Sulaiman)"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyQuickGroupLink}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {quickCopied ? 'check' : 'content_copy'}
              </span>
              <span>{quickCopied ? 'Tersalin!' : 'Salin Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareQuickGroupWhatsApp}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* HEADER SECTION & ACTION BUTTONS BAR                          */}
      {/* ============================================================ */}
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
          {/* METODE 1: QUICK BULK PASTE (PRIORITAS UTAMA) */}
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
            onClick={() => fileInputRef.current?.click()}
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
            onClick={() => setShowTemplateEditor(!showTemplateEditor)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showTemplateEditor
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

      {/* ============================================================ */}
      {/* ACCORDION: TEMPLATE PESAN WHATSAPP & VARIABLE CHIPS          */}
      {/* ============================================================ */}
      {showTemplateEditor && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">chat_bubble</span>
              <h4 className="font-bold text-sm text-stone-900">
                Template Pesan Pengantar WhatsApp
              </h4>
            </div>
            <button
              type="button"
              onClick={() => handleSaveTemplate(DEFAULT_WA_TEMPLATE)}
              className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Reset ke Standar
            </button>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Pesan ini otomatis muncul saat Anda klik tombol <strong>Kirim WA</strong> pada baris tamu.
            Variabel di dalam tanda kurung kurawal akan otomatis digantikan sesuai nama tamu masing-masing:
          </p>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-1 rounded-md bg-stone-100 font-mono text-[11px] text-stone-700">
              {'{nama_tamu}'}
            </span>
            <span className="px-2 py-1 rounded-md bg-stone-100 font-mono text-[11px] text-stone-700">
              {'{nama_mempelai}'}
            </span>
            <span className="px-2 py-1 rounded-md bg-stone-100 font-mono text-[11px] text-stone-700">
              {'{link_undangan}'}
            </span>
          </div>

          <textarea
            rows={7}
            value={waTemplate}
            onChange={(e) => setWaTemplate(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveTemplate(waTemplate)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              Simpan Template Pesan
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* METRIK STATISTIK: TOTAL TAMU & BLAST TRACKER                 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Total Tamu</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{guests.length}</p>
          <span className="text-[11px] text-stone-400">Di buku tamu</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Sudah Dikirim</span>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{totalSent}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Tersampaikan ✔️</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Akan Hadir</span>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{totalHadir}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">{totalPaxHadir} Orang tamu</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs">
          <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wider">Berhalangan</span>
          <p className="text-2xl font-bold text-rose-900 mt-1">{totalTidakHadir}</p>
          <span className="text-[11px] text-rose-600">Tidak dapat hadir</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Masih Ragu</span>
          <p className="text-2xl font-bold text-amber-900 mt-1">{totalRagu}</p>
          <span className="text-[11px] text-amber-600">Belum dipastikan</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FILTER & PENCARIAN                                           */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, nomor WA, atau kode pass..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua ({guests.length})
          </button>
          <button
            onClick={() => setFilterStatus('unsent')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'unsent'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Belum Dikirim ({guests.length - totalSent})
          </button>
          <button
            onClick={() => setFilterStatus('sent')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'sent'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Sudah Dikirim ({totalSent})
          </button>
          <button
            onClick={() => setFilterStatus('hadir')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'hadir'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Hadir ({totalHadir})
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TABEL DAFTAR TAMU DENGAN TRACKER WA BLAST                   */}
      {/* ============================================================ */}
      {isLoading ? (
        <div className="py-16 text-center text-stone-400">
          <span className="material-symbols-outlined text-3xl animate-spin text-stone-600">
            progress_activity
          </span>
          <p className="text-xs mt-2 font-medium">Memuat daftar tamu undangan...</p>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-stone-200/80 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">people</span>
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-bold text-stone-800 text-base">
              {guests.length === 0
                ? 'Belum Ada Tamu di Buku Tamu Anda'
                : 'Tidak Ada Tamu yang Sesuai dengan Filter'}
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {guests.length === 0
                ? 'Gunakan tombol "⚡ Tambah Banyak Tamu (Copy-Paste)" untuk memasukkan puluhan nama teman sekaligus dalam 1 detik!'
                : 'Coba ubah kata kunci pencarian atau pilih filter status lainnya.'}
            </p>
          </div>
          {guests.length === 0 && (
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
                {filteredGuests.map((guest, idx) => {
                  const isSent = sentGuestIds.has(guest.id);
                  return (
                    <tr
                      key={guest.id}
                      className={`transition-colors ${
                        isSent ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-stone-50/60'
                      }`}
                    >
                      {/* Nomor Urut */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-stone-400">
                        {idx + 1}
                      </td>

                      {/* Nama Tamu & Kategori */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">{guest.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                            {guest.category || 'Reguler'}
                          </span>
                          {guest.pax_allocated && guest.pax_allocated > 1 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                              {guest.pax_allocated} Pax
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Nomor Telepon */}
                      <td className="py-3.5 px-4">
                        {guest.phone_number ? (
                          <div className="font-mono text-xs text-stone-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-emerald-600 text-[14px]">call</span>
                            <span>{guest.phone_number}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">Tanpa Nomor</span>
                        )}
                      </td>

                      {/* Kode Check-in Pass */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-mono text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[13px] text-stone-500">qr_code</span>
                          <span>{guest.guest_code}</span>
                        </span>
                      </td>

                      {/* Status RSVP */}
                      <td className="py-3.5 px-4 text-center">
                        {guest.rsvp_status === 'hadir' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hadir ({guest.rsvp_pax || 1})
                          </span>
                        ) : guest.rsvp_status === 'tidak_hadir' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Berhalangan
                          </span>
                        ) : guest.rsvp_status === 'ragu' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Ragu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px]">
                            Menunggu
                          </span>
                        )}
                      </td>

                      {/* Tracker Kirim WA Badge (Bisa di-toggle manual) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSentStatus(guest.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                            isSent
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                          title="Klik untuk mengubah status manual"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isSent ? 'check_circle' : 'pending'}
                          </span>
                          <span>{isSent ? 'Sudah Dikirim ✔️' : 'Belum Dikirim'}</span>
                        </button>
                      </td>

                      {/* Tombol Aksi: Salin Link, Kirim WA, Hapus */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Salin Link Unik */}
                          <button
                            type="button"
                            onClick={() => handleCopyPersonalLink(guest)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                            title="Salin Link Unik Tamu Ini"
                          >
                            <span className="material-symbols-outlined text-[16px]">link</span>
                          </button>

                          {/* Kirim Pesan WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleSendWhatsApp(guest)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Kirim Undangan via WhatsApp"
                          >
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            <span>Kirim WA</span>
                          </button>

                          {/* Hapus Tamu */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus dari daftar tamu"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Bar: Ekspor & Template Download */}
          <div className="p-4 bg-stone-50/80 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500">
              Menampilkan {filteredGuests.length} dari total {guests.length} tamu undangan
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsvTemplate}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Unduh Template CSV
              </button>
              <button
                type="button"
                onClick={handleExportGuestsToCsv}
                className="px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer font-semibold shadow-2xs"
              >
                Ekspor Semua Tamu (.CSV)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: METODE 1 - QUICK BULK PASTE (COPY-PASTE)           */}
      {/* ============================================================ */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </span>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    ⚡ Tambah Banyak Tamu Sekaligus (Copy-Paste)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Tempelkan puluhan nama dari WhatsApp, catatan, atau Excel (1 baris = 1 tamu).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Kategori Pilihan */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Kategori Tamu:</span>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold focus:outline-none"
              >
                <option value="Reguler">Reguler</option>
                <option value="VIP">VIP</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Sahabat">Sahabat</option>
                <option value="Teman Kantor">Teman Kantor</option>
                <option value="Teman Kampus">Teman Kampus</option>
              </select>
            </div>

            {/* Smart Format Guide */}
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Format Cerdas yang Didukung per Baris:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-0.5">
                <li><code>Budi Santoso &amp; Partner</code> (Otomatis disimpan sebagai nama)</li>
                <li><code>Rizky Pratama - 081299887766</code> (Otomatis dipisah nama &amp; nomor telepon)</li>
                <li><code>Dinda Kirana, 085712345678</code> (Otomatis konversi ke format 628)</li>
              </ul>
            </div>

            {/* Textarea Input */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-stone-600">
                <span>Tempel Daftar Nama di Sini:</span>
                <span className="text-emerald-700 font-bold">
                  {parseBulkText(bulkInputText).length} Tamu Terdeteksi
                </span>
              </div>
              <textarea
                rows={9}
                value={bulkInputText}
                onChange={(e) => setBulkInputText(e.target.value)}
                placeholder={"Budi Santoso & Partner\nRizky Pratama - 081299887766\nDinda Kirana, 085712345678\nKeluarga Besar Bpk. H. Sulaiman\nDr. Hendra Kusuma & Istri"}
                className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isBulkProcessing || parseBulkText(bulkInputText).length === 0}
                onClick={handleProcessBulkPaste}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>
                  {isBulkProcessing
                    ? 'Memproses...'
                    : `Proses & Buat ${parseBulkText(bulkInputText).length} Link Unik`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: TAMBAH 1 TAMU MANUAL                                */}
      {/* ============================================================ */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-base text-stone-900">Tambah Tamu Baru</h3>
                <p className="text-xs text-stone-500">Masukkan identitas tamu undangan pernikahan.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSingleModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSingleGuest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Nama Tamu / Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  placeholder="Contoh: Bpk. Ir. Bambang Suryono"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Kategori</label>
                  <select
                    value={singleCategory}
                    onChange={(e) => setSingleCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="VIP">VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Teman Kantor">Teman Kantor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Alokasi Pax</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={singlePax}
                    onChange={(e) => setSinglePax(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold shadow-xs"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: FALLBACK CONTACT PICKER DI PC/DESKTOP               */}
      {/* ============================================================ */}
      {showContactNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">smartphone</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-stone-900 text-base">
                Fitur Khusus Smartphone Android
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Fitur <strong>Ambil dari Kontak HP</strong> menggunakan Web Contact Picker API yang hanya didukung oleh browser smartphone (Google Chrome Android).
              </p>
              <p className="text-xs text-stone-600 pt-1">
                Untuk penggunaan di laptop atau komputer PC, silakan gunakan fitur{' '}
                <strong>⚡ Quick Bulk Paste</strong> yang dapat membaca puluhan nama sekaligus dalam 1 detik!
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowContactNoticeModal(false);
                  setShowBulkModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Buka Quick Bulk Paste</span>
              </button>
              <button
                type="button"
                onClick={() => setShowContactNoticeModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
