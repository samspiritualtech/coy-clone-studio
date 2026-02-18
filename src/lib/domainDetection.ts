export type AppDomain = 'customer' | 'seller' | 'admin';

/**
 * Detects which app to render based on hostname or URL path.
 * 
 * Production:
 *   ogura.in / www.ogura.in → customer
 *   sellers.ogura.in → seller
 *   admin.ogura.in → admin
 * 
 * Development/Preview (path-based fallback):
 *   /seller/* → seller
 *   /admin/* → admin
 *   everything else → customer
 */
export function detectDomain(): AppDomain {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Production subdomain detection
  if (hostname.startsWith('sellers.')) return 'seller';
  if (hostname.startsWith('admin.')) return 'admin';

  // Path-based fallback for dev/preview
  if (pathname.startsWith('/seller')) return 'seller';
  if (pathname.startsWith('/admin')) return 'admin';

  return 'customer';
}

/**
 * Strips the domain prefix from the path for internal routing.
 * e.g. /seller/dashboard → /dashboard
 *      /admin/products → /products
 */
export function getBasePath(domain: AppDomain): string {
  if (domain === 'seller') return '/seller';
  if (domain === 'admin') return '/admin';
  return '';
}

/**
 * Returns true when the app is accessed via a production subdomain
 * (sellers.* or admin.*) rather than path-based dev routing.
 */
export function isSubdomain(): boolean {
  const hostname = window.location.hostname;
  return hostname.startsWith('sellers.') || hostname.startsWith('admin.');
}
