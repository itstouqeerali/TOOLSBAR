import React from 'react';
import { 
  FileText, Image, FileImage, Layers, Percent, 
  Calendar, Landmark, Type, Code, QrCode, ArrowRightLeft, 
  Terminal, Check, Download, ArrowRight, ShieldCheck,
  Sparkles, FileCode, Sliders, Eye
} from 'lucide-react';

interface UtilityPreviewProps {
  slug: string;
  className?: string;
}

export const UtilityPreviewIllustration: React.FC<UtilityPreviewProps> = ({ slug, className = '' }) => {
  switch (slug) {
    case 'text-to-pdf':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          {/* Header bar of doc */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-neutral-400 ml-1">Document.pdf</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
              Page 1 of 2
            </span>
          </div>
          {/* Document Content Mockup */}
          <div className="space-y-1.5 py-1">
            <div className="h-2 w-3/4 rounded bg-indigo-600/30 dark:bg-indigo-400/30" />
            <div className="h-1.5 w-full rounded bg-slate-200 dark:bg-neutral-700" />
            <div className="h-1.5 w-5/6 rounded bg-slate-200 dark:bg-neutral-700" />
            <div className="h-1.5 w-4/6 rounded bg-slate-200 dark:bg-neutral-700" />
          </div>
          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/5 text-[9px]">
            <span className="text-slate-500 dark:text-neutral-400 font-mono">Letter · 300 DPI</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              <Check className="w-2.5 h-2.5" /> PDF Ready
            </span>
          </div>
        </div>
      );

    case 'images-to-pdf':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex items-center justify-between overflow-hidden relative ${className}`}>
          {/* Thumbnails stack */}
          <div className="flex items-center -space-x-3">
            <div className="w-14 h-16 rounded-lg bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 p-1 flex flex-col justify-between shadow-sm transform -rotate-6">
              <Image className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-[8px] font-mono text-sky-700 dark:text-sky-300">img_01.jpg</span>
            </div>
            <div className="w-14 h-16 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-1 flex flex-col justify-between shadow-sm transform -rotate-1 z-10">
              <Image className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-[8px] font-mono text-amber-700 dark:text-amber-300">photo.png</span>
            </div>
            <div className="w-14 h-16 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 p-1 flex flex-col justify-between shadow-sm transform rotate-6 z-20">
              <Image className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[8px] font-mono text-indigo-700 dark:text-indigo-300">banner.webp</span>
            </div>
          </div>
          {/* Convert Arrow */}
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />
          {/* Output PDF */}
          <div className="w-16 h-20 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-1.5 flex flex-col justify-between items-center text-center shadow-md shrink-0">
            <FileText className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
            <span className="text-[9px] font-bold text-red-700 dark:text-red-300 leading-tight">Merged PDF</span>
            <span className="text-[8px] font-mono text-slate-500 dark:text-neutral-400">3 Pages</span>
          </div>
        </div>
      );

    case 'pdf-toolkit':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">PDF</div>
              <span className="text-xs font-bold text-slate-800 dark:text-white">Toolkit Actions</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200">
              -68% Size
            </span>
          </div>
          {/* Action Chips */}
          <div className="grid grid-cols-2 gap-1.5 py-1">
            <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[10px] font-medium text-slate-700 dark:text-neutral-200 shadow-2xs">
              <span>Merge</span>
              <Layers className="w-3 h-3 text-red-500" />
            </div>
            <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[10px] font-medium text-slate-700 dark:text-neutral-200 shadow-2xs">
              <span>Split</span>
              <FileText className="w-3 h-3 text-amber-500" />
            </div>
            <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[10px] font-medium text-slate-700 dark:text-neutral-200 shadow-2xs">
              <span>Compress</span>
              <Sliders className="w-3 h-3 text-indigo-500" />
            </div>
            <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[10px] font-medium text-slate-700 dark:text-neutral-200 shadow-2xs">
              <span>Extract</span>
              <Eye className="w-3 h-3 text-emerald-500" />
            </div>
          </div>
          <div className="text-[9px] text-slate-500 dark:text-neutral-400 font-medium text-center">
            Zero upload · Processed locally in memory
          </div>
        </div>
      );

    case 'image-toolkit':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          {/* Before and After Image comparison preview */}
          <div className="flex items-center justify-between text-[9px] font-medium text-slate-500 dark:text-neutral-400">
            <span>Original (4.2 MB)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Optimized (380 KB)</span>
          </div>
          <div className="relative h-14 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 flex">
            {/* Left side preview */}
            <div className="w-1/2 h-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white relative">
              <span className="absolute bottom-1 left-1.5 text-[8px] bg-black/50 px-1 py-0.5 rounded">JPG</span>
            </div>
            {/* Split line */}
            <div className="w-[2px] h-full bg-white relative z-10 shadow-sm flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-slate-300 flex items-center justify-center -translate-x-[50%]">
                <ArrowRightLeft className="w-2 h-2 text-indigo-600" />
              </div>
            </div>
            {/* Right side preview */}
            <div className="w-1/2 h-full bg-gradient-to-tr from-sky-300 via-indigo-400 to-purple-500 flex items-center justify-center text-white relative">
              <span className="absolute bottom-1 right-1.5 text-[8px] bg-emerald-600/90 text-white font-bold px-1 py-0.5 rounded">WebP</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-600 dark:text-neutral-300">
            <span className="bg-slate-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">85% Quality</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Save 91% Space</span>
          </div>
        </div>
      );

    case 'percentage-calculator':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
              <Percent className="w-3 h-3 text-indigo-600" /> Calculation
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/60">
              Discount & Tax
            </span>
          </div>
          {/* Interactive display box */}
          <div className="p-2 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 text-center space-y-0.5 shadow-2xs">
            <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">
              $120.00 − 25% Discount
            </div>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
              = $90.00
            </div>
            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
              You Save: $30.00 (25%)
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-neutral-400 font-mono">
            <span>Ratio · GST · Change %</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Live Result</span>
          </div>
        </div>
      );

    case 'age-calculator':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-600" /> Chronological Age
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold">
              Exact Breakdown
            </span>
          </div>
          {/* Age Metrics grid */}
          <div className="grid grid-cols-3 gap-1 py-1 text-center">
            <div className="p-1 rounded bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10">
              <div className="text-sm font-extrabold font-mono text-cyan-700 dark:text-cyan-400">26</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400 uppercase">Years</div>
            </div>
            <div className="p-1 rounded bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10">
              <div className="text-sm font-extrabold font-mono text-cyan-700 dark:text-cyan-400">312</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400 uppercase">Months</div>
            </div>
            <div className="p-1 rounded bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10">
              <div className="text-sm font-extrabold font-mono text-cyan-700 dark:text-cyan-400">9,520</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400 uppercase">Days</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-neutral-400 font-mono">
            <span>Next Birthday: 42 days</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Leap-year aware</span>
          </div>
        </div>
      );

    case 'finance-calculator':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
              <Landmark className="w-3 h-3 text-emerald-600" /> Loan EMI & Interest
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
              $843 / mo
            </span>
          </div>
          {/* Visual breakdown bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[8px] text-slate-500 dark:text-neutral-400 font-mono">
              <span>Principal: $40,000 (76%)</span>
              <span>Interest: $10,580 (24%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-neutral-700 flex overflow-hidden">
              <div className="h-full bg-emerald-500 w-[76%]" />
              <div className="h-full bg-indigo-500 w-[24%]" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-neutral-400 font-mono border-t border-slate-200/60 dark:border-white/5 pt-1">
            <span>EMI · Compound · Simple</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Amortization</span>
          </div>
        </div>
      );

    case 'text-toolkit':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
              <Type className="w-3 h-3 text-violet-600" /> Text Analysis & Formatting
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-semibold">
              Live Stats
            </span>
          </div>
          {/* Word & char counter badges */}
          <div className="grid grid-cols-3 gap-1 py-1 text-center">
            <div className="p-1 rounded bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10">
              <div className="text-xs font-bold font-mono text-violet-700 dark:text-violet-400">428</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400">Words</div>
            </div>
            <div className="p-1 rounded bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10">
              <div className="text-xs font-bold font-mono text-violet-700 dark:text-violet-400">2,610</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400">Chars</div>
            </div>
            <div className="p-1 rounded bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10">
              <div className="text-xs font-bold font-mono text-violet-700 dark:text-violet-400">1.8m</div>
              <div className="text-[8px] text-slate-500 dark:text-neutral-400">Reading</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-neutral-400 font-mono">
            <span>Title Case · Clean Spaces · Slugs</span>
            <span className="text-violet-600 dark:text-violet-400 font-semibold">8 Text Tools</span>
          </div>
        </div>
      );

    case 'json-studio':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 flex flex-col justify-between overflow-hidden relative font-mono text-[9px] ${className}`}>
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <FileCode className="w-3 h-3 text-emerald-400" /> data.json
            </span>
            <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
              Valid JSON
            </span>
          </div>
          {/* Code snippet preview */}
          <div className="space-y-0.5 py-1 text-slate-300">
            <div><span className="text-purple-400">{'{'}</span></div>
            <div className="pl-2">
              <span className="text-cyan-400">"status"</span>: <span className="text-amber-400">200</span>,
            </div>
            <div className="pl-2">
              <span className="text-cyan-400">"format"</span>: <span className="text-emerald-400">"beautified"</span>
            </div>
            <div><span className="text-purple-400">{'}'}</span></div>
          </div>
          <div className="flex items-center justify-between text-slate-400 border-t border-slate-800 pt-1 text-[8px]">
            <span>Minify · Validate · Tree</span>
            <span className="text-indigo-400 font-semibold">1-Click Format</span>
          </div>
        </div>
      );

    case 'qr-generator':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex items-center justify-between overflow-hidden relative ${className}`}>
          {/* Left: Real QR SVG pattern */}
          <div className="w-16 h-16 rounded-lg bg-white dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-white/10 flex items-center justify-center shadow-sm shrink-0">
            <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 dark:text-white" fill="currentColor">
              <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm5 0h2v2H9V4zm4-2h7v7h-7V2zm2 2v3h3V4h-3zm-6 5h2v2h-2V9zm4 0h2v2h-2V9zm-9 4h7v7H2v-7zm2 2v3h3v-3H4zm6 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h3v3h-3v-3zm-2 2h2v2h-2v-2z" />
            </svg>
          </div>
          {/* Right: Tag chips + Download action (matching Pixora reference!) */}
          <div className="flex-1 pl-3 space-y-1">
            <div className="flex flex-wrap gap-1">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-medium">Link</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">WiFi</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium">Text</span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-neutral-400">High-res PNG & SVG</p>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 text-white text-[9px] font-bold shadow-xs">
              <Download className="w-2.5 h-2.5" /> Download QR
            </div>
          </div>
        </div>
      );

    case 'unit-converter':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2.5 flex flex-col justify-between overflow-hidden relative ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-teal-600" /> Unit Converter
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold">
              Instant
            </span>
          </div>
          {/* Dual conversion pills */}
          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 text-[9px] font-mono">
              <span className="text-slate-700 dark:text-neutral-200 font-semibold">100 km/h</span>
              <ArrowRight className="w-3 h-3 text-teal-500" />
              <span className="text-teal-700 dark:text-teal-400 font-bold">62.137 mph</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-slate-200/80 dark:border-white/10 text-[9px] font-mono">
              <span className="text-slate-700 dark:text-neutral-200 font-semibold">1,024 MB</span>
              <ArrowRight className="w-3 h-3 text-teal-500" />
              <span className="text-teal-700 dark:text-teal-400 font-bold">1 GB</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[8px] text-slate-500 dark:text-neutral-400 font-mono">
            <span>Length · Weight · Speed · Temp</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">30+ Categories</span>
          </div>
        </div>
      );

    case 'developer-toolbox':
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 flex flex-col justify-between overflow-hidden relative font-mono text-[9px] ${className}`}>
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1 text-indigo-400 font-bold">
              <Terminal className="w-3 h-3 text-indigo-400" /> Dev Toolbox
            </span>
            <span className="text-[8px] px-1 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800">
              11 Dev Utilities
            </span>
          </div>
          {/* Action tags */}
          <div className="grid grid-cols-2 gap-1 py-1 text-[8px] text-slate-300">
            <div className="px-1.5 py-1 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
              <span>Base64</span>
              <span className="text-emerald-400">✓</span>
            </div>
            <div className="px-1.5 py-1 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
              <span>SHA-256</span>
              <span className="text-cyan-400">✓</span>
            </div>
            <div className="px-1.5 py-1 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
              <span>UUID v4</span>
              <span className="text-amber-400">✓</span>
            </div>
            <div className="px-1.5 py-1 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
              <span>URL Codec</span>
              <span className="text-purple-400">✓</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-400 border-t border-slate-800 pt-1 text-[8px]">
            <span>JWT · Regex · Formatters</span>
            <span className="text-emerald-400 font-semibold">Zero Latency</span>
          </div>
        </div>
      );

    default:
      return (
        <div className={`w-full h-32 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-3 flex items-center justify-center text-slate-400 ${className}`}>
          <Sparkles className="w-6 h-6 text-indigo-500" />
        </div>
      );
  }
};
