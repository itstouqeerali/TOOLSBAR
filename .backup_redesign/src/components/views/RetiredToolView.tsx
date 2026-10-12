import React from 'react';
import { Archive, ArrowRight, Grid, Home, Layers } from 'lucide-react';
import { RetiredToolInfo } from '../../data/tools';

interface RetiredToolViewProps {
  toolInfo: RetiredToolInfo;
  onNavigate: (path: string) => void;
}

export const RetiredToolView: React.FC<RetiredToolViewProps> = ({ toolInfo, onNavigate }) => {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8" id="retired-tool-view">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400 animate-in fade-in">
        <Archive className="w-3.5 h-3.5" />
        <span>Utility Notice: Tool Retired</span>
      </div>

      {/* Main Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          {toolInfo.name} is No Longer Available
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          {toolInfo.reason}
        </p>
      </div>

      {/* Consolidation Context Box */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel text-left space-y-4 border border-slate-200/80 dark:border-white/10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Platform Consolidation Notice</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
          Toolsbar has been streamlined to focus on 12 high-performance flagship workspaces for document engineering, graphics optimization, financial modeling, and developer utilities. Standalone micro-calculators outside these flagship domains have been permanently retired to maintain high catalog quality and zero thin-content pages.
        </p>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('tools')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
        >
          <Grid className="w-4 h-4" />
          <span>Browse All 12 Flagship Tools</span>
        </button>
        <button
          onClick={() => onNavigate('')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs transition-all cursor-pointer border border-slate-200 dark:border-white/10"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};
