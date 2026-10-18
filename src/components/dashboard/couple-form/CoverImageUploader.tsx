import React, { useRef, useState } from 'react';
import { convertImageToWebP } from '../../../utils/imageOptimizer';

interface CoverImageUploaderProps {
  coverImage: string;
  onCoverChange: (url: string) => void;
}

export const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  coverImage,
  onCoverChange,
}) => {
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      // Kompres dan konversi foto menjadi WebP resolusi tinggi (~80-120KB)
      // Format Data URL tersimpan permanen di Supabase dan dapat dibuka di semua perangkat (Desktop, HP Android/iOS, & WhatsApp)
      const optimized = await convertImageToWebP(file, 0.82, 1280);
      onCoverChange(optimized.dataUrl);
    } catch (err: any) {
      console.warn('WebP compression notice, falling back to FileReader:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCoverChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = '';
      }
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
        <div
          onClick={() => coverFileInputRef.current?.click()}
          className="relative group cursor-pointer w-full sm:w-48 h-32 rounded-xl bg-stone-200 overflow-hidden flex items-center justify-center border border-stone-300/80 shrink-0 shadow-xs"
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt="Foto Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="material-symbols-outlined text-stone-400 text-[36px]">image</span>
          )}
          <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-[26px]">photo_camera</span>
          </div>
        </div>

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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-60 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-sm ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'progress_activity' : 'upload'}
              </span>
              <span>{isProcessing ? 'Mengompres Foto...' : 'Unggah Foto Sampul'}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onCoverChange(
                  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                )
              }
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-medium hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Gunakan Preset Foto
            </button>
          </div>
          <p className="text-xs text-stone-500">
            Rekomendasi rasio portrait 4:5 atau 16:9, resolusi tinggi (format JPG/PNG maks. 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};
