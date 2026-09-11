import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Download,
  ShieldCheck,
  FileText,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import { PaginationPlus } from 'tiptap-pagination-plus';

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
import { generateSeventeenPageDoc, STANDARD_SAMPLE_TEXT } from './textToPdf/sampleData';

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
  const [isTextModalOpen, setIsTextModalOpen] = useState<boolean>(false);
  const [modalRawText, setModalRawText] = useState<string>('');

  // Status State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Editor Stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  // Calculate Paper Dimensions dynamically
  const dimensions = useMemo(() => {
    return calculateDimensions(pageSize, orientation, margin, headerTitle, footerText, includePageNumbers);
  }, [pageSize, orientation, margin, headerTitle, footerText, includePageNumbers]);
  
  // Tiptap Editor Initialization
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      PaginationPlus.configure({
        enabled: true,
        pageWidth: dimensions.pageWidthPt,
        pageHeight: dimensions.pageHeightPt,
        marginTop: dimensions.topMarginPt,
        marginBottom: dimensions.bottomMarginPt,
        marginLeft: dimensions.marginPt,
        marginRight: dimensions.marginPt,
        pageGap: 32,
      }),
    ],
    content: '<p>Welcome to the professional WYSIWYG document editor.</p>',
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none',
        style: `font-family: ${defaultFontFamily === 'TimesRoman' ? '"Times New Roman", serif' : defaultFontFamily === 'Courier' ? 'Courier, monospace' : 'Helvetica, sans-serif'}; font-size: ${defaultFontSize}pt; line-height: ${lineSpacing};`
      },
    },
  });

  // Sync dimensions to PaginationPlus when settings change
  useEffect(() => {
    if (editor) {
      editor.commands.updatePageWidth(dimensions.pageWidthPt);
      editor.commands.updatePageHeight(dimensions.pageHeightPt);
      editor.commands.updateMargins({
        top: dimensions.topMarginPt,
        bottom: dimensions.bottomMarginPt,
        left: dimensions.marginPt,
        right: dimensions.marginPt,
      });
      // Optionally update headers/footers in the editor visually
      if (headerTitle) editor.commands.updateHeaderContent(headerTitle, '');
      if (footerText) editor.commands.updateFooterContent(footerText, '');
    }
  }, [editor, dimensions, headerTitle, footerText]);

  // Responsive desk scaling
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [deskWidth, setDeskWidth] = useState<number>(800);
  
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

  const scaleFactor = deskWidth > 0 && deskWidth < dimensions.pageWidthPt + 32
    ? Math.max(0.4, (deskWidth - 32) / dimensions.pageWidthPt)
    : 1.0;

  // Download PDF Action
  const handleDownloadPdf = async () => {
    if (!editor) return;
    try {
      setIsGenerating(true);
      
      // Extract Tiptap JSON and convert to Canonical Document for PDF Generator
      const json = editor.getJSON();
      const canonicalDoc = tiptapToCanonical(json, defaultFontFamily, defaultFontSize);
      
      // Use existing Paginator logic to map to exact PDF coordinates
      const paginatedDoc = paginateDocument(canonicalDoc, dimensions, lineSpacing, defaultFontSize, defaultFontFamily);

      const pdfBlob = await generatePdfBlob(
        paginatedDoc,
        headerTitle,
        footerText,
        includePageNumbers
      );
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${headerTitle.trim() ? headerTitle.replace(/[^a-zA-Z0-9_-]/g, '_') : 'document'}.pdf`;
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

  const handleApplyModalText = () => {
    if (editor) {
      // Just set text as markdown-ish or plain text (Tiptap handles HTML)
      editor.commands.setContent(`<pre>${modalRawText}</pre>`);
      setIsTextModalOpen(false);
    }
  };

  const handleLoadSample = () => {
    if (editor) {
      editor.commands.setContent(STANDARD_SAMPLE_TEXT);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
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
              Format typography, colors, and highlights seamlessly in an authentic multi-page layout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsTextModalOpen(true)}
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
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {isSettingsOpen && (
          <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Format & Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSizeOption)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-indigo-500">
                  <option value="a4">A4 (210×297mm)</option>
                  <option value="letter">US Letter (8.5×11")</option>
                  <option value="legal">US Legal (8.5×14")</option>
                </select>
                <select value={orientation} onChange={(e) => setOrientation(e.target.value as PageOrientationOption)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-indigo-500">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Margins & Spacing</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={margin} onChange={(e) => setMargin(e.target.value as MarginOption)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-indigo-500">
                  <option value="compact">Narrow (0.5")</option>
                  <option value="standard">Normal (0.75")</option>
                  <option value="wide">Wide (1.0")</option>
                </select>
                <select value={lineSpacing} onChange={(e) => setLineSpacing(parseFloat(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-indigo-500">
                  <option value="1.0">1.0 Single</option>
                  <option value="1.15">1.15 Tight</option>
                  <option value="1.4">1.4 Normal</option>
                  <option value="2.0">2.0 Double</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Running Header</label>
              <input type="text" value={headerTitle} onChange={(e) => setHeaderTitle(e.target.value)} placeholder="Optional header text..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div className="space-y-2 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Footer & Numbers</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-normal text-indigo-600">
                  <input type="checkbox" checked={includePageNumbers} onChange={(e) => setIncludePageNumbers(e.target.checked)} className="rounded text-indigo-600 focus:ring-0" />
                  <span>Numbers</span>
                </label>
              </label>
              <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="Optional footer text..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
        )}
      </div>

      <div className="sticky top-4 z-40">
        <EditorToolbar editor={editor} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900 dark:text-white">Active</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div>{wordCount.toLocaleString()} words</div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div>{charCount.toLocaleString()} characters</div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Vector PDF generated successfully!</span>
        </div>
      )}

      {/* TIPTAP EDITOR DESK */}
      <div
        id="document-pages-desk"
        ref={deskContainerRef}
        className="relative rounded-2xl bg-slate-200/90 dark:bg-[#0b0e17] border border-slate-300/80 dark:border-slate-800/80 shadow-inner p-4 sm:p-8 flex flex-col items-center min-h-[750px] overflow-y-auto"
      >
         <div 
           className="transition-transform origin-top"
           style={{ transform: scaleFactor < 1.0 ? `scale(${scaleFactor})` : undefined }}
         >
           <EditorContent editor={editor} />
         </div>
      </div>

      {isTextModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Edit / Paste Text</h3>
              <button onClick={() => setIsTextModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <button onClick={() => setModalRawText(generateSeventeenPageDoc())} className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-md">Load 17-Page Test</button>
              <textarea value={modalRawText} onChange={(e) => setModalRawText(e.target.value)} className="w-full h-64 font-mono text-sm p-4 border rounded-xl" placeholder="Paste your markdown or text..." />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button onClick={() => setIsTextModalOpen(false)} className="px-4 py-2 text-sm bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleApplyModalText} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

