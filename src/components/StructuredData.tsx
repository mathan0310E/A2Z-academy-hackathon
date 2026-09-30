import { absoluteUrl, SITE_URL } from "@/lib/site";
import { siteConfig } from "@/lib/content";

/**
 * Site-wide JSON-LD graph (Organization + WebSite + WebPage) plus a Hackathon
 * `Event` node, mirroring the reference site's structured-data approach so
 * search engines can build a knowledge panel, sitelinks, and an event rich
 * result. Rendered once in the root layout.
 */
export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.name,
        alternateName: ["A2Z Academy", "A2Z Training Academy", "A2Z"],
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
        sameAs: ["https://www.a2zacademy.co.in/"],
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
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: `${siteConfig.name} | ${siteConfig.tagline}`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        description: siteConfig.description,
        inLanguage: "en-IN",
      },
      {
        "@type": "Event",
        "@id": `${SITE_URL}/#hackathon`,
        name: siteConfig.hackathon,
        description: siteConfig.description,
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        organizer: { "@id": `${SITE_URL}/#organization` },
        location: {
          "@type": "Place",
          name: siteConfig.hackathonInfo.round3Venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.contact.location,
            addressCountry: "IN",
          },
        },
        isAccessibleForFree: false,
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
