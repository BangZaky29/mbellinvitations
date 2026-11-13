import React, { useState } from 'react';
import { DEFAULT_WA_TEMPLATE } from './constants';
import { GEMINI_MODELS_WATERFALL } from '../../../services/geminiWaService';

interface WaTemplateEditorModalProps {
  isOpen: boolean;
  waTemplate: string;
  onChangeTemplate: (val: string) => void;
  onSaveTemplate: (val: string) => void;
  useAiForWa?: boolean;
  onToggleUseAi?: (enabled: boolean) => void;
  lastUsedModel?: string | null;
  onGenerateAiPreview?: (guestName: string, forceRegenerate?: boolean) => Promise<string>;
}

export const WaTemplateEditorModal: React.FC<WaTemplateEditorModalProps> = ({
  isOpen,
  waTemplate,
  onChangeTemplate,
  onSaveTemplate,
  useAiForWa = true,
  onToggleUseAi,
  lastUsedModel,
  onGenerateAiPreview,
}) => {
  const [sampleGuest, setSampleGuest] = useState('Bpk. Budi Santoso');
  const [aiPreviewText, setAiPreviewText] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  if (!isOpen) return null;

  const handleTestAi = async () => {
    if (!onGenerateAiPreview) return;
    setIsLoadingPreview(true);
    try {
      const result = await onGenerateAiPreview(sampleGuest || 'Tamu Terhormat', true);
      setAiPreviewText(result);
    } catch (e) {
      console.warn('Test AI error:', e);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4 animate-in fade-in">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">
              Format & Generator Pesan WhatsApp
            </h4>
            <p className="text-[11px] text-stone-500">
              Didukung Google AI Studio (Gemini Waterfall Switching)
            </p>
          </div>
        </div>

        {/* AI Mode Toggle Button */}
        {onToggleUseAi && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-600">Mode AI:</span>
            <button
              type="button"
              onClick={() => onToggleUseAi(!useAiForWa)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                useAiForWa ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  useAiForWa ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-bold text-stone-800">
              {useAiForWa ? 'Aktif (AI)' : 'Manual (Template)'}
            </span>
          </div>
        )}
      </div>

      {/* Model Cascade Info Pill */}
      {useAiForWa ? (
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <span className="material-symbols-outlined text-[16px] text-emerald-600 animate-pulse">
                bolt
              </span>
              <span>Model Waterfall Aktif:</span>
              <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {lastUsedModel || GEMINI_MODELS_WATERFALL[0]}
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 font-medium">
              Otomatis switch jika kuota habis
            </span>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed">
            Setiap kali Anda klik tombol <strong>Kirim WA</strong> pada tamu, AI akan menyusun kalimat sapaan yang singkat, sopan, dan hangat terpersonalisasi. Jika limit harian model utama tercapai, sistem langsung otomatis berpindah ke model alternatif:
          </p>

          <div className="flex flex-wrap gap-1 text-[10px] font-mono">
            {GEMINI_MODELS_WATERFALL.map((m, idx) => (
              <span
                key={m}
                className={`px-2 py-0.5 rounded-md border ${
                  idx === 0
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                    : 'bg-white text-stone-600 border-stone-200'
                }`}
              >
                {idx + 1}. {m}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
              7. Template Manual (Fallback)
            </span>
          </div>

          {/* Tester AI Preview Box */}
          <div className="pt-2 border-t border-emerald-100/80 mt-2 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={sampleGuest}
                onChange={(e) => setSampleGuest(e.target.value)}
                placeholder="Nama contoh tamu..."
                className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-800 w-44 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleTestAi}
                disabled={isLoadingPreview}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoadingPreview ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Menyusun...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                    <span>Uji Coba Pesan AI</span>
                  </>
                )}
              </button>
            </div>

            {aiPreviewText && (
              <div className="p-3 rounded-lg bg-white border border-emerald-200 text-xs text-stone-800 whitespace-pre-line leading-relaxed shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 mb-1 border-b border-stone-100 pb-1">
                  <span>Hasil Teks AI yang Akan Terkirim ke WhatsApp:</span>
                  <span className="font-mono">Siap Pakai ✔️</span>
                </div>
                {aiPreviewText}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Manual Template Editor (Selalu ada sebagai fallback) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-stone-500 text-[16px]">edit_note</span>
            <span className="font-bold text-xs text-stone-800">
              Template Cadangan / Manual:
            </span>
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

        <p className="text-[11px] text-stone-500">
          Template ini akan dipakai jika mode manual dipilih atau jika seluruh model AI terkena batasan kuota:
        </p>

        <textarea
          rows={5}
          value={waTemplate}
          onChange={(e) => onChangeTemplate(e.target.value)}
          className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSaveTemplate(waTemplate)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            Simpan Template Manual
          </button>
        </div>
      </div>
    </div>
  );
};
