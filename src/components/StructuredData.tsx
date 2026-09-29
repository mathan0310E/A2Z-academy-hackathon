import { absoluteUrl, SITE_URL } from "@/lib/site";
import { siteConfig } from "@/lib/content";

/**
 * Site-wide JSON-LD (Organization + WebSite graph), mirroring the reference
 * site's structured-data approach so search engines can build a knowledge panel
 * and sitelinks. Rendered once in the root layout.
 */
export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.name,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo/logo.jpeg"),
        },
        description: siteConfig.description,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.contact.location,
          addressCountry: "IN",
        },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored in-repo, so there is no user input to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
