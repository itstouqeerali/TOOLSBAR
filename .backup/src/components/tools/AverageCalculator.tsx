import React, { useState } from 'react';
import { Copy, Check, RotateCcw, BarChart3, Calculator, Hash, ListFilter } from 'lucide-react';

export const AverageCalculator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('85, 90, 78, 92, 88, 76, 95, 89, 90, 84');
  const [decimals, setDecimals] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse numbers
  const parseNumbers = (text: string): number[] => {
    return text
      .split(/[\s,;\n\t]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  };

  const numbers = parseNumbers(inputText);
  const count = numbers.length;

  const calculateStats = () => {
    if (count === 0) return null;

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / count;

    // Median
    let median = 0;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const freqMap: Record<number, number> = {};
    let maxFreq = 0;
    numbers.forEach(n => {
      freqMap[n] = (freqMap[n] || 0) + 1;
      if (freqMap[n] > maxFreq) maxFreq = freqMap[n];
    });

    let modes: number[] = [];
    if (maxFreq > 1) {
      modes = Object.keys(freqMap)
        .filter(k => freqMap[parseFloat(k)] === maxFreq)
        .map(k => parseFloat(k));
    }

    // Min, Max, Range
    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;

    // Standard Deviation & Variance
    const variance = numbers.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / count;
    const populationStdDev = Math.sqrt(variance);
    const sampleVariance = count > 1 ? numbers.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / (count - 1) : 0;
    const sampleStdDev = Math.sqrt(sampleVariance);

    // Geometric Mean (if all positive)
    const allPositive = numbers.every(n => n > 0);
    let geometricMean: number | null = null;
    if (allPositive) {
      const logSum = numbers.reduce((acc, n) => acc + Math.log(n), 0);
      geometricMean = Math.exp(logSum / count);
    }

    return {
      count,
      sum,
      mean,
      median,
      modes,
      maxFreq,
      min,
      max,
      range,
      variance,
      populationStdDev,
      sampleStdDev,
      geometricMean,
      sorted
    };
  };

  const stats = calculateStats();

  const handleCopy = () => {
    if (!stats) return;
    const text = `Mean (Average): ${stats.mean.toFixed(decimals)}\nMedian: ${stats.median.toFixed(decimals)}\nMode: ${stats.modes.length > 0 ? stats.modes.join(', ') : 'None'}\nSum: ${stats.sum.toFixed(decimals)}\nCount: ${stats.count}\nMin: ${stats.min}\nMax: ${stats.max}\nRange: ${stats.range}\nStd Dev (Sample): ${stats.sampleStdDev.toFixed(decimals)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setPreset = (presetText: string) => {
    setInputText(presetText);
  };

  return (
    <div className="space-y-6" id="average-calculator-tool">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Precision:</label>
          <select
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            className="bg-black/30 text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {[0, 1, 2, 3, 4, 5, 6].map(d => (
              <option key={d} value={d} className="bg-neutral-900">{d} decimals</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setInputText('')}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Data Set Input
              </span>
              <span className="text-xs text-neutral-400 font-mono font-semibold">
                {count} {count === 1 ? 'number' : 'numbers'} detected
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Enter numbers separated by commas, spaces, or newlines:
              </label>
              <textarea
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. 10, 20, 35, 40, 55.5, 60"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-xs text-neutral-400 block mb-2 font-medium">Quick Sample Datasets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Student Exam Grades', data: '78, 85, 92, 88, 95, 70, 84, 90, 88, 96' },
                  { label: 'Weekly Temperatures (°F)', data: '68, 72, 75, 71, 69, 74, 76' },
                  { label: 'Website Response Times (ms)', data: '120, 145, 110, 230, 115, 125, 140, 310' },
                  { label: 'Small Sample (1 to 10)', data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreset(p.data)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {stats && stats.sorted.length > 0 && (
            <div className="pt-4 border-t border-white/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Sorted Dataset ({stats.sorted.length}):
              </span>
              <div className="text-xs font-mono text-neutral-300 max-h-20 overflow-y-auto bg-black/30 p-2.5 rounded-xl border border-white/5 break-all">
                {stats.sorted.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Stats Output Grid */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Statistical Summary
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30">
                  Instant
                </span>
              </div>

              {stats ? (
                <>
                  {/* Big Hero Stat: Mean */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Mean (Arithmetic Average)</span>
                    <div className="text-4xl sm:text-5xl font-extrabold font-display text-white mt-1">
                      {stats.mean.toFixed(decimals)}
                    </div>
                  </div>

                  {/* 2x3 Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Median</span>
                      <span className="text-white font-mono font-bold text-sm">{stats.median.toFixed(decimals)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Mode</span>
                      <span className="text-white font-mono font-bold text-sm truncate block" title={stats.modes.length > 0 ? stats.modes.join(', ') : 'None'}>
                        {stats.modes.length > 0 ? stats.modes.join(', ') : 'None'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Sum (Σ)</span>
                      <span className="text-white font-mono font-bold text-sm">{stats.sum.toFixed(decimals)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Range</span>
                      <span className="text-white font-mono font-bold text-sm">{stats.range.toFixed(decimals)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Min / Max</span>
                      <span className="text-white font-mono font-bold text-sm">{stats.min} / {stats.max}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Sample Std Dev (s)</span>
                      <span className="text-white font-mono font-bold text-sm">{stats.sampleStdDev.toFixed(decimals)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  Enter numbers in the input box to compute comprehensive statistical averages.
                </div>
              )}
            </div>

            {stats && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Statistics!' : 'Copy Summary Report'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
