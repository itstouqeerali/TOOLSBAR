import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, ArrowRight, ShieldCheck, Zap, 
  Lock, CheckCircle2, Star, X,
  Bot, Image as ImageIcon, Video, Code2, PenTool, GraduationCap, Mic, 
  Layers, FileText, FileImage, Percent, Calendar, TrendingUp,
  Check, Globe, Wrench, Shield, ExternalLink
} from 'lucide-react';
import { getFeaturedAiTools, getPublishedAiTools } from '../../data/aiToolsData';
import { TOOLS } from '../../data/tools';
import { AiToolCard } from '../common/AiToolCard';
import { ToolCard } from '../common/ToolCard';
import { AiToolLogo } from '../common/AiToolLogo';
import { AI_CATEGORIES } from '../../data/aiCategories';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  onOpenSearch: (initialQuery?: string) => void;
  onOpenAuth?: () => void;
}

import { type Variants } from 'framer-motion';

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
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

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenSearch, onOpenAuth }) => {
  const [heroSearchInput, setHeroSearchInput] = useState<string>('');
  const [activeAiTab, setActiveAiTab] = useState<string>('all');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const featuredAiTools = getFeaturedAiTools();
  const allPublishedAi = getPublishedAiTools();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = heroSearchInput.trim().toLowerCase();

  const matchingUtilities = useMemo(() => {
    if (!normalizedQuery) return [];
    return TOOLS.filter((t) => 
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.description.toLowerCase().includes(normalizedQuery) ||
      t.category.toLowerCase().includes(normalizedQuery) ||
      t.slug.toLowerCase().includes(normalizedQuery)
    ).slice(0, 4);
  }, [normalizedQuery]);

  const matchingAiTools = useMemo(() => {
    if (!normalizedQuery) return [];
    return allPublishedAi.filter((t) =>
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.shortDescription.toLowerCase().includes(normalizedQuery) ||
      t.primaryCategory.toLowerCase().includes(normalizedQuery) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) ||
      (t.bestFor && t.bestFor.some((b) => b.toLowerCase().includes(normalizedQuery)))
    ).slice(0, 5);
  }, [normalizedQuery, allPublishedAi]);

  const getUtilIcon = (category: string): React.ComponentType<{ className?: string }> => {
    if (category === 'pdf') return Layers;
    if (category === 'images') return ImageIcon;
    if (category === 'calculators') return Percent;
    if (category === 'developer') return Code2;
    return Wrench;
  };

  const flatResults = useMemo(() => {
    const list: Array<{
      type: 'utility' | 'ai';
      id: string;
      name: string;
      desc: string;
      path: string;
      slug?: string;
      badge: string;
      badgeClass: string;
      icon?: React.ComponentType<{ className?: string }>;
    }> = [];

    matchingUtilities.forEach((u) => {
      list.push({
        type: 'utility',
        id: `util-${u.id}`,
        name: u.name,
        desc: u.description,
        path: `tools/${u.slug}`,
        badge: 'Free & Local',
        badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20',
        icon: getUtilIcon(u.category),
      });
    });

    matchingAiTools.forEach((a) => {
      const isFree = a.pricingType === 'free';
      const isFreemium = a.pricingType === 'freemium';
      const badgeText = isFree ? '100% Free' : isFreemium ? (a.hasFreePlan ? 'Free Tier' : 'Freemium') : (a.startingPrice || 'Paid');
      const badgeClass = isFree || a.hasFreePlan
        ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20'
        : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20';

      list.push({
        type: 'ai',
        id: `ai-${a.id}`,
        name: a.name,
        desc: a.shortDescription,
        path: `ai-tools/${a.slug}`,
        slug: a.slug,
        badge: badgeText,
        badgeClass,
      });
    });

    return list;
  }, [matchingUtilities, matchingAiTools]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearchInput.trim()) {
      onOpenSearch('');
      return;
    }
    if (flatResults.length > 0 && selectedIndex >= 0 && selectedIndex < flatResults.length) {
      onNavigate(flatResults[selectedIndex].path);
    } else if (flatResults.length > 0) {
      onNavigate(flatResults[0].path);
    } else {
      onOpenSearch(heroSearchInput.trim());
    }
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!normalizedQuery || flatResults.length === 0) return;

    // flatResults items + 1 "View all" item at index flatResults.length
    const totalSelectable = flatResults.length + 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalSelectable);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev <= 0 ? totalSelectable - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatResults.length) {
        onNavigate(flatResults[selectedIndex].path);
        setIsSearchFocused(false);
      } else if (selectedIndex === flatResults.length) {
        onOpenSearch(heroSearchInput.trim());
        setIsSearchFocused(false);
      } else {
        handleHeroSearch(e);
      }
    }
  };

  // Top 6 most useful everyday utilities for Section 1
  const topSixSlugs = [
    'text-to-pdf',
    'images-to-pdf',
    'pdf-toolkit',
    'image-toolkit',
    'age-calculator',
    'percentage-calculator',
  ];
  const topSixUtilities = topSixSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as typeof TOOLS;

  // Filtered AI tools for Section 2
  const filteredAiTools = (activeAiTab === 'all'
    ? featuredAiTools
    : allPublishedAi.filter(
        (t) => t.primaryCategory === activeAiTab || t.categories.includes(activeAiTab)
      )
  ).slice(0, 6);

  // Intent pills right below hero search
  const intentPills = [
    { label: 'Merge / Convert PDF', path: 'tools/pdf-toolkit', icon: Layers, isUtility: true },
    { label: 'Compress Image', path: 'tools/image-toolkit', icon: ImageIcon, isUtility: true },
    { label: 'Generate AI Video', path: 'ai-tools/video-generation', icon: Video, isUtility: false },
    { label: 'Create AI Images', path: 'ai-tools/image-generation', icon: Sparkles, isUtility: false },
    { label: 'Audio & Voice AI', path: 'ai-tools/audio-voice-music', icon: Mic, isUtility: false },
    { label: 'Write & Study with AI', path: 'ai-tools/writing-content', icon: PenTool, isUtility: false },
    { label: 'Calculate Loan / %', path: 'tools/percentage-calculator', icon: Percent, isUtility: true },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-0" id="home-view">
      {/* ========================================================================= */}
      {/* HERO SECTION: 3-Second Instant Value Proposition */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-6 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Verified Value Proposition Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>12 Free Instant Browser Utilities + Verified Directory of 80+ AI Tools</span>
          </div>

          {/* Main Direct Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
            Everything You Need.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-300 dark:via-white dark:to-purple-300 bg-clip-text text-transparent block sm:inline">
              In One Place.
            </span>
          </h1>

          {/* Value Prop Subtext */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-neutral-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Run free PDF, image, and calculation utilities locally in your browser with zero data storage - or discover verified AI tools for video, coding, writing, and research with clear pricing.
          </p>

          {/* Prominent Search Box with Live Results Dropdown */}
          <div ref={searchContainerRef} className="relative w-[calc(100%-2rem)] sm:w-[90%] md:w-[88%] max-w-[760px] mx-auto pt-1 z-30">
            <form onSubmit={handleHeroSearch}>
              <div className="relative group p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl glass-card transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 border border-slate-200/90 dark:border-white/10">
                <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 gap-2.5 sm:gap-3">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                  <input
                    type="text"
                    value={heroSearchInput}
                    onChange={(e) => {
                      setHeroSearchInput(e.target.value);
                      setSelectedIndex(-1);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search AI software, browser utilities, or describe your task..."
                    className="w-full bg-transparent text-slate-900 dark:text-white text-xs sm:text-sm md:text-base placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none font-medium truncate"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    {heroSearchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeroSearchInput('');
                          setSelectedIndex(-1);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                        aria-label="Clear search input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Sleek Live-Results Dropdown Panel */}
            <AnimatePresence>
              {isSearchFocused && normalizedQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0c0e18]/95 backdrop-blur-2xl shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden text-left"
                >
                {flatResults.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 divide-y divide-slate-100 dark:divide-white/[0.06]">
                    {/* Native Utilities Section */}
                    {matchingUtilities.length > 0 && (
                      <div className="py-2 first:pt-1 space-y-1">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Wrench className="w-3 h-3" />
                          <span>Native Browser Utilities (100% Client-Side)</span>
                        </div>
                        {matchingUtilities.map((util) => {
                          const resultIdx = flatResults.findIndex((r) => r.id === `util-${util.id}`);
                          const isSelected = selectedIndex === resultIdx;
                          const UtilIcon = getUtilIcon(util.category);
                          return (
                            <div
                              key={util.id}
                              onClick={() => {
                                onNavigate(`tools/${util.slug}`);
                                setIsSearchFocused(false);
                              }}
                              onMouseEnter={() => setSelectedIndex(resultIdx)}
                              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-emerald-50/90 dark:bg-emerald-500/10 text-emerald-950 dark:text-white ring-1 ring-emerald-500/30'
                                  : 'hover:bg-slate-50 dark:hover:bg-white/[0.03] text-slate-800 dark:text-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                  <UtilIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-2">
                                    <span>{util.name}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate max-w-md">
                                    {util.description}
                                  </p>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20">
                                Free & Local
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* AI Tools Section */}
                    {matchingAiTools.length > 0 && (
                      <div className="py-2 first:pt-1 space-y-1">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span>Verified AI Tools & Software</span>
                        </div>
                        {matchingAiTools.map((aiTool) => {
                          const resultIdx = flatResults.findIndex((r) => r.id === `ai-${aiTool.id}`);
                          const isSelected = selectedIndex === resultIdx;
                          const isFree = aiTool.pricingType === 'free';
                          const isFreemium = aiTool.pricingType === 'freemium';
                          const badgeText = isFree ? '100% Free' : isFreemium ? (aiTool.hasFreePlan ? 'Free Tier' : 'Freemium') : (aiTool.startingPrice || 'Paid');
                          const badgeClass = isFree || aiTool.hasFreePlan
                            ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20'
                            : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20';

                          return (
                            <div
                              key={aiTool.id}
                              onClick={() => {
                                onNavigate(`ai-tools/${aiTool.slug}`);
                                setIsSearchFocused(false);
                              }}
                              onMouseEnter={() => setSelectedIndex(resultIdx)}
                              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-indigo-50/90 dark:bg-indigo-500/10 text-indigo-950 dark:text-white ring-1 ring-indigo-500/30'
                                  : 'hover:bg-slate-50 dark:hover:bg-white/[0.03] text-slate-800 dark:text-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 p-1 flex items-center justify-center shrink-0">
                                  <AiToolLogo slug={aiTool.slug} name={aiTool.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-semibold truncate">
                                    {aiTool.name}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate max-w-md">
                                    {aiTool.shortDescription}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badgeClass}`}>
                                {badgeText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer: View All Action */}
                    <div className="pt-2 px-1">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSearch(heroSearchInput.trim());
                          setIsSearchFocused(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(flatResults.length)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          selectedIndex === flatResults.length
                            ? 'bg-indigo-600 text-white'
                            : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5" />
                          <span>View all results for "{heroSearchInput}"</span>
                        </span>
                        <span className="text-[11px] opacity-80 flex items-center gap-1">
                          <span>Press Enter</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                      No instant matches for "{heroSearchInput}"
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSearch(heroSearchInput.trim());
                        setIsSearchFocused(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer transition-all inline-flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search full directory</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Interactive Task Switcher / Intent Pills */}
          <div className="mt-5 space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 block">
              What do you want to do today?
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
              {intentPills.map((pill) => {
                const PillIcon = pill.icon;
                return (
                  <motion.div
                    key={pill.path}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Link
                      to={`/${pill.path}`}
                      className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full glass-pill text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer shadow-xs border border-slate-200/70 dark:border-white/[0.08]"
                    >
                      <PillIcon className={`w-3.5 h-3.5 ${pill.isUtility ? 'text-emerald-500' : 'text-indigo-500'}`} />
                      <span>{pill.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STEP / SECTION 1: Instant Daily Utilities (100% Free, Runs in Browser) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="instant-utilities-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Step 1 | Instant Daily Utilities</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                100% Free | No Signup | No File Uploads
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              Instant Browser Utilities
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Fast, client-side tools processed 100% in your device's browser memory. Your documents, photos, and calculations are never uploaded or stored.
            </p>
          </div>

          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
          >
            <span>View All 12 Utilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Top Everyday Utilities Grid with Staggered Fade-In */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {topSixUtilities.map((tool) => (
            <motion.div key={tool.id} variants={gridItemVariants} className="h-full flex flex-col">
              <ToolCard
                tool={tool}
                onClick={() => onNavigate(`tools/${tool.slug}`)}
                onOpenAuth={onOpenAuth}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* STEP / SECTION 2: AI Tools Finder - Know What's Truly Free vs Paid */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="ai-tools-finder-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Step 2 | The AI Tools Finder</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">
                Know What's Truly Free vs Paid
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              Discover & Compare Verified AI Tools
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Don't waste time on misleading signups. We test each tool and clearly display free plan limits, daily credits, starting prices, and official direct links.
            </p>
          </div>

          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-button text-slate-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-white font-semibold text-xs border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shrink-0"
          >
            <span>Browse All 80+ AI Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Task Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Featured', icon: Star },
            { id: 'image-generation', label: 'Image AI', icon: ImageIcon },
            { id: 'video-generation', label: 'Video AI', icon: Video },
            { id: 'audio-voice-music', label: 'Voice & Audio AI', icon: Mic },
            { id: 'study-research', label: 'Study & Research AI', icon: GraduationCap },
            { id: 'chat-assistants', label: 'Chatbots & Reasoning', icon: Bot },
            { id: 'coding-development', label: 'Coding & Dev', icon: Code2 },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeAiTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setActiveAiTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'glass-button text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-white/[0.08]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* AI Tools Cards Grid with Staggered Reveal and Animation Key */}
        <motion.div
          key={activeAiTab}
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {filteredAiTools.map((tool) => (
            <motion.div key={tool.id} variants={gridItemVariants} className="h-full flex flex-col">
              <AiToolCard
                tool={tool}
                onNavigate={onNavigate}
                onOpenAuth={onOpenAuth}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* STEP / SECTION 3: How Toolsbar Works & Why Trust Us (AdSense Compliance) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" aria-labelledby="how-toolsbar-works-heading">
        <article className="rounded-3xl p-8 sm:p-12 glass-panel space-y-8 border border-slate-200/80 dark:border-white/[0.08]">
          <div className="space-y-2 max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Editorial Standard & Architecture
            </span>
            <h2 id="how-toolsbar-works-heading" className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              How Toolsbar Works & Why Trust Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
              Toolsbar was built to solve two major frustrations on the web: single-purpose tools that require account creation and secretly store user files, and sponsored AI directories that hide paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700 dark:text-neutral-300">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                1. 100% Client-Side Privacy
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                When you merge a PDF, convert an image, or calculate financial interest, the code runs in your browser's local JavaScript engine. Your private files are never transmitted to our servers.
              </p>
              <ul className="space-y-1 text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Zero cloud file storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Instant execution with zero latency</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                2. Transparent, Non-Hallucinated AI Data
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                We independently verify starting pricing, free plan restrictions, watermark rules, and token limits. Every tool profile links directly to the vendor's official website with zero affiliate cloaking.
              </p>
              <ul className="space-y-1 text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-500" /> Direct official vendor links</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-500" /> Free alternative suggestions for paid tools</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                3. AdSense-Ready & Free Forever
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                Our flagship tools are completely free to use without requiring paid credits or subscription paywalls. We adhere to high publisher content standards with rich educational documentation for each utility.
              </p>
              <ul className="space-y-1 text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-500" /> No mandatory paywalls or lockouts</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-500" /> High-quality editorial guidance</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};
