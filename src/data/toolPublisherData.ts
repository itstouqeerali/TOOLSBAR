import { Tool } from '../types';

export interface ToolEditorialGuide {
  about: string;
  formulaOrPrinciple?: string;
  useCases: string[];
  helpfulNotes?: string[];
}

/**
 * Curated, high-value editorial publisher content for Toolsbar utilities.
 * Explains what each tool computes, converts, or formats, the underlying
 * mechanics/formulas, practical everyday use cases, and helpful notes.
 */
export const TOOL_EDITORIAL_DATA: Record<string, ToolEditorialGuide> = {
  'percentage-calculator': {
    about: 'The Percentage Calculator is an essential computational utility for evaluating relative proportional changes, differences, and discounts. It solves common percentage scenarios including "What is X% of Y?", "X is what percent of Y?", percentage increase, and percentage decrease. Calculations are processed instantly with real-time feedback as you type each number.',
    formulaOrPrinciple: 'Percentage value = (Percent / 100) × Base Amount. Percentage change = ((New Value - Original Value) / Original Value) × 100%.',
    useCases: [
      'Calculating final discounts and sales tax when shopping or budgeting retail purchases',
      'Determining salary adjustments, commission rates, and annual percentage increases',
      'Analyzing business growth metrics such as quarter-over-quarter revenue changes',
      'Calculating tip percentages and dividing restaurant bills accurately among friends'
    ],
    helpfulNotes: [
      'For percentage decreases, the calculation reflects the drop relative to the original initial value.',
      'All calculations are performed using high-precision floating-point arithmetic with rounded output.'
    ]
  },
  'age-calculator': {
    about: 'The Age Calculator provides chronological time calculations starting from a date of birth to any target date or the current moment. Unlike rough month-and-year approximations, this tool calculates exact completed years, additional months, elapsed weeks, total calendar days, and live ticking seconds, accurately compensating for leap years and months with differing day lengths.',
    formulaOrPrinciple: 'Accounts for Gregorian calendar leap years (every 4th year except century years not divisible by 400) and varying month lengths (28, 29, 30, or 31 days).',
    useCases: [
      'Verifying precise legal age eligibility for passport applications, government forms, or civil exams',
      'Determining exact developmental milestone ages in months and weeks for pediatric tracking',
      'Calculating exact duration of employment or tenure for contracts and pension plans',
      'Finding the exact countdown of days, hours, and minutes until an upcoming birthday or anniversary'
    ],
    helpfulNotes: [
      'Dates are calculated relative to your local device timezone unless an explicit reference date is set.',
      'The live ticking second display runs locally in memory with minimal CPU consumption.'
    ]
  },
  'word-counter': {
    about: 'The Word Counter is a real-time text analysis utility that measures words, characters (with and without spaces), sentences, paragraphs, and reading times. It tokenizes prose to provide structural metrics alongside readability assessments such as the Flesch Reading Ease score, helping writers maintain clarity and adhere to editorial constraints.',
    formulaOrPrinciple: 'Words are recognized via whitespace-separated alphanumeric boundaries. Flesch Reading Ease = 206.835 - (1.015 × ASL) - (84.6 × ASW), where ASL is average sentence length and ASW is average syllables per word.',
    useCases: [
      'Checking academic essay, thesis, or manuscript lengths against strict maximum and minimum limits',
      'Auditing blog posts, news articles, and marketing copy for optimal reading speed and audience engagement',
      'Ensuring cover letters, statements of purpose, and competition entries meet submission criteria',
      'Measuring reading time to budget presentation speech lengths and video voiceover pacing'
    ],
    helpfulNotes: [
      'Processing executes entirely in browser memory; confidential manuscripts or internal drafts are never uploaded.',
      'Hyphenated compound words are treated as single words unless separated by whitespace.'
    ]
  },
  'character-counter': {
    about: 'The Character Counter tracks string length in real time, featuring visual limit gauges tailored for social media platforms and search engine optimization. It displays live progress indicators for Twitter/X posts, Instagram captions, LinkedIn updates, SMS segments, and Google search SERP title and description lengths.',
    formulaOrPrinciple: 'Character counts reflect Unicode code points, while byte sizes calculate UTF-8 encoded memory consumption (where emojis and non-ASCII characters occupy up to 4 bytes).',
    useCases: [
      'Drafting Twitter/X posts to stay strictly within the 280-character boundary without truncation',
      'Writing Google search page titles (under 60 characters) and meta descriptions (under 160 characters)',
      'Measuring SMS text message segments to avoid unwanted multi-part carrier messaging fees',
      'Crafting concise headlines, notification text, and mobile app push notifications'
    ],
    helpfulNotes: [
      'Visual limit bars turn amber and red as your text approaches and exceeds platform limits.',
      'Line breaks and special Unicode emojis are accounted for according to platform-specific length rules.'
    ]
  },
  'case-converter': {
    about: 'The Case Converter transforms plain text between various letter-casing styles. It supports standard grammatical formats like Sentence case, Title Case, lowercase, and UPPERCASE, as well as programming identifier styles including camelCase, PascalCase, snake_case, and kebab-case.',
    formulaOrPrinciple: 'Parsing regex strips irregular separators and capitalizes designated letter boundaries according to standard linguistic or programming naming conventions.',
    useCases: [
      'Fixing accidental caps lock text or normalizing messy uppercase database exports',
      'Formatting article titles, headlines, and book chapters into grammatically consistent Title Case',
      'Converting API JSON key names between snake_case and camelCase during software development',
      'Formatting URL-friendly slugs and configuration keys using kebab-case'
    ],
    helpfulNotes: [
      'Title Case formatting honors minor prepositions and conjunctions (e.g., in, on, at, and, or) when appropriate.',
      'One-click copy actions quickly export converted text directly to your clipboard.'
    ]
  },
  'json-formatter': {
    about: 'The JSON Formatter and Validator inspects, beautifies, and cleans raw JavaScript Object Notation payloads. It parses incoming text to detect syntax mistakes such as missing commas, unescaped quotes, or mismatched braces, highlighting error positions while formatting valid structures with selectable 2-space, 4-space, or tab indentation.',
    formulaOrPrinciple: 'Syntax validation adheres to the RFC 8259 JSON standard specification using JavaScript\'s native parser with localized structural linting.',
    useCases: [
      'Beautifying minified single-line API responses to inspect complex nested arrays and objects',
      'Validating configuration files (such as tsconfig.json or package.json) before deployment',
      'Debugging REST API integration issues by identifying malformed JSON syntax and line numbers',
      'Preparing readable data samples for documentation, technical tutorials, and bug reports'
    ],
    helpfulNotes: [
      'Processing is purely client-side; proprietary customer data or API keys in payloads are never sent over the network.',
      'Supports tree folding and instant minification when compact size is required.'
    ]
  },
  'base64': {
    about: 'The Base64 Encoder and Decoder translates ASCII and UTF-8 strings into standard Base64 representation and decodes existing Base64 strings back into human-readable text. It handles multi-byte Unicode characters cleanly without encoding corruptions or missing glyphs.',
    formulaOrPrinciple: 'Converts 8-bit binary data into 6-bit chunks mapped across a 64-character ASCII alphabet (A-Z, a-z, 0-9, +, /) with "=" padding compliant with RFC 4648.',
    useCases: [
      'Encoding basic authentication credentials for HTTP headers (Authorization: Basic)',
      'Embedding small SVG graphics or icon data directly into CSS or HTML as data URIs',
      'Inspecting and decoding encoded webhook payloads, email MIME attachments, and API keys',
      'Encoding binary configuration snippets for safe transfer across text-only protocols'
    ],
    helpfulNotes: [
      'Base64 encoding increases overall payload size by approximately 33% due to the 6-bit to 8-bit conversion.',
      'This utility uses robust UTF-8 safe encoding to prevent mojibake with foreign languages or emojis.'
    ]
  },
  'unit-converter': {
    about: 'The Unit Converter is a multi-discipline conversion tool spanning length, mass/weight, area, volume, and speed. It provides real-time bidirectional calculations between metric (meters, grams, liters) and imperial (inches, feet, pounds, gallons) measurement standards with precision decimal control.',
    formulaOrPrinciple: 'Computes conversions by translating input values to international base SI units before scaling to the designated target unit.',
    useCases: [
      'Translating recipe measurements and baking quantities between grams, ounces, and cups',
      'Converting architectural, engineering, and DIY hardware dimensions between feet, inches, and millimeters',
      'Evaluating vehicle travel speeds and distances between miles per hour (mph) and kilometers per hour (km/h)',
      'Calculating parcel and shipping weights between pounds and kilograms for freight logistics'
    ],
    helpfulNotes: [
      'Outputs are calculated with selectable decimal precision to prevent rounding truncation in scientific work.',
      'Conversion constants strictly adhere to the International System of Units (SI) definitions.'
    ]
  },
  'qr-generator': {
    about: 'The QR Code Generator creates high-resolution, scannable Quick Response matrix barcodes for URLs, plain text messages, Wi-Fi network credentials, email links, and vCard contact cards. Users can customize foreground and background colors and download the resulting code as a clean PNG image.',
    formulaOrPrinciple: 'Generates ISO/IEC 18004 compliant 2D matrix symbology with adjustable Reed-Solomon error correction levels (L, M, Q, H) allowing up to 30% damage tolerance.',
    useCases: [
      'Creating touchless restaurant menu links, table order QR codes, and event check-in passes',
      'Generating automatic Wi-Fi connection codes for guest networks without sharing plain text passwords',
      'Adding digital vCard business card links to printed stationery, packaging, and conference badges',
      'Directing flyer and poster viewers to marketing landing pages, mobile apps, or surveys'
    ],
    helpfulNotes: [
      'Ensure strong optical contrast between the foreground pattern and the background color for reliable camera scanning.',
      'Higher error correction levels are recommended if the QR code will be printed or placed in outdoor environments.'
    ]
  },
  'password-generator': {
    about: 'The Password Generator creates cryptographically secure, high-entropy passwords to protect personal accounts, servers, and sensitive digital systems. Users can tailor password length and toggle uppercase letters, lowercase letters, numbers, and special symbols, accompanied by a live entropy and strength rating.',
    formulaOrPrinciple: 'Generates randomized characters via window.crypto.getRandomValues() to ensure cryptographic pseudo-randomness. Password entropy (bits) = Length × log2(Charset Size).',
    useCases: [
      'Creating unique, unguessable master passwords for password managers, email, and banking accounts',
      'Generating database passwords, API secret keys, and server root credentials during infrastructure setup',
      'Supplying strong randomized temporary passwords for newly onboarded team members or user accounts',
      'Auditing password complexity against brute-force and dictionary crack-time calculations'
    ],
    helpfulNotes: [
      'All passwords are generated exclusively on your local machine and are never transmitted, logged, or cached.',
      'A minimum length of 16 characters with mixed character sets is recommended for mission-critical accounts.'
    ]
  },
  'bmi-calculator': {
    about: 'The Body Mass Index (BMI) Calculator is a standardized anthropometric screening tool that assesses body mass relative to height. It calculates your BMI value, classifies the result into World Health Organization (WHO) categories (underweight, normal, overweight, obese), and estimates your healthy weight range.',
    formulaOrPrinciple: 'Metric formula: BMI = weight (kg) / [height (m)]². Imperial formula: BMI = 703 × weight (lbs) / [height (in)]².',
    useCases: [
      'Screening general weight categories for fitness planning and personal wellness monitoring',
      'Calculating optimal target weight boundaries based on height for dietary and exercise routines',
      'Tracking physiological progress over time during weight management and wellness programs'
    ],
    helpfulNotes: [
      'BMI is a statistical screening measure and does not directly calculate body fat percentage or muscle mass.',
      'Athletes and individuals with high muscle density may register elevated BMI scores. Consult medical professionals for clinical evaluations.'
    ]
  },
  'discount-calculator': {
    about: 'The Discount Calculator computes final checkout amounts, monetary savings, and applicable sales taxes for promotional purchases. It allows shoppers and retail businesses to calculate single or stacked percentage discounts, fixed cash-off promotions, and net prices after sales tax.',
    formulaOrPrinciple: 'Discount Amount = Original Price × (Discount Rate / 100). Final Price = (Original Price - Discount Amount) × (1 + Sales Tax Rate / 100).',
    useCases: [
      'Calculating final in-store sale prices during clearance events or holiday shopping promotions',
      'Comparing promotional offers (e.g., "$20 off" vs. "25% discount") to find the greatest cost savings',
      'Determining wholesale and retail margins for merchandise pricing and promotional discounting'
    ],
    helpfulNotes: [
      'If both a discount and sales tax apply, the tax is customarily calculated against the discounted subtotal.',
      'All calculations provide instantaneous two-way verification showing exact money saved.'
    ]
  },
  'loan-emi-calculator': {
    about: 'The Loan EMI Calculator estimates monthly Equated Monthly Installments (EMI) for home loans, personal loans, and vehicle financing. It projects the complete amortization cost, calculating total interest payable alongside the principal repayment breakdown over the term of the loan.',
    formulaOrPrinciple: 'Standard EMI formula: E = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal, r is monthly interest rate (annual rate / 12 / 100), and n is total months.',
    useCases: [
      'Evaluating monthly mortgage affordability before submitting home financing applications',
      'Comparing auto loan terms between 36, 48, and 60-month financing packages to balance monthly payments with total interest',
      'Assessing debt consolidation loan terms to reduce overall monthly interest burdens'
    ],
    helpfulNotes: [
      'Loan EMI figures are mathematical estimations for financial planning and budgeting.',
      'Lenders may include additional fees, insurance, or processing charges not reflected in the core amortization calculation.'
    ]
  },
  'compound-interest-calculator': {
    about: 'The Compound Interest Calculator projects the future growth of financial investments and savings accounts over time. It models how initial principal deposits grow when interest is reinvested across annual, semi-annual, quarterly, or monthly compounding frequencies, alongside optional regular contributions.',
    formulaOrPrinciple: 'A = P(1 + r/n)^(nt), where A is final balance, P is initial principal, r is annual nominal interest rate, n is compounding frequency per year, and t is time in years.',
    useCases: [
      'Forecasting long-term retirement savings growth and index fund investments over 10, 20, or 30 years',
      'Comparing returns between high-yield savings accounts offering monthly vs. annual compounding',
      'Planning college fund or nest egg targets with recurring monthly deposit contributions'
    ],
    helpfulNotes: [
      'Calculations illustrate the exponential power of compounding interest over prolonged time horizons.',
      'Projections assume a fixed rate of return and do not factor in inflation, taxes, or market fluctuations.'
    ]
  },
  'simple-interest-calculator': {
    about: 'The Simple Interest Calculator computes interest accrued on loans or investments where interest is earned solely on the original principal balance. It calculates total interest, maturity amount, and equivalent annual yield for straightforward lending agreements and short-term debt.',
    formulaOrPrinciple: 'Simple Interest formula: I = P × R × T / 100, where P is principal, R is annual interest rate (percentage), and T is duration in years.',
    useCases: [
      'Calculating interest on personal promissory notes and peer-to-peer family loans',
      'Evaluating short-term certificate of deposit (CD) earnings and treasury bill maturities',
      'Determining simple finance charges for deferred billing or commercial supplier credit terms'
    ],
    helpfulNotes: [
      'Simple interest does not compound on previously accumulated interest gains.',
      'Partial year durations can be entered as decimal fractions or converted to fractional months.'
    ]
  },
  'gst-tax-calculator': {
    about: 'The GST / Sales Tax Calculator calculates Goods and Services Tax (GST), Value Added Tax (VAT), and sales tax additions or subtractions. It supports both inclusive tax extraction (reverse calculation) and exclusive tax addition (forward calculation) for standard tax slabs.',
    formulaOrPrinciple: 'Tax Exclusive: GST = Net × (Rate / 100); Gross = Net + GST. Tax Inclusive: GST = Gross - [Gross / (1 + Rate / 100)]; Net = Gross - GST.',
    useCases: [
      'Generating commercial invoices and retail receipts with separated net, tax, and gross totals',
      'Extracting base product prices and tax amounts from gross inclusive retail receipts for bookkeeping',
      'Verifying supplier billing invoices to ensure tax rate calculations match statutory requirements'
    ],
    helpfulNotes: [
      'Select "Tax Inclusive" when the entered price already contains the tax component.',
      'Tax rates can be customized to match your country or regional tax percentage (e.g., 5%, 12%, 18%, 28%).'
    ]
  },
  'text-to-pdf': {
    about: 'The Text to PDF Document Creator allows you to compose, format, and convert text documents directly into standard PDF files within your browser. Utilizing an interactive WYSIWYG document editor, the on-screen page visually mirrors the final printed PDF with headings, lists, bold text, and clean typography.',
    formulaOrPrinciple: 'Renders styled document nodes into vector PDF layout structures via client-side PDF document generation engines without server processing.',
    useCases: [
      'Writing and exporting clean professional memos, invoices, meeting minutes, and letters',
      'Converting unstructured raw notes or code snippets into clean, shareable PDF attachments',
      'Drafting resumes, contracts, and formal notices with print-ready page margins and page breaks'
    ],
    helpfulNotes: [
      'Document creation happens client-side in browser memory; your private writing is never stored or uploaded.',
      'Exported PDFs are standard format compatible with all desktop and mobile PDF viewers.'
    ]
  },
  'images-to-pdf': {
    about: 'The Images to PDF Converter combines photo files (PNG, JPG, WebP) into a consolidated, multi-page PDF document. You can arrange image sequences, adjust page orientation (portrait or landscape), and configure margins for neat digital distribution.',
    formulaOrPrinciple: 'Encodes graphic bitstreams into PDF image XObject dictionaries with aspect-ratio preservation and custom canvas bounds.',
    useCases: [
      'Combining phone camera snapshots of receipts, book pages, or contracts into a single submission file',
      'Assembling photographic portfolios and design mockups for client presentation reviews',
      'Organizing ID cards, certificates, and scanned documentation for official portal submissions'
    ],
    helpfulNotes: [
      'Images are compressed into the PDF document in your browser with zero remote upload lag.',
      'Reorder your images via drag-and-drop before exporting to set your desired page sequence.'
    ]
  },
  'pdf-merger': {
    about: 'The PDF Merger unites multiple individual PDF documents into one continuous, structured file. You can upload several documents, reorder their sequence, and download a single consolidated PDF document without installing desktop software.',
    formulaOrPrinciple: 'Parses binary PDF cross-reference tables and page tree catalogs to stitch document streams into a unified cross-reference structure.',
    useCases: [
      'Joining signed agreements, amendments, and supporting exhibits into a single transaction package',
      'Consolidating monthly bank statements or vendor bills for annual tax preparation',
      'Merging individually exported report sections into an overarching executive briefing binder'
    ],
    helpfulNotes: [
      'Processing occurs entirely in your browser using client-side WebAssembly for complete confidentiality.',
      'Ensure individual source files are not password-protected before attempting to merge.'
    ]
  },
  'image-compressor': {
    about: 'The Image Compressor optimizes JPG, PNG, and WebP graphics to reduce file sizes while maintaining sharp visual clarity. It allows users to adjust compression quality, preview live file size savings, and download optimized assets ready for web and email publishing.',
    formulaOrPrinciple: 'Utilizes HTML5 Canvas bitmap resampling and browser-native lossy/lossless encoder algorithms to strip redundant metadata and optimize quantization matrices.',
    useCases: [
      'Shrinking heavy camera photos to meet strict email attachment size limits (e.g., under 10 MB)',
      'Optimizing blog post images, website banners, and e-commerce product photos to speed up page loading',
      'Compressing scanned documents and receipts before uploading to official portals'
    ],
    helpfulNotes: [
      'Adjust the quality slider to find the optimal balance between visual crispness and file size reduction.',
      'All image compression is performed locally on your device without transmitting media to any server.'
    ]
  },
  'jwt-decoder': {
    about: 'The JWT Decoder parses JSON Web Tokens (JWT) to inspect their Jose header, claims payload, and signature components. It automatically translates Unix epoch timestamps into human-readable dates for token issuance (iat), activation (nbf), and expiration (exp).',
    formulaOrPrinciple: 'Decodes Base64Url encoded segments (Header.Payload.Signature) conforming to the RFC 7519 standard specification.',
    useCases: [
      'Verifying token expiration times and user role claims during OAuth2 / OpenID Connect debugging',
      'Inspecting authentication tokens received from identity providers (such as Firebase, Auth0, or custom backends)',
      'Checking API client scopes, user identifiers, and audience permissions encoded in bearer tokens'
    ],
    helpfulNotes: [
      'Decoding exposes token payload claims but does not verify signature integrity without server secrets.',
      'Tokens are decoded purely in local memory; secret keys or sensitive authorization claims are never logged.'
    ]
  },
  'unix-timestamp-converter': {
    about: 'The Unix Timestamp Converter translates between seconds/milliseconds since the Unix epoch (January 1, 1970 UTC) and human-readable calendar dates and times. It displays conversions in both UTC and your local device timezone.',
    formulaOrPrinciple: 'Unix time represents the number of non-leap seconds elapsed since 1970-01-01T00:00:00Z (POSIX time standard).',
    useCases: [
      'Decoding server log timestamps and database created_at / updated_at epoch records',
      'Converting API expiration timestamps into human-readable local meeting and event times',
      'Generating epoch integers for automated test scripts, mock fixtures, and database queries'
    ],
    helpfulNotes: [
      'Standard Unix timestamps use 10 digits (seconds), while JavaScript and Java timestamps use 13 digits (milliseconds).',
      'The converter automatically detects whether input values are formatted in seconds or milliseconds.'
    ]
  },
  'average-calculator': {
    about: 'The Average & Statistics Calculator computes comprehensive descriptive statistical metrics for any numerical dataset. When you enter numbers separated by spaces, commas, or line breaks, the tool evaluates central tendency (mean, median, and mode) alongside spread and dispersion measures (minimum, maximum, range, variance, and standard deviation). It offers customizable decimal rounding from 0 to 6 places and displays both sample and population calculations.',
    formulaOrPrinciple: 'Mean: μ = (Σx) / N. Sample Variance: s² = Σ(x - x̄)² / (N - 1). Population Variance: σ² = Σ(x - μ)² / N. Standard Deviation is the square root of variance.',
    useCases: [
      'Calculating grade point averages and exam mark distributions for academic coursework',
      'Evaluating sales figures or monthly revenues to determine median performance versus outlier-skewed averages',
      'Computing standard deviation in laboratory experiments or scientific data logging',
      'Determining mode frequency to identify the most common customer orders or survey responses'
    ],
    helpfulNotes: [
      'Use Sample Standard Deviation (N - 1 in denominator) when your data represents a subset of a broader population, such as a sample survey.',
      'If your dataset contains multiple numbers that tie for the highest frequency, the calculator reports all multimodal values.'
    ]
  },
  'ratio-calculator': {
    about: 'The Ratio & Aspect Ratio Calculator provides four dedicated computational modes to solve proportions, simplify ratios, scale dimensions, and divide quantities. You can solve for an unknown fourth variable in proportion equations (A:B = C:D), reduce large numerical ratios to their simplest whole-number terms using the Euclidean greatest common divisor, calculate display aspect ratios (such as 16:9, 4:3, or 21:9), and partition sums into proportional shares.',
    formulaOrPrinciple: 'Proportion solution: In A / B = C / D, unknown X is solved via cross-multiplication (A × D = B × C). Simplification divides both antecedent and consequent by GCD(A, B).',
    useCases: [
      'Scaling digital artwork, photographs, and video dimensions without distortion or aspect ratio drift',
      'Simplifying gear ratios, scale model blueprints, or chemical recipe proportions to lowest terms',
      'Dividing financial dividends, inheritance sums, or business partnership profits among stakeholders proportionally',
      'Solving mathematical proportions for academic geometry, physics, and chemistry assignments'
    ],
    helpfulNotes: [
      'When simplifying ratios, the calculator strictly finds integers by computing the greatest common divisor using the Euclidean algorithm.',
      'Aspect ratio scaling maintains exact proportionality when modifying either width or height values independently.'
    ]
  },
  'remove-duplicate-lines': {
    about: 'The Remove Duplicate Lines tool filters repeating entries from text lists, logs, and data columns. It provides granular controls to match lines with or without case sensitivity, trim leading and trailing whitespace before comparison, and strip blank rows. You can configure the retention strategy to keep the first occurrence, keep the last occurrence, or isolate strictly unique lines (discarding all entries that had duplicates), with optional alphabetical or reverse sorting.',
    formulaOrPrinciple: 'Lines are indexed and evaluated using hash set lookups for linear O(n) deduplication, maintaining original line sequence or applying lexical ordering.',
    useCases: [
      'Cleaning customer email address lists or phone records prior to newsletter campaigns',
      'Deduplicating server access logs, SQL query results, or extracted URL lists',
      'Isolating unique inventory SKUs, part numbers, or keyword lists from spreadsheet exports',
      'Preparing deduplicated vocabulary or training data for linguistic and programming models'
    ],
    helpfulNotes: [
      'Selecting "Keep First Occurrence" retains the earliest instance of each line and preserves the original document sequence.',
      'Enabling "Trim Lines" ensures that invisible leading spaces or tab characters do not prevent identical words from matching.'
    ]
  },
  'remove-extra-spaces': {
    about: 'The Remove Extra Spaces tool cleans irregular whitespace, indentation inconsistencies, and unwanted line breaks from raw text. It collapses multiple consecutive spaces into single spaces, trims leading and trailing whitespace from every line, and removes empty or blank rows. It also features a tab-to-space converter with customizable spacing and a single-line mode that joins fragmented paragraphs into one continuous sentence block.',
    formulaOrPrinciple: 'Regex whitespace normalization replaces patterns of multiple whitespace characters (\\s+) with single spaces and strips boundary padding (^[ \\t]+|[ \\t]+$).',
    useCases: [
      'Normalizing text copied from PDF files that contains irregular spacing and accidental line wraps',
      'Cleaning unformatted database exports, CSV fields, or web scraper outputs before spreadsheet import',
      'Standardizing messy source code comments, markdown files, and documentation drafts',
      'Converting multi-line lists or address blocks into compact single-line strings'
    ],
    helpfulNotes: [
      'Single-line mode merges all paragraphs into a continuous string, which is useful when preparing text for single-line search queries or metadata fields.',
      'The character counter dynamically updates to show total byte savings and reduction percentage achieved by cleanup.'
    ]
  },
  'text-sorter': {
    about: 'The Text Sorter organizes multi-line lists and datasets according to configurable sorting logic. Beyond standard alphabetical (A to Z) and reverse alphabetical (Z to A) ordering, the tool features natural alphanumeric sorting (ensuring "item 2" correctly precedes "item 10"), line length sorting (shortest to longest and vice-versa), and random shuffling. It also includes inline toggles for case sensitivity, whitespace trimming, and duplicate removal.',
    formulaOrPrinciple: 'Natural sorting uses chunked locale-aware lexical comparisons (Intl.Collator with numeric collation enabled) so numeric substrings are evaluated by magnitude rather than ASCII character codes.',
    useCases: [
      'Sorting bibliographies, citations, and reference lists alphabetically for publication',
      'Ordering mixed alphanumeric product codes, version numbers, or IP address lists naturally',
      'Ranking lines of text or keyword phrases by length to optimize headlines, tags, or display banners',
      'Randomizing student rosters, giveaway participant lists, or interview order with reproducible shuffle seeds'
    ],
    helpfulNotes: [
      'Natural sort prevents the classic ASCII issue where "File 10" is sorted before "File 2".',
      'The deduplication toggle allows you to sort and remove repeat entries in a single step.'
    ]
  },
  'slug-generator': {
    about: 'The Slug Generator transforms article headlines, product titles, and arbitrary text into clean, URL-friendly permalinks. It transliterates accented diacritics into Latin equivalents, removes special punctuation symbols, and replaces spaces with your choice of separator (hyphen, underscore, or dot). You can select lowercase or uppercase casing, automatically filter English stop words (such as "the", "and", "with"), and enforce maximum character length limits.',
    formulaOrPrinciple: 'Unicode Normalization (NFKD) decomposes accented glyphs (such as é into e + accent), allowing regex replacements to strip combining diacritical marks while preserving phonetic characters.',
    useCases: [
      'Creating SEO-friendly URL permalinks for blog posts, documentation pages, and e-commerce product listings',
      'Generating standardized Git branch names, file names, or folder paths from project ticket titles',
      'Formatting database identifiers and API resource endpoints from human-readable labels',
      'Building readable hashtag slugs and marketing campaign tracking parameters'
    ],
    helpfulNotes: [
      'Filtering stop words keeps URLs concise and focused on high-value topical keywords for search engine indexing.',
      'The length limiter truncates URLs at clean word boundaries to prevent awkward half-word cutoffs.'
    ]
  },
  'lorem-ipsum-generator': {
    about: 'The Lorem Ipsum Generator produces placeholder dummy text for graphic designers, web developers, and publishers. You can generate paragraphs, sentences, isolated words, or HTML list items across multiple stylistic vocabularies: classical Latin prose derived from Cicero\'s de Finibus, modern technology jargon, hipster artisanal phrases, or corporate business terminology. It supports output in plain text, HTML markup with paragraph tags, or Markdown formatting.',
    formulaOrPrinciple: 'Constructs syntactically varied sentence structures using pseudo-random vocabulary selection weighted by typical sentence length distributions.',
    useCases: [
      'Populating website mockups and UI prototypes with realistic content to test typography and layout responsiveness',
      'Testing text overflow, wrapping behavior, and responsive containers in frontend web components',
      'Preparing publishing templates, brochures, and print layouts before final editorial copy is approved',
      'Demonstrating content management system (CMS) page templates with formatted HTML paragraphs and lists'
    ],
    helpfulNotes: [
      'Toggle "Start with Lorem ipsum" when creating mockups that require the traditional opening recognized by stakeholders.',
      'The HTML format option automatically wraps output in semantic <p> tags, ready for pasting into code editors.'
    ]
  },
  'json-minifier': {
    about: 'The JSON Minifier compresses formatted JSON data into compact, single-line strings by eliminating unnecessary whitespace, indentations, and newline characters. It performs real-time syntax validation against the RFC 8259 specification, reporting exact line and column numbers if syntax errors exist. In addition to standard minification, it can generate code-escaped string literals suitable for embedding directly into programming languages.',
    formulaOrPrinciple: 'Parses input through browser-native JSON validation engines and serializes data without indentation tokens (JSON.stringify(JSON.parse(input))).',
    useCases: [
      'Compressing JSON payload sizes to reduce HTTP transmission bandwidth in REST APIs and WebSocket streams',
      'Minifying configuration files and JSON schemas for production server environments',
      'Escaping JSON strings with backslashes for inclusion inside JavaScript, Python, or Java variable declarations',
      'Validating complex JSON objects to identify missing commas, unquoted keys, or bracket mismatches'
    ],
    helpfulNotes: [
      'Minification strips only cosmetic formatting; the underlying data structures, arrays, and key-value pairs remain completely untouched.',
      'The byte savings metric compares original UTF-8 payload size against minified output in real time.'
    ]
  },
  'url-encoder-decoder': {
    about: 'The URL Encoder / Decoder converts web addresses and parameter strings between human-readable text and percent-encoded hexadecimal format. It supports both component encoding (encodeURIComponent), which escapes reserved delimiters like ampersands, question marks, and slashes for safe query string values, and full URI encoding (encodeURI), which preserves core URL structural syntax. In decode mode, it safely restores UTF-8 multi-byte characters and highlights malformed escape sequences.',
    formulaOrPrinciple: 'Percent-encoding replaces non-ASCII and reserved URI characters with a percent sign (%) followed by two hexadecimal digits representing the UTF-8 byte value (RFC 3986).',
    useCases: [
      'Encoding search queries, JSON objects, and complex parameters for HTTP GET request query strings',
      'Decoding encoded redirect URLs, authentication callback parameters, and webhook endpoints',
      'Sanitizing tracking parameters and UTM tags for digital marketing campaign links',
      'Inspecting obfuscated or percent-encoded strings in web server access logs and analytics streams'
    ],
    helpfulNotes: [
      'Use "Component Mode" when encoding individual parameter values, and "Full URI Mode" when encoding an entire website address with protocol and path.',
      'UTF-8 characters like emojis, accents, and non-Latin scripts are encoded into multi-byte hex triplets (e.g., %E2%9C%93).'
    ]
  },
  'uuid-generator': {
    about: 'The UUID Generator produces cryptographically random unique identifiers across multiple standard specifications. You can generate Version 4 UUIDs conforming to RFC 4122 using browser-native cryptographic randomness (crypto.getRandomValues), compact 21-character NanoIDs, or 16-character hexadecimal tokens. The tool supports batch generation up to 100 IDs at a time, with customization options for casing, hyphens, and quotation wrappers.',
    formulaOrPrinciple: 'RFC 4122 UUID v4 employs 122 bits of cryptographic pseudo-randomness, setting version bits (0100) in the 7th byte and variant bits (10xx) in the 9th byte, yielding a collision probability of ~1 in 2.7 quintillion.',
    useCases: [
      'Generating unique primary keys for relational databases, NoSQL documents, and distributed storage systems',
      'Creating random session tokens, transaction correlation IDs, and idempotent request keys for microservices',
      'Generating mock dataset records and test fixtures for software quality assurance and load testing',
      'Assigning unique asset tracking numbers and file download tokens in web applications'
    ],
    helpfulNotes: [
      'UUIDs are generated locally using your browser\'s native cryptographic entropy pool, ensuring random numbers are not transmitted across any network.',
      'The batch wrapper format allows you to output IDs wrapped in quotes, curly braces, or JSON array syntax for direct code pasting.'
    ]
  },
  'regex-tester': {
    about: 'The Regex Tester is an interactive regular expression testing environment for developing, debugging, and validating JavaScript regular expressions. It provides live match highlighting within test strings, detailed extraction of captured groups, and match start/end indices. You can toggle standard regex flags (global, case-insensitive, multiline, dotAll, and unicode) and simulate replacement operations using capture group references.',
    formulaOrPrinciple: 'Executes against the JavaScript RegExp ECMAScript specification, supporting backreferences, lookaheads, lookbehinds, non-capturing groups, and substitution templates ($1, $&).',
    useCases: [
      'Validating input formats such as email addresses, international phone numbers, postal codes, and dates',
      'Testing extraction patterns to parse server logs, CSV extracts, and markdown documents',
      'Prototyping complex search-and-replace patterns using backreferences and capture groups',
      'Debugging regex edge cases and boundary conditions before deploying patterns into production code'
    ],
    helpfulNotes: [
      'Enable the "s" (dotAll) flag if you need the wildcard dot (.) character to match newline breaks across multi-line blocks.',
      'The replacement preview supports special token syntax, such as $1 for the first captured group and $& for the entire matched string.'
    ]
  },
  'hash-generator': {
    about: 'The Hash Generator computes cryptographic and non-cryptographic checksum digests for text strings in real time. It calculates MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously using the browser\'s native Web Cryptography API. It also includes an integrated checksum comparator that allows you to paste an expected hash to immediately verify whether an input matches without case sensitivity discrepancies.',
    formulaOrPrinciple: 'Cryptographic hash functions process input bytes through one-way mathematical compression functions, producing a fixed-bit output digest that exhibits the avalanche effect (small input change causes dramatic digest change).',
    useCases: [
      'Verifying data integrity and file checksums against publisher-provided SHA-256 or MD5 signatures',
      'Generating deterministic cache keys and object identifiers in web application architectures',
      'Comparing string values securely without exposing raw text strings',
      'Testing hashing algorithm behavior and output digest lengths for computer science coursework'
    ],
    helpfulNotes: [
      'While MD5 and SHA-1 are supported for legacy checksum validation, SHA-256 or SHA-512 should always be preferred for security-sensitive integrity verification.',
      'Hash generation runs locally in your browser memory via crypto.subtle and does not send plain text over the network.'
    ]
  },
  'data-storage-converter': {
    about: 'The Data Storage Converter translates digital file sizes and network bandwidth quantities between decimal SI standards and binary IEC standards. It converts across Bits (b), Bytes (B), Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), and Petabytes (PB), as well as binary Kibibytes (KiB), Mebibytes (MiB), Gibibytes (GiB), and Tebibytes (TiB). A comprehensive conversion matrix displays all equivalent measurements simultaneously.',
    formulaOrPrinciple: 'Decimal (SI): 1 KB = 1,000 Bytes (10³). Binary (IEC): 1 KiB = 1,024 Bytes (2¹⁰). Operating systems like Windows report binary values using decimal abbreviations, causing perceived drive capacity discrepancies.',
    useCases: [
      'Explaining why a newly purchased 1 TB solid-state drive displays as approximately 931 GB in Windows Explorer',
      'Calculating file transfer times by converting network connection speeds (megabits per second) to download rates (megabytes per second)',
      'Allocating virtual machine RAM and hard drive partition sizes accurately according to hosting provider specifications',
      'Verifying cloud storage bucket allocations, database backup sizes, and server bandwidth quotas'
    ],
    helpfulNotes: [
      'Storage manufacturers market drives using decimal multiples (1 GB = 1,000,000,000 bytes), whereas many operating systems compute capacity using powers of two (1 GiB = 1,073,741,824 bytes).',
      'Remember that 1 Byte equals 8 Bits; network speeds are usually measured in bits (Mbps), while file sizes are measured in bytes (MB).'
    ]
  },
  'temperature-converter': {
    about: 'The Temperature Converter calculates temperature conversions between five major international thermometric scales: Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), and Réaumur (°Re). It performs real-time bidirectional synchronization, provides underlying mathematical conversion equations for each pair, and includes clickable physical thermal benchmarks such as Absolute Zero, water freezing point, human body temperature, and water boiling point.',
    formulaOrPrinciple: '°F = (°C × 9/5) + 32. K = °C + 273.15. °R = (°C + 273.15) × 9/5. °Re = °C × 4/5. Celsius and Fahrenheit intersect at exactly -40 degrees.',
    useCases: [
      'Translating weather forecasts and travel temperatures between Celsius and Fahrenheit when abroad',
      'Converting cooking recipe oven temperatures between Fahrenheit and Celsius for baking',
      'Solving thermodynamics and chemistry equations requiring absolute temperature in Kelvin or Rankine',
      'Studying physical science temperature benchmarks and historical thermometric scales'
    ],
    helpfulNotes: [
      'Kelvin is an absolute thermodynamic scale; it starts at Absolute Zero (0 K) and does not use a degree symbol (°).',
      'At exactly -40°C, the temperature is equal to -40°F, representing the unique crossover point between the two scales.'
    ]
  },
  'pdf-splitter': {
    about: 'The PDF Splitter extracts specific pages, custom ranges, or separates multi-page PDF documents into individual files directly within your browser. Utilizing client-side WebAssembly and the pdf-lib library, the tool lets you specify exact page sequences (such as "1-3, 5, 8-10"), burst every page into a standalone document, or delete unwanted pages and export the remaining file. All document parsing happens in local device memory.',
    formulaOrPrinciple: 'Parses the internal PDF cross-reference table and dictionary objects to selectively copy binary page streams into new container structures without re-encoding raster graphics.',
    useCases: [
      'Extracting an invoice, signed agreement page, or summary sheet from an extensive corporate report',
      'Removing confidential or blank pages from scanned document packets before public transmission',
      'Splitting a book, presentation slide deck, or academic journal into standalone chapter files',
      'Isolating specific forms or legal exhibits for separate court or government agency submissions'
    ],
    helpfulNotes: [
      'Page numbers follow human document order starting at 1, matching the visual page sequence of standard PDF readers.',
      'Because processing is executed client-side via pdf-lib, sensitive legal and financial documents are never uploaded to an external server.'
    ]
  },
  'pdf-compressor': {
    about: 'The PDF Compressor optimizes and reduces the file size of PDF documents to satisfy strict email attachment limits and portal upload thresholds. It provides three compression presets: High Compression (maximum size reduction, ideal for text-heavy reports and administrative forms), Balanced (optimal trade-off between visual quality and file size), and High Quality (minimal downsampling for image-rich presentations). All processing runs in browser memory.',
    formulaOrPrinciple: 'Reduces document footprint by resampling high-resolution embedded raster images to target DPI benchmarks, adjusting JPEG compression quality, and stripping redundant metadata objects.',
    useCases: [
      'Compressing oversized scanned receipts, resumes, and identification documents to under 2 MB for job and university portals',
      'Reducing architectural project portfolios or presentation slide decks for email attachments',
      'Optimizing PDF manuals and brochures to accelerate download speeds on mobile websites',
      'Reclaiming device storage by downsizing archived documents and scanned tax records'
    ],
    helpfulNotes: [
      'Documents containing high-resolution scanned photographs will experience significant size reductions, while text-only PDFs may show smaller percentage gains since vector typography is already compact.',
      'The compressor operates inside your browser, keeping private personal records and contracts confidential on your device.'
    ]
  },
  'image-resizer': {
    about: 'The Image Resizer adjusts pixel dimensions and file sizes for digital images in PNG, JPEG, and WebP formats. You can resize by specifying exact pixel dimensions (width and height) or by applying percentage scaling factors (such as 50% or 75%). An aspect-ratio lock toggle prevents accidental stretching or distortion, and configurable output format and quality settings allow you to balance sharpness with file size.',
    formulaOrPrinciple: 'Draws uploaded images to an HTML5 OffscreenCanvas element using bicubic interpolation algorithms to resample pixel grids to user-defined coordinates before re-encoding.',
    useCases: [
      'Resizing digital camera photos to meet exact dimensions required for social media profile avatars, banners, and headers',
      'Downscaling oversized product images to standardize catalog dimensions for e-commerce platforms',
      'Reducing image resolution to optimize webpage loading speeds and Core Web Vitals metrics',
      'Formatting pictures to conform to strict pixel height and width limits for passport or visa upload portals'
    ],
    helpfulNotes: [
      'Keep the aspect ratio lock enabled when modifying photos to ensure visual proportions remain natural.',
      'Downscaling high-resolution photos in the browser canvas preserves sharp visual details while dramatically lowering storage weight.'
    ]
  },
  'jpg-to-png': {
    about: 'The JPG to PNG Converter transforms JPEG/JPG images into lossless PNG format directly within your web browser. Converting to PNG is ideal when you need to prevent further compression artifacts, preserve fine pixel detail in charts or typography, or prepare graphics for editing in design software. The converter processes files locally via HTML5 canvas, maintaining original image dimensions and full color fidelity.',
    formulaOrPrinciple: 'Decompresses discrete cosine transform (DCT) JPEG data blocks into raw uncompressed RGBA pixel buffers and re-encodes them into DEFLATE-compressed PNG chunks (IHDR, IDAT, IEND).',
    useCases: [
      'Converting diagram screenshots and infographic JPEG files into lossless PNGs to prevent compression degradation',
      'Preparing photographs and graphic assets for compositing and layering in graphic editing suites',
      'Standardizing image asset formats across software development pipelines and documentation systems',
      'Eliminating JPEG generation loss when planning repeated edits and re-saves on an image'
    ],
    helpfulNotes: [
      'While converting from JPG to PNG produces a lossless container, it cannot retroactively restore image detail that was already lost during original JPEG compression.',
      'PNG files are typically larger than equivalent JPEGs because PNG uses lossless compression algorithms.'
    ]
  },
  'png-to-jpg': {
    about: 'The PNG to JPG Converter transforms PNG graphics into universal JPEG format with customizable quality controls and background matte color selection. Because JPEG does not support alpha transparency, transparent areas in PNGs will turn black in naive converters; our tool lets you choose a clean matte background (white, black, or custom) so transparent logos and illustrations render properly. You can adjust JPEG quality from 10% to 100% with live file size estimation.',
    formulaOrPrinciple: 'Blends RGBA alpha channels against a designated background color vector before applying lossy discrete cosine transform compression and chroma subsampling to produce standard JPEG byte streams.',
    useCases: [
      'Converting large transparent PNG screenshots and graphic designs into lightweight JPEGs for email attachments',
      'Replacing transparent backgrounds with solid white for e-commerce marketplaces that reject transparent images',
      'Reducing storage footprints when archiving digital images where lossless PNG precision is unnecessary',
      'Standardizing image formats for older legacy devices and digital photo frames that do not display PNG files'
    ],
    helpfulNotes: [
      'If your PNG image contains transparency, choose the white background matte for documents or products, or black for dark-themed artwork.',
      'Setting quality between 80% and 90% offers an optimal balance of photographic sharpness and significant file size reduction.'
    ]
  },
  'webp-converter': {
    about: 'The WebP Converter provides bidirectional image format conversion between Google\'s modern WebP format and traditional PNG or JPEG formats. You can convert PNG, JPG, or GIF files into lightweight WebP images to reduce website load times, or convert WebP images back into universal PNG or JPG files for use in software that does not support WebP. The tool includes an adjustable quality slider and live file size comparisons.',
    formulaOrPrinciple: 'WebP uses predictive coding derived from the VP8 video codec for lossy compression and 2D color transform modeling for lossless compression, reducing file weights by 25–35% compared to JPEG.',
    useCases: [
      'Converting blog graphics and product photos into WebP format to improve Google Core Web Vitals and page speed scores',
      'Converting downloaded WebP files into universal JPG or PNG format for editing in older desktop graphics software',
      'Optimizing mobile application assets to decrease application bundle download sizes',
      'Testing image compression efficiencies across different quality settings before deploying to production CDNs'
    ],
    helpfulNotes: [
      'WebP is natively supported by all modern web browsers (Chrome, Safari, Firefox, Edge), making it the recommended format for web publishing.',
      'When converting WebP to PNG, image quality is fully preserved, though the resulting file size may increase due to PNG\'s encoding structure.'
    ]
  },
  'html-formatter': {
    about: 'The HTML Formatter cleans, indents, and standardizes unformatted HTML source code and website markup. It properly indents nested DOM tags, aligns attribute blocks, and structures void elements for enhanced readability. You can customize indentation depth (2 spaces, 4 spaces, or tabs), enforce line wrapping lengths, preserve empty line breaks, or switch into HTML minifier mode to strip unnecessary whitespace for production deployments.',
    formulaOrPrinciple: 'Lexically analyzes markup tokens to construct a hierarchical tag stack, applying indentation offsets according to nesting depth while protecting preformatted elements (<pre>, <code>, <textarea>) from whitespace mutation.',
    useCases: [
      'Beautifying minified or obfuscated HTML copied from browser page sources and web scrapers',
      'Standardizing code formatting across team development projects and content management templates',
      'Inspecting complex nested div structures, tables, and form layouts to identify unclosed tags',
      'Minifying final HTML markup before deploying static website assets to content delivery networks'
    ],
    helpfulNotes: [
      'Preformatted containers such as <pre> and <textarea> preserve their internal spacing to avoid disrupting rendered preformatted text.',
      'The minification toggle collapses extraneous whitespace into single spaces, reducing HTML payload transfer size.'
    ]
  },
  'css-formatter': {
    about: 'The CSS Formatter standardizes CSS stylesheets, media queries, and design system rules into structured, readable syntax. It correctly indents nested selector rules, aligns property-value declarations with colons, places opening and closing braces consistently, and separates style blocks with clean line breaks. It supports indentation options (2 spaces, 4 spaces, tabs) and includes a CSS minification mode to compress stylesheets for production.',
    formulaOrPrinciple: 'Parses CSS token streams into rulesets, at-rules (@media, @keyframes), and declaration blocks, applying uniform indentation and spacing while preserving quoted font names and URLs.',
    useCases: [
      'Beautifying compressed, minified, or messy CSS files to debug layout issues and inspect styling rules',
      'Enforcing consistent code formatting standards across stylesheets in collaborative frontend projects',
      'Reformatting extracted inline styles into clean, modular CSS declaration blocks',
      'Compressing CSS stylesheets into lightweight single-line assets to minimize render-blocking resources'
    ],
    helpfulNotes: [
      'Media queries and keyframe animations are indented hierarchically with their internal declaration blocks preserved.',
      'Minification strips CSS comments and redundant semicolons, significantly decreasing stylesheet file size.'
    ]
  },
  'javascript-formatter': {
    about: 'The JavaScript Formatter beautifies and structures unformatted JavaScript and TypeScript source code. It organizes nested functions, loops, object literals, and control flow blocks with consistent indentation (2 spaces, 4 spaces, or tabs) and clean brace alignment. It includes real-time syntax error validation to highlight missing brackets or unexpected tokens, and features a JS minification mode to remove whitespace for deployment.',
    formulaOrPrinciple: 'Tokenizes ECMAScript syntax into lexical tokens and manages bracket and parenthesis nesting stacks to apply structural indentation while safeguarding string literals and regex patterns.',
    useCases: [
      'Unpacking minified or bundled JavaScript scripts to analyze logic, inspect API calls, and debug runtime errors',
      'Standardizing code indentation and formatting in code snippets before sharing in documentation or tutorials',
      'Validating JavaScript syntax to quickly locate unclosed quotation marks, parenthesis mismatches, or missing semicolons',
      'Cleaning up code generated by automated transpilers or AI coding assistants'
    ],
    helpfulNotes: [
      'String literals and regular expression patterns are protected from indentation changes to ensure code behavior remains unchanged.',
      'If your code contains a syntax error, the formatter indicates the approximate position so you can correct the issue before formatting.'
    ]
  }
};

/**
 * Returns complete, high-quality publisher guide data for a tool.
 * If a tool does not have an explicitly authored editorial entry
 * (such as tools currently in active roadmap development),
 * this function returns null rather than synthesizing formulaic boilerplate.
 */
export function getToolPublisherData(tool: Tool): ToolEditorialGuide | null {
  return TOOL_EDITORIAL_DATA[tool.slug] || null;
}

