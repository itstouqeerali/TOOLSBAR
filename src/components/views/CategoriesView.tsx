import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';
import { CategoryCard } from '../common/CategoryCard';

interface CategoriesViewProps {
  onNavigate: (path: string) => void;
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

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12" id="categories-view">
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

      {/* Grid of Categories with Staggered Fade-In */}
      <motion.div 
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
      >
        {CATEGORIES.map((category) => (
          <motion.div
            key={category.id}
            variants={gridItemVariants}
            className="h-full flex flex-col"
          >
            <CategoryCard
              category={category}
              onClick={() => onNavigate(`category/${category.id}`)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Categories Hub Editorial Overview */}
      <section className="!mt-16 sm:!mt-24 w-full" aria-labelledby="categories-hub-heading">
        <div className="rounded-3xl p-6 sm:p-10 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-4 max-w-5xl">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Functional Index
            </span>
            <h2 id="categories-hub-heading" className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Why Toolsbar Organizes Utilities by Discipline
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
            <p>
              Toolsbar organizes utilities into dedicated functional domains so you can quickly discover complementary tools for your current task. Grouping by discipline helps professionals and students work continuously without switching between disparate sites.
            </p>
            <p>
              Our primary divisions address specific everyday workflows: computational engines for loans, interest, and percentages in Calculators & Math; text measurement, line deduplication, and typography converters in Text & Content; syntax formatters, token decoders, and regex analyzers in Developer Utilities; physical and digital unit conversions in Unit Converters; and client-side PDF merging, compression, and image optimization in Document and Media suites. Click any category card to explore its detailed capabilities, read practical use cases, and access every included utility directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
