import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, HelpCircle, CheckCircle2, Info } from 'lucide-react';
import { Tool } from '../../types';
import { getToolPublisherData } from '../../data/toolPublisherData';

interface ToolPublisherContentProps {
  tool: Tool;
}

export const ToolPublisherContent: React.FC<ToolPublisherContentProps> = ({ tool }) => {
  const editorial = getToolPublisherData(tool);

  if (!editorial || !tool.isImplemented) {
    return (
      <article
        className="space-y-6 pt-10 border-t border-slate-200/80 dark:border-white/[0.08]"
        id="tool-publisher-content"
      >
        <div className="rounded-3xl p-6 sm:p-8 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
            <Info className="w-4 h-4 shrink-0" />
            <span>Development Roadmap Status</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {tool.name} is Currently in Development
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
            This utility is currently on our active engineering roadmap. Our team is developing a client-side component for this tool. Once implementation and testing are complete, interactive controls, step-by-step instructions, and comprehensive documentation will be published here.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="space-y-10 pt-10 border-t border-slate-200/80 dark:border-white/[0.08]"
      aria-labelledby="about-tool-heading"
      id="tool-publisher-content"
    >
      {/* 1. About This Tool */}
      <section className="rounded-3xl p-6 sm:p-10 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Comprehensive Reference
          </span>
          <h2 id="about-tool-heading" className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            About {tool.name}
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed max-w-5xl">
          <p>{editorial.about}</p>
          {editorial.formulaOrPrinciple && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Underlying Formula & Mechanics
              </span>
              <p className="text-xs sm:text-sm font-mono text-slate-800 dark:text-neutral-200">
                {editorial.formulaOrPrinciple}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 2 & 3: How to Use & Practical Use Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step-by-Step Instructions */}
        {tool.seo.howToUse && tool.seo.howToUse.length > 0 && (
          <section className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Practical Guide
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  How to Use {tool.name}
                </h3>
              </div>

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

            <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant feedback with automatic real-time calculation</span>
            </div>
          </section>
        )}

        {/* Practical Everyday Use Cases */}
        <section className={`rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-6 flex flex-col justify-between ${tool.seo.howToUse && tool.seo.howToUse.length > 0 ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Everyday Applications
              </span>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Practical Use Cases & Examples
              </h3>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-700 dark:text-neutral-300">
              {editorial.useCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-3 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>No account required — 100% free utility</span>
          </div>
        </section>
      </div>

      {/* 4. Key Capabilities & Technical Features */}
      {tool.seo.features && tool.seo.features.length > 0 && (
        <section className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Capabilities & Standards
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Key Features of {tool.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.seo.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-neutral-300 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Helpful notes / Advisory */}
          {editorial.helpfulNotes && editorial.helpfulNotes.length > 0 && (
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/30 text-xs sm:text-sm text-slate-700 dark:text-indigo-200/90 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-indigo-700 dark:text-indigo-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>Helpful Technical & Practical Notes</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc">
                {editorial.helpfulNotes.map((note, idx) => (
                  <li key={idx} className="leading-relaxed">{note}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 5. Frequently Asked Questions (Fully indexable, semantic HTML) */}
      {tool.seo.faq && tool.seo.faq.length > 0 && (
        <section className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm space-y-6" aria-labelledby="faq-heading">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </span>
            <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Everything You Need to Know About {tool.name}
            </h2>
          </div>

          <div className="space-y-3">
            {tool.seo.faq.map((item, idx) => (
              <details
                key={idx}
                open={idx === 0}
                className="group rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] overflow-hidden transition-colors"
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
    </article>
  );
};
