import React, { useRef, useState } from 'react';
import type { CoupleInfo } from '../../../types/invitation';
import { convertImageToWebP } from '../../../utils/imageOptimizer';
import { supabase } from '../../../lib/supabase/client';
import {
  uploadInvitationImage,
  deleteImagePermanently,
  cleanAllLocalImageDraftCaches,
} from '../../../lib/supabase/storageService';
import { ConfirmDeleteImageModal } from '../common/ConfirmDeleteImageModal';

interface PersonFormSectionProps {
  title: string;
  badge: string;
  genderIcon: 'male' | 'female';
  familyTitle: string;
  person: CoupleInfo;
  templateSlug?: string;
  userId?: string | null;
  userEmail?: string | null;
  userTemplateId?: string | null;
  onChange: (updated: CoupleInfo) => void;
  nicknamePlaceholder: string;
  fullnamePlaceholder: string;
  fatherPlaceholder: string;
  motherPlaceholder: string;
  orderPlaceholder: string;
}

export const PersonFormSection: React.FC<PersonFormSectionProps> = ({
  title,
  badge,
  genderIcon,
  familyTitle,
  person,
  templateSlug = 'template_1',
  userId: propUserId,
  userEmail: propUserEmail,
  userTemplateId,
  onChange,
  nicknamePlaceholder,
  fullnamePlaceholder,
  fatherPlaceholder,
  motherPlaceholder,
  orderPlaceholder,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Mengompres Foto...');
  const [isBroken, setIsBroken] = useState(false);

  // State Modal Konfirmasi Hapus Foto Mempelai
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhoto = person.photo || person.photo_url || '';

  // 1. Upload & Ganti Foto Mempelai (Dengan Auto-Cleanup Foto Lama)
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldPhotoUrl = currentPhoto;

    try {
      setIsProcessing(true);
      setStatusText('Mengompres Foto...');
      // 1. Kompres ke format .webp biner
      const optimized = await convertImageToWebP(file, 0.82, 1080);

      // 2. Dapatkan identitas pengguna
      setStatusText('Mengunggah ke Storage...');
      let effectiveUserId = propUserId;
      let effectiveUserEmail = propUserEmail;

      if (!effectiveUserId) {
        const { data: authData } = await supabase.auth.getUser();
        effectiveUserId = authData?.user?.id || 'guest_user';
        effectiveUserEmail = authData?.user?.email || null;
      }

      const category = genderIcon === 'male' ? 'groom' : 'bride';

      // 3. Upload ke bucket invitations di folder DATA/{email}/{slug}/image_lainnya/
      const uploadRes = await uploadInvitationImage({
        file: optimized.file,
        userId: effectiveUserId,
        userEmail: effectiveUserEmail,
        templateSlug: templateSlug || 'template_1',
        category,
        userTemplateId: userTemplateId || null,
      });

      if (!uploadRes.success || !uploadRes.publicUrl) {
        throw new Error(uploadRes.error || 'Gagal mengunggah foto mempelai ke storage.');
      }

      // 4. Auto-Cleanup: Hapus berkas foto lama dari Storage agar tidak menumpuk
      if (oldPhotoUrl && oldPhotoUrl !== uploadRes.publicUrl) {
        deleteImagePermanently(oldPhotoUrl).catch((err) =>
          console.warn(`[PersonFormSection] Auto-cleanup old ${category} photo warning:`, err)
        );
      }

      // 5. Simpan URL publik Supabase (HTTPS) & bersihkan cache browser
      setIsBroken(false);
      onChange({ ...person, photo: uploadRes.publicUrl, photo_url: uploadRes.publicUrl });
      cleanAllLocalImageDraftCaches(templateSlug);
    } catch (err: any) {
      console.error('[PersonFormSection] Upload error:', err);
      alert(err.message || 'Gagal memproses foto mempelai.');
    } finally {
      setIsProcessing(false);
      setStatusText('Mengompres Foto...');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const syncPersonToDatabase = async () => {
    try {
      const field = genderIcon === 'male' ? 'groom' : 'bride';
      const updatedPerson = { ...person, photo: '', photo_url: '' };

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
              content: { ...ut.content, [field]: updatedPerson },
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
              content: { ...inv.content, [field]: updatedPerson },
              updated_at: new Date().toISOString(),
            })
            .eq('slug', templateSlug);
        }
      }
      try {
        const draftStr = localStorage.getItem('mbell_pending_draft_formData');
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          draft[field] = updatedPerson;
          localStorage.setItem('mbell_pending_draft_formData', JSON.stringify(draft));
        }
      } catch (e) {}
    } catch (e) {
      console.warn('[PersonFormSection] Direct DB sync warning:', e);
    }
  };

  // 2. Eksekusi Hapus Permanen Foto Mempelai ke Akar
  const handleConfirmDeletePhoto = async () => {
    try {
      setIsDeleting(true);
      if (currentPhoto) {
        await deleteImagePermanently(currentPhoto);
      }
      setIsBroken(false);
      onChange({ ...person, photo: '', photo_url: '' });
      cleanAllLocalImageDraftCaches(templateSlug);
      await syncPersonToDatabase();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('[PersonFormSection] Gagal menghapus foto:', err);
      alert(err.message || 'Gagal menghapus foto mempelai.');
    } finally {
      setIsDeleting(false);
    }
  };

  const updateParentInfo = (
    childOrder: string | undefined,
    father: string | undefined,
    mother: string | undefined
  ) => {
    return [childOrder, father ? `dari ${father}` : '', mother ? `& ${mother}` : '']
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-stone-800 text-[20px]">{genderIcon}</span>
          <h3 className="text-sm font-bold text-stone-900">{title}</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
          {badge}
        </span>
      </div>

      {/* AVATAR UPLOAD DENGAN HOVER ACTIONS */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleLocalImageUpload}
        />
        <div
          onClick={() => !currentPhoto && fileInputRef.current?.click()}
          className="relative group cursor-pointer w-16 h-16 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center border-2 border-stone-300 shrink-0 shadow-xs"
        >
          {currentPhoto ? (
            isBroken ? (
              <span className="material-symbols-outlined text-amber-500 text-[24px]">broken_image</span>
            ) : (
              <img
                src={currentPhoto}
                alt={person.name}
                onError={() => setIsBroken(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            )
          ) : (
            <span className="material-symbols-outlined text-stone-400 text-[30px]">person</span>
          )}

          {/* Hover Overlay Aksi: Ganti & Hapus */}
          <div className="absolute inset-0 rounded-full bg-stone-950/60 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isProcessing || isDeleting}
              className="w-6 h-6 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
              title="Ganti Foto"
            >
              <span className="material-symbols-outlined text-[14px]">photo_camera</span>
            </button>
            {currentPhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                disabled={isProcessing || isDeleting}
                className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                title="Hapus Foto"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing || isDeleting}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 disabled:opacity-60 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-xs ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'progress_activity' : 'photo_camera'}
              </span>
              <span>{isProcessing ? statusText : currentPhoto ? 'Ganti Foto' : 'Unggah Foto'}</span>
            </button>

            {currentPhoto && (
              <button
                type="button"
                disabled={isProcessing || isDeleting}
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                title="Hapus foto mempelai"
              >
                <span className="material-symbols-outlined text-xs">delete</span>
                <span>Hapus</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Foto wajah close-up jernih (format WebP biner)</p>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Foto Mempelai */}
      <ConfirmDeleteImageModal
        isOpen={isDeleteModalOpen}
        title={`Hapus Foto ${title}?`}
        description="Foto ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        imageUrl={currentPhoto}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeletePhoto}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
      />

      {/* INPUTS MEMPELAI */}
      <div className="space-y-3.5 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <span>Nama Panggilan</span>
            <span className="text-stone-400 font-normal">(tampil di judul)</span>
          </label>
          <input
            type="text"
            value={person.name || ''}
            onChange={(e) => onChange({ ...person, name: e.target.value })}
            placeholder={nicknamePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700">Nama Lengkap &amp; Gelar</label>
          <input
            type="text"
            value={person.full_name || ''}
            onChange={(e) => onChange({ ...person, full_name: e.target.value })}
            placeholder={fullnamePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
          />
        </div>

        {/* Silsilah Orang Tua */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-stone-600">
              family_restroom
            </span>
            {familyTitle}
          </span>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-stone-600">
              Urutan Anak dalam Keluarga
            </label>
            <input
              type="text"
              value={person.child_order || ''}
              onChange={(e) => {
                const child_order = e.target.value;
                const summary = updateParentInfo(
                  child_order,
                  person.parent_father,
                  person.parent_mother
                );
                onChange({ ...person, child_order, parent_info: summary });
              }}
              placeholder={orderPlaceholder}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-600">Nama Ayah</label>
              <input
                type="text"
                value={person.parent_father || ''}
                onChange={(e) => {
                  const parent_father = e.target.value;
                  const summary = updateParentInfo(
                    person.child_order,
                    parent_father,
                    person.parent_mother
                  );
                  onChange({ ...person, parent_father, parent_info: summary });
                }}
                placeholder={fatherPlaceholder}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-600">Nama Ibu</label>
              <input
                type="text"
                value={person.parent_mother || ''}
                onChange={(e) => {
                  const parent_mother = e.target.value;
                  const summary = updateParentInfo(
                    person.child_order,
                    person.parent_father,
                    parent_mother
                  );
                  onChange({ ...person, parent_mother, parent_info: summary });
                }}
                placeholder={motherPlaceholder}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-stone-500">alternate_email</span>
            <span>Username Instagram</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={person.instagram || ''}
              onChange={(e) => onChange({ ...person, instagram: e.target.value })}
              placeholder="@username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
