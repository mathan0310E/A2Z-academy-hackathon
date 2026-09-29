"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Home, Loader2, Send } from "lucide-react";
import { SelectField, TextField, TextareaField } from "@/components/ui/FormField";
import { CONTACT_TOPICS, contactSchema, type ContactFormData } from "@/lib/validations";
import { siteConfig } from "@/lib/content";

type ContactResult = {
  referenceId: string;
  acknowledgementSent: boolean;
  organizerNotified: boolean;
};

/**
 * Contact form for the /contact page. The surrounding card is provided by the
 * page, so this component renders bare content only.
 */
export default function ContactForm() {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const methods = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      registrationId: "",
      message: "",
    },
  });

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: ContactFormData) => {
    setServerError(undefined);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await response.json();

      if (json?.success) {
        setResult({
          referenceId: json.referenceId,
          acknowledgementSent: Boolean(json.acknowledgementSent),
          organizerNotified: Boolean(json.organizerNotified),
        });
        reset();
        return;
      }

      if (Array.isArray(json?.issues)) {
        for (const issue of json.issues as Array<{ path?: (string | number)[]; message: string }>) {
          const path = (issue.path ?? []).join(".");
          if (path) setError(path as any, { type: "server", message: issue.message });
        }
      }

      setServerError(json?.error || "We could not send your message. Please try again.");
    } catch {
      setServerError("Network error — please check your connection and try again.");
    }
  };

  if (result) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-soft text-brand-green-hover">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <h4 className="text-xl font-bold text-brand-navy">Message sent</h4>
        <p className="mx-auto mt-2 max-w-lg text-sm text-brand-muted">
          Thanks for reaching out — the A2Z Academy team will reply to your email address. Keep your
          reference below for follow-ups.
        </p>

        <div className="mx-auto mt-5 max-w-sm rounded-xl border border-brand-green/40 bg-brand-green-soft px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Reference</p>
          <p className="font-mono text-lg font-bold tracking-wider text-brand-green-hover">
            {result.referenceId}
          </p>
        </div>

        {!result.acknowledgementSent && (
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-amber-700">
            The confirmation email could not be delivered, but your message is recorded with the
            organisers. If you do not hear back, email {siteConfig.contact.email} directly.
          </p>
        )}

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-green bg-white px-5 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-green-soft"
          >
            Send another message
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-green-hover hover:underline"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="name"
            label="Your name *"
            placeholder="e.g. Ananya Sharma"
            autoComplete="name"
            maxLength={100}
          />
          <TextField
            name="email"
            label="Email *"
            type="email"
            placeholder="name@college.edu"
            autoComplete="email"
            hint="We reply to this address."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="registrationId"
            label="Registration ID (optional)"
            placeholder="AZZ-2026-00001"
            hint="Speeds up team-related queries."
            maxLength={40}
          />
          <SelectField
            name="topic"
            label="Topic *"
            options={CONTACT_TOPICS}
            placeholder="Choose a topic"
          />
        </div>

        <TextareaField
          name="message"
          label="Message *"
          rows={6}
          maxLength={2000}
          placeholder="Tell us what you need help with…"
          hint="20–2000 characters."
        />

        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-brand-red"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="flex flex-col items-start gap-3 border-t border-brand-navy/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-muted">We usually reply within 1–2 working days.</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={
              isSubmitting
                ? "inline-flex cursor-wait items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-2.5 text-sm font-semibold text-brand-ink opacity-70 shadow-brand"
                : "inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-2.5 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send message
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
