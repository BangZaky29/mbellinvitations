import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useInvitationRealtime } from '../hooks/useInvitationRealtime';
import { Template1Modern } from '../components/templates/Template1Modern';
import { Template2Rustic } from '../components/templates/Template2Rustic';
import { Template3Jawa } from '../components/templates/Template3Jawa';
import { Template4Islami } from '../components/templates/Template4Islami';
import { Template5Luxury } from '../components/templates/Template5Luxury';
import { TemplateSundaSiger } from '../components/templates/TemplateSundaSiger';
import { TemplateMinangBaralek } from '../components/templates/Template7Minang';
import { TemplateBatakToba } from '../components/templates/Template8Batak';
import { DraftNoticeScreen } from '../components/common/DraftNoticeScreen';
import { isTemplateUnlocked, TEMPLATE_ID_TO_THEME } from './dashboard/constants/themeMapping';

export const PublicInvitationPage: React.FC = () => {
  const { slug = 'raditya-jessica', themeSlug } = useParams<{ slug?: string; themeSlug?: string }>();
  const [searchParams] = useSearchParams();

  const guestParam = searchParams.get('to') || searchParams.get('guest');
  const codeParam = searchParams.get('g') || searchParams.get('code');

  // Resolusi tema yang diminta secara eksplisit via URL (misal: /minang/zaky-bella atau ?theme=minang)
  const rawThemeParam = themeSlug || searchParams.get('theme');
  let requestedTheme: string | null = null;
  if (rawThemeParam) {
    const clean = rawThemeParam.toLowerCase().replace(/^template[-_]?/i, '').trim();
    if (clean === '8' || clean === 'batak') requestedTheme = 'batak';
    else if (clean === '7' || clean === 'minang') requestedTheme = 'minang';
    else if (clean === '6' || clean === 'sunda') requestedTheme = 'sunda';
    else if (clean === '3' || clean === 'jawa') requestedTheme = 'jawa';
    else if (clean === '2' || clean === 'rustic') requestedTheme = 'rustic';
    else if (clean === '4' || clean === 'islami') requestedTheme = 'islami';
    else if (clean === '5' || clean === 'luxury') requestedTheme = 'luxury';
    else if (clean === '1' || clean === 'modern') requestedTheme = 'modern';
    else requestedTheme = TEMPLATE_ID_TO_THEME[rawThemeParam] || rawThemeParam;
  }

  const {
    loading,
    templateId,
    invitationData,
    themeConfig,
    wishes,
    activeGuestCode,
    handleSendWish,
    handleSendRsvp,
  } = useInvitationRealtime({
    slug,
    guestParam,
    codeParam,
    requestedTheme,
  });

  // Dynamic Browser Tab Title
  useEffect(() => {
    const groomName = invitationData.groom?.name || '';
    const brideName = invitationData.bride?.name || '';
    if (groomName && brideName) {
      const isBrideFirst = Boolean(invitationData.is_bride_first);
      const title = isBrideFirst
        ? `The Wedding of ${brideName} & ${groomName} | mbell invitations`
        : `The Wedding of ${groomName} & ${brideName} | mbell invitations`;
      document.title = title;
    }
  }, [invitationData.groom?.name, invitationData.bride?.name, invitationData.is_bride_first]);

  const onSubmitWish = async (name: string, message: string, attendance: string = 'hadir') => {
    return await handleSendWish(name, message, attendance);
  };

  const onSubmitRsvp = async (name: string, status: string, pax: number, notes: string = '') => {
    return await handleSendRsvp(name, status, pax, notes);
  };

  const isPublished = invitationData.status === 'published';
  const isDemoSlug =
    slug === 'demo' ||
    slug === 'raditya-jessica' ||
    slug.startsWith('demo-') ||
    slug.includes('demo');

  // Proteksi Route Publik Ganda:
  // 1. Verifikasi status publikasi ('published')
  // 2. Verifikasi kepemilikan template (harus sudah dibeli / unlocked untuk desain undangan ini)
  const currentActiveTheme = TEMPLATE_ID_TO_THEME[templateId] || invitationData?.theme_id || templateId;
  const isThemeOwned =
    isPublished ||
    isTemplateUnlocked(
      currentActiveTheme,
      invitationData.unlocked_templates,
      invitationData.paid_template_id,
      invitationData.is_paid
    );

  // Jika undangan berstatus 'draft' ATAU tema yang terpasang belum dibeli,
  // tampilkan layar pemberitahuan elegan bahwa undangan sedang disiapkan oleh calon pengantin.
  // PENTING: Lakukan evaluasi ini hanya setelah status jaringan terkonfirmasi (!loading)
  // sehingga tamu langsung melihat cover template tanpa terpotong loading hitam
  if (!loading && (!isPublished || !isThemeOwned) && !isDemoSlug) {
    return (
      <DraftNoticeScreen
        slug={slug}
        groomName={invitationData.groom?.name}
        brideName={invitationData.bride?.name}
        coverImage={invitationData.cover_image || invitationData.couple_photo}
      />
    );
  }

  const showDemoPill = slug === 'demo' && !isPublished;

  // Resolusi template murni berdasarkan tema aktif (tanpa dibajak oleh riwayat template berbayar lama)
  const activeTheme =
    requestedTheme ||
    invitationData?.theme_id ||
    TEMPLATE_ID_TO_THEME[templateId] ||
    (templateId === 'template8' ? 'batak' : templateId === 'template7' ? 'minang' : templateId === 'template6' ? 'sunda' : 'modern');

  const isBatak = activeTheme === 'batak';
  const isMinang = activeTheme === 'minang';
  const isSunda = activeTheme === 'sunda';
  const isJawa = activeTheme === 'jawa';
  const isRustic = activeTheme === 'rustic';
  const isIslami = activeTheme === 'islami';
  const isLuxury = activeTheme === 'luxury';
  const isModern = !isBatak && !isMinang && !isSunda && !isJawa && !isRustic && !isIslami && !isLuxury;

  return (
    <div id="invitation-root" data-public-invitation="true" className="relative w-full min-h-screen no-scrollbar">
      {/* Floating Demo & Info Pill Bar (Hanya tampil pada rute khusus demo, disembunyikan untuk template yang sudah live/dipublish) */}
      {showDemoPill && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl text-[11px] text-neutral-300 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-neutral-300">
            /{slug}
            {activeGuestCode ? ` • [Code: ${activeGuestCode}]` : ''}
          </span>
          <span className="text-white/20">|</span>
          <Link
            to="/demo"
            className="text-amber-300 hover:text-amber-200 font-semibold transition-colors flex items-center gap-1"
          >
            <span>5-Template Demo</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Render Template Sesuai template_id & activeTheme */}
      {isModern && (
        <Template1Modern
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isRustic && (
        <Template2Rustic
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isJawa && (
        <Template3Jawa
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isIslami && (
        <Template4Islami
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isLuxury && (
        <Template5Luxury
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isSunda && (
        <TemplateSundaSiger
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isMinang && (
        <TemplateMinangBaralek
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {isBatak && (
        <TemplateBatakToba
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}
    </div>
  );
};

export default PublicInvitationPage;
