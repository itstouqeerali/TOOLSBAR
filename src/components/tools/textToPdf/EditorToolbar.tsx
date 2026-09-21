import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Baseline,
  Highlighter,
  Undo2,
  Redo2,
  Minus,
  RemoveFormatting,
  ChevronDown,
  Palette,
  Indent,
  Outdent,
  Scissors,
  SlidersHorizontal,
} from 'lucide-react';
import { HIGHLIGHT_COLOR_PALETTE, TEXT_COLOR_PALETTE } from './types';

const PopoverMenu: React.FC<{
  anchorRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  children: React.ReactNode;
  width?: number;
}> = ({ anchorRef, isOpen, children, width = 224 }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const updatePosition = () => {
        if (!anchorRef.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        let top = rect.bottom + 6;
        let left = rect.left;

        if (top + 280 > window.innerHeight) {
          top = Math.max(10, rect.top - 280 - 6);
        }
        if (left + width > window.innerWidth) {
          left = window.innerWidth - width - 10;
        }
        if (left < 10) left = 10;

        setStyle({
          position: 'fixed',
          top,
          left,
          width,
          zIndex: 99999,
        });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, anchorRef, width]);

  if (!isOpen) return null;

  return createPortal(
    <div
      data-popover-menu="true"
      style={style}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-2 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100"
    >
      {children}
    </div>,
    document.body
  );
};

interface EditorToolbarProps {
  editor: Editor | null;
  lineSpacing?: number;
  onLineSpacingChange?: (spacing: number) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  lineSpacing = 1.4,
  onLineSpacingChange,
}) => {
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const [isHighlightOpen, setIsHighlightOpen] = useState(false);
  const [isFontFamilyOpen, setIsFontFamilyOpen] = useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isLineSpacingOpen, setIsLineSpacingOpen] = useState(false);

  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const fontFamilyRef = useRef<HTMLDivElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const lineSpacingRef = useRef<HTMLDivElement>(null);

  // Subscribe to editor state to keep toolbar completely reactive
  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
    };
  }, [editor]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest?.('[data-popover-menu]')) {
        return;
      }
      if (textColorRef.current && !textColorRef.current.contains(target)) {
        setIsTextColorOpen(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(target)) {
        setIsHighlightOpen(false);
      }
      if (fontFamilyRef.current && !fontFamilyRef.current.contains(target)) {
        setIsFontFamilyOpen(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(target)) {
        setIsFontSizeOpen(false);
      }
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(target)) {
        setIsLineSpacingOpen(false);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  if (!editor) {
    return null;
  }

  const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '12pt';
  const currentTextColor = editor.getAttributes('textStyle').color || '#0f172a';
  const currentHighlightColor = editor.getAttributes('highlight').color || 'transparent';

  const getFontFamilyLabel = () => {
    if (!currentFontFamily) return 'Font';
    if (currentFontFamily.includes('Times')) return 'Times';
    if (currentFontFamily.includes('Courier')) return 'Courier';
    return 'Helvetica';
  };

  const handleIncreaseIndent = () => {
    if (editor.can().sinkListItem('listItem')) {
      editor.chain().focus().sinkListItem('listItem').run();
    }
  };

  const handleDecreaseIndent = () => {
    if (editor.can().liftListItem('listItem')) {
      editor.chain().focus().liftListItem('listItem').run();
    }
  };

  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/70 shadow-2xl rounded-2xl p-1.5 sm:p-2 flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none z-30 select-none">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Block formatting */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setParagraph().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('paragraph')
              ? 'bg-indigo-600 text-white font-medium'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Paragraph / Normal Text"
        >
          <Type className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-indigo-600 text-white font-medium'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-indigo-600 text-white font-medium'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-indigo-600 text-white font-medium'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Font Family Dropdown */}
      <div className="relative shrink-0" ref={fontFamilyRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsFontFamilyOpen(!isFontFamilyOpen);
            setIsFontSizeOpen(false);
            setIsTextColorOpen(false);
            setIsHighlightOpen(false);
            setIsLineSpacingOpen(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
          title="Font Family"
        >
          <span className="truncate max-w-[70px] sm:max-w-[85px]">{getFontFamilyLabel()}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <PopoverMenu anchorRef={fontFamilyRef} isOpen={isFontFamilyOpen} width={180}>
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              Font Family
            </div>
            {[
              { label: 'Helvetica (Sans)', value: 'Helvetica, Arial, sans-serif' },
              { label: 'Times Roman (Serif)', value: '"Times New Roman", Times, serif' },
              { label: 'Courier (Mono)', value: 'Courier, monospace' },
            ].map((font) => (
              <button
                key={font.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setFontFamily(font.value).run();
                  setIsFontFamilyOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  currentFontFamily === font.value
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{font.label}</span>
              </button>
            ))}
          </div>
        </PopoverMenu>
      </div>

      {/* Font Size Dropdown */}
      <div className="relative shrink-0" ref={fontSizeRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsFontSizeOpen(!isFontSizeOpen);
            setIsFontFamilyOpen(false);
            setIsTextColorOpen(false);
            setIsHighlightOpen(false);
            setIsLineSpacingOpen(false);
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
          title="Font Size"
        >
          <span>{currentFontSize}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <PopoverMenu anchorRef={fontSizeRef} isOpen={isFontSizeOpen} width={120}>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              Size
            </div>
            {['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '28pt', '36pt'].map(
              (size) => (
                <button
                  key={size}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setFontSize(size).run();
                    setIsFontSizeOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    currentFontSize === size
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{size}</span>
                </button>
              )
            )}
          </div>
        </PopoverMenu>
      </div>

      {/* Inline Marks: Bold, Italic, Underline, Strikethrough */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-indigo-600 text-white font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('underline')
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('strike')
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Text Color Popover */}
      <div className="relative shrink-0" ref={textColorRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsTextColorOpen(!isTextColorOpen);
            setIsHighlightOpen(false);
            setIsFontFamilyOpen(false);
            setIsFontSizeOpen(false);
            setIsLineSpacingOpen(false);
          }}
          className="flex items-center gap-1 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Text Color"
        >
          <div className="relative flex flex-col items-center">
            <Baseline className="w-4 h-4" />
            <div
              className="w-3.5 h-1 rounded-xs mt-0.5 shadow-xs"
              style={{ backgroundColor: currentTextColor }}
            />
          </div>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <PopoverMenu anchorRef={textColorRef} isOpen={isTextColorOpen} width={220}>
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300">Text Color</span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().unsetColor().run();
                  setIsTextColorOpen(false);
                }}
                className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor(color.value).run();
                    setIsTextColorOpen(false);
                  }}
                  className="w-7 h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform relative flex items-center justify-center cursor-pointer shadow-xs"
                  style={{ backgroundColor: color.value }}
                >
                  {currentTextColor === color.value && (
                    <div className="w-2 h-2 rounded-full bg-white shadow-md ring-1 ring-black/40" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </PopoverMenu>
      </div>

      {/* Highlight Color Popover */}
      <div className="relative shrink-0" ref={highlightRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsHighlightOpen(!isHighlightOpen);
            setIsTextColorOpen(false);
            setIsFontFamilyOpen(false);
            setIsFontSizeOpen(false);
            setIsLineSpacingOpen(false);
          }}
          className="flex items-center gap-1 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Highlight Color"
        >
          <div className="relative flex flex-col items-center">
            <Highlighter className="w-4 h-4" />
            <div
              className="w-3.5 h-1 rounded-xs mt-0.5 shadow-xs"
              style={{
                backgroundColor:
                  currentHighlightColor === 'transparent' ? '#fde047' : currentHighlightColor,
              }}
            />
          </div>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <PopoverMenu anchorRef={highlightRef} isOpen={isHighlightOpen} width={220}>
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300">Highlight Color</span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().unsetHighlight().run();
                  setIsHighlightOpen(false);
                }}
                className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {HIGHLIGHT_COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (color.value === 'transparent') {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().setHighlight({ color: color.value }).run();
                    }
                    setIsHighlightOpen(false);
                  }}
                  className={`w-7 h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform relative flex items-center justify-center cursor-pointer shadow-xs ${
                    color.value === 'transparent' ? 'bg-slate-800 text-slate-400 text-[10px]' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {color.value === 'transparent' && '✕'}
                  {currentHighlightColor === color.value && color.value !== 'transparent' && (
                    <div className="w-2 h-2 rounded-full bg-slate-900 shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </PopoverMenu>
      </div>

      {/* Alignment: Left, Center, Right, Justify */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('left').run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: 'left' })
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('center').run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: 'center' })
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('right').run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: 'right' })
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('justify').run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: 'justify' })
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Align Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Lists & Indentation */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleDecreaseIndent();
          }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30"
          title="Decrease Indent"
        >
          <Outdent className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleIncreaseIndent();
          }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30"
          title="Increase Indent"
        >
          <Indent className="w-4 h-4" />
        </button>
      </div>

      {/* Line Spacing Dropdown */}
      <div className="relative shrink-0 pr-1.5 border-r border-slate-700/60" ref={lineSpacingRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsLineSpacingOpen(!isLineSpacingOpen);
            setIsFontFamilyOpen(false);
            setIsFontSizeOpen(false);
            setIsTextColorOpen(false);
            setIsHighlightOpen(false);
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
          title="Line Spacing"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 opacity-80" />
          <span>{lineSpacing}x</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <PopoverMenu anchorRef={lineSpacingRef} isOpen={isLineSpacingOpen} width={150}>
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              Line Spacing
            </div>
            {[
              { label: '1.0 Single', value: 1.0 },
              { label: '1.15 Tight', value: 1.15 },
              { label: '1.4 Standard', value: 1.4 },
              { label: '2.0 Double', value: 2.0 },
            ].map((spacing) => (
              <button
                key={spacing.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onLineSpacingChange?.(spacing.value);
                  setIsLineSpacingOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  lineSpacing === spacing.value
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{spacing.label}</span>
              </button>
            ))}
          </div>
        </PopoverMenu>
      </div>

      {/* Manual Page Break Button */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setPageBreak().run();
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
          title="Insert Manual Page Break (Ctrl+Enter)"
        >
          <Scissors className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Page Break</span>
        </button>
      </div>

      {/* Divider & Clear Formatting */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setHorizontalRule().run();
          }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Insert Horizontal Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetAllMarks().clearNodes().run();
          }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
