import React from 'react';
import { Shield, Zap, Lock, Heart, Github, Twitter } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { ToolsbarLogo } from './ToolsbarLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/90 dark:border-white/[0.08] bg-white/70 dark:bg-[#030303]/80 backdrop-blur-2xl mt-24 py-16 text-slate-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-white/5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-600/20">
                <div className="w-full h-full bg-white dark:bg-[#030303] rounded-[11px] flex items-center justify-center p-1.5">
                  <ToolsbarLogo className="w-full h-full text-indigo-600 dark:text-white" />
                </div>
              </div>
              <span className="text-xl font-bold font-display text-slate-900 dark:text-white">Toolsbar</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              The premier all-in-one digital utility platform. Designed for pure speed, browser-first execution, and total client privacy.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Zero Latency
              </span>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-900 dark:text-white">Popular Utilities</span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('tools/percentage-calculator')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/age-calculator')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Age Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/word-counter')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Word Counter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/json-formatter')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  JSON Formatter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/qr-generator')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  QR Code Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools/password-generator')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Password Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-900 dark:text-white">Tool Categories</span>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => onNavigate(`category/${cat.id}`)} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-900 dark:text-white">Legal & Privacy</span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li className="pt-1 text-slate-500 dark:text-neutral-500">Zero data upload on browser tools</li>
              <li className="text-slate-500 dark:text-neutral-500">Cryptographically secure RNG</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} Toolsbar. Everything you need. In one place.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <button onClick={() => onNavigate('tools')} className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors cursor-pointer">Directory</button>
            <button onClick={() => onNavigate('categories')} className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors cursor-pointer">Categories</button>
            <span>&bull;</span>
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors cursor-pointer">Terms of Service</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-900 dark:hover:text-neutral-300 transition-colors cursor-pointer">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
