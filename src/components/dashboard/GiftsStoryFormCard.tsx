import React, { useRef, useState } from 'react';
import type { BankAccount, LoveStoryMilestone } from '../../types/invitation';
import { convertImageToWebP } from '../../utils/imageOptimizer';

interface GiftsStoryFormCardProps {
  bankAccounts?: BankAccount[];
  loveStory?: LoveStoryMilestone[];
  gallery?: string[];
  musicUrl?: string;
  activeTabMode?: 'all' | 'story_gallery' | 'gifts';
  onBankAccountsChange: (accounts: BankAccount[]) => void;
  onLoveStoryChange: (story: LoveStoryMilestone[]) => void;
  onGalleryChange?: (gallery: string[]) => void;
  onMusicUrlChange: (url: string) => void;
  onSaveMusic?: () => void;
}

export const GiftsStoryFormCard: React.FC<GiftsStoryFormCardProps> = ({
  bankAccounts = [],
  loveStory = [],
  gallery = [],
  musicUrl,
  activeTabMode = 'all',
  onBankAccountsChange,
  onLoveStoryChange,
  onGalleryChange,
  onMusicUrlChange,
  onSaveMusic,
}) => {
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const safeBankAccounts = Array.isArray(bankAccounts) ? bankAccounts : [];
  const safeLoveStory = Array.isArray(loveStory) ? loveStory : [];
  const safeGallery = Array.isArray(gallery) ? gallery : [];

  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [musicSavedSuccess, setMusicSavedSuccess] = useState(false);

  const handleSaveMusicAction = (url: string) => {
    onMusicUrlChange(url);
    if (onSaveMusic) {
      onSaveMusic();
    }
    setMusicSavedSuccess(true);
    setTimeout(() => setMusicSavedSuccess(false), 3500);
  };

  // Bank handlers
  const addBankAccount = () => {
    const newAccount: BankAccount = {
      bank_name: 'BCA',
      account_number: '',
      account_number_raw: '',
      account_holder: '',
    };
    onBankAccountsChange([...safeBankAccounts, newAccount]);
  };

  const removeBankAccount = (index: number) => {
    onBankAccountsChange(safeBankAccounts.filter((_, i) => i !== index));
  };

  const updateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    const updated = [...safeBankAccounts];
    const current = { ...updated[index], [field]: value };
    if (field === 'account_number') {
      current.account_number_raw = value.replace(/\s+/g, '');
    }
    updated[index] = current;
    onBankAccountsChange(updated);
  };

  // Love Story handlers
  const addMilestone = () => {
    const newMilestone: LoveStoryMilestone = {
      year: new Date().getFullYear().toString(),
      title: 'Babak Baru Cerita Kita',
      subtitle: 'Babak Baru Cerita Kita',
      description: 'Tuliskan kisah manis perjalanan cinta Anda di sini...',
      story: 'Tuliskan kisah manis perjalanan cinta Anda di sini...',
    };
    onLoveStoryChange([...safeLoveStory, newMilestone]);
  };

  const removeMilestone = (index: number) => {
    onLoveStoryChange(safeLoveStory.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof LoveStoryMilestone, value: string) => {
    const updated = [...safeLoveStory];
    const current = { ...updated[index], [field]: value };
    if (field === 'title') {
      current.subtitle = value;
    } else if (field === 'description') {
      current.story = value;
    } else if (field === 'story') {
      current.description = value;
    }
    updated[index] = current;
    onLoveStoryChange(updated);
  };

  // Gallery handlers dengan kompresi WebP otomatis & batasan 10MB
  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onGalleryChange) return;

    if (safeGallery.length >= 12) {
      setErrorMessage('Maksimal galeri foto adalah 12 foto.');
      return;
    }

    setErrorMessage(null);
    setIsOptimizingImage(true);

    try {
      const optimized = await convertImageToWebP(file, 0.82, 1920);
      onGalleryChange([...safeGallery, optimized.dataUrl]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memproses dan mengonversi gambar.');
    } finally {
      setIsOptimizingImage(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    if (onGalleryChange) {
      onGalleryChange(safeGallery.filter((_, i) => i !== index));
    }
  };

  const showGifts = activeTabMode === 'all' || activeTabMode === 'gifts';
  const showStoryGallery = activeTabMode === 'all' || activeTabMode === 'story_gallery';

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-7">
      {/* ============================================================ */}
      {/* BAGIAN STEP 4: GALERI & KISAH CINTA                          */}
      {/* ============================================================ */}
      {showStoryGallery && (
        <>
          {/* GALERI PREWEDDING */}
          <div className="space-y-4">
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
                  Maksimal 12 foto. Batas ukuran maks. 10MB per foto (otomatis dikonversi ke format <strong>.webp</strong> ringan).
                </p>
              </div>

              <input
                type="file"
                ref={galleryFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleAddGalleryImage}
              />
              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                disabled={safeGallery.length >= 12 || isOptimizingImage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto cursor-pointer"
              >
                {isOptimizingImage ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengonversi ke WebP...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                    <span>Tambah Foto ({safeGallery.length}/12)</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message Alert jika ukuran melebihi 10MB */}
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
                  <img
                    src={imgUrl}
                    alt={`Galeri ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                      title="Hapus foto"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
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
                  <p className="text-[10px] text-stone-400 mt-0.5">JPG / PNG / WEBP (Maks. 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* KISAH CINTA / LOVE STORY */}
          <div className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-stone-800 text-[22px]">favorite</span>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Kisah Cinta (Love Story)
                  </h3>
                </div>
                <p className="text-sm text-stone-500">
                  Bagikan kenangan indah perjalanan cinta Anda dari awal bertemu hingga pelaminan.
                </p>
              </div>

              <button
                type="button"
                onClick={addMilestone}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200/80 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Tambah Momen</span>
              </button>
            </div>

            {/* Milestones List */}
            <div className="space-y-3.5">
              {safeLoveStory.map((milestone, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-3.5 relative group hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span>Momen #{index + 1}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Momen Ini"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-xs font-semibold text-stone-700">
                        Tahun / Periode
                      </label>
                      <input
                        type="text"
                        value={milestone.year}
                        onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                        placeholder="2021"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-3">
                      <label className="text-xs font-semibold text-stone-700">
                        Judul Momen
                      </label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="Pertama Kali Bertemu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Cerita Singkat
                    </label>
                    <textarea
                      rows={2}
                      value={milestone.story || milestone.description}
                      onChange={(e) => updateMilestone(index, 'story', e.target.value)}
                      placeholder="Ceritakan kenangan manis pada momen ini..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MUSIK LATAR UNDANGAN (KHUSUS LINK YOUTUBE) */}
          <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/70">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[22px]">smart_display</span>
                <h3 className="text-sm font-bold text-stone-900">
                  Musik Latar Undangan (YouTube Backsound)
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <span className="material-symbols-outlined text-xs">play_circle</span>
                <span>Khusus Link YouTube</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs text-stone-700 font-medium flex items-center gap-1.5">
                <span className="text-red-600 font-bold">YouTube URL:</span>
                <span>Masukkan tautan video musik atau lagu pernikahan dari YouTube</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
                    link
                  </span>
                  <input
                    type="url"
                    value={musicUrl || ''}
                    onChange={(e) => onMusicUrlChange(e.target.value)}
                    placeholder="cth: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSaveMusicAction('https://www.youtube.com/watch?v=2Vv-BfVoq4g')
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                  title="Gunakan lagu romantis pernikahan pilihan dari YouTube"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-500">auto_awesome</span>
                  <span>Preset Romantis</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveMusicAction(musicUrl || '')}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs hover:shadow-sm transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                  <span>Simpan Musik</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                Mendukung format link YouTube biasa, YouTube Music, dan YouTube Shorts. Musik akan otomatis diputar saat cover undangan dibuka oleh tamu.
              </p>

              {musicSavedSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in duration-300">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span>Tautan musik YouTube berhasil disimpan &amp; disinkronkan ke undangan! Musik akan berbunyi otomatis saat cover dibuka.</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* BAGIAN STEP 5: AMPLOP DIGITAL & REKENING HADIAH              */}
      {/* ============================================================ */}
      {showGifts && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
                  5
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Amplop Digital &amp; Hadiah
                </h2>
              </div>
              <p className="text-sm text-stone-500">
                Tamu undangan dapat mengirimkan hadiah tanda kasih langsung via rekening bank atau dompet digital.
              </p>
            </div>

            <button
              type="button"
              onClick={addBankAccount}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_card</span>
              <span>Tambah Rekening Baru</span>
            </button>
          </div>

          {/* Bank Accounts List */}
          <div className="space-y-4">
            {safeBankAccounts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-stone-500 space-y-3">
                <span className="material-symbols-outlined text-stone-400 text-[36px]">credit_card_off</span>
                <p className="text-sm">Belum ada rekening atau dompet digital yang ditambahkan.</p>
                <button
                  type="button"
                  onClick={addBankAccount}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  + Tambah Rekening Pertama
                </button>
              </div>
            ) : (
              safeBankAccounts.map((account, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 relative group hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-stone-800 text-[18px]">credit_card</span>
                      Rekening #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBankAccount(index)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Rekening Ini"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Bank / e-Wallet
                      </label>
                      <select
                        value={account.bank_name}
                        onChange={(e) => updateBankAccount(index, 'bank_name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      >
                        <option value="BCA">Bank BCA</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BRI">Bank BRI</option>
                        <option value="BNI">Bank BNI</option>
                        <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                        <option value="Jago">Bank Jago</option>
                        <option value="CIMB">CIMB Niaga</option>
                        <option value="Permata">Bank Permata</option>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                        <option value="Dana">DANA</option>
                        <option value="ShopeePay">ShopeePay</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Nomor Rekening / No. HP
                      </label>
                      <input
                        type="text"
                        value={account.account_number}
                        onChange={(e) => updateBankAccount(index, 'account_number', e.target.value)}
                        placeholder="cth: 5310928172"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Atas Nama (Pemilik Rekening)
                      </label>
                      <input
                        type="text"
                        value={account.account_holder}
                        onChange={(e) => updateBankAccount(index, 'account_holder', e.target.value)}
                        placeholder="cth: Raditya Putra W."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};
