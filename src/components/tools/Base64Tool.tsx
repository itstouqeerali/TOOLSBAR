import React, { useState } from 'react';
import { 
  Binary, Copy, Check, ArrowRightLeft, Upload, 
  FileText, Image as ImageIcon, Sparkles, RefreshCw 
} from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [tab, setTab] = useState<'text' | 'file'>('text');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [textInput, setTextInput] = useState<string>('Welcome to Toolsbar — The all-in-one digital utility platform.');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // File state
  const [fileData, setFileData] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null>(null);

  // Text Encode/Decode handling
  const textOutput = React.useMemo(() => {
    if (!textInput) return { result: '', error: null };

    try {
      if (direction === 'encode') {
        // UTF-8 safe Base64 encoding
        const utf8Bytes = new TextEncoder().encode(textInput);
        let binaryStr = '';
        utf8Bytes.forEach(b => { binaryStr += String.fromCharCode(b); });
        let b64 = btoa(binaryStr);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return { result: b64, error: null };
      } else {
        // Base64 decoding
        let b64 = textInput.trim();
        if (urlSafe) {
          b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) b64 += '=';
        }
        const binaryStr = atob(b64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        return { result: decoded, error: null };
      }
    } catch (err: any) {
      return { result: '', error: direction === 'decode' ? 'Invalid Base64 string format' : err.message };
    }
  }, [textInput, direction, urlSafe]);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;
    if ('dataTransfer' in e) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    } else {
      file = e.target.files?.[0];
    }

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setFileData({
        name: file.name,
        size: file.size,
        type: file.type,
        base64: b64
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6" id="base64-tool">
      {/* Top Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex p-1.5 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setTab('text')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              tab === 'text'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Text String Mode
          </button>
          <button
            onClick={() => setTab('file')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              tab === 'file'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Image & File to Base64
          </button>
        </div>

        {tab === 'text' && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0"
              />
              URL-Safe Mode (RFC 4648)
            </label>

            <button
              onClick={() => {
                setDirection(prev => prev === 'encode' ? 'decode' : 'encode');
                if (textOutput.result) {
                  setTextInput(textOutput.result);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-indigo-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Direction
            </button>
          </div>
        )}
      </div>

      {tab === 'text' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input Panel */}
          <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-300">
                {direction === 'encode' ? 'Input Plaintext (UTF-8)' : 'Input Base64 String'}
              </span>
              <button
                onClick={() => setTextInput('')}
                className="text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            </div>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={direction === 'encode' ? 'Type or paste plain text...' : 'Paste Base64 encoded string...'}
              rows={10}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all resize-y"
            />

            <div className="text-xs text-neutral-400 flex items-center justify-between pt-1">
              <span>{textInput.length} characters</span>
              <span className="text-indigo-400 font-medium">Mode: {direction.toUpperCase()}</span>
            </div>
          </div>

          {/* Output Panel */}
          <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                {direction === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plaintext Result'}
              </span>
              {textOutput.result && (
                <button
                  onClick={() => handleCopy('text', textOutput.result)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-colors cursor-pointer"
                >
                  {copiedKey === 'text' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'text' ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {textOutput.error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                {textOutput.error}
              </div>
            ) : (
              <textarea
                readOnly
                value={textOutput.result}
                placeholder="Output will appear here instantly..."
                rows={10}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-emerald-300 placeholder-neutral-500 focus:outline-none transition-all resize-y"
              />
            )}

            <div className="text-xs text-neutral-400 flex items-center justify-between pt-1">
              <span>{textOutput.result.length} characters</span>
              <span>100% Private (in-browser)</span>
            </div>
          </div>
        </div>
      ) : (
        /* File Upload Mode */
        <div className="space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileUpload}
            className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-3xl p-8 sm:p-12 text-center bg-neutral-900/40 dark:bg-[#121624]/60 backdrop-blur-xl transition-all cursor-pointer"
          >
            <input
              type="file"
              id="file-b64-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-b64-upload" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-base font-bold text-white">
                Drag and drop any file, or <span className="text-indigo-400 hover:underline">browse files</span>
              </div>
              <p className="text-xs text-neutral-400">
                Supports PNG, JPG, SVG, WebP, GIF, PDF, audio, and documents. Converted locally with zero upload.
              </p>
            </label>
          </div>

          {fileData && (
            <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
              {/* File Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    {fileData.type.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{fileData.name}</div>
                    <div className="text-xs text-neutral-400">
                      {(fileData.size / 1024).toFixed(1)} KB &bull; {fileData.type || 'Unknown MIME'}
                    </div>
                  </div>
                </div>

                {fileData.type.startsWith('image/') && (
                  <img
                    src={fileData.base64}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-xl border border-white/15 shadow-md"
                  />
                )}
              </div>

              {/* Code Snippets */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1.5">
                    <span>Base64 Data URI</span>
                    <button
                      onClick={() => handleCopy('data-uri', fileData.base64)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                    >
                      {copiedKey === 'data-uri' ? 'Copied!' : 'Copy Data URI'}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-neutral-300 bg-black/40 p-3 rounded-xl border border-white/5 break-all max-h-24 overflow-y-auto">
                    {fileData.base64.slice(0, 300)}...
                  </div>
                </div>

                {fileData.type.startsWith('image/') && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1.5">
                      <span>HTML Image Tag (`&lt;img src="..." /&gt;`)</span>
                      <button
                        onClick={() => handleCopy('html', `<img src="${fileData.base64}" alt="${fileData.name}" />`)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                      >
                        {copiedKey === 'html' ? 'Copied!' : 'Copy HTML'}
                      </button>
                    </div>
                    <div className="font-mono text-xs text-neutral-300 bg-black/40 p-3 rounded-xl border border-white/5 break-all max-h-20 overflow-y-auto">
                      &lt;img src="{fileData.base64.slice(0, 100)}..." alt="{fileData.name}" /&gt;
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
