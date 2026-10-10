import React, { useState } from 'react';
import { Sliders, Bell, Database, RefreshCw, Check, Sparkles, Shield, DollarSign } from 'lucide-react';

interface SettingsViewProps {
  savingsGoal: number;
  onUpdateSavingsGoal: (goal: number) => void;
  onResetData: () => void;
  onExportAllJSON: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  savingsGoal,
  onUpdateSavingsGoal,
  onResetData,
  onExportAllJSON,
}) => {
  const [goalInput, setGoalInput] = useState<number>(savingsGoal);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'JPY'>('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetThresholdAlerts, setBudgetThresholdAlerts] = useState(true);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSavingsGoal(goalInput);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Savings Goal Setting Card */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Monthly Savings Target</h3>
            <p className="text-xs text-slate-400">
              Configures the progress bar threshold on the executive dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Goal Target (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="100"
                  min="500"
                  max="50000"
                  value={goalInput}
                  onChange={(e) => setGoalInput(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 text-base font-mono font-bold bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="sm:pt-5">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
              >
                Save Target
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
            <span>Quick presets:</span>
            {[2000, 3000, 4000, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setGoalInput(preset);
                  onUpdateSavingsGoal(preset);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-colors ${
                  savingsGoal === preset
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>

          {isSavedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Savings target updated successfully!</span>
            </div>
          )}
        </form>
      </div>

      {/* Notifications & Alert Preferences */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Notification Preferences</h3>
            <p className="text-xs text-slate-400">Manage real-time ledger notices and warnings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div>
              <p className="text-xs font-semibold text-white">Budget Threshold Warnings</p>
              <p className="text-[11px] text-slate-400">Alert when spending in any category exceeds 80%</p>
            </div>
            <button
              onClick={() => setBudgetThresholdAlerts(!budgetThresholdAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                budgetThresholdAlerts ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div>
              <p className="text-xs font-semibold text-white">Large Transaction Summaries</p>
              <p className="text-[11px] text-slate-400">Notify for charges exceeding $500.00</p>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                emailAlerts ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Data & Maintenance */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Ledger Data & Backup</h3>
            <p className="text-xs text-slate-400">Export complete JSON payload or restore initial demo state</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExportAllJSON}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Backup (JSON)</span>
          </button>
          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
