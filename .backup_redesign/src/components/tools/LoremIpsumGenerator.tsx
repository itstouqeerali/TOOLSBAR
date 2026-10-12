import React, { useState } from 'react';
import { Copy, Check, RotateCcw, FileText, Download, Sparkles, Wand2 } from 'lucide-react';

const CLASSIC_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const TECH_WORDS = [
  'agile', 'blockchain', 'cloud', 'scalable', 'paradigm', 'serverless', 'devops',
  'microservices', 'kubernetes', 'latency', 'api', 'fullstack', 'framework',
  'neural', 'inference', 'tokens', 'distributed', 'async', 'event-driven', 'cache',
  'redis', 'docker', 'dockerized', 'graphql', 'restful', 'webhook', 'pipeline',
  'ci/cd', 'frontend', 'backend', 'architecture', 'monolith', 'telemetry', 'vector'
];

const PIRATE_WORDS = [
  'ahoy', 'matey', 'shiver', 'me', 'timbers', 'plank', 'booty', 'treasure',
  'scallywag', 'grog', 'buccaneer', 'parley', 'aye', 'captain', 'anchor',
  'sails', 'galleon', 'caribbean', 'compass', 'cutlass', 'crows', 'nest',
  'sea', 'dog', 'blackbeard', 'corsair', 'swashbuckler', 'kraken', 'doubloons'
];

type GeneratorType = 'paragraphs' | 'sentences' | 'words' | 'lists';
type Theme = 'classic' | 'tech' | 'pirate';
type OutputFormat = 'text' | 'html' | 'markdown';

export const LoremIpsumGenerator: React.FC = () => {
  const [genType, setGenType] = useState<GeneratorType>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [theme, setTheme] = useState<Theme>('classic');
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [format, setFormat] = useState<OutputFormat>('text');
  const [copied, setCopied] = useState<boolean>(false);

  const getWordPool = () => {
    switch (theme) {
      case 'tech': return TECH_WORDS;
      case 'pirate': return PIRATE_WORDS;
      default: return CLASSIC_WORDS;
    }
  };

  const generateSentence = (wordsCount = 12, forceClassicStart = false): string => {
    const pool = getWordPool();
    const words: string[] = [];

    if (forceClassicStart && theme === 'classic') {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit.');
      return words.join(' ');
    }

    for (let i = 0; i < wordsCount; i++) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      words.push(w);
    }

    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (sentencesCount = 5, isFirst = false): string => {
    const sentences: string[] = [];
    for (let s = 0; s < sentencesCount; s++) {
      const forceStart = isFirst && s === 0 && startWithLorem;
      sentences.push(generateSentence(Math.floor(Math.random() * 8) + 8, forceStart));
    }
    return sentences.join(' ');
  };

  const generateOutput = (): string => {
    const safeCount = Math.max(1, Math.min(count, 50));

    if (genType === 'words') {
      const pool = getWordPool();
      const words: string[] = [];
      if (startWithLorem && theme === 'classic' && safeCount >= 5) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < safeCount) {
        words.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      return words.join(' ');
    }

    if (genType === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < safeCount; i++) {
        sentences.push(generateSentence(Math.floor(Math.random() * 8) + 8, i === 0 && startWithLorem));
      }
      if (format === 'html') {
        return sentences.map(s => `<p>${s}</p>`).join('\n');
      }
      return sentences.join(' ');
    }

    if (genType === 'lists') {
      const items: string[] = [];
      for (let i = 0; i < safeCount; i++) {
        items.push(generateSentence(Math.floor(Math.random() * 5) + 4, false).replace('.', ''));
      }
      if (format === 'html') {
        return `<ul>\n${items.map(it => `  <li>${it}</li>`).join('\n')}\n</ul>`;
      }
      if (format === 'markdown') {
        return items.map(it => `- ${it}`).join('\n');
      }
      return items.map(it => `• ${it}`).join('\n');
    }

    // Default: Paragraphs
    const paragraphs: string[] = [];
    for (let p = 0; p < safeCount; p++) {
      paragraphs.push(generateParagraph(Math.floor(Math.random() * 3) + 4, p === 0));
    }

    if (format === 'html') {
      return paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
    }
    if (format === 'markdown') {
      return paragraphs.join('\n\n');
    }
    return paragraphs.join('\n\n');
  };

  const output = generateOutput();
  const wordCount = output.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placeholder_text.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="lorem-ipsum-generator-tool">
      {/* Configuration Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-400">Generate:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <select
              value={genType}
              onChange={(e) => setGenType(e.target.value as GeneratorType)}
              className="bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
              <option value="lists">List Items</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-400">Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="classic">Classic Latin (Cicero)</option>
              <option value="tech">Tech Startup Buzzwords</option>
              <option value="pirate">Pirate Lore (Ahoy!)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded accent-indigo-600 bg-neutral-900 border-white/10"
            />
            Start with &quot;Lorem ipsum...&quot;
          </label>

          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            {(['text', 'html', 'markdown'] as OutputFormat[]).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                  format === f ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/30 via-[#0a0d18]/70 to-[#030303] border border-indigo-500/20 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generated Placeholder Text
          </span>
          <span className="text-xs font-mono text-neutral-400">
            {wordCount} words • {output.length} characters
          </span>
        </div>

        <textarea
          readOnly
          rows={14}
          value={output}
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-sans text-indigo-50 leading-relaxed placeholder-neutral-500 focus:outline-none transition-all resize-none select-all"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-neutral-400">
            Ready to copy into mockups, Figma, prototypes, and docs.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Placeholder Text'}
            </button>
            <button
              onClick={handleDownload}
              title="Download file"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
