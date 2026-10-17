import React, { useState } from 'react';
import { parseBulkText } from './helpers';

interface BulkPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (parsed: { name: string; phoneNumber?: string }[], category: string) => Promise<void>;
}

export const BulkPasteModal: React.FC<BulkPasteModalProps> = ({
  isOpen,
  onClose,
  onProcess,
}) => {
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Reguler');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  if (!isOpen) return null;

  const detectedGuests = parseBulkText(bulkInputText);

  const handleProcess = async () => {
    if (detectedGuests.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await onProcess(detectedGuests, bulkCategory);
      setBulkInputText('');
      onClose();
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-start justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </span>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                ⚡ Tambah Banyak Tamu Sekaligus (Copy-Paste)
              </h3>
              <p className="text-xs text-stone-500">
                Tempelkan puluhan nama dari WhatsApp, catatan, atau Excel (1 baris = 1 tamu).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Kategori Pilihan */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Kategori Tamu:</span>
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold focus:outline-none"
          >
            <option value="Reguler">Reguler</option>
            <option value="VIP">VIP</option>
            <option value="Keluarga">Keluarga</option>
            <option value="Sahabat">Sahabat</option>
            <option value="Teman Kantor">Teman Kantor</option>
            <option value="Teman Kampus">Teman Kampus</option>
          </select>
        </div>

        {/* Smart Format Guide */}
        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            Format Cerdas yang Didukung per Baris:
          </p>
          <ul className="list-disc list-inside text-stone-600 space-y-0.5">
            <li><code>Budi Santoso &amp; Partner</code> (Otomatis disimpan sebagai nama)</li>
            <li><code>Rizky Pratama - 081299887766</code> (Otomatis dipisah nama &amp; nomor telepon)</li>
            <li><code>Dinda Kirana, 085712345678</code> (Otomatis konversi ke format 628)</li>
          </ul>
        </div>

        {/* Textarea Input */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-stone-600">
            <span>Tempel Daftar Nama di Sini:</span>
            <span className="text-emerald-700 font-bold">
              {detectedGuests.length} Tamu Terdeteksi
            </span>
          </div>
          <textarea
            rows={9}
            value={bulkInputText}
            onChange={(e) => setBulkInputText(e.target.value)}
            placeholder={"Budi Santoso & Partner\nRizky Pratama - 081299887766\nDinda Kirana, 085712345678\nKeluarga Besar Bpk. H. Sulaiman\nDr. Hendra Kusuma & Istri"}
            className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isBulkProcessing || detectedGuests.length === 0}
            onClick={handleProcess}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>
              {isBulkProcessing
                ? 'Memproses...'
                : `Proses & Buat ${detectedGuests.length} Link Unik`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
