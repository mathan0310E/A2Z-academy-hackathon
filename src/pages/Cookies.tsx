import { Link } from "react-router-dom";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/content";

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="The cookies and browser storage A2Z Academy uses on this website, what they do, and how you can control them."
      path="/cookies"
      effective={siteConfig.legal.cookiesEffective}
      sections={[
        {
          heading: "What cookies are",
          body: (
            <p>
              Cookies are small text files a website stores in your browser. We also use browser
              storage, which works in a similar way. They let a site remember your actions and
              preferences between visits.
            </p>
          ),
        },
        {
          heading: "Strictly necessary",
          body: (
            <p>
              These keep the site working — for example, remembering your cookie choice so the
              consent banner does not reappear on every page. They cannot be switched off without
              breaking core functionality.
            </p>
          ),
        },
        {
          heading: "Analytics and performance",
          body: (
            <p>
              When you accept cookies, we may use analytics to understand how visitors use the
              site — which pages are popular and where people run into trouble. This data is
              aggregated and is not used to identify you personally.
            </p>
          ),
        },
        {
          heading: "Personalisation",
          body: (
            <p>
              With your consent, we may remember preferences such as your last viewed section so
              the site feels more relevant on a return visit.
            </p>
          ),
        },
        {
          heading: "Managing your choice",
          body: (
            <>
              <p>
                You decide when the consent banner first appears. Choosing &quot;Decline&quot;
                limits us to strictly necessary storage; &quot;Accept all&quot; also enables
                analytics and personalisation.
              </p>
              <p>
                You can change your mind at any time by clearing this site&apos;s data in your
                browser settings — the banner will then appear again on your next visit. Most
                browsers also let you block cookies entirely, though parts of the site may stop
                working correctly.
              </p>
            </>
          ),
        },
        {
          heading: "Related policies",
          body: (
            <p>
              For details of what personal data we collect and how we use it, see our{" "}
              <Link to="/privacy" className="font-semibold text-brand-green hover:underline">
                Privacy Policy
              </Link>
              . Data-protection requests can be made through our contact form.
            </p>
          ),
        },
      ]}
    />
  );
}
