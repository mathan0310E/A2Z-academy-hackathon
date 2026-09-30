
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Layers, Loader2, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { fetchPublishedProblemStatements } from "@/lib/firestore";
import type { ProblemStatement } from "@/types";

/**
 * Published problem statements live in Firestore (managed by the admin portal),
 * so this must render client-side. Firebase/App Check may be unconfigured in
 * local development — every failure path resolves to an empty list, and this
 * component shows a friendly empty state rather than an error.
 */
export default function ProblemStatementsList() {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchPublishedProblemStatements()
      .then((items) => {
        if (active) setProblems(items);
      })
      .catch((error) => {
        console.warn("Problem statements unavailable:", error);
        if (active) setProblems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-brand-muted">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green-ink" />
        <p className="text-sm">Loading published problem statements…</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <GlassCard className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/10 text-brand-green-ink">
          <Layers className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-ink">
          Problem statements are not published yet
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-brand-muted">
          The A2Z Academy team publishes problem statements here once they are finalised. You can
          still register right now — registration is independent of problem selection, and every
          update is announced in the official WhatsApp group.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
        >
          Register without a problem statement
          <ArrowRight className="h-4 w-4" />
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-brand-muted">
        <Sparkles className="h-4 w-4 text-brand-green-ink" />
        <span>
          {problems.length} published problem statement{problems.length === 1 ? "" : "s"}
        </span>
      </div>

      <RevealGroup className="grid gap-4 md:grid-cols-2">
        {problems.map((problem) => (
          <RevealItem key={problem.problemId}>
            <GlassCard className="h-full">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-brand-green/40 bg-brand-green-soft px-3 py-1 text-xs font-semibold text-brand-green-ink">
                  {problem.domain || "General"}
                </span>
                <span className="rounded-full border border-brand-navy/15 px-3 py-1 text-xs text-brand-muted">
                  ID: {problem.problemId}
                </span>
              </div>

              <h2 className="text-lg font-bold text-brand-ink">{problem.title}</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
                {problem.description}
              </p>

              {problem.requirements && (
                <div className="mt-4">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-muted">
                    <FileText className="h-3.5 w-3.5" />
                    Requirements
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
                    {problem.requirements}
                  </p>
                </div>
              )}

              {problem.additionalInfo && (
                <div className="mt-4 rounded-lg border border-brand-navy/10 bg-brand-surface p-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Additional info
                  </h3>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
                    {problem.additionalInfo}
                  </p>
                </div>
              )}
            </GlassCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
