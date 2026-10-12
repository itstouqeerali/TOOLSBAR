import React, { useState, useMemo } from 'react';
import { 
  Code2, Copy, Check, Download, AlertTriangle, 
  RotateCcw, Sparkles, Minimize2, FileCode, CheckCircle2,
  Sliders, Info, FileText
} from 'lucide-react';
import jsBeautify from 'js-beautify';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Toolsbar — Developer Utilities</title>
<style>
body { font-family: sans-serif; margin: 0; padding: 20px; background: #0f172a; color: #f8fafc; }
.card { background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; }
</style>
</head>
<body>
<!-- Main Header Banner -->
<header class="header">
<h1 id="main-title">Toolsbar In-Browser Formatter</h1>
<p class="subtitle">Format, beautify, and minify HTML with zero server latency.</p>
</header>
<main>
<div class="card">
<h2>Preserved Whitespace Block</h2>
<pre>
  function calculateTotal(a, b) {
    return a + b;
  }
</pre>
<textarea placeholder="Enter notes here...">Pre-filled textarea content with preserved spacing.</textarea>
</div>
</main>
<script>
console.log("HTML successfully formatted locally.");
</script>
</body>
</html>`;

export const HtmlFormatter: React.FC = () => {
  const [inputHtml, setInputHtml] = useState<string>(SAMPLE_HTML);
  const [outputHtml, setOutputHtml] = useState<string>('');
  const [indentType, setIndentType] = useState<'2' | '4' | 'tab'>('2');
  const [wrapLineLength, setWrapLineLength] = useState<number>(0);
  const [preserveNewlines, setPreserveNewlines] = useState<boolean>(true);
  const [lastAction, setLastAction] = useState<'format' | 'minify' | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Character & Byte Metrics
  const stats = useMemo(() => {
    const inputBytes = new Blob([inputHtml]).size;
    const inputChars = inputHtml.length;
    
    const activeOutput = outputHtml || inputHtml;
    const outputBytes = new Blob([activeOutput]).size;
    const outputChars = activeOutput.length;
    
    const byteDiff = outputBytes - inputBytes;
    const charDiff = outputChars - inputChars;
    const percentage = inputBytes > 0 ? ((outputBytes - inputBytes) / inputBytes) * 100 : 0;

    return {
      inputBytes,
      inputChars,
      outputBytes,
      outputChars,
      byteDiff,
      charDiff,
      percentage: Number(percentage.toFixed(1))
    };
  }, [inputHtml, outputHtml]);

  // Safe HTML Minifier preserving <pre>, <textarea>, <script>, <style>
  const performMinify = (html: string): string => {
    if (!html.trim()) return '';

    // Extract and preserve sensitive blocks with placeholder tokens
    const preservedBlocks: string[] = [];
    let tokenIndex = 0;

    // Preserve <pre>...</pre>, <textarea>...</textarea>, <script>...</script>, <style>...</style>
    const sensitiveRegex = /<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
    
    const sanitized = html.replace(sensitiveRegex, (match) => {
      const token = `___PRESERVED_BLOCK_${tokenIndex}___`;
      preservedBlocks.push(match);
      tokenIndex++;
      return token;
    });

    let minified = sanitized
      // Remove standard HTML comments (preserving conditional comments if any)
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      // Collapse multiple whitespace chars outside tags to single space
      .replace(/\s+/g, ' ')
      // Remove spaces between tags
      .replace(/>\s+</g, '><')
      // Remove spaces around opening tag bracket
      .replace(/\s+>/g, '>')
      .replace(/<\s+/g, '<')
      .trim();

    // Restore preserved blocks
    preservedBlocks.forEach((block, idx) => {
      minified = minified.replace(`___PRESERVED_BLOCK_${idx}___`, block);
    });

    return minified;
  };

  const handleFormat = () => {
    if (!inputHtml.trim()) {
      setOutputHtml('');
      setLastAction(null);
      return;
    }

    try {
      const indentSize = indentType === 'tab' ? 1 : parseInt(indentType, 10);
      const indentChar = indentType === 'tab' ? '\t' : ' ';

      const formatted = jsBeautify.html(inputHtml, {
        indent_size: indentSize,
        indent_char: indentChar,
        wrap_line_length: wrapLineLength,
        preserve_newlines: preserveNewlines,
        max_preserve_newlines: 2,
        indent_inner_html: true,
        extra_liners: ['head', 'body', '/html'],
        unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'textarea']
      });

      setOutputHtml(formatted);
      setLastAction('format');
      setNotice('HTML formatted successfully with standard indentation.');
    } catch (err: any) {
      setNotice(`Formatting note: ${err?.message || 'Processed with fallback handler'}`);
      setOutputHtml(inputHtml);
    }
  };

  const handleMinify = () => {
    if (!inputHtml.trim()) {
      setOutputHtml('');
      setLastAction(null);
      return;
    }

    const minified = performMinify(inputHtml);
    setOutputHtml(minified);
    setLastAction('minify');
    setNotice('HTML minified safely while preserving whitespace in <pre>, <textarea>, <script>, and <style>.');
  };

  const handleCopy = async () => {
    const textToCopy = outputHtml || inputHtml;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const content = outputHtml || inputHtml;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = lastAction === 'minify' ? 'index.min.html' : 'index.formatted.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputHtml('');
    setOutputHtml('');
    setLastAction(null);
    setNotice(null);
  };

  const handleLoadSample = () => {
    setInputHtml(SAMPLE_HTML);
    setOutputHtml('');
    setLastAction(null);
    setNotice('Sample HTML loaded.');
  };

  return (
    <div className="w-full space-y-6">
      {/* Privacy and Technical Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>100% Client-Side Processing:</strong> HTML formatting & minification execute purely in your browser. Formatting does not validate HTML schema completeness.
          </span>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap transition-colors"
        >
          Load Sample HTML
        </button>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left Options */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Indentation:</span>
            <div className="flex items-center rounded-lg bg-slate-800/80 border border-slate-700/60 p-0.5">
              <button
                type="button"
                onClick={() => setIndentType('2')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  indentType === '2' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => setIndentType('4')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  indentType === '4' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                4 Spaces
              </button>
              <button
                type="button"
                onClick={() => setIndentType('tab')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  indentType === 'tab' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabs
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preserveNewlines}
              onChange={(e) => setPreserveNewlines(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Keep Empty Lines</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!inputHtml.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beautify HTML</span>
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={!inputHtml.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify HTML</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50"
            title="Clear all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="flex flex-col h-[460px] rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-300">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Input HTML</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>{stats.inputChars.toLocaleString()} chars</span>
              <span>•</span>
              <span>{(stats.inputBytes / 1024).toFixed(2)} KB</span>
            </div>
          </div>
          <textarea
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            placeholder="Paste your HTML code here..."
            className="flex-1 w-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder:text-slate-600"
            spellCheck={false}
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col h-[460px] rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-300">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>
                {lastAction === 'minify' ? 'Minified Output' : lastAction === 'format' ? 'Formatted Output' : 'Output Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!outputHtml && !inputHtml}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!outputHtml && !inputHtml}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-40"
                title="Download HTML file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputHtml || inputHtml}
            placeholder="Formatted or minified output will appear here..."
            className="flex-1 w-full p-4 bg-slate-950/40 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder:text-slate-600 select-all"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Metrics Bar */}
      {lastAction && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-500 text-[11px]">Original Size</div>
            <div className="text-slate-200 font-semibold text-sm">
              {stats.inputChars.toLocaleString()} chars <span className="text-xs text-slate-400">({(stats.inputBytes / 1024).toFixed(2)} KB)</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Output Size</div>
            <div className="text-slate-200 font-semibold text-sm">
              {stats.outputChars.toLocaleString()} chars <span className="text-xs text-slate-400">({(stats.outputBytes / 1024).toFixed(2)} KB)</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Difference</div>
            <div className={`font-semibold text-sm ${stats.charDiff < 0 ? 'text-emerald-400' : stats.charDiff > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {stats.charDiff > 0 ? `+${stats.charDiff}` : stats.charDiff} chars
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Size Delta</div>
            <div className={`font-semibold text-sm ${stats.percentage < 0 ? 'text-emerald-400' : stats.percentage > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {stats.percentage > 0 ? `+${stats.percentage}%` : `${stats.percentage}%`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
