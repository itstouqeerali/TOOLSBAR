import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'pdf',
    name: 'PDF & Documents',
    slug: 'pdf',
    icon: 'FileSpreadsheet',
    description: 'Compose, merge, split, compress, and compile images to vector PDF files in browser.',
    toolCount: 3,
    colorAccent: 'from-red-500/20 to-amber-500/20',
    editorial: {
      overview: 'The PDF & Documents suite on Toolsbar provides comprehensive, client-side document processing without cloud file uploads. From creating formatted documents with real-time logical pagination in Text to PDF, to sequencing photo galleries in Images to PDF, to merging, splitting, and compressing multi-page files in the PDF Toolkit, every operation runs inside your web browser for absolute confidentiality.',
      keyCapabilities: [
        'Compose formatted documents with dynamic page breaks and export to vector PDF via Text to PDF',
        'Convert photo sets (JPG, PNG) into organized, multi-page PDF documents with custom margins',
        'Merge multiple PDF documents in custom sequence, extract page ranges, and optimize file sizes in PDF Toolkit'
      ],
      practicalUseCases: [
        'Writing and printing professional contracts, resumes, and formal letters directly to PDF',
        'Compiling scanned receipts, identity documents, and photos into a single consolidated file',
        'Extracting specific chapters or compressing oversized PDF attachments under 5 MB for email delivery'
      ],
      helpfulNote: 'Document manipulation executes locally in your browser memory via WebAssembly and PDF-Lib with zero server telemetry.'
    }
  },
  {
    id: 'images',
    name: 'Images & Media',
    slug: 'images',
    icon: 'Image',
    description: 'Lossless compression, pixel-perfect resizing, and multi-format conversion (JPG, PNG, WebP).',
    toolCount: 1,
    colorAccent: 'from-cyan-500/20 to-blue-500/20',
    editorial: {
      overview: 'The Images & Media workspace provides fast, privacy-focused visual utilities to optimize and transform graphics for web publishing and design. Our Image Toolkit brings together responsive compression with real-time size comparison, dimension resizing with aspect-ratio locking, and bi-directional format conversion across WebP, PNG, and JPG formats.',
      keyCapabilities: [
        'Compress high-resolution photographs with live before-and-after byte comparisons',
        'Resize dimensions with aspect-ratio preservation and custom pixel width/height inputs',
        'Convert between WebP, PNG, and JPG formats in browser canvas memory without watermarks'
      ],
      practicalUseCases: [
        'Optimizing product photos and banner images to achieve higher Google PageSpeed scores',
        'Converting transparent PNG logos to high-efficiency WebP format for fast web delivery',
        'Resizing passport photos, social profile pictures, or banners to specific pixel boundaries'
      ],
      helpfulNote: 'All image rendering and compression takes place in HTML5 Canvas memory on your local machine.'
    }
  },
  {
    id: 'calculators',
    name: 'Calculators',
    slug: 'calculators',
    icon: 'Calculator',
    description: 'Percentages, retail discounts, sales tax, chronological age, and financial loan EMI calculators.',
    toolCount: 3,
    colorAccent: 'from-blue-500/20 to-cyan-500/20',
    editorial: {
      overview: 'The Calculators department delivers instant, mathematically rigorous computational utilities for everyday financial planning, commercial transactions, and milestone tracking. Solve standard percentages, retail discounts, and GST taxes in the Percentage Calculator, evaluate monthly mortgage EMIs and compounding interest in the Finance Calculator, or track exact elapsed lifespan down to the second in the Age Calculator.',
      keyCapabilities: [
        'Evaluate percentage changes, retail markdowns, and sales tax with step-by-step formula breakdowns',
        'Compute monthly loan repayments (EMI) with full principal and interest payment schedules',
        'Calculate exact chronological age with live ticking seconds and upcoming birthday countdowns'
      ],
      practicalUseCases: [
        'Calculating store discounts and regional sales tax during retail checkout budgeting',
        'Comparing auto loans, home mortgages, and compounding interest growth across various terms',
        'Verifying exact age requirements for travel visas, competition entries, or civil applications'
      ],
      helpfulNote: 'Calculations run in real-time in high-precision JavaScript floating-point arithmetic with clear mathematical formulas.'
    }
  },
  {
    id: 'text',
    name: 'Text & Content',
    slug: 'text',
    icon: 'FileText',
    description: 'Comprehensive text workspace for word counts, case changes, line cleaning, and slug generation.',
    toolCount: 1,
    colorAccent: 'from-indigo-500/20 to-purple-500/20',
    editorial: {
      overview: 'The Text & Content toolkit brings together indispensable tools for writers, copywriters, and developers who work with written content daily. The unified Text Toolkit provides detailed word and character metrics with social media limit gauges, grammatical case conversion, line deduplication and sorting, web URL slug creation, and placeholder Lorem Ipsum generation.',
      keyCapabilities: [
        'Measure word counts, character density, reading time estimates, and social media post limits',
        'Convert text between sentence case, Title Case, UPPERCASE, camelCase, and kebab-case',
        'Clean raw lists by stripping duplicate lines, removing redundant spaces, and sorting alphabetically',
        'Generate SEO-friendly URL slugs and custom-length Lorem Ipsum placeholder paragraphs'
      ],
      practicalUseCases: [
        'Drafting social media posts, headlines, and meta descriptions to avoid character truncation',
        'Cleaning up messy spreadsheet text exports, customer lists, and raw log files',
        'Generating clean URL paths and placeholder content for website design mockups'
      ],
      helpfulNote: 'All text analysis and formatting runs strictly in your browser session with zero external API calls.'
    }
  },
  {
    id: 'developer',
    name: 'Developer',
    slug: 'developer',
    icon: 'Code2',
    description: 'JSON Studio, syntax formatters, Base64, URL encoding, JWT decoder, UUIDs, and hashing.',
    toolCount: 2,
    colorAccent: 'from-emerald-500/20 to-teal-500/20',
    editorial: {
      overview: 'The Developer collection provides indispensable debugging, encoding, and formatting utilities for software engineers and web developers. Inspect, beautify, and minify payloads in the specialized JSON Studio, or use the Developer Toolbox for multi-language code formatting (HTML, CSS, JS), Base64 and URL encoding, cryptographic hashing, UUID generation, JWT token decoding, and Unix epoch conversions.',
      keyCapabilities: [
        'Validate, beautify, and compress JSON payloads with line-by-line syntax error identification',
        'Format and minify HTML, CSS, and JavaScript source code with customizable indentation',
        'Encode/decode Base64 and URL strings, inspect JWT authentication claims, and generate UUID v4 IDs',
        'Create cryptographic checksums (MD5, SHA-1, SHA-256) and convert Unix epoch timestamps'
      ],
      practicalUseCases: [
        'Inspecting nested REST API payloads and verifying token expiration claims during development',
        'Formatting minified stylesheet and script snippets for code reviews and documentation',
        'Generating test UUIDs and secure cryptographic passwords for database fixtures'
      ],
      helpfulNote: 'Developer utilities run purely client-side; proprietary credentials, API keys, and tokens are never transmitted.'
    }
  },
  {
    id: 'converters',
    name: 'Converters',
    slug: 'converters',
    icon: 'Scale',
    description: 'Universal measurement translator for distance, mass, temperature, storage, area, and speed.',
    toolCount: 1,
    colorAccent: 'from-violet-500/20 to-fuchsia-500/20',
    editorial: {
      overview: 'The Converters category provides instant, mathematically rigorous translations across metric, imperial, digital, and scientific measurement standards. The Universal Unit Converter seamlessly handles distance, mass/weight, temperature (°C, °F, K), digital data storage (bytes to petabytes), area, volume, and velocity with bidirectional precision.',
      keyCapabilities: [
        'Convert lengths, weights, areas, liquid volumes, and velocities across metric and imperial systems',
        'Translate temperature between Celsius, Fahrenheit, and Kelvin with standard scientific formulas',
        'Convert digital storage capacities across bits, bytes, kilobytes, megabytes, gigabytes, and terabytes'
      ],
      practicalUseCases: [
        'Translating international recipe temperatures and ingredient weights for cooking and baking',
        'Calculating cloud storage allocations and bandwidth metrics in megabytes vs. gigabytes',
        'Converting construction and engineering dimensions between metric and imperial standards'
      ],
      helpfulNote: 'All conversions rely on standard international measurement definitions and floating-point precision.'
    }
  },
  {
    id: 'qr',
    name: 'QR & Codes',
    slug: 'qr',
    icon: 'QrCode',
    description: 'High-resolution custom QR code generator for links, WiFi credentials, vCards, and text.',
    toolCount: 1,
    colorAccent: 'from-pink-500/20 to-rose-500/20',
    editorial: {
      overview: 'The QR & Codes utility provides a high-resolution generator for creating Quick Response 2D barcodes for print and digital publication. Easily encode website URLs, plain text, Wi-Fi credentials with automated connection flags, and contact cards with custom colors and downloadable PNG assets.',
      keyCapabilities: [
        'Generate standard-compliant QR codes with selectable error-correction levels',
        'Encode website URLs, Wi-Fi credentials, vCard contact info, and plain text notes',
        'Customize foreground and background colors and download high-resolution PNG image files'
      ],
      practicalUseCases: [
        'Creating contactless restaurant table menus, event flyers, or conference badge links',
        'Generating a guest Wi-Fi access code for office reception areas or homes',
        'Adding scannable contact details to printed business cards and promotional materials'
      ],
      helpfulNote: 'Always test scanning your QR code with a phone camera before printing large physical batches.'
    }
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
  calculators: {
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/80 dark:border-blue-500/20',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/15',
    badgeText: 'text-blue-700 dark:text-blue-300',
    hoverBg: 'group-hover:bg-blue-600',
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
};
