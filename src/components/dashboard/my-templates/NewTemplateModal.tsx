import React from 'react';
import { THEME_PRESETS } from './types';

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: string) => void;
}

export const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h4 className="font-serif font-bold text-lg text-stone-900">
              Pilih Konsep Undangan Baru
            </h4>
            <p className="text-xs text-stone-500">
              Pilih gaya visual awal untuk proyek undangan baru Anda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {THEME_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectTheme(preset.id);
                onClose();
              }}
              className="p-3 rounded-2xl border border-stone-200 hover:border-stone-900/40 hover:bg-stone-50 flex items-center justify-between gap-4 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={preset.thumbnail}
                  alt={preset.name}
                  className="w-14 h-12 object-cover rounded-xl shrink-0"
                />
                <div>
                  <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-800">
                    {preset.name}
                  </h5>
                  <span className="text-[10px] text-stone-500 block">
                    {preset.category} &bull; {preset.description}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-stone-300 group-hover:text-stone-900 text-[18px]">
                arrow_forward
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
