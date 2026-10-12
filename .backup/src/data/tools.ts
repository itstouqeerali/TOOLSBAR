import { Tool } from '../types';
import { PercentageCalculator } from '../components/tools/PercentageCalculator';
import { AgeCalculator } from '../components/tools/AgeCalculator';
import { WordCounter } from '../components/tools/WordCounter';
import { CharacterCounter } from '../components/tools/CharacterCounter';
import { CaseConverter } from '../components/tools/CaseConverter';
import { JsonFormatter } from '../components/tools/JsonFormatter';
import { Base64Tool } from '../components/tools/Base64Tool';
import { UnitConverter } from '../components/tools/UnitConverter';
import { QrGenerator } from '../components/tools/QrGenerator';
import { PasswordGenerator } from '../components/tools/PasswordGenerator';
import { BmiCalculator } from '../components/tools/BmiCalculator';
import { DiscountCalculator } from '../components/tools/DiscountCalculator';
import { AverageCalculator } from '../components/tools/AverageCalculator';
import { RatioCalculator } from '../components/tools/RatioCalculator';
import { SimpleInterestCalculator } from '../components/tools/SimpleInterestCalculator';
import { CompoundInterestCalculator } from '../components/tools/CompoundInterestCalculator';
import { LoanEmiCalculator } from '../components/tools/LoanEmiCalculator';
import { GstTaxCalculator } from '../components/tools/GstTaxCalculator';
import { RemoveDuplicateLines } from '../components/tools/RemoveDuplicateLines';
import { RemoveExtraSpaces } from '../components/tools/RemoveExtraSpaces';
import { TextSorter } from '../components/tools/TextSorter';
import { SlugGenerator } from '../components/tools/SlugGenerator';
import { LoremIpsumGenerator } from '../components/tools/LoremIpsumGenerator';
import { JsonMinifier } from '../components/tools/JsonMinifier';
import { UrlEncoderDecoder } from '../components/tools/UrlEncoderDecoder';
import { UuidGenerator } from '../components/tools/UuidGenerator';
import { RegexTester } from '../components/tools/RegexTester';
import { HashGenerator } from '../components/tools/HashGenerator';
import { DataStorageConverter } from '../components/tools/DataStorageConverter';
import { TemperatureConverter } from '../components/tools/TemperatureConverter';
import { PdfMerger } from '../components/tools/PdfMerger';
import { PdfSplitter } from '../components/tools/PdfSplitter';
import { PdfCompressor } from '../components/tools/PdfCompressor';
import { ImagesToPdf } from '../components/tools/ImagesToPdf';
import { TextToPdf } from '../components/tools/TextToPdf';
import { ImageCompressor } from '../components/tools/ImageCompressor';
import { ImageResizer } from '../components/tools/ImageResizer';
import { JpgToPng } from '../components/tools/JpgToPng';
import { PngToJpg } from '../components/tools/PngToJpg';
import { WebpConverter } from '../components/tools/WebpConverter';
import { HtmlFormatter } from '../components/tools/HtmlFormatter';
import { CssFormatter } from '../components/tools/CssFormatter';
import { JavascriptFormatter } from '../components/tools/JavascriptFormatter';
import { JwtDecoder } from '../components/tools/JwtDecoder';
import { UnixTimestampConverter } from '../components/tools/UnixTimestampConverter';

export const TOOLS: Tool[] = [
  // 1. Percentage Calculator
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'calculators',
    description: 'Calculate percentages, increases, decreases, discounts, and common percentage formulas with real-time accuracy.',
    shortDesc: 'Calculate percentages, increases, differences, and discounts.',
    icon: 'Percent',
    keywords: ['percentage', 'calculator', 'discount', 'increase', 'decrease', 'math', 'proportion', 'tip', 'fraction', 'ratio'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: PercentageCalculator,
    relatedToolSlugs: ['discount-calculator', 'gst-tax-calculator', 'average-calculator'],
    seo: {
      title: 'Percentage Calculator — Fast & Instant Percentage Calculations',
      description: 'Free online percentage calculator. Calculate percentages, percentage increase or decrease, whole values, and sales discounts with live formula breakdowns.',
      keywords: ['percentage calculator', 'percent of number', 'percentage change', 'discount calculator'],
      h1: 'Percentage Calculator',
      intro: 'Calculate percentages instantly with step-by-step algebraic breakdown, decimal precision customization, and multiple calculation modes.',
      howToUse: [
        'Select calculation mode (e.g. "What is X% of Y?" or "% Increase/Decrease").',
        'Enter your input values into the number fields.',
        'View the instant result, copy the answer, or review the exact mathematical equation.'
      ],
      features: [
        'Five calculation modes covering percentage of number, percentage change, and proportions',
        'Step-by-step formula breakdown explaining the exact algebraic solution',
        'Adjustable decimal precision up to 6 decimal places',
        'Instant clipboard copy for computed answers and mathematical steps'
      ],
      faq: [
        {
          question: 'How do you calculate percentage of a number?',
          answer: 'To calculate P percent of a number N, convert the percentage into a decimal by dividing by 100, then multiply by N: (P ÷ 100) × N.'
        },
        {
          question: 'How is percentage increase or decrease calculated?',
          answer: 'Subtract the original value from the new value, divide the difference by the original value, and multiply by 100: ((New − Original) / Original) × 100.'
        },
        {
          question: 'Can this calculator handle negative numbers and decimals?',
          answer: 'Yes, you can enter positive, negative, and decimal values across all percentage calculation modes with real-time precision.'
        }
      ]
    }
  },

  // 2. Age Calculator
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'datetime',
    description: 'Calculate your exact chronological age in years, months, days, hours, and seconds with live ticking countdowns.',
    shortDesc: 'Exact age in years, months, days, hours, minutes & seconds.',
    icon: 'Calendar',
    keywords: ['age', 'calculator', 'birthday', 'chronological', 'zodiac', 'birth date', 'countdown', 'time alive'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: AgeCalculator,
    relatedToolSlugs: ['percentage-calculator', 'unit-converter', 'word-counter'],
    seo: {
      title: 'Age Calculator — Exact Age in Years, Months, Days & Seconds',
      description: 'Calculate your exact chronological age from date of birth. View completed years, months, days, hours, live ticking seconds, and next birthday countdowns.',
      keywords: ['age calculator', 'chronological age', 'birthday calculator', 'days alive'],
      h1: 'Age Calculator',
      intro: 'Determine exact chronological age with live second ticking, total lifetime duration in all units, and birthday celebration countdown.',
      howToUse: [
        'Pick your Date of Birth in the date picker field.',
        'Optionally add your exact birth time for pinpoint second precision.',
        'Review your age breakdown and copy your shareable summary.'
      ],
      features: [
        'Real-time chronological age breakdown down to the exact second',
        'Total elapsed duration calculated in years, months, days, hours, and minutes',
        'Upcoming birthday countdown with remaining days and weekday indicator',
        'Automatic Gregorian leap year adjustment across all lifespans'
      ],
      faq: [
        {
          question: 'How does the age calculator handle leap years?',
          answer: 'The calculation checks each February in your lifespan to accurately account for 366-day leap years, ensuring exact day counts.'
        },
        {
          question: 'Can I find my exact age at a specific future or past date?',
          answer: 'Yes, by adjusting the target calculation date, you can determine your exact age on any historical or future milestone.'
        },
        {
          question: 'Is my birthdate data saved or sent to a server?',
          answer: 'No, all date calculations run locally in your web browser memory. Your birth date is never recorded, stored, or transmitted.'
        }
      ]
    }
  },

  // 3. Word Counter
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    category: 'text',
    description: 'Count words, characters, sentences, paragraphs, reading time, and estimate Flesch-Kincaid readability in real time.',
    shortDesc: 'Count words, characters, reading time & readability grade.',
    icon: 'FileText',
    keywords: ['word count', 'character count', 'reading time', 'text counter', 'readability', 'flesch kincaid'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: WordCounter,
    relatedToolSlugs: ['character-counter', 'case-converter', 'remove-extra-spaces'],
    seo: {
      title: 'Word Counter — Free Online Word & Character Count Tool',
      description: 'Free online word counter and text analyzer. Measure word count, character volume, reading duration, speaking time, and Flesch-Kincaid readability in real time.',
      keywords: ['word counter', 'character counter', 'word count tool', 'reading time calculator'],
      h1: 'Word Counter',
      intro: 'Analyze text statistics instantly: word count, character count, sentence volume, reading speeds, and top keyword frequencies.',
      howToUse: [
        'Type or paste your text into the editor.',
        'View the automatically updating metrics bar for total words, characters, and reading times.',
        'Check the sidebar for readability grade level and top keyword repetitions.'
      ],
      features: [
        'Live metric updates for word count, character count (with/without spaces), and paragraphs',
        'Estimated reading time (200 wpm) and speaking duration (130 wpm) metrics',
        'Flesch Reading Ease and Flesch-Kincaid Grade Level readability scoring',
        'Top keyword density table highlighting recurring words and phrases'
      ],
      faq: [
        {
          question: 'How is estimated reading time calculated?',
          answer: 'Reading time is estimated using the standard adult reading benchmark of 200 words per minute across English prose.'
        },
        {
          question: 'What does the Flesch Reading Ease score mean?',
          answer: 'The Flesch score rates text from 0 to 100. Higher scores (60–100) indicate clear, accessible text, while lower scores (0–50) reflect complex academic material.'
        },
        {
          question: 'Does the word counter support long articles and essays?',
          answer: 'Yes, the tool processes essays, articles, and long-form documents instantly in browser memory without character limits or truncation.'
        }
      ]
    }
  },

  // 4. Character Counter
  {
    id: 'character-counter',
    name: 'Character Counter',
    slug: 'character-counter',
    category: 'text',
    description: 'Track character lengths with live limit progress bars for Twitter/X, Instagram, LinkedIn, SEO titles, and SMS.',
    shortDesc: 'Live character tracker with social media & SEO limits.',
    icon: 'Type',
    keywords: ['character count', 'twitter limit', 'social media counter', 'instagram caption length', 'sms segment', 'utf8 bytes'],
    popular: true,
    featured: false,
    badge: 'Essential',
    status: 'ready',
    isImplemented: true,
    component: CharacterCounter,
    relatedToolSlugs: ['word-counter', 'case-converter', 'slug-generator'],
    seo: {
      title: 'Character Counter — Track Social Media & SEO Text Limits',
      description: 'Online character counter with live limit trackers for Twitter/X, Instagram captions, LinkedIn posts, SMS messages, and SEO title and description lengths.',
      keywords: ['character counter', 'twitter character count', 'social media character limit', 'seo character counter'],
      h1: 'Character Counter',
      intro: 'Monitor character count with live visual limit meters for Twitter/X, Instagram captions, LinkedIn posts, and SEO titles.',
      howToUse: [
        'Type or paste your message into the input area.',
        'Examine real-time social platform limit gauges.',
        'Copy the verified text with one click.'
      ],
      features: [
        'Visual progress bars for major social platforms (Twitter/X, Instagram, LinkedIn, Pinterest)',
        'SEO character benchmarks for search page titles (60 chars) and meta descriptions (160 chars)',
        'Detailed counts for characters with spaces, characters without spaces, words, and lines',
        'One-click copy and clear actions for quick drafting'
      ],
      faq: [
        {
          question: 'What is the character limit for Twitter/X posts?',
          answer: 'Standard Twitter/X posts allow up to 280 characters, with emojis and special characters counted accurately.'
        },
        {
          question: 'What are the recommended character lengths for SEO titles and descriptions?',
          answer: 'Search engines typically display 50–60 characters for page titles and 145–160 characters for meta descriptions before truncating.'
        },
        {
          question: 'Does the counter differentiate between characters with and without spaces?',
          answer: 'Yes, both totals are displayed simultaneously alongside line counts and byte estimations.'
        }
      ]
    }
  },

  // 5. Case Converter
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    category: 'text',
    description: 'Transform text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, snake_case, and more.',
    shortDesc: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase & kebab-case.',
    icon: 'CaseSensitive',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'kebab case', 'snake case'],
    popular: true,
    featured: false,
    badge: 'Essential',
    status: 'ready',
    isImplemented: true,
    component: CaseConverter,
    relatedToolSlugs: ['slug-generator', 'remove-extra-spaces', 'text-sorter'],
    seo: {
      title: 'Case Converter — Convert Text to Uppercase, Lowercase, CamelCase',
      description: 'Transform text case online instantly. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, snake_case, and PascalCase.',
      keywords: ['case converter', 'convert uppercase to lowercase', 'camelcase converter', 'title case tool'],
      h1: 'Case Converter',
      intro: 'Transform text into 12 different typographic and programming cases in real-time with one-click clipboard copying.',
      howToUse: [
        'Enter or paste text in the input area.',
        'Browse the live transformed versions in the case grid.',
        'Click the copy button on any case card.'
      ],
      features: [
        '12 text case transformations including Title Case, Sentence case, camelCase, and snake_case',
        'Grammar-aware Title Case engine respecting minor words (articles, conjunctions, prepositions)',
        'Developer-focused naming styles for code identifiers (PascalCase, kebab-case, CONSTANT_CASE)',
        'One-click clipboard copy with character and word counters'
      ],
      faq: [
        {
          question: 'What is the difference between camelCase and PascalCase?',
          answer: 'In camelCase, the first word begins with a lowercase letter and subsequent words are capitalized (e.g., userProfileData). In PascalCase, every word begins with a capital letter (e.g., UserProfileData).'
        },
        {
          question: 'How does Title Case handle articles and prepositions?',
          answer: 'The Title Case converter capitalizes major words while keeping minor prepositions, articles, and coordinating conjunctions (like "of", "and", "the") in lowercase unless they start the sentence.'
        },
        {
          question: 'Can I convert code identifiers like snake_case to camelCase?',
          answer: 'Yes, developers can convert database column names (snake_case) or URL slugs (kebab-case) directly into JavaScript-friendly camelCase or PascalCase.'
        }
      ]
    }
  },

  // 6. JSON Formatter & Validator
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'developer',
    description: 'Format, beautify, validate, minify, and inspect JSON with collapsible tree viewers and syntax error diagnostics.',
    shortDesc: 'Format, validate, beautify, and minify JSON data.',
    icon: 'Code2',
    keywords: ['json formatter', 'json validator', 'beautify json', 'minify json', 'json viewer', 'json parser'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: JsonFormatter,
    relatedToolSlugs: ['json-minifier', 'base64', 'url-encoder-decoder'],
    seo: {
      title: 'JSON Formatter & Validator — Beautify & Validate JSON Online',
      description: 'Format, beautify, validate, and minify JSON online. Features collapsible tree viewer, syntax error diagnostics with line numbers, and custom indentation.',
      keywords: ['json formatter', 'json beautifier', 'json validator online', 'minify json'],
      h1: 'JSON Formatter & Validator',
      intro: 'Beautify, validate, and debug JSON payloads with instant error detection and tree navigation.',
      howToUse: [
        'Paste raw JSON code into the editor.',
        'Click "Beautify / Format" to format with 2-space or 4-space indentation.',
        'Copy the formatted output or download it as a `.json` file.'
      ],
      features: [
        'Real-time JSON syntax validation with pinpoint error locations and line numbers',
        'Interactive collapsible tree viewer with expandable nodes and data type badges',
        'Configurable beautification formatting (2 spaces, 4 spaces, or tabs) and one-click minifier',
        'Local client-side execution ensuring sensitive API payloads remain private'
      ],
      faq: [
        {
          question: 'Why does my JSON fail validation?',
          answer: 'Common JSON syntax errors include trailing commas after the last object key, single quotes instead of double quotes around strings, and unescaped special characters.'
        },
        {
          question: 'Is my JSON data uploaded to an external server?',
          answer: 'No, all parsing, formatting, and validation runs entirely within your browser JavaScript engine. Your data never leaves your device.'
        },
        {
          question: 'Can this tool minify JSON payloads for production APIs?',
          answer: 'Yes, switching to minify mode strips all unnecessary whitespace and newlines, reducing payload byte size for faster network transfer.'
        }
      ]
    }
  },

  // 7. Base64 Encoder & Decoder
  {
    id: 'base64',
    name: 'Base64 Encoder & Decoder',
    slug: 'base64',
    category: 'developer',
    description: 'Encode and decode plain text, UTF-8 strings, and convert images/files into Base64 Data URIs with HTML/CSS snippets.',
    shortDesc: 'Encode and decode text, images, and files in Base64.',
    icon: 'Binary',
    keywords: ['base64', 'base64 encode', 'base64 decode', 'base64 image', 'data uri', 'binary to text'],
    popular: true,
    featured: false,
    badge: 'Essential',
    status: 'ready',
    isImplemented: true,
    component: Base64Tool,
    relatedToolSlugs: ['url-encoder-decoder', 'hash-generator', 'uuid-generator'],
    seo: {
      title: 'Base64 Encoder & Decoder — Text & File to Base64',
      description: 'Encode and decode Base64 text and files online. Convert plain text, UTF-8 strings, and images into Base64 Data URIs with ready-to-use HTML and CSS snippets.',
      keywords: ['base64 encoder', 'base64 decoder', 'base64 image converter'],
      h1: 'Base64 Encoder & Decoder',
      intro: 'Encode and decode strings with full UTF-8 compliance and drag-and-drop file to Data URI conversion.',
      howToUse: [
        'Choose "Text String Mode" or "Image & File to Base64".',
        'In text mode, choose Encode or Decode and enter your string.',
        'Copy the generated output with one click.'
      ],
      features: [
        'Two-way encoding and decoding for plain text and UTF-8 strings with Unicode support',
        'File to Base64 Data URI converter supporting images, icons, and document attachments',
        'One-click copy for raw Base64, HTML <img> tags, and CSS background-image declarations',
        'Zero server upload processing for maximum security and data privacy'
      ],
      faq: [
        {
          question: 'What is Base64 encoding used for?',
          answer: 'Base64 represents binary data in an ASCII string format, allowing images, files, and cryptographic keys to be safely embedded directly into HTML, CSS, JSON, or email headers.'
        },
        {
          question: 'Does Base64 encoding increase file size?',
          answer: 'Yes, Base64 encoding typically increases binary data size by approximately 33% because 3 bytes of raw binary data are represented using 4 ASCII characters.'
        },
        {
          question: 'Can this tool handle UTF-8 characters and non-Latin scripts?',
          answer: 'Yes, the encoder uses full UTF-8 byte serialization to accurately encode accented letters, emojis, and international alphabets.'
        }
      ]
    }
  },

  // 8. Universal Unit Converter
  {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    slug: 'unit-converter',
    category: 'converters',
    description: 'Convert units for length, mass/weight, temperature, digital data, area, volume, speed, and time with multi-unit matrix tables.',
    shortDesc: 'Convert length, weight, temperature, storage, volume & speed.',
    icon: 'Scale',
    keywords: ['unit converter', 'metric to imperial', 'length converter', 'weight converter', 'celsius to fahrenheit'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: UnitConverter,
    relatedToolSlugs: ['data-storage-converter', 'temperature-converter', 'percentage-calculator'],
    seo: {
      title: 'Universal Unit Converter — Length, Weight, Temperature & More',
      description: 'Universal unit converter for length, weight, temperature, area, volume, speed, time, and digital data. Convert metric and imperial units with live matrix tables.',
      keywords: ['unit converter', 'metric converter', 'measurement converter'],
      h1: 'Universal Unit Converter',
      intro: 'Convert between imperial and metric units with bidirectional calculation and comparison tables.',
      howToUse: [
        'Select a unit category (Length, Weight, Temperature, Area, Volume, Speed, etc.).',
        'Enter the value and choose source and target units.',
        'Review the multi-unit comparison table.'
      ],
      features: [
        'Multi-category conversion matrix covering length, mass, temperature, area, volume, speed, and data',
        'Simultaneous multi-unit comparison table showing conversions across all units at once',
        'High-precision decimal calculation with scientific notation for microscopic and astronomical numbers',
        'Instant swapping of source and target units with one click'
      ],
      faq: [
        {
          question: 'How do I convert between metric and imperial measurements?',
          answer: 'Select your measurement category, choose your starting unit (such as kilometers or pounds), enter the value, and the corresponding imperial or metric values update instantly.'
        },
        {
          question: 'How accurate are the conversion formulas?',
          answer: 'All conversions utilize international standard conversion constants (such as NIST and ISO standards) with floating-point precision.'
        },
        {
          question: 'Can I view conversions across all units simultaneously?',
          answer: 'Yes, the multi-unit matrix displays how your input value translates across every unit in the selected category at a single glance.'
        }
      ]
    }
  },

  // 9. QR Code Generator
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    slug: 'qr-generator',
    category: 'qr',
    description: 'Create custom QR codes for websites, WiFi logins, vCard contacts, emails, phone numbers, and SMS with vector SVG/PNG downloads.',
    shortDesc: 'Create custom QR codes for URLs, WiFi, contacts & text.',
    icon: 'QrCode',
    keywords: ['qr code', 'qr code generator', 'wifi qr code', 'vcard qr', 'custom qr code', 'svg qr code'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: QrGenerator,
    relatedToolSlugs: ['password-generator', 'url-encoder-decoder', 'slug-generator'],
    seo: {
      title: 'QR Code Generator — Free Custom QR Codes (PNG & SVG)',
      description: 'Free online QR code generator. Create custom QR codes for URLs, WiFi passwords, vCard contacts, emails, phone numbers, and SMS with PNG and SVG vector export.',
      keywords: ['qr code generator', 'custom qr code', 'wifi qr code generator'],
      h1: 'QR Code Generator',
      intro: 'Generate vector-sharp QR codes with custom foreground/background colors and pre-formatted templates.',
      howToUse: [
        'Select QR content type: URL, WiFi, Plain Text, Email, Phone, SMS, or vCard.',
        'Enter your information in the form fields.',
        'Download the QR code as PNG or SVG.'
      ],
      features: [
        'Support for URLs, plain text, WiFi network logins, vCard contact cards, email, SMS, and phone calls',
        'High-resolution PNG raster image and lossless SVG vector graphic downloads',
        'Adjustable error correction levels (L, M, Q, H) for optimal scannability with custom styling',
        'Real-time live preview updating as you type'
      ],
      faq: [
        {
          question: 'Do the generated QR codes expire?',
          answer: 'No, static QR codes encode data directly into the pixel matrix and will never expire or require recurring subscription fees.'
        },
        {
          question: 'What is the best error correction level for printing?',
          answer: 'For standard printing, Level M (15%) or Level Q (25%) is ideal. For outdoor signage or high-wear environments, choose Level H (30% recovery).'
        },
        {
          question: 'How do I create a QR code for WiFi access?',
          answer: 'Select the WiFi tab, enter your network name (SSID), password, and encryption type (WPA/WPA2/WEP). Scanning the code allows guests to join automatically.'
        }
      ]
    }
  },

  // 10. Password Generator
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    category: 'generators',
    description: 'Generate cryptographically strong passwords, memorable passphrases, and bulk security batches with entropy score meters.',
    shortDesc: 'Cryptographically secure passwords, passphrases & bulk batches.',
    icon: 'KeyRound',
    keywords: ['password generator', 'random password', 'secure password', 'passphrase generator', 'entropy'],
    popular: true,
    featured: true,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: PasswordGenerator,
    relatedToolSlugs: ['uuid-generator', 'hash-generator', 'base64'],
    seo: {
      title: 'Secure Password Generator — Strong Random Passwords & Passphrases',
      description: 'Generate strong, secure passwords and memorable passphrases online. Features cryptographic entropy scoring, character customization, and bulk password batches.',
      keywords: ['password generator', 'strong password generator', 'random password generator'],
      h1: 'Secure Password Generator',
      intro: 'Create passwords powered by browser `crypto.getRandomValues`, supporting custom symbol sets, passphrases, and bulk batches.',
      howToUse: [
        'Select between "Random Password", "Memorable Passphrase", or "Bulk Batch".',
        'Adjust the length slider and toggle character options.',
        'Copy the generated password.'
      ],
      features: [
        'Cryptographically secure pseudo-random generation using the browser Web Crypto API',
        'Custom character sets: uppercase, lowercase, numbers, symbols, and ambiguous character exclusion',
        'Diceware-style memorable passphrase generator with customizable word counts and separators',
        'Real-time password entropy estimation and brute-force cracking resistance metrics'
      ],
      faq: [
        {
          question: 'How secure are the generated passwords?',
          answer: 'Passwords are generated using window.crypto.getRandomValues, providing cryptographically strong pseudo-random numbers suitable for high-security credentials.'
        },
        {
          question: 'What makes a password strong against brute-force attacks?',
          answer: 'Length and character diversity are key. A password with 16+ characters combining uppercase, lowercase, numbers, and symbols provides over 90 bits of entropy.'
        },
        {
          question: 'Are generated passwords saved or stored anywhere?',
          answer: 'Never. Passwords are created entirely in your browser RAM and are completely erased when you close or refresh the page.'
        }
      ]
    }
  },

  // 11. BMI Calculator
  {
    id: 'bmi-calculator',
    name: 'BMI & Body Health Calculator',
    slug: 'bmi-calculator',
    category: 'calculators',
    description: 'Calculate Body Mass Index (BMI), ideal body weight range, healthy weight targets, and WHO category classification in Metric or Imperial.',
    shortDesc: 'Calculate BMI, body classification & ideal healthy weight range.',
    icon: 'Activity',
    keywords: ['bmi', 'body mass index', 'weight calculator', 'health', 'fitness', 'ideal weight', 'who category', 'metric', 'imperial'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: BmiCalculator,
    relatedToolSlugs: ['percentage-calculator', 'average-calculator', 'unit-converter'],
    seo: {
      title: 'BMI Calculator — Body Mass Index & Ideal Weight Targets',
      description: 'Free BMI calculator for adults. Calculate Body Mass Index, ideal weight targets, and health category classifications in Metric (cm/kg) or Imperial (ft/lbs) units.',
      keywords: ['bmi calculator', 'body mass index', 'ideal weight calculator', 'healthy weight range'],
      h1: 'BMI & Body Health Calculator',
      intro: 'Evaluate your Body Mass Index with instant WHO classification, healthy weight range calculation, and visual health meter.',
      howToUse: [
        'Select Metric (cm/kg) or Imperial (ft/in/lbs) unit system.',
        'Enter height and weight values.',
        'View your BMI score, WHO category, and target healthy weight range.'
      ],
      features: [
        'Dual unit support for Metric (kilograms, centimeters) and Imperial (feet, inches, pounds) systems',
        'World Health Organization (WHO) BMI classification chart with visual gauge indicator',
        'Calculation of healthy weight target ranges for your specific height',
        'Ponderal Index and Prime BMI metrics for comprehensive body mass assessment'
      ],
      faq: [
        {
          question: 'What is considered a healthy BMI range?',
          answer: 'According to the World Health Organization, a BMI between 18.5 and 24.9 is classified as normal/healthy weight for adults.'
        },
        {
          question: 'How is Body Mass Index calculated?',
          answer: 'In Metric units, BMI = weight (kg) ÷ height (m)². In Imperial units, BMI = (weight (lbs) × 703) ÷ height (inches)².'
        },
        {
          question: 'Does BMI distinguish between muscle mass and body fat?',
          answer: 'BMI is a screening tool based on height and weight. It does not measure body fat percentage directly or account for high muscle density in athletes.'
        }
      ]
    }
  },

  // 12. Discount Calculator
  {
    id: 'discount-calculator',
    name: 'Discount & Sale Price Calculator',
    slug: 'discount-calculator',
    category: 'calculators',
    description: 'Calculate final sale prices, stackable coupons, total savings amount, and local sales tax with real-time price breakdowns.',
    shortDesc: 'Calculate sale prices, double coupon savings & sales tax.',
    icon: 'Tag',
    keywords: ['discount calculator', 'sale price', 'percentage off', 'shopping calculator', 'savings', 'tax', 'coupon'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: DiscountCalculator,
    relatedToolSlugs: ['percentage-calculator', 'gst-tax-calculator', 'loan-emi-calculator'],
    seo: {
      title: 'Discount Calculator — Calculate Sale Prices & Total Savings',
      description: 'Calculate sale discounts, final clearance prices, percentage savings, stackable double coupons, and local sales tax with real-time visual breakdowns.',
      keywords: ['discount calculator', 'sale price calculator', 'percentage off calculator'],
      h1: 'Discount & Sale Price Calculator',
      intro: 'Determine exact sale prices with support for primary percentage discounts, stacked coupons, and local sales tax.',
      howToUse: [
        'Enter original item price and select currency.',
        'Enter primary discount rate (or click quick presets like 20% or 50%).',
        'Optionally add stackable coupon or sales tax to view final cost and total savings.'
      ],
      features: [
        'Instant calculation of final discounted price and exact monetary savings',
        'Stackable secondary discount support (e.g., 20% off plus an extra 10% coupon)',
        'Integrated sales tax calculation for accurate final checkout cost estimation',
        'Clear breakdown showing original price, total deductions, and tax addition'
      ],
      faq: [
        {
          question: 'How do stackable double discounts work?',
          answer: 'Double discounts apply sequentially. The second discount is calculated from the already discounted subtotal, not the original retail price.'
        },
        {
          question: 'How do you calculate a percentage discount manually?',
          answer: 'Multiply the original price by the discount percentage divided by 100 to find the savings, then subtract that amount from the original price.'
        },
        {
          question: 'Can this tool calculate prices with sales tax included?',
          answer: 'Yes, simply enter your local sales tax percentage to calculate the exact final total due at the checkout register.'
        }
      ]
    }
  },

  // 13. Average Calculator
  {
    id: 'average-calculator',
    name: 'Average & Statistics Calculator',
    slug: 'average-calculator',
    category: 'calculators',
    description: 'Compute Mean, Median, Mode, Range, Standard Deviation, Variance, Sum, and sorted lists from any dataset.',
    shortDesc: 'Compute Mean, Median, Mode, Range, Std Dev & Sum.',
    icon: 'BarChart3',
    keywords: ['average calculator', 'mean', 'median', 'mode', 'standard deviation', 'variance', 'statistics', 'math'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: AverageCalculator,
    relatedToolSlugs: ['percentage-calculator', 'ratio-calculator', 'unit-converter'],
    seo: {
      title: 'Average Calculator — Mean, Median, Mode & Standard Deviation',
      description: 'Calculate Mean, Median, Mode, Range, Geometric Mean, Standard Deviation, and Variance from any number list. Features sorted dataset views and sum totals.',
      keywords: ['average calculator', 'mean median mode calculator', 'standard deviation calculator'],
      h1: 'Average & Statistics Calculator',
      intro: 'Calculate comprehensive descriptive statistics across any dataset with customizable decimal precision.',
      howToUse: [
        'Paste or type numbers separated by commas, spaces, or newlines.',
        'Review the calculated Mean, Median, Mode, Sum, Range, and Standard Deviation.',
        'Copy the summary statistics report.'
      ],
      features: [
        'Comprehensive statistical analysis: Mean, Median, Mode, Range, Sum, and Count',
        'Advanced dispersion metrics including Population & Sample Standard Deviation and Variance',
        'Automatic dataset cleanup with support for comma, space, or newline delimited inputs',
        'Ascending and descending sorted number sequence display'
      ],
      faq: [
        {
          question: 'What is the difference between Mean, Median, and Mode?',
          answer: 'The Mean is the arithmetic average (sum divided by count), the Median is the middle value when sorted, and the Mode is the number that appears most frequently.'
        },
        {
          question: 'When should I use Median instead of Mean?',
          answer: 'Median is preferred when analyzing datasets with extreme outliers (such as income or housing prices) because it is not skewed by unusually high or low numbers.'
        },
        {
          question: 'How does the calculator handle multiple modes (multimodal data)?',
          answer: 'If multiple numbers share the highest frequency, the tool lists all matching modes or indicates if no mode exists (all unique numbers).'
        }
      ]
    }
  },

  // 14. Ratio Calculator
  {
    id: 'ratio-calculator',
    name: 'Ratio & Aspect Ratio Calculator',
    slug: 'ratio-calculator',
    category: 'calculators',
    description: 'Solve proportions (A:B = C:D), simplify ratios using GCD, scale aspect ratios (16:9, 4:3), and divide quantities proportionally.',
    shortDesc: 'Solve proportions (A:B=C:D), simplify ratios & scale aspect ratios.',
    icon: 'Split',
    keywords: ['ratio calculator', 'proportion', 'aspect ratio', 'simplify ratio', 'gcd', 'screen resolution', 'scale'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: RatioCalculator,
    relatedToolSlugs: ['percentage-calculator', 'average-calculator', 'discount-calculator'],
    seo: {
      title: 'Ratio Calculator — Solve Proportions & Simplify Ratios',
      description: 'Solve proportions (A:B = C:D), simplify ratios to lowest terms using GCD, scale aspect ratios (16:9, 4:3, 21:9), and divide values proportionally online.',
      keywords: ['ratio calculator', 'aspect ratio calculator', 'simplify ratio', 'proportion solver'],
      h1: 'Ratio & Aspect Ratio Calculator',
      intro: 'Solve proportions, simplify ratios, scale dimensions, and divide amounts with step-by-step mathematical explanations.',
      howToUse: [
        'Select mode: Solve Proportion, Simplify Ratio, Scale, or Divide.',
        'Enter known parameters.',
        'View the calculated proportion and explanation.'
      ],
      features: [
        'Four calculation modes: Solve Proportions, Simplify Ratios, Aspect Ratio Resizing, and Split Total',
        'Greatest Common Divisor (GCD) step-by-step reduction for exact integer simplification',
        'Aspect ratio scaling for digital video, photography, and responsive UI design',
        'Proportional sharing mode for dividing money, ingredients, or resources among ratios'
      ],
      faq: [
        {
          question: 'How do you simplify a ratio to its lowest terms?',
          answer: 'Find the Greatest Common Divisor (GCD) of both numbers in the ratio and divide both terms by that common factor.'
        },
        {
          question: 'How do you solve for an unknown value in a proportion?',
          answer: 'Use cross-multiplication: if A/B = C/D, then A × D = B × C. Divide by the known term to solve for the unknown variable.'
        },
        {
          question: 'What are common display aspect ratios?',
          answer: 'Common ratios include 16:9 (modern widescreen monitors and HDTV), 4:3 (classic displays), 21:9 (ultrawide monitors), and 1:1 or 9:16 (social media feeds and stories).'
        }
      ]
    }
  },

  // 15. Simple Interest Calculator
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    category: 'calculators',
    description: 'Calculate simple interest yield, maturity value, and annual return on deposits and loans with tenure breakdown.',
    shortDesc: 'Calculate interest earned, total maturity value & yearly yield.',
    icon: 'Landmark',
    keywords: ['simple interest', 'interest calculator', 'finance', 'maturity value', 'principal', 'investment return'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: SimpleInterestCalculator,
    relatedToolSlugs: ['compound-interest-calculator', 'loan-emi-calculator', 'percentage-calculator'],
    seo: {
      title: 'Simple Interest Calculator — Calculate Interest & Maturity Value',
      description: 'Calculate simple interest yield, total maturity value, and annual percentage returns on loans, deposits, and promissory notes with clear tenure breakdowns.',
      keywords: ['simple interest calculator', 'interest calculator', 'principal interest'],
      h1: 'Simple Interest Calculator',
      intro: 'Calculate simple interest earnings using formula I = (P × R × T) / 100 with customizable tenures and currency formatting.',
      howToUse: [
        'Enter principal investment amount.',
        'Enter annual interest rate percentage.',
        'Choose tenure in years, months, or days to view maturity value.'
      ],
      features: [
        'Simple interest computation using the standard formula: Interest = Principal × Rate × Time',
        'Flexible tenure input in years, months, or days with exact leap year options',
        'Visual breakdown chart comparing the original principal amount against accumulated interest',
        'Instant calculation of total payout amount and annual equivalent yields'
      ],
      faq: [
        {
          question: 'What is the formula for calculating simple interest?',
          answer: 'The formula is I = P × r × t, where P is Principal, r is the Annual Interest Rate (as a decimal), and t is Time in years.'
        },
        {
          question: 'How does simple interest differ from compound interest?',
          answer: 'Simple interest is calculated solely on the original principal amount, whereas compound interest calculates interest on both the principal and previously earned interest.'
        },
        {
          question: 'Can I calculate simple interest for periods less than one year?',
          answer: 'Yes, you can enter tenure in months or days; the calculator converts the time duration into the exact fractional year equivalent.'
        }
      ]
    }
  },

  // 16. Compound Interest Calculator
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'calculators',
    description: 'Project future investment wealth with regular monthly contributions, custom compounding frequencies, APY, and yearly growth tables.',
    shortDesc: 'Project portfolio growth with monthly deposits & compound interest.',
    icon: 'TrendingUp',
    keywords: ['compound interest', 'investment growth', 'apy', 'wealth calculator', 'savings projection', 'interest compounding'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: CompoundInterestCalculator,
    relatedToolSlugs: ['simple-interest-calculator', 'loan-emi-calculator', 'percentage-calculator'],
    seo: {
      title: 'Compound Interest Calculator — Investment Growth & APY',
      description: 'Project investment growth and savings wealth with regular monthly contributions, custom compounding frequencies (daily, monthly, yearly), and APY tables.',
      keywords: ['compound interest calculator', 'investment calculator', 'apy calculator', 'future value'],
      h1: 'Compound Interest Calculator',
      intro: 'Plan financial growth by calculating compound interest returns over time with periodic deposits and customizable compounding schedules.',
      howToUse: [
        'Enter initial starting principal and optional monthly contribution.',
        'Set expected annual interest rate and time horizon in years.',
        'Choose compounding frequency to view future balance and annual growth schedule.'
      ],
      features: [
        'Support for regular recurring contributions (monthly, quarterly, or annually) at the start or end of periods',
        'Multiple compounding cycles: Daily (365 days), Monthly, Quarterly, Semi-Annually, and Annually',
        'Year-by-year amortization schedule with total interest earned vs principal invested',
        'Annual Percentage Yield (APY) computation based on nominal interest rate'
      ],
      faq: [
        {
          question: 'How does compounding frequency impact investment returns?',
          answer: 'More frequent compounding (such as daily or monthly vs yearly) generates higher returns because interest begins earning interest sooner.'
        },
        {
          question: 'What is the difference between nominal interest rate and APY?',
          answer: 'The nominal rate is the stated annual interest rate, while APY (Annual Percentage Yield) reflects the true annual return accounting for compounding frequency.'
        },
        {
          question: 'Can I calculate savings growth with ongoing monthly deposits?',
          answer: 'Yes, enter your starting principal, ongoing monthly contribution amount, expected annual rate, and investment timeline to view your projected wealth.'
        }
      ]
    }
  },

  // 17. Loan EMI Calculator
  {
    id: 'loan-emi-calculator',
    name: 'Loan & Mortgage EMI Calculator',
    slug: 'loan-emi-calculator',
    category: 'calculators',
    description: 'Calculate Equated Monthly Installment (EMI), total interest payable, processing fees, and amortization repayment schedules.',
    shortDesc: 'Calculate monthly loan EMI, total interest & amortization schedule.',
    icon: 'CreditCard',
    keywords: ['loan calculator', 'emi calculator', 'mortgage', 'car loan', 'home loan', 'amortization', 'interest payment'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: LoanEmiCalculator,
    relatedToolSlugs: ['simple-interest-calculator', 'compound-interest-calculator', 'gst-tax-calculator'],
    seo: {
      title: 'Loan EMI Calculator — Monthly Payment & Amortization Schedule',
      description: 'Calculate loan EMI payments, total interest payable, processing fees, and full monthly amortization schedules for home, auto, and personal loans.',
      keywords: ['loan emi calculator', 'mortgage calculator', 'monthly payment calculator'],
      h1: 'Loan & Mortgage EMI Calculator',
      intro: 'Calculate monthly loan EMI and view full principal vs. interest breakdown with amortization preview.',
      howToUse: [
        'Enter loan principal amount and annual interest rate.',
        'Specify loan tenure in years or months.',
        'Review monthly EMI payment and amortization breakdown.'
      ],
      features: [
        'Equated Monthly Installment (EMI) calculation with principal and interest amortization breakdown',
        'Interactive visual chart displaying the exact ratio between principal repayment and total interest',
        'Complete month-by-month and year-by-year payment schedule with remaining balance tracking',
        'Optional processing fee calculation for accurate total borrowing cost assessment'
      ],
      faq: [
        {
          question: 'How is loan EMI calculated?',
          answer: 'EMI is calculated using the formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1], where P is Principal, r is the monthly interest rate, and n is tenure in months.'
        },
        {
          question: 'Why is interest higher in the early months of a loan?',
          answer: 'Because interest is computed on the outstanding loan balance. In the beginning, the balance is highest, so a larger portion of each EMI payment goes toward interest.'
        },
        {
          question: 'Can I use this calculator for both mortgages and personal loans?',
          answer: 'Yes, the EMI engine works for home loans, car loans, personal loans, and student loans with flexible tenure in months or years.'
        }
      ]
    }
  },

  // 18. GST & Tax Calculator
  {
    id: 'gst-tax-calculator',
    name: 'GST & Sales Tax Calculator',
    slug: 'gst-tax-calculator',
    category: 'calculators',
    description: 'Add or remove GST / Sales Tax (Exclusive vs Inclusive), compute CGST/SGST splits, and generate invoice tax breakdowns.',
    shortDesc: 'Add or remove GST/VAT with CGST/SGST splits & invoice breakdown.',
    icon: 'Receipt',
    keywords: ['gst calculator', 'tax calculator', 'sales tax', 'vat calculator', 'cgst', 'sgst', 'reverse tax', 'invoice'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: GstTaxCalculator,
    relatedToolSlugs: ['discount-calculator', 'percentage-calculator', 'loan-emi-calculator'],
    seo: {
      title: 'GST & Sales Tax Calculator — Add or Remove Tax Online',
      description: 'Free GST & sales tax calculator. Add or remove tax (Exclusive vs Inclusive), calculate CGST/SGST splits, and generate clear itemized tax invoices online.',
      keywords: ['gst calculator', 'tax calculator', 'sales tax calculator', 'vat calculator'],
      h1: 'GST & Sales Tax Calculator',
      intro: 'Calculate gross and net amounts with standard tax slab presets and CGST/SGST splits.',
      howToUse: [
        'Choose mode: Add GST (Net $\\to$ Gross) or Remove GST (Gross $\\to$ Net).',
        'Enter amount and select tax percentage rate.',
        'View itemized tax summary and copy invoice breakdown.'
      ],
      features: [
        'Two calculation directions: Add GST (Tax Exclusive) or Remove GST (Tax Inclusive)',
        'Pre-configured standard tax slab buttons (5%, 12%, 18%, 28%) plus custom percentage entry',
        'Automatic split breakdown for Central GST (CGST) and State GST (SGST)',
        'Itemized summary displaying Net Amount, GST Amount, and Gross Invoice Total'
      ],
      faq: [
        {
          question: 'How do you calculate the base price before tax from a tax-inclusive total?',
          answer: 'To remove tax from an inclusive price, use the formula: Base Price = Total Price / (1 + Tax Rate / 100).'
        },
        {
          question: 'What is the difference between CGST and SGST?',
          answer: 'Under the GST system for intra-state transactions, the total GST rate is divided equally between Central GST (CGST) and State GST (SGST).'
        },
        {
          question: 'Can this tool calculate international sales taxes like VAT or state sales tax?',
          answer: 'Yes, simply enter your regional VAT or state tax percentage to add or remove sales tax from any transaction amount.'
        }
      ]
    }
  },

  // 19. Remove Duplicate Lines
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    slug: 'remove-duplicate-lines',
    category: 'text',
    description: 'Deduplicate text lists, clean repeat lines, filter empty rows, and sort unique items with case-sensitive controls.',
    shortDesc: 'Deduplicate lists, remove duplicate text lines & filter unique items.',
    icon: 'ListFilter',
    keywords: ['remove duplicate lines', 'deduplicate list', 'unique lines', 'clean text', 'text filter'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: RemoveDuplicateLines,
    relatedToolSlugs: ['text-sorter', 'remove-extra-spaces', 'word-counter'],
    seo: {
      title: 'Remove Duplicate Lines — Online Text Deduplication Tool',
      description: 'Remove duplicate lines from text lists online. Clean repeat rows, filter empty lines, trim whitespace, and sort unique items with case sensitivity controls.',
      keywords: ['remove duplicate lines', 'text deduplicator', 'find unique lines'],
      h1: 'Remove Duplicate Lines',
      intro: 'Clean up lists and datasets by stripping repeat lines while maintaining original ordering or applying alphabetical sorting.',
      howToUse: [
        'Paste your list into the input box.',
        'Configure case sensitivity and trimming options.',
        'Copy or download the deduplicated clean list.'
      ],
      features: [
        'Instant deduplication with case-sensitive or case-insensitive matching options',
        'Optional automatic trimming of leading/trailing spaces before duplicate comparison',
        'Empty line filtering and line-sorting options (alphabetical A-Z, reverse Z-A, or preserve original order)',
        'Real-time stats showing original line count, duplicate count, and unique line total'
      ],
      faq: [
        {
          question: 'Does the tool preserve the original order of lines?',
          answer: 'Yes, by default the first occurrence of each unique line is kept in its original sequence, unless you select an alphabetical sorting option.'
        },
        {
          question: 'Can the tool ignore differences in capitalization when finding duplicates?',
          answer: 'Yes, toggle the "Case Sensitive" option off to treat uppercase and lowercase variations of the same line as duplicates.'
        },
        {
          question: 'Is there a limit on how many lines I can deduplicate?',
          answer: 'The deduplication runs locally in your browser memory and can process tens of thousands of lines in milliseconds.'
        }
      ]
    }
  },

  // 20. Remove Extra Spaces
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces & Whitespace',
    slug: 'remove-extra-spaces',
    category: 'text',
    description: 'Collapse consecutive spaces, trim leading/trailing whitespace, remove blank lines, and convert tabs to spaces.',
    shortDesc: 'Collapse multiple spaces, trim lines & clean whitespace.',
    icon: 'AlignLeft',
    keywords: ['remove extra spaces', 'clean whitespace', 'trim text', 'collapse spaces', 'remove blank lines'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: RemoveExtraSpaces,
    relatedToolSlugs: ['remove-duplicate-lines', 'case-converter', 'word-counter'],
    seo: {
      title: 'Remove Extra Spaces — Clean Whitespace & Format Text',
      description: 'Clean whitespace online. Collapse consecutive spaces, trim leading and trailing spaces, remove blank lines, and normalize tab indents in one click.',
      keywords: ['remove extra spaces', 'clean whitespace tool', 'trim lines'],
      h1: 'Remove Extra Spaces & Whitespace',
      intro: 'Normalize messy text by collapsing duplicate spaces into single spaces and cleaning line endings.',
      howToUse: [
        'Paste text with irregular spacing into the editor.',
        'Toggle formatting rules (collapse spaces, trim line ends, remove blank lines).',
        'Copy the formatted clean text.'
      ],
      features: [
        'Collapse multiple consecutive spaces into a single space across your entire document',
        'Trim trailing and leading whitespace from every line individually',
        'Remove blank or empty lines and normalize tab indents into standard spaces',
        'One-click clipboard copy with before-and-after character count reduction metrics'
      ],
      faq: [
        {
          question: 'What whitespace cleanup options are available?',
          answer: 'You can collapse multiple spaces into single spaces, trim line edges, remove empty lines, convert tabs to spaces, and remove all line breaks.'
        },
        {
          question: 'Why should I remove extra spaces from my text or code?',
          answer: 'Removing unnecessary whitespace improves typography, ensures clean database inputs, eliminates formatting glitches, and reduces document file size.'
        },
        {
          question: 'Will this tool alter special formatting inside paragraphs?',
          answer: 'The tool only targets redundant whitespace and spaces according to the cleanup options you enable, preserving your words and sentences.'
        }
      ]
    }
  },

  // 21. Text Sorter
  {
    id: 'text-sorter',
    name: 'Text & Line Sorter',
    slug: 'text-sorter',
    category: 'text',
    description: 'Sort lines of text online alphabetically (A-Z or Z-A), by line length, in natural numeric order, reverse line order, or shuffle lists randomly in your browser.',
    shortDesc: 'Sort lines alphabetically, naturally, by length, or shuffle.',
    icon: 'ArrowUpDown',
    keywords: ['text sorter', 'alphabetize list', 'sort lines', 'natural sort', 'shuffle list', 'reverse text'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: TextSorter,
    relatedToolSlugs: ['remove-duplicate-lines', 'case-converter', 'word-counter'],
    seo: {
      title: 'Text & Line Sorter — Alphabetize & Sort Lists Online',
      description: 'Sort lines of text online alphabetically (A-Z or Z-A), by line length, in natural numeric order, reverse line order, or shuffle lists randomly.',
      keywords: ['text sorter', 'alphabetical order tool', 'sort lines online'],
      h1: 'Text & Line Sorter',
      intro: 'Organize lists with multiple sorting algorithms including natural sort (e.g., File 2 before File 10), length, and random shuffling.',
      howToUse: [
        'Paste lines into the editor.',
        'Choose your desired sorting algorithm.',
        'Copy or download the sorted text.'
      ],
      features: [
        'Multiple sorting algorithms: Alphabetical (A-Z / Z-A), Natural Numeric (1, 2, 10), and Line Length',
        'Random shuffle order and reverse line sequence tools',
        'Case-sensitive or case-insensitive sorting options',
        'Trim whitespace and duplicate elimination options during sort'
      ],
      faq: [
        {
          question: 'What is Natural Numeric Sorting?',
          answer: 'Natural sorting orders numbers logically (e.g., Item 1, Item 2, Item 10) rather than standard ASCII alphabetical sorting (where Item 10 would precede Item 2).'
        },
        {
          question: 'Can I sort a list by the length of each line?',
          answer: 'Yes, choose the "Line Length" sorting mode to organize lines from shortest to longest or longest to shortest.'
        },
        {
          question: 'How do I randomize or shuffle a list of items?',
          answer: 'Select the "Shuffle / Randomize" option to randomize list ordering, which is ideal for raffles, prize draws, and team assignment lists.'
        }
      ]
    }
  },

  // 22. Slug Generator
  {
    id: 'slug-generator',
    name: 'URL Slug Generator',
    slug: 'slug-generator',
    category: 'text',
    description: 'Convert titles and text into clean, SEO-optimized URL slugs with accent transliteration and stop-word filtering.',
    shortDesc: 'Convert titles into SEO-friendly, clean URL slugs.',
    icon: 'Link2',
    keywords: ['slug generator', 'url slug', 'seo slug', 'clean url', 'kebab case', 'permalink generator'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: SlugGenerator,
    relatedToolSlugs: ['case-converter', 'url-encoder-decoder', 'character-counter'],
    seo: {
      title: 'URL Slug Generator — SEO Friendly Permalinks',
      description: 'Generate clean, SEO-friendly URL slugs online. Convert titles into permalinks with accent transliteration, custom separators, and stop-word filters.',
      keywords: ['slug generator', 'url slug creator', 'seo permalink generator'],
      h1: 'URL Slug Generator',
      intro: 'Generate clean, readable URL slugs with live website preview and customizable separators.',
      howToUse: [
        'Type your title or headline.',
        'Select separator and optional stop-word removal.',
        'Copy the generated slug.'
      ],
      features: [
        'Automatic Unicode transliteration converting accented characters (e.g. é → e, ü → u) into ASCII',
        'Customizable slug separators: Hyphen (-), Underscore (_), or Dot (.)',
        'Optional common stop-word filter (removing "the", "and", "a", "for", "with") for shorter URLs',
        'Strict lowercase transformation and special character removal for clean web addresses'
      ],
      faq: [
        {
          question: 'What makes a URL slug SEO-friendly?',
          answer: 'SEO-friendly slugs are short, descriptive, lowercase, use hyphens to separate words, and avoid special symbols, numbers, or unnecessary filler words.'
        },
        {
          question: 'How does the slug generator handle accented letters or foreign alphabets?',
          answer: 'The generator uses standard Unicode transliteration to convert accented characters (like à, é, ö, ñ) into their plain ASCII Latin equivalents.'
        },
        {
          question: 'Why should I remove stop words from URL slugs?',
          answer: 'Removing common stop words (like "in", "the", "a") makes URLs shorter, cleaner to read on social media, and more focused on primary keywords.'
        }
      ]
    }
  },

  // 23. Lorem Ipsum Generator
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Placeholder Generator',
    slug: 'lorem-ipsum-generator',
    category: 'text',
    description: 'Generate customizable placeholder dummy text by paragraphs, sentences, words, or lists in Classic Latin, Modern Tech Startup, or Pirate Talk themes online.',
    shortDesc: 'Generate dummy placeholder text, sentences, words & HTML markup.',
    icon: 'FileText',
    keywords: ['lorem ipsum', 'dummy text', 'placeholder text', 'filler text', 'mockup text', 'generator'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: LoremIpsumGenerator,
    relatedToolSlugs: ['word-counter', 'character-counter', 'case-converter'],
    seo: {
      title: 'Lorem Ipsum Generator — Placeholder Text for Designers & Developers',
      description: 'Generate custom placeholder dummy text by paragraphs, sentences, words, or lists in Classic Latin, Modern Tech Startup, or Pirate themes.',
      keywords: ['lorem ipsum generator', 'placeholder text generator', 'dummy text'],
      h1: 'Lorem Ipsum Placeholder Generator',
      intro: 'Create filler text tailored to your layout needs with output in plain text, HTML tags, or Markdown format.',
      howToUse: [
        'Select quantity and unit (paragraphs, sentences, words, or list items).',
        'Choose a theme style (Classic Latin, Tech Startup, or Pirate).',
        'Copy or download the generated placeholder text.'
      ],
      features: [
        'Multiple generation lengths: specify exact paragraphs, sentences, words, or unordered list items',
        'Three unique text themes: Classic Latin Cicero, Modern Tech Startup, and Pirate Talk',
        'Optional "Start with Lorem ipsum dolor sit amet..." toggle for traditional layouts',
        'HTML <p> tag wrapper export option for rapid frontend web development copy-pasting'
      ],
      faq: [
        {
          question: 'What is the origin of the classic Lorem Ipsum text?',
          answer: 'Lorem Ipsum is derived from sections 1.10.32 and 1.10.33 of Cicero\'s philosophical work "De Finibus Bonorum et Malorum", written in 45 BC.'
        },
        {
          question: 'Why do designers and developers use placeholder text?',
          answer: 'Placeholder text mimics natural sentence structure and word distribution, allowing stakeholders to evaluate typography, layout, and visual balance without being distracted by real copy.'
        },
        {
          question: 'Can I generate dummy text wrapped in HTML paragraph tags?',
          answer: 'Yes, toggle the "Wrap in HTML" option to copy formatted <p>...</p> tags ready for immediate insertion into your code editor.'
        }
      ]
    }
  },

  // 24. JSON Minifier
  {
    id: 'json-minifier',
    name: 'JSON Minifier & Compressor',
    slug: 'json-minifier',
    category: 'developer',
    description: 'Compress JSON payloads by removing all whitespace and newlines, or beautify with custom indentation and size compression ratio stats.',
    shortDesc: 'Minify, compress, or beautify JSON with size reduction stats.',
    icon: 'Minimize2',
    keywords: ['json minifier', 'compress json', 'minify json', 'json formatter', 'compact json', 'developer tool'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: JsonMinifier,
    relatedToolSlugs: ['json-formatter', 'base64', 'url-encoder-decoder'],
    seo: {
      title: 'JSON Minifier — Compress & Minify JSON Online',
      description: 'Compress and minify JSON payloads online. Remove whitespace, comments, and newlines to reduce payload byte sizes with real-time compression ratio stats.',
      keywords: ['json minifier', 'compress json online', 'json compressor'],
      h1: 'JSON Minifier & Compressor',
      intro: 'Remove all unnecessary whitespace from JSON payloads to reduce file size and API response payloads.',
      howToUse: [
        'Paste JSON in the editor.',
        'Choose Minify (Compact) or Beautify.',
        'Copy or download the minified JSON file.'
      ],
      features: [
        'Instant JSON compression stripping all indentation, newlines, and unnecessary whitespace',
        'Real-time payload byte size comparison and percentage compression ratio metrics',
        'Instant toggle to switch between minified output and 2-space / 4-space beautified view',
        'Strict syntax validation preventing minification of broken or corrupted JSON strings'
      ],
      faq: [
        {
          question: 'How much does minifying JSON reduce payload size?',
          answer: 'Depending on the depth of formatting and whitespace, minification typically reduces JSON payload size by 20% to 50%, saving bandwidth on API calls.'
        },
        {
          question: 'Does minifying JSON change the underlying data structure?',
          answer: 'No, minification only removes formatting whitespace, spaces, and line feeds outside of string values; the data values and keys remain 100% identical.'
        },
        {
          question: 'Is this minification process safe for sensitive API tokens and keys?',
          answer: 'Yes, the compression is executed 100% client-side in your local browser JavaScript runtime without any network requests.'
        }
      ]
    }
  },

  // 25. URL Encoder & Decoder
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    slug: 'url-encoder-decoder',
    category: 'developer',
    description: 'Encode and decode URLs and query parameters with percent-encoding (`encodeURIComponent` vs `encodeURI`) and query inspector.',
    shortDesc: 'Encode & decode URLs, URI components & inspect query parameters.',
    icon: 'Globe',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component', 'query parameter', 'url parser'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: UrlEncoderDecoder,
    relatedToolSlugs: ['base64', 'slug-generator', 'hash-generator'],
    seo: {
      title: 'URL Encoder & Decoder — Percent-Encoding Online Tool',
      description: 'Encode and decode URLs and query parameters online. Features percent-encoding (encodeURIComponent vs encodeURI), query parsing, and raw parameter inspection.',
      keywords: ['url encoder', 'url decoder', 'encodeuricomponent online'],
      h1: 'URL Encoder & Decoder',
      intro: 'Safely encode special characters for URLs or decode percent-encoded strings with automatic query parameter extraction.',
      howToUse: [
        'Choose URL Encode or URL Decode mode.',
        'Enter URL or string.',
        'Copy the result or review detected query parameters.'
      ],
      features: [
        'Dual encoding modes: Component-level (encodeURIComponent) and Full URL (encodeURI)',
        'Two-way decoding for percent-encoded URLs, spaces (+ vs %20), and special characters',
        'Interactive query parameter breakdown table listing all key-value pairs',
        'One-click swap between encode and decode directions with instant clipboard copying'
      ],
      faq: [
        {
          question: 'What is the difference between encodeURI and encodeURIComponent?',
          answer: 'encodeURI encodes an entire URL while preserving protocol and path delimiters (like ://, ?, &, #). encodeURIComponent encodes every special character, making it safe for query parameter values.'
        },
        {
          question: 'Why are spaces sometimes encoded as + and sometimes as %20?',
          answer: 'In application/x-www-form-urlencoded query strings, spaces are historically encoded as "+". Under standard RFC 3986 percent-encoding, spaces are represented as "%20".'
        },
        {
          question: 'How does percent-encoding protect URL transmission?',
          answer: 'Percent-encoding replaces non-ASCII or reserved characters with a "%" followed by two hexadecimal digits, preventing corruption when URLs pass through servers and browsers.'
        }
      ]
    }
  },

  // 26. UUID Generator
  {
    id: 'uuid-generator',
    name: 'UUID & Unique ID Generator',
    slug: 'uuid-generator',
    category: 'developer',
    description: 'Generate cryptographically secure UUID v4 (RFC 4122), NanoIDs, and hex tokens in bulk batches with custom casing, hyphens, and wrapper formatting online.',
    shortDesc: 'Generate cryptographically secure UUID v4, NanoIDs & bulk tokens.',
    icon: 'Fingerprint',
    keywords: ['uuid generator', 'guid generator', 'uuid v4', 'nanoid', 'unique id', 'token generator', 'bulk uuid'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: UuidGenerator,
    relatedToolSlugs: ['password-generator', 'hash-generator', 'base64'],
    seo: {
      title: 'UUID Generator — Free Cryptographic UUID v4 & GUIDs',
      description: 'Generate cryptographically secure UUID v4 (RFC 4122), NanoIDs, and hex tokens in bulk with custom casing, hyphens, and wrapper formatting.',
      keywords: ['uuid generator', 'guid generator', 'uuid v4 generator online'],
      h1: 'UUID & Unique ID Generator',
      intro: 'Generate standard RFC 4122 compliant UUID v4 identifiers and compact tokens for databases and APIs.',
      howToUse: [
        'Select identifier type (UUID v4, NanoID, Hex).',
        'Choose count and formatting options (hyphens, uppercase, quote wrappers).',
        'Copy individual IDs or download the entire batch.'
      ],
      features: [
        'RFC 4122 Version 4 UUID generation using crypto.getRandomValues for true cryptographic entropy',
        'Bulk generator producing up to 100 unique identifiers simultaneously with one click',
        'Formatting controls: Uppercase/Lowercase, with/without hyphens, braces {}, and quotes',
        'Alternative identifier formats including URL-safe NanoIDs and raw hexadecimal tokens'
      ],
      faq: [
        {
          question: 'What is a UUID v4 and how is it generated?',
          answer: 'UUID v4 (Universally Unique Identifier) is a 128-bit identifier generated using random numbers. It has 122 bits of cryptographic randomness, providing practically zero collision probability.'
        },
        {
          question: 'Can two generated UUID v4 IDs ever collide?',
          answer: 'The chance of generating a duplicate UUID v4 is approximately 1 in 2.71 quintillion, making collisions virtually impossible in practice.'
        },
        {
          question: 'What are the formatting options available for generated UUIDs?',
          answer: 'You can generate UUIDs in standard hyphenated format (8-4-4-4-12), stripped of hyphens, in uppercase or lowercase, or wrapped in curly braces or quotes for database imports.'
        }
      ]
    }
  },

  // 27. Regex Tester
  {
    id: 'regex-tester',
    name: 'Regex Tester & Matcher',
    slug: 'regex-tester',
    category: 'developer',
    description: 'Test JavaScript regular expressions in real time with live match highlighting, capture group extraction, and string replacement.',
    shortDesc: 'Test regular expressions with live matches, capture groups & replace.',
    icon: 'Search',
    keywords: ['regex tester', 'regular expression', 'regex evaluator', 'regex match', 'regex replace', 'pattern test'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: RegexTester,
    relatedToolSlugs: ['json-formatter', 'case-converter', 'hash-generator'],
    seo: {
      title: 'Regex Tester — Test Regular Expressions Online',
      description: 'Test JavaScript regular expressions online in real time with live match highlighting, capture group extraction, syntax error flags, and string replacement.',
      keywords: ['regex tester', 'regular expression tester online', 'regex matcher'],
      h1: 'Regex Tester & Matcher',
      intro: 'Evaluate regex patterns against sample strings with instant syntax validation and capture group inspection.',
      howToUse: [
        'Enter your regex pattern and toggle desired flags.',
        'Paste test string to view matches and capture groups.',
        'Optionally test substitution replacements.'
      ],
      features: [
        'Real-time live match highlighting with support for global (g), case-insensitive (i), and multiline (m) flags',
        'Detailed capture group breakdown displaying indices and extracted sub-string values',
        'Interactive regex replacement testing mode with support for $1, $2 capture group backreferences',
        'Built-in quick cheat sheet with common patterns for emails, URLs, IP addresses, and dates'
      ],
      faq: [
        {
          question: 'Which regular expression engine does this tester use?',
          answer: 'This tool uses the native JavaScript RegExp engine built into your web browser, ensuring 100% compatibility with frontend and Node.js code.'
        },
        {
          question: 'How do capture groups work in regular expressions?',
          answer: 'Parentheses ( ) define capture groups in a regex. The tester extracts each matched group separately and lets you reference them as $1, $2 in replacement strings.'
        },
        {
          question: 'What do regex flags like g, i, m, and s do?',
          answer: 'The "g" flag matches all occurrences globally, "i" ignores letter casing, "m" treats start/end anchors (^ and $) across individual lines, and "s" allows dot (.) to match newlines.'
        }
      ]
    }
  },

  // 28. Hash Generator
  {
    id: 'hash-generator',
    name: 'Hash Generator & Checksum Tool',
    slug: 'hash-generator',
    category: 'developer',
    description: 'Generate cryptographic hash digests in real time: SHA-256, SHA-512, SHA-384, SHA-1, and MD5 with HMAC verification and checksum match validation online.',
    shortDesc: 'Compute SHA-256, SHA-512, SHA-384, SHA-1 & MD5 hashes.',
    icon: 'ShieldCheck',
    keywords: ['hash generator', 'sha256', 'sha512', 'md5', 'sha1', 'checksum', 'crypto hash', 'verify hash'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: HashGenerator,
    relatedToolSlugs: ['uuid-generator', 'password-generator', 'base64'],
    seo: {
      title: 'Hash Generator — SHA-256, SHA-512, SHA-1 & MD5 Online',
      description: 'Generate cryptographic hash digests in real time: SHA-256, SHA-512, SHA-384, SHA-1, and MD5 with HMAC verification and checksum match validator.',
      keywords: ['hash generator', 'sha256 generator', 'md5 generator', 'checksum verifier'],
      h1: 'Hash Generator & Checksum Tool',
      intro: 'Compute secure cryptographic message digests directly in your browser with checksum verification support.',
      howToUse: [
        'Type or paste text into the input area.',
        'View computed hashes across all major algorithms simultaneously.',
        'Copy any hash or paste an expected checksum to verify a match.'
      ],
      features: [
        'Supports industry-standard hashing algorithms: SHA-256, SHA-512, SHA-384, SHA-1, and MD5',
        'Real-time cryptographic computation using the browser Web Crypto API',
        'Checksum verification tool: compare computed hashes directly against an expected hash',
        'Uppercase and lowercase hexadecimal digest format outputs with one-click copy'
      ],
      faq: [
        {
          question: 'What is the difference between SHA-256 and MD5?',
          answer: 'SHA-256 is a modern, cryptographically secure hash function producing 256-bit digests. MD5 is an older 128-bit algorithm now used mainly for simple file integrity checks due to collision vulnerabilities.'
        },
        {
          question: 'Can a cryptographic hash be reversed or decrypted?',
          answer: 'No, cryptographic hashes are one-way mathematical functions designed so that the original input text cannot be mathematically derived from the resulting hash digest.'
        },
        {
          question: 'Is my input text uploaded to a server to compute the hash?',
          answer: 'No, all hashing calculations are performed locally inside your browser using the native Web Crypto API, keeping your secrets and passwords private.'
        }
      ]
    }
  },

  // 29. Data Storage Converter
  {
    id: 'data-storage-converter',
    name: 'Data Storage & Bandwidth Converter',
    slug: 'data-storage-converter',
    category: 'converters',
    description: 'Convert between Decimal (Bytes, KB, MB, GB, TB, PB) and Binary (KiB, MiB, GiB, TiB) with real-world download and capacity estimates.',
    shortDesc: 'Convert Bytes, KB, MB, GB, TB, PB, KiB, MiB & download times.',
    icon: 'HardDrive',
    keywords: ['data storage converter', 'bytes to gb', 'mb to gb', 'gb to tb', 'kib to kb', 'storage conversion', 'bandwidth'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: DataStorageConverter,
    relatedToolSlugs: ['unit-converter', 'temperature-converter', 'percentage-calculator'],
    seo: {
      title: 'Data Storage Converter — Bytes, KB, MB, GB, TB & Binary Units',
      description: 'Convert between Decimal (Bytes, KB, MB, GB, TB, PB) and Binary (KiB, MiB, GiB, TiB) storage units with real-world download time and capacity estimates.',
      keywords: ['data storage converter', 'bytes to mb', 'gb to tb converter', 'binary storage converter'],
      h1: 'Data Storage & Bandwidth Converter',
      intro: 'Convert between decimal storage units (KB, MB, GB) and binary units (KiB, MiB, GiB) with real-world file capacity comparisons.',
      howToUse: [
        'Enter data quantity and select starting unit.',
        'View conversion results across all units simultaneously.',
        'Check estimated photos, songs, and download duration.'
      ],
      features: [
        'Full support for Decimal SI units (1000-based: KB, MB, GB, TB) and Binary IEC units (1024-based: KiB, MiB, GiB, TiB)',
        'Simultaneous multi-unit matrix display converting your input across 12 storage units instantly',
        'Download and transfer duration calculator across common internet connection bandwidths',
        'High-precision float calculation with scientific notation for enterprise storage arrays'
      ],
      faq: [
        {
          question: 'What is the difference between MB (Megabytes) and MiB (Mebibytes)?',
          answer: '1 Megabyte (MB) equals 1,000,000 bytes (decimal base 10), while 1 Mebibyte (MiB) equals 1,048,576 bytes (binary base 2), which is why formatted disk capacities appear smaller in operating systems.'
        },
        {
          question: 'Why does my hard drive show less capacity in Windows than advertised on the box?',
          answer: 'Hard drive manufacturers market capacity using decimal gigabytes (1 GB = 1,000,000,000 bytes), while Windows reports capacity using binary gibibytes (1 GiB = 1,073,741,824 bytes).'
        },
        {
          question: 'How do I calculate how long a file download will take?',
          answer: 'Divide the file size in bits (Bytes × 8) by your internet download speed in bits per second (e.g., Mbps) to estimate total transfer time.'
        }
      ]
    }
  },

  // 30. Temperature Converter
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    slug: 'temperature-converter',
    category: 'converters',
    description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), and Réaumur with interactive thermal gauge.',
    shortDesc: 'Convert Celsius, Fahrenheit, Kelvin & Rankine with thermal meter.',
    icon: 'Thermometer',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'thermal scale'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: TemperatureConverter,
    relatedToolSlugs: ['unit-converter', 'data-storage-converter', 'average-calculator'],
    seo: {
      title: 'Temperature Converter — Celsius, Fahrenheit, Kelvin & Rankine',
      description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), and Réaumur with an interactive thermal gauge and physical reference points.',
      keywords: ['temperature converter', 'celsius to fahrenheit', 'kelvin to celsius'],
      h1: 'Temperature Converter',
      intro: 'Convert temperature values across Celsius, Fahrenheit, Kelvin, and Rankine with conversion formulas and thermal reference points.',
      howToUse: [
        'Enter temperature value and select current scale.',
        'Review converted temperatures across all scales.',
        'Click physical thermal benchmarks to test notable temperatures.'
      ],
      features: [
        'Two-way real-time conversion across Celsius, Fahrenheit, Kelvin, Rankine, and Réaumur',
        'Visual thermal gauge displaying the current temperature level relative to everyday physical states',
        'Reference benchmarks table including Absolute Zero, Water Freezing, Human Body Temp, and Water Boiling',
        'Adjustable decimal precision rounding with exact algebraic step breakdown'
      ],
      faq: [
        {
          question: 'What is the formula to convert Celsius to Fahrenheit?',
          answer: 'To convert Celsius to Fahrenheit, multiply by 9/5 (or 1.8) and add 32: °F = (°C × 9/5) + 32.'
        },
        {
          question: 'What is Absolute Zero in Celsius and Fahrenheit?',
          answer: 'Absolute Zero (0 Kelvin) is the theoretical temperature where all molecular motion ceases, corresponding to −273.15 °C or −459.67 °F.'
        },
        {
          question: 'At what temperature are Celsius and Fahrenheit equal?',
          answer: 'Celsius and Fahrenheit are exactly equal at −40 degrees (−40 °C = −40 °F).'
        }
      ]
    }
  },

  // 31. PDF Merger
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    category: 'pdf',
    description: 'Merge multiple PDF files into one document online for free. Drag and drop to reorder pages, combine files instantly, with zero server uploads for 100% privacy.',
    shortDesc: 'Merge multiple PDF files in custom order.',
    icon: 'Layers',
    keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'join pdf', 'pdf binder'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: PdfMerger,
    relatedToolSlugs: ['pdf-splitter', 'pdf-compressor', 'base64'],
    seo: {
      title: 'PDF Merger — Combine PDF Files Online for Free',
      description: 'Merge multiple PDF files into one document online for free. Drag and drop to reorder pages, combine files instantly, with zero server uploads for 100% privacy.',
      keywords: ['pdf merger', 'merge pdf', 'combine pdf files', 'join pdf online'],
      h1: 'PDF Merger',
      intro: 'Combine multiple PDF documents into a single organized file in seconds with drag-and-drop reordering, instant browser-side compilation, and zero server uploads.',
      howToUse: [
        'Upload or drag and drop two or more PDF files into the merger dropzone.',
        'Rearrange the documents into your preferred page sequence using the up/down controls.',
        'Click "Merge PDFs" and download your newly combined document.'
      ],
      features: [
        'Combine unlimited PDF documents into a single organized PDF file',
        'Interactive drag-and-drop file reordering to arrange your pages in exact sequence',
        '100% client-side WebAssembly processing keeping your documents completely private',
        'Preserves original vector quality, embedded fonts, and page bookmarks'
      ],
      faq: [
        {
          question: 'Are my uploaded PDF files saved on your servers?',
          answer: 'No. All PDF merging occurs directly inside your web browser memory using client-side JavaScript. Your files are never uploaded to or stored on any server.'
        },
        {
          question: 'Is there a limit on how many PDF files I can merge?',
          answer: 'There are no artificial software limits. You can combine multiple PDF documents constrained only by your device\'s local available memory.'
        },
        {
          question: 'Will the merged PDF file lose formatting or resolution?',
          answer: 'No, the merge engine preserves original vector text, embedded image quality, color profiles, and document structure without degradation.'
        }
      ]
    }
  },

  // 32. PDF Splitter
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    category: 'pdf',
    description: 'Split PDF files and extract specific pages online for free. Extract custom page ranges, split into single pages, or delete unwanted sheets with zero uploads.',
    shortDesc: 'Extract pages or split PDF by custom page ranges.',
    icon: 'Scissors',
    keywords: ['pdf splitter', 'extract pdf pages', 'split pdf', 'cut pdf', 'separate pdf pages'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: PdfSplitter,
    relatedToolSlugs: ['pdf-merger', 'pdf-compressor', 'base64'],
    seo: {
      title: 'PDF Splitter — Extract Pages from PDF Online',
      description: 'Split PDF files and extract specific pages online for free. Extract custom page ranges, split into single pages, or delete unwanted sheets with zero uploads.',
      keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'separate pdf'],
      h1: 'PDF Splitter',
      intro: 'Extract specific pages or custom ranges (such as 1-3, 5, 8-10) from any PDF file directly in your browser without uploading your files.',
      howToUse: [
        'Upload or drag and drop a PDF file into the splitter.',
        'Choose your page selection mode: Page Range Syntax (e.g. "1-3, 5") or Visual Page Grid.',
        'Click "Extract Pages" to generate and download your new PDF.'
      ],
      features: [
        'Extract custom page ranges (e.g. 1-3, 5, 8-12) or extract all pages as individual PDFs',
        'Visual page grid preview allowing single-click selection and deletion of unwanted sheets',
        'Client-side execution ensuring private financial and legal documents never leave your browser',
        'Fast processing with instant single-click document download'
      ],
      faq: [
        {
          question: 'How do I specify custom page ranges to extract from a PDF?',
          answer: 'Enter page numbers and ranges separated by commas, such as "1-5, 8, 11-14", to extract those specific pages into a new combined PDF.'
        },
        {
          question: 'Can I split a multi-page PDF into separate single-page files?',
          answer: 'Yes, select the "Extract all pages" mode to break down your document into individual single-page PDF files.'
        },
        {
          question: 'Is splitting confidential or password-free legal documents secure?',
          answer: 'Yes, because the extraction runs locally in your browser memory, your files are never transmitted across the internet.'
        }
      ]
    }
  },

  // 33. PDF Compressor
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    category: 'pdf',
    description: 'Compress and reduce PDF file sizes online for free. Optimize document streams and remove unreferenced objects without losing readability or text clarity.',
    shortDesc: 'Optimize and reduce PDF file size in browser.',
    icon: 'Minimize2',
    keywords: ['pdf compressor', 'reduce pdf size', 'shrink pdf', 'compress document', 'optimize pdf'],
    popular: true,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: PdfCompressor,
    relatedToolSlugs: ['pdf-merger', 'pdf-splitter', 'base64'],
    seo: {
      title: 'PDF Compressor — Optimize & Reduce PDF File Size Online',
      description: 'Compress and reduce PDF file sizes online for free. Optimize document streams and remove unreferenced objects without losing readability or text clarity.',
      keywords: ['pdf compressor', 'compress pdf', 'reduce pdf file size', 'optimize pdf online'],
      h1: 'PDF Compressor',
      intro: 'Optimize and compress PDF documents directly inside your browser. Re-encodes object streams, strips unused resources, and provides 100% genuine byte comparisons.',
      howToUse: [
        'Upload or drag and drop a PDF file into the compressor.',
        'Select your desired compression strength: Low (Highest Quality), Medium (Balanced), or High (Max Reduction).',
        'Click "Compress PDF", review the genuine byte reduction stats, and download your optimized document.'
      ],
      features: [
        'Client-side PDF stream optimization and redundant object cleanup',
        'Real-time file size comparison displaying exact bytes saved and reduction percentage',
        'Maintains vector typography and document structural integrity',
        'Completely private with zero server uploads or external network requests'
      ],
      faq: [
        {
          question: 'How does in-browser PDF compression work?',
          answer: 'The tool parses the PDF object tree, optimizes uncompressed text and metadata streams, removes redundant object references, and rebuilds a streamlined document.'
        },
        {
          question: 'Will compressing my PDF reduce text readability?',
          answer: 'No, vector text and line art retain 100% of their crispness and clarity while metadata and uncompressed data structures are optimized.'
        },
        {
          question: 'Can I compress scanned PDF documents?',
          answer: 'Yes, scanned PDFs will be optimized, though documents containing heavy raster images are best paired with image compression tools for maximum reduction.'
        }
      ]
    }
  },

  // 34. Images to PDF
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    slug: 'images-to-pdf',
    category: 'pdf',
    description: 'Convert JPG, PNG, and WebP images into a single multi-page PDF document online for free. Reorder pages, adjust paper margins, and generate PDFs instantly with zero server uploads.',
    shortDesc: 'Convert JPG, PNG & WebP images into a multi-page PDF.',
    icon: 'FileImage',
    keywords: ['images to pdf', 'jpg to pdf', 'png to pdf', 'convert image to pdf', 'image to pdf converter', 'combine photos to pdf', 'picture to pdf'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: ImagesToPdf,
    relatedToolSlugs: ['pdf-merger', 'pdf-compressor', 'image-compressor', 'jpg-to-png'],
    seo: {
      title: 'Images to PDF Converter — Free Online JPG & PNG to PDF',
      description: 'Convert JPG, PNG, and WebP images into a single PDF document online for free. Reorder pages, choose page sizes, and export high-quality PDFs with zero server uploads.',
      keywords: ['images to pdf', 'jpg to pdf converter', 'png to pdf online', 'convert pictures to pdf', 'photo to pdf'],
      h1: 'Images to PDF Converter',
      intro: 'Convert and combine multiple JPG, PNG, and WebP images into a single clean PDF document in seconds. Reorder pages, customize paper sizes and margins, with 100% private in-browser generation.',
      howToUse: [
        'Upload or drag & drop one or multiple JPG, PNG, or WebP images into the tool.',
        'Adjust page sequence using the up/down arrows or add more pictures to the queue.',
        'Customize document options including paper format (A4, US Letter, or Fit to Image), margins, and quality.',
        'Click "Create PDF" and instantly download your combined PDF document.'
      ],
      features: [
        'Convert unlimited JPG, PNG, WebP, GIF, and BMP images into a single multi-page PDF',
        'Interactive page sequencing with instant preview thumbnails and reordering controls',
        'Flexible document layout supporting standard A4, US Letter, custom image-fit sizes, and adjustable margins',
        '100% client-side WebAssembly and canvas processing ensuring zero server uploads and total privacy'
      ],
      faq: [
        {
          question: 'Are my uploaded images sent to an external server or stored online?',
          answer: 'No. All image processing and PDF assembly occur strictly within your web browser using client-side JavaScript. Your photos never leave your device.'
        },
        {
          question: 'Can I combine different image formats (like JPG and PNG) in the same PDF?',
          answer: 'Yes. You can mix and match JPG, PNG, WebP, and other standard image formats into a single unified PDF file.'
        },
        {
          question: 'How do I ensure my images fit properly on standard A4 or Letter paper?',
          answer: 'The tool automatically calculates proportional scaling to preserve your image\'s exact aspect ratio without stretching or unwanted cropping, fitting neatly inside the printable page margins.'
        }
      ]
    }
  },

  // 35. Text to PDF
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    slug: 'text-to-pdf',
    category: 'pdf',
    description: 'Convert plain text and notes into a clean, formatted multi-page PDF document online for free. Custom fonts, margins, headers, and 100% private browser generation.',
    shortDesc: 'Convert plain text and notes into a formatted multi-page PDF.',
    icon: 'FileText',
    keywords: ['text to pdf', 'txt to pdf', 'convert text to pdf', 'plain text to pdf', 'text to pdf converter', 'online text to pdf', 'notes to pdf'],
    popular: true,
    featured: false,
    badge: 'Popular',
    status: 'ready',
    isImplemented: true,
    component: TextToPdf,
    relatedToolSlugs: ['images-to-pdf', 'pdf-merger', 'pdf-splitter', 'pdf-compressor'],
    seo: {
      title: 'Text to PDF Converter — Free Online Plain Text to PDF',
      description: 'Convert plain text and notes into a clean, formatted multi-page PDF document online for free. Custom fonts, margins, headers, and 100% private browser generation.',
      keywords: ['text to pdf', 'txt to pdf converter', 'convert text to pdf online', 'plain text to pdf', 'make pdf from text'],
      h1: 'Text to PDF Converter',
      intro: 'Convert plain text and notes into clean, professionally formatted PDF documents directly in your browser. Customize page sizes, margins, fonts, and headers with zero server uploads.',
      howToUse: [
        'Type or paste your text into the multiline editor area.',
        'Customize document parameters including page size (A4 / US Letter), orientation, margins, and font family.',
        'Optionally add a running header title, footer text, or enable automated page numbers.',
        'Click "Download PDF" to instantly generate and save your document.'
      ],
      features: [
        'Smart automatic text wrapping and dynamic multi-page pagination that never crops lines',
        'Comprehensive typography controls including standard PDF fonts, font size, line spacing, and text alignments',
        'Optional running headers, custom footers, and automatic page numbers (e.g. Page 1 of 5)',
        '100% client-side rendering in browser memory ensuring total data confidentiality and zero server uploads'
      ],
      faq: [
        {
          question: 'Is my text sent to a server or stored in the cloud during conversion?',
          answer: 'No. All text parsing, layout calculation, and PDF document generation take place entirely inside your web browser using client-side JavaScript. Your text never leaves your device.'
        },
        {
          question: 'How does the converter handle long text spanning multiple pages?',
          answer: 'The conversion engine automatically calculates printable page bounds and wraps text cleanly across page boundaries, dynamically creating additional pages as needed without clipping or text truncation.'
        },
        {
          question: 'Can I add document titles, running headers, or page numbering?',
          answer: 'Yes. You can specify a custom header title, add footer notes, and toggle automatic page numbering (such as "Page 1 of 3") directly from the formatting controls panel.'
        }
      ]
    }
  },

  // 36. Image Compressor
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'images',
    description: 'Compress JPG, PNG, and WebP images directly in your browser with real-time byte metrics, presets, and before/after comparisons.',
    shortDesc: 'Compress JPG, PNG, and WebP images with real byte metrics.',
    icon: 'Minimize2',
    keywords: ['image compressor', 'compress photo', 'reduce image size', 'optimize jpg', 'compress png', 'compress webp', 'photo optimizer'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: ImageCompressor,
    relatedToolSlugs: ['image-resizer', 'webp-converter', 'png-to-jpg'],
    seo: {
      title: 'Image Compressor — Free In-Browser Photo & Image Compression',
      description: 'Compress JPG, PNG, and WebP images online for free. Reduce photo file sizes with custom quality controls, format conversion, and before/after comparisons.',
      keywords: ['image compressor', 'compress image online', 'reduce photo size', 'jpeg optimizer', 'png compressor'],
      h1: 'Image Compressor',
      intro: 'Optimize and reduce image file sizes locally in your browser. Features lossless/lossy encoding, WebP conversion, custom quality controls, and genuine before/after byte statistics.',
      howToUse: [
        'Upload or drag & drop a JPG, PNG, or WebP image.',
        'Choose a compression preset (High Quality, Balanced, Max Compression) or adjust quality manually.',
        'Optionally select an output format (WebP, JPEG, PNG) to maximize byte savings.',
        'Click "Compress Image", review side-by-side previews and genuine calculated metrics, and download your optimized image.'
      ],
      features: [
        'Adjustable compression quality slider with instant visual before-and-after comparison',
        'Batch image compression supporting multiple photos simultaneously',
        'Option to convert images to modern WebP format during compression for extra byte savings',
        'Real-time metrics for original size, compressed size, and percentage saved'
      ],
      faq: [
        {
          question: 'Are my images uploaded to any remote server?',
          answer: 'No. All image decoding, canvas manipulation, and compression encoding execute 100% locally in your browser memory.'
    },
        {
          question: 'Why did my PNG not compress as much as a JPEG?',
          answer: 'PNG is an inherently lossless format. Toolsbar provides technically honest canvas processing: converting PNG to WebP or JPEG achieves significant compression without sacrificing visual quality.'
        },
        {
          question: 'What is the maximum supported image size?',
          answer: 'You can safely process images up to 50MB and 16,384px dimensions in any modern browser without memory crashes.'
        }
      ]
    }
  },

  // 35. Image Resizer
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'images',
    description: 'Resize photos and images online free. Scale dimensions by exact pixels or percentage, preserve aspect ratios, and choose social media resolution presets.',
    shortDesc: 'Resize photos by dimensions, scale percentage, or social presets.',
    icon: 'Maximize2',
    keywords: ['image resizer', 'resize photo', 'scale image', 'change picture dimensions', 'photo resize', 'social media image size'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: ImageResizer,
    relatedToolSlugs: ['image-compressor', 'webp-converter', 'jpg-to-png'],
    seo: {
      title: 'Image Resizer — Resize Photos Online Free with Aspect Lock',
      description: 'Resize photos and images online free. Scale dimensions by exact pixels or percentage, preserve aspect ratios, and choose social media resolution presets.',
      keywords: ['image resizer', 'resize image online', 'photo dimension changer', 'aspect ratio resizer'],
      h1: 'Image Resizer',
      intro: 'Scale and resize images to exact dimensions for social media, avatars, banners, and websites with high-quality browser interpolation and aspect ratio locking.',
      howToUse: [
        'Upload your JPG, PNG, or WebP image.',
        'Enter target width and height in pixels, or click a quick scaling preset (25%, 50%, 75%, 200%).',
        'Keep aspect ratio locked to avoid distortion, or select a standard preset (1080p, Instagram Square, OpenGraph banner).',
        'Click "Resize Image" and download your newly scaled image.'
      ],
      features: [
        'Resize images by exact width/height in pixels or by percentage scaling (e.g. 50%, 75%)',
        'Smart aspect ratio lock preventing image distortion and accidental stretching',
        'Pre-configured resolution presets for social media (Instagram, YouTube, Twitter/X, Facebook)',
        'High-quality bicubic smoothing canvas resampling for sharp, clear output'
      ],
      faq: [
        {
          question: 'How do I resize an image without distorting its proportions?',
          answer: 'Keep the "Lock Aspect Ratio" toggle enabled. When you modify either the width or height, the other dimension calculates automatically to preserve proportions.'
        },
        {
          question: 'Can I resize photos to specific social media profile and cover sizes?',
          answer: 'Yes, select from our built-in presets for YouTube thumbnails, Instagram posts, Twitter banners, and Facebook covers.'
        },
        {
          question: 'Will enlarging a low-resolution photo reduce its sharpness?',
          answer: 'Enlarging a raster image beyond its native resolution will naturally soften details. For best results, resize high-resolution originals down to target dimensions.'
        }
      ]
    }
  },

  // 36. JPG to PNG
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    slug: 'jpg-to-png',
    category: 'images',
    description: 'Convert JPG and JPEG photos to lossless PNG format online for free. Fast, client-side conversion preserving 100% of original image dimensions and color depth.',
    shortDesc: 'Convert JPG photos to lossless PNG format.',
    icon: 'Image',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'image format converter', 'lossless png'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: JpgToPng,
    relatedToolSlugs: ['png-to-jpg', 'webp-converter', 'image-compressor'],
    seo: {
      title: 'JPG to PNG Converter — Fast & Free Browser Image Conversion',
      description: 'Convert JPG and JPEG photos to lossless PNG format online for free. Fast, client-side conversion preserving 100% of original image dimensions and color depth.',
      keywords: ['jpg to png', 'jpeg to png converter', 'convert jpeg to png online', 'lossless image conversion'],
      h1: 'JPG to PNG Converter',
      intro: 'Convert JPEG and JPG photographs into lossless PNG images with exact pixel fidelity and zero generational degradation.',
      howToUse: [
        'Upload or drag & drop a JPG/JPEG image.',
        'Verify resolution and file properties in the preview card.',
        'Click "Convert to PNG" to decode and re-encode to PNG format.',
        'Download your converted lossless PNG file.'
      ],
      features: [
        'Instant conversion from JPEG/JPG to lossless PNG raster format',
        '100% preservation of original image dimensions, pixel density, and color profiles',
        'Batch conversion support for converting multiple photos at once',
        'Zero server upload processing for complete privacy and high-speed execution'
      ],
      faq: [
        {
          question: 'Why should I convert a JPG to PNG format?',
          answer: 'PNG uses lossless compression, making it the preferred format for graphic designs, screenshots, logos, and images that will be edited repeatedly without generational quality loss.'
        },
        {
          question: 'Does converting JPG to PNG make the image transparent?',
          answer: 'Converting a JPG to PNG enables PNG transparency support, but existing solid background pixels in the JPG must be made transparent in an image editor.'
        },
        {
          question: 'Is there any quality loss when converting JPG to PNG?',
          answer: 'No, PNG is a lossless format, so every pixel from the original JPEG image is preserved exactly without any secondary compression artifacts.'
        }
      ]
    }
  },

  // 37. PNG to JPG
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    slug: 'png-to-jpg',
    category: 'images',
    description: 'Convert PNG images to compact JPG format online for free. Features automatic transparency detection, custom background color fill, and quality controls.',
    shortDesc: 'Convert PNG images to JPG with custom background fills.',
    icon: 'Image',
    keywords: ['png to jpg', 'png to jpeg', 'convert png to jpg', 'remove transparency', 'png converter'],
    popular: false,
    featured: false,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: PngToJpg,
    relatedToolSlugs: ['jpg-to-png', 'image-compressor', 'webp-converter'],
    seo: {
      title: 'PNG to JPG Converter — Convert PNG to JPEG with Background Color Fill',
      description: 'Convert PNG images to compact JPG format online for free. Features automatic transparency detection, custom background color fill, and quality controls.',
      keywords: ['png to jpg', 'png to jpeg converter', 'convert png to jpg online', 'png background color fill'],
      h1: 'PNG to JPG Converter',
      intro: 'Transform heavy PNG images into lightweight JPG files. Features automated alpha transparency inspection, custom background color selection, and JPEG quality tuning.',
      howToUse: [
        'Upload or drag & drop a PNG file.',
        'If transparency is detected, pick a background color (White, Black, Slate, Cream, or Custom HEX) to replace transparent areas cleanly.',
        'Adjust the JPEG encoding quality slider if desired.',
        'Click "Convert to JPG" and download your newly created JPEG image.'
      ],
      features: [
        'Convert PNG images to lightweight JPG/JPEG files with adjustable compression quality',
        'Smart transparency handling: replace transparent PNG backgrounds with white, black, or custom colors',
        'Real-time file size reduction metrics and side-by-side preview comparisons',
        'Completely client-side processing keeping your graphics and screenshots private'
      ],
      faq: [
        {
          question: 'What happens to transparent areas in a PNG when converted to JPG?',
          answer: 'Because the JPEG format does not support alpha transparency, transparent areas are automatically filled with your chosen background color (default is pure white).'
        },
        {
          question: 'How does converting PNG to JPG reduce file size?',
          answer: 'JPEG uses lossy DCT compression optimized for photographs, often reducing PNG screenshot and photo file sizes by up to 70%.'
        },
        {
          question: 'Can I customize the background color for converted graphics?',
          answer: 'Yes, you can choose white, black, or enter any custom hex color code to seamlessly blend your transparent PNG onto your desired backdrop.'
        }
      ]
    }
  },

  // 38. WebP Converter
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    slug: 'webp-converter',
    category: 'images',
    description: 'Convert images to and from modern WebP format online. Transform JPG and PNG to WebP or WebP to JPG/PNG with transparency support and quality sliders.',
    shortDesc: 'Convert between JPG, PNG, and WebP formats.',
    icon: 'Sparkles',
    keywords: ['webp converter', 'jpg to webp', 'png to webp', 'webp to jpg', 'webp to png', 'convert webp'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: WebpConverter,
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png'],
    seo: {
      title: 'WebP Converter — Convert JPG, PNG, and WebP In Browser',
      description: 'Convert images to and from modern WebP format online. Transform JPG and PNG to WebP or WebP to JPG/PNG with transparency support and quality sliders.',
      keywords: ['webp converter', 'jpg to webp', 'png to webp', 'webp to png', 'webp to jpg converter'],
      h1: 'WebP Converter',
      intro: 'Convert seamlessly between standard photographic formats (JPG, PNG) and next-generation WebP. Reduces web page weight while preserving sharp image details.',
      howToUse: [
        'Upload a JPG, PNG, or WebP image.',
        'Select your desired target output format (WebP, JPEG, or PNG).',
        'Fine-tune the encoding quality slider where applicable.',
        'Click "Convert Image" and download the converted output.'
      ],
      features: [
        'Two-way conversion: convert JPG/PNG into WebP or convert WebP images back into PNG/JPG',
        'Full alpha transparency preservation when converting PNG to WebP',
        'Configurable quality compression slider for fine-tuned balancing of byte size and fidelity',
        'In-browser canvas processing ensuring instant conversion with zero server latency'
      ],
      faq: [
        {
          question: 'Why is WebP better than JPEG and PNG for websites?',
          answer: 'WebP provides 25–35% smaller file sizes than JPEG at equivalent visual quality and supports both lossless compression and alpha transparency, improving website loading speeds.'
        },
        {
          question: 'Do all modern web browsers support WebP images?',
          answer: 'Yes, all modern web browsers (Chrome, Safari, Firefox, Edge, and mobile browsers) offer full native support for WebP images.'
        },
        {
          question: 'Can I convert WebP images back into standard PNG or JPG files?',
          answer: 'Yes, simply upload your WebP image, select PNG or JPG as the target format, and download your converted file instantly.'
        }
      ]
    }
  },

  // 39. HTML Formatter & Minifier
  {
    id: 'html-formatter',
    name: 'HTML Formatter & Minifier',
    slug: 'html-formatter',
    category: 'developer',
    description: 'Format, beautify, and minify HTML markup locally in your browser with indentation controls and whitespace protection.',
    shortDesc: 'Format, beautify, and minify HTML code in your browser.',
    icon: 'FileCode',
    keywords: ['html formatter', 'html beautifier', 'html minifier', 'format html', 'minify html', 'clean html', 'html pretty print'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: HtmlFormatter,
    relatedToolSlugs: ['css-formatter', 'javascript-formatter', 'json-formatter'],
    seo: {
      title: 'HTML Formatter & Minifier — Clean & Beautify HTML Online Free',
      description: 'Format, beautify, and minify HTML code online for free. Clean messy markup, configure custom indentations, and preserve pre/code blocks with zero server logs.',
      keywords: ['html formatter', 'html beautifier', 'html minifier online', 'format html code', 'prettify html'],
      h1: 'HTML Formatter & Minifier',
      intro: 'Clean, format, and optimize your HTML markup with configurable indentation (2 spaces, 4 spaces, tabs). Minify code safely without corrupting pre, code, script, or textarea blocks.',
      howToUse: [
        'Paste your HTML source code into the editor or load the sample template.',
        'Choose indentation preferences (2 spaces, 4 spaces, or tabs).',
        'Click "Beautify HTML" to reformat and indent, or "Minify HTML" to remove unnecessary bytes.',
        'Copy your formatted code or download it directly as an HTML file.'
      ],
      features: [
        'Beautify messy HTML markup with customizable 2-space, 4-space, or tab indentation',
        'HTML minification mode stripping unnecessary whitespace and comments to reduce page weight',
        'Smart tag preservation protecting <pre>, <textarea>, and <code> blocks from altered spacing',
        'One-click clipboard copy and raw character reduction statistics'
      ],
      faq: [
        {
          question: 'Does formatting guarantee valid HTML?',
          answer: 'No. The formatter indents and restructures your markup for legibility, but does not validate W3C semantic markup rules.'
    },
        {
          question: 'Are spaces inside <pre> and <textarea> tags preserved during minification?',
          answer: 'Yes. Toolsbar uses sensitive token preservation to guarantee that whitespace inside <pre>, <textarea>, <script>, and <style> elements is never collapsed or stripped.'
        },
        {
          question: 'Is my HTML code sent to an external server?',
          answer: 'No. All parsing and formatting execute 100% locally in your browser memory.'
        }
      ]
    }
  },

  // 40. CSS Formatter & Minifier
  {
    id: 'css-formatter',
    name: 'CSS Formatter & Minifier',
    slug: 'css-formatter',
    category: 'developer',
    description: 'Beautify, indent, and minify CSS code online for free. Full support for modern CSS3, media queries, CSS variables, keyframe animations, and calc() syntax.',
    shortDesc: 'Format, beautify, and minify CSS stylesheets.',
    icon: 'Code2',
    keywords: ['css formatter', 'css beautifier', 'css minifier', 'format css', 'minify css', 'clean css', 'css pretty print', 'css optimizer'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: CssFormatter,
    relatedToolSlugs: ['html-formatter', 'javascript-formatter', 'json-formatter'],
    seo: {
      title: 'CSS Formatter & Minifier — Beautify & Optimize CSS Online Free',
      description: 'Beautify, indent, and minify CSS code online for free. Full support for modern CSS3, media queries, CSS variables, keyframe animations, and calc() syntax.',
      keywords: ['css formatter', 'css beautifier', 'css minifier online', 'format css stylesheet', 'clean css'],
      h1: 'CSS Formatter & Minifier',
      intro: 'Transform messy stylesheets into beautifully organized, readable CSS. Switch seamlessly to minification mode to compress stylesheets for high-performance production delivery.',
      howToUse: [
        'Paste your CSS stylesheet into the input editor.',
        'Select your preferred indentation (2 spaces, 4 spaces, tabs) and line break preferences.',
        'Click "Beautify CSS" to organize selectors and rules, or "Minify CSS" to strip non-essential whitespace.',
        'Review byte metrics, copy the result, or download your optimized .css file.'
      ],
      features: [
        'Beautify minified CSS with customizable indentation, selector spacing, and property alignment',
        'High-efficiency CSS minifier removing comments, whitespace, and redundant semicolons',
        'Full support for modern CSS3, @media queries, @keyframes, CSS custom properties, and grid syntax',
        'Zero server dependencies with instant browser-based execution'
      ],
      faq: [
        {
          question: 'What is the benefit of formatting vs minifying CSS stylesheets?',
          answer: 'Formatted CSS is human-readable and easy to debug during development, while minified CSS removes all whitespace to reduce file size and accelerate page load times in production.'
        },
        {
          question: 'Does the formatter support nested CSS and modern @media queries?',
          answer: 'Yes, the parser cleanly indents media query blocks, keyframes, pseudo-classes, and CSS variable declarations.'
        },
        {
          question: 'Will minifying CSS alter property values or calculation formulas?',
          answer: 'No, minification safely strips comments and formatting whitespace without modifying property names, calc() values, or unit declarations.'
        }
      ]
    }
  },

  // 41. JavaScript Formatter & Minifier
  {
    id: 'javascript-formatter',
    name: 'JavaScript Formatter & Minifier',
    slug: 'javascript-formatter',
    category: 'developer',
    description: 'Format, beautify, and safely minify modern JavaScript online. Clean messy JS code with custom indentation, AST syntax safety, and zero server execution.',
    shortDesc: 'Format, beautify, and safely minify modern JavaScript code.',
    icon: 'Sparkles',
    keywords: ['javascript formatter', 'js beautifier', 'js minifier', 'format javascript', 'minify js', 'javascript optimizer', 'js pretty print'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: JavascriptFormatter,
    relatedToolSlugs: ['json-formatter', 'html-formatter', 'css-formatter'],
    seo: {
      title: 'JavaScript Formatter & Minifier — Clean & Minify JS Online',
      description: 'Format, beautify, and safely minify modern JavaScript online. Clean messy JS code with custom indentation, AST syntax safety, and zero server execution.',
      keywords: ['javascript formatter', 'js beautifier', 'js minifier online', 'minify javascript', 'format js code'],
      h1: 'JavaScript Formatter & Minifier',
      intro: 'Format messy JavaScript code with clean indentation, or minify source code with industrial AST-level safety. Completely safe and runs 100% client-side with zero script execution.',
      howToUse: [
        'Paste your JavaScript source code into the editor.',
        'Choose your desired indent size (2 spaces, 4 spaces, or tabs).',
        'Click "Beautify JS" to re-indent, or "Minify JS" to produce safe, compressed production code.',
        'Inspect the character savings and download your script directly.'
      ],
      features: [
        'Beautify obfuscated or compressed JavaScript into clean, readable, standardized code',
        'Safe client-side JS minifier stripping whitespace and comments without code execution risks',
        'Full syntax support for ES6+, async/await, arrow functions, template literals, and optional chaining',
        'Client-side AST parsing ensuring code confidentiality and zero remote execution'
      ],
      faq: [
        {
          question: 'Is it safe to paste proprietary JavaScript code into this formatter?',
          answer: 'Yes, because the tool executes entirely inside your browser sandbox and never transmits your source code across the internet.'
        },
        {
          question: 'Does this tool execute or run the formatted JavaScript?',
          answer: 'No, the formatter parses and restructures code syntactically without executing any JavaScript statements or scripts.'
        },
        {
          question: 'Which ECMAScript versions and modern syntax are supported?',
          answer: 'The formatter supports modern ES6 through ES2024 features including arrow functions, class syntax, modules, destructuring, and optional chaining.'
        }
      ]
    }
  },

  // 42. JWT Decoder
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    category: 'developer',
    description: 'Decode and inspect JSON Web Tokens (JWT) locally in your browser. View header, payload claims, expiration timers, and signature status with zero logging.',
    shortDesc: 'Decode and inspect JSON Web Tokens (JWT) in your browser.',
    icon: 'KeyRound',
    keywords: ['jwt decoder', 'jwt inspector', 'decode jwt', 'jwt token viewer', 'json web token', 'jwt claims', 'jwt expiration'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: JwtDecoder,
    relatedToolSlugs: ['base64', 'json-formatter', 'uuid-generator'],
    seo: {
      title: 'JWT Decoder — Free In-Browser JSON Web Token Inspector',
      description: 'Decode and inspect JSON Web Tokens (JWT) locally in your browser. View header, payload claims, expiration timers, and signature status with zero logging.',
      keywords: ['jwt decoder', 'decode jwt token', 'jwt inspector online', 'jwt payload viewer', 'jwt claims parser'],
      h1: 'JWT Decoder',
      intro: 'Inspect and decode JSON Web Tokens directly in your browser. View header parameters, payload claims, timestamps, and expiration status with guaranteed client-side privacy.',
      howToUse: [
        'Paste your encoded JSON Web Token (JWT) into the input box.',
        'Review the automatically extracted Header, Signature, and Claims table.',
        'Check the expiration card to see whether the token is currently valid or expired.',
        'Click the copy icons to copy JSON payloads or individual claim values.'
      ],
      features: [
        'Decode header and payload claims instantly into formatted, color-coded JSON objects',
        'Live expiration status countdown tracking exp, nbf, and iat Unix timestamp claims',
        'Automatic detection of signing algorithms (HS256, RS256, ES256, EdDSA)',
        '100% private client-side decoding ensuring sensitive auth tokens are never transmitted'
      ],
      faq: [
        {
          question: 'Is it safe to decode auth tokens containing sensitive user claims?',
          answer: 'Yes. Unlike cloud-based decoders, Toolsbar decodes JWTs entirely within your browser memory using Base64URL decoding without making any backend API requests.'
        },
        {
          question: 'Can this tool verify the cryptographic signature of a JWT?',
          answer: 'The tool displays the signature algorithm and validates token structure. Cryptographic signature verification requires the corresponding public key or secret.'
        },
        {
          question: 'What do standard JWT claims like exp, iat, and sub mean?',
          answer: 'Standard claims defined in RFC 7519 include "exp" (expiration time), "iat" (issued at time), "sub" (subject/user ID), and "iss" (token issuer).'
        }
      ]
    }
  },

  // 43. Unix Timestamp Converter
  {
    id: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    slug: 'unix-timestamp-converter',
    category: 'datetime',
    description: 'Convert Unix epoch timestamps to UTC, local dates, ISO 8601, and relative times, or convert human dates to epoch seconds & milliseconds.',
    shortDesc: 'Convert Unix epoch timestamps ↔ human-readable dates.',
    icon: 'Clock',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'date to timestamp', 'unix time', 'epoch time', 'seconds to date'],
    popular: true,
    featured: true,
    badge: 'New',
    status: 'ready',
    isImplemented: true,
    component: UnixTimestampConverter,
    relatedToolSlugs: ['age-calculator', 'uuid-generator', 'regex-tester'],
    seo: {
      title: 'Unix Timestamp Converter — Epoch Time to Human Date Online',
      description: 'Convert Unix epoch timestamps to UTC, local dates, ISO 8601, and relative times, or convert human dates into epoch seconds and milliseconds in real time.',
      keywords: ['unix timestamp converter', 'epoch to date', 'date to epoch', 'unix time converter', 'epoch converter online'],
      h1: 'Unix Timestamp Converter',
      intro: 'Convert effortlessly between Unix epoch timestamps and human-readable dates in UTC, ISO 8601, and your local timezone. Features real-time live epoch clock, seconds/milliseconds auto-detection, and two-way conversion.',
      howToUse: [
        'To convert a timestamp: enter an epoch number (e.g. 1771800000) and choose seconds, milliseconds, or auto-detect.',
        'To convert a date: switch to the "Date & Time → Timestamp" tab, select a date/time, and choose UTC or Local timezone.',
        'View the converted UTC time, local time, ISO 8601 string, relative time, and day-of-year statistics.',
        'Click the copy icons to copy any format with a single click.'
      ],
      features: [
        'Two-way conversion: epoch timestamp to human date and human date picker to epoch timestamps',
        'Live ticking Unix epoch clock displaying current time in seconds and milliseconds',
        'Comprehensive time zone outputs: UTC, ISO 8601, RFC 2822, Local Time, and relative time elapsed',
        'Automatic detection and handling of both 10-digit second and 13-digit millisecond epoch timestamps'
      ],
      faq: [
        {
          question: 'What is a Unix timestamp?',
          answer: 'A Unix timestamp (or epoch time) is the number of seconds that have elapsed since January 1, 1970 at 00:00:00 UTC (the Unix Epoch), excluding leap seconds.'
    },
        {
          question: 'How do I tell if a timestamp is in seconds or milliseconds?',
          answer: 'Standard Unix timestamps in seconds are typically 10 digits (e.g. 1771800000), while millisecond timestamps are 13 digits (e.g. 1771800000000). Toolsbar includes smart auto-detection with manual override.'
        },
        {
          question: 'Are negative timestamps before 1970 supported?',
          answer: 'Yes. Negative timestamps accurately represent dates prior to January 1, 1970 UTC.'
        }
      ]
    }
  },

  // Roadmap Items
  {
    id: 'color-palette-picker',
    name: 'Color Palette & Contrast',
    slug: 'color-palette-picker',
    category: 'colors',
    description: 'Extract harmonious palettes, convert HEX/RGB/HSL, and check WCAG contrast ratios.',
    shortDesc: 'Color palette generator, HEX/RGB converter & contrast checker.',
    icon: 'Palette',
    keywords: ['color picker', 'hex to rgb', 'wcag contrast', 'color palette', 'hsl converter'],
    popular: false,
    featured: false,
    badge: 'Coming Soon',
    status: 'coming-soon',
    isImplemented: false,
    relatedToolSlugs: ['base64', 'json-formatter', 'qr-generator'],
    seo: {
      title: 'Color Palette & Contrast Checker — Design Utilities',
      description: 'Explore, generate, and extract harmonious color palettes and HEX/RGB/HSL codes online. Features contrast ratio checking and CSS/Tailwind export presets.',
      keywords: ['color picker', 'contrast checker', 'palette generator'],
      h1: 'Color Palette & Contrast Checker',
      intro: 'Explore color harmonies, convert between HEX, RGB, HSL, and ensure accessible contrast.',
      howToUse: ['Select base color.', 'Browse harmonious palettes.', 'Check contrast ratios.'],
      features: [
        'Interactive color palette generator with monochromatic, complementary, and triadic harmony rules',
        'Live WCAG AA/AAA color contrast ratio accessibility checker',
        'Export color schemes directly to CSS variables, Tailwind configuration, and JSON tokens',
        'High-precision color space conversions: HEX, RGB, HSL, HSV, and CMYK'
      ],
      faq: [{ question: 'What is WCAG AA standard?', answer: 'WCAG AA requires at least 4.5:1 contrast for normal body text.' }]
    }
  }
];

export const getToolBySlug = (slug: string): Tool | undefined => {
  return TOOLS.find(t => t.slug === slug || t.id === slug);
};

export const getToolsByCategory = (category: string): Tool[] => {
  return TOOLS.filter(t => t.category === category);
};

export const getPopularTools = (): Tool[] => {
  // Ordered popular tools priority:
  // Position 1: Percentage Calculator
  // Position 2: Age Calculator
  // Position 3: Images to PDF
  // Position 4: Text to PDF
  // Position 5: Word Counter
  // Position 6: QR Code Generator
  // Position 7: PDF Compressor
  // Position 8: Password Generator
  const POPULAR_ORDER_SLUGS = [
    'percentage-calculator',
    'age-calculator',
    'images-to-pdf',
    'text-to-pdf',
    'word-counter',
    'qr-generator',
    'pdf-compressor',
    'password-generator',
    'unit-converter',
    'json-formatter',
    'image-compressor',
    'pdf-merger',
    'bmi-calculator',
    'base64',
    'case-converter',
    'character-counter',
    'discount-calculator',
    'average-calculator',
    'compound-interest-calculator',
    'loan-emi-calculator',
    'pdf-splitter',
    'image-resizer'
  ];

  const popularMap = new Map(
    TOOLS.filter(t => (t.popular || POPULAR_ORDER_SLUGS.includes(t.slug)) && t.isImplemented && t.status === 'ready')
      .map(t => [t.slug, t])
  );

  const ordered: Tool[] = [];
  for (const slug of POPULAR_ORDER_SLUGS) {
    const tool = popularMap.get(slug);
    if (tool) {
      ordered.push(tool);
      popularMap.delete(slug);
    }
  }

  // Append any other popular ready tools
  for (const tool of popularMap.values()) {
    ordered.push(tool);
  }

  return ordered;
};

export const getFeaturedTools = (): Tool[] => {
  // Only feature tools that are actually functional and ready
  return TOOLS.filter(t => t.featured && t.isImplemented && t.status === 'ready');
};
