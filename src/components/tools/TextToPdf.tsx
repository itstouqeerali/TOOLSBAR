import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  FileText, Download, RefreshCw, AlertCircle, CheckCircle2, 
  ShieldCheck, Trash2, Settings, Eye, Sliders, Sparkles, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Copy, Check,
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  Bold, Italic, Underline, Strikethrough, Highlighter, Type, Palette,
  List, ListOrdered, Indent, Outdent, Link2, RemoveFormatting,
  Undo2, Redo2, Heading1, Heading2, Heading3, ChevronDown, Plus, Minus
} from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, RGB } from 'pdf-lib';

export type PageSizeOption = 'a4' | 'letter';
export type PageOrientationOption = 'portrait' | 'landscape';
export type MarginOption = 'compact' | 'standard' | 'wide';
export type FontFamilyOption = 'Helvetica' | 'TimesRoman' | 'Courier';
export type TextAlignOption = 'left' | 'center' | 'right' | 'justify';

const SAMPLE_RICH_HTML = `<h1 style="font-family: Helvetica; color: #0f172a; margin-bottom: 8px;">Toolsbar Professional Document</h1>
<p style="font-family: Helvetica; color: #64748b; font-size: 13px; margin-bottom: 14px;">Client-Side Rich Text to PDF Generator & Document Studio</p>
<hr style="border: none; border-top: 1px solid #cbd5e1; margin-bottom: 16px;" />
<p style="margin-bottom: 12px; line-height: 1.5;">Welcome to the <b>professional rich-text editor</b>. You can now select individual words, sentences, or paragraphs and apply distinct formatting, fonts, highlights, and headings.</p>
<h2 style="font-family: Helvetica; color: #1e293b; margin-top: 14px; margin-bottom: 8px;">Key Capabilities</h2>
<ul>
  <li style="margin-bottom: 6px;"><b>Selection-Level Formatting:</b> Highlight specific words to make them <i>italic</i>, <u>underlined</u>, or <span style="color: #4f46e5; font-weight: bold;">custom colored</span>.</li>
  <li style="margin-bottom: 6px;"><mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px;">Smart Highlighting:</mark> Highlight key phrases in <mark style="background-color: #a5f3fc; padding: 2px 4px; border-radius: 3px;">cyan</mark>, <mark style="background-color: #bbf7d0; padding: 2px 4px; border-radius: 3px;">emerald</mark>, or <mark style="background-color: #fed7aa; padding: 2px 4px; border-radius: 3px;">orange</mark>.</li>
  <li style="margin-bottom: 6px;"><b>Document Hierarchy:</b> Organize sections using Heading 1, Heading 2, and Heading 3.</li>
  <li style="margin-bottom: 6px;"><b>100% Client-Side Privacy:</b> All compilation runs entirely within your browser sandbox.</li>
</ul>
<h3 style="font-family: Helvetica; color: #334155; margin-top: 14px; margin-bottom: 6px;">Getting Started</h3>
<p style="margin-bottom: 12px; line-height: 1.5;">Select any text in this editor to use the formatting toolbar, or clear the editor to write your custom proposal, agreement, or notes.</p>`;

interface InlineSpan {
  text: string;
  fontFamily: FontFamilyOption;
  fontSizePt: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  colorHex: string;
  bgColorHex: string | null;
  linkUrl: string | null;
}

interface FormattedBlock {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'li-bullet' | 'li-number' | 'hr';
  align: TextAlignOption;
  indent: number;
  listIndex?: number;
  spans: InlineSpan[];
}

interface PaginatedPage {
  pageIndex: number;
  blocks: {
    block: FormattedBlock;
    lines: {
      spans: (InlineSpan & { widthPt: number })[];
      lineWidthPt: number;
      lineHeightPt: number;
      isFirstLineOfBlock: boolean;
      listMarker?: string;
    }[];
  }[];
}

interface PaginatedDoc {
  pages: PaginatedPage[];
  pageWidthPt: number;
  pageHeightPt: number;
  marginPt: number;
  topMarginPt: number;
  bottomMarginPt: number;
  contentWidthPt: number;
  contentHeightPt: number;
  aspectRatio: number;
}

// Preset Color Palettes for toolbar
const TEXT_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#334155' },
  { name: 'Gray', value: '#64748b' },
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Clear', value: 'transparent', label: 'Clear' },
  { name: 'Yellow', value: '#fef08a', label: 'Yellow' },
  { name: 'Light Yellow', value: '#fef9c3', label: 'Light Yellow' },
  { name: 'Orange', value: '#fed7aa', label: 'Orange' },
  { name: 'Peach', value: '#ffedd5', label: 'Peach' },
  { name: 'Pink', value: '#fbcfe8', label: 'Pink' },
  { name: 'Red', value: '#fecaca', label: 'Red' },
  { name: 'Green', value: '#bbf7d0', label: 'Green' },
  { name: 'Emerald', value: '#a7f3d0', label: 'Emerald' },
  { name: 'Cyan', value: '#a5f3fc', label: 'Cyan' },
  { name: 'Blue', value: '#bfdbfe', label: 'Blue' },
  { name: 'Lavender', value: '#e0e7ff', label: 'Lavender' },
  { name: 'Purple', value: '#f3e8ff', label: 'Purple' },
  { name: 'Gray', value: '#e2e8f0', label: 'Gray' },
];

const FONT_SIZE_OPTIONS = [9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32];

export const TextToPdf: React.FC = () => {
  // Rich HTML content
  const [editorHtml, setEditorHtml] = useState<string>(SAMPLE_RICH_HTML);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef<boolean>(false);

  // PDF Configuration Settings
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<PageOrientationOption>('portrait');
  const [margin, setMargin] = useState<MarginOption>('standard');
  const [defaultFontFamily, setDefaultFontFamily] = useState<FontFamilyOption>('Helvetica');
  const [defaultFontSize, setDefaultFontSize] = useState<number>(12);
  const [defaultLineSpacing, setDefaultLineSpacing] = useState<number>(1.4);
  const [defaultTextAlign, setDefaultTextAlign] = useState<TextAlignOption>('left');
  const [defaultTextColor, setDefaultTextColor] = useState<string>('#0f172a');
  
  // Headers & Footers
  const [headerTitle, setHeaderTitle] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('');
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);
  const [pdfFileName, setPdfFileName] = useState<string>('toolsbar-document.pdf');

  // Preview Controls
  const [previewZoom, setPreviewZoom] = useState<number>(100);
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

  // Toolbar Active State Detection
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: 'left' as TextAlignOption,
    heading: 'p' as 'p' | 'h1' | 'h2' | 'h3',
    list: null as 'ul' | 'ol' | null,
    fontFamily: 'Helvetica' as FontFamilyOption,
    fontSize: 12,
    color: '#0f172a',
    highlight: 'transparent',
  });

  // Dropdown Popovers state
  const [openDropdown, setOpenDropdown] = useState<'color' | 'highlight' | 'heading' | 'font' | 'fontSize' | 'link' | null>(null);
  const [linkInputUrl, setLinkInputUrl] = useState<string>('');
  const [savedSelectionRange, setSavedSelectionRange] = useState<Range | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Tab state for settings on smaller screens
  const [activeSettingsTab, setActiveSettingsTab] = useState<'page' | 'typography' | 'headerFooter'>('page');

  // Sync editor HTML when loaded initially
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      editorRef.current.innerHTML = editorHtml;
    }
  }, []);

  // Save current browser selection inside editor
  const saveCurrentSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange();
      }
    }
  }, []);

  // Restore saved selection
  const restoreSavedSelection = useCallback((): boolean => {
    if (editorRef.current && savedSelectionRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current.cloneRange());
        return true;
      }
    }
    return false;
  }, []);

  // Update selection style states when user clicks/moves cursor
  const updateActiveToolbarStates = useCallback(() => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Check query commands
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isStrike = document.queryCommandState('strikeThrough');

      let currentBlock = 'p';
      const anchor = selection.anchorNode;
      let el: HTMLElement | null = anchor?.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : anchor?.parentElement || null;
      let currentAlign: TextAlignOption = defaultTextAlign;
      let currentList: 'ul' | 'ol' | null = null;
      let currentFont: FontFamilyOption = defaultFontFamily;
      let currentSize = defaultFontSize;
      let currentColor = defaultTextColor;
      let currentHighlight = 'transparent';

      while (el && el !== editorRef.current) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'h1') currentBlock = 'h1';
        else if (tag === 'h2') currentBlock = 'h2';
        else if (tag === 'h3') currentBlock = 'h3';
        else if (tag === 'ul') currentList = 'ul';
        else if (tag === 'ol') currentList = 'ol';

        if (el.style.textAlign) {
          let a = el.style.textAlign.toLowerCase();
          if (a === 'start') a = 'left';
          if (a === 'end') a = 'right';
          if (['left', 'center', 'right', 'justify'].includes(a)) {
            currentAlign = a as TextAlignOption;
          }
        } else if (el.getAttribute('align')) {
          let a = (el.getAttribute('align') || '').toLowerCase();
          if (a === 'start') a = 'left';
          if (a === 'end') a = 'right';
          if (['left', 'center', 'right', 'justify'].includes(a)) {
            currentAlign = a as TextAlignOption;
          }
        } else if (tag === 'center') {
          currentAlign = 'center';
        }
        if (el.style.fontFamily) {
          if (el.style.fontFamily.toLowerCase().includes('times') || el.style.fontFamily.toLowerCase().includes('serif')) {
            currentFont = 'TimesRoman';
          } else if (el.style.fontFamily.toLowerCase().includes('courier') || el.style.fontFamily.toLowerCase().includes('mono')) {
            currentFont = 'Courier';
          } else {
            currentFont = 'Helvetica';
          }
        }
        if (el.style.fontSize) {
          const pt = parseInt(el.style.fontSize);
          if (!isNaN(pt)) currentSize = pt;
        }
        if (el.style.color) {
          currentColor = el.style.color;
        }
        if (el.style.backgroundColor || tag === 'mark') {
          currentHighlight = el.style.backgroundColor || '#fef08a';
        }

        el = el.parentElement;
      }

      setActiveStyles({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikethrough: isStrike,
        align: currentAlign,
        heading: currentBlock as any,
        list: currentList,
        fontFamily: currentFont,
        fontSize: currentSize,
        color: currentColor,
        highlight: currentHighlight,
      });
    } catch {
      // benign queryCommand fallback
    }
  }, [defaultTextAlign, defaultFontFamily, defaultFontSize, defaultTextColor]);

  // Listen for selection changes document-wide to keep savedSelection fresh
  useEffect(() => {
    const handleSelectionChange = () => {
      saveCurrentSelection();
      updateActiveToolbarStates();
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [saveCurrentSelection, updateActiveToolbarStates]);

  // Close dropdowns when clicking outside toolbar
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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

  // Convert Hex / RGB string to RGB object for PDF document
  const parseColorToRgb = (colorStr: string): RGB => {
    if (!colorStr || colorStr === 'transparent') return rgb(0.1, 0.1, 0.1);

    if (colorStr.startsWith('rgb')) {
      const match = colorStr.match(/\d+/g);
      if (match && match.length >= 3) {
        return rgb(
          parseInt(match[0]) / 255,
          parseInt(match[1]) / 255,
          parseInt(match[2]) / 255
        );
      }
    }

    const cleanHex = colorStr.replace('#', '');
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

  // Convert RGB string or short hex to standard #rrggbb format for HTML color inputs
  const rgbOrHexToHex = (colorStr: string): string => {
    if (!colorStr || colorStr === 'transparent') return '#000000';
    if (colorStr.startsWith('#')) {
      if (colorStr.length === 4) {
        return `#${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}${colorStr[3]}${colorStr[3]}`;
      }
      return colorStr.substring(0, 7);
    }
    if (colorStr.startsWith('rgb')) {
      const match = colorStr.match(/\d+/g);
      if (match && match.length >= 3) {
        const r = Math.min(255, parseInt(match[0])).toString(16).padStart(2, '0');
        const g = Math.min(255, parseInt(match[1])).toString(16).padStart(2, '0');
        const b = Math.min(255, parseInt(match[2])).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return '#000000';
  };

  // Map font family to CSS font string for preview
  const getCssFontFamily = (family: FontFamilyOption) => {
    if (family === 'TimesRoman') return '"Times New Roman", Times, Georgia, serif';
    if (family === 'Courier') return '"Courier New", Courier, monospace';
    return 'Helvetica, Arial, sans-serif';
  };

  // Extract any inline styles enclosing a node
  const getInheritedInlineStyles = (node: Node | null): Record<string, string> => {
    const styles: Record<string, string> = {};
    let curr: HTMLElement | null = node?.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement | null);
    while (curr && curr !== editorRef.current) {
      const tag = curr.tagName.toLowerCase();
      if (['p', 'div', 'h1', 'h2', 'h3', 'li', 'blockquote'].includes(tag)) break;

      if (curr.style.fontFamily && !styles.fontFamily) styles.fontFamily = curr.style.fontFamily;
      if (curr.style.fontSize && !styles.fontSize) styles.fontSize = curr.style.fontSize;
      if (curr.style.color && !styles.color) styles.color = curr.style.color;
      if (curr.style.backgroundColor && !styles.backgroundColor) styles.backgroundColor = curr.style.backgroundColor;
      if (tag === 'mark' && !styles.backgroundColor) styles.backgroundColor = curr.style.backgroundColor || '#fef08a';
      if ((tag === 'b' || tag === 'strong' || curr.style.fontWeight === 'bold') && !styles.fontWeight) styles.fontWeight = 'bold';
      if ((tag === 'i' || tag === 'em' || curr.style.fontStyle === 'italic') && !styles.fontStyle) styles.fontStyle = 'italic';
      if ((tag === 'u' || curr.style.textDecoration?.includes('underline')) && !styles.underline) styles.underline = 'underline';
      if ((tag === 's' || tag === 'strike' || curr.style.textDecoration?.includes('line-through')) && !styles.strikethrough) styles.strikethrough = 'line-through';

      curr = curr.parentElement;
    }
    return styles;
  };

  // Find enclosing block element for paragraph/heading alignment
  const findEnclosingBlock = (node: Node | null): HTMLElement | null => {
    let curr = node;
    if (curr && curr.nodeType === Node.TEXT_NODE) {
      curr = curr.parentElement;
    }
    while (curr && curr !== editorRef.current) {
      const tag = (curr as HTMLElement).tagName.toLowerCase();
      if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre'].includes(tag)) {
        return curr as HTMLElement;
      }
      curr = curr.parentElement;
    }
    return null;
  };

  // Execute rich text formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    restoreSavedSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
    updateActiveToolbarStates();
  };

  // Handle Selection-Specific Style Wrapping (Font size, Font Family, Colors)
  const applyInlineStyle = (styleProp: string, styleValue: string) => {
    restoreSavedSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      // No text selected: do not overwrite entire document settings
      setOpenDropdown(null);
      return;
    }

    const range = selection.getRangeAt(0);

    // If native execCommand foreColor works cleanly, use it with styleWithCSS
    if (styleProp === 'color') {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('foreColor', false, styleValue);
    } else {
      const span = document.createElement('span');

      // Preserve existing surrounding inline formatting (bold, italic, etc.)
      const inherited = getInheritedInlineStyles(range.commonAncestorContainer);
      for (const [key, val] of Object.entries(inherited)) {
        if (key === 'fontWeight') span.style.fontWeight = val;
        else if (key === 'fontStyle') span.style.fontStyle = val;
        else if (key === 'underline' || key === 'strikethrough') {
          const currentDec = span.style.textDecoration || '';
          span.style.textDecoration = `${currentDec} ${val}`.trim();
        } else {
          span.style.setProperty(key, val);
        }
      }

      // Apply requested style
      if (styleProp === 'fontFamily') {
        const familyCss = styleValue === 'TimesRoman' 
          ? '"Times New Roman", Times, Georgia, serif' 
          : styleValue === 'Courier' 
          ? '"Courier New", Courier, monospace' 
          : 'Helvetica, Arial, sans-serif';
        span.style.fontFamily = familyCss;
      } else {
        span.style.setProperty(styleProp, styleValue);
      }

      try {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        // Re-select newly styled element
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);
        savedSelectionRef.current = newRange.cloneRange();
      } catch (err) {
        console.error('Error applying inline style:', err);
      }
    }

    handleEditorInput();
    updateActiveToolbarStates();
    setOpenDropdown(null);
  };

  // Apply Highlight
  const applyHighlight = (bgColor: string) => {
    restoreSavedSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setOpenDropdown(null);
      return;
    }

    const range = selection.getRangeAt(0);
    if (bgColor === 'transparent') {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('hiliteColor', false, 'transparent');
      let curr: HTMLElement | null = range.commonAncestorContainer?.nodeType === Node.TEXT_NODE 
        ? range.commonAncestorContainer.parentElement 
        : (range.commonAncestorContainer as HTMLElement | null);
      while (curr && curr !== editorRef.current) {
        if (curr.tagName.toLowerCase() === 'mark' || curr.style.backgroundColor) {
          curr.style.backgroundColor = 'transparent';
        }
        curr = curr.parentElement;
      }
    } else {
      const mark = document.createElement('mark');
      mark.style.backgroundColor = bgColor;
      mark.style.padding = '2px 4px';
      mark.style.borderRadius = '3px';

      // Preserve inherited styles
      const inherited = getInheritedInlineStyles(range.commonAncestorContainer);
      for (const [key, val] of Object.entries(inherited)) {
        if (key !== 'backgroundColor') {
          if (key === 'fontWeight') mark.style.fontWeight = val;
          else if (key === 'fontStyle') mark.style.fontStyle = val;
          else if (key === 'underline' || key === 'strikethrough') {
            const currentDec = mark.style.textDecoration || '';
            mark.style.textDecoration = `${currentDec} ${val}`.trim();
          } else {
            mark.style.setProperty(key, val);
          }
        }
      }

      try {
        const contents = range.extractContents();
        mark.appendChild(contents);
        range.insertNode(mark);

        const newRange = document.createRange();
        newRange.selectNodeContents(mark);
        selection.removeAllRanges();
        selection.addRange(newRange);
        savedSelectionRef.current = newRange.cloneRange();
      } catch {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('hiliteColor', false, bgColor);
      }
    }

    handleEditorInput();
    updateActiveToolbarStates();
    setOpenDropdown(null);
  };

  // Format Block Heading / Paragraph
  const applyHeading = (headingTag: 'h1' | 'h2' | 'h3' | 'p') => {
    restoreSavedSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('formatBlock', false, `<${headingTag}>`);
    handleEditorInput();
    updateActiveToolbarStates();
    setOpenDropdown(null);
  };

  // Format Alignment - Targets only active block/paragraph, never the whole document
  const applyAlignment = (align: TextAlignOption) => {
    restoreSavedSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    document.execCommand('styleWithCSS', false, 'true');
    if (align === 'left') document.execCommand('justifyLeft', false);
    else if (align === 'center') document.execCommand('justifyCenter', false);
    else if (align === 'right') document.execCommand('justifyRight', false);
    else if (align === 'justify') document.execCommand('justifyFull', false);

    // Ensure the enclosing paragraph/heading block explicitly stores textAlign
    let enclosingBlock = findEnclosingBlock(selection.anchorNode);
    if (!enclosingBlock || enclosingBlock === editorRef.current) {
      document.execCommand('formatBlock', false, '<p>');
      enclosingBlock = findEnclosingBlock(selection.anchorNode);
    }
    if (enclosingBlock && enclosingBlock !== editorRef.current) {
      enclosingBlock.style.textAlign = align;
    }

    // For multi-block selections, apply alignment to all selected blocks
    const activeRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (activeRange && editorRef.current) {
      const allBlocks = editorRef.current.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, blockquote');
      allBlocks.forEach((b) => {
        if (selection.containsNode(b, true)) {
          (b as HTMLElement).style.textAlign = align;
        }
      });
    }

    handleEditorInput();
    updateActiveToolbarStates();
  };

  // Insert Link Action
  const handleOpenLinkModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelectionRange(selection.getRangeAt(0).cloneRange());
    }
    setOpenDropdown(openDropdown === 'link' ? null : 'link');
  };

  const handleApplyLink = () => {
    if (!linkInputUrl.trim() || !editorRef.current) {
      setOpenDropdown(null);
      return;
    }
    editorRef.current.focus();
    if (savedSelectionRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRange);
    }
    let url = linkInputUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    document.execCommand('createLink', false, url);
    setLinkInputUrl('');
    setSavedSelectionRange(null);
    setOpenDropdown(null);
    handleEditorInput();
  };

  // Input event handler from contenteditable
  const handleEditorInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      const html = editorRef.current.innerHTML;
      setEditorHtml(html);
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
        setPdfStats(null);
      }
      setTimeout(() => {
        isInternalChange.current = false;
      }, 0);
    }
  };

  // Character & Word counts from rendered text
  const stats = useMemo(() => {
    const div = document.createElement('div');
    div.innerHTML = editorHtml;
    const plainText = div.innerText || div.textContent || '';
    const trimmed = plainText.trim();
    const characters = plainText.length;
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const lines = plainText ? plainText.split('\n').filter(Boolean).length : 0;
    return { characters, words, lines, plainText };
  }, [editorHtml]);

  // Robust HTML to Structured Block Parser for Pagination & PDF Vector Rendering
  const parseHtmlToFormattedBlocks = useCallback((html: string): FormattedBlock[] => {
    const container = document.createElement('div');
    container.innerHTML = html;

    const blocks: FormattedBlock[] = [];

    const parseInlineNodes = (
      node: Node, 
      inherited: {
        fontFamily: FontFamilyOption;
        fontSizePt: number;
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
        colorHex: string;
        bgColorHex: string | null;
        linkUrl: string | null;
      }
    ): InlineSpan[] => {
      const spans: InlineSpan[] = [];

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (text) {
          spans.push({
            text,
            ...inherited,
          });
        }
        return spans;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        let bold = inherited.bold || tag === 'b' || tag === 'strong' || el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight) >= 600;
        let italic = inherited.italic || tag === 'i' || tag === 'em' || el.style.fontStyle === 'italic';
        let underline = inherited.underline || tag === 'u' || el.style.textDecoration?.includes('underline');
        let strikethrough = inherited.strikethrough || tag === 's' || tag === 'strike' || tag === 'del' || el.style.textDecoration?.includes('line-through');

        let fontFamily = inherited.fontFamily;
        const fontAttr = el.style.fontFamily || el.getAttribute('face');
        if (fontAttr) {
          const f = fontAttr.toLowerCase();
          if (f.includes('times') || f.includes('serif')) fontFamily = 'TimesRoman';
          else if (f.includes('courier') || f.includes('mono')) fontFamily = 'Courier';
          else fontFamily = 'Helvetica';
        }

        let fontSizePt = inherited.fontSizePt;
        if (el.style.fontSize) {
          const pt = parseInt(el.style.fontSize);
          if (!isNaN(pt) && pt > 0) fontSizePt = pt;
        } else if (el.getAttribute('size')) {
          const sz = parseInt(el.getAttribute('size') || '');
          if (!isNaN(sz)) {
            const fontSizesMap: Record<number, number> = { 1: 9, 2: 10, 3: 12, 4: 14, 5: 18, 6: 24, 7: 32 };
            if (fontSizesMap[sz]) fontSizePt = fontSizesMap[sz];
          }
        }

        let colorHex = el.style.color || el.getAttribute('color') || inherited.colorHex;
        let bgColorHex = (tag === 'mark' || el.style.backgroundColor) ? (el.style.backgroundColor || '#fef08a') : inherited.bgColorHex;
        if (bgColorHex === 'transparent') bgColorHex = null;
        let linkUrl = tag === 'a' ? (el.getAttribute('href') || null) : inherited.linkUrl;

        if (tag === 'br') {
          spans.push({
            text: '\n',
            ...inherited,
          });
          return spans;
        }

        for (const child of Array.from(el.childNodes)) {
          spans.push(...parseInlineNodes(child, {
            fontFamily,
            fontSizePt,
            bold,
            italic,
            underline,
            strikethrough,
            colorHex,
            bgColorHex,
            linkUrl
          }));
        }
      }

      return spans;
    };

    const processElementBlock = (el: HTMLElement, inheritedAlign: TextAlignOption = defaultTextAlign) => {
      const tag = el.tagName.toLowerCase();
      let rawAlign = (tag === 'center' 
        ? 'center' 
        : (el.style.textAlign as TextAlignOption) || (el.getAttribute('align') as TextAlignOption) || inheritedAlign) as string;
      if (rawAlign === 'start') rawAlign = 'left';
      if (rawAlign === 'end') rawAlign = 'right';
      const align: TextAlignOption = (['left', 'center', 'right', 'justify'].includes(rawAlign) 
        ? rawAlign 
        : defaultTextAlign) as TextAlignOption;

      // Calculate any indentation from blockquote or margin/padding styles
      let indentLevel = 0;
      let checkEl: HTMLElement | null = el;
      while (checkEl && checkEl !== container) {
        if (checkEl.tagName.toLowerCase() === 'blockquote') indentLevel++;
        const ml = parseInt(checkEl.style.marginLeft || checkEl.style.paddingLeft || '0');
        if (!isNaN(ml) && ml >= 20) {
          indentLevel += Math.min(5, Math.floor(ml / 30));
        }
        checkEl = checkEl.parentElement;
      }

      // If el contains block-level child elements (and is not ul/ol), recurse on block children
      const hasBlockChildren = Array.from(el.children).some(child => 
        ['p', 'div', 'h1', 'h2', 'h3', 'ul', 'ol', 'hr', 'blockquote'].includes(child.tagName.toLowerCase())
      );
      if (hasBlockChildren && tag !== 'ul' && tag !== 'ol') {
        for (const child of Array.from(el.childNodes)) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            processElementBlock(child as HTMLElement, align);
          } else if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) {
              const spans = parseInlineNodes(child, {
                fontFamily: defaultFontFamily,
                fontSizePt: defaultFontSize,
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
                colorHex: defaultTextColor,
                bgColorHex: null,
                linkUrl: null
              });
              if (spans.length > 0) {
                blocks.push({
                  type: 'p',
                  align,
                  indent: indentLevel,
                  spans
                });
              }
            }
          }
        }
        return;
      }

      if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
        const baseHSize = tag === 'h1' ? 22 : tag === 'h2' ? 16 : 14;
        const spans = parseInlineNodes(el, {
          fontFamily: defaultFontFamily,
          fontSizePt: baseHSize,
          bold: true,
          italic: false,
          underline: false,
          strikethrough: false,
          colorHex: defaultTextColor,
          bgColorHex: null,
          linkUrl: null
        });
        if (spans.length > 0) {
          blocks.push({
            type: tag,
            align,
            indent: indentLevel,
            spans
          });
        }
      } else if (tag === 'hr') {
        blocks.push({
          type: 'hr',
          align: 'left',
          indent: 0,
          spans: []
        });
      } else if (tag === 'ul' || tag === 'ol') {
        const isOrdered = tag === 'ol';
        let listIndex = 1;
        for (const child of Array.from(el.children)) {
          if (child.tagName.toLowerCase() === 'li') {
            const spans = parseInlineNodes(child, {
              fontFamily: defaultFontFamily,
              fontSizePt: defaultFontSize,
              bold: false,
              italic: false,
              underline: false,
              strikethrough: false,
              colorHex: defaultTextColor,
              bgColorHex: null,
              linkUrl: null
            });
            blocks.push({
              type: isOrdered ? 'li-number' : 'li-bullet',
              align,
              indent: Math.max(1, indentLevel + 1),
              listIndex: isOrdered ? listIndex++ : undefined,
              spans
            });
          }
        }
      } else {
        // Paragraph, div, blockquote, or plain container
        const spans = parseInlineNodes(el, {
          fontFamily: defaultFontFamily,
          fontSizePt: defaultFontSize,
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          colorHex: defaultTextColor,
          bgColorHex: null,
          linkUrl: null
        });
        if (spans.length > 0) {
          blocks.push({
            type: 'p',
            align,
            indent: indentLevel,
            spans
          });
        }
      }
    };

    for (const child of Array.from(container.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        processElementBlock(child as HTMLElement);
      } else if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          blocks.push({
            type: 'p',
            align: defaultTextAlign,
            indent: 0,
            spans: [{
              text,
              fontFamily: defaultFontFamily,
              fontSizePt: defaultFontSize,
              bold: false,
              italic: false,
              underline: false,
              strikethrough: false,
              colorHex: defaultTextColor,
              bgColorHex: null,
              linkUrl: null
            }]
          });
        }
      }
    }

    if (blocks.length === 0) {
      blocks.push({
        type: 'p',
        align: defaultTextAlign,
        indent: 0,
        spans: [{
          text: '',
          fontFamily: defaultFontFamily,
          fontSizePt: defaultFontSize,
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          colorHex: defaultTextColor,
          bgColorHex: null,
          linkUrl: null
        }]
      });
    }

    return blocks;
  }, [defaultFontFamily, defaultFontSize, defaultTextColor, defaultTextAlign]);

  // Pagination & Layout Engine
  const paginatedDoc = useMemo<PaginatedDoc>(() => {
    // 1. Base page dimensions in points (72 pt per inch)
    const baseW = pageSize === 'letter' ? 612 : 595.28;
    const baseH = pageSize === 'letter' ? 792 : 841.89;

    const pageWidthPt = orientation === 'landscape' ? Math.max(baseW, baseH) : Math.min(baseW, baseH);
    const pageHeightPt = orientation === 'landscape' ? Math.min(baseW, baseH) : Math.max(baseW, baseH);
    const aspectRatio = pageWidthPt / pageHeightPt;

    // 2. Margins in points
    const marginPt = margin === 'compact' ? 28.35 : margin === 'wide' ? 56.7 : 42.52;
    const contentWidthPt = pageWidthPt - (marginPt * 2);

    const topMarginPt = headerTitle.trim() ? marginPt + 28 : marginPt;
    const bottomMarginPt = (footerText.trim() || includePageNumbers) ? marginPt + 28 : marginPt;
    const contentHeightPt = Math.max(80, pageHeightPt - topMarginPt - bottomMarginPt);

    // 3. Measure text spans using an offscreen canvas context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const measureSpanWidth = (spanText: string, family: FontFamilyOption, sizePt: number, bold: boolean, italic: boolean): number => {
      if (!ctx) return spanText.length * (sizePt * 0.55);
      const fontStr = `${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${sizePt}px ${getCssFontFamily(family)}`;
      ctx.font = fontStr;
      return ctx.measureText(spanText).width;
    };

    // 4. Parse rich blocks and wrap into lines
    const parsedBlocks = parseHtmlToFormattedBlocks(editorHtml);

    const pages: PaginatedPage[] = [];
    let currentPageIndex = 0;
    let currentYOffsetPt = 0;
    let currentPageBlocks: PaginatedPage['blocks'] = [];

    const flushCurrentPage = () => {
      pages.push({
        pageIndex: currentPageIndex,
        blocks: currentPageBlocks,
      });
      currentPageIndex++;
      currentPageBlocks = [];
      currentYOffsetPt = 0;
    };

    for (const block of parsedBlocks) {
      if (block.type === 'hr') {
        const hrHeight = 16;
        if (currentYOffsetPt + hrHeight > contentHeightPt && currentPageBlocks.length > 0) {
          flushCurrentPage();
        }
        currentPageBlocks.push({
          block,
          lines: [{
            spans: [],
            lineWidthPt: contentWidthPt,
            lineHeightPt: hrHeight,
            isFirstLineOfBlock: true
          }]
        });
        currentYOffsetPt += hrHeight;
        continue;
      }

      // Word wrapping across spans for paragraph / heading / list item
      const listIndentPt = block.indent > 0 ? 18 * block.indent : 0;
      const effectiveContentWidth = contentWidthPt - listIndentPt;

      // Extract words from spans with styling preserved
      const wordsWithStyle: {
        word: string;
        span: InlineSpan;
        width: number;
        spaceWidth: number;
      }[] = [];

      for (const span of block.spans) {
        // Handle newlines explicitly
        const parts = span.text.split('\n');
        for (let p = 0; p < parts.length; p++) {
          const part = parts[p];
          if (part) {
            const rawWords = part.split(' ');
            for (let w = 0; w < rawWords.length; w++) {
              const wordStr = rawWords[w];
              if (wordStr === '' && rawWords.length > 1) continue;
              const wWidth = measureSpanWidth(wordStr, span.fontFamily, span.fontSizePt, span.bold, span.italic);
              const spaceWidth = measureSpanWidth(' ', span.fontFamily, span.fontSizePt, span.bold, span.italic);
              wordsWithStyle.push({
                word: wordStr,
                span,
                width: wWidth,
                spaceWidth
              });
            }
          }
          if (p < parts.length - 1) {
            // Force line break token
            wordsWithStyle.push({
              word: '\n',
              span,
              width: 0,
              spaceWidth: 0
            });
          }
        }
      }

      // Build wrapped lines for this block
      const blockLines: {
        spans: (InlineSpan & { widthPt: number })[];
        lineWidthPt: number;
        lineHeightPt: number;
        isFirstLineOfBlock: boolean;
        listMarker?: string;
      }[] = [];

      let currentLineSpans: (InlineSpan & { widthPt: number })[] = [];
      let currentLineWidth = 0;
      let maxLineFontSize = block.type === 'h1' ? 22 : block.type === 'h2' ? 16 : block.type === 'h3' ? 14 : defaultFontSize;

      const finishLine = () => {
        if (currentLineSpans.length === 0) return;
        const lineHeight = maxLineFontSize * defaultLineSpacing;
        blockLines.push({
          spans: currentLineSpans,
          lineWidthPt: currentLineWidth,
          lineHeightPt: lineHeight,
          isFirstLineOfBlock: blockLines.length === 0,
          listMarker: blockLines.length === 0 
            ? (block.type === 'li-bullet' ? '•' : block.type === 'li-number' ? `${block.listIndex || 1}.` : undefined)
            : undefined
        });
        currentLineSpans = [];
        currentLineWidth = 0;
        maxLineFontSize = defaultFontSize;
      };

      for (let i = 0; i < wordsWithStyle.length; i++) {
        const item = wordsWithStyle[i];

        if (item.word === '\n') {
          finishLine();
          continue;
        }

        const isFirstInLine = currentLineSpans.length === 0;
        const addedWidth = isFirstInLine ? item.width : item.spaceWidth + item.width;

        if (currentLineWidth + addedWidth <= effectiveContentWidth || isFirstInLine) {
          const textToAdd = isFirstInLine ? item.word : ' ' + item.word;
          currentLineSpans.push({
            ...item.span,
            text: textToAdd,
            widthPt: addedWidth
          });
          currentLineWidth += addedWidth;
          maxLineFontSize = Math.max(maxLineFontSize, item.span.fontSizePt);
        } else {
          finishLine();
          currentLineSpans.push({
            ...item.span,
            text: item.word,
            widthPt: item.width
          });
          currentLineWidth = item.width;
          maxLineFontSize = item.span.fontSizePt;
        }
      }

      finishLine();

      if (blockLines.length === 0) {
        blockLines.push({
          spans: [{
            text: '',
            fontFamily: defaultFontFamily,
            fontSizePt: defaultFontSize,
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            colorHex: defaultTextColor,
            bgColorHex: null,
            linkUrl: null,
            widthPt: 0
          }],
          lineWidthPt: 0,
          lineHeightPt: defaultFontSize * defaultLineSpacing,
          isFirstLineOfBlock: true
        });
      }

      // Add extra top margin for headings
      const headingSpacingAbove = block.type === 'h1' ? 14 : block.type === 'h2' ? 10 : block.type === 'h3' ? 8 : 4;
      const headingSpacingBelow = block.type === 'h1' ? 8 : block.type === 'h2' ? 6 : block.type === 'h3' ? 4 : 4;

      currentYOffsetPt += headingSpacingAbove;

      // Distribute block lines across pages
      let currentBlockLinesForPage: typeof blockLines = [];

      for (const line of blockLines) {
        if (currentYOffsetPt + line.lineHeightPt > contentHeightPt && currentPageBlocks.length > 0) {
          if (currentBlockLinesForPage.length > 0) {
            currentPageBlocks.push({
              block,
              lines: currentBlockLinesForPage
            });
            currentBlockLinesForPage = [];
          }
          flushCurrentPage();
        }

        currentBlockLinesForPage.push(line);
        currentYOffsetPt += line.lineHeightPt;
      }

      if (currentBlockLinesForPage.length > 0) {
        currentPageBlocks.push({
          block,
          lines: currentBlockLinesForPage
        });
      }

      currentYOffsetPt += headingSpacingBelow;
    }

    if (currentPageBlocks.length > 0 || pages.length === 0) {
      flushCurrentPage();
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
      aspectRatio
    };
  }, [
    editorHtml, pageSize, orientation, margin, defaultFontFamily, defaultFontSize,
    defaultLineSpacing, defaultTextColor, defaultTextAlign, headerTitle, footerText, 
    includePageNumbers, parseHtmlToFormattedBlocks
  ]);

  // Adjust current page index when total pages change
  useEffect(() => {
    if (currentPageIndex >= paginatedDoc.pages.length) {
      setCurrentPageIndex(Math.max(0, paginatedDoc.pages.length - 1));
    }
  }, [paginatedDoc.pages.length, currentPageIndex]);

  // Generate binary PDF document via pdf-lib with full vector text, formatting & highlights
  const generatePdfBlob = async (): Promise<{ blob: Blob; totalPages: number }> => {
    if (!stats.plainText.trim()) {
      throw new Error('Please enter some text in the document editor before downloading.');
    }

    const pdfDoc = await PDFDocument.create();

    // Embed Standard Font Families
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const fontHelveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

    const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const fontTimesBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

    const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
    const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
    const fontCourierOblique = await pdfDoc.embedFont(StandardFonts.CourierOblique);
    const fontCourierBoldOblique = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);

    const getPdfFont = (family: FontFamilyOption, bold: boolean, italic: boolean) => {
      if (family === 'TimesRoman') {
        if (bold && italic) return fontTimesBoldItalic;
        if (bold) return fontTimesBold;
        if (italic) return fontTimesItalic;
        return fontTimes;
      }
      if (family === 'Courier') {
        if (bold && italic) return fontCourierBoldOblique;
        if (bold) return fontCourierBold;
        if (italic) return fontCourierOblique;
        return fontCourier;
      }
      // Default Helvetica
      if (bold && italic) return fontHelveticaBoldOblique;
      if (bold) return fontHelveticaBold;
      if (italic) return fontHelveticaOblique;
      return fontHelvetica;
    };

    const { 
      pages, pageWidthPt, pageHeightPt, marginPt, 
      topMarginPt, contentWidthPt 
    } = paginatedDoc;

    const mutedColorRgb = rgb(0.45, 0.5, 0.58);
    const totalPages = pages.length;

    // Draw each paginated page
    pages.forEach((pageData, pIdx) => {
      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
      const pageNum = pIdx + 1;

      // 1. Draw Document Header
      if (headerTitle.trim()) {
        const safeHeader = headerTitle.trim().replace(/[^\x00-\x7F\xA0-\xFF]/g, '?');
        const headerFontSize = 9;
        const headerY = pageHeightPt - marginPt + 4;
        
        page.drawText(safeHeader, {
          x: marginPt,
          y: headerY,
          size: headerFontSize,
          font: fontHelveticaBold,
          color: mutedColorRgb,
        });

        // Header divider line
        page.drawLine({
          start: { x: marginPt, y: headerY - 5 },
          end: { x: pageWidthPt - marginPt, y: headerY - 5 },
          thickness: 0.5,
          color: rgb(0.85, 0.88, 0.92),
        });
      }

      // 2. Draw Document Body Blocks & Styled Spans
      let currentY = pageHeightPt - topMarginPt;

      for (const blockItem of pageData.blocks) {
        const { block, lines } = blockItem;

        if (block.type === 'hr') {
          currentY -= 8;
          page.drawLine({
            start: { x: marginPt, y: currentY },
            end: { x: pageWidthPt - marginPt, y: currentY },
            thickness: 0.75,
            color: rgb(0.8, 0.84, 0.88),
          });
          currentY -= 8;
          continue;
        }

        const indentOffset = block.indent > 0 ? 18 * block.indent : 0;
        const effectiveWidth = contentWidthPt - indentOffset;

        for (const line of lines) {
          currentY -= line.lineHeightPt;

          // Calculate exact line width based on embedded PDF font metrics
          let trueLineWidth = 0;
          for (const span of line.spans) {
            if (!span.text) continue;
            const safeText = span.text.replace(/[^\x00-\x7F\xA0-\xFF]/g, '?');
            const spanFont = getPdfFont(span.fontFamily, span.bold, span.italic);
            try {
              trueLineWidth += spanFont.widthOfTextAtSize(safeText, span.fontSizePt);
            } catch {
              trueLineWidth += span.widthPt;
            }
          }

          let startX = marginPt + indentOffset;
          if (block.align === 'center') {
            startX = marginPt + indentOffset + Math.max(0, (effectiveWidth - trueLineWidth) / 2);
          } else if (block.align === 'right') {
            startX = marginPt + indentOffset + Math.max(0, effectiveWidth - trueLineWidth);
          }

          // Draw list marker if applicable
          if (line.listMarker) {
            const markerFont = fontHelveticaBold;
            page.drawText(line.listMarker, {
              x: marginPt + indentOffset - 14,
              y: currentY,
              size: line.spans[0]?.fontSizePt || defaultFontSize,
              font: markerFont,
              color: parseColorToRgb(defaultTextColor),
            });
          }

          let spanX = startX;
          for (const span of line.spans) {
            if (!span.text) continue;

            const safeText = span.text.replace(/[^\x00-\x7F\xA0-\xFF]/g, '?');
            const spanFont = getPdfFont(span.fontFamily, span.bold, span.italic);
            const textColorRgb = parseColorToRgb(span.colorHex);

            let calculatedWidth = span.widthPt;
            try {
              calculatedWidth = spanFont.widthOfTextAtSize(safeText, span.fontSizePt);
            } catch {
              // fallback
            }

            // Draw highlight background rectangle if specified
            if (span.bgColorHex && span.bgColorHex !== 'transparent') {
              const bgRgb = parseColorToRgb(span.bgColorHex);
              page.drawRectangle({
                x: spanX - 1,
                y: currentY - 2,
                width: calculatedWidth + 2,
                height: span.fontSizePt + 3,
                color: bgRgb,
              });
            }

            // Draw text
            page.drawText(safeText, {
              x: spanX,
              y: currentY,
              size: span.fontSizePt,
              font: spanFont,
              color: textColorRgb,
            });

            // Draw Underline
            if (span.underline) {
              page.drawLine({
                start: { x: spanX, y: currentY - 1.5 },
                end: { x: spanX + calculatedWidth, y: currentY - 1.5 },
                thickness: 0.75,
                color: textColorRgb,
              });
            }

            // Draw Strikethrough
            if (span.strikethrough) {
              const strikeY = currentY + (span.fontSizePt * 0.35);
              page.drawLine({
                start: { x: spanX, y: strikeY },
                end: { x: spanX + calculatedWidth, y: strikeY },
                thickness: 0.75,
                color: textColorRgb,
              });
            }

            spanX += calculatedWidth;
          }
        }
      }

      // 3. Draw Document Footer & Page Numbers
      if (footerText.trim() || includePageNumbers) {
        const footerY = marginPt - 4;
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
            font: fontHelvetica,
            color: mutedColorRgb,
          });
        }

        if (includePageNumbers) {
          const pageStr = `Page ${pageNum} of ${totalPages}`;
          const pageStrWidth = fontHelvetica.widthOfTextAtSize(pageStr, footerFontSize);
          page.drawText(pageStr, {
            x: pageWidthPt - marginPt - pageStrWidth,
            y: footerY,
            size: footerFontSize,
            font: fontHelvetica,
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
    if (!stats.plainText.trim()) {
      setErrorMsg('Please enter some text in the editor before downloading the PDF.');
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

      const downloadName = pdfFileName.trim().endsWith('.pdf') 
        ? pdfFileName.trim() 
        : `${pdfFileName.trim() || 'toolsbar-document'}.pdf`;

      const link = document.createElement('a');
      link.href = newUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setErrorMsg(err.message || 'Failed to generate PDF. Please verify your document text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!stats.plainText) return;
    await navigator.clipboard.writeText(stats.plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setEditorHtml('');
    }
    setErrorMsg(null);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
      setPdfStats(null);
    }
  };

  const handleLoadSample = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = SAMPLE_RICH_HTML;
      setEditorHtml(SAMPLE_RICH_HTML);
    }
  };

  // Render a live PDF sheet preview with exact multi-page rich content representation
  const renderPreviewSheet = (pageData: PaginatedPage) => {
    const pageNum = pageData.pageIndex + 1;
    const totalPages = paginatedDoc.pages.length;

    const marginPercentX = (paginatedDoc.marginPt / paginatedDoc.pageWidthPt) * 100;
    const marginPercentY = (paginatedDoc.marginPt / paginatedDoc.pageHeightPt) * 100;

    return (
      <div
        key={`preview-page-${pageData.pageIndex}`}
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

          {/* Document Body Blocks */}
          <div className="flex-1 w-full overflow-hidden flex flex-col space-y-1">
            {pageData.blocks.map((blockItem, bIdx) => {
              const { block, lines } = blockItem;
              if (block.type === 'hr') {
                return <hr key={bIdx} className="border-t border-slate-300 my-1" />;
              }

              return (
                <div 
                  key={bIdx}
                  style={{
                    textAlign: block.align,
                    paddingLeft: block.indent > 0 ? `${block.indent * 14}px` : undefined,
                  }}
                  className="w-full"
                >
                  {lines.map((line, lIdx) => (
                    <div 
                      key={lIdx}
                      style={{
                        minHeight: `${line.lineHeightPt * 0.75}px`,
                        textAlign: block.align,
                      }}
                      className="leading-normal w-full"
                    >
                      {line.listMarker && (
                        <span className="font-bold text-[11px] mr-1.5 text-slate-700 select-none inline-block">
                          {line.listMarker}
                        </span>
                      )}
                      {line.spans.map((span, sIdx) => {
                        const style: React.CSSProperties = {
                          fontFamily: getCssFontFamily(span.fontFamily),
                          fontSize: `${Math.max(7, span.fontSizePt * (previewZoom / 100) * 0.78)}px`,
                          fontWeight: span.bold ? 'bold' : 'normal',
                          fontStyle: span.italic ? 'italic' : 'normal',
                          textDecoration: `${span.underline ? 'underline ' : ''}${span.strikethrough ? 'line-through' : ''}`.trim() || 'none',
                          color: span.colorHex || defaultTextColor,
                          backgroundColor: span.bgColorHex || 'transparent',
                          padding: span.bgColorHex && span.bgColorHex !== 'transparent' ? '1px 3px' : undefined,
                          borderRadius: span.bgColorHex && span.bgColorHex !== 'transparent' ? '2px' : undefined,
                          whiteSpace: 'pre-wrap',
                        };

                        return (
                          <span key={sIdx} style={style}>
                            {span.text || '\u00A0'}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
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
            <strong>100% Client-Side Document Privacy:</strong> Rich text styling, fonts, and PDF generation compile entirely in your browser.
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
            className="p-1 hover:bg-rose-500/20 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workspace: Left (Rich Text Editor & Settings) | Right (Interactive PDF Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Rich Text Document Studio */}
        <div className="xl:col-span-6 space-y-6">
          <div className="rounded-3xl p-4 sm:p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-3 sm:space-y-4">
            
            {/* Header with Title and Action buttons */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-neutral-300">
                  Rich Text Document Editor
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={!stats.plainText}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-300 text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!stats.plainText}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Professional Rich-Text Formatting Toolbar */}
            <div 
              ref={toolbarRef}
              className="p-2 rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center gap-1 sm:gap-1.5 select-none relative z-20 overflow-x-auto scrollbar-thin"
            >
              {/* Undo / Redo Group */}
              <div className="flex items-center bg-white dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/80 dark:border-white/10 flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('undo')}
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                  className="p-1.5 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('redo')}
                  title="Redo (Ctrl+Y)"
                  aria-label="Redo"
                  className="p-1.5 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Headings Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setOpenDropdown(openDropdown === 'heading' ? null : 'heading')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>
                    {activeStyles.heading === 'h1' ? 'Heading 1' : activeStyles.heading === 'h2' ? 'Heading 2' : activeStyles.heading === 'h3' ? 'Heading 3' : 'Normal'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {openDropdown === 'heading' && (
                  <div className="absolute left-0 top-full mt-1 w-36 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200 dark:border-white/10 shadow-2xl p-1.5 space-y-1 z-30 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHeading('p')}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${activeStyles.heading === 'p' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-300'}`}
                    >
                      Normal text
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHeading('h1')}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${activeStyles.heading === 'h1' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white'}`}
                    >
                      Heading 1
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHeading('h2')}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${activeStyles.heading === 'h2' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white'}`}
                    >
                      Heading 2
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHeading('h3')}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activeStyles.heading === 'h3' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white'}`}
                    >
                      Heading 3
                    </button>
                  </div>
                )}
              </div>

              {/* Font Family Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setOpenDropdown(openDropdown === 'font' ? null : 'font')}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="truncate max-w-[80px]">
                    {activeStyles.fontFamily === 'TimesRoman' ? 'Times' : activeStyles.fontFamily === 'Courier' ? 'Courier' : 'Helvetica'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {openDropdown === 'font' && (
                  <div className="absolute left-0 top-full mt-1 w-44 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200 dark:border-white/10 shadow-2xl p-1.5 space-y-1 z-30 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyInlineStyle('fontFamily', 'Helvetica')}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-sans text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Helvetica (Sans)
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyInlineStyle('fontFamily', 'TimesRoman')}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-serif text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Times New Roman (Serif)
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyInlineStyle('fontFamily', 'Courier')}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Courier (Monospace)
                    </button>
                  </div>
                )}
              </div>

              {/* Font Size Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setOpenDropdown(openDropdown === 'fontSize' ? null : 'fontSize')}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-mono font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>{activeStyles.fontSize}pt</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {openDropdown === 'fontSize' && (
                  <div className="absolute left-0 top-full mt-1 w-24 max-h-48 overflow-y-auto rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200 dark:border-white/10 shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95">
                    {FONT_SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyInlineStyle('fontSize', `${size}pt`)}
                        className={`w-full text-left px-2.5 py-1 rounded-xl text-xs font-mono transition-colors ${activeStyles.fontSize === size ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-300'}`}
                      >
                        {size} pt
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bold, Italic, Underline, Strike Buttons Group */}
              <div className="flex items-center bg-white dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/80 dark:border-white/10 flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('bold')}
                  title="Bold (Ctrl+B)"
                  aria-label="Bold"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.bold ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <Bold className="w-3.5 h-3.5 font-bold" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('italic')}
                  title="Italic (Ctrl+I)"
                  aria-label="Italic"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.italic ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('underline')}
                  title="Underline (Ctrl+U)"
                  aria-label="Underline"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.underline ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('strikeThrough')}
                  title="Strikethrough"
                  aria-label="Strikethrough"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.strikethrough ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Color Picker Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
                  title="Text Color"
                  className="flex items-center gap-1 p-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-700 dark:text-neutral-300" />
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20"
                    style={{ backgroundColor: activeStyles.color }}
                  />
                </button>

                {openDropdown === 'color' && (
                  <div className="absolute left-0 top-full mt-1 w-52 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-2.5 z-30 animate-in fade-in zoom-in-95">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Text Color</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {TEXT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          title={c.name}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => applyInlineStyle('color', c.value)}
                          style={{ backgroundColor: c.value }}
                          className="w-7 h-7 rounded-lg border border-black/10 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                        />
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Custom Color</span>
                      <input
                        type="color"
                        value={rgbOrHexToHex(activeStyles.color)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => applyInlineStyle('color', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Highlighter Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setOpenDropdown(openDropdown === 'highlight' ? null : 'highlight')}
                  title="Highlight Color"
                  className="flex items-center gap-1 p-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Highlighter className="w-3.5 h-3.5 text-slate-700 dark:text-neutral-300" />
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20"
                    style={{ backgroundColor: activeStyles.highlight === 'transparent' ? '#fef08a' : activeStyles.highlight }}
                  />
                </button>

                {openDropdown === 'highlight' && (
                  <div className="absolute left-0 top-full mt-1 w-52 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-2.5 z-30 animate-in fade-in zoom-in-95">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Text Highlight</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {HIGHLIGHT_COLORS.map((h) => (
                        <button
                          key={h.name}
                          type="button"
                          title={h.name}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => applyHighlight(h.value)}
                          style={{ backgroundColor: h.value }}
                          className={`w-7 h-7 rounded-lg border border-slate-300 dark:border-white/20 shadow-xs hover:scale-110 transition-transform flex items-center justify-center text-[10px] font-bold cursor-pointer ${h.value === 'transparent' ? 'bg-slate-100 text-slate-500' : ''}`}
                        >
                          {h.value === 'transparent' ? '✕' : ''}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Custom Highlight</span>
                      <input
                        type="color"
                        value={activeStyles.highlight !== 'transparent' ? rgbOrHexToHex(activeStyles.highlight) : '#fef08a'}
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => applyHighlight(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Text Alignment Group */}
              <div className="flex items-center bg-white dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/80 dark:border-white/10 flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlignment('left')}
                  title="Align Left"
                  aria-label="Align Left"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.align === 'left' ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlignment('center')}
                  title="Align Center"
                  aria-label="Align Center"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.align === 'center' ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlignment('right')}
                  title="Align Right"
                  aria-label="Align Right"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.align === 'right' ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlignment('justify')}
                  title="Justify"
                  aria-label="Justify"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.align === 'justify' ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lists & Indentation Group */}
              <div className="flex items-center bg-white dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/80 dark:border-white/10 flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('insertUnorderedList')}
                  title="Bulleted List"
                  aria-label="Bulleted List"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.list === 'ul' ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('insertOrderedList')}
                  title="Numbered List"
                  aria-label="Numbered List"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeStyles.list === 'ol' ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('outdent')}
                  title="Decrease Indent"
                  aria-label="Decrease Indent"
                  className="p-1.5 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Outdent className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeCommand('indent')}
                  title="Increase Indent"
                  aria-label="Increase Indent"
                  className="p-1.5 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Indent className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Link Modal Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleOpenLinkModal}
                  title="Insert Hyperlink"
                  className="p-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-300 transition-colors cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'link' && (
                  <div className="absolute left-0 top-full mt-1 w-64 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-2 z-30 animate-in fade-in zoom-in-95">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Add Link</span>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={linkInputUrl}
                      onChange={(e) => setLinkInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyLink()}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setOpenDropdown(null)}
                        className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleApplyLink}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Formatting */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => executeCommand('removeFormat')}
                title="Clear Formatting"
                aria-label="Clear Formatting"
                className="p-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-300 transition-colors cursor-pointer flex-shrink-0"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Editable Rich-Text Canvas Area */}
            <div className="relative">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                onKeyUp={() => {
                  saveCurrentSelection();
                  updateActiveToolbarStates();
                }}
                onMouseUp={() => {
                  saveCurrentSelection();
                  updateActiveToolbarStates();
                }}
                onFocus={() => {
                  saveCurrentSelection();
                  updateActiveToolbarStates();
                }}
                className="w-full min-h-[300px] max-h-[480px] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-sm leading-relaxed transition-all prose dark:prose-invert max-w-none"
                style={{
                  fontFamily: getCssFontFamily(defaultFontFamily),
                }}
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
                onClick={handleLoadSample}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs cursor-pointer font-medium"
              >
                Load Sample Document
              </button>
            </div>
          </div>

          {/* Page Formatting & Global Typography Controls */}
          <div className="rounded-3xl p-4 sm:p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-neutral-300">
                  Page & Typography Controls
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

            {/* Tab 2: Document-Level Typography Defaults */}
            {activeSettingsTab === 'typography' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                      Default Font Family
                    </label>
                    <select
                      value={defaultFontFamily}
                      onChange={(e) => setDefaultFontFamily(e.target.value as FontFamilyOption)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Helvetica">Helvetica (Standard Sans)</option>
                      <option value="TimesRoman">Times New Roman (Serif)</option>
                      <option value="Courier">Courier (Monospace)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                      Default Text Alignment
                    </label>
                    <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => setDefaultTextAlign('left')}
                        aria-label="Align Left"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          defaultTextAlign === 'left' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefaultTextAlign('center')}
                        aria-label="Align Center"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          defaultTextAlign === 'center' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefaultTextAlign('right')}
                        aria-label="Align Right"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          defaultTextAlign === 'right' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefaultTextAlign('justify')}
                        aria-label="Justify"
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          defaultTextAlign === 'justify' 
                            ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-neutral-300">
                      <span>Base Font Size</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{defaultFontSize} pt</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={22}
                      step={1}
                      value={defaultFontSize}
                      onChange={(e) => setDefaultFontSize(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-neutral-300">
                      <span>Line Spacing</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{defaultLineSpacing}x</span>
                    </div>
                    <input
                      type="range"
                      min={1.1}
                      max={2.2}
                      step={0.1}
                      value={defaultLineSpacing}
                      onChange={(e) => setDefaultLineSpacing(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                      Default Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={defaultTextColor}
                        onChange={(e) => setDefaultTextColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={defaultTextColor}
                        onChange={(e) => setDefaultTextColor(e.target.value)}
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
          <div className="rounded-3xl p-4 sm:p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
            
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
                  {paginatedDoc.pages[currentPageIndex] && renderPreviewSheet(paginatedDoc.pages[currentPageIndex])}
                  
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
                  {paginatedDoc.pages.map((pageData) => (
                    <div key={`all-page-${pageData.pageIndex}`} className="space-y-1.5">
                      <div className="text-center text-[11px] font-mono font-semibold text-slate-500 dark:text-neutral-400">
                        Page {pageData.pageIndex + 1} of {paginatedDoc.pages.length}
                      </div>
                      {renderPreviewSheet(pageData)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prominent Download Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!stats.plainText.trim() || isProcessing}
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
                  download={pdfFileName || 'toolsbar-document.pdf'}
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
