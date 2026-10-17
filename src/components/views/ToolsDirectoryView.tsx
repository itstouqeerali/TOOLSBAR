import React, { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Search, Grid, Sparkles } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { ToolCard } from '../common/ToolCard';

interface ToolsDirectoryViewProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export const ToolsDirectoryView: React.FC<ToolsDirectoryViewProps> = ({ onNavigate, onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

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
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pt-28 pb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10" id="tools-directory-view">
      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Grid className="w-3.5 h-3.5" /> Toolsbar Native Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          12 Built-In Digital Utilities
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          These 12 flagship tools execute directly in your web browser with complete client-side privacy and zero latency. No account or external subscription required.
        </p>
      </div>

      {/* Search & Filter Control Bar - Shifted directly up with consistent spacing */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, purpose, or capability..."
              className="w-full glass-input rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-white/15 text-white border border-slate-900 dark:border-white/20 shadow-sm'
                : 'glass-pill text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories ({TOOLS.length})
          </motion.button>
          {CATEGORIES.map(cat => {
            const count = TOOLS.filter(t => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'glass-pill text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name} ({count})
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grid of Filtered Tools with Staggered Fade-In */}
      {filteredTools.length > 0 ? (
        <motion.div 
          key={`${selectedCategory}-${searchQuery}`}
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch"
        >
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={gridItemVariants}
              className="h-full flex flex-col"
            >
              <ToolCard
                tool={tool}
                onClick={() => onNavigate(`tools/${tool.slug}`)}
                onOpenAuth={onOpenAuth}
              />
            </motion.div>
          ))}
        </motion.div>
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
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Directory Guide Card - Perfectly centered horizontally with 100% symmetrical vertical spacing above and below */}
      <section className="!mt-16 sm:!mt-24 w-full" aria-labelledby="directory-overview-heading">
        <div className="w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Directory Guide
            </span>
            <h2 id="directory-overview-heading" className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Navigating the Toolsbar Utility Directory
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
            <p>
              The Toolsbar directory provides a centralized index of all available browser-based utilities across mathematics, text processing, developer workflows, file conversion, and document management. You can filter the catalog by functional category, search directly by tool name or related keyword, or view tools according to readiness status.
            </p>
            <p>
              Each utility card identifies the tool name, core capability, and functional category. Most utilities in this catalog are fully implemented and ready for immediate in-browser use, while upcoming utilities undergoing active engineering are clearly identified as in development. When selecting a utility, consider the specific task required—whether calculating financial figures, transforming raw text lists, debugging encoded strings, or resizing media files—and launch the tool directly to begin working without installation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
