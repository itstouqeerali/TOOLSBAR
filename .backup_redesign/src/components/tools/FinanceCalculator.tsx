import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Landmark, TrendingUp, CreditCard, DollarSign } from 'lucide-react';
import { LoanEmiCalculator } from './LoanEmiCalculator';
import { CompoundInterestCalculator } from './CompoundInterestCalculator';
import { SimpleInterestCalculator } from './SimpleInterestCalculator';

type FinanceTab = 'loan' | 'compound' | 'simple';

export const FinanceCalculator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromSearch = (): FinanceTab => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toLowerCase();
    if (tabParam === 'compound' || tabParam === 'interest') return 'compound';
    if (tabParam === 'simple') return 'simple';
    return 'loan';
  };

  const [activeTab, setActiveTab] = useState<FinanceTab>(getTabFromSearch);

  useEffect(() => {
    const tab = getTabFromSearch();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab: FinanceTab) => {
    setActiveTab(tab);
    navigate(`/tools/finance-calculator?tab=${tab}`, { replace: true });
  };

  return (
    <div className="space-y-8" id="finance-calculator-workspace">
      {/* Workspace Navigation Bar */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>Finance & Loan Calculator</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-black/40 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-x-auto">
          {[
            { id: 'loan', label: 'Loan & Mortgage EMI', icon: CreditCard },
            { id: 'compound', label: 'Compound Interest', icon: TrendingUp },
            { id: 'simple', label: 'Simple Interest', icon: Landmark },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as FinanceTab)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Calculator Panel */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'loan' && <LoanEmiCalculator />}
        {activeTab === 'compound' && <CompoundInterestCalculator />}
        {activeTab === 'simple' && <SimpleInterestCalculator />}
      </div>
    </div>
  );
};
