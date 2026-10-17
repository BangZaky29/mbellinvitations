import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useInvitationRealtime } from '../hooks/useInvitationRealtime';
import { Template1Modern } from '../components/templates/Template1Modern';
import { Template2Rustic } from '../components/templates/Template2Rustic';
import { Template3Jawa } from '../components/templates/Template3Jawa';
import { Template4Islami } from '../components/templates/Template4Islami';
import { Template5Luxury } from '../components/templates/Template5Luxury';
import { SleekToast } from '../components/common/SleekToast';

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

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error' | 'copy'>('success');

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

  const showToast = (msg: string, type: 'success' | 'info' | 'error' | 'copy' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const onSubmitWish = async (name: string, message: string) => {
    const res = await handleSendWish(name, message);
    if (res.success) {
      showToast('Ucapan berhasil dikirim', 'success');
    }
  };

  const onSubmitRsvp = async (name: string, status: string, pax: number) => {
    const res = await handleSendRsvp(name, status, pax);
    if (res.success) {
      showToast('Konfirmasi kehadiran terkirim', 'success');
    } else {
      showToast('Gagal menyimpan konfirmasi', 'error');
    }
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

  return (
    <div className="relative w-full min-h-screen">
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

      {/* Sleek Universal Toast Notification */}
      <SleekToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* Render Template Sesuai template_id dari Supabase */}
      {templateId === 'template1' && (
        <Template1Modern
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {templateId === 'template2' && (
        <Template2Rustic
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {templateId === 'template3' && (
        <Template3Jawa
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {templateId === 'template4' && (
        <Template4Islami
          invitationId={slug}
          data={invitationData}
          theme={themeConfig}
          wishes={wishes}
          onSubmitWish={onSubmitWish}
          onSubmitRsvp={onSubmitRsvp}
        />
      )}

      {templateId === 'template5' && (
        <Template5Luxury
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
