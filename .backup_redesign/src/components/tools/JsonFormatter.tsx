import React, { useState, useMemo } from 'react';
import { 
  Code2, Copy, Check, Download, AlertTriangle, 
  CheckCircle2, Sparkles, Minimize2, Maximize2, 
  FileJson, ArrowDownAZ, Upload
} from 'lucide-react';

const SAMPLE_JSON = JSON.stringify({
  appName: "Toolsbar",
  version: "2.4.0",
  features: {
    browserOnly: true,
    zeroLatency: true,
    totalPrivacy: true,
    toolCount: 100
  },
  categories: ["Calculators", "Developer", "Text", "Converters", "QR"],
  metadata: {
    status: "active",
    author: {
      team: "Toolsbar Core",
      verified: true
    }
  }
}, null, 2);

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'editor' | 'tree'>('editor');

  // JSON Validation & Parsing
  const validation = useMemo(() => {
    if (!inputJson.trim()) {
      return { isValid: true, error: null, parsed: null, stats: { size: 0, keys: 0, depth: 0 } };
    }

    try {
      const parsed = JSON.parse(inputJson);
      
      // Calculate keys and depth
      let keyCount = 0;
      let maxDepth = 0;

      const analyze = (obj: any, depth: number) => {
        if (depth > maxDepth) maxDepth = depth;
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach(item => analyze(item, depth + 1));
          } else {
            const keys = Object.keys(obj);
            keyCount += keys.length;
            keys.forEach(k => analyze(obj[k], depth + 1));
          }
        }
      };

      analyze(parsed, 1);

      return {
        isValid: true,
        error: null,
        parsed,
        stats: {
          size: new Blob([inputJson]).size,
          keys: keyCount,
          depth: maxDepth
        }
      };
    } catch (err: any) {
      return {
        isValid: false,
        error: err.message,
        parsed: null,
        stats: { size: new Blob([inputJson]).size, keys: 0, depth: 0 }
      };
    }
  }, [inputJson]);

  const handleFormat = () => {
    if (validation.isValid && validation.parsed !== null) {
      const space = indentSize === 'tab' ? '\t' : indentSize;
      setInputJson(JSON.stringify(validation.parsed, null, space));
    }
  };

  const handleMinify = () => {
    if (validation.isValid && validation.parsed !== null) {
      setInputJson(JSON.stringify(validation.parsed));
    }
  };

  const handleSortKeys = () => {
    if (validation.isValid && validation.parsed !== null) {
      const sortObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        return Object.keys(obj)
          .sort()
          .reduce((res: any, key: string) => {
            res[key] = sortObject(obj[key]);
            return res;
          }, {});
      };
      const sorted = sortObject(validation.parsed);
      const space = indentSize === 'tab' ? '\t' : indentSize;
      setInputJson(JSON.stringify(sorted, null, space));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolsbar-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputJson(text);
      };
      reader.readAsText(file);
    }
  };

  // Simple Recursive Tree Renderer
  const renderJsonTree = (data: any, depth = 0): React.ReactNode => {
    if (data === null) return <span className="text-neutral-500 font-mono">null</span>;
    if (typeof data === 'boolean') return <span className="text-amber-400 font-mono">{String(data)}</span>;
    if (typeof data === 'number') return <span className="text-emerald-400 font-mono">{data}</span>;
    if (typeof data === 'string') return <span className="text-sky-300 font-mono">"{data}"</span>;

    if (Array.isArray(data)) {
      if (data.length === 0) return <span className="text-neutral-400">[]</span>;
      return (
        <div className="pl-4 border-l border-white/10 my-1 space-y-1">
          {data.map((item, idx) => (
            <div key={idx} className="text-xs">
              <span className="text-neutral-500 font-mono mr-2">{idx}:</span>
              {renderJsonTree(item, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return <span className="text-neutral-400">{'{}'}</span>;
      return (
        <div className="pl-4 border-l border-white/10 my-1 space-y-1">
          {keys.map((key) => (
            <div key={key} className="text-xs">
              <span className="text-indigo-300 font-mono font-medium">{key}: </span>
              {renderJsonTree(data[key], depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    return String(data);
  };

  return (
    <div className="space-y-6" id="json-formatter-tool">
      {/* Control Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            disabled={!validation.isValid}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Beautify / Format
          </button>
          <button
            onClick={handleMinify}
            disabled={!validation.isValid}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium border border-white/10 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" /> Minify
          </button>
          <button
            onClick={handleSortKeys}
            disabled={!validation.isValid}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium border border-white/10 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ArrowDownAZ className="w-3.5 h-3.5" /> Sort Keys (A-Z)
          </button>

          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10">
            <span className="text-xs text-neutral-400">Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
              className="bg-black/40 text-xs text-neutral-200 border border-white/10 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value={2} className="bg-neutral-900">2 Spaces</option>
              <option value={4} className="bg-neutral-900">4 Spaces</option>
              <option value="tab" className="bg-neutral-900">Tabs</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'editor' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Code Editor
            </button>
            <button
              onClick={() => setViewMode('tree')}
              disabled={!validation.isValid}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'tree' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tree View
            </button>
          </div>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Upload .json
            <input type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main JSON Stage */}
      <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            {validation.isValid ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Syntax Error
              </span>
            )}
            {validation.isValid && (
              <span className="text-xs text-neutral-400">
                {validation.stats.keys} keys &bull; depth {validation.stats.depth} &bull; {validation.stats.size} bytes
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputJson(SAMPLE_JSON)}
              className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              Load Sample
            </button>
            <button
              onClick={() => setInputJson('')}
              className="text-xs text-neutral-400 hover:text-rose-400 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Syntax error message */}
        {!validation.isValid && validation.error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {validation.error}
          </div>
        )}

        {/* View Mode Content */}
        {viewMode === 'editor' ? (
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your raw or unformatted JSON here..."
            rows={16}
            spellCheck={false}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-xs sm:text-sm font-mono text-emerald-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y leading-relaxed"
          />
        ) : (
          <div className="w-full min-h-[380px] max-h-[500px] overflow-y-auto bg-black/50 border border-white/10 rounded-xl p-4">
            {validation.isValid && renderJsonTree(validation.parsed)}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-neutral-500">
            Processed 100% locally in your browser &bull; Zero telemetry
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download .json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
