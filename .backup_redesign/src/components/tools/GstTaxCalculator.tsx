import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Receipt, Calculator, Percent, Sparkles } from 'lucide-react';

type Mode = 'add_tax' | 'remove_tax';

export const GstTaxCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('add_tax');
  const [amount, setAmount] = useState<string>('1000');
  const [taxRate, setTaxRate] = useState<string>('18');
  const [taxType, setTaxType] = useState<'split' | 'single'>('split');
  const [currency, setCurrency] = useState<string>('$');
  const [copied, setCopied] = useState<boolean>(false);

  const inputVal = parseFloat(amount) || 0;
  const rate = parseFloat(taxRate) || 0;

  let netAmount = 0;
  let taxAmount = 0;
  let grossAmount = 0;

  if (mode === 'add_tax') {
    // Input is Net / Exclusive
    netAmount = inputVal;
    taxAmount = (netAmount * rate) / 100;
    grossAmount = netAmount + taxAmount;
  } else {
    // Input is Gross / Inclusive
    grossAmount = inputVal;
    netAmount = grossAmount / (1 + rate / 100);
    taxAmount = grossAmount - netAmount;
  }

  const halfTax = taxAmount / 2;

  const handleCopy = () => {
    const text = `Tax / GST Calculation (${rate}%):\nMode: ${mode === 'add_tax' ? 'Exclusive to Inclusive (Add Tax)' : 'Inclusive to Exclusive (Reverse Tax)'}\nNet Amount: ${currency}${netAmount.toFixed(2)}\nTax Amount (${rate}%): ${currency}${taxAmount.toFixed(2)}${taxType === 'split' ? ` (CGST: ${currency}${halfTax.toFixed(2)} | SGST: ${currency}${halfTax.toFixed(2)})` : ''}\nGross / Total Amount: ${currency}${grossAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAmount('1000');
    setTaxRate('18');
  };

  return (
    <div className="space-y-6" id="gst-tax-calculator-tool">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-black/30 text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {['$', '€', '£', '₹', '¥', 'C$', 'A$', 'AED', 'SAR'].map(c => (
              <option key={c} value={c} className="bg-neutral-900">{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setMode('add_tax')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            mode === 'add_tax'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Add GST / Tax (Exclusive $\to$ Inclusive)
        </button>
        <button
          onClick={() => setMode('remove_tax')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            mode === 'remove_tax'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Remove GST / Reverse (Inclusive $\to$ Exclusive)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Transaction Parameters
              </span>
            </div>

            {/* Input Amount */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {mode === 'add_tax' ? 'Net Initial Amount (Pre-Tax)' : 'Total Gross Amount (Tax Included)'}{' '}
                <span className="text-indigo-400">({currency})</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                GST / Tax Percentage Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="18"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">%</span>
              </div>

              {/* Tax Slab Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {['3', '5', '12', '18', '20', '28'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTaxRate(r)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      taxRate === r
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                    }`}
                  >
                    {r}% Tax
                  </button>
                ))}
              </div>
            </div>

            {/* Tax breakdown type */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Tax Split Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaxType('split')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    taxType === 'split'
                      ? 'bg-white/10 border-indigo-500/50 text-white'
                      : 'bg-black/30 border-white/5 text-neutral-400'
                  }`}
                >
                  CGST + SGST (50% / 50%)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxType('single')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    taxType === 'single'
                      ? 'bg-white/10 border-indigo-500/50 text-white'
                      : 'bg-black/30 border-white/5 text-neutral-400'
                  }`}
                >
                  Single / IGST (100%)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Total Final Amount
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30">
                  {rate}% GST
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                  {currency}{grossAmount.toFixed(2)}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400 font-semibold">
                  <span>Net Price: {currency}{netAmount.toFixed(2)}</span>
                  <span>•</span>
                  <span>Tax: +{currency}{taxAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Tax Invoice Breakdown */}
              <div className="space-y-2 pt-2 text-xs border-t border-white/10">
                <div className="flex justify-between py-1 text-neutral-400">
                  <span>Net Price (Excl. Tax):</span>
                  <span className="text-white font-mono">{currency}{netAmount.toFixed(2)}</span>
                </div>

                {taxType === 'split' ? (
                  <>
                    <div className="flex justify-between py-1 text-indigo-300">
                      <span>CGST ({(rate / 2).toFixed(1)}%):</span>
                      <span className="font-mono">+{currency}{halfTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-indigo-300">
                      <span>SGST ({(rate / 2).toFixed(1)}%):</span>
                      <span className="font-mono">+{currency}{halfTax.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-indigo-300">
                    <span>IGST / Total Tax ({rate}%):</span>
                    <span className="font-mono">+{currency}{taxAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-white text-sm">
                  <span>Gross Total (Incl. Tax):</span>
                  <span className="text-indigo-300 font-mono">{currency}{grossAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Invoice!' : 'Copy Tax Breakdown'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
