/**
 * Canonical site URL used for metadata, sitemap, and robots.
 * Set NEXT_PUBLIC_SITE_URL in the environment for preview/staging deployments.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://a2zacademy.co.in").replace(
  /\/+$/,
  ""
);

/** Build an absolute URL from a site-relative path ("/register" → "https://…/register"). */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
