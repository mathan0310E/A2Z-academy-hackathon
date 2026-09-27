"use client";

import { useFormContext } from "react-hook-form";
import { TEAM_TYPE_OPTIONS } from "@/types";
import type { RegistrationFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { TextField, getError } from "./Field";

export default function StepTeam() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const teamType = watch("teamType");
  const typeError = getError(errors as Record<string, any>, "teamType");

  return (
    <div className="space-y-6">
      <TextField
        name="teamName"
        label="Team Name *"
        placeholder="e.g. Neon Circuit"
        hint="3–100 characters, unique across all registrations."
        maxLength={100}
      />

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Team Type *
        </span>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Team type">
          {TEAM_TYPE_OPTIONS.map((option) => {
            const selected = teamType === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-all",
                  selected
                    ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : "border-white/[0.1] bg-white/[0.02] hover:border-cyan-500/30"
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register("teamType")}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-base font-bold",
                      selected ? "text-cyan-300" : "text-white"
                    )}
                  >
                    {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      selected
                        ? "bg-cyan-500/20 text-cyan-200"
                        : "bg-white/[0.06] text-gray-400"
                    )}
                  >
                    {option.members} members
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-400">{option.label}</p>
              </label>
            );
          })}
        </div>
        {typeError && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {typeError}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-gray-400">
        <p>
          You will fill in the details for{" "}
          <span className="font-semibold text-cyan-300">
            {teamType ? TEAM_TYPE_OPTIONS.find((o) => o.value === teamType)?.members : 2} members
          </span>{" "}
          in the next step. The member forms appear automatically based on your team type.
        </p>
      </div>
    </div>
  );
}
