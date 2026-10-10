import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { CashFlowPoint } from '../types';

interface CashFlowAreaChartProps {
  data6M: CashFlowPoint[];
  data30D: CashFlowPoint[];
}

export const CashFlowAreaChart: React.FC<CashFlowAreaChartProps> = ({
  data6M,
  data30D,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'6M' | '30D'>('6M');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataset = activeTimeframe === '6M' ? data6M : data30D;

  // Compute scale boundaries
  const maxVal = Math.max(
    ...dataset.map((d) => Math.max(d.income, d.expense)),
    1000
  );
  // Add 15% headroom for top breathing room
  const yMax = Math.ceil((maxVal * 1.15) / 500) * 500;

  // Chart coordinates
  const width = 640;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (dataset.length <= 1) return paddingLeft + chartW / 2;
    return paddingLeft + (index / (dataset.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return paddingTop + chartH - (val / yMax) * chartH;
  };

  // Helper to create smooth Bezier curve string
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  // Points for lines
  const incomePoints = dataset.map((d, i) => ({ x: getX(i), y: getY(d.income) }));
  const expensePoints = dataset.map((d, i) => ({ x: getX(i), y: getY(d.expense) }));

  const incomeLinePath = createSmoothPath(incomePoints);
  const expenseLinePath = createSmoothPath(expensePoints);

  // Closed area paths for gradients
  const groundY = paddingTop + chartH;
  const incomeAreaPath = `${incomeLinePath} L ${incomePoints[incomePoints.length - 1].x} ${groundY} L ${incomePoints[0].x} ${groundY} Z`;
  const expenseAreaPath = `${expenseLinePath} L ${expensePoints[expensePoints.length - 1].x} ${groundY} L ${expensePoints[0].x} ${groundY} Z`;

  const hoveredPoint = hoveredIndex !== null ? dataset[hoveredIndex] : null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="rounded-2xl p-5 bg-[#0F172A]/90 border border-slate-800/80 backdrop-blur-xl shadow-lg flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Cash Flow Trend
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Income vs. Expense comparison over time</p>
        </div>

        {/* Legend and Timeframe switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]/50" />
              <span className="text-slate-300 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] shadow-sm shadow-[#F43F5E]/50" />
              <span className="text-slate-300 font-medium">Expenses</span>
            </div>
          </div>

          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                setActiveTimeframe('6M');
                setHoveredIndex(null);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTimeframe === '6M'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => {
                setActiveTimeframe('30D');
                setHoveredIndex(null);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTimeframe === '30D'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full pt-4 my-auto overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Income Gradient */}
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>

            {/* Expense Gradient */}
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const val = yMax * ratio;
            const y = getY(val);
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(51, 65, 85, 0.4)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  ${(val / 1000).toFixed(1)}k
                </text>
              </g>
            );
          })}

          {/* Fill Areas */}
          <path d={incomeAreaPath} fill="url(#incomeGradient)" />
          <path d={expenseAreaPath} fill="url(#expenseGradient)" />

          {/* Spline Lines */}
          <path
            d={incomeLinePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.4))' }}
          />

          <path
            d={expenseLinePath}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(244, 63, 94, 0.4))' }}
          />

          {/* Active Hover Crosshair Line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={groundY}
              stroke="rgba(148, 163, 184, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points */}
          {dataset.map((d, i) => {
            const isHovered = hoveredIndex === i;
            const x = getX(i);
            const yInc = getY(d.income);
            const yExp = getY(d.expense);

            return (
              <g key={d.date}>
                {/* Income point */}
                <circle
                  cx={x}
                  cy={yInc}
                  r={isHovered ? 6 : 4}
                  fill="#0F172A"
                  stroke="#10B981"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200 cursor-pointer"
                />
                {/* Expense point */}
                <circle
                  cx={x}
                  cy={yExp}
                  r={isHovered ? 6 : 4}
                  fill="#0F172A"
                  stroke="#F43F5E"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200 cursor-pointer"
                />

                {/* X-axis labels */}
                <text
                  x={x}
                  y={groundY + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-medium transition-colors ${
                    isHovered ? 'fill-indigo-300 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {d.label}
                </text>

                {/* Invisible hover slice for easy mouse target */}
                <rect
                  x={x - chartW / dataset.length / 2}
                  y={paddingTop}
                  width={chartW / dataset.length}
                  height={chartH + 20}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="absolute top-4 pointer-events-none z-20 transition-all duration-150 transform -translate-x-1/2"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
            }}
          >
            <div className="bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-xl p-2.5 text-xs backdrop-blur-md min-w-[140px]">
              <div className="font-semibold text-slate-300 pb-1.5 border-b border-slate-800 text-[11px]">
                {hoveredPoint.date}
              </div>
              <div className="space-y-1 pt-1.5">
                <div className="flex items-center justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Income:
                  </span>
                  <span className="font-mono tabular-nums font-bold">
                    +{formatCurrency(hoveredPoint.income)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-rose-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Expense:
                  </span>
                  <span className="font-mono tabular-nums font-bold">
                    -{formatCurrency(hoveredPoint.expense)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-200 pt-1 border-t border-slate-800/80 font-semibold text-[11px]">
                  <span>Net Flow:</span>
                  <span
                    className={`font-mono tabular-nums ${
                      hoveredPoint.net >= 0 ? 'text-indigo-400' : 'text-amber-400'
                    }`}
                  >
                    {hoveredPoint.net >= 0 ? '+' : ''}
                    {formatCurrency(hoveredPoint.net)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Summary Strip */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">Net Cash Flow:</span>
          <span className="text-emerald-400 font-bold tabular-nums font-mono">
            +$2,360.00
          </span>
          <span className="text-slate-400 hidden sm:inline">surplus this cycle</span>
        </div>
        <span className="text-[11px] text-slate-400">Hover graph points for details</span>
      </div>
    </div>
  );
};
