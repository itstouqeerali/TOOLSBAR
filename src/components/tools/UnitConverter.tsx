import React, { useState, useMemo } from 'react';
import { Scale, ArrowRightLeft, Copy, Check, Sparkles, Hash } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'digital' | 'time';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNIT_GROUPS: Record<UnitCategory, { name: string; icon: string; units: UnitDef[] }> = {
  length: {
    name: 'Length & Distance',
    icon: 'Ruler',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', toBase: v => v * 1852, fromBase: v => v / 1852 },
    ]
  },
  weight: {
    name: 'Weight & Mass',
    icon: 'Scale',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 'lb', name: 'Pound (lbs)', symbol: 'lb', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: v => v * 0.028349523125, fromBase: v => v / 0.028349523125 },
      { id: 'ton_metric', name: 'Metric Ton', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'stone', name: 'Stone', symbol: 'st', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
    ]
  },
  temperature: {
    name: 'Temperature',
    icon: 'Thermometer',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * (9 / 5)) + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  digital: {
    name: 'Digital Data & Storage',
    icon: 'HardDrive',
    units: [
      { id: 'byte', name: 'Byte', symbol: 'B', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: v => v * 1024 ** 3, fromBase: v => v / (1024 ** 3) },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: v => v * 1024 ** 4, fromBase: v => v / (1024 ** 4) },
      { id: 'pb', name: 'Petabyte', symbol: 'PB', toBase: v => v * 1024 ** 5, fromBase: v => v / (1024 ** 5) },
    ]
  },
  area: {
    name: 'Area',
    icon: 'Grid',
    units: [
      { id: 'sq_m', name: 'Square Meter', symbol: 'm²', toBase: v => v, fromBase: v => v },
      { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { id: 'sq_yd', name: 'Square Yard', symbol: 'yd²', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
      { id: 'acre', name: 'Acre', symbol: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
    ]
  },
  volume: {
    name: 'Volume & Liquid',
    icon: 'Droplet',
    units: [
      { id: 'liter', name: 'Liter', symbol: 'L', toBase: v => v, fromBase: v => v },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: v => v * 1000, fromBase: v => v / 1000 },
    ]
  },
  speed: {
    name: 'Speed & Velocity',
    icon: 'Gauge',
    units: [
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'ms', name: 'Meters per second', symbol: 'm/s', toBase: v => v, fromBase: v => v },
      { id: 'knots', name: 'Knots', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ]
  },
  time: {
    name: 'Time',
    icon: 'Clock',
    units: [
      { id: 'sec', name: 'Second', symbol: 's', toBase: v => v, fromBase: v => v },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'min', name: 'Minute', symbol: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
      { id: 'hr', name: 'Hour', symbol: 'hr', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'day', name: 'Day', symbol: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { id: 'year', name: 'Year (365d)', symbol: 'yr', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
    ]
  }
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('100');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync unit defaults on category switch
  const currentUnits = UNIT_GROUPS[category].units;

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = UNIT_GROUPS[newCat].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1] ? units[1].id : units[0].id);
  };

  const fromUnit = currentUnits.find(u => u.id === fromUnitId) || currentUnits[0];
  const toUnit = currentUnits.find(u => u.id === toUnitId) || currentUnits[1] || currentUnits[0];

  const calculatedOutput = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return null;

    const baseVal = fromUnit.toBase(num);
    const result = toUnit.fromBase(baseVal);

    return result;
  }, [inputValue, fromUnit, toUnit]);

  // All conversions in category
  const allConversions = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return [];

    const baseVal = fromUnit.toBase(num);
    return currentUnits.map(unit => {
      const res = unit.fromBase(baseVal);
      return {
        unit,
        value: res
      };
    });
  }, [inputValue, fromUnit, currentUnits]);

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(4);
    }
    return parseFloat(num.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="unit-converter-tool">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl">
        {(Object.keys(UNIT_GROUPS) as UnitCategory[]).map((catKey) => {
          const group = UNIT_GROUPS[catKey];
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                category === catKey
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {group.name}
            </button>
          );
        })}
      </div>

      {/* Main Conversion Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* From Side */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">From Value</span>
          
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-2xl font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all font-bold"
            placeholder="0"
          />

          <select
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="w-full bg-black/50 text-white border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id} className="bg-neutral-900">
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-2 flex justify-center">
          <button
            onClick={handleSwap}
            title="Swap conversion units"
            className="p-3.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all shadow-lg hover:rotate-180 duration-300 cursor-pointer"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* To Side */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-gradient-to-br from-indigo-950/60 via-[#131a33]/70 to-[#0e1222]/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">Converted Result</span>
            {calculatedOutput !== null && (
              <button
                onClick={() => handleCopy(`${formatNumber(calculatedOutput)} ${toUnit.symbol}`)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-2xl font-mono text-white break-all min-h-[56px] flex items-center font-bold">
            {calculatedOutput !== null ? formatNumber(calculatedOutput) : '---'}
          </div>

          <select
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="w-full bg-black/50 text-white border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id} className="bg-neutral-900">
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* All Units at a Glance Grid */}
      <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-400" /> All {UNIT_GROUPS[category].name} Conversions at a Glance
          </span>
          <span className="text-xs text-neutral-500">Live Bidirectional Matrix</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allConversions.map(({ unit, value }) => (
            <div
              key={unit.id}
              onClick={() => handleCopy(`${formatNumber(value)} ${unit.symbol}`)}
              className="p-3.5 rounded-xl bg-black/30 hover:bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div>
                <div className="text-xs text-neutral-400 group-hover:text-neutral-300">{unit.name}</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">{formatNumber(value)} <span className="text-indigo-400 font-semibold">{unit.symbol}</span></div>
              </div>
              <Copy className="w-3.5 h-3.5 text-neutral-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
