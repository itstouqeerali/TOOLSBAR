import { Tool } from '../types';
import { Category } from '../types';

const getBaseUrl = (): string => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv && metaEnv.VITE_SITE_URL) {
      return String(metaEnv.VITE_SITE_URL).replace(/\/+$/, '');
    }
  } catch {
    // Fallback for non-Vite execution contexts
  }
  return 'https://toolsbar.site';
};

export const SITE_CONFIG = {
  name: 'Toolsbar',
  title: 'Toolsbar — Everything you need. In one place.',
  description: 'Fast, simple, browser-first tools for everyday tasks. Calculators, text utilities, JSON formatter, QR generator, unit converter, and more. Private, zero latency, 100% client-side.',
  get baseUrl() {
    return getBaseUrl();
  },
  get defaultImage() {
    return `${getBaseUrl()}/favicon.svg`;
  },
  twitterHandle: '@toolsbar',
};

export interface PageSEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  jsonLd?: Record<string, any>[];
}

/**
 * Returns a fully-qualified canonical URL with no hash fragments
 */
export function getCanonicalUrl(path: string): string {
  const clean = path.replace(/^(\/?#|\/)+/, '').replace(/\/+$/, '');
  return clean ? `${SITE_CONFIG.baseUrl}/${clean}` : `${SITE_CONFIG.baseUrl}/`;
}

/**
 * Generates SEO metadata and JSON-LD schema for a specific Tool
 */
export function getToolSEOMetadata(tool: Tool, category?: Category): PageSEOMetadata {
  const canonicalUrl = getCanonicalUrl(`tools/${tool.slug}`);
  const title = tool.seo?.title || `${tool.name} — Toolsbar`;
  const description = tool.seo?.description || tool.shortDesc || tool.description;
  const keywords = tool.seo?.keywords || tool.keywords || [];

  const jsonLd: Record<string, any>[] = [
    // 1. WebApplication / SoftwareApplication schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      headline: tool.seo?.h1 || tool.name,
      description: description,
      url: canonicalUrl,
      applicationCategory: category?.name || tool.category,
      operatingSystem: 'All (Web Browser)',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      creator: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
      },
    },

    // 2. BreadcrumbList schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_CONFIG.baseUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category?.name || 'Categories',
          item: category ? getCanonicalUrl(`category/${category.id}`) : getCanonicalUrl('categories'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: canonicalUrl,
        },
      ],
    },
  ];

  // 3. FAQ schema if FAQs exist
  if (tool.seo?.faq && tool.seo.faq.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.seo.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return {
    title,
    description,
    keywords,
    canonicalPath: `tools/${tool.slug}`,
    ogType: 'website',
    jsonLd,
  };
}

/**
 * Generates SEO metadata and JSON-LD schema for a Category
 */
export function getCategorySEOMetadata(category: Category, toolCount: number): PageSEOMetadata {
  const canonicalUrl = getCanonicalUrl(`category/${category.id}`);
  const title = `${category.name} Utilities & Tools — Toolsbar`;
  const description = `Explore ${toolCount} free, browser-first ${category.name.toLowerCase()} tools on Toolsbar. ${category.description} 100% private with instant results.`;
  const keywords = [category.name.toLowerCase(), `${category.name.toLowerCase()} tools`, `${category.name.toLowerCase()} online`, 'toolsbar'];

  const jsonLd: Record<string, any>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} Tools`,
      description: description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_CONFIG.baseUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: getCanonicalUrl('categories'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return {
    title,
    description,
    keywords,
    canonicalPath: `category/${category.id}`,
    ogType: 'website',
    jsonLd,
  };
}

/**
 * Generates SEO metadata for static primary routes
 */
export function getStaticRouteSEOMetadata(route: '' | 'tools' | 'categories' | 'popular' | 'privacy' | 'terms' | 'contact'): PageSEOMetadata {
  switch (route) {
    case 'privacy':
      return {
        title: 'Privacy Policy — Toolsbar',
        description: 'Read the Toolsbar Privacy Policy. Learn about our 100% browser-first client-side data processing, user authentication, and privacy protections.',
        keywords: ['privacy policy', 'client-side privacy', 'data security', 'browser utilities privacy', 'toolsbar privacy'],
        canonicalPath: 'privacy',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy — Toolsbar',
            description: 'Comprehensive Privacy Policy detailing client-side computing and data protections.',
            url: getCanonicalUrl('privacy'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: getCanonicalUrl('privacy') },
            ],
          },
        ],
      };

    case 'terms':
      return {
        title: 'Terms of Service — Toolsbar',
        description: 'Review the Terms of Service for using Toolsbar utilities, calculators, developer formatters, and browser-based productivity tools.',
        keywords: ['terms of service', 'terms of use', 'legal agreement', 'disclaimer', 'toolsbar terms'],
        canonicalPath: 'terms',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terms of Service — Toolsbar',
            description: 'Terms of Service and conditions for using Toolsbar.',
            url: getCanonicalUrl('terms'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: getCanonicalUrl('terms') },
            ],
          },
        ],
      };

    case 'contact':
      return {
        title: 'Contact Us — Support & Inquiries — Toolsbar',
        description: 'Get in touch with the Toolsbar team. Send inquiries, report bugs, suggest new tools, or ask questions about our browser-first utilities.',
        keywords: ['contact toolsbar', 'support', 'tool suggestions', 'bug report', 'feedback'],
        canonicalPath: 'contact',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Us — Toolsbar',
            description: 'Contact and support page for Toolsbar.',
            url: getCanonicalUrl('contact'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Contact Us', item: getCanonicalUrl('contact') },
            ],
          },
        ],
      };

    case 'tools':
      return {
        title: 'All Digital Utilities & Online Tools Directory — Toolsbar',
        description: 'Browse all 43 instant, private browser utilities on Toolsbar. Calculators, text formatting, image converters, PDF tools, code minifiers, cryptographic hashing, and QR generators.',
        keywords: ['online tools directory', 'free utilities', 'calculators', 'developer tools', 'text tools', 'unit converters', 'pdf tools', 'image tools'],
        canonicalPath: 'tools',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'All Digital Utilities — Toolsbar',
            description: 'Comprehensive directory of instant browser-based productivity tools.',
            url: getCanonicalUrl('tools'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'All Tools', item: getCanonicalUrl('tools') },
            ],
          },
        ],
      };

    case 'categories':
      return {
        title: 'Tool Categories — Browse Utilities by Category — Toolsbar',
        description: 'Explore Toolsbar categories: Calculators, Date & Time, Text Processing, Developer Utilities, Unit Converters, Generators, and QR Tools.',
        keywords: ['tool categories', 'math tools', 'text converters', 'developer utilities', 'qr generators'],
        canonicalPath: 'categories',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Tool Categories — Toolsbar',
            description: 'Browse digital tools organized by functional category.',
            url: getCanonicalUrl('categories'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Categories', item: getCanonicalUrl('categories') },
            ],
          },
        ],
      };

    case 'popular':
      return {
        title: 'Most Popular Online Tools & Utilities — Toolsbar',
        description: 'Discover the most frequently used tools on Toolsbar, including the Percentage Calculator, Age Calculator, Word Counter, JSON Formatter, and QR Generator.',
        keywords: ['popular online tools', 'trending utilities', 'top calculators', 'most used web tools'],
        canonicalPath: 'popular',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Most Popular Tools — Toolsbar',
            description: 'Most utilized instant browser utilities on Toolsbar.',
            url: getCanonicalUrl('popular'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.baseUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Popular Tools', item: getCanonicalUrl('popular') },
            ],
          },
        ],
      };

    case '':
    default:
      return {
        title: 'Toolsbar — Everything you need. In one place.',
        description: 'Fast, simple tools for the everyday things you need to get done online. Private, zero latency, and processed 100% in your browser.',
        keywords: ['online tools', 'browser utilities', 'calculators', 'text tools', 'unit converter', 'qr generator', 'json formatter', 'privacy friendly tools'],
        canonicalPath: '',
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: `${SITE_CONFIG.baseUrl}/`,
            description: SITE_CONFIG.description,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_CONFIG.baseUrl}/tools?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_CONFIG.name,
            url: `${SITE_CONFIG.baseUrl}/`,
            logo: `${SITE_CONFIG.baseUrl}/favicon.svg`,
          },
        ],
      };
  }
}

/**
 * Injects / updates DOM head tags for dynamic SEO
 */
export function applyPageSEO(meta: PageSEOMetadata): void {
  // 1. Update Title
  document.title = meta.title;

  // Helper to get or create a meta tag
  const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, attributeValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to set link tags (like canonical)
  const setLinkTag = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  const canonicalUrl = getCanonicalUrl(meta.canonicalPath);

  // Standard Meta Tags
  setMetaTag('name', 'description', meta.description);
  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('name', 'keywords', meta.keywords.join(', '));
  }
  setLinkTag('canonical', canonicalUrl);

  // Open Graph
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:site_name', SITE_CONFIG.name);
  setMetaTag('property', 'og:image', meta.ogImage || SITE_CONFIG.defaultImage);

  // Twitter Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);
  setMetaTag('name', 'twitter:image', meta.ogImage || SITE_CONFIG.defaultImage);

  // JSON-LD Structured Data
  let scriptEl = document.getElementById('toolsbar-jsonld') as HTMLScriptElement | null;
  if (meta.jsonLd && meta.jsonLd.length > 0) {
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'toolsbar-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(
      meta.jsonLd.length === 1 ? meta.jsonLd[0] : { '@context': 'https://schema.org', '@graph': meta.jsonLd },
      null,
      2
    );
  } else if (scriptEl) {
    scriptEl.remove();
  }
}
