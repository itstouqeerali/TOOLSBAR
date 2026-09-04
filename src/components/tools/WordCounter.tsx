import React, { useState, useMemo } from 'react';
import { 
  FileText, Copy, Check, RotateCcw, Download, Sparkles, 
  BarChart3, Clock, Type, AlignLeft, Volume2 
} from 'lucide-react';

const SAMPLE_TEXT = `Toolsbar is a comprehensive digital utility platform crafted for the modern web. Users can access fast, responsive, and thoughtfully designed browser-first utilities for everyday tasks.

Every tool processes information locally within your device, ensuring privacy, immediate responsiveness, and zero server latency. From mathematical calculations to JSON formatting and cryptographic generators, Toolsbar provides a clean and reliable tool experience.`;

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [readingWpm, setReadingWpm] = useState<number>(225);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTimeSec: 0,
        speakingTimeSec: 0,
        avgWordLength: 0,
        avgSentenceLength: 0,
        readingLevel: 'N/A',
        fleschScore: 0,
        topKeywords: [],
      };
    }

    const wordsArr = raw.match(/[\p{L}\p{N}_\u2019'-]+/gu) || [];
    const wordsCount = wordsArr.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    
    const sentencesArr = raw.split(/[.!?]+[\s\r\n]+/).filter(s => s.trim().length > 0);
    const sentencesCount = Math.max(1, sentencesArr.length);
    
    const paragraphsArr = text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphsCount = Math.max(1, paragraphsArr.length);
    
    const linesCount = text.split(/\r\n|\r|\n/).length;

    // Time calculations
    const readingTimeSec = Math.ceil((wordsCount / readingWpm) * 60);
    const speakingTimeSec = Math.ceil((wordsCount / 130) * 60);

    const avgWordLength = wordsCount > 0 ? (charsNoSpaces / wordsCount).toFixed(1) : 0;
    const avgSentenceLength = wordsCount > 0 ? (wordsCount / sentencesCount).toFixed(1) : 0;

    // Syllables estimation for Flesch Reading Ease
    let totalSyllables = 0;
    wordsArr.forEach(word => {
      const w = word.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
      const syllables = w.match(/[aeiouy]{1,2}/g);
      totalSyllables += syllables ? syllables.length : 1;
    });

    let fleschScore = 0;
    let readingLevel = 'Standard';
    if (wordsCount > 0 && sentencesCount > 0) {
      fleschScore = Math.round(206.835 - 1.015 * (wordsCount / sentencesCount) - 84.6 * (totalSyllables / wordsCount));
      if (fleschScore >= 90) readingLevel = 'Very Easy (5th Grade)';
      else if (fleschScore >= 80) readingLevel = 'Easy (6th Grade)';
      else if (fleschScore >= 70) readingLevel = 'Fairly Easy (7th Grade)';
      else if (fleschScore >= 60) readingLevel = 'Standard (8th-9th Grade)';
      else if (fleschScore >= 50) readingLevel = 'Fairly Difficult (High School)';
      else if (fleschScore >= 30) readingLevel = 'Difficult (College)';
      else readingLevel = 'Very Difficult (Graduate)';
    }

    // Top Keywords frequency
    const stopWords = new Set(['the','and','a','to','of','in','is','it','you','that','he','was','for','on','are','as','with','his','they','i','at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','said','there','use','an','each','which','she','do','how','their','if']);
    const freqMap: Record<string, number> = {};
    wordsArr.forEach(w => {
      const clean = w.toLowerCase();
      if (clean.length > 2 && !stopWords.has(clean)) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / wordsCount) * 100).toFixed(1)
      }));

    return {
      words: wordsCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences: sentencesCount,
      paragraphs: paragraphsCount,
      lines: linesCount,
      readingTimeSec,
      speakingTimeSec,
      avgWordLength,
      avgSentenceLength,
      readingLevel,
      fleschScore,
      topKeywords: sortedKeywords
    };
  }, [text, readingWpm]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `toolsbar-text-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatSecs = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  return (
    <div className="space-y-6" id="word-counter-tool">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Words', val: stats.words.toLocaleString(), highlight: true },
          { label: 'Characters', val: stats.charsWithSpaces.toLocaleString(), sub: `no space: ${stats.charsNoSpaces.toLocaleString()}` },
          { label: 'Sentences', val: stats.sentences.toLocaleString() },
          { label: 'Paragraphs', val: stats.paragraphs.toLocaleString() },
          { label: 'Reading Time', val: formatSecs(stats.readingTimeSec), icon: Clock },
          { label: 'Speaking Time', val: formatSecs(stats.speakingTimeSec), icon: Volume2 },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
              item.highlight
                ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                : 'bg-neutral-900/60 dark:bg-[#121624]/70 border-white/10'
            }`}
          >
            <div className="text-xs text-neutral-400 font-medium">{item.label}</div>
            <div className="text-2xl font-black font-display text-white mt-1">{item.val}</div>
            {item.sub && <div className="text-[11px] text-neutral-500 mt-0.5">{item.sub}</div>}
          </div>
        ))}
      </div>

      {/* Editor & Side Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Text Input Area */}
        <div className="lg:col-span-8 rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-400" /> Text Content
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
              >
                Load Sample
              </button>
              <button
                onClick={() => setText('')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/5 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to get instant word, character, and readability analysis..."
            rows={12}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-normal text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y font-sans leading-relaxed"
          />

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setText(text.toUpperCase())}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 transition-colors cursor-pointer"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => setText(text.toLowerCase())}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 transition-colors cursor-pointer"
              >
                lowercase
              </button>
              <button
                onClick={() => setText(text.replace(/\s+/g, ' ').trim())}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 transition-colors cursor-pointer"
              >
                Clean Spaces
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download .txt
              </button>
            </div>
          </div>
        </div>

        {/* Readability & Keyword Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Readability Score */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl">
            <div className="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Reading Level
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-300 font-medium">Flesch Ease Score:</span>
                <span className="text-xl font-bold font-mono text-white">{stats.fleschScore}/100</span>
              </div>
              <div className="text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200">
                Grade: {stats.readingLevel}
              </div>

              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-neutral-400">
                <div>Avg Word Length: <span className="text-white font-bold">{stats.avgWordLength} chars</span></div>
                <div>Avg Sentence: <span className="text-white font-bold">{stats.avgSentenceLength} words</span></div>
              </div>
            </div>
          </div>

          {/* Top Keywords Density */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl">
            <div className="text-xs uppercase font-bold tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Top Keyword Density
            </div>

            {stats.topKeywords.length > 0 ? (
              <div className="space-y-2">
                {stats.topKeywords.map((kw, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/20 border border-white/5">
                    <span className="font-mono text-indigo-300 font-medium">#{idx + 1} {kw.word}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">{kw.count}x</span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">{kw.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-500 py-4 text-center">
                Add more text to see keyword density distribution
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
