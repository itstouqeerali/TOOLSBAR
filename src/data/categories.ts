import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'calculators',
    name: 'Calculators & Math',
    slug: 'calculators',
    icon: 'Calculator',
    description: 'Instant percentage, financial, scientific, and mathematical utilities.',
    toolCount: 9,
    colorAccent: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    slug: 'datetime',
    icon: 'Calendar',
    description: 'Precise age calculator, time zone diff, countdowns, and epoch timestamps.',
    toolCount: 2,
    colorAccent: 'from-amber-500/20 to-orange-500/20'
  },
  {
    id: 'text',
    name: 'Text & Content',
    slug: 'text',
    icon: 'FileText',
    description: 'Word counters, character statistics, case converters, and typography tools.',
    toolCount: 8,
    colorAccent: 'from-indigo-500/20 to-purple-500/20'
  },
  {
    id: 'developer',
    name: 'Developer Utilities',
    slug: 'developer',
    icon: 'Code2',
    description: 'JSON formatters, code minifiers, Base64 encoding, JWT decoder, and hashing.',
    toolCount: 10,
    colorAccent: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'converters',
    name: 'Unit Converters',
    slug: 'converters',
    icon: 'Scale',
    description: 'Universal conversions for length, mass, temperature, data storage, and volume.',
    toolCount: 3,
    colorAccent: 'from-violet-500/20 to-fuchsia-500/20'
  },
  {
    id: 'qr',
    name: 'QR & Barcodes',
    slug: 'qr',
    icon: 'QrCode',
    description: 'Custom styled QR generators for URLs, WiFi credentials, vCards, and text.',
    toolCount: 1,
    colorAccent: 'from-pink-500/20 to-rose-500/20'
  },
  {
    id: 'generators',
    name: 'Generators & Security',
    slug: 'generators',
    icon: 'KeyRound',
    description: 'Cryptographic password generators, UUIDs, hashes, and token creation.',
    toolCount: 2,
    colorAccent: 'from-sky-500/20 to-blue-500/20'
  },
  {
    id: 'pdf',
    name: 'PDF & Documents',
    slug: 'pdf',
    icon: 'FileSpreadsheet',
    description: 'Compress, merge, split, convert, and protect PDF files securely in browser.',
    toolCount: 5,
    colorAccent: 'from-red-500/20 to-amber-500/20'
  },
  {
    id: 'images',
    name: 'Images & Media',
    slug: 'images',
    icon: 'Image',
    description: 'Lossless compression, format conversion (JPG, PNG, WebP), and resizing.',
    toolCount: 5,
    colorAccent: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    id: 'colors',
    name: 'Color Tools',
    slug: 'colors',
    icon: 'Palette',
    description: 'HEX, RGB, HSL converters, contrast checkers, and harmonious palettes.',
    toolCount: 1,
    colorAccent: 'from-purple-500/20 to-pink-500/20'
  }
];

export interface CategoryStyle {
  iconBg: string;
  iconText: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  hoverBg: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  calculators: {
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/80 dark:border-blue-500/20',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/15',
    badgeText: 'text-blue-700 dark:text-blue-300',
    hoverBg: 'group-hover:bg-blue-600',
  },
  datetime: {
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconText: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/80 dark:border-amber-500/20',
    badgeBg: 'bg-amber-50 dark:bg-amber-500/15',
    badgeText: 'text-amber-700 dark:text-amber-300',
    hoverBg: 'group-hover:bg-amber-600',
  },
  text: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200/80 dark:border-indigo-500/20',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-500/15',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    hoverBg: 'group-hover:bg-indigo-600',
  },
  developer: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/80 dark:border-emerald-500/20',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    hoverBg: 'group-hover:bg-emerald-600',
  },
  converters: {
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
    iconText: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200/80 dark:border-violet-500/20',
    badgeBg: 'bg-violet-50 dark:bg-violet-500/15',
    badgeText: 'text-violet-700 dark:text-violet-300',
    hoverBg: 'group-hover:bg-violet-600',
  },
  qr: {
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    iconText: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/80 dark:border-rose-500/20',
    badgeBg: 'bg-rose-50 dark:bg-rose-500/15',
    badgeText: 'text-rose-700 dark:text-rose-300',
    hoverBg: 'group-hover:bg-rose-600',
  },
  generators: {
    iconBg: 'bg-sky-50 dark:bg-sky-500/10',
    iconText: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-200/80 dark:border-sky-500/20',
    badgeBg: 'bg-sky-50 dark:bg-sky-500/15',
    badgeText: 'text-sky-700 dark:text-sky-300',
    hoverBg: 'group-hover:bg-sky-600',
  },
  pdf: {
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    iconText: 'text-red-600 dark:text-red-400',
    border: 'border-red-200/80 dark:border-red-500/20',
    badgeBg: 'bg-red-50 dark:bg-red-500/15',
    badgeText: 'text-red-700 dark:text-red-300',
    hoverBg: 'group-hover:bg-red-600',
  },
  images: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/10',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200/80 dark:border-cyan-500/20',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    hoverBg: 'group-hover:bg-cyan-600',
  },
  colors: {
    iconBg: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
    iconText: 'text-fuchsia-600 dark:text-fuchsia-400',
    border: 'border-fuchsia-200/80 dark:border-fuchsia-500/20',
    badgeBg: 'bg-fuchsia-50 dark:bg-fuchsia-500/15',
    badgeText: 'text-fuchsia-700 dark:text-fuchsia-300',
    hoverBg: 'group-hover:bg-fuchsia-600',
  },
};
