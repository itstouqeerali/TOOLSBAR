/**
 * Cloudflare Pages Functions Server-Side Multi-Page SEO Middleware
 *
 * Intercepts incoming HTML document requests on Cloudflare Pages edge network
 * and dynamically rewrites <title>, <meta name="description">, <link rel="canonical">,
 * and OpenGraph/Twitter tags using HTMLRewriter.
 *
 * Guarantees Googlebot, Bingbot, AdSense crawlers, and social media scrapers
 * receive unique, multi-page HTML metadata for every URL instead of a single generic SPA shell.
 */

// Cloudflare Workers / Pages runtime HTMLRewriter ambient declaration
declare class HTMLRewriter {
  on(selector: string, handlers: {
    element?: (element: {
      setInnerContent(content: string, options?: { html?: boolean }): void;
      setAttribute(name: string, value: string): void;
      getAttribute(name: string): string | null;
      append(content: string, options?: { html?: boolean }): void;
      prepend(content: string, options?: { html?: boolean }): void;
      remove(): void;
    }) => void;
  }): this;
  transform(response: Response): Response;
}

interface PageMeta {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://toolsbar.site';

// 1. Static Core Routes
const STATIC_ROUTES: Record<string, PageMeta> = {
  '': {
    title: 'Toolsbar  -  12 Free Browser Utilities + Verified Directory of 80+ AI Tools',
    description: 'Fast, private, 100% in-browser utilities for PDFs, images, and calculations, paired with an independent discovery directory of verified artificial intelligence tools.',
    canonicalPath: '',
  },
  'tools': {
    title: 'Free Browser Utilities  -  12 Instant Tools (No Signup)  -  Toolsbar',
    description: 'Explore 12 fast, client-side digital utilities running 100% locally in your browser with zero latency: PDF toolkit, image compressor, converters, and calculators.',
    canonicalPath: 'tools',
  },
  'ai-tools': {
    title: 'Discover AI Tools  -  The Modern AI Directory & Guides  -  Toolsbar',
    description: 'Discover and compare top artificial intelligence tools for video, coding, writing, research, and design. Verified pricing, honest capabilities, and official access.',
    canonicalPath: 'ai-tools',
  },
  'categories': {
    title: 'Browse All Categories  -  Toolsbar',
    description: 'Explore digital utilities and AI tools categorized across PDF, image manipulation, text formatting, developer tools, calculators, and content generation.',
    canonicalPath: 'categories',
  },
  'popular': {
    title: 'Popular Tools & Trending AI Software  -  Toolsbar',
    description: 'Discover the most frequently used browser utilities and highest-rated artificial intelligence platforms on Toolsbar.',
    canonicalPath: 'popular',
  },
  'privacy': {
    title: 'Privacy Policy  -  100% Client-Side Privacy  -  Toolsbar',
    description: 'Toolsbar operates with a strict client-side first architecture. Files and data processed in our browser utilities never leave your personal computer.',
    canonicalPath: 'privacy',
  },
  'terms': {
    title: 'Terms of Service  -  Toolsbar',
    description: 'Read the terms and conditions governing the use of Toolsbar free online utilities and AI directory guides.',
    canonicalPath: 'terms',
  },
  'contact': {
    title: 'Contact Us & Suggest a Tool  -  Toolsbar',
    description: 'Get in touch with the Toolsbar team for questions, suggestions, feedback, developer inquiries, or tool submissions.',
    canonicalPath: 'contact',
  },
};

// 2. Utility Categories
const UTILITY_CATEGORIES: Record<string, PageMeta> = {
  pdf: {
    title: 'PDF Utilities  -  Free Browser PDF Toolkit  -  Toolsbar',
    description: 'Merge multiple PDFs, split documents, compress file sizes, and convert text or images to PDF directly in your browser with zero cloud uploads.',
  },
  images: {
    title: 'Image Tools  -  Compress, Resize & Convert Images  -  Toolsbar',
    description: 'High-performance client-side image compression, dimension resizing, and format conversions between JPG, PNG, and WebP.',
  },
  calculators: {
    title: 'Online Calculators  -  Percentage, Age & Finance Calculators  -  Toolsbar',
    description: 'Free interactive calculators for exact age breakdowns, percentage increases and discounts, compound interest, and loan EMI payments.',
  },
  text: {
    title: 'Text Utilities  -  Word Counter, Case Converter & Toolkit  -  Toolsbar',
    description: 'Clean, format, count, sort, and transform text locally in your browser without sending sensitive notes to external servers.',
  },
  developer: {
    title: 'Developer Tools  -  JSON Studio, Base64 & Code Formatter  -  Toolsbar',
    description: 'Essential utilities for software engineers: JSON formatting and validation, Base64 encoding, hash calculation, and UUID generation.',
  },
  converters: {
    title: 'Unit & Data Converters  -  Free Online Conversion  -  Toolsbar',
    description: 'Fast, accurate conversions across length, mass, temperature, and digital data storage units.',
  },
  generators: {
    title: 'Generators  -  Custom QR Code & Password Generator  -  Toolsbar',
    description: 'Generate high-resolution QR codes with custom styling, cryptographically secure passwords, and UUID identifiers.',
  },
};

// 3. Native Flagship Tools
const FLAGSHIP_TOOLS: Record<string, PageMeta> = {
  'text-to-pdf': {
    title: 'Text to PDF Converter  -  Rich Document Formatter  -  Toolsbar',
    description: 'Format rich text with headers and bullets, then export clean print-ready PDF documents locally in your browser with zero server uploads.',
  },
  'images-to-pdf': {
    title: 'Images to PDF Converter  -  Combine JPG & PNG to PDF  -  Toolsbar',
    description: 'Combine multiple JPG, PNG, and WebP images into a single organized PDF document. Reorder pages and customize margins locally.',
  },
  'pdf-toolkit': {
    title: 'PDF Toolkit  -  Merge, Split & Compress PDF Files  -  Toolsbar',
    description: 'All-in-one PDF workspace: merge multiple PDFs, extract specific pages, and compress file sizes without cloud storage or third-party servers.',
  },
  'image-toolkit': {
    title: 'Image Toolkit  -  Compress, Resize & Convert Images  -  Toolsbar',
    description: 'Comprehensive image suite: compress file sizes, resize dimensions, and convert between JPG, PNG, and WebP with zero quality degradation.',
  },
  'percentage-calculator': {
    title: 'Percentage Calculator  -  8 Calculation Modes  -  Toolsbar',
    description: 'Calculate percent increase, decrease, discounts, GST tax, and ratios with instant step-by-step mathematical explanations.',
  },
  'age-calculator': {
    title: 'Age Calculator  -  Exact Age, Next Birthday & Zodiac  -  Toolsbar',
    description: 'Calculate your exact age in years, months, days, minutes, and seconds. View days until your next birthday, zodiac signs, and lunar cycles.',
  },
  'finance-calculator': {
    title: 'Finance Calculator  -  Compound Interest, Loan EMI & Growth  -  Toolsbar',
    description: 'Interactive compound interest projector, loan EMI amortization calculator, and simple interest calculator with full repayment schedules.',
  },
  'text-toolkit': {
    title: 'Text Toolkit  -  Word Counter, Text Sorter & Case Converter  -  Toolsbar',
    description: 'All-in-one text workspace: count words and characters, convert cases, deduplicate lines, clean whitespace, and sort alphabetical lists.',
  },
  'json-studio': {
    title: 'JSON Studio  -  Formatter, Validator & Tree Viewer  -  Toolsbar',
    description: 'Format, validate, beautify, and inspect JSON structures with interactive tree view and instant syntax error detection.',
  },
  'qr-generator': {
    title: 'QR Code Generator  -  Custom Colors & Logos  -  Toolsbar',
    description: 'Create high-resolution QR codes for URLs, Wi-Fi passwords, contact cards, and text with custom styling and instant PNG/SVG download.',
  },
  'unit-converter': {
    title: 'Unit Converter  -  Length, Weight, Temp & Storage  -  Toolsbar',
    description: 'Accurate measurement conversion across metric, imperial, digital data storage, and temperature scales.',
  },
  'developer-toolbox': {
    title: 'Developer Toolbox  -  Base64, Hash, UUID & Code Format  -  Toolsbar',
    description: 'Swiss Army knife for programmers: Base64 encoding/decoding, SHA/MD5 hashing, UUID generation, and HTML/CSS/JS formatting.',
  },
};

// 4. AI Categories
const AI_CATEGORIES: Record<string, PageMeta> = {
  'chat-assistants': {
    title: 'Chat & Assistants AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Discover top conversational AI assistants, frontier reasoning models, and multi-modal chatbot platforms reviewed for capabilities and verified pricing.',
  },
  'image-generation': {
    title: 'Image Generation AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Find top AI image generators, concept art models, generative photo editors, and upscale utilities with clear free tier and pricing details.',
  },
  'video-generation': {
    title: 'Video Generation AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Compare text-to-video synthesis, AI motion animation, realistic avatars, and automated video editing platforms.',
  },
  'audio-voice-music': {
    title: 'Audio, Voice & Music AI Tools  -  Voiceover & Song Generation  -  Toolsbar',
    description: 'Explore leading AI voice generators, voice cloning, speech synthesis, audio noise cleanup, and generative music creation software.',
  },
  'coding-development': {
    title: 'Coding & Development AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Discover context-aware AI coding assistants, automated test generators, pair programmers, and full-stack software scaffolders.',
  },
  'writing-content': {
    title: 'Writing & Content AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Explore AI writing assistants, copy editors, proofreading tools, and long-form content generation software.',
  },
  'study-research': {
    title: 'Study & Research AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Find academic AI tools for semantic literature reviews, paper synthesis, citation analysis, and smart study assistants.',
  },
  'design-presentations': {
    title: 'Design & Presentations AI Tools  -  Directory & Guide  -  Toolsbar',
    description: 'Discover AI presentation makers, interactive slide generators, UI design assistants, and visual layout software.',
  },
  'productivity-automation': {
    title: 'Productivity & Automation AI Tools  -  Workflow Builders  -  Toolsbar',
    description: 'Compare autonomous agents, calendar schedulers, meeting recorders, and automated workflow builders.',
  },
  'hr-career': {
    title: 'HR & Career AI Tools  -  Resume Optimization & Job Intelligence  -  Toolsbar',
    description: 'AI resume builders, interview preparation coaches, and job application tracking software.',
  },
  'marketing-business': {
    title: 'Marketing & Business AI Tools  -  Ad Copy & Analytics  -  Toolsbar',
    description: 'Discover generative ad copy creators, market intelligence platforms, and automated social marketing tools.',
  },
  'data-analytics': {
    title: 'Data & Analytics AI Tools  -  Python Sandboxes & Modeling  -  Toolsbar',
    description: 'Explore conversational data analysis, automated charting, statistical modeling, and spreadsheet AI assistants.',
  },
};

// 5. High-profile AI Tools lookup (with intelligent fallback)
const KNOWN_AI_TOOLS: Record<string, { name: string; desc: string }> = {
  chatgpt: { name: 'ChatGPT', desc: 'OpenAI conversational assistant for drafting text, solving problems, coding, and multi-modal analysis.' },
  claude: { name: 'Claude', desc: 'Anthropic frontier AI assistant known for exceptional writing quality, reasoning, code synthesis, and large context windows.' },
  gemini: { name: 'Google Gemini', desc: 'Google multi-modal AI model tightly integrated with Workspace, YouTube, Google Search, and 1M+ token context.' },
  'microsoft-copilot': { name: 'Microsoft Copilot', desc: 'AI productivity companion embedded within Microsoft 365, Windows, and Bing web search.' },
  midjourney: { name: 'Midjourney', desc: 'Frontier text-to-image generator producing hyper-realistic imagery, visual artwork, and cinematic concept designs.' },
  cursor: { name: 'Cursor', desc: 'AI-first code editor built on VS Code with multi-file Composer, inline editing, and context-aware terminal intelligence.' },
  'github-copilot': { name: 'GitHub Copilot', desc: 'AI pair programmer providing inline autocomplete suggestions and multi-file chat directly inside popular IDEs.' },
  'v0-by-vercel': { name: 'v0 by Vercel', desc: 'Generative UI development tool turning text prompts and screenshots into responsive React, Tailwind, and shadcn/ui components.' },
  runway: { name: 'Runway Gen-3', desc: 'Pioneering generative video synthesis suite for high-fidelity text-to-video, image-to-video, and cinematic motion design.' },
  elevenlabs: { name: 'ElevenLabs', desc: 'Industry-standard AI voice generator and voice cloning platform supporting expressive speech across 30+ languages.' },
  suno: { name: 'Suno', desc: 'Generative music platform creating complete broadcast-ready songs with vocals, instrumentals, and lyrics from simple prompts.' },
  udio: { name: 'Udio', desc: 'High-fidelity music generation platform producing rich vocal harmonies, diverse musical genres, and complex arrangements.' },
  perplexity: { name: 'Perplexity AI', desc: 'AI conversational search engine delivering real-time answers with authoritative citations and multi-source verification.' },
  gamma: { name: 'Gamma', desc: 'AI presentation and webpage generator transforming prompts and outlines into polished, interactive slide decks in seconds.' },
  grammarly: { name: 'Grammarly', desc: 'AI writing partner offering tone adjustments, conciseness rewrites, grammatical error correction, and plagiarism checks.' },
  pika: { name: 'Pika', desc: 'Creative AI video platform animating images and creating dynamic video clips with granular motion controls and sound effects.' },
  'canva-magic-studio': { name: 'Canva Magic Studio', desc: 'All-in-one suite of AI graphic design tools for instant presentations, image generation, and background removal.' },
};

function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function resolvePageMeta(pathname: string): PageMeta {
  const cleanPath = pathname.replace(/^\/+/, '').replace(/\/+$/, '');

  // 1. Static Routes
  if (STATIC_ROUTES[cleanPath] !== undefined) {
    return STATIC_ROUTES[cleanPath];
  }

  // 2. /tools/:slug
  const toolMatch = cleanPath.match(/^tools\/([a-z0-9-]+)$/i);
  if (toolMatch) {
    const slug = toolMatch[1].toLowerCase();
    if (FLAGSHIP_TOOLS[slug]) {
      return {
        ...FLAGSHIP_TOOLS[slug],
        canonicalPath: `tools/${slug}`,
      };
    }
    const formatted = formatSlugToTitle(slug);
    return {
      title: `${formatted}  -  Free Online Tool  -  Toolsbar`,
      description: `Use the ${formatted} online directly in your browser. Fast, private, client-side execution with zero data storage.`,
      canonicalPath: `tools/${slug}`,
    };
  }

  // 3. /category/:slug
  const catMatch = cleanPath.match(/^category\/([a-z0-9-]+)$/i);
  if (catMatch) {
    const slug = catMatch[1].toLowerCase();
    if (UTILITY_CATEGORIES[slug]) {
      return {
        ...UTILITY_CATEGORIES[slug],
        canonicalPath: `category/${slug}`,
      };
    }
    const formatted = formatSlugToTitle(slug);
    return {
      title: `${formatted} Tools  -  Toolsbar`,
      description: `Browse free online ${formatted.toLowerCase()} tools running 100% locally in your web browser.`,
      canonicalPath: `category/${slug}`,
    };
  }

  // 4. /ai-tools/:slug (could be AI category or specific AI tool)
  const aiMatch = cleanPath.match(/^ai-tools\/([a-z0-9-]+)$/i);
  if (aiMatch) {
    const slug = aiMatch[1].toLowerCase();
    if (AI_CATEGORIES[slug]) {
      return {
        ...AI_CATEGORIES[slug],
        canonicalPath: `ai-tools/${slug}`,
      };
    }
    if (KNOWN_AI_TOOLS[slug]) {
      const tool = KNOWN_AI_TOOLS[slug];
      return {
        title: `${tool.name}  -  Review, Pricing & Official Access  -  Toolsbar`,
        description: `${tool.desc} Compare verified pricing plans, key strengths, limitations, and direct links on Toolsbar.`,
        canonicalPath: `ai-tools/${slug}`,
      };
    }
    const formatted = formatSlugToTitle(slug);
    return {
      title: `${formatted}  -  Review, Pricing & Access  -  Toolsbar`,
      description: `Explore ${formatted} on Toolsbar. Discover verified pricing, free plan details, capabilities, and visit the official website.`,
      canonicalPath: `ai-tools/${slug}`,
    };
  }

  // 5. 404 Not Found fallback
  return {
    title: 'Page Not Found  -  404  -  Toolsbar',
    description: 'The requested page could not be found on Toolsbar.',
    noindex: true,
  };
}

export const onRequestGet = onRequest;

export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: Record<string, any>;
}): Promise<Response> {
  const { request, next } = context;
  const url = new URL(request.url);

  // Skip static assets, API calls, and non-GET requests immediately
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    /\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|map|json|xml|txt)$/i.test(url.pathname)
  ) {
    return next();
  }

  // Fetch the downstream response (typically the SPA index.html)
  const response = await next();

  // If not HTML (e.g., raw file or error), return directly
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Resolve dynamic metadata for this specific URL
  const meta = resolvePageMeta(url.pathname);
  const canonicalUrl = meta.canonicalPath !== undefined ? `${BASE_URL}/${meta.canonicalPath}`.replace(/\/+$/, '/') : null;

  // Use Cloudflare HTMLRewriter to stream-modify the head tags before transmission
  return new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(element) {
        element.setAttribute('content', meta.description);
      },
    })
    .on('link[rel="canonical"]', {
      element(element) {
        if (canonicalUrl) {
          element.setAttribute('href', canonicalUrl);
        } else {
          element.remove();
        }
      },
    })
    .on('meta[property="og:title"]', {
      element(element) {
        element.setAttribute('content', meta.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(element) {
        element.setAttribute('content', meta.description);
      },
    })
    .on('meta[property="og:url"]', {
      element(element) {
        element.setAttribute('content', canonicalUrl || url.href);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(element) {
        element.setAttribute('content', meta.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(element) {
        element.setAttribute('content', meta.description);
      },
    })
    .on('head', {
      element(element) {
        if (meta.noindex) {
          element.append('<meta name="robots" content="noindex, nofollow" />', { html: true });
        }
      },
    })
    .transform(response);
}
