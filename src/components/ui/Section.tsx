import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import DrawUnderline from "@/components/ui/DrawUnderline";

/**
 * Reusable section wrapper with consistent max-width and padding.
 * Padding matches the reference's section rhythm (`py-16 sm:py-20`).
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
    <section id={id} className={cn("w-full py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6">{children}</div>
    </section>
  );
}

/**
 * Card surface. Shape, hairline and hover behaviour come from `.glass-card`,
 * which mirrors the reference's `.opp-card` (`rounded-xl`, #e2e8f0 border,
 * green-tinted border + lift on hover).
 */
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass-card p-6 sm:p-8", className)}>{children}</div>;
}

/**
 * Section title (server-component safe).
 *
 * Each page's primary title must be the document `h1`, so pass `as="h1"` for
 * the first title on a page and leave the default `h2` for the rest — this
 * keeps a single, well-ordered heading outline per route.
 *
 * The reference uses a *light* 300-weight heading for section titles and a
 * bold 800 weight only for the discount banner, so `font-light` here is
 * deliberate rather than an oversight.
 */
export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
  as: Heading = "h2",
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <Heading
        className={cn(
          "font-display font-light leading-snug text-brand-ink",
          Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        )}
      >
        {title}
      </Heading>
      <DrawUnderline centered={centered} />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-brand-muted sm:mx-auto sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
