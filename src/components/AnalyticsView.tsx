import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Zap, ArrowUpRight, DollarSign } from 'lucide-react';
import { Transaction, CashFlowPoint } from '../types';

interface AnalyticsViewProps {
  transactions: Transaction[];
  monthlyIncome: number;
  monthlyExpenses: number;
  cashFlow6M: CashFlowPoint[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  monthlyIncome,
  monthlyExpenses,
  cashFlow6M,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const netSavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? ((netSavings / monthlyIncome) * 100).toFixed(1) : '0';
  const dailyAverageSpend = (monthlyExpenses / 31).toFixed(2);
  const projectedMonthlyExpense = (parseFloat(dailyAverageSpend) * 31).toFixed(2);

  // Group top merchants by expense
  const merchantTotals: Record<string, { total: number; count: number; category: string }> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!merchantTotals[t.merchant]) {
        merchantTotals[t.merchant] = { total: 0, count: 0, category: t.category };
      }
      merchantTotals[t.merchant].total += t.amount;
      merchantTotals[t.merchant].count += 1;
    });

  const sortedMerchants = Object.entries(merchantTotals)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Velocity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Savings Rate</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
            {savingsRate}%
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-medium">Exceeds 30% financial target</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Spending Pace</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
            ${dailyAverageSpend}
          </div>
          <p className="text-xs text-slate-400 mt-2">Avg daily outlay in October</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Monthly Surplus</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            +{formatCurrency(netSavings)}
          </div>
          <p className="text-xs text-slate-400 mt-2">Retained capital after obligations</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Projected Expense</span>
            <TrendingDown className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-200 font-mono tabular-nums">
            ${projectedMonthlyExpense}
          </div>
          <p className="text-xs text-slate-400 mt-2">On track to stay within limits</p>
        </div>
      </div>

      {/* Deep-Dive Grid: Historical Inflow vs Outflow & Top Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Historical 6M Performance Table */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            6-Month Cash Flow Velocity
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Audited monthly progression and surplus generation
          </p>

          <div className="space-y-3">
            {cashFlow6M.map((item) => (
              <div
                key={item.date}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{item.date}</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-mono font-medium">
                      Inc: +{formatCurrency(item.income)}
                    </span>
                    <span className="text-rose-400 font-mono font-medium">
                      Exp: -{formatCurrency(item.expense)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Surplus</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    +{formatCurrency(item.net)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Merchants List */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            Top Outlay Merchants
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Largest cumulative expenditure destinations
          </p>

          <div className="space-y-3">
            {sortedMerchants.map(([name, data], idx) => (
              <div
                key={name}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-400">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{name}</p>
                    <p className="text-[11px] text-slate-400">{data.category} · {data.count} txs</p>
                  </div>
                </div>

                <div className="font-mono font-bold text-white tabular-nums text-right shrink-0">
                  {formatCurrency(data.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
