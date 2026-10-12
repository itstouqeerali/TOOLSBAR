import React, { useState } from 'react';
import { Copy, Check, RotateCcw, CreditCard, DollarSign, Calendar, Info, ChevronDown } from 'lucide-react';

export const LoanEmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('250000');
  const [interestRate, setInterestRate] = useState<string>('7.5');
  const [tenureValue, setTenureValue] = useState<string>('20');
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [processingFeePercent, setProcessingFeePercent] = useState<string>('0.5');
  const [currency, setCurrency] = useState<string>('$');
  const [copied, setCopied] = useState<boolean>(false);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  const P = parseFloat(loanAmount) || 0;
  const annualRate = parseFloat(interestRate) || 0;
  const tenureInput = parseFloat(tenureValue) || 0;
  const feePercent = parseFloat(processingFeePercent) || 0;

  const totalMonths = tenureUnit === 'years' ? tenureInput * 12 : tenureInput;
  const monthlyRate = annualRate / (12 * 100);

  const isValid = P > 0 && annualRate > 0 && totalMonths > 0;

  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;
  let processingFee = (P * feePercent) / 100;

  if (isValid) {
    if (monthlyRate === 0) {
      emi = P / totalMonths;
    } else {
      emi = (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    totalPayment = emi * totalMonths;
    totalInterest = Math.max(0, totalPayment - P);
  }

  // Generate monthly amortization for first 12 months & yearly summary
  const amortizationSchedule: Array<{
    month: number;
    openingBalance: number;
    emi: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }> = [];

  if (isValid) {
    let balance = P;
    const previewMonths = Math.min(totalMonths, 24);
    for (let m = 1; m <= previewMonths; m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      const closing = Math.max(0, balance - principalForMonth);

      amortizationSchedule.push({
        month: m,
        openingBalance: balance,
        emi,
        principalPaid: principalForMonth,
        interestPaid: interestForMonth,
        closingBalance: closing
      });

      balance = closing;
    }
  }

  const handleCopy = () => {
    if (!isValid) return;
    const text = `Loan EMI Breakdown:\nLoan Amount: ${currency}${P.toLocaleString()}\nInterest Rate: ${annualRate}%\nTenure: ${tenureInput} ${tenureUnit}\n\nMonthly EMI: ${currency}${emi.toFixed(2)}\nTotal Interest: ${currency}${totalInterest.toFixed(2)}\nProcessing Fee: ${currency}${processingFee.toFixed(2)}\nTotal Repayment: ${currency}${(totalPayment + processingFee).toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setLoanAmount('250000');
    setInterestRate('7.5');
    setTenureValue('20');
    setTenureUnit('years');
    setProcessingFeePercent('0.5');
  };

  return (
    <div className="space-y-6" id="loan-emi-calculator-tool">
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
        {/* Inputs */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Loan Details
              </span>
              <span className="text-xs text-neutral-400">Equated Monthly Installment</span>
            </div>

            {/* Principal */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Loan Amount <span className="text-indigo-400">({currency})</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="250000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Annual Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="7.5"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Loan Term / Tenure
              </label>
              <div className="grid grid-cols-12 gap-3">
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={tenureValue}
                  onChange={(e) => setTenureValue(e.target.value)}
                  placeholder="20"
                  className="col-span-7 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={tenureUnit}
                  onChange={(e) => setTenureUnit(e.target.value as any)}
                  className="col-span-5 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="years">Years ({tenureInput ? tenureInput * 12 : 0} mos)</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            {/* Optional Processing Fee */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Processing Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={processingFeePercent}
                  onChange={(e) => setProcessingFeePercent(e.target.value)}
                  placeholder="0.5"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">% ({currency}{processingFee.toFixed(2)})</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Info className="w-3.5 h-3.5" /> Calculated using standard amortization reducing balance.
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Monthly Repayment
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30">
                  EMI
                </span>
              </div>

              {isValid ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                      {currency}{emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <span className="text-xs text-neutral-400">per month for {totalMonths} months</span>
                  </div>

                  {/* 2x2 Metric Breakdown */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Total Principal</span>
                      <span className="text-white font-mono font-bold text-sm">{currency}{P.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Total Interest</span>
                      <span className="text-rose-400 font-mono font-bold text-sm">+{currency}{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Total Repayment</span>
                      <span className="text-white font-mono font-bold text-sm">{currency}{(totalPayment + processingFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-neutral-400 block text-[11px]">Interest to Principal</span>
                      <span className="text-amber-400 font-mono font-bold text-sm">{((totalInterest / P) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Proportion Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Principal ({((P / totalPayment) * 100).toFixed(0)}%)</span>
                      <span className="text-rose-400">Interest ({((totalInterest / totalPayment) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="h-3.5 w-full rounded-full bg-white/10 overflow-hidden flex">
                      <div className="bg-indigo-600 h-full" style={{ width: `${(P / totalPayment) * 100}%` }} />
                      <div className="bg-rose-500 h-full" style={{ width: `${(totalInterest / totalPayment) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  Enter loan amount, interest rate, and term to calculate EMI.
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
                  {copied ? 'Copied Summary!' : 'Copy Loan Breakdown'}
                </button>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="text-xs text-neutral-400 hover:text-white py-1.5 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{showAmortization ? 'Hide' : 'View'} Initial Amortization Schedule</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAmortization ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {showAmortization && amortizationSchedule.length > 0 && (
        <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
            Initial Repayment Schedule (First {amortizationSchedule.length} Months)
          </h4>
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="pb-2">Month</th>
                <th className="pb-2">Opening Balance</th>
                <th className="pb-2">EMI</th>
                <th className="pb-2 text-indigo-400">Principal</th>
                <th className="pb-2 text-rose-400">Interest</th>
                <th className="pb-2 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {amortizationSchedule.map((row) => (
                <tr key={row.month} className="hover:bg-white/[0.02]">
                  <td className="py-2 text-white font-bold">Month {row.month}</td>
                  <td className="py-2 text-neutral-300">{currency}{row.openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-neutral-400">{currency}{row.emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-indigo-400">+{currency}{row.principalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-rose-400">+{currency}{row.interestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-right font-bold text-white">{currency}{row.closingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
