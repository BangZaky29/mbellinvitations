import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useInvitationRealtime } from '../hooks/useInvitationRealtime';
import { Template1Modern } from '../components/templates/Template1Modern';
import { Template2Rustic } from '../components/templates/Template2Rustic';
import { Template3Jawa } from '../components/templates/Template3Jawa';
import { Template4Islami } from '../components/templates/Template4Islami';
import { Template5Luxury } from '../components/templates/Template5Luxury';
import { TemplateSundaSiger } from '../components/templates/TemplateSundaSiger';

export const PublicInvitationPage: React.FC = () => {
  const { slug = 'raditya-jessica' } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  const guestParam = searchParams.get('to') || searchParams.get('guest');
  const codeParam = searchParams.get('g') || searchParams.get('code');

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

  const onSubmitWish = async (name: string, message: string) => {
    return await handleSendWish(name, message);
  };

  const onSubmitRsvp = async (name: string, status: string, pax: number) => {
    return await handleSendRsvp(name, status, pax);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
        <div className="w-12 h-12 rounded-full border-3 border-amber-500/30 border-t-amber-400 animate-spin mb-4"></div>
        <p className="font-serif tracking-widest text-sm text-neutral-400 uppercase animate-pulse">
          Memuat Undangan Pernikahan...
        </p>
      </div>
    );
  }

  const isPublished = invitationData.status === 'published';
  const showDemoPill = slug === 'demo' && !isPublished;

  // Resolusi template secara defensif agar tidak salah template jika template_id ambigu
  const activeTheme = invitationData?.theme_id;
  const isSunda = templateId === 'template6' || templateId === 'sunda' || activeTheme === 'sunda';
  const isJawa = !isSunda && (templateId === 'template3' || templateId === 'jawa' || activeTheme === 'jawa');
  const isRustic = !isSunda && !isJawa && (templateId === 'template2' || templateId === 'rustic' || activeTheme === 'rustic');
  const isIslami = !isSunda && !isJawa && !isRustic && (templateId === 'template4' || templateId === 'islami' || activeTheme === 'islami');
  const isLuxury = !isSunda && !isJawa && !isRustic && !isIslami && (templateId === 'template5' || templateId === 'luxury' || activeTheme === 'luxury');
  const isModern = !isSunda && !isJawa && !isRustic && !isIslami && !isLuxury;

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
    </div>
  );
};

export default PublicInvitationPage;
