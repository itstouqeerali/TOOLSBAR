import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Download,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from './textToPdf/extensions/FontSize';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { PageBreak } from './textToPdf/extensions/PageBreak';
import {
  VisualPagination,
  visualPaginationPluginKey,
} from './textToPdf/extensions/VisualPagination';

import {
  PageSizeOption,
  PageOrientationOption,
  MarginOption,
  FontFamilyOption,
} from './textToPdf/types';
import { calculateDimensions, paginateDocument } from './textToPdf/paginator';
import { generatePdfBlob } from './textToPdf/pdfGenerator';
import { EditorToolbar } from './textToPdf/EditorToolbar';
import { tiptapToCanonical } from './textToPdf/tiptapToCanonical';
import { STANDARD_SAMPLE_TEXT, STANDARD_SAMPLE_HTML } from './textToPdf/sampleData';

export const TextToPdf: React.FC = () => {
  // Page Configuration State (empty header & footer by default as required)
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<PageOrientationOption>('portrait');
  const [margin, setMargin] = useState<MarginOption>('standard');
  const [lineSpacing, setLineSpacing] = useState<number>(1.4);
  const [defaultFontSize, setDefaultFontSize] = useState<number>(12);
  const [defaultFontFamily, setDefaultFontFamily] = useState<FontFamilyOption>('Helvetica');
  const [headerTitle, setHeaderTitle] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('');
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);

  // Settings Panel Toggle
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Status State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Editor Stats & Pagination Navigation State
  const [wordCount, setWordCount] = useState<number>(() => {
    return STANDARD_SAMPLE_TEXT.trim().split(/\s+/).filter(Boolean).length;
  });
  const [charCount, setCharCount] = useState<number>(() => {
    return STANDARD_SAMPLE_TEXT.length;
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activePageIndex, setActivePageIndex] = useState<number>(1);
  const [pageInputVal, setPageInputVal] = useState<string>('1');

  // Mount tracking ref to prevent state updates before mounting or after unmounting
  const isMountedRef = useRef<boolean>(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // DOM Refs
  const workspaceRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Calculate Paper Dimensions
  const dimensions = useMemo(() => {
    return calculateDimensions(
      pageSize,
      orientation,
      margin,
      headerTitle,
      footerText,
      includePageNumbers
    );
  }, [pageSize, orientation, margin, headerTitle, footerText, includePageNumbers]);

  // Physical paper dimensions in screen pixels (standard 96 DPI: 1 pt = 4/3 px)
  const ptToPx = 96 / 72;
  const PAGE_GAP_PX = 36;
  const pageWidthPx = Math.round(dimensions.pageWidthPt * ptToPx);
  const pageHeightPx = Math.round(dimensions.pageHeightPt * ptToPx);
  const marginPx = Math.round(dimensions.marginPt * ptToPx);
  const topMarginPx = Math.round(dimensions.topMarginPt * ptToPx);
  const bottomMarginPx = Math.round(dimensions.bottomMarginPt * ptToPx);
  const headerHeightPx = Math.round(dimensions.headerHeightPt * ptToPx);
  const footerHeightPx = Math.round(dimensions.footerHeightPt * ptToPx);
  const totalLogicalHeight =
    totalPages * pageHeightPx + Math.max(0, totalPages - 1) * PAGE_GAP_PX;

  // Responsive visual scaling for mobile/tablet fit
  // Measures workspace container and computes visual scale:
  // scale = min(1, availableWorkspaceWidth / logicalPageWidth)
  const [workspaceWidth, setWorkspaceWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024;
  });

  useEffect(() => {
    if (!workspaceRef.current) return;
    const el = workspaceRef.current;
    const updateWidth = () => {
      if (el) {
        setWorkspaceWidth(el.clientWidth);
      }
    };
    updateWidth();

    const ro = new ResizeObserver(() => {
      updateWidth();
    });
    ro.observe(el);

    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Safe horizontal padding inside workspace: 24px (12px on each side)
  const safeHorizontalPadding = 24;
  const availableWorkspaceWidth = Math.max(100, (workspaceWidth || 1024) - safeHorizontalPadding);
  const visualScale = Math.min(1, availableWorkspaceWidth / pageWidthPx);

  // Single Canonical Tiptap Editor Initialization
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start typing or paste text here…',
        emptyEditorClass: 'is-editor-empty',
      }),
      PageBreak,
      VisualPagination.configure({
        pageSize,
        orientation,
        margin,
        fontFamily: defaultFontFamily,
        fontSize: defaultFontSize,
        lineSpacing,
        headerTitle,
        footerText,
        includePageNumbers,
        onTotalPagesChange: (count: number) => {
          if (!isMountedRef.current) return;
          const safeCount = Math.max(1, count);
          setTotalPages((prev) => (prev !== safeCount ? safeCount : prev));
        },
      }),
    ],
    content: STANDARD_SAMPLE_HTML,
    onCreate: ({ editor }) => {
      if (!isMountedRef.current) return;
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
    onUpdate: ({ editor }) => {
      if (!isMountedRef.current) return;
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
    editorProps: {
      handleDOMEvents: {
        dragstart: (_view, event) => {
          // Disable unintended block-dragging so mouse selection always selects text
          event.preventDefault();
          return true;
        },
      },
      attributes: {
        class:
          'focus:outline-none text-slate-900 leading-relaxed min-h-[700px] w-full cursor-text select-text',
      },
    },
  });

  // Sync initial word/char counts when editor is ready
  useEffect(() => {
    if (!editor || editor.isDestroyed || !isMountedRef.current) return;
    const text = editor.getText();
    setCharCount(text.length);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  }, [editor]);

  // Keep VisualPagination extension in sync with page setup options
  useEffect(() => {
    if (!editor || editor.isDestroyed || !isMountedRef.current) return;
    editor.view.dispatch(
      editor.state.tr.setMeta(visualPaginationPluginKey, {
        pageSize,
        orientation,
        margin,
        fontFamily: defaultFontFamily,
        fontSize: defaultFontSize,
        lineSpacing,
        headerTitle,
        footerText,
        includePageNumbers,
        onTotalPagesChange: (count: number) => {
          if (!isMountedRef.current) return;
          const safeCount = Math.max(1, count);
          setTotalPages((prev) => (prev !== safeCount ? safeCount : prev));
        },
      })
    );
  }, [
    editor,
    pageSize,
    orientation,
    margin,
    defaultFontFamily,
    defaultFontSize,
    lineSpacing,
    headerTitle,
    footerText,
    includePageNumbers,
  ]);

  // Keep page input string in sync with active page
  useEffect(() => {
    setPageInputVal(String(activePageIndex));
  }, [activePageIndex]);

  // Ensure that every piece of user content is covered by a page (no orphan content)
  useEffect(() => {
    if (!editorContainerRef.current) return;
    const el = editorContainerRef.current;

    const checkDomOverflow = () => {
      if (!el || !isMountedRef.current) return;
      const actualHeight = el.scrollHeight || el.offsetHeight;
      if (actualHeight > 0 && pageHeightPx > 0) {
        const singlePagePitch = pageHeightPx + PAGE_GAP_PX;
        const requiredPages = Math.max(1, Math.ceil((actualHeight + PAGE_GAP_PX) / singlePagePitch));
        setTotalPages((prev) => Math.max(prev, requiredPages));
      }
    };

    checkDomOverflow();
    const ro = new ResizeObserver(checkDomOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageHeightPx, PAGE_GAP_PX, editor]);

  // Jump to specific page inside the dedicated workspace scroll container
  const handleJumpToPage = useCallback(
    (targetPage: number) => {
      if (!workspaceRef.current) return;
      const clamped = Math.max(1, Math.min(totalPages, targetPage));
      setActivePageIndex(clamped);

      const scaledPitch = (pageHeightPx + PAGE_GAP_PX) * visualScale;
      workspaceRef.current.scrollTo({
        top: (clamped - 1) * scaledPitch,
        behavior: 'smooth',
      });
    },
    [totalPages, pageHeightPx, visualScale]
  );

  // Scroll listener on workspace container to track active page
  const handleWorkspaceScroll = useCallback(() => {
    if (!workspaceRef.current) return;
    const scrollTop = workspaceRef.current.scrollTop;
    const scaledPitch = (pageHeightPx + PAGE_GAP_PX) * visualScale;
    const currentPage = Math.min(
      totalPages,
      Math.max(1, Math.floor((scrollTop + (pageHeightPx * visualScale) * 0.3) / scaledPitch) + 1)
    );
    setActivePageIndex(currentPage);
  }, [totalPages, pageHeightPx, visualScale]);

  // Download Vector PDF Action
  const handleDownloadPdf = async () => {
    if (!editor) return;
    try {
      setIsGenerating(true);

      // Extract Tiptap JSON and convert to Canonical Document for PDF Generator
      const json = editor.getJSON();
      const canonicalDoc = tiptapToCanonical(json, defaultFontFamily, defaultFontSize);

      // Slices and layout with exact vector coordinates
      const paginatedDoc = paginateDocument(
        canonicalDoc,
        dimensions,
        lineSpacing,
        defaultFontSize,
        defaultFontFamily
      );

      const pdfBlob = await generatePdfBlob(
        paginatedDoc,
        headerTitle,
        footerText,
        includePageNumbers
      );

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFilename = headerTitle.trim()
        ? headerTitle.replace(/[^a-zA-Z0-9_-]/g, '_')
        : 'document';
      a.download = `${cleanFilename}.pdf`;
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

  const handleLoadSample = () => {
    if (editor) {
      editor.commands.setContent(STANDARD_SAMPLE_HTML);
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    }
  };

  // Font family css class helper
  const getFontFamilyStyle = () => {
    switch (defaultFontFamily) {
      case 'TimesRoman':
        return '"Times New Roman", Times, serif';
      case 'Courier':
        return 'Courier, monospace';
      default:
        return 'Helvetica, Arial, sans-serif';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-1 sm:px-2 pb-16">
      <style>{`
        .tiptap {
          outline: none;
          min-height: 700px;
          user-select: text;
          -webkit-user-select: text;
        }
        .tiptap p.is-editor-empty:first-child::before,
        .tiptap.is-editor-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .tiptap h1 { font-size: 1.875rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.75rem; line-height: 1.2; }
        .tiptap h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; line-height: 1.3; }
        .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.5rem; line-height: 1.4; }
        .tiptap p { margin-bottom: 0.65rem; }
        .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .tiptap li { margin-bottom: 0.25rem; }
        .tiptap hr { border: none; border-top: 1px solid #cbd5e1; margin: 1.25rem 0; }
        .tiptap blockquote { border-left: 3px solid #6366f1; padding-left: 1rem; font-style: italic; color: #475569; margin: 0.75rem 0; }
        .visual-page-break-spacer {
          display: block;
          width: 100%;
          user-select: none !important;
          -webkit-user-select: none !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* Top Tool Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-xl p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WYSIWYG Document Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Text to PDF
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Type or paste directly on the document canvas below. Format with the persistent toolbar and export true vector PDF documents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                isSettingsOpen
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Page Setup</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Page Setup Drawer / Collapsible Panel */}
        {isSettingsOpen && (
          <div className="mt-5 pt-5 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Format & Orientation */}
            <div className="space-y-2 bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Format & Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="a4">A4 (210×297mm)</option>
                  <option value="letter">US Letter (8.5×11")</option>
                  <option value="legal">US Legal (8.5×14")</option>
                </select>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as PageOrientationOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            {/* Margins & Line Spacing */}
            <div className="space-y-2 bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Margins & Spacing</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as MarginOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="compact">Narrow (0.5")</option>
                  <option value="standard">Normal (0.75")</option>
                  <option value="wide">Wide (1.0")</option>
                </select>
                <select
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(parseFloat(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="1.0">1.0 Single</option>
                  <option value="1.15">1.15 Tight</option>
                  <option value="1.4">1.4 Normal</option>
                  <option value="2.0">2.0 Double</option>
                </select>
              </div>
            </div>

            {/* Document Base Font */}
            <div className="space-y-2 bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Base Typography</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={defaultFontFamily}
                  onChange={(e) => setDefaultFontFamily(e.target.value as FontFamilyOption)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Helvetica">Helvetica (Sans)</option>
                  <option value="TimesRoman">Times (Serif)</option>
                  <option value="Courier">Courier (Mono)</option>
                </select>
                <select
                  value={defaultFontSize}
                  onChange={(e) => setDefaultFontSize(parseInt(e.target.value, 10))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="10">10pt</option>
                  <option value="11">11pt</option>
                  <option value="12">12pt Base</option>
                  <option value="14">14pt Large</option>
                </select>
              </div>
            </div>

            {/* Running Header & Footer */}
            <div className="space-y-2 bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Header & Footer</label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-indigo-600 dark:text-indigo-400 text-[11px]">
                  <input
                    type="checkbox"
                    checked={includePageNumbers}
                    onChange={(e) => setIncludePageNumbers(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Page Numbers</span>
                </label>
              </div>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                placeholder="Optional header text..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 mb-1"
              />
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Optional footer text..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Quick Template loader helper */}
            <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Settings apply directly to PDF export without altering document text.</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <FileText className="w-3 h-3" />
                <span>Load Sample Template</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Vector PDF generated and downloaded successfully!</span>
        </div>
      )}

      {/* PERSISTENT DOCKED FORMATTING TOOLBAR (Sits outside scroll area) */}
      <div className="shadow-lg rounded-2xl">
        <EditorToolbar
          editor={editor}
          lineSpacing={lineSpacing}
          onLineSpacingChange={setLineSpacing}
        />
      </div>

      {/* DOCUMENT WORKSPACE HEADER & PAGE NAVIGATION BAR (Sits outside scroll area) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs text-slate-600 dark:text-slate-400 select-none">
        {/* Compact Page Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleJumpToPage(activePageIndex - 1)}
              disabled={activePageIndex <= 1}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1.5 text-xs">
              <span className="text-slate-400 font-medium">Page</span>
              <input
                type="text"
                value={pageInputVal}
                onChange={(e) => setPageInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const parsed = parseInt(pageInputVal, 10);
                    if (!isNaN(parsed)) handleJumpToPage(parsed);
                  }
                }}
                onBlur={() => {
                  const parsed = parseInt(pageInputVal, 10);
                  if (!isNaN(parsed)) handleJumpToPage(parsed);
                  else setPageInputVal(String(activePageIndex));
                }}
                className="w-8 text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-slate-400 font-medium">of {totalPages}</span>
            </div>

            <button
              type="button"
              onClick={() => handleJumpToPage(activePageIndex + 1)}
              disabled={activePageIndex >= totalPages}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready</span>
          </div>
        </div>

        {/* Document Stats & Metadata */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {wordCount.toLocaleString()}
            </span>{' '}
            words
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {charCount.toLocaleString()}
            </span>{' '}
            chars
          </div>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
          <div className="hidden md:inline text-slate-500 uppercase font-mono tracking-wider">
            {pageSize.toUpperCase()} • {orientation} • {margin}
          </div>
        </div>
      </div>

      {/* DEDICATED FIXED DOCUMENT WORKSPACE (65vh-75vh, internal scroll ONLY) */}
      <div
        id="document-workspace"
        ref={workspaceRef}
        onScroll={handleWorkspaceScroll}
        className="w-full h-[62vh] sm:h-[72vh] min-h-[480px] overflow-y-auto overflow-x-hidden rounded-2xl bg-slate-300/75 dark:bg-[#070a10] border border-slate-300/80 dark:border-slate-800 shadow-inner p-3 sm:p-8 flex flex-col items-center select-none"
      >
        {/* page-shell: Outer wrapper that reserves exactly the scaled dimensions in the layout */}
        <div
          className="page-shell relative mx-auto transition-all"
          style={{
            width: `${Math.round(pageWidthPx * visualScale)}px`,
            height: `${Math.round(totalLogicalHeight * visualScale)}px`,
            maxWidth: '100%',
          }}
        >
          {/* scaled-page-wrapper: Visually scales the logical paper pages uniformly */}
          <div
            className="scaled-page-wrapper origin-top-left"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${pageWidthPx}px`,
              height: `${totalLogicalHeight}px`,
              transform: `scale(${visualScale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* UNDERLAY: Discrete Physical White Paper Sheets */}
            <div className="flex flex-col select-none pointer-events-none">
              {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => (
                <div
                  key={i}
                  id={`page-sheet-${i + 1}`}
                  style={{
                    width: `${pageWidthPx}px`,
                    height: `${pageHeightPx}px`,
                    marginBottom: i < totalPages - 1 ? `${PAGE_GAP_PX}px` : '0px',
                  }}
                  className="bg-white text-slate-900 shadow-2xl border border-slate-200/90 dark:border-slate-700/80 rounded-sm relative flex flex-col justify-between select-none pointer-events-none transition-all"
                >
                  {/* Running Header on Top of Page */}
                  {headerTitle && headerTitle.trim().length > 0 ? (
                    <div
                      style={{
                        height: `${headerHeightPx}px`,
                        paddingLeft: `${marginPx}px`,
                        paddingRight: `${marginPx}px`,
                        paddingTop: `${Math.max(10, Math.round(marginPx * 0.25))}px`,
                      }}
                      className="border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 select-none pointer-events-none"
                    >
                      <span className="font-medium truncate max-w-[80%]">{headerTitle}</span>
                    </div>
                  ) : null}

                  {/* Body Area (whitespace of the page) */}
                  <div className="flex-1" />

                  {/* Running Footer at Bottom of Page */}
                  {(footerText && footerText.trim().length > 0) || includePageNumbers ? (
                    <div
                      style={{
                        height: `${footerHeightPx}px`,
                        paddingLeft: `${marginPx}px`,
                        paddingRight: `${marginPx}px`,
                        paddingBottom: `${Math.max(10, Math.round(marginPx * 0.25))}px`,
                      }}
                      className="border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 select-none pointer-events-none"
                    >
                      <span className="font-medium truncate max-w-[60%]">{footerText || ''}</span>
                      {includePageNumbers && (
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                          Page {i + 1} of {totalPages}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* OVERLAY: Native Tiptap Editor Layer */}
            <div
              ref={editorContainerRef}
              onClick={() => editor?.commands.focus()}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${pageWidthPx}px`,
                fontFamily: getFontFamilyStyle(),
                fontSize: `${defaultFontSize}pt`,
                lineHeight: lineSpacing,
                paddingTop: `${topMarginPx}px`,
                paddingLeft: `${marginPx}px`,
                paddingRight: `${marginPx}px`,
                boxSizing: 'border-box',
              }}
              className="z-10 text-slate-900 cursor-text select-text"
            >
              <EditorContent editor={editor} className="w-full text-slate-900 select-text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
