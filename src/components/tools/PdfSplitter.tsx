import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Upload, FileText, Download, RefreshCw, AlertCircle, 
  CheckCircle2, Scissors, Lock, FileCheck, ShieldCheck, 
  Trash2, Layers, CheckSquare, Square
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Range and Selection states
  const [selectionMode, setSelectionMode] = useState<'range' | 'visual'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1-2');
  const [selectedPagesSet, setSelectedPagesSet] = useState<Set<number>>(new Set([1, 2]));

  // Result state
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [splitStats, setSplitStats] = useState<{
    name: string;
    size: number;
    extractedPagesCount: number;
    pagesSummary: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (splitBlobUrl) {
        URL.revokeObjectURL(splitBlobUrl);
      }
    };
  }, [splitBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleIncomingFile = async (selectedFile: File) => {
    setErrorMsg(null);
    if (!selectedFile.type.includes('pdf') && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF document.');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      if (count === 0) {
        throw new Error('This PDF contains 0 pages.');
      }

      setFile(selectedFile);
      setArrayBuffer(buffer);
      setTotalPages(count);

      // Default selection: page 1 or 1-2 if multiple
      const defaultRange = count >= 2 ? '1-2' : '1';
      setRangeInput(defaultRange);
      setSelectedPagesSet(new Set(count >= 2 ? [1, 2] : [1]));

      if (splitBlobUrl) {
        URL.revokeObjectURL(splitBlobUrl);
        setSplitBlobUrl(null);
        setSplitStats(null);
      }
    } catch (err: any) {
      console.error('Failed to load PDF:', err);
      setErrorMsg(err.message || 'Could not parse this PDF file. It might be corrupted or password-protected.');
      setFile(null);
      setArrayBuffer(null);
      setTotalPages(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Parse custom range input string (e.g., "1-3, 5, 7-10")
  const parsedRangeResult = useMemo(() => {
    if (!totalPages || !rangeInput.trim()) {
      return { pages: [], error: 'Please enter at least one page number or range.' };
    }

    const segments = rangeInput.split(',').map(s => s.trim()).filter(Boolean);
    const pagesSet = new Set<number>();

    for (const segment of segments) {
      if (segment.includes('-')) {
        const parts = segment.split('-').map(p => p.trim());
        if (parts.length !== 2) {
          return { pages: [], error: `Invalid range format: "${segment}". Use format like 1-3.` };
        }
        let start = parseInt(parts[0], 10);
        let end = parseInt(parts[1], 10);

        if (isNaN(start) || isNaN(end)) {
          return { pages: [], error: `Range contains non-numeric values: "${segment}".` };
        }

        // Handle reversed ranges safely (e.g. 5-2 -> 2-5)
        if (start > end) {
          const temp = start;
          start = end;
          end = temp;
        }

        if (start < 1) {
          return { pages: [], error: `Page numbers must start at 1. Found: ${start}` };
        }

        if (end > totalPages) {
          return { pages: [], error: `Range "${segment}" exceeds total page count (${totalPages}).` };
        }

        for (let p = start; p <= end; p++) {
          pagesSet.add(p);
        }
      } else {
        const pageNum = parseInt(segment, 10);
        if (isNaN(pageNum)) {
          return { pages: [], error: `Invalid page number: "${segment}".` };
        }
        if (pageNum < 1 || pageNum > totalPages) {
          return { pages: [], error: `Page ${pageNum} is out of bounds (1 - ${totalPages}).` };
        }
        pagesSet.add(pageNum);
      }
    }

    const sortedPages = Array.from(pagesSet).sort((a: number, b: number) => a - b);
    if (sortedPages.length === 0) {
      return { pages: [], error: 'No valid pages found in specified range.' };
    }

    return { pages: sortedPages, error: null };
  }, [rangeInput, totalPages]);

  // Synchronize visual grid toggle
  const togglePageSelection = (pageNum: number) => {
    const next = new Set(selectedPagesSet);
    if (next.has(pageNum)) {
      next.delete(pageNum);
    } else {
      next.add(pageNum);
    }
    setSelectedPagesSet(next);

    // Update range input text to reflect visual selection
    const arr = Array.from(next).sort((a: number, b: number) => a - b);
    setRangeInput(arr.join(', '));
  };

  const handleSelectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= totalPages; i++) all.add(i);
    setSelectedPagesSet(all);
    setRangeInput(`1-${totalPages}`);
  };

  const handleDeselectAll = () => {
    setSelectedPagesSet(new Set<number>());
    setRangeInput('');
  };

  const handleSelectOdd = () => {
    const odds = new Set<number>();
    for (let i = 1; i <= totalPages; i += 2) odds.add(i);
    setSelectedPagesSet(odds);
    setRangeInput(Array.from(odds).join(', '));
  };

  const handleSelectEven = () => {
    const evens = new Set<number>();
    for (let i = 2; i <= totalPages; i += 2) evens.add(i);
    setSelectedPagesSet(evens);
    setRangeInput(Array.from(evens).join(', '));
  };

  const handleExtractPages = async () => {
    if (!arrayBuffer || !file) return;

    const targetPages = selectionMode === 'range' 
      ? parsedRangeResult.pages 
      : Array.from(selectedPagesSet).sort((a: number, b: number) => a - b);

    if (targetPages.length === 0) {
      setErrorMsg('Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      // Convert 1-based page numbers to 0-based indices
      const indicesToCopy = targetPages.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(srcDoc, indicesToCopy);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      if (splitBlobUrl) {
        URL.revokeObjectURL(splitBlobUrl);
      }

      const url = URL.createObjectURL(blob);
      setSplitBlobUrl(url);

      const baseName = file.name.replace(/\.pdf$/i, '');
      setSplitStats({
        name: `${baseName}_extracted_${targetPages.length}_pages.pdf`,
        size: blob.size,
        extractedPagesCount: targetPages.length,
        pagesSummary: targetPages.length <= 8 
          ? `Pages: [${targetPages.join(', ')}]` 
          : `${targetPages.length} pages (${targetPages.slice(0, 5).join(', ')}...)`,
      });
    } catch (err: any) {
      console.error('Extract failed:', err);
      setErrorMsg(err.message || 'An error occurred while splitting the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (splitBlobUrl) {
      URL.revokeObjectURL(splitBlobUrl);
    }
    setFile(null);
    setArrayBuffer(null);
    setTotalPages(0);
    setSplitBlobUrl(null);
    setSplitStats(null);
    setErrorMsg(null);
    setRangeInput('1-2');
    setSelectedPagesSet(new Set([1, 2]));
  };

  const effectivePages = selectionMode === 'range' 
    ? parsedRangeResult.pages 
    : Array.from(selectedPagesSet);

  return (
    <div className="space-y-8" id="pdf-splitter-tool">
      {/* Privacy Guarantee Card */}
      <div className="rounded-2xl p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span><strong>100% Client-Side Privacy:</strong> Your PDF files are split locally inside browser memory and are never uploaded to any remote server.</span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
          Local Processing
        </span>
      </div>

      {/* Upload Zone (when no file selected) */}
      {!file ? (
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
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <Scissors className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose a PDF file or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Split by page numbers, custom ranges (e.g. 1-3, 5, 8-10), or visual selection
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Select PDF Document
            </button>
          </div>
        </div>
      ) : (
        /* File Details & Splitting Workspace */
        <div className="space-y-6">
          {/* Active File Card */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{totalPages} {totalPages === 1 ? 'Page' : 'Total Pages'}</span>
                  <span>•</span>
                  <span>{formatFileSize(file.size)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Change Document
              </button>
            </div>
          </div>

          {/* Splitting Configuration Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-indigo-500" />
                  Select Pages to Extract
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Choose specific pages or ranges to generate your new document
                </p>
              </div>

              {/* Mode switch */}
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10 text-xs">
                <button
                  onClick={() => setSelectionMode('range')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectionMode === 'range'
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Page Range Syntax
                </button>
                <button
                  onClick={() => setSelectionMode('visual')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectionMode === 'visual'
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Visual Page Grid
                </button>
              </div>
            </div>

            {/* Mode 1: Range Input */}
            {selectionMode === 'range' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center justify-between">
                    <span>Page Ranges (Comma separated)</span>
                    <span className="text-slate-400 font-mono text-[11px]">Valid range: 1 – {totalPages}</span>
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-10"
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    Examples: <code className="text-indigo-600 dark:text-indigo-300">1-3, 5</code> (Extracts pages 1, 2, 3, and 5) or <code className="text-indigo-600 dark:text-indigo-300">1, 4, 8-12</code>.
                  </p>
                </div>

                {/* Validation Status */}
                {parsedRangeResult.error ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{parsedRangeResult.error}</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Extracting <strong>{parsedRangeResult.pages.length}</strong> pages: [{parsedRangeResult.pages.join(', ')}]</span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Visual Page Grid */}
            {selectionMode === 'visual' && (
              <div className="space-y-4">
                {/* Quick select helpers */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-neutral-400 mr-1">Quick Select:</span>
                  <button
                    onClick={handleSelectAll}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10"
                  >
                    All ({totalPages})
                  </button>
                  <button
                    onClick={handleSelectOdd}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10"
                  >
                    Odd Pages
                  </button>
                  <button
                    onClick={handleSelectEven}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10"
                  >
                    Even Pages
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                  >
                    Clear Selection
                  </button>
                </div>

                {/* Interactive Grid of Page Cards */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isSelected = selectedPagesSet.has(pageNum);
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => togglePageSelection(pageNum)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 scale-105'
                            : 'bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-white/10 hover:border-indigo-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold opacity-70">Page</span>
                        <span className="font-mono text-sm font-bold">{pageNum}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Selected: <strong>{selectedPagesSet.size}</strong> of {totalPages} pages.
                </p>
              </div>
            )}

            {/* Split Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-white/[0.08]">
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Extracted pages will be bundled into a new standalone PDF.
              </p>
              <button
                disabled={effectivePages.length === 0 || isProcessing || (selectionMode === 'range' && !!parsedRangeResult.error)}
                onClick={handleExtractPages}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Extract {effectivePages.length} Pages</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Extracted Result Section */}
      {splitBlobUrl && splitStats && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Extraction Complete
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {splitStats.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={splitBlobUrl}
                download={splitStats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Extracted PDF
              </a>
              <button
                onClick={() => {
                  if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
                  setSplitBlobUrl(null);
                  setSplitStats(null);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Split Again
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-emerald-500/20">
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Extracted Pages</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{splitStats.extractedPagesCount} of {totalPages}</span>
            </div>
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Output File Size</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatFileSize(splitStats.size)}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Summary</span>
              <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 truncate block">
                {splitStats.pagesSummary}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
