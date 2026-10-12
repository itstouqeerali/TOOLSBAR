import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Minimize2, Maximize2, Download, AlertCircle, FileJson } from 'lucide-react';

export const JsonMinifier: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
`{
  "project": "Toolsbar",
  "version": "2.0.0",
  "author": {
    "name": "Alex Vance",
    "email": "alex@toolsbar.dev"
  },
  "settings": {
    "theme": "cinematic-dark",
    "glassmorphism": true,
    "toolsCount": 30
  },
  "tags": [
    "developer",
    "calculator",
    "converter",
    "text"
  ]
}`
  );

  const [outputMode, setOutputMode] = useState<'minify' | 'beautify2' | 'beautify4'>('minify');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const processJson = (): string => {
    if (!inputText.trim()) {
      if (error) setError(null);
      return '';
    }

    try {
      const parsed = JSON.parse(inputText);
      if (error) setError(null);

      if (outputMode === 'minify') {
        return JSON.stringify(parsed);
      } else if (outputMode === 'beautify2') {
        return JSON.stringify(parsed, null, 2);
      } else if (outputMode === 'beautify4') {
        return JSON.stringify(parsed, null, 4);
      }
      return JSON.stringify(parsed);
    } catch (err: any) {
      if (!error || error !== err.message) {
        setError(err.message || 'Invalid JSON syntax');
      }
      return '';
    }
  };

  const output = processJson();

  const originalBytes = new Blob([inputText]).size;
  const minifiedBytes = new Blob([output]).size;
  const bytesSaved = Math.max(0, originalBytes - minifiedBytes);
  const compressionRatio = originalBytes > 0 ? ((bytesSaved / originalBytes) * 100) : 0;

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputMode === 'minify' ? 'minified.json' : 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="json-minifier-tool">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-300">Action:</label>
          <div className="flex gap-1.5">
            <button
              onClick={() => setOutputMode('minify')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                outputMode === 'minify'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Minimize2 className="w-3.5 h-3.5" /> Minify (Compact)
            </button>
            <button
              onClick={() => setOutputMode('beautify2')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                outputMode === 'beautify2'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Beautify (2 Spaces)
            </button>
            <button
              onClick={() => setOutputMode('beautify4')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                outputMode === 'beautify4'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Beautify (4 Spaces)
            </button>
          </div>
        </div>

        {output && outputMode === 'minify' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">{originalBytes} B $\to$ {minifiedBytes} B</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
              -{compressionRatio.toFixed(1)}% size
            </span>
          </div>
        )}
      </div>

      {/* Editors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input */}
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <FileJson className="w-4 h-4" /> JSON Input
              </span>
              <span className="text-xs font-mono text-neutral-400">{originalBytes} bytes</span>
            </div>

            <textarea
              rows={15}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste JSON object or array here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />

            {error && (
              <div className="flex items-start gap-2 p-3 mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setInputText('')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                <FileJson className="w-4 h-4" /> Processed JSON
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{minifiedBytes} bytes</span>
            </div>

            <textarea
              readOnly
              rows={15}
              value={output}
              placeholder="Minified or beautified JSON will appear here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-100 placeholder-neutral-500 focus:outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied JSON!' : 'Copy Result'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!output}
              title="Download JSON file"
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
