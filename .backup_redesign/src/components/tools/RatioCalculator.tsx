import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Split, ArrowRight, HelpCircle, Calculator } from 'lucide-react';

type Mode = 'solve' | 'simplify' | 'scale' | 'divide';

export const RatioCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('solve');
  
  // Solve mode state: A / B = C / D (one is empty/unknown)
  const [valA, setValA] = useState<string>('16');
  const [valB, setValB] = useState<string>('9');
  const [valC, setValC] = useState<string>('1920');
  const [valD, setValD] = useState<string>('');
  
  // Simplify mode state: A : B or A : B : C
  const [simpA, setSimpA] = useState<string>('1920');
  const [simpB, setSimpB] = useState<string>('1080');
  const [simpC, setSimpC] = useState<string>('');

  // Scale mode state: A : B scaled by factor or target dimension
  const [scaleA, setScaleA] = useState<string>('4');
  const [scaleB, setScaleB] = useState<string>('3');
  const [scaleFactor, setScaleFactor] = useState<string>('2.5');

  // Divide mode state: Split total by ratio A:B:C
  const [divideTotal, setDivideTotal] = useState<string>('1000');
  const [divR1, setDivR1] = useState<string>('2');
  const [divR2, setDivR2] = useState<string>('3');
  const [divR3, setDivR3] = useState<string>('5');

  const [copied, setCopied] = useState<boolean>(false);

  // Helper GCD
  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  const calculate = () => {
    let result = '';
    let explanation = '';

    if (mode === 'solve') {
      const a = parseFloat(valA);
      const b = parseFloat(valB);
      const c = parseFloat(valC);
      const d = parseFloat(valD);

      const emptyCount = [valA, valB, valC, valD].filter(v => v.trim() === '').length;
      if (emptyCount !== 1) {
        return { result: null, explanation: 'Leave exactly one field blank as the unknown variable (X).' };
      }

      if (valA.trim() === '') {
        if (d === 0) return { result: null, explanation: 'Division by zero.' };
        const ans = (b * c) / d;
        result = `A = ${ans}`;
        explanation = `A = (B × C) ÷ D = (${b} × ${c}) ÷ ${d} = ${ans}`;
      } else if (valB.trim() === '') {
        if (c === 0) return { result: null, explanation: 'Division by zero.' };
        const ans = (a * d) / c;
        result = `B = ${ans}`;
        explanation = `B = (A × D) ÷ C = (${a} × ${d}) ÷ ${c} = ${ans}`;
      } else if (valC.trim() === '') {
        if (b === 0) return { result: null, explanation: 'Division by zero.' };
        const ans = (a * d) / b;
        result = `C = ${ans}`;
        explanation = `C = (A × D) ÷ B = (${a} × ${d}) ÷ ${b} = ${ans}`;
      } else if (valD.trim() === '') {
        if (a === 0) return { result: null, explanation: 'Division by zero.' };
        const ans = (b * c) / a;
        result = `D = ${ans}`;
        explanation = `D = (B × C) ÷ A = (${b} × ${c}) ÷ ${a} = ${ans}`;
      }
    } else if (mode === 'simplify') {
      const a = parseFloat(simpA);
      const b = parseFloat(simpB);
      const c = parseFloat(simpC);

      if (isNaN(a) || isNaN(b) || a === 0 || b === 0) {
        return { result: null, explanation: 'Enter non-zero integer values to simplify.' };
      }

      if (!isNaN(c) && c !== 0 && simpC.trim() !== '') {
        const divisor = gcd(gcd(a, b), c);
        const sA = a / divisor;
        const sB = b / divisor;
        const sC = c / divisor;
        result = `${sA} : ${sB} : ${sC}`;
        explanation = `Greatest Common Divisor (GCD) is ${divisor}. Dividing all terms by ${divisor} yields ${sA} : ${sB} : ${sC}.`;
      } else {
        const divisor = gcd(a, b);
        const sA = a / divisor;
        const sB = b / divisor;
        result = `${sA} : ${sB}`;
        const decimal = a / b;
        explanation = `Greatest Common Divisor (GCD) is ${divisor}. Simplified ratio: ${sA} : ${sB} (Decimal equivalent: ${decimal.toFixed(4)})`;
      }
    } else if (mode === 'scale') {
      const a = parseFloat(scaleA);
      const b = parseFloat(scaleB);
      const factor = parseFloat(scaleFactor);

      if (isNaN(a) || isNaN(b) || isNaN(factor)) {
        return { result: null, explanation: 'Enter valid ratio values and scale multiplier.' };
      }

      const resA = a * factor;
      const resB = b * factor;
      result = `${resA} : ${resB}`;
      explanation = `Scaled ${a} : ${b} by factor of ${factor} $\\rightarrow$ (${a} × ${factor}) : (${b} × ${factor}) = ${resA} : ${resB}`;
    } else if (mode === 'divide') {
      const total = parseFloat(divideTotal);
      const r1 = parseFloat(divR1) || 0;
      const r2 = parseFloat(divR2) || 0;
      const r3 = parseFloat(divR3) || 0;

      const sumRatios = r1 + r2 + r3;
      if (isNaN(total) || sumRatios <= 0) {
        return { result: null, explanation: 'Enter a valid total amount and positive ratio components.' };
      }

      const part1 = (total * r1) / sumRatios;
      const part2 = (total * r2) / sumRatios;
      const part3 = r3 > 0 ? (total * r3) / sumRatios : 0;

      if (r3 > 0) {
        result = `Part 1: ${part1.toFixed(2)} | Part 2: ${part2.toFixed(2)} | Part 3: ${part3.toFixed(2)}`;
        explanation = `Total ${total} split into parts ${r1} : ${r2} : ${r3} (Sum of parts = ${sumRatios}). Unit value = ${(total / sumRatios).toFixed(4)}`;
      } else {
        result = `Part 1: ${part1.toFixed(2)} | Part 2: ${part2.toFixed(2)}`;
        explanation = `Total ${total} split into parts ${r1} : ${r2} (Sum of parts = ${sumRatios}). Unit value = ${(total / sumRatios).toFixed(4)}`;
      }
    }

    return { result, explanation };
  };

  const { result, explanation } = calculate();

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result}\n${explanation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="ratio-calculator-tool">
      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 backdrop-blur-md">
        {[
          { id: 'solve', label: 'Solve Proportion (A:B = C:D)' },
          { id: 'simplify', label: 'Simplify Ratio' },
          { id: 'scale', label: 'Scale / Resize' },
          { id: 'divide', label: 'Divide a Total' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as Mode)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Split className="w-4 h-4" /> Ratio Parameters
              </span>
            </div>

            {/* Mode 1: Solve */}
            {mode === 'solve' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-400">
                  Enter 3 known values and leave the 4th blank to solve for the missing term.
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs text-neutral-400 font-mono">A (Numerator)</label>
                    <input
                      type="number"
                      value={valA}
                      onChange={(e) => setValA(e.target.value)}
                      placeholder="e.g. 16"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-center text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="w-full h-0.5 bg-white/20 my-1" />
                    <label className="text-xs text-neutral-400 font-mono">B (Denominator)</label>
                    <input
                      type="number"
                      value={valB}
                      onChange={(e) => setValB(e.target.value)}
                      placeholder="e.g. 9"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-center text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <span className="text-2xl font-bold text-indigo-400">=</span>

                  <div className="flex-1 space-y-2">
                    <label className="text-xs text-neutral-400 font-mono">C (Numerator)</label>
                    <input
                      type="number"
                      value={valC}
                      onChange={(e) => setValC(e.target.value)}
                      placeholder="e.g. 1920"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-center text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="w-full h-0.5 bg-white/20 my-1" />
                    <label className="text-xs text-neutral-400 font-mono">D (Denominator / X)</label>
                    <input
                      type="number"
                      value={valD}
                      onChange={(e) => setValD(e.target.value)}
                      placeholder="[Leave blank for X]"
                      className="w-full bg-black/40 border border-indigo-500/50 rounded-xl p-3 font-mono text-center text-indigo-300 placeholder-indigo-400/50 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Simplify */}
            {mode === 'simplify' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-400">
                  Enter integer terms to reduce to smallest common whole numbers:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Term A</label>
                    <input
                      type="number"
                      value={simpA}
                      onChange={(e) => setSimpA(e.target.value)}
                      placeholder="1920"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Term B</label>
                    <input
                      type="number"
                      value={simpB}
                      onChange={(e) => setSimpB(e.target.value)}
                      placeholder="1080"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Term C (Optional)</label>
                    <input
                      type="number"
                      value={simpC}
                      onChange={(e) => setSimpC(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Scale */}
            {mode === 'scale' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Base Ratio (A)</label>
                    <input
                      type="number"
                      value={scaleA}
                      onChange={(e) => setScaleA(e.target.value)}
                      placeholder="4"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Base Ratio (B)</label>
                    <input
                      type="number"
                      value={scaleB}
                      onChange={(e) => setScaleB(e.target.value)}
                      placeholder="3"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Scale Multiplier (Factor)</label>
                  <input
                    type="number"
                    step="any"
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(e.target.value)}
                    placeholder="2.5"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Mode 4: Divide */}
            {mode === 'divide' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Total Quantity to Divide</label>
                  <input
                    type="number"
                    value={divideTotal}
                    onChange={(e) => setDivideTotal(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Ratio Part 1</label>
                    <input
                      type="number"
                      value={divR1}
                      onChange={(e) => setDivR1(e.target.value)}
                      placeholder="2"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Ratio Part 2</label>
                    <input
                      type="number"
                      value={divR2}
                      onChange={(e) => setDivR2(e.target.value)}
                      placeholder="3"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Part 3 (Opt)</label>
                    <input
                      type="number"
                      value={divR3}
                      onChange={(e) => setDivR3(e.target.value)}
                      placeholder="5"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Calculated Result
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30">
                  Proportion
                </span>
              </div>

              {result ? (
                <div className="space-y-4">
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white break-words">
                    {result}
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300 font-mono leading-relaxed">
                    {explanation}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  {explanation || 'Provide input values to evaluate proportion.'}
                </div>
              )}
            </div>

            {result && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Proportion Answer'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
