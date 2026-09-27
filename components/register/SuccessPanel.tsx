"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, CheckCircle2, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/Section";

export interface RegistrationResult {
  registrationId: string;
  teamName: string;
  memberCount: number;
  leaderName: string;
  leaderEmail: string;
}

export default function SuccessPanel({ result }: { result: RegistrationResult }) {
  const [copied, setCopied] = useState(false);
  const whatsAppUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "";

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
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400">
        <CheckCircle2 className="h-7 w-7" />
      </div>

      <h2 className="text-2xl font-extrabold text-white">Registration successful</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">
        Team <span className="font-semibold text-white">{result.teamName}</span> is registered for
        the A2Z Academy Tech-Based Hackathon with {result.memberCount} members.
      </p>

      <div className="mx-auto mt-6 max-w-md">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Your Registration ID
        </p>
        <div className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 py-3">
          <span className="font-mono text-lg font-bold tracking-wider text-cyan-300">
            {result.registrationId}
          </span>
          <button
            type="button"
            onClick={copyId}
            aria-label="Copy registration ID"
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-cyan-300"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Save this ID — you will need it for all future communication with the organisers.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-lg space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left text-sm text-gray-400">
        <p>
          <span className="text-gray-200">Confirmation email:</span> sent to {result.leaderEmail}{" "}
          (leader — {result.leaderName}) and every other member.
        </p>
        <p>
          If an email does not arrive, your registration is still valid — check spam or contact the
          organisers.
        </p>
        <p>
          <span className="text-gray-200">Next step:</span> join the official WhatsApp group, where
          round instructions, PPT submission details, and shortlisting updates are announced.
        </p>
      </div>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {whatsAppUrl ? (
          <Link
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Join Official WhatsApp Group
          </Link>
        ) : (
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25"
          >
            <MessageCircle className="h-4 w-4" />
            Get the WhatsApp group link
          </Link>
        )}
        <Link
          href="/rounds"
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-cyan-500/40 hover:text-white"
        >
          View the rounds
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}
