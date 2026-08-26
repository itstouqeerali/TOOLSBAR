import React, { useState } from 'react';
import { Copy, Check, RotateCcw, TrendingUp, DollarSign, Calendar, Info, ChevronDown } from 'lucide-react';

type CompoundingFrequency = '1' | '2' | '4' | '12' | '365';

export const CompoundInterestCalculator: React.FC = () => {
  const [initialPrincipal, setInitialPrincipal] = useState<string>('5000');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('200');
  const [annualRate, setAnnualRate] = useState<string>('8');
  const [years, setYears] = useState<string>('10');
  const [frequency, setFrequency] = useState<CompoundingFrequency>('12');
  const [currency, setCurrency] = useState<string>('$');
  const [copied, setCopied] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const P = parseFloat(initialPrincipal) || 0;
  const PMT = parseFloat(monthlyDeposit) || 0;
  const r = (parseFloat(annualRate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const n = parseInt(frequency, 10);

  const isValid = (P > 0 || PMT > 0) && r >= 0 && t > 0;

  // Annual Percentage Yield (APY)
  const apy = n > 0 ? (Math.pow(1 + r / n, n) - 1) * 100 : 0;

  // Compute yearly growth schedule
  const schedule: Array<{
    year: number;
    startBalance: number;
    deposits: number;
    interestEarned: number;
    endBalance: number;
  }> = [];

  let currentBalance = P;
  let totalDeposited = P;

  if (isValid && t > 0) {
    const totalYears = Math.min(Math.ceil(t), 30);
    for (let yr = 1; yr <= totalYears; yr++) {
      const startBalance = currentBalance;
      let yrInterest = 0;
      let yrDeposits = 0;

      // Simulate 12 months in this year
      for (let m = 1; m <= 12; m++) {
        currentBalance += PMT;
        yrDeposits += PMT;
        totalDeposited += PMT;

        // Apply interest according to compounding periods per month
        const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
        const interestThisMonth = currentBalance * monthlyRate;
        currentBalance += interestThisMonth;
        yrInterest += interestThisMonth;
      }

      schedule.push({
        year: yr,
        startBalance,
        deposits: yrDeposits,
        interestEarned: yrInterest,
        endBalance: currentBalance
      });
    }
  }

  const finalBalance = schedule.length > 0 ? schedule[schedule.length - 1].endBalance : 0;
  const totalInterestEarned = Math.max(0, finalBalance - totalDeposited);

  const handleCopy = () => {
    if (!isValid) return;
    const text = `Compound Interest Projection (${years} Years):\nInitial Principal: ${currency}${P.toLocaleString()}\nMonthly Contribution: ${currency}${PMT.toLocaleString()}\nAnnual Interest Rate: ${annualRate}%\nCompounding: ${frequency === '12' ? 'Monthly' : frequency === '1' ? 'Annually' : frequency === '4' ? 'Quarterly' : 'Daily'}\n\nTotal Contributions: ${currency}${totalDeposited.toFixed(2)}\nTotal Interest Earned: ${currency}${totalInterestEarned.toFixed(2)}\nFuture Value: ${currency}${finalBalance.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInitialPrincipal('5000');
    setMonthlyDeposit('200');
    setAnnualRate('8');
    setYears('10');
    setFrequency('12');
  };

  return (
    <div className="space-y-6" id="compound-interest-calculator-tool">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-black/30 text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {['$', '€', '£', '₹', '¥', 'C$', 'A$', 'AED', 'SGD'].map(c => (
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
        {/* Inputs */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Growth Parameters
              </span>
              <span className="text-xs text-neutral-400 font-mono">APY: {apy.toFixed(2)}%</span>
            </div>

            {/* Initial Investment */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Initial Investment / Starting Principal <span className="text-indigo-400">({currency})</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={initialPrincipal}
                  onChange={(e) => setInitialPrincipal(e.target.value)}
                  placeholder="5000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Monthly Contribution / Deposit <span className="text-indigo-400">({currency})</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(e.target.value)}
                  placeholder="200"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Interest Rate & Years */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Est. Annual Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="8"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Compounding Frequency */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Compounding Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as CompoundingFrequency)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="12">Monthly (12 times / year)</option>
                <option value="4">Quarterly (4 times / year)</option>
                <option value="2">Semi-Annually (2 times / year)</option>
                <option value="1">Annually (1 time / year)</option>
                <option value="365">Daily (365 times / year)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Info className="w-3.5 h-3.5" /> Assumes consistent compounding & reinvestment.
          </div>
        </div>

        {/* Results Showcase */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Future Portfolio Balance
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25">
                  Compound Growth
                </span>
              </div>

              {isValid ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                      {currency}{finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-emerald-400 font-bold">
                      <span>Total Compound Interest: +{currency}{totalInterestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* 2x2 Metric Cards */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Total Principal Deposited</span>
                      <span className="text-white font-mono font-bold text-sm">{currency}{totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Interest Gain Multiplier</span>
                      <span className="text-emerald-400 font-mono font-bold text-sm">{(finalBalance / (totalDeposited || 1)).toFixed(2)}x</span>
                    </div>
                  </div>

                  {/* Growth Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Principal ({((totalDeposited / finalBalance) * 100).toFixed(0)}%)</span>
                      <span className="text-emerald-400">Interest ({((totalInterestEarned / finalBalance) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="h-3.5 w-full rounded-full bg-white/10 overflow-hidden flex">
                      <div className="bg-indigo-600 h-full transition-all" style={{ width: `${(totalDeposited / finalBalance) * 100}%` }} />
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(totalInterestEarned / finalBalance) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  Enter parameters to project future compound interest.
                </div>
              )}
            </div>

            {isValid && (
              <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-2">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Details!' : 'Copy Growth Breakdown'}
                </button>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-xs text-neutral-400 hover:text-white py-1.5 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{showSchedule ? 'Hide' : 'View'} Annual Breakdown Table</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSchedule ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annual Breakdown Schedule */}
      {showSchedule && schedule.length > 0 && (
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
            Year-by-Year Compound Growth Schedule
          </h4>
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="pb-2">Year</th>
                <th className="pb-2">Start Balance</th>
                <th className="pb-2">Annual Deposits</th>
                <th className="pb-2 text-emerald-400">Interest Earned</th>
                <th className="pb-2 text-right">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {schedule.map((row) => (
                <tr key={row.year} className="hover:bg-white/[0.02]">
                  <td className="py-2 text-white font-bold">Year {row.year}</td>
                  <td className="py-2 text-neutral-300">{currency}{row.startBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-neutral-400">+{currency}{row.deposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-emerald-400 font-semibold">+{currency}{row.interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-right font-bold text-white">{currency}{row.endBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
