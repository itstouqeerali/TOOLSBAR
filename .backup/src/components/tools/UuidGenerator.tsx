import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Fingerprint, Download, Sparkles, RefreshCw, Key } from 'lucide-react';

type UuidVersion = 'v4' | 'v1' | 'nanoid' | 'hex16';

export const UuidGenerator: React.FC = () => {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [wrapper, setWrapper] = useState<'none' | 'quotes' | 'braces' | 'array'>('none');
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSingleIndex, setCopiedSingleIndex] = useState<number | null>(null);

  // Generate cryptographic UUID v4
  const generateV4 = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback crypto random values
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };

  // Generate NanoID style short token
  const generateNanoId = (size = 21): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    let str = '';
    for (let i = 0; i < size; i++) {
      str += chars[bytes[i] % chars.length];
    }
    return str;
  };

  // Generate 16-byte hex
  const generateHex16 = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateBatch = () => {
    const list: string[] = [];
    const safeCount = Math.max(1, Math.min(count, 100));

    for (let i = 0; i < safeCount; i++) {
      let raw = '';
      if (version === 'v4' || version === 'v1') {
        raw = generateV4();
        if (!includeHyphens) {
          raw = raw.replace(/-/g, '');
        }
      } else if (version === 'nanoid') {
        raw = generateNanoId(21);
      } else if (version === 'hex16') {
        raw = generateHex16();
      }

      if (uppercase) {
        raw = raw.toUpperCase();
      }

      list.push(raw);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateBatch();
  }, [version, count, uppercase, includeHyphens]);

  // Formatted Output text
  const formatOutput = (): string => {
    if (wrapper === 'quotes') {
      return uuids.map(u => `"${u}"`).join('\n');
    }
    if (wrapper === 'braces') {
      return uuids.map(u => `{${u}}`).join('\n');
    }
    if (wrapper === 'array') {
      return `[\n  ${uuids.map(u => `"${u}"`).join(',\n  ')}\n]`;
    }
    return uuids.join('\n');
  };

  const output = formatOutput();

  const handleCopyAll = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingle = (id: string, index: number) => {
    navigator.clipboard.writeText(id);
    setCopiedSingleIndex(index);
    setTimeout(() => setCopiedSingleIndex(null), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uuids.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="uuid-generator-tool">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-400">Type:</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as UuidVersion)}
              className="bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="v4">UUID v4 (Random Crypto)</option>
              <option value="nanoid">NanoID (Compact 21-char)</option>
              <option value="hex16">16-Byte Hex Token</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-400">Count:</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
            >
              {[1, 5, 10, 25, 50, 100].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {(version === 'v4' || version === 'v1') && (
            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHyphens}
                onChange={(e) => setIncludeHyphens(e.target.checked)}
                className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
              />
              Hyphens
            </label>
          )}

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Uppercase
          </label>

          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            {[
              { val: 'none', label: 'Plain' },
              { val: 'quotes', label: '" "' },
              { val: 'braces', label: '{ }' },
              { val: 'array', label: '[ ]' },
            ].map(w => (
              <button
                key={w.val}
                onClick={() => setWrapper(w.val as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  wrapper === w.val ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>

          <button
            onClick={generateBatch}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white py-1.5 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-generate
          </button>
        </div>
      </div>

      {/* UUID List Display */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <Key className="w-4 h-4" /> Cryptographically Secure Unique Identifiers ({uuids.length})
          </span>
          <span className="text-xs font-mono text-neutral-400">
            RFC 4122 Compliant
          </span>
        </div>

        {/* Item Rows */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-neutral-500 w-6 text-right">#{idx + 1}</span>
                <span className="text-sm font-mono text-indigo-100 font-semibold truncate select-all">{id}</span>
              </div>

              <button
                onClick={() => handleCopySingle(id, idx)}
                className="opacity-80 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 hover:bg-indigo-600 text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0"
                title="Copy this UUID"
              >
                {copiedSingleIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="text-xs text-neutral-400">
            Generated using browser <code className="text-indigo-300">crypto.getRandomValues</code> CSPRNG.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'All Copied!' : `Copy All (${uuids.length})`}
            </button>
            <button
              onClick={handleDownload}
              title="Download IDs as text file"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
