import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Landmark, Calculator, Info, Calendar } from 'lucide-react';

export const SimpleInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('10000');
  const [rate, setRate] = useState<string>('6.5');
  const [timeValue, setTimeValue] = useState<string>('3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months' | 'days'>('years');
  const [currency, setCurrency] = useState<string>('$');
  const [copied, setCopied] = useState<boolean>(false);

  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const T = parseFloat(timeValue) || 0;

  // Convert T to years for annual formula
  let timeInYears = T;
  if (timeUnit === 'months') {
    timeInYears = T / 12;
  } else if (timeUnit === 'days') {
    timeInYears = T / 365;
  }

  const isValid = P > 0 && R >= 0 && T > 0;
  const interestEarned = isValid ? (P * R * timeInYears) / 100 : 0;
  const totalAmount = isValid ? P + interestEarned : 0;
  const monthlyYield = timeInYears > 0 ? interestEarned / (timeInYears * 12) : 0;

  // Annual breakdown for up to 10 years
  const scheduleYears = Math.min(Math.ceil(timeInYears), 10);
  const schedule = [];
  if (isValid && scheduleYears > 0) {
    const yearlyInterest = (P * R) / 100;
    for (let yr = 1; yr <= scheduleYears; yr++) {
      const yrFraction = Math.min(yr, timeInYears);
      const accInterest = (P * R * yrFraction) / 100;
      schedule.push({
        year: yr,
        interestThisYear: yr <= timeInYears ? yearlyInterest : (timeInYears - (yr - 1)) * yearlyInterest,
        totalInterest: accInterest,
        balance: P + accInterest
      });
    }
  }

  const handleCopy = () => {
    if (!isValid) return;
    const text = `Simple Interest Calculation:\nPrincipal: ${currency}${P.toLocaleString()}\nRate: ${R}% per annum\nTenure: ${T} ${timeUnit}\n\nTotal Interest Earned: ${currency}${interestEarned.toFixed(2)}\nTotal Maturity Value: ${currency}${totalAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrincipal('10000');
    setRate('6.5');
    setTimeValue('3');
    setTimeUnit('years');
  };

  return (
    <div className="space-y-6" id="simple-interest-calculator-tool">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Parameters */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Landmark className="w-4 h-4" /> Deposit Parameters
              </span>
              <span className="text-xs text-neutral-400">I = (P × R × T) / 100</span>
            </div>

            {/* Principal */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Principal Amount <span className="text-indigo-400">({currency})</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-neutral-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="10000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Annual Rate */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Annual Interest Rate <span className="text-indigo-400">(% per year)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="6.5"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Investment Period / Tenure
              </label>
              <div className="grid grid-cols-12 gap-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  placeholder="3"
                  className="col-span-7 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as any)}
                  className="col-span-5 bg-neutral-900 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Info className="w-3.5 h-3.5" /> For educational estimates. Not financial advice.
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Total Maturity Value
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25">
                  Simple Interest
                </span>
              </div>

              {isValid ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                      {currency}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-emerald-400 font-bold">
                      <span>Total Interest Earned: +{currency}{interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* 2x2 Metric Cards */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Principal Invested</span>
                      <span className="text-white font-mono font-bold text-sm">{currency}{P.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Effective Total Return</span>
                      <span className="text-emerald-400 font-mono font-bold text-sm">{((interestEarned / P) * 100).toFixed(2)}%</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Avg Monthly Interest</span>
                      <span className="text-white font-mono font-bold text-sm">{currency}{monthlyYield.toFixed(2)}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Annual Interest</span>
                      <span className="text-white font-mono font-bold text-sm">{currency}{((P * R) / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Growth Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Principal ({((P / totalAmount) * 100).toFixed(0)}%)</span>
                      <span className="text-emerald-400">Interest ({((interestEarned / totalAmount) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden flex">
                      <div className="bg-indigo-600 h-full" style={{ width: `${(P / totalAmount) * 100}%` }} />
                      <div className="bg-emerald-500 h-full" style={{ width: `${(interestEarned / totalAmount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  Enter deposit parameters to calculate simple interest yield.
                </div>
              )}
            </div>

            {isValid && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Details!' : 'Copy Investment Summary'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
