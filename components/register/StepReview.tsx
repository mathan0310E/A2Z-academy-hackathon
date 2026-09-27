"use client";

import { useFormContext } from "react-hook-form";
import { Crown, Mail, Phone, School, User } from "lucide-react";
import type { RegistrationFormData } from "@/lib/validations";
import { getMemberCount, getTeamTypeLabel } from "@/types";
import { GlassCard } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { getError } from "./Field";

export default function StepReview({
  confirmed,
  onConfirmedChange,
  confirmError,
}: {
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  confirmError?: string;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const teamName = watch("teamName");
  const teamType = watch("teamType");
  const members = watch("members");

  const leaderError = getError(errors as Record<string, any>, "leaderMemberId");

  return (
    <div className="space-y-6">
      {/* Review summary */}
      <GlassCard className="!p-5 sm:!p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">{teamName || "Untitled team"}</h3>
            <p className="text-xs text-gray-500">
              {teamType ? getTeamTypeLabel(teamType) : "No team type selected"} ·{" "}
              {members.length} of {teamType ? getMemberCount(teamType) : 2} members filled
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            Step 3 of 3
          </span>
        </div>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member?.memberId ?? index}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-sm font-semibold text-white">
                  {member?.name || `Member ${index + 1} — name missing`}
                </span>
              </div>
              <div className="mt-2 grid gap-1 text-xs text-gray-400 sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> {member?.email || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {member?.phone || "—"}
                </span>
                <span className="flex items-center gap-1.5 sm:col-span-2">
                  <School className="h-3 w-3" /> {member?.college || "—"} ·{" "}
                  {member?.department || "—"} · {member?.year || "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Leader selection */}
      <div>
        <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Crown className="h-3.5 w-3.5 text-amber-300" />
          Select the Team Leader *
        </span>
        <div
          className="space-y-2"
          role="radiogroup"
          aria-label="Team leader"
          aria-invalid={leaderError ? true : undefined}
        >
          {members.map((member, index) => (
            <label
              key={member?.memberId ?? index}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.1] bg-white/[0.02] px-4 py-3 transition-colors hover:border-cyan-500/30 has-[:checked]:border-cyan-500/50 has-[:checked]:bg-cyan-500/10"
            >
              <input
                type="radio"
                value={member?.memberId ?? ""}
                {...register("leaderMemberId")}
                className="h-4 w-4 accent-cyan-500"
              />
              <span className="text-sm text-gray-200">
                {member?.name || `Member ${index + 1}`}
                <span className="ml-2 text-xs text-gray-500">{member?.email}</span>
              </span>
            </label>
          ))}
        </div>
        {leaderError && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {leaderError}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          The leader receives the confirmation email and is the single point of contact with the
          organisers.
        </p>
      </div>

      {/* Confirmation */}
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm text-gray-300",
          confirmError ? "border-red-500/40 bg-red-500/5" : "border-white/[0.1] bg-white/[0.02]"
        )}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => onConfirmedChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-cyan-500"
        />
        <span>
          I confirm that all the information above is accurate and that I have read the{" "}
          <a href="/guidelines" className="text-cyan-300 hover:underline">
            guidelines
          </a>
          .
        </span>
      </label>
      {confirmError && (
        <p role="alert" className="text-xs text-red-400">
          {confirmError}
        </p>
      )}
    </div>
  );
}
