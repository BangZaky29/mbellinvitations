import { useState, useEffect } from 'react';
import type { GuestItem } from '../components/dashboard/guest-list/types';
import { DEFAULT_WA_TEMPLATE } from '../components/dashboard/guest-list/constants';
import { getInvitationFullUrl } from '../utils/urlHelper';

interface UseWaBlastOptions {
  invitationSlug?: string;
  coupleNames?: string;
  onUpdateWaStatus?: (guestId: string, isSent: boolean) => Promise<void> | void;
  showToast: (msg: string) => void;
}

export function useWaBlast({
  invitationSlug = 'undangan-baru',
  coupleNames = 'Mempelai Pria & Mempelai Wanita',
  onUpdateWaStatus,
  showToast,
}: UseWaBlastOptions) {
  const sentStorageKey = `mbell_sent_guests_${invitationSlug}`;
  const templateStorageKey = `mbell_wa_template_${invitationSlug}`;

  // WA Blast Tracker & Sent States (Disimpan di localStorage per slug)
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

  // Simpan sent IDs ke localStorage saat berubah
  useEffect(() => {
    try {
      localStorage.setItem(sentStorageKey, JSON.stringify(Array.from(sentGuestIds)));
    } catch {
      // Ignored
    }
  }, [sentGuestIds, sentStorageKey]);

  // Muat ulang sent IDs dan template saat template / invitationSlug berganti
  useEffect(() => {
    try {
      const saved = localStorage.getItem(sentStorageKey);
      setSentGuestIds(saved ? new Set(JSON.parse(saved)) : new Set());
      const savedTpl = localStorage.getItem(templateStorageKey);
      setWaTemplate(savedTpl || DEFAULT_WA_TEMPLATE);
    } catch {
      // Ignored
    }
  }, [sentStorageKey, templateStorageKey]);

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

  const getPersonalLink = (name: string, code: string) => {
    const baseUrl = getInvitationFullUrl(invitationSlug);
    return `${baseUrl}?to=${encodeURIComponent(name)}&g=${encodeURIComponent(code)}`;
  };

  const syncSentIds = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    setSentGuestIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const markAsSent = async (guestId: string) => {
    setSentGuestIds((prev) => new Set(prev).add(guestId));
    if (onUpdateWaStatus) {
      await onUpdateWaStatus(guestId, true);
    }
  };

  const toggleSentStatus = async (guestId: string) => {
    const isCurrentlySent = sentGuestIds.has(guestId);
    const nextSent = !isCurrentlySent;

    setSentGuestIds((prev) => {
      const next = new Set(prev);
      if (nextSent) {
        next.add(guestId);
      } else {
        next.delete(guestId);
      }
      return next;
    });

    if (onUpdateWaStatus) {
      await onUpdateWaStatus(guestId, nextSent);
    }
  };

  const handleCopyPersonalLink = async (guest: GuestItem) => {
    const link = getPersonalLink(guest.name, guest.guest_code);
    navigator.clipboard.writeText(link);
    await markAsSent(guest.id);
    showToast(`📋 Link unik untuk "${guest.name}" tersalin! Ditandai: Sudah Dikirim ✔️`);
  };

  const handleSendWhatsApp = async (guest: GuestItem) => {
    const link = getPersonalLink(guest.name, guest.guest_code);
    const message = waTemplate
      .replace(/{nama_tamu}/g, guest.name)
      .replace(/{nama_mempelai}/g, coupleNames)
      .replace(/{link_undangan}/g, link);

    await markAsSent(guest.id);

    const encodedMsg = encodeURIComponent(message);
    const phone = guest.phone_number ? guest.phone_number.replace(/[^0-9]/g, '') : '';
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
    showToast(`💬 Membuka WhatsApp untuk "${guest.name}"... Ditandai: Sudah Dikirim ✔️`);
  };

  return {
    sentGuestIds,
    setSentGuestIds,
    syncSentIds,
    waTemplate,
    setWaTemplate,
    showTemplateEditor,
    setShowTemplateEditor,
    handleSaveTemplate,
    getPersonalLink,
    markAsSent,
    toggleSentStatus,
    handleCopyPersonalLink,
    handleSendWhatsApp,
  };
}
