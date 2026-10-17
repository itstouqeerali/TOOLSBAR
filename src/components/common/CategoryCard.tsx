import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, Calendar, FileText, Code2, 
  Scale, QrCode, KeyRound, FileSpreadsheet, 
  Image, Palette, ArrowRight 
} from 'lucide-react';
import { Category } from '../../types';
import { CATEGORY_STYLES } from '../../data/categories';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const ICON_MAP: Record<string, any> = {
  Calculator,
  Calendar,
  FileText,
  Code2,
  Scale,
  QrCode,
  KeyRound,
  FileSpreadsheet,
  Image,
  Palette
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const Icon = ICON_MAP[category.icon] || FileText;
  const style = CATEGORY_STYLES[category.id] || CATEGORY_STYLES.calculators;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="h-full flex flex-col"
    >
      <Link
        to={`/category/${category.id}`}
        onClick={onClick}
        id={`category-card-${category.id}`}
        className="group relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 glass-card h-full flex flex-col justify-between cursor-pointer border border-slate-200/80 dark:border-white/10 dark:bg-[#0c0e18]/80 transition-all duration-300 text-left"
      >
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2.5 sm:mb-4">
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${style.iconBg} border ${style.border} flex items-center justify-center ${style.iconText} group-hover:scale-105 ${style.hoverBg} group-hover:border-transparent group-hover:text-white transition-all shadow-sm`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <span className="text-[10px] sm:text-xs font-mono font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/[0.08]">
              {category.toolCount} {category.toolCount === 1 ? 'tool' : 'tools'}
            </span>
          </div>

          <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col">
            <h3 className="text-xs sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors leading-snug">
              {category.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-neutral-300 leading-snug sm:leading-relaxed line-clamp-2 flex-1">
              {category.description}
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-neutral-500 hidden xs:inline-block">Explore</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[11px] sm:text-xs ml-auto xs:ml-0">
            Browse <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
