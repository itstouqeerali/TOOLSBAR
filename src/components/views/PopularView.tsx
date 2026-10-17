import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { getPopularTools } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';

interface PopularViewProps {
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

export const PopularView: React.FC<PopularViewProps> = ({ onNavigate, onOpenAuth }) => {
  const popularTools = getPopularTools();

  return (
    <div className="pt-28 pb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="popular-view">
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

      <motion.div 
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch"
      >
        {popularTools.map((tool) => (
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

      {/* Editorial Overview Section */}
      <section className="!mt-16 sm:!mt-24 w-full" aria-labelledby="popular-overview-heading">
        <div className="rounded-3xl p-6 sm:p-10 glass-panel space-y-4 max-w-5xl">
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
