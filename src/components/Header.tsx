import React from 'react';
import { 
  Search, 
  Calendar, 
  Bell, 
  Plus, 
  Menu,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRange: string;
  onSelectRange: (range: string) => void;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
  onOpenAddModal: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedRange,
  onSelectRange,
  unreadNotificationsCount,
  onToggleNotifications,
  onOpenAddModal,
  onOpenMobileMenu,
}) => {
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = React.useState(false);

  const rangeOptions = [
    'This Month',
    'Last 30 Days',
    'Last 90 Days',
    'This Year',
    'All Time'
  ];

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 lg:hidden shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input with keyboard hint */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions, merchants, categories..."
            className="w-full pl-10 pr-12 py-2 text-sm bg-slate-900/80 text-slate-200 placeholder-slate-400 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all shadow-inner"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          ) : (
            <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Right: Date selector, Notifications, and CTA */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Date Range Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRangeDropdownOpen(!isRangeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition-colors shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline whitespace-nowrap">{selectedRange}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRangeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRangeDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsRangeDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/40 py-1.5 z-40">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60">
                  Select Period
                </div>
                {rangeOptions.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      onSelectRange(range);
                      setIsRangeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      selectedRange === range
                        ? 'text-indigo-400 bg-indigo-500/10 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{range}</span>
                    {selectedRange === range && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 text-slate-300" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0F172A]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Prominent "+ Add Transaction" CTA Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
