import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Copy, Check, RotateCcw, 
  Sparkles, ArrowRightLeft, Globe, Zap, AlertCircle,
  HelpCircle, ChevronRight, Info
} from 'lucide-react';

export const UnixTimestampConverter: React.FC = () => {
  // Live ticking clock for epoch tracking
  const [currentNow, setCurrentNow] = useState<number>(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Conversion Mode: 'timestampToDate' vs 'dateToTimestamp'
  const [mode, setMode] = useState<'timestampToDate' | 'dateToTimestamp'>('timestampToDate');

  // Mode 1: Timestamp Input
  const [timestampInput, setTimestampInput] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [unitMode, setUnitMode] = useState<'auto' | 'seconds' | 'milliseconds'>('auto');

  // Mode 2: Date & Time Input
  const [dateStr, setDateStr] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [timeStr, setTimeStr] = useState<string>(() => new Date().toTimeString().slice(0, 8));
  const [timeZoneType, setTimeZoneType] = useState<'utc' | 'local'>('local');

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-detect unit suggestion
  const detectedUnit = useMemo<'seconds' | 'milliseconds'>(() => {
    const clean = timestampInput.trim();
    if (!clean || isNaN(Number(clean))) return 'seconds';
    const num = Math.abs(Number(clean));
    // If > 300 billion (e.g. 13 digits like 1700000000000), it's milliseconds
    if (num > 300000000000) return 'milliseconds';
    return 'seconds';
  }, [timestampInput]);

  const activeUnit = unitMode === 'auto' ? detectedUnit : unitMode;

  // Compute parsed Date from Timestamp input
  const parsedDateFromTimestamp = useMemo(() => {
    const clean = timestampInput.trim();
    if (!clean) return { date: null, error: 'Please enter a timestamp' };
    
    const num = Number(clean);
    if (isNaN(num)) {
      return { date: null, error: 'Invalid numeric value' };
    }

    try {
      const ms = activeUnit === 'seconds' ? num * 1000 : num;
      const date = new Date(ms);
      if (isNaN(date.getTime())) {
        return { date: null, error: 'Timestamp is out of supported date range' };
      }
      return { date, error: null };
    } catch (e: any) {
      return { date: null, error: e?.message || 'Date parsing error' };
    }
  }, [timestampInput, activeUnit]);

  // Compute parsed Date from Date & Time picker
  const parsedDateFromPicker = useMemo(() => {
    try {
      if (!dateStr) return { date: null, error: 'Please select a date' };
      const combined = `${dateStr}T${timeStr || '00:00:00'}`;
      
      let date: Date;
      if (timeZoneType === 'utc') {
        date = new Date(`${combined}Z`);
      } else {
        date = new Date(combined);
      }

      if (isNaN(date.getTime())) {
        return { date: null, error: 'Invalid date or time value' };
      }
      return { date, error: null };
    } catch (e: any) {
      return { date: null, error: e?.message || 'Date calculation error' };
    }
  }, [dateStr, timeStr, timeZoneType]);

  // Active target date based on current active tab
  const activeResult = mode === 'timestampToDate' ? parsedDateFromTimestamp : parsedDateFromPicker;

  // Calculate detailed formatted results
  const resultDetails = useMemo(() => {
    if (!activeResult.date) return null;
    const d = activeResult.date;
    const ms = d.getTime();
    const sec = Math.floor(ms / 1000);
    const nowMs = Date.now();
    const diffSec = Math.floor((ms - nowMs) / 1000);

    // Calculate relative time string
    let relativeStr = '';
    const absDiff = Math.abs(diffSec);
    if (absDiff < 5) relativeStr = 'Just now';
    else if (absDiff < 60) relativeStr = diffSec > 0 ? `in ${absDiff} seconds` : `${absDiff} seconds ago`;
    else if (absDiff < 3600) relativeStr = diffSec > 0 ? `in ${Math.floor(absDiff / 60)} minutes` : `${Math.floor(absDiff / 60)} minutes ago`;
    else if (absDiff < 86400) relativeStr = diffSec > 0 ? `in ${Math.floor(absDiff / 3600)} hours` : `${Math.floor(absDiff / 3600)} hours ago`;
    else relativeStr = diffSec > 0 ? `in ${Math.floor(absDiff / 86400)} days` : `${Math.floor(absDiff / 86400)} days ago`;

    // Leap year & day calculations
    const year = d.getUTCFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    // Day of year
    const start = new Date(Date.UTC(year, 0, 0));
    const diffDay = d.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diffDay / oneDay);

    return {
      date: d,
      seconds: sec,
      milliseconds: ms,
      microseconds: `${sec}000000`,
      nanoseconds: `${sec}000000000`,
      utcString: d.toUTCString(),
      localString: d.toString(),
      isoString: d.toISOString(),
      relativeStr,
      isLeapYear,
      dayOfYear,
      timeZoneName: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }, [activeResult.date]);

  const copyValue = async (text: string | number, key: string) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleSetToNow = () => {
    const now = new Date();
    if (mode === 'timestampToDate') {
      if (activeUnit === 'seconds') {
        setTimestampInput(String(Math.floor(now.getTime() / 1000)));
      } else {
        setTimestampInput(String(now.getTime()));
      }
    } else {
      setDateStr(now.toISOString().slice(0, 10));
      setTimeStr(now.toTimeString().slice(0, 8));
    }
  };

  const handleQuickPreset = (val: number | string, unit: 'seconds' | 'milliseconds' = 'seconds') => {
    setUnitMode(unit);
    setTimestampInput(String(val));
    setMode('timestampToDate');
  };

  return (
    <div className="w-full space-y-6">
      {/* Live Epoch Status & Privacy Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Current Unix Epoch Time (Seconds):</div>
            <div className="font-mono text-base font-bold text-emerald-400">
              {currentNow.toLocaleString('en-US', { useGrouping: false })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSetToNow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/10"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Use Current Timestamp</span>
          </button>
          <button
            type="button"
            onClick={() => copyValue(currentNow, 'live')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            title="Copy current timestamp"
          >
            {copiedKey === 'live' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center rounded-xl bg-slate-900/70 border border-slate-800 p-1">
        <button
          type="button"
          onClick={() => setMode('timestampToDate')}
          className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
            mode === 'timestampToDate' 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Convert Timestamp → Human Date</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('dateToTimestamp')}
          className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
            mode === 'dateToTimestamp' 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Convert Date & Time → Timestamp</span>
        </button>
      </div>

      {/* Primary Input Container */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
        {mode === 'timestampToDate' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="font-semibold text-slate-200">
                Enter Unix Timestamp:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Unit:</span>
                <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setUnitMode('auto')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      unitMode === 'auto' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Auto ({detectedUnit})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitMode('seconds')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      unitMode === 'seconds' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Seconds (s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitMode('milliseconds')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      unitMode === 'milliseconds' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Milliseconds (ms)
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="e.g. 1771800000 or 1771800000000"
                className="w-full px-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => copyValue(timestampInput, 'input')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy timestamp"
              >
                {copiedKey === 'input' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-500 font-sans">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset(0, 'seconds')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                0 (Epoch: 1970)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(-86400, 'seconds')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                -86400 (1969)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(1000000000, 'seconds')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                1 Billion (2001)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(2147483647, 'seconds')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                Year 2038 (32-bit limit)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(Date.now(), 'milliseconds')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                Now (ms)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="font-semibold text-slate-200">
                Select Date, Time, and Timezone:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Interpret As:</span>
                <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setTimeZoneType('local')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      timeZoneType === 'local' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Local Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeZoneType('utc')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      timeZoneType === 'utc' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    UTC / GMT
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Date:</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Time (24-hour):</label>
                <input
                  type="time"
                  step="1"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {activeResult.error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-200">Conversion Error</div>
            <div className="mt-0.5">{activeResult.error}</div>
          </div>
        </div>
      )}

      {/* Converted Results Display */}
      {resultDetails && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Conversion Results
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UTC Format */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <Globe className="w-4 h-4" />
                  <span>UTC / GMT Time</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(resultDetails.utcString, 'utc')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'utc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'utc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm text-slate-100 font-semibold break-all">
                {resultDetails.utcString}
              </div>
            </div>

            {/* Local Format */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span>Your Local Time ({resultDetails.timeZoneName})</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(resultDetails.localString, 'local')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'local' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm text-slate-100 font-semibold break-all">
                {resultDetails.localString}
              </div>
            </div>

            {/* Unix Seconds */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-400">
                  Unix Timestamp (Seconds)
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(resultDetails.seconds, 'sec')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'sec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sec' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-base text-emerald-400 font-bold">
                {resultDetails.seconds}
              </div>
            </div>

            {/* Unix Milliseconds */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-400">
                  Unix Timestamp (Milliseconds)
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(resultDetails.milliseconds, 'ms')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'ms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ms' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-base text-blue-400 font-bold">
                {resultDetails.milliseconds}
              </div>
            </div>

            {/* ISO 8601 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-400">
                  ISO 8601 String
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(resultDetails.isoString, 'iso')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'iso' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'iso' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm text-purple-400 font-semibold break-all">
                {resultDetails.isoString}
              </div>
            </div>

            {/* Relative Time */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-400">
                  Relative Time
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Day {resultDetails.dayOfYear} of Year
                </div>
              </div>
              <div className="font-mono text-sm text-amber-400 font-semibold">
                {resultDetails.relativeStr}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
