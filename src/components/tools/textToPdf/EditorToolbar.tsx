import React from 'react';
import { Editor } from '@tiptap/react';
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
  RemoveFormatting,
  ChevronDown,
} from 'lucide-react';
import { HIGHLIGHT_COLOR_PALETTE, TEXT_COLOR_PALETTE } from './types';

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none z-30 select-none">
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive('paragraph') ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive('heading', { level: 1 }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive('heading', { level: 2 }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive('heading', { level: 3 }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
        <div className="relative group">
          <button
            type="button"
            className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-200 bg-white/5 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
          >
            <span>
              {editor.getAttributes('textStyle').fontFamily === '"Times New Roman", serif'
                ? 'Times'
                : editor.getAttributes('textStyle').fontFamily === 'Courier, monospace'
                ? 'Courier'
                : 'Helvetica'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 shadow-xl rounded-xl p-1 w-32 text-xs text-slate-200 z-50">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setFontFamily('Helvetica, sans-serif').run();
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-sans"
            >
              Helvetica
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setFontFamily('"Times New Roman", serif').run();
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-serif"
            >
              Times
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setFontFamily('Courier, monospace').run();
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-white/10 font-mono"
            >
              Courier
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg font-bold ${
            editor.isActive('bold') ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg italic ${
            editor.isActive('italic') ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg underline ${
            editor.isActive('underline') ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
         {/* Native color picker for text color */}
         <div className="relative flex items-center p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors" title="Text Color">
           <Baseline className="w-4 h-4" />
           <input 
             type="color" 
             className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
             onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
             value={editor.getAttributes('textStyle').color || '#000000'}
           />
         </div>
         {/* Native color picker for highlight color */}
         <div className="relative flex items-center p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors" title="Highlight">
           <Highlighter className="w-4 h-4" />
           <input 
             type="color" 
             className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
             onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
             value={editor.getAttributes('highlight').color || '#ffff00'}
           />
         </div>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/60">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive('bulletList') ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg ${
            editor.isActive('orderedList') ? 'bg-white/10 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
