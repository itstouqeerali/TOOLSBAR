import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  FileText, Download, RefreshCw, AlertCircle, CheckCircle2, 
  ShieldCheck, Trash2, Settings, Eye, Sliders, Sparkles, 
  AlignLeft, AlignCenter, AlignRight, Copy, Check, FileCheck, Layers,
  ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, LayoutList, FileSpreadsheet
} from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, RGB } from 'pdf-lib';

export type PageSizeOption = 'a4' | 'letter';
export type PageOrientationOption = 'portrait' | 'landscape';
export type MarginOption = 'compact' | 'standard' | 'wide';
export type FontFamilyOption = 'Helvetica' | 'TimesRoman' | 'Courier';
export type TextAlignOption = 'left' | 'center' | 'right';

const SAMPLE_TEXT = `Toolsbar Text to PDF Converter
======================================

Welcome to the client-side Text to PDF converter. You can type, paste, or draft any plain text here and convert it directly into a clean, formatted, multi-page PDF document.

Key Advantages:
1. Complete Privacy: Your document is rendered 100% inside your browser sandbox. No text or files are uploaded to any server.
2. Smart Pagination: Long documents automatically wrap text and paginate across multiple pages without overflowing or clipping.
3. Custom Typography: Customize page size (A4 / US Letter), orientation, margins, font family, sizing, line height, headers, footers, and page numbers.
4. Live Document Preview: See an exact sheet-by-sheet representation of how your PDF will look prior to downloading.

Try modifying the settings on the editor panel and inspect the live preview in real time!`;

interface PaginatedDoc {
  pages: string[][];
  pageWidthPt: number;
  pageHeightPt: number;
  marginPt: number;
  topMarginPt: number;
  bottomMarginPt: number;
  contentWidthPt: number;
  contentHeightPt: number;
  lineHeightPt: number;
  aspectRatio: number;
}

export const TextToPdf: React.FC = () => {
  // Document text content
  const [text, setText] = useState<string>(SAMPLE_TEXT);

  // PDF Configuration Settings
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<PageOrientationOption>('portrait');
  const [margin, setMargin] = useState<MarginOption>('standard');
  const [fontFamily, setFontFamily] = useState<FontFamilyOption>('Helvetica');
  const [fontSize, setFontSize] = useState<number>(12);
  const [lineSpacing, setLineSpacing] = useState<number>(1.4);
  const [textAlign, setTextAlign] = useState<TextAlignOption>('left');
  const [textColor, setTextColor] = useState<string>('#1e293b'); // slate-800
  
  // Headers & Footers
  const [headerTitle, setHeaderTitle] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('');
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);
  const [pdfFileName, setPdfFileName] = useState<string>('toolsbar-text-to-pdf.pdf');

  // Preview Controls
  const [previewZoom, setPreviewZoom] = useState<number>(100); // percentage: 50% to 150%
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // Operation States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfStats, setPdfStats] = useState<{
    size: number;
    pages: number;
  } | null>(null);

  // Tab state for settings on smaller screens
  const [activeSettingsTab, setActiveSettingsTab] = useState<'page' | 'typography' | 'headerFooter'>('page');

  // Character & Word counts
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const characters = text.length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    return { characters, words, lines };
  }, [text]);

  // Clean up generated blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert Hex color to RGB object for PDF document
  const hexToRgb = (hex: string): RGB => {
    const cleanHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
      g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
      b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16) / 255;
      g = parseInt(cleanHex.substring(2, 4), 16) / 255;
      b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    }
    return rgb(isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b);
  };

  // Map font family to CSS font string for preview
  const cssFontFamily = useMemo(() => {
    if (fontFamily === 'TimesRoman') return '"Times New Roman", Times, Georgia, serif';
    if (fontFamily === 'Courier') return '"Courier New", Courier, monospace';
    return 'Helvetica, Arial, sans-serif';
  }, [fontFamily]);

  // Pagination & Layout Engine
  const paginatedDoc = useMemo<PaginatedDoc>(() => {
    // 1. Determine base page dimensions in points (72 pt per inch)
    let baseW = pageSize === 'letter' ? 612 : 595.28;
    let baseH = pageSize === 'letter' ? 792 : 841.89;

    const pageWidthPt = orientation === 'landscape' ? Math.max(baseW, baseH) : Math.min(baseW, baseH);
    const pageHeightPt = orientation === 'landscape' ? Math.min(baseW, baseH) : Math.max(baseW, baseH);
    const aspectRatio = pageWidthPt / pageHeightPt;

    // 2. Margins in points
    const marginPt = margin === 'compact' ? 28.35 : margin === 'wide' ? 56.7 : 42.52; // ~10mm, ~20mm, ~15mm
    const contentWidthPt = pageWidthPt - (marginPt * 2);

    const topMarginPt = headerTitle.trim() ? marginPt + 24 : marginPt;
    const bottomMarginPt = (footerText.trim() || includePageNumbers) ? marginPt + 24 : marginPt;
    const contentHeightPt = Math.max(50, pageHeightPt - topMarginPt - bottomMarginPt);

    const lineHeightPt = fontSize * lineSpacing;

    // 3. Measure text using an offscreen canvas context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = `${fontSize}px ${cssFontFamily}`;
    }

    const measureWidth = (str: string): number => {
      if (!ctx) return str.length * (fontSize * 0.55);
      return ctx.measureText(str).width;
    };

    // 4. Word-wrapping algorithm
    const rawParagraphs = text.split('\n');
    const wrappedLines: string[] = [];

    for (const paragraph of rawParagraphs) {
      if (paragraph === '') {
        wrappedLines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
        const testWidth = measureWidth(testLine);

        if (testWidth <= contentWidthPt) {
          currentLine = testLine;
        } else {
          if (currentLine !== '') {
            wrappedLines.push(currentLine);
            currentLine = word;
          } else {
            // Long single word exceeds content width: break by character
            let partial = '';
            for (const char of word) {
              const testPartial = partial + char;
              if (measureWidth(testPartial) <= contentWidthPt) {
                partial = testPartial;
              } else {
                wrappedLines.push(partial);
                partial = char;
              }
            }
            currentLine = partial;
          }
        }
      }

      if (currentLine !== '') {
        wrappedLines.push(currentLine);
      }
    }

    // 5. Paginate lines
    const linesPerPage = Math.max(1, Math.floor(contentHeightPt / lineHeightPt));
    const pages: string[][] = [];

    for (let i = 0; i < wrappedLines.length; i += linesPerPage) {
      pages.push(wrappedLines.slice(i, i + linesPerPage));
    }

    if (pages.length === 0) {
      pages.push(['']);
    }

    return {
      pages,
      pageWidthPt,
      pageHeightPt,
      marginPt,
      topMarginPt,
      bottomMarginPt,
      contentWidthPt,
      contentHeightPt,
      lineHeightPt,
      aspectRatio
    };
  }, [
    text, pageSize, orientation, margin, fontFamily, fontSize, 
    lineSpacing, headerTitle, footerText, includePageNumbers, cssFontFamily
  ]);

  // Adjust current page index when total pages change
  useEffect(() => {
    if (currentPageIndex >= paginatedDoc.pages.length) {
      setCurrentPageIndex(Math.max(0, paginatedDoc.pages.length - 1));
    }
  }, [paginatedDoc.pages.length, currentPageIndex]);

  // Generate binary PDF document via pdf-lib
  const generatePdfBlob = async (): Promise<{ blob: Blob; totalPages: number }> => {
    if (!text.trim()) {
      throw new Error('Please enter some text to generate a PDF.');
    }

    const pdfDoc = await PDFDocument.create();

    // Map font family
    let standardFontEnum = StandardFonts.Helvetica;
    let boldFontEnum = StandardFonts.HelveticaBold;
    if (fontFamily === 'TimesRoman') {
      standardFontEnum = StandardFonts.TimesRoman;
      boldFontEnum = StandardFonts.TimesRomanBold;
    } else if (fontFamily === 'Courier') {
      standardFontEnum = StandardFonts.Courier;
      boldFontEnum = StandardFonts.CourierBold;
    }

    const font = await pdfDoc.embedFont(standardFontEnum);
    const metaFont = await pdfDoc.embedFont(boldFontEnum);

    const { 
      pages, pageWidthPt, pageHeightPt, marginPt, 
      topMarginPt, contentWidthPt, lineHeightPt 
    } = paginatedDoc;

    const textColorRgb = hexToRgb(textColor);
    const mutedColorRgb = rgb(0.45, 0.5, 0.58);
    const totalPages = pages.length;

    // Draw each paginated page
    pages.forEach((linesOnPage, pageIndex) => {
      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
      const pageNum = pageIndex + 1;

      // 1. Draw Optional Header
      if (headerTitle.trim()) {
        const safeHeader = headerTitle.trim().replace(/[^\x00-\x7F\xA0-\xFF]/g, '?');
        const headerFontSize = 9;
        const headerY = pageHeightPt - marginPt;
        
        page.drawText(safeHeader, {
          x: marginPt,
          y: headerY,
          size: headerFontSize,
          font: metaFont,
          color: mutedColorRgb,
        });

        // Header rule divider
        page.drawLine({
          start: { x: marginPt, y: headerY - 4 },
          end: { x: pageWidthPt - marginPt, y: headerY - 4 },
          thickness: 0.5,
          color: rgb(0.85, 0.88, 0.92),
        });
      }

      // 2. Draw Body Lines
      let currentY = pageHeightPt - topMarginPt - fontSize;

      for (const line of linesOnPage) {
        if (line !== '') {
          const safeLine = line.replace(/[^\x00-\x7F\xA0-\xFF]/g, '?');
          let lineWidth = 0;
          try {
            lineWidth = font.widthOfTextAtSize(safeLine, fontSize);
          } catch {
            lineWidth = safeLine.length * (fontSize * 0.6);
          }

          let drawX = marginPt;
          if (textAlign === 'center') {
            drawX = marginPt + Math.max(0, (contentWidthPt - lineWidth) / 2);
          } else if (textAlign === 'right') {
            drawX = marginPt + Math.max(0, contentWidthPt - lineWidth);
          }

          page.drawText(safeLine, {
            x: drawX,
            y: currentY,
            size: fontSize,
            font: font,
            color: textColorRgb,
          });
        }
        currentY -= lineHeightPt;
      }

      // 3. Draw Optional Footer & Page Numbers
      if (footerText.trim() || includePageNumbers) {
        const footerY = marginPt;
        const footerFontSize = 9;

        // Footer divider rule
        page.drawLine({
          start: { x: marginPt, y: footerY + 12 },
          end: { x: pageWidthPt - marginPt, y: footerY + 12 },
          thickness: 0.5,
          color: rgb(0.85, 0.88, 0.92),
        });

        if (footerText.trim()) {
          const safeFooter = footerText.trim().replace(/[^\x00-\x7F\xA0-\xFF]/g, '?');
          page.drawText(safeFooter, {
            x: marginPt,
            y: footerY,
            size: footerFontSize,
            font: font,
            color: mutedColorRgb,
          });
        }

        if (includePageNumbers) {
          const pageStr = `Page ${pageNum} of ${totalPages}`;
          const pageStrWidth = font.widthOfTextAtSize(pageStr, footerFontSize);
          page.drawText(pageStr, {
            x: pageWidthPt - marginPt - pageStrWidth,
            y: footerY,
            size: footerFontSize,
            font: font,
            color: mutedColorRgb,
          });
        }
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return { blob, totalPages };
  };

  // Download PDF Action
  const handleDownload = async () => {
    setErrorMsg(null);
    if (!text.trim()) {
      setErrorMsg('Please enter some text before downloading the PDF.');
      return;
    }

    setIsProcessing(true);

    try {
      const { blob, totalPages } = await generatePdfBlob();
      
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(newUrl);
      setPdfStats({
        size: blob.size,
        pages: totalPages,
      });

      // Trigger automatic browser download
      const downloadName = pdfFileName.trim().endsWith('.pdf') 
        ? pdfFileName.trim() 
        : `${pdfFileName.trim() || 'toolsbar-text-to-pdf'}.pdf`;

      const link = document.createElement('a');
      link.href = newUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setErrorMsg(err.message || 'Failed to generate PDF. Please check your text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    setErrorMsg(null);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
      setPdfStats(null);
    }
  };

  // Render a realistic PDF sheet element
  const renderPreviewSheet = (lines: string[], pageIndex: number) => {
    const pageNum = pageIndex + 1;
    const totalPages = paginatedDoc.pages.length;

    // Percentages for fluid scaling
    const marginPercentX = (paginatedDoc.marginPt / paginatedDoc.pageWidthPt) * 100;
    const marginPercentY = (paginatedDoc.marginPt / paginatedDoc.pageHeightPt) * 100;

    return (
      <div
        key={`preview-page-${pageIndex}`}
        style={{
          aspectRatio: `${paginatedDoc.aspectRatio}`,
          transform: `scale(${previewZoom / 100})`,
          transformOrigin: 'top center',
        }}
        className="w-full bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-200/90 relative flex flex-col justify-between select-none overflow-hidden mx-auto transition-transform duration-150"
      >
        {/* Printable Area with Exact Margins */}
        <div 
          style={{
            paddingLeft: `${marginPercentX}%`,
            paddingRight: `${marginPercentX}%`,
            paddingTop: `${marginPercentY}%`,
            paddingBottom: `${marginPercentY}%`,
          }}
          className="w-full h-full flex flex-col justify-between"
        >
          {/* Document Header */}
          <div>
            {headerTitle.trim() ? (
              <div className="pb-1.5 mb-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[80%] font-sans">
                  {headerTitle}
                </span>
                <span className="text-[9px] text-slate-400 font-sans">
                  {pageSize.toUpperCase()}
                </span>
              </div>
            ) : null}
          </div>

          {/* Document Body Lines */}
          <div 
            style={{
              fontFamily: cssFontFamily,
              fontSize: `${Math.max(8, fontSize * (previewZoom / 100) * 0.82)}px`,
              lineHeight: lineSpacing,
              textAlign: textAlign,
              color: textColor,
            }}
            className="flex-1 w-full overflow-hidden flex flex-col"
          >
            {lines.map((line, lineIdx) => (
              <div 
                key={lineIdx} 
                className="whitespace-pre-wrap leading-normal"
                style={{ lineHeight: lineSpacing }}
              >
                {line || '\u00A0'}
              </div>
            ))}
          </div>

          {/* Document Footer & Page Number */}
          <div>
            {(footerText.trim() || includePageNumbers) ? (
              <div className="pt-1.5 mt-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-sans">
                <span className="truncate max-w-[65%]">
                  {footerText || ''}
                </span>
                {includePageNumbers && (
                  <span className="font-mono font-medium flex-shrink-0">
                    Page {pageNum} of {totalPages}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id="text-to-pdf-tool">
      {/* 100% Client-Side Privacy Notice */}
      <div className="rounded-2xl p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>100% Client-Side Privacy:</strong> Your text is processed entirely in your browser. Nothing is uploaded to our servers.
          </span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
          Local Engine
        </span>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="flex-1">{errorMsg}</p>
          <button 
            onClick={() => setErrorMsg(null)}
            className="p-1 hover:bg-rose-500/20 rounded-lg text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workspace: Left (Editor & Formatting) | Right (Interactive PDF Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Editor & Settings */}
        <div className="xl:col-span-6 space-y-6">
          {/* Main Text Editor */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-neutral-300">
                  Document Text Editor
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={!text}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-300 text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!text}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Editor Textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (pdfBlobUrl) {
                    URL.revokeObjectURL(pdfBlobUrl);
                    setPdfBlobUrl(null);
                    setPdfStats(null);
                  }
                }}
                placeholder="Type or paste your text here..."
                rows={13}
                className="w-full p-4 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 text-sm leading-relaxed font-sans resize-y"
              />
            </div>

            {/* Character, Word & Line Metric Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-neutral-400 border-t border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-3 sm:gap-4">
                <span><strong>{stats.words.toLocaleString()}</strong> words</span>
                <span>•</span>
                <span><strong>{stats.characters.toLocaleString()}</strong> chars</span>
                <span>•</span>
                <span><strong>{paginatedDoc.pages.length}</strong> {paginatedDoc.pages.length === 1 ? 'page' : 'pages'}</span>
              </div>
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs cursor-pointer font-medium"
              >
                Load Sample Text
              </button>
            </div>
          </div>

          {/* Formatting Controls Panel */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-neutral-300">
                  PDF Formatting Controls
                </span>
              </div>

              {/* Navigation Pill for Settings */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveSettingsTab('page')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeSettingsTab === 'page'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  Page
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsTab('typography')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeSettingsTab === 'typography'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  Typography
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsTab('headerFooter')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeSettingsTab === 'headerFooter'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  Headers & Notes
                </button>
              </div>
            </div>

            {/* Tab 1: Page Layout Settings */}
            {activeSettingsTab === 'page' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                    Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">US Letter (8.5 × 11 in)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as PageOrientationOption)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                    Margins
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(e.target.value as MarginOption)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="compact">Compact (10 mm)</option>
                    <option value="standard">Standard (15 mm)</option>
                    <option value="wide">Wide (20 mm)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab 2: Typography Settings */}
            {activeSettingsTab === 'typography' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as FontFamilyOption)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Helvetica">Helvetica (Standard Sans)</option>
                      <option value="TimesRoman">Times New Roman (Serif)</option>
                      <option value="Courier">Courier (Monospace)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                      Text Alignment
                    </label>
                    <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => setTextAlign('left')}
                        aria-label="Align Left"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          textAlign === 'left' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextAlign('center')}
                        aria-label="Align Center"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          textAlign === 'center' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextAlign('right')}
                        aria-label="Align Right"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          textAlign === 'right' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-neutral-300">
                      <span>Font Size</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{fontSize} pt</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={22}
                      step={1}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-neutral-300">
                      <span>Line Spacing</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{lineSpacing}x</span>
                    </div>
                    <input
                      type="range"
                      min={1.1}
                      max={2.2}
                      step={0.1}
                      value={lineSpacing}
                      onChange={(e) => setLineSpacing(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                      Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Headers & Footers Settings */}
            {activeSettingsTab === 'headerFooter' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                    Document Header / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Project Proposal — Confidential"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                    Footer Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Generated via Toolsbar (toolsbar.site)"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePageNumbers}
                      onChange={(e) => setIncludePageNumbers(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-white/20 accent-indigo-600 cursor-pointer"
                    />
                    Include automated page numbers (e.g. Page 1 of 3)
                  </label>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400">
                    <span>File:</span>
                    <input
                      type="text"
                      value={pdfFileName}
                      onChange={(e) => setPdfFileName(e.target.value)}
                      placeholder="document.pdf"
                      className="w-36 px-2 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Real-Time PDF Preview & Action Bar */}
        <div className="xl:col-span-6 space-y-4">
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
            
            {/* Preview Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-neutral-300">
                  Live PDF Document Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold font-mono">
                  {paginatedDoc.pages.length} {paginatedDoc.pages.length === 1 ? 'Page' : 'Pages'}
                </span>
              </div>

              {/* View Mode & Page Navigation */}
              <div className="flex items-center gap-2">
                {/* Single / All Pages Toggle */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-0.5 border border-slate-200 dark:border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('single')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      viewMode === 'single'
                        ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Page by Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      viewMode === 'all'
                        ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    All Pages
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-0.5 rounded-xl border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(prev => Math.max(60, prev - 15))}
                    title="Zoom Out"
                    aria-label="Zoom Out"
                    className="p-1 text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-semibold px-1 text-slate-600 dark:text-neutral-300 min-w-[34px] text-center">
                    {previewZoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(prev => Math.min(140, prev + 15))}
                    title="Zoom In"
                    aria-label="Zoom In"
                    className="p-1 text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Document Sheet Canvas Area */}
            <div className="rounded-2xl bg-slate-200/70 dark:bg-neutral-950/80 p-4 sm:p-6 border border-slate-300/80 dark:border-white/10 min-h-[480px] max-h-[640px] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start space-y-6">
              {viewMode === 'single' ? (
                // Single Page Mode with Navigation
                <div className="w-full max-w-[480px] space-y-4">
                  {renderPreviewSheet(paginatedDoc.pages[currentPageIndex], currentPageIndex)}
                  
                  {/* Page Navigation Controls */}
                  {paginatedDoc.pages.length > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={currentPageIndex === 0}
                        onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Previous
                      </button>

                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-neutral-300 bg-white/80 dark:bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10">
                        {currentPageIndex + 1} / {paginatedDoc.pages.length}
                      </span>

                      <button
                        type="button"
                        disabled={currentPageIndex === paginatedDoc.pages.length - 1}
                        onClick={() => setCurrentPageIndex(prev => Math.min(paginatedDoc.pages.length - 1, prev + 1))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
                      >
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // All Pages Continuous Vertical Flow
                <div className="w-full max-w-[480px] space-y-6">
                  {paginatedDoc.pages.map((pageLines, pIdx) => (
                    <div key={`all-page-${pIdx}`} className="space-y-1.5">
                      <div className="text-center text-[11px] font-mono font-semibold text-slate-500 dark:text-neutral-400">
                        Page {pIdx + 1} of {paginatedDoc.pages.length}
                      </div>
                      {renderPreviewSheet(pageLines, pIdx)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prominent Download Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!text.trim() || isProcessing}
                onClick={handleDownload}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling PDF Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF ({paginatedDoc.pages.length} {paginatedDoc.pages.length === 1 ? 'Page' : 'Pages'})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Status Card */}
          {pdfStats && pdfBlobUrl && (
            <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>PDF Download Ready ({pdfStats.pages} {pdfStats.pages === 1 ? 'Page' : 'Pages'}, {formatFileSize(pdfStats.size)})</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  {pdfFileName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfBlobUrl}
                  download={pdfFileName || 'toolsbar-text-to-pdf.pdf'}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center shadow-md transition-colors cursor-pointer"
                >
                  Download Again
                </a>
                <a
                  href={pdfBlobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-800 dark:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Open PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
