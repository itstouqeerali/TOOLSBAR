import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Grid, Layers, ArrowUpDown } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { ToolCard } from '../common/ToolCard';
import { CategoryId } from '../../types';

interface ToolsDirectoryViewProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const ToolsDirectoryView: React.FC<ToolsDirectoryViewProps> = ({ onNavigate, onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'roadmap'>('all');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'ready' && !tool.isImplemented) return false;
      if (statusFilter === 'roadmap' && tool.isImplemented) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description.toLowerCase().includes(q);
        const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchKeywords) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, statusFilter]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="tools-directory-view">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Grid className="w-3.5 h-3.5" /> Full Tool Registry
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          All Digital Utilities
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Browse our complete catalog of browser-first tools. Filter by category, execution status, or search for a specific utility.
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, keyword, or action..."
              className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-indigo-500 backdrop-blur-xl shadow-sm dark:shadow-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex p-1 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl shrink-0 shadow-sm dark:shadow-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'ready', label: 'Ready Now' },
              { id: 'roadmap', label: 'Roadmap' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-white/15 text-white border border-slate-900 dark:border-white/20 shadow-sm'
                : 'bg-white dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
            }`}
          >
            All Categories ({TOOLS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = TOOLS.filter(t => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Filtered Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onNavigate(`tools/${tool.slug}`)}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 text-slate-400 dark:text-neutral-400 flex items-center justify-center mx-auto border border-slate-200 dark:border-transparent">
            <Search className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">No tools found</div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search criteria or switching to a different category filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setStatusFilter('all'); }}
            className="text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
