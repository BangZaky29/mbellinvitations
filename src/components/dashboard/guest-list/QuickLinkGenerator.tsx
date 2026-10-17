import React, { useState } from 'react';

interface QuickLinkGeneratorProps {
  invitationSlug?: string;
  coupleNames?: string;
  waTemplate: string;
  showToast: (msg: string) => void;
}

export const QuickLinkGenerator: React.FC<QuickLinkGeneratorProps> = ({
  invitationSlug = 'undangan-baru',
  coupleNames = 'Mempelai Pria & Mempelai Wanita',
  waTemplate,
  showToast,
}) => {
  const [quickGroupName, setQuickGroupName] = useState('');
  const [quickCopied, setQuickCopied] = useState(false);

  const getQuickGroupLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mbell.id';
    if (!quickGroupName.trim()) {
      return `${origin}/${invitationSlug}`;
    }
    return `${origin}/${invitationSlug}?to=${encodeURIComponent(quickGroupName.trim())}`;
  };

  const handleCopyQuickGroupLink = () => {
    const url = getQuickGroupLink();
    navigator.clipboard.writeText(url);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2500);
    showToast('Link undangan grup disalin');
  };

  const handleShareQuickGroupWhatsApp = () => {
    const link = getQuickGroupLink();
    const targetName = quickGroupName.trim() || 'Bapak/Ibu/Rekan-rekan';
    const message = waTemplate
      .replace(/{nama_tamu}/g, targetName)
      .replace(/{nama_mempelai}/g, coupleNames)
      .replace(/{link_undangan}/g, link);

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-stone-50 border border-amber-500/30 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
          </span>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              Bagikan Cepat / Link Grup WhatsApp
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 text-[10px] font-semibold">
                Tanpa Simpan DB
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500">
              Buat link dengan nama khusus untuk grup atau perorangan detik ini juga.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Chips Sapaan */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-medium text-stone-400 mr-1">Preset Sapaan:</span>
        {[
          { label: '👥 Grup Alumni', val: 'Teman-teman Alumni' },
          { label: '🏢 Rekan Kerja', val: 'Rekan-rekan Kerja' },
          { label: '👨‍👩‍👧‍👦 Keluarga Besar', val: 'Keluarga Besar' },
          { label: '✨ Tamu Undangan', val: 'Tamu Undangan' },
          { label: 'Kosongkan', val: '' },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setQuickGroupName(preset.val)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
              quickGroupName === preset.val
                ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-2xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Bar & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            badge
          </span>
          <input
            type="text"
            value={quickGroupName}
            onChange={(e) => setQuickGroupName(e.target.value)}
            placeholder="Ketik nama khusus (contoh: Keluarga Besar Bpk. H. Sulaiman)"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyQuickGroupLink}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {quickCopied ? 'check' : 'content_copy'}
            </span>
            <span>{quickCopied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareQuickGroupWhatsApp}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Share WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
