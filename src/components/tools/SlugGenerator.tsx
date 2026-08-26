import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Link2, Globe, Sparkles, Wand2 } from 'lucide-react';

const COMMON_STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
  'when', 'where', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
  'now', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under',
  'is', 'it', 'of'
]);

export const SlugGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('The Ultimate Guide to 10x Web Performance & SEO in 2026!');
  const [separator, setSeparator] = useState<string>('-');
  const [casing, setCasing] = useState<'lower' | 'upper' | 'preserve'>('lower');
  const [removeStopWords, setRemoveStopWords] = useState<boolean>(false);
  const [maxLength, setMaxLength] = useState<number>(80);
  const [customDomain, setCustomDomain] = useState<string>('https://toolsbar.dev/blog/');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate slug
  const generateSlug = (text: string): string => {
    if (!text) return '';

    // 1. Normalize unicode accents (é -> e, etc.)
    let s = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 2. Case handling
    if (casing === 'lower') s = s.toLowerCase();
    else if (casing === 'upper') s = s.toUpperCase();

    // 3. Remove stop words if enabled
    if (removeStopWords) {
      const words = s.split(/\s+/);
      s = words.filter(w => !COMMON_STOP_WORDS.has(w.toLowerCase().replace(/[^a-z0-9]/g, ''))).join(' ');
    }

    // 4. Replace special characters & punctuation with spaces
    s = s.replace(/[^a-zA-Z0-9\s]/g, ' ');

    // 5. Replace multiple spaces with single separator
    const words = s.trim().split(/\s+/).filter(w => w.length > 0);
    let slug = words.join(separator);

    // 6. Max length without chopping in middle of word if possible
    if (maxLength > 0 && slug.length > maxLength) {
      slug = slug.substring(0, maxLength);
      const lastSep = slug.lastIndexOf(separator);
      if (lastSep > 0) {
        slug = slug.substring(0, lastSep);
      }
    }

    return slug;
  };

  const slug = generateSlug(inputText);
  const fullUrl = `${customDomain.endsWith('/') ? customDomain : customDomain + '/'}${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="slug-generator-tool">
      {/* Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-300">Separator:</label>
          <div className="flex gap-1">
            {[
              { val: '-', label: 'Hyphen (-)' },
              { val: '_', label: 'Underscore (_)' },
              { val: '.', label: 'Dot (.)' },
              { val: '/', label: 'Slash (/)' },
            ].map(s => (
              <button
                key={s.val}
                onClick={() => setSeparator(s.val)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  separator === s.val
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Remove Stop Words (SEO)
          </label>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Max Length:</span>
            <input
              type="number"
              min="10"
              max="200"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-16 bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Source Title / Headline
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Enter your article title, product name, or phrase:
              </label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. 10 Best Productivity Tools for Designers in 2026!"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Quick Sample Presets */}
            <div>
              <span className="text-xs text-neutral-400 block mb-2">Try Sample Titles:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'How to Build Modern Fullstack Web Apps in 2026',
                  'Café & Crème Brûlée: The French Pastry Handbook',
                  '15 Tips & Tricks for Supercharged React Apps',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer truncate max-w-xs"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setInputText('')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Output Showcase */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Clean SEO Slug
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25">
                  {slug.length} characters
                </span>
              </div>

              {slug ? (
                <div className="space-y-4">
                  {/* Big Slug Box */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 break-all font-mono text-lg sm:text-xl font-bold text-emerald-400 select-all">
                    {slug}
                  </div>

                  {/* URL Simulation */}
                  <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Live URL Preview:</span>
                    </div>
                    <div className="text-xs font-mono text-neutral-300 break-all select-all">
                      <span className="text-neutral-500">{customDomain.endsWith('/') ? customDomain : customDomain + '/'}</span>
                      <span className="text-indigo-300 font-bold">{slug}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  Type a title or phrase to generate an instant clean slug.
                </div>
              )}
            </div>

            {slug && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Slug!' : 'Copy Slug'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
