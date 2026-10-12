export type AiPricingType = 'free' | 'freemium' | 'paid' | 'free-trial' | 'contact-sales';

export type AiPlatform =
  | 'Web'
  | 'macOS'
  | 'Windows'
  | 'iOS'
  | 'Android'
  | 'API'
  | 'Browser Extension'
  | 'Chrome Extension'
  | 'Linux'
  | 'Discord'
  | 'Google Workspace'
  | 'Google Docs'
  | 'WordPress'
  | 'Word Add-in'
  | 'HubSpot App'
  | 'Marketo';

export interface AiCategoryEditorial {
  overview: string;
  commonUseCases: string[];
  selectionGuide: string[];
}

export interface AiCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  shortDesc: string;
  colorAccent: string;
  editorial: AiCategoryEditorial;
}

export interface AiToolFaq {
  question: string;
  answer: string;
}

export interface AiTool {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  officialUrl: string;
  shortDescription: string;
  fullDescription: string;
  primaryCategory: string; // matches AiCategory.slug
  categories: string[]; // multi-category support
  tags: string[];
  bestFor: string[];
  pricingType: AiPricingType;
  startingPrice?: string; // e.g. "$20/mo", "$10/mo" or empty
  currency?: string; // e.g. "USD"
  pricingSummary?: string; // Concise factual description
  pricingUrl?: string; // Direct link to official pricing page if available
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  platforms: AiPlatform[];
  keyFeatures: string[];
  useCases: string[];
  strengths: string[];
  limitations: string[];
  targetAudience?: string[];
  alternatives?: string[]; // Array of slugs of related AI tools
  faq?: AiToolFaq[];
  dateAdded: string; // ISO date string e.g. "2026-09-15"
  lastVerifiedAt: string; // e.g. "September 2026"
  lastPricingVerifiedAt?: string;
  isFeatured?: boolean;
  isPublished: boolean; // draft vs published
  seoTitle?: string;
  seoDescription?: string;
}
