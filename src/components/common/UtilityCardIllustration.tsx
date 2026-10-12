import React from 'react';

export interface UtilityTheme {
  id: string;
  name: string;
  iconColor: string; // Tailwind text color e.g. text-rose-500
  iconBg: string; // Tailwind bg color e.g. bg-rose-500/10
  iconBorder: string; // Tailwind border color
  badgeColor: string;
  gradientBg: string;
  buttonBg: string; // Tailwind button bg e.g. bg-rose-600 hover:bg-rose-500
  buttonShadow: string;
  accentHex: string;
}

export const UTILITY_THEMES: Record<string, UtilityTheme> = {
  'text-to-pdf': {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    iconBorder: 'border-rose-200 dark:border-rose-500/30',
    badgeColor: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300',
    gradientBg: 'from-rose-500/10 via-rose-500/5 to-transparent',
    buttonBg: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white',
    buttonShadow: 'shadow-rose-600/25',
    accentHex: '#E11D48',
  },
  'images-to-pdf': {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-50 dark:bg-red-500/15',
    iconBorder: 'border-red-200 dark:border-red-500/30',
    badgeColor: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    gradientBg: 'from-red-500/10 via-red-500/5 to-transparent',
    buttonBg: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white',
    buttonShadow: 'shadow-red-600/25',
    accentHex: '#DC2626',
  },
  'pdf-toolkit': {
    id: 'pdf-toolkit',
    name: 'PDF Toolkit',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-500/15',
    iconBorder: 'border-orange-200 dark:border-orange-500/30',
    badgeColor: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
    gradientBg: 'from-orange-500/10 via-orange-500/5 to-transparent',
    buttonBg: 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white',
    buttonShadow: 'shadow-orange-600/25',
    accentHex: '#EA580C',
  },
  'image-toolkit': {
    id: 'image-toolkit',
    name: 'Image Toolkit',
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-500/15',
    iconBorder: 'border-sky-200 dark:border-sky-500/30',
    badgeColor: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
    gradientBg: 'from-sky-500/10 via-sky-500/5 to-transparent',
    buttonBg: 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white',
    buttonShadow: 'shadow-sky-600/25',
    accentHex: '#0284C7',
  },
  'percentage-calculator': {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconBorder: 'border-amber-200 dark:border-amber-500/30',
    badgeColor: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    gradientBg: 'from-amber-500/10 via-amber-500/5 to-transparent',
    buttonBg: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white',
    buttonShadow: 'shadow-amber-600/25',
    accentHex: '#D97706',
  },
  'age-calculator': {
    id: 'age-calculator',
    name: 'Age Calculator',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    iconBorder: 'border-blue-200 dark:border-blue-500/30',
    badgeColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    gradientBg: 'from-blue-500/10 via-blue-500/5 to-transparent',
    buttonBg: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white',
    buttonShadow: 'shadow-blue-600/25',
    accentHex: '#2563EB',
  },
  'finance-calculator': {
    id: 'finance-calculator',
    name: 'Finance Calculator',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconBorder: 'border-emerald-200 dark:border-emerald-500/30',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    gradientBg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white',
    buttonShadow: 'shadow-emerald-600/25',
    accentHex: '#059669',
  },
  'text-toolkit': {
    id: 'text-toolkit',
    name: 'Text Toolkit',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-500/15',
    iconBorder: 'border-purple-200 dark:border-purple-500/30',
    badgeColor: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
    gradientBg: 'from-purple-500/10 via-purple-500/5 to-transparent',
    buttonBg: 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white',
    buttonShadow: 'shadow-purple-600/25',
    accentHex: '#9333EA',
  },
  'json-studio': {
    id: 'json-studio',
    name: 'JSON Studio',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    iconBorder: 'border-cyan-200 dark:border-cyan-500/30',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
    gradientBg: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    buttonBg: 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white',
    buttonShadow: 'shadow-cyan-600/25',
    accentHex: '#0891B2',
  },
  'qr-generator': {
    id: 'qr-generator',
    name: 'QR Code Generator',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    iconBg: 'bg-fuchsia-50 dark:bg-fuchsia-500/15',
    iconBorder: 'border-fuchsia-200 dark:border-fuchsia-500/30',
    badgeColor: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300',
    gradientBg: 'from-fuchsia-500/10 via-fuchsia-500/5 to-transparent',
    buttonBg: 'bg-fuchsia-600 hover:bg-fuchsia-500 active:bg-fuchsia-700 text-white',
    buttonShadow: 'shadow-fuchsia-600/25',
    accentHex: '#C026D3',
  },
  'unit-converter': {
    id: 'unit-converter',
    name: 'Unit Converter',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-500/15',
    iconBorder: 'border-teal-200 dark:border-teal-500/30',
    badgeColor: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300',
    gradientBg: 'from-teal-500/10 via-teal-500/5 to-transparent',
    buttonBg: 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white',
    buttonShadow: 'shadow-teal-600/25',
    accentHex: '#0D9488',
  },
  'developer-toolbox': {
    id: 'developer-toolbox',
    name: 'Developer Toolbox',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/15',
    iconBorder: 'border-indigo-200 dark:border-indigo-500/30',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    gradientBg: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white',
    buttonShadow: 'shadow-indigo-600/25',
    accentHex: '#4F46E5',
  },
};

export function getUtilityTheme(slug: string): UtilityTheme {
  return (
    UTILITY_THEMES[slug] || {
      id: slug,
      name: 'Utility Tool',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/15',
      iconBorder: 'border-indigo-200 dark:border-indigo-500/30',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
      gradientBg: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white',
      buttonShadow: 'shadow-indigo-600/25',
      accentHex: '#4F46E5',
    }
  );
}

interface UtilityIllustrationProps {
  slug: string;
  className?: string;
}

export const UtilityIllustration: React.FC<UtilityIllustrationProps> = ({ slug, className = 'w-full h-24' }) => {
  switch (slug) {
    case 'text-to-pdf':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/10 via-rose-500/[0.04] to-transparent border border-rose-500/15 ${className}`}>
          {/* Document page with lines and PDF stamp */}
          <div className="relative w-28 h-20 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-rose-200/80 dark:border-rose-900/40 p-2.5 flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="space-y-1.5">
              <div className="w-12 h-1.5 rounded-full bg-rose-500/80" />
              <div className="w-20 h-1 rounded-full bg-slate-200 dark:bg-neutral-700" />
              <div className="w-16 h-1 rounded-full bg-slate-200 dark:bg-neutral-700" />
              <div className="w-18 h-1 rounded-full bg-slate-200 dark:bg-neutral-700" />
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-600 text-white">PDF</span>
              <div className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-rose-400" />
                <span className="w-1 h-1 rounded-full bg-rose-400" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'images-to-pdf':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 via-red-500/[0.04] to-transparent border border-red-500/15 ${className}`}>
          {/* Stacked photo frames into PDF binder */}
          <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <div className="absolute -left-2 -rotate-6 w-14 h-16 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-slate-200 dark:border-neutral-800 p-1">
              <div className="w-full h-9 rounded bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
              </div>
            </div>
            <div className="relative z-10 w-16 h-18 bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-red-200 dark:border-red-900/50 p-1.5 flex flex-col justify-between">
              <div className="w-full h-10 rounded bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-bold text-red-600 dark:text-red-400 uppercase">3 Images</span>
                <span className="text-[7px] px-1 rounded bg-red-600 text-white font-bold">.PDF</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'pdf-toolkit':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 via-orange-500/[0.04] to-transparent border border-orange-500/15 ${className}`}>
          {/* Split / Merge pages flow */}
          <div className="relative flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-14 bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-orange-200 dark:border-orange-900/50 p-1 flex flex-col justify-between">
              <div className="w-4 h-1 bg-orange-500 rounded" />
              <div className="space-y-0.5">
                <div className="w-6 h-0.5 bg-slate-200 dark:bg-neutral-700 rounded" />
                <div className="w-7 h-0.5 bg-slate-200 dark:bg-neutral-700 rounded" />
              </div>
              <span className="text-[6px] font-bold text-orange-600">p.1-2</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-orange-500 font-bold">⇄</span>
              <span className="text-[7px] font-semibold text-orange-600 uppercase">Merge</span>
            </div>
            <div className="w-10 h-14 bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-orange-200 dark:border-orange-900/50 p-1 flex flex-col justify-between">
              <div className="w-4 h-1 bg-orange-500 rounded" />
              <div className="space-y-0.5">
                <div className="w-6 h-0.5 bg-slate-200 dark:bg-neutral-700 rounded" />
                <div className="w-5 h-0.5 bg-slate-200 dark:bg-neutral-700 rounded" />
              </div>
              <span className="text-[6px] font-bold text-orange-600">p.3+</span>
            </div>
          </div>
        </div>
      );

    case 'image-toolkit':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-sky-500/[0.04] to-transparent border border-sky-500/15 ${className}`}>
          {/* Resizer frame with aspect lock and compress badge */}
          <div className="relative w-28 h-18 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-sky-200 dark:border-sky-900/50 p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between text-[8px] font-bold text-sky-600 dark:text-sky-400">
              <span>1920 × 1080</span>
              <span className="px-1 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-[7px]">WEBP</span>
            </div>
            <div className="relative w-full h-8 rounded bg-sky-50 dark:bg-sky-950/40 border border-dashed border-sky-300 dark:border-sky-800 flex items-center justify-center">
              <div className="w-2 h-2 absolute -top-1 -left-1 bg-sky-600 rounded-full" />
              <div className="w-2 h-2 absolute -top-1 -right-1 bg-sky-600 rounded-full" />
              <div className="w-2 h-2 absolute -bottom-1 -left-1 bg-sky-600 rounded-full" />
              <div className="w-2 h-2 absolute -bottom-1 -right-1 bg-sky-600 rounded-full" />
              <span className="text-[8px] font-bold text-sky-700 dark:text-sky-300">-68% size</span>
            </div>
            <div className="flex items-center justify-between text-[7px] text-slate-400">
              <span>Aspect 16:9</span>
              <span className="text-emerald-500 font-semibold">Lossless</span>
            </div>
          </div>
        </div>
      );

    case 'percentage-calculator':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.04] to-transparent border border-amber-500/15 ${className}`}>
          {/* Sale tag & percentage breakdown */}
          <div className="relative flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-16 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/50 p-2 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-amber-500 leading-none">%</span>
              <span className="text-[7px] font-bold text-slate-500 uppercase mt-1">Discount</span>
            </div>
            <div className="w-18 h-16 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/50 p-1.5 flex flex-col justify-between">
              <div className="text-[8px] font-semibold text-slate-400">Original $100</div>
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Save 25%</div>
              <div className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">Net $75.00</div>
            </div>
          </div>
        </div>
      );

    case 'age-calculator':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-500/[0.04] to-transparent border border-blue-500/15 ${className}`}>
          {/* Calendar milestone card */}
          <div className="relative w-26 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900/50 overflow-hidden flex flex-col group-hover:scale-105 transition-transform duration-300">
            <div className="h-5 bg-blue-600 px-2 flex items-center justify-between text-white text-[8px] font-bold">
              <span>CALENDAR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
            <div className="flex-1 p-2 flex flex-col items-center justify-center">
              <div className="text-xs font-black text-blue-600 dark:text-blue-400 leading-none">28 Years</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400 mt-1">10,227 Days Lived</div>
            </div>
          </div>
        </div>
      );

    case 'finance-calculator':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.04] to-transparent border border-emerald-500/15 ${className}`}>
          {/* Compound growth curve and EMI */}
          <div className="relative w-28 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900/50 p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between text-[8px] font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">ROI +8.5%</span>
              <span className="text-slate-400">$ EMI</span>
            </div>
            <div className="flex items-end gap-1.5 h-8 px-1">
              <div className="w-3 h-2 bg-emerald-200 dark:bg-emerald-950 rounded-t" />
              <div className="w-3 h-3 bg-emerald-300 dark:bg-emerald-900 rounded-t" />
              <div className="w-3 h-5 bg-emerald-400 dark:bg-emerald-800 rounded-t" />
              <div className="w-3 h-7 bg-emerald-500 dark:bg-emerald-600 rounded-t" />
              <div className="w-3 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-t" />
            </div>
            <div className="text-[7px] text-slate-500 dark:text-neutral-400 text-center font-medium">
              Principal vs Compound Interest
            </div>
          </div>
        </div>
      );

    case 'text-toolkit':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-purple-500/[0.04] to-transparent border border-purple-500/15 ${className}`}>
          {/* Typography editor cursor and metrics */}
          <div className="relative w-28 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-purple-200 dark:border-purple-900/50 p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400">Aa</span>
              <span className="text-[8px] text-slate-400 font-mono">Title Case</span>
              <span className="w-1.5 h-3 bg-purple-500 animate-pulse ml-auto" />
            </div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-purple-100 dark:bg-purple-950/60 rounded" />
              <div className="w-4/5 h-1 bg-purple-100 dark:bg-purple-950/60 rounded" />
            </div>
            <div className="flex items-center justify-between text-[7px] font-semibold text-purple-700 dark:text-purple-300 pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span>324 words</span>
              <span>2,190 chars</span>
            </div>
          </div>
        </div>
      );

    case 'json-studio':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/[0.04] to-transparent border border-cyan-500/15 ${className}`}>
          {/* Syntax tree & code brackets */}
          <div className="relative w-28 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-cyan-200 dark:border-cyan-900/50 p-2 font-mono text-[7px] flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold">&#123;</div>
            <div className="pl-2 space-y-0.5">
              <div>
                <span className="text-slate-400">&quot;status&quot;: </span>
                <span className="text-emerald-500 font-bold">200</span>
              </div>
              <div>
                <span className="text-slate-400">&quot;valid&quot;: </span>
                <span className="text-cyan-500 font-bold">true</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 font-bold">
              <span>&#125;</span>
              <span className="text-[6px] px-1 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 font-sans">Beautify</span>
            </div>
          </div>
        </div>
      );

    case 'qr-generator':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-fuchsia-500/[0.04] to-transparent border border-fuchsia-500/15 ${className}`}>
          {/* High-res 2D QR matrix */}
          <div className="relative w-18 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-fuchsia-200 dark:border-fuchsia-900/50 p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-2 border-fuchsia-600 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-fuchsia-600" />
              </div>
              <div className="w-4 h-4 border-2 border-fuchsia-600 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-fuchsia-600" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-0.5 px-1 py-0.5">
              <div className="w-1 h-1 bg-fuchsia-500" />
              <div className="w-1 h-1 bg-transparent" />
              <div className="w-1 h-1 bg-fuchsia-500" />
              <div className="w-1 h-1 bg-fuchsia-500" />
            </div>
            <div className="flex justify-between items-end">
              <div className="w-4 h-4 border-2 border-fuchsia-600 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-fuchsia-600" />
              </div>
              <span className="text-[6px] font-bold text-fuchsia-600 uppercase">SVG/PNG</span>
            </div>
          </div>
        </div>
      );

    case 'unit-converter':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-teal-500/10 via-teal-500/[0.04] to-transparent border border-teal-500/15 ${className}`}>
          {/* Dual unit balance scale and ruler */}
          <div className="relative w-28 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-teal-200 dark:border-teal-900/50 p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between text-[8px] font-bold text-teal-600 dark:text-teal-400">
              <span>Metric</span>
              <span className="text-teal-500">⇄</span>
              <span>Imperial</span>
            </div>
            <div className="flex items-center justify-center gap-1 py-1">
              <span className="text-[10px] font-extrabold text-slate-800 dark:text-white">100 km</span>
              <span className="text-[8px] text-teal-500 font-bold">=</span>
              <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400">62.14 mi</span>
            </div>
            <div className="flex justify-between text-[6px] text-slate-400 border-t border-slate-100 dark:border-neutral-800 pt-0.5">
              <span>Length</span>
              <span>Temp</span>
              <span>Digital</span>
              <span>Weight</span>
            </div>
          </div>
        </div>
      );

    case 'developer-toolbox':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/[0.04] to-transparent border border-indigo-500/15 ${className}`}>
          {/* Terminal window with tokens and base64 */}
          <div className="relative w-28 h-18 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-900/50 p-2 font-mono flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1 pb-1 border-b border-slate-100 dark:border-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[7px] text-slate-400 font-sans ml-auto">dev://tools</span>
            </div>
            <div className="text-[7px] text-indigo-600 dark:text-indigo-400 leading-tight">
              &gt; base64 -d<br />
              &gt; jwt.decode()<br />
              &gt; sha256.hash()
            </div>
            <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5">
              <span>UUID v4</span>
              <span className="text-emerald-500 font-bold">SHA-256</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
