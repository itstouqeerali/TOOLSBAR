import React, { useState, useEffect, useCallback } from 'react';
import { 
  KeyRound, Copy, Check, RefreshCw, Shield, 
  ShieldCheck, ShieldAlert, Sparkles, Sliders, 
  Layers, Lock 
} from 'lucide-react';

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const LOOKALIKE_CHARS = /[O0lI1|]/g;

const MEMORABLE_WORDS = [
  'apple', 'beach', 'cloud', 'delta', 'eagle', 'frost', 'galaxy', 'harbor',
  'island', 'jungle', 'knight', 'lunar', 'matrix', 'nebula', 'ocean', 'planet',
  'quantum', 'river', 'shadow', 'titan', 'ultra', 'vortex', 'whisper', 'zenith',
  'beacon', 'crystal', 'dragon', 'ember', 'falcon', 'glacier', 'horizon', 'iris'
];

export const PasswordGenerator: React.FC = () => {
  const [mode, setMode] = useState<'random' | 'passphrase' | 'bulk'>('random');
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeLookalike, setExcludeLookalike] = useState<boolean>(true);

  // Passphrase settings
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState<boolean>(true);

  // Bulk settings
  const [bulkCount, setBulkCount] = useState<number>(5);

  const [password, setPassword] = useState<string>('');
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Secure random generator
  const generateRandomPassword = useCallback((): string => {
    let charset = '';
    if (includeUpper) charset += UPPERCASE_CHARS;
    if (includeLower) charset += LOWERCASE_CHARS;
    if (includeNumbers) charset += NUMBER_CHARS;
    if (includeSymbols) charset += SYMBOL_CHARS;

    if (excludeLookalike) {
      charset = charset.replace(LOOKALIKE_CHARS, '');
    }

    if (!charset) return '';

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    return result;
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeLookalike]);

  const generatePassphrase = useCallback((): string => {
    const randomIndices = new Uint32Array(wordCount);
    window.crypto.getRandomValues(randomIndices);

    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      let word = MEMORABLE_WORDS[randomIndices[i] % MEMORABLE_WORDS.length];
      if (i === 0) word = word.charAt(0).toUpperCase() + word.slice(1);
      words.push(word);
    }

    let pass = words.join(separator);
    if (includeNumberInPassphrase) {
      const numArr = new Uint32Array(1);
      window.crypto.getRandomValues(numArr);
      const num = 10 + (numArr[0] % 90);
      pass += `${separator}${num}`;
    }
    return pass;
  }, [wordCount, separator, includeNumberInPassphrase]);

  const generate = useCallback(() => {
    if (mode === 'random') {
      const newPass = generateRandomPassword();
      setPassword(newPass);
      if (newPass) {
        setHistory(prev => [newPass, ...prev.filter(p => p !== newPass).slice(0, 7)]);
      }
    } else if (mode === 'passphrase') {
      const newPass = generatePassphrase();
      setPassword(newPass);
      if (newPass) {
        setHistory(prev => [newPass, ...prev.filter(p => p !== newPass).slice(0, 7)]);
      }
    } else if (mode === 'bulk') {
      const list: string[] = [];
      for (let i = 0; i < bulkCount; i++) {
        list.push(generateRandomPassword());
      }
      setBulkList(list);
    }
  }, [mode, generateRandomPassword, generatePassphrase, bulkCount]);

  useEffect(() => {
    generate();
  }, [generate]);

  // Strength score
  const strengthInfo = React.useMemo(() => {
    const target = password;
    if (!target) return { score: 0, label: 'None', color: 'text-neutral-500', crackTime: '0 seconds' };

    let pool = 0;
    if (/[a-z]/.test(target)) pool += 26;
    if (/[A-Z]/.test(target)) pool += 26;
    if (/[0-9]/.test(target)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(target)) pool += 32;

    const entropy = Math.round(target.length * Math.log2(pool || 1));

    if (entropy < 40) return { score: 1, label: 'Weak', color: 'text-rose-400', barColor: 'bg-rose-500', crackTime: 'Instant (milliseconds)' };
    if (entropy < 60) return { score: 2, label: 'Moderate', color: 'text-amber-400', barColor: 'bg-amber-500', crackTime: 'A few days' };
    if (entropy < 80) return { score: 3, label: 'Strong', color: 'text-emerald-400', barColor: 'bg-emerald-500', crackTime: 'Thousands of years' };
    return { score: 4, label: 'Military-Grade', color: 'text-indigo-300', barColor: 'bg-indigo-500', crackTime: 'Trillions of centuries' };
  }, [password]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6" id="password-generator-tool">
      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl">
        {[
          { id: 'random', label: 'Random Password' },
          { id: 'passphrase', label: 'Memorable Passphrase' },
          { id: 'bulk', label: 'Bulk Password Batch' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode !== 'bulk' ? (
        <div className="space-y-6">
          {/* Main Password Showcase Banner */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/70 via-[#131a33]/80 to-[#0e1222]/90 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Secure Generated Output
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${strengthInfo.color}`}>
                  {strengthInfo.label}
                </span>
                <span className="text-[11px] text-neutral-400">
                  (&sim;{strengthInfo.crackTime})
                </span>
              </div>
            </div>

            {/* Display & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between gap-3 overflow-hidden">
                <span className="font-mono text-lg sm:text-2xl text-white font-semibold tracking-wider break-all select-all">
                  {password || 'Select options to generate'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generate}
                  title="Generate new password"
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5 hover:rotate-180 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => handleCopy('main', password)}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer text-sm"
                >
                  {copiedKey === 'main' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedKey === 'main' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Strength Meter Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step <= strengthInfo.score ? strengthInfo.barColor : 'bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Customization Rules
            </span>

            {mode === 'random' ? (
              <div className="space-y-6">
                {/* Length Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-300">
                    <span>Password Length:</span>
                    <span className="font-mono text-base font-bold text-indigo-400">{length} characters</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={64}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>6 (Min)</span>
                    <span>16 (Recommended)</span>
                    <span>32 (Strong)</span>
                    <span>64 (Max)</span>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'upper', label: 'Uppercase Letters (A-Z)', val: includeUpper, set: setIncludeUpper },
                    { id: 'lower', label: 'Lowercase Letters (a-z)', val: includeLower, set: setIncludeLower },
                    { id: 'numbers', label: 'Digits & Numbers (0-9)', val: includeNumbers, set: setIncludeNumbers },
                    { id: 'symbols', label: 'Special Symbols (!@#$%)', val: includeSymbols, set: setIncludeSymbols },
                    { id: 'lookalike', label: 'Exclude Lookalikes (0, O, 1, l, I)', val: excludeLookalike, set: setExcludeLookalike },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/30 hover:bg-white/5 border border-white/5 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.val}
                        onChange={(e) => item.set(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs text-neutral-200 font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              /* Passphrase Mode Controls */
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-300">
                    <span>Number of Words:</span>
                    <span className="font-mono text-base font-bold text-indigo-400">{wordCount} words</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={8}
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1.5 font-medium">Word Delimiter</label>
                    <select
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="-">Hyphen (-)</option>
                      <option value=".">Dot (.)</option>
                      <option value="_">Underscore (_)</option>
                      <option value=" ">Space ( )</option>
                      <option value="#">Hash (#)</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 hover:bg-white/5 border border-white/5 cursor-pointer transition-colors w-full">
                      <input
                        type="checkbox"
                        checked={includeNumberInPassphrase}
                        onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs text-neutral-200 font-medium">Append Random Number</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session History */}
          {history.length > 1 && (
            <div className="rounded-2xl p-4 bg-neutral-900/40 dark:bg-[#121624]/60 border border-white/10 backdrop-blur-md">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Recent Passwords (Session Only)
              </div>
              <div className="space-y-1.5">
                {history.slice(1).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 transition-colors"
                  >
                    <span className="font-mono text-xs text-neutral-300 truncate max-w-sm">{item}</span>
                    <button
                      onClick={() => handleCopy(`hist-${idx}`, item)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 cursor-pointer"
                    >
                      {copiedKey === `hist-${idx}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Bulk Generator Mode */
        <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-300">
              Bulk Passwords List ({bulkList.length})
            </span>
            <div className="flex items-center gap-2">
              <select
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                className="bg-black/40 text-xs text-neutral-200 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value={5}>5 Passwords</option>
                <option value={10}>10 Passwords</option>
                <option value={20}>20 Passwords</option>
              </select>
              <button
                onClick={() => handleCopy('all-bulk', bulkList.join('\n'))}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
              >
                {copiedKey === 'all-bulk' ? 'Copied All!' : 'Copy All'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {bulkList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5"
              >
                <span className="font-mono text-sm text-neutral-200 break-all">{item}</span>
                <button
                  onClick={() => handleCopy(`bulk-${idx}`, item)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                >
                  {copiedKey === `bulk-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
