import React from 'react';

/**
 * Bespoke vector SVG illustrations for the 12 flagship native utility cards.
 * Designed directly from the visual reference in 'Modern Native Tools Dashboard Grid.png'.
 * Lightweight, 100% vector, crisp on high-DPI displays, responsive, and compatible with light/dark themes.
 */

// 1. Text to PDF: Document transforming into a PDF file
export const TextToPdfIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="t2p-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEE2E2" stopOpacity="0.4" />
        <stop stopColor="#FECDD3" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="t2p-pdf" x1="0" y1="0" x2="60" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF4444" />
        <stop stopColor="#DC2626" />
      </linearGradient>
      <filter id="t2p-shadow" x="70" y="30" width="75" height="85" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="6" stdDeviation="6" floodColor="#EF4444" floodOpacity="0.25" />
      </filter>
    </defs>
    {/* Soft ambient background blob */}
    <rect width="160" height="120" rx="16" fill="url(#t2p-bg)" />
    
    {/* Left: Input Text Document */}
    <g transform="translate(18, 18)">
      <rect width="56" height="72" rx="6" fill="white" className="dark:fill-slate-800" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* "Text" Pill */}
      <rect x="8" y="8" width="28" height="12" rx="4" fill="#F1F5F9" className="dark:fill-slate-700" />
      <text x="13" y="17" fill="#64748B" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Text</text>
      {/* Simulated lines */}
      <rect x="8" y="26" width="40" height="3" rx="1.5" fill="#CBD5E1" className="dark:fill-slate-600" />
      <rect x="8" y="33" width="34" height="3" rx="1.5" fill="#CBD5E1" className="dark:fill-slate-600" />
      <rect x="8" y="40" width="38" height="3" rx="1.5" fill="#CBD5E1" className="dark:fill-slate-600" />
      <rect x="8" y="47" width="22" height="3" rx="1.5" fill="#CBD5E1" className="dark:fill-slate-600" />
    </g>

    {/* Connecting swoosh arrow */}
    <path
      d="M62 68 C 72 78, 80 80, 88 72"
      stroke="#EF4444"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="1 0"
    />
    <polygon points="88,67 92,74 85,74" fill="#EF4444" />

    {/* Right: Output PDF Document */}
    <g filter="url(#t2p-shadow)">
      <g transform="translate(86, 38)">
        <path d="M0 6 C0 2.68 2.68 0 6 0 H36 L52 16 V62 C52 65.32 49.32 68 46 68 H6 C2.68 68 0 65.32 0 62 Z" fill="url(#t2p-pdf)" />
        {/* Folded corner */}
        <path d="M36 0 V16 H52 Z" fill="#B91C1C" opacity="0.6" />
        <path d="M36 0 L52 16 H36 Z" fill="white" opacity="0.3" />
        {/* PDF File icon & Text */}
        <rect x="12" y="28" width="28" height="20" rx="3" fill="white" fillOpacity="0.2" />
        <text x="15" y="42" fill="white" fontSize="9" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">PDF</text>
      </g>
    </g>
  </svg>
);

// 2. Images to PDF: Multiple photo cards combining into a PDF
export const ImagesToPdfIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="i2p-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DBEAFE" stopOpacity="0.5" />
        <stop stopColor="#EFF6FF" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="i2p-pdf" x1="0" y1="0" x2="50" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop stopColor="#1D4ED8" />
      </linearGradient>
      <filter id="i2p-shadow" x="80" y="35" width="70" height="80" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#2563EB" floodOpacity="0.25" />
      </filter>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#i2p-bg)" />

    {/* Background Image Card 1 */}
    <g transform="translate(38, 14) rotate(10)">
      <rect width="44" height="52" rx="6" fill="#60A5FA" opacity="0.4" />
    </g>

    {/* Primary Image Card */}
    <g transform="translate(18, 22)">
      <rect width="52" height="60" rx="7" fill="white" className="dark:fill-slate-800" stroke="#BFDBFE" strokeWidth="1.5" />
      {/* Photo area */}
      <rect x="5" y="5" width="42" height="38" rx="4" fill="#3B82F6" />
      {/* Sun */}
      <circle cx="15" cy="15" r="4" fill="#FDE047" />
      {/* Mountains */}
      <path d="M7 38 L22 22 L33 34 L38 29 L47 38 Z" fill="#60A5FA" />
      <path d="M18 38 L30 25 L43 38 Z" fill="#1E40AF" opacity="0.6" />
      {/* Page Dots */}
      <circle cx="20" cy="51" r="2" fill="#93C5FD" />
      <circle cx="26" cy="51" r="2" fill="#3B82F6" />
      <circle cx="32" cy="51" r="2" fill="#93C5FD" />
    </g>

    {/* Resulting PDF file */}
    <g filter="url(#i2p-shadow)">
      <g transform="translate(94, 42)">
        <path d="M0 5 C0 2.24 2.24 0 5 0 H30 L44 14 V54 C44 56.76 41.76 59 39 59 H5 C2.24 59 0 56.76 0 54 Z" fill="url(#i2p-pdf)" />
        <path d="M30 0 V14 H44 Z" fill="#1E40AF" opacity="0.7" />
        <text x="12" y="38" fill="white" fontSize="9" fontWeight="800" fontFamily="sans-serif">PDF</text>
        <path d="M14 26 L22 17 L29 26 Z" fill="white" opacity="0.8" />
        <circle cx="27" cy="18" r="2" fill="white" opacity="0.9" />
      </g>
    </g>
  </svg>
);

// 3. PDF Toolkit: Central PDF document surrounded by action tools (Merge, Split, Compress, Rotate)
export const PdfToolkitIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pdftk-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F3E8FF" stopOpacity="0.5" />
        <stop stopColor="#FAF5FF" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="pdftk-doc" x1="0" y1="0" x2="48" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E11D48" />
        <stop stopColor="#BE123C" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#pdftk-bg)" />

    {/* Central PDF doc */}
    <g transform="translate(42, 28)">
      <rect width="48" height="64" rx="7" fill="url(#pdftk-doc)" />
      <path d="M32 0 V16 H48 Z" fill="#881337" opacity="0.5" />
      <text x="13" y="40" fill="white" fontSize="9" fontWeight="800" fontFamily="sans-serif">PDF</text>
    </g>

    {/* Action Badges surrounding the doc */}
    {/* 1. Merge (Red) */}
    <g transform="translate(102, 16)">
      <rect width="48" height="18" rx="5" fill="#EF4444" />
      <text x="17" y="12" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Merge</text>
      <circle cx="9" cy="9" r="3" fill="white" opacity="0.8" />
    </g>

    {/* 2. Split (Purple) */}
    <g transform="translate(102, 38)">
      <rect width="48" height="18" rx="5" fill="#8B5CF6" />
      <text x="19" y="12" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Split</text>
      <circle cx="9" cy="9" r="3" fill="white" opacity="0.8" />
    </g>

    {/* 3. Compress (Blue) */}
    <g transform="translate(102, 60)">
      <rect width="52" height="18" rx="5" fill="#3B82F6" />
      <text x="16" y="12" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Compress</text>
      <circle cx="8" cy="9" r="3" fill="white" opacity="0.8" />
    </g>

    {/* 4. Rotate (Pink) */}
    <g transform="translate(102, 82)">
      <rect width="48" height="18" rx="5" fill="#EC4899" />
      <text x="17" y="12" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Rotate</text>
      <circle cx="9" cy="9" r="3" fill="white" opacity="0.8" />
    </g>
  </svg>
);

// 4. Image Toolkit: Photo card with editing sliders, magic wand, and crop controls
export const ImageToolkitIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="imgtk-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D1FAE5" stopOpacity="0.5" />
        <stop stopColor="#ECFDF5" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="imgtk-photo" x1="0" y1="0" x2="80" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop stopColor="#047857" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#imgtk-bg)" />

    {/* Main Photo Card */}
    <g transform="translate(18, 22)">
      <rect width="90" height="74" rx="8" fill="url(#imgtk-photo)" stroke="#6EE7B7" strokeWidth="1.5" />
      {/* Scenic Nature Illustration */}
      <path d="M0 50 L25 24 L52 48 L65 36 L90 58 V74 H0 Z" fill="#065F46" />
      <path d="M22 52 L44 32 L70 54 L90 40 V74 H22 Z" fill="#047857" opacity="0.7" />
      <circle cx="70" cy="22" r="6" fill="#FDE047" />

      {/* Crop corner handles */}
      <path d="M3 10 V3 H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M80 3 H87 V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 64 V71 H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M80 71 H87 V64" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Floating Tool Controls on Right */}
    {/* Magic Wand Button */}
    <g transform="translate(120, 18)">
      <circle cx="12" cy="12" r="12" fill="#10B981" />
      <path d="M8 16 L15 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="15" cy="7" r="1" fill="#FDE047" />
      <circle cx="18" cy="10" r="1" fill="#FDE047" />
    </g>

    {/* Sliders Button */}
    <g transform="translate(120, 48)">
      <circle cx="12" cy="12" r="12" fill="#34D399" />
      <path d="M7 9 H17 M7 15 H17" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="9" r="2" fill="white" />
      <circle cx="14" cy="15" r="2" fill="white" />
    </g>

    {/* Crop Button */}
    <g transform="translate(120, 78)">
      <circle cx="12" cy="12" r="12" fill="#059669" />
      <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="white" strokeWidth="1.8" />
    </g>
  </svg>
);

// 5. Percentage Calculator: Blue calculator with floating percentage % badge (25%)
export const PercentageCalculatorIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pct-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFEDD5" stopOpacity="0.5" />
        <stop stopColor="#FFF7ED" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="pct-calc" x1="0" y1="0" x2="60" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#pct-bg)" />

    {/* Calculator Body */}
    <g transform="translate(24, 20)">
      <rect width="64" height="82" rx="10" fill="url(#pct-calc)" />
      {/* Screen */}
      <rect x="8" y="8" width="48" height="18" rx="4" fill="#1E3A8A" />
      <text x="48" y="21" fill="#93C5FD" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="end">78%</text>

      {/* Keypad Buttons */}
      <rect x="8" y="32" width="13" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="25" y="32" width="13" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="42" y="32" width="13" height="10" rx="2.5" fill="#F97316" />
      
      <rect x="8" y="46" width="13" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="25" y="46" width="13" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="42" y="46" width="13" height="10" rx="2.5" fill="#60A5FA" />

      <rect x="8" y="60" width="13" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="25" y="60" width="13" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="42" y="60" width="13" height="10" rx="2.5" fill="#22C55E" />
    </g>

    {/* Floating Orange % Badge */}
    <g transform="translate(98, 16)">
      <rect width="36" height="36" rx="9" fill="#F97316" />
      <text x="18" y="24" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">%</text>
    </g>

    {/* Floating Result Badge "25%" */}
    <g transform="translate(94, 62)">
      <rect width="50" height="28" rx="7" fill="white" className="dark:fill-slate-800" stroke="#FDBA74" strokeWidth="1.5" />
      <text x="25" y="19" fill="#EA580C" fontSize="12" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">25%</text>
    </g>
  </svg>
);

// 6. Age Calculator: Calendar with clock and exact age milestone badge
export const AgeCalculatorIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="age-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#CCFBF1" stopOpacity="0.5" />
        <stop stopColor="#F0FDFA" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#age-bg)" />

    {/* Calendar Sheet */}
    <g transform="translate(20, 18)">
      <rect width="66" height="68" rx="8" fill="white" className="dark:fill-slate-800" stroke="#99F6E4" strokeWidth="1.5" />
      {/* Calendar Header */}
      <path d="M0 8 C0 3.58 3.58 0 8 0 H58 C62.42 0 66 3.58 66 8 V18 H0 Z" fill="#0D9488" />
      {/* Rings */}
      <rect x="14" y="-3" width="5" height="7" rx="2" fill="#134E4A" />
      <rect x="47" y="-3" width="5" height="7" rx="2" fill="#134E4A" />
      
      {/* Calendar Grid Dots */}
      <circle cx="16" cy="30" r="3" fill="#5EEAD4" />
      <circle cx="33" cy="30" r="3" fill="#5EEAD4" />
      <circle cx="50" cy="30" r="3" fill="#5EEAD4" />
      <circle cx="16" cy="44" r="3" fill="#5EEAD4" />
      <circle cx="33" cy="44" r="3" fill="#0D9488" />
      <circle cx="50" cy="44" r="3" fill="#5EEAD4" />
      <circle cx="16" cy="56" r="3" fill="#5EEAD4" />
      <circle cx="33" cy="56" r="3" fill="#5EEAD4" />
    </g>

    {/* Clock Icon */}
    <g transform="translate(94, 22)">
      <circle cx="16" cy="16" r="15" fill="#06B6D4" stroke="white" strokeWidth="2" />
      <path d="M16 8 V16 L22 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Exact Age Badge */}
    <g transform="translate(82, 60)">
      <rect width="66" height="42" rx="7" fill="white" className="dark:fill-slate-800" stroke="#0D9488" strokeWidth="1.5" />
      <text x="33" y="14" fill="#0F766E" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">25 Years</text>
      <text x="33" y="24" fill="#0D9488" fontSize="7.5" fontWeight="semibold" fontFamily="sans-serif" textAnchor="middle">3 Months</text>
      <text x="33" y="34" fill="#14B8A6" fontSize="7.5" fontWeight="medium" fontFamily="sans-serif" textAnchor="middle">12 Days</text>
    </g>
  </svg>
);

// 7. Finance Calculator: Calculator with stack of gold coins and rising trend chart
export const FinanceCalculatorIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fin-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCE7F3" stopOpacity="0.5" />
        <stop stopColor="#FDF2F8" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="fin-calc" x1="0" y1="0" x2="48" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DB2777" />
        <stop stopColor="#BE185D" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#fin-bg)" />

    {/* Stack of Gold Coins */}
    <g transform="translate(20, 52)">
      {/* Coin 1 */}
      <ellipse cx="22" cy="38" rx="18" ry="7" fill="#CA8A04" />
      <ellipse cx="22" cy="35" rx="18" ry="7" fill="#FACC15" />
      {/* Coin 2 */}
      <ellipse cx="22" cy="26" rx="18" ry="7" fill="#CA8A04" />
      <ellipse cx="22" cy="23" rx="18" ry="7" fill="#FACC15" />
      {/* Coin 3 */}
      <ellipse cx="22" cy="14" rx="18" ry="7" fill="#CA8A04" />
      <ellipse cx="22" cy="11" rx="18" ry="7" fill="#FDE047" />
      {/* $ symbol on top coin */}
      <text x="22" y="14" fill="#854D0E" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">$</text>
    </g>

    {/* Calculator on Right */}
    <g transform="translate(74, 30)">
      <rect width="52" height="66" rx="8" fill="url(#fin-calc)" />
      {/* Screen */}
      <rect x="6" y="6" width="40" height="14" rx="3" fill="#831843" />
      <text x="42" y="16" fill="#FBCFE8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">EMI $850</text>
      {/* Keys */}
      <rect x="6" y="24" width="10" height="8" rx="2" fill="#F472B6" />
      <rect x="20" y="24" width="10" height="8" rx="2" fill="#F472B6" />
      <rect x="34" y="24" width="12" height="8" rx="2" fill="#F472B6" />

      <rect x="6" y="36" width="10" height="8" rx="2" fill="#F472B6" />
      <rect x="20" y="36" width="10" height="8" rx="2" fill="#F472B6" />
      <rect x="34" y="36" width="12" height="8" rx="2" fill="#F472B6" />

      <rect x="6" y="48" width="10" height="8" rx="2" fill="#F472B6" />
      <rect x="20" y="48" width="10" height="8" rx="2" fill="#F472B6" />
      <rect x="34" y="48" width="12" height="8" rx="2" fill="#22C55E" />
    </g>

    {/* Rising Pink Growth Arrow */}
    <path
      d="M50 48 Q 90 28, 134 16"
      stroke="#BE185D"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <polygon points="134,11 140,16 133,21" fill="#BE185D" />
  </svg>
);

// 8. Text Toolkit: Rich text document lines with "Aa" typography badge and selection box
export const TextToolkitIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="txt-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0E7FF" stopOpacity="0.5" />
        <stop stopColor="#EEF2FF" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#txt-bg)" />

    {/* Document Body */}
    <g transform="translate(24, 18)">
      <rect width="84" height="82" rx="8" fill="white" className="dark:fill-slate-800" stroke="#C7D2FE" strokeWidth="1.5" />
      {/* Title bar line */}
      <rect x="10" y="12" width="44" height="5" rx="2" fill="#4F46E5" />
      {/* Paragraph lines */}
      <rect x="10" y="24" width="64" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="10" y="32" width="58" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="10" y="40" width="60" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="10" y="48" width="46" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="10" y="56" width="52" height="3" rx="1.5" fill="#94A3B8" />

      {/* Focus selection box */}
      <rect x="8" y="21" width="68" height="26" rx="3" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 2" fill="#EEF2FF" fillOpacity="0.4" />
    </g>

    {/* Floating "Aa" Badge */}
    <g transform="translate(108, 30)">
      <circle cx="16" cy="16" r="16" fill="#4F46E5" />
      <text x="16" y="21" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Aa</text>
    </g>

    {/* Word Count Indicator */}
    <g transform="translate(86, 78)">
      <rect width="52" height="20" rx="5" fill="#4338CA" />
      <text x="26" y="13" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">1,240 Words</text>
    </g>
  </svg>
);

// 9. JSON Studio: Code editor showing formatted { } braces and JSON label
export const JsonStudioIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="json-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" stopOpacity="0.5" />
        <stop stopColor="#F0F9FF" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#json-bg)" />

    {/* Code Editor Window */}
    <g transform="translate(24, 18)">
      <rect width="104" height="82" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      {/* Title bar */}
      <path d="M0 8 C0 3.58 3.58 0 8 0 H96 C100.42 0 104 3.58 104 8 V16 H0 Z" fill="#1E293B" />
      <circle cx="10" cy="8" r="2.5" fill="#EF4444" />
      <circle cx="18" cy="8" r="2.5" fill="#F59E0B" />
      <circle cx="26" cy="8" r="2.5" fill="#10B981" />

      {/* Large Curly Braces */}
      <text x="12" y="44" fill="#38BDF8" fontSize="24" fontWeight="bold" fontFamily="monospace">{'{'}</text>
      <text x="12" y="70" fill="#38BDF8" fontSize="24" fontWeight="bold" fontFamily="monospace">{'}'}</text>

      {/* Code syntax lines */}
      <rect x="28" y="28" width="30" height="3" rx="1.5" fill="#F472B6" />
      <rect x="62" y="28" width="22" height="3" rx="1.5" fill="#34D399" />
      <rect x="28" y="38" width="24" height="3" rx="1.5" fill="#F472B6" />
      <rect x="56" y="38" width="32" height="3" rx="1.5" fill="#38BDF8" />
      <rect x="28" y="48" width="28" height="3" rx="1.5" fill="#F472B6" />
      <rect x="60" y="48" width="16" height="3" rx="1.5" fill="#FBBF24" />
    </g>

    {/* Floating "JSON" Badge */}
    <g transform="translate(100, 70)">
      <rect width="44" height="22" rx="6" fill="#0284C7" />
      <text x="22" y="14" fill="white" fontSize="9" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">JSON</text>
    </g>
  </svg>
);

// 10. QR Generator: Clean, sharp vector QR code framed by violet scanner brackets
export const QrGeneratorIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="qr-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EDE9FE" stopOpacity="0.5" />
        <stop stopColor="#F5F3FF" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#qr-bg)" />

    {/* Viewfinder scanner brackets */}
    <g transform="translate(42, 18)">
      {/* Top Left Bracket */}
      <path d="M0 16 V0 H16" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      {/* Top Right Bracket */}
      <path d="M60 0 H76 V16" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      {/* Bottom Left Bracket */}
      <path d="M0 60 V76 H16" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      {/* Bottom Right Bracket */}
      <path d="M60 76 H76 V60" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />

      {/* QR Code Canvas */}
      <g transform="translate(10, 10)">
        <rect width="56" height="56" rx="4" fill="white" className="dark:fill-slate-900" />
        
        {/* Corner Position Detection Squares */}
        {/* Top-Left */}
        <rect x="4" y="4" width="14" height="14" rx="2" fill="#1E1B4B" />
        <rect x="7" y="7" width="8" height="8" rx="1" fill="white" />
        <rect x="9" y="9" width="4" height="4" fill="#1E1B4B" />

        {/* Top-Right */}
        <rect x="38" y="4" width="14" height="14" rx="2" fill="#1E1B4B" />
        <rect x="41" y="7" width="8" height="8" rx="1" fill="white" />
        <rect x="43" y="9" width="4" height="4" fill="#1E1B4B" />

        {/* Bottom-Left */}
        <rect x="4" y="38" width="14" height="14" rx="2" fill="#1E1B4B" />
        <rect x="7" y="41" width="8" height="8" rx="1" fill="white" />
        <rect x="9" y="43" width="4" height="4" fill="#1E1B4B" />

        {/* Internal QR Data Modules */}
        <rect x="22" y="6" width="4" height="4" fill="#1E1B4B" />
        <rect x="28" y="6" width="4" height="4" fill="#1E1B4B" />
        <rect x="22" y="14" width="4" height="4" fill="#1E1B4B" />
        <rect x="30" y="14" width="4" height="4" fill="#1E1B4B" />
        <rect x="14" y="24" width="4" height="4" fill="#1E1B4B" />
        <rect x="22" y="24" width="12" height="4" fill="#7C3AED" />
        <rect x="38" y="24" width="4" height="4" fill="#1E1B4B" />
        <rect x="46" y="24" width="4" height="4" fill="#1E1B4B" />
        <rect x="22" y="32" width="4" height="4" fill="#1E1B4B" />
        <rect x="34" y="32" width="6" height="4" fill="#1E1B4B" />
        <rect x="22" y="40" width="8" height="4" fill="#1E1B4B" />
        <rect x="34" y="42" width="14" height="4" fill="#1E1B4B" />
        <rect x="22" y="48" width="4" height="4" fill="#1E1B4B" />
        <rect x="44" y="48" width="6" height="4" fill="#1E1B4B" />
      </g>
    </g>

    {/* Floating Scan Icon */}
    <g transform="translate(118, 72)">
      <rect width="24" height="24" rx="6" fill="#7C3AED" />
      <path d="M7 12 H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10" y="9" width="4" height="6" rx="1" fill="white" />
    </g>
  </svg>
);

// 11. Unit Converter: Two unit boxes ("km" and "m") with conversion arrows and yellow measuring ruler
export const UnitConverterIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="unit-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" stopOpacity="0.5" />
        <stop stopColor="#FFFBEB" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#unit-bg)" />

    {/* Top Unit Box ("km") */}
    <g transform="translate(68, 16)">
      <rect width="54" height="24" rx="6" fill="white" className="dark:fill-slate-800" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="18" y="16" fill="#D97706" fontSize="11" fontWeight="bold" fontFamily="sans-serif">km</text>
      <path d="M40 10 L44 14 L40 18" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Swap Conversion Arrows */}
    <g transform="translate(90, 44)">
      <path d="M0 0 V14" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <polygon points="0,17 -3,12 3,12" fill="#D97706" />
      <path d="M8 14 V0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <polygon points="8,-3 5,2 11,2" fill="#F59E0B" />
    </g>

    {/* Bottom Unit Box ("m") */}
    <g transform="translate(68, 64)">
      <rect width="54" height="24" rx="6" fill="white" className="dark:fill-slate-800" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="20" y="16" fill="#D97706" fontSize="11" fontWeight="bold" fontFamily="sans-serif">m</text>
      <path d="M40 10 L44 14 L40 18" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Yellow Ruler */}
    <g transform="translate(18, 52) rotate(25)">
      <rect width="68" height="16" rx="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      {/* Tick Marks */}
      <line x1="8" y1="0" x2="8" y2="8" stroke="#92400E" strokeWidth="1" />
      <line x1="14" y1="0" x2="14" y2="5" stroke="#92400E" strokeWidth="1" />
      <line x1="20" y1="0" x2="20" y2="8" stroke="#92400E" strokeWidth="1" />
      <line x1="26" y1="0" x2="26" y2="5" stroke="#92400E" strokeWidth="1" />
      <line x1="32" y1="0" x2="32" y2="8" stroke="#92400E" strokeWidth="1" />
      <line x1="38" y1="0" x2="38" y2="5" stroke="#92400E" strokeWidth="1" />
      <line x1="44" y1="0" x2="44" y2="8" stroke="#92400E" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="5" stroke="#92400E" strokeWidth="1" />
      <line x1="56" y1="0" x2="56" y2="8" stroke="#92400E" strokeWidth="1" />
      <line x1="62" y1="0" x2="62" y2="5" stroke="#92400E" strokeWidth="1" />
    </g>
  </svg>
);

// 12. Developer Toolbox: Terminal window with syntax lines and green wrench tool badge
export const DeveloperToolboxIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="dev-bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D1FAE5" stopOpacity="0.4" />
        <stop stopColor="#ECFDF5" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="160" height="120" rx="16" fill="url(#dev-bg)" />

    {/* Terminal Code Window */}
    <g transform="translate(24, 18)">
      <rect width="98" height="76" rx="8" fill="#18181B" stroke="#10B981" strokeWidth="1.5" />
      {/* Title bar dots */}
      <circle cx="10" cy="9" r="2.5" fill="#EF4444" />
      <circle cx="18" cy="9" r="2.5" fill="#F59E0B" />
      <circle cx="26" cy="9" r="2.5" fill="#10B981" />
      <line x1="0" y1="17" x2="98" y2="17" stroke="#27272A" strokeWidth="1" />

      {/* Terminal Syntax Code Lines */}
      <rect x="10" y="26" width="34" height="3" rx="1.5" fill="#34D399" />
      <rect x="48" y="26" width="22" height="3" rx="1.5" fill="#6EE7B7" />
      <rect x="10" y="34" width="26" height="3" rx="1.5" fill="#A78BFA" />
      <rect x="40" y="34" width="38" height="3" rx="1.5" fill="#F472B6" />
      <rect x="10" y="42" width="46" height="3" rx="1.5" fill="#38BDF8" />
      <rect x="10" y="50" width="30" height="3" rx="1.5" fill="#FBBF24" />
      <rect x="44" y="50" width="28" height="3" rx="1.5" fill="#6EE7B7" />
      <rect x="10" y="58" width="18" height="3" rx="1.5" fill="#34D399" />
    </g>

    {/* Floating Wrench Tool Badge */}
    <g transform="translate(108, 62)">
      <circle cx="16" cy="16" r="16" fill="#10B981" stroke="white" strokeWidth="2" />
      {/* Wrench icon */}
      <path
        d="M21 11 C20 10 18 10 17 11 L14 14 L11 11 C10 10 8 10 7 11 C6 12 6 14 7 15 L10 18 L6 22 C5 23 5 25 6 26 C7 27 9 27 10 26 L14 22 L17 25 C18 26 20 26 21 25 C22 24 22 22 21 21 L18 18 L21 15 C22 14 22 12 21 11 Z"
        fill="white"
      />
    </g>
  </svg>
);

/**
 * Registry mapping utility tool slug to its distinct accent color, button styling,
 * 3 bullet highlights, and dedicated illustration.
 */
export interface UtilityVisualConfig {
  accentColor: string; // e.g. 'coral', 'blue', 'purple'
  iconBg: string; // Tailwind background gradient for icon squircle
  iconTextColor: string;
  badgeBg: string; // Tailwind styling for "Free" badge
  badgeText: string;
  buttonClass: string; // Tailwind styling for "Try Now" / "Open Tool" button
  bullets: string[];
  IllustrationComponent: React.FC<{ className?: string }>;
}

export const UTILITY_VISUAL_CONFIGS: Record<string, UtilityVisualConfig> = {
  'text-to-pdf': {
    accentColor: '#EF4444',
    iconBg: 'bg-red-500 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/25',
    badgeText: 'text-red-700 dark:text-red-300',
    buttonClass: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg shadow-red-500/25',
    bullets: ['Multiple formats', 'Custom page size', 'Instant download'],
    IllustrationComponent: TextToPdfIllustration,
  },
  'images-to-pdf': {
    accentColor: '#2563EB',
    iconBg: 'bg-blue-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/25',
    badgeText: 'text-blue-700 dark:text-blue-300',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/25',
    bullets: ['JPG, PNG, WebP support', 'Adjust order & layout', 'High quality output'],
    IllustrationComponent: ImagesToPdfIllustration,
  },
  'pdf-toolkit': {
    accentColor: '#7C3AED',
    iconBg: 'bg-purple-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-purple-50 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/25',
    badgeText: 'text-purple-700 dark:text-purple-300',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-lg shadow-purple-600/25',
    bullets: ['Merge & split', 'Compress & rotate', 'Add watermarks'],
    IllustrationComponent: PdfToolkitIllustration,
  },
  'image-toolkit': {
    accentColor: '#059669',
    iconBg: 'bg-emerald-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/25',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/25',
    bullets: ['Background remover', 'Image enhancer', 'Resize & crop'],
    IllustrationComponent: ImageToolkitIllustration,
  },
  'percentage-calculator': {
    accentColor: '#F97316',
    iconBg: 'bg-orange-500 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-orange-50 dark:bg-orange-500/15 border-orange-200 dark:border-orange-500/25',
    badgeText: 'text-orange-700 dark:text-orange-300',
    buttonClass: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-lg shadow-orange-500/25',
    bullets: ['Percentage calculation', 'Discount & GST', 'Ratio calculator'],
    IllustrationComponent: PercentageCalculatorIllustration,
  },
  'age-calculator': {
    accentColor: '#0D9488',
    iconBg: 'bg-teal-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-teal-50 dark:bg-teal-500/15 border-teal-200 dark:border-teal-500/25',
    badgeText: 'text-teal-700 dark:text-teal-300',
    buttonClass: 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-lg shadow-teal-600/25',
    bullets: ['Years, months, days', 'Next birthday', 'Easy to use'],
    IllustrationComponent: AgeCalculatorIllustration,
  },
  'finance-calculator': {
    accentColor: '#DB2777',
    iconBg: 'bg-pink-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-pink-50 dark:bg-pink-500/15 border-pink-200 dark:border-pink-500/25',
    badgeText: 'text-pink-700 dark:text-pink-300',
    buttonClass: 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white shadow-lg shadow-pink-600/25',
    bullets: ['Loan EMI', 'Compound interest', 'Simple interest'],
    IllustrationComponent: FinanceCalculatorIllustration,
  },
  'text-toolkit': {
    accentColor: '#4F46E5',
    iconBg: 'bg-indigo-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/25',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-600/25',
    bullets: ['Word & character count', 'Case converter', 'Remove duplicates'],
    IllustrationComponent: TextToolkitIllustration,
  },
  'json-studio': {
    accentColor: '#0284C7',
    iconBg: 'bg-sky-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/25',
    badgeText: 'text-sky-700 dark:text-sky-300',
    buttonClass: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-lg shadow-sky-600/25',
    bullets: ['Format JSON', 'Minify JSON', 'Validate data'],
    IllustrationComponent: JsonStudioIllustration,
  },
  'qr-generator': {
    accentColor: '#7C3AED',
    iconBg: 'bg-purple-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-purple-50 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/25',
    badgeText: 'text-purple-700 dark:text-purple-300',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-lg shadow-purple-600/25',
    bullets: ['Website links', 'Text & messages', 'WiFi & social media'],
    IllustrationComponent: QrGeneratorIllustration,
  },
  'unit-converter': {
    accentColor: '#D97706',
    iconBg: 'bg-amber-500 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/25',
    badgeText: 'text-amber-700 dark:text-amber-300',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-lg shadow-amber-500/25',
    bullets: ['Length, weight, temperature', 'Volume, speed & more', '100+ units'],
    IllustrationComponent: UnitConverterIllustration,
  },
  'developer-toolbox': {
    accentColor: '#059669',
    iconBg: 'bg-emerald-600 text-white',
    iconTextColor: 'text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/25',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/25',
    bullets: ['Base64 encode/decode', 'Hash generator', 'Regex tester'],
    IllustrationComponent: DeveloperToolboxIllustration,
  },
};
