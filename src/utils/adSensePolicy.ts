/**
 * AdSense Content-Quality & Screen Eligibility Policy for Toolsbar
 * 
 * In accordance with Google AdSense Publisher Policies:
 * Google-served ads must NOT be shown on screens that have little/no publisher content
 * or are primarily behavioral, navigation, transactional, or administrative screens.
 */

export const NON_AD_ELIGIBLE_SCREENS = [
  'auth',            // Sign In, Register, Password Reset modals or screens
  'admin',           // Administration dashboard and metrics screens
  'account',         // User profile, preferences, and security settings
  'profile',         // Account management
  'favorites',       // Personal saved tools list
  'recent',          // Personal recently used tools list
  '404',             // Not Found / missing route screens
  'search-empty',    // Empty search results states
  'loading',         // Blank loading skeletons and transition states
  'privacy',         // Legal policy documentation
  'terms',           // Terms of service documentation
  'contact'          // Contact and feedback forms
] as const;

export type NonAdEligibleScreen = typeof NON_AD_ELIGIBLE_SCREENS[number];

/**
 * Checks whether a given view path or screen state qualifies for Google-served ad units.
 * AdSense policy requires substantial original publisher content.
 */
export function isScreenEligibleForAds(
  path: string,
  options?: {
    hasSubstantialContent?: boolean;
    isEmptyState?: boolean;
    isAdminOrAuth?: boolean;
  }
): boolean {
  if (options?.isAdminOrAuth || options?.isEmptyState) {
    return false;
  }

  const cleanPath = path.toLowerCase().replace(/^\/+/, '').split('/')[0];

  // Disqualify explicitly forbidden screen types
  const isDisqualified = NON_AD_ELIGIBLE_SCREENS.some((screen) => cleanPath === screen);
  if (isDisqualified) {
    return false;
  }

  // Only content-rich publisher surfaces qualify:
  // - Valid tool pages with dedicated publisher guides
  // - Category detail pages with comprehensive editorial overviews
  // - Directory pages with full tool listings
  return options?.hasSubstantialContent ?? true;
}
