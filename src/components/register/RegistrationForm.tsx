
import { useEffect, useState } from "react";
import { FormProvider, useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { getMemberCount } from "@/types";
import { GlassCard } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import StepTeam from "./StepTeam";
import StepMembers from "./StepMembers";
import StepReview from "./StepReview";
import SuccessPanel, { type RegistrationResult } from "./SuccessPanel";

const STEPS = [
  { title: "Team", description: "Name & size" },
  { title: "Members", description: "Participant details" },
  { title: "Review", description: "Leader & confirm" },
] as const;

const MEMBER_FIELDS = ["name", "phone", "email", "college", "department", "year"] as const;

/** crypto.randomUUID is unavailable on plain HTTP origins, so keep a fallback. */
function newMemberId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function emptyMember(): RegistrationFormData["members"][number] {
  return {
    memberId: newMemberId(),
    name: "",
    phone: "",
    email: "",
    college: "",
    department: "",
    year: "",
    isLeader: false,
  };
}

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState<string | undefined>(undefined);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [defaults] = useState<RegistrationFormData>(() => ({
    teamName: "",
    teamType: "duo",
    leaderMemberId: "",
    members: Array.from({ length: getMemberCount("duo") }, () => emptyMember()),
  }));

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: defaults,
  });

  const {
    handleSubmit,
    setValue,
    setError,
    trigger,
    watch,
    formState: { isSubmitting },
  } = methods;

  const teamType = watch("teamType");
  const memberCount = getMemberCount(teamType);
  const members = watch("members");

  // Keep the member list in sync with the selected team type.
  useEffect(() => {
    if (!members || members.length === memberCount) return;

    const next = Array.from(
      { length: memberCount },
      (_, index) => members[index] ?? emptyMember()
    );
    setValue("members", next, { shouldDirty: true, shouldValidate: false });

    const leaderStillPresent = next.some((member) => member.memberId === watch("leaderMemberId"));
    if (!leaderStillPresent) setValue("leaderMemberId", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberCount, members?.length, setValue]);

  const nextStep = async () => {
    setServerError(undefined);

    if (step === 0) {
      const ok = await trigger(["teamName", "teamType"]);
      if (ok) setStep(1);
      return;
    }

    if (step === 1) {
      const paths = (members ?? []).flatMap((_, index) =>
        MEMBER_FIELDS.map((field) => `members.${index}.${field}` as Path<RegistrationFormData>)
      );
      const ok = await trigger(paths);
      if (ok) setStep(2);
    }
  };

  const onSubmit = async (values: RegistrationFormData) => {
    setServerError(undefined);
    try {
      const recaptchaToken = await getRecaptchaToken("register");
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });
      const json = await response.json();

      if (json?.success) {
        setResult({
          registrationId: json.registrationId,
          teamName: json.teamName ?? values.teamName,
          memberCount: json.memberCount ?? values.members.length,
          leaderName: json.leaderName ?? "",
          leaderEmail: json.leaderEmail ?? "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (Array.isArray(json?.issues)) {
        let jumpTo = -1;
        for (const issue of json.issues as Array<{ path?: (string | number)[]; message: string }>) {
          const path = (issue.path ?? []).join(".");
          if (!path) continue;
          setError(path as Path<RegistrationFormData>, { type: "server", message: issue.message });
          if (path.startsWith("members")) jumpTo = Math.max(jumpTo, 1);
          else if (path === "leaderMemberId") jumpTo = Math.max(jumpTo, 2);
          else jumpTo = Math.max(jumpTo, 0);
        }
        if (jumpTo >= 0) setStep(jumpTo);
      }

      setServerError(json?.error || "Registration failed. Please review your details and try again.");
    } catch {
      setServerError("Network error — please check your connection and try again.");
    }
  };

  const handlePrimary = async () => {
    if (step < STEPS.length - 1) {
      await nextStep();
      return;
    }

    if (!confirmed) {
      setConfirmError("Please confirm that the details are accurate before submitting.");
      return;
    }
    setConfirmError(undefined);
    await handleSubmit(onSubmit, () => setServerError(undefined))();
  };

  if (result) {
    return <SuccessPanel result={result} />;
  }

  return (
    <FormProvider {...methods}>
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((item, index) => {
          const isActive = index === step;
          const isDone = index < step;
          return (
            <div key={item.title} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                    isDone
                      ? "border-brand-green/60 bg-brand-green-soft text-brand-green-ink"
                      : isActive
                        ? "border-brand-green bg-brand-green text-brand-ink"
                        : "border-brand-navy/15 bg-brand-surface text-brand-muted"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-brand-ink" : "text-brand-muted"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-brand-muted">{item.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  className={cn("h-px w-6 sm:w-12", isDone ? "bg-brand-green/60" : "bg-brand-navy/15")}
                />
              )}
            </div>
          );
        })}
      </div>

      <GlassCard>
        {/* Keying by step replays the slide-in animation on every step change. */}
        <div key={step} className="step-enter">
          {step === 0 && <StepTeam />}

          {step === 1 && <StepMembers />}

          {step === 2 && (
            <StepReview
              confirmed={confirmed}
              onConfirmedChange={(value) => {
                setConfirmed(value);
                setConfirmError(undefined);
              }}
              confirmError={confirmError}
            />
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-brand-red"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-brand-navy/10 pt-6">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0 || isSubmitting}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border-2 border-brand-green bg-white px-5 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-green-soft",
              (step === 0 || isSubmitting) && "cursor-not-allowed opacity-40 hover:border-brand-navy/15"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handlePrimary}
            disabled={isSubmitting}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-2.5 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform",
              isSubmitting ? "cursor-wait opacity-70" : "hover:scale-105"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : step === STEPS.length - 1 ? (
              <>
                Submit registration
                <Send className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </FormProvider>
  );
}
