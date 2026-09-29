import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import DrawUnderline from "@/components/ui/DrawUnderline";

/**
 * Reusable section wrapper with consistent max-width and padding.
 * Server-component safe.
 */
export function SectionWrapper({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("w-full py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 md:px-6">{children}</div>
    </section>
  );
}

/**
 * Glassmorphism card container.
 */
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl border border-brand-navy/10 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-card sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Static section title (server-component safe).
 */
export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
        {title}
      </h2>
      <DrawUnderline centered={centered} />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-brand-muted sm:mx-auto sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Animated gradient heading text.
 */
export function GradientHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("gradient-text bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
}

