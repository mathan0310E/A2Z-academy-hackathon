"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { SectionWrapper, GlassCard } from "@/components/ui/Section";

/**
 * Route-level error boundary. Registration failures are already handled inside
 * the form, so this only catches unexpected rendering/runtime errors.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <SectionWrapper className="pt-16 md:pt-24">
      <div className="mx-auto max-w-2xl">
        <GlassCard className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-amber-400">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-white">Something went wrong</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">
            An unexpected error stopped this page from rendering. Your registration data was not
            affected — please retry, or head back home.
          </p>

          {error.digest && (
            <p className="mt-3 font-mono text-xs text-gray-500">Reference: {error.digest}</p>
          )}

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-cyan-500/40 hover:text-white"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}
