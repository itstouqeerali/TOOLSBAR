import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold,
  Italic,
  Underline,
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
  FilePlus2,
  RemoveFormatting,
  ChevronDown,
  Palette,
} from 'lucide-react';
import {
  BlockType,
  FontFamilyOption,
  FONT_SIZE_PRESETS,
  HIGHLIGHT_COLOR_PALETTE,
  TextAlignOption,
  TEXT_COLOR_PALETTE,
} from './types';

interface ToolbarProps {
  onApplyStyle: (options: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    colorHex?: string;
    bgColorHex?: string | null;
    fontFamily?: FontFamilyOption;
    fontSizePt?: number;
  }) => void;
  onApplyBlockType: (type: BlockType) => void;
  onApplyAlign: (align: TextAlignOption) => void;
  onInsertPageBreak: () => void;
  onInsertHr: () => void;
  onClearFormatting: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentFontFamily: FontFamilyOption;
  currentFontSize: number;
  currentBlockType: BlockType;
  currentAlign: TextAlignOption;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onApplyStyle,
  onApplyBlockType,
  onApplyAlign,
  onInsertPageBreak,
  onInsertHr,
  onClearFormatting,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  currentFontFamily,
  currentFontSize,
  currentBlockType,
  currentAlign,
}) => {
  // Popover states
  const [activePopover, setActivePopover] = useState<
    'font' | 'size' | 'heading' | 'color' | 'highlight' | null
  >(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const fontBtnRef = useRef<HTMLButtonElement>(null);
  const sizeBtnRef = useRef<HTMLButtonElement>(null);
  const headingBtnRef = useRef<HTMLButtonElement>(null);
  const colorBtnRef = useRef<HTMLButtonElement>(null);
  const highlightBtnRef = useRef<HTMLButtonElement>(null);

  const togglePopover = (
    name: 'font' | 'size' | 'heading' | 'color' | 'highlight',
    btnRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    if (activePopover === name) {
      setActivePopover(null);
      return;
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - 240);
      setPopoverPos({
        top: rect.bottom + 6,
        left,
      });
      setActivePopover(name);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.toolbar-popover-content') && !target.closest('.toolbar-popover-trigger')) {
        setActivePopover(null);
      }
    };
    if (activePopover) {
      window.addEventListener('mousedown', handleGlobalClick);
      return () => window.removeEventListener('mousedown', handleGlobalClick);
    }
  }, [activePopover]);

  return (
    <div className="w-full bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-xl p-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none z-30 select-none">
      <div className="flex items-center gap-1 min-w-max">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onMouseDown={(e) => {
              e.preventDefault();
              onUndo();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onMouseDown={(e) => {
              e.preventDefault();
              onRedo();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Heading Style Dropdown */}
        <div className="pr-1.5 border-r border-slate-700/60">
          <button
            ref={headingBtnRef}
            type="button"
            title="Paragraph Style"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePopover('heading', headingBtnRef);
            }}
            className="toolbar-popover-trigger px-2.5 py-1 text-xs font-medium rounded-lg text-slate-200 bg-white/5 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
          >
            <span>
              {currentBlockType === 'h1'
                ? 'Heading 1'
                : currentBlockType === 'h2'
                ? 'Heading 2'
                : currentBlockType === 'h3'
                ? 'Heading 3'
                : 'Normal'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Font Family Dropdown */}
        <div className="pr-1.5 border-r border-slate-700/60">
          <button
            ref={fontBtnRef}
            type="button"
            title="Font Family"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePopover('font', fontBtnRef);
            }}
            className="toolbar-popover-trigger px-2.5 py-1 text-xs font-medium rounded-lg text-slate-200 bg-white/5 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
          >
            <span>
              {currentFontFamily === 'TimesRoman'
                ? 'Times'
                : currentFontFamily === 'Courier'
                ? 'Courier'
                : 'Helvetica'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Font Size Dropdown */}
        <div className="pr-1.5 border-r border-slate-700/60">
          <button
            ref={sizeBtnRef}
            type="button"
            title="Font Size"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePopover('size', sizeBtnRef);
            }}
            className="toolbar-popover-trigger px-2 py-1 text-xs font-medium rounded-lg text-slate-200 bg-white/5 hover:bg-white/10 flex items-center gap-1 transition-colors min-w-[42px] justify-center"
          >
            <span>{currentFontSize}pt</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Inline Formatting: Bold, Italic, Underline */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyStyle({ bold: true });
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyStyle({ italic: true });
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyStyle({ underline: true });
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color & Highlight Popover Triggers */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
          <button
            ref={colorBtnRef}
            type="button"
            title="Text Color"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePopover('color', colorBtnRef);
            }}
            className="toolbar-popover-trigger p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1 transition-colors"
          >
            <Baseline className="w-4 h-4 text-rose-400" />
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          <button
            ref={highlightBtnRef}
            type="button"
            title="Text Highlight"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePopover('highlight', highlightBtnRef);
            }}
            className="toolbar-popover-trigger p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1 transition-colors"
          >
            <Highlighter className="w-4 h-4 text-yellow-300" />
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
          <button
            type="button"
            title="Align Left"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyAlign('left');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlign === 'left' ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Align Center"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyAlign('center');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlign === 'center' ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Align Right"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyAlign('right');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlign === 'right' ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Justify"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyAlign('justify');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlign === 'justify' ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Structure */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
          <button
            type="button"
            title="Bullet List"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyBlockType(currentBlockType === 'bullet' ? 'p' : 'bullet');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              currentBlockType === 'bullet' ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onMouseDown={(e) => {
              e.preventDefault();
              onApplyBlockType(currentBlockType === 'number' ? 'p' : 'number');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              currentBlockType === 'number' ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Page Break & Divider */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
          <button
            type="button"
            title="Insert Page Break"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsertPageBreak();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1 text-xs transition-colors"
          >
            <FilePlus2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Page Break</span>
          </button>
          <button
            type="button"
            title="Horizontal Divider Rule"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsertHr();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Formatting */}
        <div>
          <button
            type="button"
            title="Clear Formatting"
            onMouseDown={(e) => {
              e.preventDefault();
              onClearFormatting();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PORTAL POPOVERS (Guaranteed to render above all canvases and never be cut off) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            {/* Heading Style Popover */}
            {activePopover === 'heading' && (
              <div
                className="toolbar-popover-content fixed z-[99999] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-1 w-44 flex flex-col gap-0.5 text-xs text-slate-200"
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyBlockType('p');
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 flex items-center gap-2"
                >
                  <Type className="w-4 h-4 text-slate-400" />
                  <span>Normal Text</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyBlockType('h1');
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-bold text-sm flex items-center gap-2"
                >
                  <Heading1 className="w-4 h-4 text-indigo-400" />
                  <span>Heading 1</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyBlockType('h2');
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-semibold flex items-center gap-2"
                >
                  <Heading2 className="w-4 h-4 text-indigo-400" />
                  <span>Heading 2</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyBlockType('h3');
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-medium flex items-center gap-2"
                >
                  <Heading3 className="w-4 h-4 text-indigo-400" />
                  <span>Heading 3</span>
                </button>
              </div>
            )}

            {/* Font Family Popover */}
            {activePopover === 'font' && (
              <div
                className="toolbar-popover-content fixed z-[99999] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-1 w-44 flex flex-col gap-0.5 text-xs text-slate-200"
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyStyle({ fontFamily: 'Helvetica' });
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-sans"
                >
                  Helvetica (Sans-Serif)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyStyle({ fontFamily: 'TimesRoman' });
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-serif"
                >
                  Times New Roman (Serif)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onApplyStyle({ fontFamily: 'Courier' });
                    setActivePopover(null);
                  }}
                  className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-mono"
                >
                  Courier (Monospace)
                </button>
              </div>
            )}

            {/* Font Size Popover */}
            {activePopover === 'size' && (
              <div
                className="toolbar-popover-content fixed z-[99999] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-1.5 w-48 max-h-60 overflow-y-auto grid grid-cols-3 gap-1 text-xs text-slate-200"
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
              >
                {FONT_SIZE_PRESETS.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onApplyStyle({ fontSizePt: pt });
                      setActivePopover(null);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-center font-mono hover:bg-white/10 transition-colors ${
                      currentFontSize === pt ? 'bg-indigo-600 text-white font-bold' : ''
                    }`}
                  >
                    {pt}pt
                  </button>
                ))}
              </div>
            )}

            {/* Text Color Popover */}
            {activePopover === 'color' && (
              <div
                className="toolbar-popover-content fixed z-[99999] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-3 w-60 text-slate-200"
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
              >
                <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Text Color
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TEXT_COLOR_PALETTE.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onApplyStyle({ colorHex: c.value });
                        setActivePopover(null);
                      }}
                      className="group flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-slate-600 shadow-sm group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.value }}
                      />
                      <span className="text-[9px] text-slate-400 group-hover:text-slate-200 truncate max-w-full">
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Highlight Color Popover */}
            {activePopover === 'highlight' && (
              <div
                className="toolbar-popover-content fixed z-[99999] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-3 w-64 text-slate-200"
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
              >
                <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Text Highlight
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {HIGHLIGHT_COLOR_PALETTE.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onApplyStyle({ bgColorHex: c.value });
                        setActivePopover(null);
                      }}
                      className="group flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                    >
                      <div
                        className="w-5 h-5 rounded border border-slate-600 shadow-sm shrink-0 flex items-center justify-center text-[10px]"
                        style={{
                          backgroundColor: c.value === 'transparent' ? '#1e293b' : c.value,
                        }}
                      >
                        {c.value === 'transparent' && '✕'}
                      </div>
                      <span className="text-[11px] text-slate-300 truncate">{c.label || c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>,
          document.body
        )}
    </div>
  );
};
