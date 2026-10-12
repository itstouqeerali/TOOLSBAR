import React, { useState } from 'react';
import { 
  ChevronRight, ExternalLink, ArrowRight, CheckCircle2, 
  AlertCircle, ShieldCheck, Tag, Laptop, DollarSign, 
  Calendar, Layers, Sparkles, Check, HelpCircle, ArrowLeft,
  XCircle, ThumbsUp, Users, Info
} from 'lucide-react';
import { AiTool } from '../../types/aiTools';
import { getAiCategoryBySlug } from '../../data/aiCategories';
import { getAiToolBySlug } from '../../data/aiToolsData';
import { AiToolLogo } from '../common/AiToolLogo';

interface AiToolDetailViewProps {
  tool: AiTool;
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const AiToolDetailView: React.FC<AiToolDetailViewProps> = ({ tool, onNavigate }) => {
  const category = getAiCategoryBySlug(tool.primaryCategory);

  const getPricingBadge = (pricingType: string) => {
    switch (pricingType) {
      case 'free':
        return { label: 'Free', bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20' };
      case 'freemium':
        return { label: 'Freemium', bg: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/20' };
      case 'paid':
        return { label: 'Paid Subscription', bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20' };
      case 'free-trial':
        return { label: 'Free Trial Available', bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20' };
      default:
        return { label: 'Contact Sales', bg: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-white/10' };
    }
  };

  const pricingBadge = getPricingBadge(tool.pricingType);

  const alternatives = (tool.alternatives || [])
    .map((altSlug) => getAiToolBySlug(altSlug))
    .filter(Boolean) as AiTool[];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="ai-tool-detail-view">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('')} 
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
          <button 
            onClick={() => onNavigate('ai-tools')} 
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            AI Tools
          </button>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
              <button 
                onClick={() => onNavigate(`ai-tools/${category.slug}`)} 
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {category.name}
              </button>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
          <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px]">
            {tool.name}
          </span>
        </div>

        <button
          onClick={() => onNavigate('ai-tools')}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </button>
      </div>

      {/* Hero Card */}
      <section className="animate-fade-in-up rounded-3xl p-6 sm:p-10 glass-panel border border-slate-200/90 dark:border-white/10 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            {/* Square Logo Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-white/10 flex items-center justify-center p-3 sm:p-3.5 shrink-0 shadow-md">
              <AiToolLogo slug={tool.slug} name={tool.name} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                  {tool.name}
                </h1>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${pricingBadge.bg}`}>
                  {pricingBadge.label}
                </span>
                {category && (
                  <button
                    onClick={() => onNavigate(`ai-tools/${category.slug}`)}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 transition-colors"
                  >
                    {category.name}
                  </button>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-100 cursor-pointer"
            >
              <span className="text-white font-semibold">Visit Official Website</span>
              <ExternalLink className="w-4 h-4 text-white shrink-0" />
            </a>
            {tool.pricingUrl && (
              <a
                href={tool.pricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>View Official Pricing Page</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Metadata Pill Ribbon */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Information verified: <strong>{tool.lastVerifiedAt}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-indigo-500" />
            <span>Supported Platforms: <strong>{tool.platforms.join(', ')}</strong></span>
          </div>

          {tool.startingPrice && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              <span>Starting from: <strong>{tool.startingPrice}</strong></span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Free Tier: <strong>{tool.hasFreePlan ? 'Yes' : 'No'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Free Trial: <strong>{tool.hasFreeTrial ? 'Yes' : 'No'}</strong></span>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Comprehensive Editorial Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. What is this tool? */}
          <section className="rounded-3xl p-6 sm:p-8 glass-panel space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              What is {tool.name}?
            </h2>
            <div className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed space-y-4">
              {tool.fullDescription.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* 2. What is it Best For? */}
          {tool.bestFor && tool.bestFor.length > 0 && (
            <section className="rounded-3xl p-6 sm:p-8 glass-panel space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" /> Ideal Workflows
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                What is {tool.name} Best For?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {tool.bestFor.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/30 text-xs sm:text-sm text-slate-800 dark:text-indigo-200 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      ★
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Key Capabilities & Features */}
          <section className="rounded-3xl p-6 sm:p-8 glass-panel space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Key Features & Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {tool.keyFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl glass-card text-xs sm:text-sm text-slate-700 dark:text-neutral-300 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Strengths & Limitations Matrix */}
          <section className="rounded-3xl p-6 sm:p-8 glass-panel space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Strengths & Potential Limitations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="space-y-3 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Advantages & Strengths</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-emerald-100/90">
                  {tool.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="space-y-3 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/30">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>Trade-offs & Considerations</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-amber-100/90">
                  {tool.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Real-World Practical Use Cases */}
          {tool.useCases && tool.useCases.length > 0 && (
            <section className="rounded-3xl p-6 sm:p-8 glass-panel space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                Practical Everyday Use Cases
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-neutral-300">
                {tool.useCases.map((uc, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 6. Frequently Asked Questions */}
          {tool.faq && tool.faq.length > 0 && (
            <section className="rounded-3xl p-6 sm:p-8 glass-panel space-y-5" aria-labelledby="faq-heading">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Independent FAQ
                </span>
                <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Frequently Asked Questions About {tool.name}
                </h2>
              </div>

              <div className="space-y-3">
                {tool.faq.map((item, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="group rounded-2xl glass-card overflow-hidden transition-colors"
                  >
                    <summary className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer list-none select-none">
                      <span>{item.question}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold ml-2 shrink-0 transition-transform duration-200 group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed border-t border-slate-200 dark:border-white/[0.06] pt-3">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sidebar (Pricing, Alternatives, Meta) (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing Overview Box */}
          <div className="rounded-3xl p-6 glass-panel space-y-4 border border-slate-200/90 dark:border-white/10">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              <span>Pricing & Plans</span>
            </h3>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Pricing Model
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {pricingBadge.label} {tool.startingPrice ? `• ${tool.startingPrice}` : ''}
                </p>
              </div>

              {tool.pricingSummary ? (
                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  {tool.pricingSummary}
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Pricing tiers, token limits, and enterprise custom plans vary. Check the official pricing page for up-to-date quotes.
                </p>
              )}

              <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Free Plan:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{tool.hasFreePlan ? 'Available' : 'None'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Free Trial:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{tool.hasFreeTrial ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {tool.pricingUrl ? (
                <a
                  href={tool.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-all border border-slate-200 dark:border-white/10"
                >
                  <span>Check Current Official Pricing</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ) : (
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-all border border-slate-200 dark:border-white/10"
                >
                  <span>See Pricing on Official Site</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Target Audience */}
          {tool.targetAudience && tool.targetAudience.length > 0 && (
            <div className="rounded-3xl p-6 glass-panel space-y-3 border border-slate-200/90 dark:border-white/10">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Who Should Use It?</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tool.targetAudience.map((aud, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/[0.06]"
                  >
                    {aud}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Alternative AI Tools */}
          {alternatives.length > 0 && (
            <div className="rounded-3xl p-6 glass-panel space-y-4 border border-slate-200/90 dark:border-white/10">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Alternative Tools to Consider</span>
              </h3>
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => onNavigate(`ai-tools/${alt.slug}`)}
                    className="p-3 rounded-2xl glass-card cursor-pointer group flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                        {alt.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1">
                        {alt.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Independent Editorial Disclosure */}
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-2 text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-neutral-300">
              <Info className="w-3.5 h-3.5" />
              <span>Independent Disclosure</span>
            </div>
            <p>
              Toolsbar provides independent, factual overviews of third-party artificial intelligence products. We do not host, sell, or operate {tool.name}. Product names, trademarks, and pricing remain the property of their respective owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
