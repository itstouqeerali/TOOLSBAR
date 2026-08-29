import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Sparkles, ShieldCheck, Lock, 
  HelpCircle, Info, Share2, Check, ArrowRight,
  BookOpen, Layers, Star 
} from 'lucide-react';
import { Tool } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';
import { ToolPlaceholder } from '../tools/ToolPlaceholder';
import { getCanonicalUrl } from '../../utils/seo';
import { useAuth } from '../../context/AuthContext';

interface ToolLayoutProps {
  tool: Tool;
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, onNavigate, onOpenAuth }) => {
  const { user, isFavorite, toggleFavorite, recordRecentTool } = useAuth();
  const category = CATEGORIES.find(c => c.id === tool.category);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const favorited = isFavorite(tool.slug);
  const isReady = tool.isImplemented && tool.status !== 'coming-soon';

  // Automatically record recently opened tool for authenticated user
  useEffect(() => {
    if (user && isReady) {
      recordRecentTool(tool.slug, tool.name, tool.category);
    }
  }, [user, isReady, tool.slug, tool.name, tool.category, recordRecentTool]);

  const handleFavoriteClick = () => {
    if (user) {
      toggleFavorite(tool.slug);
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  const relatedTools = (tool.relatedToolSlugs || [])
    .map(slug => TOOLS.find(t => t.slug === slug))
    .filter(Boolean) as Tool[];

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/tools/${tool.slug}` : getCanonicalUrl(`tools/${tool.slug}`);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const ToolComponent = tool.component;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="tool-page-layout">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
          <button onClick={() => onNavigate('categories')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            Categories
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
          <button onClick={() => onNavigate(`category/${tool.category}`)} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            {category?.name || tool.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
          <span className="text-slate-900 dark:text-neutral-200 font-semibold truncate max-w-[200px]">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Action */}
          <button
            onClick={handleFavoriteClick}
            id="tool-layout-favorite-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer text-xs font-medium ${
              favorited
                ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white border-slate-200 dark:border-white/10'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{favorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
          </button>

          {/* Share Action */}
          <button
            onClick={handleShare}
            id="tool-layout-share-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Tool'}</span>
          </button>
        </div>
      </div>

      {/* Tool Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25">
            {category?.name || tool.category}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
            <Lock className="w-3 h-3" /> 100% Client-Side Privacy
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          {tool.seo.h1 || tool.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-300 leading-relaxed font-normal">
          {tool.seo.intro || tool.description}
        </p>
      </div>

      {/* Visual Centerpiece: Tool Execution Shell */}
      <div className="relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          {tool.isImplemented && ToolComponent ? (
            <ToolComponent />
          ) : (
            <ToolPlaceholder tool={tool} onNavigate={onNavigate} />
          )}
        </div>
      </div>

      {/* Educational & How-to Guides */}
      {tool.seo.howToUse && tool.seo.howToUse.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200 dark:border-white/[0.08]">
          {/* How to use */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl space-y-5">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> How to use {tool.name}
            </span>

            <ol className="space-y-4">
              {tool.seo.howToUse.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Key Features & Privacy Architecture */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Key Features & Capabilities
              </span>
              {tool.seo.features && tool.seo.features.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-700 dark:text-neutral-300">
                  {tool.seo.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold select-none shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
                  All data, calculations, and conversions performed in {tool.name} happen exclusively in your local device's memory. We do not store, monitor, or transmit your inputs to external servers.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] grid grid-cols-2 gap-2.5 text-xs text-slate-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Client-side execution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Zero server logs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Free & unthrottled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      {tool.seo.faq && tool.seo.faq.length > 0 && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </span>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Everything you need to know</h2>
          </div>

          <div className="space-y-3">
            {tool.seo.faq.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 text-base font-bold ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed border-t border-slate-200 dark:border-white/[0.06] pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Related Utilities
            </span>
            <button
              onClick={() => onNavigate('tools')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              All Tools <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {relatedTools.map((t) => (
              <div
                key={t.id}
                onClick={() => onNavigate(`tools/${t.slug}`)}
                className="p-3.5 sm:p-5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/90 hover:border-indigo-400 dark:bg-white/[0.025] dark:hover:bg-white/[0.055] dark:border-white/[0.08] dark:hover:border-indigo-500/40 cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between group shadow-sm dark:shadow-none"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">{t.shortDesc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
