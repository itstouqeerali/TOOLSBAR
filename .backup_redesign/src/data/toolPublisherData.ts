import { Tool } from '../types';

export interface ToolEditorialGuide {
  about: string;
  formulaOrPrinciple?: string;
  useCases: string[];
  helpfulNotes?: string[];
}

/**
 * Curated, high-value editorial publisher content for Toolsbar 12 Flagship Workspaces.
 * Explains what each tool computes, converts, or formats, the underlying
 * mechanics/formulas, practical everyday use cases, and helpful notes.
 */
export const TOOL_EDITORIAL_DATA: Record<string, ToolEditorialGuide> = {
  'text-to-pdf': {
    about: 'The Text to PDF Document Studio is a print-accurate document authoring environment that calculates physical page sheets directly in your browser. Unlike simple HTML print wrappers, this studio uses logical point coordinates to calculate safe top margins, bottom safety buffers, running headers, and footers, ensuring prose, lists, and headings never clip across visual page gaps or crowd page edges.',
    formulaOrPrinciple: 'Page geometry calculates available printable height in PostScript points: UsableBodyHeight = TotalPageHeight − TopMargin − BottomMargin − HeaderHeight − FooterHeight. Content breaks are determined line-by-line using precise font metrics.',
    useCases: [
      'Authoring formal business proposals, client agreements, and invoices with custom headers',
      'Exporting academic essays and research summaries with precise page numbers',
      'Drafting resumes, cover letters, and corporate memos in universal A4 or US Letter formats',
      'Converting rich text notes into permanent, archivable vector PDF files without software installation'
    ],
    helpfulNotes: [
      'Document layout calculation and vector compilation run 100% in your browser using PDF-Lib.',
      'Page breaks occur cleanly between lines; words or text blocks are never bisected horizontally.'
    ]
  },

  'images-to-pdf': {
    about: 'The Images to PDF Converter combines individual image files into a single, structured multi-page PDF binder. It supports modern image formats including JPG, PNG, and WebP, allowing users to resequence pages interactively, adjust page margins, and customize paper sizes for clean digital distribution or physical printing.',
    formulaOrPrinciple: 'Images are decoded into canvas buffers, scaled to fit the selected paper dimensions while preserving native aspect ratios, and embedded into discrete PDF pages.',
    useCases: [
      'Assembling scanned receipts, identity cards, and legal documents into an organized portfolio',
      'Creating digital photography lookbooks or design presentations from separate image exports',
      'Compiling multi-page handwritten notes or classroom whiteboards into a single study guide',
      'Preparing image bundles for official government, visa, or job application portal uploads'
    ],
    helpfulNotes: [
      'Drag-and-drop reordering allows you to position cover pages and supporting documents precisely.',
      'Images are embedded without unnecessary server transcoding, preserving original visual fidelity.'
    ]
  },

  'pdf-toolkit': {
    about: 'The PDF Toolkit is an integrated document manipulation suite that combines PDF merging, page-level extraction and splitting, and file size compression. Instead of relying on expensive cloud subscriptions or uploading sensitive paperwork to third-party servers, all document parsing, restructuring, and stream optimization executes locally on your device.',
    formulaOrPrinciple: 'Merging reads input PDF cross-reference tables and consolidates object streams. Splitting creates a new root document containing only selected page references. Compression optimizes embedded streams and strips duplicate metadata dictionaries.',
    useCases: [
      'Merging multiple vendor contracts, signed signature sheets, and appendix documents into one file',
      'Extracting specific chapters or single receipt pages from 50-page annual reports',
      'Compressing oversized scanned documents to satisfy strict 5 MB email and portal attachment limits',
      'Rearranging multi-document packages before sending to clients, accountants, or legal partners'
    ],
    helpfulNotes: [
      'Page splitting accepts comma-separated lists and ranges (e.g., "1, 3, 5-8") for precise extraction.',
      'All PDF restructuring executes client-side; confidential financial and personal records remain private.'
    ]
  },

  'image-toolkit': {
    about: 'The Image Toolkit is a full-featured browser graphics studio combining image compression, pixel dimension resizing, and universal format conversion between JPG, PNG, and WebP. By leveraging modern HTML5 Canvas APIs, users can optimize assets for web performance, prepare social media graphics, and convert formats with instant visual previews and byte metrics.',
    formulaOrPrinciple: 'Compression applies discrete cosine transform (DCT) or WebP predictive coding to reduce entropy. Resizing calculates bicubic interpolation over the target dimensions with optional aspect-ratio locking.',
    useCases: [
      'Compressing high-resolution camera photos to accelerate web page load speeds and improve SEO',
      'Converting heavy PNG graphics to modern WebP format to reduce bandwidth consumption by up to 30%',
      'Resizing graphics to exact pixel specifications for profile banners, blog thumbnails, and ads',
      'Translating transparent PNG logos to clean JPG files for email signatures and print documents'
    ],
    helpfulNotes: [
      'The aspect-ratio lock ensures scaling height automatically adjusts width without optical distortion.',
      'Processing executes purely in local canvas memory; your photos are never uploaded to any remote host.'
    ]
  },

  'percentage-calculator': {
    about: 'The Percentage & Proportions Suite provides comprehensive mathematical tools for common financial, commercial, and algebraic calculations. The workspace covers standard percentage scenarios (percent of number, percentage difference, percent increase/decrease), retail sales discounts with coupon stacking, GST/VAT addition and removal, and proportional ratio scaling.',
    formulaOrPrinciple: 'Percentage value = (P ÷ 100) × N. Percentage change = ((New − Original) ÷ Original) × 100%. Tax removal = Gross ÷ (1 + TaxRate ÷ 100). Ratio proportion: A/B = C/D.',
    useCases: [
      'Calculating final checkout costs after applying retail sale discounts and regional sales taxes',
      'Evaluating annual salary increments, investment returns, and quarter-over-quarter revenue growth',
      'Computing gross and net prices for commercial invoices and tax bookkeeping',
      'Scaling visual aspect ratios (16:9, 4:3) and calculating proportional dimensions for screen displays'
    ],
    helpfulNotes: [
      'For percentage decreases, the rate of change is always evaluated relative to the initial starting value.',
      'Step-by-step formula breakdowns explain the exact algebraic steps used to reach the answer.'
    ]
  },

  'age-calculator': {
    about: 'The Chronological Age Calculator computes exact elapsed duration starting from a date of birth to any reference date or the present moment. Unlike rough estimates, this utility calculates completed calendar years, additional months, days, hours, and live ticking seconds, accurately accounting for Gregorian calendar leap years and differing month lengths.',
    formulaOrPrinciple: 'Compensates for Gregorian leap years (years divisible by 4, excluding century years not divisible by 400) and varying month lengths (28, 29, 30, or 31 days) to produce exact calendar day counts.',
    useCases: [
      'Verifying precise age qualifications for civil service exams, insurance policies, or visa applications',
      'Tracking developmental milestones in completed months and weeks for pediatric healthcare records',
      'Determining exact tenure of service or employment duration for retirement and contract planning',
      'Checking the countdown of remaining days, hours, and minutes until an upcoming birthday or jubilee'
    ],
    helpfulNotes: [
      'Calculations reference your device local timezone unless an explicit target date is configured.',
      'The live ticking second display operates in browser memory with negligible battery and CPU impact.'
    ]
  },

  'finance-calculator': {
    about: 'The Finance Calculator provides indispensable computational modeling for personal loans, mortgages, and investment growth. The workspace incorporates monthly Loan EMI estimation with a full amortization schedule, Compound Interest accumulation with customizable compounding frequencies, and standard Simple Interest projections.',
    formulaOrPrinciple: 'Loan EMI = [P × R × (1+R)^N] ÷ [(1+R)^N − 1], where P is principal, R is periodic interest rate, and N is tenure in months. Compound Interest: A = P × (1 + r/n)^(nt). Simple Interest: I = (P × R × T) ÷ 100.',
    useCases: [
      'Estimating monthly mortgage repayments and evaluating total interest paid across 15 vs 30-year terms',
      'Calculating compound investment returns for retirement savings, mutual funds, or certificate of deposits',
      'Comparing simple interest peer loans against commercial banking finance agreements',
      'Determining the financial impact of higher initial down payments on monthly auto loan installments'
    ],
    helpfulNotes: [
      'Amortization schedules show how early payments primarily cover interest, while later payments pay down principal.',
      'Calculations provide educational estimates; consult certified financial advisors for binding agreements.'
    ]
  },

  'text-toolkit': {
    about: 'The Text & Content Toolkit is a consolidated writing and editorial workspace. It combines real-time word and character counts with social media limit gauges, grammatical case conversion (Title Case, UPPERCASE, camelCase), list cleaning (deduplicating rows, stripping excess whitespace, alphabetical sorting), URL slug creation, and Lorem Ipsum text generation.',
    formulaOrPrinciple: 'Words are identified via whitespace-delimited unicode character boundaries. Readability metrics follow the Flesch-Kincaid index: 206.835 − (1.015 × ASL) − (84.6 × ASW).',
    useCases: [
      'Monitoring character volume to keep social media updates and search meta descriptions within limits',
      'Cleaning and alphabetizing customer name lists, database exports, or raw CSV text columns',
      'Formatting article titles, publication headings, and book chapters in standard grammatical Title Case',
      'Generating clean web-safe URL slugs and placeholder copy for website layouts and mockups'
    ],
    helpfulNotes: [
      'Social media limit indicators visually alert you as your copy nears or exceeds platform boundaries.',
      'Text transformation operations execute client-side; unpublished drafts are never exposed to remote servers.'
    ]
  },

  'json-studio': {
    about: 'JSON Studio is a dedicated developer workspace for inspecting, formatting, validating, and minifying JavaScript Object Notation (JSON) payloads. It checks structural compliance against the RFC 8259 standard, pinpoints syntax anomalies with exact character coordinates, indents nested structures, and provides one-click minification for production deployments.',
    formulaOrPrinciple: 'Validates syntax using JavaScript recursive parsing conforming to RFC 8259 specifications, measuring uncompressed vs. minified byte footprints in UTF-8 encoding.',
    useCases: [
      'Beautifying dense single-line REST API responses to inspect nested object hierarchies and arrays',
      'Locating syntax bugs such as trailing commas, missing quotes, or unbalanced brackets in configuration files',
      'Minifying configuration files and API mock fixtures to minimize data transfer over network requests',
      'Exploring complex API responses through an interactive tree view for QA and debugging'
    ],
    helpfulNotes: [
      'Because JSON Studio processes data client-side, proprietary API tokens or user data are never logged.',
      'Minification strips all formatting whitespace, indentation, and newlines without changing data integrity.'
    ]
  },

  'qr-generator': {
    about: 'The QR Code Generator creates high-resolution, standards-compliant Quick Response 2D barcodes for physical and digital distribution. Users can encode website links, Wi-Fi network credentials with auto-connect parameters, vCard contact cards, and arbitrary text, complete with color customization and high-resolution PNG export.',
    formulaOrPrinciple: 'Encodes data using Reed-Solomon error correction codes (L, M, Q, H), allowing codes to be scanned reliably even if up to 30% of the graphic surface is obscured or damaged.',
    useCases: [
      'Creating contactless restaurant table menus, catalog links, or event registration portals',
      'Generating scannable guest Wi-Fi access barcodes for office lobbies, cafes, or homes',
      'Adding digital vCard business card barcodes to printed promotional material and conference badges',
      'Publishing direct app download links or payment handles on product packaging and flyers'
    ],
    helpfulNotes: [
      'Generated QR codes are static and permanent; they do not expire or require remote redirect servers.',
      'Ensure sufficient optical contrast between foreground pixels and background canvas for reliable scanning.'
    ]
  },

  'unit-converter': {
    about: 'The Universal Unit Converter provides instant two-way translations across metric, imperial, scientific, and digital measurement systems. The workspace spans 8 fundamental physical and computational categories: length, mass/weight, temperature (Celsius, Fahrenheit, Kelvin), digital data storage (bytes to petabytes), area, volume, speed, and time.',
    formulaOrPrinciple: 'Conversions translate quantities through standard SI base definitions: V_target = FromBase(ToBase(V_source)). Temperature applies affine thermodynamic equations: °F = (°C × 9/5) + 32; K = °C + 273.15.',
    useCases: [
      'Converting international kitchen recipe temperatures and cooking weights between metric and imperial',
      'Calculating digital bandwidth allowances, file sizes, and cloud storage bucket capacities in MB vs. GB',
      'Translating building dimensions, hardware measurements, and land survey figures between meters and feet',
      'Converting vehicle speeds between miles per hour (mph) and kilometers per hour (km/h) for travel planning'
    ],
    helpfulNotes: [
      'Digital data conversions follow standard binary byte scaling (1 KB = 1024 Bytes, 1 MB = 1024 KB).',
      'Quick swap controls allow instantaneous bidirectional conversion without re-typing input values.'
    ]
  },

  'developer-toolbox': {
    about: 'The Developer Toolbox is an integrated workstation consolidating critical utility routines for software engineers, systems administrators, and QA analysts. The suite incorporates code syntax formatting for HTML, CSS, and JavaScript, Base64 and URL encoding/decoding, cryptographic hashing (MD5, SHA-1, SHA-256), random UUID v4 generation, JWT token inspection, regex testing, and Unix epoch conversions.',
    formulaOrPrinciple: 'Base64 conforms to RFC 4648; URL encoding applies RFC 3986 percent-encoding; UUIDs follow RFC 4122 v4 cryptographic random generation; hashing utilizes Web Crypto API subtle crypto algorithms.',
    useCases: [
      'Beautifying or minifying frontend HTML, CSS, and JavaScript code snippets for documentation or review',
      'Decoding URL parameters and Base64 encoded strings during backend integration and testing',
      'Inspecting JSON Web Token (JWT) payloads to audit role claims, user scopes, and expiration timestamps',
      'Generating unique UUID v4 keys for database records, mocking API tests, and generating test fixtures'
    ],
    helpfulNotes: [
      'All token decoding, password generation, and hash calculations occur in local browser memory.',
      'The JWT inspector parses and displays claims client-side without transmitting bearer tokens over the internet.'
    ]
  }
};

export function getToolPublisherData(tool: Tool): ToolEditorialGuide | null {
  return TOOL_EDITORIAL_DATA[tool.slug] || null;
}
