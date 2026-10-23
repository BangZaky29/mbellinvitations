import React, { useState } from 'react';
import type { LoveStoryMilestone } from '../../../types/invitation';

interface LoveStoryEditorProps {
  loveStory: LoveStoryMilestone[];
  onLoveStoryChange: (story: LoveStoryMilestone[]) => void;
}

export const LoveStoryEditor: React.FC<LoveStoryEditorProps> = ({
  loveStory = [],
  onLoveStoryChange,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const safeLoveStory = Array.isArray(loveStory) ? loveStory : [];
  const safeActiveIndex = Math.min(Math.max(0, activeStoryIndex), Math.max(0, safeLoveStory.length - 1));

  const addMilestone = () => {
    const newIndex = safeLoveStory.length;
    const newMilestone: LoveStoryMilestone = {
      year: new Date().getFullYear().toString(),
      title: newIndex === 0 ? 'Pertama Kali Bertemu' : newIndex === 1 ? 'Menjalin Kasih' : newIndex === 2 ? 'Momen Lamaran' : 'Babak Baru Cerita Kita',
      subtitle: newIndex === 0 ? 'Pertama Kali Bertemu' : newIndex === 1 ? 'Menjalin Kasih' : newIndex === 2 ? 'Momen Lamaran' : 'Babak Baru Cerita Kita',
      description: 'Tuliskan kisah manis perjalanan cinta Anda di sini...',
      story: 'Tuliskan kisah manis perjalanan cinta Anda di sini...',
    };
    onLoveStoryChange([...safeLoveStory, newMilestone]);
    setActiveStoryIndex(newIndex);
  };

  const removeMilestone = (index: number) => {
    const updated = safeLoveStory.filter((_, i) => i !== index);
    onLoveStoryChange(updated);
    if (safeActiveIndex >= updated.length) {
      setActiveStoryIndex(Math.max(0, updated.length - 1));
    }
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

  return (
    <div className="space-y-4 pt-4 border-t border-stone-200/80">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-stone-800 text-[22px]">favorite</span>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Kisah Cinta (Love Story)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Bagikan kenangan indah perjalanan cinta Anda dari awal bertemu hingga pelaminan.
          </p>
        </div>

        <button
          type="button"
          onClick={addMilestone}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>+ Tambah Momen</span>
        </button>
      </div>

      {safeLoveStory.length === 0 ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-stone-200 text-center space-y-3 bg-stone-50/50">
          <span className="material-symbols-outlined text-4xl text-stone-300">favorite_border</span>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-800">Belum Ada Momen Cinta Ditambahkan</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Abadikan momen berkesan seperti awal jumpa, tanggal jadian, atau momen lamaran di website undangan Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={addMilestone}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-xs hover:bg-stone-800 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Tambah Momen Pertama</span>
          </button>
        </div>
      ) : (
        <>
          {/* TAMPILAN MOBILE: Card Stack Slider (md:hidden) */}
          <div className="md:hidden space-y-3">
            {/* Tab Switcher Horizontal Momen */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {safeLoveStory.map((milestone, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStoryIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    safeActiveIndex === idx
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 text-current text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{milestone.title || `Momen ${idx + 1}`}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 hover:bg-rose-100 shrink-0 cursor-pointer"
                title="Tambah momen baru"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Tambah</span>
              </button>
            </div>

            {/* Efek Visual Card Stack (Tumpukan Kartu Bertingkat) */}
            <div className="relative pb-2">
              {/* Layer Bayangan Tumpukan Belakang 2 */}
              <div
                className="absolute inset-x-3 -bottom-1 h-12 rounded-2xl bg-stone-300/60 border border-stone-300 shadow-2xs pointer-events-none transform scale-[0.96] transition-all"
                aria-hidden="true"
              />
              {/* Layer Bayangan Tumpukan Belakang 1 */}
              <div
                className="absolute inset-x-1.5 bottom-0.5 h-12 rounded-2xl bg-stone-200/90 border border-stone-200 shadow-xs pointer-events-none transform scale-[0.98] transition-all"
                aria-hidden="true"
              />

              {/* Kartu Depan Aktif */}
              <div className="relative z-10 transition-all duration-200">
                {safeLoveStory[safeActiveIndex] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-bold">
                          {safeActiveIndex + 1}
                        </span>
                        <span>Momen #{safeActiveIndex + 1} dari {safeLoveStory.length}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMilestone(safeActiveIndex)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus Momen Ini"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Tahun / Periode</label>
                        <input
                          type="text"
                          value={safeLoveStory[safeActiveIndex].year}
                          onChange={(e) => updateMilestone(safeActiveIndex, 'year', e.target.value)}
                          placeholder="cth: 2021 atau Desember 2022"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Judul Momen</label>
                        <input
                          type="text"
                          value={safeLoveStory[safeActiveIndex].title}
                          onChange={(e) => updateMilestone(safeActiveIndex, 'title', e.target.value)}
                          placeholder="cth: Pertama Kali Bertemu di Kampus"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-stone-700">Cerita Singkat</label>
                          <span className="text-[10px] text-stone-400">Tarik sudut bawah untuk memperbesar</span>
                        </div>
                        <textarea
                          rows={3}
                          value={safeLoveStory[safeActiveIndex].story || safeLoveStory[safeActiveIndex].description}
                          onChange={(e) => updateMilestone(safeActiveIndex, 'story', e.target.value)}
                          placeholder="Ceritakan kenangan manis pada momen ini..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all resize-y min-h-[76px] leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Tombol Cepat Navigasi Kartu */}
                    <div className="pt-2">
                      {safeActiveIndex < safeLoveStory.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setActiveStoryIndex(safeActiveIndex + 1)}
                          className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
                        >
                          <span>Momen Selanjutnya</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={addMilestone}
                          className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-rose-700 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          <span>+ Tambah Momen Baru</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigasi Panah Kiri-Kanan Bawah Mobile */}
            <div className="flex items-center justify-between gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveStoryIndex(Math.max(0, safeActiveIndex - 1))}
                disabled={safeActiveIndex === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  safeActiveIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                    : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Sebelumnya</span>
              </button>

              {/* Dots Indikator */}
              <div className="flex items-center gap-1.5">
                {safeLoveStory.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setActiveStoryIndex(idx)}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      safeActiveIndex === idx ? 'w-5 bg-stone-900' : 'w-2 bg-stone-300'
                    }`}
                    title={`Momen ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveStoryIndex(Math.min(safeLoveStory.length - 1, safeActiveIndex + 1))}
                disabled={safeActiveIndex === safeLoveStory.length - 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  safeActiveIndex === safeLoveStory.length - 1
                    ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                    : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
                }`}
              >
                <span>Berikutnya</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* TAMPILAN DESKTOP: Grid 2 Kolom atau Vertikal Rapi (hidden md:grid) */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            {safeLoveStory.map((milestone, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-3.5 relative group hover:border-stone-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3.5">
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

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-semibold text-stone-700">Tahun</label>
                      <input
                        type="text"
                        value={milestone.year}
                        onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                        placeholder="2021"
                        className="w-full px-3 py-2 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-stone-700">Judul Momen</label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="Pertama Kali Bertemu"
                        className="w-full px-3 py-2 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-700">Cerita Singkat</label>
                      <span className="text-[10px] text-stone-400">Tarik sudut bawah untuk memperbesar</span>
                    </div>
                    <textarea
                      rows={3}
                      value={milestone.story || milestone.description}
                      onChange={(e) => updateMilestone(index, 'story', e.target.value)}
                      placeholder="Ceritakan kenangan manis pada momen ini..."
                      className="w-full px-3 py-2 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-xs shadow-2xs transition-all resize-y min-h-[76px] leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Dashed Card Tambah Momen Baru di Desktop */}
            <div
              onClick={addMilestone}
              className="p-5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-900 hover:bg-stone-50/50 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer min-h-[220px] group"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-colors flex items-center justify-center text-stone-700">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900">Tambah Momen Cinta Baru</h4>
              <p className="text-[11px] text-stone-500 max-w-[200px]">
                Ceritakan babak baru atau kenangan terindah dalam hubungan Anda.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
