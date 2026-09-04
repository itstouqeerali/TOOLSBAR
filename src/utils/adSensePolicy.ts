/**
 * Central AdSense eligibility policy for Toolsbar.
 * Ads load only on publisher-content routes and are removed on private,
 * administrative, error, empty-state, and unfinished screens.
 */

export const ADSENSE_PUBLISHER_ID = 'ca-pub-3775855691685423';

const NON_AD_ROUTE_PREFIXES = [
  '/account',
  '/profile',
  '/favorites',
  '/recent',
  '/admin',
  '/auth',
  '/login',
  '/signup',
  '/register',
] as const;

const NON_AD_EXACT_ROUTES = [
  '/404',
  '/tools/color-palette-picker',
] as const;

function normalizePath(path: string): string {
  const withoutQuery = path.toLowerCase().split('?')[0].split('#')[0];
  const withLeadingSlash = withoutQuery.startsWith('/') ? withoutQuery : '/' + withoutQuery;
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

export function isScreenEligibleForAds(
  path: string,
  options?: {
    hasSubstantialContent?: boolean;
    isEmptyState?: boolean;
    isAdminOrAuth?: boolean;
    isNotFound?: boolean;
    isUnderConstruction?: boolean;
  }
): boolean {
  if (
    options?.isAdminOrAuth ||
    options?.isEmptyState ||
    options?.isNotFound ||
    options?.isUnderConstruction ||
    options?.hasSubstantialContent === false
  ) {
    return false;
  }

  const normalized = normalizePath(path);
  if (NON_AD_EXACT_ROUTES.includes(normalized as (typeof NON_AD_EXACT_ROUTES)[number])) {
    return false;
  }

  return !NON_AD_ROUTE_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(prefix + '/')
  );
}

function setRobotsNoIndex(enabled: boolean): void {
  let robots = document.head.querySelector<HTMLMetaElement>('meta[data-toolsbar-route-robots="true"]');

  if (enabled) {
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.dataset.toolsbarRouteRobots = 'true';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';
  } else {
    robots?.remove();
  }
}

function removeAdSense(): void {
  document
    .querySelectorAll<HTMLScriptElement>(
      'script[data-toolsbar-adsense="true"], script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    )
    .forEach((node) => node.remove());

  document
    .querySelectorAll<HTMLElement>('ins.adsbygoogle, [data-ad-status], [id^="google_ads_"]')
    .forEach((node) => node.remove());
}

function loadAdSense(): void {
  const existing = document.head.querySelector<HTMLScriptElement>(
    'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
  );
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
    ADSENSE_PUBLISHER_ID;
  document.head.appendChild(script);
}

export function applyAdSenseRoutePolicy(
  path: string,
  options?: Parameters<typeof isScreenEligibleForAds>[1]
): void {
  const eligible = isScreenEligibleForAds(path, options);

  if (eligible) {
    document.body.removeAttribute('data-no-ads');
    setRobotsNoIndex(false);
    loadAdSense();
  } else {
    document.body.setAttribute('data-no-ads', 'true');
    setRobotsNoIndex(true);
    removeAdSense();
  }
}
