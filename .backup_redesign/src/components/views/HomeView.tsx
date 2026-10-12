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
    { label: 'Text to PDF', slug: 'text-to-pdf' },
    { label: 'Images to PDF', slug: 'images-to-pdf' },
    { label: 'PDF Toolkit', slug: 'pdf-toolkit' },
    { label: 'Image Toolkit', slug: 'image-toolkit' },
    { label: 'Percentage Calculator', slug: 'percentage-calculator' },
    { label: 'Age Calculator', slug: 'age-calculator' },
    { label: 'Text Toolkit', slug: 'text-toolkit' },
    { label: 'JSON Studio', slug: 'json-studio' },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-20" id="home-view">
      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-0 sm:pb-2 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Browser-Based Digital Utility Suites</span>
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
            Fast, focused tools for your everyday digital tasks. Client-side processing keeps your data in your browser without unnecessary server uploads.
          </p>

          {/* Primary Glass Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div 
              onClick={onOpenSearch}
              className="relative group p-2 rounded-3xl glass-card transition-all duration-300 cursor-pointer"
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
                  <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all">
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
                  className="text-xs px-3 py-1 rounded-full glass-pill text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-100"
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
        <div className="rounded-3xl p-8 sm:p-14 glass-panel relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              The Toolsbar Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Engineered for Speed, Clarity, and Privacy
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
                <div key={idx} className="p-6 rounded-2xl glass-card space-y-3">
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

      {/* Section 5: Informational Section — About Toolsbar & 12 Flagship Workspaces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" aria-labelledby="about-toolsbar-heading">
        <article className="rounded-3xl p-8 sm:p-12 glass-panel space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Platform Architecture & Guide
            </span>
            <h2 id="about-toolsbar-heading" className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              About Toolsbar & Our 12 Flagship Workspaces
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400">
              Purpose-built digital utilities for everyday work, calculations, and document engineering
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed max-w-5xl">
            <p>
              Toolsbar is an independent digital utility platform created to help professionals, students, developers, and creators complete everyday digital tasks quickly and without friction. Instead of installing single-purpose desktop applications or navigating ad-cluttered interfaces with slow server queues, Toolsbar gives you direct access to 12 consolidated flagship workspaces right through your web browser.
            </p>
            <p>
              Whenever applicable, our utilities are engineered to execute locally within your browser using modern client-side Web APIs (such as HTML5 Canvas, the Web Crypto API, and client-side vector engines). This browser-first execution model means calculations, text transformations, and media conversions happen with zero network delay, while keeping your inputs, confidential notes, and sensitive files confined to your own device memory.
            </p>
          </div>

          {/* Detailed breakdown of the 12 Flagships */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08] space-y-6">
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
              The 12 Flagship Workspaces
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: '1. Text to PDF',
                  desc: 'In-browser rich document editor with logical page boundaries, custom margins, running headers/footers, and direct vector PDF compilation using local PDF-Lib rendering.',
                  slug: 'text-to-pdf'
                },
                {
                  title: '2. Images to PDF',
                  desc: 'Client-side photo and graphics compiler supporting JPG, PNG, and WebP formats with drag-and-drop page sequencing and paper sizing.',
                  slug: 'images-to-pdf'
                },
                {
                  title: '3. PDF Toolkit',
                  desc: 'Unified document studio combining multi-file PDF merging, targeted page-range extraction/splitting, and stream size optimization.',
                  slug: 'pdf-toolkit'
                },
                {
                  title: '4. Image Toolkit',
                  desc: 'Browser graphics workstation leveraging HTML5 Canvas for lossy/lossless compression, pixel dimension resizing, and format conversion across JPG, PNG, and WebP.',
                  slug: 'image-toolkit'
                },
                {
                  title: '5. Percentage Calculator',
                  desc: 'Comprehensive mathematical suite covering percentage changes, retail discount calculations with coupon stacking, GST/sales tax addition/removal, and proportional ratio scaling.',
                  slug: 'percentage-calculator'
                },
                {
                  title: '6. Age Calculator',
                  desc: 'Exact chronological age counter compensating for Gregorian calendar leap years, calculating completed years, months, days, and live ticking seconds.',
                  slug: 'age-calculator'
                },
                {
                  title: '7. Finance Calculator',
                  desc: 'Personal finance modeling hub providing monthly Loan EMI amortization schedules, compound interest growth across various frequencies, and simple interest projections.',
                  slug: 'finance-calculator'
                },
                {
                  title: '8. Text Toolkit',
                  desc: 'Consolidated writing utility with word/character counts, platform limit gauges, grammatical case conversion, list deduplication, space cleaning, and slug generation.',
                  slug: 'text-toolkit'
                },
                {
                  title: '9. JSON Studio',
                  desc: 'RFC 8259 compliant JSON inspector, syntax validator with character-level error diagnostics, beautifier with custom indentation, and production minifier.',
                  slug: 'json-studio'
                },
                {
                  title: '10. QR Code Generator',
                  desc: 'Standards-compliant 2D barcode creator supporting URLs, Wi-Fi network credentials, vCard contact cards, and text with custom colors and high-resolution PNG export.',
                  slug: 'qr-generator'
                },
                {
                  title: '11. Universal Unit Converter',
                  desc: 'Instant two-way conversions across 8 categories including length, mass, temperature (Celsius, Fahrenheit, Kelvin), and digital data storage.',
                  slug: 'unit-converter'
                },
                {
                  title: '12. Developer Toolbox',
                  desc: 'Consolidated developer workstation featuring code formatters (HTML, CSS, JS), Base64 and URL encoders, random UUID v4 generation, Web Crypto hashing, JWT claim inspection, and Unix epoch timestamps.',
                  slug: 'developer-toolbox'
                }
              ].map((flagship, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onNavigate(`tools/${flagship.slug}`)}
                  className="p-4 sm:p-5 rounded-2xl glass-card space-y-2 cursor-pointer group hover:border-indigo-500/30 transition-all"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                    <span>{flagship.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                    {flagship.desc}
                  </p>
                </div>
              ))}
            </div>
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
            className="px-6 py-3 rounded-2xl glass-button text-slate-800 dark:text-neutral-200 text-sm font-semibold transition-all cursor-pointer"
          >
            Open Command Search (⌘K)
          </button>
        </div>
      </section>
    </div>
  );
};
