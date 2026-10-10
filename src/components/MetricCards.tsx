import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank,
  Sparkles
} from 'lucide-react';

interface MetricCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  onCardClick?: (metricType: 'balance' | 'income' | 'expenses' | 'savings') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  savingsGoal,
  onCardClick,
}) => {
  const currentSavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsPercent = Math.min(100, Math.round((currentSavings / savingsGoal) * 100));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {/* 1. Total Balance */}
      <div
        onClick={() => onCardClick?.('balance')}
        className="group relative rounded-2xl p-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-indigo-500/10 cursor-pointer overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Total Balance
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight tabular-nums">
            {formatCurrency(totalBalance)}
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 tabular-nums">
              <TrendingUp className="w-3 h-3" />
              <span>+4.2%</span>
            </div>
            <span className="text-[11px] text-slate-400">vs. last month</span>
          </div>
        </div>
      </div>

      {/* 2. Monthly Income */}
      <div
        onClick={() => onCardClick?.('income')}
        className="group relative rounded-2xl p-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/80 hover:border-emerald-500/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-emerald-500/10 cursor-pointer overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Monthly Income
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
            {formatCurrency(monthlyIncome)}
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 tabular-nums">
              <TrendingUp className="w-3 h-3" />
              <span>+8.1%</span>
            </div>
            <span className="text-[11px] text-slate-400">vs. previous period</span>
          </div>
        </div>
      </div>

      {/* 3. Monthly Expenses */}
      <div
        onClick={() => onCardClick?.('expenses')}
        className="group relative rounded-2xl p-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/80 hover:border-rose-500/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-rose-500/10 cursor-pointer overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-rose-500/10 blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Monthly Expenses
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 tracking-tight tabular-nums">
            {formatCurrency(monthlyExpenses)}
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 tabular-nums">
              <TrendingDown className="w-3 h-3" />
              <span>-3.4%</span>
            </div>
            <span className="text-[11px] text-slate-400">reduced spending</span>
          </div>
        </div>
      </div>

      {/* 4. Total Savings & Goal Progress */}
      <div
        onClick={() => onCardClick?.('savings')}
        className="group relative rounded-2xl p-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/80 hover:border-violet-500/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-violet-500/10 cursor-pointer overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl group-hover:bg-violet-500/20 transition-all pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Total Savings
          </span>
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {formatCurrency(currentSavings)}
            </span>
            <span className="text-xs font-semibold text-violet-300 tabular-nums">
              {savingsPercent}%
            </span>
          </div>

          {/* Progress bar towards monthly goal */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700 ease-out shadow-sm shadow-indigo-500"
              style={{ width: `${savingsPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Goal: {formatCurrency(savingsGoal)}
            </span>
            <span className="text-slate-400">
              {formatCurrency(Math.max(0, savingsGoal - currentSavings))} left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
