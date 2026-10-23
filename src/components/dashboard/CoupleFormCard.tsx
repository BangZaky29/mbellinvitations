import React, { useState } from 'react';
import type { CoupleInfo } from '../../types/invitation';
import { CoverImageUploader } from './couple-form/CoverImageUploader';
import { PersonFormSection } from './couple-form/PersonFormSection';

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
  onGroomChange,
  onBrideChange,
  onToggleBrideFirst,
  onCoverChange,
}) => {
  // 0 = Mempelai Pria, 1 = Mempelai Wanita
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-7 shadow-xs border border-stone-200/90 space-y-5 sm:space-y-6">
      {/* Header Card & Desktop Toggle Urutan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              2
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Data Pasangan Mempelai
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Lengkapi profil, nama lengkap &amp; gelar, foto, serta silsilah keluarga kedua mempelai.
          </p>
        </div>

        {/* Toggle Urutan Mempelai (Tampil di Header pada Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 self-start sm:self-auto">
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
      <CoverImageUploader coverImage={coverImage} onCoverChange={onCoverChange} />

      {/* TAMPILAN MOBILE: Card Stack Slider (md:hidden) */}
      <div className="md:hidden space-y-3">
        {/* Tab Switcher Cepat */}
        <div className="flex p-1 rounded-xl bg-stone-100 border border-stone-200">
          <button
            type="button"
            onClick={() => setActiveCardIndex(0)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCardIndex === 0
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-sky-600">male</span>
            <span>Mempelai Pria</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCardIndex(1)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCardIndex === 1
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-rose-600">female</span>
            <span>Mempelai Wanita</span>
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

          {/* Kartu Depan Aktif dengan Animasi Slide */}
          <div className="relative z-10">
            {activeCardIndex === 0 ? (
              <div
                key="groom-slide"
                className="space-y-2.5 transition-all duration-200"
              >
                <PersonFormSection
                  title="Mempelai Pria"
                  badge="Groom (1/2)"
                  genderIcon="male"
                  familyTitle="Silsilah Orang Tua Pria"
                  person={groom}
                  onChange={onGroomChange}
                  nicknamePlaceholder="cth: Raditya"
                  fullnamePlaceholder="cth: Raditya Putra Wicaksono, S.T."
                  fatherPlaceholder="cth: Bpk. Ir. Hendra Prasetyo"
                  motherPlaceholder="cth: Ibu Dra. Siti Aminah"
                  orderPlaceholder="cth: Putra pertama dari pasangan"
                />
                {/* Tombol Cepat Lanjut ke Mempelai Wanita */}
                <button
                  type="button"
                  onClick={() => setActiveCardIndex(1)}
                  className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-stone-800 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>Lanjut Isi Mempelai Wanita</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div
                key="bride-slide"
                className="space-y-2.5 transition-all duration-200"
              >
                <PersonFormSection
                  title="Mempelai Wanita"
                  badge="Bride (2/2)"
                  genderIcon="female"
                  familyTitle="Silsilah Orang Tua Wanita"
                  person={bride}
                  onChange={onBrideChange}
                  nicknamePlaceholder="cth: Jessica"
                  fullnamePlaceholder="cth: Jessica Anindita, S.Ds."
                  fatherPlaceholder="cth: Bpk. H. Lukman Hakim"
                  motherPlaceholder="cth: Ibu Hj. Ratna Dewi"
                  orderPlaceholder="cth: Putri kedua dari pasangan"
                />
                {/* Tombol Cepat Kembali ke Mempelai Pria */}
                <button
                  type="button"
                  onClick={() => setActiveCardIndex(0)}
                  className="w-full py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-stone-50 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Kembali ke Mempelai Pria</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kontrol Bawah Mobile: Panah Kiri-Kanan & Toggle Urutan */}
        <div className="flex flex-col gap-2 pt-2 border-t border-stone-200/80">
          {/* Baris Navigasi Panah Slide */}
          <div className="flex items-center justify-between gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveCardIndex(0)}
              disabled={activeCardIndex === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCardIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                  : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Pria</span>
            </button>

            {/* Dots Indikator Posisi */}
            <div className="flex items-center gap-1.5">
              <span
                onClick={() => setActiveCardIndex(0)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  activeCardIndex === 0 ? 'w-6 bg-stone-900' : 'w-2 bg-stone-300'
                }`}
                title="Mempelai Pria"
              />
              <span
                onClick={() => setActiveCardIndex(1)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  activeCardIndex === 1 ? 'w-6 bg-stone-900' : 'w-2 bg-stone-300'
                }`}
                title="Mempelai Wanita"
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveCardIndex(1)}
              disabled={activeCardIndex === 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCardIndex === 1
                  ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                  : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
              }`}
            >
              <span>Wanita</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Toggle Wanita Ditampilkan Diawal (di mobile dipindah ke bawah dekat panah) */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[18px]">swap_horiz</span>
              <div>
                <span className="text-xs font-bold text-stone-900 block leading-tight">
                  Wanita Ditampilkan Diawal
                </span>
                <span className="text-[10px] text-stone-500">
                  {isBrideFirst ? 'Mempelai Wanita tampil sebelum Pria' : 'Mempelai Pria tampil pertama (standar)'}
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isBrideFirst}
              onClick={() => onToggleBrideFirst(!isBrideFirst)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors p-0.5 focus:outline-none ${
                isBrideFirst ? 'bg-amber-600' : 'bg-stone-300'
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
      </div>

      {/* TAMPILAN DESKTOP: Grid Side-by-Side (hidden md:grid) */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <PersonFormSection
          title="Mempelai Pria"
          badge="Groom"
          genderIcon="male"
          familyTitle="Silsilah Orang Tua Pria"
          person={groom}
          onChange={onGroomChange}
          nicknamePlaceholder="cth: Raditya"
          fullnamePlaceholder="cth: Raditya Putra Wicaksono, S.T."
          fatherPlaceholder="cth: Bpk. Ir. Hendra Prasetyo"
          motherPlaceholder="cth: Ibu Dra. Siti Aminah"
          orderPlaceholder="cth: Putra pertama dari pasangan"
        />

        <PersonFormSection
          title="Mempelai Wanita"
          badge="Bride"
          genderIcon="female"
          familyTitle="Silsilah Orang Tua Wanita"
          person={bride}
          onChange={onBrideChange}
          nicknamePlaceholder="cth: Jessica"
          fullnamePlaceholder="cth: Jessica Anindita, S.Ds."
          fatherPlaceholder="cth: Bpk. H. Lukman Hakim"
          motherPlaceholder="cth: Ibu Hj. Ratna Dewi"
          orderPlaceholder="cth: Putri kedua dari pasangan"
        />
      </div>
    </section>
  );
};
