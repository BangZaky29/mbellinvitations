import React from 'react';
import type { BankAccount } from '../../../types/invitation';

interface BankAccountEditorProps {
  bankAccounts: BankAccount[];
  onBankAccountsChange: (accounts: BankAccount[]) => void;
}

export const BankAccountEditor: React.FC<BankAccountEditorProps> = ({
  bankAccounts = [],
  onBankAccountsChange,
}) => {
  const safeBankAccounts = Array.isArray(bankAccounts) ? bankAccounts : [];

  const addBankAccount = () => {
    const newAccount: BankAccount = {
      bank_name: 'BCA',
      account_number: '',
      account_number_raw: '',
      account_holder: '',
    };
    onBankAccountsChange([...safeBankAccounts, newAccount]);
  };

  const removeBankAccount = (index: number) => {
    onBankAccountsChange(safeBankAccounts.filter((_, i) => i !== index));
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold shadow-xs">
              5
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Amplop Digital &amp; Hadiah
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Tamu undangan dapat mengirimkan hadiah tanda kasih langsung via rekening bank atau dompet digital.
          </p>
        </div>

        <button
          type="button"
          onClick={addBankAccount}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_card</span>
          <span>Tambah Rekening Baru</span>
        </button>
      </div>

      {/* Bank Accounts List */}
      <div className="space-y-4">
        {safeBankAccounts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-stone-500 space-y-3">
            <span className="material-symbols-outlined text-stone-400 text-[36px]">credit_card_off</span>
            <p className="text-sm">Belum ada rekening atau dompet digital yang ditambahkan.</p>
            <button
              type="button"
              onClick={addBankAccount}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              + Tambah Rekening Pertama
            </button>
          </div>
        ) : (
          safeBankAccounts.map((account, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-4 relative group hover:border-stone-300 transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-stone-800 text-[18px]">credit_card</span>
                  Rekening #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeBankAccount(index)}
                  className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Hapus Rekening Ini"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                    value={account.account_number}
                    onChange={(e) => updateBankAccount(index, 'account_number', e.target.value)}
                    placeholder="cth: 5310928172"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-200 hover:border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm shadow-2xs transition-all"
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
          ))
        )}
      </div>
    </div>
  );
};
