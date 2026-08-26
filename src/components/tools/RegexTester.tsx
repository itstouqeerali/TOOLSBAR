import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Search, Sparkles, AlertCircle, Code2, Replace } from 'lucide-react';

interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  sample: string;
}

const PRESETS: RegexPreset[] = [
  {
    name: 'Email Address',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    sample: 'Contact us at support@toolsbar.dev or alex.vance@example.org for info.'
  },
  {
    name: 'URLs / Hyperlinks',
    pattern: 'https?:\\/\\/[^\\s/$.?#].[^\\s]*',
    flags: 'gi',
    sample: 'Check https://toolsbar.dev and https://github.com/toolsbar for details.'
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    flags: 'g',
    sample: 'Server 1: 192.168.1.1, DNS: 8.8.8.8, Gateway: 10.0.0.1'
  },
  {
    name: 'Hex Color Codes',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'gi',
    sample: 'Colors: #6366f1 (Indigo), #10b981 (Emerald), #fff (White)'
  },
  {
    name: 'ISO Date (YYYY-MM-DD)',
    pattern: '\\b\\d{4}-\\d{2}-\\d{2}\\b',
    flags: 'g',
    sample: 'Milestone 1: 2026-03-15, Release Date: 2026-08-25'
  }
];

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false
  });
  const [testText, setTestText] = useState<string>(
    'Feel free to contact support@toolsbar.dev or contact.team@example.com for assistance with our 30+ browser utilities.'
  );
  const [replaceText, setReplaceText] = useState<string>('[REDACTED_EMAIL]');
  const [showReplace, setShowReplace] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const flagStr = `${flags.g ? 'g' : ''}${flags.i ? 'i' : ''}${flags.m ? 'm' : ''}${flags.s ? 's' : ''}`;

  let regex: RegExp | null = null;
  let regexError: string | null = null;
  let matches: Array<{ match: string; index: number; groups: string[] }> = [];

  try {
    if (pattern) {
      regex = new RegExp(pattern, flagStr);
      if (testText) {
        if (flags.g) {
          let m: RegExpExecArray | null;
          // Avoid infinite loops on zero-length matches
          let lastIdx = -1;
          while ((m = regex.exec(testText)) !== null) {
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.slice(1)
            });
            if (regex.lastIndex === lastIdx) break;
            lastIdx = regex.lastIndex;
            if (m[0] === '') regex.lastIndex++;
          }
        } else {
          const m = regex.exec(testText);
          if (m) {
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.slice(1)
            });
          }
        }
      }
    }
  } catch (err: any) {
    regexError = err.message || 'Invalid regular expression';
  }

  // Substitution replacement output
  let replacedOutput = '';
  if (regex && !regexError) {
    try {
      replacedOutput = testText.replace(regex, replaceText);
    } catch {
      replacedOutput = '';
    }
  }

  const handleCopyMatches = () => {
    const list = matches.map((m, i) => `#${i + 1} (idx ${m.index}): "${m.match}"`).join('\n');
    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="regex-tester-tool">
      {/* Pattern Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
            <Search className="w-4 h-4" /> Regular Expression Pattern
          </span>

          {/* Flags Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">Flags:</span>
            {(['g', 'i', 'm', 's'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFlags({ ...flags, [f]: !flags[f] })}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                  flags[f]
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-black/30 border-white/10 text-neutral-500 hover:text-white'
                }`}
                title={`Flag /${f}/`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Input Box */}
        <div className="relative flex items-center">
          <span className="absolute left-4 font-mono text-lg text-indigo-400 select-none">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern here..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-8 pr-16 py-3.5 text-base font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <span className="absolute right-4 font-mono text-sm text-indigo-400 select-none">/{flagStr}</span>
        </div>

        {regexError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{regexError}</span>
          </div>
        )}

        {/* Common Pattern Presets */}
        <div>
          <span className="text-xs text-neutral-400 block mb-2">Preset Patterns:</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPattern(p.pattern);
                  setTestText(p.sample);
                  setFlags({
                    g: p.flags.includes('g'),
                    i: p.flags.includes('i'),
                    m: p.flags.includes('m'),
                    s: p.flags.includes('s')
                  });
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test String & Matches Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Test String Area */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Test Target String
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {testText.length} characters
              </span>
            </div>

            <textarea
              rows={8}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter or paste text to run regex match against..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />

            {/* Substitution Toggle */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowReplace(!showReplace)}
                  className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Replace className="w-3.5 h-3.5" />
                  <span>{showReplace ? 'Hide' : 'Test'} String Substitution / Replacement</span>
                </button>
              </div>

              {showReplace && (
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Replacement pattern (e.g. $1, [REDACTED])..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs font-mono text-neutral-300 break-all">
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold mb-1">Replaced Result:</span>
                    {replacedOutput}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              onClick={() => setTestText('')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear String
            </button>
          </div>
        </div>

        {/* Matches Explorer */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Matches & Capture Groups
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25">
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                </span>
              </div>

              {matches.length > 0 ? (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 font-mono">Match #{idx + 1}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">Index {m.index}</span>
                      </div>
                      <div className="text-xs font-mono text-white bg-white/5 p-2 rounded-lg break-all select-all font-semibold">
                        {m.match}
                      </div>
                      {m.groups.length > 0 && (
                        <div className="text-[11px] font-mono text-neutral-400 pt-1 space-y-0.5">
                          {m.groups.map((g, gIdx) => (
                            <div key={gIdx}>
                              <span className="text-indigo-400">Group {gIdx + 1}:</span> {g}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  {regexError ? 'Fix pattern error to see matches.' : 'No matches found in the test string.'}
                </div>
              )}
            </div>

            {matches.length > 0 && (
              <div className="pt-6 border-t border-white/10 mt-4">
                <button
                  onClick={handleCopyMatches}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Match List!' : 'Copy All Matches'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
