import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, X, ArrowRight, Sparkles, Command, CornerDownLeft, 
  Percent, Calendar, FileText, Type, CaseSensitive, Code2, 
  Binary, Scale, QrCode, KeyRound, Activity, Tag, BarChart3, 
  Split, Landmark, TrendingUp, CreditCard, Receipt, ListFilter, 
  AlignLeft, ArrowUpDown, Link2, Minimize2, Globe, Fingerprint, 
  ShieldCheck, HardDrive, Thermometer, FileSpreadsheet, Image, 
  Maximize2, Palette, Clock, Layers, Scissors, FileCode, FileImage 
} from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { Tool } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Percent,
  Calendar,
  FileText,
  Type,
  CaseSensitive,
  Code2,
  Binary,
  Scale,
  QrCode,
  KeyRound,
  Activity,
  Tag,
  BarChart3,
  Split,
  Landmark,
  TrendingUp,
  CreditCard,
  Receipt,
  ListFilter,
  AlignLeft,
  ArrowUpDown,
  Link2,
  Minimize2,
  Globe,
  Fingerprint,
  Search,
  ShieldCheck,
  HardDrive,
  Thermometer,
  FileSpreadsheet,
  Image,
  Maximize2,
  Palette,
  Sparkles,
  Layers,
  Scissors,
  FileCode,
  FileImage,
  Clock,
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and reset query on open, manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Global key listener for ESC when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered tools with fuzzy keyword ranking
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Prioritize popular and ready tools when no query is entered
      return TOOLS.filter(t => t.isImplemented).slice(0, 8);
    }

    return TOOLS.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchCat = tool.category.toLowerCase().includes(q);
      const matchSlug = tool.slug.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchCat || matchSlug || matchKeywords;
    }).slice(0, 12);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        onSelectTool(results[selectedIndex].slug);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="search-modal-container"
        className="w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-[#090b12]/95 border border-slate-200 dark:border-white/[0.12] backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto sm:my-0 cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center gap-3 bg-slate-50/60 dark:bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search all 43 tools (pdf, image, json, code, jwt, hash, qr, emi)..."
            className="w-full bg-transparent text-slate-900 dark:text-white text-base sm:text-lg placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none font-medium selection:bg-indigo-500/40"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              onClick={() => { setQuery(''); setSelectedIndex(0); inputRef.current?.focus(); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Clear text"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Explicit, Touch-Friendly Close Button */}
          <button
            onClick={onClose}
            id="search-close-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer shrink-0 text-xs font-semibold"
            aria-label="Close search overlay"
            title="Close search (Esc)"
          >
            <span className="hidden sm:inline">Close</span>
            <kbd className="hidden sm:inline-flex text-[10px] font-mono bg-slate-200 dark:bg-black/40 text-slate-600 dark:text-neutral-400 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10">
              ESC
            </kbd>
            <X className="w-4 h-4 sm:hidden text-slate-600 dark:text-neutral-300" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2.5 sm:p-3 space-y-1.5 flex-1 min-h-[160px] max-h-[55vh]">
          {results.length > 0 ? (
            results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const cat = CATEGORIES.find(c => c.id === tool.category);
              const IconComponent = (tool.icon && ICON_MAP[tool.icon]) || Sparkles;

              return (
                <div
                  key={tool.id}
                  id={`search-result-${tool.slug}`}
                  onClick={() => { onSelectTool(tool.slug); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-sm dark:bg-indigo-600/25 dark:border-indigo-500/40 dark:text-white dark:shadow-lg'
                      : 'hover:bg-slate-100/80 text-slate-700 border border-transparent dark:hover:bg-white/5 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-white/10'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                            {tool.badge}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 dark:text-neutral-400 truncate hidden sm:inline">
                          &bull; {cat?.name || tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 truncate max-w-sm sm:max-w-md">{tool.shortDesc || tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected && (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-mono hidden sm:flex items-center gap-1">
                        Open <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' : 'text-slate-400 dark:text-neutral-500'}`} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-neutral-400 text-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400 dark:text-neutral-500">
                <Search className="w-5 h-5" />
              </div>
              <p>No utilities found for "<span className="text-slate-900 dark:text-white font-medium">{query}</span>"</p>
              <p className="text-xs text-slate-400 dark:text-neutral-500">Try searching for keywords like "math", "text", "hash", "date", or "json"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts & exit prompt */}
        <div className="p-3 bg-slate-50/90 dark:bg-black/50 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline">Navigate: <kbd className="font-mono bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-neutral-400 px-1 py-0.5 rounded border border-slate-300 dark:border-white/10">↑</kbd> <kbd className="font-mono bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-neutral-400 px-1 py-0.5 rounded border border-slate-300 dark:border-white/10">↓</kbd></span>
            <span className="hidden sm:inline">&bull;</span>
            <span><kbd className="font-mono bg-slate-200/80 dark:bg-white/5 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10 text-slate-700 dark:text-neutral-300">↵ Enter</kbd> to open</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden xs:inline text-slate-400 dark:text-neutral-500">100% private in-browser</span>
            <button
              onClick={onClose}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold cursor-pointer underline-offset-2 hover:underline"
            >
              Exit search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
