import React from 'react';
import { DEFAULT_WA_TEMPLATE } from './constants';

interface WaTemplateEditorModalProps {
  isOpen: boolean;
  waTemplate: string;
  onChangeTemplate: (val: string) => void;
  onSaveTemplate: (val: string) => void;
}

export const WaTemplateEditorModal: React.FC<WaTemplateEditorModalProps> = ({
  isOpen,
  waTemplate,
  onChangeTemplate,
  onSaveTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3.5 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">chat_bubble</span>
          <h4 className="font-bold text-sm text-stone-900">
            Template Pesan Pengantar WhatsApp
          </h4>
        </div>
        <button
          type="button"
          onClick={() => {
            onChangeTemplate(DEFAULT_WA_TEMPLATE);
            onSaveTemplate(DEFAULT_WA_TEMPLATE);
          }}
          className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
        >
          Reset ke Standar
        </button>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed">
        Pesan ini otomatis muncul saat Anda klik tombol <strong>Kirim WA</strong> pada baris tamu.
        Variabel di dalam tanda kurung kurawal akan otomatis digantikan sesuai nama tamu masing-masing:
      </p>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="px-2 py-1 rounded-md bg-stone-100 font-mono text-[11px] text-stone-700">
          {'{nama_tamu}'}
        </span>
        <span className="px-2 py-1 rounded-md bg-stone-100 font-mono text-[11px] text-stone-700">
          {'{nama_mempelai}'}
        </span>
        <span className="px-2 py-1 rounded-md bg-stone-100 font-mono text-[11px] text-stone-700">
          {'{link_undangan}'}
        </span>
      </div>

      <textarea
        rows={7}
        value={waTemplate}
        onChange={(e) => onChangeTemplate(e.target.value)}
        className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 leading-relaxed"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSaveTemplate(waTemplate)}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          Simpan Template Pesan
        </button>
      </div>
    </div>
  );
};
