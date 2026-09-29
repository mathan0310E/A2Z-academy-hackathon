import { cn } from "@/lib/utils";

/**
 * Official A2Z Academy brand lockup, matching the reference site's header:
 * a 44px rounded square mark next to a 28px extrabold wordmark.
 *
 * The source artwork is the same asset the brand site uses (logo.jpeg),
 * pre-cropped and re-encoded as WebP with a PNG fallback — a ~15× smaller
 * payload than the 1254² original.
 */
export default function BrandLogo({
  className,
  wordmarkClassName,
  /** "header" shows the mark; "footer" is the wordmark-only lockup. */
  variant = "header",
}: {
  className?: string;
  wordmarkClassName?: string;
  variant?: "header" | "footer";
}) {
  if (variant === "footer") {
    return (
      <span className={cn("font-display text-lg font-semibold", className)}>
        <span className="font-normal">A2Z</span> Academy
      </span>
    );
  }

  return (
    <span className={cn("flex h-11 items-center gap-2.5", className)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-brand-green/20 bg-white p-0.5">
        <picture>
          <source srcSet="/logo/logo-mark-128.webp" type="image/webp" />
          <img
            src="/logo/logo-mark-128.png"
            alt=""
            width={44}
            height={44}
            aria-hidden="true"
            decoding="async"
            className="h-full w-full rounded-[8px] object-contain"
          />
        </picture>
      </span>
      <span
        className={cn(
          "font-display text-[28px] font-extrabold leading-none tracking-tight text-brand-navy",
          wordmarkClassName
        )}
      >
        A2Z Academy
      </span>
    </span>
  );
}
