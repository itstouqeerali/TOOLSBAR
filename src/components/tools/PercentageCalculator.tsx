import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Percent, ArrowRight, HelpCircle, Calculator } from 'lucide-react';

type Mode = 'percent_of' | 'is_what_percent' | 'increase_decrease' | 'add_subtract' | 'what_is_whole';

export const PercentageCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('percent_of');
  const [valA, setValA] = useState<string>('15');
  const [valB, setValB] = useState<string>('120');
  const [decimals, setDecimals] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ text: string; result: string; timestamp: string }>>([]);

  const numA = parseFloat(valA);
  const numB = parseFloat(valB);

  const calculate = () => {
    if (isNaN(numA) || isNaN(numB)) return { result: null, formula: '', details: '' };

    let res: number | null = null;
    let formula = '';
    let details = '';

    switch (mode) {
      case 'percent_of':
        // What is A% of B?
        res = (numA / 100) * numB;
        formula = `(${numA} ÷ 100) × ${numB} = ${res.toFixed(decimals)}`;
        details = `${numA}% of ${numB} is ${res.toFixed(decimals)}`;
        break;
      case 'is_what_percent':
        // A is what percent of B?
        if (numB === 0) {
          details = 'Cannot divide by zero';
          break;
        }
        res = (numA / numB) * 100;
        formula = `(${numA} ÷ ${numB}) × 100 = ${res.toFixed(decimals)}%`;
        details = `${numA} is ${res.toFixed(decimals)}% of ${numB}`;
        break;
      case 'increase_decrease':
        // % increase/decrease from A to B
        if (numA === 0) {
          details = 'Initial value cannot be zero';
          break;
        }
        res = ((numB - numA) / Math.abs(numA)) * 100;
        const diff = numB - numA;
        const type = diff >= 0 ? 'increase' : 'decrease';
        formula = `((${numB} - ${numA}) ÷ |${numA}|) × 100 = ${res >= 0 ? '+' : ''}${res.toFixed(decimals)}%`;
        details = `From ${numA} to ${numB} is a ${Math.abs(res).toFixed(decimals)}% ${type} (difference of ${diff >= 0 ? '+' : ''}${diff})`;
        break;
      case 'add_subtract':
        // Add A% to B or Subtract A% from B
        const delta = (numA / 100) * numB;
        res = numB + delta;
        formula = `${numB} + (${numA}% of ${numB}) = ${numB} + ${delta.toFixed(decimals)} = ${res.toFixed(decimals)}`;
        details = `${numB} with ${numA >= 0 ? '+' : ''}${numA}% applied is ${res.toFixed(decimals)}`;
        break;
      case 'what_is_whole':
        // A is B% of what number?
        if (numB === 0) {
          details = 'Percentage cannot be zero';
          break;
        }
        res = numA / (numB / 100);
        formula = `${numA} ÷ (${numB} ÷ 100) = ${res.toFixed(decimals)}`;
        details = `If ${numA} is ${numB}%, the total whole (100%) is ${res.toFixed(decimals)}`;
        break;
    }

    return { result: res, formula, details };
  };

  const { result, formula, details } = calculate();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToHistory = () => {
    if (result !== null) {
      const entry = {
        text: details,
        result: result.toFixed(decimals),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setHistory(prev => [entry, ...prev.slice(0, 9)]);
    }
  };

  const setPreset = (a: string, b: string) => {
    setValA(a);
    setValB(b);
  };

  return (
    <div className="space-y-6" id="percentage-calculator-tool">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 backdrop-blur-md">
        {[
          { id: 'percent_of', label: 'What is X% of Y?' },
          { id: 'is_what_percent', label: 'X is what % of Y?' },
          { id: 'increase_decrease', label: '% Increase / Decrease' },
          { id: 'add_subtract', label: 'Add / Subtract %' },
          { id: 'what_is_whole', label: 'Find Whole from %' },
        ].map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setMode(tab.id as Mode)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              mode === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Calculation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="lg:col-span-7 rounded-2xl p-6 sm:p-8 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Parameters
              </span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-neutral-400">Decimals:</label>
                <select
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  className="bg-black/30 text-xs text-white border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(d => (
                    <option key={d} value={d} className="bg-neutral-900">{d} digits</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inputs based on mode */}
            {mode === 'percent_of' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    What is <span className="text-indigo-400 font-semibold">percentage (%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={valA}
                      onChange={(e) => setValA(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Of total value <span className="text-indigo-400 font-semibold">(Number)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'is_what_percent' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Value <span className="text-indigo-400 font-semibold">(Part)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Is what percentage of <span className="text-indigo-400 font-semibold">(Total)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'increase_decrease' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Initial Value <span className="text-indigo-400 font-semibold">(From)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Final Value <span className="text-indigo-400 font-semibold">(To)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'add_subtract' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Base Value <span className="text-indigo-400 font-semibold">(Original)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Percentage to Add (+) or Subtract (-)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={valA}
                      onChange={(e) => setValA(e.target.value)}
                      placeholder="e.g. 20 (use -20 for discount)"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            )}

            {mode === 'what_is_whole' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Known Part Value <span className="text-indigo-400 font-semibold">(Amount)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 font-medium mb-1.5">
                    Representing Percentage <span className="text-indigo-400 font-semibold">(%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={valB}
                      onChange={(e) => setValB(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div>
              <span className="text-xs text-neutral-400 block mb-2 font-medium">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { a: '5', b: '100', label: '5% of 100' },
                  { a: '10', b: '250', label: '10% of 250' },
                  { a: '15', b: '80', label: '15% tip on $80' },
                  { a: '20', b: '150', label: '20% off 150' },
                  { a: '50', b: '75', label: '50 to 75 (+50%)' },
                  { a: '25', b: '100', label: '25% of 100' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreset(p.a, p.b)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-6">
            <button
              onClick={() => { setValA(''); setValB(''); }}
              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear inputs
            </button>
            <button
              onClick={saveToHistory}
              disabled={result === null}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1.5 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors disabled:opacity-40 cursor-pointer"
            >
              Save calculation
            </button>
          </div>
        </div>

        {/* Output & Formula Showcase */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main Result Card */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/50 via-[#13192f]/70 to-[#0e1220]/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">
                <span>Calculated Result</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Instant
                </span>
              </div>

              {result !== null ? (
                <div className="space-y-3">
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
                    {result.toFixed(decimals)}
                    {mode === 'is_what_percent' || mode === 'increase_decrease' ? '%' : ''}
                  </div>
                  <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                    {details}
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-400 text-sm">
                  Enter valid numbers to see the calculated result
                </div>
              )}
            </div>

            {result !== null && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="text-xs text-neutral-400 font-medium">Mathematical Formula:</div>
                <div className="font-mono text-xs sm:text-sm bg-black/40 text-indigo-200 p-3 rounded-xl border border-white/5 break-all">
                  {formula}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleCopy(result.toFixed(decimals) + (mode === 'is_what_percent' || mode === 'increase_decrease' ? '%' : ''))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied Result!' : 'Copy Result'}
                  </button>
                  <button
                    onClick={() => handleCopy(formula)}
                    title="Copy full equation"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* History drawer */}
          {history.length > 0 && (
            <div className="rounded-2xl p-4 bg-neutral-900/40 dark:bg-[#121624]/60 border border-white/10 backdrop-blur-md">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Recent Calculations</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  Clear history
                </button>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {history.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(item.result)}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 cursor-pointer transition-colors"
                  >
                    <span className="text-neutral-300 truncate max-w-[200px]">{item.text}</span>
                    <span className="font-mono text-indigo-400 font-bold shrink-0">{item.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
