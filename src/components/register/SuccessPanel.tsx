
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, CheckCircle2, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/Section";
import { usePortalContent } from "@/contexts/PortalContentContext";

export interface RegistrationResult {
  registrationId: string;
  teamName: string;
  memberCount: number;
  leaderName: string;
  leaderEmail: string;
}

export default function SuccessPanel({ result }: { result: RegistrationResult }) {
  const [copied, setCopied] = useState(false);
  const { whatsappUrl: whatsAppUrl } = usePortalContent();

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(result.registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <GlassCard className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-soft text-brand-green-ink">
        <CheckCircle2 className="h-7 w-7" />
      </div>

      <h2 className="text-2xl font-extrabold text-brand-ink">Registration successful</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-brand-muted">
        Team <span className="font-semibold text-brand-ink">{result.teamName}</span> is registered for
        the A2Z Academy Tech-Based Hackathon with {result.memberCount} members.
      </p>

      <div className="mx-auto mt-6 max-w-md">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-muted">
          Your Registration ID
        </p>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-brand-green/40 bg-brand-green-soft px-4 py-3">
          <span className="font-mono text-lg font-bold tracking-wider text-brand-green-ink">
            {result.registrationId}
          </span>
          <button
            type="button"
            onClick={copyId}
            aria-label="Copy registration ID"
            className="rounded-md p-1.5 text-brand-muted transition-colors hover:bg-brand-green-soft hover:text-brand-green-ink"
          >
            {copied ? <Check className="h-4 w-4 text-brand-green-ink" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 text-xs text-brand-muted">
          Save this ID — you will need it for all future communication with the organisers.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-lg space-y-2 rounded-lg border border-input bg-brand-surface p-4 text-left text-sm text-brand-muted">
        <p>
          <span className="text-brand-ink">Confirmation email:</span> sent to {result.leaderEmail}{" "}
          (leader — {result.leaderName}) and every other member.
        </p>
        <p>
          If an email does not arrive, your registration is still valid — check spam or contact the
          organisers.
        </p>
        <p>
          <span className="text-brand-ink">Next step:</span> join the official WhatsApp group, where
          round instructions, PPT submission details, and shortlisting updates are announced.
        </p>
      </div>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {whatsAppUrl ? (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Join Official WhatsApp Group
          </a>
        ) : (
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 text-sm font-semibold text-brand-ink-strong shadow-brand"
          >
            <MessageCircle className="h-4 w-4" />
            Get the WhatsApp group link
          </Link>
        )}
        <Link
          to="/rounds"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-green bg-white px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-green-soft"
        >
          View the rounds
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}
