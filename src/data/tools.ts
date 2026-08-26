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
      description: 'Free online percentage calculator. Calculate percentage of a number, percentage increase or decrease, find whole amounts, and discount rates instantly.',
      keywords: ['percentage calculator', 'percent of number', 'percentage change', 'discount calculator'],
      h1: 'Percentage Calculator',
      intro: 'Calculate percentages instantly with step-by-step algebraic breakdown, decimal precision customization, and multiple calculation modes.',
      howToUse: [
        'Select calculation mode (e.g. "What is X% of Y?" or "% Increase/Decrease").',
        'Enter your input values into the number fields.',
        'View the instant result, copy the answer, or review the exact mathematical equation.'
      ],
      faq: [
        {
          question: 'How do you calculate percentage of a number?',
          answer: 'To calculate P percent of a number N, convert P into a decimal by dividing by 100, then multiply by N: (P ÷ 100) × N.'
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
      description: 'Calculate exact chronological age from date of birth. See total days, hours, live seconds alive, next birthday countdown, and horoscope sign.',
      keywords: ['age calculator', 'chronological age', 'birthday calculator', 'days alive'],
      h1: 'Age Calculator',
      intro: 'Determine exact chronological age with live second ticking, total lifetime duration in all units, and birthday celebration countdown.',
      howToUse: [
        'Pick your Date of Birth in the date picker field.',
        'Optionally add your exact birth time for pinpoint second precision.',
        'Review your age breakdown and copy your shareable summary.'
      ],
      faq: [
        {
          question: 'How does leap year affect age calculations?',
          answer: 'Our calculator handles Gregorian leap years accurately by checking each February in your lifespan.'
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
      description: 'Accurate real-time word counter with reading time estimation, speaking duration, keyword density frequency, and Flesch reading ease analysis.',
      keywords: ['word counter', 'character counter', 'word count tool', 'reading time calculator'],
      h1: 'Word Counter',
      intro: 'Analyze text statistics instantly: word count, character count, sentence volume, reading speeds, and top keyword frequencies.',
      howToUse: [
        'Type or paste your text into the editor.',
        'View the automatically updating metrics bar for total words, characters, and reading times.',
        'Check the sidebar for readability grade level and top keyword repetitions.'
      ],
      faq: [
        {
          question: 'What is the average reading speed used?',
          answer: 'Standard reading speed is calculated at 225 words per minute (WPM).'
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
      description: 'Count characters, spaces, letters, and UTF-8 bytes with live progress indicators for Twitter, Instagram, LinkedIn, and SEO meta tags.',
      keywords: ['character counter', 'twitter character count', 'social media character limit', 'seo character counter'],
      h1: 'Character Counter',
      intro: 'Monitor character count with live visual limit meters for Twitter/X, Instagram captions, LinkedIn posts, and SEO titles.',
      howToUse: [
        'Type or paste your message into the input area.',
        'Examine real-time social platform limit gauges.',
        'Copy the verified text with one click.'
      ],
      faq: [
        {
          question: 'What is the character limit on X (Twitter)?',
          answer: 'Standard X (Twitter) posts have a limit of 280 characters.'
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
      description: 'Convert text formatting instantly across 12 different case styles including Title Case, UPPERCASE, lowercase, camelCase, kebab-case, and snake_case.',
      keywords: ['case converter', 'convert uppercase to lowercase', 'camelcase converter', 'title case tool'],
      h1: 'Case Converter',
      intro: 'Transform text into 12 different typographic and programming cases in real-time with one-click clipboard copying.',
      howToUse: [
        'Enter or paste text in the input area.',
        'Browse the live transformed versions in the case grid.',
        'Click the copy button on any case card.'
      ],
      faq: [
        {
          question: 'What is kebab-case used for?',
          answer: 'Kebab-case uses hyphens (e.g. my-slug) and is popular for URL slugs and CSS class names.'
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
      description: 'Free online JSON formatter, validator, and tree inspector. Beautify JSON with custom indentation, fix syntax errors, and minify JSON data safely.',
      keywords: ['json formatter', 'json beautifier', 'json validator online', 'minify json'],
      h1: 'JSON Formatter & Validator',
      intro: 'Beautify, validate, and debug JSON payloads with instant error detection and tree navigation.',
      howToUse: [
        'Paste raw JSON code into the editor.',
        'Click "Beautify / Format" to format with 2-space or 4-space indentation.',
        'Copy the formatted output or download it as a `.json` file.'
      ],
      faq: [
        {
          question: 'Is my data secure?',
          answer: '100% secure. Everything is processed directly in your local browser memory.'
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
      description: 'Encode and decode Base64 strings with UTF-8 support. Convert images and files into Base64 Data URIs with ready-to-use HTML and CSS code.',
      keywords: ['base64 encoder', 'base64 decoder', 'base64 image converter'],
      h1: 'Base64 Encoder & Decoder',
      intro: 'Encode and decode strings with full UTF-8 compliance and drag-and-drop file to Data URI conversion.',
      howToUse: [
        'Choose "Text String Mode" or "Image & File to Base64".',
        'In text mode, choose Encode or Decode and enter your string.',
        'Copy the generated output with one click.'
      ],
      faq: [
        {
          question: 'What is URL-Safe Base64?',
          answer: 'URL-safe Base64 replaces `+` with `-` and `/` with `_` to be safe in URL queries.'
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
      description: 'Convert between metric and imperial units. Interactive unit converter for length, mass, temperature, data storage, volume, speed, and time.',
      keywords: ['unit converter', 'metric converter', 'measurement converter'],
      h1: 'Universal Unit Converter',
      intro: 'Convert between imperial and metric units with bidirectional calculation and comparison tables.',
      howToUse: [
        'Select a unit category (Length, Weight, Temperature, Area, Volume, Speed, etc.).',
        'Enter the value and choose source and target units.',
        'Review the multi-unit comparison table.'
      ],
      faq: [
        {
          question: 'Are conversions calibrated to standard SI units?',
          answer: 'Yes, all multipliers strictly follow NIST and BIPM international standards.'
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
      description: 'Create custom high-resolution QR codes for websites, WiFi networks, vCards, emails, and phone numbers. Download in PNG or vector SVG format.',
      keywords: ['qr code generator', 'custom qr code', 'wifi qr code generator'],
      h1: 'QR Code Generator',
      intro: 'Generate vector-sharp QR codes with custom foreground/background colors and pre-formatted templates.',
      howToUse: [
        'Select QR content type: URL, WiFi, Plain Text, Email, Phone, SMS, or vCard.',
        'Enter your information in the form fields.',
        'Download the QR code as PNG or SVG.'
      ],
      faq: [
        {
          question: 'Do generated QR codes expire?',
          answer: 'No. They are static QR codes that encode your data directly and never expire.'
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
      description: 'Generate cryptographically secure random passwords and memorable passphrases. Customizable length, character sets, and live entropy strength ratings.',
      keywords: ['password generator', 'strong password generator', 'random password generator'],
      h1: 'Secure Password Generator',
      intro: 'Create passwords powered by browser `crypto.getRandomValues`, supporting custom symbol sets, passphrases, and bulk batches.',
      howToUse: [
        'Select between "Random Password", "Memorable Passphrase", or "Bulk Batch".',
        'Adjust the length slider and toggle character options.',
        'Copy the generated password.'
      ],
      faq: [
        {
          question: 'How random are generated passwords?',
          answer: 'They use Web Crypto API CSPRNG hardware-grade pseudorandom generation.'
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
      description: 'Free online Body Mass Index (BMI) calculator. Supports Metric (kg/cm) and Imperial (lbs/ft/in) with WHO classification and ideal weight targets.',
      keywords: ['bmi calculator', 'body mass index', 'ideal weight calculator', 'healthy weight range'],
      h1: 'BMI & Body Health Calculator',
      intro: 'Evaluate your Body Mass Index with instant WHO classification, healthy weight range calculation, and visual health meter.',
      howToUse: [
        'Select Metric (cm/kg) or Imperial (ft/in/lbs) unit system.',
        'Enter height and weight values.',
        'View your BMI score, WHO category, and target healthy weight range.'
      ],
      faq: [
        {
          question: 'What is a healthy BMI range according to the WHO?',
          answer: 'The World Health Organization defines a normal healthy BMI range between 18.5 and 24.9.'
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
      description: 'Calculate final prices after discounts, stackable promo codes, and sales tax. See exact dollars saved and effective discount percentages.',
      keywords: ['discount calculator', 'sale price calculator', 'percentage off calculator'],
      h1: 'Discount & Sale Price Calculator',
      intro: 'Determine exact sale prices with support for primary percentage discounts, stacked coupons, and local sales tax.',
      howToUse: [
        'Enter original item price and select currency.',
        'Enter primary discount rate (or click quick presets like 20% or 50%).',
        'Optionally add stackable coupon or sales tax to view final cost and total savings.'
      ],
      faq: [
        {
          question: 'How do stacked discounts work?',
          answer: 'A second discount is applied to the reduced price after the first discount, not added together directly.'
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
      description: 'Free statistical calculator. Enter numbers to calculate arithmetic mean, median, mode, sample standard deviation, variance, and sum instantly.',
      keywords: ['average calculator', 'mean median mode calculator', 'standard deviation calculator'],
      h1: 'Average & Statistics Calculator',
      intro: 'Calculate comprehensive descriptive statistics across any dataset with customizable decimal precision.',
      howToUse: [
        'Paste or type numbers separated by commas, spaces, or newlines.',
        'Review the calculated Mean, Median, Mode, Sum, Range, and Standard Deviation.',
        'Copy the summary statistics report.'
      ],
      faq: [
        {
          question: 'What is the difference between Mean and Median?',
          answer: 'The Mean is the arithmetic average (sum divided by count), while the Median is the middle value when numbers are sorted.'
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
      description: 'Solve for unknown terms in proportions A:B = C:D, reduce ratios to simplest whole numbers with GCD, and scale aspect ratios for design and video.',
      keywords: ['ratio calculator', 'aspect ratio calculator', 'simplify ratio', 'proportion solver'],
      h1: 'Ratio & Aspect Ratio Calculator',
      intro: 'Solve proportions, simplify ratios, scale dimensions, and divide amounts with step-by-step mathematical explanations.',
      howToUse: [
        'Select mode: Solve Proportion, Simplify Ratio, Scale, or Divide.',
        'Enter known parameters.',
        'View the calculated proportion and explanation.'
      ],
      faq: [
        {
          question: 'How do you solve a proportion A:B = C:D?',
          answer: 'Cross-multiplication states that A × D = B × C. If one value is unknown, solve using basic algebra.'
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
      description: 'Free simple interest calculator. Calculate interest earnings and total return based on principal, annual rate, and duration in years, months, or days.',
      keywords: ['simple interest calculator', 'interest calculator', 'principal interest'],
      h1: 'Simple Interest Calculator',
      intro: 'Calculate simple interest earnings using formula I = (P × R × T) / 100 with customizable tenures and currency formatting.',
      howToUse: [
        'Enter principal investment amount.',
        'Enter annual interest rate percentage.',
        'Choose tenure in years, months, or days to view maturity value.'
      ],
      faq: [
        {
          question: 'What is the simple interest formula?',
          answer: 'Interest = (Principal × Rate × Time) ÷ 100.'
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
      description: 'Project future investment growth with monthly contributions and compounding frequencies (daily, monthly, quarterly, annually). Includes annual breakdown schedule.',
      keywords: ['compound interest calculator', 'investment calculator', 'apy calculator', 'future value'],
      h1: 'Compound Interest Calculator',
      intro: 'Plan financial growth by calculating compound interest returns over time with periodic deposits and customizable compounding schedules.',
      howToUse: [
        'Enter initial starting principal and optional monthly contribution.',
        'Set expected annual interest rate and time horizon in years.',
        'Choose compounding frequency to view future balance and annual growth schedule.'
      ],
      faq: [
        {
          question: 'What is compounding frequency?',
          answer: 'Compounding frequency specifies how often accrued interest is added back to principal to earn further interest.'
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
      description: 'Calculate monthly loan EMI payments, total interest costs, and amortization repayment breakdown for home loans, auto loans, and mortgages.',
      keywords: ['loan emi calculator', 'mortgage calculator', 'monthly payment calculator'],
      h1: 'Loan & Mortgage EMI Calculator',
      intro: 'Calculate monthly loan EMI and view full principal vs. interest breakdown with amortization preview.',
      howToUse: [
        'Enter loan principal amount and annual interest rate.',
        'Specify loan tenure in years or months.',
        'Review monthly EMI payment and amortization breakdown.'
      ],
      faq: [
        {
          question: 'How is loan EMI calculated?',
          answer: 'EMI is computed using formula: EMI = [P × r × (1+r)^n] ÷ [(1+r)^n - 1] where r is monthly interest and n is tenure in months.'
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
      description: 'Calculate Goods and Services Tax (GST) or VAT. Add tax (exclusive to inclusive) or remove tax (inclusive to exclusive) with CGST/SGST breakdowns.',
      keywords: ['gst calculator', 'tax calculator', 'sales tax calculator', 'vat calculator'],
      h1: 'GST & Sales Tax Calculator',
      intro: 'Calculate gross and net amounts with standard tax slab presets and CGST/SGST splits.',
      howToUse: [
        'Choose mode: Add GST (Net $\\to$ Gross) or Remove GST (Gross $\\to$ Net).',
        'Enter amount and select tax percentage rate.',
        'View itemized tax summary and copy invoice breakdown.'
      ],
      faq: [
        {
          question: 'How do you remove GST from a total amount?',
          answer: 'To extract pre-tax amount: Net = Gross Amount ÷ (1 + Tax Rate ÷ 100).'
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
      description: 'Remove duplicate lines from lists and text files instantly. Supports case sensitivity, trimming whitespace, removing blank lines, and sorting.',
      keywords: ['remove duplicate lines', 'text deduplicator', 'find unique lines'],
      h1: 'Remove Duplicate Lines',
      intro: 'Clean up lists and datasets by stripping repeat lines while maintaining original ordering or applying alphabetical sorting.',
      howToUse: [
        'Paste your list into the input box.',
        'Configure case sensitivity and trimming options.',
        'Copy or download the deduplicated clean list.'
      ],
      faq: [
        {
          question: 'Can I preserve original line ordering?',
          answer: 'Yes, original ordering is preserved by default.'
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
      description: 'Remove multiple consecutive spaces, trim line edges, eliminate blank lines, and clean tab indents from text.',
      keywords: ['remove extra spaces', 'clean whitespace tool', 'trim lines'],
      h1: 'Remove Extra Spaces & Whitespace',
      intro: 'Normalize messy text by collapsing duplicate spaces into single spaces and cleaning line endings.',
      howToUse: [
        'Paste text with irregular spacing into the editor.',
        'Toggle formatting rules (collapse spaces, trim line ends, remove blank lines).',
        'Copy the formatted clean text.'
      ],
      faq: [
        {
          question: 'Does this join all lines into a single paragraph?',
          answer: 'Yes, enable "Join All to 1 Line" to flatten multiline text into one continuous sentence.'
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
    description: 'Sort lines alphabetically (A-Z, Z-A), natural numerical order, line length, reverse order, or shuffle randomly.',
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
      description: 'Sort lists alphabetically (A to Z, Z to A), by natural numbering, by character length, reverse lines, or randomize order.',
      keywords: ['text sorter', 'alphabetical order tool', 'sort lines online'],
      h1: 'Text & Line Sorter',
      intro: 'Organize lists with multiple sorting algorithms including natural sort (e.g., File 2 before File 10), length, and random shuffling.',
      howToUse: [
        'Paste lines into the editor.',
        'Choose your desired sorting algorithm.',
        'Copy or download the sorted text.'
      ],
      faq: [
        {
          question: 'What is Natural Sort?',
          answer: 'Natural sort orders numbers logically inside strings (e.g. Item 2 before Item 10 rather than alphabetical Item 10 before Item 2).'
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
      description: 'Convert article titles and headlines into clean, URL-safe slugs with customizable separators (hyphen, underscore), accent transliteration, and SEO stop-word removal.',
      keywords: ['slug generator', 'url slug creator', 'seo permalink generator'],
      h1: 'URL Slug Generator',
      intro: 'Generate clean, readable URL slugs with live website preview and customizable separators.',
      howToUse: [
        'Type your title or headline.',
        'Select separator and optional stop-word removal.',
        'Copy the generated slug.'
      ],
      faq: [
        {
          question: 'What is a URL slug?',
          answer: 'A slug is the human-readable portion of a URL identifying a specific page (e.g. /blog/my-awesome-post).'
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
    description: 'Generate customizable placeholder dummy text by paragraphs, sentences, words, or lists in Classic Latin, Tech Startup, or Pirate themes.',
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
      description: 'Generate customized dummy text for mockups, prototypes, and layouts. Choose paragraphs, sentences, words, HTML tags, or Markdown.',
      keywords: ['lorem ipsum generator', 'placeholder text generator', 'dummy text'],
      h1: 'Lorem Ipsum Placeholder Generator',
      intro: 'Create filler text tailored to your layout needs with output in plain text, HTML tags, or Markdown format.',
      howToUse: [
        'Select quantity and unit (paragraphs, sentences, words, or list items).',
        'Choose a theme style (Classic Latin, Tech Startup, or Pirate).',
        'Copy or download the generated placeholder text.'
      ],
      faq: [
        {
          question: 'Where does Lorem Ipsum originate?',
          answer: 'It originates from Cicero\'s 45 BC Latin philosophical treatise "De finibus bonorum et malorum".'
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
      description: 'Minify JSON payloads to reduce bandwidth and payload sizes. Validate syntax and format with compression ratio analytics.',
      keywords: ['json minifier', 'compress json online', 'json compressor'],
      h1: 'JSON Minifier & Compressor',
      intro: 'Remove all unnecessary whitespace from JSON payloads to reduce file size and API response payloads.',
      howToUse: [
        'Paste JSON in the editor.',
        'Choose Minify (Compact) or Beautify.',
        'Copy or download the minified JSON file.'
      ],
      faq: [
        {
          question: 'Does minification change the data in JSON?',
          answer: 'No. Minification only strips extraneous whitespace and indentation without altering property keys or values.'
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
      description: 'Encode and decode URLs, query strings, and URI components online. Inspect parsed query parameters and fix URL encoding issues.',
      keywords: ['url encoder', 'url decoder', 'encodeuricomponent online'],
      h1: 'URL Encoder & Decoder',
      intro: 'Safely encode special characters for URLs or decode percent-encoded strings with automatic query parameter extraction.',
      howToUse: [
        'Choose URL Encode or URL Decode mode.',
        'Enter URL or string.',
        'Copy the result or review detected query parameters.'
      ],
      faq: [
        {
          question: 'What is percent-encoding?',
          answer: 'Percent-encoding replaces unsafe URL characters with a `%` followed by two hexadecimal digits.'
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
    description: 'Generate cryptographically secure UUID v4 (RFC 4122), NanoIDs, and 16-byte hex tokens in bulk with custom wrappers and formatting.',
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
      description: 'Generate random UUID v4 and unique identifiers powered by Web Crypto CSPRNG. Bulk generate up to 100 UUIDs with custom delimiters and casing.',
      keywords: ['uuid generator', 'guid generator', 'uuid v4 generator online'],
      h1: 'UUID & Unique ID Generator',
      intro: 'Generate standard RFC 4122 compliant UUID v4 identifiers and compact tokens for databases and APIs.',
      howToUse: [
        'Select identifier type (UUID v4, NanoID, Hex).',
        'Choose count and formatting options (hyphens, uppercase, quote wrappers).',
        'Copy individual IDs or download the entire batch.'
      ],
      faq: [
        {
          question: 'What is the probability of a UUID v4 collision?',
          answer: 'The collision probability is astronomically low: generating 1 billion UUIDs every second for 85 years yields less than a 50% probability of a single collision.'
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
      description: 'Real-time JavaScript regular expression tester. Inspect match indexes, test capture groups, configure flags (g, i, m, s), and test replacements.',
      keywords: ['regex tester', 'regular expression tester online', 'regex matcher'],
      h1: 'Regex Tester & Matcher',
      intro: 'Evaluate regex patterns against sample strings with instant syntax validation and capture group inspection.',
      howToUse: [
        'Enter your regex pattern and toggle desired flags.',
        'Paste test string to view matches and capture groups.',
        'Optionally test substitution replacements.'
      ],
      faq: [
        {
          question: 'Which flags are supported?',
          answer: 'Global (g), Case-Insensitive (i), Multiline (m), and DotAll (s) are supported.'
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
    description: 'Generate cryptographic checksums in real time: SHA-256, SHA-512, SHA-384, SHA-1, and MD5 with checksum verification matching.',
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
      description: 'Generate cryptographic hash digests using Web Crypto API. Calculate SHA-256, SHA-512, SHA-384, SHA-1, and MD5 with instant checksum comparison.',
      keywords: ['hash generator', 'sha256 generator', 'md5 generator', 'checksum verifier'],
      h1: 'Hash Generator & Checksum Tool',
      intro: 'Compute secure cryptographic message digests directly in your browser with checksum verification support.',
      howToUse: [
        'Type or paste text into the input area.',
        'View computed hashes across all major algorithms simultaneously.',
        'Copy any hash or paste an expected checksum to verify a match.'
      ],
      faq: [
        {
          question: 'Are hashes computed securely?',
          answer: 'Yes, hashes are computed locally in your browser using hardware-accelerated Web Crypto API.'
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
      description: 'Convert digital storage across decimal (SI) and binary (IEC) units. See real-world photo, song, movie capacities and download time calculations.',
      keywords: ['data storage converter', 'bytes to mb', 'gb to tb converter', 'binary storage converter'],
      h1: 'Data Storage & Bandwidth Converter',
      intro: 'Convert between decimal storage units (KB, MB, GB) and binary units (KiB, MiB, GiB) with real-world file capacity comparisons.',
      howToUse: [
        'Enter data quantity and select starting unit.',
        'View conversion results across all units simultaneously.',
        'Check estimated photos, songs, and download duration.'
      ],
      faq: [
        {
          question: 'What is the difference between GB and GiB?',
          answer: '1 Gigabyte (GB) = 1,000,000,000 bytes (decimal base 1000), while 1 Gibibyte (GiB) = 1,073,741,824 bytes (binary base 1024).'
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
      description: 'Convert temperatures across all major scales with exact formulas, live visual thermal gauge, and physical reference benchmarks.',
      keywords: ['temperature converter', 'celsius to fahrenheit', 'kelvin to celsius'],
      h1: 'Temperature Converter',
      intro: 'Convert temperature values across Celsius, Fahrenheit, Kelvin, and Rankine with conversion formulas and thermal reference points.',
      howToUse: [
        'Enter temperature value and select current scale.',
        'Review converted temperatures across all scales.',
        'Click physical thermal benchmarks to test notable temperatures.'
      ],
      faq: [
        {
          question: 'What is the formula to convert Celsius to Fahrenheit?',
          answer: '°F = (°C × 9/5) + 32.'
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
    description: 'Combine multiple PDF documents into a single organized file with custom ordering and fast client-side processing.',
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
      description: 'Merge multiple PDF files into one document in your web browser. 100% private, client-side, drag-and-drop ordering, zero uploads.',
      keywords: ['pdf merger', 'merge pdf', 'combine pdf files', 'join pdf online'],
      h1: 'PDF Merger',
      intro: 'Combine multiple PDF documents into a single organized file in seconds with drag-and-drop reordering, instant browser-side compilation, and zero server uploads.',
      howToUse: [
        'Upload or drag and drop two or more PDF files into the merger dropzone.',
        'Rearrange the documents into your preferred page sequence using the up/down controls.',
        'Click "Merge PDFs" and download your newly combined document.'
      ],
      faq: [
        {
          question: 'Are my PDF files uploaded to a remote server?',
          answer: 'No. All PDF merging happens 100% locally in your browser memory using WebAssembly/JavaScript. Your documents never leave your machine.'
        },
        {
          question: 'Is there a limit on how many PDFs I can merge?',
          answer: 'You can merge as many PDF files as your local browser memory can comfortably handle.'
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
    description: 'Extract specific pages or page ranges (e.g. 1-3, 5, 8-10) from any PDF document into a new standalone file.',
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
      description: 'Extract specific pages or page ranges from PDF files online. Fast, private, browser-based PDF splitting with custom range syntax.',
      keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'separate pdf'],
      h1: 'PDF Splitter',
      intro: 'Extract specific pages or custom ranges (such as 1-3, 5, 8-10) from any PDF file directly in your browser without uploading your files.',
      howToUse: [
        'Upload or drag and drop a PDF file into the splitter.',
        'Choose your page selection mode: Page Range Syntax (e.g. "1-3, 5") or Visual Page Grid.',
        'Click "Extract Pages" to generate and download your new PDF.'
      ],
      faq: [
        {
          question: 'How do I specify multiple page ranges?',
          answer: 'You can combine individual pages and ranges separated by commas, such as "1-3, 5, 7-10".'
        },
        {
          question: 'Does splitting affect the quality of the pages?',
          answer: 'No. The original page vectors, fonts, and images are preserved losslessly.'
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
    description: 'Optimize and compress PDF documents by cleaning object streams, removing unreferenced objects, and reducing file size.',
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
      description: 'Compress and optimize PDF documents directly in your web browser. 100% private, transparent byte reduction metrics, zero server uploads.',
      keywords: ['pdf compressor', 'compress pdf', 'reduce pdf file size', 'optimize pdf online'],
      h1: 'PDF Compressor',
      intro: 'Optimize and compress PDF documents directly inside your browser. Re-encodes object streams, strips unused resources, and provides 100% genuine byte comparisons.',
      howToUse: [
        'Upload or drag and drop a PDF file into the compressor.',
        'Select your desired compression strength: Low (Highest Quality), Medium (Balanced), or High (Max Reduction).',
        'Click "Compress PDF", review the genuine byte reduction stats, and download your optimized document.'
      ],
      faq: [
        {
          question: 'Why does my PDF not reduce in size significantly?',
          answer: 'PDFs that already contain highly compressed images or pure vector data may have little redundant metadata. Toolsbar provides transparent, genuine byte comparisons without faking metrics.'
        },
        {
          question: 'Are my confidential documents private?',
          answer: 'Yes. All compression and stream optimization takes place strictly in your local browser memory.'
        }
      ]
    }
  },

  // 34. Image Compressor
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
      description: 'Compress JPG, PNG, and WebP images directly in your browser with 100% privacy. Real calculated byte reductions and customizable quality presets.',
      keywords: ['image compressor', 'compress image online', 'reduce photo size', 'jpeg optimizer', 'png compressor'],
      h1: 'Image Compressor',
      intro: 'Optimize and reduce image file sizes locally in your browser. Features lossless/lossy encoding, WebP conversion, custom quality controls, and genuine before/after byte statistics.',
      howToUse: [
        'Upload or drag & drop a JPG, PNG, or WebP image.',
        'Choose a compression preset (High Quality, Balanced, Max Compression) or adjust quality manually.',
        'Optionally select an output format (WebP, JPEG, PNG) to maximize byte savings.',
        'Click "Compress Image", review side-by-side previews and genuine calculated metrics, and download your optimized image.'
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
    description: 'Resize photos and graphics by exact pixel dimensions, percentage scaling, or standard social media aspect ratios with bicubic smoothing.',
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
      description: 'Resize images by pixel dimensions or scale percentage without quality degradation. Supports aspect ratio locking, social presets, and instant download.',
      keywords: ['image resizer', 'resize image online', 'photo dimension changer', 'aspect ratio resizer'],
      h1: 'Image Resizer',
      intro: 'Scale and resize images to exact dimensions for social media, avatars, banners, and websites with high-quality browser interpolation and aspect ratio locking.',
      howToUse: [
        'Upload your JPG, PNG, or WebP image.',
        'Enter target width and height in pixels, or click a quick scaling preset (25%, 50%, 75%, 200%).',
        'Keep aspect ratio locked to avoid distortion, or select a standard preset (1080p, Instagram Square, OpenGraph banner).',
        'Click "Resize Image" and download your newly scaled image.'
      ],
      faq: [
        {
          question: 'Will resizing degrade image clarity?',
          answer: 'Scaling down preserves sharpness using high-quality browser bicubic smoothing. Scaling up beyond original resolution will naturally produce softer pixels.'
        },
        {
          question: 'Can I convert formats while resizing?',
          answer: 'Yes. You can output to JPG, PNG, or WebP and adjust encoding quality directly from the settings panel.'
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
    description: 'Convert JPG and JPEG photos to lossless PNG format in seconds with 100% dimension preservation.',
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
      description: 'Convert JPG and JPEG images to lossless PNG format directly in your browser. Preserves exact pixel dimensions without server uploads.',
      keywords: ['jpg to png', 'jpeg to png converter', 'convert jpeg to png online', 'lossless image conversion'],
      h1: 'JPG to PNG Converter',
      intro: 'Convert JPEG and JPG photographs into lossless PNG images with exact pixel fidelity and zero generational degradation.',
      howToUse: [
        'Upload or drag & drop a JPG/JPEG image.',
        'Verify resolution and file properties in the preview card.',
        'Click "Convert to PNG" to decode and re-encode to PNG format.',
        'Download your converted lossless PNG file.'
      ],
      faq: [
        {
          question: 'Why convert JPG to PNG?',
          answer: 'PNG uses lossless compression, making it ideal for graphics, diagrams, and iterative editing where you want to prevent further lossy JPEG compression artifacts.'
        },
        {
          question: 'Are my images secure?',
          answer: 'Yes, conversion is performed client-side using browser Canvas APIs without transmitting data over the internet.'
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
    description: 'Convert PNG images to compact JPG format with automatic transparency detection, custom background color fill, and quality controls.',
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
      description: 'Convert PNG graphics to compact JPG photographs with automatic transparency detection and customizable background fills. 100% private browser processing.',
      keywords: ['png to jpg', 'png to jpeg converter', 'convert png to jpg online', 'png background color fill'],
      h1: 'PNG to JPG Converter',
      intro: 'Transform heavy PNG images into lightweight JPG files. Features automated alpha transparency inspection, custom background color selection, and JPEG quality tuning.',
      howToUse: [
        'Upload or drag & drop a PNG file.',
        'If transparency is detected, pick a background color (White, Black, Slate, Cream, or Custom HEX) to replace transparent areas cleanly.',
        'Adjust the JPEG encoding quality slider if desired.',
        'Click "Convert to JPG" and download your newly created JPEG image.'
      ],
      faq: [
        {
          question: 'How does this tool handle transparent PNGs?',
          answer: 'Because the JPEG format does not support alpha channels, Toolsbar automatically detects transparency and applies your chosen solid background color (default white) so your image never has black artifact borders.'
        },
        {
          question: 'Can I control the output file size?',
          answer: 'Yes. Use the quality slider (10% to 100%) to balance clarity and file size.'
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
    description: 'Convert images between JPG, PNG, and modern WebP formats in both directions with quality controls and transparency preservation.',
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
      description: 'Free online WebP converter. Convert JPG/PNG to WebP for superior web performance, or convert WebP to JPG/PNG for universal desktop compatibility.',
      keywords: ['webp converter', 'jpg to webp', 'png to webp', 'webp to png', 'webp to jpg converter'],
      h1: 'WebP Converter',
      intro: 'Convert seamlessly between standard photographic formats (JPG, PNG) and next-generation WebP. Reduces web page weight while preserving sharp image details.',
      howToUse: [
        'Upload a JPG, PNG, or WebP image.',
        'Select your desired target output format (WebP, JPEG, or PNG).',
        'Fine-tune the encoding quality slider where applicable.',
        'Click "Convert Image" and download the converted output.'
      ],
      faq: [
        {
          question: 'Why should I convert images to WebP?',
          answer: 'WebP provides 25% to 35% smaller file sizes compared to JPEG and PNG at equivalent visual fidelity, speeding up website loading times.'
        },
        {
          question: 'Can I convert WebP back to JPG or PNG?',
          answer: 'Yes! Simply upload a WebP file, select JPG or PNG as the target format, and convert instantly.'
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
      description: 'Free browser-based HTML formatter and minifier. Indent, beautify, and minify HTML code with whitespace preservation for pre and textarea tags.',
      keywords: ['html formatter', 'html beautifier', 'html minifier online', 'format html code', 'prettify html'],
      h1: 'HTML Formatter & Minifier',
      intro: 'Clean, format, and optimize your HTML markup with configurable indentation (2 spaces, 4 spaces, tabs). Minify code safely without corrupting pre, code, script, or textarea blocks.',
      howToUse: [
        'Paste your HTML source code into the editor or load the sample template.',
        'Choose indentation preferences (2 spaces, 4 spaces, or tabs).',
        'Click "Beautify HTML" to reformat and indent, or "Minify HTML" to remove unnecessary bytes.',
        'Copy your formatted code or download it directly as an HTML file.'
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
    description: 'Beautify, indent, and minify CSS code with support for CSS3, @media queries, keyframes, custom properties, and calc().',
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
      description: 'Format, indent, and minify CSS stylesheets in your browser. Handles modern CSS3, media queries, animations, and CSS variables without corrupting URLs or strings.',
      keywords: ['css formatter', 'css beautifier', 'css minifier online', 'format css stylesheet', 'clean css'],
      h1: 'CSS Formatter & Minifier',
      intro: 'Transform messy stylesheets into beautifully organized, readable CSS. Switch seamlessly to minification mode to compress stylesheets for high-performance production delivery.',
      howToUse: [
        'Paste your CSS stylesheet into the input editor.',
        'Select your preferred indentation (2 spaces, 4 spaces, tabs) and line break preferences.',
        'Click "Beautify CSS" to organize selectors and rules, or "Minify CSS" to strip non-essential whitespace.',
        'Review byte metrics, copy the result, or download your optimized .css file.'
      ],
      faq: [
        {
          question: 'Does minification preserve font names and background URLs?',
          answer: 'Yes. Toolsbar extracts string literals and url(...) definitions before processing so quoted font names and URLs are never altered or corrupted.'
        },
        {
          question: 'Does this tool support CSS variables and media queries?',
          answer: 'Yes. Modern CSS custom properties (--variable), @media rules, @supports, and @keyframes animations are fully supported.'
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
    description: 'Format, beautify, and safely minify modern JavaScript with zero code execution and AST-level syntax safety.',
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
      description: 'Format and minify JavaScript source code in your browser with zero execution risk. Supports ES6+, async/await, optional chaining, and arrow functions.',
      keywords: ['javascript formatter', 'js beautifier', 'js minifier online', 'minify javascript', 'format js code'],
      h1: 'JavaScript Formatter & Minifier',
      intro: 'Format messy JavaScript code with clean indentation, or minify source code with industrial AST-level safety. Completely safe and runs 100% client-side with zero script execution.',
      howToUse: [
        'Paste your JavaScript source code into the editor.',
        'Choose your desired indent size (2 spaces, 4 spaces, or tabs).',
        'Click "Beautify JS" to re-indent, or "Minify JS" to produce safe, compressed production code.',
        'Inspect the character savings and download your script directly.'
      ],
      faq: [
        {
          question: 'Is my JavaScript code executed during formatting or minification?',
          answer: 'Never. JavaScript is parsed purely as textual AST structures. Toolsbar enforces a strict zero-execution policy (no eval or Function calls).'
        },
        {
          question: 'What happens if my code has a syntax error?',
          answer: 'The tool detects the parsing error and displays a descriptive notice indicating the issue rather than generating corrupted code.'
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
    description: 'Decode and inspect JSON Web Tokens (JWT) locally with header, payload, claim breakdowns, and expiration tracking.',
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
      description: 'Decode and inspect JSON Web Tokens (JWT) entirely in your browser with 100% privacy. Inspect claims (iss, sub, exp, iat), expiration timers, and header parameters.',
      keywords: ['jwt decoder', 'decode jwt token', 'jwt inspector online', 'jwt payload viewer', 'jwt claims parser'],
      h1: 'JWT Decoder',
      intro: 'Inspect and decode JSON Web Tokens directly in your browser. View header parameters, payload claims, timestamps, and expiration status with guaranteed client-side privacy.',
      howToUse: [
        'Paste your encoded JSON Web Token (JWT) into the input box.',
        'Review the automatically extracted Header, Signature, and Claims table.',
        'Check the expiration card to see whether the token is currently valid or expired.',
        'Click the copy icons to copy JSON payloads or individual claim values.'
      ],
      faq: [
        {
          question: 'Does this tool verify the JWT signature?',
          answer: 'No. Decoding a JWT does not verify its cryptographic signature or authenticity. To verify a token, you must validate the signature using your secret key or public certificate.'
        },
        {
          question: 'Are my tokens stored or sent across the network?',
          answer: 'Never. Decoding happens 100% in your browser memory. Tokens are never transmitted to external servers, logged, or saved to localStorage.'
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
      description: 'Convert Unix timestamps (seconds & milliseconds) to human dates, UTC, ISO 8601, and local time zones. Convert dates back to epoch timestamps with real-time live clock.',
      keywords: ['unix timestamp converter', 'epoch to date', 'date to epoch', 'unix time converter', 'epoch converter online'],
      h1: 'Unix Timestamp Converter',
      intro: 'Convert effortlessly between Unix epoch timestamps and human-readable dates in UTC, ISO 8601, and your local timezone. Features real-time live epoch clock, seconds/milliseconds auto-detection, and two-way conversion.',
      howToUse: [
        'To convert a timestamp: enter an epoch number (e.g. 1771800000) and choose seconds, milliseconds, or auto-detect.',
        'To convert a date: switch to the "Date & Time → Timestamp" tab, select a date/time, and choose UTC or Local timezone.',
        'View the converted UTC time, local time, ISO 8601 string, relative time, and day-of-year statistics.',
        'Click the copy icons to copy any format with a single click.'
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
      description: 'Inspect colors, convert color models, and test accessible contrast ratios.',
      keywords: ['color picker', 'contrast checker', 'palette generator'],
      h1: 'Color Palette & Contrast Checker',
      intro: 'Explore color harmonies, convert between HEX, RGB, HSL, and ensure accessible contrast.',
      howToUse: ['Select base color.', 'Browse harmonious palettes.', 'Check contrast ratios.'],
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
  // Only advertise tools that are actually functional and ready
  return TOOLS.filter(t => t.popular && t.isImplemented && t.status === 'ready');
};

export const getFeaturedTools = (): Tool[] => {
  // Only feature tools that are actually functional and ready
  return TOOLS.filter(t => t.featured && t.isImplemented && t.status === 'ready');
};
