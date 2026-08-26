import React from 'react';

export type CategoryId = 
  | 'text'
  | 'calculators'
  | 'developer'
  | 'converters'
  | 'generators'
  | 'qr'
  | 'datetime'
  | 'images'
  | 'pdf'
  | 'colors';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  icon: string;
  description: string;
  toolCount: number;
  colorAccent: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolSEO {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  howToUse: string[];
  faq: ToolFaq[];
  educationalNotes?: string[];
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  description: string;
  shortDesc: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  badge?: 'Popular' | 'New' | 'Essential' | 'Updated' | 'Beta' | 'Coming Soon';
  isImplemented: boolean;
  status: 'ready' | 'coming-soon';
  relatedToolSlugs: string[];
  seo: ToolSEO;
  component?: React.ComponentType;
}

export type ThemeMode = 'dark' | 'light';

export interface SearchResult {
  tool: Tool;
  matchedField: 'name' | 'description' | 'keywords' | 'category';
  score: number;
}
