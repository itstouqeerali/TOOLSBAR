import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, Trash2, ArrowUp, ArrowDown, 
  Download, RefreshCw, AlertCircle, CheckCircle2, 
  Layers, Lock, Plus, FileCheck, ShieldCheck
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedStats, setMergedStats] = useState<{
    name: string;
    size: number;
    totalPages: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up blob URLs when component unmounts or resets
  useEffect(() => {
    return () => {
      if (mergedBlobUrl) {
        URL.revokeObjectURL(mergedBlobUrl);
      }
    };
  }, [mergedBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processIncomingFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const newPdfFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        newPdfFiles.push(file);
      } else {
        setErrorMsg(`Skipped non-PDF file: "${file.name}". Please upload PDF documents only.`);
      }
    }

    if (newPdfFiles.length === 0) return;

    setIsProcessing(true);
    setProgressMsg('Analyzing and loading PDF documents...');

    const parsedItems: PDFFileItem[] = [];

    for (const file of newPdfFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        // Validate with pdf-lib
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        parsedItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
          arrayBuffer,
        });
      } catch (err: any) {
        console.error('Error reading PDF:', err);
        setErrorMsg(`Could not read "${file.name}". It might be corrupted or password-protected.`);
      }
    }

    setFiles(prev => [...prev, ...parsedItems]);
    setIsProcessing(false);
    setProgressMsg('');
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
      setMergedBlobUrl(null);
      setMergedStats(null);
    }
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;

    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });

    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
      setMergedBlobUrl(null);
      setMergedStats(null);
    }
  };

  const handleMergePDFs = async () => {
    if (files.length < 2) {
      setErrorMsg('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressMsg('Merging PDF pages in specified sequence...');

    try {
      const mergedPdf = await PDFDocument.create();
      let totalPages = 0;

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setProgressMsg(`Copying pages from (${i + 1}/${files.length}) ${item.name}...`);
        
        const srcDoc = await PDFDocument.load(item.arrayBuffer);
        const indices = srcDoc.getPageIndices();
        totalPages += indices.length;
        
        const copiedPages = await mergedPdf.copyPages(srcDoc, indices);
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      setProgressMsg('Generating final merged PDF binary...');
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });

      if (mergedBlobUrl) {
        URL.revokeObjectURL(mergedBlobUrl);
      }

      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
      setMergedStats({
        name: `merged_${files.length}_documents.pdf`,
        size: blob.size,
        totalPages,
      });
    } catch (err: any) {
      console.error('Merge failed:', err);
      setErrorMsg(err.message || 'An error occurred during PDF merging. Please verify your files.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleReset = () => {
    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
    }
    setFiles([]);
    setMergedBlobUrl(null);
    setMergedStats(null);
    setErrorMsg(null);
  };

  const totalInputPages = files.reduce((acc, f) => acc + f.pageCount, 0);
  const totalInputSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-8" id="pdf-merger-tool">
      {/* Privacy Guarantee Card */}
      <div className="rounded-2xl p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span><strong>100% Client-Side Privacy:</strong> Your PDF files are processed directly in your browser and are never uploaded to any server.</span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
          Local Processing
        </span>
      </div>

      {/* Main Dropzone / Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl p-8 sm:p-12 border-2 border-dashed transition-all duration-200 text-center cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]'
            : 'border-slate-300 dark:border-white/15 bg-white/60 dark:bg-white/[0.02] hover:border-indigo-400 hover:bg-slate-50/80 dark:hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              Choose PDF files or drag & drop here
            </p>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Select two or more PDF documents to merge into a single file
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Browse PDF Files
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="flex-1">{errorMsg}</p>
          <button 
            onClick={() => setErrorMsg(null)}
            className="p-1 hover:bg-rose-500/20 rounded-lg text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Uploaded File Queue & Ordering */}
      {files.length > 0 && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Files to Merge ({files.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Total {totalInputPages} pages • {formatFileSize(totalInputSize)}. Reorder files below to change page order.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add More
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>

          {/* List of files with drag-free reordering for touch & desktop */}
          <div className="space-y-2.5">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                      <span>{item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}</span>
                      <span>•</span>
                      <span>{formatFileSize(item.size)}</span>
                    </p>
                  </div>
                </div>

                {/* Reorder & Delete controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, 'up')}
                    aria-label="Move Up"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === files.length - 1}
                    onClick={() => moveFile(idx, 'down')}
                    aria-label="Move Down"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    aria-label="Remove File"
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Files will be combined in the order shown (1 to {files.length}).
            </p>
            <button
              disabled={files.length < 2 || isProcessing}
              onClick={handleMergePDFs}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{progressMsg || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Merge {files.length} PDFs</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Merged Result Section */}
      {mergedBlobUrl && mergedStats && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Merge Complete
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {mergedStats.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={mergedBlobUrl}
                download={mergedStats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Merged PDF
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Start Over
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-emerald-500/20">
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Total Pages</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{mergedStats.totalPages}</span>
            </div>
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Merged File Size</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatFileSize(mergedStats.size)}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Documents Combined</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{files.length} Files</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
