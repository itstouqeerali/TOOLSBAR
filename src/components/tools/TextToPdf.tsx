import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Download,
  ShieldCheck,
  Trash2,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  X,
  RotateCcw,
} from 'lucide-react';

import {
  BlockType,
  CanonicalDocument,
  FontFamilyOption,
  MarginOption,
  PageOrientationOption,
  PageSizeOption,
  TextAlignOption,
} from './textToPdf/types';
import { calculateDimensions, paginateDocument } from './textToPdf/paginator';
import { generatePdfBlob } from './textToPdf/pdfGenerator';
import { Toolbar } from './textToPdf/Toolbar';
import {
  applyAlignToCanonicalDoc,
  applyBlockTypeToCanonicalDoc,
  applyStyleToCanonicalDoc,
  CanonicalSelection,
  clearFormattingFromCanonicalDoc,
  countCanonicalStats,
  insertHrToCanonicalDoc,
  insertPageBreakToCanonicalDoc,
  parsePlainTextToCanonical,
  updateBlockTextInCanonicalDoc,
} from './textToPdf/canonicalOperations';
import { STANDARD_SAMPLE_TEXT, generateSeventeenPageDoc } from './textToPdf/sampleData';

export const TextToPdf: React.FC = () => {
  // Page Configuration State
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<PageOrientationOption>('portrait');
  const [margin, setMargin] = useState<MarginOption>('standard');
  const [lineSpacing, setLineSpacing] = useState<number>(1.4);
  const [defaultFontSize, setDefaultFontSize] = useState<number>(12);
  const [defaultFontFamily, setDefaultFontFamily] = useState<FontFamilyOption>('Helvetica');
  const [headerTitle, setHeaderTitle] = useState<string>('Toolsbar Professional Document');
  const [footerText, setFooterText] = useState<string>('Confidential & Proprietary');
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);

  // Settings Panel Toggle
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Source Text Editor Modal (for bulk paste / 17-page test / raw text input)
  const [isTextModalOpen, setIsTextModalOpen] = useState<boolean>(false);
  const [modalRawText, setModalRawText] = useState<string>('');

  // Status State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Canonical Document State (Pure single-source-of-truth)
  const [canonicalDoc, setCanonicalDoc] = useState<CanonicalDocument>(() =>
    parsePlainTextToCanonical(STANDARD_SAMPLE_TEXT, 'Helvetica', 12)
  );

  // Undo & Redo History Stacks
  const [undoStack, setUndoStack] = useState<CanonicalDocument[]>([]);
  const [redoStack, setRedoStack] = useState<CanonicalDocument[]>([]);

  // Active toolbar selection state
  const [currentBlockType, setCurrentBlockType] = useState<BlockType>('p');
  const [currentAlign, setCurrentAlign] = useState<TextAlignOption>('left');
  const [currentFontFamily, setCurrentFontFamily] = useState<FontFamilyOption>('Helvetica');
  const [currentFontSize, setCurrentFontSize] = useState<number>(12);

  // Stored selections for toolbar operations
  const lastSelectionRef = useRef<CanonicalSelection | null>(null);
  const lastActiveBlockIdRef = useRef<string | null>(null);
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [deskWidth, setDeskWidth] = useState<number>(800);

  // Track desk width for responsive scaling on mobile
  useEffect(() => {
    const updateDeskWidth = () => {
      if (deskContainerRef.current) {
        setDeskWidth(deskContainerRef.current.clientWidth);
      }
    };
    updateDeskWidth();
    window.addEventListener('resize', updateDeskWidth);
    return () => window.removeEventListener('resize', updateDeskWidth);
  }, []);

  // Update canonical doc with history tracking
  const updateDocWithHistory = useCallback((newDoc: CanonicalDocument) => {
    setCanonicalDoc((prevDoc) => {
      setUndoStack((prev) => [...prev.slice(-25), prevDoc]);
      setRedoStack([]);
      return newDoc;
    });
  }, []);

  // Undo & Redo Handlers
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, canonicalDoc]);
    setCanonicalDoc(previous);
  }, [undoStack, canonicalDoc]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, canonicalDoc]);
    setCanonicalDoc(next);
  }, [redoStack, canonicalDoc]);

  // Calculate paper dimensions and mathematical pagination
  const dimensions = useMemo(() => {
    return calculateDimensions(pageSize, orientation, margin, headerTitle, footerText, includePageNumbers);
  }, [pageSize, orientation, margin, headerTitle, footerText, includePageNumbers]);

  const paginatedDoc = useMemo(() => {
    return paginateDocument(canonicalDoc, dimensions, lineSpacing, defaultFontSize, defaultFontFamily);
  }, [canonicalDoc, dimensions, lineSpacing, defaultFontSize, defaultFontFamily]);

  // Document Statistics
  const docStats = useMemo(() => {
    const stats = countCanonicalStats(canonicalDoc);
    return {
      words: stats.words,
      chars: stats.chars,
      pages: Math.max(1, paginatedDoc.totalPages),
    };
  }, [canonicalDoc, paginatedDoc]);

  // Capture user selection across the document pages
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);

    const desk = deskContainerRef.current;
    if (!desk || !desk.contains(range.commonAncestorContainer)) return;

    let startNode: Node | null = range.startContainer;
    let startSpanEl = (
      startNode.nodeType === Node.ELEMENT_NODE
        ? (startNode as HTMLElement)
        : startNode.parentElement
    )?.closest('[data-span-id]') as HTMLElement | null;

    let endNode: Node | null = range.endContainer;
    let endSpanEl = (
      endNode.nodeType === Node.ELEMENT_NODE
        ? (endNode as HTMLElement)
        : endNode.parentElement
    )?.closest('[data-span-id]') as HTMLElement | null;

    if (startSpanEl && endSpanEl) {
      const startSpanId = startSpanEl.getAttribute('data-span-id');
      const startBlockId = startSpanEl.getAttribute('data-block-id');
      const endSpanId = endSpanEl.getAttribute('data-span-id');
      const endBlockId = endSpanEl.getAttribute('data-block-id');

      if (startSpanId && startBlockId && endSpanId && endBlockId) {
        lastSelectionRef.current = {
          startBlockId,
          startSpanId,
          startOffset: range.startOffset,
          endBlockId,
          endSpanId,
          endOffset: range.endOffset,
        };
        lastActiveBlockIdRef.current = startBlockId;

        // Sync toolbar indicators from start block
        const targetBlock = canonicalDoc.blocks.find((b) => b.id === startBlockId);
        if (targetBlock) {
          setCurrentBlockType(targetBlock.type);
          setCurrentAlign(targetBlock.align);
          const targetSpan = targetBlock.spans.find((s) => s.id === startSpanId);
          if (targetSpan) {
            setCurrentFontFamily(targetSpan.fontFamily);
            setCurrentFontSize(targetSpan.fontSizePt);
          }
        }
      }
    }
  }, [canonicalDoc]);

  // Attach selection listeners
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Toolbar Format Handlers
  const handleApplyStyle = useCallback(
    (options: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      colorHex?: string;
      bgColorHex?: string | null;
      fontFamily?: FontFamilyOption;
      fontSizePt?: number;
    }) => {
      const sel = lastSelectionRef.current;
      if (sel) {
        const newDoc = applyStyleToCanonicalDoc(canonicalDoc, sel, options);
        updateDocWithHistory(newDoc);
      } else if (lastActiveBlockIdRef.current) {
        // Apply to entire active block if no range selected
        const block = canonicalDoc.blocks.find((b) => b.id === lastActiveBlockIdRef.current);
        if (block && block.spans.length > 0) {
          const fakeSel: CanonicalSelection = {
            startBlockId: block.id,
            startSpanId: block.spans[0].id,
            startOffset: 0,
            endBlockId: block.id,
            endSpanId: block.spans[block.spans.length - 1].id,
            endOffset: block.spans[block.spans.length - 1].text.length,
          };
          const newDoc = applyStyleToCanonicalDoc(canonicalDoc, fakeSel, options);
          updateDocWithHistory(newDoc);
        }
      }

      if (options.fontFamily) setCurrentFontFamily(options.fontFamily);
      if (options.fontSizePt) setCurrentFontSize(options.fontSizePt);
    },
    [canonicalDoc, updateDocWithHistory]
  );

  const handleApplyBlockType = useCallback(
    (type: BlockType) => {
      const sel = lastSelectionRef.current;
      let targetBlockIds: string[] = [];

      if (sel) {
        targetBlockIds = [sel.startBlockId, sel.endBlockId];
      } else if (lastActiveBlockIdRef.current) {
        targetBlockIds = [lastActiveBlockIdRef.current];
      } else if (canonicalDoc.blocks.length > 0) {
        targetBlockIds = [canonicalDoc.blocks[0].id];
      }

      if (targetBlockIds.length > 0) {
        const newDoc = applyBlockTypeToCanonicalDoc(
          canonicalDoc,
          targetBlockIds,
          type,
          defaultFontFamily,
          defaultFontSize
        );
        updateDocWithHistory(newDoc);
        setCurrentBlockType(type);
      }
    },
    [canonicalDoc, defaultFontFamily, defaultFontSize, updateDocWithHistory]
  );

  const handleApplyAlign = useCallback(
    (align: TextAlignOption) => {
      const sel = lastSelectionRef.current;
      let targetBlockIds: string[] = [];

      if (sel) {
        targetBlockIds = [sel.startBlockId, sel.endBlockId];
      } else if (lastActiveBlockIdRef.current) {
        targetBlockIds = [lastActiveBlockIdRef.current];
      } else if (canonicalDoc.blocks.length > 0) {
        targetBlockIds = [canonicalDoc.blocks[0].id];
      }

      if (targetBlockIds.length > 0) {
        const newDoc = applyAlignToCanonicalDoc(canonicalDoc, targetBlockIds, align);
        updateDocWithHistory(newDoc);
        setCurrentAlign(align);
      }
    },
    [canonicalDoc, updateDocWithHistory]
  );

  const handleInsertPageBreak = useCallback(() => {
    const targetBlockId = lastActiveBlockIdRef.current || canonicalDoc.blocks[canonicalDoc.blocks.length - 1]?.id;
    const newDoc = insertPageBreakToCanonicalDoc(canonicalDoc, targetBlockId);
    updateDocWithHistory(newDoc);
  }, [canonicalDoc, updateDocWithHistory]);

  const handleInsertHr = useCallback(() => {
    const targetBlockId = lastActiveBlockIdRef.current || canonicalDoc.blocks[canonicalDoc.blocks.length - 1]?.id;
    const newDoc = insertHrToCanonicalDoc(canonicalDoc, targetBlockId);
    updateDocWithHistory(newDoc);
  }, [canonicalDoc, updateDocWithHistory]);

  const handleClearFormatting = useCallback(() => {
    const sel = lastSelectionRef.current;
    if (sel) {
      const newDoc = clearFormattingFromCanonicalDoc(
        canonicalDoc,
        sel,
        defaultFontFamily,
        defaultFontSize
      );
      updateDocWithHistory(newDoc);
    }
  }, [canonicalDoc, defaultFontFamily, defaultFontSize, updateDocWithHistory]);

  // Block Content Editing Handler (When user edits directly on the page)
  const handleBlockContentChange = useCallback(
    (blockId: string, newText: string) => {
      const block = canonicalDoc.blocks.find((b) => b.id === blockId);
      if (!block) return;
      const currentText = block.spans.map((s) => s.text).join('');
      if (currentText === newText) return;

      const newDoc = updateBlockTextInCanonicalDoc(
        canonicalDoc,
        blockId,
        newText,
        defaultFontFamily,
        defaultFontSize
      );
      updateDocWithHistory(newDoc);
    },
    [canonicalDoc, defaultFontFamily, defaultFontSize, updateDocWithHistory]
  );

  // Download PDF Action
  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await generatePdfBlob(
        paginatedDoc,
        headerTitle,
        footerText,
        includePageNumbers
      );
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${
        headerTitle.trim() ? headerTitle.replace(/[^a-zA-Z0-9_-]/g, '_') : 'document'
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Load Standard Sample
  const handleLoadSample = () => {
    const newDoc = parsePlainTextToCanonical(STANDARD_SAMPLE_TEXT, defaultFontFamily, defaultFontSize);
    updateDocWithHistory(newDoc);
  };

  // Clear Document to 1 Blank Page
  const handleClearDocument = () => {
    const newDoc = parsePlainTextToCanonical('', defaultFontFamily, defaultFontSize);
    updateDocWithHistory(newDoc);
  };

  // Open Raw Text Modal
  const handleOpenTextModal = () => {
    // Generate readable markdown-like plain text from canonicalDoc
    const textLines: string[] = [];
    for (const block of canonicalDoc.blocks) {
      if (block.type === 'page-break') {
        textLines.push('<<<PAGE_BREAK>>>');
        continue;
      }
      if (block.type === 'hr') {
        textLines.push('---');
        continue;
      }
      const prefix =
        block.type === 'h1'
          ? '# '
          : block.type === 'h2'
          ? '## '
          : block.type === 'h3'
          ? '### '
          : block.type === 'bullet'
          ? '- '
          : block.type === 'number'
          ? `${block.listIndex || 1}. `
          : '';
      const text = block.spans.map((s) => s.text).join('');
      textLines.push(`${prefix}${text}`);
    }
    setModalRawText(textLines.join('\n'));
    setIsTextModalOpen(true);
  };

  // Apply Modal Text to Document
  const handleApplyModalText = () => {
    const newDoc = parsePlainTextToCanonical(modalRawText, defaultFontFamily, defaultFontSize);
    updateDocWithHistory(newDoc);
    setIsTextModalOpen(false);
  };

  // Load 17-Page Test Document inside modal
  const handleLoad17PageTest = () => {
    const testDocText = generateSeventeenPageDoc();
    setModalRawText(testDocText);
  };

  // Scale calculations for rendering
  const scalePtToPx = 1.12;
  const unscaledPageWidthPx = Math.round(dimensions.pageWidthPt * scalePtToPx);
  const unscaledPageHeightPx = Math.round(dimensions.pageHeightPt * scalePtToPx);
  const unscaledContentHeightPx = Math.round(dimensions.contentHeightPt * scalePtToPx);

  // Responsive scale factor for mobile viewports
  const scaleFactor = deskWidth > 0 && deskWidth < unscaledPageWidthPx + 32
    ? Math.max(0.4, (deskWidth - 32) / unscaledPageWidthPx)
    : 1.0;

  const scaledContainerWidthPx = Math.round(unscaledPageWidthPx * scaleFactor);
  const scaledContainerHeightPx = Math.round(unscaledPageHeightPx * scaleFactor);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner with Toolsbar Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>True WYSIWYG Document Editor Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Text to PDF Studio
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Format typography, colors, and highlights seamlessly in an authentic multi-page layout. What you see
              on every physical paper sheet compiles identically into your vector PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenTextModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit / Paste Text</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                isSettingsOpen
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Page Setup</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Page Setup Drawer */}
        {isSettingsOpen && (
          <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Page Size & Orientation */}
            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Format & Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="a4">A4 (210×297mm)</option>
                  <option value="letter">US Letter (8.5×11")</option>
                  <option value="legal">US Legal (8.5×14")</option>
                </select>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as PageOrientationOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            {/* Margins & Line Spacing */}
            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Margins & Spacing</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as MarginOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="compact">Narrow (0.5")</option>
                  <option value="standard">Normal (0.75")</option>
                  <option value="wide">Wide (1.0")</option>
                </select>
                <select
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(parseFloat(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="1.0">1.0 Single</option>
                  <option value="1.15">1.15 Tight</option>
                  <option value="1.4">1.4 Normal</option>
                  <option value="1.5">1.5 Relaxed</option>
                  <option value="2.0">2.0 Double</option>
                </select>
              </div>
            </div>

            {/* Running Header */}
            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Running Header</label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                placeholder="Optional header text..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            {/* Running Footer & Page Numbers */}
            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Footer & Numbers</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-normal text-[11px] text-indigo-600 dark:text-indigo-400">
                  <input
                    type="checkbox"
                    checked={includePageNumbers}
                    onChange={(e) => setIncludePageNumbers(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span>Page numbers</span>
                </label>
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Optional footer text..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Rich-Text Toolbar */}
      <div className="sticky top-4 z-40">
        <Toolbar
          onApplyStyle={handleApplyStyle}
          onApplyBlockType={handleApplyBlockType}
          onApplyAlign={handleApplyAlign}
          onInsertPageBreak={handleInsertPageBreak}
          onInsertHr={handleInsertHr}
          onClearFormatting={handleClearFormatting}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          currentFontFamily={currentFontFamily}
          currentFontSize={currentFontSize}
          currentBlockType={currentBlockType}
          currentAlign={currentAlign}
        />
      </div>

      {/* Auxiliary Action Bar & Document Statistics */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {docStats.pages} {docStats.pages === 1 ? 'Page' : 'Pages'}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div>{docStats.words.toLocaleString()} words</div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div>{docStats.chars.toLocaleString()} characters</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={handleClearDocument}
            className="px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Vector PDF generated successfully! All {docStats.pages} pages with typography, highlights, and formatting are saved.
          </span>
        </div>
      )}

      {/* THE WYSIWYG DOCUMENT CANVAS DESK: RENDERS GENUINE, INDIVIDUAL PHYSICAL PAPER SHEETS */}
      <div
        id="document-pages-desk"
        ref={deskContainerRef}
        className="relative rounded-2xl bg-slate-200/90 dark:bg-[#0b0e17] border border-slate-300/80 dark:border-slate-800/80 shadow-inner p-4 sm:p-8 md:p-12 flex flex-col items-center min-h-[750px] space-y-8 overflow-y-auto"
      >
        {paginatedDoc.pages.map((page) => (
          <div
            key={`page-container-${page.pageNumber}`}
            className="page-wrapper relative flex justify-center shrink-0"
            style={{
              width: `${scaledContainerWidthPx}px`,
              height: `${scaledContainerHeightPx}px`,
            }}
          >
            <div
              id={`paper-sheet-${page.pageNumber}`}
              className="paper-sheet absolute top-0 left-0 bg-white text-slate-900 border border-slate-300/90 shadow-2xl rounded-[2px] transition-all overflow-hidden select-text"
              style={{
                width: `${unscaledPageWidthPx}px`,
                height: `${unscaledPageHeightPx}px`,
                transform: scaleFactor < 1.0 ? `scale(${scaleFactor})` : undefined,
                transformOrigin: 'top left',
                paddingLeft: `${Math.round(dimensions.marginPt * scalePtToPx)}px`,
                paddingRight: `${Math.round(dimensions.marginPt * scalePtToPx)}px`,
                paddingTop: `${Math.round(dimensions.topMarginPt * scalePtToPx)}px`,
                paddingBottom: `${Math.round(dimensions.bottomMarginPt * scalePtToPx)}px`,
                fontFamily:
                  defaultFontFamily === 'TimesRoman'
                    ? '"Times New Roman", Times, serif'
                    : defaultFontFamily === 'Courier'
                    ? 'Courier, monospace'
                    : 'Helvetica, Arial, sans-serif',
              }}
            >
              {/* Authentic Page Running Header */}
              {headerTitle.trim() && (
                <div className="absolute top-3 left-6 right-6 flex justify-between items-center border-b border-slate-200 pb-1.5 text-[11px] text-slate-400 font-sans select-none">
                  <span className="truncate max-w-[70%]">{headerTitle}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 shrink-0">
                    {pageSize.toUpperCase()} • {orientation}
                  </span>
                </div>
              )}

              {/* Exact Fixed-Height Content Area */}
              <div
                className="page-content-area w-full overflow-hidden"
                style={{
                  height: `${unscaledContentHeightPx}px`,
                  lineHeight: lineSpacing,
                }}
              >
                {page.blockSlices.length === 0 ? (
                  <div
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onFocus={() => {
                      lastActiveBlockIdRef.current = canonicalDoc.blocks[0]?.id || null;
                    }}
                    onBlur={(e) => {
                      if (canonicalDoc.blocks[0]) {
                        handleBlockContentChange(canonicalDoc.blocks[0].id, e.currentTarget.innerText);
                      }
                    }}
                    className="w-full min-h-[30px] outline-none text-slate-400 italic text-sm"
                  >
                    Click here to start typing...
                  </div>
                ) : (
                  page.blockSlices.map((slice, sIdx) => (
                    <div
                      key={`slice-${slice.blockId}-${sIdx}`}
                      data-block-id={slice.blockId}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onFocus={() => {
                        lastActiveBlockIdRef.current = slice.blockId;
                      }}
                      onBlur={(e) => {
                        handleBlockContentChange(slice.blockId, e.currentTarget.innerText);
                      }}
                      className={`page-block-slice outline-none relative transition-colors focus:ring-1 focus:ring-indigo-300 rounded-[2px] ${
                        slice.type === 'h1'
                          ? 'text-2xl font-bold mt-4 mb-2 text-slate-900'
                          : slice.type === 'h2'
                          ? 'text-xl font-bold mt-3 mb-1.5 text-slate-800'
                          : slice.type === 'h3'
                          ? 'text-lg font-semibold mt-2.5 mb-1 text-slate-800'
                          : slice.type === 'bullet'
                          ? 'my-1 pl-5 relative'
                          : slice.type === 'number'
                          ? 'my-1 pl-5 relative'
                          : 'my-1 text-slate-800'
                      }`}
                      style={{
                        textAlign: slice.align,
                      }}
                    >
                      {slice.type === 'hr' ? (
                        <hr className="my-2 border-t border-slate-300 pointer-events-none" />
                      ) : (
                        slice.lines.map((line, lIdx) => (
                          <div
                            key={`line-${lIdx}`}
                            className="page-line relative flex flex-wrap items-baseline"
                            style={{
                              lineHeight: `${Math.round(line.lineHeightPt * scalePtToPx)}px`,
                              justifyContent:
                                slice.align === 'center'
                                  ? 'center'
                                  : slice.align === 'right'
                                  ? 'flex-end'
                                  : 'flex-start',
                            }}
                          >
                            {line.listMarker && (
                              <span className="inline-block w-4 -ml-4 select-none font-medium text-slate-500">
                                {line.listMarker}
                              </span>
                            )}
                            {line.spans.map((span) => (
                              <span
                                key={span.id}
                                data-span-id={span.id}
                                data-block-id={slice.blockId}
                                style={{
                                  fontFamily:
                                    span.fontFamily === 'TimesRoman'
                                      ? '"Times New Roman", Times, serif'
                                      : span.fontFamily === 'Courier'
                                      ? 'Courier, monospace'
                                      : 'Helvetica, Arial, sans-serif',
                                  fontSize: `${Math.round(span.fontSizePt * scalePtToPx)}px`,
                                  fontWeight: span.bold ? 700 : 400,
                                  fontStyle: span.italic ? 'italic' : 'normal',
                                  textDecoration: span.underline ? 'underline' : 'none',
                                  color: span.colorHex || '#0f172a',
                                  backgroundColor:
                                    span.bgColorHex && span.bgColorHex !== 'transparent'
                                      ? span.bgColorHex
                                      : undefined,
                                  borderRadius:
                                    span.bgColorHex && span.bgColorHex !== 'transparent'
                                      ? '2px'
                                      : undefined,
                                  padding:
                                    span.bgColorHex && span.bgColorHex !== 'transparent'
                                      ? '0 1px'
                                      : undefined,
                                }}
                              >
                                {span.text}
                              </span>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Authentic Page Running Footer & Page Number */}
              {(footerText.trim() || includePageNumbers) && (
                <div className="absolute bottom-3 left-6 right-6 flex justify-between items-center border-t border-slate-200 pt-1.5 text-[11px] text-slate-400 font-sans select-none">
                  <span className="truncate max-w-[70%]">{footerText}</span>
                  {includePageNumbers && (
                    <span className="font-medium text-slate-500 shrink-0">
                      Page {page.pageNumber} of {paginatedDoc.totalPages}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Text Editor & 17-Page Test Modal */}
      {isTextModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Document Text Editor & Bulk Paste
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paste full articles, markdown, or load the 17-page test document.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTextModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  Syntax: # for H1, ## for H2, - for bullet, 1. for number, &lt;&lt;&lt;PAGE_BREAK&gt;&gt;&gt; for page break
                </span>
                <button
                  type="button"
                  onClick={handleLoad17PageTest}
                  className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-medium transition-colors"
                >
                  Load 17-Page Stress Test Text
                </button>
              </div>

              <textarea
                value={modalRawText}
                onChange={(e) => setModalRawText(e.target.value)}
                placeholder="Paste or write your document text here..."
                rows={18}
                className="w-full font-mono text-xs p-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {modalRawText.trim().split(/\s+/).filter(Boolean).length} words • {modalRawText.length} characters
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTextModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyModalText}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
                >
                  Apply to Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Privacy Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>100% Client-Side Privacy:</strong> All text, typography measurements, and vector PDF compilation
            execute strictly inside your browser sandbox. No data is ever transmitted to external servers.
          </span>
        </div>
      </div>
    </div>
  );
};
