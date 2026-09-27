import type { Metadata } from "next";
import { SectionWrapper, SectionTitle } from "@/components/ui/Section";
import ImportantNotice from "@/components/ImportantNotice";
import ProblemStatementsList from "@/components/ProblemStatementsList";

export const metadata: Metadata = {
  title: "Problem Statements",
  description:
    "Problem statements for the A2Z Academy Tech-Based Hackathon. Browse the published themes and domains — no selection is required during registration.",
};

export default function ProblemStatementsPage() {
  return (
    <>
      <SectionWrapper className="pt-12 md:pt-16">
        <SectionTitle
          title="Problem Statements"
          subtitle="Browse the published problem statements to plan your solution. You do not select a problem while registering — instructions for each round are shared in the official WhatsApp group."
        />

        <div className="mx-auto max-w-5xl">
          <ProblemStatementsList />
        </div>
      </SectionWrapper>

      <ImportantNotice />
    </>
  );
}
