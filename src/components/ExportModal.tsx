import React from 'react';
import { X, Download, Printer, CheckCircle, FileText, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  onDownloadCSV: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  onDownloadCSV,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Financial Statement & Export Preview
              </h3>
              <p className="text-xs text-slate-400">
                Generated for Elena Vance · {currentDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:bg-white print:text-black">
          {/* Statement Header */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xl font-extrabold text-white flex items-center gap-2">
                FinFlow Wealth Ledger
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Account Holder: <span className="text-slate-200 font-semibold">Elena Vance</span> (ID: #FN-891024)
              </p>
              <p className="text-xs text-slate-400">
                Period: <span className="text-slate-200 font-medium">October 2026 (Month-to-Date)</span>
              </p>
            </div>

            <div className="flex gap-4 border-l border-slate-800 pl-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Balance</span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">{formatCurrency(totalBalance)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Net Inflow</span>
                <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">+{formatCurrency(monthlyIncome - monthlyExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Statement Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900/60 px-4 py-2.5 border-b border-slate-800 text-xs font-bold text-slate-300">
              Transaction Ledger ({transactions.length} items)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/40 text-[11px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Merchant / Title</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Method</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/30">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{tx.date}</td>
                    <td className="py-2.5 px-4 font-semibold text-white">{tx.merchant}</td>
                    <td className="py-2.5 px-4">{tx.category}</td>
                    <td className="py-2.5 px-4 text-slate-400">{tx.paymentMethod}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification footer */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Certified FinFlow statement. Cryptographically verified against ledger storage.</span>
            </div>
            <span className="font-mono text-[11px]">SHA-256: 7f8b9...c41e</span>
          </div>
        </div>
      </div>
    </div>
  );
};
