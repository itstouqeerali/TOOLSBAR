import React, { useState, useMemo } from 'react';
import { 
  Code2, Copy, Check, Download, RotateCcw, 
  Sparkles, Minimize2, FileCode, Sliders, Info
} from 'lucide-react';
import jsBeautify from 'js-beautify';

const SAMPLE_CSS = `:root {
  --primary-color: #10b981;
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  --font-stack: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Base Body Styles */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-stack);
  background: var(--bg-gradient);
  color: #f8fafc;
  -webkit-font-smoothing: antialiased;
}

.hero-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-image: url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80");
  background-size: cover;
  background-position: center;
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

@media (min-width: 768px) {
  .hero-banner {
    padding: 6rem 4rem;
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@supports (backdrop-filter: blur(16px)) {
  .glass-card {
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}`;

export const CssFormatter: React.FC = () => {
  const [inputCss, setInputCss] = useState<string>(SAMPLE_CSS);
  const [outputCss, setOutputCss] = useState<string>('');
  const [indentType, setIndentType] = useState<'2' | '4' | 'tab'>('2');
  const [preserveNewlines, setPreserveNewlines] = useState<boolean>(true);
  const [lastAction, setLastAction] = useState<'format' | 'minify' | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Metrics
  const stats = useMemo(() => {
    const inputBytes = new Blob([inputCss]).size;
    const inputChars = inputCss.length;
    
    const activeOutput = outputCss || inputCss;
    const outputBytes = new Blob([activeOutput]).size;
    const outputChars = activeOutput.length;
    
    const byteDiff = outputBytes - inputBytes;
    const charDiff = outputChars - inputChars;
    const percentage = inputBytes > 0 ? ((outputBytes - inputBytes) / inputBytes) * 100 : 0;

    return {
      inputBytes,
      inputChars,
      outputBytes,
      outputChars,
      byteDiff,
      charDiff,
      percentage: Number(percentage.toFixed(1))
    };
  }, [inputCss, outputCss]);

  // Safe CSS Minifier that preserves strings and URLs completely
  const performMinifyCss = (css: string): string => {
    if (!css.trim()) return '';

    // Step 1: Extract string literals and url(...) contents to avoid corrupting quotes or colons
    const preservedTokens: string[] = [];
    let tokenIndex = 0;

    // Matches strings ("...", '...') and url(...)
    const tokenRegex = /(["'])(?:(?=(\\?))\2[\s\S])*?\1|url\((?:[^()]+|\([^()]*\))*\)/g;
    
    const tokenized = css.replace(tokenRegex, (match) => {
      const placeholder = `___CSS_TOKEN_${tokenIndex}___`;
      preservedTokens.push(match);
      tokenIndex++;
      return placeholder;
    });

    // Step 2: Minify the sanitized CSS syntax
    let minified = tokenized
      // Remove comments /* ... */
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove whitespace around symbols { } : ; , > ~ +
      .replace(/\s*([\{\}\:\;\,\>\~\+])\s*/g, '$1')
      // Remove trailing semicolons before closing brace
      .replace(/;}/g, '}')
      // Remove spaces around parentheses in calculations
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .trim();

    // Step 3: Restore preserved strings and URLs
    preservedTokens.forEach((token, idx) => {
      minified = minified.replace(`___CSS_TOKEN_${idx}___`, token);
    });

    return minified;
  };

  const handleFormat = () => {
    if (!inputCss.trim()) {
      setOutputCss('');
      setLastAction(null);
      return;
    }

    try {
      const indentSize = indentType === 'tab' ? 1 : parseInt(indentType, 10);
      const indentChar = indentType === 'tab' ? '\t' : ' ';

      const formatted = jsBeautify.css(inputCss, {
        indent_size: indentSize,
        indent_char: indentChar,
        preserve_newlines: preserveNewlines,
        max_preserve_newlines: 2,
        space_around_combinator: true,
        newline_between_rules: true,
        selector_separator_newline: true
      });

      setOutputCss(formatted);
      setLastAction('format');
      setNotice('CSS formatted with standard nesting and rule separation.');
    } catch (err: any) {
      setNotice(`Format notice: ${err?.message || 'Processed with fallback'}`);
      setOutputCss(inputCss);
    }
  };

  const handleMinify = () => {
    if (!inputCss.trim()) {
      setOutputCss('');
      setLastAction(null);
      return;
    }

    const minified = performMinifyCss(inputCss);
    setOutputCss(minified);
    setLastAction('minify');
    setNotice('CSS minified safely while preserving font names, URLs, and custom properties.');
  };

  const handleCopy = async () => {
    const textToCopy = outputCss || inputCss;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const content = outputCss || inputCss;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = lastAction === 'minify' ? 'styles.min.css' : 'styles.formatted.css';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputCss('');
    setOutputCss('');
    setLastAction(null);
    setNotice(null);
  };

  const handleLoadSample = () => {
    setInputCss(SAMPLE_CSS);
    setOutputCss('');
    setLastAction(null);
    setNotice('Sample CSS loaded.');
  };

  return (
    <div className="w-full space-y-6">
      {/* Privacy and Technical Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>100% Client-Side Processing:</strong> CSS is transformed in browser memory. Supports CSS3, @media, @supports, keyframes, and CSS variables.
          </span>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap transition-colors"
        >
          Load Sample CSS
        </button>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left Options */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Indentation:</span>
            <div className="flex items-center rounded-lg bg-slate-800/80 border border-slate-700/60 p-0.5">
              <button
                type="button"
                onClick={() => setIndentType('2')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  indentType === '2' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => setIndentType('4')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  indentType === '4' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                4 Spaces
              </button>
              <button
                type="button"
                onClick={() => setIndentType('tab')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  indentType === 'tab' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabs
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preserveNewlines}
              onChange={(e) => setPreserveNewlines(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Preserve Line Breaks</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!inputCss.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beautify CSS</span>
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={!inputCss.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify CSS</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50"
            title="Clear all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="flex flex-col h-[460px] rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-300">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Input CSS</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>{stats.inputChars.toLocaleString()} chars</span>
              <span>•</span>
              <span>{(stats.inputBytes / 1024).toFixed(2)} KB</span>
            </div>
          </div>
          <textarea
            value={inputCss}
            onChange={(e) => setInputCss(e.target.value)}
            placeholder="/* Paste your CSS here */"
            className="flex-1 w-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder:text-slate-600"
            spellCheck={false}
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col h-[460px] rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-300">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>
                {lastAction === 'minify' ? 'Minified Output' : lastAction === 'format' ? 'Formatted Output' : 'Output Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!outputCss && !inputCss}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!outputCss && !inputCss}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-40"
                title="Download CSS file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputCss || inputCss}
            placeholder="Formatted or minified CSS will appear here..."
            className="flex-1 w-full p-4 bg-slate-950/40 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder:text-slate-600 select-all"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Metrics Bar */}
      {lastAction && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-500 text-[11px]">Original Size</div>
            <div className="text-slate-200 font-semibold text-sm">
              {stats.inputChars.toLocaleString()} chars <span className="text-xs text-slate-400">({(stats.inputBytes / 1024).toFixed(2)} KB)</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Output Size</div>
            <div className="text-slate-200 font-semibold text-sm">
              {stats.outputChars.toLocaleString()} chars <span className="text-xs text-slate-400">({(stats.outputBytes / 1024).toFixed(2)} KB)</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Difference</div>
            <div className={`font-semibold text-sm ${stats.charDiff < 0 ? 'text-emerald-400' : stats.charDiff > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {stats.charDiff > 0 ? `+${stats.charDiff}` : stats.charDiff} chars
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Size Delta</div>
            <div className={`font-semibold text-sm ${stats.percentage < 0 ? 'text-emerald-400' : stats.percentage > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {stats.percentage > 0 ? `+${stats.percentage}%` : `${stats.percentage}%`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
