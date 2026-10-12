import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Thermometer, ArrowRightLeft, Sparkles, Flame, Snowflake, Info } from 'lucide-react';

interface TempScale {
  id: string;
  name: string;
  symbol: string;
  toKelvin: (v: number) => number;
  fromKelvin: (k: number) => number;
  formula: string;
}

const SCALES: TempScale[] = [
  {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
    toKelvin: (c) => c + 273.15,
    fromKelvin: (k) => k - 273.15,
    formula: '°C = K - 273.15'
  },
  {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
    toKelvin: (f) => (f - 32) * (5 / 9) + 273.15,
    fromKelvin: (k) => (k - 273.15) * (9 / 5) + 32,
    formula: '°F = (°C × 9/5) + 32'
  },
  {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
    toKelvin: (k) => k,
    fromKelvin: (k) => k,
    formula: 'K = °C + 273.15'
  },
  {
    id: 'rankine',
    name: 'Rankine',
    symbol: '°R',
    toKelvin: (r) => r * (5 / 9),
    fromKelvin: (k) => k * (9 / 5),
    formula: '°R = K × 9/5'
  },
  {
    id: 'reaumur',
    name: 'Réaumur',
    symbol: '°Ré',
    toKelvin: (re) => re * (5 / 4) + 273.15,
    fromKelvin: (k) => (k - 273.15) * (4 / 5),
    formula: '°Ré = °C × 4/5'
  }
];

const BENCHMARKS = [
  { label: 'Absolute Zero', celsius: -273.15, desc: 'Theoretical lowest temperature' },
  { label: 'Water Freezing Point', celsius: 0, desc: 'Ice & liquid water in equilibrium at 1 atm' },
  { label: 'Room Temperature', celsius: 21, desc: 'Standard indoor ambient comfort' },
  { label: 'Normal Human Body', celsius: 37, desc: 'Average internal body core temperature' },
  { label: 'Water Boiling Point', celsius: 100, desc: 'Liquid water vaporizes at 1 atm' },
  { label: 'Gold Melting Point', celsius: 1064, desc: 'Pure elemental gold turns to liquid' },
];

export const TemperatureConverter: React.FC = () => {
  const [value, setValue] = useState<string>('25');
  const [fromScale, setFromScale] = useState<string>('celsius');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const inputNum = parseFloat(value) || 0;
  const currentScale = SCALES.find(s => s.id === fromScale) || SCALES[0];

  const kelvinValue = currentScale.toKelvin(inputNum);
  const celsiusValue = kelvinValue - 273.15;

  // Visual thermometer indicator percentage (-40°C to 120°C scale)
  const clampedCelsius = Math.max(-40, Math.min(120, celsiusValue));
  const thermoPercent = ((clampedCelsius + 40) / 160) * 100;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6" id="temperature-converter-tool">
      {/* Input Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> Temperature Value & Scale
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Temperature</label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="25"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xl font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Scale</label>
            <select
              value={fromScale}
              onChange={(e) => setFromScale(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {SCALES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thermometer Visual Gauge */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Snowflake className="w-3.5 h-3.5" /> Freezing (-40°C)
            </span>
            <span className="font-mono font-bold text-white">
              {celsiusValue.toFixed(1)}°C
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <Flame className="w-3.5 h-3.5" /> Boiling (100°C+)
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden relative p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 transition-all duration-300"
              style={{ width: `${Math.max(2, Math.min(100, thermoPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCALES.map(s => {
          const converted = s.fromKelvin(kelvinValue);
          const isSelected = s.id === fromScale;

          return (
            <div
              key={s.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/40 shadow-xl'
                  : 'bg-white/[0.025] border-white/[0.08] hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">{s.name}</span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1 block">
                    {converted.toFixed(2)} <span className="text-lg text-indigo-400 font-sans">{s.symbol}</span>
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(s.id, `${converted.toFixed(2)} ${s.symbol}`)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-indigo-600 text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0"
                  title="Copy temperature"
                >
                  {copiedId === s.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-white/5">
                Formula: {s.formula}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thermal Benchmarks Table */}
      <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl space-y-4">
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
          <Info className="w-4 h-4" /> Physical Thermal Benchmarks
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BENCHMARKS.map((b, idx) => (
            <button
              key={idx}
              onClick={() => {
                setValue(b.celsius.toString());
                setFromScale('celsius');
              }}
              className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{b.label}</span>
                <span className="text-xs font-mono text-emerald-400">{b.celsius}°C</span>
              </div>
              <span className="text-[11px] text-neutral-400 block mt-1">{b.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
