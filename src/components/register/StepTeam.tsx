
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
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
          Team Type *
        </span>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Team type">
          {TEAM_TYPE_OPTIONS.map((option) => {
            const selected = teamType === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-none border p-4 transition-all",
                  selected
                    ? "border-brand-green bg-brand-green-soft shadow-brand-sm"
                    : "border-brand-navy/15 bg-brand-surface hover:border-brand-green/40"
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
                      selected ? "text-brand-green-hover" : "text-brand-navy"
                    )}
                  >
                    {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      selected
                        ? "bg-brand-green/20 text-brand-green-hover"
                        : "bg-brand-surface text-brand-muted"
                    )}
                  >
                    {option.members} members
                  </span>
                </div>
                <p className="mt-2 text-xs text-brand-muted">{option.label}</p>
              </label>
            );
          })}
        </div>
        {typeError && (
          <p role="alert" className="mt-2 text-xs text-brand-red">
            {typeError}
          </p>
        )}
      </div>

      <div className="rounded-none border border-slate-200 bg-brand-surface p-4 text-sm text-brand-muted">
        <p>
          You will fill in the details for{" "}
          <span className="font-semibold text-brand-green-hover">
            {teamType ? TEAM_TYPE_OPTIONS.find((o) => o.value === teamType)?.members : 2} members
          </span>{" "}
          in the next step. The member forms appear automatically based on your team type.
        </p>
      </div>
    </div>
  );
}
