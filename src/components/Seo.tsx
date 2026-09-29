import { Helmet } from "react-helmet-async";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const SITE_NAME = "A2Z Academy";
const DEFAULT_DESCRIPTION =
  "A2Z Academy empowers institutes with tech-based training. Explore the A2Z Academy Tech-Based Hackathon — solve real-world problems, register your team of 2–4 members, and build innovative solutions.";

interface SeoProps {
  /** Page title without the site suffix; the suffix is appended automatically. */
  title: string;
  description?: string;
  /** Site-relative canonical path, e.g. "/about". */
  path: string;
  /** Set on the 404 page so it is never indexed. */
  noIndex?: boolean;
}

/**
 * Per-page document head. Mirrors the metadata the Next.js version emitted for
 * each route: title template, description, canonical URL, Open Graph, Twitter
 * card, and robots directives.
 */
export default function Seo({ title, description = DEFAULT_DESCRIPTION, path, noIndex }: SeoProps) {
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteUrl("/og-image.png")} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="A2Z Academy — Empowering Institutes with Tech-Based Training" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteUrl("/og-image.png")} />
      {noIndex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}
      <link rel="alternate" hrefLang="en-IN" href={url} />
      <meta name="application-name" content={SITE_NAME} />
      <meta property="article:publisher" content={SITE_URL} />
    </Helmet>
  );
}
