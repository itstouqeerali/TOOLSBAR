import React, { useState, useMemo, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Search, Filter, Sparkles, Grid, Layers, ArrowUpDown, 
  Tag, Laptop, DollarSign, X, Check, BookOpen, HelpCircle, Shield 
} from 'lucide-react';
import { AiTool, AiPricingType, AiPlatform } from '../../types/aiTools';
import { AI_CATEGORIES, getAiCategoryBySlug } from '../../data/aiCategories';
import { fetchAllAiTools, getCachedAiTools } from '../../services/aiToolsService';
import { AiToolCard } from '../common/AiToolCard';

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

interface AiToolsDirectoryViewProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
  initialCategorySlug?: string;
}

export const AiToolsDirectoryView: React.FC<AiToolsDirectoryViewProps> = ({
  onNavigate,
  onOpenAuth,
  initialCategorySlug
}) => {
  const [tools, setTools] = useState<AiTool[]>(() => getCachedAiTools(false));
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pricingFilter, setPricingFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name'>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync initialCategorySlug if passed from route
  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  // Fetch live AI tools from service
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchAllAiTools(false)
      .then((data) => {
        if (isMounted) {
          setTools(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return undefined;
    return getAiCategoryBySlug(selectedCategory);
  }, [selectedCategory]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesPrimary = tool.primaryCategory === selectedCategory;
        const matchesMulti = tool.categories && tool.categories.includes(selectedCategory);
        if (!matchesPrimary && !matchesMulti) return false;
      }

      // Pricing filter
      if (pricingFilter !== 'all') {
        if (pricingFilter === 'free' && !tool.hasFreePlan && tool.pricingType !== 'free') return false;
        if (pricingFilter === 'freemium' && tool.pricingType !== 'freemium') return false;
        if (pricingFilter === 'paid' && tool.pricingType !== 'paid') return false;
        if (pricingFilter === 'free-trial' && !tool.hasFreeTrial && tool.pricingType !== 'free-trial') return false;
      }

      // Platform filter
      if (platformFilter !== 'all') {
        if (!tool.platforms || !tool.platforms.includes(platformFilter as AiPlatform)) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.shortDescription.toLowerCase().includes(q);
        const matchFull = tool.fullDescription.toLowerCase().includes(q);
        const matchTags = tool.tags.some((t) => t.toLowerCase().includes(q));
        const matchBest = tool.bestFor.some((b) => b.toLowerCase().includes(q));
        const matchUse = tool.useCases.some((u) => u.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchFull && !matchTags && !matchBest && !matchUse) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'newest') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [tools, selectedCategory, pricingFilter, platformFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPricingFilter('all');
    setPlatformFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="pt-28 pb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="ai-tools-directory">
      {/* Header Section */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" /> AI Tools Discovery
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          {activeCategoryInfo ? activeCategoryInfo.name : 'Explore AI Tools'}
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          {activeCategoryInfo
            ? activeCategoryInfo.shortDesc
            : 'Find the right artificial intelligence products for your work, research, coding, and creative projects. Compare verified pricing, capabilities, and visit official websites.'}
        </p>
      </div>

      {/* Category Editorial Context (If filtered by specific category) */}
      {activeCategoryInfo && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5 border border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Category Guide & Best Practices
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              About {activeCategoryInfo.name}
            </h2>
            <p className="text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
              {activeCategoryInfo.editorial.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200">
                Common Practical Applications
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-300">
                {activeCategoryInfo.editorial.commonUseCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200">
                What to Consider When Choosing
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-300">
                {activeCategoryInfo.editorial.selectionGuide.map((guide, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, capability, or use case (e.g. video, coding, research)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-neutral-400 shrink-0 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Recently Added</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'glass-pill text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories ({tools.length})
          </motion.button>
          {AI_CATEGORIES.map((cat) => {
            const count = tools.filter(
              (t) => t.primaryCategory === cat.slug || t.categories.includes(cat.slug)
            ).length;
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'glass-pill text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name} ({count})
              </motion.button>
            );
          })}
        </div>

        {/* Secondary Filter Badges: Pricing & Platform */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400 font-medium mr-1">
            <DollarSign className="w-3.5 h-3.5" /> Pricing:
          </div>
          {[
            { id: 'all', label: 'All' },
            { id: 'free', label: 'Free Available' },
            { id: 'freemium', label: 'Freemium' },
            { id: 'paid', label: 'Paid' },
            { id: 'free-trial', label: 'Free Trial' },
          ].map((pf) => (
            <motion.button
              key={pf.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setPricingFilter(pf.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                pricingFilter === pf.id
                  ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40'
                  : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {pf.label}
            </motion.button>
          ))}

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400 font-medium ml-3 mr-1">
            <Laptop className="w-3.5 h-3.5" /> Platform:
          </div>
          {['all', 'Web', 'macOS', 'Windows', 'iOS', 'Android', 'API'].map((plat) => (
            <motion.button
              key={plat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setPlatformFilter(plat)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                platformFilter === plat
                  ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40'
                  : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {plat === 'all' ? 'All Platforms' : plat}
            </motion.button>
          ))}

          {(selectedCategory !== 'all' || pricingFilter !== 'all' || platformFilter !== 'all' || searchQuery) && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={resetFilters}
              className="ml-auto text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset Filters
            </motion.button>
          )}
        </div>
      </div>

      {/* Tool Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
        <span>
          Showing <strong>{filteredTools.length}</strong> verified AI tools
          {selectedCategory !== 'all' ? ` in ${activeCategoryInfo?.name || selectedCategory}` : ''}
        </span>
      </div>

      {/* Grid of AI Tool Cards with Staggered Reveal */}
      {filteredTools.length > 0 ? (
        <motion.div 
          key={`${selectedCategory}-${pricingFilter}-${platformFilter}-${sortBy}`}
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={gridItemVariants}
              className="h-full flex flex-col"
            >
              <AiToolCard
                tool={tool}
                onNavigate={onNavigate}
                onOpenAuth={onOpenAuth}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-3xl p-12 text-center glass-panel space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            No AI tools match your current filter
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
            Try broadening your search term, clearing pricing or platform constraints, or selecting "All Categories".
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Independent Editorial & Trademark Notice Card - Perfectly centered horizontally with 100% symmetrical vertical spacing above and below */}
      <section className="!mt-16 sm:!mt-24 w-full" aria-labelledby="editorial-notice-heading">
        <div className="w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Editorial & Trademark Notice
            </span>
            <h2 id="editorial-notice-heading" className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Independent Editorial & Trademark Notice
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
            <p>
              Toolsbar is an independent directory and utility platform. All product names, logos, and trademarks mentioned on this website belong to their respective copyright holders. Product pricing, free limits, and feature availability are subject to change by their respective providers. Users are encouraged to verify current terms on each product's official website.
            </p>
            <p>
              Our directory listings are researched objectively to provide genuine capabilities, direct official links, and transparent pricing models for modern artificial intelligence tools without sponsored bias. External links point directly to official product endpoints and primary documentation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
