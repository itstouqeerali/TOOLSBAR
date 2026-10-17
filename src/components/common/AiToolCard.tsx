import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ExternalLink, ArrowRight, Star 
} from 'lucide-react';
import { AiTool } from '../../types/aiTools';
import { getAiCategoryBySlug } from '../../data/aiCategories';
import { AiToolLogo } from './AiToolLogo';

interface AiToolCardProps {
  tool: AiTool;
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const AiToolCard: React.FC<AiToolCardProps> = ({ tool, onNavigate }) => {
  const category = getAiCategoryBySlug(tool.primaryCategory);

  const getPricingBadge = (pricingType: string) => {
    switch (pricingType) {
      case 'free':
        return { label: 'Free', bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20' };
      case 'freemium':
        return { label: 'Freemium', bg: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/20' };
      case 'paid':
        return { label: 'Paid', bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20' };
      case 'free-trial':
        return { label: 'Free Trial', bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20' };
      default:
        return { label: 'Contact Sales', bg: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-white/10' };
    }
  };

  const pricingBadge = getPricingBadge(tool.pricingType);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="h-full flex flex-col"
    >
      <div 
        className="group relative rounded-3xl p-5 sm:p-6 glass-card h-full flex flex-col justify-between transition-all duration-300 border border-slate-200/80 dark:border-white/10 dark:bg-[#0c0e18]/80 text-left"
        id={`ai-tool-card-${tool.slug}`}
      >
      <div className="space-y-4 flex-1 flex flex-col">
        {/* Top Header Row: Official SVG Logo, Title, Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Square Logo Container with official brand logo */}
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-white/10 flex items-center justify-center p-2.5 shrink-0 overflow-hidden shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
              <AiToolLogo slug={tool.slug} name={tool.name} className="w-full h-full object-contain" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link 
                  to={`/ai-tools/${tool.slug}`}
                  className="font-bold text-base sm:text-lg font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors cursor-pointer truncate"
                >
                  {tool.name}
                </Link>
                {tool.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                {category?.name || 'AI Tool'}
              </p>
            </div>
          </div>

          {/* Pricing Badge */}
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${pricingBadge.bg}`}>
            {pricingBadge.label}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>

        {/* Best For Tagline */}
        {tool.bestFor && tool.bestFor.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-neutral-300 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              Best for:
            </span>
            <p className="line-clamp-1 text-slate-800 dark:text-neutral-200">
              {tool.bestFor[0]}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
          {tool.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-neutral-300 border border-slate-200/60 dark:border-white/[0.08]"
            >
              {tag}
            </span>
          ))}
          {tool.startingPrice && (
            <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium text-slate-500 dark:text-neutral-400">
              From {tool.startingPrice}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer: Details & Visit Website */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
        <Link
          to={`/ai-tools/${tool.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <a
          href={tool.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-600/25 hover:shadow-md hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-100 cursor-pointer"
        >
          <span className="text-white font-semibold">Visit Official Site</span>
          <ExternalLink className="w-3 h-3 text-white shrink-0" />
        </a>
      </div>
      </div>
    </motion.div>
  );
};
