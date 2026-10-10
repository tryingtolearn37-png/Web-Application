import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Calendar, CreditCard, Tag, FileText, AlertCircle } from 'lucide-react';
import { Transaction, TransactionCategory, TransactionType, PaymentMethod, TransactionStatus } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>, idToEdit?: string) => void;
  initialData?: Transaction | null;
}

const CATEGORIES: { name: TransactionCategory; type: 'expense' | 'income' | 'both' }[] = [
  { name: 'Food & Dining', type: 'expense' },
  { name: 'Rent & Housing', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Bills & Utilities', type: 'expense' },
  { name: 'Transportation', type: 'expense' },
  { name: 'Healthcare', type: 'expense' },
  { name: 'Salary & Wages', type: 'income' },
  { name: 'Freelance & Bonus', type: 'income' },
  { name: 'Investments', type: 'income' },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Apple Pay · Chase',
  'Chase Sapphire (••8492)',
  'Amex Gold (••3014)',
  'Visa Debit · Checking (••4190)',
  'Apple Card (••5521)',
  'Bank Transfer (ACH)',
  'Cash',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Apple Pay · Chase');
  const [date, setDate] = useState<string>('');
  const [status, setStatus] = useState<TransactionStatus>('Completed');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setMerchant(initialData.merchant);
      setCategory(initialData.category);
      setPaymentMethod(initialData.paymentMethod);
      setDate(initialData.date);
      setStatus(initialData.status);
      setNote(initialData.note || '');
    } else {
      setType('expense');
      setAmount('');
      setMerchant('');
      setCategory('Food & Dining');
      setPaymentMethod('Apple Pay · Chase');
      // Default to now in YYYY-MM-DD HH:mm
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setDate(formattedDate);
      setStatus('Completed');
      setNote('');
    }
    setError('');
  }, [initialData, isOpen]);

  // Adjust category if type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income' && category !== 'Salary & Wages' && category !== 'Freelance & Bonus' && category !== 'Investments') {
      setCategory('Salary & Wages');
    } else if (newType === 'expense' && (category === 'Salary & Wages' || category === 'Freelance & Bonus' || category === 'Investments')) {
      setCategory('Food & Dining');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive numerical amount.');
      return;
    }
    if (!merchant.trim()) {
      setError('Merchant or title is required.');
      return;
    }

    onSave(
      {
        title: merchant.trim(),
        merchant: merchant.trim(),
        category,
        type,
        amount: parsedAmount,
        date: date || new Date().toISOString().slice(0, 16).replace('T', ' '),
        paymentMethod,
        status,
        note: note.trim() || undefined,
      },
      initialData?.id
    );
    onClose();
  };

  const filteredCategories = CATEGORIES.filter(
    (c) => c.type === 'both' || c.type === type
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {initialData ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter transaction details to update ledger
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Amount (USD)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none">
                $
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-3 bg-slate-900/90 text-2xl font-extrabold text-white placeholder-slate-400 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 tabular-nums font-mono shadow-inner"
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Merchant / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Whole Foods, Monthly Rent, Client Retainer"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-900 text-white placeholder-slate-400 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category & Payment Method 2-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {filteredCategories.map((c) => (
                  <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className="bg-slate-900 text-white">
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Status 2-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date & Time
              </label>
              <input
                type="text"
                placeholder="YYYY-MM-DD HH:mm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                <option value="Scheduled" className="bg-slate-900 text-white">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Receipt #4812, Tax deductible"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-900 text-white placeholder-slate-400 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{initialData ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
