import { Tool } from '../types';
import { TextToPdf } from '../components/tools/TextToPdf';
import { ImagesToPdf } from '../components/tools/ImagesToPdf';
import { PdfToolkit } from '../components/tools/PdfToolkit';
import { ImageToolkit } from '../components/tools/ImageToolkit';
import { PercentageCalculator } from '../components/tools/PercentageCalculator';
import { AgeCalculator } from '../components/tools/AgeCalculator';
import { FinanceCalculator } from '../components/tools/FinanceCalculator';
import { TextToolkit } from '../components/tools/TextToolkit';
import { JsonStudio } from '../components/tools/JsonStudio';
import { QrGenerator } from '../components/tools/QrGenerator';
import { UnitConverter } from '../components/tools/UnitConverter';
import { DeveloperToolbox } from '../components/tools/DeveloperToolbox';

/**
 * Legacy URL alias mapping table.
 * Preserves zero broken links, zero 404s, and routes historical links
 * to their respective active flagship workspace with active tab parameters.
 */
export const LEGACY_ROUTE_MAP: Record<string, string> = {
  // PDF Utilities -> PDF Toolkit
  'pdf-merger': '/tools/pdf-toolkit?tab=merge',
  'pdf-splitter': '/tools/pdf-toolkit?tab=split',
  'pdf-compressor': '/tools/pdf-toolkit?tab=compress',

  // Image Utilities -> Image Toolkit
  'image-compressor': '/tools/image-toolkit?tab=compress',
  'image-resizer': '/tools/image-toolkit?tab=resize',
  'jpg-to-png': '/tools/image-toolkit?tab=jpg-to-png',
  'png-to-jpg': '/tools/image-toolkit?tab=png-to-jpg',
  'webp-converter': '/tools/image-toolkit?tab=webp',

  // Calculator Utilities -> Percentage Calculator
  'discount-calculator': '/tools/percentage-calculator?tab=discount',
  'gst-tax-calculator': '/tools/percentage-calculator?tab=tax',
  'ratio-calculator': '/tools/percentage-calculator?tab=ratio',

  // Financial Calculators -> Finance Calculator
  'loan-emi-calculator': '/tools/finance-calculator?tab=loan',
  'compound-interest-calculator': '/tools/finance-calculator?tab=compound',
  'simple-interest-calculator': '/tools/finance-calculator?tab=simple',

  // Text Micro-Tools -> Text Toolkit
  'word-counter': '/tools/text-toolkit?tab=word-counter',
  'character-counter': '/tools/text-toolkit?tab=character-counter',
  'case-converter': '/tools/text-toolkit?tab=case-converter',
  'remove-duplicate-lines': '/tools/text-toolkit?tab=remove-duplicate-lines',
  'remove-extra-spaces': '/tools/text-toolkit?tab=remove-extra-spaces',
  'text-sorter': '/tools/text-toolkit?tab=text-sorter',
  'slug-generator': '/tools/text-toolkit?tab=slug-generator',
  'lorem-ipsum-generator': '/tools/text-toolkit?tab=lorem-ipsum-generator',

  // JSON Tools -> JSON Studio
  'json-formatter': '/tools/json-studio?tab=format',
  'json-minifier': '/tools/json-studio?tab=minify',

  // Unit Converters -> Universal Unit Converter
  'temperature-converter': '/tools/unit-converter?category=temperature',
  'data-storage-converter': '/tools/unit-converter?category=digital',

  // Developer Utilities -> Developer Toolbox
  'base64': '/tools/developer-toolbox?tab=base64',
  'url-encoder-decoder': '/tools/developer-toolbox?tab=url',
  'jwt-decoder': '/tools/developer-toolbox?tab=jwt',
  'uuid-generator': '/tools/developer-toolbox?tab=uuid',
  'hash-generator': '/tools/developer-toolbox?tab=hash',
  'regex-tester': '/tools/developer-toolbox?tab=regex',
  'html-formatter': '/tools/developer-toolbox?tab=html',
  'css-formatter': '/tools/developer-toolbox?tab=css',
  'javascript-formatter': '/tools/developer-toolbox?tab=javascript',
  'password-generator': '/tools/developer-toolbox?tab=password',
  'unix-timestamp-converter': '/tools/developer-toolbox?tab=timestamp',
};

export interface RetiredToolInfo {
  slug: string;
  name: string;
  categoryName: string;
  reason: string;
}

/**
 * Tools that have been intentionally retired with no genuine flagship replacement.
 * Served on a clean dedicated retired page with noindex, no ads, and link to directory.
 */
export const RETIRED_TOOLS: Record<string, RetiredToolInfo> = {
  'bmi-calculator': {
    slug: 'bmi-calculator',
    name: 'BMI & Body Health Calculator',
    categoryName: 'Health & Fitness',
    reason: 'This standalone utility has been retired from Toolsbar as part of our platform consolidation to focus on core productivity and document engineering flagships.'
  },
  'average-calculator': {
    slug: 'average-calculator',
    name: 'Average & Statistics Calculator',
    categoryName: 'Calculators',
    reason: 'This standalone utility has been retired from Toolsbar to maintain focus on our primary financial and percentage computation flagships.'
  },
  'color-palette-picker': {
    slug: 'color-palette-picker',
    name: 'Color Palette & Contrast',
    categoryName: 'Design',
    reason: 'This tool is not available in our active catalog.'
  }
};

/**
 * Master Registry of Exactly 12 Approved Flagship Tools
 */
export const TOOLS: Tool[] = [
  // 1. Text to PDF (Untouched flagship document editor)
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    slug: 'text-to-pdf',
    category: 'pdf',
    description: 'Professional browser document editor with real-time logical pagination, rich typography, and vector PDF export.',
    shortDesc: 'Compose rich documents with live page boundaries and PDF download.',
    icon: 'FileText',
    keywords: [
      'text to pdf', 'pdf editor', 'document creator', 'word to pdf', 
      'write pdf', 'rich text pdf', 'wysiwyg pdf', 'create pdf', 'browser word processor'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: TextToPdf,
    relatedToolSlugs: ['images-to-pdf', 'pdf-toolkit', 'text-toolkit'],
    seo: {
      title: 'Text to PDF — Online Document Editor & Vector PDF Generator',
      description: 'Write, format, and generate publication-quality PDF documents online. Features real-time multi-page pagination, custom margins, headers, footers, and direct vector PDF export.',
      keywords: ['text to pdf', 'online document editor', 'create pdf online', 'rich text to pdf'],
      h1: 'Text to PDF Document Studio',
      intro: 'Draft and format professional multi-page documents directly in your browser with true print-accurate pagination, page setup controls, and crisp vector PDF download.',
      howToUse: [
        'Type or paste your content directly into the rich text editor.',
        'Use the top toolbar to style headings, bold text, lists, alignment, and page breaks.',
        'Adjust paper format (A4, Letter), orientation, and margins via Page Setup.',
        'Click "Export PDF" to instantly compile and download your vector PDF.'
      ],
      features: [
        'Client-side print-accurate pagination engine preventing line overlaps across page gaps',
        'Customizable paper dimensions, margins, running headers, and page numbering',
        'Rich text formatting: headings (H1-H3), bulleted lists, numbered lists, and colors',
        '100% private in-browser generation with zero server uploads'
      ],
      faq: [
        {
          question: 'Are my typed documents sent to any remote server?',
          answer: 'No. All document editing, pagination calculations, and PDF compilation execute locally in your browser memory.'
        },
        {
          question: 'Can I choose between A4 and US Letter sizes?',
          answer: 'Yes. Use the Page Setup panel to toggle between A4 and US Letter standards in either portrait or landscape orientation.'
        },
        {
          question: 'How does multi-page pagination work?',
          answer: 'The editor calculates physical paper height, safe body bounds, and margins in logical points, creating visual page sheets dynamically as your content expands.'
        }
      ]
    }
  },

  // 2. Images to PDF
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    slug: 'images-to-pdf',
    category: 'pdf',
    description: 'Convert JPG, PNG, and WebP images into a cohesive multi-page PDF with custom margins and page orientation.',
    shortDesc: 'Combine photos and graphics into a clean, unified PDF album.',
    icon: 'FileImage',
    keywords: [
      'images to pdf', 'jpg to pdf', 'png to pdf', 'photos to pdf', 
      'picture to pdf', 'combine images to pdf', 'image binder'
    ],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: ImagesToPdf,
    relatedToolSlugs: ['text-to-pdf', 'pdf-toolkit', 'image-toolkit'],
    seo: {
      title: 'Images to PDF — Convert Photos & Graphics to PDF Free',
      description: 'Convert and combine JPG, PNG, and WebP images into a single multi-page PDF document. Reorder pages, adjust margins, and download high-resolution PDFs.',
      keywords: ['images to pdf', 'jpg to pdf converter', 'photos to pdf', 'convert png to pdf'],
      h1: 'Images to PDF Converter',
      intro: 'Quickly organize multiple image files into an organized PDF document with custom margins, paper sizing, and drag-and-drop page sequencing.',
      howToUse: [
        'Drag and drop your images (JPG, PNG, WebP) into the upload dropzone.',
        'Reorder images by dragging them into your preferred page order.',
        'Choose your paper size (A4, Letter), orientation, and margin spacing.',
        'Click "Generate PDF" to download your compiled PDF album.'
      ],
      features: [
        'Support for JPG, PNG, and WebP image formats',
        'Interactive drag-and-drop reordering of image pages',
        'Custom paper sizing (A4, Letter) with portrait and landscape modes',
        'Direct browser compilation using PDF-Lib with zero server uploads'
      ],
      faq: [
        {
          question: 'Is there a limit on how many images I can convert?',
          answer: 'You can convert dozens of images simultaneously. Since processing runs in your browser memory, it is bounded only by your device memory.'
        },
        {
          question: 'Are my private photos uploaded to a cloud server?',
          answer: 'No. Images are decoded and compiled into the PDF document entirely inside your local browser.'
        }
      ]
    }
  },

  // 3. PDF Toolkit (Merged: Merge, Split, Compress)
  {
    id: 'pdf-toolkit',
    name: 'PDF Toolkit',
    slug: 'pdf-toolkit',
    category: 'pdf',
    description: 'Comprehensive workspace to merge multiple PDFs, extract and split page ranges, and compress file size.',
    shortDesc: 'Merge, split, and compress PDF documents in one unified workspace.',
    icon: 'Layers',
    keywords: [
      'pdf toolkit', 'pdf merger', 'merge pdf', 'combine pdf', 'join pdf',
      'pdf splitter', 'split pdf', 'extract pdf pages', 'separate pdf',
      'pdf compressor', 'compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf tools'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: PdfToolkit,
    relatedToolSlugs: ['text-to-pdf', 'images-to-pdf', 'image-toolkit'],
    seo: {
      title: 'PDF Toolkit — Merge, Split & Compress PDF Files Online',
      description: 'All-in-one PDF manipulation workspace. Combine multiple PDF documents, extract custom page ranges, and compress PDF file sizes securely in your browser.',
      keywords: ['pdf toolkit', 'merge pdf online', 'split pdf pages', 'compress pdf file', 'combine pdfs'],
      h1: 'PDF Toolkit Workspace',
      intro: 'Handle all everyday PDF tasks in one private studio: combine multi-page files in custom order, extract specific pages, and compress documents for email delivery.',
      howToUse: [
        'Select your task tab: "Merge PDFs", "Split & Extract", or "Compress PDF".',
        'Upload your source PDF files directly via drag-and-drop.',
        'Configure your options (e.g. page sequences, page ranges, or compression level).',
        'Process and download your modified PDF document instantly.'
      ],
      features: [
        'Merge: combine multiple PDF files in custom page sequence',
        'Split: extract individual sheets or comma-separated page ranges (e.g. 1-3, 5)',
        'Compress: optimize embedded objects to reduce document file size for email portals',
        'Zero cloud uploads: 100% client-side WebAssembly and PDF-Lib execution'
      ],
      faq: [
        {
          question: 'Can I extract non-consecutive pages from a PDF?',
          answer: 'Yes. Use the Split tab to specify exact page numbers or ranges, such as "1, 3, 5-8", to create a new targeted document.'
        },
        {
          question: 'Will merging PDFs reduce document clarity?',
          answer: 'No. The merger combines existing vector streams and embedded images losslessly without re-encoding text.'
        }
      ]
    }
  },

  // 4. Image Toolkit (Merged: Compress, Resize, Convert JPG/PNG/WebP)
  {
    id: 'image-toolkit',
    name: 'Image Toolkit',
    slug: 'image-toolkit',
    category: 'images',
    description: 'All-in-one media studio: compress file sizes, resize dimensions with aspect-ratio lock, and convert between JPG, PNG, and WebP.',
    shortDesc: 'Compress, resize, and convert images between JPG, PNG & WebP.',
    icon: 'Image',
    keywords: [
      'image toolkit', 'image compressor', 'compress image', 'reduce image size',
      'image resizer', 'resize photo', 'scale image', 'change dimensions',
      'jpg to png', 'png to jpg', 'webp converter', 'convert to webp', 'image converter'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: ImageToolkit,
    relatedToolSlugs: ['images-to-pdf', 'pdf-toolkit', 'qr-generator'],
    seo: {
      title: 'Image Toolkit — Compress, Resize & Convert Images Online',
      description: 'Professional browser image studio. Compress image file size, resize pixel dimensions, and convert across WebP, PNG, and JPG formats with live preview.',
      keywords: ['image toolkit', 'image compressor', 'image resizer', 'webp converter', 'jpg to png'],
      h1: 'Image Toolkit Workspace',
      intro: 'Optimize, scale, and transform your media in seconds. Compress high-resolution photos, resize pixel dimensions with aspect-ratio lock, and convert formats with real-time feedback.',
      howToUse: [
        'Choose your workspace tab: "Compress", "Resize Dimensions", or "Format Converter".',
        'Upload your image file (JPG, PNG, or WebP).',
        'Adjust the quality slider, target pixel dimensions, or select output format.',
        'Preview your optimized image and download with one click.'
      ],
      features: [
        'Image Compression: fine-tune quality with live before-and-after byte size metrics',
        'Dimension Resizing: scale width and height with locked aspect ratio or custom dimensions',
        'Universal Format Conversion: convert bi-directionally between WebP, PNG, and JPG',
        '100% browser-based processing via HTML5 Canvas with zero telemetry'
      ],
      faq: [
        {
          question: 'Why should I convert images to WebP?',
          answer: 'WebP provides superior lossless and lossy compression, reducing file size by up to 30% compared to JPG without noticeable visual degradation.'
        },
        {
          question: 'Does resizing distort photo proportions?',
          answer: 'No. By default, the aspect-ratio lock maintains original width-to-height proportions automatically as you adjust values.'
        }
      ]
    }
  },

  // 5. Percentage Calculator (Merged: Standard %, Discount, GST Tax, Ratio)
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'calculators',
    description: 'Calculate percentages, increases, decreases, retail discounts, sales tax / GST, and proportional ratios.',
    shortDesc: 'Solve percentages, sales discounts, GST taxes, and ratios.',
    icon: 'Percent',
    keywords: [
      'percentage calculator', 'percent', 'discount calculator', 'sale price calculator',
      'gst tax calculator', 'sales tax', 'vat calculator', 'ratio calculator',
      'aspect ratio', 'percentage increase', 'percentage decrease', 'tip calculator'
    ],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: PercentageCalculator,
    relatedToolSlugs: ['finance-calculator', 'age-calculator', 'unit-converter'],
    seo: {
      title: 'Percentage Calculator — Percentages, Discounts, Taxes & Ratios',
      description: 'Free online percentage and proportion suite. Calculate percentage increases/decreases, retail store discounts, GST/sales taxes, and mathematical ratios with live formula steps.',
      keywords: ['percentage calculator', 'discount calculator', 'gst calculator', 'ratio calculator', 'percent change'],
      h1: 'Percentage & Proportions Suite',
      intro: 'Solve every percentage scenario instantly: find percentage of any number, calculate retail store discounts, add or remove sales taxes, and scale mathematical ratios.',
      howToUse: [
        'Select your calculation mode: "Standard %", "Discount & Sale", "GST & Sales Tax", or "Ratio & Aspect".',
        'Enter your input values into the number fields.',
        'View the instant real-time result, step-by-step formula breakdown, and copy to clipboard.'
      ],
      features: [
        'Standard Percentages: 5 calculation modes covering % of number, percent difference, and whole values',
        'Discount Calculator: compute final sale price, dollar savings, and additional coupon stacking',
        'GST & Sales Tax: calculate gross and net prices with selectable tax percentages',
        'Ratio Calculator: solve proportional math and calculate standard 16:9, 4:3 aspect ratios'
      ],
      faq: [
        {
          question: 'How do you calculate percentage increase or decrease?',
          answer: 'Subtract the original value from the new value, divide by the original value, and multiply by 100: ((New − Original) / Original) × 100.'
        },
        {
          question: 'How do I calculate price before GST or sales tax?',
          answer: 'To remove tax from a gross price, divide the total by (1 + TaxRate/100). For example, with 10% tax: $110 ÷ 1.10 = $100 net.'
        }
      ]
    }
  },

  // 6. Age Calculator
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'calculators',
    description: 'Calculate exact chronological age in completed years, months, days, hours, and live ticking seconds.',
    shortDesc: 'Exact age in years, months, days, hours, minutes & seconds.',
    icon: 'Calendar',
    keywords: [
      'age calculator', 'chronological age', 'birthday calculator', 'days alive',
      'birthday countdown', 'milestone calculator', 'time alive'
    ],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: AgeCalculator,
    relatedToolSlugs: ['percentage-calculator', 'finance-calculator', 'unit-converter'],
    seo: {
      title: 'Age Calculator — Exact Chronological Age in Years, Months & Days',
      description: 'Calculate your exact chronological age from date of birth. View completed years, months, days, live ticking seconds, total duration alive, and upcoming birthday countdowns.',
      keywords: ['age calculator', 'chronological age calculator', 'birthday countdown', 'days alive'],
      h1: 'Chronological Age Calculator',
      intro: 'Determine exact chronological age with live second ticking, total lifetime duration across all calendar units, and birthday celebration countdown.',
      howToUse: [
        'Pick your Date of Birth in the date picker field.',
        'Optionally specify your exact birth time for pinpoint second precision.',
        'Review your comprehensive chronological breakdown and copy your milestone summary.'
      ],
      features: [
        'Exact chronological breakdown in years, months, days, hours, and live seconds',
        'Total elapsed duration expressed in total months, weeks, days, and hours',
        'Next birthday countdown indicator displaying remaining days and weekday',
        'Automatic leap year calculation compensating for Gregorian calendar cycles'
      ],
      faq: [
        {
          question: 'Does the calculator account for leap years?',
          answer: 'Yes. The algorithm tracks each February across your lifespan to ensure accurate day counts.'
        },
        {
          question: 'Can I find my exact age on a historical date?',
          answer: 'Yes. You can customize the reference target date to compute your age on any past or future milestone.'
        }
      ]
    }
  },

  // 7. Finance Calculator (Merged: Loan EMI, Compound Interest, Simple Interest)
  {
    id: 'finance-calculator',
    name: 'Finance Calculator',
    slug: 'finance-calculator',
    category: 'calculators',
    description: 'Comprehensive financial planning hub: monthly Loan & Mortgage EMI, Compound Interest, and Simple Interest.',
    shortDesc: 'Compute loan EMIs, compound interest growth & simple interest.',
    icon: 'Landmark',
    keywords: [
      'finance calculator', 'loan emi calculator', 'mortgage calculator', 'emi calculator',
      'compound interest calculator', 'compound interest', 'simple interest calculator',
      'simple interest', 'loan amortization', 'interest calculator', 'car loan calculator'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: FinanceCalculator,
    relatedToolSlugs: ['percentage-calculator', 'age-calculator', 'unit-converter'],
    seo: {
      title: 'Finance Calculator — Loan EMI, Compound & Simple Interest',
      description: 'Comprehensive financial calculator. Estimate monthly loan and mortgage repayments with amortization breakdowns, calculate compound investment returns, and compute simple interest.',
      keywords: ['finance calculator', 'loan emi calculator', 'compound interest calculator', 'simple interest calculator'],
      h1: 'Finance & Loan Calculator',
      intro: 'Plan loans, mortgages, and investment growth with precision. Estimate monthly EMI payments, compare compounding frequencies, and project interest accumulation.',
      howToUse: [
        'Select your calculation tab: "Loan & Mortgage EMI", "Compound Interest", or "Simple Interest".',
        'Enter principal amount, annual interest rate (%), and loan/investment tenure.',
        'Examine monthly repayments, total interest payable, and comprehensive payment schedules.'
      ],
      features: [
        'Loan EMI: calculate monthly installments with breakdown of principal vs. interest',
        'Compound Interest: customizable compounding frequencies (annually, quarterly, monthly, daily)',
        'Simple Interest: standard P × R × T calculation with total payout projections',
        'Instant clipboard copy and printable financial summaries'
      ],
      faq: [
        {
          question: 'How is monthly loan EMI calculated?',
          answer: 'EMI is calculated using the standard amortization formula: EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is principal, R is monthly interest rate, and N is tenure in months.'
        },
        {
          question: 'What is the difference between simple and compound interest?',
          answer: 'Simple interest accrues only on the original principal. Compound interest accrues on both the principal and previously accumulated interest, yielding exponential growth.'
        }
      ]
    }
  },

  // 8. Text Toolkit (Merged: Word & Character Counter, Case Converter, Deduplication, Spaces, Sorter, Slug, Lorem)
  {
    id: 'text-toolkit',
    name: 'Text Toolkit',
    slug: 'text-toolkit',
    category: 'text',
    description: 'All-in-one text workspace: word & character counters with social limits, case conversion, line cleaning, slug generation, and Lorem Ipsum.',
    shortDesc: 'Word & character analytics, case conversion, line cleaning & slug creation.',
    icon: 'FileText',
    keywords: [
      'text toolkit', 'word counter', 'character counter', 'case converter',
      'remove duplicate lines', 'remove extra spaces', 'text sorter',
      'slug generator', 'lorem ipsum generator', 'reading time', 'text cleaner',
      'uppercase', 'lowercase', 'title case', 'alphabetize lines'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: TextToolkit,
    relatedToolSlugs: ['text-to-pdf', 'json-studio', 'developer-toolbox'],
    seo: {
      title: 'Text Toolkit — Word Counter, Case Converter & Text Utilities',
      description: 'Comprehensive online text workstation. Measure word and character counts with social media limit gauges, convert letter casing, clean up duplicated lines and whitespace, and generate slugs.',
      keywords: ['text toolkit', 'word counter', 'character counter', 'case converter', 'remove duplicate lines', 'slug generator'],
      h1: 'Text & Content Toolkit',
      intro: 'Everything writers, editors, and developers need to process text. Analyze prose metrics, convert casing formats, clean and alphabetize messy lists, and produce placeholder copy.',
      howToUse: [
        'Select your tool tab: "Word & Character Metrics", "Case Converter", "Clean & Sort Lines", "Slug Generator", or "Lorem Ipsum".',
        'Paste your prose or list into the active workspace editor.',
        'View live word/character statistics or apply instant line formatting transformations.',
        'Copy the processed text or export directly with one click.'
      ],
      features: [
        'Metrics: word count, character count (with/without spaces), reading time, and social media gauges',
        'Case Converter: Sentence case, Title Case, UPPERCASE, lowercase, camelCase, and kebab-case',
        'Line Cleaning: one-click removal of duplicate rows, stripping excess whitespace, and sorting alphabetically',
        'Generators: web-ready URL slug creation and customizable Lorem Ipsum dummy text'
      ],
      faq: [
        {
          question: 'Are my unpublished drafts safe in this tool?',
          answer: 'Yes. All text processing executes purely in your browser local memory with zero remote server transmission.'
        },
        {
          question: 'Can I alphabetize lists while stripping duplicates?',
          answer: 'Yes. The Clean & Sort workspace enables you to deduplicate lines, trim whitespace, and sort rows in ascending or descending order.'
        }
      ]
    }
  },

  // 9. JSON Studio (Merged: Formatter, Validator, Minifier, Tree)
  {
    id: 'json-studio',
    name: 'JSON Studio',
    slug: 'json-studio',
    category: 'developer',
    description: 'Inspect, validate, beautify, and minify JSON payloads with line-by-line syntax error diagnostics.',
    shortDesc: 'Beautify, validate, minify, and inspect JSON payloads.',
    icon: 'Code2',
    keywords: [
      'json studio', 'json formatter', 'json validator', 'beautify json',
      'json minifier', 'minify json', 'compress json', 'pretty print json',
      'format json', 'json tree viewer', 'fix json'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: JsonStudio,
    relatedToolSlugs: ['developer-toolbox', 'text-toolkit', 'qr-generator'],
    seo: {
      title: 'JSON Studio — Format, Validate & Minify JSON Online',
      description: 'Professional browser JSON workstation. Inspect, validate, beautify with custom indentation, minify for production, and locate syntax errors with real-time diagnostics.',
      keywords: ['json studio', 'json formatter', 'json validator', 'json minifier', 'format json online'],
      h1: 'JSON Studio Workspace',
      intro: 'Beautify messy API payloads, validate RFC 8259 syntax, and compress JSON payloads for production environments with zero server roundtrips.',
      howToUse: [
        'Paste your JSON payload into the input editor.',
        'Choose "Beautify & Validate" to format with 2-space, 4-space, or tab indentation.',
        'Switch to "Minify & Compress" to strip all unnecessary whitespace and evaluate byte savings.',
        'Copy the valid JSON or download the formatted file.'
      ],
      features: [
        'RFC 8259 syntax validation with real-time error messages and character positions',
        'Customizable indentation: 2 spaces, 4 spaces, or tabs',
        'Production minification calculating total bytes saved and compression percentage',
        'Interactive tree view allowing exploration of deep nested objects and arrays'
      ],
      faq: [
        {
          question: 'Are sensitive API keys or tokens in my JSON sent anywhere?',
          answer: 'No. All validation, parsing, and formatting occurs entirely on the client side in JavaScript memory.'
        },
        {
          question: 'What happens if my JSON has a syntax error?',
          answer: 'JSON Studio highlights the exact parsing exception and points you to the error location for quick fixes.'
        }
      ]
    }
  },

  // 10. QR Code Generator
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    slug: 'qr-generator',
    category: 'qr',
    description: 'Generate high-resolution custom QR codes for URLs, WiFi networks, vCard contact cards, and text with custom colors.',
    shortDesc: 'Create customized, high-resolution scannable QR codes.',
    icon: 'QrCode',
    keywords: [
      'qr code generator', 'create qr code', 'wifi qr code', 'vcard qr code',
      'custom qr code', 'qr maker', 'qr barcode', 'download qr code'
    ],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: QrGenerator,
    relatedToolSlugs: ['image-toolkit', 'unit-converter', 'developer-toolbox'],
    seo: {
      title: 'QR Code Generator — Free Custom QR Codes with Colors',
      description: 'Create customized, high-resolution QR codes online. Encode website links, Wi-Fi network credentials, vCards, and text with custom colors and downloadable PNG images.',
      keywords: ['qr code generator', 'custom qr code', 'free qr code maker', 'wifi qr code'],
      h1: 'Custom QR Code Generator',
      intro: 'Generate high-contrast, scannable QR codes for print and digital publishing. Customize foreground/background colors, set error correction, and download crisp PNG images.',
      howToUse: [
        'Select your QR type: Website URL, Wi-Fi Network, vCard, or Plain Text.',
        'Fill in the corresponding details (e.g. website address or Wi-Fi password).',
        'Optionally customize foreground and background colors.',
        'Preview and download your high-resolution PNG image.'
      ],
      features: [
        'Support for website links, Wi-Fi auto-connect, vCard contacts, and raw text',
        'Adjustable error correction levels (L, M, Q, H) to maintain scannability',
        'Custom color customization with optical contrast indicators',
        'High-resolution PNG download for print posters, table tents, and flyers'
      ],
      faq: [
        {
          question: 'Do generated QR codes ever expire?',
          answer: 'No. These are static QR codes containing direct encoded text; they never expire and require no subscription.'
        },
        {
          question: 'Can smartphones connect to Wi-Fi automatically using a QR code?',
          answer: 'Yes. Modern iOS and Android camera apps automatically recognize the encoded Wi-Fi network credentials and prompt to connect.'
        }
      ]
    }
  },

  // 11. Universal Unit Converter (Merged: Standard Units, Temperature, Data Storage)
  {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    slug: 'unit-converter',
    category: 'converters',
    description: 'Universal measurement converter: length, weight/mass, temperature (°C, °F, K), digital data storage, area, speed, and volume.',
    shortDesc: 'Convert length, weight, temperature, data storage & volume.',
    icon: 'Scale',
    keywords: [
      'unit converter', 'universal converter', 'temperature converter', 'celsius to fahrenheit',
      'data storage converter', 'bytes to gb', 'mb to gb', 'length converter',
      'weight converter', 'inches to cm', 'kg to lbs', 'metric imperial'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: UnitConverter,
    relatedToolSlugs: ['percentage-calculator', 'finance-calculator', 'developer-toolbox'],
    seo: {
      title: 'Universal Unit Converter — Metric, Imperial, Temp & Data Storage',
      description: 'Free online unit converter. Instantly convert length, weight, temperature (Celsius, Fahrenheit, Kelvin), digital data storage (MB, GB, TB), area, volume, and velocity.',
      keywords: ['unit converter', 'temperature converter', 'data storage converter', 'metric to imperial', 'celsius to fahrenheit'],
      h1: 'Universal Unit Converter',
      intro: 'Convert measurements across 8 comprehensive categories: length, mass, temperature, digital data storage, area, volume, speed, and time with high precision.',
      howToUse: [
        'Select your measurement category (e.g. Length, Temperature, or Digital Storage).',
        'Pick your "From" and "To" measurement units.',
        'Enter the quantity you wish to convert to view the instant calculated result.'
      ],
      features: [
        '8 distinct measurement categories with over 50 international unit definitions',
        'Dedicated Temperature conversions across Celsius, Fahrenheit, and Kelvin',
        'Digital Data Storage conversions from single bytes up to petabytes',
        'One-click unit inversion and instant result clipboard copying'
      ],
      faq: [
        {
          question: 'How does the temperature conversion handle non-zero baselines?',
          answer: 'The converter applies exact mathematical formulas: °F = (°C × 9/5) + 32 and K = °C + 273.15 to ensure absolute thermodynamic accuracy.'
        },
        {
          question: 'Are digital storage conversions based on decimal (1000) or binary (1024)?',
          answer: 'Digital storage conversions follow standard binary byte scaling (1 KB = 1024 Bytes, 1 MB = 1024 KB).'
        }
      ]
    }
  },

  // 12. Developer Toolbox (Merged: Code Formatters, Encoders, Security/Passwords, Hashes, UUID, Regex, Unix Timestamp)
  {
    id: 'developer-toolbox',
    name: 'Developer Toolbox',
    slug: 'developer-toolbox',
    category: 'developer',
    description: 'Comprehensive software utility suite: code formatting (HTML/CSS/JS), Base64 & URL encoding, password generation, JWT decoding, UUIDs, hashes, regex tester, and Unix timestamps.',
    shortDesc: 'Multi-tab developer suite: code formatting, encoders, JWT, UUIDs, regex & hashes.',
    icon: 'Code2',
    keywords: [
      'developer toolbox', 'dev tools', 'base64 encoder', 'base64 decoder',
      'url encoder', 'url decoder', 'jwt decoder', 'jwt token', 'uuid generator',
      'uuid v4', 'hash generator', 'md5', 'sha256', 'regex tester', 'regular expression',
      'html formatter', 'css formatter', 'javascript formatter', 'password generator',
      'unix timestamp converter', 'epoch time'
    ],
    popular: true,
    featured: true,
    badge: 'Flagship',
    status: 'ready',
    isImplemented: true,
    component: DeveloperToolbox,
    relatedToolSlugs: ['json-studio', 'text-toolkit', 'unit-converter'],
    seo: {
      title: 'Developer Toolbox — Code Formatter, Encoders, JWT, Hashes & UUIDs',
      description: 'The all-in-one developer utility suite. Format HTML/CSS/JS, encode Base64 and URLs, decode JWT tokens, generate random UUIDs and passwords, test regex patterns, and convert Unix epoch timestamps.',
      keywords: ['developer toolbox', 'base64 encoder', 'jwt decoder', 'uuid generator', 'hash generator', 'html formatter', 'regex tester'],
      h1: 'Developer Toolbox Workspace',
      intro: 'A unified workstation for software engineers and QA testers. Access code syntax formatters, Base64/URL encoders, cryptographic hashing, JWT inspectors, UUID generation, and epoch timestamps.',
      howToUse: [
        'Select your tool group: "Code Formatter", "Encoding", "Security & Hashes", "IDs & Regex", or "Unix Timestamp".',
        'Choose your specific sub-utility (e.g. HTML Formatter, JWT Decoder, or Hash Generator).',
        'Input your code, tokens, strings, or numbers into the workspace.',
        'Copy the transformed or generated output with a single click.'
      ],
      features: [
        'Code Formatting: beautify and minify HTML, CSS, and JavaScript with custom indentation',
        'Encoders & Decoders: Base64 binary/text translation and RFC 3986 URL encoding',
        'Security: cryptographically secure password generation, JWT header/payload inspection, and MD5/SHA checksums',
        'Utilities: random UUID v4 generation, interactive Regex pattern matching, and Unix epoch time translations'
      ],
      faq: [
        {
          question: 'Are my tokens, code, or passwords sent to a backend server?',
          answer: 'No. All operations, hashing, and token parsing execute locally in your web browser with complete client-side privacy.'
        },
        {
          question: 'Does the JWT Decoder verify token signatures?',
          answer: 'The JWT tool decodes and displays claims and headers client-side; signature verification requires your private secret key and is omitted for security.'
        }
      ]
    }
  }
];

/**
 * Resolves a tool by slug.
 */
export const getToolBySlug = (slug: string): Tool | undefined => {
  return TOOLS.find((t) => t.slug === slug);
};

/**
 * Returns the 12 Flagship tools in prioritized order for the Popular view.
 */
export const getPopularTools = (): Tool[] => {
  const POPULAR_ORDER_SLUGS = [
    'text-to-pdf',
    'images-to-pdf',
    'pdf-toolkit',
    'image-toolkit',
    'percentage-calculator',
    'age-calculator',
    'text-toolkit',
    'json-studio',
    'finance-calculator',
    'unit-converter',
    'qr-generator',
    'developer-toolbox',
  ];

  const map = new Map(TOOLS.map((t) => [t.slug, t]));
  const ordered: Tool[] = [];

  for (const slug of POPULAR_ORDER_SLUGS) {
    const tool = map.get(slug);
    if (tool) {
      ordered.push(tool);
    }
  }

  return ordered;
};

/**
 * Returns all active featured tools (the 12 flagship tools).
 */
export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter((t) => t.isImplemented && t.status === 'ready');
};
