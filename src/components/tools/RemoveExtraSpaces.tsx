import React, { useState } from 'react';
import { Copy, Check, RotateCcw, AlignLeft, Download, Sparkles, Wand2 } from 'lucide-react';

export const RemoveExtraSpaces: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
`   This   is   an  example    text with   unwanted    spaces.   

   It   contains multiple   consecutive   spaces, leading  and trailing whitespace.  

	Tabs	and	extra	empty	lines	can	be cleaned up instantly.   `
  );

  const [collapseSpaces, setCollapseSpaces] = useState<boolean>(true);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [removeBlankLines, setRemoveBlankLines] = useState<boolean>(true);
  const [convertTabsToSpaces, setConvertTabsToSpaces] = useState<boolean>(true);
  const [singleLineMode, setSingleLineMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Process text
  let output = inputText;

  if (convertTabsToSpaces) {
    output = output.replace(/\t+/g, ' ');
  }

  if (collapseSpaces) {
    // Replace 2 or more horizontal spaces with single space
    output = output.replace(/[^\S\r\n]+/g, ' ');
  }

  if (trimLines) {
    output = output
      .split('\n')
      .map(l => l.trim())
      .join('\n');
  }

  if (removeBlankLines) {
    output = output
      .split('\n')
      .filter(l => l.length > 0)
      .join('\n');
  }

  if (singleLineMode) {
    output = output.replace(/\r?\n+/g, ' ').trim();
  }

  const originalChars = inputText.length;
  const cleanChars = output.length;
  const charsSaved = Math.max(0, originalChars - cleanChars);
  const percentSaved = originalChars > 0 ? ((charsSaved / originalChars) * 100) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="remove-extra-spaces-tool">
      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={collapseSpaces}
              onChange={(e) => setCollapseSpaces(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Collapse Multiple Spaces
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Trim Line Ends
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeBlankLines}
              onChange={(e) => setRemoveBlankLines(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Remove Blank Lines
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={convertTabsToSpaces}
              onChange={(e) => setConvertTabsToSpaces(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Tabs $\to$ Space
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={singleLineMode}
              onChange={(e) => setSingleLineMode(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Join All to 1 Line
          </label>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input */}
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <AlignLeft className="w-4 h-4" /> Raw Input
              </span>
              <span className="text-xs font-mono text-neutral-400">{originalChars} characters</span>
            </div>

            <textarea
              rows={14}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text with irregular spacing here..."
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
              onClick={() => setInputText(`   This   is   an  example    text with   unwanted    spaces.   \n\n   It   contains multiple   consecutive   spaces, leading  and trailing whitespace.  \n\n\tTabs\tand\textra\tempty\tlines\tcan\tbe cleaned up instantly.   `)}
              className="text-xs text-indigo-400 hover:text-indigo-300 py-1.5 px-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
              Sample Text
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> Cleaned Text
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {cleanChars} characters
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                  -{charsSaved} spaces ({percentSaved.toFixed(0)}%)
                </span>
              </div>
            </div>

            <textarea
              readOnly
              rows={14}
              value={output}
              placeholder="Cleaned output with regular spacing..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-100 placeholder-neutral-500 focus:outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={cleanChars === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Clean Text!' : 'Copy Cleaned Text'}
            </button>
            <button
              onClick={handleDownload}
              disabled={cleanChars === 0}
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
