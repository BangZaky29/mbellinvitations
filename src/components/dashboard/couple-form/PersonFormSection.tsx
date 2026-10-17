import React, { useRef } from 'react';
import type { CoupleInfo } from '../../../types/invitation';

interface PersonFormSectionProps {
  title: string;
  badge: string;
  genderIcon: 'male' | 'female';
  familyTitle: string;
  person: CoupleInfo;
  onChange: (updated: CoupleInfo) => void;
  nicknamePlaceholder: string;
  fullnamePlaceholder: string;
  fatherPlaceholder: string;
  motherPlaceholder: string;
  orderPlaceholder: string;
}

export const PersonFormSection: React.FC<PersonFormSectionProps> = ({
  title,
  badge,
  genderIcon,
  familyTitle,
  person,
  onChange,
  nicknamePlaceholder,
  fullnamePlaceholder,
  fatherPlaceholder,
  motherPlaceholder,
  orderPlaceholder,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onChange({ ...person, photo: objectUrl, photo_url: objectUrl });
    }
  };

  const updateParentInfo = (
    childOrder: string | undefined,
    father: string | undefined,
    mother: string | undefined
  ) => {
    return [childOrder, father ? `dari ${father}` : '', mother ? `& ${mother}` : '']
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 hover:border-stone-300 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-stone-800 text-[20px]">{genderIcon}</span>
          <h3 className="text-sm font-bold text-stone-900">{title}</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-xs font-medium">
          {badge}
        </span>
      </div>

      {/* AVATAR UPLOAD */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleLocalImageUpload}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer w-16 h-16 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center border-2 border-stone-300 shrink-0 shadow-xs"
        >
          {person.photo || person.photo_url ? (
            <img
              src={person.photo || person.photo_url}
              alt={person.name}
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
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">photo_camera</span>
            Ganti Foto
          </button>
          <p className="text-[11px] text-stone-500 mt-1">Foto wajah close-up jernih (maks. 5MB)</p>
        </div>
      </div>

      {/* INPUTS MEMPELAI */}
      <div className="space-y-3.5 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <span>Nama Panggilan</span>
            <span className="text-stone-400 font-normal">(tampil di judul)</span>
          </label>
          <input
            type="text"
            value={person.name || ''}
            onChange={(e) => onChange({ ...person, name: e.target.value })}
            placeholder={nicknamePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700">Nama Lengkap &amp; Gelar</label>
          <input
            type="text"
            value={person.full_name || ''}
            onChange={(e) => onChange({ ...person, full_name: e.target.value })}
            placeholder={fullnamePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
          />
        </div>

        {/* Silsilah Orang Tua */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-stone-600">
              family_restroom
            </span>
            {familyTitle}
          </span>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-stone-600">
              Urutan Anak dalam Keluarga
            </label>
            <input
              type="text"
              value={person.child_order || ''}
              onChange={(e) => {
                const child_order = e.target.value;
                const summary = updateParentInfo(
                  child_order,
                  person.parent_father,
                  person.parent_mother
                );
                onChange({ ...person, child_order, parent_info: summary });
              }}
              placeholder={orderPlaceholder}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-600">Nama Ayah</label>
              <input
                type="text"
                value={person.parent_father || ''}
                onChange={(e) => {
                  const parent_father = e.target.value;
                  const summary = updateParentInfo(
                    person.child_order,
                    parent_father,
                    person.parent_mother
                  );
                  onChange({ ...person, parent_father, parent_info: summary });
                }}
                placeholder={fatherPlaceholder}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-600">Nama Ibu</label>
              <input
                type="text"
                value={person.parent_mother || ''}
                onChange={(e) => {
                  const parent_mother = e.target.value;
                  const summary = updateParentInfo(
                    person.child_order,
                    person.parent_father,
                    parent_mother
                  );
                  onChange({ ...person, parent_mother, parent_info: summary });
                }}
                placeholder={motherPlaceholder}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-stone-500">alternate_email</span>
            <span>Username Instagram</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={person.instagram || ''}
              onChange={(e) => onChange({ ...person, instagram: e.target.value })}
              placeholder="@username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
