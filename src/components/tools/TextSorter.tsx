import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ArrowUpDown, Download, Shuffle, Sparkles } from 'lucide-react';

type SortMethod = 
  | 'alpha_asc' 
  | 'alpha_desc' 
  | 'natural' 
  | 'numerical_asc' 
  | 'numerical_desc' 
  | 'length_asc' 
  | 'length_desc' 
  | 'reverse' 
  | 'shuffle';

export const TextSorter: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
`Zebra
Apple 10
Banana
Apple 2
Orange
apple 1
Grape
Mango
Apple 20`
  );

  const [sortMethod, setSortMethod] = useState<SortMethod>('natural');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // Process sorting
  const rawLines = inputText.split('\n');
  let lines = [...rawLines];

  if (trimLines) {
    lines = lines.map(l => l.trim());
  }

  if (removeDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter(l => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Sort logic
  switch (sortMethod) {
    case 'alpha_asc':
      lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
      break;
    case 'alpha_desc':
      lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
      break;
    case 'natural':
      lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: caseSensitive ? 'variant' : 'base' }));
      break;
    case 'numerical_asc':
      lines.sort((a, b) => {
        const numA = parseFloat(a.replace(/[^0-9.-]+/g, '')) || 0;
        const numB = parseFloat(b.replace(/[^0-9.-]+/g, '')) || 0;
        return numA - numB;
      });
      break;
    case 'numerical_desc':
      lines.sort((a, b) => {
        const numA = parseFloat(a.replace(/[^0-9.-]+/g, '')) || 0;
        const numB = parseFloat(b.replace(/[^0-9.-]+/g, '')) || 0;
        return numB - numA;
      });
      break;
    case 'length_asc':
      lines.sort((a, b) => a.length - b.length || a.localeCompare(b));
      break;
    case 'length_desc':
      lines.sort((a, b) => b.length - a.length || a.localeCompare(b));
      break;
    case 'reverse':
      lines.reverse();
      break;
    case 'shuffle':
      // Fisher-Yates shuffle
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      break;
  }

  const outputText = lines.join('\n');

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
    a.download = 'sorted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="text-sorter-tool">
      {/* Sort Method Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-300">Sort Algorithm:</label>
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value as SortMethod)}
            className="bg-black/40 text-white text-xs border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="natural">Natural Sort (handles numbers e.g. File 1, File 2, File 10)</option>
            <option value="alpha_asc">Alphabetical (A $\to$ Z)</option>
            <option value="alpha_desc">Alphabetical (Z $\to$ A)</option>
            <option value="numerical_asc">Numerical Value (Lowest to Highest)</option>
            <option value="numerical_desc">Numerical Value (Highest to Lowest)</option>
            <option value="length_asc">Line Length (Shortest to Longest)</option>
            <option value="length_desc">Line Length (Longest to Shortest)</option>
            <option value="reverse">Reverse Line Order</option>
            <option value="shuffle">Random Shuffle</option>
          </select>

          {sortMethod === 'shuffle' && (
            <button
              onClick={() => setShuffleSeed(s => s + 1)}
              className="p-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs flex items-center gap-1 cursor-pointer"
              title="Reshuffle"
            >
              <Shuffle className="w-3.5 h-3.5" /> Re-shuffle
            </button>
          )}
        </div>

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
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Remove Duplicates
          </label>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input */}
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" /> Unsorted Lines
              </span>
              <span className="text-xs font-mono text-neutral-400">{rawLines.length} lines</span>
            </div>

            <textarea
              rows={14}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste lines of text to sort..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setInputText('')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>

            <button
              onClick={() => setInputText(`Zebra\nApple 10\nBanana\nApple 2\nOrange\napple 1\nGrape\nMango\nApple 20`)}
              className="text-xs text-indigo-400 hover:text-indigo-300 py-1.5 px-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
              Sample Data
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Sorted Output
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{lines.length} lines</span>
            </div>

            <textarea
              readOnly
              rows={14}
              value={outputText}
              placeholder="Sorted text will appear here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-100 placeholder-neutral-500 focus:outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={lines.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Sorted Text!' : 'Copy Sorted List'}
            </button>
            <button
              onClick={handleDownload}
              disabled={lines.length === 0}
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
