import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'calculators',
    name: 'Calculators & Math',
    slug: 'calculators',
    icon: 'Calculator',
    description: 'Instant percentage, financial, scientific, and mathematical utilities.',
    toolCount: 9,
    colorAccent: 'from-blue-500/20 to-cyan-500/20',
    editorial: {
      overview: 'The Calculators & Math suite on Toolsbar provides instant, precise computational utilities designed for everyday finances, academic problem solving, and commercial calculations. Rather than navigating cumbersome spreadsheets or complex formula sheets, you can quickly solve percentages, evaluate compound and simple interest rates, estimate monthly loan EMIs, and compute sales discounts or GST taxes with real-time feedback as you adjust values. Every calculator clearly breaks down mathematical formulas step-by-step so you understand exactly how results are calculated.',
      keyCapabilities: [
        'Evaluate percentage increases, percentage decreases, differences, and proportional ratios',
        'Estimate monthly loan repayments (EMI) with complete principal and interest payment schedules',
        'Compute compound interest accumulation over months or years with customizable compounding frequencies',
        'Calculate sales discounts, markups, and GST/VAT tax amounts for retail budgeting and invoicing'
      ],
      practicalUseCases: [
        'Determining the final checkout price after applying a seasonal 20% discount and regional sales tax',
        'Planning a 5-year auto loan or mortgage budget to compare total interest paid across various interest rates',
        'Calculating percentage changes in monthly business revenue, household utility expenses, or project metrics'
      ],
      helpfulNote: 'Mathematical calculations and financial estimates provide informative guidance for budgeting and planning. For legal tax filings or official banking contracts, consult certified financial professionals.'
    }
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    slug: 'datetime',
    icon: 'Calendar',
    description: 'Precise age calculator, time zone diff, countdowns, and epoch timestamps.',
    toolCount: 2,
    colorAccent: 'from-amber-500/20 to-orange-500/20',
    editorial: {
      overview: 'The Date & Time collection provides precise chronological tools for calculating intervals between dates, determining exact ages, and converting temporal data formats. Whether you need to find your exact age down to the day and second, compute elapsed duration between project milestones, or translate developer Unix timestamps into human-readable ISO dates, these utilities eliminate timezone errors and manual leap-year mathematics. All calculations run instantly on your device with zero latency.',
      keyCapabilities: [
        'Calculate exact chronological age in completed years, months, weeks, days, and live ticking seconds',
        'Convert Unix epoch timestamps (seconds and milliseconds) to UTC and localized date-time strings',
        'Determine days remaining until birthdays, anniversaries, and scheduled project deadlines'
      ],
      practicalUseCases: [
        'Verifying precise age requirements for legal forms, visa applications, competition entries, or insurance',
        'Debugging server log timestamps and converting UTC epoch values into local team timezones during testing',
        'Tracking milestone countdowns for product releases, event schedules, or academic semesters'
      ],
      helpfulNote: 'Calculations accurately account for Gregorian calendar leap years, varying month lengths, and standard UTC timezone offsets.'
    }
  },
  {
    id: 'text',
    name: 'Text & Content',
    slug: 'text',
    icon: 'FileText',
    description: 'Word counters, character statistics, case converters, and typography tools.',
    toolCount: 8,
    colorAccent: 'from-indigo-500/20 to-purple-500/20',
    editorial: {
      overview: 'The Text & Content toolkit brings together essential utilities for writers, editors, copywriters, and content creators who need fast, clean text manipulation. From counting words and analyzing reading times for essays to adjusting letter casing, removing duplicate lines from data sets, and cleaning up awkward whitespace, these tools streamline content preparation. All processing happens in your browser\'s local memory, making it safe to format unpublished drafts, personal notes, and internal business documents.',
      keyCapabilities: [
        'Analyze word count, character count (with and without spaces), sentences, and reading ease metrics',
        'Convert text between uppercase, lowercase, title case, sentence case, camelCase, and kebab-case',
        'Deduplicate lists, sort paragraphs alphabetically or numerically, and eliminate excess blank spaces',
        'Generate web-ready URL slugs and placeholder Lorem Ipsum paragraphs for layout prototyping'
      ],
      practicalUseCases: [
        'Ensuring social media updates, ads, and search meta descriptions stay within strict character limits',
        'Cleaning up messy tabular exports or spreadsheet columns by stripping duplicated lines and extra whitespace',
        'Formatting article headings, academic titles, or book chapters in standard Title Case'
      ],
      helpfulNote: 'Text manipulation executes purely in client memory without transmitting your drafts or sensitive notes to any remote servers.'
    }
  },
  {
    id: 'developer',
    name: 'Developer Utilities',
    slug: 'developer',
    icon: 'Code2',
    description: 'JSON formatters, code minifiers, Base64 encoding, JWT decoder, and hashing.',
    toolCount: 10,
    colorAccent: 'from-emerald-500/20 to-teal-500/20',
    editorial: {
      overview: 'The Developer Utilities section offers essential syntax formatters, encoders, and debugging tools crafted for software engineers, QA testers, and web developers. Working with raw JSON data, encoded URLs, Base64 strings, cryptographic hashes, and JWT authentication tokens frequently requires quick, reliable verification. Toolsbar gives developers a distraction-free, zero-latency environment to beautify minified payloads, validate regular expressions, inspect token headers and claims, and format code snippets directly in the browser.',
      keyCapabilities: [
        'Format, validate, and minify JSON, HTML, CSS, and JavaScript with customizable indentation',
        'Encode and decode Base64 strings, binary data, and percent-encoded URL query parameters',
        'Inspect and decode JSON Web Tokens (JWT) to inspect claims, expiration timestamps, and headers',
        'Generate random UUID v4 identifiers, test regular expression patterns, and produce cryptographic hashes (MD5, SHA-1, SHA-256)'
      ],
      practicalUseCases: [
        'Pretty-printing an API payload to inspect nested response objects during backend integration',
        'Decoding a JWT bearer token to check user permissions and verify expiration time claims',
        'Generating unique UUIDs for database seeding, fixture creation, and API mock data'
      ],
      helpfulNote: 'Developer tools execute in-browser so proprietary API responses, tokens, and code snippets are never transmitted across the network.'
    }
  },
  {
    id: 'converters',
    name: 'Unit Converters',
    slug: 'converters',
    icon: 'Scale',
    description: 'Universal conversions for length, mass, temperature, data storage, and volume.',
    toolCount: 3,
    colorAccent: 'from-violet-500/20 to-fuchsia-500/20',
    editorial: {
      overview: 'The Unit Converters category provides rapid, mathematically rigorous translations across metric, imperial, digital, and scientific measurement systems. Whether converting distance measurements for DIY home projects, switching between Fahrenheit and Celsius for cooking and weather, or calculating digital file sizes from gigabytes to terabytes, these tools give you instantaneous two-way conversions with clear conversion formulas displayed.',
      keyCapabilities: [
        'Convert lengths, masses, areas, volumes, and speeds across metric and imperial standards',
        'Translate temperatures between Celsius, Fahrenheit, and Kelvin scales with bidirectional formulas',
        'Convert digital storage capacities across bits, bytes, kilobytes, megabytes, gigabytes, and terabytes'
      ],
      practicalUseCases: [
        'Converting cooking recipe oven temperatures between Fahrenheit and Celsius for kitchen baking',
        'Calculating bandwidth allowances and cloud storage bucket capacities in megabytes vs. gigabytes',
        'Translating construction or hardware measurements between inches, feet, centimeters, and meters'
      ],
      helpfulNote: 'Values are computed using standard international measurement definitions and high-precision floating-point mathematics.'
    }
  },
  {
    id: 'qr',
    name: 'QR & Barcodes',
    slug: 'qr',
    icon: 'QrCode',
    description: 'Custom styled QR generators for URLs, WiFi credentials, vCards, and text.',
    toolCount: 1,
    colorAccent: 'from-pink-500/20 to-rose-500/20',
    editorial: {
      overview: 'The QR & Barcodes collection empowers businesses, educators, and individuals to generate clean, high-resolution Quick Response (QR) codes for digital and print distribution. You can instantly encode website URLs, plain text, Wi-Fi network credentials, email addresses, and contact cards into scannable 2D barcodes. With customizable foreground and background colors, high-contrast settings, and downloadable PNG vectors, you can easily create scannable materials for print posters, product packaging, menus, and conference badges.',
      keyCapabilities: [
        'Generate standard-compliant QR codes with adjustable error-correction levels',
        'Encode website links, Wi-Fi credentials with automated WPA/WPA2 join parameters, and vCard contact details',
        'Customize foreground and background color combinations while maintaining optical contrast',
        'Download generated QR codes as high-resolution PNG image files for print and web publication'
      ],
      practicalUseCases: [
        'Creating a contactless restaurant table menu link or event sign-up URL',
        'Generating a secure Wi-Fi login QR code for office guest lobbies or home visitors',
        'Adding a vCard QR code to physical business cards and marketing flyers'
      ],
      helpfulNote: 'Always verify scanning with a mobile device camera before printing large batches, ensuring high color contrast between foreground pixels and background canvas.'
    }
  },
  {
    id: 'generators',
    name: 'Generators & Security',
    slug: 'generators',
    icon: 'KeyRound',
    description: 'Cryptographic password generator with customizable entropy and character sets.',
    toolCount: 1,
    colorAccent: 'from-sky-500/20 to-blue-500/20',
    editorial: {
      overview: 'The Generators & Security category provides cryptographic utilities for producing secure credentials. Protecting online accounts requires strong, unpredictable passwords that resist credential stuffing and dictionary attacks. Our password generator uses your browser\'s native cryptographic pseudo-random number generator (window.crypto.getRandomValues) to create high-entropy passwords with custom character sets, avoiding weak predictable patterns without transmitting keys over the network.',
      keyCapabilities: [
        'Generate cryptographically secure passwords with customizable character sets, lengths, and symbols',
        'Assess password entropy, strength scores, and crack-time estimates',
        'Quick presets for PINs, memorable phrases, and complex administrative credentials'
      ],
      practicalUseCases: [
        'Creating randomized, high-entropy master passwords for password managers and online accounts',
        'Generating random alphanumeric passwords for new user account provisioning',
        'Creating temporary single-use passwords with custom symbol requirements'
      ],
      helpfulNote: 'Generated passwords are created locally in your browser session using window.crypto and are never logged, stored, or transmitted to any server.'
    }
  },
  {
    id: 'pdf',
    name: 'PDF & Documents',
    slug: 'pdf',
    icon: 'FileSpreadsheet',
    description: 'Compress, merge, split, convert, and protect PDF files securely in browser.',
    toolCount: 5,
    colorAccent: 'from-red-500/20 to-amber-500/20',
    editorial: {
      overview: 'The PDF & Documents category provides clean, client-side document utilities for managing everyday PDF workflows without expensive software subscriptions. You can merge multiple PDF reports into a single consolidated file, extract specific pages with page splitting, compress oversized documents for email attachment limits, convert photo galleries into neat PDF binders, and compose documents using a focused text editor. Processing runs in browser memory to keep sensitive contracts, invoices, and resumes private.',
      keyCapabilities: [
        'Merge multiple PDF files in custom page orders into a unified document',
        'Extract individual pages or specified page ranges from multi-page PDF documents',
        'Compress document file sizes to meet email and portal attachment thresholds',
        'Assemble image files (JPG, PNG) into clean, multi-page PDF albums',
        'Compose formatted documents directly into PDF format using our focused document editor'
      ],
      practicalUseCases: [
        'Combining signed contract pages, receipts, and supporting attachments into a single file for submission',
        'Extracting a single chapter or invoice page from a 50-page vendor report',
        'Compressing high-resolution scanned documents to under 5 MB for government and job portal uploads'
      ],
      helpfulNote: 'Document manipulation is handled in your browser memory via WebAssembly and modern web APIs, ensuring your private files are never uploaded to remote cloud servers.'
    }
  },
  {
    id: 'images',
    name: 'Images & Media',
    slug: 'images',
    icon: 'Image',
    description: 'Lossless compression, format conversion (JPG, PNG, WebP), and resizing.',
    toolCount: 5,
    colorAccent: 'from-cyan-500/20 to-blue-500/20',
    editorial: {
      overview: 'The Images & Media collection provides fast, privacy-respecting graphic utilities for optimizing, resizing, and converting web images. Whether you are preparing photos for website publishing, converting PNG screenshots into compact WebP or JPG files to save storage, or resizing dimensions for social media profile banners, these tools deliver crisp visual quality without watermarks. Utilizing HTML5 Canvas and browser-native compression, your media files remain on your local computer.',
      keyCapabilities: [
        'Compress JPG, PNG, and WebP images with adjustable visual quality and live file size comparisons',
        'Convert between modern image formats (PNG to JPG, JPG to PNG, and WebP)',
        'Resize image dimensions with aspect-ratio locking and customizable width and height parameters'
      ],
      practicalUseCases: [
        'Compressing product photos and blog headers to improve website page load speeds and Core Web Vitals',
        'Converting transparent PNG logos to universal JPG format for email signatures',
        'Resizing high-resolution camera photos to exact dimensions required for social profiles or passports'
      ],
      helpfulNote: 'Image processing occurs in your browser\'s canvas memory. No files are uploaded to third-party hosting services, ensuring complete confidentiality for personal photos.'
    }
  },
  {
    id: 'colors',
    name: 'Color Tools',
    slug: 'colors',
    icon: 'Palette',
    description: 'Color palette generator and harmony utilities (currently in development).',
    toolCount: 1,
    colorAccent: 'from-purple-500/20 to-pink-500/20',
    editorial: {
      overview: 'The Color Tools category is currently in active development. We are engineering browser-native color utilities to assist designers and frontend developers in generating color palettes, testing color harmonies, and previewing color formats. Once launched, these utilities will provide intuitive color exploration directly within your browser.',
      keyCapabilities: [
        'Color palette generation and harmonic color scheme exploration (In Development)',
        'Color space format previews for web stylesheets (In Development)'
      ],
      practicalUseCases: [
        'Exploring complementary and monochromatic palettes for website layouts (upcoming)',
        'Previewing color palettes for digital design systems (upcoming)'
      ],
      helpfulNote: 'Utilities in this category are currently under construction and will be made available as browser-ready components upon completion.'
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
