import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Code2, Minimize2, FileJson, CheckCircle2 } from 'lucide-react';
import { JsonFormatter } from './JsonFormatter';
import { JsonMinifier } from './JsonMinifier';

type JsonTab = 'format' | 'minify';

export const JsonStudio: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromSearch = (): JsonTab => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toLowerCase();
    if (tabParam === 'minify' || tabParam === 'compress' || tabParam === 'compact') {
      return 'minify';
    }
    return 'format';
  };

  const [activeTab, setActiveTab] = useState<JsonTab>(getTabFromSearch);

  useEffect(() => {
    const tab = getTabFromSearch();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab: JsonTab) => {
    setActiveTab(tab);
    navigate(`/tools/json-studio?tab=${tab}`, { replace: true });
  };

  return (
    <div className="space-y-8" id="json-studio-workspace">
      {/* Workspace Navigation Bar */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
          <FileJson className="w-4 h-4 text-emerald-500" />
          <span>JSON Studio Workspace</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-black/40 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-x-auto">
          {[
            { id: 'format', label: 'Beautify & Validate', icon: Code2 },
            { id: 'minify', label: 'Minify & Compress', icon: Minimize2 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as JsonTab)}
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

      {/* Active Tab View */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'format' && <JsonFormatter />}
        {activeTab === 'minify' && <JsonMinifier />}
      </div>
    </div>
  );
};
