import React, { useState } from 'react';
import { 
  Search, Sparkles, ArrowRight, ShieldCheck, Zap, 
  Lock, CheckCircle2, ChevronRight, Command, Flame,
  Layers, Star, Shield
} from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { CategoryCard } from '../common/CategoryCard';
import { TOOLS, getPopularTools, getFeaturedTools } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenAuth?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenSearch, onOpenAuth }) => {
  const [inlineQuery, setInlineQuery] = useState('');
  const popularTools = getPopularTools();
  const featuredTools = getFeaturedTools();

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineQuery.trim()) {
      onOpenSearch();
    }
  };

  const quickPillSuggestions = [
    { label: 'Percentage Calculator', slug: 'percentage-calculator' },
    { label: 'Age Calculator', slug: 'age-calculator' },
    { label: 'Images to PDF', slug: 'images-to-pdf' },
    { label: 'Text to PDF', slug: 'text-to-pdf' },
    { label: 'Word Counter', slug: 'word-counter' },
    { label: 'QR Generator', slug: 'qr-generator' },
    { label: 'PDF Compressor', slug: 'pdf-compressor' },
    { label: 'Password Generator', slug: 'password-generator' },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-20" id="home-view">
      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-0 sm:pb-2 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Gen Global Digital Utility Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
            Everything you need.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-300 dark:via-white dark:to-purple-300 bg-clip-text text-transparent block sm:inline">
              In one place.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-neutral-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Fast, simple tools for the everyday things you need to get done online. Private, zero latency, and processed 100% in your browser.
          </p>

          {/* Primary Glass Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div 
              onClick={onOpenSearch}
              className="relative group p-2 rounded-3xl bg-white/90 hover:bg-white dark:bg-white/[0.03] dark:hover:bg-white/[0.05] border border-slate-200 hover:border-indigo-400 dark:border-white/[0.1] dark:hover:border-indigo-500/50 backdrop-blur-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center px-4 py-3 gap-3">
                <Search className="w-5 h-5 text-slate-400 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                <span className="text-sm sm:text-base text-slate-500 dark:text-neutral-400 group-hover:text-slate-800 dark:group-hover:text-neutral-200 transition-colors flex-1 text-left">
                  What do you need to do?
                </span>
                <div className="flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex items-center gap-1 text-xs font-mono bg-slate-200/90 dark:bg-black/50 text-slate-600 dark:text-neutral-400 px-2 py-1 rounded-lg border border-slate-300 dark:border-white/10">
                    <Command className="w-3 h-3" /> K
                  </kbd>
                  <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors">
                    Search
                  </span>
                </div>
              </div>
            </div>

            {/* Popular Tool Suggestions Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-1">
              <span className="text-xs text-slate-500 dark:text-neutral-500 font-medium">Popular:</span>
              {quickPillSuggestions.map((pill) => (
                <button
                  key={pill.slug}
                  onClick={() => onNavigate(`tools/${pill.slug}`)}
                  className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="popular-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Most Used Daily
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Popular Utilities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('popular')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            View all popular tools <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {popularTools.slice(0, 8).map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onNavigate(`tools/${tool.slug}`)}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="categories-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Structured Registry
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Browse by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            Explore all {CATEGORIES.length} categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onNavigate(`category/${category.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Essential Functional Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="featured-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Active & Tested
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Browser-First Essential Utilities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('tools')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            Browse entire directory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {TOOLS.filter(t => t.isImplemented).map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onNavigate(`tools/${tool.slug}`)}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Why Toolsbar / Design Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl p-8 sm:p-14 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-2xl shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              The Toolsbar Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Why utility software shouldn't look like 2004
            </h2>
            <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              Traditional utility websites often suffer from confusing navigation, deceptive download prompts, and sluggish server roundtrips. Toolsbar focuses on responsive, direct browser-first workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                color: 'text-emerald-500 dark:text-emerald-400',
                title: 'Client-Side Privacy Focus',
                desc: 'For browser-based utilities, your files, passwords, numbers, and text stay in your local browser memory with zero remote uploads.'
              },
              {
                icon: Zap,
                color: 'text-amber-500 dark:text-amber-400',
                title: 'Zero Latency Execution',
                desc: 'Instant real-time calculations as you type. No waiting for server queues, page reloads, or remote conversion APIs.'
              },
              {
                icon: Sparkles,
                color: 'text-indigo-600 dark:text-indigo-400',
                title: 'Focused User Interface',
                desc: 'Carefully designed layouts, high visual contrast, clear typography, and consistent controls across every utility.'
              },
              {
                icon: Layers,
                color: 'text-purple-600 dark:text-purple-400',
                title: 'Unified Ecosystem',
                desc: 'One seamless URL for calculators, formatting, encoding, converters, QR generators, and security tools.'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center shadow-sm dark:shadow-none">
                    <Icon className={`w-5 h-5 ${pillar.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Informational Section — About Toolsbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" aria-labelledby="about-toolsbar-heading">
        <article className="rounded-3xl p-8 sm:p-12 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Platform Overview
            </span>
            <h2 id="about-toolsbar-heading" className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              About Toolsbar
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400">
              Purpose-built digital utilities for everyday work and productivity
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed max-w-5xl">
            <p>
              Toolsbar is an independent digital utility platform created to help people complete everyday digital tasks quickly and without friction. Instead of installing single-purpose desktop applications or navigating complex multi-step interfaces, Toolsbar gives you direct access to a curated catalog of responsive utilities through your web browser.
            </p>
            <p>
              Our directory spans multiple practical disciplines. You will find financial and mathematical calculators for estimating loan EMIs, interest rates, and percentage discounts; text and content tools for counting words, adjusting letter casing, and deduplicating lists; developer utilities for formatting JSON, decoding JWT tokens, and generating UUIDs; unit converters for temperature, metric-imperial dimensions, and digital storage; and document and media tools for merging PDFs, creating QR codes, and compressing images.
            </p>
            <p>
              Whenever applicable, our utilities are engineered to process data locally within your browser using modern client-side Web APIs. This browser-first execution model means calculations, text transformations, and file manipulations happen instantly with zero network delay, while keeping your inputs, confidential notes, and documents confined to your own device.
            </p>
            <p>
              You can browse utilities by topic using our structured categories directory, view our most popular daily tools, or launch any tool in seconds using our global keyboard shortcut.
            </p>
          </div>
        </article>
      </section>

      {/* Section 6: Quick Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6 pt-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          Ready to get things done?
        </h2>
        <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-md mx-auto">
          Explore all tools or press <kbd className="font-mono bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white">⌘K</kbd> to launch any tool in under two seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('tools')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Explore All Tools
          </button>
          <button
            onClick={onOpenSearch}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-neutral-200 text-sm font-semibold transition-colors cursor-pointer"
          >
            Open Command Search (⌘K)
          </button>
        </div>
      </section>
    </div>
  );
};
