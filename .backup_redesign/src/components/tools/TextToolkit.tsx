import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Type, ListFilter, Link2, Sparkles, Hash, AlignLeft, Scissors } from 'lucide-react';
import { WordCounter } from './WordCounter';
import { CharacterCounter } from './CharacterCounter';
import { CaseConverter } from './CaseConverter';
import { RemoveDuplicateLines } from './RemoveDuplicateLines';
import { RemoveExtraSpaces } from './RemoveExtraSpaces';
import { TextSorter } from './TextSorter';
import { SlugGenerator } from './SlugGenerator';
import { LoremIpsumGenerator } from './LoremIpsumGenerator';

type TextTab = 'counter' | 'case' | 'clean' | 'slug' | 'lorem';
type CounterSubTab = 'words' | 'characters';
type CleanSubTab = 'duplicates' | 'spaces' | 'sort';

export const TextToolkit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialState = (): { tab: TextTab; counterSub: CounterSubTab; cleanSub: CleanSubTab } => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toLowerCase();

    if (tabParam === 'character' || tabParam === 'character-counter' || tabParam === 'social') {
      return { tab: 'counter', counterSub: 'characters', cleanSub: 'duplicates' };
    }
    if (tabParam === 'words' || tabParam === 'word-counter' || tabParam === 'counter') {
      return { tab: 'counter', counterSub: 'words', cleanSub: 'duplicates' };
    }
    if (tabParam === 'case' || tabParam === 'case-converter') {
      return { tab: 'case', counterSub: 'words', cleanSub: 'duplicates' };
    }
    if (tabParam === 'spaces' || tabParam === 'remove-extra-spaces' || tabParam === 'whitespace') {
      return { tab: 'clean', counterSub: 'words', cleanSub: 'spaces' };
    }
    if (tabParam === 'sort' || tabParam === 'text-sorter' || tabParam === 'order') {
      return { tab: 'clean', counterSub: 'words', cleanSub: 'sort' };
    }
    if (tabParam === 'clean' || tabParam === 'duplicates' || tabParam === 'remove-duplicate-lines') {
      return { tab: 'clean', counterSub: 'words', cleanSub: 'duplicates' };
    }
    if (tabParam === 'slug' || tabParam === 'slug-generator' || tabParam === 'url-slug') {
      return { tab: 'slug', counterSub: 'words', cleanSub: 'duplicates' };
    }
    if (tabParam === 'lorem' || tabParam === 'lorem-ipsum' || tabParam === 'lorem-ipsum-generator' || tabParam === 'placeholder') {
      return { tab: 'lorem', counterSub: 'words', cleanSub: 'duplicates' };
    }

    return { tab: 'counter', counterSub: 'words', cleanSub: 'duplicates' };
  };

  const [activeTab, setActiveTab] = useState<TextTab>(() => getInitialState().tab);
  const [counterSubTab, setCounterSubTab] = useState<CounterSubTab>(() => getInitialState().counterSub);
  const [cleanSubTab, setCleanSubTab] = useState<CleanSubTab>(() => getInitialState().cleanSub);

  useEffect(() => {
    const next = getInitialState();
    setActiveTab(next.tab);
    setCounterSubTab(next.counterSub);
    setCleanSubTab(next.cleanSub);
  }, [location.search]);

  const handleTabChange = (tab: TextTab) => {
    setActiveTab(tab);
    navigate(`/tools/text-toolkit?tab=${tab}`, { replace: true });
  };

  const handleCounterSubTabChange = (sub: CounterSubTab) => {
    setCounterSubTab(sub);
    navigate(`/tools/text-toolkit?tab=${sub === 'characters' ? 'character-counter' : 'word-counter'}`, { replace: true });
  };

  const handleCleanSubTabChange = (sub: CleanSubTab) => {
    setCleanSubTab(sub);
    const mapping: Record<CleanSubTab, string> = {
      duplicates: 'remove-duplicate-lines',
      spaces: 'remove-extra-spaces',
      sort: 'text-sorter',
    };
    navigate(`/tools/text-toolkit?tab=${mapping[sub]}`, { replace: true });
  };

  return (
    <div className="space-y-8" id="text-toolkit-workspace">
      {/* Workspace Navigation Bar */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>Text & Content Toolkit</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-black/40 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-x-auto">
          {[
            { id: 'counter', label: 'Word & Character Metrics', icon: Hash },
            { id: 'case', label: 'Case Converter', icon: Type },
            { id: 'clean', label: 'Clean & Sort Lines', icon: ListFilter },
            { id: 'slug', label: 'Slug Generator', icon: Link2 },
            { id: 'lorem', label: 'Lorem Ipsum', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TextTab)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter Sub-Bar */}
      {activeTab === 'counter' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'words', label: 'Comprehensive Word & Reading Stats' },
            { id: 'characters', label: 'Character Counter & Social Limits' },
          ].map((sub) => {
            const isSubActive = counterSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleCounterSubTabChange(sub.id as CounterSubTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Clean Sub-Bar */}
      {activeTab === 'clean' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'duplicates', label: 'Remove Duplicate Lines' },
            { id: 'spaces', label: 'Remove Extra Whitespace' },
            { id: 'sort', label: 'Sort Lines Alphabetically' },
          ].map((sub) => {
            const isSubActive = cleanSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleCleanSubTabChange(sub.id as CleanSubTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Workspace View */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'counter' && (
          <>
            {counterSubTab === 'words' && <WordCounter />}
            {counterSubTab === 'characters' && <CharacterCounter />}
          </>
        )}
        {activeTab === 'case' && <CaseConverter />}
        {activeTab === 'clean' && (
          <>
            {cleanSubTab === 'duplicates' && <RemoveDuplicateLines />}
            {cleanSubTab === 'spaces' && <RemoveExtraSpaces />}
            {cleanSubTab === 'sort' && <TextSorter />}
          </>
        )}
        {activeTab === 'slug' && <SlugGenerator />}
        {activeTab === 'lorem' && <LoremIpsumGenerator />}
      </div>
    </div>
  );
};
