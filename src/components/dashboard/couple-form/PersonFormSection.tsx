import React, { useRef, useState } from 'react';
import type { CoupleInfo } from '../../../types/invitation';
import { convertImageToWebP } from '../../../utils/imageOptimizer';
import { registerStagedBlob, unregisterStagedBlob } from '../../../lib/supabase/storageService';

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

  const currentPhoto = person.photo || person.photo_url || '';

  // 1. Upload & Ganti Foto Mempelai (Pure Staging: WebP di memori lokal, 0 byte upload ke Supabase Storage sekarang!)
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatusText('Mengompres Foto...');
      // 1. Kompres ke format .webp biner
      const optimized = await convertImageToWebP(file, 0.82, 1080);

      // 2. Pure Staging: Buat local blob URL (Tanpa menyentuh Supabase Storage!)
      const blobUrl = URL.createObjectURL(optimized.file);
      registerStagedBlob(blobUrl, optimized.file);

      // 3. Simpan URL lokal ke state form draf (staging)
      setIsBroken(false);
      onChange({ ...person, photo: blobUrl, photo_url: blobUrl });
    } catch (err: any) {
      console.error('[PersonFormSection] Process error:', err);
      alert(err.message || 'Gagal memproses foto mempelai.');
    } finally {
      setIsProcessing(false);
      setStatusText('Mengompres Foto...');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 2. Hapus Foto Mempelai Instan di UI (Staging mode: tanpa pop-up dan dapat dibatalkan lewat tombol [Batalkan])
  const handleRemovePhoto = () => {
    setIsBroken(false);
    if (currentPhoto && currentPhoto.startsWith('blob:')) {
      unregisterStagedBlob(currentPhoto);
    }
    onChange({ ...person, photo: '', photo_url: '' });
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

          {/* Hover Overlay Aksi: Ganti & Hapus Instan */}
          <div className="absolute inset-0 rounded-full bg-stone-950/60 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isProcessing}
              className="w-6 h-6 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Ganti Foto"
            >
              <span className="material-symbols-outlined text-[14px]">photo_camera</span>
            </button>
            {currentPhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto();
                }}
                disabled={isProcessing}
                className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Hapus Foto (bisa dibatalkan dengan tombol Batalkan)"
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
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 disabled:opacity-60 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span className={`material-symbols-outlined text-xs ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'progress_activity' : 'photo_camera'}
              </span>
              <span>{isProcessing ? statusText : currentPhoto ? 'Ganti Foto' : 'Unggah Foto'}</span>
            </button>

            {currentPhoto && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
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
