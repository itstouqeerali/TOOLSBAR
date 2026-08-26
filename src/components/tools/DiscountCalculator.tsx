import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Tag, Calculator, Percent, Sparkles } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<string>('120');
  const [discountPercent, setDiscountPercent] = useState<string>('25');
  const [secondDiscountPercent, setSecondDiscountPercent] = useState<string>('10');
  const [taxPercent, setTaxPercent] = useState<string>('8');
  const [currency, setCurrency] = useState<string>('$');
  const [copied, setCopied] = useState<boolean>(false);

  const price = parseFloat(originalPrice) || 0;
  const disc1 = parseFloat(discountPercent) || 0;
  const disc2 = parseFloat(secondDiscountPercent) || 0;
  const tax = parseFloat(taxPercent) || 0;

  // Step-by-step math
  const firstDiscountAmount = (price * disc1) / 100;
  const priceAfterFirstDiscount = Math.max(0, price - firstDiscountAmount);

  const secondDiscountAmount = (priceAfterFirstDiscount * disc2) / 100;
  const priceAfterDiscounts = Math.max(0, priceAfterFirstDiscount - secondDiscountAmount);

  const totalDiscountSavings = price - priceAfterDiscounts;
  const taxAmount = (priceAfterDiscounts * tax) / 100;
  const finalPayPrice = priceAfterDiscounts + taxAmount;

  const effectiveDiscountRate = price > 0 ? (totalDiscountSavings / price) * 100 : 0;

  const handleCopy = () => {
    const text = `Original Price: ${currency}${price.toFixed(2)}\nDiscount 1: ${disc1}%\n${disc2 > 0 ? `Additional Discount: ${disc2}%\n` : ''}Total Savings: ${currency}${totalDiscountSavings.toFixed(2)} (${effectiveDiscountRate.toFixed(1)}% off)\n${tax > 0 ? `Sales Tax (${tax}%): ${currency}${taxAmount.toFixed(2)}\n` : ''}Final Price: ${currency}${finalPayPrice.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setOriginalPrice('120');
    setDiscountPercent('25');
    setSecondDiscountPercent('0');
    setTaxPercent('0');
  };

  return (
    <div className="space-y-6" id="discount-calculator-tool">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-black/30 text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {['$', '€', '£', '₹', '¥', 'C$', 'A$', '₩', 'CHF'].map(c => (
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
        {/* Input Form */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Price & Discount Parameters
              </span>
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Original Price <span className="text-indigo-400">({currency})</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-neutral-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="120.00"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Discount Percent */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Primary Discount Rate <span className="text-indigo-400">(%)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="25"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">%</span>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {['10', '15', '20', '25', '30', '40', '50', '70'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setDiscountPercent(p)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      discountPercent === p
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                    }`}
                  >
                    {p}% off
                  </button>
                ))}
              </div>
            </div>

            {/* Stackable extra discount & sales tax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Extra Stackable Coupon (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={secondDiscountPercent}
                    onChange={(e) => setSecondDiscountPercent(e.target.value)}
                    placeholder="0"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Sales Tax / VAT (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    placeholder="0"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-xs text-neutral-400 flex items-center justify-between">
            <span>Supports stacked coupons & local tax rates</span>
          </div>
        </div>

        {/* Output Showcase */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Final Price to Pay
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25">
                  {effectiveDiscountRate.toFixed(1)}% OFF
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                    {currency}{finalPayPrice.toFixed(2)}
                  </span>
                  {tax > 0 && <span className="text-xs text-neutral-400">(incl. tax)</span>}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-neutral-400 line-through">
                    {currency}{price.toFixed(2)}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Save {currency}{totalDiscountSavings.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Price Breakdown Table */}
              <div className="space-y-2 pt-2 text-xs border-t border-white/10">
                <div className="flex justify-between py-1 text-neutral-400">
                  <span>Original Price:</span>
                  <span className="text-white font-mono">{currency}{price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-400">
                  <span>Primary Discount ({disc1}%):</span>
                  <span className="font-mono">-{currency}{firstDiscountAmount.toFixed(2)}</span>
                </div>
                {disc2 > 0 && (
                  <div className="flex justify-between py-1 text-emerald-400">
                    <span>Extra Coupon ({disc2}%):</span>
                    <span className="font-mono">-{currency}{secondDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between py-1 text-amber-400">
                    <span>Estimated Tax ({tax}%):</span>
                    <span className="font-mono">+{currency}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-white text-sm">
                  <span>You Pay:</span>
                  <span className="text-indigo-300 font-mono">{currency}{finalPayPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Summary!' : 'Copy Price Breakdown'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
