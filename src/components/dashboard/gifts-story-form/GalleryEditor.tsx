import React, { useRef, useState } from 'react';
import { convertImageToWebP } from '../../../utils/imageOptimizer';
import { registerStagedBlob, unregisterStagedBlob } from '../../../lib/supabase/storageService';

interface GalleryEditorProps {
  gallery: string[];
  templateSlug?: string;
  userId?: string | null;
  userEmail?: string | null;
  userTemplateId?: string | null;
  onGalleryChange?: (gallery: string[]) => void;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({
  gallery = [],
  onGalleryChange,
}) => {
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const safeGallery = Array.isArray(gallery) ? gallery : [];

  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [statusText, setStatusText] = useState<string>('Mengonversi ke WebP...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State Pelacak gambar rusak / 404
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());

  // 1. Tambah Foto Galeri Baru (Pure Staging: WebP di memori lokal, 0 byte upload ke Supabase Storage sekarang!)
  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onGalleryChange) return;

    if (safeGallery.length >= 12) {
      setErrorMessage('Maksimal galeri foto adalah 12 foto.');
      return;
    }

    setErrorMessage(null);
    setIsOptimizingImage(true);
    setStatusText('Mengompres ke WebP...');

    try {
      // 1. Kompres gambar ke format .webp biner ringan
      const optimized = await convertImageToWebP(file, 0.82, 1920);

      // 2. Pure Staging: Buat local blob URL (Tanpa menyentuh Supabase Storage!)
      const blobUrl = URL.createObjectURL(optimized.file);
      registerStagedBlob(blobUrl, optimized.file);

      // 3. Masukkan URL lokal ke galeri draf
      const newGallery = [...safeGallery, blobUrl];
      onGalleryChange(newGallery);
    } catch (err: any) {
      console.error('[GalleryEditor] Process error:', err);
      setErrorMessage(err.message || 'Gagal memproses gambar.');
    } finally {
      setIsOptimizingImage(false);
      setStatusText('Mengonversi ke WebP...');
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    }
  };

  // 2. Hapus 1 Foto Instan di UI (Staging mode: tanpa pop-up dan storage aman untuk Revert)
  const handleRemoveSingle = (index: number) => {
    if (!onGalleryChange) return;
    const targetUrl = safeGallery[index];
    if (targetUrl && targetUrl.startsWith('blob:')) {
      unregisterStagedBlob(targetUrl);
    }
    const newGallery = safeGallery.filter((_, i) => i !== index);
    onGalleryChange(newGallery);
  };

  // 3. Bersihkan Seluruh Galeri Instan di UI (Staging mode: dapat dibatalkan lewat tombol [Batalkan])
  const handleClearAll = () => {
    if (!onGalleryChange) return;
    safeGallery.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        unregisterStagedBlob(url);
      }
    });
    onGalleryChange([]);
  };

  const handleImageError = (url: string) => {
    setBrokenUrls((prev) => new Set(prev).add(url));
  };

  return (
    <div className="space-y-4">
      {/* Header Galeri */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              4
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Galeri Foto Prewedding
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Maksimal 12 foto. Batas ukuran maks. 30MB per foto (otomatis dikonversi ke format <strong>.webp</strong> ringan).
          </p>
        </div>

        <input
          type="file"
          ref={galleryFileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAddGalleryImage}
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tombol Bersihkan Seluruh Galeri */}
          {safeGallery.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isOptimizingImage}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 hover:text-red-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
              title="Kosongkan seluruh foto di galeri ini"
            >
              <span className="material-symbols-outlined text-[16px]">mop</span>
              <span>Bersihkan Galeri</span>
            </button>
          )}

          {/* Tombol Tambah Foto */}
          <button
            type="button"
            onClick={() => galleryFileInputRef.current?.click()}
            disabled={safeGallery.length >= 12 || isOptimizingImage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isOptimizingImage ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{statusText}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                <span>Tambah Foto ({safeGallery.length}/12)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-600">error</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Foto Galeri */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-1">
        {safeGallery.map((imgUrl, idx) => (
          <div
            key={idx}
            className="relative group aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs"
          >
            {brokenUrls.has(imgUrl) ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-stone-100 text-stone-400">
                <span className="material-symbols-outlined text-2xl text-amber-500 mb-1">
                  broken_image
                </span>
                <span className="text-[10px] text-stone-600 font-medium">
                  File tidak ada di server
                </span>
                <span className="text-[9px] text-stone-400 mt-0.5">
                  Klik hapus untuk membersihkan
                </span>
              </div>
            ) : (
              <img
                src={imgUrl}
                alt={`Galeri ${idx + 1}`}
                onError={() => handleImageError(imgUrl)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* Overlay Hover Icon Sampah Hapus Instan */}
            <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleRemoveSingle(idx)}
                className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Hapus foto dari galeri (bisa dibatalkan dengan tombol Batalkan)"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>

            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/70 text-white text-[10px] font-semibold backdrop-blur-xs">
              #{idx + 1}
            </span>
            <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold tracking-wider">
              WEBP
            </span>
          </div>
        ))}

        {safeGallery.length < 12 && (
          <div
            onClick={() => !isOptimizingImage && galleryFileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-stone-50/50 hover:bg-stone-100/60 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-stone-200 group-hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors mb-2">
              <span className="material-symbols-outlined text-[20px]">
                {isOptimizingImage ? 'hourglass_top' : 'add'}
              </span>
            </div>
            <p className="text-xs font-bold text-stone-700">
              {isOptimizingImage ? 'Memproses...' : 'Unggah Foto'}
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">JPG / PNG / WEBP (Maks. 30MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

