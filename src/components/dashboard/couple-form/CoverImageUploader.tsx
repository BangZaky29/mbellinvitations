import React, { useRef, useState } from 'react';
import { convertImageToWebP } from '../../../utils/imageOptimizer';
import { supabase } from '../../../lib/supabase/client';
import {
  uploadInvitationImage,
  deleteImagePermanently,
  cleanAllLocalImageDraftCaches,
} from '../../../lib/supabase/storageService';
import { ConfirmDeleteImageModal } from '../common/ConfirmDeleteImageModal';

interface CoverImageUploaderProps {
  coverImage: string;
  templateSlug?: string;
  userId?: string | null;
  userEmail?: string | null;
  userTemplateId?: string | null;
  onCoverChange: (url: string) => void;
}

export const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  coverImage,
  templateSlug = 'template_1',
  userId: propUserId,
  userEmail: propUserEmail,
  userTemplateId,
  onCoverChange,
}) => {
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Mengompres Foto...');
  const [isBroken, setIsBroken] = useState(false);

  // State Modal Konfirmasi Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Upload & Ganti Foto Sampul Baru (Dengan Auto-Cleanup Foto Lama)
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldCoverUrl = coverImage;

    try {
      setIsProcessing(true);
      setStatusText('Mengompres Foto...');
      // 1. Kompres dan konversi foto menjadi WebP resolusi tinggi (~80-120KB)
      const optimized = await convertImageToWebP(file, 0.82, 1280);

      // 2. Ambil user session
      setStatusText('Mengunggah ke Storage...');
      let effectiveUserId = propUserId;
      let effectiveUserEmail = propUserEmail;

      if (!effectiveUserId) {
        const { data: authData } = await supabase.auth.getUser();
        effectiveUserId = authData?.user?.id || 'guest_user';
        effectiveUserEmail = authData?.user?.email || null;
      }

      // 3. Upload ke bucket invitations di folder DATA/{email}/{slug}/image_lainnya/
      const uploadRes = await uploadInvitationImage({
        file: optimized.file,
        userId: effectiveUserId,
        userEmail: effectiveUserEmail,
        templateSlug: templateSlug || 'template_1',
        category: 'cover',
        userTemplateId: userTemplateId || null,
      });

      if (!uploadRes.success || !uploadRes.publicUrl) {
        throw new Error(uploadRes.error || 'Gagal mengunggah foto cover ke storage.');
      }

      // 4. Auto-Cleanup: Hapus berkas foto cover lama dari Storage agar tidak menumpuk
      if (oldCoverUrl && oldCoverUrl !== uploadRes.publicUrl) {
        deleteImagePermanently(oldCoverUrl).catch((err) =>
          console.warn('[CoverImageUploader] Auto-cleanup old cover warning:', err)
        );
      }

      // 5. Simpan URL publik Supabase (HTTPS) & bersihkan cache browser
      setIsBroken(false);
      onCoverChange(uploadRes.publicUrl);
      cleanAllLocalImageDraftCaches(templateSlug);
    } catch (err: any) {
      console.error('[CoverImageUploader] Upload error:', err);
      alert(err.message || 'Gagal memproses foto sampul.');
    } finally {
      setIsProcessing(false);
      setStatusText('Mengompres Foto...');
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = '';
      }
    }
  };

  const syncCoverToDatabase = async (newUrl: string) => {
    try {
      if (userTemplateId) {
        const { data: ut } = await supabase
          .from('user_templates')
          .select('content')
          .eq('id', userTemplateId)
          .maybeSingle();

        if (ut?.content) {
          await supabase
            .from('user_templates')
            .update({
              content: { ...ut.content, cover_image: newUrl },
              thumbnail_url: newUrl || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userTemplateId);
        }
      }
      if (templateSlug) {
        const { data: inv } = await supabase
          .from('invitations')
          .select('content')
          .eq('slug', templateSlug)
          .maybeSingle();

        if (inv?.content) {
          await supabase
            .from('invitations')
            .update({
              content: { ...inv.content, cover_image: newUrl },
              updated_at: new Date().toISOString(),
            })
            .eq('slug', templateSlug);
        }
      }
      try {
        const draftStr = localStorage.getItem('mbell_pending_draft_formData');
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          draft.cover_image = newUrl;
          localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(draft));
        }
      } catch (e) {}
    } catch (e) {
      console.warn('[CoverImageUploader] Direct DB sync warning:', e);
    }
  };

  // 2. Eksekusi Hapus Permanen Foto Sampul ke Akar
  const handleConfirmDeleteCover = async () => {
    try {
      setIsDeleting(true);
      if (coverImage) {
        await deleteImagePermanently(coverImage);
      }
      onCoverChange('');
      setIsBroken(false);
      cleanAllLocalImageDraftCaches(templateSlug);
      await syncCoverToDatabase('');
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('[CoverImageUploader] Gagal menghapus cover:', err);
      alert(err.message || 'Gagal menghapus foto sampul.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/90 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-stone-800 text-[22px]">wallpaper</span>
          <h3 className="text-sm font-bold text-stone-900">
            Foto Sampul Utama (Cover Hero)
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-xs font-medium">
          Wajib Ada
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Thumbnail Preview dengan Hover Overlay Hapus & Ganti */}
        <div
          onClick={() => !coverImage && coverFileInputRef.current?.click()}
          className="relative group cursor-pointer w-full sm:w-48 h-32 rounded-xl bg-stone-200 overflow-hidden flex items-center justify-center border border-stone-300/80 shrink-0 shadow-xs"
        >
          {coverImage ? (
            isBroken ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-100 text-stone-400">
                <span className="material-symbols-outlined text-2xl text-amber-500 mb-0.5">
                  broken_image
                </span>
                <span className="text-[10px] text-stone-600 font-medium">
                  File tidak ada di server
                </span>
              </div>
            ) : (
              <img
                src={coverImage}
                alt="Foto Cover"
                onError={() => setIsBroken(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-400 gap-1">
              <span className="material-symbols-outlined text-[32px]">add_photo_alternate</span>
              <span className="text-[10px] font-medium">Klik untuk unggah</span>
            </div>
          )}

          {/* Hover Overlay Aksi Ganti & Hapus */}
          <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                coverFileInputRef.current?.click();
              }}
              disabled={isProcessing || isDeleting}
              className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
              title="Ganti Foto Sampul"
            >
              <span className="material-symbols-outlined text-[19px]">photo_camera</span>
            </button>
            {coverImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                disabled={isProcessing || isDeleting}
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                title="Hapus Foto Sampul Permanen"
              >
                <span className="material-symbols-outlined text-[19px]">delete</span>
              </button>
            )}
          </div>

          {coverImage && (
            <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold tracking-wider shadow-xs">
              WEBP
            </span>
          )}
        </div>

        {/* Tombol-tombol Aksi Samping */}
        <div className="space-y-2.5 flex-1">
          <input
            type="file"
            ref={coverFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleLocalImageUpload}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isProcessing || isDeleting}
              onClick={() => coverFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-60 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-sm ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'progress_activity' : 'upload'}
              </span>
              <span>{isProcessing ? statusText : coverImage ? 'Ganti Foto Sampul' : 'Unggah Foto Sampul'}</span>
            </button>

            {coverImage && (
              <button
                type="button"
                disabled={isProcessing || isDeleting}
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50/60 hover:bg-red-100 hover:text-red-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                title="Hapus foto sampul ini"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Hapus Cover</span>
              </button>
            )}

            <button
              type="button"
              disabled={isProcessing || isDeleting}
              onClick={() => {
                setIsBroken(false);
                onCoverChange(
                  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                );
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-medium hover:bg-stone-200/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Gunakan Preset Foto
            </button>
          </div>
          <p className="text-xs text-stone-500">
            Rekomendasi rasio portrait 4:5 atau 16:9, resolusi tinggi (format JPG/PNG maks. 30MB, otomatis dikonversi ke format <strong>.webp</strong> biner ringan).
          </p>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Foto Sampul */}
      <ConfirmDeleteImageModal
        isOpen={isDeleteModalOpen}
        title="Hapus Foto Sampul Utama?"
        description="Foto sampul ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        imageUrl={coverImage}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteCover}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
