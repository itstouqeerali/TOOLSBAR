import React from 'react';
import { Shield, Zap, Lock, Heart, Github, Twitter } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { ToolsbarLogo } from './ToolsbarLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="glass-panel border-x-0 border-b-0 mt-16 sm:mt-24 py-10 sm:py-16 text-slate-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-6 sm:gap-x-10 gap-y-8 sm:gap-y-10 pb-8 sm:pb-12 border-b border-slate-200 dark:border-white/5">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-600/20">
                <div className="w-full h-full bg-white dark:bg-[#0c0e18] rounded-[11px] flex items-center justify-center p-1.5">
                  <ToolsbarLogo className="w-full h-full text-indigo-600 dark:text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display text-slate-900 dark:text-white leading-none">Toolsbar</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-400 tracking-wider mt-0.5">AI Discovery + Utilities</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              A modern AI tools discovery platform to find software for any task, paired with 12 powerful native utilities running locally in your browser with zero data storage.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Direct Official Links
              </span>
            </div>
          </div>

          {/* AI Tools Discovery */}
          <div className="col-span-1 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-900 dark:text-white block">Discover AI</span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('ai-tools')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer text-left">
                  All AI Tools Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/chat-assistants')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Chat & Assistants
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/image-generation')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Image Generation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/video-generation')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Video Generation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/coding-development')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Coding & Dev
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/writing-content')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Writing & Content
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/study-research')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Study & Research
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools/design-presentations')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Design & Slides
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Tools */}
          <div className="col-span-1 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-900 dark:text-white block">Built-In Utilities</span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('tools')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer text-left">
                  All 12 Flagships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/text-to-pdf')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Text to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/images-to-pdf')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Images to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/pdf-toolkit')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  PDF Toolkit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/image-toolkit')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Image Toolkit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/percentage-calculator')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/finance-calculator')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Finance Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/json-studio')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  JSON Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/developer-toolbox')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  Developer Toolbox
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-3 text-center sm:text-left pt-2 sm:pt-0 border-t border-slate-200/60 dark:border-white/[0.04] sm:border-0">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-900 dark:text-white block">Legal & Privacy</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start sm:flex-col sm:items-start gap-x-4 gap-y-2 sm:gap-y-2 text-xs">
              <button onClick={() => onNavigate('privacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </button>
              <button onClick={() => onNavigate('contact')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                Contact Support
              </button>
            </div>
            <div className="pt-2 sm:pt-1 text-[11px] sm:text-xs text-slate-500 dark:text-neutral-500 flex flex-col items-center sm:items-start gap-1">
              <span>Zero data upload on browser tools</span>
              <span>Cryptographically secure RNG</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center gap-1 text-xs text-slate-500 dark:text-neutral-500 text-center">
          <div>
            &copy; {new Date().getFullYear()} Toolsbar
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 dark:text-neutral-500">
            Everything You Need in One Place
          </div>
        </div>
      </div>
    </footer>
  );
};
