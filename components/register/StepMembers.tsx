"use client";

import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";
import type { RegistrationFormData } from "@/lib/validations";
import { DEPARTMENTS, YEARS } from "@/lib/validations";
import { GlassCard } from "@/components/ui/Section";
import { TextField, SelectField, getError } from "./Field";

export default function StepMembers() {
  const {
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const members = watch("members");

  const membersError = getError(errors as Record<string, any>, "members");

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-muted">
        Fill in the details of every team member. Each email address can only be used once across
        the hackathon.
      </p>

      {membersError && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-brand-red"
        >
          {membersError}
        </p>
      )}

      {members.map((member, index) => (
        <GlassCard key={member?.memberId ?? index} className="!p-5 sm:!p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green/15 to-brand-green/15 text-brand-green-hover">
              <User className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-semibold text-brand-navy">
              Member {index + 1}
              {index === 0 && <span className="ml-2 text-xs font-normal text-brand-muted">(we suggest starting with yourself)</span>}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name={`members.${index}.name`}
              label="Full Name *"
              placeholder="e.g. Ananya Sharma"
              autoComplete="name"
              maxLength={100}
            />
            <TextField
              name={`members.${index}.email`}
              label="Email *"
              type="email"
              placeholder="name@college.edu"
              autoComplete="email"
            />
            <TextField
              name={`members.${index}.phone`}
              label="Phone *"
              type="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              autoComplete="tel"
              hint="10–15 digits, digits only are counted."
            />
            <TextField
              name={`members.${index}.college`}
              label="College / Institution *"
              placeholder="e.g. ABC Institute of Technology"
              autoComplete="organization"
              maxLength={200}
            />
            <SelectField
              name={`members.${index}.department`}
              label="Department *"
              options={DEPARTMENTS}
            />
            <SelectField name={`members.${index}.year`} label="Year of Study *" options={YEARS} />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
