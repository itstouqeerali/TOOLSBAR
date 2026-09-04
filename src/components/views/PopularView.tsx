import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { getPopularTools } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';

interface PopularViewProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const PopularView: React.FC<PopularViewProps> = ({ onNavigate, onOpenAuth }) => {
  const popularTools = getPopularTools();

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="popular-view">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" /> Featured Selection
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Featured Daily Utilities
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          A selection of useful Toolsbar utilities for common everyday tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {popularTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onClick={() => onNavigate(`tools/${tool.slug}`)}
            onOpenAuth={onOpenAuth}
          />
        ))}
      </div>

      {/* Editorial Overview Section */}
      <section className="mt-12 pt-10 border-t border-slate-200/80 dark:border-white/[0.08]" aria-labelledby="popular-overview-heading">
        <div className="rounded-3xl p-6 sm:p-10 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-4 max-w-5xl">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Quick-Access Guide
            </span>
            <h2 id="popular-overview-heading" className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              About This Featured Selection
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
            <p>
              This page highlights a curated selection of commonly needed utilities from across the Toolsbar catalog. Rather than browsing through individual categories, you can use this collection as a quick-access starting point for frequent daily workflows.
            </p>
            <p>
              The featured utilities include essential tools across multiple disciplines: text formatting and word measurement for writers, loan EMI and percentage calculators for financial estimation, JSON formatting and cryptographic password generation for developers, and PDF merging for document management. Each tool operates directly within your browser for fast execution. If you need specialized utilities outside this featured list, explore our complete directory of tools or browse our topic-specific categories.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
