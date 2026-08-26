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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-xs font-semibold text-orange-600 dark:text-orange-400">
          <Flame className="w-3.5 h-3.5" /> High Traffic Favorites
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Most Popular Utilities
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          The most frequently used, zero-latency daily tools chosen by millions of developers, creators, writers, and students worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {popularTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onClick={() => onNavigate(`tools/${tool.slug}`)}
            onOpenAuth={onOpenAuth}
          />
        ))}
      </div>
    </div>
  );
};
