import React, { useState } from 'react';
import { 
  Utensils, 
  Home, 
  Film, 
  ShoppingBag, 
  Zap, 
  Car, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  HeartPulse,
  Filter, 
  ArrowUpDown, 
  Download, 
  FileText, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { Transaction, TransactionCategory, TransactionStatus, TransactionType } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (tx: Transaction) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  selectedCategoryFilter?: TransactionCategory | null;
  onClearCategoryFilter?: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  onExportCSV,
  onExportPDF,
  selectedCategoryFilter,
  onClearCategoryFilter,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const pageSize = 8;

  // Category Icon Resolver
  const getCategoryIcon = (cat: TransactionCategory) => {
    switch (cat) {
      case 'Food & Dining':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'Rent & Housing':
        return <Home className="w-4 h-4 text-indigo-400" />;
      case 'Entertainment':
        return <Film className="w-4 h-4 text-amber-400" />;
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4 text-pink-400" />;
      case 'Bills & Utilities':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Transportation':
        return <Car className="w-4 h-4 text-violet-400" />;
      case 'Salary & Wages':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Freelance & Bonus':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'Investments':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'Healthcare':
        return <HeartPulse className="w-4 h-4 text-teal-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryBg = (cat: TransactionCategory) => {
    switch (cat) {
      case 'Food & Dining': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'Rent & Housing': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'Entertainment': return 'bg-amber-500/10 border-amber-500/20';
      case 'Shopping': return 'bg-pink-500/10 border-pink-500/20';
      case 'Bills & Utilities': return 'bg-cyan-500/10 border-cyan-500/20';
      case 'Transportation': return 'bg-violet-500/10 border-violet-500/20';
      case 'Salary & Wages': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'Freelance & Bonus': return 'bg-blue-500/10 border-blue-500/20';
      case 'Investments': return 'bg-purple-500/10 border-purple-500/20';
      case 'Healthcare': return 'bg-teal-500/10 border-teal-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  // Filter transactions
  let filtered = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (selectedCategoryFilter && tx.category !== selectedCategoryFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    return true;
  });

  // Sort transactions
  filtered.sort((a, b) => {
    if (sortOption === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOption === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortOption === 'amount-desc') return b.amount - a.amount;
    if (sortOption === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatCurrency = (amount: number, type: TransactionType) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            <Calendar className="w-3 h-3" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 backdrop-blur-xl shadow-lg overflow-hidden">
      {/* Table Action Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Recent Transactions
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 tabular-nums">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time ledger entries and verified payment methods
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Active Category Filter chip if any */}
          {selectedCategoryFilter && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-xl">
              <span>Category: {selectedCategoryFilter}</span>
              <button 
                onClick={onClearCategoryFilter} 
                className="hover:text-white"
                title="Clear category filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Type Segmented Filter (Functional buttons) */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['all', 'expense', 'income'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(type);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  typeFilter === type
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Filter Dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-xl transition-colors ${
                statusFilter !== 'all'
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Status</span>
            </button>

            {isFilterMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsFilterMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/50 py-1.5 z-40">
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Filter by Status
                  </div>
                  {['all', 'Completed', 'Pending', 'Scheduled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setIsFilterMenuOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        statusFilter === st
                          ? 'text-indigo-400 bg-indigo-500/10 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{st === 'all' ? 'All Statuses' : st}</span>
                      {statusFilter === st && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="date-desc" className="bg-slate-900 text-slate-200">Newest first</option>
              <option value="date-asc" className="bg-slate-900 text-slate-200">Oldest first</option>
              <option value="amount-desc" className="bg-slate-900 text-slate-200">Amount (High to Low)</option>
              <option value="amount-asc" className="bg-slate-900 text-slate-200">Amount (Low to High)</option>
            </select>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
              title="Download CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={onExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
              title="Preview Printable Report / PDF"
            >
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 lg:px-6">Category</th>
              <th className="py-3.5 px-4">Merchant / Title</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-300">No transactions found</p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Try clearing filters or search parameters to reveal more transactions.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="group hover:bg-slate-800/40 transition-colors"
                >
                  {/* Category */}
                  <td className="py-3.5 px-4 lg:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${getCategoryBg(tx.category)}`}>
                        {getCategoryIcon(tx.category)}
                      </div>
                      <span className="font-semibold text-slate-200">
                        {tx.category}
                      </span>
                    </div>
                  </td>

                  {/* Merchant / Title */}
                  <td className="py-3.5 px-4 min-w-[180px]">
                    <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {tx.merchant}
                    </div>
                    {tx.note && (
                      <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                        {tx.note}
                      </div>
                    )}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 tabular-nums font-mono text-[11px]">
                    {tx.date}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-xs font-medium">
                    {tx.paymentMethod}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap tabular-nums">
                    <span
                      className={`font-mono font-bold text-sm ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCurrency(tx.amount, tx.type)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-200 tabular-nums">
            {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-200 tabular-nums">
            {Math.min(currentPage * pageSize, filtered.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-200 tabular-nums">
            {filtered.length}
          </span>{' '}
          records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-0.5 text-xs font-semibold text-slate-300 tabular-nums">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
