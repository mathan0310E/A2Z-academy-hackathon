import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/content";

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How A2Z Academy collects, uses, and protects your data — including the information submitted through hackathon registration, in line with India's DPDPA 2023."
      path="/privacy"
      effective={siteConfig.legal.privacyEffective}
      sections={[
        {
          heading: "What we collect",
          body: (
            <p>
              When you register for the A2Z Academy Tech-Based Hackathon we collect your team name
              and team type, and for each member: name, email address, phone number, college or
              institution, department, and year of study. We also record basic usage logs to keep
              the service reliable and to improve it.
            </p>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <>
              <p>
                Your details are used to process and confirm your registration, generate your
                Registration ID, communicate hackathon updates, and issue participation
                certificates. Organisers may contact the team leader about round scheduling and
                results.
              </p>
              <p>
                We do not sell your personal data. Information is shared only with the A2Z Academy
                team running the hackathon and the service providers needed to operate it (for
                example, our email delivery provider).
              </p>
            </>
          ),
        },
        {
          heading: "Cookies and similar technologies",
          body: (
            <p>
              We use a small number of cookies and browser storage entries to keep the site working
              and to remember your choices. See our Cookie Policy for the full list and how to
              control them.
            </p>
          ),
        },
        {
          heading: "Data retention",
          body: (
            <p>
              Registration records are retained for the duration of the hackathon and for as long
              as needed to issue certificates and meet our record-keeping obligations. After that
              they are deleted or anonymised.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You can request access to, correction of, or deletion of your personal data at any
              time. Reach out through our contact form with your Registration ID and we will action
              your request.
            </p>
          ),
        },
        {
          heading: "Compliance",
          body: (
            <p>
              We follow India&apos;s Digital Personal Data Protection Act (DPDPA) 2023. If you
              believe your data has been handled incorrectly, contact us and we will investigate.
            </p>
          ),
        },
      ]}
    />
  );
}
