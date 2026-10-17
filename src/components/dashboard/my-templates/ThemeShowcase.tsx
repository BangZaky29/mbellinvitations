import React from 'react';
import { THEME_PRESETS } from './types';

interface ThemeShowcaseProps {
  onAddNewTemplate: (themeId: string) => void;
}

export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({ onAddNewTemplate }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
            Pilihan Konsep Desain Tersedia
          </h3>
          <p className="text-xs text-stone-500">
            Pilih salah satu dari 5 preset tema eksklusif untuk memulai desain undangan baru.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {THEME_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onAddNewTemplate(preset.id)}
            className="bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-stone-900/40 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-2.5 relative bg-stone-100">
              <img
                src={preset.thumbnail}
                alt={preset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-[9px] font-semibold text-white">
                {preset.category}
              </span>
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs text-stone-900 group-hover:text-amber-800 line-clamp-1">
                {preset.name}
              </h4>
              <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                {preset.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
