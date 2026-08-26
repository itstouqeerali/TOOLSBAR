import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, ShieldCheck, Key, Hash, FileCheck, RefreshCw } from 'lucide-react';

// Lightweight pure JS MD5 algorithm for client-side hashing
function md5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWordsTempOne = lMessageLength + 8;
    const lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number) {
    let WordToHexValue = '', WordToHexValueTemp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValueTemp = '0' + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
    }
    return WordToHexValue;
  }

  const x = convertToWordArray(unescape(encodeURIComponent(string)));
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], 23, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export const HashGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('Hello Toolsbar 2026');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [compareHash, setCompareHash] = useState<string>('');

  useEffect(() => {
    async function computeHashes() {
      if (!inputText) {
        setHashes({});
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);

      const results: Record<string, string> = {};

      // MD5
      results['MD5'] = md5(inputText);

      // WebCrypto algorithms
      const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
      for (const algo of algorithms) {
        try {
          const hashBuffer = await crypto.subtle.digest(algo, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          results[algo] = hashHex;
        } catch {
          results[algo] = 'Error computing hash';
        }
      }

      setHashes(results);
    }

    computeHashes();
  }, [inputText]);

  const handleCopy = (key: string, val: string) => {
    const formatted = uppercase ? val.toUpperCase() : val.toLowerCase();
    navigator.clipboard.writeText(formatted);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const isHashMatching = Object.values(hashes).some(
    (h: string) => typeof h === 'string' && h.toLowerCase() === compareHash.trim().toLowerCase()
  );

  return (
    <div className="space-y-6" id="hash-generator-tool">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
            <Hash className="w-4 h-4" /> Cryptographic Checksum Generator
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Uppercase Hex
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <label className="text-xs font-semibold text-neutral-300">
            Input Plaintext String to Hash
          </label>
          <span className="text-xs font-mono text-neutral-400">{inputText.length} characters</span>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any text string to instantly compute cryptographic hashes..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setInputText('')}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Calculated Hashes Cards */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Real-Time Cryptographic Hashes
          </span>
        </div>

        <div className="space-y-3">
          {['SHA-256', 'SHA-512', 'SHA-384', 'SHA-1', 'MD5'].map(algo => {
            const raw = hashes[algo] || '';
            const val = uppercase ? raw.toUpperCase() : raw.toLowerCase();

            return (
              <div
                key={algo}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-300">{algo}</span>
                  <button
                    onClick={() => handleCopy(algo, val)}
                    disabled={!val}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white py-1 px-2 rounded-lg bg-white/5 hover:bg-indigo-600 transition-colors cursor-pointer disabled:opacity-30"
                  >
                    {copiedKey === algo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === algo ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="font-mono text-xs text-neutral-200 break-all select-all font-semibold bg-white/[0.02] p-2 rounded-lg">
                  {val || <span className="text-neutral-500 font-normal">Waiting for input...</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verify / Compare Checksum Section */}
      <div className="rounded-3xl p-6 bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-2">
          <FileCheck className="w-4 h-4" /> Compare / Verify Checksum Match
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            placeholder="Paste expected hash to verify match..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
          {compareHash.trim() && (
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border ${
              isHashMatching
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {isHashMatching ? <Check className="w-4 h-4" /> : null}
              <span>{isHashMatching ? 'MATCH VERIFIED' : 'NO MATCH'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
