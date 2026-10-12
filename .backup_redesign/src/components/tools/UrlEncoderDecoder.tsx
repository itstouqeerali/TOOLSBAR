import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Link2, ArrowLeftRight, Globe, ListFilter } from 'lucide-react';

type Mode = 'encode' | 'decode';

export const UrlEncoderDecoder: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [inputText, setInputText] = useState<string>(
    'https://toolsbar.dev/search?category=dev tools&tags=json,url&lang=en#results'
  );
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processText = (): string => {
    if (!inputText) {
      if (error) setError(null);
      return '';
    }

    try {
      if (error) setError(null);
      if (mode === 'encode') {
        return encodeType === 'component' ? encodeURIComponent(inputText) : encodeURI(inputText);
      } else {
        return encodeType === 'component' ? decodeURIComponent(inputText) : decodeURI(inputText);
      }
    } catch (err: any) {
      if (!error) setError(err.message || 'Malformed URI sequence');
      return '';
    }
  };

  const output = processText();

  // Try parsing URL for detailed query params inspection
  let parsedUrl: {
    protocol: string;
    host: string;
    pathname: string;
    search: string;
    hash: string;
    params: Array<{ key: string; value: string }>;
  } | null = null;

  try {
    const u = new URL(inputText.startsWith('http') ? inputText : `https://${inputText}`);
    const paramsList: Array<{ key: string; value: string }> = [];
    u.searchParams.forEach((value, key) => {
      paramsList.push({ key, value });
    });

    parsedUrl = {
      protocol: u.protocol,
      host: u.host,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      params: paramsList
    };
  } catch {
    parsedUrl = null;
  }

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (output) {
      setInputText(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className="space-y-6" id="url-encoder-decoder-tool">
      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-black/30 rounded-xl border border-white/10">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'encode' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              URL Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'decode' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              URL Decode
            </button>
          </div>

          <div className="flex gap-1 text-xs">
            <button
              onClick={() => setEncodeType('component')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                encodeType === 'component'
                  ? 'bg-white/10 border-indigo-500/50 text-white'
                  : 'bg-black/20 border-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              encodeURIComponent (Safe for Query)
            </button>
            <button
              onClick={() => setEncodeType('full')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                encodeType === 'full'
                  ? 'bg-white/10 border-indigo-500/50 text-white'
                  : 'bg-black/20 border-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              encodeURI (Full URL)
            </button>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={!output}
          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 py-1.5 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Input/Output
        </button>
      </div>

      {/* Editor Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input */}
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Link2 className="w-4 h-4" /> {mode === 'encode' ? 'Decoded / Plain Input' : 'Percent-Encoded String'}
              </span>
              <span className="text-xs font-mono text-neutral-400">{inputText.length} chars</span>
            </div>

            <textarea
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste URL, URI parameter, or encoded string here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                {error}
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
                <Globe className="w-4 h-4" /> {mode === 'encode' ? 'Encoded URL String' : 'Decoded String'}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{output.length} chars</span>
            </div>

            <textarea
              readOnly
              rows={10}
              value={output}
              placeholder="Processed result will appear here..."
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
              {copied ? 'Copied to Clipboard!' : 'Copy Result'}
            </button>
          </div>
        </div>
      </div>

      {/* URL Parameter Inspector (if valid URL detected) */}
      {parsedUrl && parsedUrl.params.length > 0 && (
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <ListFilter className="w-4 h-4" /> Detected Query Parameters ({parsedUrl.params.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parsedUrl.params.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono">
                <span className="text-indigo-400 font-bold">{p.key}:</span>
                <span className="text-neutral-200 truncate select-all">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
