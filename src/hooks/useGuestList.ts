import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { GuestItem } from '../components/dashboard/guest-list/types';
import { generateGuestCode, normalizePhoneNumber } from '../components/dashboard/guest-list/helpers';

interface UseGuestListOptions {
  userId?: string | null;
  invitationId?: string | null;
  invitationSlug?: string;
  sentGuestIds: Set<string>;
  showToast: (msg: string) => void;
}

export function useGuestList({
  userId,
  invitationId,
  invitationSlug = 'undangan-baru',
  sentGuestIds,
  showToast,
}: UseGuestListOptions) {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'hadir' | 'tidak_hadir' | 'ragu' | 'sent' | 'unsent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvId, setActiveInvId] = useState<string | null>(invitationId || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // FETCH GUESTS FROM SUPABASE
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

        // Jika ada invitationSlug, cari id spesifik dari slug tersebut di tabel invitations
        if (invitationSlug && invitationSlug !== 'undangan-baru' && invitationSlug !== 'raditya-jessica') {
          const { data: slugInv } = await supabase
            .from('invitations')
            .select('id')
            .eq('slug', invitationSlug)
            .maybeSingle();

          if (slugInv?.id) {
            targetId = slugInv.id;
          }
        }

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
          }
        }

        const effectiveId = targetId || invitationId || null;
        setActiveInvId(effectiveId);

        if (effectiveId) {
          // Query tamu yang terdaftar pada targetId atau invitationId
          let query = supabase.from('guests').select('*');
          if (invitationId && targetId && invitationId !== targetId) {
            query = query.or(`invitation_id.eq.${targetId},invitation_id.eq.${invitationId}`);
          } else {
            query = query.eq('invitation_id', effectiveId);
          }

          const { data: guestsData, error } = await query.order('created_at', { ascending: false });

          if (!error && guestsData) {
            setGuests(guestsData as GuestItem[]);
          } else {
            setGuests([]);
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
  }, [userId, invitationId, invitationSlug]);

  // BULK PASTE HANDLER
  const addBulkGuests = async (parsed: { name: string; phoneNumber?: string }[], bulkCategory: string) => {
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
      const localItems: GuestItem[] = newItems.map((item, idx) => ({
        ...item,
        id: `local-${Date.now()}-${idx}`,
        created_at: new Date().toISOString(),
      }));
      setGuests((prev) => [...localItems, ...prev]);
    }
  };

  // IMPORT CONTACTS HANDLER
  const addContactGuests = async (selected: any[]) => {
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
  };

  // CSV FILE UPLOAD HANDLER
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

  // SINGLE MANUAL ADD
  const addSingleGuest = async ({
    name,
    phone,
    category,
    pax,
  }: {
    name: string;
    phone: string;
    category: string;
    pax: string;
  }) => {
    const newGuest: Omit<GuestItem, 'id' | 'created_at'> = {
      invitation_id: activeInvId || undefined,
      guest_code: generateGuestCode(),
      name: name.trim(),
      phone_number: phone.trim() ? normalizePhoneNumber(phone.trim()) : null,
      category,
      pax_allocated: parseInt(pax, 10) || 1,
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
  };

  // DELETE GUEST
  const deleteGuest = async (guestId: string) => {
    if (activeInvId && !guestId.startsWith('local-') && !guestId.startsWith('single-') && !guestId.startsWith('contact-') && !guestId.startsWith('csv-')) {
      await supabase.from('guests').delete().eq('id', guestId);
    }
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  };

  // DOWNLOAD CSV TEMPLATE
  const downloadCsvTemplate = () => {
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

  // EXPORT GUESTS TO CSV
  const exportGuestsToCsv = (getPersonalLink: (name: string, code: string) => string) => {
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

  // FILTER LOGIC
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

  // STATS
  const totalHadir = guests.filter((g) => g.rsvp_status === 'hadir').length;
  const totalTidakHadir = guests.filter((g) => g.rsvp_status === 'tidak_hadir').length;
  const totalRagu = guests.filter((g) => g.rsvp_status === 'ragu').length;
  const totalPaxHadir = guests
    .filter((g) => g.rsvp_status === 'hadir')
    .reduce((acc, curr) => acc + (curr.rsvp_pax || 1), 0);
  const totalSent = guests.filter((g) => sentGuestIds.has(g.id)).length;

  return {
    guests,
    setGuests,
    isLoading,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    fileInputRef,
    filteredGuests,
    totalHadir,
    totalTidakHadir,
    totalRagu,
    totalPaxHadir,
    totalSent,
    addBulkGuests,
    addContactGuests,
    handleFileUpload,
    addSingleGuest,
    deleteGuest,
    downloadCsvTemplate,
    exportGuestsToCsv,
  };
}
