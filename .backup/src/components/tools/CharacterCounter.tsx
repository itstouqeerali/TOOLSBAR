import React, { useState, useMemo } from 'react';
import { 
  Type, Copy, Check, RotateCcw, Share2, 
  Layers, MessageSquare, Globe, Hash
} from 'lucide-react';

interface PlatformLimit {
  id: string;
  name: string;
  limit: number;
  iconName: string;
  color: string;
  type: 'hard' | 'recommended';
}

const PLATFORMS: PlatformLimit[] = [
  { id: 'twitter', name: 'X / Twitter Post', limit: 280, iconName: 'Twitter', color: 'indigo', type: 'hard' },
  { id: 'instagram_caption', name: 'Instagram Caption', limit: 2200, iconName: 'Instagram', color: 'pink', type: 'hard' },
  { id: 'instagram_bio', name: 'Instagram Bio', limit: 150, iconName: 'User', color: 'purple', type: 'hard' },
  { id: 'linkedin_post', name: 'LinkedIn Post', limit: 3000, iconName: 'Linkedin', color: 'blue', type: 'hard' },
  { id: 'seo_title', name: 'SEO Meta Title', limit: 60, iconName: 'Globe', color: 'emerald', type: 'recommended' },
  { id: 'seo_desc', name: 'SEO Meta Description', limit: 160, iconName: 'FileText', color: 'cyan', type: 'recommended' },
  { id: 'sms', name: 'SMS Standard Segment', limit: 160, iconName: 'MessageSquare', color: 'amber', type: 'hard' },
];

export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState<string>('Streamline your digital workflow with Toolsbar: fast, private, browser-first tools designed for everyday efficiency.');
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const totalChars = text.length;
    const noSpaces = text.replace(/\s+/g, '').length;
    const spaces = (text.match(/\s/g) || []).length;
    const letters = (text.match(/\p{L}/gu) || []).length;
    const numbers = (text.match(/\p{N}/gu) || []).length;
    const punctuation = (text.match(/[.,/#!$%^&*;:{}=\-_`~()?"'@+<>]/g) || []).length;
    const lines = text.split(/\r\n|\r|\n/).length;

    // UTF-8 Byte Size
    const encoder = new TextEncoder();
    const byteLength = encoder.encode(text).length;

    // SMS segments (160 for 1st, 153 for concatenated)
    let smsSegments = 1;
    if (totalChars > 160) {
      smsSegments = Math.ceil(totalChars / 153);
    } else if (totalChars === 0) {
      smsSegments = 0;
    }

    return {
      totalChars,
      noSpaces,
      spaces,
      letters,
      numbers,
      punctuation,
      lines,
      byteLength,
      smsSegments,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="character-counter-tool">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-indigo-600/15 border border-indigo-500/40 backdrop-blur-xl">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Total Characters</span>
          <div className="text-3xl font-black font-display text-white mt-1">{stats.totalChars.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl">
          <span className="text-xs font-medium text-neutral-400">Without Spaces</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.noSpaces.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl">
          <span className="text-xs font-medium text-neutral-400">Letters Only</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.letters.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl">
          <span className="text-xs font-medium text-neutral-400">Digits / Numbers</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.numbers.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl">
          <span className="text-xs font-medium text-neutral-400">Punctuation</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.punctuation.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl">
          <span className="text-xs font-medium text-neutral-400">UTF-8 Size</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.byteLength} <span className="text-xs text-neutral-400">bytes</span></div>
        </div>
      </div>

      {/* Editor & Social Limit Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Text Input Area */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-400" /> Real-time Character Analysis
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setText('')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to track character limits, social media thresholds, and byte sizes..."
            rows={10}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
            <div className="text-xs text-neutral-400">
              Lines: <span className="text-white font-bold">{stats.lines}</span> &bull; Spaces: <span className="text-white font-bold">{stats.spaces}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>

        {/* Platform Limits Gauge List */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Social & Platform Limits
            </span>
            <span className="text-[11px] text-neutral-500 font-normal">Live Tracking</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {PLATFORMS.map((platform) => {
              const current = stats.totalChars;
              const max = platform.limit;
              const remaining = max - current;
              const percentage = Math.min(100, Math.round((current / max) * 100));
              const isOver = remaining < 0;

              return (
                <div key={platform.id} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{platform.name}</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className={isOver ? 'text-rose-400 font-bold' : 'text-neutral-300'}>
                        {current}
                      </span>
                      <span className="text-neutral-500">/ {max}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-bold ${
                        isOver
                          ? 'bg-rose-500/20 text-rose-300'
                          : remaining <= 20
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {isOver ? `${Math.abs(remaining)} over` : `${remaining} left`}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : percentage > 85
                          ? 'bg-amber-400'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
