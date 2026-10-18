import React, { useEffect, useRef, useState } from 'react';
import { supabase, saveUserTemplate } from '../../lib/supabaseClient';
import {
  MOCK_MODERN_WISHES,
  MOCK_THEME_WISHES_MAP,
} from '../../data/mockInvitation';

// Sub-components & Helpers extracted in Fase 1
import {
  TEMPLATE_ID_TO_THEME,
  THEME_TO_TEMPLATE_ID,
  getTemplateDisplayName,
  TOTAL_EXCLUSIVE_THEMES,
  CANONICAL_THEMES,
  isTemplateUnlocked,
} from './constants/themeMapping';
import { computeCoupleSlug } from './helpers/computeCoupleSlug';
import { getInvitationDisplayUrl } from '../../utils/urlHelper';
import { EditorStepContent } from './components/EditorStepContent';
import { EditorBottomBar } from './components/EditorBottomBar';
import { ConfirmPublishModal } from './components/ConfirmPublishModal';
import { UnpurchasedThemeModal } from './components/UnpurchasedThemeModal';
import { SaveToastNotification } from './components/SaveToastNotification';

// Dashboard Components
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { PhoneMockupPreview } from '../../components/dashboard/PhoneMockupPreview';
import { AuthGateModal } from '../../components/dashboard/AuthGateModal';
import { PricingPaywallModal } from '../../components/dashboard/PricingPaywallModal';
import { MyTemplatesPanel } from '../../components/dashboard/MyTemplatesPanel';
import { GuestListPanel } from '../../components/dashboard/GuestListPanel';
import { WishesListPanel } from '../../components/dashboard/WishesListPanel';
import { SettingsAccountPanel } from '../../components/dashboard/SettingsAccountPanel';
import { OpeningSplashScreen } from '../../components/common/OpeningSplashScreen';

// Custom Hooks
import {
  useDashboardAuth,
  parseSupabaseUser,
  preserveDraftToLocalStorage,
} from '../../hooks/useDashboardAuth';
import { useDashboardEditor } from '../../hooks/useDashboardEditor';
import { useDashboardSave } from '../../hooks/useDashboardSave';
import { useDashboardPublish } from '../../hooks/useDashboardPublish';

// Re-export universal helper for backward compatibility
export { computeCoupleSlug };

export const DashboardEditorPage: React.FC = () => {
  // 1. Auth Hook
  const { user, setUser } = useDashboardAuth();

  // Ref bridges to avoid cyclic dependencies between editor, save, and publish hooks
  const saveToastRef = useRef<(toast: { show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null) => void>(() => {});
  const isSavingRef = useRef<(saving: boolean) => void>(() => {});
  const lastSavedRef = useRef<(date: Date | null) => void>(() => {});

  // 2. Editor Hook (State form, step, navigation, tab, modal)
  const editor = useDashboardEditor({
    user,
    setUser,
    setSaveToast: (t: any) => saveToastRef.current(t),
    setIsSaving: (s: boolean) => isSavingRef.current(s),
    setLastSaved: (d: Date | null) => lastSavedRef.current(d),
  });

  // 3. Save Hook (Debounced autosave, manual save, checkpoint draft, toast)
  const save = useDashboardSave({
    user,
    formData: editor.formData,
    themeConfig: editor.themeConfig,
    currentTemplateRecordId: editor.currentTemplateRecordId,
    setCurrentTemplateRecordId: editor.setCurrentTemplateRecordId,
    setFormData: editor.setFormData,
    setThemeConfig: editor.setThemeConfig,
    loading: editor.loading,
  });

  // Connect bridges
  saveToastRef.current = (toast) => save.setSaveToast(toast);
  isSavingRef.current = (saving) => save.setIsSaving(saving);
  lastSavedRef.current = (date) => save.setLastSaved(date);

  // 4. Publish Hook (Publish flow, confirmation modal, paywall trigger)
  const publish = useDashboardPublish({
    user,
    formData: editor.formData,
    themeConfig: editor.themeConfig,
    currentTemplateRecordId: editor.currentTemplateRecordId,
    setCurrentTemplateRecordId: editor.setCurrentTemplateRecordId,
    setFormData: editor.setFormData,
    setIsSaving: save.setIsSaving,
    setLastSaved: save.setLastSaved,
    setSaveToast: save.setSaveToast,
    setShowAuthGateModal: editor.setShowAuthGateModal,
    setShowConfirmPublishModal: editor.setShowConfirmPublishModal,
    setShowPricingModal: editor.setShowPricingModal,
    handleManualSave: save.handleManualSave,
    publishedThemeId: editor.publishedThemeId,
    setPublishedThemeId: editor.setPublishedThemeId,
  });

  // Handler saat user berhasil login via modal (Google/Email)
  const handleAuthSuccess = async (loggedInUser: any) => {
    const parsed = parseSupabaseUser(loggedInUser);
    setUser(parsed);

    try {
      const targetSlug = editor.formData.slug || computeCoupleSlug(editor.formData.groom?.name, editor.formData.bride?.name) || 'undangan-baru';
      const saveResult = await saveUserTemplate({
        user_id: loggedInUser.id,
        slug: targetSlug,
        title: `${editor.formData.groom?.name || 'Mempelai'} & ${editor.formData.bride?.name || 'Mempelai'}`,
        template_id: THEME_TO_TEMPLATE_ID[editor.formData.theme_id || 'modern'] || 'template1',
        theme_id: editor.formData.theme_id || 'modern',
        status: 'draft',
        content: editor.formData,
        theme_config: editor.themeConfig,
        thumbnail_url: editor.formData.cover_image || null,
        music_url: editor.formData.music_url || null,
      });

      if (saveResult.success && saveResult.data) {
        editor.setCurrentTemplateRecordId(saveResult.data.id);
        localStorage.setItem('mbell_active_template_id', saveResult.data.id);
      }
      localStorage.removeItem('mbell_pending_draft_hasUnsavedEdits');

      save.setSaveToast({
        show: true,
        message: 'Draf otomatis tersimpan',
        type: 'success',
        isError: false,
      });
    } catch (err) {
      console.warn('Auto upsert exception:', err);
    }
  };

  // Handler Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    save.setSaveToast({
      show: true,
      message: 'Berhasil keluar akun',
      type: 'info',
      isError: false,
    });
  };

  // State modal peringatan ketika user mencoba menyimpan saat tema baru belum dibeli
  const [showUnpurchasedThemeModal, setShowUnpurchasedThemeModal] = useState(false);

  // Deteksi jika user sedang memilih tema yang berbeda dari tema yang dibeli dan belum dibeli
  const isEditingUnpurchasedNewTheme = Boolean(
    publish.isAlreadyPublished && publish.isTemplateChanged && !publish.isUnlocked
  );

  // Safe Save Handler: Mencegah perubahan tema live secara gratis
  const handleSafeSave = async () => {
    if (isEditingUnpurchasedNewTheme) {
      setShowUnpurchasedThemeModal(true);
      return;
    }
    await save.handleManualSave();

    // Jika undangan berstatus published dan tema saat ini sudah dibeli (unlocked):
    // Simpan perubahan otomatis mengaktifkan tema tersebut sebagai live published theme!
    const currentTheme = editor.formData.theme_id || 'modern';
    if (editor.formData.status === 'published' && publish.isUnlocked) {
      editor.setPublishedThemeId(currentTheme);
    }
  };

  // Revert tema kembali ke tema live yang sah
  const handleRevertToLiveTheme = () => {
    setShowUnpurchasedThemeModal(false);
    const originalTheme = publish.publishedThemeId || editor.formData.paid_template_id || editor.formData.theme_id || 'modern';
    editor.handleThemeChange(originalTheme);
    save.setSaveToast({
      show: true,
      message: `Tema dikembalikan ke ${getTemplateDisplayName(originalTheme)}`,
      type: 'info',
    });
  };

  // Simpan data draf saja tanpa mengotak-atik live theme
  const handleSaveDraftContentOnly = async () => {
    setShowUnpurchasedThemeModal(false);
    await save.handleManualSave();
    const effectiveLiveTheme = publish.publishedThemeId || editor.formData.paid_template_id || editor.formData.theme_id || 'modern';
    save.setSaveToast({
      show: true,
      message: `Data draf tersimpan! Undangan live publik tetap aman menggunakan tema ${getTemplateDisplayName(effectiveLiveTheme)}.`,
      type: 'info',
    });
  };

  // Lanjut ke checkout pembayaran template
  const handleProceedToThemePayment = () => {
    setShowUnpurchasedThemeModal(false);
    publish.handleRequestPublish();
  };

  const [realWishesCount, setRealWishesCount] = useState<number | null>(null);
  const [realGuestsCount, setRealGuestsCount] = useState<number | null>(null);

  const previewWishes =
    MOCK_THEME_WISHES_MAP[TEMPLATE_ID_TO_THEME[String(editor.formData.theme_id || 'modern')]] ||
    MOCK_MODERN_WISHES;

  const currentSlug = editor.formData.slug || computeCoupleSlug(editor.formData.groom?.name, editor.formData.bride?.name) || 'undangan-baru';
  const coupleNames = `${editor.formData.groom?.name || 'Mempelai Pria'} & ${editor.formData.bride?.name || 'Mempelai Wanita'}`;

  // Sinkronisasi realtime jumlah ucapan dan jumlah tamu asli dari database Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchCounts() {
      try {
        const slug = editor.formData.slug || currentSlug;
        const idCandidates = new Set<string>();

        if (editor.formData.id) idCandidates.add(editor.formData.id);
        if (editor.currentTemplateRecordId) idCandidates.add(editor.currentTemplateRecordId);

        if (slug && slug !== 'undangan-baru' && slug !== 'raditya-jessica') {
          const [invRes, tplRes] = await Promise.all([
            supabase.from('invitations').select('id').eq('slug', slug).maybeSingle(),
            supabase.from('user_templates').select('id').eq('slug', slug).maybeSingle(),
          ]);
          if (invRes.data?.id) idCandidates.add(invRes.data.id);
          if (tplRes.data?.id) idCandidates.add(tplRes.data.id);
        }

        if (user?.id) {
          const [invRes, tplRes] = await Promise.all([
            supabase.from('invitations').select('id').eq('user_id', user.id).limit(10),
            supabase.from('user_templates').select('id').eq('user_id', user.id).limit(10),
          ]);
          invRes.data?.forEach((r) => idCandidates.add(r.id));
          tplRes.data?.forEach((r) => idCandidates.add(r.id));
        }

        const candidateIds = Array.from(idCandidates).filter(Boolean);

        if (candidateIds.length > 0 && isMounted) {
          const { count: wCount, error: wErr } = await supabase
            .from('wishes')
            .select('*', { count: 'exact', head: true })
            .in('invitation_id', candidateIds)
            .eq('is_hidden', false);

          if (!wErr && typeof wCount === 'number' && isMounted) {
            setRealWishesCount(wCount);
          }

          const { count: gCount, error: gErr } = await supabase
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .in('invitation_id', candidateIds);

          if (!gErr && typeof gCount === 'number' && isMounted) {
            setRealGuestsCount(gCount);
          }
        } else if (isMounted) {
          setRealWishesCount(0);
          setRealGuestsCount(0);
        }
      } catch (e) {
        console.warn('Gagal memuat count wishes/guests:', e);
      }
    }

    fetchCounts();

    // Supabase Realtime channel for live instant synchronization across all devices
    const channel = supabase
      .channel('dashboard_realtime_counts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishes' },
        () => {
          fetchCounts();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guests' },
        () => {
          fetchCounts();
        }
      )
      .subscribe();

    const handleWishesCount = (e: any) => {
      if (typeof e.detail?.count === 'number' && isMounted) {
        setRealWishesCount(e.detail.count);
      }
    };
    const handleGuestsCount = (e: any) => {
      if (typeof e.detail?.count === 'number' && isMounted) {
        setRealGuestsCount(e.detail.count);
      }
    };

    window.addEventListener('mbell_wishes_count_changed', handleWishesCount);
    window.addEventListener('mbell_guests_count_changed', handleGuestsCount);

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      window.removeEventListener('mbell_wishes_count_changed', handleWishesCount);
      window.removeEventListener('mbell_guests_count_changed', handleGuestsCount);
    };
  }, [user?.id, editor.formData.id, editor.formData.slug, editor.currentTemplateRecordId, currentSlug]);

  return (
    <>
      {/* 0. OPENING ANIMATION LOADING SCREEN */}
      {editor.showOpeningSplash && (
        <OpeningSplashScreen onFinish={() => editor.setShowOpeningSplash(false)} />
      )}

      {editor.loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] text-stone-800">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
            <p className="font-label-md text-label-md text-stone-600">Memuat Editor Undangan...</p>
          </div>
        </div>
      ) : (
        <div className="h-screen overflow-hidden flex flex-col bg-[#F5F2EB] text-stone-800 font-sans selection:bg-stone-900/10 selection:text-stone-900">
          {/* 1. TOP HEADER */}
          <DashboardHeader
            slug={currentSlug}
            onSlugChange={editor.handleSlugChange}
            status={editor.formData.status || 'published'}
            isPublished={editor.formData.status === 'published'}
            isAlreadyPublished={publish.isAlreadyPublished}
            isTemplateChanged={publish.isTemplateChanged}
            publishedThemeId={publish.publishedThemeId}
            currentThemeId={editor.formData.theme_id}
            suggestedSlug={computeCoupleSlug(editor.formData.groom?.name, editor.formData.bride?.name)}
            onSaveDraft={handleSafeSave}
            onRevertAll={save.handleRevertAll}
            isSaving={save.isSaving}
            lastSaved={save.lastSaved}
            hasUnsavedChanges={save.hasUnsavedChanges}
            unsavedCount={save.unsavedCount}
            userEmail={user?.email || null}
            userAvatar={user?.avatar_url || null}
            userName={user?.full_name || null}
            accountStatus="Gratis"
            onLoginClick={() => editor.setShowAuthGateModal(true)}
            onRegisterClick={() => editor.setShowAuthGateModal(true)}
            onOpenSettings={() => editor.setActiveTab('pengaturan')}
            onOpenMyTemplates={() => editor.setActiveTab('template-saya')}
            onReplayOpening={() => editor.setShowOpeningSplash(true)}
            onLogout={handleLogout}
            onPublish={publish.handleRequestPublish}
            onOpenPreview={() => editor.setShowFullscreenModal(true)}
          />

          {/* 2. BODY CONTAINER (3-KOLOM: SIDEBAR KIRI, EDITOR TENGAH, PREVIEW KANAN) */}
          <div className="flex-1 flex overflow-hidden">
            {/* KOLOM 1: LEFT SIDEBAR */}
            <DashboardSidebar
              activeTab={editor.activeTab}
              onSelectTab={editor.setActiveTab}
              unreadWishesCount={realWishesCount !== null ? realWishesCount : 0}
              totalGuestsCount={realGuestsCount !== null ? realGuestsCount : 0}
              totalTemplatesCount={TOTAL_EXCLUSIVE_THEMES}
              unlockedTemplatesCount={
                CANONICAL_THEMES.filter((themeKey) =>
                  isTemplateUnlocked(
                    themeKey,
                    editor.formData.unlocked_templates,
                    editor.formData.paid_template_id || publish.publishedThemeId,
                    editor.formData.is_paid || Boolean(publish.publishedThemeId)
                  )
                ).length || 1
              }
              activeThemeName={getTemplateDisplayName(editor.formData.theme_id)}
            />

            {/* KOLOM 2: CENTER EDITOR PANEL (VERTICAL SCROLL) */}
            <main id="dashboard-editor-main" data-dashboard-editor="true" className="flex-1 h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scroll-smooth bg-[#F5F2EB]">
              <div className="max-w-3xl mx-auto space-y-6 pb-44 sm:pb-28">
                {editor.activeTab === 'template-saya' ? (
                  <MyTemplatesPanel
                    currentUserId={user?.id || null}
                    currentFormData={editor.formData}
                    activeTemplateId={editor.currentTemplateRecordId}
                    onSelectTemplate={editor.handleSelectSavedTemplate}
                    onImplementActiveTemplate={editor.handleImplementActiveTemplate}
                    onOpenAuthGate={() => editor.setShowAuthGateModal(true)}
                    onAddNewTemplate={editor.handleAddNewTemplate}
                    onSlugChange={editor.handleSlugChange}
                  />
                ) : editor.activeTab === 'edit-undangan' ? (
                  <>
                    <EditorStepContent
                      activeStep={editor.activeStep}
                      formData={editor.formData}
                      themeConfig={editor.themeConfig}
                      onSelectStep={editor.handleSelectStep}
                      onThemeChange={editor.handleThemeChange}
                      onApplyPreset={editor.handleApplyPreset}
                      onSlugChange={editor.handleSlugChange}
                      setFormData={editor.setFormData}
                      setThemeConfig={editor.setThemeConfig}
                      onEventsChange={editor.handleEventsChange}
                      onSetCountdownTarget={editor.handleSetCountdownTarget}
                      onManualSave={handleSafeSave}
                    />

                    <EditorBottomBar
                      activeStep={editor.activeStep}
                      isSaving={save.isSaving}
                      hasUnsavedChanges={save.hasUnsavedChanges}
                      unsavedCount={save.unsavedCount}
                      isAlreadyPublished={publish.isAlreadyPublished}
                      isTemplateChanged={publish.isTemplateChanged}
                      onSaveDraft={handleSafeSave}
                      onRevertAll={save.handleRevertAll}
                      onPrevStep={editor.handlePrevStep}
                      onNextStep={editor.handleNextStep}
                      onRequestPublish={publish.handleRequestPublish}
                      onOpenPreview={() => editor.setShowFullscreenModal(true)}
                    />
                  </>
                ) : editor.activeTab === 'daftar-tamu' ? (
                  <GuestListPanel
                    userId={user?.id}
                    invitationId={editor.formData.id}
                    invitationSlug={currentSlug}
                    coupleNames={coupleNames}
                    currentFormData={editor.formData}
                    activeTemplateId={editor.currentTemplateRecordId}
                    onGoToEditor={() => editor.setActiveTab('edit-undangan')}
                    onOpenMyTemplates={() => editor.setActiveTab('template-saya')}
                    onOpenAuthGate={() => editor.setShowAuthGateModal(true)}
                    onSelectSavedTemplate={editor.handleSelectSavedTemplate}
                  />
                ) : editor.activeTab === 'ucapan-masuk' ? (
                  <WishesListPanel
                    userId={user?.id}
                    invitationId={editor.formData.id}
                    invitationSlug={currentSlug}
                    coupleNames={coupleNames}
                    currentFormData={editor.formData}
                    activeTemplateId={editor.currentTemplateRecordId}
                    onGoToEditor={() => editor.setActiveTab('edit-undangan')}
                    onOpenMyTemplates={() => editor.setActiveTab('template-saya')}
                    onOpenAuthGate={() => editor.setShowAuthGateModal(true)}
                    onSelectSavedTemplate={editor.handleSelectSavedTemplate}
                  />
                ) : (
                  <SettingsAccountPanel
                    userId={user?.id}
                    userEmail={user?.email}
                    userName={user?.full_name}
                    userAvatar={user?.avatar_url}
                    invitationSlug={currentSlug}
                    onGoToEditor={() => editor.setActiveTab('edit-undangan')}
                    onOpenAuthGate={() => editor.setShowAuthGateModal(true)}
                    onLogout={() => {
                      setUser(null);
                      editor.setActiveTab('edit-undangan');
                    }}
                  />
                )}
              </div>
            </main>

            {/* KOLOM 3: RIGHT PREVIEW PANEL (STATIC ON DESKTOP) */}
            <aside className="w-[440px] shrink-0 h-full border-l border-stone-200/80 hidden xl:flex flex-col items-center justify-center bg-[#EFECE6] p-4 relative overflow-hidden select-none">
              <PhoneMockupPreview
                data={editor.formData}
                theme={editor.themeConfig}
                wishes={previewWishes}
                previewUrl={getInvitationDisplayUrl(currentSlug)}
              />
            </aside>
          </div>

          {/* MOBILE FLOATING PILL BUTTON "Preview" (Hanya tampil di luar tab editor karena di tab editor sudah sebaris di EditorBottomBar) */}
          {editor.activeTab !== 'edit-undangan' && (
            <div className="fixed bottom-[74px] right-4 sm:right-6 z-30 xl:hidden">
              <button
                type="button"
                onClick={() => editor.setShowFullscreenModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900 text-white font-label-md text-xs sm:text-sm shadow-2xl hover:bg-stone-800 transition-all active:scale-95 cursor-pointer border border-white/20 backdrop-blur-md"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Preview</span>
              </button>
            </div>
          )}

          {/* FULLSCREEN PREVIEW MODAL */}
          {editor.showFullscreenModal && (
            <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
              <div className="w-full max-w-[400px] sm:max-w-[420px] h-[calc(100vh-20px)] max-h-[780px] flex items-center justify-center overflow-hidden">
                <PhoneMockupPreview
                  data={editor.formData}
                  theme={editor.themeConfig}
                  wishes={previewWishes}
                  previewUrl={getInvitationDisplayUrl(currentSlug)}
                  onClose={() => editor.setShowFullscreenModal(false)}
                />
              </div>
            </div>
          )}

          {/* MODAL POPUP: KONFIRMASI SIMPAN & TERBITKAN */}
          <ConfirmPublishModal
            isOpen={editor.showConfirmPublishModal}
            slug={currentSlug}
            coupleName={`${editor.formData.groom?.name || 'Mempelai Pria'} & ${editor.formData.bride?.name || 'Mempelai Wanita'}`}
            currentThemeId={editor.formData.theme_id || 'modern'}
            publishedThemeId={publish.publishedThemeId}
            isAlreadyPublished={publish.isAlreadyPublished}
            isTemplateChanged={publish.isTemplateChanged}
            isUnlocked={publish.isUnlocked}
            isSaving={save.isSaving}
            onClose={() => editor.setShowConfirmPublishModal(false)}
            onConfirmSameTemplatePublish={publish.handleConfirmSameTemplatePublish}
            onProceedToPayment={publish.handleProceedToPayment}
          />

          {/* MODAL POPUP: AUTH GATE */}
          <AuthGateModal
            isOpen={editor.showAuthGateModal}
            onClose={() => editor.setShowAuthGateModal(false)}
            invitationSlug={currentSlug}
            onBeforeAuth={() => preserveDraftToLocalStorage(editor.formData, editor.themeConfig)}
            onSuccessLogin={handleAuthSuccess}
          />

          {/* MODAL POPUP: HARGA & PAYWALL */}
          <PricingPaywallModal
            isOpen={editor.showPricingModal}
            onClose={() => editor.setShowPricingModal(false)}
            onConfirmPublish={publish.handleConfirmPublish}
            invitationSlug={currentSlug}
            themeId={editor.formData.theme_id || 'modern'}
            coupleName={`${editor.formData.groom?.name || 'Mempelai Pria'} & ${editor.formData.bride?.name || 'Mempelai Wanita'}`}
          />

          {/* MODAL POPUP: PERINGATAN TEMA BELUM DIAKTIVASI */}
          <UnpurchasedThemeModal
            isOpen={showUnpurchasedThemeModal}
            slug={currentSlug}
            currentThemeId={editor.formData.theme_id || 'modern'}
            publishedThemeId={publish.publishedThemeId || editor.formData.paid_template_id || editor.formData.theme_id || 'modern'}
            onClose={() => setShowUnpurchasedThemeModal(false)}
            onProceedToCheckout={handleProceedToThemePayment}
            onKeepPublishedThemeAndSave={handleSaveDraftContentOnly}
            onRevertToOriginalTheme={handleRevertToLiveTheme}
          />

          {/* FLOATING TOAST NOTIFICATION */}
          <SaveToastNotification
            toast={save.saveToast}
            onClose={() => save.setSaveToast(null)}
          />
        </div>
      )}
    </>
  );
};
