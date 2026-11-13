import { useState, useEffect } from 'react';
import type { GuestItem } from '../components/dashboard/guest-list/types';
import { DEFAULT_WA_TEMPLATE } from '../components/dashboard/guest-list/constants';
import { getInvitationFullUrl } from '../utils/urlHelper';
import {
  generateWaInvitationMessage,
  invalidateAiWaCache,
  type GeminiModelName,
} from '../services/geminiWaService';

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
  const aiToggleStorageKey = `mbell_use_ai_wa_${invitationSlug}`;

  // WA Blast Tracker & Sent States (Disimpan di localStorage per slug)
  const [sentGuestIds, setSentGuestIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(sentStorageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Template Pesan WA Kustom (Fallback manual)
  const [waTemplate, setWaTemplate] = useState<string>(() => {
    try {
      return localStorage.getItem(templateStorageKey) || DEFAULT_WA_TEMPLATE;
    } catch {
      return DEFAULT_WA_TEMPLATE;
    }
  });

  // Mode AI Google Studio (Default aktif)
  const [useAiForWa, setUseAiForWa] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(aiToggleStorageKey);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [lastUsedModel, setLastUsedModel] = useState<GeminiModelName | 'default_template' | null>(null);
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
      const savedAi = localStorage.getItem(aiToggleStorageKey);
      if (savedAi !== null) {
        setUseAiForWa(savedAi === 'true');
      }
    } catch {
      // Ignored
    }
  }, [sentStorageKey, templateStorageKey, aiToggleStorageKey]);

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

  const toggleUseAi = (enabled: boolean) => {
    setUseAiForWa(enabled);
    try {
      localStorage.setItem(aiToggleStorageKey, String(enabled));
    } catch {
      // Ignored
    }
    showToast(
      enabled
        ? '🤖 Mode AI Generator WhatsApp (Google Studio) Aktif!'
        : '📝 Mode Template Manual WhatsApp Aktif!'
    );
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

  /**
   * Kirim pesan WhatsApp:
   * Menggunakan AI Generator (Waterfall Switching) jika useAiForWa aktif.
   * Otomatis fallback ke template manual jika seluruh model AI terkena limit kuota.
   */
  const handleSendWhatsApp = async (guest: GuestItem, forceRegenerate = false) => {
    const link = getPersonalLink(guest.name, guest.guest_code);
    let message = '';
    let usedModel: GeminiModelName | 'default_template' = 'default_template';

    if (useAiForWa) {
      setIsGeneratingAi(true);
      try {
        const aiResult = await generateWaInvitationMessage({
          guestName: guest.name,
          coupleNames,
          invitationUrl: link,
          guestCode: guest.guest_code,
          forceRegenerate,
        });
        message = aiResult.text;
        usedModel = aiResult.usedModel;
        setLastUsedModel(aiResult.usedModel);
      } catch (err) {
        console.warn('⚠️ Gagal generate pesan AI, beralih ke template manual:', err);
        message = waTemplate
          .replace(/{nama_tamu}/g, guest.name)
          .replace(/{nama_mempelai}/g, coupleNames)
          .replace(/{link_undangan}/g, link);
      } finally {
        setIsGeneratingAi(false);
      }
    } else {
      message = waTemplate
        .replace(/{nama_tamu}/g, guest.name)
        .replace(/{nama_mempelai}/g, coupleNames)
        .replace(/{link_undangan}/g, link);
    }

    await markAsSent(guest.id);

    const encodedMsg = encodeURIComponent(message);
    const phone = guest.phone_number ? guest.phone_number.replace(/[^0-9]/g, '') : '';
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

    window.open(waUrl, '_blank');

    if (usedModel !== 'default_template') {
      showToast(`🤖 Pesan AI (${usedModel}) siap! Membuka WhatsApp untuk "${guest.name}" ✔️`);
    } else {
      showToast(`💬 Membuka WhatsApp untuk "${guest.name}"... Ditandai: Sudah Dikirim ✔️`);
    }
  };

  /**
   * Generate teks pratinjau AI untuk modal preview
   */
  const generateAiPreview = async (guestName: string, forceRegenerate = true): Promise<string> => {
    const link = getPersonalLink(guestName, 'DEMO123');
    if (forceRegenerate) {
      invalidateAiWaCache(link, guestName, 'DEMO123');
    }
    const result = await generateWaInvitationMessage({
      guestName,
      coupleNames,
      invitationUrl: link,
      guestCode: 'DEMO123',
      forceRegenerate,
    });
    setLastUsedModel(result.usedModel);
    return result.text;
  };

  return {
    sentGuestIds,
    setSentGuestIds,
    syncSentIds,
    waTemplate,
    setWaTemplate,
    showTemplateEditor,
    setShowTemplateEditor,
    useAiForWa,
    toggleUseAi,
    isGeneratingAi,
    lastUsedModel,
    handleSaveTemplate,
    getPersonalLink,
    markAsSent,
    toggleSentStatus,
    handleCopyPersonalLink,
    handleSendWhatsApp,
    generateAiPreview,
  };
}
