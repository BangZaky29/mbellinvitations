import { useState, useEffect } from 'react';
import type { GuestItem } from '../components/dashboard/guest-list/types';
import { DEFAULT_WA_TEMPLATE } from '../components/dashboard/guest-list/constants';

interface UseWaBlastOptions {
  invitationSlug?: string;
  coupleNames?: string;
  showToast: (msg: string) => void;
}

export function useWaBlast({
  invitationSlug = 'undangan-baru',
  coupleNames = 'Mempelai Pria & Mempelai Wanita',
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

  return {
    sentGuestIds,
    setSentGuestIds,
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
