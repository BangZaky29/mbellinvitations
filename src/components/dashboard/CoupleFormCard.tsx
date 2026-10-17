import React from 'react';
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
      <CoverImageUploader coverImage={coverImage} onCoverChange={onCoverChange} />

      {/* Grid Block Mempelai Pria & Wanita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
