import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Activity, Info, Scale, ArrowRight } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

interface BmiCategory {
  label: string;
  min: number;
  max: number;
  color: string;
  textColor: string;
  description: string;
}

const BMI_CATEGORIES: BmiCategory[] = [
  { label: 'Underweight (Severe)', min: 0, max: 16, color: 'bg-blue-600', textColor: 'text-blue-400', description: 'Significant body mass deficit.' },
  { label: 'Underweight (Moderate)', min: 16, max: 18.5, color: 'bg-cyan-500', textColor: 'text-cyan-400', description: 'Below standard healthy body weight.' },
  { label: 'Normal / Healthy Weight', min: 18.5, max: 24.9, color: 'bg-emerald-500', textColor: 'text-emerald-400', description: 'Optimal weight for cardiovascular health.' },
  { label: 'Overweight (Pre-obese)', min: 25, max: 29.9, color: 'bg-amber-500', textColor: 'text-amber-400', description: 'Above standard recommended weight.' },
  { label: 'Obese (Class I)', min: 30, max: 34.9, color: 'bg-orange-500', textColor: 'text-orange-400', description: 'Moderate health risk category.' },
  { label: 'Obese (Class II)', min: 35, max: 39.9, color: 'bg-rose-500', textColor: 'text-rose-400', description: 'Severe obesity category.' },
  { label: 'Obese (Class III - Severe)', min: 40, max: 100, color: 'bg-red-600', textColor: 'text-red-400', description: 'Very high health risk category.' },
];

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  
  // Metric state
  const [heightCm, setHeightCm] = useState<string>('175');
  const [weightKg, setWeightKg] = useState<string>('70');
  
  // Imperial state
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('154');
  
  // Demographic context (optional)
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  
  const [copied, setCopied] = useState(false);

  // Conversion & calculation
  let weightInKg = 0;
  let heightInMeters = 0;

  if (unitSystem === 'metric') {
    weightInKg = parseFloat(weightKg) || 0;
    heightInMeters = (parseFloat(heightCm) || 0) / 100;
  } else {
    weightInKg = (parseFloat(weightLbs) || 0) * 0.45359237;
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    heightInMeters = totalInches * 0.0254;
  }

  const isValid = weightInKg > 0 && heightInMeters > 0;
  const bmi = isValid ? weightInKg / (heightInMeters * heightInMeters) : 0;
  const primeBmi = isValid ? bmi / 25 : 0;
  const ponderalIndex = isValid ? weightInKg / Math.pow(heightInMeters, 3) : 0;

  // Healthy weight range (BMI 18.5 to 24.9)
  const minHealthyKg = heightInMeters > 0 ? 18.5 * (heightInMeters * heightInMeters) : 0;
  const maxHealthyKg = heightInMeters > 0 ? 24.9 * (heightInMeters * heightInMeters) : 0;

  const currentCategory = BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];

  const handleCopy = () => {
    if (!isValid) return;
    const text = `BMI: ${bmi.toFixed(1)} (${currentCategory.label})\nHeight: ${unitSystem === 'metric' ? `${heightCm} cm` : `${heightFt}'${heightIn}"`}\nWeight: ${unitSystem === 'metric' ? `${weightKg} kg` : `${weightLbs} lbs`}\nHealthy Weight Range: ${unitSystem === 'metric' ? `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg` : `${(minHealthyKg * 2.20462).toFixed(1)} - ${(maxHealthyKg * 2.20462).toFixed(1)} lbs`}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (unitSystem === 'metric') {
      setHeightCm('175');
      setWeightKg('70');
    } else {
      setHeightFt('5');
      setHeightIn('9');
      setWeightLbs('154');
    }
  };

  return (
    <div className="space-y-6" id="bmi-calculator-tool">
      {/* Unit Selector */}
      <div className="flex items-center justify-between">
        <div className="flex p-1 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              unitSystem === 'metric'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Metric (cm, kg)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              unitSystem === 'imperial'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Imperial (ft, in, lbs)
          </button>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Body Measurements
              </span>
              <span className="text-xs text-neutral-400">WHO Standard Formula</span>
            </div>

            {/* Height input */}
            {unitSystem === 'metric' ? (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Height <span className="text-indigo-400">(Centimeters)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="280"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">cm</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Height <span className="text-indigo-400">(Feet & Inches)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="9"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">in</span>
                  </div>
                </div>
              </div>
            )}

            {/* Weight input */}
            {unitSystem === 'metric' ? (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Weight <span className="text-indigo-400">(Kilograms)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="400"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="70"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">kg</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Weight <span className="text-indigo-400">(Pounds)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="40"
                    max="900"
                    step="0.1"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="154"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">lbs</span>
                </div>
              </div>
            )}

            {/* Demographic context */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Age (Years)</label>
                <input
                  type="number"
                  min="2"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Sex</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">General / Adult</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Info className="w-3.5 h-3.5" /> Informational metric only
            </span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18]/80 to-[#030303] border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Body Mass Index (BMI)
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${currentCategory.textColor} bg-white/5 border border-white/10`}>
                  {currentCategory.label.split(' ')[0]}
                </span>
              </div>

              {/* BMI Big Number */}
              {isValid ? (
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold font-display text-white">
                      {bmi.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-neutral-400">kg/m²</span>
                  </div>
                  <p className={`text-base font-bold mt-1 ${currentCategory.textColor}`}>
                    {currentCategory.label}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {currentCategory.description}
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-400 text-sm">
                  Enter valid height and weight values
                </div>
              )}

              {/* Visual Category Range Bar */}
              {isValid && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>16</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40+</span>
                  </div>
                  <div className="h-3.5 w-full rounded-full bg-white/10 p-0.5 flex overflow-hidden relative">
                    <div className="h-full bg-blue-500 w-[15%]" title="Underweight <18.5" />
                    <div className="h-full bg-emerald-500 w-[30%]" title="Normal 18.5-24.9" />
                    <div className="h-full bg-amber-500 w-[20%]" title="Overweight 25-29.9" />
                    <div className="h-full bg-orange-500 w-[15%]" title="Obese I 30-34.9" />
                    <div className="h-full bg-rose-500 w-[10%]" title="Obese II 35-39.9" />
                    <div className="h-full bg-red-600 w-[10%]" title="Obese III 40+" />

                    {/* Cursor indicator */}
                    <div 
                      className="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg shadow-white/80 rounded-full -translate-x-1/2 transition-all duration-300"
                      style={{
                        left: `${Math.min(Math.max(((bmi - 15) / (42 - 15)) * 100, 2), 98)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Health stats table */}
              {isValid && (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-neutral-400 block text-[11px] mb-1">Ideal Weight Range</span>
                    <span className="text-white font-bold text-sm">
                      {unitSystem === 'metric' 
                        ? `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`
                        : `${(minHealthyKg * 2.20462).toFixed(1)} - ${(maxHealthyKg * 2.20462).toFixed(1)} lbs`
                      }
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-neutral-400 block text-[11px] mb-1">BMI Prime</span>
                    <span className="text-white font-bold text-sm">
                      {primeBmi.toFixed(2)} <span className="text-[10px] text-neutral-400">({primeBmi <= 1 ? 'Optimal' : 'Elevated'})</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {isValid && (
              <div className="pt-6 border-t border-white/10 mt-6 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Stats!' : 'Copy BMI Report'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
