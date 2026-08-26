import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';
import { CategoryCard } from '../common/CategoryCard';

interface CategoriesViewProps {
  onNavigate: (path: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="categories-view">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Layers className="w-3.5 h-3.5" /> Department Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Tool Categories
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Explore our complete collection of utilities organized by purpose — from calculators and text processors to developer encoders and QR utilities.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter(t => t.category === category.id);
          return (
            <div
              key={category.id}
              className="rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl flex flex-col justify-between space-y-6"
            >
              <div>
                <CategoryCard
                  category={category}
                  onClick={() => onNavigate(`category/${category.id}`)}
                />

                {/* Sub-tools quick list */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                    Included Tools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryTools.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => onNavigate(`tools/${t.slug}`)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/40 hover:bg-indigo-50 dark:hover:bg-indigo-600/30 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-white/[0.06] transition-colors cursor-pointer"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate(`category/${category.id}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/[0.08] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                View {category.name} ({categoryTools.length}) <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
