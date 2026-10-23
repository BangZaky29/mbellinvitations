import React, { useState } from 'react';
import type { BankAccount } from '../../../types/invitation';

interface BankAccountEditorProps {
  bankAccounts: BankAccount[];
  onBankAccountsChange: (accounts: BankAccount[]) => void;
}

export const BankAccountEditor: React.FC<BankAccountEditorProps> = ({
  bankAccounts = [],
  onBankAccountsChange,
}) => {
  const [activeBankIndex, setActiveBankIndex] = useState<number>(0);
  const safeBankAccounts = Array.isArray(bankAccounts) ? bankAccounts : [];
  const safeActiveIndex = Math.min(Math.max(0, activeBankIndex), Math.max(0, safeBankAccounts.length - 1));

  const addBankAccount = () => {
    const newIndex = safeBankAccounts.length;
    const newAccount: BankAccount = {
      bank_name: newIndex === 0 ? 'BCA' : newIndex === 1 ? 'Mandiri' : 'BRI',
      account_number: '',
      account_number_raw: '',
      account_holder: safeBankAccounts[0]?.account_holder || '',
    };
    onBankAccountsChange([...safeBankAccounts, newAccount]);
    setActiveBankIndex(newIndex);
  };

  const removeBankAccount = (index: number) => {
    const updated = safeBankAccounts.filter((_, i) => i !== index);
    onBankAccountsChange(updated);
    if (safeActiveIndex >= updated.length) {
      setActiveBankIndex(Math.max(0, updated.length - 1));
    }
  };

  const updateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    const updated = [...safeBankAccounts];
    const current = { ...updated[index], [field]: value };
    if (field === 'account_number') {
      current.account_number_raw = value.replace(/\s+/g, '');
    }
    updated[index] = current;
    onBankAccountsChange(updated);
  };

  const getBankBadgeColor = (bankName: string) => {
    const name = (bankName || '').toLowerCase();
    if (name.includes('bca')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (name.includes('mandiri')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (name.includes('bri')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (name.includes('bni')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (name.includes('bsi')) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (name.includes('gopay') || name.includes('dana') || name.includes('ovo') || name.includes('shopee')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              5
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Amplop Digital &amp; Hadiah
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Tamu undangan dapat mengirimkan hadiah tanda kasih langsung via rekening bank atau dompet digital.
          </p>
        </div>

        <button
          type="button"
          onClick={addBankAccount}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_card</span>
          <span>+ Tambah Rekening</span>
        </button>
      </div>

      {safeBankAccounts.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-stone-500 space-y-3">
          <span className="material-symbols-outlined text-stone-400 text-[36px]">credit_card_off</span>
          <p className="text-sm">Belum ada rekening atau dompet digital yang ditambahkan.</p>
          <button
            type="button"
            onClick={addBankAccount}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Tambah Rekening Pertama</span>
          </button>
        </div>
      ) : (
        <>
          {/* TAMPILAN MOBILE: Card Stack Slider (md:hidden) */}
          <div className="md:hidden space-y-3">
            {/* Tab Switcher Horizontal Rekening */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {safeBankAccounts.map((account, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveBankIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    safeActiveIndex === idx
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">credit_card</span>
                  <span>{account.bank_name || `Rekening ${idx + 1}`}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={addBankAccount}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 shrink-0 cursor-pointer"
                title="Tambah rekening baru"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Tambah</span>
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

              {/* Kartu Depan Aktif */}
              <div className="relative z-10 transition-all duration-200">
                {safeBankAccounts[safeActiveIndex] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-stone-800 text-[18px]">credit_card</span>
                        <span className="text-xs font-bold text-stone-800">
                          Rekening #{safeActiveIndex + 1} dari {safeBankAccounts.length}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBankBadgeColor(safeBankAccounts[safeActiveIndex].bank_name)}`}>
                          {safeBankAccounts[safeActiveIndex].bank_name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBankAccount(safeActiveIndex)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus Rekening Ini"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Bank / e-Wallet</label>
                        <select
                          value={safeBankAccounts[safeActiveIndex].bank_name}
                          onChange={(e) => updateBankAccount(safeActiveIndex, 'bank_name', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                        >
                          <option value="BCA">Bank BCA</option>
                          <option value="Mandiri">Bank Mandiri</option>
                          <option value="BRI">Bank BRI</option>
                          <option value="BNI">Bank BNI</option>
                          <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                          <option value="Jago">Bank Jago</option>
                          <option value="CIMB">CIMB Niaga</option>
                          <option value="Permata">Bank Permata</option>
                          <option value="GoPay">GoPay</option>
                          <option value="OVO">OVO</option>
                          <option value="Dana">DANA</option>
                          <option value="ShopeePay">ShopeePay</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">
                          Nomor Rekening / No. HP
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9\s]*"
                          value={safeBankAccounts[safeActiveIndex].account_number}
                          onChange={(e) => updateBankAccount(safeActiveIndex, 'account_number', e.target.value)}
                          placeholder="cth: 5310928172"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">
                          Atas Nama (Pemilik Rekening)
                        </label>
                        <input
                          type="text"
                          value={safeBankAccounts[safeActiveIndex].account_holder}
                          onChange={(e) => updateBankAccount(safeActiveIndex, 'account_holder', e.target.value)}
                          placeholder="cth: Raditya Putra W."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Tombol Cepat Navigasi Kartu */}
                    <div className="pt-2">
                      {safeActiveIndex < safeBankAccounts.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setActiveBankIndex(safeActiveIndex + 1)}
                          className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
                        >
                          <span>Rekening Selanjutnya</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={addBankAccount}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">add_card</span>
                          <span>+ Tambah Rekening Baru</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigasi Panah Kiri-Kanan Bawah Mobile */}
            <div className="flex items-center justify-between gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveBankIndex(Math.max(0, safeActiveIndex - 1))}
                disabled={safeActiveIndex === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  safeActiveIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                    : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Sebelumnya</span>
              </button>

              {/* Dots Indikator */}
              <div className="flex items-center gap-1.5">
                {safeBankAccounts.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setActiveBankIndex(idx)}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      safeActiveIndex === idx ? 'w-5 bg-stone-900' : 'w-2 bg-stone-300'
                    }`}
                    title={`Rekening ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveBankIndex(Math.min(safeBankAccounts.length - 1, safeActiveIndex + 1))}
                disabled={safeActiveIndex === safeBankAccounts.length - 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  safeActiveIndex === safeBankAccounts.length - 1
                    ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                    : 'text-stone-800 bg-white shadow-xs border border-stone-200 hover:bg-stone-100 active:scale-95'
                }`}
              >
                <span>Berikutnya</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* TAMPILAN DESKTOP: Grid 2 Kolom Rapi (hidden md:grid) */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            {safeBankAccounts.map((account, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 relative group hover:border-stone-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-stone-800 text-[18px]">credit_card</span>
                      <span className="text-xs font-bold text-stone-800">
                        Rekening #{index + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBankBadgeColor(account.bank_name)}`}>
                        {account.bank_name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBankAccount(index)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Rekening Ini"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Bank / e-Wallet</label>
                      <select
                        value={account.bank_name}
                        onChange={(e) => updateBankAccount(index, 'bank_name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      >
                        <option value="BCA">Bank BCA</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BRI">Bank BRI</option>
                        <option value="BNI">Bank BNI</option>
                        <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                        <option value="Jago">Bank Jago</option>
                        <option value="CIMB">CIMB Niaga</option>
                        <option value="Permata">Bank Permata</option>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                        <option value="Dana">DANA</option>
                        <option value="ShopeePay">ShopeePay</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Nomor Rekening / No. HP
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9\s]*"
                        value={account.account_number}
                        onChange={(e) => updateBankAccount(index, 'account_number', e.target.value)}
                        placeholder="cth: 5310928172"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Atas Nama (Pemilik Rekening)
                      </label>
                      <input
                        type="text"
                        value={account.account_holder}
                        onChange={(e) => updateBankAccount(index, 'account_holder', e.target.value)}
                        placeholder="cth: Raditya Putra W."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dashed Card Tambah Rekening di Desktop */}
            <div
              onClick={addBankAccount}
              className="p-5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-900 hover:bg-stone-50/50 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer min-h-[220px] group"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-colors flex items-center justify-center text-stone-700">
                <span className="material-symbols-outlined text-xl">add_card</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900">Tambah Rekening Baru</h4>
              <p className="text-[11px] text-stone-500 max-w-[200px]">
                Tambahkan rekening bank atau dompet digital untuk amplop digital.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
