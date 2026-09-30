/**
 * Canonical site URL used for metadata, sitemap, and robots.
 * Set VITE_SITE_URL in the environment for preview/staging deployments.
 *
 * `import.meta.env` only exists in the Vite client bundle, so the Node server
 * (which imports this module for the sitemap/robots routes) falls back to
 * `process.env`.
 */
const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const nodeEnv = typeof process !== "undefined" ? process.env : undefined;

export const SITE_URL = (
  viteEnv?.VITE_SITE_URL ||
  nodeEnv?.VITE_SITE_URL ||
  "https://www.a2zacademy.co.in"
).replace(/\/+$/, "");

/** Build an absolute URL from a site-relative path ("/register" → "https://…/register"). */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
