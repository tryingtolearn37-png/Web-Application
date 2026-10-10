import React, { useState } from 'react';
import { PieChart, Plus, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Edit2, ShieldAlert } from 'lucide-react';
import { BudgetCategory, TransactionCategory } from '../types';

interface BudgetsViewProps {
  budgets: BudgetCategory[];
  onUpdateBudget: (category: TransactionCategory, newAmount: number) => void;
  onOpenAddTransaction: () => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  budgets,
  onUpdateBudget,
  onOpenAddTransaction,
}) => {
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);
  const [budgetInput, setBudgetInput] = useState<string>('');

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
  const totalUsedPercent = Math.round((totalSpent / totalBudgeted) * 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleStartEdit = (b: BudgetCategory) => {
    setEditingCategory(b.category);
    setBudgetInput(b.budgeted.toString());
  };

  const handleSaveEdit = (category: TransactionCategory) => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(category, val);
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Total Monthly Budget
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
            {formatCurrency(totalBudgeted)}
          </div>
          <p className="text-xs text-slate-400 mt-2">Allocated across {budgets.length} expense categories</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Total Spent Month-to-Date
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
            {formatCurrency(totalSpent)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            <span className="text-slate-300 font-semibold">{totalUsedPercent}%</span> of total allowance used
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Remaining Budget Pool
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {formatCurrency(totalRemaining)}
          </div>
          <p className="text-xs text-slate-400 mt-2">Available for remaining 21 days in cycle</p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Category Spending Caps</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time threshold tracking with automated overflow protection
            </p>
          </div>
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const percent = Math.min(100, Math.round((b.spent / b.budgeted) * 100));
            const isExceeded = b.spent > b.budgeted;
            const isWarning = !isExceeded && percent >= 80;
            const remaining = b.budgeted - b.spent;

            return (
              <div
                key={b.category}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="font-semibold text-sm text-white">{b.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingCategory === b.category ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          className="w-20 px-2 py-0.5 text-xs bg-slate-800 text-white rounded border border-indigo-500 font-mono"
                        />
                        <button
                          onClick={() => handleSaveEdit(b.category)}
                          className="px-2 py-0.5 text-[11px] bg-indigo-600 text-white rounded font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="text-slate-400 hover:text-indigo-300 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Edit monthly budget cap"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium">
                    Spent: <span className="text-white font-mono font-bold">{formatCurrency(b.spent)}</span>
                  </span>
                  <span className="text-slate-400 font-medium">
                    Cap: <span className="text-slate-300 font-mono">{formatCurrency(b.budgeted)}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: isExceeded ? '#F43F5E' : isWarning ? '#F59E0B' : b.color,
                    }}
                  />
                </div>

                {/* Status indicator */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  {isExceeded ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Over by {formatCurrency(Math.abs(remaining))}
                    </span>
                  ) : isWarning ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Approaching cap ({formatCurrency(remaining)} left)
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {formatCurrency(remaining)} remaining
                    </span>
                  )}
                  <span className="font-mono text-slate-400 tabular-nums">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
