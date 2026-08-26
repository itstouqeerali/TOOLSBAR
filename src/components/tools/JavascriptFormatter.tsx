import React, { useState, useMemo } from 'react';
import { 
  Code2, Copy, Check, Download, AlertTriangle, 
  RotateCcw, Sparkles, Minimize2, FileCode, Sliders, 
  Info, AlertCircle
} from 'lucide-react';
import jsBeautify from 'js-beautify';
import { minify } from 'terser';

const SAMPLE_JS = `// Toolsbar Developer Utilities — JavaScript Sample
class DataProcessor {
  constructor(options = {}) {
    this.prefix = options.prefix ?? "TB_";
    this.debug = Boolean(options.debug);
    this.cache = new Map();
  }

  async processItems(items = []) {
    if (!Array.isArray(items)) {
      throw new TypeError("Expected items to be an array");
    }

    const sanitized = items
      .filter(item => item != null && typeof item === 'object')
      .map(({ id, name, value = 0, tags = [] }) => {
        const formattedKey = \`\${this.prefix}\${id}\`;
        const score = Math.round(Number(value) * 1.15 * 100) / 100;
        return {
          id: formattedKey,
          label: name.trim().toUpperCase(),
          score,
          hasTags: tags.length > 0,
          regexMatch: /^[A-Z0-9_-]+$/i.test(id)
        };
      });

    return sanitized;
  }
}

// Instantiate and export configuration
const processor = new DataProcessor({ prefix: "API_", debug: false });
console.log("Processor initialized successfully.");`;

export const JavascriptFormatter: React.FC = () => {
  const [inputJs, setInputJs] = useState<string>(SAMPLE_JS);
  const [outputJs, setOutputJs] = useState<string>('');
  const [indentType, setIndentType] = useState<'2' | '4' | 'tab'>('2');
  const [preserveNewlines, setPreserveNewlines] = useState<boolean>(true);
  const [lastAction, setLastAction] = useState<'format' | 'minify' | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Metrics calculation
  const stats = useMemo(() => {
    const inputBytes = new Blob([inputJs]).size;
    const inputChars = inputJs.length;
    
    const activeOutput = outputJs || inputJs;
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
  }, [inputJs, outputJs]);

  const handleFormat = () => {
    setErrorMsg(null);
    if (!inputJs.trim()) {
      setOutputJs('');
      setLastAction(null);
      return;
    }

    try {
      const indentSize = indentType === 'tab' ? 1 : parseInt(indentType, 10);
      const indentChar = indentType === 'tab' ? '\t' : ' ';

      const formatted = jsBeautify.js(inputJs, {
        indent_size: indentSize,
        indent_char: indentChar,
        preserve_newlines: preserveNewlines,
        max_preserve_newlines: 2,
        space_after_anon_function: true,
        brace_style: 'collapse',
        keep_array_indentation: false,
        break_chained_methods: false,
        unescape_strings: false
      });

      setOutputJs(formatted);
      setLastAction('format');
    } catch (err: any) {
      setErrorMsg(`Format Notice: ${err?.message || 'Unable to parse input'}`);
      setOutputJs(inputJs);
    }
  };

  const handleMinify = async () => {
    setErrorMsg(null);
    if (!inputJs.trim()) {
      setOutputJs('');
      setLastAction(null);
      return;
    }

    setIsProcessing(true);
    try {
      // Use Terser for 100% safe AST parsing and minification
      const minifiedResult = await minify(inputJs, {
        compress: {
          dead_code: true,
          drop_debugger: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: false,
          hoist_funs: true,
          keep_fargs: true,
          hoist_vars: false,
          if_return: true,
          join_vars: true,
          side_effects: true
        },
        mangle: false, // Keep variable names legible while removing all unnecessary tokens & dead code
        format: {
          comments: false,
          semicolons: true
        }
      });

      if (minifiedResult.code) {
        setOutputJs(minifiedResult.code);
        setLastAction('minify');
      } else {
        throw new Error('Minification produced empty output');
      }
    } catch (err: any) {
      setErrorMsg(`Syntax Error: ${err?.message || 'Failed to parse JavaScript syntax'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = outputJs || inputJs;
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
    const content = outputJs || inputJs;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = lastAction === 'minify' ? 'script.min.js' : 'script.formatted.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputJs('');
    setOutputJs('');
    setLastAction(null);
    setErrorMsg(null);
  };

  const handleLoadSample = () => {
    setInputJs(SAMPLE_JS);
    setOutputJs('');
    setLastAction(null);
    setErrorMsg(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Privacy and Technical Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero Execution Policy:</strong> JavaScript source is analyzed purely as text/AST. Code is NEVER executed via eval() or Function().
          </span>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap transition-colors"
        >
          Load Sample JS
        </button>
      </div>

      {/* Error / Notice Display */}
      {errorMsg && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-200">JavaScript Processing Error</div>
            <div className="font-mono mt-0.5">{errorMsg}</div>
          </div>
        </div>
      )}

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
            <span>Preserve Empty Lines</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!inputJs.trim() || isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beautify JS</span>
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={!inputJs.trim() || isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Minifying...' : 'Minify JS'}</span>
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
              <span>Input JavaScript</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>{stats.inputChars.toLocaleString()} chars</span>
              <span>•</span>
              <span>{(stats.inputBytes / 1024).toFixed(2)} KB</span>
            </div>
          </div>
          <textarea
            value={inputJs}
            onChange={(e) => {
              setInputJs(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="// Paste your JavaScript source code here..."
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
                disabled={!outputJs && !inputJs}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!outputJs && !inputJs}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-40"
                title="Download JS file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputJs || inputJs}
            placeholder="Formatted or minified JavaScript will appear here..."
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
