import React, { useState } from 'react';
import { Copy, Check, RotateCcw, FileText, Download, Sparkles, Filter, ArrowRight } from 'lucide-react';

export const RemoveDuplicateLines: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
`apple
banana
orange
apple
banana
grape
kiwi
apple
mango
orange`
  );

  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [keepMode, setKeepMode] = useState<'first' | 'last'>('first');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  // Process lines
  const rawLines = inputText.split('\n');
  const totalLines = rawLines.length;

  let workingLines = [...rawLines];

  if (trimLines) {
    workingLines = workingLines.map(l => l.trim());
  }

  if (removeEmptyLines) {
    workingLines = workingLines.filter(l => l.length > 0);
  }

  // Deduplicate
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  const listToIterate = keepMode === 'first' ? workingLines : [...workingLines].reverse();

  for (const line of listToIterate) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLines.push(line);
    }
  }

  if (keepMode === 'last') {
    uniqueLines.reverse();
  }

  if (sortOrder === 'asc') {
    uniqueLines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
  } else if (sortOrder === 'desc') {
    uniqueLines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
  }

  const outputText = uniqueLines.join('\n');
  const uniqueCount = uniqueLines.length;
  const duplicatesRemoved = Math.max(0, totalLines - uniqueCount);
  const reductionPercent = totalLines > 0 ? ((duplicatesRemoved / totalLines) * 100) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deduplicated_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="remove-duplicate-lines-tool">
      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Case Sensitive
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Trim Whitespace
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Remove Blank Lines
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-black/40 text-white border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="none">Preserve Order</option>
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
        </div>
      </div>

      {/* Main Dual-Column Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Textarea */}
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Input Text List
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {totalLines} {totalLines === 1 ? 'line' : 'lines'}
              </span>
            </div>

            <textarea
              rows={14}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste lines of text here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setInputText('')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Input
            </button>

            <button
              onClick={() => setInputText(`apple\nbanana\norange\napple\nbanana\ngrape\nkiwi\napple\nmango\norange`)}
              className="text-xs text-indigo-400 hover:text-indigo-300 py-1.5 px-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
              Sample Data
            </button>
          </div>
        </div>

        {/* Output Textarea */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Unique Output
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {uniqueCount} unique
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                  -{duplicatesRemoved} dupes ({reductionPercent.toFixed(0)}%)
                </span>
              </div>
            </div>

            <textarea
              readOnly
              rows={14}
              value={outputText}
              placeholder="Deduplicated output will appear here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-100 placeholder-neutral-500 focus:outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={uniqueCount === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Clean List!' : 'Copy Unique Lines'}
            </button>
            <button
              onClick={handleDownload}
              disabled={uniqueCount === 0}
              title="Download as .txt"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
