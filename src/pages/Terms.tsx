import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/content";

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="The terms governing your use of the A2Z Academy website and participation in the A2Z Academy Tech-Based Hackathon."
      path="/terms"
      effective={siteConfig.legal.termsEffective}
      sections={[
        {
          heading: "Acceptance of these terms",
          body: (
            <p>
              By accessing this website or registering for the A2Z Academy Tech-Based Hackathon you
              agree to these Terms. If you do not agree, please do not use the site or register.
            </p>
          ),
        },
        {
          heading: "About this platform",
          body: (
            <p>
              This website is for information and registration only. PPT submission, round
              scheduling, judging, evaluation, and all offline activities are conducted outside
              this platform and are communicated through the official WhatsApp group.
            </p>
          ),
        },
        {
          heading: "User responsibility",
          body: (
            <p>
              All information you submit — team details, member names, contact information, and
              college or department — must be accurate and complete. Misrepresentation, duplicate
              registrations, or impersonation may result in disqualification or suspension.
            </p>
          ),
        },
        {
          heading: "Team composition and eligibility",
          body: (
            <p>
              Teams must have between two and four members (Duo, Tri, or Squad) and each member
              must use a unique email address. Teams must comply with the guidelines published on
              this site, including eligibility and conduct requirements.
            </p>
          ),
        },
        {
          heading: "Fees",
          body: (
            <p>
              Round 3, the offline hackathon, carries a participation fee of ₹250 per head. Any
              fee, when applicable, is communicated in advance through the official WhatsApp group
              and is not collected through this website.
            </p>
          ),
        },
        {
          heading: "Changes to the programme",
          body: (
            <p>
              A2Z Academy may modify round formats, schedules, shortlisting numbers, or problem
              statements where necessary. Material changes will be announced through the official
              WhatsApp group.
            </p>
          ),
        },
        {
          heading: "Limitation of liability",
          body: (
            <p>
              The website and its content are provided on an &quot;as is&quot; basis. A2Z Academy
              is not liable for any indirect or consequential loss arising from use of this site
              or participation in the hackathon.
            </p>
          ),
        },
        {
          heading: "Disputes",
          body: (
            <p>
              These Terms are governed by the laws of India and are subject to the exclusive
              jurisdiction of the courts in Tamil Nadu, India.
            </p>
          ),
        },
      ]}
    />
  );
}
