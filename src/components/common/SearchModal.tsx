import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ArrowRight, Sparkles, Command, CornerDownLeft, 
  Wrench, ExternalLink, Bot, Layers, ArrowUpRight 
} from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { getCachedAiTools } from '../../services/aiToolsService';
import { AI_CATEGORIES } from '../../data/aiCategories';
import { AiTool } from '../../types/aiTools';
import { Tool } from '../../types';
import { AiToolLogo } from './AiToolLogo';

interface SearchModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onSelectTool?: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  initialQuery = '',
  onClose, 
  onNavigate,
  onSelectTool 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiTools = useMemo(() => getCachedAiTools(false), [isOpen]);
  const nativeTools = useMemo(() => TOOLS.filter((t) => t.isImplemented), []);

  // Focus input and set initial query on open, manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || '');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        if (initialQuery) {
          inputRef.current?.select();
        }
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, initialQuery]);

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

  // Combined search results grouped into AI Tools and Native Utilities
  const { matchingAiTools, matchingUtilities } = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        matchingAiTools: aiTools.filter((t) => t.isFeatured).slice(0, 5),
        matchingUtilities: nativeTools.slice(0, 4)
      };
    }

    const terms = q.split(/\s+/).filter(Boolean);

    const ai = aiTools.filter((t) => {
      const fullText = [
        t.name,
        t.shortDescription,
        t.fullDescription,
        t.primaryCategory,
        ...(t.categories || []),
        ...(t.tags || []),
        ...(t.bestFor || []),
        ...(t.useCases || []),
        ...(t.keyFeatures || [])
      ].join(' ').toLowerCase();

      return fullText.includes(q) || terms.every((term) => fullText.includes(term));
    }).slice(0, 8);

    const utils = nativeTools.filter((tool) => {
      const fullText = [
        tool.name,
        tool.description,
        tool.shortDesc || '',
        tool.category,
        ...(tool.keywords || [])
      ].join(' ').toLowerCase();

      return fullText.includes(q) || terms.every((term) => fullText.includes(term));
    }).slice(0, 6);

    return {
      matchingAiTools: ai,
      matchingUtilities: utils
    };
  }, [query, aiTools, nativeTools]);

  const allResults = useMemo(() => {
    return [
      ...matchingAiTools.map((t) => ({ type: 'ai' as const, item: t, path: `ai-tools/${t.slug}` })),
      ...matchingUtilities.map((u) => ({ type: 'utility' as const, item: u, path: `tools/${u.slug}` }))
    ];
  }, [matchingAiTools, matchingUtilities]);

  const handleSelect = (path: string, legacySlug?: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (onSelectTool && legacySlug) {
      onSelectTool(legacySlug);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        const selected = allResults[selectedIndex];
        handleSelect(selected.path, (selected.item as any).slug);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="search-modal-backdrop"
          id="search-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/80 backdrop-blur-md cursor-pointer overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            key="search-modal-container"
            id="search-modal-container"
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl rounded-3xl glass-popover border border-slate-200/90 dark:border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto sm:my-0 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center gap-3 bg-white/40 dark:bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search AI tools, utilities, or describe what you want to do..."
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

          <button
            onClick={onClose}
            id="search-close-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-button text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer shrink-0 text-xs font-semibold"
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
        <div className="overflow-y-auto p-3 sm:p-4 space-y-4 flex-1 min-h-[160px] max-h-[60vh]">
          {allResults.length > 0 ? (
            <>
              {/* Group 1: AI Tools Discovery */}
              {matchingAiTools.length > 0 && (
                <div className="space-y-1.5">
                  <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> AI Tools Discovery
                    </span>
                    <span>{matchingAiTools.length} found</span>
                  </div>

                  {matchingAiTools.map((tool, idx) => {
                    const itemIndex = idx;
                    const isSelected = itemIndex === selectedIndex;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleSelect(`ai-tools/${tool.slug}`, tool.slug)}
                        className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1 shrink-0 ${
                            isSelected ? 'bg-white/20' : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 shadow-xs'
                          }`}>
                            <AiToolLogo slug={tool.slug} name={tool.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm truncate">{tool.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-400'
                              }`}>
                                {tool.pricingType}
                              </span>
                            </div>
                            <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-neutral-400'}`}>
                              {tool.shortDescription}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-slate-400'}`} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Group 2: Native Built-in Utilities */}
              {matchingUtilities.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                  <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-3 h-3" /> Toolsbar Native Utilities
                    </span>
                    <span>{matchingUtilities.length} found</span>
                  </div>

                  {matchingUtilities.map((utility, idx) => {
                    const itemIndex = matchingAiTools.length + idx;
                    const isSelected = itemIndex === selectedIndex;
                    return (
                      <div
                        key={utility.id}
                        onClick={() => handleSelect(`tools/${utility.slug}`, utility.slug)}
                        className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-white/10'
                          }`}>
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm truncate">{utility.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              }`}>
                                Built-In Tool
                              </span>
                            </div>
                            <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-neutral-400'}`}>
                              {utility.shortDesc}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-slate-400'}`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                No matching tools found for "{query}"
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Try searching for broad tasks like "video", "image", "coding", "pdf", or "calc".
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Hotkeys */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-black/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px]">Up</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px]">Down</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px]">Enter</kbd>
              <span className="ml-1">Select</span>
            </span>
          </div>
          <span>Esc to exit</span>
        </div>
      </motion.div>
    </motion.div>
    )}
  </AnimatePresence>
  );
};
