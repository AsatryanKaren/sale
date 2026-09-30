import type { Store } from '@saleradar/contracts';

/** Subdomains that host a shop but share the brand's main favicon. */
const STRIPPED_SUBDOMAINS = ['www.', 'shop.', 'store.', 'm.'];

export function getStoreDomain(websiteUrl: string): string | null {
  let hostname: string;
  try {
    hostname = new URL(websiteUrl).hostname.toLowerCase();
  } catch {
    return null;
  }

  for (const prefix of STRIPPED_SUBDOMAINS) {
    if (hostname.startsWith(prefix) && hostname.split('.').length > 2) {
      return hostname.slice(prefix.length);
    }
  }

  return hostname;
}

/**
 * Logo URLs to try in order: the curated `logoUrl` first, then public favicon
 * services keyed by the store's domain. The avatar falls back to a monogram
 * when every candidate fails.
 */
export function getStoreLogoCandidates(store: Pick<Store, 'websiteUrl' | 'logoUrl'>): string[] {
  const candidates: string[] = [];

  if (store.logoUrl) {
    candidates.push(store.logoUrl);
  }

  const domain = getStoreDomain(store.websiteUrl);
  if (domain) {
    const encoded = encodeURIComponent(domain);
    candidates.push(`https://www.google.com/s2/favicons?domain=${encoded}&sz=128`);
    candidates.push(`https://icons.duckduckgo.com/ip3/${encoded}.ico`);
  }

  return candidates;
}
