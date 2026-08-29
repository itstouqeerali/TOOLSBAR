import React from 'react';
import { ChevronRight, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';
import { CategoryId } from '../../types';

interface CategoryDetailViewProps {
  categoryId: string;
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ categoryId, onNavigate, onOpenAuth }) => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const categoryTools = TOOLS.filter(t => t.category === categoryId);

  if (!category) {
    return (
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Category Not Found</h1>
        <button
          onClick={() => onNavigate('categories')}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          &larr; Back to all categories
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="category-detail-view">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
        <button onClick={() => onNavigate('')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
        <button onClick={() => onNavigate('categories')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
          Categories
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
        <span className="text-slate-900 dark:text-white font-semibold">{category.name}</span>
      </div>

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Layers className="w-3.5 h-3.5" /> Category Collection
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          {category.name}
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Tools in this category */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-neutral-400">
          <span>Showing {categoryTools.length} utilities in {category.name}</span>
          <button
            onClick={() => onNavigate('categories')}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All categories
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {categoryTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onNavigate(`tools/${tool.slug}`)}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
