import React, { useState } from 'react';
import { Type, Copy, Check, Sparkles, Download, ArrowRight } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('toolsbar is a premium all-in-one digital utility platform');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Conversion helpers
  const toWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-.\s]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);
  };

  const conversions = [
    {
      id: 'upper',
      name: 'UPPERCASE',
      desc: 'All characters in capital letters',
      fn: (s: string) => s.toUpperCase(),
      example: 'HELLO WORLD'
    },
    {
      id: 'lower',
      name: 'lowercase',
      desc: 'All characters in small letters',
      fn: (s: string) => s.toLowerCase(),
      example: 'hello world'
    },
    {
      id: 'title',
      name: 'Title Case',
      desc: 'Capitalize the first letter of each word',
      fn: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()),
      example: 'Hello World'
    },
    {
      id: 'sentence',
      name: 'Sentence case',
      desc: 'Capitalize the first letter of every sentence',
      fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      example: 'Hello world. Nice to meet you.'
    },
    {
      id: 'camel',
      name: 'camelCase',
      desc: 'First word lowercase, subsequent words capitalized',
      fn: (s: string) => {
        const words = toWords(s);
        return words.map((w, idx) => idx === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      },
      example: 'helloWorld'
    },
    {
      id: 'pascal',
      name: 'PascalCase',
      desc: 'Capitalize the first letter of every single word',
      fn: (s: string) => {
        const words = toWords(s);
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      },
      example: 'HelloWorld'
    },
    {
      id: 'kebab',
      name: 'kebab-case',
      desc: 'Words separated by hyphens (URL slug friendly)',
      fn: (s: string) => toWords(s).map(w => w.toLowerCase()).join('-'),
      example: 'hello-world'
    },
    {
      id: 'snake',
      name: 'snake_case',
      desc: 'Words separated by underscores',
      fn: (s: string) => toWords(s).map(w => w.toLowerCase()).join('_'),
      example: 'hello_world'
    },
    {
      id: 'constant',
      name: 'CONSTANT_CASE',
      desc: 'Uppercase words separated by underscores',
      fn: (s: string) => toWords(s).map(w => w.toUpperCase()).join('_'),
      example: 'HELLO_WORLD'
    },
    {
      id: 'dot',
      name: 'dot.case',
      desc: 'Words separated by periods',
      fn: (s: string) => toWords(s).map(w => w.toLowerCase()).join('.'),
      example: 'hello.world'
    },
    {
      id: 'alternating',
      name: 'aLtErNaTiNg cAsE',
      desc: 'Alternate between lowercase and uppercase',
      fn: (s: string) => s.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join(''),
      example: 'hElLo wOrLd'
    },
    {
      id: 'inverse',
      name: 'InVeRsE cAsE',
      desc: 'Invert the case of each character',
      fn: (s: string) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
      example: 'tOOLSBAR'
    }
  ];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6" id="case-converter-tool">
      {/* Input Box */}
      <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" /> Enter Text to Convert
          </label>
          <button
            onClick={() => setInputText('')}
            className="text-xs text-neutral-400 hover:text-white cursor-pointer"
          >
            Clear
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any text here..."
          rows={4}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-base font-normal text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
        />
      </div>

      {/* Grid of Converted Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conversions.map((item) => {
          const converted = inputText ? item.fn(inputText) : item.example;
          const isCopied = copiedKey === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl p-5 bg-neutral-900/50 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{item.name}</span>
                  <button
                    onClick={() => handleCopy(item.id, converted)}
                    className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-600/30 text-neutral-300 group-hover:text-white transition-colors cursor-pointer"
                    title={`Copy ${item.name}`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-sm text-neutral-100 bg-black/30 p-3 rounded-xl border border-white/5 break-all max-h-32 overflow-y-auto leading-relaxed">
                  {converted}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <span>{item.desc}</span>
                {isCopied && <span className="text-emerald-400 font-bold">Copied!</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
