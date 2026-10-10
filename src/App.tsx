import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { ExpenseDonutChart } from './components/ExpenseDonutChart';
import { CashFlowAreaChart } from './components/CashFlowAreaChart';
import { TransactionsTable } from './components/TransactionsTable';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ExportModal } from './components/ExportModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetsView } from './components/BudgetsView';
import { AccountsView } from './components/AccountsView';
import { SettingsView } from './components/SettingsView';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_ACCOUNTS, 
  INITIAL_NOTIFICATIONS, 
  MONTHLY_CASH_FLOW, 
  DAILY_CASH_FLOW_30D,
  CATEGORY_COLORS 
} from './data/mockData';
import { Transaction, BudgetCategory, AccountItem, NotificationItem, TransactionCategory } from './types';
import { Check, LogOut, X } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finflow_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('finflow_budgets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BUDGETS;
  });

  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    const saved = localStorage.getItem('finflow_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ACCOUNTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('finflow_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [savingsGoal, setSavingsGoal] = useState<number>(() => {
    const saved = localStorage.getItem('finflow_savings_goal');
    return saved ? Number(saved) : 3000;
  });

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('This Month');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TransactionCategory | null>(null);

  // Modals & Popovers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('finflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finflow_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('finflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('finflow_savings_goal', savingsGoal.toString());
  }, [savingsGoal]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metric Computations
  const monthlyIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Initial balance benchmark ($12,450.00 base)
  const totalBalance = useMemo(() => {
    const netDelta = monthlyIncome - monthlyExpenses;
    return 10090 + netDelta;
  }, [monthlyIncome, monthlyExpenses]);

  // Category Expense Breakdown for Donut Chart
  const expenseCategories = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map).map(([cat, amt]) => ({
      category: cat as TransactionCategory,
      amount: amt,
      color: CATEGORY_COLORS[cat] || '#6366F1',
    }));
  }, [transactions]);

  // Filtered transactions for search & category selection
  const displayedTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchMerchant = t.merchant.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        const matchNote = t.note?.toLowerCase().includes(q) || false;
        const matchMethod = t.paymentMethod.toLowerCase().includes(q);
        if (!matchTitle && !matchMerchant && !matchCat && !matchNote && !matchMethod) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, searchQuery]);

  // Handlers for Transactions
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id'>,
    idToEdit?: string
  ) => {
    if (idToEdit) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === idToEdit ? { ...txData, id: idToEdit } : t))
      );
      showToast('Transaction updated successfully');
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}`,
      };
      setTransactions((prev) => [newTx, ...prev]);

      // If expense, update budget spent
      if (txData.type === 'expense') {
        setBudgets((prev) =>
          prev.map((b) =>
            b.category === txData.category
              ? { ...b, spent: b.spent + txData.amount }
              : b
          )
        );
      }

      showToast(`Added ${txData.type}: $${txData.amount.toFixed(2)}`);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx && tx.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === tx.category
            ? { ...b, spent: Math.max(0, b.spent - tx.amount) }
            : b
        )
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction deleted');
  };

  const handleEditTransaction = (tx: Transaction) => {
    setTransactionToEdit(tx);
    setIsAddModalOpen(true);
  };

  // CSV Export
  const handleDownloadCSV = () => {
    const headers = ['ID,Merchant,Category,Type,Amount,Date,Payment Method,Status,Note'];
    const rows = transactions.map((t) =>
      `"${t.id}","${t.merchant.replace(/"/g, '""')}","${t.category}","${t.type}","${t.amount.toFixed(2)}","${t.date}","${t.paymentMethod}","${t.status}","${(t.note || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinFlow_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV ledger exported');
  };

  // JSON Full Backup Export
  const handleExportAllJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ transactions, budgets, accounts, savingsGoal }, null, 2)
    );
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `FinFlow_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup JSON exported');
  };

  // Reset to default data
  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setAccounts(INITIAL_ACCOUNTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSavingsGoal(3000);
    localStorage.clear();
    showToast('Restored default demo ledger');
  };

  // Budget category update
  const handleUpdateBudget = (category: TransactionCategory, newAmount: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, budgeted: newAmount } : b))
    );
    showToast(`Updated budget cap for ${category}`);
  };

  // Account Transfer
  const handleTransfer = (fromId: string, toId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId) {
          return { ...acc, balance: acc.balance - amount };
        }
        if (acc.id === toId) {
          return { ...acc, balance: acc.balance + amount };
        }
        return acc;
      })
    );
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingTxsCount = transactions.filter((t) => t.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 text-white text-xs font-semibold rounded-xl border border-indigo-500/40 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingCount={pendingTxsCount}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header Bar */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRange={selectedRange}
          onSelectRange={setSelectedRange}
          unreadNotificationsCount={unreadCount}
          onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
          onOpenAddModal={() => {
            setTransactionToEdit(null);
            setIsAddModalOpen(true);
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Notifications Popover Dropdown */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onClearAll={handleClearNotifications}
          onDismiss={handleDismissNotification}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <>
              {/* Summary Metric Cards (Top Row) */}
              <MetricCards
                totalBalance={totalBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                savingsGoal={savingsGoal}
                onCardClick={(type) => {
                  if (type === 'savings') setActiveTab('budgets');
                  else if (type === 'income' || type === 'expenses') setActiveTab('transactions');
                }}
              />

              {/* Visual Analytics (Middle Section) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Donut Chart: Expense Breakdown */}
                <div className="lg:col-span-5 h-full">
                  <ExpenseDonutChart
                    categories={expenseCategories}
                    totalExpense={monthlyExpenses}
                    selectedCategory={selectedCategoryFilter}
                    onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
                  />
                </div>

                {/* Area Chart: Cash Flow Trend */}
                <div className="lg:col-span-7 h-full">
                  <CashFlowAreaChart
                    data6M={MONTHLY_CASH_FLOW}
                    data30D={DAILY_CASH_FLOW_30D}
                  />
                </div>
              </div>

              {/* Recent Transactions Table (Bottom Section) */}
              <TransactionsTable
                transactions={displayedTransactions}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={handleEditTransaction}
                onExportCSV={handleDownloadCSV}
                onExportPDF={() => setIsExportModalOpen(true)}
                selectedCategoryFilter={selectedCategoryFilter}
                onClearCategoryFilter={() => setSelectedCategoryFilter(null)}
              />
            </>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              transactions={transactions}
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpenses}
              cashFlow6M={MONTHLY_CASH_FLOW}
            />
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Total Recorded Inflow: <strong className="text-emerald-400 font-mono">+${monthlyIncome.toFixed(2)}</strong> · Total Outflow: <strong className="text-rose-400 font-mono">-${monthlyExpenses.toFixed(2)}</strong>
                </span>
                <span className="text-slate-400 font-mono tabular-nums">{transactions.length} total entries</span>
              </div>
              <TransactionsTable
                transactions={displayedTransactions}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={handleEditTransaction}
                onExportCSV={handleDownloadCSV}
                onExportPDF={() => setIsExportModalOpen(true)}
                selectedCategoryFilter={selectedCategoryFilter}
                onClearCategoryFilter={() => setSelectedCategoryFilter(null)}
              />
            </div>
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              budgets={budgets}
              onUpdateBudget={handleUpdateBudget}
              onOpenAddTransaction={() => {
                setTransactionToEdit(null);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              onTransfer={handleTransfer}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              savingsGoal={savingsGoal}
              onUpdateSavingsGoal={setSavingsGoal}
              onResetData={handleResetData}
              onExportAllJSON={handleExportAllJSON}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSave={handleSaveTransaction}
        initialData={transactionToEdit}
      />

      {/* Export / Printable Statement Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={transactions}
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        onDownloadCSV={handleDownloadCSV}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0F172A] border border-slate-800 p-6 z-10 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <LogOut className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Sign Out Session</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to log out of Elena Vance's FinFlow Vault session?
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
              >
                Stay Signed In
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  showToast('Session logged out successfully');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
