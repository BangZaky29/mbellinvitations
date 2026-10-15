/**
 * Utilitas optimasi gambar di sisi klien (browser).
 * Mengonversi format gambar (JPG/PNG/HEIC dll) menjadi .webp dengan kompresi cerdas
 * untuk mempercepat pemuatan halaman website undangan digital.
 */

export interface OptimizedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number; // Persentase penghematan ukuran
  width: number;
  height: number;
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes

/**
 * Validasi dan konversi berkas gambar ke format .webp
 * @param file - File gambar asli dari input element
 * @param quality - Kualitas kompresi WebP (0.1 - 1.0, default 0.82)
 * @param maxDimension - Batas resolusi sisi terpanjang (default 1920px)
 */
export async function convertImageToWebP(
  file: File,
  quality = 0.82,
  maxDimension = 1920
): Promise<OptimizedImageResult> {
  // 1. Validasi tipe berkas
  if (!file.type.startsWith('image/')) {
    throw new Error('Berkas yang dipilih bukan merupakan format gambar yang valid.');
  }

  // 2. Validasi batas maksimal 10MB
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Ukuran file (${sizeInMB}MB) melebihi batas maksimal 10MB. Silakan pilih foto dengan ukuran lebih kecil.`
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas gambar dari perangkat.'));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Format gambar tidak didukung atau berkas rusak.'));
      };

      img.onload = () => {
        try {
          // Hitung dimensi proporsional jika melebihi maxDimension
          let targetWidth = img.width;
          let targetHeight = img.height;

          if (targetWidth > maxDimension || targetHeight > maxDimension) {
            if (targetWidth > targetHeight) {
              targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
              targetWidth = maxDimension;
            } else {
              targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
              targetHeight = maxDimension;
            }
          }

          // Buat elemen canvas untuk pemrosesan WebP
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context tidak tersedia pada peramban ini.');
          }

          // Gambar dengan antialiasing berkualitas tinggi
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Konversi ke format image/webp
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // Fallback jika browser tidak mendukung toBlob webp
                const fallbackDataUrl = canvas.toDataURL('image/webp', quality);
                resolve({
                  file: file,
                  dataUrl: fallbackDataUrl,
                  originalSize: file.size,
                  optimizedSize: file.size,
                  compressionRatio: 0,
                  width: targetWidth,
                  height: targetHeight,
                });
                return;
              }

              const webpFileName = `${file.name.replace(/\.[^/.]+$/, '')}.webp`;
              const optimizedFile = new File([blob], webpFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });

              const dataUrl = canvas.toDataURL('image/webp', quality);
              const compressionRatio = Math.max(
                0,
                Math.round(((file.size - blob.size) / file.size) * 100)
              );

              resolve({
                file: optimizedFile,
                dataUrl,
                originalSize: file.size,
                optimizedSize: blob.size,
                compressionRatio,
                width: targetWidth,
                height: targetHeight,
              });
            },
            'image/webp',
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes ke string ukuran ramah pengguna (cth: "1.2 MB", "450 KB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
