import React, { useRef, useState } from 'react';
import { convertImageToWebP } from '../../../utils/imageOptimizer';
import { registerStagedBlob, unregisterStagedBlob } from '../../../lib/supabase/storageService';

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
  onCoverChange,
}) => {
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Mengompres Foto...');
  const [isBroken, setIsBroken] = useState(false);

  // 1. Upload & Ganti Foto Sampul Baru (Pure Staging: WebP di memori lokal, 0 byte upload ke Supabase Storage sekarang!)
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatusText('Mengompres Foto...');
      // 1. Kompres dan konversi foto menjadi WebP resolusi tinggi (~80-120KB)
      const optimized = await convertImageToWebP(file, 0.82, 1280);

      // 2. Pure Staging: Buat local blob URL (Tanpa menyentuh Supabase Storage!)
      const blobUrl = URL.createObjectURL(optimized.file);
      registerStagedBlob(blobUrl, optimized.file);

      // 3. Update URL lokal ke state form draf (staging)
      setIsBroken(false);
      onCoverChange(blobUrl);
    } catch (err: any) {
      console.error('[CoverImageUploader] Process error:', err);
      alert(err.message || 'Gagal memproses foto sampul.');
    } finally {
      setIsProcessing(false);
      setStatusText('Mengompres Foto...');
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = '';
      }
    }
  };

  // 2. Hapus Foto Sampul Instan di UI (Staging mode: tanpa pop-up dan dapat dibatalkan lewat tombol [Batalkan])
  const handleRemoveCover = () => {
    setIsBroken(false);
    if (coverImage && coverImage.startsWith('blob:')) {
      unregisterStagedBlob(coverImage);
    }
    onCoverChange('');
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
        {/* Kotak Preview Cover */}
        <div
          onClick={() => !coverImage && coverFileInputRef.current?.click()}
          className="relative group cursor-pointer w-24 h-32 rounded-2xl bg-stone-200 overflow-hidden flex items-center justify-center border-2 border-stone-300 shrink-0 shadow-xs"
        >
          {coverImage ? (
            isBroken ? (
              <div className="flex flex-col items-center justify-center text-center p-2 text-stone-400">
                <span className="material-symbols-outlined text-amber-500 text-[28px]">broken_image</span>
                <span className="text-[9px] mt-1 text-stone-500">File tidak ada</span>
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

          {/* Hover Overlay Aksi Ganti & Hapus Instan */}
          <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                coverFileInputRef.current?.click();
              }}
              disabled={isProcessing}
              className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Ganti Foto Sampul"
            >
              <span className="material-symbols-outlined text-[19px]">photo_camera</span>
            </button>
            {coverImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCover();
                }}
                disabled={isProcessing}
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Hapus Foto Sampul (bisa dibatalkan dengan tombol Batalkan)"
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
              disabled={isProcessing}
              onClick={() => coverFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-60 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span className={`material-symbols-outlined text-sm ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'progress_activity' : 'upload'}
              </span>
              <span>{isProcessing ? statusText : coverImage ? 'Ganti Foto Sampul' : 'Unggah Foto Sampul'}</span>
            </button>

            {coverImage && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRemoveCover}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50/60 hover:bg-red-100 hover:text-red-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
                title="Hapus foto sampul ini"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Hapus Cover</span>
              </button>
            )}

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                setIsBroken(false);
                onCoverChange(
                  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                );
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-medium hover:bg-stone-200/60 transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
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
    </div>
  );
};
