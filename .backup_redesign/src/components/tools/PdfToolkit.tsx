import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layers, Scissors, Minimize2, FileText, Sparkles } from 'lucide-react';
import { PdfMerger } from './PdfMerger';
import { PdfSplitter } from './PdfSplitter';
import { PdfCompressor } from './PdfCompressor';

type PdfTab = 'merge' | 'split' | 'compress';

interface TabConfig {
  id: PdfTab;
  label: string;
  shortDesc: string;
  icon: React.ElementType;
}

const TABS: TabConfig[] = [
  {
    id: 'merge',
    label: 'Merge PDFs',
    shortDesc: 'Combine multiple PDF documents in custom sequence',
    icon: Layers,
  },
  {
    id: 'split',
    label: 'Split & Extract',
    shortDesc: 'Extract page ranges or separate individual sheets',
    icon: Scissors,
  },
  {
    id: 'compress',
    label: 'Compress PDF',
    shortDesc: 'Optimize file size with client-side compression',
    icon: Minimize2,
  },
];

export const PdfToolkit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial tab from URL query params
  const getTabFromSearch = (): PdfTab => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toLowerCase();
    if (tabParam === 'split' || tabParam === 'extract') return 'split';
    if (tabParam === 'compress' || tabParam === 'reduce') return 'compress';
    return 'merge';
  };

  const [activeTab, setActiveTab] = useState<PdfTab>(getTabFromSearch);

  // Sync state if location query changes
  useEffect(() => {
    const tab = getTabFromSearch();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tabId: PdfTab) => {
    setActiveTab(tabId);
    navigate(`/tools/pdf-toolkit?tab=${tabId}`, { replace: true });
  };

  return (
    <div className="space-y-8" id="pdf-toolkit-workspace">
      {/* Workspace Navigation Bar */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
          <FileText className="w-4 h-4 text-red-500" />
          <span>PDF Toolkit Workspace</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-black/40 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Utility View */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'merge' && <PdfMerger />}
        {activeTab === 'split' && <PdfSplitter />}
        {activeTab === 'compress' && <PdfCompressor />}
      </div>
    </div>
  );
};
