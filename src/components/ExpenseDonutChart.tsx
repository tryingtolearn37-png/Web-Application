import React, { useState } from 'react';
import { PieChart, ArrowUpRight, Filter } from 'lucide-react';
import { TransactionCategory } from '../types';

interface ExpenseCategoryItem {
  category: TransactionCategory;
  amount: number;
  color: string;
}

interface ExpenseDonutChartProps {
  categories: ExpenseCategoryItem[];
  totalExpense: number;
  onSelectCategory?: (category: TransactionCategory | null) => void;
  selectedCategory?: TransactionCategory | null;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  categories,
  totalExpense,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<TransactionCategory | null>(null);

  // Calculate percentages and angles
  const calculatedItems = categories
    .filter((item) => item.amount > 0)
    .map((item) => {
      const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
      return {
        ...item,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // SVG Donut parameters
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  const activeCategory = hoveredCategory || selectedCategory;
  const activeItem = activeCategory
    ? calculatedItems.find((c) => c.category === activeCategory)
    : null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="rounded-2xl p-5 bg-[#0F172A]/90 border border-slate-800/80 backdrop-blur-xl shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Expense Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Category distribution for period</p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory?.(null)}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20"
          >
            <Filter className="w-3 h-3" />
            Reset Filter
          </button>
        )}
      </div>

      {/* Main visual & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4 my-auto">
        {/* Donut Chart SVG */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[200px] h-[200px]">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background circle track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="rgba(30, 41, 59, 0.5)"
                strokeWidth={strokeWidth}
              />

              {calculatedItems.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -cumulativeOffset;
                cumulativeOffset += (item.percentage / 100) * circumference;

                const isHovered = hoveredCategory === item.category;
                const isSelected = selectedCategory === item.category;
                const isMuted = (hoveredCategory && !isHovered) || (selectedCategory && !isSelected);

                return (
                  <circle
                    key={item.category}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      opacity: isMuted ? 0.35 : 1,
                      filter: isHovered ? `drop-shadow(0 0 6px ${item.color}80)` : 'none',
                    }}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(selectedCategory === item.category ? null : item.category);
                      }
                    }}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              {activeItem ? (
                <>
                  <span className="text-[11px] font-medium text-slate-400 line-clamp-1 max-w-[120px]">
                    {activeItem.category}
                  </span>
                  <span className="text-xl font-bold text-white tracking-tight tabular-nums mt-0.5">
                    {formatCurrency(activeItem.amount)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                    {activeItem.percentage.toFixed(1)}% of total
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Total Spent
                  </span>
                  <span className="text-xl font-extrabold text-white tracking-tight tabular-nums mt-0.5">
                    {formatCurrency(totalExpense)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {calculatedItems.length} Categories
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Categories breakdown list / legend */}
        <div className="md:col-span-7 space-y-2.5">
          {calculatedItems.slice(0, 5).map((item) => {
            const isHovered = hoveredCategory === item.category;
            const isSelected = selectedCategory === item.category;

            return (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(selectedCategory === item.category ? null : item.category);
                  }
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/10 border border-indigo-500/30'
                    : isHovered
                    ? 'bg-slate-800/80 border border-slate-700/50'
                    : 'bg-slate-900/40 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-200 truncate">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums shrink-0">
                    <span className="font-bold text-white">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-[11px] text-slate-400 w-11 text-right">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Micro progress line */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any category to filter table</span>
        <span className="text-slate-400">Top 5 categories</span>
      </div>
    </div>
  );
};
