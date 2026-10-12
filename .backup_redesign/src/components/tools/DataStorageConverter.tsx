import React, { useState } from 'react';
import { Copy, Check, RotateCcw, HardDrive, ArrowRightLeft, Sparkles, Film, Music, Image as ImageIcon, Wifi } from 'lucide-react';

interface StorageUnit {
  id: string;
  name: string;
  symbol: string;
  bytes: number; // in bytes
  category: 'si' | 'iec' | 'bit';
}

const STORAGE_UNITS: StorageUnit[] = [
  { id: 'b', name: 'Bit', symbol: 'b', bytes: 0.125, category: 'bit' },
  { id: 'B', name: 'Byte', symbol: 'B', bytes: 1, category: 'si' },
  { id: 'KB', name: 'Kilobyte (SI)', symbol: 'KB', bytes: 1000, category: 'si' },
  { id: 'MB', name: 'Megabyte (SI)', symbol: 'MB', bytes: 1000 ** 2, category: 'si' },
  { id: 'GB', name: 'Gigabyte (SI)', symbol: 'GB', bytes: 1000 ** 3, category: 'si' },
  { id: 'TB', name: 'Terabyte (SI)', symbol: 'TB', bytes: 1000 ** 4, category: 'si' },
  { id: 'PB', name: 'Petabyte (SI)', symbol: 'PB', bytes: 1000 ** 5, category: 'si' },

  { id: 'KiB', name: 'Kibibyte (Binary)', symbol: 'KiB', bytes: 1024, category: 'iec' },
  { id: 'MiB', name: 'Mebibyte (Binary)', symbol: 'MiB', bytes: 1024 ** 2, category: 'iec' },
  { id: 'GiB', name: 'Gibibyte (Binary)', symbol: 'GiB', bytes: 1024 ** 3, category: 'iec' },
  { id: 'TiB', name: 'Tebibyte (Binary)', symbol: 'TiB', bytes: 1024 ** 4, category: 'iec' },
  { id: 'PiB', name: 'Pebibyte (Binary)', symbol: 'PiB', bytes: 1024 ** 5, category: 'iec' },
];

export const DataStorageConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('500');
  const [fromUnit, setFromUnit] = useState<string>('GB');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const num = parseFloat(inputValue) || 0;
  const currentUnit = STORAGE_UNITS.find(u => u.id === fromUnit) || STORAGE_UNITS[4];

  const totalBytes = num * currentUnit.bytes;

  // Real world equivalents
  const numPhotos = totalBytes / (5 * 1024 * 1024); // 5 MB photo
  const numSongs = totalBytes / (8 * 1024 * 1024); // 8 MB song
  const numMovies = totalBytes / (4 * 1024 * 1024 * 1024); // 4 GB 1080p movie
  const downloadSeconds100Mbps = totalBytes / (100 * 1000 * 1000 / 8); // 100 Mbps internet

  const formatSeconds = (sec: number) => {
    if (sec < 60) return `${sec.toFixed(1)} seconds`;
    if (sec < 3600) return `${(sec / 60).toFixed(1)} minutes`;
    return `${(sec / 3600).toFixed(1)} hours`;
  };

  const handleCopy = (unitId: string, valStr: string) => {
    navigator.clipboard.writeText(valStr);
    setCopiedId(unitId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6" id="data-storage-converter-tool">
      {/* Input Hero Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
            <HardDrive className="w-4 h-4" /> Data Storage Value & Base Unit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Quantity</label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="500"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xl font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Unit</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <optgroup label="Decimal (SI - Base 1000)">
                <option value="B">Bytes (B)</option>
                <option value="KB">Kilobytes (KB)</option>
                <option value="MB">Megabytes (MB)</option>
                <option value="GB">Gigabytes (GB)</option>
                <option value="TB">Terabytes (TB)</option>
                <option value="PB">Petabytes (PB)</option>
              </optgroup>
              <optgroup label="Binary (IEC - Base 1024)">
                <option value="KiB">Kibibytes (KiB)</option>
                <option value="MiB">Mebibytes (MiB)</option>
                <option value="GiB">Gibibytes (GiB)</option>
                <option value="TiB">Tebibytes (TiB)</option>
                <option value="PiB">Pebibytes (PiB)</option>
              </optgroup>
              <optgroup label="Bits">
                <option value="b">Bits (b)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-xs text-neutral-400 block mb-2">Common Storage Sizes:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { val: '16', unit: 'GB', label: '16 GB (RAM)' },
              { val: '128', unit: 'GB', label: '128 GB (Phone)' },
              { val: '512', unit: 'GB', label: '512 GB (NVMe SSD)' },
              { val: '1', unit: 'TB', label: '1 TB (Drive)' },
              { val: '4.7', unit: 'GB', label: '4.7 GB (DVD)' },
              { val: '25', unit: 'GB', label: '25 GB (Blu-ray)' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(p.val);
                  setFromUnit(p.unit);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real World Equivalents */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400">
            <ImageIcon className="w-3.5 h-3.5" /> Photos (5MB)
          </div>
          <div className="text-lg font-bold font-mono text-white">
            ≈ {Math.floor(numPhotos).toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Music className="w-3.5 h-3.5" /> Songs (8MB)
          </div>
          <div className="text-lg font-bold font-mono text-white">
            ≈ {Math.floor(numSongs).toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rose-400">
            <Film className="w-3.5 h-3.5" /> HD Movies (4GB)
          </div>
          <div className="text-lg font-bold font-mono text-white">
            ≈ {Math.floor(numMovies).toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <Wifi className="w-3.5 h-3.5" /> Download (100 Mbps)
          </div>
          <div className="text-sm font-bold font-mono text-white truncate" title={formatSeconds(downloadSeconds100Mbps)}>
            ≈ {formatSeconds(downloadSeconds100Mbps)}
          </div>
        </div>
      </div>

      {/* Complete Unit Conversion Matrix Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Full Unit Conversion Matrix
          </span>
          <span className="text-xs font-mono text-neutral-400">
            Total: {totalBytes.toLocaleString()} Bytes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STORAGE_UNITS.map(u => {
            const converted = totalBytes / u.bytes;
            const formatted = converted < 0.0001 && converted > 0
              ? converted.toExponential(4)
              : converted.toLocaleString(undefined, { maximumFractionDigits: 6 });

            const isCurrent = u.id === fromUnit;

            return (
              <div
                key={u.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-indigo-600/20 border-indigo-500/40 shadow-sm'
                    : 'bg-black/30 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="font-semibold text-white">{u.symbol}</span>
                    <span>({u.name})</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-white truncate select-all mt-0.5" title={`${formatted} ${u.symbol}`}>
                    {formatted}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(u.id, `${converted} ${u.symbol}`)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-600 text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0"
                  title="Copy value"
                >
                  {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
