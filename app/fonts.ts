import localFont from "next/font/local";

/**
 * Puvi — the A2Z Academy brand typeface (same family as the reference site).
 * Loaded via next/font so it is self-hosted, preloaded, and paired with a
 * metric-adjusted fallback to avoid layout shift on first paint.
 */
export const puvi = localFont({
  src: [
    { path: "./fonts/ZohoPuvi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ZohoPuvi-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ZohoPuvi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-puvi",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  preload: true,
});
