import React, { useState, useMemo } from 'react';
import { 
  Search, Sparkles, ArrowRight, ShieldCheck, Zap, 
  Lock, CheckCircle2, ChevronRight, Command, Flame,
  Layers, Star, Shield, ExternalLink, Bot, Image as ImageIcon,
  Video, Code2, PenTool, GraduationCap, Mic, Briefcase, 
  TrendingUp, Presentation, BarChart3, Wrench, Globe, Clock,
  Check, FileText, FileImage, Percent, Calendar, Type, Binary, QrCode, Scale
} from 'lucide-react';
import { AiTool, AiCategory } from '../../types/aiTools';
import { AI_CATEGORIES } from '../../data/aiCategories';
import { getFeaturedAiTools, getPublishedAiTools } from '../../data/aiToolsData';
import { TOOLS } from '../../data/tools';
import { AiToolCard } from '../common/AiToolCard';
import { ToolCard } from '../common/ToolCard';
import { getUtilityTheme, UtilityIllustration } from '../common/UtilityCardIllustration';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  onOpenSearch: (initialQuery?: string) => void;
  onOpenAuth?: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'chat-assistants': Bot,
  'image-generation': ImageIcon,
  'video-generation': Video,
  'coding-development': Code2,
  'writing-content': PenTool,
  'study-research': GraduationCap,
  'productivity-automation': Zap,
  'audio-voice-music': Mic,
  'hr-career': Briefcase,
  'marketing-business': TrendingUp,
  'design-presentations': Presentation,
  'data-analytics': BarChart3,
};

const UTILITY_ICON_MAP: Record<string, React.ElementType> = {
  'text-to-pdf': FileText,
  'images-to-pdf': FileImage,
  'pdf-toolkit': Layers,
  'image-toolkit': ImageIcon,
  'percentage-calculator': Percent,
  'age-calculator': Calendar,
  'finance-calculator': TrendingUp,
  'text-toolkit': Type,
  'json-studio': Binary,
  'qr-generator': QrCode,
  'unit-converter': Scale,
  'developer-toolbox': Code2,
};

interface CategoryColorTheme {
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  hoverBorder: string;
  hoverText: string;
  arrowHover: string;
  hoverShadow: string;
}

const CATEGORY_COLOR_THEMES: Record<string, CategoryColorTheme> = {
  'chat-assistants': {
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    iconBorder: 'border-cyan-200 dark:border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/40',
    hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-300',
    arrowHover: 'text-cyan-600 dark:text-cyan-400',
    hoverShadow: 'hover:shadow-cyan-500/10',
  },
  'image-generation': {
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-50 dark:bg-pink-500/15',
    iconBorder: 'border-pink-200 dark:border-pink-500/30',
    hoverBorder: 'hover:border-pink-500/40',
    hoverText: 'group-hover:text-pink-600 dark:group-hover:text-pink-300',
    arrowHover: 'text-pink-600 dark:text-pink-400',
    hoverShadow: 'hover:shadow-pink-500/10',
  },
  'video-generation': {
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-500/15',
    iconBorder: 'border-violet-200 dark:border-violet-500/30',
    hoverBorder: 'hover:border-violet-500/40',
    hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-300',
    arrowHover: 'text-violet-600 dark:text-violet-400',
    hoverShadow: 'hover:shadow-violet-500/10',
  },
  'coding-development': {
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    iconBorder: 'border-blue-200 dark:border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/40',
    hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-300',
    arrowHover: 'text-blue-600 dark:text-blue-400',
    hoverShadow: 'hover:shadow-blue-500/10',
  },
  'writing-content': {
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    iconBorder: 'border-rose-200 dark:border-rose-500/30',
    hoverBorder: 'hover:border-rose-500/40',
    hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-300',
    arrowHover: 'text-rose-600 dark:text-rose-400',
    hoverShadow: 'hover:shadow-rose-500/10',
  },
  'study-research': {
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconBorder: 'border-amber-200 dark:border-amber-500/30',
    hoverBorder: 'hover:border-amber-500/40',
    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-300',
    arrowHover: 'text-amber-600 dark:text-amber-400',
    hoverShadow: 'hover:shadow-amber-500/10',
  },
  'productivity-automation': {
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconBorder: 'border-emerald-200 dark:border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-300',
    arrowHover: 'text-emerald-600 dark:text-emerald-400',
    hoverShadow: 'hover:shadow-emerald-500/10',
  },
  'audio-voice-music': {
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-50 dark:bg-red-500/15',
    iconBorder: 'border-red-200 dark:border-red-500/30',
    hoverBorder: 'hover:border-red-500/40',
    hoverText: 'group-hover:text-red-600 dark:group-hover:text-red-300',
    arrowHover: 'text-red-600 dark:text-red-400',
    hoverShadow: 'hover:shadow-red-500/10',
  },
  'design-presentations': {
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-500/15',
    iconBorder: 'border-purple-200 dark:border-purple-500/30',
    hoverBorder: 'hover:border-purple-500/40',
    hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-300',
    arrowHover: 'text-purple-600 dark:text-purple-400',
    hoverShadow: 'hover:shadow-purple-500/10',
  },
  'marketing-business': {
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-500/15',
    iconBorder: 'border-orange-200 dark:border-orange-500/30',
    hoverBorder: 'hover:border-orange-500/40',
    hoverText: 'group-hover:text-orange-600 dark:group-hover:text-orange-300',
    arrowHover: 'text-orange-600 dark:text-orange-400',
    hoverShadow: 'hover:shadow-orange-500/10',
  },
  'career-tools': {
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-500/15',
    iconBorder: 'border-teal-200 dark:border-teal-500/30',
    hoverBorder: 'hover:border-teal-500/40',
    hoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-300',
    arrowHover: 'text-teal-600 dark:text-teal-400',
    hoverShadow: 'hover:shadow-teal-500/10',
  },
  'data-analytics': {
    iconColor: 'text-lime-600 dark:text-lime-400',
    iconBg: 'bg-lime-50 dark:bg-lime-500/15',
    iconBorder: 'border-lime-200 dark:border-lime-500/30',
    hoverBorder: 'hover:border-lime-500/40',
    hoverText: 'group-hover:text-lime-600 dark:group-hover:text-lime-300',
    arrowHover: 'text-lime-600 dark:text-lime-400',
    hoverShadow: 'hover:shadow-lime-500/10',
  },
};

const DEFAULT_CATEGORY_THEME: CategoryColorTheme = {
  iconColor: 'text-indigo-600 dark:text-indigo-400',
  iconBg: 'bg-indigo-50 dark:bg-indigo-500/15',
  iconBorder: 'border-indigo-200 dark:border-indigo-500/30',
  hoverBorder: 'hover:border-indigo-500/40',
  hoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-300',
  arrowHover: 'text-indigo-600 dark:text-indigo-400',
  hoverShadow: 'hover:shadow-indigo-500/10',
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenSearch, onOpenAuth }) => {
  const [heroSearchInput, setHeroSearchInput] = useState<string>('');
  const featuredAiTools = getFeaturedAiTools().slice(0, 6);
  const recentAiTools = getPublishedAiTools().slice(0, 6);
  const nativeUtilities = TOOLS.filter((t) => t.isImplemented);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch(heroSearchInput.trim());
  };

  const quickIntentChips = [
    { label: 'Generate Images', slug: 'image-generation', icon: ImageIcon },
    { label: 'Create Videos', slug: 'video-generation', icon: Video },
    { label: 'AI Chat', slug: 'chat-assistants', icon: Bot },
    { label: 'Write Content', slug: 'writing-content', icon: PenTool },
    { label: 'Code Faster', slug: 'coding-development', icon: Code2 },
    { label: 'Study & Research', slug: 'study-research', icon: GraduationCap },
    { label: 'Create Presentations', slug: 'design-presentations', icon: Presentation },
    { label: 'Automate Work', slug: 'productivity-automation', icon: Zap },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24" id="home-view">
      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-32 pb-4 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Tools Discovery Platform + 12 Built-In Utilities</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
            Find the Right AI Tool{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-300 dark:via-white dark:to-purple-300 bg-clip-text text-transparent block sm:inline">
              for Any Task
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-neutral-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Discover AI tools for video, images, writing, coding, research, productivity, business, and more — plus powerful free utilities built directly into Toolsbar.
          </p>

          {/* Prominent Hero Search Box */}
          <div className="w-[calc(100%-2rem)] sm:w-[90%] md:w-[88%] max-w-[760px] mx-auto pt-2">
            <form onSubmit={handleHeroSearch}>
              <div 
                className="relative group p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl glass-card transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 border border-slate-200/90 dark:border-white/10"
              >
                <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 gap-2.5 sm:gap-3">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                  <input
                    type="text"
                    value={heroSearchInput}
                    onChange={(e) => setHeroSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onOpenSearch(heroSearchInput.trim());
                      }
                    }}
                    placeholder="Search AI tools, utilities, or describe what you want to do..."
                    className="w-full bg-transparent text-slate-900 dark:text-white text-xs sm:text-sm md:text-base placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none font-medium truncate selection:bg-indigo-500/30"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono bg-slate-200/90 dark:bg-black/50 text-slate-600 dark:text-neutral-400 px-2 py-1 rounded-lg border border-slate-300 dark:border-white/10">
                      <Command className="w-3 h-3" /> K
                    </kbd>
                    <button
                      type="submit"
                      className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Quick Intent Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 pt-1">
              <span className="text-xs text-slate-500 dark:text-neutral-500 font-medium mr-1">I want to:</span>
              {quickIntentChips.map((chip) => {
                const ChipIcon = chip.icon;
                return (
                  <button
                    key={chip.slug}
                    onClick={() => onNavigate(`ai-tools/${chip.slug}`)}
                    className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full glass-pill text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-100 border border-slate-200/60 dark:border-white/[0.08]"
                  >
                    <ChipIcon className="w-3 h-3 text-indigo-500" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Explore AI by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="ai-categories-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Organized Discovery
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Explore AI by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
              Browse 12 specialized disciplines tailored for creators, engineers, researchers, and enterprises.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ai-tools')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer shrink-0"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {AI_CATEGORIES.map((cat, idx) => {
            const Icon = CATEGORY_ICON_MAP[cat.slug] || Bot;
            const theme = CATEGORY_COLOR_THEMES[cat.slug] || DEFAULT_CATEGORY_THEME;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(`ai-tools/${cat.slug}`)}
                style={{ animationDelay: `${Math.min(idx * 30, 360)}ms` }}
                className={`animate-fade-in-up group rounded-3xl p-5 sm:p-6 glass-card cursor-pointer flex flex-col justify-between space-y-4 transition-all duration-300 ease-out hover:shadow-2xl ${theme.hoverShadow} hover:-translate-y-1 ${theme.hoverBorder} border border-slate-200/80 dark:border-white/[0.08]`}
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} border ${theme.iconBorder} flex items-center justify-center ${theme.iconColor} shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base text-slate-900 dark:text-white ${theme.hoverText} transition-colors`}>
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>
                </div>

                <div className={`pt-2 border-t border-slate-200/60 dark:border-white/[0.05] flex items-center justify-between text-xs ${theme.iconColor} font-medium`}>
                  <span>Explore Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Featured AI Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="featured-ai-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Handpicked Workspaces
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Featured AI Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
              Verified flagship artificial intelligence platforms reviewed for capability, pricing transparency, and reliability.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ai-tools')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer shrink-0"
          >
            Browse all AI tools <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAiTools.map((tool, idx) => (
            <div
              key={tool.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(idx * 40, 360)}ms` }}
            >
              <AiToolCard
                tool={tool}
                onNavigate={onNavigate}
                onOpenAuth={onOpenAuth}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Task-Oriented Personas: Find AI for Your Work */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="personas-section">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Briefcase className="w-4 h-4" /> Role & Task Navigation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Find AI for Your Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            Targeted AI tool bundles grouped by your profession, daily workflow, and specific project goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              role: 'For Developers & Engineers',
              desc: 'Context-aware code completion, full-stack scaffolders, and automated test generators.',
              categorySlug: 'coding-development',
              examples: ['Cursor', 'GitHub Copilot', 'v0 by Vercel'],
              icon: Code2,
              iconColor: 'text-blue-600 dark:text-blue-400',
              iconBg: 'bg-blue-50 dark:bg-blue-500/15',
              iconBorder: 'border-blue-200 dark:border-blue-500/30',
              hoverBorder: 'hover:border-blue-500/40',
              hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-300',
              arrowHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
              hoverShadow: 'hover:shadow-blue-500/10',
            },
            {
              role: 'For Students & Researchers',
              desc: 'Semantic literature reviews, evidence-backed scientific search, and citation tools.',
              categorySlug: 'study-research',
              examples: ['Perplexity AI', 'Elicit', 'Consensus'],
              icon: GraduationCap,
              iconColor: 'text-amber-600 dark:text-amber-400',
              iconBg: 'bg-amber-50 dark:bg-amber-500/15',
              iconBorder: 'border-amber-200 dark:border-amber-500/30',
              hoverBorder: 'hover:border-amber-500/40',
              hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-300',
              arrowHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
              hoverShadow: 'hover:shadow-amber-500/10',
            },
            {
              role: 'For Video & Content Creators',
              desc: 'Cinematic text-to-video synthesis, AI motion brushes, and hyper-realistic voiceovers.',
              categorySlug: 'video-generation',
              examples: ['Runway Gen-3', 'Pika', 'ElevenLabs'],
              icon: Video,
              iconColor: 'text-violet-600 dark:text-violet-400',
              iconBg: 'bg-violet-50 dark:bg-violet-500/15',
              iconBorder: 'border-violet-200 dark:border-violet-500/30',
              hoverBorder: 'hover:border-violet-500/40',
              hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-300',
              arrowHover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
              hoverShadow: 'hover:shadow-violet-500/10',
            },
            {
              role: 'For Designers & Marketers',
              desc: 'Concept art generation, interactive slide decks, and generative copy editing.',
              categorySlug: 'image-generation',
              examples: ['Midjourney', 'Gamma', 'Canva Magic Studio'],
              icon: Presentation,
              iconColor: 'text-pink-600 dark:text-pink-400',
              iconBg: 'bg-pink-50 dark:bg-pink-500/15',
              iconBorder: 'border-pink-200 dark:border-pink-500/30',
              hoverBorder: 'hover:border-pink-500/40',
              hoverText: 'group-hover:text-pink-600 dark:group-hover:text-pink-300',
              arrowHover: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
              hoverShadow: 'hover:shadow-pink-500/10',
            },
            {
              role: 'For Writers & Editors',
              desc: 'Long-form editorial drafting, tone adjustments, conciseness, and proofreading.',
              categorySlug: 'writing-content',
              examples: ['Claude', 'Grammarly', 'ChatGPT'],
              icon: PenTool,
              iconColor: 'text-rose-600 dark:text-rose-400',
              iconBg: 'bg-rose-50 dark:bg-rose-500/15',
              iconBorder: 'border-rose-200 dark:border-rose-500/30',
              hoverBorder: 'hover:border-rose-500/40',
              hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-300',
              arrowHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
              hoverShadow: 'hover:shadow-rose-500/10',
            },
            {
              role: 'For Analysts & Operations',
              desc: 'Deterministic Python data analysis, spreadsheet modeling, and automated workflows.',
              categorySlug: 'data-analytics',
              examples: ['Julius AI', 'ChatGPT Interpreter'],
              icon: BarChart3,
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
              iconBorder: 'border-emerald-200 dark:border-emerald-500/30',
              hoverBorder: 'hover:border-emerald-500/40',
              hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-300',
              arrowHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
              hoverShadow: 'hover:shadow-emerald-500/10',
            }
          ].map((persona, idx) => {
            const Icon = persona.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(`ai-tools/${persona.categorySlug}`)}
                style={{ animationDelay: `${Math.min(idx * 40, 320)}ms` }}
                className={`animate-fade-in-up p-6 rounded-3xl glass-card space-y-4 cursor-pointer group transition-all duration-300 ease-out hover:shadow-2xl ${persona.hoverShadow} hover:-translate-y-1 ${persona.hoverBorder} border border-slate-200/80 dark:border-white/[0.08]`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${persona.iconBg} border ${persona.iconBorder} flex items-center justify-center ${persona.iconColor} shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 ${persona.arrowHover} group-hover:translate-x-1 transition-all duration-300`} />
                </div>

                <div className="space-y-1">
                  <h3 className={`font-bold text-base text-slate-900 dark:text-white ${persona.hoverText} transition-colors`}>
                    {persona.role}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {persona.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Featured:</span>
                  {persona.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-neutral-300 font-medium"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Built-In Toolsbar Utilities (The 12 Flagships) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="toolsbar-utilities-section">
        <div className="rounded-3xl p-8 sm:p-12 glass-panel border border-indigo-500/20 bg-gradient-to-b from-indigo-500/[0.03] to-transparent space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Free & Client-Side
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                Toolsbar Built-In Utilities
              </h2>
              <p className="text-xs sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
                In addition to AI tool discovery, Toolsbar includes 12 powerful native digital utilities you can use directly in your browser with zero latency and complete client-side privacy.
              </p>
            </div>

            <button
              onClick={() => onNavigate('tools')}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
            >
              Browse All 12 Utilities
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {nativeUtilities.map((utility, idx) => {
              const theme = getUtilityTheme(utility.slug);
              const IconComp = UTILITY_ICON_MAP[utility.slug] || Wrench;
              return (
                <div
                  key={utility.id}
                  onClick={() => onNavigate(`tools/${utility.slug}`)}
                  style={{ animationDelay: `${Math.min(idx * 30, 360)}ms` }}
                  className="animate-fade-in-up p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-card cursor-pointer group flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 border border-slate-200/80 dark:border-white/[0.08]"
                >
                  <div className="space-y-3">
                    {/* Visual Illustration */}
                    <UtilityIllustration slug={utility.slug} className="w-full h-24 mb-1" />

                    {/* Top Row: Distinct Colored Icon and Badges */}
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${theme.iconBg} ${theme.iconBorder} ${theme.iconColor}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeColor}`}>
                        100% Free
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                        {utility.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {utility.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Matching Try Now Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
                      In-Browser
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`tools/${utility.slug}`);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs shadow-sm transition-all group-hover:scale-105 cursor-pointer ${theme.buttonBg} ${theme.buttonShadow}`}
                    >
                      <span>Try Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: Platform Architecture & Independent Discovery Standard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" aria-labelledby="platform-standard-heading">
        <article className="rounded-3xl p-8 sm:p-12 glass-panel space-y-6 border border-slate-200/80 dark:border-white/[0.08]">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> The Toolsbar Standard
            </span>
            <h2 id="platform-standard-heading" className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Independent AI Discovery + Direct Browser Utilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
            <div className="space-y-3 p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>1. Independent AI Discovery Platform</span>
              </h3>
              <p>
                Toolsbar helps people navigate the fast-moving artificial intelligence ecosystem without bias. Every AI tool card links directly to the vendor's official website. We review pricing models, verified starting costs, supported platforms, strengths, and limitations so you can choose the right software for your task.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-neutral-400 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Direct links to official websites only</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Factual pricing models without invented tiers</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Independent pros, cons, and use cases</li>
              </ul>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-500" />
                <span>2. Twelve Powerful Native Utilities</span>
              </h3>
              <p>
                Unlike single-purpose directories that only link out to third-party services, Toolsbar provides 12 built-in daily utilities. From Text-to-PDF document creation to PDF merging, image compression, JSON formatting, and financial calculations, our tools run client-side in your browser with zero server data storage.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-neutral-400 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Zero cloud uploads — local browser memory execution</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Instant calculation without server queuing</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Completely free forever with no account required</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};
