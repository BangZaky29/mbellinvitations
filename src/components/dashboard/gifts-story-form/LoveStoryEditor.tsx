import React from 'react';
import type { LoveStoryMilestone } from '../../../types/invitation';

interface LoveStoryEditorProps {
  loveStory: LoveStoryMilestone[];
  onLoveStoryChange: (story: LoveStoryMilestone[]) => void;
}

export const LoveStoryEditor: React.FC<LoveStoryEditorProps> = ({
  loveStory = [],
  onLoveStoryChange,
}) => {
  const safeLoveStory = Array.isArray(loveStory) ? loveStory : [];

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

  return (
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
                <label className="text-xs font-semibold text-stone-700">Tahun / Periode</label>
                <input
                  type="text"
                  value={milestone.year}
                  onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                  placeholder="2021"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-semibold text-stone-700">Judul Momen</label>
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
              <label className="text-xs font-semibold text-stone-700">Cerita Singkat</label>
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
  );
};
