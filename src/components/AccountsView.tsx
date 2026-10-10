import React, { useState } from 'react';
import { Wallet, CreditCard, Building, ArrowRightLeft, Plus, Check, ShieldCheck, ChevronRight } from 'lucide-react';
import { AccountItem } from '../types';

interface AccountsViewProps {
  accounts: AccountItem[];
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onTransfer }) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState<string>(accounts[1]?.id || accounts[0]?.id || '');
  const [toAccount, setToAccount] = useState<string>(accounts[2]?.id || accounts[0]?.id || '');
  const [transferAmount, setTransferAmount] = useState<string>('500');
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const netWorth = totalAssets - totalLiabilities;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || fromAccount === toAccount) return;

    onTransfer(fromAccount, toAccount, amt);
    setTransferSuccess(`Successfully transferred ${formatCurrency(amt)}`);
    setTimeout(() => {
      setTransferSuccess(null);
      setIsTransferModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Net Worth Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Total Net Worth
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">
            {formatCurrency(netWorth)}
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-medium">+12.4% past 12 months</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Liquid & Invested Assets
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {formatCurrency(totalAssets)}
          </div>
          <p className="text-xs text-slate-400 mt-2">Checking, Savings & Brokerage</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Credit Liabilities
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
            {formatCurrency(totalLiabilities)}
          </div>
          <p className="text-xs text-slate-400 mt-2">Active revolving credit balance</p>
        </div>
      </div>

      {/* Accounts List & Cards */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Connected Financial Institutions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Encrypted bank feeds synchronizing automatically
            </p>
          </div>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer Funds</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between h-44 relative overflow-hidden group shadow-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {acc.institution} · {acc.type}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{acc.name}</h4>
                </div>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${acc.color}15`,
                    borderColor: `${acc.color}35`,
                    color: acc.color,
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Current Balance</span>
                  <div
                    className={`text-xl font-bold font-mono tabular-nums ${
                      acc.balance < 0 ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {formatCurrency(acc.balance)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono">{acc.accountNumberMasked}</span>
                  <span className="block text-[11px] text-indigo-400 font-medium">{acc.changeRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Funds Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsTransferModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0F172A] border border-slate-800 p-6 z-10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Transfer Between Accounts</h3>
            <p className="text-xs text-slate-400 mb-4">Instant zero-fee transfer within FinFlow Vault</p>

            {transferSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{transferSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">From Account</label>
                  <select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">To Account</label>
                  <select
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 text-sm font-mono bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-xl bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                  >
                    Execute Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
