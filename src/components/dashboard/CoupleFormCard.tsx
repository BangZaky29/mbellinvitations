import React, { useRef, useState } from 'react';
import type { CoupleInfo } from '../../types/invitation';

interface CoupleFormCardProps {
  groom: CoupleInfo;
  bride: CoupleInfo;
  isBrideFirst: boolean;
  coverImage: string;
  slug?: string;
  onSlugChange?: (slug: string) => void;
  onGroomChange: (groom: CoupleInfo) => void;
  onBrideChange: (bride: CoupleInfo) => void;
  onToggleBrideFirst: (isBrideFirst: boolean) => void;
  onCoverChange: (url: string) => void;
}

export const CoupleFormCard: React.FC<CoupleFormCardProps> = ({
  groom,
  bride,
  isBrideFirst,
  coverImage,
  slug = 'raditya-jessica',
  onSlugChange,
  onGroomChange,
  onBrideChange,
  onToggleBrideFirst,
  onCoverChange,
}) => {
  const [copied, setCopied] = useState(false);
  const groomFileInputRef = useRef<HTMLInputElement>(null);
  const brideFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      callback(objectUrl);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-stone-200/90 space-y-6">
      {/* Header Card & iOS Toggle Urutan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              2
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Data Pasangan Mempelai
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Lengkapi profil, nama lengkap &amp; gelar, foto, serta silsilah keluarga kedua mempelai.
          </p>
        </div>

        {/* Toggle Urutan Mempelai */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 self-start sm:self-auto">
          <span className="text-xs font-semibold text-stone-700">
            Wanita Ditampilkan Diawal
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isBrideFirst}
            onClick={() => onToggleBrideFirst(!isBrideFirst)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors p-0.5 focus:outline-none ${
              isBrideFirst ? 'bg-stone-900' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isBrideFirst ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Hero Cover Prewedding Upload */}
      <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-stone-800 text-[22px]">wallpaper</span>
            <h3 className="text-sm font-bold text-stone-900">
              Foto Sampul Utama (Cover Hero)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-xs font-medium">
            Wajib Ada
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            onClick={() => coverFileInputRef.current?.click()}
            className="relative group cursor-pointer w-full sm:w-48 h-32 rounded-xl bg-stone-200 overflow-hidden flex items-center justify-center border border-stone-300/80 shrink-0 shadow-xs"
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="Foto Cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="material-symbols-outlined text-stone-400 text-[36px]">image</span>
            )}
            <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-[26px]">photo_camera</span>
            </div>
          </div>

          <div className="space-y-2.5 flex-1">
            <input
              type="file"
              ref={coverFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLocalImageUpload(e, onCoverChange)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">upload</span>
                Unggah Foto Sampul
              </button>
              <button
                type="button"
                onClick={() =>
                  onCoverChange(
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                  )
                }
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-medium hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Gunakan Preset Foto
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Rekomendasi rasio portrait 4:5 atau 16:9, resolusi tinggi (format JPG/PNG maks. 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Grid Block Mempelai Pria & Wanita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BLOCK MEMPELAI PRIA */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-800 text-[20px]">male</span>
              <h3 className="text-sm font-bold text-stone-900">
                Mempelai Pria
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Groom
            </span>
          </div>

          {/* AVATAR UPLOAD */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={groomFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleLocalImageUpload(e, (url) => onGroomChange({ ...groom, photo: url, photo_url: url }))
              }
            />
            <div
              onClick={() => groomFileInputRef.current?.click()}
              className="relative group cursor-pointer w-16 h-16 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center border-2 border-stone-300 shrink-0 shadow-xs"
            >
              {groom.photo || groom.photo_url ? (
                <img
                  src={groom.photo || groom.photo_url}
                  alt={groom.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="material-symbols-outlined text-stone-400 text-[30px]">person</span>
              )}
              <div className="absolute inset-0 rounded-full bg-stone-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => groomFileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">photo_camera</span>
                Ganti Foto
              </button>
              <p className="text-[11px] text-stone-500 mt-1">
                Foto wajah close-up jernih (maks. 5MB)
              </p>
            </div>
          </div>

          {/* INPUTS MEMPELAI PRIA */}
          <div className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span>Nama Panggilan</span>
                <span className="text-stone-400 font-normal">(tampil di judul)</span>
              </label>
              <input
                type="text"
                value={groom.name || ''}
                onChange={(e) => onGroomChange({ ...groom, name: e.target.value })}
                placeholder="cth: Raditya"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Nama Lengkap &amp; Gelar
              </label>
              <input
                type="text"
                value={groom.full_name || ''}
                onChange={(e) => onGroomChange({ ...groom, full_name: e.target.value })}
                placeholder="cth: Raditya Putra Wicaksono, S.T."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            {/* Silsilah Orang Tua Pria */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3 shadow-2xs">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-stone-600">family_restroom</span>
                Silsilah Orang Tua Pria
              </span>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-600">
                  Urutan Anak dalam Keluarga
                </label>
                <input
                  type="text"
                  value={groom.child_order || ''}
                  onChange={(e) => {
                    const child_order = e.target.value;
                    const summary = [child_order, groom.parent_father ? `dari ${groom.parent_father}` : '', groom.parent_mother ? `& ${groom.parent_mother}` : ''].filter(Boolean).join(' ');
                    onGroomChange({ ...groom, child_order, parent_info: summary });
                  }}
                  placeholder="cth: Putra pertama dari pasangan"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:bg-white text-xs shadow-2xs transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-600">
                  Nama Ayah
                </label>
                <input
                  type="text"
                  value={groom.parent_father || ''}
                  onChange={(e) => {
                    const parent_father = e.target.value;
                    const summary = [groom.child_order, parent_father ? `dari ${parent_father}` : '', groom.parent_mother ? `& ${groom.parent_mother}` : ''].filter(Boolean).join(' ');
                    onGroomChange({ ...groom, parent_father, parent_info: summary });
                  }}
                  placeholder="cth: Bpk. Ir. Hendra Pratama"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:bg-white text-xs shadow-2xs transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-600">
                  Nama Ibu
                </label>
                <input
                  type="text"
                  value={groom.parent_mother || ''}
                  onChange={(e) => {
                    const parent_mother = e.target.value;
                    const summary = [groom.child_order, groom.parent_father ? `dari ${groom.parent_father}` : '', parent_mother ? `& ${parent_mother}` : ''].filter(Boolean).join(' ');
                    onGroomChange({ ...groom, parent_mother, parent_info: summary });
                  }}
                  placeholder="cth: Ibu drg. Ratna Kusuma"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:bg-white text-xs shadow-2xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Akun Instagram (Opsional)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-stone-400 font-bold text-sm">@</span>
                <input
                  type="text"
                  value={groom.instagram || ''}
                  onChange={(e) => onGroomChange({ ...groom, instagram: e.target.value.replace('@', '') })}
                  placeholder="radityapw"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK MEMPELAI WANITA */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-800 text-[20px]">female</span>
              <h3 className="text-sm font-bold text-stone-900">
                Mempelai Wanita
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
              Bride
            </span>
          </div>

          {/* AVATAR UPLOAD */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={brideFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleLocalImageUpload(e, (url) => onBrideChange({ ...bride, photo: url, photo_url: url }))
              }
            />
            <div
              onClick={() => brideFileInputRef.current?.click()}
              className="relative group cursor-pointer w-16 h-16 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center border-2 border-stone-300 shrink-0 shadow-xs"
            >
              {bride.photo || bride.photo_url ? (
                <img
                  src={bride.photo || bride.photo_url}
                  alt={bride.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="material-symbols-outlined text-stone-400 text-[30px]">person</span>
              )}
              <div className="absolute inset-0 rounded-full bg-stone-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => brideFileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">photo_camera</span>
                Ganti Foto
              </button>
              <p className="text-[11px] text-stone-500 mt-1">
                Foto wajah close-up jernih (maks. 5MB)
              </p>
            </div>
          </div>

          {/* INPUTS MEMPELAI WANITA */}
          <div className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span>Nama Panggilan</span>
                <span className="text-stone-400 font-normal">(tampil di judul)</span>
              </label>
              <input
                type="text"
                value={bride.name || ''}
                onChange={(e) => onBrideChange({ ...bride, name: e.target.value })}
                placeholder="cth: Jessica"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Nama Lengkap &amp; Gelar
              </label>
              <input
                type="text"
                value={bride.full_name || ''}
                onChange={(e) => onBrideChange({ ...bride, full_name: e.target.value })}
                placeholder="cth: Jessica Maharani, S.Ds."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
              />
            </div>

            {/* Silsilah Orang Tua Wanita */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3 shadow-2xs">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-stone-600">family_restroom</span>
                Silsilah Orang Tua Wanita
              </span>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-600">
                  Urutan Anak dalam Keluarga
                </label>
                <input
                  type="text"
                  value={bride.child_order || ''}
                  onChange={(e) => {
                    const child_order = e.target.value;
                    const summary = [child_order, bride.parent_father ? `dari ${bride.parent_father}` : '', bride.parent_mother ? `& ${bride.parent_mother}` : ''].filter(Boolean).join(' ');
                    onBrideChange({ ...bride, child_order, parent_info: summary });
                  }}
                  placeholder="cth: Putri pertama dari pasangan"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:bg-white text-xs shadow-2xs transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-600">
                  Nama Ayah
                </label>
                <input
                  type="text"
                  value={bride.parent_father || ''}
                  onChange={(e) => {
                    const parent_father = e.target.value;
                    const summary = [bride.child_order, parent_father ? `dari ${parent_father}` : '', bride.parent_mother ? `& ${bride.parent_mother}` : ''].filter(Boolean).join(' ');
                    onBrideChange({ ...bride, parent_father, parent_info: summary });
                  }}
                  placeholder="cth: Bpk. Bambang Wijaya"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:bg-white text-xs shadow-2xs transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-600">
                  Nama Ibu
                </label>
                <input
                  type="text"
                  value={bride.parent_mother || ''}
                  onChange={(e) => {
                    const parent_mother = e.target.value;
                    const summary = [bride.child_order, bride.parent_father ? `dari ${bride.parent_father}` : '', parent_mother ? `& ${parent_mother}` : ''].filter(Boolean).join(' ');
                    onBrideChange({ ...bride, parent_mother, parent_info: summary });
                  }}
                  placeholder="cth: Ibu Endang Rahayu"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:bg-white text-xs shadow-2xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Akun Instagram (Opsional)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-stone-400 font-bold text-sm">@</span>
                <input
                  type="text"
                  value={bride.instagram || ''}
                  onChange={(e) => onBrideChange({ ...bride, instagram: e.target.value.replace('@', '') })}
                  placeholder="jessicamaharani"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 TAUTAN OTOMATIS BERDASARKAN NAMA PANGGILAN KEDUA MEMPELAI */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-stone-50 to-white border border-amber-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700 text-[20px]">link</span>
            <h3 className="text-sm font-bold text-stone-900">
              Alamat Tautan Undangan (Otomatis Realtime)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold self-start sm:self-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Auto-Update dari Nama</span>
          </span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          Tautan website ini otomatis diperbarui secara realtime dari nama panggilan mempelai (<strong className="text-stone-800 font-semibold">{groom.name || 'Pria'}</strong> &amp; <strong className="text-stone-800 font-semibold">{bride.name || 'Wanita'}</strong>) tanpa perlu input manual.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 flex items-center justify-between rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-xs shadow-2xs">
            <div className="flex items-center gap-1 font-mono overflow-hidden">
              <span className="text-stone-400 select-none">
                {typeof window !== 'undefined' ? `${window.location.host}/` : 'mbell.id/'}
              </span>
              <span className="text-stone-900 font-bold truncate">
                {slug}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://mbell.id'}/${slug}`;
                navigator.clipboard.writeText(fullUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900 transition-colors cursor-pointer shrink-0 ml-2 flex items-center gap-1"
              title="Salin tautan resmi"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span className="text-[11px] font-sans font-medium text-stone-500">
                {copied ? 'Tersalin' : 'Salin'}
              </span>
            </button>
          </div>

          {/* Test Link Button */}
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
            title="Buka link undangan saat ini"
          >
            <span>Buka Undangan</span>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>
        </div>
      </div>
    </section>
  );
};
