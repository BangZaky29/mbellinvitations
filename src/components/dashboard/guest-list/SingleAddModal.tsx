import React, { useState } from 'react';

interface SingleAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; phone: string; category: string; pax: string }) => Promise<void>;
}

export const SingleAddModal: React.FC<SingleAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCategory, setSingleCategory] = useState('Reguler');
  const [singlePax, setSinglePax] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: singleName,
        phone: singlePhone,
        category: singleCategory,
        pax: singlePax,
      });
      setSingleName('');
      setSinglePhone('');
      setSinglePax('1');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-start justify-between pb-2 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-base text-stone-900">Tambah Tamu Baru</h3>
            <p className="text-xs text-stone-500">Masukkan identitas tamu undangan pernikahan.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Nama Tamu / Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Contoh: Bpk. Ir. Bambang Suryono"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Nomor WhatsApp (Opsional)
            </label>
            <input
              type="tel"
              value={singlePhone}
              onChange={(e) => setSinglePhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Kategori</label>
              <select
                value={singleCategory}
                onChange={(e) => setSingleCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
              >
                <option value="Reguler">Reguler</option>
                <option value="VIP">VIP</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Sahabat">Sahabat</option>
                <option value="Teman Kantor">Teman Kantor</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Alokasi Pax</label>
              <input
                type="number"
                min="1"
                max="10"
                value={singlePax}
                onChange={(e) => setSinglePax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Tamu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
